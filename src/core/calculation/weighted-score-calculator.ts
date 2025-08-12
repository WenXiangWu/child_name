/**
 * 动态权重评分计算器
 * 根据用户设置的权重比例，计算个性化的名字总评分
 */

import { WeightConfig } from '../common/types';

export interface ScoreComponents {
  sancai: number;      // 三才五格评分 (0-100)
  wuxing: number;      // 五行平衡评分 (0-100)
  sound: number;       // 音韵美感评分 (0-100)
  meaning: number;     // 字义寓意评分 (0-100)
  social: number;      // 社会认可评分 (0-100)
}

export interface DetailedScore {
  totalScore: number;          // 加权总分 (0-100)
  components: ScoreComponents; // 各维度得分
  weights: WeightConfig;       // 应用的权重配置
  breakdown: {                 // 评分明细
    sancai: { score: number; weighted: number; };
    wuxing: { score: number; weighted: number; };
    sound: { score: number; weighted: number; };
    meaning: { score: number; weighted: number; };
    social: { score: number; weighted: number; };
  };
}

/**
 * 默认权重配置
 */
export const DEFAULT_WEIGHTS: WeightConfig = {
  sancai: 25,   // 三才五格
  wuxing: 25,   // 五行平衡
  sound: 20,    // 音韵美感
  meaning: 20,  // 字义寓意
  social: 10,   // 社会认可
};

/**
 * 动态权重评分计算器类
 */
export class WeightedScoreCalculator {
  
  /**
   * 验证权重配置是否有效
   * @param weights 权重配置
   * @returns 是否有效
   */
  private validateWeights(weights: WeightConfig): boolean {
    const total = weights.sancai + weights.wuxing + weights.sound + weights.meaning + weights.social;
    
    // 允许±1的误差，因为滑动条调整可能产生舍入误差
    return Math.abs(total - 100) <= 1;
  }

  /**
   * 标准化权重配置，确保总和为100
   * @param weights 原始权重配置
   * @returns 标准化后的权重配置
   */
  private normalizeWeights(weights: WeightConfig): WeightConfig {
    const total = weights.sancai + weights.wuxing + weights.sound + weights.meaning + weights.social;
    
    if (total === 0) {
      // 如果权重全为0，使用默认权重
      return { ...DEFAULT_WEIGHTS };
    }
    
    // 按比例调整到100
    const factor = 100 / total;
    return {
      sancai: Math.round(weights.sancai * factor),
      wuxing: Math.round(weights.wuxing * factor),
      sound: Math.round(weights.sound * factor),
      meaning: Math.round(weights.meaning * factor),
      social: Math.round(weights.social * factor),
    };
  }

  /**
   * 计算加权总分
   * @param components 各维度评分
   * @param weights 权重配置
   * @returns 加权总分 (0-100)
   */
  calculateWeightedScore(components: ScoreComponents, weights?: WeightConfig): number {
    const normalizedWeights = weights ? this.normalizeWeights(weights) : DEFAULT_WEIGHTS;
    
    const weightedScore = (
      (components.sancai * normalizedWeights.sancai / 100) +
      (components.wuxing * normalizedWeights.wuxing / 100) +
      (components.sound * normalizedWeights.sound / 100) +
      (components.meaning * normalizedWeights.meaning / 100) +
      (components.social * normalizedWeights.social / 100)
    );
    
    // 确保结果在0-100范围内
    return Math.max(0, Math.min(100, Math.round(weightedScore)));
  }

  /**
   * 计算详细评分信息
   * @param components 各维度评分
   * @param weights 权重配置
   * @returns 详细评分信息
   */
  calculateDetailedScore(components: ScoreComponents, weights?: WeightConfig): DetailedScore {
    const normalizedWeights = weights ? this.normalizeWeights(weights) : DEFAULT_WEIGHTS;
    
    const breakdown = {
      sancai: {
        score: components.sancai,
        weighted: Math.round(components.sancai * normalizedWeights.sancai / 100 * 100) / 100
      },
      wuxing: {
        score: components.wuxing,
        weighted: Math.round(components.wuxing * normalizedWeights.wuxing / 100 * 100) / 100
      },
      sound: {
        score: components.sound,
        weighted: Math.round(components.sound * normalizedWeights.sound / 100 * 100) / 100
      },
      meaning: {
        score: components.meaning,
        weighted: Math.round(components.meaning * normalizedWeights.meaning / 100 * 100) / 100
      },
      social: {
        score: components.social,
        weighted: Math.round(components.social * normalizedWeights.social / 100 * 100) / 100
      }
    };
    
    const totalScore = breakdown.sancai.weighted + breakdown.wuxing.weighted + 
                      breakdown.sound.weighted + breakdown.meaning.weighted + 
                      breakdown.social.weighted;
    
    return {
      totalScore: Math.max(0, Math.min(100, Math.round(totalScore))),
      components,
      weights: normalizedWeights,
      breakdown
    };
  }

  /**
   * 批量计算名字评分
   * @param nameScores 名字和对应的各维度评分数组
   * @param weights 权重配置
   * @returns 按加权总分排序的结果
   */
  batchCalculateScores<T extends { components: ScoreComponents }>(
    nameScores: T[],
    weights?: WeightConfig
  ): (T & { weightedScore: number; detailedScore: DetailedScore })[] {
    const normalizedWeights = weights ? this.normalizeWeights(weights) : DEFAULT_WEIGHTS;
    
    return nameScores
      .map(item => ({
        ...item,
        weightedScore: this.calculateWeightedScore(item.components, normalizedWeights),
        detailedScore: this.calculateDetailedScore(item.components, normalizedWeights)
      }))
      .sort((a, b) => b.weightedScore - a.weightedScore);
  }

  /**
   * 获取评分等级描述
   * @param score 总评分
   * @returns 等级描述
   */
  getScoreLevel(score: number): string {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好'; 
    if (score >= 70) return '一般';
    if (score >= 60) return '及格';
    return '需要改进';
  }

  /**
   * 生成评分解释
   * @param detailedScore 详细评分信息
   * @returns 评分解释文本
   */
  generateScoreExplanation(detailedScore: DetailedScore): string {
    const { totalScore, breakdown, weights } = detailedScore;
    const level = this.getScoreLevel(totalScore);
    
    const explanations: string[] = [
      `总评分：${totalScore}分 (${level})`
    ];
    
    // 找出贡献最大的维度
    const maxContribution = Math.max(
      breakdown.sancai.weighted,
      breakdown.wuxing.weighted,
      breakdown.sound.weighted,
      breakdown.meaning.weighted,
      breakdown.social.weighted
    );
    
    const dimensionNames = {
      sancai: '三才五格',
      wuxing: '五行平衡',
      sound: '音韵美感',
      meaning: '字义寓意',
      social: '社会认可'
    };
    
    Object.entries(breakdown).forEach(([key, value]) => {
      const name = dimensionNames[key as keyof typeof dimensionNames];
      const weight = weights[key as keyof WeightConfig];
      const isTop = value.weighted === maxContribution;
      
      explanations.push(
        `${name}：${value.score}分 × ${weight}% = ${value.weighted.toFixed(1)}分${isTop ? ' ⭐' : ''}`
      );
    });
    
    return explanations.join('\n');
  }
}

// 导出单例实例
export const weightedScoreCalculator = new WeightedScoreCalculator();