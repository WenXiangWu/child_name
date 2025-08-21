/**
 * 大衍数理评分插件
 * Layer 6: 名字评分层
 * 
 * 功能：对名字的大衍数理进行评分
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

export class DayanScoringPlugin implements Layer6Plugin {
  readonly id = 'dayan-scoring';
  readonly version = '1.0.0';
  readonly layer = 6 as const;
  readonly category = 'scoring' as const;
  readonly dependencies: PluginDependency[] = [
    { pluginId: 'name-combination', required: true }
  ];
  readonly metadata: PluginMetadata = {
    name: '大衍数理评分插件',
    description: '对名字的大衍数理进行评分，包括天格、地格、人格、外格、总格',
    author: 'Qiming Plugin System',
    category: 'scoring' as const,
    tags: ['dayan', 'math', 'scoring', 'layer6']
  };

  private initialized = false;

  // 大衍数理吉凶对照表
  private readonly dayanTable: Record<number, { luck: string; meaning: string; score: number }> = {
    1: { luck: '大吉', meaning: '太极之数，万物开泰，生发无穷，利禄亨通', score: 100 },
    2: { luck: '凶', meaning: '两仪之数，混沌未开，进退保守，志望难达', score: 30 },
    3: { luck: '大吉', meaning: '三才之数，天地人和，大事大业，繁荣昌隆', score: 95 },
    4: { luck: '凶', meaning: '四象之数，待于生发，万事慎重，不具营谋', score: 20 },
    5: { luck: '大吉', meaning: '五行之数，循环相生，圆通畅达，福祉无穷', score: 98 },
    6: { luck: '大吉', meaning: '六爻之数，发展变化，天赋美德，吉祥安泰', score: 90 },
    7: { luck: '吉', meaning: '七政之数，精悍严谨，天赋之力，吉星照耀', score: 85 },
    8: { luck: '吉', meaning: '八卦之数，乾坎艮震，巽离坤兑，无穷无尽', score: 88 },
    9: { luck: '凶', meaning: '大成之数，蕴涵凶险，或成或败，难以把握', score: 40 },
    10: { luck: '凶', meaning: '终数之数，雪暗飘零，偶或有成，回顾茫然', score: 25 },
    11: { luck: '大吉', meaning: '旱苗逢雨，万物更新，调顺发达，恢弘泽世', score: 92 },
    12: { luck: '凶', meaning: '无理之数，发展薄弱，虽生不足，难酬志向', score: 35 },
    13: { luck: '大吉', meaning: '天才之数，智勇超群，充满智慧，奏功受福', score: 94 },
    14: { luck: '凶', meaning: '破兆之数，家庭缘薄，孤独遭难，谋事不达', score: 15 },
    15: { luck: '大吉', meaning: '福寿之数，福寿圆满，富贵荣誉，涵养雅量', score: 96 },
    16: { luck: '大吉', meaning: '厚重之数，安富尊荣，财官双美，功成名就', score: 93 },
    17: { luck: '吉', meaning: '刚强之数，权威刚强，突破万难，如能容忍，必获成功', score: 82 },
    18: { luck: '大吉', meaning: '铁镜重磨，权威显达，博得名利，且养柔德', score: 91 },
    19: { luck: '凶', meaning: '多难之数，风云蔽日，辛苦重来，虽有智谋，万事挫折', score: 30 },
    20: { luck: '凶', meaning: '屋下藏金，非业破运，灾难重重，进退维谷', score: 22 },
    21: { luck: '大吉', meaning: '明月中天，万物确立，官运亨通，大搏名利', score: 97 },
    22: { luck: '凶', meaning: '秋草逢霜，怀才不遇，忧愁怨苦，事不如意', score: 28 },
    23: { luck: '大吉', meaning: '壮丽之数，旭日东升，壮丽壮观，权威旺盛', score: 89 },
    24: { luck: '大吉', meaning: '掘藏得金，家门余庆，金钱丰盈，白手成家', score: 87 },
    25: { luck: '吉', meaning: '荣俊之数，资性英敏，才能奇特，克服傲慢，尚可成功', score: 80 },
    26: { luck: '凶', meaning: '变怪之数，英雄豪杰，波澜重叠，而奏大功', score: 45 },
    27: { luck: '半吉', meaning: '增长之数，欲望无止，自我强烈，多受毁谤，尚可成功', score: 55 },
    28: { luck: '凶', meaning: '阔水浮萍，遭难之数，豪杰气概，四海漂泊', score: 18 },
    29: { luck: '吉', meaning: '智谋之数，财力归集，名闻海内，成就大业', score: 78 },
    30: { luck: '半吉', meaning: '非运之数，沉浮不定，凶吉难变，若明若暗', score: 50 },
    31: { luck: '大吉', meaning: '春日花开，智勇得志，博得名利，统领众人', score: 95 },
    32: { luck: '大吉', meaning: '宝马金鞍，侥幸多望，若得长上，其成大业', score: 88 },
    33: { luck: '大吉', meaning: '旭日升天，鸾凤相会，名闻天下，隆昌至极', score: 99 },
    34: { luck: '大凶', meaning: '破家之数，见识短小，辛苦遭逢，灾祸至极', score: 10 },
    35: { luck: '吉', meaning: '温和之数，温和平静，智达通畅，文昌技艺', score: 83 },
    36: { luck: '凶', meaning: '波澜之数，英雄豪杰，波澜重叠，而奏大功', score: 42 },
    37: { luck: '大吉', meaning: '猛虎出林，权威显达，热诚忠信，宜着雅量', score: 86 },
    38: { luck: '半吉', meaning: '磨铁成针，意志薄弱，刻意经营，才识不凡', score: 58 },
    39: { luck: '大吉', meaning: '富贵之数，富贵荣华，财帛丰盈，暗藏险象', score: 84 },
    40: { luck: '凶', meaning: '退安之数，谨慎保安，智谋胆力，难望成功', score: 38 }
  };

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

      context.log?.('info', '开始大衍数理评分分析');
      
      // 从name-combination插件获取名字候选
      const nameCandidates = this.getNameCandidatesFromContext(context);
      
      // 执行大衍数理评分
      const scoredCandidates = this.performDayanScoring(nameCandidates, input);
      
      const result = {
        scoredCandidates,
        dayanAnalysis: this.generateDayanAnalysis(scoredCandidates),
        overallStatistics: this.generateOverallStatistics(scoredCandidates)
      };

      return {
        success: true,
        data: result,
        confidence: 0.92,
        executionTime: Date.now() - startTime,
        metadata: {
          pluginId: this.id,
          layer: this.layer,
          processingTime: Date.now() - startTime,
          candidatesProcessed: nameCandidates.length
        }
      };
    } catch (error) {
      context.log?.('error', `大衍数理评分失败: ${error}`);
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
    
    return [];
  }

  /**
   * 执行大衍数理评分
   */
  private performDayanScoring(candidates: any[], input: StandardInput) {
    return candidates.map(candidate => {
      const dayanScore = this.calculateDayanScore(candidate);
      
      return {
        ...candidate,
        dayanScore: {
          total: dayanScore.total,
          tianGe: dayanScore.tianGe,
          diGe: dayanScore.diGe,
          renGe: dayanScore.renGe,
          waiGe: dayanScore.waiGe,
          zongGe: dayanScore.zongGe,
          analysis: dayanScore.analysis
        }
      };
    });
  }

  /**
   * 计算大衍数理评分
   */
  private calculateDayanScore(candidate: any) {
    const strokeCounts = this.getStrokeCounts(candidate);
    
    // 计算五格
    const tianGe = this.calculateTianGe(strokeCounts);
    const diGe = this.calculateDiGe(strokeCounts);
    const renGe = this.calculateRenGe(strokeCounts);
    const waiGe = this.calculateWaiGe(strokeCounts);
    const zongGe = this.calculateZongGe(strokeCounts);
    
    // 获取各格的吉凶评价
    const tianGeInfo = this.getDayanInfo(tianGe);
    const diGeInfo = this.getDayanInfo(diGe);
    const renGeInfo = this.getDayanInfo(renGe);
    const waiGeInfo = this.getDayanInfo(waiGe);
    const zongGeInfo = this.getDayanInfo(zongGe);
    
    // 计算总分
    const total = Math.round(
      (tianGeInfo.score * 0.15 + diGeInfo.score * 0.2 + renGeInfo.score * 0.25 + 
       waiGeInfo.score * 0.15 + zongGeInfo.score * 0.25)
    );
    
    return {
      total,
      tianGe: { number: tianGe, ...tianGeInfo },
      diGe: { number: diGe, ...diGeInfo },
      renGe: { number: renGe, ...renGeInfo },
      waiGe: { number: waiGe, ...waiGeInfo },
      zongGe: { number: zongGe, ...zongGeInfo },
      analysis: this.generateDetailedAnalysis({
        tianGe: { number: tianGe, ...tianGeInfo },
        diGe: { number: diGe, ...diGeInfo },
        renGe: { number: renGe, ...renGeInfo },
        waiGe: { number: waiGe, ...waiGeInfo },
        zongGe: { number: zongGe, ...zongGeInfo }
      })
    };
  }

  /**
   * 获取笔画数
   */
  private getStrokeCounts(candidate: any): number[] {
    const components = candidate.components || {};
    const strokes: number[] = [];
    
    // 姓氏笔画
    if (components.surname?.strokes) {
      strokes.push(components.surname.strokes);
    }
    
    // 名字笔画
    if (components.first?.strokes) {
      strokes.push(components.first.strokes);
    }
    
    if (components.second?.strokes) {
      strokes.push(components.second.strokes);
    }
    
    // 如果没有笔画信息，使用默认值
    while (strokes.length < 3) {
      strokes.push(1);
    }
    
    return strokes;
  }

  /**
   * 计算天格
   */
  private calculateTianGe(strokes: number[]): number {
    // 天格 = 姓氏笔画数 + 1 (单姓)
    return strokes[0] + 1;
  }

  /**
   * 计算地格
   */
  private calculateDiGe(strokes: number[]): number {
    // 地格 = 名字各字笔画数之和
    return strokes.slice(1).reduce((sum, stroke) => sum + stroke, 0);
  }

  /**
   * 计算人格
   */
  private calculateRenGe(strokes: number[]): number {
    // 人格 = 姓氏最后一字 + 名字第一字
    return strokes[0] + (strokes[1] || 0);
  }

  /**
   * 计算外格
   */
  private calculateWaiGe(strokes: number[]): number {
    // 外格 = 总格 - 人格 + 1
    const zongGe = strokes.reduce((sum, stroke) => sum + stroke, 0);
    const renGe = strokes[0] + (strokes[1] || 0);
    return zongGe - renGe + 1;
  }

  /**
   * 计算总格
   */
  private calculateZongGe(strokes: number[]): number {
    // 总格 = 所有字笔画数之和
    return strokes.reduce((sum, stroke) => sum + stroke, 0);
  }

  /**
   * 获取大衍数理信息
   */
  private getDayanInfo(number: number) {
    // 计算简化数 (1-81循环)
    const reducedNumber = ((number - 1) % 81) + 1;
    
    // 如果在对照表中找到，直接返回
    if (this.dayanTable[reducedNumber]) {
      return this.dayanTable[reducedNumber];
    }
    
    // 扩展对照表逻辑，基于已有数据的规律
    const basePattern = reducedNumber % 40;
    const baseInfo = this.dayanTable[basePattern] || this.dayanTable[1];
    
    return {
      luck: baseInfo.luck,
      meaning: `${baseInfo.meaning}（扩展推算）`,
      score: Math.max(20, baseInfo.score - Math.floor((reducedNumber - basePattern) / 40) * 10)
    };
  }

  /**
   * 生成详细分析
   */
  private generateDetailedAnalysis(geInfo: any) {
    const analyses: string[] = [];
    
    // 天格分析
    analyses.push(`天格${geInfo.tianGe.number}(${geInfo.tianGe.luck}): ${geInfo.tianGe.meaning}`);
    
    // 地格分析
    analyses.push(`地格${geInfo.diGe.number}(${geInfo.diGe.luck}): ${geInfo.diGe.meaning}`);
    
    // 人格分析
    analyses.push(`人格${geInfo.renGe.number}(${geInfo.renGe.luck}): ${geInfo.renGe.meaning}`);
    
    // 外格分析
    analyses.push(`外格${geInfo.waiGe.number}(${geInfo.waiGe.luck}): ${geInfo.waiGe.meaning}`);
    
    // 总格分析
    analyses.push(`总格${geInfo.zongGe.number}(${geInfo.zongGe.luck}): ${geInfo.zongGe.meaning}`);
    
    // 综合建议
    const goodGe = [geInfo.tianGe, geInfo.diGe, geInfo.renGe, geInfo.waiGe, geInfo.zongGe]
      .filter(ge => ge.luck === '大吉' || ge.luck === '吉').length;
    
    if (goodGe >= 4) {
      analyses.push('数理配置极佳，各方面运势都很好，是极富贵的好名字。');
    } else if (goodGe >= 3) {
      analyses.push('数理配置良好，整体运势不错，利于成功发展。');
    } else if (goodGe >= 2) {
      analyses.push('数理配置一般，需要靠个人努力来弥补先天不足。');
    } else {
      analyses.push('数理配置欠佳，需要特别注意修身养性，谨慎行事。');
    }
    
    return analyses;
  }

  /**
   * 生成大衍分析报告
   */
  private generateDayanAnalysis(scoredCandidates: any[]) {
    const totalCandidates = scoredCandidates.length;
    const averageScore = this.calculateAverageDayanScore(scoredCandidates);
    
    return {
      totalCandidates,
      averageScore,
      excellentNames: scoredCandidates
        .filter(c => c.dayanScore.total >= 90)
        .sort((a, b) => b.dayanScore.total - a.dayanScore.total)
        .slice(0, 10)
        .map(c => ({
          name: c.fullName,
          score: c.dayanScore.total,
          highlight: this.getHighlightGe(c.dayanScore)
        })),
      geDistribution: this.getGeDistribution(scoredCandidates)
    };
  }

  /**
   * 获取最优格局
   */
  private getHighlightGe(dayanScore: any): string {
    const ge = [
      { name: '天格', score: dayanScore.tianGe.score },
      { name: '地格', score: dayanScore.diGe.score },
      { name: '人格', score: dayanScore.renGe.score },
      { name: '外格', score: dayanScore.waiGe.score },
      { name: '总格', score: dayanScore.zongGe.score }
    ];
    
    const bestGe = ge.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    
    return `${bestGe.name}最优(${bestGe.score}分)`;
  }

  /**
   * 获取格局分布
   */
  private getGeDistribution(scoredCandidates: any[]) {
    const distribution = {
      excellent: 0, // 90分以上
      good: 0,      // 80-89分
      fair: 0,      // 70-79分
      poor: 0       // 70分以下
    };
    
    scoredCandidates.forEach(candidate => {
      const score = candidate.dayanScore.total;
      if (score >= 90) distribution.excellent++;
      else if (score >= 80) distribution.good++;
      else if (score >= 70) distribution.fair++;
      else distribution.poor++;
    });
    
    return distribution;
  }

  /**
   * 生成整体统计
   */
  private generateOverallStatistics(scoredCandidates: any[]) {
    return {
      totalNames: scoredCandidates.length,
      averageScore: this.calculateAverageDayanScore(scoredCandidates),
      highestScore: Math.max(...scoredCandidates.map(c => c.dayanScore.total)),
      lowestScore: Math.min(...scoredCandidates.map(c => c.dayanScore.total)),
      excellentCount: scoredCandidates.filter(c => c.dayanScore.total >= 90).length,
      goodCount: scoredCandidates.filter(c => c.dayanScore.total >= 80 && c.dayanScore.total < 90).length
    };
  }

  /**
   * 计算平均大衍分数
   */
  private calculateAverageDayanScore(scoredCandidates: any[]): number {
    if (scoredCandidates.length === 0) return 0;
    
    const totalScore = scoredCandidates.reduce((sum, candidate) => 
      sum + candidate.dayanScore.total, 0
    );
    
    return Math.round(totalScore / scoredCandidates.length);
  }
}
