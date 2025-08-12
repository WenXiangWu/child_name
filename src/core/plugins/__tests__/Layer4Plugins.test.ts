/**
 * Layer 4 插件测试 - 组合计算层插件测试
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { 
  SancaiPlugin,
  YijingPlugin,
  DayanPlugin,
  WuxingBalancePlugin
} from '../implementations/layer4/index';
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

describe('Layer 4 Plugins - 组合计算层插件', () => {
  let mockDataLoader: jest.Mocked<QimingDataLoader>;
  let mockContext: jest.Mocked<PluginContext>;
  let mockConfig: PluginConfig;
  let standardInput: StandardInput;

  beforeEach(() => {
    // Mock DataLoader
    mockDataLoader = {
      getInstance: jest.fn(),
      preloadCoreData: jest.fn().mockResolvedValue(undefined)
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
        characters: ['明', '德'],
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

  describe('SancaiPlugin - 三才五格插件', () => {
    let sancaiPlugin: SancaiPlugin;

    beforeEach(async () => {
      sancaiPlugin = new SancaiPlugin();
      await sancaiPlugin.initialize(mockConfig, mockContext);
      
      // Mock 前置插件结果
      standardInput.context.pluginResults.set('surname', {
        surname: '张',
        strokes: 11,
        confidence: 1.0
      });
      
      standardInput.context.pluginResults.set('stroke', {
        strokeData: [
          { character: '明', strokes: 8 },
          { character: '德', strokes: 15 }
        ],
        confidence: 0.95
      });
    });

    test('应该正确初始化', () => {
      expect(sancaiPlugin.id).toBe('sancai');
      expect(sancaiPlugin.layer).toBe(4);
      expect(sancaiPlugin.dependencies).toHaveLength(2);
      expect(sancaiPlugin.dependencies[0].pluginId).toBe('surname');
      expect(sancaiPlugin.dependencies[1].pluginId).toBe('stroke');
      expect(sancaiPlugin.isAvailable()).toBe(true);
    });

    test('应该正确计算三才五格', async () => {
      const result = await sancaiPlugin.process(standardInput);

      expect(result.pluginId).toBe('sancai');
      expect(result.results.grids).toBeDefined();
      expect(result.results.grids.tiange).toBeDefined();
      expect(result.results.grids.renge).toBeDefined();
      expect(result.results.grids.dige).toBeDefined();
      expect(result.results.grids.waige).toBeDefined();
      expect(result.results.grids.zongge).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    test('应该分析三才关系', async () => {
      const result = await sancaiPlugin.process(standardInput);

      expect(result.results.sancai).toBeDefined();
      expect(result.results.sancai.tian).toBeDefined();
      expect(result.results.sancai.ren).toBeDefined();
      expect(result.results.sancai.di).toBeDefined();
      expect(result.results.sancaiAnalysis).toBeDefined();
      expect(result.results.sancaiAnalysis.combination).toBeDefined();
    });

    test('应该生成格局分析', async () => {
      const result = await sancaiPlugin.process(standardInput);

      expect(result.results.gridAnalyses).toBeDefined();
      expect(result.results.gridAnalyses).toHaveLength(5);
      expect(result.results.overallScore).toBeGreaterThan(0);
      expect(result.results.recommendations).toBeDefined();
    });

    test('应该验证输入数据', () => {
      const validation = sancaiPlugin.validate(standardInput);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe('YijingPlugin - 周易卦象插件', () => {
    let yijingPlugin: YijingPlugin;

    beforeEach(async () => {
      yijingPlugin = new YijingPlugin();
      await yijingPlugin.initialize(mockConfig, mockContext);
      
      // Mock 三才五格结果
      standardInput.context.pluginResults.set('sancai', {
        grids: {
          tiange: 12,
          renge: 19,
          dige: 23,
          waige: 16,
          zongge: 34
        },
        sancai: {
          tian: '木',
          ren: '水',
          di: '火'
        },
        confidence: 0.95
      });
    });

    test('应该正确初始化', () => {
      expect(yijingPlugin.id).toBe('yijing');
      expect(yijingPlugin.layer).toBe(4);
      expect(yijingPlugin.dependencies).toHaveLength(1);
      expect(yijingPlugin.dependencies[0].pluginId).toBe('sancai');
      expect(yijingPlugin.isAvailable()).toBe(true);
    });

    test('应该计算周易卦象', async () => {
      const result = await yijingPlugin.process(standardInput);

      expect(result.pluginId).toBe('yijing');
      expect(result.results.calculation).toBeDefined();
      expect(result.results.calculation.trigrams).toBeDefined();
      expect(result.results.analysis).toBeDefined();
      expect(result.results.analysis.mainHexagram).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    test('应该生成卦象分析', async () => {
      const result = await yijingPlugin.process(standardInput);

      expect(result.results.analysis.interpretation).toBeDefined();
      expect(result.results.analysis.lifeGuidance).toBeDefined();
      expect(result.results.analysis.favorableElements).toBeDefined();
      expect(result.results.recommendations).toBeDefined();
    });

    test('应该处理变爻', async () => {
      const result = await yijingPlugin.process(standardInput);

      expect(result.results.analysis.changingLines).toBeDefined();
      expect(result.results.analysis.changingLines.positions).toBeDefined();
      expect(result.results.analysis.changingLines.meanings).toBeDefined();
    });
  });

  describe('DayanPlugin - 大衍数插件', () => {
    let dayanPlugin: DayanPlugin;

    beforeEach(async () => {
      dayanPlugin = new DayanPlugin();
      await dayanPlugin.initialize(mockConfig, mockContext);
      
      // Mock 前置插件结果
      standardInput.context.pluginResults.set('sancai', {
        grids: {
          tiange: 12,
          renge: 19,
          dige: 23,
          waige: 16,
          zongge: 34
        },
        confidence: 0.95
      });
      
      standardInput.context.pluginResults.set('gender', {
        gender: 'male',
        confidence: 1.0
      });
    });

    test('应该正确初始化', () => {
      expect(dayanPlugin.id).toBe('dayan');
      expect(dayanPlugin.layer).toBe(4);
      expect(dayanPlugin.dependencies).toHaveLength(2);
      expect(dayanPlugin.dependencies[0].pluginId).toBe('sancai');
      expect(dayanPlugin.dependencies[1].pluginId).toBe('gender');
      expect(dayanPlugin.isAvailable()).toBe(true);
    });

    test('应该分析大衍数理', async () => {
      const result = await dayanPlugin.process(standardInput);

      expect(result.pluginId).toBe('dayan');
      expect(result.results.calculation).toBeDefined();
      expect(result.results.primaryAnalysis).toBeDefined();
      expect(result.results.secondaryAnalyses).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    test('应该评估性别兼容性', async () => {
      const result = await dayanPlugin.process(standardInput);

      expect(result.results.genderCompatibility).toBeDefined();
      expect(result.results.genderCompatibility.gender).toBe('male');
      expect(result.results.genderCompatibility.compatibility).toBeGreaterThan(0);
      expect(result.results.genderCompatibility.reasons).toBeDefined();
    });

    test('应该生成总体评估', async () => {
      const result = await dayanPlugin.process(standardInput);

      expect(result.results.overallAssessment).toBeDefined();
      expect(result.results.overallAssessment.score).toBeGreaterThan(0);
      expect(result.results.overallAssessment.category).toBeDefined();
      expect(result.results.recommendations).toBeDefined();
    });
  });

  describe('WuxingBalancePlugin - 五行平衡插件', () => {
    let wuxingBalancePlugin: WuxingBalancePlugin;

    beforeEach(async () => {
      wuxingBalancePlugin = new WuxingBalancePlugin();
      await wuxingBalancePlugin.initialize(mockConfig, mockContext);
      
      // Mock 前置插件结果
      standardInput.context.pluginResults.set('surname', {
        surname: '张',
        wuxing: '火',
        confidence: 1.0
      });
      
      standardInput.context.pluginResults.set('wuxing-char', {
        characterWuxing: [
          { character: '明', primaryWuxing: '火', secondaryWuxing: '水' },
          { character: '德', primaryWuxing: '木', secondaryWuxing: null }
        ],
        confidence: 0.9
      });
      
      // Mock 喜用神结果（可选）
      standardInput.context.pluginResults.set('xiyongshen', {
        favorableElements: ['木', '水'],
        unfavorableElements: ['金'],
        confidence: 0.8
      });
    });

    test('应该正确初始化', () => {
      expect(wuxingBalancePlugin.id).toBe('wuxing-balance');
      expect(wuxingBalancePlugin.layer).toBe(4);
      expect(wuxingBalancePlugin.dependencies).toHaveLength(3);
      expect(wuxingBalancePlugin.dependencies[0].pluginId).toBe('surname');
      expect(wuxingBalancePlugin.dependencies[1].pluginId).toBe('wuxing-char');
      expect(wuxingBalancePlugin.dependencies[2].pluginId).toBe('xiyongshen');
      expect(wuxingBalancePlugin.isAvailable()).toBe(true);
    });

    test('应该分析五行平衡', async () => {
      const result = await wuxingBalancePlugin.process(standardInput);

      expect(result.pluginId).toBe('wuxing-balance');
      expect(result.results.elements).toBeDefined();
      expect(result.results.balance).toBeDefined();
      expect(result.results.balance.distribution).toBeDefined();
      expect(result.results.balance.balanceScore).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    test('应该分析五行流转', async () => {
      const result = await wuxingBalancePlugin.process(standardInput);

      expect(result.results.flow).toBeDefined();
      expect(result.results.flow.shengChain).toBeDefined();
      expect(result.results.flow.keChain).toBeDefined();
      expect(result.results.flow.flowScore).toBeGreaterThan(0);
    });

    test('应该检测五行冲突', async () => {
      const result = await wuxingBalancePlugin.process(standardInput);

      expect(result.results.conflicts).toBeDefined();
      expect(result.results.conflicts.severity).toBeDefined();
      expect(result.results.conflicts.solutions).toBeDefined();
    });

    test('应该确定平衡策略', async () => {
      const result = await wuxingBalancePlugin.process(standardInput);

      expect(result.results.strategy).toBeDefined();
      expect(result.results.strategy.type).toBeDefined();
      expect(result.results.strategy.targetElements).toBeDefined();
      expect(result.results.optimization).toBeDefined();
    });

    test('应该使用喜用神策略', async () => {
      const result = await wuxingBalancePlugin.process(standardInput);

      expect(result.results.strategy.type).toBe('xiyong-based');
      expect(result.results.strategy.confidence).toBeGreaterThan(0.7);
      expect(result.results.strategy.targetElements).toContain('木');
      expect(result.results.strategy.targetElements).toContain('水');
    });

    test('应该在缺少喜用神时使用通用策略', async () => {
      // 移除喜用神数据
      standardInput.context.pluginResults.delete('xiyongshen');
      
      const result = await wuxingBalancePlugin.process(standardInput);

      expect(result.results.strategy.type).toMatch(/generic-balance|missing-supplement/);
      expect(result.results.strategy.confidence).toBeLessThan(0.8);
    });
  });

  describe('插件健康状态检查', () => {
    test('所有Layer 4插件应该报告健康状态', async () => {
      const plugins = [
        new SancaiPlugin(),
        new YijingPlugin(),
        new DayanPlugin(),
        new WuxingBalancePlugin()
      ];

      for (const plugin of plugins) {
        await plugin.initialize(mockConfig, mockContext);
        const health = plugin.getHealthStatus();
        
        expect(health.status).toBeDefined();
        expect(health.message).toBeDefined();
        expect(health.lastCheck).toBeGreaterThan(0);
        expect(health.details).toBeDefined();
      }
    });
  });

  describe('插件依赖关系测试', () => {
    test('SancaiPlugin应该依赖surname和stroke', async () => {
      const sancaiPlugin = new SancaiPlugin();
      await sancaiPlugin.initialize(mockConfig, mockContext);

      // 缺少surname数据
      const inputWithoutSurname = { ...standardInput };
      inputWithoutSurname.context.pluginResults.delete('surname');
      
      const validation = sancaiPlugin.validate(inputWithoutSurname);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('缺少姓氏信息，请确保姓氏插件已执行');
    });

    test('YijingPlugin应该依赖sancai', async () => {
      const yijingPlugin = new YijingPlugin();
      await yijingPlugin.initialize(mockConfig, mockContext);

      const validation = yijingPlugin.validate(standardInput);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('缺少三才五格数据，请确保三才五格插件已执行');
    });

    test('DayanPlugin应该依赖sancai和gender', async () => {
      const dayanPlugin = new DayanPlugin();
      await dayanPlugin.initialize(mockConfig, mockContext);

      const validation = dayanPlugin.validate(standardInput);
      expect(validation.valid).toBe(false);
    });

    test('WuxingBalancePlugin应该依赖surname和wuxing-char', async () => {
      const wuxingBalancePlugin = new WuxingBalancePlugin();
      await wuxingBalancePlugin.initialize(mockConfig, mockContext);

      const validation = wuxingBalancePlugin.validate(standardInput);
      expect(validation.valid).toBe(false);
    });
  });

  describe('插件错误处理', () => {
    test('应该正确处理数据加载失败', async () => {
      mockDataLoader.preloadCoreData.mockRejectedValue(new Error('数据加载失败'));
      
      const sancaiPlugin = new SancaiPlugin();
      
      await expect(sancaiPlugin.initialize(mockConfig, mockContext)).rejects.toThrow('数据加载失败');
    });

    test('应该处理无效的输入数据', async () => {
      const sancaiPlugin = new SancaiPlugin();
      await sancaiPlugin.initialize(mockConfig, mockContext);
      
      // Mock 前置插件结果
      standardInput.context.pluginResults.set('surname', {
        surname: '张',
        strokes: 11,
        confidence: 1.0
      });
      
      standardInput.context.pluginResults.set('stroke', {
        strokeData: [
          { character: '明', strokes: 8 },
          { character: '德', strokes: 15 }
        ],
        confidence: 0.95
      });

      // 测试空字符数据
      const invalidInput = {
        ...standardInput,
        data: { ...standardInput.data, characters: [] }
      };

      await expect(sancaiPlugin.process(invalidInput)).rejects.toThrow('缺少字符数据');
    });
  });

  describe('插件性能测试', () => {
    test('Layer 4插件应该在合理时间内完成处理', async () => {
      const plugins = [
        new SancaiPlugin(),
        new YijingPlugin(), 
        new DayanPlugin(),
        new WuxingBalancePlugin()
      ];

      // 设置必要的前置数据
      standardInput.context.pluginResults.set('surname', {
        surname: '张',
        strokes: 11,
        wuxing: '火',
        confidence: 1.0
      });
      
      standardInput.context.pluginResults.set('stroke', {
        strokeData: [
          { character: '明', strokes: 8 },
          { character: '德', strokes: 15 }
        ],
        confidence: 0.95
      });

      standardInput.context.pluginResults.set('sancai', {
        grids: {
          tiange: 12,
          renge: 19,
          dige: 23,
          waige: 16,
          zongge: 34
        },
        sancai: {
          tian: '木',
          ren: '水',
          di: '火'
        },
        confidence: 0.95
      });

      standardInput.context.pluginResults.set('gender', {
        gender: 'male',
        confidence: 1.0
      });

      standardInput.context.pluginResults.set('wuxing-char', {
        characterWuxing: [
          { character: '明', primaryWuxing: '火' },
          { character: '德', primaryWuxing: '木' }
        ],
        confidence: 0.9
      });

      for (const plugin of plugins) {
        await plugin.initialize(mockConfig, mockContext);
        
        const startTime = Date.now();
        await plugin.process(standardInput);
        const processingTime = Date.now() - startTime;
        
        // 插件处理时间应该在合理范围内（<1000ms）
        expect(processingTime).toBeLessThan(1000);
      }
    });
  });
});
