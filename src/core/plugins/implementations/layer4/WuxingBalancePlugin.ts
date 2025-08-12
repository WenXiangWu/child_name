/**
 * 五行平衡插件 - 综合分析姓氏和字符的五行属性，评估五行平衡状况
 */

import { 
  NamingPlugin, 
  StandardInput, 
  StandardOutput, 
  PluginConfig, 
  PluginContext,
  ValidationResult,
  HealthStatus,
  PluginDependency
} from '../../interfaces/NamingPlugin';
import { QimingDataLoader } from '../../../common/data-loader';

// 五行平衡相关类型定义
interface WuxingDistribution {
  jin: number;    // 金
  mu: number;     // 木
  shui: number;   // 水
  huo: number;    // 火
  tu: number;     // 土
}

interface WuxingElement {
  element: string;
  strength: number;
  source: string; // 'surname' | 'character' | 'stroke' | 'pronunciation'
  details: string;
}

interface WuxingRelationship {
  type: 'sheng' | 'ke' | 'neutral'; // 相生、相克、中性
  from: string;
  to: string;
  strength: number;
  description: string;
}

interface BalanceAnalysis {
  distribution: WuxingDistribution;
  dominantElements: string[];
  weakElements: string[];
  missingElements: string[];
  balanceScore: number;
  balanceLevel: 'excellent' | 'good' | 'average' | 'poor' | 'bad';
}

interface WuxingFlow {
  shengChain: WuxingRelationship[]; // 相生链
  keChain: WuxingRelationship[];   // 相克链
  flowScore: number;
  flowDescription: string;
}

interface WuxingConflicts {
  conflicts: WuxingRelationship[];
  severity: 'low' | 'medium' | 'high';
  solutions: string[];
}

interface OptimizationSuggestion {
  target: string;
  method: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  expectedImprovement: number;
}

interface BalanceStrategy {
  type: 'xiyong-based' | 'generic-balance' | 'missing-supplement';
  confidence: number;
  description: string;
  targetElements: string[];
  avoidElements: string[];
}

interface WuxingBalanceResults {
  elements: WuxingElement[];
  balance: BalanceAnalysis;
  flow: WuxingFlow;
  conflicts: WuxingConflicts;
  strategy: BalanceStrategy;
  optimization: OptimizationSuggestion[];
  recommendations: string[];
}

export class WuxingBalancePlugin implements NamingPlugin {
  readonly id = 'wuxing-balance';
  readonly version = '1.0.0';
  readonly layer = 4;
  readonly dependencies: PluginDependency[] = [
    { pluginId: 'surname', required: true },
    { pluginId: 'wuxing-char', required: true },
    { pluginId: 'xiyongshen', required: false } // 可选依赖
  ];
  readonly metadata = {
    name: '五行平衡插件',
    description: '综合分析姓氏、字符、笔画等多维度五行属性，评估整体五行平衡状况并提供优化建议',
    author: 'Qiming System',
    tags: ['wuxing', 'balance', 'harmony', 'optimization']
  };

  private dataLoader!: QimingDataLoader;
  private initialized = false;

  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    try {
      this.dataLoader = QimingDataLoader.getInstance();
      await this.dataLoader.preloadCoreData();
      
      this.initialized = true;
      context.log?.('info', `${this.id} 插件初始化成功`);
    } catch (error) {
      context.log?.('error', `${this.id} 插件初始化失败: ${error}`);
      throw error;
    }
  }

  async process(input: StandardInput): Promise<StandardOutput> {
    if (!this.initialized) {
      throw new Error('插件未初始化');
    }

    try {
      // 获取姓氏数据
      const surnameResult = input.context.pluginResults.get('surname');
      if (!surnameResult) {
        throw new Error('缺少姓氏信息，请确保姓氏插件已执行');
      }

      // 获取字符五行数据
      const wuxingCharResult = input.context.pluginResults.get('wuxing-char');
      if (!wuxingCharResult) {
        throw new Error('缺少字符五行信息，请确保字符五行插件已执行');
      }

      // 获取喜用神数据（可选）
      const xiyongResult = input.context.pluginResults.get('xiyongshen');

      // 分析五行平衡
      const results = await this.analyzeWuxingBalance(
        surnameResult,
        wuxingCharResult,
        xiyongResult
      );

      // 计算置信度
      const confidence = this.calculateConfidence(xiyongResult);

      return {
        pluginId: this.id,
        results,
        confidence,
        metadata: {
          processingTime: Date.now(),
          strategy: results.strategy.type,
          hasXiYongData: !!xiyongResult
        }
      };

    } catch (error) {
      throw new Error(`五行平衡分析失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  validate(input: StandardInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查姓氏数据
    const surnameResult = input.context.pluginResults.get('surname');
    if (!surnameResult) {
      errors.push('缺少姓氏信息，请确保姓氏插件已执行');
    }

    // 检查字符五行数据
    const wuxingCharResult = input.context.pluginResults.get('wuxing-char');
    if (!wuxingCharResult) {
      errors.push('缺少字符五行信息，请确保字符五行插件已执行');
    }

    // 检查喜用神数据（可选）
    const xiyongResult = input.context.pluginResults.get('xiyongshen');
    if (!xiyongResult) {
      warnings.push('缺少喜用神信息，将使用通用平衡策略');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  async destroy(): Promise<void> {
    this.initialized = false;
  }

  isAvailable(): boolean {
    return this.initialized && !!this.dataLoader;
  }

  getHealthStatus(): HealthStatus {
    return {
      status: this.initialized ? 'healthy' : 'unhealthy',
      message: this.initialized ? '五行平衡插件运行正常' : '插件未初始化',
      lastCheck: Date.now(),
      details: {
        initialized: this.initialized,
        dataLoaderAvailable: !!this.dataLoader
      }
    };
  }

  /**
   * 分析五行平衡
   */
  private async analyzeWuxingBalance(
    surnameData: any,
    wuxingCharData: any,
    xiyongData?: any
  ): Promise<WuxingBalanceResults> {
    // 收集所有五行元素
    const elements = this.collectWuxingElements(surnameData, wuxingCharData);
    
    // 分析五行分布和平衡
    const balance = this.analyzeBalance(elements);
    
    // 分析五行流转
    const flow = this.analyzeWuxingFlow(elements);
    
    // 检测五行冲突
    const conflicts = this.detectConflicts(elements);
    
    // 确定平衡策略
    const strategy = this.determineBalanceStrategy(xiyongData, balance);
    
    // 生成优化建议
    const optimization = this.generateOptimization(balance, flow, conflicts, strategy);
    
    // 生成总体建议
    const recommendations = this.generateBalanceRecommendations(
      balance, flow, conflicts, strategy, optimization
    );

    return {
      elements,
      balance,
      flow,
      conflicts,
      strategy,
      optimization,
      recommendations
    };
  }

  /**
   * 收集五行元素
   */
  private collectWuxingElements(surnameData: any, wuxingCharData: any): WuxingElement[] {
    const elements: WuxingElement[] = [];

    // 姓氏五行
    if (surnameData.wuxing) {
      elements.push({
        element: surnameData.wuxing,
        strength: 2.0, // 姓氏权重较高
        source: 'surname',
        details: `姓氏"${surnameData.surname}"的五行属性`
      });
    }

    // 字符五行
    if (wuxingCharData.characterWuxing) {
      wuxingCharData.characterWuxing.forEach((charWuxing: any, index: number) => {
        elements.push({
          element: charWuxing.primaryWuxing,
          strength: 1.5, // 字符权重中等
          source: 'character',
          details: `字符"${charWuxing.character}"的主要五行属性`
        });

        // 次要五行（如果有）
        if (charWuxing.secondaryWuxing) {
          elements.push({
            element: charWuxing.secondaryWuxing,
            strength: 0.8,
            source: 'character',
            details: `字符"${charWuxing.character}"的次要五行属性`
          });
        }
      });
    }

    return elements;
  }

  /**
   * 分析五行平衡
   */
  private analyzeBalance(elements: WuxingElement[]): BalanceAnalysis {
    // 计算五行分布
    const distribution: WuxingDistribution = {
      jin: 0, mu: 0, shui: 0, huo: 0, tu: 0
    };

    elements.forEach(element => {
      const wuxingKey = this.getWuxingKey(element.element);
      if (wuxingKey) {
        distribution[wuxingKey] += element.strength;
      }
    });

    // 标准化分布（总和为100）
    const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
    if (total > 0) {
      Object.keys(distribution).forEach(key => {
        distribution[key as keyof WuxingDistribution] = 
          (distribution[key as keyof WuxingDistribution] / total) * 100;
      });
    }

    // 分析强弱元素
    const distributionArray = Object.entries(distribution)
      .map(([element, strength]) => ({ element: this.getWuxingName(element), strength }))
      .sort((a, b) => b.strength - a.strength);

    const dominantElements = distributionArray
      .filter(item => item.strength > 25)
      .map(item => item.element);

    const weakElements = distributionArray
      .filter(item => item.strength > 0 && item.strength < 15)
      .map(item => item.element);

    const missingElements = distributionArray
      .filter(item => item.strength === 0)
      .map(item => item.element);

    // 计算平衡评分
    const balanceScore = this.calculateBalanceScore(distribution);
    const balanceLevel = this.getBalanceLevel(balanceScore);

    return {
      distribution,
      dominantElements,
      weakElements,
      missingElements,
      balanceScore,
      balanceLevel
    };
  }

  /**
   * 获取五行键名
   */
  private getWuxingKey(wuxing: string): keyof WuxingDistribution | null {
    const wuxingMap: Record<string, keyof WuxingDistribution> = {
      '金': 'jin', '木': 'mu', '水': 'shui', '火': 'huo', '土': 'tu'
    };
    return wuxingMap[wuxing] || null;
  }

  /**
   * 获取五行中文名
   */
  private getWuxingName(key: string): string {
    const nameMap: Record<string, string> = {
      'jin': '金', 'mu': '木', 'shui': '水', 'huo': '火', 'tu': '土'
    };
    return nameMap[key] || key;
  }

  /**
   * 计算平衡评分
   */
  private calculateBalanceScore(distribution: WuxingDistribution): number {
    const ideal = 20; // 理想情况下每个五行占20%
    let deviation = 0;

    Object.values(distribution).forEach(value => {
      deviation += Math.abs(value - ideal);
    });

    // 评分：偏差越小分数越高
    const score = Math.max(0, 100 - deviation);
    return Math.round(score);
  }

  /**
   * 获取平衡等级
   */
  private getBalanceLevel(score: number): BalanceAnalysis['balanceLevel'] {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'average';
    if (score >= 40) return 'poor';
    return 'bad';
  }

  /**
   * 分析五行流转
   */
  private analyzeWuxingFlow(elements: WuxingElement[]): WuxingFlow {
    const shengChain: WuxingRelationship[] = [];
    const keChain: WuxingRelationship[] = [];

    // 五行相生相克关系
    const shengRelation: Record<string, string> = {
      '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
    };

    const keRelation: Record<string, string> = {
      '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
    };

    // 分析相生关系
    elements.forEach((from, i) => {
      elements.forEach((to, j) => {
        if (i !== j) {
          if (shengRelation[from.element] === to.element) {
            shengChain.push({
              type: 'sheng',
              from: from.element,
              to: to.element,
              strength: Math.min(from.strength, to.strength),
              description: `${from.element}生${to.element}，有利于能量流转`
            });
          } else if (keRelation[from.element] === to.element) {
            keChain.push({
              type: 'ke',
              from: from.element,
              to: to.element,
              strength: Math.min(from.strength, to.strength),
              description: `${from.element}克${to.element}，可能产生冲突`
            });
          }
        }
      });
    });

    // 计算流转评分
    const shengScore = shengChain.reduce((sum, rel) => sum + rel.strength, 0) * 2;
    const keScore = keChain.reduce((sum, rel) => sum + rel.strength, 0);
    const flowScore = Math.max(0, Math.min(100, shengScore - keScore + 50));

    // 生成流转描述
    let flowDescription = '';
    if (shengChain.length > keChain.length) {
      flowDescription = '五行相生关系较强，能量流转顺畅，有利于发展';
    } else if (keChain.length > shengChain.length) {
      flowDescription = '五行相克关系较强，存在冲突，需要调和';
    } else {
      flowDescription = '五行生克平衡，整体流转平稳';
    }

    return {
      shengChain,
      keChain,
      flowScore: Math.round(flowScore),
      flowDescription
    };
  }

  /**
   * 检测五行冲突
   */
  private detectConflicts(elements: WuxingElement[]): WuxingConflicts {
    const conflicts: WuxingRelationship[] = [];
    
    // 检测强烈的相克关系
    const keRelation: Record<string, string> = {
      '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
    };

    elements.forEach(from => {
      elements.forEach(to => {
        if (from !== to && keRelation[from.element] === to.element) {
          const conflict: WuxingRelationship = {
            type: 'ke',
            from: from.element,
            to: to.element,
            strength: Math.min(from.strength, to.strength),
            description: `${from.element}强烈克制${to.element}，可能影响平衡`
          };
          
          // 只记录强度较高的冲突
          if (conflict.strength > 1.0) {
            conflicts.push(conflict);
          }
        }
      });
    });

    // 确定冲突严重程度
    let severity: WuxingConflicts['severity'];
    const totalConflictStrength = conflicts.reduce((sum, c) => sum + c.strength, 0);
    
    if (totalConflictStrength > 5) severity = 'high';
    else if (totalConflictStrength > 2) severity = 'medium';
    else severity = 'low';

    // 生成解决方案
    const solutions = this.generateConflictSolutions(conflicts, severity);

    return {
      conflicts,
      severity,
      solutions
    };
  }

  /**
   * 生成冲突解决方案
   */
  private generateConflictSolutions(
    conflicts: WuxingRelationship[], 
    severity: WuxingConflicts['severity']
  ): string[] {
    const solutions: string[] = [];

    if (conflicts.length === 0) {
      solutions.push('五行关系和谐，无需特别调整');
      return solutions;
    }

    // 通用解决方案
    solutions.push('可以通过以下方式缓解五行冲突：');

    // 具体解决方案
    const conflictElements = new Set<string>();
    conflicts.forEach(conflict => {
      conflictElements.add(conflict.from);
      conflictElements.add(conflict.to);
    });

    // 五行相生的调和元素
    const mediationMap: Record<string, string> = {
      '木土': '火', // 木克土，用火调和（木生火生土）
      '火金': '土', // 火克金，用土调和（火生土生金）
      '土水': '金', // 土克水，用金调和（土生金生水）
      '金木': '水', // 金克木，用水调和（金生水生木）
      '水火': '木'  // 水克火，用木调和（水生木生火）
    };

    conflicts.forEach(conflict => {
      const key = `${conflict.from}${conflict.to}`;
      const mediator = mediationMap[key];
      if (mediator) {
        solutions.push(`增强${mediator}元素来调和${conflict.from}克${conflict.to}的冲突`);
      }
    });

    // 根据严重程度添加建议
    if (severity === 'high') {
      solutions.push('冲突较为严重，建议重新考虑字符组合');
    } else if (severity === 'medium') {
      solutions.push('存在一定冲突，可通过后天调养来改善');
    }

    return solutions;
  }

  /**
   * 确定平衡策略
   */
  private determineBalanceStrategy(xiyongData: any, balance: BalanceAnalysis): BalanceStrategy {
    if (xiyongData && xiyongData.confidence > 0.7) {
      // 有可靠的喜用神数据，使用喜用神策略
      return {
        type: 'xiyong-based',
        confidence: xiyongData.confidence,
        description: '基于八字喜用神的五行平衡策略',
        targetElements: xiyongData.favorableElements || [],
        avoidElements: xiyongData.unfavorableElements || []
      };
    } else if (balance.missingElements.length > 0) {
      // 有缺失元素，使用补缺策略
      return {
        type: 'missing-supplement',
        confidence: 0.7,
        description: '补足缺失五行元素的平衡策略',
        targetElements: balance.missingElements,
        avoidElements: balance.dominantElements
      };
    } else {
      // 使用通用平衡策略
      return {
        type: 'generic-balance',
        confidence: 0.6,
        description: '通用五行平衡策略，追求均衡发展',
        targetElements: balance.weakElements,
        avoidElements: balance.dominantElements.slice(0, 2) // 只避免最强的两个
      };
    }
  }

  /**
   * 生成优化建议
   */
  private generateOptimization(
    balance: BalanceAnalysis,
    flow: WuxingFlow,
    conflicts: WuxingConflicts,
    strategy: BalanceStrategy
  ): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // 平衡优化建议
    if (balance.balanceLevel === 'poor' || balance.balanceLevel === 'bad') {
      suggestions.push({
        target: '五行平衡',
        method: '调整字符选择',
        description: `当前五行分布不均，建议${strategy.description}`,
        priority: 'high',
        expectedImprovement: 25
      });
    }

    // 流转优化建议
    if (flow.flowScore < 60) {
      suggestions.push({
        target: '五行流转',
        method: '增强相生关系',
        description: '通过选择相生的五行组合来改善能量流转',
        priority: 'medium',
        expectedImprovement: 20
      });
    }

    // 冲突解决建议
    if (conflicts.severity === 'high' || conflicts.severity === 'medium') {
      suggestions.push({
        target: '五行冲突',
        method: '引入调和元素',
        description: '使用中间五行元素来调和相克关系',
        priority: conflicts.severity === 'high' ? 'high' : 'medium',
        expectedImprovement: 15
      });
    }

    // 策略性建议
    if (strategy.targetElements.length > 0) {
      suggestions.push({
        target: '策略优化',
        method: '针对性增强',
        description: `重点加强${strategy.targetElements.join('、')}元素`,
        priority: 'medium',
        expectedImprovement: 18
      });
    }

    return suggestions;
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(xiyongData: any): number {
    if (!xiyongData) return 0.6; // 通用策略置信度
    return Math.min(0.95, xiyongData.confidence * 1.1);
  }

  /**
   * 生成平衡建议
   */
  private generateBalanceRecommendations(
    balance: BalanceAnalysis,
    flow: WuxingFlow,
    conflicts: WuxingConflicts,
    strategy: BalanceStrategy,
    optimization: OptimizationSuggestion[]
  ): string[] {
    const recommendations: string[] = [];

    // 总体评估
    recommendations.push(`五行平衡评分：${balance.balanceScore}分（${this.getBalanceLevelDescription(balance.balanceLevel)}）`);

    // 分布分析
    if (balance.dominantElements.length > 0) {
      recommendations.push(`优势五行：${balance.dominantElements.join('、')}，特质明显`);
    }
    
    if (balance.weakElements.length > 0) {
      recommendations.push(`薄弱五行：${balance.weakElements.join('、')}，需要加强`);
    }
    
    if (balance.missingElements.length > 0) {
      recommendations.push(`缺失五行：${balance.missingElements.join('、')}，建议补足`);
    }

    // 流转分析
    recommendations.push(`五行流转：${flow.flowDescription}`);

    // 冲突提醒
    if (conflicts.conflicts.length > 0) {
      recommendations.push(`五行冲突：存在${conflicts.severity}程度冲突，${conflicts.solutions[0]}`);
    }

    // 策略建议
    recommendations.push(`平衡策略：${strategy.description}`);

    // 优化建议
    const highPriorityOptimizations = optimization.filter(opt => opt.priority === 'high');
    if (highPriorityOptimizations.length > 0) {
      recommendations.push(`重点改进：${highPriorityOptimizations[0].description}`);
    }

    return recommendations;
  }

  /**
   * 获取平衡等级描述
   */
  private getBalanceLevelDescription(level: BalanceAnalysis['balanceLevel']): string {
    const descriptions = {
      'excellent': '极佳',
      'good': '良好',
      'average': '一般',
      'poor': '欠佳',
      'bad': '不佳'
    };
    return descriptions[level];
  }
}
