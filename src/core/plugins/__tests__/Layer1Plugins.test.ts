/**
 * Layer 1 插件测试
 */

import { SurnamePlugin } from '../implementations/layer1/SurnamePlugin';
import { GenderPlugin } from '../implementations/layer1/GenderPlugin';
import { BirthTimePlugin } from '../implementations/layer1/BirthTimePlugin';
import { PluginFactory } from '../implementations/PluginFactory';
import { StandardInput, CertaintyLevel, PluginContext } from '../interfaces/NamingPlugin';

// Mock PluginContext
const createMockContext = (): PluginContext => ({
  requestId: 'test-request',
  getPluginResult: jest.fn(),
  setPluginResult: jest.fn(),
  getConfig: jest.fn(() => ({
    enabled: true,
    priority: 100,
    timeout: 30000,
    retryCount: 3
  })),
  log: jest.fn()
});

// Mock data loader to avoid file dependencies in tests
jest.mock('../../common/data-loader', () => ({
  QimingDataLoader: {
    getInstance: () => ({
      preloadCoreData: jest.fn().mockResolvedValue(true),
      getCommonNameWords: jest.fn().mockResolvedValue(new Set(['字', '名', '好', '美', '智', '慧'])),
      getCharacterInfo: jest.fn().mockResolvedValue({ strokes: '8' })
    })
  }
}));

// Mock sancai calculator
jest.mock('../../calculation/sancai-calculator', () => ({
  SancaiWugeCalculator: jest.fn().mockImplementation(() => ({
    getStrokes: jest.fn().mockResolvedValue(8)
  }))
}));

describe('Layer 1 Plugins', () => {
  describe('SurnamePlugin', () => {
    let plugin: SurnamePlugin;
    let mockContext: PluginContext;

    beforeEach(() => {
      plugin = new SurnamePlugin();
      mockContext = createMockContext();
    });

    it('应该正确初始化', async () => {
      await expect(plugin.initialize({ 
        enabled: true, 
        priority: 100, 
        timeout: 30000, 
        retryCount: 3 
      }, mockContext)).resolves.not.toThrow();
    });

    it('应该正确验证姓氏输入', () => {
      const validInput: StandardInput = {
        requestId: 'test',
        certaintyLevel: CertaintyLevel.FULLY_DETERMINED,
        data: { familyName: '张' },
        context: {} as any
      };

      const result = plugin.validate(validInput);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该拒绝无效的姓氏输入', () => {
      const invalidInput: StandardInput = {
        requestId: 'test',
        certaintyLevel: CertaintyLevel.FULLY_DETERMINED,
        data: { familyName: '' },
        context: {} as any
      };

      const result = plugin.validate(invalidInput);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('应该拒绝非汉字姓氏', () => {
      const invalidInput: StandardInput = {
        requestId: 'test',
        certaintyLevel: CertaintyLevel.FULLY_DETERMINED,
        data: { familyName: 'Zhang' },
        context: {} as any
      };

      const result = plugin.validate(invalidInput);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('姓氏必须为汉字');
    });

    it('应该返回健康状态', () => {
      const health = plugin.getHealthStatus();
      expect(health.status).toBe('degraded'); // 未初始化时为degraded
      expect(typeof health.lastCheck).toBe('number');
    });
  });

  describe('GenderPlugin', () => {
    let plugin: GenderPlugin;
    let mockContext: PluginContext;

    beforeEach(() => {
      plugin = new GenderPlugin();
      mockContext = createMockContext();
    });

    it('应该正确验证性别输入', () => {
      const validInput: StandardInput = {
        requestId: 'test',
        certaintyLevel: CertaintyLevel.FULLY_DETERMINED,
        data: { gender: 'male' },
        context: {} as any
      };

      const result = plugin.validate(validInput);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该拒绝无效的性别值', () => {
      const invalidInput: StandardInput = {
        requestId: 'test',
        certaintyLevel: CertaintyLevel.FULLY_DETERMINED,
        data: { gender: 'unknown' as any },
        context: {} as any
      };

      const result = plugin.validate(invalidInput);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('性别信息必须为 "male" 或 "female"');
    });

    it('应该判断字符的性别适宜性', () => {
      const maleResult = plugin.isCharacterSuitableForGender('强', 'male');
      expect(maleResult.suitable).toBe(true);
      expect(maleResult.score).toBeGreaterThan(1.0);

      const femaleResult = plugin.isCharacterSuitableForGender('娇', 'female');
      expect(femaleResult.suitable).toBe(true);
      expect(femaleResult.score).toBeGreaterThan(1.0);
    });
  });

  describe('BirthTimePlugin', () => {
    let plugin: BirthTimePlugin;
    let mockContext: PluginContext;

    beforeEach(() => {
      plugin = new BirthTimePlugin();
      mockContext = createMockContext();
    });

    it('应该正确验证出生时间输入', () => {
      const validInput: StandardInput = {
        requestId: 'test',
        certaintyLevel: CertaintyLevel.FULLY_DETERMINED,
        data: { 
          birthInfo: { 
            year: 2024, 
            month: 3, 
            day: 15, 
            hour: 10, 
            minute: 30 
          } 
        },
        context: {} as any
      };

      const result = plugin.validate(validInput);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该正确验证预产期输入', () => {
      const validInput: StandardInput = {
        requestId: 'test',
        certaintyLevel: CertaintyLevel.ESTIMATED,
        data: { 
          predueDate: { 
            year: 2024, 
            month: 6, 
            weekOffset: 2 
          } 
        },
        context: {} as any
      };

      const result = plugin.validate(validInput);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该拒绝无效的日期', () => {
      const invalidInput: StandardInput = {
        requestId: 'test',
        certaintyLevel: CertaintyLevel.FULLY_DETERMINED,
        data: { 
          birthInfo: { 
            year: 2024, 
            month: 13, // 无效月份
            day: 32,   // 无效日期
            hour: 25   // 无效小时
          } 
        },
        context: {} as any
      };

      const result = plugin.validate(invalidInput);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('应该拒绝同时缺少出生时间和预产期的输入', () => {
      const invalidInput: StandardInput = {
        requestId: 'test',
        certaintyLevel: CertaintyLevel.FULLY_DETERMINED,
        data: {},
        context: {} as any
      };

      const result = plugin.validate(invalidInput);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('必须提供出生时间信息或预产期信息');
    });
  });

  describe('PluginFactory', () => {
    it('应该能创建所有Layer 1插件', () => {
      const surnamePlugin = PluginFactory.createPlugin('surname');
      expect(surnamePlugin).toBeInstanceOf(SurnamePlugin);
      expect(surnamePlugin.layer).toBe(1);

      const genderPlugin = PluginFactory.createPlugin('gender');
      expect(genderPlugin).toBeInstanceOf(GenderPlugin);
      expect(genderPlugin.layer).toBe(1);

      const birthTimePlugin = PluginFactory.createPlugin('birth-time');
      expect(birthTimePlugin).toBeInstanceOf(BirthTimePlugin);
      expect(birthTimePlugin.layer).toBe(1);
    });

    it('应该能批量创建指定层级的插件', () => {
      const layer1Plugins = PluginFactory.createPluginsByLayer(1);
      expect(layer1Plugins).toHaveLength(4); // 包括family-tradition
      expect(layer1Plugins.every(plugin => plugin.layer === 1)).toBe(true);
    });

    it('应该拒绝创建未知类型的插件', () => {
      expect(() => {
        PluginFactory.createPlugin('unknown' as any);
      }).toThrow('Unknown plugin type: unknown');
    });

    it('应该返回可用插件列表', () => {
      const available = PluginFactory.getAvailablePlugins();
      expect(available).toContain('surname');
      expect(available).toContain('gender');
      expect(available).toContain('birth-time');
      expect(available).toContain('family-tradition');
    });
  });
});
