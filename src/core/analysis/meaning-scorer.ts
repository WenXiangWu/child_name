/**
 * 字义寓意评分器
 * 基于汉字的字义积极性、组合和谐性和文化内涵，计算名字的字义寓意评分
 */

import { WordDataLoader } from '../naming/word-loader';

export interface CharacterMeaning {
  char: string;                     // 汉字
  meanings: string[];               // 字义列表
  positivity: number;               // 积极性评分 (0-100)
  culturalDepth: number;            // 文化深度评分 (0-100)
  commonness: number;               // 常用度评分 (0-100)
}

export interface MeaningAnalysis {
  char1Analysis: CharacterMeaning;  // 首字分析
  char2Analysis: CharacterMeaning;  // 次字分析
  combinationHarmony: number;       // 组合和谐度 (0-100)
  combinationMeaning: string;       // 组合含义
  culturalReferences: string[];     // 文化典故引用
}

export interface MeaningScoreResult {
  score: number;                    // 最终字义评分 (0-100)
  analysis: MeaningAnalysis;        // 详细分析
  strengths: string[];              // 优势点
  suggestions: string[];            // 改进建议
}

/**
 * 积极性关键词字典
 */
const POSITIVE_KEYWORDS = [
  // 品德类 (高分)
  ['德', '仁', '义', '礼', '智', '信', '忠', '孝', '诚', '善'],
  // 智慧类 (高分)
  ['智', '慧', '明', '聪', '睿', '哲', '思', '学', '文', '博'],
  // 成功类 (高分)
  ['成', '功', '达', '胜', '优', '秀', '杰', '才', '能', '强'],
  // 美好类 (中高分)
  ['美', '好', '佳', '优', '雅', '清', '纯', '洁', '亮', '光'],
  // 自然类 (中分)
  ['山', '水', '林', '花', '草', '阳', '月', '星', '云', '风'],
  // 时间类 (中分)
  ['春', '夏', '秋', '冬', '晨', '夕', '朝', '暮', '新', '永']
];

/**
 * 消极性关键词字典
 */
const NEGATIVE_KEYWORDS = [
  // 疾病类 (扣分)
  ['病', '痛', '苦', '难', '伤', '死', '亡', '败', '坏', '恶'],
  // 灾难类 (扣分)
  ['灾', '祸', '险', '危', '毒', '害', '破', '损', '失', '缺'],
  // 消极情绪类 (扣分)
  ['愁', '悲', '哭', '泪', '怒', '恨', '怨', '忧', '惧', '惊']
];

/**
 * 文化典故字典
 */
const CULTURAL_REFERENCES = {
  // 诗词典故
  '浩然': '孟子"吾善养吾浩然之气"，正大刚直之意',
  '子轩': '轩辕黄帝之后代，寓意尊贵',
  '思源': '"饮水思源"，寓意不忘本源',
  '志远': '"志存高远"，寓意理想远大',
  '博文': '"博文约礼"，寓意学识渊博',
  '明德': '"明德惟馨"，寓意品德高尚',
  '慧心': '"心如明镜"，寓意智慧通达',
  '雅韵': '高雅的韵味，寓意气质不凡',
  
  // 成语典故
  '一鸣': '"一鸣惊人"，寓意才华出众',
  '文彬': '"文质彬彬"，寓意文雅有礼',
  '俊杰': '"人中俊杰"，寓意才能出众',
  '嘉诚': '"嘉言善行"，寓意诚实善良',
  '瑞祥': '"祥瑞之兆"，寓意吉祥如意'
};

/**
 * 评分权重配置
 */
const SCORING_WEIGHTS = {
  positivityWeight: 0.4,        // 积极性权重 40%
  harmonyWeight: 0.3,           // 组合和谐性权重 30%
  culturalWeight: 0.2,          // 文化深度权重 20%
  commonnessWeight: 0.1,        // 常用度权重 10%
  baseScore: 70                 // 基础分
};

export class MeaningScorer {
  private wordLoader: WordDataLoader;

  constructor() {
    this.wordLoader = WordDataLoader.getInstance();
  }

  /**
   * 计算名字的字义寓意评分
   * @param char1 名字首字
   * @param char2 名字次字
   * @returns 字义评分结果
   */
  async calculateMeaningScore(char1: string, char2: string): Promise<MeaningScoreResult> {
    
    // 1. 分析单字字义
    const char1Analysis = await this.analyzeCharacterMeaning(char1);
    const char2Analysis = await this.analyzeCharacterMeaning(char2);

    // 2. 分析组合含义
    const combinationHarmony = this.calculateCombinationHarmony(char1Analysis, char2Analysis);
    const combinationMeaning = this.generateCombinationMeaning(char1, char2);
    const culturalReferences = this.findCulturalReferences(char1 + char2);

    const analysis: MeaningAnalysis = {
      char1Analysis,
      char2Analysis,
      combinationHarmony,
      combinationMeaning,
      culturalReferences
    };

    // 3. 计算综合评分
    const score = this.calculateFinalMeaningScore(analysis);

    // 4. 生成优势点和建议
    const strengths = this.identifyStrengths(analysis);
    const suggestions = this.generateSuggestions(analysis);

    return {
      score,
      analysis,
      strengths,
      suggestions
    };
  }

  /**
   * 分析单个汉字的字义
   */
  private async analyzeCharacterMeaning(char: string): Promise<CharacterMeaning> {
    try {
      // 从字典获取字义信息
      const charDetail = await this.wordLoader.getCharacterInfo(char);
      
      let meanings: string[] = [];
      let positivity = 70; // 默认中性
      let culturalDepth = 50; // 默认一般
      let commonness = 60; // 默认中等

      if (charDetail) {
        // 提取字义信息
        meanings = this.extractMeanings(charDetail.explanation || '');
        positivity = this.calculatePositivity(char, meanings);
        culturalDepth = this.calculateCulturalDepth(char, meanings);
        // WordRecord 没有 frequency 字段，使用字义复杂度估算常用度
        commonness = this.calculateCommonness(charDetail.explanation.length);
      } else {
        // 如果字典中没有，使用基础分析
        meanings = [`${char}字的含义`];
        positivity = this.calculateBasicPositivity(char);
      }

      return {
        char,
        meanings,
        positivity,
        culturalDepth,
        commonness
      };
    } catch (error) {
      console.warn(`分析字符"${char}"的字义失败`, error);
      
      // 返回默认分析
      return {
        char,
        meanings: [`${char}字的含义`],
        positivity: 70,
        culturalDepth: 50,
        commonness: 60
      };
    }
  }

  /**
   * 从字典解释中提取关键字义
   */
  private extractMeanings(explanation: string): string[] {
    if (!explanation) return [];
    
    // 简单的字义提取逻辑，实际应该更复杂
    const meanings = explanation
      .split(/[，。；、]/)
      .filter(meaning => meaning.length > 0 && meaning.length < 20)
      .slice(0, 3); // 最多取3个主要含义
    
    return meanings.length > 0 ? meanings : ['含义说明'];
  }

  /**
   * 计算字义积极性
   */
  private calculatePositivity(char: string, meanings: string[]): number {
    let score = 70; // 基础中性分

    // 检查积极关键词
    for (const keywordGroup of POSITIVE_KEYWORDS) {
      for (const keyword of keywordGroup) {
        if (char.includes(keyword) || meanings.some(m => m.includes(keyword))) {
          score += 15;
          break; // 每组最多加一次分
        }
      }
    }

    // 检查消极关键词
    for (const keywordGroup of NEGATIVE_KEYWORDS) {
      for (const keyword of keywordGroup) {
        if (char.includes(keyword) || meanings.some(m => m.includes(keyword))) {
          score -= 20;
          break; // 每组最多扣一次分
        }
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 计算基础积极性（无字典时使用）
   */
  private calculateBasicPositivity(char: string): number {
    let score = 70;

    // 基于字符本身判断
    for (const keywordGroup of POSITIVE_KEYWORDS) {
      if (keywordGroup.includes(char)) {
        score += 15;
        break;
      }
    }

    for (const keywordGroup of NEGATIVE_KEYWORDS) {
      if (keywordGroup.includes(char)) {
        score -= 20;
        break;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 计算文化深度
   */
  private calculateCulturalDepth(char: string, meanings: string[]): number {
    let depth = 50; // 基础分

    // 检查是否有文化典故
    const culturalKeywords = ['诗', '书', '礼', '易', '春', '秋', '论', '语', '孟', '子'];
    for (const keyword of culturalKeywords) {
      if (meanings.some(m => m.includes(keyword))) {
        depth += 20;
        break;
      }
    }

    // 检查是否为古代常用字
    const classicalChars = ['之', '者', '也', '其', '则', '以', '为', '有', '无', '是'];
    if (classicalChars.includes(char)) {
      depth += 15;
    }

    return Math.max(0, Math.min(100, depth));
  }

  /**
   * 计算常用度
   */
  private calculateCommonness(frequency: number): number {
    // 将频率转换为0-100的评分
    // 这里使用简化的转换逻辑
    if (frequency >= 1000) return 90;
    if (frequency >= 500) return 80;
    if (frequency >= 100) return 70;
    if (frequency >= 50) return 60;
    if (frequency >= 10) return 50;
    return 40;
  }

  /**
   * 计算组合和谐度
   */
  private calculateCombinationHarmony(char1: CharacterMeaning, char2: CharacterMeaning): number {
    let harmony = 75; // 基础和谐分

    // 积极性差异不宜过大
    const positivityDiff = Math.abs(char1.positivity - char2.positivity);
    if (positivityDiff > 30) {
      harmony -= 15; // 积极性差异过大扣分
    } else if (positivityDiff < 10) {
      harmony += 10; // 积极性相近加分
    }

    // 两字都有高积极性
    if (char1.positivity >= 80 && char2.positivity >= 80) {
      harmony += 15;
    }

    // 文化深度互补
    if ((char1.culturalDepth >= 70 && char2.culturalDepth >= 70)) {
      harmony += 10;
    }

    return Math.max(0, Math.min(100, harmony));
  }

  /**
   * 生成组合含义
   */
  private generateCombinationMeaning(char1: string, char2: string): string {
    const combination = char1 + char2;
    
    // 检查是否有预定义的组合含义
    if (CULTURAL_REFERENCES[combination as keyof typeof CULTURAL_REFERENCES]) {
      return CULTURAL_REFERENCES[combination as keyof typeof CULTURAL_REFERENCES];
    }

    // 生成通用组合含义
    return `${char1}${char2}寓意美好，象征积极向上的品质`;
  }

  /**
   * 查找文化典故
   */
  private findCulturalReferences(combination: string): string[] {
    const references: string[] = [];
    
    // 检查直接匹配
    if (CULTURAL_REFERENCES[combination as keyof typeof CULTURAL_REFERENCES]) {
      references.push(CULTURAL_REFERENCES[combination as keyof typeof CULTURAL_REFERENCES]);
    }

    // 检查部分匹配
    for (const [key, value] of Object.entries(CULTURAL_REFERENCES)) {
      if (key.includes(combination[0]) || key.includes(combination[1])) {
        if (!references.includes(value)) {
          references.push(value);
        }
      }
    }

    return references.slice(0, 2); // 最多返回2个相关典故
  }

  /**
   * 计算最终字义评分
   */
  private calculateFinalMeaningScore(analysis: MeaningAnalysis): number {
    const { char1Analysis, char2Analysis, combinationHarmony } = analysis;

    // 单字积极性平均分
    const avgPositivity = (char1Analysis.positivity + char2Analysis.positivity) / 2;
    
    // 文化深度平均分
    const avgCultural = (char1Analysis.culturalDepth + char2Analysis.culturalDepth) / 2;
    
    // 常用度平均分
    const avgCommonness = (char1Analysis.commonness + char2Analysis.commonness) / 2;

    // 加权计算
    const score = 
      avgPositivity * SCORING_WEIGHTS.positivityWeight +
      combinationHarmony * SCORING_WEIGHTS.harmonyWeight +
      avgCultural * SCORING_WEIGHTS.culturalWeight +
      avgCommonness * SCORING_WEIGHTS.commonnessWeight;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * 识别优势点
   */
  private identifyStrengths(analysis: MeaningAnalysis): string[] {
    const strengths: string[] = [];
    const { char1Analysis, char2Analysis, combinationHarmony, culturalReferences } = analysis;

    if (char1Analysis.positivity >= 80 || char2Analysis.positivity >= 80) {
      strengths.push('字义积极正面，寓意美好');
    }

    if (combinationHarmony >= 85) {
      strengths.push('字义组合和谐，相得益彰');
    }

    if (char1Analysis.culturalDepth >= 70 || char2Analysis.culturalDepth >= 70) {
      strengths.push('具有深厚的文化内涵');
    }

    if (culturalReferences.length > 0) {
      strengths.push('有经典文化典故支撑');
    }

    if (strengths.length === 0) {
      strengths.push('字义表达清晰，含义明确');
    }

    return strengths;
  }

  /**
   * 生成改进建议
   */
  private generateSuggestions(analysis: MeaningAnalysis): string[] {
    const suggestions: string[] = [];
    const { char1Analysis, char2Analysis, combinationHarmony } = analysis;

    if (char1Analysis.positivity < 60 || char2Analysis.positivity < 60) {
      suggestions.push('建议选择寓意更积极的字符');
    }

    if (combinationHarmony < 70) {
      suggestions.push('建议调整字符组合，提升整体和谐度');
    }

    if (char1Analysis.culturalDepth < 50 && char2Analysis.culturalDepth < 50) {
      suggestions.push('可以考虑选择文化内涵更深的字符');
    }

    if (suggestions.length === 0) {
      suggestions.push('字义寓意良好，可以考虑保持当前选择');
    }

    return suggestions;
  }

  /**
   * 获取积极性关键词
   */
  getPositiveKeywords(): string[][] {
    return POSITIVE_KEYWORDS;
  }

  /**
   * 获取文化典故字典
   */
  getCulturalReferences(): typeof CULTURAL_REFERENCES {
    return CULTURAL_REFERENCES;
  }
}