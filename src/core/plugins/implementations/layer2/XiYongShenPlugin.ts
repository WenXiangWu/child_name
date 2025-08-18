/**
 * 五行喜用神插件 - Layer 2
 * 基于八字分析确定五行喜用神，提供命名的五行指导
 */

import { 
  NamingPlugin, 
  StandardInput, 
  PluginOutput, 
  PluginContext, 
  ValidationResult,
  PluginMetadata,
  PluginDependency,
  CertaintyLevel,
  PluginConfig
} from '../../interfaces/NamingPlugin';

import { WuxingElement } from '../../../common/types';

interface XiYongShenResult {
  strategy: 'bazi-based' | 'generic-balance' | 'seasonal-based';
  confidence: number;
  
  // 喜用神分析
  xiYongShen: {
    primary: WuxingElement[];      // 主要喜用神
    secondary: WuxingElement[];    // 次要喜用神
    reasoning: string[];           // 推理过程
  };
  
  // 忌神分析
  jiShen: {
    primary: WuxingElement[];      // 主要忌神
    secondary: WuxingElement[];    // 次要忌神
    reasoning: string[];           // 推理过程
  };
  
  // 五行平衡建议
  balance: {
    strengthen: WuxingElement[];   // 需要加强的五行
    weaken: WuxingElement[];       // 需要减弱的五行
    maintain: WuxingElement[];     // 需要维持的五行
  };
  
  // 命名指导
  namingGuidance: {
    preferredElements: WuxingElement[];
    avoidedElements: WuxingElement[];
    priorityOrder: WuxingElement[];
    flexibilityLevel: 'strict' | 'moderate' | 'flexible';
  };
  
  // 备选方案
  alternativeStrategies?: {
    name: string;
    elements: WuxingElement[];
    description: string;
    confidence: number;
  }[];
}

export class XiYongShenPlugin implements NamingPlugin {
  readonly id = 'xiyongshen';
  readonly version = '1.0.0';
  readonly layer = 2;
  readonly dependencies: PluginDependency[] = [
    { pluginId: 'birth-time', required: true },
    { pluginId: 'bazi', required: false } // 可选依赖
  ];
  readonly metadata: PluginMetadata = {
    name: '五行喜用神分析插件',
    description: '基于八字或时间信息分析五行喜用神，提供命名的五行指导',
    author: 'System',
    category: 'calculation',
    tags: ['wuxing', 'xiyongshen', 'balance', 'elements']
  };

  private config: PluginConfig | null = null;

  // 五行相生相克关系
  private readonly wuxingRelations = {
    generate: {
      '金': '水',   // 金生水
      '水': '木',    // 水生木
      '木': '火',     // 木生火
      '火': '土',     // 火生土
      '土': '金'      // 土生金
    },
    overcome: {
      '金': '木',     // 金克木
      '木': '土',      // 木克土
      '土': '水',    // 土克水
      '水': '火',   // 水克火
      '火': '金'     // 火克金
    }
  };

  // 季节五行对应
  private readonly seasonalWuxing = {
    spring: '木',     // 春属木
    summer: '火',    // 夏属火
    autumn: '金',    // 秋属金
    winter: '水',   // 冬属水
    lateS: '土'       // 长夏属土
  };

  /**
   * 初始化插件
   */
  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    this.config = config;
    context.log('info', `五行喜用神插件初始化完成, 版本: ${this.version}`);
  }

  /**
   * 处理输入数据
   */
  async process(input: StandardInput): Promise<PluginOutput> {
    const startTime = Date.now();
    
    // 获取依赖插件的结果
    const timeResult = input.context.pluginResults.get('birth-time');
    const baziResult = input.context.pluginResults.get('bazi');
    
    // 如果没有出生时间信息，使用通用五行平衡策略
    if (!timeResult) {
      console.log('[xiyongshen] 没有出生时间信息，使用通用五行平衡策略');
      const result = await this.processGenericBalance();
      return {
        pluginId: this.id,
        results: result,
        confidence: result.confidence,
        metadata: {
          processingTime: Date.now() - startTime,
          strategy: result.strategy,
          fallbackMode: true
        }
      };
    }

    let xiYongShenResult: XiYongShenResult;
    
    // 根据可用数据选择分析策略
    if (baziResult && baziResult.results && baziResult.results.bazi && baziResult.confidence > 0.7) {
      xiYongShenResult = await this.processBaZiBased(baziResult.results, timeResult);
    } else if (timeResult.timeInfo?.type === 'exact') {
      xiYongShenResult = await this.processSeasonalBased(timeResult);
    } else {
      xiYongShenResult = await this.processGenericBalance();
    }

    return {
      pluginId: this.id,
      results: {
        xiYongShenResult,
        preferredElements: xiYongShenResult.namingGuidance.preferredElements,
        avoidedElements: xiYongShenResult.namingGuidance.avoidedElements,
        strategy: xiYongShenResult.strategy,
        balanceGuidance: xiYongShenResult.balance,
        alternativeOptions: xiYongShenResult.alternativeStrategies,
        recommendations: this.generateRecommendations(xiYongShenResult)
      },
      confidence: xiYongShenResult.confidence,
      metadata: {
        processingTime: Date.now() - startTime,
        dataSource: xiYongShenResult.strategy,
        flexibilityLevel: xiYongShenResult.namingGuidance.flexibilityLevel
      }
    };
  }

  /**
   * 基于八字的喜用神分析
   */
  private async processBaZiBased(baziResult: any, timeResult: any): Promise<XiYongShenResult> {
    const { dayMasterWuxing, strongWeak, usefulGods, avoidGods, wuxingCount } = baziResult.bazi || baziResult;
    
    // 转换为标准五行格式
    const xiYongShen = this.convertToWuxingElements(usefulGods);
    const jiShen = this.convertToWuxingElements(avoidGods);
    
    // 分析五行平衡
    const balance = this.analyzeBaZiBalance(dayMasterWuxing, strongWeak, wuxingCount);
    
    // 生成命名指导
    const namingGuidance = this.generateBaZiNamingGuidance(xiYongShen, jiShen, strongWeak);
    
    return {
      strategy: 'bazi-based',
      confidence: baziResult.confidence * 0.95,
      xiYongShen: {
        primary: xiYongShen.slice(0, 2),
        secondary: xiYongShen.slice(2),
        reasoning: [
          `日主${dayMasterWuxing}，八字${strongWeak === 'strong' ? '偏强' : strongWeak === 'weak' ? '偏弱' : '平衡'}`,
          `根据八字强弱确定喜用神为：${xiYongShen.join('、')}`,
          `用神作用：${this.explainXiYongShenRole(xiYongShen, strongWeak)}`
        ]
      },
      jiShen: {
        primary: jiShen.slice(0, 2),
        secondary: jiShen.slice(2),
        reasoning: [
          `忌神为：${jiShen.join('、')}`,
          `忌神影响：${this.explainJiShenImpact(jiShen, strongWeak)}`
        ]
      },
      balance,
      namingGuidance,
      alternativeStrategies: this.generateAlternativeStrategies(xiYongShen, jiShen)
    };
  }

  /**
   * 基于季节的五行分析
   */
  private async processSeasonalBased(timeResult: any): Promise<XiYongShenResult> {
    const { year, month } = timeResult.timeInfo;
    
    // 确定季节
    const season = this.determineSeason(month);
    const seasonalElement = this.seasonalWuxing[season] as WuxingElement;
    
    // 基于季节生克关系确定喜用神
    const xiYongShen = this.getSeasonalXiYongShen(seasonalElement);
    const jiShen = this.getSeasonalJiShen(seasonalElement);
    
    // 五行平衡建议
    const balance = this.generateSeasonalBalance(seasonalElement);
    
    return {
      strategy: 'seasonal-based',
      confidence: 0.75,
      xiYongShen: {
        primary: xiYongShen.slice(0, 2),
        secondary: xiYongShen.slice(2),
        reasoning: [
          `出生于${season}季，当令五行为${seasonalElement}`,
          `根据季节特点，建议补充${xiYongShen.join('、')}`,
          `以平衡季节五行的偏盛或不足`
        ]
      },
      jiShen: {
        primary: jiShen,
        secondary: [],
        reasoning: [
          `${season}季忌用过多的${jiShen.join('、')}`,
          `避免加重当季五行的偏盛`
        ]
      },
      balance,
      namingGuidance: {
        preferredElements: xiYongShen,
        avoidedElements: jiShen,
        priorityOrder: this.sortBySeasonalPriority(xiYongShen, seasonalElement),
        flexibilityLevel: 'moderate'
      }
    };
  }

  /**
   * 通用五行平衡策略
   */
  private async processGenericBalance(): Promise<XiYongShenResult> {
    // 使用传统的五行均衡理念
    const balancedElements: WuxingElement[] = ['木', '火', '土', '金', '水'];
    
    // 温和的五行建议
    const preferredElements: WuxingElement[] = ['木', '水']; // 木水为生发之源
    const neutralElements: WuxingElement[] = ['土', '金'];   // 土金为稳重之基
    const cautiousElements: WuxingElement[] = ['火'];        // 火需慎用，易过旺
    
    return {
      strategy: 'generic-balance',
      confidence: 0.6,
      xiYongShen: {
        primary: preferredElements,
        secondary: neutralElements,
        reasoning: [
          '采用通用五行平衡策略',
          '木水为生发之源，有利成长发展',
          '土金为稳重之基，助人品格端正',
          '五行搭配以平和为主'
        ]
      },
      jiShen: {
        primary: [],
        secondary: cautiousElements,
        reasoning: [
          '火性偏烈，命名时需适度使用',
          '避免单一五行过重，保持平衡'
        ]
      },
      balance: {
        strengthen: preferredElements,
        weaken: [],
        maintain: neutralElements
      },
      namingGuidance: {
        preferredElements: [...preferredElements, ...neutralElements],
        avoidedElements: [],
        priorityOrder: ['木', '水', '土', '金', '火'],
        flexibilityLevel: 'flexible'
      },
      alternativeStrategies: [
        {
          name: '文雅型',
          elements: ['木', '水'],
          description: '以木水为主，寓意智慧与成长',
          confidence: 0.8
        },
        {
          name: '稳重型',
          elements: ['土', '金'],
          description: '以土金为主，寓意踏实与坚毅',
          confidence: 0.8
        },
        {
          name: '均衡型',
          elements: ['木', '火', '土', '金', '水'],
          description: '五行均衡，全面发展',
          confidence: 0.7
        }
      ]
    };
  }

  /**
   * 转换为标准五行元素
   */
  private convertToWuxingElements(elements: string[]): WuxingElement[] {
    const elementMap: Record<string, WuxingElement> = {
      'jin': '金', '金': '金',
      'mu': '木', '木': '木',
      'shui': '水', '水': '水',
      'huo': '火', '火': '火',
      'tu': '土', '土': '土'
    };
    
    return elements.map(el => elementMap[el]).filter(Boolean) as WuxingElement[];
  }

  /**
   * 分析八字五行平衡
   */
  private analyzeBaZiBalance(dayMaster: string, strongWeak: string, wuxingCount: any) {
    const strengthen: WuxingElement[] = [];
    const weaken: WuxingElement[] = [];
    const maintain: WuxingElement[] = [];
    
    if (strongWeak === 'strong') {
      // 身强需要泄耗
      strengthen.push(...this.getOvercomingElements(dayMaster as WuxingElement));
      weaken.push(dayMaster as WuxingElement);
    } else if (strongWeak === 'weak') {
      // 身弱需要生扶
      strengthen.push(dayMaster as WuxingElement);
      strengthen.push(...this.getGeneratingElements(dayMaster as WuxingElement));
      weaken.push(...this.getOvercomingElements(dayMaster as WuxingElement));
    } else {
      // 平衡时维持现状
      maintain.push(dayMaster as WuxingElement);
    }
    
    return { strengthen, weaken, maintain };
  }

  /**
   * 生成八字命名指导
   */
  private generateBaZiNamingGuidance(xiYongShen: WuxingElement[], jiShen: WuxingElement[], strongWeak: string) {
    return {
      preferredElements: xiYongShen,
      avoidedElements: jiShen,
      priorityOrder: this.sortByBaZiPriority(xiYongShen, strongWeak),
      flexibilityLevel: strongWeak === 'balanced' ? 'flexible' as const : 'strict' as const
    };
  }

  /**
   * 确定季节
   */
  private determineSeason(month: number): keyof typeof this.seasonalWuxing {
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  /**
   * 获取季节喜用神
   */
  private getSeasonalXiYongShen(seasonalElement: WuxingElement): WuxingElement[] {
    // 根据季节调候的需要
    const seasonalNeeds: Record<WuxingElement, WuxingElement[]> = {
      '木': ['水', '土'], // 春季木旺，需水润土培
      '火': ['木', '水'], // 夏季火旺，需木助水润
      '金': ['土', '水'], // 秋季金旺，需土生水润
      '水': ['金', '土'], // 冬季水旺，需金生土堤
      '土': ['火', '金']   // 土季需火暖金秀
    };
    
    return seasonalNeeds[seasonalElement] || [];
  }

  /**
   * 获取季节忌神
   */
  private getSeasonalJiShen(seasonalElement: WuxingElement): WuxingElement[] {
    // 避免加重当季过旺的五行
    return [seasonalElement];
  }

  /**
   * 生成季节五行平衡
   */
  private generateSeasonalBalance(seasonalElement: WuxingElement) {
    const strengthen = this.getSeasonalXiYongShen(seasonalElement);
    const weaken = [seasonalElement];
    const maintain = (['木', '火', '土', '金', '水'] as WuxingElement[])
      .filter(el => !strengthen.includes(el) && !weaken.includes(el));
    
    return { strengthen, weaken, maintain };
  }

  /**
   * 获取相生元素
   */
  private getGeneratingElements(element: WuxingElement): WuxingElement[] {
    const generators: Record<WuxingElement, WuxingElement> = {
      '金': '土',
      '木': '水', 
      '水': '金',
      '火': '木',
      '土': '火'
    };
    
    return [generators[element]].filter(Boolean);
  }

  /**
   * 获取相克元素
   */
  private getOvercomingElements(element: WuxingElement): WuxingElement[] {
    const overcomers: Record<WuxingElement, WuxingElement> = {
      '金': '火',
      '木': '金',
      '水': '土',
      '火': '水',
      '土': '木'
    };
    
    return [overcomers[element]].filter(Boolean);
  }

  /**
   * 按八字优先级排序
   */
  private sortByBaZiPriority(elements: WuxingElement[], strongWeak: string): WuxingElement[] {
    // 根据八字强弱调整优先级
    if (strongWeak === 'strong') {
      // 身强优先用克泄
      return [...elements].sort((a, b) => {
        const aIsOvercoming = Object.values(this.wuxingRelations.overcome).includes(a);
        const bIsOvercoming = Object.values(this.wuxingRelations.overcome).includes(b);
        return bIsOvercoming ? 1 : aIsOvercoming ? -1 : 0;
      });
    }
    
    return elements;
  }

  /**
   * 按季节优先级排序
   */
  private sortBySeasonalPriority(elements: WuxingElement[], seasonalElement: WuxingElement): WuxingElement[] {
    // 调候用神优先
    return [...elements].sort((a, b) => {
      const aIsGenerator = this.wuxingRelations.generate[seasonalElement as keyof typeof this.wuxingRelations.generate] === a;
      const bIsGenerator = this.wuxingRelations.generate[seasonalElement as keyof typeof this.wuxingRelations.generate] === b;
      return bIsGenerator ? 1 : aIsGenerator ? -1 : 0;
    });
  }

  /**
   * 解释喜用神作用
   */
  private explainXiYongShenRole(xiYongShen: WuxingElement[], strongWeak: string): string {
    if (strongWeak === 'strong') {
      return '泄耗日主过旺之气，使命局趋于平和';
    } else if (strongWeak === 'weak') {
      return '生扶日主不足之力，增强命局能量';
    } else {
      return '维持命局现有平衡，稳定五行流通';
    }
  }

  /**
   * 解释忌神影响
   */
  private explainJiShenImpact(jiShen: WuxingElement[], strongWeak: string): string {
    if (strongWeak === 'strong') {
      return '进一步增强日主，使命局失衡';
    } else if (strongWeak === 'weak') {
      return '继续削弱日主，加重命局不平';
    } else {
      return '破坏现有平衡，扰乱五行流通';
    }
  }

  /**
   * 生成备选策略
   */
  private generateAlternativeStrategies(xiYongShen: WuxingElement[], jiShen: WuxingElement[]) {
    return [
      {
        name: '主用神策略',
        elements: xiYongShen.slice(0, 1),
        description: '专注使用主要喜用神',
        confidence: 0.9
      },
      {
        name: '辅助用神策略', 
        elements: xiYongShen.slice(1),
        description: '使用次要喜用神作为补充',
        confidence: 0.8
      },
      {
        name: '平衡策略',
        elements: xiYongShen,
        description: '综合使用所有喜用神',
        confidence: 0.85
      }
    ];
  }

  /**
   * 生成总体建议
   */
  private generateRecommendations(result: XiYongShenResult): string[] {
    const recommendations: string[] = [];
    
    recommendations.push(`采用${result.strategy}策略分析五行喜忌`);
    
    if (result.xiYongShen.primary.length > 0) {
      recommendations.push(`主要喜用神：${result.xiYongShen.primary.join('、')}`);
    }
    
    if (result.jiShen.primary.length > 0) {
      recommendations.push(`主要忌神：${result.jiShen.primary.join('、')}`);
    }
    
    recommendations.push(`灵活性等级：${result.namingGuidance.flexibilityLevel}`);
    
    if (result.alternativeStrategies && result.alternativeStrategies.length > 0) {
      recommendations.push(`可选策略：${result.alternativeStrategies.map(s => s.name).join('、')}`);
    }
    
    return recommendations;
  }

  /**
   * 验证输入数据
   */
  validate(input: StandardInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!input.context.pluginResults.has('birth-time')) {
      errors.push('五行喜用神分析需要出生时间插件的结果');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 销毁插件，清理资源
   */
  async destroy(): Promise<void> {
    console.log('五行喜用神插件销毁完成');
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
    const isHealthy = this.config !== null;
    
    return {
      status: isHealthy ? 'healthy' : 'degraded',
      message: isHealthy ? '插件运行正常' : '插件未完全初始化',
      lastCheck: Date.now()
    };
  }
}
