/**
 * 五行平衡评分插件
 * Layer 6: 名字评分层
 * 
 * 功能：对名字的五行平衡性进行评分
 * 依赖：name-combination (Layer 5), bazi (Layer 2)
 */

import { 
  Layer6Plugin, 
  StandardInput, 
  PluginOutput, 
  PluginContext, 
  ValidationResult,
  PluginMetadata,
  PluginDependency,
  PluginConfig
} from '../../interfaces/NamingPlugin';

export class WuxingBalanceScoringPlugin implements Layer6Plugin {
  readonly id = 'wuxing-balance-scoring';
  readonly version = '1.0.0';
  readonly layer = 6 as const;
  readonly category = 'scoring' as const;
  readonly dependencies: PluginDependency[] = [
    { pluginId: 'name-combination', required: true },
    { pluginId: 'bazi', required: false }
  ];
  readonly metadata: PluginMetadata = {
    name: '五行平衡评分插件',
    description: '对名字的五行平衡性进行评分，结合八字分析',
    author: 'Qiming Plugin System',
    category: 'scoring' as const,
    tags: ['wuxing', 'balance', 'scoring', 'layer6']
  };

  private initialized = false;

  constructor() {}

  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    this.initialized = true;
  }

  async validate(input: StandardInput): Promise<ValidationResult> {
    if (!input.familyName) {
      return {
        valid: false,
        errors: ['缺少姓氏信息']
      };
    }

    return {
      valid: true,
      errors: []
    };
  }

  async process(input: StandardInput, context: PluginContext): Promise<PluginOutput> {
    const startTime = Date.now();
    
    try {
      if (!this.initialized) {
        throw new Error('插件未初始化');
      }

      context.log?.('info', '开始五行平衡评分分析');
      
      // 获取八字分析结果
      const baziData = this.getBaziData(context);
      
      // 从name-combination插件获取名字候选
      const nameCandidates = this.getNameCandidatesFromContext(context);
      
      // 执行五行平衡评分
      const scoredCandidates = this.performWuxingBalanceScoring(nameCandidates, baziData, input);
      
      const result = {
        scoredCandidates,
        wuxingAnalysis: this.generateWuxingAnalysis(scoredCandidates, baziData),
        balanceReport: this.generateBalanceReport(scoredCandidates)
      };

      return {
        success: true,
        data: result,
        confidence: 0.95,
        executionTime: Date.now() - startTime,
        metadata: {
          pluginId: this.id,
          layer: this.layer,
          processingTime: Date.now() - startTime,
          candidatesProcessed: nameCandidates.length,
          hasBaziData: !!baziData
        }
      };
    } catch (error) {
      context.log?.('error', `五行平衡评分失败: ${error}`);
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
   * 获取八字数据
   */
  private getBaziData(context: PluginContext) {
    const baziResult = (context as any).pluginResults?.get('bazi');
    return baziResult?.data || null;
  }

  /**
   * 从上下文获取名字候选
   */
  private getNameCandidatesFromContext(context: PluginContext) {
    const nameCombinationResult = (context as any).pluginResults?.get('name-combination');
    
    if (nameCombinationResult?.data?.nameCandidates) {
      return nameCombinationResult.data.nameCandidates;
    }
    
    return [];
  }

  /**
   * 执行五行平衡评分
   */
  private performWuxingBalanceScoring(candidates: any[], baziData: any, input: StandardInput) {
    return candidates.map(candidate => {
      const wuxingScore = this.calculateWuxingBalanceScore(candidate, baziData);
      
      return {
        ...candidate,
        wuxingBalanceScore: {
          total: wuxingScore.total,
          balance: wuxingScore.balance,
          complement: wuxingScore.complement,
          harmony: wuxingScore.harmony,
          strength: wuxingScore.strength
        }
      };
    });
  }

  /**
   * 计算五行平衡评分
   */
  private calculateWuxingBalanceScore(candidate: any, baziData: any) {
    // 获取名字的五行构成
    const nameWuxing = this.getNameWuxing(candidate);
    
    // 计算五行平衡性
    const balance = this.calculateBalance(nameWuxing);
    
    // 计算与八字的互补性
    const complement = this.calculateComplement(nameWuxing, baziData);
    
    // 计算五行和谐度
    const harmony = this.calculateHarmony(nameWuxing);
    
    // 计算五行强度
    const strength = this.calculateStrength(nameWuxing);
    
    // 综合评分
    const total = Math.round(
      (balance * 0.25 + complement * 0.35 + harmony * 0.25 + strength * 0.15)
    );
    
    return {
      total,
      balance,
      complement,
      harmony,
      strength
    };
  }

  /**
   * 获取名字的五行构成
   */
  private getNameWuxing(candidate: any) {
    const components = candidate.components || {};
    const wuxingCount = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    
    // 统计姓氏五行
    if (components.surname?.wuxing) {
      const surnameWuxing = this.normalizeWuxing(components.surname.wuxing);
      if (surnameWuxing) wuxingCount[surnameWuxing]++;
    }
    
    // 统计名字五行
    if (components.first?.wuxing) {
      const firstWuxing = this.normalizeWuxing(components.first.wuxing);
      if (firstWuxing) wuxingCount[firstWuxing]++;
    }
    
    if (components.second?.wuxing) {
      const secondWuxing = this.normalizeWuxing(components.second.wuxing);
      if (secondWuxing) wuxingCount[secondWuxing]++;
    }
    
    return wuxingCount;
  }

  /**
   * 标准化五行名称
   */
  private normalizeWuxing(wuxing: string): 'wood' | 'fire' | 'earth' | 'metal' | 'water' | null {
    const wuxingMapping = {
      '木': 'wood', '火': 'fire', '土': 'earth', '金': 'metal', '水': 'water',
      'wood': 'wood', 'fire': 'fire', 'earth': 'earth', 'metal': 'metal', 'water': 'water'
    } as const;
    
    return wuxingMapping[wuxing as keyof typeof wuxingMapping] || null;
  }
  
  private wuxingMapping = {
    '木': 'wood', '火': 'fire', '土': 'earth', '金': 'metal', '水': 'water'
  } as const;

  /**
   * 计算五行平衡性
   */
  private calculateBalance(wuxingCount: Record<string, number>): number {
    const values = Object.values(wuxingCount);
    const total = values.reduce((sum, count) => sum + count, 0);
    
    if (total === 0) return 50; // 无五行信息时给中等分数
    
    // 计算五行分布的均匀程度
    const average = total / 5;
    const variance = values.reduce((sum, count) => sum + Math.pow(count - average, 2), 0) / 5;
    
    // 方差越小，平衡性越好
    const balanceScore = Math.max(0, 100 - variance * 50);
    
    return Math.round(balanceScore);
  }

  /**
   * 计算与八字的互补性
   */
  private calculateComplement(nameWuxing: Record<string, number>, baziData: any): number {
    if (!baziData?.wuxingBalance) {
      return 70; // 无八字数据时给中等分数
    }
    
    const baziWuxing = baziData.wuxingBalance;
    let complementScore = 60; // 基础分数
    
    // 检查是否补充了缺失的五行
    Object.keys(nameWuxing).forEach(element => {
      const nameCount = nameWuxing[element];
      const baziCount = baziWuxing[element] || 0;
      
      if (nameCount > 0 && baziCount === 0) {
        complementScore += 20; // 补充了缺失的五行
      } else if (nameCount > 0 && baziCount < 2) {
        complementScore += 10; // 加强了薄弱的五行
      }
    });
    
    // 检查是否过度增强了已旺的五行
    Object.keys(nameWuxing).forEach(element => {
      const nameCount = nameWuxing[element];
      const baziCount = baziWuxing[element] || 0;
      
      if (nameCount > 0 && baziCount >= 3) {
        complementScore -= 15; // 过度增强了已旺的五行
      }
    });
    
    return Math.max(0, Math.min(100, complementScore));
  }

  /**
   * 计算五行和谐度
   */
  private calculateHarmony(wuxingCount: Record<string, number>): number {
    let harmonyScore = 70; // 基础分数
    
    // 检查相生关系 (木生火，火生土，土生金，金生水，水生木)
    const shengRelations = [
      ['wood', 'fire'], ['fire', 'earth'], ['earth', 'metal'], ['metal', 'water'], ['water', 'wood']
    ];
    
    shengRelations.forEach(([producer, consumer]) => {
      if (wuxingCount[producer] > 0 && wuxingCount[consumer] > 0) {
        harmonyScore += 8; // 存在相生关系
      }
    });
    
    // 检查相克关系 (木克土，土克水，水克火，火克金，金克木)
    const keRelations = [
      ['wood', 'earth'], ['earth', 'water'], ['water', 'fire'], ['fire', 'metal'], ['metal', 'wood']
    ];
    
    keRelations.forEach(([controller, controlled]) => {
      if (wuxingCount[controller] > 0 && wuxingCount[controlled] > 0) {
        if (wuxingCount[controller] > wuxingCount[controlled]) {
          harmonyScore -= 10; // 相克关系且控制方过强
        } else {
          harmonyScore -= 5; // 一般相克关系
        }
      }
    });
    
    return Math.max(0, Math.min(100, harmonyScore));
  }

  /**
   * 计算五行强度
   */
  private calculateStrength(wuxingCount: Record<string, number>): number {
    const total = Object.values(wuxingCount).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) return 50;
    
    let strengthScore = 60; // 基础分数
    
    // 检查是否有主导五行
    const maxCount = Math.max(...Object.values(wuxingCount));
    const dominantElements = Object.keys(wuxingCount).filter(
      element => wuxingCount[element] === maxCount
    );
    
    if (dominantElements.length === 1 && maxCount >= 2) {
      strengthScore += 20; // 有明确的主导五行
    }
    
    // 检查五行数量是否适中
    if (total >= 2 && total <= 4) {
      strengthScore += 15; // 五行数量适中
    } else if (total === 1) {
      strengthScore -= 10; // 五行过少
    } else if (total >= 5) {
      strengthScore -= 5; // 五行过多可能分散
    }
    
    return Math.max(0, Math.min(100, strengthScore));
  }

  /**
   * 生成五行分析报告
   */
  private generateWuxingAnalysis(scoredCandidates: any[], baziData: any) {
    const totalCandidates = scoredCandidates.length;
    const averageScore = this.calculateAverageWuxingScore(scoredCandidates);
    
    return {
      totalCandidates,
      averageScore,
      baziInfo: baziData ? {
        dayMaster: baziData.dayMaster,
        wuxingBalance: baziData.wuxingBalance,
        usefulGods: baziData.usefulGods,
        avoidGods: baziData.avoidGods
      } : null,
      topBalanced: scoredCandidates
        .sort((a, b) => b.wuxingBalanceScore.total - a.wuxingBalanceScore.total)
        .slice(0, 5)
        .map(c => ({
          name: c.fullName,
          score: c.wuxingBalanceScore.total,
          wuxingComposition: this.getNameWuxing(c)
        }))
    };
  }

  /**
   * 生成平衡报告
   */
  private generateBalanceReport(scoredCandidates: any[]) {
    return {
      excellentBalance: scoredCandidates.filter(c => c.wuxingBalanceScore.balance >= 90).length,
      goodBalance: scoredCandidates.filter(c => c.wuxingBalanceScore.balance >= 80 && c.wuxingBalanceScore.balance < 90).length,
      fairBalance: scoredCandidates.filter(c => c.wuxingBalanceScore.balance >= 70 && c.wuxingBalanceScore.balance < 80).length,
      poorBalance: scoredCandidates.filter(c => c.wuxingBalanceScore.balance < 70).length,
      averageComplement: this.calculateAverageComplement(scoredCandidates),
      averageHarmony: this.calculateAverageHarmony(scoredCandidates)
    };
  }

  /**
   * 计算平均五行分数
   */
  private calculateAverageWuxingScore(scoredCandidates: any[]): number {
    if (scoredCandidates.length === 0) return 0;
    
    const totalScore = scoredCandidates.reduce((sum, candidate) => 
      sum + candidate.wuxingBalanceScore.total, 0
    );
    
    return Math.round(totalScore / scoredCandidates.length);
  }

  /**
   * 计算平均互补性分数
   */
  private calculateAverageComplement(scoredCandidates: any[]): number {
    if (scoredCandidates.length === 0) return 0;
    
    const totalScore = scoredCandidates.reduce((sum, candidate) => 
      sum + candidate.wuxingBalanceScore.complement, 0
    );
    
    return Math.round(totalScore / scoredCandidates.length);
  }

  /**
   * 计算平均和谐度分数
   */
  private calculateAverageHarmony(scoredCandidates: any[]): number {
    if (scoredCandidates.length === 0) return 0;
    
    const totalScore = scoredCandidates.reduce((sum, candidate) => 
      sum + candidate.wuxingBalanceScore.harmony, 0
    );
    
    return Math.round(totalScore / scoredCandidates.length);
  }
}
