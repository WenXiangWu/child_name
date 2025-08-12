import { GSCPinyinEntry, ToneAnalysis, PhoneticAnalysis, WuxingElement } from '../common/types';
import { getStaticUrl } from '../../lib/config';
import { QimingDataLoader } from '../common/data-loader';

/**
 * 拼音分析器 - 处理拼音数据和声调分析
 */
export class PinyinAnalyzer {
  private static instance: PinyinAnalyzer;
  private pinyinDict: Map<string, GSCPinyinEntry> = new Map();
  private dataLoader: QimingDataLoader;
  private initialized = false;

  constructor() {
    this.dataLoader = QimingDataLoader.getInstance();
  }

  static getInstance(): PinyinAnalyzer {
    if (!PinyinAnalyzer.instance) {
      PinyinAnalyzer.instance = new PinyinAnalyzer();
    }
    return PinyinAnalyzer.instance;
  }

  /**
   * 初始化拼音数据
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('开始初始化拼音分析器...');
      await this.loadGSCPinyinData();
      this.initialized = true;
      console.log(`拼音分析器初始化完成，加载了 ${this.pinyinDict.size} 个汉字的拼音数据`);
    } catch (error) {
      console.error('拼音分析器初始化失败:', error);
      throw error;
    }
  }

  /**
   * 加载GSC拼音数据
   */
  private async loadGSCPinyinData(): Promise<void> {
    try {
      const response = await fetch(getStaticUrl('configs/processed/pinyin-processed.json'));
      
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }

      const jsonData = await response.json();
      const pinyinData = jsonData.data;

      console.log(`开始处理拼音数据，共 ${Object.keys(pinyinData).length} 个汉字`);

      for (const [char, data] of Object.entries(pinyinData)) {
        const entry = this.parseProcessedEntry(char, data as any);
        if (entry) {
          this.pinyinDict.set(entry.word, entry);
        }
      }

      console.log(`拼音数据处理完成，加载了 ${this.pinyinDict.size} 个汉字`);
    } catch (error) {
      console.error('加载拼音数据失败:', error);
      throw error;
    }
  }

  /**
   * 解析处理后的JSON数据条目
   */
  private parseProcessedEntry(char: string, data: any): GSCPinyinEntry | null {
    try {
      if (!char || char.length !== 1) {
        return null; // 只处理单个汉字
      }

      const pinyin = data.pinyin || '';
      const tone = data.tone || 0;
      const pinyinList = [pinyin];
      const tones = [tone];

      // 如果没有五行信息，尝试根据部首推断
      const wuxing = data.wuxing || this.inferWuxingFromChar(char);

      const entry: GSCPinyinEntry = {
        num: '',
        word: char,
        pinyin: pinyin,
        radical: data.radical || '',
        strokeCount: data.strokeCount || 0,
        wuxing: wuxing,
        traditional: data.traditional || char,
        wubi: data.wubi || '',
        pinyinList,
        tones,
        mainPinyin: pinyin,
        mainTone: tone
      };

      return entry;
    } catch (error) {
      console.warn('解析处理后数据条目失败:', char, data, error);
      return null;
    }
  }

  /**
   * 解析GSC数据行
   */
  private parseGSCEntry(columns: string[]): GSCPinyinEntry | null {
    try {
      const [num, word, pinyin, radical, strokeCount, wuxing, traditional, wubi] = columns;

      if (!word || word.length !== 1) {
        return null; // 只处理单个汉字
      }

      // 处理拼音（可能有多个，用引号包围或逗号分隔）
      let cleanPinyin = pinyin.replace(/"/g, ''); // 移除引号
      const pinyinList = cleanPinyin.split(',').map(p => p.trim());
      const tones = pinyinList.map(p => this.extractToneFromPinyin(p));

      const entry: GSCPinyinEntry = {
        num,
        word,
        pinyin: cleanPinyin,
        radical,
        strokeCount: parseInt(strokeCount) || 0,
        wuxing: this.normalizeWuxing(wuxing),
        traditional,
        wubi,
        pinyinList,
        tones,
        mainPinyin: pinyinList[0], // 取第一个作为主要拼音
        mainTone: tones[0]
      };

      return entry;
    } catch (error) {
      console.warn('解析GSC条目失败:', columns, error);
      return null;
    }
  }

  /**
   * 标准化五行属性
   */
  private normalizeWuxing(wuxing: string): WuxingElement {
    const mapping: { [key: string]: WuxingElement } = {
      '金': 'jin',
      '木': 'mu', 
      '水': 'shui',
      '火': 'huo',
      '土': 'tu'
    };
    return mapping[wuxing] || 'tu';
  }

  /**
   * 从拼音字符串中提取声调
   */
  private extractToneFromPinyin(pinyin: string): number {
    if (!pinyin) return 0;

    // 声调符号映射
    const toneMap: { [key: string]: number } = {
      // 一声 (阴平)
      'ā': 1, 'ē': 1, 'ī': 1, 'ō': 1, 'ū': 1, 'ǖ': 1,
      // 二声 (阳平) 
      'á': 2, 'é': 2, 'í': 2, 'ó': 2, 'ú': 2, 'ǘ': 2,
      // 三声 (上声)
      'ǎ': 3, 'ě': 3, 'ǐ': 3, 'ǒ': 3, 'ǔ': 3, 'ǚ': 3,
      // 四声 (去声)
      'à': 4, 'è': 4, 'ì': 4, 'ò': 4, 'ù': 4, 'ǜ': 4,
    };

    // 遍历拼音中的每个字符
    for (const char of pinyin) {
      if (toneMap[char]) {
        return toneMap[char];
      }
    }

    // 如果没有找到声调符号，返回轻声
    return 0;
  }

  /**
   * 获取汉字的拼音信息
   */
  getPinyinInfo(char: string): GSCPinyinEntry | null {
    return this.pinyinDict.get(char) || null;
  }

  /**
   * 分析声调
   */
  analyzeTone(tone: number): ToneAnalysis {
    const toneDescriptions = {
      0: { description: '轻声', category: 'ping' as const },
      1: { description: '一声(阴平)', category: 'ping' as const },
      2: { description: '二声(阳平)', category: 'ping' as const },
      3: { description: '三声(上声)', category: 'ze' as const },
      4: { description: '四声(去声)', category: 'ze' as const }
    };

    const info = toneDescriptions[tone as keyof typeof toneDescriptions] || 
                 { description: '未知声调', category: 'ping' as const };

    return {
      tone,
      description: info.description,
      category: info.category
    };
  }

  /**
   * 分析汉字的音律信息
   */
  analyzePhonetics(char: string): PhoneticAnalysis | null {
    const pinyinInfo = this.getPinyinInfo(char);
    if (!pinyinInfo) {
      return null;
    }

    const mainPinyin = pinyinInfo.mainPinyin || '';
    const mainTone = pinyinInfo.mainTone || 0;
    const toneAnalysis = this.analyzeTone(mainTone);

    // 分析声母和韵母
    const { initial, rhyme } = this.analyzeInitialAndRhyme(mainPinyin);

    return {
      char,
      pinyin: mainPinyin,
      tone: mainTone,
      toneAnalysis,
      initial,
      rhyme
    };
  }

  /**
   * 分析声母和韵母
   */
  private analyzeInitialAndRhyme(pinyin: string): { initial: string; rhyme: string } {
    if (!pinyin) return { initial: '', rhyme: '' };

    // 移除声调符号获得基础拼音
    const basePinyin = this.removeToneMarks(pinyin);

    // 声母列表
    const initials = [
      'zh', 'ch', 'sh', // 翘舌音
      'b', 'p', 'm', 'f', // 唇音
      'd', 't', 'n', 'l', // 舌尖音
      'g', 'k', 'h', // 舌根音
      'j', 'q', 'x', // 舌面音
      'z', 'c', 's', // 舌尖前音
      'r', 'y', 'w'  // 其他
    ];

    let initial = '';
    let rhyme = basePinyin;

    // 查找声母
    for (const ini of initials) {
      if (basePinyin.startsWith(ini)) {
        initial = ini;
        rhyme = basePinyin.slice(ini.length);
        break;
      }
    }

    return { initial, rhyme };
  }

  /**
   * 移除拼音中的声调符号
   */
  private removeToneMarks(pinyin: string): string {
    const toneMap: { [key: string]: string } = {
      'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
      'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
      'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
      'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
      'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
      'ǖ': 'ü', 'ǘ': 'ü', 'ǚ': 'ü', 'ǜ': 'ü'
    };

    return pinyin.split('').map(char => toneMap[char] || char).join('');
  }

  /**
   * 分析名字的音律和谐度
   */
  analyzeNamePhonetics(familyName: string, givenName: string): {
    analysis: PhoneticAnalysis[];
    harmony: number;
    tonePattern: string;
    suggestions: string[];
  } {
    const fullName = familyName + givenName;
    const analysis: PhoneticAnalysis[] = [];
    let harmony = 100;
    const suggestions: string[] = [];

    // 分析每个字的音律
    for (const char of fullName) {
      const phoneticAnalysis = this.analyzePhonetics(char);
      if (phoneticAnalysis) {
        analysis.push(phoneticAnalysis);
      }
    }

    if (analysis.length < 2) {
      return { analysis, harmony: 0, tonePattern: '', suggestions: ['无法分析音律'] };
    }

    // 分析声调模式
    const tonePattern = analysis.map(a => a.tone).join('');
    
    // 分析音律和谐度
    harmony = this.calculatePhoneticHarmony(analysis);

    // 生成建议
    if (harmony < 70) {
      suggestions.push('建议调整名字的声调搭配');
    }
    if (this.hasRepeatedInitials(analysis)) {
      suggestions.push('避免声母重复，影响发音流畅度');
    }
    if (this.hasAllSameTone(analysis)) {
      suggestions.push('避免所有字使用相同声调');
    }

    return { analysis, harmony, tonePattern, suggestions };
  }

  /**
   * 计算音律和谐度
   */
  private calculatePhoneticHarmony(analysis: PhoneticAnalysis[]): number {
    let score = 100;

    // 检查声调搭配
    const tones = analysis.map(a => a.tone);
    
    // 避免全部相同声调
    if (this.hasAllSameTone(analysis)) {
      score -= 20;
    }

    // 避免相邻字声调相同
    for (let i = 1; i < tones.length; i++) {
      if (tones[i] === tones[i - 1]) {
        score -= 10;
      }
    }

    // 检查声母重复
    if (this.hasRepeatedInitials(analysis)) {
      score -= 15;
    }

    // 检查平仄搭配
    const pingzePattern = analysis.map(a => a.toneAnalysis.category);
    if (this.hasGoodPingzePattern(pingzePattern)) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 检查是否所有字都是相同声调
   */
  private hasAllSameTone(analysis: PhoneticAnalysis[]): boolean {
    if (analysis.length <= 1) return false;
    const firstTone = analysis[0].tone;
    return analysis.every(a => a.tone === firstTone);
  }

  /**
   * 检查是否有重复的声母
   */
  private hasRepeatedInitials(analysis: PhoneticAnalysis[]): boolean {
    const initials = analysis.map(a => a.initial).filter(i => i);
    return new Set(initials).size < initials.length;
  }

  /**
   * 检查平仄模式是否良好
   */
  private hasGoodPingzePattern(pattern: string[]): boolean {
    if (pattern.length === 2) {
      // 两字名：平仄或仄平较好
      return pattern[0] !== pattern[1];
    } else if (pattern.length === 3) {
      // 三字名：平仄平或仄平仄较好
      return pattern[0] !== pattern[1] && pattern[1] !== pattern[2];
    }
    return false;
  }

  /**
   * 根据汉字推断五行属性
   */
  private inferWuxingFromChar(char: string): WuxingElement {
    // 简单的五行推断规则，基于常见的部首
    const wuxingRadicals = {
      'jin': ['金', '钅', '刀', '刂', '斤', '戈', '匕', '刀', '钢', '铁', '银', '铜'],
      'mu': ['木', '艹', '竹', '禾', '米', '林', '森', '枝', '叶', '草', '花', '树'],
      'shui': ['水', '氵', '冫', '雨', '雪', '云', '海', '河', '江', '湖', '泪', '汗'],
      'huo': ['火', '灬', '日', '阳', '光', '明', '亮', '热', '烈', '焰', '灯', '烧'],
      'tu': ['土', '山', '石', '田', '地', '城', '墙', '坚', '固', '岩', '沙', '泥']
    };

    for (const [element, radicals] of Object.entries(wuxingRadicals)) {
      for (const radical of radicals) {
        if (char.includes(radical)) {
          return element as WuxingElement;
        }
      }
    }

    // 默认返回土
    return 'tu';
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    totalChars: number;
    toneDistribution: { [tone: number]: number };
    wuxingDistribution: { [wuxing: string]: number };
  } {
    const toneDistribution: { [tone: number]: number } = {};
    const wuxingDistribution: { [wuxing: string]: number } = {};

    for (const entry of Array.from(this.pinyinDict.values())) {
      // 统计声调分布
      if (entry.mainTone !== undefined) {
        toneDistribution[entry.mainTone] = (toneDistribution[entry.mainTone] || 0) + 1;
      }

      // 统计五行分布
      wuxingDistribution[entry.wuxing] = (wuxingDistribution[entry.wuxing] || 0) + 1;
    }

    return {
      totalChars: this.pinyinDict.size,
      toneDistribution,
      wuxingDistribution
    };
  }
}