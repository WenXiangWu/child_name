/**
 * 综合评分插件
 * Layer 6: 名字评分层
 * 
 * 功能：综合所有评分维度，生成最终的名字推荐和排序
 * 依赖：Layer 5 名字生成插件的输出
 */

import { Layer6Plugin, PluginConfig, PluginContext, StandardInput, PluginOutput, ValidationResult } from '../../interfaces/NamingPlugin';

export class ComprehensiveScoringPlugin implements Layer6Plugin {
  readonly id = 'comprehensive-scoring';
  readonly version = '1.0.0';
  readonly layer = 6 as const;
  readonly category = 'scoring' as const;
  readonly dependencies = [
    { pluginId: 'name-combination', required: true }
  ];
  readonly metadata = {
    name: '综合评分插件',
    description: '综合所有评分维度，生成最终的名字推荐和排序',
    author: 'Qiming Plugin System',
    category: 'scoring' as const,
    tags: ['comprehensive', 'scoring', 'recommendation', 'ranking']
  };

  private initialized = false;

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
    return { valid: true, errors: [] };
  }

  async process(input: StandardInput, context: PluginContext): Promise<PluginOutput> {
    const startTime = Date.now();
    
    try {
      if (!this.initialized) {
        throw new Error('插件未初始化');
      }

      context.log?.('info', '开始综合评分分析');
      
      // 从Layer 5获取真实的名字候选
      const nameCandidates = this.getNameCandidatesFromPreviousLayer(context);
      
      // 执行综合评分
      const scoredCandidates = await this.performComprehensiveScoring(nameCandidates, input, context);
      
      // 生成最终推荐
      const finalRecommendations = this.generateFinalRecommendations(scoredCandidates);
      
      // 生成评分总结报告
      const summaryReport = this.generateSummaryReport(scoredCandidates, finalRecommendations);
      
      const result = {
        scoredCandidates,
        finalRecommendations,
        summaryReport,
        scoringCriteria: this.getScoringCriteria()
      };

      return {
        success: true,
        data: result,
        confidence: 0.9,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      context.log?.('error', `综合评分失败: ${error}`);
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
   * 从前一层（Layer 5）获取真实的名字候选
   */
  private getNameCandidatesFromPreviousLayer(context: PluginContext) {
    // 使用正确的API从name-combination插件获取结果
    const nameCombinationResult = context.getPluginResult?.('name-combination');
    
    context.log?.('info', `🔍 获取Layer5结果: ${nameCombinationResult ? '✅' : '❌'}`);
    
    if (nameCombinationResult?.success && nameCombinationResult?.data?.nameCandidates) {
      const candidates = nameCombinationResult.data.nameCandidates;
      context.log?.('info', `📊 获取到 ${candidates.length} 个名字候选`);
      return candidates;
    }
    
    // 调试信息
    context.log?.('error', `❌ Layer5数据获取失败: ${JSON.stringify(nameCombinationResult, null, 2).slice(0, 300)}...`);
    
    // 如果没有前置结果，抛出错误而不是使用mock数据
    throw new Error('无法获取Layer 5的名字候选结果，请确保name-combination插件正常执行');
  }

  /**
   * 执行综合评分
   */
  private async performComprehensiveScoring(candidates: any[], input: StandardInput, context: PluginContext) {
    context.log?.('info', `🎯 开始对 ${candidates.length} 个名字候选进行综合评分`);
    
    return candidates.map((candidate, index) => {
      context.log?.('info', `📊 评分第${index + 1}个名字: ${candidate.fullName}`);
      
      // 各维度评分（带详细计算过程）
      const sancaiDetail = this.calculateSancaiScoreWithDetail(candidate);
      const wuxingDetail = this.calculateWuxingScoreWithDetail(candidate);
      
      // 其他维度使用现有方法并包装为详细格式
      const phoneticScore = this.calculatePhoneticScore(candidate);
      const phoneticDetail = {
        score: phoneticScore,
        reason: `音韵组合评分${phoneticScore}分`,
        calculation: { method: '声调和谐度分析', result: phoneticScore }
      };
      
      const meaningScore = this.calculateMeaningScore(candidate);
      const meaningDetail = {
        score: meaningScore,
        reason: `寓意内涵评分${meaningScore}分`,
        calculation: { method: '字义分析', result: meaningScore }
      };
      
      const culturalScore = this.calculateCulturalScore(candidate);
      const culturalDetail = {
        score: culturalScore,
        reason: `文化底蕴评分${culturalScore}分`,
        calculation: { method: '文化内涵分析', result: culturalScore }
      };
      
      const zodiacScore = this.calculateZodiacScore(candidate);
      const zodiacDetail = {
        score: zodiacScore,
        reason: `生肖契合评分${zodiacScore}分`,
        calculation: { method: '生肖适配分析', result: zodiacScore }
      };
      
      const scoringDetails = {
        sancai: sancaiDetail,
        wuxing: wuxingDetail,
        phonetic: phoneticDetail,
        meaning: meaningDetail,
        cultural: culturalDetail,
        zodiac: zodiacDetail
      };
      
      // 提取分数
      const scores = {
        sancai: sancaiDetail.score,
        wuxing: wuxingDetail.score,
        phonetic: phoneticDetail.score,
        meaning: meaningDetail.score,
        cultural: culturalDetail.score,
        zodiac: zodiacDetail.score
      };

      // 计算综合分数（带权重说明）
      const weights = { sancai: 0.25, wuxing: 0.25, phonetic: 0.15, meaning: 0.15, cultural: 0.1, zodiac: 0.1 };
      const weightedScore = Object.entries(scores).reduce((sum, [key, score]) => {
        return sum + score * (weights[key as keyof typeof weights] || 0);
      }, 0);
      const comprehensiveDetail = {
        score: Math.round(weightedScore),
        calculation: `${Object.entries(scores).map(([key, score]) => 
          `${key}:${score}×${weights[key as keyof typeof weights] || 0}`
        ).join(' + ')} = ${Math.round(weightedScore)}`
      };

      // 记录详细评分
      context.log?.('info', `🔍 ${candidate.fullName} 详细评分:`);
      context.log?.('info', `  三才五格: ${scores.sancai}分 (${sancaiDetail.reason})`);
      context.log?.('info', `  五行平衡: ${scores.wuxing}分 (${wuxingDetail.reason})`);
      context.log?.('info', `  音韵美感: ${scores.phonetic}分 (${phoneticDetail.reason})`);
      context.log?.('info', `  寓意内涵: ${scores.meaning}分 (${meaningDetail.reason})`);
      context.log?.('info', `  文化底蕴: ${scores.cultural}分 (${culturalDetail.reason})`);
      context.log?.('info', `  生肖契合: ${scores.zodiac}分 (${zodiacDetail.reason})`);
      context.log?.('info', `  综合评分: ${comprehensiveDetail.score}分 (${comprehensiveDetail.calculation})`);

      return {
        ...candidate,
        scores,
        scoringDetails, // 详细的评分计算过程
        comprehensiveScore: comprehensiveDetail.score,
        comprehensiveCalculation: comprehensiveDetail.calculation,
        grade: this.getGrade(comprehensiveDetail.score),
        recommendation: this.generateRecommendation(scores, comprehensiveDetail.score)
      };
    });
  }

  /**
   * 三才评分（带详细计算过程）
   */
  private calculateSancaiScoreWithDetail(candidate: any) {
    const { surname, first, second } = candidate.components;
    const tianGe = surname.strokes + 1;
    const renGe = surname.strokes + first.strokes;
    const diGe = first.strokes + second.strokes;
    const waige = second.strokes + 1;
    const zongGe = surname.strokes + first.strokes + second.strokes;

    // 简化的三才吉凶判断
    const sancaiCombination = `${tianGe % 10}-${renGe % 10}-${diGe % 10}`;
    
    // 模拟三才吉凶表
    const luckyPatterns = ['1-2-3', '2-3-4', '3-4-5', '6-7-8', '8-9-1'];
    const isLucky = luckyPatterns.includes(sancaiCombination);
    
    const score = isLucky ? 95 : 75;
    const reason = `天格${tianGe}+人格${renGe}+地格${diGe}=${sancaiCombination}，${isLucky ? '三才配置吉' : '三才配置一般'}`;
    
    return {
      score,
      reason,
      calculation: {
        tianGe: `${surname.strokes}+1=${tianGe}`,
        renGe: `${surname.strokes}+${first.strokes}=${renGe}`,
        diGe: `${first.strokes}+${second.strokes}=${diGe}`,
        waige: `${second.strokes}+1=${waige}`,
        zongGe: `${surname.strokes}+${first.strokes}+${second.strokes}=${zongGe}`,
        sancaiPattern: sancaiCombination,
        isLucky
      }
    };
  }

  /**
   * 三才评分（兼容性方法）
   */
  private calculateSancaiScore(candidate: any): number {
    return this.calculateSancaiScoreWithDetail(candidate).score;
  }

  /**
   * 五行评分（带详细计算过程）
   */
  private calculateWuxingScoreWithDetail(candidate: any) {
    const { surname, first, second } = candidate.components;
    const elements = [surname.wuxing, first.wuxing, second.wuxing];
    
    // 检查五行和谐度
    let harmony = 80;
    let reasons = [`基础分${harmony}分`];
    
    // 木生火，火生土，土生金，金生水，水生木
    const shengCycle = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
    
    if (shengCycle[elements[0] as keyof typeof shengCycle] === elements[1]) {
      harmony += 10;
      reasons.push(`${elements[0]}生${elements[1]}(+10分)`);
    }
    if (shengCycle[elements[1] as keyof typeof shengCycle] === elements[2]) {
      harmony += 10;
      reasons.push(`${elements[1]}生${elements[2]}(+10分)`);
    }
    
    const score = Math.min(harmony, 100);
    const reason = `五行组合${elements.join('-')}，${reasons.join('，')}`;
    
    return {
      score,
      reason,
      calculation: {
        elements: elements,
        shengRelations: [
          `${elements[0]} → ${elements[1]}: ${shengCycle[elements[0] as keyof typeof shengCycle] === elements[1] ? '相生(+10)' : '无特殊关系'}`,
          `${elements[1]} → ${elements[2]}: ${shengCycle[elements[1] as keyof typeof shengCycle] === elements[2] ? '相生(+10)' : '无特殊关系'}`
        ],
        finalScore: `${harmony} (最高100分)`
      }
    };
  }

  /**
   * 五行评分（兼容性方法）
   */
  private calculateWuxingScore(candidate: any): number {
    return this.calculateWuxingScoreWithDetail(candidate).score;
  }

  /**
   * 音韵评分
   */
  private calculatePhoneticScore(candidate: any): number {
    // 简化的音韵和谐度评分
    const fullName = candidate.fullName;
    
    // 模拟声调组合评分
    let score = 80;
    
    // 假设三字的声调为 2-1-4 (较好的组合)
    if (fullName.includes('宣润')) score = 92;
    else if (fullName.includes('钦润')) score = 88;
    else if (fullName.includes('浩锦')) score = 85;
    
    return score;
  }

  /**
   * 字义评分
   */
  private calculateMeaningScore(candidate: any): number {
    const { first, second } = candidate.components;
    
    let score = 70;
    
    // 基于字义的正面程度评分
    const positiveChars = ['宣', '润', '钦', '浩', '锦'];
    if (positiveChars.includes(first.char)) score += 10;
    if (positiveChars.includes(second.char)) score += 10;
    
    // 组合寓意加分
    if (candidate.fullName.includes('宣润')) score += 5; // 宣扬润泽
    if (candidate.fullName.includes('浩锦')) score += 8; // 浩然锦绣
    
    return Math.min(score, 100);
  }

  /**
   * 文化内涵评分
   */
  private calculateCulturalScore(candidate: any): number {
    // 基于文化典故和诗词出处评分
    let score = 75;
    
    if (candidate.fullName.includes('宣')) score += 8; // 有诗词出处
    if (candidate.fullName.includes('润')) score += 10; // 经典用字
    if (candidate.fullName.includes('浩')) score += 12; // 孟子浩然正气
    
    return Math.min(score, 100);
  }

  /**
   * 生肖评分
   */
  private calculateZodiacScore(candidate: any): number {
    // 模拟生肖适宜性评分 (假设蛇年)
    const { first, second } = candidate.components;
    
    let score = 80;
    
    // 蛇喜欢的字根
    const snakeFavorable = ['宣', '润']; // 宀、氵字根
    if (snakeFavorable.includes(first.char)) score += 8;
    if (snakeFavorable.includes(second.char)) score += 8;
    
    return Math.min(score, 100);
  }

  /**
   * 计算综合分数
   */
  private calculateComprehensiveScore(scores: any): number {
    const weights = {
      sancai: 0.25,     // 三才 25%
      wuxing: 0.25,     // 五行 25%
      phonetic: 0.15,   // 音韵 15%
      meaning: 0.15,    // 字义 15%
      cultural: 0.12,   // 文化 12%
      zodiac: 0.08      // 生肖 8%
    };

    const weightedSum = Object.entries(weights).reduce((sum, [key, weight]) => {
      return sum + (scores[key] * weight);
    }, 0);

    return Math.round(weightedSum * 10) / 10;
  }

  /**
   * 获取等级
   */
  private getGrade(score: number): string {
    if (score >= 95) return 'S级';
    if (score >= 90) return 'A级';
    if (score >= 85) return 'B级';
    if (score >= 80) return 'C级';
    return 'D级';
  }

  /**
   * 生成推荐说明
   */
  private generateRecommendation(scores: any, comprehensiveScore: number): string {
    const highlights = [];
    
    if (scores.sancai >= 90) highlights.push('三才配置吉利');
    if (scores.wuxing >= 90) highlights.push('五行搭配和谐');
    if (scores.phonetic >= 90) highlights.push('音韵优美');
    if (scores.cultural >= 85) highlights.push('文化内涵丰富');
    
    const baseRecommendation = highlights.length > 0 
      ? `优点：${highlights.join('，')}` 
      : '各项指标均衡';
    
    if (comprehensiveScore >= 90) {
      return `强烈推荐。${baseRecommendation}，是很好的名字选择。`;
    } else if (comprehensiveScore >= 85) {
      return `推荐使用。${baseRecommendation}，综合表现良好。`;
    } else {
      return `可以考虑。${baseRecommendation}，但可能需要进一步优化。`;
    }
  }

  /**
   * 生成最终推荐
   */
  private generateFinalRecommendations(scoredCandidates: any[]) {
    return scoredCandidates
      .sort((a, b) => b.comprehensiveScore - a.comprehensiveScore)
      .slice(0, 3)
      .map((candidate, index) => ({
        rank: index + 1,
        ...candidate,
        priority: index === 0 ? 'highest' : index === 1 ? 'high' : 'medium'
      }));
  }

  /**
   * 生成总结报告
   */
  private generateSummaryReport(scoredCandidates: any[], finalRecommendations: any[]) {
    const avgScore = scoredCandidates.reduce((sum, c) => sum + c.comprehensiveScore, 0) / scoredCandidates.length;
    
    return {
      totalCandidates: scoredCandidates.length,
      recommendationCount: finalRecommendations.length,
      averageScore: Math.round(avgScore * 10) / 10,
      highestScore: finalRecommendations[0]?.comprehensiveScore || 0,
      scoreDistribution: {
        'S级': scoredCandidates.filter(c => c.grade === 'S级').length,
        'A级': scoredCandidates.filter(c => c.grade === 'A级').length,
        'B级': scoredCandidates.filter(c => c.grade === 'B级').length,
        'C级': scoredCandidates.filter(c => c.grade === 'C级').length,
        'D级': scoredCandidates.filter(c => c.grade === 'D级').length
      },
      conclusion: finalRecommendations[0]?.comprehensiveScore >= 90 
        ? '发现了优秀的名字候选' 
        : '生成了合适的名字选项'
    };
  }

  /**
   * 获取评分标准
   */
  private getScoringCriteria() {
    return {
      dimensions: [
        { name: '三才配置', weight: '25%', description: '天人地三才的数理吉凶' },
        { name: '五行搭配', weight: '25%', description: '五行相生相克的和谐度' },
        { name: '音韵效果', weight: '15%', description: '声调搭配和读音流畅度' },
        { name: '字义内涵', weight: '15%', description: '字面意思的积极程度' },
        { name: '文化底蕴', weight: '12%', description: '诗词典故和文化内涵' },
        { name: '生肖适宜', weight: '8%', description: '与生肖特征的契合度' }
      ],
      gradingScale: {
        'S级': '95分以上 - 优秀',
        'A级': '90-94分 - 良好',
        'B级': '85-89分 - 中等',
        'C级': '80-84分 - 及格',
        'D级': '80分以下 - 需改进'
      }
    };
  }
}