/**
 * 字义寓意插件 - Layer 3
 * 分析汉字的文化寓意、象征意义和现代适用性
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
  
  export interface CharacterMeaning {
    character: string;
    basicMeaning: string;
    extendedMeanings: string[];
    culturalBackground: string;
    symbolism: string[];
    emotionalTone: 'positive' | 'neutral' | 'negative';
    modernRelevance: number; // 0-100
    genderSuitability: {
      male: number;
      female: number;
      neutral: number;
    };
    literaryReferences?: {
      source: string;
      context: string;
      significance: string;
    }[];
  }
  
  export interface CulturalDepthAnalysis {
    overallDepth: number; // 0-100
    historicalSignificance: number;
    literaryValue: number;
    philosophicalContent: number;
    aestheticValue: number;
    culturalResonance: string[];
    recommendedContext: string[];
  }
  
  export interface ModernApplicabilityAnalysis {
    contemporaryRelevance: number; // 0-100
    internationalFriendliness: number;
    professionalSuitability: number;
    socialAcceptance: number;
    trendAlignment: 'traditional' | 'modern' | 'timeless' | 'vintage';
    potentialConcerns: string[];
    advantages: string[];
  }
  
  export interface CombinationHarmony {
    overallHarmony: number; // 0-100
    thematicConsistency: number;
    emotionalBalance: number;
    culturalCoherence: number;
    modernSynergy: number;
    recommendedAdjustments?: string[];
    strengtheningSuggestions?: string[];
  }
  
  export class MeaningPlugin implements NamingPlugin {
    readonly id = 'meaning';
    readonly version = '1.0.0';
    readonly layer = 3;
    readonly dependencies: PluginDependency[] = [
      { pluginId: 'gender', required: true }
    ];
    readonly metadata: PluginMetadata = {
      name: '字义寓意分析插件',
      description: '深度分析汉字的文化寓意、象征意义和现代适用性',
      author: 'System',
      category: 'evaluation',
      tags: ['meaning', 'culture', 'symbolism', 'literature', 'modern-relevance']
    };
  
    private config: PluginConfig | null = null;
    private dataLoader: QimingDataLoader;
    private meaningDatabase: Map<string, CharacterMeaning> = new Map();
    private culturalReferences: Map<string, any[]> = new Map();
    private modernTrends: Map<string, number> = new Map();
  
    constructor() {
      this.dataLoader = QimingDataLoader.getInstance();
    }
  
    /**
     * 初始化插件
     */
    async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
      this.config = config;
      
      try {
        // 加载字义数据
        await this.loadMeaningDatabase();
        await this.loadCulturalReferences();
        await this.loadModernTrends();
        
        context.log('info', `字义寓意插件初始化完成, 版本: ${this.version}`);
        context.log('info', `已加载 ${this.meaningDatabase.size} 个汉字的寓意数据`);
      } catch (error) {
        context.log('error', '字义寓意数据加载失败', error);
        throw error;
      }
    }
  
    /**
     * 处理字义寓意分析
     */
    async process(input: StandardInput): Promise<PluginOutput> {
      const startTime = Date.now();
      
      const { characters } = input.data;
      if (!characters || characters.length === 0) {
        throw new Error('缺少字符数据');
      }
  
          // 获取性别数据
    const genderData = input.context.pluginResults.get('gender');
      if (!genderData) {
        throw new Error('缺少性别信息，请确保性别插件已执行');
      }
  
      try {
        // 分析每个字符的寓意
        const characterMeanings = await Promise.all(
          characters.map(char => this.analyzeCharacterMeaning(char, genderData.gender))
        );
  
        // 分析文化深度
        const culturalDepth = this.analyzeCulturalDepth(characterMeanings);
  
        // 分析现代适用性
        const modernApplicability = this.analyzeModernApplicability(characterMeanings, genderData.gender);
  
        // 分析组合和谐度
        const combinationHarmony = this.analyzeCombinationHarmony(characterMeanings);
  
        // 生成综合建议
        const recommendations = this.generateMeaningRecommendations(
          characterMeanings, 
          culturalDepth, 
          modernApplicability, 
          combinationHarmony,
          genderData.gender
        );
  
        return {
          pluginId: this.id,
          results: {
            characterMeanings,
            culturalDepth,
            modernApplicability,
            combinationHarmony,
            recommendations,
            overallRating: this.calculateOverallRating(culturalDepth, modernApplicability, combinationHarmony)
          },
          confidence: this.calculateConfidence(characterMeanings, genderData),
          metadata: {
            processingTime: Date.now() - startTime,
            analysisMethod: 'multi-dimensional-meaning',
            version: this.version,
            characterCount: characters.length,
            genderContext: genderData.gender
          }
        };
  
      } catch (error) {
        throw new Error(`字义寓意分析失败: ${error instanceof Error ? error.message : String(error)}`);
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
  
          // 检查是否有性别数据
    const genderData = input.context.pluginResults.get('gender');
      if (!genderData) {
        errors.push('缺少性别信息，请确保性别插件已执行');
      }
  
      // 检查字符是否为汉字
      if (input.data.characters) {
        for (const char of input.data.characters) {
          if (!this.isChineseCharacter(char)) {
            warnings.push(`字符 "${char}" 不是标准汉字，寓意分析可能不准确`);
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
      this.meaningDatabase.clear();
      this.culturalReferences.clear();
      this.modernTrends.clear();
    }
  
    /**
     * 检查插件是否可用
     */
    isAvailable(): boolean {
      return this.meaningDatabase.size > 0;
    }
  
    /**
     * 获取插件健康状态
     */
    getHealthStatus() {
      const meaningCount = this.meaningDatabase.size;
      const culturalCount = this.culturalReferences.size;
      
      if (meaningCount === 0) {
        return {
          status: 'unhealthy' as const,
          message: '字义数据未加载',
          lastCheck: Date.now()
        };
      } else if (meaningCount < 500) {
        return {
          status: 'degraded' as const,
          message: `字义数据不完整 (${meaningCount} 字符, ${culturalCount} 文化引用)`,
          lastCheck: Date.now()
        };
      } else {
        return {
          status: 'healthy' as const,
          message: `字义数据正常 (${meaningCount} 字符, ${culturalCount} 文化引用)`,
          lastCheck: Date.now()
        };
      }
    }
  
    /**
     * 加载字义数据库
     */
    private async loadMeaningDatabase(): Promise<void> {
      try {
        // 从数据加载器获取字义数据
        const meaningDict = await this.dataLoader.getMeaningData();
        
        for (const [char, meaning] of Object.entries(meaningDict)) {
          // 这里应该是完整的数据结构，简化处理
          this.meaningDatabase.set(char, meaning as CharacterMeaning);
        }
  
        // 如果基础数据不足，加载常用字寓意补充数据
        if (this.meaningDatabase.size < 500) {
          await this.loadSupplementaryMeaningData();
        }
  
      } catch (error) {
        console.warn('字义数据加载失败，使用备用数据');
        await this.loadFallbackMeaningData();
      }
    }
  
    /**
     * 加载补充字义数据
     */
    private async loadSupplementaryMeaningData(): Promise<void> {
      const commonMeanings = {
        // 品德类
        '德': {
          basicMeaning: '品德、道德',
          extendedMeanings: ['品行高尚', '德行兼备', '道德修养'],
          culturalBackground: '儒家核心概念，强调个人修养',
          symbolism: ['高尚品格', '道德标准', '修身齐家'],
          emotionalTone: 'positive',
          modernRelevance: 85,
          genderSuitability: { male: 90, female: 75, neutral: 85 }
        },
        '贤': {
          basicMeaning: '有德有才',
          extendedMeanings: ['贤良淑德', '德才兼备', '贤能之士'],
          culturalBackground: '古代对才德俱佳人士的称赞',
          symbolism: ['智慧才能', '品德高尚', '受人尊敬'],
          emotionalTone: 'positive',
          modernRelevance: 80,
          genderSuitability: { male: 85, female: 95, neutral: 90 }
        },
        
        // 智慧类
        '智': {
          basicMeaning: '智慧、聪明',
          extendedMeanings: ['聪明才智', '智慧过人', '明智决策'],
          culturalBackground: '中华文化推崇的重要品质',
          symbolism: ['聪明才智', '理性思考', '明智判断'],
          emotionalTone: 'positive',
          modernRelevance: 95,
          genderSuitability: { male: 90, female: 90, neutral: 95 }
        },
        '慧': {
          basicMeaning: '智慧、聪慧',
          extendedMeanings: ['聪慧过人', '慧心巧思', '智慧超群'],
          culturalBackground: '佛教文化中的般若智慧',
          symbolism: ['洞察力', '智慧灵性', '悟性很高'],
          emotionalTone: 'positive',
          modernRelevance: 90,
          genderSuitability: { male: 75, female: 95, neutral: 85 }
        },
        
        // 美好类
        '美': {
          basicMeaning: '美丽、美好',
          extendedMeanings: ['美丽动人', '美好愿望', '美德品格'],
          culturalBackground: '追求美好事物的传统文化',
          symbolism: ['美丽外貌', '美好品德', '和谐之美'],
          emotionalTone: 'positive',
          modernRelevance: 85,
          genderSuitability: { male: 60, female: 95, neutral: 80 }
        },
        '雅': {
          basicMeaning: '优雅、高雅',
          extendedMeanings: ['文雅清秀', '高雅脱俗', '雅致品味'],
          culturalBackground: '文人雅士推崇的气质',
          symbolism: ['文化修养', '优雅气质', '品味高尚'],
          emotionalTone: 'positive',
          modernRelevance: 88,
          genderSuitability: { male: 70, female: 95, neutral: 85 }
        },
        
        // 自然类
        '山': {
          basicMeaning: '山峰、高山',
          extendedMeanings: ['稳重如山', '高山仰止', '山河壮丽'],
          culturalBackground: '中华民族对山川的敬仰',
          symbolism: ['稳重坚定', '高大威严', '不动如山'],
          emotionalTone: 'positive',
          modernRelevance: 75,
          genderSuitability: { male: 90, female: 60, neutral: 75 }
        },
        '水': {
          basicMeaning: '水流、河水',
          extendedMeanings: ['上善若水', '水润万物', '柔和包容'],
          culturalBackground: '道家哲学中的重要象征',
          symbolism: ['柔和包容', '润泽万物', '智慧如水'],
          emotionalTone: 'positive',
          modernRelevance: 80,
          genderSuitability: { male: 75, female: 85, neutral: 80 }
        },
        
        // 吉祥类
        '福': {
          basicMeaning: '幸福、福气',
          extendedMeanings: ['福星高照', '幸福美满', '福泽深厚'],
          culturalBackground: '中华文化的核心祈愿',
          symbolism: ['幸福吉祥', '福气满满', '福泽绵长'],
          emotionalTone: 'positive',
          modernRelevance: 90,
          genderSuitability: { male: 85, female: 85, neutral: 90 }
        },
        '吉': {
          basicMeaning: '吉祥、吉利',
          extendedMeanings: ['吉祥如意', '大吉大利', '吉星高照'],
          culturalBackground: '传统文化的吉祥寓意',
          symbolism: ['好运连连', '吉祥平安', '万事如意'],
          emotionalTone: 'positive',
          modernRelevance: 85,
          genderSuitability: { male: 80, female: 80, neutral: 85 }
        }
      };
  
      for (const [char, meaning] of Object.entries(commonMeanings)) {
        if (!this.meaningDatabase.has(char)) {
          this.meaningDatabase.set(char, meaning as CharacterMeaning);
        }
      }
    }
  
    /**
     * 加载备用字义数据
     */
    private async loadFallbackMeaningData(): Promise<void> {
      // 简单的备用字义数据
      const testChars = ['测', '试', '字', '符', '数', '据'];
      const fallbackMeanings = [
        '测量、测试',
        '尝试、试验', 
        '文字、字符',
        '符号、标记',
        '数字、数量',
        '根据、资料'
      ];
  
      testChars.forEach((char, index) => {
        this.meaningDatabase.set(char, {
          character: char,
          basicMeaning: fallbackMeanings[index],
          extendedMeanings: [fallbackMeanings[index]],
          culturalBackground: '现代汉语词汇',
          symbolism: ['现代概念'],
          emotionalTone: 'neutral',
          modernRelevance: 70,
          genderSuitability: { male: 50, female: 50, neutral: 80 }
        });
      });
    }
  
    /**
     * 加载文化引用数据
     */
    private async loadCulturalReferences(): Promise<void> {
      const culturalData = {
        '德': [
          { source: '论语', context: '德不孤，必有邻', significance: '品德高尚者必有志同道合的朋友' },
          { source: '大学', context: '大学之道，在明明德', significance: '教育的根本在于彰显光明的品德' }
        ],
        '智': [
          { source: '论语', context: '知者不惑', significance: '有智慧的人不会迷惑' },
          { source: '道德经', context: '知人者智，自知者明', significance: '了解别人是智慧，了解自己是明达' }
        ],
        '水': [
          { source: '道德经', context: '上善若水', significance: '最高的善如水一样润泽万物而不争' },
          { source: '荀子', context: '水能载舟，亦能覆舟', significance: '水的双重性质，既能承载也能倾覆' }
        ]
      };
  
      for (const [char, references] of Object.entries(culturalData)) {
        this.culturalReferences.set(char, references);
      }
    }
  
    /**
     * 加载现代趋势数据
     */
    private async loadModernTrends(): Promise<void> {
      const modernTrendData = {
        // 传统文化回归趋势
        '雅': 92, '清': 90, '静': 88, '和': 89,
        
        // 国际化友好度
        '安': 95, '乐': 93, '华': 85, '明': 90,
        
        // 现代职场适应性
        '智': 98, '创': 95, '新': 90, '博': 88,
        
        // 社交媒体友好度
        '萌': 85, '甜': 80, '暖': 88, '阳': 92
      };
  
      for (const [char, trend] of Object.entries(modernTrendData)) {
        this.modernTrends.set(char, trend);
      }
    }
  
    /**
     * 分析单个字符的寓意
     */
    private async analyzeCharacterMeaning(character: string, gender: 'male' | 'female'): Promise<CharacterMeaning> {
      // 首先从数据库中查找
      const cached = this.meaningDatabase.get(character);
      if (cached) {
        return { ...cached, character };
      }
  
      // 如果没有找到，进行基础分析
      return this.generateBasicMeaning(character, gender);
    }
  
    /**
     * 生成基础寓意分析
     */
    private generateBasicMeaning(character: string, gender: 'male' | 'female'): CharacterMeaning {
      // 简化的寓意生成逻辑
      const meaning: CharacterMeaning = {
        character,
        basicMeaning: '待分析字符',
        extendedMeanings: ['需要进一步研究'],
        culturalBackground: '现代汉语使用',
        symbolism: ['现代符号'],
        emotionalTone: 'neutral',
        modernRelevance: 60,
        genderSuitability: {
          male: 50,
          female: 50,
          neutral: 70
        }
      };
  
      // 基于字符特征进行简单判断
      const charCode = character.charCodeAt(0);
      
      // 根据字符编码范围调整属性
      if (charCode >= 0x4e00 && charCode <= 0x5000) {
        meaning.modernRelevance = 70;
        meaning.genderSuitability.male = 60;
      } else if (charCode >= 0x5000 && charCode <= 0x6000) {
        meaning.modernRelevance = 80;
        meaning.genderSuitability.female = 60;
      }
  
      return meaning;
    }
  
    /**
     * 分析文化深度
     */
    private analyzeCulturalDepth(meanings: CharacterMeaning[]): CulturalDepthAnalysis {
      let totalDepth = 0;
      let historicalScore = 0;
      let literaryScore = 0;
      let philosophicalScore = 0;
      let aestheticScore = 0;
      const culturalResonance: string[] = [];
      const recommendedContext: string[] = [];
  
      meanings.forEach(meaning => {
        // 历史意义评分
        if (meaning.culturalBackground.includes('古代') || meaning.culturalBackground.includes('传统')) {
          historicalScore += 20;
        }
        
        // 文学价值评分
        if (meaning.literaryReferences && meaning.literaryReferences.length > 0) {
          literaryScore += 25;
          meaning.literaryReferences.forEach(ref => {
            if (!culturalResonance.includes(ref.source)) {
              culturalResonance.push(ref.source);
            }
          });
        }
  
        // 哲学内涵评分
        if (meaning.symbolism.some(symbol => 
          symbol.includes('智慧') || symbol.includes('品德') || symbol.includes('修养')
        )) {
          philosophicalScore += 20;
        }
  
        // 美学价值评分
        if (meaning.emotionalTone === 'positive' && meaning.symbolism.some(symbol =>
          symbol.includes('美') || symbol.includes('雅') || symbol.includes('和谐')
        )) {
          aestheticScore += 15;
        }
      });
  
      // 归一化分数
      const count = meanings.length;
      historicalScore = Math.min(100, historicalScore / count);
      literaryScore = Math.min(100, literaryScore / count);
      philosophicalScore = Math.min(100, philosophicalScore / count);
      aestheticScore = Math.min(100, aestheticScore / count);
  
      totalDepth = (historicalScore + literaryScore + philosophicalScore + aestheticScore) / 4;
  
      // 生成推荐语境
      if (historicalScore > 70) recommendedContext.push('传统文化教育');
      if (literaryScore > 70) recommendedContext.push('文学艺术领域');
      if (philosophicalScore > 70) recommendedContext.push('哲学思辨讨论');
      if (aestheticScore > 70) recommendedContext.push('美学艺术欣赏');
  
      return {
        overallDepth: Math.round(totalDepth),
        historicalSignificance: Math.round(historicalScore),
        literaryValue: Math.round(literaryScore),
        philosophicalContent: Math.round(philosophicalScore),
        aestheticValue: Math.round(aestheticScore),
        culturalResonance,
        recommendedContext
      };
    }
  
    /**
     * 分析现代适用性
     */
    private analyzeModernApplicability(meanings: CharacterMeaning[], gender: 'male' | 'female'): ModernApplicabilityAnalysis {
      let relevanceSum = 0;
      let internationalSum = 0;
      let professionalSum = 0;
      let socialSum = 0;
      const concerns: string[] = [];
      const advantages: string[] = [];
  
      meanings.forEach(meaning => {
        relevanceSum += meaning.modernRelevance;
        
        // 国际友好度评估
        if (meaning.basicMeaning.length <= 4 && !meaning.basicMeaning.includes('古代')) {
          internationalSum += 80;
        } else {
          internationalSum += 60;
        }
  
        // 职场适用性评估
        if (meaning.symbolism.some(symbol => 
          symbol.includes('智慧') || symbol.includes('能力') || symbol.includes('成功')
        )) {
          professionalSum += 85;
        } else {
          professionalSum += 65;
        }
  
        // 社会接受度评估
        if (meaning.emotionalTone === 'positive') {
          socialSum += 90;
          advantages.push(`"${meaning.character}"寓意积极正面`);
        } else if (meaning.emotionalTone === 'neutral') {
          socialSum += 70;
        } else {
          socialSum += 40;
          concerns.push(`"${meaning.character}"可能有负面联想`);
        }
  
        // 性别适用性检查
        const genderScore = meaning.genderSuitability[gender];
        if (genderScore < 60) {
          concerns.push(`"${meaning.character}"与${gender === 'male' ? '男性' : '女性'}特质匹配度偏低`);
        } else if (genderScore > 85) {
          advantages.push(`"${meaning.character}"与${gender === 'male' ? '男性' : '女性'}特质高度匹配`);
        }
      });
  
      const count = meanings.length;
      const contemporaryRelevance = Math.round(relevanceSum / count);
      const internationalFriendliness = Math.round(internationalSum / count);
      const professionalSuitability = Math.round(professionalSum / count);
      const socialAcceptance = Math.round(socialSum / count);
  
      // 确定趋势对齐
      let trendAlignment: ModernApplicabilityAnalysis['trendAlignment'];
      if (contemporaryRelevance > 85) {
        trendAlignment = 'modern';
      } else if (contemporaryRelevance > 70) {
        trendAlignment = 'timeless';
      } else if (contemporaryRelevance > 50) {
        trendAlignment = 'traditional';
      } else {
        trendAlignment = 'vintage';
      }
  
      return {
        contemporaryRelevance,
        internationalFriendliness,
        professionalSuitability,
        socialAcceptance,
        trendAlignment,
        potentialConcerns: concerns,
        advantages
      };
    }
  
    /**
     * 分析组合和谐度
     */
    private analyzeCombinationHarmony(meanings: CharacterMeaning[]): CombinationHarmony {
      if (meanings.length === 1) {
        // 单字分析
        const meaning = meanings[0];
        return {
          overallHarmony: 85,
          thematicConsistency: 100,
          emotionalBalance: meaning.emotionalTone === 'positive' ? 90 : 70,
          culturalCoherence: 85,
          modernSynergy: meaning.modernRelevance,
          strengtheningSuggestions: ['单字名建议搭配含义相近的姓氏']
        };
      }
  
      // 双字或多字分析
      const emotionalTones = meanings.map(m => m.emotionalTone);
      const symbolisms = meanings.flatMap(m => m.symbolism);
      const modernScores = meanings.map(m => m.modernRelevance);
  
      // 主题一致性
      const uniqueThemes = new Set(symbolisms.map(s => s.split(/[、，]/)[0])).size;
      const thematicConsistency = Math.max(0, 100 - (uniqueThemes - 1) * 20);
  
      // 情感平衡
      const positiveCount = emotionalTones.filter(tone => tone === 'positive').length;
      const negativeCount = emotionalTones.filter(tone => tone === 'negative').length;
      const emotionalBalance = negativeCount > 0 ? 40 : (positiveCount === meanings.length ? 95 : 80);
  
      // 文化连贯性
      const culturalSources = meanings.map(m => m.culturalBackground);
      const uniqueSources = new Set(culturalSources).size;
      const culturalCoherence = Math.max(60, 100 - (uniqueSources - 1) * 15);
  
      // 现代协同性
      const avgModernScore = modernScores.reduce((sum, score) => sum + score, 0) / modernScores.length;
      const modernVariance = modernScores.reduce((sum, score) => sum + Math.pow(score - avgModernScore, 2), 0) / modernScores.length;
      const modernSynergy = Math.max(50, 100 - modernVariance / 10);
  
      const overallHarmony = (thematicConsistency + emotionalBalance + culturalCoherence + modernSynergy) / 4;
  
      // 生成建议
      const adjustments: string[] = [];
      const suggestions: string[] = [];
  
      if (thematicConsistency < 70) {
        adjustments.push('建议选择主题更一致的字符');
      }
      if (emotionalBalance < 60) {
        adjustments.push('建议平衡积极和消极情感倾向');
      }
      if (culturalCoherence < 70) {
        adjustments.push('建议选择文化背景更协调的字符');
      }
      if (modernSynergy < 70) {
        adjustments.push('建议统一现代适用性水平');
      }
  
      if (overallHarmony > 85) {
        suggestions.push('字符组合和谐度很高，建议保持');
      } else if (overallHarmony > 70) {
        suggestions.push('字符组合较为和谐，可适当微调');
      }
  
      return {
        overallHarmony: Math.round(overallHarmony),
        thematicConsistency: Math.round(thematicConsistency),
        emotionalBalance: Math.round(emotionalBalance),
        culturalCoherence: Math.round(culturalCoherence),
        modernSynergy: Math.round(modernSynergy),
        recommendedAdjustments: adjustments.length > 0 ? adjustments : undefined,
        strengtheningSuggestions: suggestions.length > 0 ? suggestions : undefined
      };
    }
  
    /**
     * 生成寓意建议
     */
    private generateMeaningRecommendations(
      meanings: CharacterMeaning[],
      culturalDepth: CulturalDepthAnalysis,
      modernApplicability: ModernApplicabilityAnalysis,
      harmony: CombinationHarmony,
      gender: 'male' | 'female'
    ): string[] {
      const recommendations: string[] = [];
  
      // 基于文化深度的建议
      if (culturalDepth.overallDepth > 80) {
        recommendations.push('字符具有深厚的文化底蕴，适合追求传统文化内涵的家庭');
      } else if (culturalDepth.overallDepth < 50) {
        recommendations.push('字符文化内涵相对较浅，建议加强传统文化元素');
      }
  
      // 基于现代适用性的建议
      if (modernApplicability.contemporaryRelevance > 85) {
        recommendations.push('字符现代适用性强，符合当代命名趋势');
      } else if (modernApplicability.contemporaryRelevance < 60) {
        recommendations.push('字符偏向传统，在现代使用中可能需要解释其含义');
      }
  
      // 基于性别适用性的建议
      const avgGenderSuitability = meanings.reduce((sum, m) => sum + m.genderSuitability[gender], 0) / meanings.length;
      if (avgGenderSuitability < 70) {
        recommendations.push(`字符与${gender === 'male' ? '男性' : '女性'}特质的匹配度有提升空间`);
      }
  
      // 基于组合和谐度的建议
      if (harmony.overallHarmony < 70) {
        recommendations.push('字符组合的和谐度需要改善，建议调整字符搭配');
      }
  
      // 潜在问题提醒
      if (modernApplicability.potentialConcerns.length > 0) {
        recommendations.push(`需要注意: ${modernApplicability.potentialConcerns.join('、')}`);
      }
  
      // 优势强化
      if (modernApplicability.advantages.length > 0) {
        recommendations.push(`优势: ${modernApplicability.advantages.join('、')}`);
      }
  
      if (recommendations.length === 0) {
        recommendations.push('字符寓意分析整体平衡，符合基本要求');
      }
  
      return recommendations;
    }
  
    /**
     * 计算总体评级
     */
    private calculateOverallRating(
      culturalDepth: CulturalDepthAnalysis,
      modernApplicability: ModernApplicabilityAnalysis,
      harmony: CombinationHarmony
    ): number {
      const culturalWeight = 0.3;
      const modernWeight = 0.4;
      const harmonyWeight = 0.3;
  
      const overallScore = 
        culturalDepth.overallDepth * culturalWeight +
        modernApplicability.contemporaryRelevance * modernWeight +
        harmony.overallHarmony * harmonyWeight;
  
      return Math.round(overallScore);
    }
  
    /**
     * 计算置信度
     */
    private calculateConfidence(meanings: CharacterMeaning[], genderData: any): number {
      let baseConfidence = 0.8;
  
      // 根据数据完整性调整
      const completeDataCount = meanings.filter(m => 
        m.literaryReferences && m.literaryReferences.length > 0
      ).length;
      
      if (completeDataCount === meanings.length) {
        baseConfidence = 0.9;
      } else if (completeDataCount === 0) {
        baseConfidence = 0.6;
      }
  
      // 根据性别匹配度调整
      const genderMatchScore = meanings.reduce((sum, m) => 
        sum + m.genderSuitability[genderData.gender], 0
      ) / meanings.length;
      
      const genderConfidenceMultiplier = genderMatchScore / 100;
      
      return Math.min(0.95, baseConfidence * (0.8 + 0.2 * genderConfidenceMultiplier));
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