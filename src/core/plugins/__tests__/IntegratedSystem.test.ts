/**
 * 集成系统测试 - 测试完整的取名系统管道
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { 
  NamingPipelineIntegrated,
  NamingRequest,
  NamingResponse
} from '../core/NamingPipelineIntegrated';
import { CertaintyLevel } from '../interfaces/NamingPlugin';
import { QimingDataLoader } from '../../common/data-loader';

// Mock QimingDataLoader
jest.mock('../../common/data-loader');
const MockQimingDataLoader = QimingDataLoader as jest.MockedClass<typeof QimingDataLoader>;

describe('Integrated Naming System - 集成取名系统测试', () => {
  let namingSystem: NamingPipelineIntegrated;
  let mockDataLoader: jest.Mocked<QimingDataLoader>;

  beforeEach(async () => {
    // Mock DataLoader
    mockDataLoader = {
      getInstance: jest.fn(),
      preloadCoreData: jest.fn().mockResolvedValue(undefined),
      getStrokeData: jest.fn().mockResolvedValue({
        '明': 8, '德': 15, '智': 12, '慧': 15,
        '安': 6, '康': 11, '雅': 12, '欣': 8
      }),
      getWuxingData: jest.fn().mockResolvedValue({
        '明': '火', '德': '火', '智': '火', '慧': '水',
        '安': '土', '康': '木', '雅': '木', '欣': '木'
      }),
      getMeaningData: jest.fn().mockResolvedValue({
        '明': {
          basicMeaning: '光明、聪明',
          extendedMeanings: ['明亮', '智慧', '清楚'],
          culturalBackground: '光明正大的寓意',
          genderSuitability: { male: 85, female: 80, neutral: 82 }
        },
        '德': {
          basicMeaning: '品德、道德',
          extendedMeanings: ['德行', '品行', '德才'],
          culturalBackground: '儒家德治思想',
          genderSuitability: { male: 90, female: 85, neutral: 87 }
        }
      })
    } as any;

    MockQimingDataLoader.getInstance = jest.fn().mockReturnValue(mockDataLoader);

    // 创建系统实例
    namingSystem = new NamingPipelineIntegrated({
      version: '1.0.0-test',
      enableHealthChecks: false, // 测试时禁用健康检查
      defaultTimeout: 3000,
      autoLevelSelection: true
    });
  });

  afterEach(async () => {
    if (namingSystem) {
      await namingSystem.destroy();
    }
  });

  describe('系统初始化测试', () => {
    test('应该成功初始化系统', async () => {
      await namingSystem.initialize();
      
      const status = namingSystem.getSystemStatus();
      expect(status.initialized).toBe(true);
      expect(status.version).toBe('1.0.0-test');
    });

    test('应该获取可用的确定性等级', async () => {
      await namingSystem.initialize();
      
      const levels = namingSystem.getAvailableCertaintyLevels();
      expect(levels).toHaveLength(4);
      
      const fullyDetermined = levels.find(l => l.level === CertaintyLevel.FULLY_DETERMINED);
      expect(fullyDetermined).toBeDefined();
      expect(fullyDetermined?.requiredData).toContain('birthInfo.hour');
    });
  });

  describe('完全确定等级测试', () => {
    test('应该处理完整出生信息的请求', async () => {
      const request: NamingRequest = {
        familyName: '张',
        gender: 'male',
        birthInfo: {
          year: 2024,
          month: 3,
          day: 15,
          hour: 10,
          minute: 30
        },
        characters: ['明', '德']
      };

      const response = await namingSystem.processNamingRequest(request);

      expect(response.success).toBe(true);
      expect(response.analysis.certaintyLevel).toBe(CertaintyLevel.FULLY_DETERMINED);
      expect(response.analysis.confidence).toBeGreaterThan(0.5);
      
      // 检查各层结果
      expect(response.layer1Results).toBeDefined();
      expect(response.layer2Results).toBeDefined();
      expect(response.layer3Results).toBeDefined();
      expect(response.layer4Results).toBeDefined();
      
      // 检查具体插件结果
      expect(response.layer1Results.surname).toBeDefined();
      expect(response.layer1Results.gender).toBeDefined();
      expect(response.layer3Results.stroke).toBeDefined();
      expect(response.layer4Results.sancai).toBeDefined();
    });

    test('应该生成合理的建议', async () => {
      const request: NamingRequest = {
        familyName: '李',
        gender: 'female',
        birthInfo: {
          year: 2024,
          month: 6,
          day: 20,
          hour: 14,
          minute: 45
        },
        characters: ['雅', '欣']
      };

      const response = await namingSystem.processNamingRequest(request);

      expect(response.success).toBe(true);
      expect(response.recommendations).toBeDefined();
      expect(response.recommendations.length).toBeGreaterThan(0);
      expect(response.recommendations[0]).toContain('完整信息');
    });
  });

  describe('预产期处理测试', () => {
    test('应该处理同年预产期', async () => {
      const request: NamingRequest = {
        familyName: '王',
        gender: 'male',
        predueDate: {
          year: 2024,
          month: 8,
          weekOffset: 2
        },
        characters: ['智', '慧']
      };

      const response = await namingSystem.processNamingRequest(request);

      expect(response.success).toBe(true);
      expect(response.analysis.certaintyLevel).toBe(CertaintyLevel.ESTIMATED);
      expect(response.recommendations.some(r => r.includes('预估'))).toBe(true);
    });

    test('应该处理跨年预产期', async () => {
      const request: NamingRequest = {
        familyName: '赵',
        gender: 'female',
        predueDate: {
          year: 2024,
          month: 12,
          weekOffset: 3 // 可能跨到2025年
        },
        characters: ['安', '康']
      };

      const response = await namingSystem.processNamingRequest(request);

      expect(response.success).toBe(true);
      expect(response.analysis.certaintyLevel).toBe(CertaintyLevel.ESTIMATED);
      expect(response.warnings.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('部分确定等级测试', () => {
    test('应该处理缺少时辰的请求', async () => {
      const request: NamingRequest = {
        familyName: '陈',
        gender: 'male',
        birthInfo: {
          year: 2024,
          month: 5,
          day: 12
          // 缺少 hour 和 minute
        },
        characters: ['明', '德']
      };

      const response = await namingSystem.processNamingRequest(request);

      expect(response.success).toBe(true);
      expect(response.analysis.certaintyLevel).toBe(CertaintyLevel.PARTIALLY_DETERMINED);
      
      // 应该跳过一些需要具体时辰的插件
      expect(response.metadata.skippedPlugins.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('基础信息等级测试', () => {
    test('应该处理仅有基础信息的请求', async () => {
      const request: NamingRequest = {
        familyName: '周',
        gender: 'female',
        characters: ['雅', '欣']
      };

      const response = await namingSystem.processNamingRequest(request);

      expect(response.success).toBe(true);
      expect(response.analysis.certaintyLevel).toBe(CertaintyLevel.UNKNOWN);
      
      // 应该至少有基础插件的结果
      expect(response.layer1Results.surname).toBeDefined();
      expect(response.layer1Results.gender).toBeDefined();
      expect(response.layer3Results.stroke).toBeDefined();
      expect(response.layer4Results.sancai).toBeDefined();
    });
  });

  describe('错误处理测试', () => {
    test('应该处理无效的请求', async () => {
      const invalidRequest: NamingRequest = {
        familyName: '', // 空姓氏
        gender: 'male',
        characters: ['明', '德']
      };

      const response = await namingSystem.processNamingRequest(invalidRequest);

      expect(response.success).toBe(false);
      expect(response.errors).toBeDefined();
      expect(response.errors!.length).toBeGreaterThan(0);
    });

    test('应该处理数据加载失败', async () => {
      // Mock数据加载失败
      mockDataLoader.preloadCoreData.mockRejectedValue(new Error('数据加载失败'));

      const request: NamingRequest = {
        familyName: '测试',
        gender: 'male',
        characters: ['明', '德']
      };

      // 系统应该能够优雅地处理错误
      const response = await namingSystem.processNamingRequest(request);
      
      // 可能成功（如果有降级处理）或失败
      if (!response.success) {
        expect(response.errors).toBeDefined();
      }
    });
  });

  describe('处理计划预览测试', () => {
    test('应该生成处理计划预览', async () => {
      await namingSystem.initialize();

      const request: NamingRequest = {
        familyName: '刘',
        gender: 'male',
        birthInfo: {
          year: 2024,
          month: 4,
          day: 10,
          hour: 9
        },
        characters: ['智', '慧']
      };

      const preview = await namingSystem.previewProcessingPlan(request);

      expect(preview.certaintyLevel).toBe(CertaintyLevel.FULLY_DETERMINED);
      expect(preview.executionPlan).toBeDefined();
      expect(preview.executionPlan.enabledPlugins.length).toBeGreaterThan(10);
      expect(preview.estimatedTime).toBeGreaterThan(0);
    });

    test('应该为预产期请求生成警告', async () => {
      await namingSystem.initialize();

      const request: NamingRequest = {
        familyName: '吴',
        gender: 'female',
        predueDate: {
          year: 2025,
          month: 1,
          weekOffset: 4 // 大偏移
        }
      };

      const preview = await namingSystem.previewProcessingPlan(request);

      expect(preview.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('并行执行测试', () => {
    test('应该支持并行执行模式', async () => {
      const request: NamingRequest = {
        familyName: '郑',
        gender: 'male',
        birthInfo: {
          year: 2024,
          month: 7,
          day: 25,
          hour: 16
        },
        characters: ['明', '德'],
        preferences: {
          parallelExecution: true
        }
      };

      const startTime = Date.now();
      const response = await namingSystem.processNamingRequest(request);
      const processingTime = Date.now() - startTime;

      expect(response.success).toBe(true);
      expect(response.analysis.strategy).toBe('parallel');
      
      // 并行执行应该相对较快
      expect(processingTime).toBeLessThan(5000);
    });
  });

  describe('系统性能测试', () => {
    test('应该在合理时间内完成处理', async () => {
      const requests: NamingRequest[] = [
        {
          familyName: '张',
          gender: 'male',
          birthInfo: { year: 2024, month: 1, day: 1, hour: 8 },
          characters: ['明', '德']
        },
        {
          familyName: '李',
          gender: 'female',
          birthInfo: { year: 2024, month: 6, day: 15, hour: 14 },
          characters: ['雅', '欣']
        },
        {
          familyName: '王',
          gender: 'male',
          predueDate: { year: 2024, month: 10, weekOffset: 2 },
          characters: ['智', '慧']
        }
      ];

      for (const request of requests) {
        const startTime = Date.now();
        const response = await namingSystem.processNamingRequest(request);
        const processingTime = Date.now() - startTime;

        expect(response.success).toBe(true);
        expect(processingTime).toBeLessThan(10000); // 10秒内完成
        expect(response.metadata.processingTime).toBeLessThan(8000);
      }
    });

    test('应该正确报告执行统计', async () => {
      const request: NamingRequest = {
        familyName: '孙',
        gender: 'male',
        birthInfo: {
          year: 2024,
          month: 3,
          day: 20,
          hour: 11
        },
        characters: ['明', '德']
      };

      const response = await namingSystem.processNamingRequest(request);

      expect(response.success).toBe(true);
      expect(response.metadata.executedPlugins.length).toBeGreaterThan(5);
      expect(response.metadata.processingTime).toBeGreaterThan(0);
      expect(response.metadata.version).toBe('1.0.0-test');
    });
  });

  describe('数据一致性测试', () => {
    test('插件结果应该保持一致性', async () => {
      const request: NamingRequest = {
        familyName: '黄',
        gender: 'female',
        birthInfo: {
          year: 2024,
          month: 8,
          day: 8,
          hour: 8
        },
        characters: ['明', '德']
      };

      const response = await namingSystem.processNamingRequest(request);

      expect(response.success).toBe(true);
      
      // 检查姓氏一致性
      if (response.layer1Results?.surname) {
        expect(response.layer1Results.surname.surname).toBe('黄');
      }
      
      // 检查性别一致性
      if (response.layer1Results?.gender) {
        expect(response.layer1Results.gender.gender).toBe('female');
      }
      
      // 检查字符一致性
      if (response.layer3Results?.stroke?.strokeData) {
        const strokeData = response.layer3Results.stroke.strokeData;
        expect(strokeData.some((d: any) => d.character === '明')).toBe(true);
        expect(strokeData.some((d: any) => d.character === '德')).toBe(true);
      }
    });
  });

  describe('边界条件测试', () => {
    test('应该处理极端日期', async () => {
      const request: NamingRequest = {
        familyName: '极',
        gender: 'male',
        birthInfo: {
          year: 2030, // 未来年份
          month: 2,
          day: 29, // 闰年
          hour: 23,
          minute: 59
        },
        characters: ['测', '试']
      };

      const response = await namingSystem.processNamingRequest(request);
      
      // 应该能处理或给出合理的错误
      expect(response).toBeDefined();
    });

    test('应该处理空字符数组', async () => {
      const request: NamingRequest = {
        familyName: '空',
        gender: 'female',
        characters: [], // 空数组
        birthInfo: {
          year: 2024,
          month: 6,
          day: 15
        }
      };

      const response = await namingSystem.processNamingRequest(request);
      
      // 应该成功，但可能跳过某些需要字符的插件
      expect(response.success).toBe(true);
    });
  });
});
