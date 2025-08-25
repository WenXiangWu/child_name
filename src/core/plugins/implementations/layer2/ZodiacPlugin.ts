/**
 * 生肖分析插件
 * 基于出生时间分析生肖信息，提供生肖相关的命名建议
 */

import { 
  NamingPlugin, 
  StandardInput, 
  PluginOutput, 
  PluginContext, 
  ValidationResult,
  PluginMetadata,
  PluginDependency,
  PluginConfig,
  CertaintyLevel
} from '../../interfaces/NamingPlugin';

import { ZodiacService } from '../../../analysis/zodiac-service';

export class ZodiacPlugin implements NamingPlugin {
  readonly id = 'zodiac';
  readonly version = '1.0.0';
  readonly layer = 2;
  readonly dependencies: PluginDependency[] = [
    {
      pluginId: 'birth-time',
      version: '^1.0.0',
      required: true
    }
  ];
  readonly metadata: PluginMetadata = {
    name: '生肖分析插件',
    description: '基于出生时间分析生肖信息，提供生肖相关的命名建议',
    author: 'System',
    category: 'analysis',
    tags: ['zodiac', 'animal', 'characters', 'traditional']
  };

  private config: PluginConfig | null = null;
  private zodiacService: ZodiacService;

  constructor() {
    this.zodiacService = ZodiacService.getInstance();
  }

  /**
   * 初始化插件
   */
  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    this.config = config;
    
    // 初始化生肖服务
    try {
      await this.zodiacService.initialize();
      context.log?.('info', `生肖插件初始化完成, 版本: ${this.version}`);
    } catch (error) {
      context.log?.('error', `生肖数据加载失败，将使用简化模式: ${error}`);
    }
  }

  /**
   * 处理输入数据
   */
  async process(input: StandardInput): Promise<PluginOutput> {
    const startTime = Date.now();
    
    // 检查出生时间信息
    if (!input.birthInfo) {
      return {
        success: false,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        errors: ['缺少出生时间信息']
      };
    }

    // 使用输入的出生时间信息
    const birthInfo = input.birthInfo;

    try {
      // 简化的生肖分析
      const zodiac = this.zodiacService.getZodiacByYear(birthInfo.year);
      
      return {
        success: true,
        data: {
          zodiac,
          year: birthInfo.year,
          analysis: `${birthInfo.year}年为${zodiac}年`
        },
        confidence: 0.9,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        errors: [`生肖分析失败: ${error}`]
      };
    }
  }

  /**
   * 验证输入数据
   */
  async validate(input: StandardInput): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查是否有出生时间信息
    if (!input.birthInfo) {
      errors.push('生肖分析需要出生时间信息');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}