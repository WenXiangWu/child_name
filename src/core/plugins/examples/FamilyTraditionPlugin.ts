/**
 * 家族传统插件
 * 处理家族传统、字辈等信息的分析
 */

import { 
  NamingPlugin, 
  StandardInput, 
  PluginOutput, 
  PluginContext, 
  ValidationResult,
  PluginMetadata,
  PluginDependency,
  CertaintyLevel
} from '../interfaces/NamingPlugin';

export class FamilyTraditionPlugin implements NamingPlugin {
  readonly id = 'family-tradition';
  readonly version = '1.0.0';
  readonly layer = 1;
  readonly dependencies: PluginDependency[] = [];
  readonly metadata: PluginMetadata = {
    name: '家族传统分析插件',
    description: '分析家族传统、字辈等信息，确保命名符合家族规范',
    author: 'System',
    category: 'input',
    tags: ['family', 'tradition', 'generation', 'basic']
  };

  private config: any = {};

  /**
   * 初始化插件
   */
  async initialize(config: any, context: PluginContext): Promise<void> {
    this.config = config;
    console.log('家族传统插件初始化完成');
  }

  /**
   * 处理输入数据
   */
  async process(input: StandardInput): Promise<PluginOutput> {
    const { data } = input;
    const familyInfo = data.preferences?.familyInfo;
    
    if (!familyInfo) {
      return {
        pluginId: this.id,
        results: {
          familyTradition: null,
          generationOrder: null,
          suggestions: ['未提供家族传统信息，将使用现代命名方式']
        },
        confidence: 0.3,
        metadata: {
          processingTime: 0,
          dataSource: 'default'
        },
        errors: [{
          code: 'FAMILY_INFO_MISSING',
          message: '家族传统信息缺失',
          timestamp: Date.now()
        }]
      };
    }

    const analysis = this.analyzeFamilyTradition(familyInfo);
    
    return {
      pluginId: this.id,
      results: {
        familyTradition: analysis,
        generationOrder: this.getGenerationOrder(analysis),
        suggestions: this.generateSuggestions(analysis)
      },
      confidence: 0.9,
      metadata: {
        processingTime: 0,
        dataSource: 'user_input'
      }
    };
  }

  /**
   * 验证输入数据
   */
  validate(input: StandardInput): ValidationResult {
    const { data } = input;
    const familyInfo = data.preferences?.familyInfo;
    
    if (!familyInfo) {
      return {
        valid: true,
        errors: [],
        warnings: ['家族传统信息缺失']
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // 验证字辈信息
    if (familyInfo.generationOrder && !Array.isArray(familyInfo.generationOrder)) {
      errors.push('字辈信息格式不正确，应为数组');
    }

    // 验证家族规范
    if (familyInfo.familyRules && typeof familyInfo.familyRules !== 'object') {
      errors.push('家族规范格式不正确');
    }

    // 验证禁忌字
    if (familyInfo.forbiddenCharacters && !Array.isArray(familyInfo.forbiddenCharacters)) {
      errors.push('禁忌字信息格式不正确，应为数组');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 分析家族传统
   */
  private analyzeFamilyTradition(familyInfo: any) {
    const analysis = {
      hasTradition: false,
      generationOrder: familyInfo.generationOrder || [],
      familyRules: familyInfo.familyRules || {},
      forbiddenCharacters: familyInfo.forbiddenCharacters || [],
      namingStyle: 'modern',
      culturalBackground: 'chinese'
    };

    // 判断是否有家族传统
    if (analysis.generationOrder.length > 0 || 
        Object.keys(analysis.familyRules).length > 0 ||
        familyInfo.familyHistory) {
      analysis.hasTradition = true;
      analysis.namingStyle = 'traditional';
    }

    // 分析文化背景
    if (familyInfo.culturalBackground) {
      analysis.culturalBackground = familyInfo.culturalBackground;
    }

    return analysis;
  }

  /**
   * 获取字辈顺序
   */
  private getGenerationOrder(analysis: any): string[] {
    if (!analysis.hasTradition || !analysis.generationOrder) {
      return [];
    }

    return analysis.generationOrder.map((char: string, index: number) => ({
      character: char,
      generation: index + 1,
      description: this.getGenerationDescription(char, index + 1)
    }));
  }

  /**
   * 获取字辈描述
   */
  private getGenerationDescription(character: string, generation: number): string {
    const descriptions = [
      '第一代字辈',
      '第二代字辈', 
      '第三代字辈',
      '第四代字辈',
      '第五代字辈'
    ];
    
    return descriptions[generation - 1] || `第${generation}代字辈`;
  }

  /**
   * 生成建议
   */
  private generateSuggestions(analysis: any): string[] {
    const suggestions = [];
    
    if (analysis.hasTradition) {
      suggestions.push('建议遵循家族传统，使用规定的字辈');
      
      if (analysis.generationOrder.length > 0) {
        suggestions.push(`当前应使用第${analysis.generationOrder.length + 1}代字辈`);
      }
      
      if (analysis.forbiddenCharacters.length > 0) {
        suggestions.push(`避免使用禁忌字：${analysis.forbiddenCharacters.join('、')}`);
      }
    } else {
      suggestions.push('无家族传统要求，可自由选择命名方式');
    }
    
    if (analysis.culturalBackground === 'chinese') {
      suggestions.push('建议考虑中华文化传统，选择寓意美好的字');
    }
    
    return suggestions;
  }

  /**
   * 检查字辈匹配
   */
  checkGenerationMatch(name: string, generationOrder: string[]): boolean {
    if (!generationOrder || generationOrder.length === 0) {
      return true;
    }
    
    const currentGeneration = generationOrder.length;
    const expectedCharacter = generationOrder[currentGeneration - 1];
    
    return name.includes(expectedCharacter);
  }

  /**
   * 检查禁忌字
   */
  checkForbiddenCharacters(name: string, forbiddenChars: string[]): string[] {
    if (!forbiddenChars || forbiddenChars.length === 0) {
      return [];
    }
    
    return forbiddenChars.filter(char => name.includes(char));
  }

  /**
   * 销毁插件，清理资源
   */
  async destroy(): Promise<void> {
    console.log('家族传统插件销毁完成');
  }

  /**
   * 检查插件是否可用
   */
  isAvailable(): boolean {
    return true;
  }

  /**
   * 获取插件健康状态
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    message: string;
    lastCheck: number;
  } {
    return {
      status: 'healthy',
      message: '插件运行正常',
      lastCheck: Date.now()
    };
  }
}
