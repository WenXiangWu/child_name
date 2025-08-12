/**
 * 音韵美感插件 - Layer 3
 * 分析汉字的音韵美感、声调搭配和发音协调性
 */

import { 
  NamingPlugin, 
  StandardInput, 
  PluginOutput, 
  PluginContext, 
  ValidationResult,
  PluginMetadata,
  PluginDependency,
  CertaintyLevel,
  PluginConfig
} from '../../interfaces/NamingPlugin';

import { QimingDataLoader } from '../../../common/data-loader';

export type ToneType = 1 | 2 | 3 | 4 | 5; // 五个声调：阴平、阳平、上声、去声、轻声

export interface CharacterPhonetics {
  character: string;
  pinyin: string;
  tone: ToneType;
  initial: string; // 声母
  final: string;   // 韵母
  syllableStructure: 'simple' | 'complex';
  phoneticFamily: string; // 音系归属
  rhythmicWeight: 'light' | 'medium' | 'heavy';
}

export interface TonePattern {
  pattern: ToneType[];
  description: string;
  harmonyLevel: 'excellent' | 'good' | 'average' | 'poor';
  traditionalClassification: string;
  modernSuitability: number; // 0-100
  flowQuality: number; // 0-100
}

export interface RhythmAnalysis {
  overallRhythm: 'smooth' | 'staccato' | 'varied' | 'monotonous';
  stressPattern: string;
  melodicContour: 'rising' | 'falling' | 'wave' | 'flat';
  rhythmScore: number; // 0-100
  memorability: number; // 0-100
  elegance: number; // 0-100
}

export interface HomophoneRisk {
  character: string;
  potentialHomophones: string[];
  riskLevel: 'low' | 'medium' | 'high';
  problematicCombinations: string[];
  suggestions: string[];
}

export interface PhoneticOptimization {
  currentScore: number;
  potentialImprovements: {
    aspect: 'tone' | 'rhythm' | 'flow' | 'homophone';
    suggestion: string;
    expectedImprovement: number;
  }[];
  alternativePatterns?: {
    pattern: string;
    improvement: string;
    score: number;
  }[];
}

export class PhoneticPlugin implements NamingPlugin {
  readonly id = 'phonetic';
  readonly version = '1.0.0';
  readonly layer = 3;
  readonly dependencies: PluginDependency[] = [
    { pluginId: 'surname', required: true }
  ];
  readonly metadata: PluginMetadata = {
    name: '音韵美感分析插件',
    description: '分析汉字的音韵美感、声调搭配和发音协调性',
    author: 'System',
    category: 'evaluation',
    tags: ['phonetics', 'tone', 'rhythm', 'harmony', 'pronunciation']
  };

  private config: PluginConfig | null = null;
  private dataLoader: QimingDataLoader;
  private phoneticDatabase: Map<string, CharacterPhonetics> = new Map();
  private homophoneDatabase: Map<string, string[]> = new Map();
  private tonePatternRules: Map<string, any> = new Map();

  constructor() {
    this.dataLoader = QimingDataLoader.getInstance();
  }

  /**
   * 初始化插件
   */
  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    this.config = config;
    
    try {
      // 加载音韵数据
      await this.loadPhoneticDatabase();
      await this.loadHomophoneDatabase();
      await this.loadTonePatternRules();
      
      context.log('info', `音韵美感插件初始化完成, 版本: ${this.version}`);
      context.log('info', `已加载 ${this.phoneticDatabase.size} 个汉字的音韵数据`);
    } catch (error) {
      context.log('error', '音韵数据加载失败', error);
      throw error;
    }
  }

  /**
   * 处理音韵美感分析
   */
  async process(input: StandardInput): Promise<PluginOutput> {
    const startTime = Date.now();
    
    const { characters } = input.data;
    if (!characters || characters.length === 0) {
      throw new Error('缺少字符数据');
    }

    // 获取姓氏数据
    const surnameData = input.context.pluginResults.get('surname');
    if (!surnameData) {
      throw new Error('缺少姓氏信息，请确保姓氏插件已执行');
    }

    try {
      // 分析每个字符的音韵特征
      const phoneticData = await Promise.all(
        characters.map(char => this.analyzeCharacterPhonetics(char))
      );

      // 构建完整的音韵模式（姓 + 名）
      const fullNamePhonetics = [
        ...(await this.getSurnamePhonetics(surnameData.surname)),
        ...phoneticData
      ];

      // 分析声调模式
      const tonePattern = this.analyzeTonePattern(fullNamePhonetics);

      // 分析节奏韵律
      const rhythmAnalysis = this.analyzeRhythm(fullNamePhonetics);

      // 分析谐音风险
      const homophoneRisks = await this.analyzeHomophoneRisks(fullNamePhonetics);

      // 生成优化建议
      const optimizationSuggestions = this.generateOptimizationSuggestions(
        tonePattern, 
        rhythmAnalysis, 
        homophoneRisks
      );

      // 计算总体和谐度
      const harmonyScore = this.calculateHarmonyScore(tonePattern, rhythmAnalysis, homophoneRisks);

      return {
        pluginId: this.id,
        results: {
          phoneticData,
          fullNamePhonetics,
          tonePattern,
          rhythmAnalysis,
          homophoneRisks,
          optimizationSuggestions,
          harmonyScore,
          overallRating: this.calculateOverallRating(harmonyScore, rhythmAnalysis, homophoneRisks)
        },
        confidence: this.calculateConfidence(phoneticData, surnameData),
        metadata: {
          processingTime: Date.now() - startTime,
          analysisEngine: 'advanced-phonetic-v2',
          version: this.version,
          characterCount: characters.length,
          fullNameLength: fullNamePhonetics.length
        }
      };

    } catch (error) {
      throw new Error(`音韵美感分析失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 验证输入数据
   */
  validate(input: StandardInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查是否有字符数据
    if (!input.data.characters || input.data.characters.length === 0) {
      errors.push('缺少字符数据');
    }

    // 检查是否有姓氏数据
    const surnameData = input.context.pluginResults.get('surname');
    if (!surnameData) {
      errors.push('缺少姓氏信息，请确保姓氏插件已执行');
    }

    // 检查字符是否为汉字
    if (input.data.characters) {
      for (const char of input.data.characters) {
        if (!this.isChineseCharacter(char)) {
          warnings.push(`字符 "${char}" 不是标准汉字，音韵分析可能不准确`);
        }
        if (char.length !== 1) {
          errors.push(`字符 "${char}" 长度不正确，应为单个汉字`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 销毁插件
   */
  async destroy(): Promise<void> {
    this.phoneticDatabase.clear();
    this.homophoneDatabase.clear();
    this.tonePatternRules.clear();
  }

  /**
   * 检查插件是否可用
   */
  isAvailable(): boolean {
    return this.phoneticDatabase.size > 0 && this.tonePatternRules.size > 0;
  }

  /**
   * 获取插件健康状态
   */
  getHealthStatus() {
    const phoneticCount = this.phoneticDatabase.size;
    const homophoneCount = this.homophoneDatabase.size;
    const ruleCount = this.tonePatternRules.size;
    
    if (phoneticCount === 0 || ruleCount === 0) {
      return {
        status: 'unhealthy' as const,
        message: '音韵数据未加载',
        lastCheck: Date.now()
      };
    } else if (phoneticCount < 1000 || homophoneCount < 100) {
      return {
        status: 'degraded' as const,
        message: `音韵数据不完整 (${phoneticCount} 字符, ${homophoneCount} 谐音组)`,
        lastCheck: Date.now()
      };
    } else {
      return {
        status: 'healthy' as const,
        message: `音韵数据正常 (${phoneticCount} 字符, ${homophoneCount} 谐音组, ${ruleCount} 规则)`,
        lastCheck: Date.now()
      };
    }
  }

  /**
   * 加载音韵数据库
   */
  private async loadPhoneticDatabase(): Promise<void> {
    try {
      // 从数据加载器获取拼音数据（如果可用）
      // 注意：这里假设dataLoader有getPinyinData方法，如果没有则使用备用数据
      let pinyinDict: Record<string, string> = {};
      try {
        pinyinDict = await (this.dataLoader as any).getPinyinData?.() || {};
      } catch (error) {
        console.warn('拼音数据获取失败，使用备用数据');
      }
      
      for (const [char, pinyin] of Object.entries(pinyinDict)) {
        const phoneticData = this.parsePinyinToPhonetics(char, pinyin as string);
        this.phoneticDatabase.set(char, phoneticData);
      }

      // 如果基础数据不足，加载常用字音韵补充数据
      if (this.phoneticDatabase.size < 1000) {
        await this.loadSupplementaryPhoneticData();
      }

    } catch (error) {
      console.warn('音韵数据加载失败，使用备用数据');
      await this.loadFallbackPhoneticData();
    }
  }

  /**
   * 加载补充音韵数据
   */
  private async loadSupplementaryPhoneticData(): Promise<void> {
    const commonPhonetics = {
      // 常用字的拼音数据
      '安': 'ān', '宝': 'bǎo', '成': 'chéng', '德': 'dé', '恩': 'ēn', '福': 'fú',
      '光': 'guāng', '华': 'huá', '嘉': 'jiā', '康': 'kāng', '乐': 'lè', '美': 'měi',
      '宁': 'níng', '平': 'píng', '庆': 'qìng', '瑞': 'ruì', '顺': 'shùn', '天': 'tiān',
      '伟': 'wěi', '祥': 'xiáng', '雅': 'yǎ', '泽': 'zé', '智': 'zhì', '中': 'zhōng'
    };

    for (const [char, pinyin] of Object.entries(commonPhonetics)) {
      if (!this.phoneticDatabase.has(char)) {
        const phoneticData = this.parsePinyinToPhonetics(char, pinyin);
        this.phoneticDatabase.set(char, phoneticData);
      }
    }
  }

  /**
   * 加载备用音韵数据
   */
  private async loadFallbackPhoneticData(): Promise<void> {
    // 简单的备用音韵数据
    const testChars = ['测', '试', '字', '符', '数', '据'];
    const testPinyins = ['cè', 'shì', 'zì', 'fú', 'shù', 'jù'];

    testChars.forEach((char, index) => {
      const phoneticData = this.parsePinyinToPhonetics(char, testPinyins[index]);
      this.phoneticDatabase.set(char, phoneticData);
    });
  }

  /**
   * 解析拼音为音韵数据
   */
  private parsePinyinToPhonetics(character: string, pinyin: string): CharacterPhonetics {
    // 简化的拼音解析
    const toneMarks = {
      'ā': 1, 'á': 2, 'ǎ': 3, 'à': 4,
      'ē': 1, 'é': 2, 'ě': 3, 'è': 4,
      'ī': 1, 'í': 2, 'ǐ': 3, 'ì': 4,
      'ō': 1, 'ó': 2, 'ǒ': 3, 'ò': 4,
      'ū': 1, 'ú': 2, 'ǔ': 3, 'ù': 4,
      'ǖ': 1, 'ǘ': 2, 'ǚ': 3, 'ǜ': 4
    };

    let tone: ToneType = 1;
    let cleanPinyin = pinyin;

    // 提取声调
    for (const [mark, toneNum] of Object.entries(toneMarks)) {
      if (pinyin.includes(mark)) {
        tone = toneNum as ToneType;
        cleanPinyin = pinyin.replace(new RegExp(mark, 'g'), mark.normalize('NFD')[0]);
        break;
      }
    }

    // 数字声调处理
    const numberTone = pinyin.match(/[1-4]$/);
    if (numberTone) {
      tone = parseInt(numberTone[0]) as ToneType;
      cleanPinyin = pinyin.replace(/[1-4]$/, '');
    }

    // 提取声母和韵母
    const initials = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'];
    let initial = '';
    let final = cleanPinyin;

    for (const init of initials.sort((a, b) => b.length - a.length)) {
      if (cleanPinyin.startsWith(init)) {
        initial = init;
        final = cleanPinyin.substring(init.length);
        break;
      }
    }

    // 确定音节结构
    const syllableStructure = cleanPinyin.length > 3 ? 'complex' : 'simple';

    // 确定音韵族
    const phoneticFamily = this.determinePhoneticFamily(initial, final);

    // 确定韵律重量
    const rhythmicWeight = this.determineRhythmicWeight(tone, syllableStructure);

    return {
      character,
      pinyin: cleanPinyin,
      tone,
      initial: initial || '',
      final,
      syllableStructure,
      phoneticFamily,
      rhythmicWeight
    };
  }

  /**
   * 确定音韵族
   */
  private determinePhoneticFamily(initial: string, final: string): string {
    // 根据声母分类
    const initialFamilies = {
      '唇音': ['b', 'p', 'm', 'f'],
      '舌音': ['d', 't', 'n', 'l'],
      '牙音': ['g', 'k', 'h'],
      '齿音': ['j', 'q', 'x'],
      '舌上音': ['zh', 'ch', 'sh', 'r'],
      '舌前音': ['z', 'c', 's']
    };

    for (const [family, initials] of Object.entries(initialFamilies)) {
      if (initials.includes(initial)) {
        return family;
      }
    }

    return '其他';
  }

  /**
   * 确定韵律重量
   */
  private determineRhythmicWeight(tone: ToneType, structure: 'simple' | 'complex'): 'light' | 'medium' | 'heavy' {
    if (tone === 1 || tone === 2) {
      return structure === 'simple' ? 'light' : 'medium';
    } else if (tone === 3) {
      return 'heavy';
    } else {
      return structure === 'simple' ? 'medium' : 'heavy';
    }
  }

  /**
   * 加载谐音数据库
   */
  private async loadHomophoneDatabase(): Promise<void> {
    const homophoneGroups = {
      'ān': ['安', '按', '案', '暗'],
      'bǎo': ['宝', '保', '包', '饱'],
      'chéng': ['成', '城', '程', '诚'],
      'dé': ['德', '得', '的'],
      'fú': ['福', '富', '符', '服'],
      'guāng': ['光', '广', '逛'],
      'huá': ['华', '花', '化', '话'],
      'jiā': ['家', '加', '佳', '嘉'],
      'kāng': ['康', '抗', '扛'],
      'lè': ['乐', '了', '勒'],
      'měi': ['美', '每', '没'],
      'píng': ['平', '评', '苹', '瓶'],
      'qìng': ['庆', '请', '清', '青'],
      'ruì': ['瑞', '锐', '睿'],
      'shùn': ['顺', '瞬'],
      'tiān': ['天', '田', '添', '甜'],
      'wěi': ['伟', '为', '围', '维'],
      'xiáng': ['祥', '想', '向', '香'],
      'yǎ': ['雅', '哑', '呀'],
      'zhì': ['智', '志', '制', '治', '质']
    };

    for (const [pinyin, chars] of Object.entries(homophoneGroups)) {
      this.homophoneDatabase.set(pinyin, chars);
    }
  }

  /**
   * 加载声调模式规则
   */
  private async loadTonePatternRules(): Promise<void> {
    const tonePatternData = {
      // 双字名声调模式
      '11': { harmony: 'average', description: '平平调，较为平淡' },
      '12': { harmony: 'good', description: '平仄调，有起伏' },
      '13': { harmony: 'excellent', description: '平上调，优美悦耳' },
      '14': { harmony: 'good', description: '平去调，有力度' },
      '21': { harmony: 'good', description: '仄平调，回归平稳' },
      '22': { harmony: 'average', description: '仄仄调，略显急促' },
      '23': { harmony: 'good', description: '仄上调，有变化' },
      '24': { harmony: 'excellent', description: '仄去调，铿锵有力' },
      '31': { harmony: 'excellent', description: '上平调，委婉悠扬' },
      '32': { harmony: 'good', description: '上仄调，起伏明显' },
      '33': { harmony: 'poor', description: '上上调，过于拖沓' },
      '34': { harmony: 'good', description: '上去调，跌宕起伏' },
      '41': { harmony: 'good', description: '去平调，先抑后扬' },
      '42': { harmony: 'good', description: '去仄调，节奏明快' },
      '43': { harmony: 'good', description: '去上调，富有变化' },
      '44': { harmony: 'poor', description: '去去调，过于沉重' },

      // 三字名声调模式（简化）
      '111': { harmony: 'poor', description: '三平调，过于平淡' },
      '123': { harmony: 'excellent', description: '平仄上，音韵和谐' },
      '124': { harmony: 'excellent', description: '平仄去，抑扬顿挫' },
      '213': { harmony: 'excellent', description: '仄平上，优美流畅' },
      '214': { harmony: 'good', description: '仄平去，节奏明快' },
      '321': { harmony: 'excellent', description: '上仄平，委婉回归' },
      '324': { harmony: 'good', description: '上仄去，起伏有致' },
      '421': { harmony: 'good', description: '去仄平，先抑后扬' },
      '423': { harmony: 'good', description: '去仄上，跌宕起伏' }
    };

    for (const [pattern, data] of Object.entries(tonePatternData)) {
      this.tonePatternRules.set(pattern, data);
    }
  }

  /**
   * 获取姓氏音韵信息
   */
  private async getSurnamePhonetics(surname: string): Promise<CharacterPhonetics[]> {
    const surnamePhonetics: CharacterPhonetics[] = [];
    
    for (const char of surname) {
      const phonetic = this.phoneticDatabase.get(char);
      if (phonetic) {
        surnamePhonetics.push(phonetic);
      } else {
        // 生成备用音韵数据
        const fallbackPhonetic = this.parsePinyinToPhonetics(char, 'unknown');
        surnamePhonetics.push(fallbackPhonetic);
      }
    }

    return surnamePhonetics;
  }

  /**
   * 分析单个字符的音韵特征
   */
  private async analyzeCharacterPhonetics(character: string): Promise<CharacterPhonetics> {
    const cached = this.phoneticDatabase.get(character);
    if (cached) {
      return cached;
    }

    // 如果没有找到，生成基础音韵数据
    return this.parsePinyinToPhonetics(character, 'unknown');
  }

  /**
   * 分析声调模式
   */
  private analyzeTonePattern(phonetics: CharacterPhonetics[]): TonePattern {
    const tones = phonetics.map(p => p.tone);
    const patternKey = tones.join('');
    
    // 从规则库中查找
    const ruleData = this.tonePatternRules.get(patternKey);
    
    let harmonyLevel: TonePattern['harmonyLevel'] = 'average';
    let description = '一般的声调搭配';
    
    if (ruleData) {
      harmonyLevel = ruleData.harmony;
      description = ruleData.description;
    } else {
      // 简单的启发式评估
      const toneVariety = new Set(tones).size;
      const hasThirdTone = tones.includes(3);
      const consecutiveSame = this.hasConsecutiveSameTones(tones);
      
      if (toneVariety >= 3 && !consecutiveSame) {
        harmonyLevel = 'excellent';
        description = '声调变化丰富，韵律优美';
      } else if (toneVariety === 2 && !hasThirdTone) {
        harmonyLevel = 'good';
        description = '声调搭配合理，读音流畅';
      } else if (consecutiveSame || toneVariety === 1) {
        harmonyLevel = 'poor';
        description = '声调单一或连续，缺乏变化';
      }
    }

    // 计算传统分类
    const traditionalClassification = this.classifyTraditionalPattern(tones);

    // 计算现代适用性和流畅度
    const modernSuitability = this.calculateModernSuitability(tones, harmonyLevel);
    const flowQuality = this.calculateFlowQuality(phonetics);

    return {
      pattern: tones,
      description,
      harmonyLevel,
      traditionalClassification,
      modernSuitability,
      flowQuality
    };
  }

  /**
   * 检查是否有连续相同声调
   */
  private hasConsecutiveSameTones(tones: ToneType[]): boolean {
    for (let i = 0; i < tones.length - 1; i++) {
      if (tones[i] === tones[i + 1]) {
        return true;
      }
    }
    return false;
  }

  /**
   * 传统声律分类
   */
  private classifyTraditionalPattern(tones: ToneType[]): string {
    const pattern = tones.map(tone => tone === 1 || tone === 2 ? '平' : '仄').join('');
    
    const traditionalPatterns = {
      '平': '平起',
      '仄': '仄起',
      '平平': '双平',
      '平仄': '平仄',
      '仄平': '仄平',
      '仄仄': '双仄',
      '平平平': '三平',
      '平平仄': '平平仄',
      '平仄平': '平仄平',
      '平仄仄': '平仄仄',
      '仄平平': '仄平平',
      '仄平仄': '仄平仄',
      '仄仄平': '仄仄平',
      '仄仄仄': '三仄'
    };

    return traditionalPatterns[pattern as keyof typeof traditionalPatterns] || '特殊格律';
  }

  /**
   * 计算现代适用性
   */
  private calculateModernSuitability(tones: ToneType[], harmonyLevel: TonePattern['harmonyLevel']): number {
    let baseScore = 70;

    // 根据和谐度调整
    switch (harmonyLevel) {
      case 'excellent': baseScore = 90; break;
      case 'good': baseScore = 80; break;
      case 'average': baseScore = 70; break;
      case 'poor': baseScore = 50; break;
    }

    // 现代人更偏好简洁明快的声调
    const hasComplexTones = tones.includes(3); // 上声较难读
    if (hasComplexTones && tones.length > 2) {
      baseScore -= 10;
    }

    // 避免全部低调
    const allLowTones = tones.every(tone => tone === 3 || tone === 4);
    if (allLowTones) {
      baseScore -= 15;
    }

    return Math.max(30, Math.min(100, baseScore));
  }

  /**
   * 计算流畅度
   */
  private calculateFlowQuality(phonetics: CharacterPhonetics[]): number {
    let flowScore = 80;

    // 检查声母冲突
    const initials = phonetics.map(p => p.initial);
    const similarInitials = this.countSimilarInitials(initials);
    if (similarInitials > 1) {
      flowScore -= similarInitials * 10;
    }

    // 检查韵母和谐
    const finals = phonetics.map(p => p.final);
    const rhymeScore = this.calculateRhymeHarmony(finals);
    flowScore = (flowScore + rhymeScore) / 2;

    // 检查音节结构
    const structures = phonetics.map(p => p.syllableStructure);
    const complexCount = structures.filter(s => s === 'complex').length;
    if (complexCount === phonetics.length && phonetics.length > 2) {
      flowScore -= 15; // 全部复杂音节会影响流畅度
    }

    return Math.max(30, Math.min(100, flowScore));
  }

  /**
   * 计算相似声母数量
   */
  private countSimilarInitials(initials: string[]): number {
    const initialGroups = {
      '送气': ['p', 't', 'k', 'q', 'ch'],
      '不送气': ['b', 'd', 'g', 'j', 'zh'],
      '擦音': ['f', 'h', 'x', 'sh', 's'],
      '鼻音': ['m', 'n'],
      '边音': ['l'],
      '颤音': ['r']
    };

    let conflicts = 0;
    for (const group of Object.values(initialGroups)) {
      const matchCount = initials.filter(initial => group.includes(initial)).length;
      if (matchCount > 1) {
        conflicts += matchCount - 1;
      }
    }

    return conflicts;
  }

  /**
   * 计算韵母和谐度
   */
  private calculateRhymeHarmony(finals: string[]): number {
    if (finals.length < 2) return 80;

    let harmonyScore = 80;

    // 检查韵母相似性
    const vowels = finals.map(final => final.replace(/[^aeiouüv]/g, ''));
    const uniqueVowels = new Set(vowels);

    if (uniqueVowels.size === 1) {
      // 完全押韵
      harmonyScore = 95;
    } else if (uniqueVowels.size === vowels.length) {
      // 完全不同
      harmonyScore = 85;
    } else {
      // 部分相似
      harmonyScore = 75;
    }

    return harmonyScore;
  }

  /**
   * 分析节奏韵律
   */
  private analyzeRhythm(phonetics: CharacterPhonetics[]): RhythmAnalysis {
    const rhythmWeights = phonetics.map(p => p.rhythmicWeight);
    const tones = phonetics.map(p => p.tone);

    // 确定整体节奏
    const weightVariety = new Set(rhythmWeights).size;
    let overallRhythm: RhythmAnalysis['overallRhythm'];

    if (weightVariety === 1) {
      overallRhythm = 'monotonous';
    } else if (weightVariety === rhythmWeights.length) {
      overallRhythm = 'varied';
    } else {
      const lightCount = rhythmWeights.filter(w => w === 'light').length;
      overallRhythm = lightCount > rhythmWeights.length / 2 ? 'smooth' : 'staccato';
    }

    // 分析重音模式
    const stressPattern = this.analyzeStressPattern(rhythmWeights);

    // 分析旋律轮廓
    const melodicContour = this.analyzeMelodicContour(tones);

    // 计算各项分数
    const rhythmScore = this.calculateRhythmScore(overallRhythm, weightVariety);
    const memorability = this.calculateMemorability(overallRhythm, tones);
    const elegance = this.calculateElegance(overallRhythm, melodicContour);

    return {
      overallRhythm,
      stressPattern,
      melodicContour,
      rhythmScore,
      memorability,
      elegance
    };
  }

  /**
   * 分析重音模式
   */
  private analyzeStressPattern(weights: ('light' | 'medium' | 'heavy')[]): string {
    const pattern = weights.map(w => {
      switch (w) {
        case 'light': return '轻';
        case 'medium': return '中';
        case 'heavy': return '重';
      }
    }).join('-');

    return pattern;
  }

  /**
   * 分析旋律轮廓
   */
  private analyzeMelodicContour(tones: ToneType[]): RhythmAnalysis['melodicContour'] {
    if (tones.length < 2) return 'flat';

    const changes = [];
    for (let i = 1; i < tones.length; i++) {
      if (tones[i] > tones[i-1]) {
        changes.push('up');
      } else if (tones[i] < tones[i-1]) {
        changes.push('down');
      } else {
        changes.push('flat');
      }
    }

    const upCount = changes.filter(c => c === 'up').length;
    const downCount = changes.filter(c => c === 'down').length;

    if (upCount > downCount) return 'rising';
    if (downCount > upCount) return 'falling';
    if (upCount > 0 && downCount > 0) return 'wave';
    return 'flat';
  }

  /**
   * 计算节奏分数
   */
  private calculateRhythmScore(rhythm: RhythmAnalysis['overallRhythm'], variety: number): number {
    const scores = {
      'smooth': 85,
      'varied': 90,
      'staccato': 75,
      'monotonous': 50
    };

    let baseScore = scores[rhythm];
    
    // 根据变化度调整
    if (variety > 2) baseScore += 10;
    else if (variety === 1) baseScore -= 20;

    return Math.max(30, Math.min(100, baseScore));
  }

  /**
   * 计算记忆度
   */
  private calculateMemorability(rhythm: RhythmAnalysis['overallRhythm'], tones: ToneType[]): number {
    let score = 70;

    // 节奏类型影响
    if (rhythm === 'varied' || rhythm === 'smooth') score += 15;
    if (rhythm === 'monotonous') score -= 25;

    // 声调特征影响
    const toneVariety = new Set(tones).size;
    score += toneVariety * 5;

    // 特殊模式加分
    if (tones.length === 2 && Math.abs(tones[0] - tones[1]) === 2) {
      score += 10; // 平仄相间
    }

    return Math.max(30, Math.min(100, score));
  }

  /**
   * 计算优雅度
   */
  private calculateElegance(rhythm: RhythmAnalysis['overallRhythm'], contour: RhythmAnalysis['melodicContour']): number {
    let score = 75;

    // 节奏优雅度
    const rhythmScores = {
      'smooth': 20,
      'varied': 15,
      'staccato': 5,
      'monotonous': -15
    };
    score += rhythmScores[rhythm];

    // 旋律轮廓优雅度
    const contourScores = {
      'wave': 15,
      'rising': 10,
      'falling': 5,
      'flat': -10
    };
    score += contourScores[contour];

    return Math.max(30, Math.min(100, score));
  }

  /**
   * 分析谐音风险
   */
  private async analyzeHomophoneRisks(phonetics: CharacterPhonetics[]): Promise<HomophoneRisk[]> {
    const risks: HomophoneRisk[] = [];

    for (const phonetic of phonetics) {
      const homophones = this.homophoneDatabase.get(phonetic.pinyin) || [];
      const problematicOnes = homophones.filter(homo => 
        this.isProblematicHomophone(homo, phonetic.character)
      );

      let riskLevel: HomophoneRisk['riskLevel'] = 'low';
      if (problematicOnes.length > 3) riskLevel = 'high';
      else if (problematicOnes.length > 1) riskLevel = 'medium';

      const suggestions = this.generateHomophoneSuggestions(phonetic, problematicOnes);

      risks.push({
        character: phonetic.character,
        potentialHomophones: homophones,
        riskLevel,
        problematicCombinations: problematicOnes,
        suggestions
      });
    }

    return risks;
  }

  /**
   * 检查是否为有问题的谐音
   */
  private isProblematicHomophone(homophone: string, original: string): boolean {
    if (homophone === original) return false;

    // 简化的问题词汇检查
    const problematicWords = ['死', '病', '哭', '恶', '坏', '丑', '笨', '傻'];
    return problematicWords.includes(homophone);
  }

  /**
   * 生成谐音建议
   */
  private generateHomophoneSuggestions(phonetic: CharacterPhonetics, problematic: string[]): string[] {
    const suggestions = [];

    if (problematic.length > 0) {
      suggestions.push(`避免与 ${problematic.join('、')} 等词产生谐音联想`);
      suggestions.push('考虑调整声调或选择其他音韵相近的字');
    } else {
      suggestions.push('谐音风险较低，可以安全使用');
    }

    return suggestions;
  }

  /**
   * 生成优化建议
   */
  private generateOptimizationSuggestions(
    tonePattern: TonePattern,
    rhythm: RhythmAnalysis,
    risks: HomophoneRisk[]
  ): PhoneticOptimization {
    const currentScore = Math.round((tonePattern.flowQuality + rhythm.rhythmScore) / 2);
    const improvements = [];

    // 声调优化建议
    if (tonePattern.harmonyLevel === 'poor') {
      improvements.push({
        aspect: 'tone' as const,
        suggestion: '调整声调搭配，避免单调或冲突的声调组合',
        expectedImprovement: 20
      });
    }

    // 节奏优化建议
    if (rhythm.overallRhythm === 'monotonous') {
      improvements.push({
        aspect: 'rhythm' as const,
        suggestion: '增加韵律变化，选择不同重量级的音节',
        expectedImprovement: 15
      });
    }

    // 流畅度优化建议
    if (tonePattern.flowQuality < 70) {
      improvements.push({
        aspect: 'flow' as const,
        suggestion: '优化声母韵母搭配，提高发音流畅度',
        expectedImprovement: 25
      });
    }

    // 谐音风险建议
    const highRiskCount = risks.filter(r => r.riskLevel === 'high').length;
    if (highRiskCount > 0) {
      improvements.push({
        aspect: 'homophone' as const,
        suggestion: '避免高风险谐音，选择发音相近但谐音更安全的字',
        expectedImprovement: 30
      });
    }

    return {
      currentScore,
      potentialImprovements: improvements
    };
  }

  /**
   * 计算和谐度分数
   */
  private calculateHarmonyScore(
    tonePattern: TonePattern,
    rhythm: RhythmAnalysis,
    risks: HomophoneRisk[]
  ): number {
    const toneScore = this.convertHarmonyToScore(tonePattern.harmonyLevel);
    const rhythmScore = rhythm.rhythmScore;
    const eleganceScore = rhythm.elegance;
    
    // 谐音风险扣分
    let riskPenalty = 0;
    risks.forEach(risk => {
      if (risk.riskLevel === 'high') riskPenalty += 20;
      else if (risk.riskLevel === 'medium') riskPenalty += 10;
    });

    const baseScore = (toneScore + rhythmScore + eleganceScore) / 3;
    return Math.max(30, Math.min(100, baseScore - riskPenalty));
  }

  /**
   * 转换和谐度为分数
   */
  private convertHarmonyToScore(harmony: TonePattern['harmonyLevel']): number {
    const scores = {
      'excellent': 95,
      'good': 80,
      'average': 65,
      'poor': 40
    };
    return scores[harmony];
  }

  /**
   * 计算总体评级
   */
  private calculateOverallRating(
    harmonyScore: number,
    rhythm: RhythmAnalysis,
    risks: HomophoneRisk[]
  ): number {
    const weights = {
      harmony: 0.4,
      memorability: 0.3,
      elegance: 0.2,
      safety: 0.1
    };

    const safetyScore = 100 - risks.reduce((penalty, risk) => {
      if (risk.riskLevel === 'high') return penalty + 30;
      if (risk.riskLevel === 'medium') return penalty + 15;
      return penalty + 5;
    }, 0);

    const overallRating = 
      harmonyScore * weights.harmony +
      rhythm.memorability * weights.memorability +
      rhythm.elegance * weights.elegance +
      Math.max(0, safetyScore) * weights.safety;

    return Math.round(Math.max(30, Math.min(100, overallRating)));
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(phoneticData: CharacterPhonetics[], surnameData: any): number {
    let baseConfidence = 0.85;

    // 根据数据完整性调整
    const unknownCount = phoneticData.filter(p => p.pinyin === 'unknown').length;
    if (unknownCount > 0) {
      baseConfidence -= unknownCount * 0.2;
    }

    // 根据姓氏数据质量调整
    if (surnameData.confidence) {
      baseConfidence = baseConfidence * (0.8 + 0.2 * surnameData.confidence);
    }

    return Math.max(0.5, Math.min(0.95, baseConfidence));
  }

  /**
   * 检查是否为中文字符
   */
  private isChineseCharacter(char: string): boolean {
    const unicode = char.charCodeAt(0);
    return (unicode >= 0x4e00 && unicode <= 0x9fff) || // 基本汉字
           (unicode >= 0x3400 && unicode <= 0x4dbf) || // 扩展A
           (unicode >= 0x20000 && unicode <= 0x2a6df);  // 扩展B
  }
}
