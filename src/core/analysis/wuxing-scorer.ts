/**
 * 五行平衡评分器
 * 基于传统五行相生相克理论和用户偏好，计算名字的五行平衡评分
 */

import { WuxingElement } from '../common/types';
import { QimingDataLoader } from '../common/data-loader';

export interface WuxingAnalysis {
  familyWuxing: WuxingElement;      // 姓氏五行
  midCharWuxing: WuxingElement;     // 名字中间字五行
  lastCharWuxing: WuxingElement;    // 名字最后字五行
  harmony: number;                  // 五行和谐度评分 (0-100)
  interaction: 'sheng' | 'ke' | 'neutral'; // 五行相互作用关系
  explanation: string;              // 五行配置说明
}

export interface WuxingScoreResult {
  score: number;                    // 最终五行评分 (0-100)
  analysis: WuxingAnalysis;         // 详细分析
  preferenceMatch: number;          // 用户偏好匹配度 (0-100)
  suggestions: string[];            // 改进建议
}

/**
 * 五行相生相克关系定义
 */
const WUXING_RELATIONSHIPS = {
  // 相生关系：前者生后者
  sheng: [
    ['木', '火'],    // 木生火
    ['火', '土'],    // 火生土
    ['土', '金'],    // 土生金
    ['金', '水'],  // 金生水
    ['水', '木']    // 水生木
  ],
  // 相克关系：前者克后者
  ke: [
    ['木', '土'],     // 木克土
    ['土', '水'],   // 土克水
    ['水', '火'],  // 水克火
    ['火', '金'],   // 火克金
    ['金', '木']     // 金克木
  ]
};

/**
 * 五行评分权重配置
 */
const SCORING_WEIGHTS = {
  harmonyBase: 60,          // 基础和谐分
  shengBonus: 20,          // 相生关系加分
  kePenalty: -15,          // 相克关系扣分
  preferenceBonus: 20,     // 偏好匹配加分
  neutralBase: 75          // 中性关系基础分
};

export class WuxingScorer {
  private dataLoader: QimingDataLoader;

  constructor() {
    this.dataLoader = QimingDataLoader.getInstance();
  }

  /**
   * 计算名字的五行平衡评分
   * @param familyName 姓氏
   * @param givenName 名字（两个字）
   * @param userPreferences 用户五行偏好
   * @returns 五行评分结果
   */
  async calculateWuxingScore(
    familyName: string, 
    givenName: string, 
    userPreferences?: WuxingElement[]
  ): Promise<WuxingScoreResult> {
    
    if (givenName.length !== 2) {
      throw new Error('当前仅支持两字名字的五行评分');
    }

    // 1. 获取各字的五行属性
    const familyWuxing = await this.getCharacterWuxing(familyName);
    const midCharWuxing = await this.getCharacterWuxing(givenName[0]);
    const lastCharWuxing = await this.getCharacterWuxing(givenName[1]);

    // 2. 分析五行配置
    const analysis = this.analyzeWuxingConfiguration(
      familyWuxing, 
      midCharWuxing, 
      lastCharWuxing
    );

    // 3. 计算基础五行评分
    const baseScore = this.calculateBaseWuxingScore(analysis);

    // 4. 计算用户偏好匹配度
    const preferenceMatch = this.calculatePreferenceMatch(
      [midCharWuxing, lastCharWuxing], 
      userPreferences || []
    );

    // 5. 综合计算最终评分
    const finalScore = this.calculateFinalScore(baseScore, preferenceMatch);

    // 6. 生成改进建议
    const suggestions = this.generateSuggestions(analysis, preferenceMatch);

    return {
      score: finalScore,
      analysis,
      preferenceMatch,
      suggestions
    };
  }

  /**
   * 获取汉字的五行属性
   */
  private async getCharacterWuxing(char: string): Promise<WuxingElement> {
    try {
      const wuxing = await this.dataLoader.getWuxing(char);
      return this.normalizeWuxing(wuxing);
    } catch (error) {
      console.warn(`获取字符"${char}"的五行属性失败，使用默认值`, error);
      return '土'; // 默认土属性
    }
  }

  /**
   * 标准化五行属性
   */
  private normalizeWuxing(wuxing: string): WuxingElement {
    const mapping: { [key: string]: WuxingElement } = {
      '金': '金', 'jin': '金',
      '木': '木', 'mu': '木', 
      '水': '水', 'shui': '水',
      '火': '火', 'huo': '火',
      '土': '土', 'tu': '土'
    };
    return mapping[wuxing] || '土';
  }

  /**
   * 分析五行配置
   */
  private analyzeWuxingConfiguration(
    familyWuxing: WuxingElement,
    midWuxing: WuxingElement, 
    lastWuxing: WuxingElement
  ): WuxingAnalysis {
    
    // 分析姓氏与名字首字的关系
    const familyMidRelation = this.getWuxingRelationship(familyWuxing, midWuxing);
    
    // 分析名字首字与次字的关系
    const midLastRelation = this.getWuxingRelationship(midWuxing, lastWuxing);
    
    // 分析姓氏与名字次字的关系
    const familyLastRelation = this.getWuxingRelationship(familyWuxing, lastWuxing);

    // 计算整体和谐度
    let harmony = SCORING_WEIGHTS.harmonyBase;
    let interaction: 'sheng' | 'ke' | 'neutral' = 'neutral';

    // 评估相生相克关系
    if (familyMidRelation === 'sheng' || midLastRelation === 'sheng') {
      harmony += SCORING_WEIGHTS.shengBonus;
      interaction = 'sheng';
    } else if (familyMidRelation === 'ke' || midLastRelation === 'ke') {
      harmony += SCORING_WEIGHTS.kePenalty;
      interaction = 'ke';
    }

    // 如果整体配置和谐，额外加分
    if (familyMidRelation === 'sheng' && midLastRelation === 'sheng') {
      harmony += 10; // 全链相生额外奖励
    }

    harmony = Math.max(0, Math.min(100, harmony));

    // 生成配置说明
    const explanation = this.generateConfigurationExplanation(
      familyWuxing, midWuxing, lastWuxing,
      familyMidRelation, midLastRelation
    );

    return {
      familyWuxing,
      midCharWuxing: midWuxing,
      lastCharWuxing: lastWuxing,
      harmony,
      interaction,
      explanation
    };
  }

  /**
   * 获取两个五行之间的关系
   */
  private getWuxingRelationship(from: WuxingElement, to: WuxingElement): 'sheng' | 'ke' | 'neutral' {
    // 检查相生关系
    for (const [shengFrom, shengTo] of WUXING_RELATIONSHIPS.sheng) {
      if (shengFrom === from && shengTo === to) {
        return 'sheng';
      }
    }

    // 检查相克关系
    for (const [keFrom, keTo] of WUXING_RELATIONSHIPS.ke) {
      if (keFrom === from && keTo === to) {
        return 'ke';
      }
    }

    return 'neutral';
  }

  /**
   * 计算基础五行评分
   */
  private calculateBaseWuxingScore(analysis: WuxingAnalysis): number {
    return analysis.harmony;
  }

  /**
   * 计算用户偏好匹配度
   */
  private calculatePreferenceMatch(nameWuxing: WuxingElement[], userPreferences: WuxingElement[]): number {
    if (userPreferences.length === 0) {
      return 80; // 无偏好时给基础分
    }

    let matchCount = 0;
    let totalPreferences = userPreferences.length;

    for (const wuxing of nameWuxing) {
      if (userPreferences.includes(wuxing)) {
        matchCount++;
      }
    }

    // 计算匹配百分比
    const matchRatio = matchCount / Math.min(nameWuxing.length, totalPreferences);
    return Math.round(matchRatio * 100);
  }

  /**
   * 计算最终评分
   */
  private calculateFinalScore(baseScore: number, preferenceMatch: number): number {
    // 基础分占70%，偏好匹配占30%
    const weightedScore = (baseScore * 0.7) + (preferenceMatch * 0.3);
    return Math.max(0, Math.min(100, Math.round(weightedScore)));
  }

  /**
   * 生成配置说明
   */
  private generateConfigurationExplanation(
    familyWuxing: WuxingElement,
    midWuxing: WuxingElement,
    lastWuxing: WuxingElement,
    familyMidRelation: string,
    midLastRelation: string
  ): string {
    const wuxingNames = {
      '金': '金', '木': '木', '水': '水', '火': '火', '土': '土',
      jin: '金', mu: '木', shui: '水', huo: '火', tu: '土'
    };

    const relationNames = {
      sheng: '相生', ke: '相克', neutral: '平和'
    };

    const familyName = wuxingNames[familyWuxing];
    const midName = wuxingNames[midWuxing];
    const lastName = wuxingNames[lastWuxing];

    let explanation = `姓氏五行为${familyName}，名字五行配置为${midName}${lastName}。`;
    
    if (familyMidRelation !== 'neutral') {
      explanation += `姓与名首字${relationNames[familyMidRelation as keyof typeof relationNames]}，`;
    }
    
    if (midLastRelation !== 'neutral') {
      explanation += `名字内部${relationNames[midLastRelation as keyof typeof relationNames]}。`;
    }

    if (familyMidRelation === 'sheng' && midLastRelation === 'sheng') {
      explanation += '整体形成相生链，五行配置极佳。';
    } else if (familyMidRelation === 'ke' || midLastRelation === 'ke') {
      explanation += '存在相克关系，建议调整。';
    } else {
      explanation += '五行配置平和稳定。';
    }

    return explanation;
  }

  /**
   * 生成改进建议
   */
  private generateSuggestions(analysis: WuxingAnalysis, preferenceMatch: number): string[] {
    const suggestions: string[] = [];

    // 基于五行配置给建议
    if (analysis.interaction === 'ke') {
      suggestions.push('存在五行相克，建议选择能够化解的五行属性字符');
    }

    if (analysis.harmony < 70) {
      suggestions.push('五行配置不够和谐，建议重新选择五行属性更匹配的字符');
    }

    // 基于偏好匹配给建议
    if (preferenceMatch < 50) {
      suggestions.push('名字五行与您的偏好匹配度较低，建议调整');
    }

    // 积极建议
    if (analysis.interaction === 'sheng') {
      suggestions.push('五行相生配置良好，有利于运势发展');
    }

    if (suggestions.length === 0) {
      suggestions.push('五行配置整体良好，无需特别调整');
    }

    return suggestions;
  }

  /**
   * 获取五行属性的中文名称
   */
  getWuxingName(wuxing: WuxingElement): string {
    const names = {
      '金': '金', '木': '木', '水': '水', '火': '火', '土': '土',
      jin: '金', mu: '木', shui: '水', huo: '火', tu: '土'
    };
    return names[wuxing] || wuxing;
  }

  /**
   * 获取五行相生相克的详细说明
   */
  getWuxingTheory(): string {
    return `
五行相生：木生火、火生土、土生金、金生水、水生木
五行相克：木克土、土克水、水克火、火克金、金克木

相生关系有利于能量流转，增强运势；
相克关系容易产生冲突，需要化解或避免。
    `.trim();
  }
}