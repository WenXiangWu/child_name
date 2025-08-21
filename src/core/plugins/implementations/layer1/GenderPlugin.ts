/**
 * 性别偏好分析插件
 * Layer 1: 基础信息层
 * 
 * 功能：分析性别偏好，制定典籍来源偏好和字符过滤标准
 * 依赖：无 (Layer 1基础插件)
 * 
 * ⚠️ 重要：严格按照文档《插件执行示例-吴姓男孩取名完整计算过程.md》简化设计实现
 */

import { 
  Layer1Plugin, 
  StandardInput, 
  PluginOutput, 
  PluginContext, 
  ValidationResult,
  PluginMetadata,
  PluginDependency,
  PluginConfig
} from '../../interfaces/NamingPlugin';

export class GenderPlugin implements Layer1Plugin {
  readonly id = 'gender';
  readonly version = '1.0.0';
  readonly layer = 1 as const;
  readonly category = 'input' as const;
  readonly dependencies: PluginDependency[] = [];
  readonly metadata: PluginMetadata = {
    name: '性别偏好分析插件',
    description: '分析性别偏好，制定典籍来源偏好和字符过滤标准',
    author: 'Qiming Plugin System',
    category: 'input' as const,
    tags: ['gender', 'preference', 'literature', 'character-filter', 'layer1']
  };

  private initialized = false;

  constructor() {
    // 无需依赖项
  }

  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    this.initialized = true;
  }

  async validate(input: StandardInput): Promise<ValidationResult> {
    if (!input.gender || !['male', 'female'].includes(input.gender)) {
      return {
        valid: false,
        errors: ['缺少必要参数：gender (必须是 "male" 或 "female")']
      };
    }
    
    return { valid: true, errors: [] };
  }

  async process(input: StandardInput, context: PluginContext): Promise<PluginOutput> {
    const startTime = Date.now();
    
    try {
      if (!this.initialized) {
        throw new Error('插件未初始化');
      }

      const gender = input.gender;
      context.log?.('info', `开始分析性别偏好: ${gender}`);
      
      // 根据文档简化设计实现
      const analysis = this.analyzeGenderPreference(gender);
      
      return {
        success: true,
        data: {
          gender: gender,
          preferredCharacteristics: {
            preferMasculine: analysis.characterFilter.preferMasculine,
            avoidFeminine: analysis.characterFilter.avoidFeminine,
            culturalDepth: analysis.characterFilter.culturalDepth
          },
          avoidedCharacteristics: analysis.literarySourcePreference.discouraged,
          literarySourcePreference: analysis.literarySourcePreference,
          characterFilter: analysis.characterFilter,
          confidence: analysis.confidence
        },
        confidence: 1.0, // 性别信息确定性高
        executionTime: Date.now() - startTime,
        metadata: {
          pluginId: this.id,
          layer: this.layer,
          gender: gender
        }
      };
    } catch (error) {
      context.log?.('error', `性别偏好分析失败: ${error}`);
      return {
        success: false,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * 性别偏好分析 - 严格按照文档简化设计
   */
  private analyzeGenderPreference(gender: 'male' | 'female') {
    // Step 1: 确定典籍来源偏好 (男楚辞女诗经)
    const literarySourcePreference = this.getLiterarySourcePreference(gender);
    
    // Step 2: 设置字符过滤偏好
    const characterFilter = this.getCharacterFilter(gender);
    
    return {
      gender,
      literarySourcePreference,
      characterFilter,
      confidence: 1.0
    };
  }

  /**
   * 获取典籍来源偏好
   * 对应文档中的 literarySourcePreference 使用场景
   * 修复：男楚辞女诗经，但不是绝对排斥
   */
  private getLiterarySourcePreference(gender: 'male' | 'female') {
    if (gender === 'male') {
      return {
        preferred: ['楚辞'],           // 首选：男楚辞
        secondary: ['论语', '易经', '诗经'],  // 次选：诗经也可以作为男孩的次选
        discouraged: []               // 修复：不应该排斥诗经
      };
    } else {
      return {
        preferred: ['诗经'],           // 首选：女诗经
        secondary: ['宋词', '楚辞'],    // 次选：词韵优美、古典文学
        discouraged: []               // 无特别避讳
      };
    }
  }

  /**
   * 获取字符过滤偏好
   * 对应文档中的 characterFilter 使用场景
   */
  private getCharacterFilter(gender: 'male' | 'female') {
    if (gender === 'male') {
      return {
        preferMasculine: true,     // 偏好阳刚特质的字符
        avoidFeminine: true,       // 避免过于柔美的字符
        culturalDepth: 0.9         // 高度偏好有文化内涵的字符
      };
    } else {
      return {
        preferMasculine: false,    // 不特别偏好阳刚特质
        avoidFeminine: false,      // 不避免柔美字符
        culturalDepth: 0.9         // 同样偏好有文化内涵的字符
      };
    }
  }
}