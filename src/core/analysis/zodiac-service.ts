/**
 * 生肖取名服务
 * 提供生肖查询、字符评估、筛选等功能
 */

import { ZodiacAnimal, ZodiacData, ZodiacInfo, ZodiacCharacterEvaluation } from '../common/types';

export class ZodiacService {
  private static instance: ZodiacService;
  private zodiacData: ZodiacData | null = null;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): ZodiacService {
    if (!ZodiacService.instance) {
      ZodiacService.instance = new ZodiacService();
    }
    return ZodiacService.instance;
  }

  /**
   * 初始化生肖数据
   */
  public async initialize(): Promise<void> {
    if (this.initialized && this.zodiacData) {
      return;
    }

    try {
      const response = await fetch('/data/zodiac-data.json');
      if (!response.ok) {
        throw new Error(`Failed to load zodiac data: ${response.statusText}`);
      }
      
      this.zodiacData = await response.json();
      this.initialized = true;
      console.log('✅ 生肖数据加载完成');
    } catch (error) {
      console.error('❌ 生肖数据加载失败:', error);
      throw error;
    }
  }

  /**
   * 确保已初始化
   */
  private ensureInitialized(): void {
    if (!this.initialized || !this.zodiacData) {
      throw new Error('ZodiacService not initialized. Call initialize() first.');
    }
  }

  /**
   * 根据年份获取生肖
   */
  public getZodiacByYear(year: number): ZodiacAnimal {
    this.ensureInitialized();
    
    const zodiacAnimal = this.zodiacData!.yearMapping[year.toString()];
    if (!zodiacAnimal) {
      // 如果年份不在映射表中，使用计算方式
      const baseYear = 1960; // 鼠年基准
      const zodiacOrder: ZodiacAnimal[] = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
      const index = (year - baseYear) % 12;
      return zodiacOrder[index >= 0 ? index : index + 12];
    }
    
    return zodiacAnimal;
  }

  /**
   * 获取生肖详细信息
   */
  public getZodiacInfo(zodiac: ZodiacAnimal): ZodiacInfo {
    this.ensureInitialized();
    
    const info = this.zodiacData!.zodiacs[zodiac];
    if (!info) {
      throw new Error(`Unknown zodiac: ${zodiac}`);
    }
    
    return info;
  }

  /**
   * 评估单个字符对特定生肖的适宜性
   */
  public evaluateCharacterForZodiac(char: string, zodiac: ZodiacAnimal): ZodiacCharacterEvaluation {
    this.ensureInitialized();
    
    const zodiacInfo = this.getZodiacInfo(zodiac);
    let score = 3; // 基础分数
    let isFavorable = false;
    let isUnfavorable = false;
    let reason = '普通字符，无特殊生肖影响';
    const relatedRadicals: string[] = [];

    // 检查是否为喜用字
    if (zodiacInfo.favorable.characters.includes(char)) {
      score += 2;
      isFavorable = true;
      reason = '此字为生肖喜用字，有积极作用';
    }

    // 检查是否为忌用字
    if (zodiacInfo.unfavorable.characters.includes(char)) {
      score -= 3;
      isUnfavorable = true;
      reason = '此字为生肖忌用字，建议避免使用';
    }

    // 检查部首
    for (const radical of zodiacInfo.favorable.radicals) {
      if (char.includes(radical) || this.containsRadical(char, radical)) {
        score += 1;
        isFavorable = true;
        relatedRadicals.push(radical);
        reason = `含有生肖喜用部首"${radical}"，寓意吉祥`;
        break;
      }
    }

    for (const radical of zodiacInfo.unfavorable.radicals) {
      if (char.includes(radical) || this.containsRadical(char, radical)) {
        score -= 2;
        isUnfavorable = true;
        relatedRadicals.push(radical);
        reason = `含有生肖忌用部首"${radical}"，可能有不利影响`;
        break;
      }
    }

    // 确保分数在0-5范围内
    score = Math.max(0, Math.min(5, score));

    return {
      char,
      zodiac,
      score,
      isFavorable,
      isUnfavorable,
      reason,
      relatedRadicals
    };
  }

  /**
   * 检查字符是否包含特定部首
   * 这里是简化实现，实际使用中可能需要更复杂的字符拆解逻辑
   */
  private containsRadical(char: string, radical: string): boolean {
    // 简单的包含检查，实际使用中可能需要更精确的部首检测
    return char.includes(radical);
  }

  /**
   * 批量评估字符列表
   */
  public evaluateCharactersForZodiac(characters: string[], zodiac: ZodiacAnimal): ZodiacCharacterEvaluation[] {
    return characters.map(char => this.evaluateCharacterForZodiac(char, zodiac));
  }

  /**
   * 筛选适合生肖的字符
   */
  public filterCharactersForZodiac(
    characters: string[], 
    zodiac: ZodiacAnimal, 
    minScore: number = 3
  ): { suitable: string[], evaluations: ZodiacCharacterEvaluation[] } {
    const evaluations = this.evaluateCharactersForZodiac(characters, zodiac);
    const suitable = evaluations
      .filter(evaluation => evaluation.score >= minScore)
      .map(evaluation => evaluation.char);
    
    return { suitable, evaluations };
  }

  /**
   * 获取生肖推荐字符
   */
  public getRecommendedCharacters(zodiac: ZodiacAnimal): string[] {
    this.ensureInitialized();
    
    const zodiacInfo = this.getZodiacInfo(zodiac);
    return zodiacInfo.favorable.characters;
  }

  /**
   * 获取生肖忌用字符
   */
  public getAvoidedCharacters(zodiac: ZodiacAnimal): string[] {
    this.ensureInitialized();
    
    const zodiacInfo = this.getZodiacInfo(zodiac);
    return zodiacInfo.unfavorable.characters;
  }

  /**
   * 检查名字的生肖适宜性
   */
  public evaluateNameForZodiac(
    familyName: string, 
    givenName: string, 
    zodiac: ZodiacAnimal
  ): {
    zodiac: ZodiacAnimal;
    characters: ZodiacCharacterEvaluation[];
    overallScore: number;
    summary: string;
  } {
    const allChars = (familyName + givenName).split('');
    const evaluations = this.evaluateCharactersForZodiac(allChars, zodiac);
    
    // 计算整体评分（取平均值）
    const overallScore = evaluations.length > 0 
      ? evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length
      : 3;

    // 生成总结
    let summary = '';
    const favorableCount = evaluations.filter(e => e.isFavorable).length;
    const unfavorableCount = evaluations.filter(e => e.isUnfavorable).length;

    if (favorableCount > unfavorableCount) {
      summary = `此名字较适合${zodiac}年出生的宝宝，包含${favorableCount}个有利字符`;
    } else if (unfavorableCount > favorableCount) {
      summary = `此名字对${zodiac}年出生的宝宝可能不太适宜，包含${unfavorableCount}个不利字符`;
    } else {
      summary = `此名字对${zodiac}年出生的宝宝影响中性`;
    }

    return {
      zodiac,
      characters: evaluations,
      overallScore,
      summary
    };
  }

  /**
   * 获取所有生肖信息
   */
  public getAllZodiacs(): Record<ZodiacAnimal, ZodiacInfo> {
    this.ensureInitialized();
    return this.zodiacData!.zodiacs;
  }

  /**
   * 获取生肖列表
   */
  public getZodiacList(): ZodiacAnimal[] {
    return ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  }

  /**
   * 根据生肖获取推荐的五行
   */
  public getRecommendedWuxingForZodiac(zodiac: ZodiacAnimal): string {
    this.ensureInitialized();
    
    const zodiacInfo = this.getZodiacInfo(zodiac);
    return zodiacInfo.element;
  }

  /**
   * 检查两个生肖的关系（相冲、相害、三合等）
   */
  public getZodiacRelationship(zodiac1: ZodiacAnimal, zodiac2: ZodiacAnimal): {
    type: 'same' | 'compatible' | 'conflict' | 'harm' | 'neutral';
    description: string;
  } {
    if (zodiac1 === zodiac2) {
      return { type: 'same', description: '相同生肖' };
    }

    // 相冲关系（六冲）
    const conflictPairs: [ZodiacAnimal, ZodiacAnimal][] = [
      ['鼠', '马'], ['牛', '羊'], ['虎', '猴'], 
      ['兔', '鸡'], ['龙', '狗'], ['蛇', '猪']
    ];

    for (const [a, b] of conflictPairs) {
      if ((zodiac1 === a && zodiac2 === b) || (zodiac1 === b && zodiac2 === a)) {
        return { type: 'conflict', description: `${zodiac1}${zodiac2}相冲，气场不合` };
      }
    }

    // 三合关系
    const compatibleGroups: ZodiacAnimal[][] = [
      ['鼠', '龙', '猴'], // 申子辰三合
      ['牛', '蛇', '鸡'], // 巳酉丑三合
      ['虎', '马', '狗'], // 寅午戌三合
      ['兔', '羊', '猪']  // 亥卯未三合
    ];

    for (const group of compatibleGroups) {
      if (group.includes(zodiac1) && group.includes(zodiac2)) {
        return { type: 'compatible', description: `${zodiac1}${zodiac2}三合，相互助益` };
      }
    }

    return { type: 'neutral', description: '关系中性' };
  }
}

// 导出单例实例
export const zodiacService = ZodiacService.getInstance();
