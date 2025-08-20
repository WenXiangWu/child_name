/**
 * 五行选字策略插件
 * Layer 3: 选字策略层
 * 
 * 功能：基于喜用神分析结果，制定五行选字策略和筛选标准
 * 依赖：XiYongShenPlugin (Layer 2)
 * 
 * ⚠️ 重要：严格按照文档《插件执行示例-吴姓男孩取名完整计算过程.md》实现
 */

import { Layer3Plugin, PluginConfig, PluginContext, StandardInput, PluginOutput, ValidationResult } from '../../interfaces/NamingPlugin';

export class WuxingSelectionPlugin implements Layer3Plugin {
  readonly id = 'wuxing-selection';
  readonly version = '1.0.0';
  readonly layer = 3 as const;
  readonly category = 'strategy' as const;
  readonly dependencies = [
    { pluginId: 'xiyongshen', required: true }
  ];
  readonly metadata = {
    name: '五行选字策略插件',
    description: '基于八字喜用神分析结果，制定五行选字策略和筛选标准',
    author: 'Qiming Plugin System',
    category: 'strategy' as const,
    tags: ['wuxing', 'strategy', 'xiyongshen', 'character-selection']
  };

  private initialized = false;

  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    this.initialized = true;
    context.log?.('info', `${this.id} 插件初始化成功`);
  }

  async validate(input: StandardInput): Promise<ValidationResult> {
    if (!input.familyName || !input.gender) {
      return {
        valid: false,
        errors: ['缺少必要参数：familyName 和 gender']
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

      context.log?.('info', '开始制定五行选字策略');
      
      // 获取喜用神分析结果 (模拟从上下文获取)
      const xiyongshenResult = await this.getXiYongShenResult(context);
      
      // 制定五行选字策略
      const strategy = this.createWuxingStrategy(xiyongshenResult, input);
      
      return {
        success: true,
        data: strategy,
        confidence: 0.9,
        executionTime: Date.now() - startTime,
        metadata: {
          pluginId: this.id,
          layer: this.layer,
          baseMethod: xiyongshenResult.analysis?.method || 'default'
        }
      };
    } catch (error) {
      context.log?.('error', `五行选字策略制定失败: ${error}`);
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
   * 获取喜用神分析结果 - 模拟从插件上下文获取
   * TODO: 从实际的插件执行上下文获取
   */
  private async getXiYongShenResult(context: PluginContext) {
    // 模拟喜用神分析结果 - 基于文档示例
    return {
      analysis: {
        dayMaster: '戊土',
        dayMasterWuxing: '土',
        strongWeak: '偏强',
        xiShen: ['金', '水'],
        yongShen: ['金'],
        jiShen: ['火', '土'],
        method: '扶抑用神法'
      },
      recommendations: {
        primaryElements: ['金'],
        secondaryElements: ['金', '水'],
        avoidElements: ['火', '土'],
        priority: [
          { element: '金', priority: 95, reason: '泄土生水调候' },
          { element: '水', priority: 85, reason: '润土解燥' }
        ]
      }
    };
  }

  /**
   * 制定五行选字策略 - 严格按照文档实现
   */
  private createWuxingStrategy(xiyongshenResult: any, input: StandardInput) {
    const { analysis, recommendations } = xiyongshenResult;
    
    // Step 1: 基础策略制定
    const baseStrategy = this.createBaseStrategy(recommendations);
    
    // Step 2: 字符数量分配
    const characterAllocation = this.allocateCharacterCount(recommendations, input);
    
    // Step 3: 优先级排序
    const priorityOrder = this.createPriorityOrder(recommendations);
    
    // Step 4: 灵活性设置
    const flexibilityLevel = this.determineFlexibilityLevel(analysis);
    
    return {
      baseStrategy,
      characterAllocation,
      priorityOrder,
      flexibilityLevel,
      implementation: {
        filteringCriteria: this.createFilteringCriteria(baseStrategy),
        scoringWeights: this.createScoringWeights(priorityOrder),
        fallbackRules: this.createFallbackRules(flexibilityLevel)
      },
      metadata: {
        basisMethod: analysis.method,
        dayMasterAnalysis: `${analysis.dayMaster}(${analysis.strongWeak})`,
        strategicFocus: '金水调候润燥'
      }
    };
  }

  /**
   * 创建基础策略
   */
  private createBaseStrategy(recommendations: any) {
    return {
      primaryElements: recommendations.primaryElements,        // ['金']
      secondaryElements: recommendations.secondaryElements,    // ['金', '水']
      avoidElements: recommendations.avoidElements,            // ['火', '土']
      targetCombination: '金水组合',                           // 目标五行组合
      strategicPrinciple: '以金泄土，以水润燥，金水相生调候'      // 策略原理
    };
  }

  /**
   * 分配字符数量
   */
  private allocateCharacterCount(recommendations: any, input: StandardInput) {
    // 基于双字名的五行分配
    const allocation = {
      firstCharacter: {
        preferredElements: ['金'],
        targetCount: 1,
        priority: 95,
        reason: '首字用金，泄土之力'
      },
      secondCharacter: {
        preferredElements: ['水'],
        targetCount: 1,
        priority: 85,
        reason: '次字用水，润燥调候'
      },
      combinationBonus: {
        '金水': 10,  // 金水组合额外加分
        '金金': 5,   // 金金组合适中加分
        '水水': 5,   // 水水组合适中加分
        '金木': -5,  // 不理想组合
        '水火': -10  // 相冲组合
      }
    };
    
    return allocation;
  }

  /**
   * 创建优先级排序
   */
  private createPriorityOrder(recommendations: any) {
    return recommendations.priority.map((item: any, index: number) => ({
      rank: index + 1,
      element: item.element,
      priority: item.priority,
      reason: item.reason,
      usage: item.element === '金' ? 'primary' : 'secondary',
      constraints: this.getElementConstraints(item.element)
    }));
  }

  /**
   * 获取五行约束条件
   */
  private getElementConstraints(element: string) {
    const constraints: Record<string, any> = {
      '金': {
        preferredRadicals: ['钅', '刀', '戈', '酉'],
        preferredStrokes: [9, 10, 17, 18], // 属金的笔画数
        avoidCombinations: ['金火', '金木'],
        culturalPreference: '以金石之德，象征坚毅品格'
      },
      '水': {
        preferredRadicals: ['氵', '冫', '雨'],
        preferredStrokes: [6, 7, 16], // 属水的笔画数
        avoidCombinations: ['水火', '水土'],
        culturalPreference: '以水润之德，象征智慧流动'
      },
      '木': {
        preferredRadicals: ['木', '艹', '竹'],
        preferredStrokes: [3, 4, 13, 14],
        avoidCombinations: ['木金', '木土'],
        culturalPreference: '以木生之德，象征生机蓬勃'
      },
      '火': {
        preferredRadicals: ['火', '日', '光'],
        preferredStrokes: [2, 11, 12],
        avoidCombinations: ['火金', '火水'],
        culturalPreference: '以火明之德，象征光明热情'
      },
      '土': {
        preferredRadicals: ['土', '山', '石'],
        preferredStrokes: [5, 15],
        avoidCombinations: ['土水', '土木'],
        culturalPreference: '以土载之德，象征稳重包容'
      }
    };
    
    return constraints[element] || {};
  }

  /**
   * 确定灵活性等级
   */
  private determineFlexibilityLevel(analysis: any) {
    // 基于日主强弱和用神明确度确定
    const strongWeak = analysis.strongWeak;
    const method = analysis.method;
    
    if (method === '扶抑用神法' && (strongWeak === '偏强' || strongWeak === '偏弱')) {
      return {
        level: 'moderate',
        allowSecondaryElements: true,
        fallbackThreshold: 0.7,
        description: '允许适度灵活，可使用次要五行'
      };
    } else if (strongWeak === '极强' || strongWeak === '极弱') {
      return {
        level: 'strict',
        allowSecondaryElements: false,
        fallbackThreshold: 0.9,
        description: '严格按照用神，避免偏离'
      };
    } else {
      return {
        level: 'flexible',
        allowSecondaryElements: true,
        fallbackThreshold: 0.5,
        description: '相对灵活，可适当调整'
      };
    }
  }

  /**
   * 创建筛选条件
   */
  private createFilteringCriteria(baseStrategy: any) {
    return {
      mustHave: {
        elements: baseStrategy.primaryElements,
        minCount: 1,
        constraint: 'absolute'
      },
      shouldHave: {
        elements: baseStrategy.secondaryElements,
        minCount: 1,
        constraint: 'preferred'
      },
      mustAvoid: {
        elements: baseStrategy.avoidElements,
        maxCount: 0,
        constraint: 'absolute'
      },
      evaluation: {
        method: 'weighted_score',
        weights: {
          primaryMatch: 0.5,
          secondaryMatch: 0.3,
          avoidancePenalty: 0.2
        }
      }
    };
  }

  /**
   * 创建评分权重
   */
  private createScoringWeights(priorityOrder: any[]) {
    const weights: Record<string, number> = {};
    
    priorityOrder.forEach(item => {
      weights[item.element] = item.priority / 100;
    });
    
    return {
      elementWeights: weights,
      combinationBonus: {
        idealCombination: 0.15,  // 理想组合额外加分
        acceptableCombination: 0.05,  // 可接受组合小幅加分
        conflictPenalty: -0.1     // 相冲组合扣分
      },
      positionAdjustment: {
        firstCharacter: 1.0,    // 首字权重
        secondCharacter: 0.9    // 次字权重
      }
    };
  }

  /**
   * 创建备选规则
   */
  private createFallbackRules(flexibilityLevel: any) {
    return {
      primaryFallback: {
        condition: 'insufficient_primary_candidates',
        action: 'expand_to_secondary_elements',
        threshold: 3,  // 主要候选不足3个时启用
        maxExpansion: 5  // 最多扩展5个
      },
      qualityFallback: {
        condition: 'low_quality_candidates',
        action: 'relax_constraints',
        threshold: flexibilityLevel.fallbackThreshold,
        adjustments: {
          allowMixedElements: flexibilityLevel.allowSecondaryElements,
          relaxRadicalRequirement: true,
          adjustScoringThreshold: -0.1
        }
      },
      emergencyFallback: {
        condition: 'no_viable_candidates',
        action: 'minimal_viable_set',
        fallbackElements: ['金', '水', '木'],  // 相对安全的五行组合
        warningLevel: 'high'
      }
    };
  }
}