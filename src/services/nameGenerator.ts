/**
 * 名字生成服务
 * 提供基于用户偏好生成名字的功能
 */

import { NameGenerationParams, GeneratedName, NameAnalysis, Gender, NameLength } from '../types/naming';
import { Character, FiveElement } from '../types/character';

// 模拟数据：常用汉字及其五行属性
const COMMON_CHARS: Record<string, {
  char: string;
  pinyin: string[];
  tone: number[];
  fiveElement: FiveElement;
  meaning: string[];
  frequency: number;
}> = {
  '德': { char: '德', pinyin: ['de'], tone: [2], fiveElement: '火', meaning: ['道德', '恩惠', '感恩'], frequency: 8 },
  '宇': { char: '宇', pinyin: ['yu'], tone: [3], fiveElement: '土', meaning: ['宇宙', '空间', '大度'], frequency: 9 },
  '智': { char: '智', pinyin: ['zhi'], tone: [4], fiveElement: '火', meaning: ['聪明', '智慧', '见识'], frequency: 8 },
  '宸': { char: '宸', pinyin: ['chen'], tone: [2], fiveElement: '土', meaning: ['屋檐', '帝王', '君王'], frequency: 7 },
  '浩': { char: '浩', pinyin: ['hao'], tone: [4], fiveElement: '水', meaning: ['广大', '浩瀚', '浩大'], frequency: 9 },
  '天': { char: '天', pinyin: ['tian'], tone: [1], fiveElement: '火', meaning: ['天空', '自然', '天堂'], frequency: 10 },
  '宁': { char: '宁', pinyin: ['ning'], tone: [2], fiveElement: '火', meaning: ['安宁', '平静', '宁静'], frequency: 8 },
  '轩': { char: '轩', pinyin: ['xuan'], tone: [1], fiveElement: '木', meaning: ['高大', '气度', '华丽'], frequency: 9 },
  '文': { char: '文', pinyin: ['wen'], tone: [2], fiveElement: '水', meaning: ['文采', '文化', '文学'], frequency: 10 },
  '博': { char: '博', pinyin: ['bo'], tone: [2], fiveElement: '水', meaning: ['博大', '博学', '丰富'], frequency: 9 },
  '雅': { char: '雅', pinyin: ['ya'], tone: [3], fiveElement: '木', meaning: ['文雅', '高雅', '优雅'], frequency: 8 },
  '芳': { char: '芳', pinyin: ['fang'], tone: [1], fiveElement: '木', meaning: ['香气', '美好', '美德'], frequency: 7 },
  '婷': { char: '婷', pinyin: ['ting'], tone: [2], fiveElement: '火', meaning: ['美好', '亭亭玉立', '优美'], frequency: 9 },
  '玉': { char: '玉', pinyin: ['yu'], tone: [4], fiveElement: '金', meaning: ['美玉', '洁白', '高贵'], frequency: 8 },
  '华': { char: '华', pinyin: ['hua'], tone: [2], fiveElement: '水', meaning: ['光彩', '繁盛', '华丽'], frequency: 9 },
  '嘉': { char: '嘉', pinyin: ['jia'], tone: [1], fiveElement: '木', meaning: ['美好', '赞许', '吉庆'], frequency: 8 },
  '佳': { char: '佳', pinyin: ['jia'], tone: [1], fiveElement: '木', meaning: ['美好', '出众', '优秀'], frequency: 9 },
  '欣': { char: '欣', pinyin: ['xin'], tone: [1], fiveElement: '木', meaning: ['快乐', '高兴', '欢欣'], frequency: 8 },
  '怡': { char: '怡', pinyin: ['yi'], tone: [2], fiveElement: '木', meaning: ['和悦', '愉快', '安乐'], frequency: 7 },
  '静': { char: '静', pinyin: ['jing'], tone: [4], fiveElement: '金', meaning: ['安静', '平静', '文静'], frequency: 9 },
  '子': { char: '子', pinyin: ['zi'], tone: [3], fiveElement: '水', meaning: ['孩子', '种子', '智者'], frequency: 10 },
  '涵': { char: '涵', pinyin: ['han'], tone: [2], fiveElement: '水', meaning: ['包容', '涵养', '内涵'], frequency: 8 },
  '瑞': { char: '瑞', pinyin: ['rui'], tone: [4], fiveElement: '金', meaning: ['吉祥', '好预兆', '福气'], frequency: 7 },
  '泽': { char: '泽', pinyin: ['ze'], tone: [2], fiveElement: '水', meaning: ['恩泽', '光泽', '润泽'], frequency: 8 },
  '明': { char: '明', pinyin: ['ming'], tone: [2], fiveElement: '火', meaning: ['明亮', '聪明', '明白'], frequency: 10 },
  '俊': { char: '俊', pinyin: ['jun'], tone: [4], fiveElement: '火', meaning: ['英俊', '杰出', '卓越'], frequency: 9 },
  '杰': { char: '杰', pinyin: ['jie'], tone: [2], fiveElement: '木', meaning: ['杰出', '卓越', '出众'], frequency: 9 },
  '鑫': { char: '鑫', pinyin: ['xin'], tone: [1], fiveElement: '金', meaning: ['财富', '兴盛', '繁荣'], frequency: 7 },
  '鸿': { char: '鸿', pinyin: ['hong'], tone: [2], fiveElement: '水', meaning: ['大雁', '宏大', '前程'], frequency: 7 },
  '志': { char: '志', pinyin: ['zhi'], tone: [4], fiveElement: '火', meaning: ['意志', '志向', '志气'], frequency: 8 },
};

// 模拟数据：性别偏好的汉字
const GENDER_PREFERENCE: Record<Gender, string[]> = {
  male: ['宇', '智', '宸', '浩', '天', '宁', '轩', '文', '博', '子', '涵', '瑞', '泽', '明', '俊', '杰', '鑫', '鸿', '志', '德'],
  female: ['雅', '芳', '婷', '玉', '华', '嘉', '佳', '欣', '怡', '静', '子', '涵', '瑞', '明'],
  neutral: ['宁', '文', '博', '子', '涵', '瑞', '明', '德', '嘉', '佳', '欣']
};

/**
 * 名字生成服务
 */
export class NameGenerator {
  /**
   * 生成名字
   * @param params 名字生成参数
   * @returns 生成的名字列表
   */
  static generateNames(params: NameGenerationParams): GeneratedName[] {
    const results: GeneratedName[] = [];
    const { count, gender, nameLength, familyName } = params;

    // 根据性别和偏好筛选合适的汉字
    const suitableChars = this.getSuitableChars(params);

    // 生成指定数量的名字
    for (let i = 0; i < count; i++) {
      const givenNameChars: Character[] = [];

      // 根据名字长度生成名字
      for (let j = 0; j < nameLength; j++) {
        // 随机选择一个合适的汉字
        const randomIndex = Math.floor(Math.random() * suitableChars.length);
        const charKey = suitableChars[randomIndex];

        // 构建完整的Character对象
        const charData = COMMON_CHARS[charKey];
        const character: Character = {
          char: charData.char,
          pinyin: charData.pinyin,
          tone: charData.tone,
          radical: '', // 简化示例，实际应填充
          strokeCount: 0, // 简化示例，实际应填充
          fiveElement: charData.fiveElement,
          frequency: charData.frequency,
          meaning: charData.meaning,
          structure: '', // 简化示例，实际应填充
        };

        givenNameChars.push(character);
      }

      // 生成名字字符串
      const givenName = givenNameChars.map(c => c.char).join('');
      const fullName = familyName + givenName;

      // 生成名字分析
      const analysis = this.analyzeNaming(familyName, givenNameChars, params);

      // 创建结果对象
      const result: GeneratedName = {
        familyName,
        givenName,
        fullName,
        characters: givenNameChars,
        analysis,
        createTime: Date.now(),
        id: this.generateId()
      };

      results.push(result);
    }

    // 按评分排序
    return results.sort((a, b) => b.analysis.overallScore - a.analysis.overallScore);
  }

  /**
   * 根据参数获取适合的汉字列表
   * @param params 名字生成参数
   * @returns 适合的汉字列表
   */
  private static getSuitableChars(params: NameGenerationParams): string[] {
    const { gender, desiredFiveElements, avoidFiveElements, avoidChars, meaningKeywords } = params;

    // 首先根据性别筛选
    let suitableChars = [...GENDER_PREFERENCE[gender]];

    // 过滤掉需要避免的字
    if (avoidChars && avoidChars.length > 0) {
      suitableChars = suitableChars.filter(char => !avoidChars.includes(char));
    }

    // 过滤五行属性
    if (desiredFiveElements && desiredFiveElements.length > 0) {
      suitableChars = suitableChars.filter(char => {
        const element = COMMON_CHARS[char].fiveElement;
        return desiredFiveElements.includes(element);
      });
    }

    if (avoidFiveElements && avoidFiveElements.length > 0) {
      suitableChars = suitableChars.filter(char => {
        const element = COMMON_CHARS[char].fiveElement;
        return !avoidFiveElements.includes(element);
      });
    }

    // 根据字义关键词筛选
    if (meaningKeywords && meaningKeywords.length > 0) {
      const filteredByMeaning = suitableChars.filter(char => {
        const meanings = COMMON_CHARS[char].meaning;
        return meaningKeywords.some(keyword =>
          meanings.some(meaning => meaning.includes(keyword))
        );
      });

      // 如果筛选后还有字，则使用筛选结果；否则保留原列表
      if (filteredByMeaning.length > 0) {
        suitableChars = filteredByMeaning;
      }
    }

    // 如果筛选后没有合适的字，则返回原始性别偏好的字
    if (suitableChars.length === 0) {
      return GENDER_PREFERENCE[gender];
    }

    return suitableChars;
  }

  /**
   * 分析名字
   * @param familyName 姓氏
   * @param characters 名字中的汉字
   * @param params 名字生成参数
   * @returns 名字分析结果
   */
  private static analyzeNaming(familyName: string, characters: Character[], params: NameGenerationParams): NameAnalysis {
    // 五行分析
    const fiveElements = characters.map(c => c.fiveElement);
    const fiveElementsScore = this.calculateFiveElementsScore(fiveElements, params);

    // 音律分析
    const tones = characters.map(c => c.tone[0] % 2 === 0 ? '仄' : '平');
    const pronunciationScore = this.calculatePronunciationScore(characters);

    // 字义分析
    const meaningScore = this.calculateMeaningScore(characters, params);

    // 计算总分
    const overallScore = Math.round((fiveElementsScore + pronunciationScore + meaningScore) / 3);

    return {
      fiveElements: {
        chars: fiveElements,
        score: fiveElementsScore,
        description: this.getFiveElementsDescription(fiveElements)
      },
      pronunciation: {
        tones,
        score: pronunciationScore,
        description: this.getPronunciationDescription(characters)
      },
      meaning: {
        overall: this.getMeaningDescription(characters),
        score: meaningScore,
        details: characters.map(c => `${c.char}: ${c.meaning.join('、')}`)
      },
      overallScore
    };
  }

  /**
   * 计算五行分数
   * @param elements 五行元素列表
   * @param params 名字生成参数
   * @returns 五行分数
   */
  private static calculateFiveElementsScore(elements: FiveElement[], params: NameGenerationParams): number {
    // 简化的五行评分算法
    let score = 70; // 基础分

    // 如果有期望的五行，且全部符合，加分
    if (params.desiredFiveElements && params.desiredFiveElements.length > 0) {
      const allMatch = elements.every(element => params.desiredFiveElements!.includes(element));
      if (allMatch) {
        score += 20;
      } else {
        // 部分符合
        const matchCount = elements.filter(element => params.desiredFiveElements!.includes(element)).length;
        score += (matchCount / elements.length) * 15;
      }
    }

    // 五行相生相克评分
    if (elements.length > 1) {
      // 简化的五行相生关系：金生水，水生木，木生火，火生土，土生金
      const relations: Record<FiveElement, FiveElement> = {
        '金': '水',
        '水': '木',
        '木': '火',
        '火': '土',
        '土': '金'
      };

      // 检查是否有相生关系
      for (let i = 0; i < elements.length - 1; i++) {
        if (relations[elements[i]] === elements[i + 1]) {
          score += 5; // 相生加分
        }
      }
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  /**
   * 计算发音分数
   * @param characters 汉字列表
   * @returns 发音分数
   */
  private static calculatePronunciationScore(characters: Character[]): number {
    let score = 70; // 基础分

    // 检查声调是否和谐
    if (characters.length > 1) {
      // 避免连续相同声调
      let hasSameTones = false;
      for (let i = 0; i < characters.length - 1; i++) {
        if (characters[i].tone[0] === characters[i + 1].tone[0]) {
          hasSameTones = true;
          break;
        }
      }

      if (!hasSameTones) {
        score += 10;
      }

      // 平仄搭配
      let hasGoodTonePattern = false;
      if (characters.length === 2) {
        // 双字名：平仄或仄平
        const isToneEven1 = characters[0].tone[0] % 2 === 0; // 仄声
        const isToneEven2 = characters[1].tone[0] % 2 === 0;
        if (isToneEven1 !== isToneEven2) {
          hasGoodTonePattern = true;
        }
      }

      if (hasGoodTonePattern) {
        score += 15;
      }
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  /**
   * 计算字义分数
   * @param characters 汉字列表
   * @param params 名字生成参数
   * @returns 字义分数
   */
  private static calculateMeaningScore(characters: Character[], params: NameGenerationParams): number {
    let score = 70; // 基础分

    // 检查是否包含期望的字义关键词
    if (params.meaningKeywords && params.meaningKeywords.length > 0) {
      let matchCount = 0;

      for (const char of characters) {
        for (const meaning of char.meaning) {
          for (const keyword of params.meaningKeywords) {
            if (meaning.includes(keyword)) {
              matchCount++;
              break;
            }
          }
        }
      }

      // 根据匹配数量加分
      if (matchCount > 0) {
        score += Math.min(25, matchCount * 10);
      }
    }

    // 根据字的常用度评分
    const avgFrequency = characters.reduce((sum, char) => sum + char.frequency, 0) / characters.length;
    score += (avgFrequency - 5) * 2; // 5是中等常用度，每高1分加2分

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  /**
   * 获取五行描述
   * @param elements 五行元素列表
   * @returns 五行描述
   */
  private static getFiveElementsDescription(elements: FiveElement[]): string {
    const counts: Record<FiveElement, number> = {
      '金': 0,
      '木': 0,
      '水': 0,
      '火': 0,
      '土': 0
    };

    elements.forEach(element => {
      counts[element]++;
    });

    // 生成描述
    const descriptions = [];
    for (const element in counts) {
      if (counts[element as FiveElement] > 0) {
        descriptions.push(`${element}(${counts[element as FiveElement]})`);
      }
    }

    let result = `五行组合为：${descriptions.join('、')}。`;

    // 添加五行相生相克分析
    if (elements.length > 1) {
      // 简化的分析
      if (elements[0] === elements[1]) {
        result += '名字中五行相同，五行较为单一。';
      } else {
        const relations: Record<string, string> = {
          '金水': '金生水，寓意财源广进。',
          '水木': '水生木，寓意生机勃勃。',
          '木火': '木生火，寓意热情活力。',
          '火土': '火生土，寓意稳重踏实。',
          '土金': '土生金，寓意富贵吉祥。',
          '水金': '水克金，五行相克。',
          '金木': '金克木，五行相克。',
          '木土': '木克土，五行相克。',
          '土水': '土克水，五行相克。',
          '火金': '火克金，五行相克。'
        };

        const key = `${elements[0]}${elements[1]}`;
        if (relations[key]) {
          result += relations[key];
        } else {
          result += '五行搭配和谐。';
        }
      }
    }

    return result;
  }

  /**
   * 获取发音描述
   * @param characters 汉字列表
   * @returns 发音描述
   */
  private static getPronunciationDescription(characters: Character[]): string {
    const pinyins = characters.map(c => c.pinyin[0]);
    const tones = characters.map(c => c.tone[0]);

    let result = `读音为：${pinyins.join(' ')}，声调为：${tones.join(' ')}。`;

    if (characters.length > 1) {
      // 检查声调搭配
      const isToneEven = tones.map(t => t % 2 === 0);

      if (isToneEven[0] !== isToneEven[1]) {
        result += '声调平仄搭配和谐，读起来朗朗上口。';
      } else if (tones[0] === tones[1]) {
        result += '声调相同，读起来有重复感，可能略显单调。';
      } else {
        result += '声调变化适中，读起来自然流畅。';
      }
    }

    return result;
  }

  /**
   * 获取字义描述
   * @param characters 汉字列表
   * @returns 字义描述
   */
  private static getMeaningDescription(characters: Character[]): string {
    // 提取所有字义
    const allMeanings: string[] = [];
    characters.forEach(char => {
      allMeanings.push(...char.meaning);
    });

    // 生成整体寓意
    if (characters.length === 1) {
      return `"${characters[0].char}"字${allMeanings.join('、')}，寓意${this.getRandomPositiveAdjective()}。`;
    } else if (characters.length === 2) {
      return `"${characters[0].char}${characters[1].char}"一名，取"${characters[0].meaning[0]}"与"${characters[1].meaning[0]}"之意，寓意${this.getRandomPositiveAdjective()}、${this.getRandomPositiveAdjective()}，${this.getRandomPositivePhrase()}。`;
    } else {
      return `该名字取"${allMeanings.slice(0, 3).join('、')}"等意，寓意${this.getRandomPositiveAdjective()}、${this.getRandomPositiveAdjective()}，${this.getRandomPositivePhrase()}。`;
    }
  }

  /**
   * 获取随机正面形容词
   * @returns 随机正面形容词
   */
  private static getRandomPositiveAdjective(): string {
    const adjectives = [
      '才华横溢', '聪明睿智', '品德高尚', '前程似锦', '志向远大',
      '温文尔雅', '秀外慧中', '气质非凡', '福寿安康', '才貌双全'
    ];
    return adjectives[Math.floor(Math.random() * adjectives.length)];
  }

  /**
   * 获取随机正面短语
   * @returns 随机正面短语
   */
  private static getRandomPositivePhrase(): string {
    const phrases = [
      '未来可期', '前途无量', '一生幸福', '事业有成', '学业有成',
      '家庭和睦', '身体健康', '平安喜乐', '智勇双全', '德才兼备'
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  /**
   * 生成唯一ID
   * @returns 唯一ID
   */
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
