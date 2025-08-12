/**
 * 社会认可度评分器
 * 基于字符常用度、时代适应性和重名率，计算名字的社会认可度评分
 */

import { WordDataLoader } from '../naming/word-loader';
import { BaijiaxingLoader } from '../naming/baijiaxing-loader';

export interface CharacterSocialData {
  char: string;                     // 汉字
  frequency: number;                // 使用频率
  commonness: number;               // 常用度评分 (0-100)
  modernity: number;                // 时代适应性评分 (0-100)
  uniqueness: number;               // 独特性评分 (0-100)
}

export interface SocialAnalysis {
  char1Social: CharacterSocialData; // 首字社会数据
  char2Social: CharacterSocialData; // 次字社会数据
  overallCommonness: number;        // 整体常用度 (0-100)
  timelinessScore: number;          // 时代感评分 (0-100)
  uniquenessScore: number;          // 独特性评分 (0-100)
  popularityTrend: 'rising' | 'stable' | 'declining'; // 流行趋势
}

export interface SocialScoreResult {
  score: number;                    // 最终社会认可度评分 (0-100)
  analysis: SocialAnalysis;         // 详细分析
  advantages: string[];             // 社会认可优势
  concerns: string[];               // 潜在顾虑
  recommendations: string[];        // 优化建议
}

/**
 * 时代特征字符分类
 */
const ERA_CHARACTERISTICS = {
  // 传统经典字符 (历久弥新)
  classical: ['文', '武', '德', '仁', '义', '礼', '智', '信', '忠', '孝', '贤', '良', '正', '明', '清'],
  
  // 现代流行字符 (当代热门)
  modern: ['浩', '轩', '宇', '涵', '博', '睿', '琪', '瑞', '嘉', '悦', '欣', '雨', '晨', '阳', '梦'],
  
  // 中性平衡字符 (适中选择)
  neutral: ['华', '国', '家', '安', '康', '健', '平', '和', '福', '寿', '富', '贵', '荣', '昌', '盛'],
  
  // 过时字符 (需要谨慎)
  outdated: ['建', '国', '军', '民', '工', '农', '兵', '学', '商', '红', '东', '西', '南', '北', '中']
};

/**
 * 重名率估算数据 (基于常见组合的简化模型)
 */
const COMMON_COMBINATIONS = {
  // 高重名率组合
  high: ['浩然', '子轩', '雨涵', '欣怡', '嘉怡', '思涵', '梓涵', '宇轩', '博文', '雨萱'],
  
  // 中等重名率组合
  medium: ['志强', '小明', '小红', '小华', '小李', '小王', '小张', '小刘', '小陈', '小杨'],
  
  // 低重名率组合
  low: ['琮琅', '瑾瑜', '昭华', '清妍', '雅惠', '温茂', '德辉', '弘深', '嘉志', '康适']
};

/**
 * 评分权重配置
 */
const SCORING_WEIGHTS = {
  commonnessWeight: 0.4,        // 常用度权重 40%
  modernityWeight: 0.3,         // 时代感权重 30%
  uniquenessWeight: 0.3,        // 独特性权重 30%
  baseScore: 70                 // 基础分
};

export class SocialScorer {
  private wordLoader: WordDataLoader;
  private baijiaxingLoader: BaijiaxingLoader;

  constructor() {
    this.wordLoader = WordDataLoader.getInstance();
    this.baijiaxingLoader = BaijiaxingLoader.getInstance();
  }

  /**
   * 计算名字的社会认可度评分
   * @param char1 名字首字
   * @param char2 名字次字
   * @returns 社会认可度评分结果
   */
  async calculateSocialScore(char1: string, char2: string): Promise<SocialScoreResult> {
    
    // 1. 分析单字社会数据
    const char1Social = await this.analyzeCharacterSocial(char1);
    const char2Social = await this.analyzeCharacterSocial(char2);

    // 2. 分析整体社会认可度
    const analysis = this.analyzeSocialAcceptance(char1Social, char2Social, char1 + char2);

    // 3. 计算综合评分
    const score = this.calculateFinalSocialScore(analysis);

    // 4. 生成优势、顾虑和建议
    const advantages = this.identifyAdvantages(analysis);
    const concerns = this.identifyConcerns(analysis);
    const recommendations = this.generateRecommendations(analysis);

    return {
      score,
      analysis,
      advantages,
      concerns,
      recommendations
    };
  }

  /**
   * 分析单个汉字的社会数据
   */
  private async analyzeCharacterSocial(char: string): Promise<CharacterSocialData> {
    try {
      // 从字典获取字符详情  
      const charDetail = await this.wordLoader.getCharacterInfo(char);
      
      let frequency = 0;
      let commonness = 50; // 默认中等
      
      if (charDetail) {
        // WordRecord 没有 frequency 字段，使用字义复杂度估算频率
        frequency = charDetail.explanation.length;
        commonness = this.calculateCommonness(frequency);
      } else {
        // 如果字典中没有，使用基础估算
        commonness = this.estimateBasicCommonness(char);
      }

      const modernity = this.calculateModernity(char);
      const uniqueness = this.calculateUniqueness(char);

      return {
        char,
        frequency,
        commonness,
        modernity,
        uniqueness
      };
    } catch (error) {
      console.warn(`分析字符"${char}"的社会数据失败`, error);
      
      // 返回默认分析
      return {
        char,
        frequency: 0,
        commonness: 50,
        modernity: 60,
        uniqueness: 70
      };
    }
  }

  /**
   * 计算常用度评分
   */
  private calculateCommonness(frequency: number): number {
    // 基于频率计算常用度 (对数缩放)
    if (frequency >= 10000) return 95;
    if (frequency >= 5000) return 90;
    if (frequency >= 1000) return 85;
    if (frequency >= 500) return 80;
    if (frequency >= 200) return 75;
    if (frequency >= 100) return 70;
    if (frequency >= 50) return 65;
    if (frequency >= 20) return 60;
    if (frequency >= 10) return 55;
    if (frequency >= 5) return 50;
    if (frequency >= 1) return 45;
    return 40; // 极低频或未收录
  }

  /**
   * 基础常用度估算（无字典数据时）
   */
  private estimateBasicCommonness(char: string): number {
    // 基于字符本身的特征估算
    let commonness = 50;

    // 检查是否在常见字符列表中
    const allCommonChars = [
      ...ERA_CHARACTERISTICS.classical,
      ...ERA_CHARACTERISTICS.modern,
      ...ERA_CHARACTERISTICS.neutral
    ];

    if (allCommonChars.includes(char)) {
      commonness += 20;
    }

    // 简单的笔画复杂度估算
    const complexity = char.length; // 简化：用字符长度模拟笔画复杂度
    if (complexity <= 8) {
      commonness += 10; // 简单字符更常用
    } else if (complexity >= 15) {
      commonness -= 15; // 复杂字符较少用
    }

    return Math.max(20, Math.min(95, commonness));
  }

  /**
   * 计算时代适应性评分
   */
  private calculateModernity(char: string): number {
    let modernity = 60; // 基础中性分

    // 检查时代特征
    if (ERA_CHARACTERISTICS.modern.includes(char)) {
      modernity += 25; // 现代流行字符
    } else if (ERA_CHARACTERISTICS.classical.includes(char)) {
      modernity += 15; // 传统经典字符，历久弥新
    } else if (ERA_CHARACTERISTICS.neutral.includes(char)) {
      modernity += 10; // 中性字符，适应性好
    } else if (ERA_CHARACTERISTICS.outdated.includes(char)) {
      modernity -= 20; // 过时字符，需谨慎
    }

    // 特殊时代敏感字符处理
    const sensitiveChars = ['国', '军', '建', '红', '东', '文', '革'];
    if (sensitiveChars.includes(char)) {
      modernity -= 10; // 可能带有特定时代印记
    }

    return Math.max(0, Math.min(100, modernity));
  }

  /**
   * 计算独特性评分
   */
  private calculateUniqueness(char: string): number {
    let uniqueness = 70; // 基础分

    // 基于常用度反向计算独特性
    const estimatedCommonness = this.estimateBasicCommonness(char);
    uniqueness = 100 - (estimatedCommonness * 0.6); // 越常用越不独特

    // 特殊字符加分
    const uniqueChars = ['琮', '瑾', '瑜', '昭', '妍', '茂', '辉', '康', '适', '琪'];
    if (uniqueChars.includes(char)) {
      uniqueness += 15;
    }

    // 过于简单的字符扣分
    const tooCommonChars = ['小', '大', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    if (tooCommonChars.includes(char)) {
      uniqueness -= 20;
    }

    return Math.max(10, Math.min(100, uniqueness));
  }

  /**
   * 分析整体社会认可度
   */
  private analyzeSocialAcceptance(
    char1Social: CharacterSocialData, 
    char2Social: CharacterSocialData,
    combination: string
  ): SocialAnalysis {
    
    // 计算整体指标
    const overallCommonness = (char1Social.commonness + char2Social.commonness) / 2;
    const timelinessScore = (char1Social.modernity + char2Social.modernity) / 2;
    const uniquenessScore = (char1Social.uniqueness + char2Social.uniqueness) / 2;

    // 分析流行趋势
    const popularityTrend = this.analyzePopularityTrend(combination, timelinessScore);

    return {
      char1Social,
      char2Social,
      overallCommonness,
      timelinessScore,
      uniquenessScore,
      popularityTrend
    };
  }

  /**
   * 分析流行趋势
   */
  private analyzePopularityTrend(combination: string, timelinessScore: number): 'rising' | 'stable' | 'declining' {
    // 检查是否为已知的高重名率组合
    if (COMMON_COMBINATIONS.high.includes(combination)) {
      return 'declining'; // 过于流行，趋势下降
    }

    // 检查是否为中等重名率组合
    if (COMMON_COMBINATIONS.medium.includes(combination)) {
      return 'stable'; // 稳定流行
    }

    // 基于时代感评分判断
    if (timelinessScore >= 80) {
      return 'rising'; // 时代感强，趋势上升
    } else if (timelinessScore >= 60) {
      return 'stable'; // 适中，保持稳定
    } else {
      return 'declining'; // 时代感弱，趋势下降
    }
  }

  /**
   * 计算最终社会认可度评分
   */
  private calculateFinalSocialScore(analysis: SocialAnalysis): number {
    const { overallCommonness, timelinessScore, uniquenessScore } = analysis;

    // 加权计算
    let score = 
      overallCommonness * SCORING_WEIGHTS.commonnessWeight +
      timelinessScore * SCORING_WEIGHTS.modernityWeight +
      uniquenessScore * SCORING_WEIGHTS.uniquenessWeight;

    // 流行趋势调整
    switch (analysis.popularityTrend) {
      case 'rising':
        score += 5; // 上升趋势加分
        break;
      case 'declining':
        score -= 10; // 下降趋势扣分
        break;
      // stable 不调整
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * 识别社会认可优势
   */
  private identifyAdvantages(analysis: SocialAnalysis): string[] {
    const advantages: string[] = [];
    const { overallCommonness, timelinessScore, uniquenessScore, popularityTrend } = analysis;

    if (overallCommonness >= 80) {
      advantages.push('字符常用度高，社会接受度好');
    }

    if (timelinessScore >= 80) {
      advantages.push('具有现代感，符合当代审美');
    }

    if (uniquenessScore >= 75) {
      advantages.push('独特性适中，不会过于大众化');
    }

    if (popularityTrend === 'rising') {
      advantages.push('符合流行趋势，具有时代特色');
    } else if (popularityTrend === 'stable') {
      advantages.push('经典稳定，不受流行波动影响');
    }

    if (advantages.length === 0) {
      advantages.push('名字选择平稳，社会认可度适中');
    }

    return advantages;
  }

  /**
   * 识别潜在顾虑
   */
  private identifyConcerns(analysis: SocialAnalysis): string[] {
    const concerns: string[] = [];
    const { overallCommonness, timelinessScore, uniquenessScore, popularityTrend } = analysis;

    if (overallCommonness < 50) {
      concerns.push('字符可能过于生僻，影响日常使用');
    }

    if (timelinessScore < 50) {
      concerns.push('可能带有过时感，缺乏现代气息');
    }

    if (uniquenessScore < 40) {
      concerns.push('重名率可能较高，缺乏个性特色');
    }

    if (popularityTrend === 'declining') {
      concerns.push('流行趋势下降，可能不够时尚');
    }

    return concerns;
  }

  /**
   * 生成优化建议
   */
  private generateRecommendations(analysis: SocialAnalysis): string[] {
    const recommendations: string[] = [];
    const { overallCommonness, timelinessScore, uniquenessScore } = analysis;

    if (overallCommonness < 60) {
      recommendations.push('考虑选择更常用的字符，提升社会接受度');
    }

    if (timelinessScore < 60) {
      recommendations.push('可以添加更有现代感的字符');
    }

    if (uniquenessScore < 50) {
      recommendations.push('建议避免过于热门的组合，增加独特性');
    }

    if (overallCommonness > 90 && uniquenessScore < 40) {
      recommendations.push('名字过于大众化，建议在保持常用度的同时增加独特元素');
    }

    if (recommendations.length === 0) {
      recommendations.push('整体社会认可度良好，可以保持当前选择');
    }

    return recommendations;
  }

  /**
   * 获取时代特征字符分类
   */
  getEraCharacteristics(): typeof ERA_CHARACTERISTICS {
    return ERA_CHARACTERISTICS;
  }

  /**
   * 获取常见组合数据
   */
  getCommonCombinations(): typeof COMMON_COMBINATIONS {
    return COMMON_COMBINATIONS;
  }

  /**
   * 检查重名率级别
   */
  checkDuplicationLevel(combination: string): 'high' | 'medium' | 'low' | 'unknown' {
    if (COMMON_COMBINATIONS.high.includes(combination)) return 'high';
    if (COMMON_COMBINATIONS.medium.includes(combination)) return 'medium';
    if (COMMON_COMBINATIONS.low.includes(combination)) return 'low';
    return 'unknown';
  }
}