/**
 * 简化的名字生成插件 - 用于测试
 */

import { Layer5Plugin, PluginConfig, PluginContext, StandardInput, PluginOutput, ValidationResult } from '../../interfaces/NamingPlugin';

export class SimpleNamePlugin implements Layer5Plugin {
  readonly id = 'simple-name';
  readonly version = '1.0.0';
  readonly layer = 5 as const;
  readonly category = 'generation' as const;
  readonly dependencies = [];
  readonly metadata = {
    name: '简化名字生成插件',
    description: '生成基础的测试名字',
    author: 'Test',
    category: 'generation' as const,
    tags: ['test', 'simple']
  };

  private initialized = false;

  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    this.initialized = true;
  }

  async validate(input: StandardInput): Promise<ValidationResult> {
    return { valid: true, errors: [] };
  }

  async process(input: StandardInput, context: PluginContext): Promise<PluginOutput> {
    const startTime = Date.now();
    
    try {
      context.log?.('info', '开始生成简化测试名字');
      
      // 生成简单的测试名字
      const testNames = [
        {
          fullName: `${input.familyName}博文`,
          firstName: '博',
          secondName: '文',
          components: {
            surname: { char: input.familyName, strokes: 7, wuxing: 'mu' },
            first: { char: '博', strokes: 12, wuxing: 'shui' },
            second: { char: '文', strokes: 4, wuxing: 'shui' }
          },
          metadata: {
            totalStrokes: 23,
            wuxingCombination: '木水水',
            phoneticPattern: 'wú bó wén',
            generationScore: 85
          }
        },
        {
          fullName: `${input.familyName}子轩`,
          firstName: '子',
          secondName: '轩',
          components: {
            surname: { char: input.familyName, strokes: 7, wuxing: 'mu' },
            first: { char: '子', strokes: 3, wuxing: 'shui' },
            second: { char: '轩', strokes: 10, wuxing: 'tu' }
          },
          metadata: {
            totalStrokes: 20,
            wuxingCombination: '木水土',
            phoneticPattern: 'wú zǐ xuān',
            generationScore: 82
          }
        }
      ];

      const result = {
        nameCandidates: testNames,
        statistics: {
          totalGenerated: testNames.length,
          averageScore: 83.5
        }
      };

      return {
        success: true,
        data: result,
        confidence: 0.9,
        executionTime: Date.now() - startTime,
        metadata: {
          pluginId: this.id,
          layer: this.layer,
          totalCombinations: testNames.length
        }
      };
    } catch (error) {
      context.log?.('error', `简化名字生成失败: ${error}`);
      return {
        success: false,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
}
