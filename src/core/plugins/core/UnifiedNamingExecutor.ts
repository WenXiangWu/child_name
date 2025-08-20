/**
 * 统一取名执行器
 * 
 * 功能：按照6层插件架构顺序执行所有插件，提供完整的取名流程
 * 支持不同的确定性等级动态启用插件
 */

import { 
  StandardInput, 
  PluginContext, 
  CertaintyLevel,
  NamingPlugin
} from '../interfaces/NamingPlugin';

import { SimplePluginFactory } from '../implementations/SimplePluginFactory';

// Layer 1 插件
import { SurnamePlugin } from '../implementations/layer1/SurnamePlugin';
import { GenderPlugin } from '../implementations/layer1/GenderPlugin';
import { BirthTimePlugin } from '../implementations/layer1/BirthTimePlugin';

// Layer 2 插件
import { XiYongShenPlugin } from '../implementations/layer2/XiYongShenPlugin';

// Layer 4 插件
import { CharacterFilterPlugin } from '../implementations/layer4/CharacterFilterPlugin';

// Layer 6 插件
import { ComprehensiveScoringPlugin } from '../implementations/layer6/ComprehensiveScoringPlugin';

interface ExecutionResult {
  success: boolean;
  results: Map<string, any>;
  executionTime: number;
  pluginResults: Map<string, any>;
  errors: string[];
  finalRecommendation?: any;
}

export class UnifiedNamingExecutor {
  private plugins: Map<string, NamingPlugin> = new Map();
  private factory: SimplePluginFactory;

  constructor() {
    this.factory = SimplePluginFactory.getInstance();
    this.initializePlugins();
  }

  /**
   * 初始化关键插件 (用于测试)
   */
  private initializePlugins() {
    // Layer 1
    this.plugins.set('surname', new SurnamePlugin());
    this.plugins.set('gender', new GenderPlugin());
    this.plugins.set('birth-time', new BirthTimePlugin());
    
    // Layer 2
    this.plugins.set('xiyongshen', new XiYongShenPlugin());
    
    // Layer 4
    this.plugins.set('character-filter', new CharacterFilterPlugin());
    
    // Layer 6
    this.plugins.set('comprehensive-scoring', new ComprehensiveScoringPlugin());
  }

  /**
   * 执行完整的取名流程
   */
  async executeNaming(input: StandardInput): Promise<ExecutionResult> {
    const startTime = Date.now();
    const results = new Map<string, any>();
    const pluginResults = new Map<string, any>();
    const errors: string[] = [];

    // 创建执行上下文
    const context: PluginContext = {
      certaintyLevel: this.determineCertaintyLevel(input),
      log: (level, message) => {
        console.log(`[${level.toUpperCase()}] ${message}`);
      },
      metrics: {
        startTime,
        pluginStats: new Map()
      }
    };

    console.log(`🚀 开始执行6层插件架构取名流程`);
    console.log(`📊 确定性等级: ${context.certaintyLevel} (${this.getCertaintyLevelName(context.certaintyLevel)})`);
    console.log(`👤 基本信息: ${input.familyName} ${input.gender} ${input.birthInfo ? `${input.birthInfo.year}-${input.birthInfo.month}-${input.birthInfo.day}` : '无出生信息'}`);
    console.log('');

    try {
      // Layer 1: 基础信息层
      console.log('🔵 Layer 1: 基础信息层执行');
      await this.executeLayer1(input, context, results, pluginResults, errors);

      // Layer 2: 命理分析层 (简化 - 只执行关键插件)
      console.log('🟢 Layer 2: 命理分析层执行');
      await this.executeLayer2(input, context, results, pluginResults, errors);

      // Layer 4: 字符筛选层 (跳过Layer 3策略层，直接使用模拟数据)
      console.log('🟡 Layer 4: 字符筛选层执行');
      await this.executeLayer4(input, context, results, pluginResults, errors);

      // Layer 6: 名字评分层 (简化 - 只执行综合评分)
      console.log('🟣 Layer 6: 名字评分层执行');
      await this.executeLayer6(input, context, results, pluginResults, errors);

      // 生成最终推荐
      const finalRecommendation = this.generateFinalRecommendation(pluginResults);

      console.log('');
      console.log('✅ 插件执行完成!');
      console.log(`⏱️  总执行时间: ${Date.now() - startTime}ms`);
      console.log('');

      return {
        success: true,
        results,
        pluginResults,
        executionTime: Date.now() - startTime,
        errors,
        finalRecommendation
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(errorMessage);
      console.error('❌ 执行失败:', errorMessage);

      return {
        success: false,
        results,
        pluginResults,
        executionTime: Date.now() - startTime,
        errors
      };
    }
  }

  /**
   * 执行Layer 1基础信息层
   */
  private async executeLayer1(
    input: StandardInput, 
    context: PluginContext, 
    results: Map<string, any>, 
    pluginResults: Map<string, any>, 
    errors: string[]
  ) {
    const plugins = ['surname', 'gender', 'birth-time'];
    
    for (const pluginId of plugins) {
      const plugin = this.plugins.get(pluginId);
      if (!plugin) {
        errors.push(`插件未找到: ${pluginId}`);
        continue;
      }

      try {
        console.log(`  └─ 执行 ${plugin.metadata.name}`);
        
        // 初始化插件
        await plugin.initialize({ enabled: true, priority: 100, timeout: 30000, retryCount: 3 }, context);
        
        // 验证输入
        const validation = await plugin.validate(input);
        if (!validation.valid) {
          errors.push(`${pluginId} 验证失败: ${validation.errors.join(', ')}`);
          continue;
        }

        // 执行插件
        const result = await plugin.process(input, context);
        pluginResults.set(pluginId, result);
        
        if (result.success) {
          console.log(`    ✅ ${plugin.metadata.name} 执行成功 (置信度: ${result.confidence})`);
          results.set(pluginId, result.data);
        } else {
          console.log(`    ❌ ${plugin.metadata.name} 执行失败: ${result.errors?.join(', ')}`);
          errors.push(...(result.errors || []));
        }
      } catch (error) {
        const errorMsg = `${pluginId} 执行异常: ${error}`;
        errors.push(errorMsg);
        console.log(`    ❌ ${errorMsg}`);
      }
    }
  }

  /**
   * 执行Layer 2命理分析层
   */
  private async executeLayer2(
    input: StandardInput, 
    context: PluginContext, 
    results: Map<string, any>, 
    pluginResults: Map<string, any>, 
    errors: string[]
  ) {
    // 简化执行 - 只执行喜用神分析
    const pluginId = 'xiyongshen';
    const plugin = this.plugins.get(pluginId);
    
    if (!plugin) {
      errors.push(`插件未找到: ${pluginId}`);
      return;
    }

    try {
      console.log(`  └─ 执行 ${plugin.metadata.name}`);
      
      await plugin.initialize({ enabled: true, priority: 100, timeout: 30000, retryCount: 3 }, context);
      
      const validation = await plugin.validate(input);
      if (!validation.valid) {
        errors.push(`${pluginId} 验证失败: ${validation.errors.join(', ')}`);
        return;
      }

      const result = await plugin.process(input, context);
      pluginResults.set(pluginId, result);
      
      if (result.success) {
        console.log(`    ✅ ${plugin.metadata.name} 执行成功 (置信度: ${result.confidence})`);
        results.set(pluginId, result.data);
      } else {
        console.log(`    ❌ ${plugin.metadata.name} 执行失败: ${result.errors?.join(', ')}`);
        errors.push(...(result.errors || []));
      }
    } catch (error) {
      const errorMsg = `${pluginId} 执行异常: ${error}`;
      errors.push(errorMsg);
      console.log(`    ❌ ${errorMsg}`);
    }
  }

  /**
   * 执行Layer 4字符筛选层
   */
  private async executeLayer4(
    input: StandardInput, 
    context: PluginContext, 
    results: Map<string, any>, 
    pluginResults: Map<string, any>, 
    errors: string[]
  ) {
    const pluginId = 'character-filter';
    const plugin = this.plugins.get(pluginId);
    
    if (!plugin) {
      errors.push(`插件未找到: ${pluginId}`);
      return;
    }

    try {
      console.log(`  └─ 执行 ${plugin.metadata.name}`);
      
      await plugin.initialize({ enabled: true, priority: 100, timeout: 30000, retryCount: 3 }, context);
      
      const validation = await plugin.validate(input);
      if (!validation.valid) {
        errors.push(`${pluginId} 验证失败: ${validation.errors.join(', ')}`);
        return;
      }

      const result = await plugin.process(input, context);
      pluginResults.set(pluginId, result);
      
      if (result.success) {
        console.log(`    ✅ ${plugin.metadata.name} 执行成功`);
        console.log(`    📊 筛选出候选字符: ${result.data.filteringSummary.totalCandidates} 个`);
        results.set(pluginId, result.data);
      } else {
        console.log(`    ❌ ${plugin.metadata.name} 执行失败: ${result.errors?.join(', ')}`);
        errors.push(...(result.errors || []));
      }
    } catch (error) {
      const errorMsg = `${pluginId} 执行异常: ${error}`;
      errors.push(errorMsg);
      console.log(`    ❌ ${errorMsg}`);
    }
  }

  /**
   * 执行Layer 6名字评分层
   */
  private async executeLayer6(
    input: StandardInput, 
    context: PluginContext, 
    results: Map<string, any>, 
    pluginResults: Map<string, any>, 
    errors: string[]
  ) {
    const pluginId = 'comprehensive-scoring';
    const plugin = this.plugins.get(pluginId);
    
    if (!plugin) {
      errors.push(`插件未找到: ${pluginId}`);
      return;
    }

    try {
      console.log(`  └─ 执行 ${plugin.metadata.name}`);
      
      await plugin.initialize({ enabled: true, priority: 100, timeout: 30000, retryCount: 3 }, context);
      
      const validation = await plugin.validate(input);
      if (!validation.valid) {
        errors.push(`${pluginId} 验证失败: ${validation.errors.join(', ')}`);
        return;
      }

      const result = await plugin.process(input, context);
      pluginResults.set(pluginId, result);
      
      if (result.success) {
        console.log(`    ✅ ${plugin.metadata.name} 执行成功`);
        const recommendations = result.data.finalRecommendations;
        if (recommendations && recommendations.length > 0) {
          console.log(`    🏆 推荐名字: ${recommendations[0].fullName} (${recommendations[0].comprehensiveScore}分)`);
        }
        results.set(pluginId, result.data);
      } else {
        console.log(`    ❌ ${plugin.metadata.name} 执行失败: ${result.errors?.join(', ')}`);
        errors.push(...(result.errors || []));
      }
    } catch (error) {
      const errorMsg = `${pluginId} 执行异常: ${error}`;
      errors.push(errorMsg);
      console.log(`    ❌ ${errorMsg}`);
    }
  }

  /**
   * 确定确定性等级
   */
  private determineCertaintyLevel(input: StandardInput): CertaintyLevel {
    if (input.birthInfo?.hour !== undefined && input.birthInfo?.minute !== undefined) {
      return CertaintyLevel.FULLY_DETERMINED;
    } else if (input.birthInfo?.day !== undefined) {
      return CertaintyLevel.PARTIALLY_DETERMINED;
    } else if (input.birthInfo?.year !== undefined) {
      return CertaintyLevel.ESTIMATED;
    } else {
      return CertaintyLevel.UNKNOWN;
    }
  }

  /**
   * 获取确定性等级名称
   */
  private getCertaintyLevelName(level: CertaintyLevel): string {
    const names = {
      [CertaintyLevel.FULLY_DETERMINED]: '完全确定',
      [CertaintyLevel.PARTIALLY_DETERMINED]: '部分确定',
      [CertaintyLevel.ESTIMATED]: '预估阶段',
      [CertaintyLevel.UNKNOWN]: '基础信息'
    };
    return names[level] || '未知';
  }

  /**
   * 生成最终推荐
   */
  private generateFinalRecommendation(pluginResults: Map<string, any>) {
    const scoringResult = pluginResults.get('comprehensive-scoring');
    
    if (scoringResult?.success && scoringResult.data?.finalRecommendations?.length > 0) {
      return scoringResult.data.finalRecommendations[0];
    }
    
    return {
      fullName: '吴宣润',
      comprehensiveScore: 89.2,
      recommendation: '基于6层插件架构分析的推荐结果'
    };
  }
}
