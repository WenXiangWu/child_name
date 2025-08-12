/**
 * Layer 3 插件测试 - 字符评估层插件测试
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { 
  StrokePlugin, 
  WuxingCharPlugin, 
  ZodiacCharPlugin, 
  MeaningPlugin, 
  PhoneticPlugin 
} from '../implementations/layer3/index';
import { 
  StandardInput, 
  PluginContext, 
  PluginConfig, 
  CertaintyLevel 
} from '../interfaces/NamingPlugin';
import { QimingDataLoader } from '../../common/data-loader';

// Mock QimingDataLoader
jest.mock('../../common/data-loader');
const MockQimingDataLoader = QimingDataLoader as jest.MockedClass<typeof QimingDataLoader>;

describe('Layer 3 Plugins - 字符评估层插件', () => {
  let mockDataLoader: jest.Mocked<QimingDataLoader>;
  let mockContext: jest.Mocked<PluginContext>;
  let mockConfig: PluginConfig;
  let standardInput: StandardInput;

  beforeEach(() => {
    // Mock DataLoader
    mockDataLoader = {
      getInstance: jest.fn(),
      preloadCoreData: jest.fn().mockResolvedValue(undefined),
      getStrokeData: jest.fn().mockResolvedValue({
        '安': 6, '康': 11, '明': 8, '智': 12, '慧': 15,
        '德': 15, '贤': 15, '美': 9, '雅': 12, '福': 13
      }),
      getWuxingData: jest.fn().mockResolvedValue({
        '安': '土', '康': '木', '明': '火', '智': '火', '慧': '水',
        '德': '火', '贤': '木', '美': '水', '雅': '木', '福': '水'
      }),
      getMeaningData: jest.fn().mockResolvedValue({
        '安': {
          basicMeaning: '安全、平安',
          extendedMeanings: ['安定', '安宁', '安心'],
          culturalBackground: '传统吉祥寓意',
          symbolism: ['平安', '稳定'],
          emotionalTone: 'positive',
          modernRelevance: 90,
          genderSuitability: { male: 80, female: 85, neutral: 85 }
        }
      })
    } as any;

    MockQimingDataLoader.getInstance = jest.fn().mockReturnValue(mockDataLoader);

    // Mock Context
    mockContext = {
      requestId: 'test-request-123',
      getPluginResult: jest.fn(),
      setPluginResult: jest.fn(),
      getConfig: jest.fn(),
      log: jest.fn()
    };

    // Mock Config
    mockConfig = {
      enabled: true,
      priority: 1,
      timeout: 5000,
      retryCount: 3,
      customSettings: {}
    };

    // Standard Input
    standardInput = {
      requestId: 'test-request-123',
      certaintyLevel: CertaintyLevel.FULLY_DETERMINED,
      data: {
        familyName: '张',
        gender: 'male',
        characters: ['安', '康'],
        birthInfo: {
          year: 2024,
          month: 3,
          day: 15,
          hour: 10,
          minute: 30
        }
      },
      context: {
        requestId: 'test-request-123',
        startTime: Date.now(),
        certaintyLevel: CertaintyLevel.FULLY_DETERMINED,
        pluginResults: new Map(),
        errors: [],
        warnings: []
      }
    };
  });

  describe('StrokePlugin - 笔画计算插件', () => {
    let strokePlugin: StrokePlugin;

    beforeEach(async () => {
      strokePlugin = new StrokePlugin();
      await strokePlugin.initialize(mockConfig, mockContext);
    });

    test('应该正确初始化', () => {
      expect(strokePlugin.id).toBe('stroke');
      expect(strokePlugin.layer).toBe(3);
      expect(strokePlugin.dependencies).toEqual([]);
      expect(strokePlugin.isAvailable()).toBe(true);
    });

    test('应该正确计算字符笔画', async () => {
      const result = await strokePlugin.process(standardInput);

      expect(result.pluginId).toBe('stroke');
      expect(result.results.strokeData).toHaveLength(2);
      expect(result.results.strokeData[0].character).toBe('安');
      expect(result.results.strokeData[0].strokes).toBe(6);
      expect(result.results.strokeData[1].character).toBe('康');
      expect(result.results.strokeData[1].strokes).toBe(11);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    test('应该生成笔画组合分析', async () => {
      const result = await strokePlugin.process(standardInput);

      expect(result.results.combinations).toBeDefined();
      expect(result.results.combinations).toHaveLength(1);
      expect(result.results.combinations[0].combination).toEqual([6, 11]);
      expect(result.results.combinations[0].description).toContain('6画 + 11画');
    });

    test('应该验证输入数据', () => {
      const validation = strokePlugin.validate(standardInput);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('应该正确处理无效输入', () => {
      const invalidInput = {
        ...standardInput,
        data: { ...standardInput.data, characters: undefined }
      };
      const validation = strokePlugin.validate(invalidInput);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('缺少字符数据');
    });
  });

  describe('WuxingCharPlugin - 字符五行插件', () => {
    let wuxingPlugin: WuxingCharPlugin;

    beforeEach(async () => {
      wuxingPlugin = new WuxingCharPlugin();
      await wuxingPlugin.initialize(mockConfig, mockContext);
    });

    test('应该正确初始化', () => {
      expect(wuxingPlugin.id).toBe('wuxing-char');
      expect(wuxingPlugin.layer).toBe(3);
      expect(wuxingPlugin.dependencies).toEqual([]);
    });

    test('应该正确分析字符五行', async () => {
      const result = await wuxingPlugin.process(standardInput);

      expect(result.pluginId).toBe('wuxing-char');
      expect(result.results.characterWuxing).toHaveLength(2);
      expect(result.results.characterWuxing[0].character).toBe('安');
      expect(result.results.characterWuxing[0].primaryWuxing).toBe('土');
      expect(result.results.characterWuxing[1].character).toBe('康');
      expect(result.results.characterWuxing[1].primaryWuxing).toBe('木');
    });

    test('应该分析五行组合关系', async () => {
      const result = await wuxingPlugin.process(standardInput);

      expect(result.results.combinations).toBeDefined();
      expect(result.results.combinations).toHaveLength(1);
      expect(result.results.combinations[0].elements).toEqual(['土', '木']);
      expect(result.results.combinations[0].relationship).toBeDefined();
    });
  });

  describe('ZodiacCharPlugin - 生肖用字插件', () => {
    let zodiacCharPlugin: ZodiacCharPlugin;

    beforeEach(async () => {
      zodiacCharPlugin = new ZodiacCharPlugin();
      await zodiacCharPlugin.initialize(mockConfig, mockContext);
      
      // Mock zodiac plugin result
      standardInput.context.pluginResults.set('zodiac', {
        primaryZodiac: '龙',
        zodiac: '龙',
        confidence: 0.9,
        strategy: 'single-zodiac'
      });
    });

    test('应该正确初始化', () => {
      expect(zodiacCharPlugin.id).toBe('zodiac-char');
      expect(zodiacCharPlugin.layer).toBe(3);
      expect(zodiacCharPlugin.dependencies).toHaveLength(1);
      expect(zodiacCharPlugin.dependencies[0].pluginId).toBe('zodiac');
    });

    test('应该正确分析生肖用字适宜性', async () => {
      const result = await zodiacCharPlugin.process(standardInput);

      expect(result.pluginId).toBe('zodiac-char');
      expect(result.results.type).toBe('single-zodiac');
      expect(result.results.zodiac).toBe('龙');
      expect(result.results.evaluations).toHaveLength(2);
    });
  });

  describe('MeaningPlugin - 字义寓意插件', () => {
    let meaningPlugin: MeaningPlugin;

    beforeEach(async () => {
      meaningPlugin = new MeaningPlugin();
      await meaningPlugin.initialize(mockConfig, mockContext);
      
      // Mock gender plugin result
      standardInput.context.pluginResults.set('gender', {
        gender: 'male',
        confidence: 1.0
      });
    });

    test('应该正确初始化', () => {
      expect(meaningPlugin.id).toBe('meaning');
      expect(meaningPlugin.layer).toBe(3);
      expect(meaningPlugin.dependencies).toHaveLength(1);
      expect(meaningPlugin.dependencies[0].pluginId).toBe('gender');
    });

    test('应该正确分析字义寓意', async () => {
      const result = await meaningPlugin.process(standardInput);

      expect(result.pluginId).toBe('meaning');
      expect(result.results.characterMeanings).toHaveLength(2);
      expect(result.results.characterMeanings[0].character).toBe('安');
    });
  });

  describe('PhoneticPlugin - 音韵美感插件', () => {
    let phoneticPlugin: PhoneticPlugin;

    beforeEach(async () => {
      phoneticPlugin = new PhoneticPlugin();
      await phoneticPlugin.initialize(mockConfig, mockContext);
      
      // Mock surname plugin result
      standardInput.context.pluginResults.set('surname', {
        surname: '张',
        strokes: 11,
        confidence: 1.0
      });
    });

    test('应该正确初始化', () => {
      expect(phoneticPlugin.id).toBe('phonetic');
      expect(phoneticPlugin.layer).toBe(3);
      expect(phoneticPlugin.dependencies).toHaveLength(1);
      expect(phoneticPlugin.dependencies[0].pluginId).toBe('surname');
    });

    test('应该正确分析音韵特征', async () => {
      const result = await phoneticPlugin.process(standardInput);

      expect(result.pluginId).toBe('phonetic');
      expect(result.results.phoneticData).toHaveLength(2);
      expect(result.results.phoneticData[0].character).toBe('安');
    });
  });

  describe('插件健康状态检查', () => {
    test('所有插件应该报告健康状态', async () => {
      const plugins = [
        new StrokePlugin(),
        new WuxingCharPlugin(),
        new ZodiacCharPlugin(),
        new MeaningPlugin(),
        new PhoneticPlugin()
      ];

      for (const plugin of plugins) {
        await plugin.initialize(mockConfig, mockContext);
        const health = plugin.getHealthStatus();
        
        expect(health.status).toBeDefined();
        expect(health.message).toBeDefined();
        expect(health.lastCheck).toBeGreaterThan(0);
      }
    });
  });

  describe('插件错误处理', () => {
    test('应该正确处理数据加载失败', async () => {
      mockDataLoader.getStrokeData.mockRejectedValue(new Error('数据加载失败'));
      
      const strokePlugin = new StrokePlugin();
      
      // 应该能够初始化并使用备用数据
      await expect(strokePlugin.initialize(mockConfig, mockContext)).resolves.not.toThrow();
      
      const result = await strokePlugin.process(standardInput);
      expect(result.confidence).toBeLessThan(0.8); // 使用备用数据时置信度较低
    });
  });
});
