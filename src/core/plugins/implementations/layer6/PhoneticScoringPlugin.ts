/**
 * 音韵评分插件
 * Layer 6: 名字评分层
 * 
 * 功能：对名字的音韵特征进行评分
 * 依赖：name-combination (Layer 5)
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

export class PhoneticScoringPlugin implements Layer6Plugin {
  readonly id = 'phonetic-scoring';
  readonly version = '1.0.0';
  readonly layer = 6 as const;
  readonly category = 'scoring' as const;
  readonly dependencies: PluginDependency[] = [
    { pluginId: 'name-combination', required: true }
  ];
  readonly metadata: PluginMetadata = {
    name: '音韵评分插件',
    description: '对名字的音韵特征进行评分，包括声调搭配、音律美感等',
    author: 'Qiming Plugin System',
    category: 'scoring' as const,
    tags: ['phonetic', 'scoring', 'layer6']
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

      context.log?.('info', '开始音韵评分分析');
      
      // 从name-combination插件获取名字候选
      const nameCandidates = this.getNameCandidatesFromContext(context);
      
      // 执行音韵评分
      const scoredCandidates = this.performPhoneticScoring(nameCandidates, input);
      
      const result = {
        scoredCandidates,
        phoneticAnalysis: this.generatePhoneticAnalysis(scoredCandidates),
        averageScore: this.calculateAverageScore(scoredCandidates)
      };

      return {
        success: true,
        data: result,
        confidence: 0.9,
        executionTime: Date.now() - startTime,
        metadata: {
          pluginId: this.id,
          layer: this.layer,
          processingTime: Date.now() - startTime,
          candidatesProcessed: nameCandidates.length
        }
      };
    } catch (error) {
      context.log?.('error', `音韵评分失败: ${error}`);
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
   * 从上下文获取名字候选
   */
  private getNameCandidatesFromContext(context: PluginContext) {
    const nameCombinationResult = (context as any).pluginResults?.get('name-combination');
    
    if (nameCombinationResult?.data?.nameCandidates) {
      return nameCombinationResult.data.nameCandidates;
    }
    
    // 如果没有前置结果，返回空数组
    return [];
  }

  /**
   * 执行音韵评分
   */
  private performPhoneticScoring(candidates: any[], input: StandardInput) {
    return candidates.map(candidate => {
      const phoneticScore = this.calculatePhoneticScore(candidate);
      
      return {
        ...candidate,
        phoneticScore: {
          total: phoneticScore.total,
          toneHarmony: phoneticScore.toneHarmony,
          rhythm: phoneticScore.rhythm,
          euphony: phoneticScore.euphony,
          readability: phoneticScore.readability
        }
      };
    });
  }

  /**
   * 计算音韵评分
   */
  private calculatePhoneticScore(candidate: any) {
    const fullName = candidate.fullName || '';
    
    // 声调和谐度评分
    const toneHarmony = this.calculateToneHarmony(fullName);
    
    // 节奏美感评分
    const rhythm = this.calculateRhythm(fullName);
    
    // 音韵悦耳度评分
    const euphony = this.calculateEuphony(fullName);
    
    // 易读性评分
    const readability = this.calculateReadability(fullName);
    
    // 综合评分
    const total = Math.round(
      (toneHarmony * 0.3 + rhythm * 0.25 + euphony * 0.25 + readability * 0.2)
    );
    
    return {
      total,
      toneHarmony,
      rhythm,
      euphony,
      readability
    };
  }

  /**
   * 计算声调和谐度
   */
  private calculateToneHarmony(fullName: string): number {
    // 简化实现 - 基于声调变化的规律性
    const tonePattern = this.getTonePattern(fullName);
    
    // 理想的声调搭配模式
    const idealPatterns = [
      [1, 2], [1, 4], [2, 1], [2, 4], [3, 1], [3, 2], [4, 1], [4, 2]
    ];
    
    let score = 60; // 基础分数
    
    // 检查是否符合理想模式
    if (idealPatterns.some(pattern => 
      pattern.every((tone, index) => tonePattern[index] === tone)
    )) {
      score += 25;
    }
    
    // 避免单调（相同声调）
    if (new Set(tonePattern).size > 1) {
      score += 15;
    }
    
    return Math.min(100, score);
  }

  /**
   * 获取声调模式
   */
  private getTonePattern(fullName: string): number[] {
    // 简化实现 - 基于常见字的声调
    const toneMap: Record<string, number> = {
      '吴': 2, '李': 3, '王': 2, '张': 1, '刘': 2,
      '宣': 1, '润': 4, '钦': 1, '浩': 4, '锦': 3,
      '明': 2, '亮': 4, '峰': 1, '磊': 3, '森': 1
    };
    
    return Array.from(fullName).map(char => toneMap[char] || 2);
  }

  /**
   * 计算节奏美感
   */
  private calculateRhythm(fullName: string): number {
    const length = fullName.length;
    
    let score = 70; // 基础分数
    
    // 3字名字节奏最佳
    if (length === 3) {
      score += 20;
    } else if (length === 2) {
      score += 10;
    } else if (length === 4) {
      score += 5;
    }
    
    // 检查音节长度变化
    const syllableLengths = this.getSyllableLengths(fullName);
    if (syllableLengths.some(len => len !== syllableLengths[0])) {
      score += 10; // 音节长度有变化更有节奏感
    }
    
    return Math.min(100, score);
  }

  /**
   * 获取音节长度
   */
  private getSyllableLengths(fullName: string): number[] {
    // 简化实现 - 每个字符视为一个音节
    return Array.from(fullName).map(() => 1);
  }

  /**
   * 计算音韵悦耳度
   */
  private calculateEuphony(fullName: string): number {
    let score = 65; // 基础分数
    
    // 检查是否包含悦耳的声母韵母组合
    const pleasantSounds = ['ang', 'ing', 'ong', 'eng', 'ian', 'uan'];
    const hasPleasantSounds = pleasantSounds.some(sound => 
      fullName.includes(sound)
    );
    
    if (hasPleasantSounds) {
      score += 20;
    }
    
    // 避免难发音的组合
    const difficultCombos = ['zh', 'ch', 'sh'];
    const hasDifficultCombos = difficultCombos.some(combo => 
      fullName.includes(combo)
    );
    
    if (!hasDifficultCombos) {
      score += 15;
    }
    
    return Math.min(100, score);
  }

  /**
   * 计算易读性
   */
  private calculateReadability(fullName: string): number {
    let score = 75; // 基础分数
    
    // 常用字加分
    const commonChars = ['明', '亮', '华', '强', '伟', '峰', '林', '森'];
    const commonCharCount = Array.from(fullName).filter(char => 
      commonChars.includes(char)
    ).length;
    
    score += commonCharCount * 10;
    
    // 避免生僻字
    const rareChars = ['曌', '昱', '玥', '轩'];
    const rareCharCount = Array.from(fullName).filter(char => 
      rareChars.includes(char)
    ).length;
    
    score -= rareCharCount * 15;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * 生成音韵分析报告
   */
  private generatePhoneticAnalysis(scoredCandidates: any[]) {
    const totalCandidates = scoredCandidates.length;
    const averageScore = this.calculateAverageScore(scoredCandidates);
    
    return {
      totalCandidates,
      averageScore,
      topScores: scoredCandidates
        .sort((a, b) => b.phoneticScore.total - a.phoneticScore.total)
        .slice(0, 5)
        .map(c => ({
          name: c.fullName,
          score: c.phoneticScore.total
        })),
      scoreDistribution: this.getScoreDistribution(scoredCandidates)
    };
  }

  /**
   * 计算平均分数
   */
  private calculateAverageScore(scoredCandidates: any[]): number {
    if (scoredCandidates.length === 0) return 0;
    
    const totalScore = scoredCandidates.reduce((sum, candidate) => 
      sum + candidate.phoneticScore.total, 0
    );
    
    return Math.round(totalScore / scoredCandidates.length);
  }

  /**
   * 获取分数分布
   */
  private getScoreDistribution(scoredCandidates: any[]) {
    const distribution = { excellent: 0, good: 0, fair: 0, poor: 0 };
    
    scoredCandidates.forEach(candidate => {
      const score = candidate.phoneticScore.total;
      if (score >= 90) distribution.excellent++;
      else if (score >= 80) distribution.good++;
      else if (score >= 70) distribution.fair++;
      else distribution.poor++;
    });
    
    return distribution;
  }
}
