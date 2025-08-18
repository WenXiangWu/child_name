/**
 * 字符五行插件 - Layer 3
 * 负责分析汉字的五行属性，包括字形、字音、字义的五行归属
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
  
  export type WuxingElement = '金' | '木' | '水' | '火' | '土';
  
  export interface CharacterWuxingData {
    character: string;
    primaryWuxing: WuxingElement;
    secondaryWuxing?: WuxingElement;
    analysisMethod: 'shape' | 'sound' | 'meaning' | 'comprehensive';
    confidence: number;
    details: {
      shapeWuxing?: WuxingElement;
      soundWuxing?: WuxingElement;
      meaningWuxing?: WuxingElement;
      radicalWuxing?: WuxingElement;
    };
    explanation: string;
  }
  
  export interface WuxingCombination {
    elements: WuxingElement[];
    relationship: 'generation' | 'destruction' | 'neutral' | 'harmony';
    score: number;
    description: string;
    suggestions?: string[];
  }
  
  export interface WuxingBalance {
    金: number;
    木: number;
    水: number;
    火: number;
    土: number;
    dominant: WuxingElement;
    lacking?: WuxingElement[];
    excessive?: WuxingElement[];
    balanceScore: number;
  }
  
  export class WuxingCharPlugin implements NamingPlugin {
    readonly id = 'wuxing-char';
    readonly version = '1.0.0';
    readonly layer = 3;
    readonly dependencies: PluginDependency[] = [];
    readonly metadata: PluginMetadata = {
      name: '字符五行分析插件',
      description: '分析汉字的五行属性，包括字形、字音、字义的五行归属',
      author: 'System',
      category: 'evaluation',
      tags: ['wuxing', 'five-elements', 'character-analysis', 'balance']
    };
  
    private config: PluginConfig | null = null;
    private dataLoader: QimingDataLoader;
    private wuxingData: Map<string, CharacterWuxingData> = new Map();
    private radicalWuxingMap: Map<string, WuxingElement> = new Map();
    private soundWuxingMap: Map<string, WuxingElement> = new Map();
  
    constructor() {
      this.dataLoader = QimingDataLoader.getInstance();
    }
  
    /**
     * 初始化插件
     */
    async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
      this.config = config;
      
      try {
        // 加载五行数据
        await this.loadWuxingData();
        await this.loadRadicalWuxingMap();
        await this.loadSoundWuxingMap();
        
        context.log('info', `字符五行插件初始化完成, 版本: ${this.version}`);
        context.log('info', `已加载 ${this.wuxingData.size} 个汉字的五行数据`);
      } catch (error) {
        context.log('error', '五行数据加载失败', error);
        throw error;
      }
    }
  
    /**
     * 处理字符五行分析
     */
    async process(input: StandardInput): Promise<PluginOutput> {
      const startTime = Date.now();
      
      const { characters } = input.data;
      
      // 判断是分析模式还是生成模式
      if (!characters || characters.length === 0) {
        // 生成模式：提供五行候选字符
        return this.generateWuxingCandidates(input, startTime);
      }
  
      try {
        // 分析每个字符的五行属性
        const wuxingResults = await Promise.all(
          characters.map(char => this.analyzeCharacterWuxing(char))
        );
  
        // 分析五行组合关系
        const combinations = this.analyzeWuxingCombinations(wuxingResults);
  
        // 分析五行平衡性
        const balance = this.analyzeWuxingBalance(wuxingResults);
  
        // 生成五行建议
        const recommendations = this.generateWuxingRecommendations(balance, combinations);
  
        return {
          pluginId: this.id,
          results: {
            characterWuxing: wuxingResults,
            combinations,
            balance,
            recommendations,
            overallHarmony: this.calculateOverallHarmony(combinations, balance)
          },
          confidence: this.calculateOverallConfidence(wuxingResults),
          metadata: {
            processingTime: Date.now() - startTime,
            analysisMethod: 'multi-factor-analysis',
            version: this.version,
            characterCount: characters.length
          }
        };
  
      } catch (error) {
        throw new Error(`五行分析失败: ${error instanceof Error ? error.message : String(error)}`);
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
  
      // 检查字符是否为汉字
      if (input.data.characters) {
        for (const char of input.data.characters) {
          if (!this.isChineseCharacter(char)) {
            warnings.push(`字符 "${char}" 不是标准汉字，五行分析可能不准确`);
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
      this.wuxingData.clear();
      this.radicalWuxingMap.clear();
      this.soundWuxingMap.clear();
    }
  
    /**
     * 检查插件是否可用
     */
    isAvailable(): boolean {
      return this.wuxingData.size > 0 && this.radicalWuxingMap.size > 0;
    }
  
    /**
     * 获取插件健康状态
     */
    getHealthStatus() {
      const dataCount = this.wuxingData.size;
      const radicalCount = this.radicalWuxingMap.size;
      
      if (dataCount === 0 || radicalCount === 0) {
        return {
          status: 'unhealthy' as const,
          message: '五行数据未加载',
          lastCheck: Date.now()
        };
      } else if (dataCount < 20 || radicalCount < 10) {
        return {
          status: 'degraded' as const,
          message: `五行数据不完整 (${dataCount} 字符, ${radicalCount} 部首)`,
          lastCheck: Date.now()
        };
      } else {
        return {
          status: 'healthy' as const,
          message: `五行数据正常 (${dataCount} 字符, ${radicalCount} 部首)`,
          lastCheck: Date.now()
        };
      }
    }
  
    /**
     * 加载五行数据
     */
    private async loadWuxingData(): Promise<void> {
      try {
        // TODO: 实现五行数据加载
        // const wuxingDict = await this.dataLoader.loadWuxingDataSimplified();
        console.warn('WuxingCharPlugin: getWuxingData method not implemented yet');
        
        // 临时用空的五行数据
        // for (const [char, wuxing] of Object.entries(wuxingDict)) {
        //   this.wuxingData.set(char, {
        //     character: char,
        //     primaryWuxing: wuxing as WuxingElement,
        //     analysisMethod: 'comprehensive',
        //     confidence: 0.9,
        //     details: {},
        //     explanation: `字典记录的五行属性为${wuxing}`
        //   });
        // }
  
        // 如果基础数据不足，加载常用字五行补充数据
        if (this.wuxingData.size < 500) {
          await this.loadSupplementaryWuxingData();
        }
  
      } catch (error) {
        console.warn('五行数据加载失败，使用备用分析方法');
        await this.loadFallbackWuxingData();
      }
    }
  
    /**
     * 加载补充五行数据
     */
    private async loadSupplementaryWuxingData(): Promise<void> {
      // 常用汉字五行数据
      const commonWuxingData = {
        // 金
        '金': '金', '银': '金', '钢': '金', '铁': '金', '铜': '金', '锡': '金', '钟': '金', '锋': '金',
        '刀': '金', '剑': '金', '钰': '金', '钊': '金', '钦': '金', '钧': '金', '铭': '金', '锐': '金',
        
        // 木
        '木': '木', '林': '木', '森': '木', '树': '木', '枝': '木', '叶': '木', '花': '木', '草': '木',
        '芳': '木', '芝': '木', '茂': '木', '松': '木', '柏': '木', '桂': '木', '梅': '木', '竹': '木',
        
        // 水
        '水': '水', '江': '水', '河': '水', '湖': '水', '海': '水', '波': '水', '涛': '水', '泉': '水',
        '雨': '水', '雪': '水', '霜': '水', '露': '水', '泽': '水', '润': '水', '清': '水', '洁': '水',
        
        // 火
        '火': '火', '炎': '火', '焰': '火', '烈': '火', '热': '火', '燃': '火', '煌': '火', '辉': '火',
        '光': '火', '明': '火', '亮': '火', '晶': '火', '阳': '火', '日': '火', '昭': '火', '晨': '火',
        
        // 土
        '土': '土', '地': '土', '山': '土', '石': '土', '岩': '土', '峰': '土', '城': '土', '堡': '土',
        '田': '土', '园': '土', '圆': '土', '坚': '土', '固': '土', '墨': '土', '培': '土', '基': '土'
      };
  
      for (const [char, wuxing] of Object.entries(commonWuxingData)) {
        if (!this.wuxingData.has(char)) {
          this.wuxingData.set(char, {
            character: char,
            primaryWuxing: wuxing as WuxingElement,
            analysisMethod: 'meaning',
            confidence: 0.8,
            details: { meaningWuxing: wuxing as WuxingElement },
            explanation: `基于字义分析，此字五行属${wuxing}`
          });
        }
      }
    }
  
    /**
     * 加载备用五行数据
     */
    private async loadFallbackWuxingData(): Promise<void> {
      // 简单的备用五行分析（基于偏旁部首）
      const testChars = ['测', '试', '字', '符', '数', '据'];
      const elements: WuxingElement[] = ['金', '木', '水', '火', '土'];
      
      testChars.forEach((char, index) => {
        const element = elements[index % 5];
        this.wuxingData.set(char, {
          character: char,
          primaryWuxing: element,
          analysisMethod: 'shape',
          confidence: 0.5,
          details: { shapeWuxing: element },
          explanation: `简化分析，此字五行属${element}`
        });
      });
    }
  
    /**
     * 加载偏旁部首五行映射
     */
    private async loadRadicalWuxingMap(): Promise<void> {
      const radicalWuxing = {
        // 金部首
        '金': '金', '钅': '金', '刀': '金', '刂': '金', '厶': '金', '辛': '金',
        
        // 木部首
        '木': '木', '艹': '木', '竹': '木', '禾': '木', '米': '木', '乙': '木',
        
        // 水部首
        '水': '水', '氵': '水', '雨': '水', '冫': '水', '亠': '水', '癸': '水',
        
        // 火部首
        '火': '火', '灬': '火', '日': '火', '光': '火', '丙': '火', '丁': '火',
        
        // 土部首
        '土': '土', '山': '土', '石': '土', '王': '土', '田': '土', '戊': '土'
      };
  
      for (const [radical, wuxing] of Object.entries(radicalWuxing)) {
        this.radicalWuxingMap.set(radical, wuxing as WuxingElement);
      }
    }
  
    /**
     * 加载字音五行映射
     */
    private async loadSoundWuxingMap(): Promise<void> {
      const soundWuxing = {
        // 金音（商音）- 声母：s, c, z, j, q, x
        's': '金', 'c': '金', 'z': '金', 'j': '金', 'q': '金', 'x': '金',
        
        // 木音（角音）- 声母：g, k, h
        'g': '木', 'k': '木', 'h': '木',
        
        // 水音（羽音）- 声母：b, p, m, f
        'b': '水', 'p': '水', 'm': '水', 'f': '水',
        
        // 火音（徵音）- 声母：d, t, n, l
        'd': '火', 't': '火', 'n': '火', 'l': '火',
        
        // 土音（宫音）- 声母：y, w, 零声母
        'y': '土', 'w': '土', '': '土'
      };
  
      for (const [sound, wuxing] of Object.entries(soundWuxing)) {
        this.soundWuxingMap.set(sound, wuxing as WuxingElement);
      }
    }
  
    /**
     * 分析单个字符的五行属性
     */
    private async analyzeCharacterWuxing(character: string): Promise<CharacterWuxingData> {
      // 首先从预加载的数据中查找
      const cached = this.wuxingData.get(character);
      if (cached) {
        return cached;
      }
  
      // 如果没有找到，进行综合分析
      const analysis = await this.comprehensiveWuxingAnalysis(character);
      
      // 缓存分析结果
      this.wuxingData.set(character, analysis);
      
      return analysis;
    }
  
    /**
     * 综合五行分析
     */
    private async comprehensiveWuxingAnalysis(character: string): Promise<CharacterWuxingData> {
      const details: CharacterWuxingData['details'] = {};
      const factors: { element: WuxingElement; weight: number; method: string }[] = [];
  
      // 1. 字形分析（偏旁部首）
      const shapeWuxing = this.analyzeShapeWuxing(character);
      if (shapeWuxing) {
        details.shapeWuxing = shapeWuxing;
        factors.push({ element: shapeWuxing, weight: 0.4, method: 'shape' });
      }
  
      // 2. 字音分析（声母）
      const soundWuxing = this.analyzeSoundWuxing(character);
      if (soundWuxing) {
        details.soundWuxing = soundWuxing;
        factors.push({ element: soundWuxing, weight: 0.3, method: 'sound' });
      }
  
      // 3. 字义分析（语义倾向）
      const meaningWuxing = this.analyzeMeaningWuxing(character);
      if (meaningWuxing) {
        details.meaningWuxing = meaningWuxing;
        factors.push({ element: meaningWuxing, weight: 0.3, method: 'meaning' });
      }
  
      // 综合判断主要五行
      const primaryWuxing = this.determinePrimaryWuxing(factors);
      const confidence = factors.length > 0 ? factors.reduce((sum, f) => sum + f.weight, 0) / factors.length : 0.5;
  
      return {
        character,
        primaryWuxing,
        analysisMethod: 'comprehensive',
        confidence,
        details,
        explanation: this.generateWuxingExplanation(character, factors, primaryWuxing)
      };
    }
  
    /**
     * 字形五行分析
     */
    private analyzeShapeWuxing(character: string): WuxingElement | null {
      // 简化的偏旁分析，实际应该使用更详细的偏旁库
      for (const [radical, wuxing] of this.radicalWuxingMap) {
        if (character.includes(radical)) {
          return wuxing;
        }
      }
      return null;
    }
  
    /**
     * 字音五行分析
     */
    private analyzeSoundWuxing(character: string): WuxingElement | null {
      // 简化的拼音声母分析，实际应该使用完整的拼音库
      // 这里使用简单的字符编码推算
      const unicode = character.charCodeAt(0);
      const soundKeys = Array.from(this.soundWuxingMap.keys());
      const soundKey = soundKeys[unicode % soundKeys.length];
      return this.soundWuxingMap.get(soundKey) || null;
    }
  
    /**
     * 字义五行分析
     */
    private analyzeMeaningWuxing(character: string): WuxingElement | null {
      // 基于字符的语义特征推断五行
      // 这是一个简化的实现，实际应该使用语义分析
      
      const meaningPatterns = {
        金: ['金', '银', '铁', '钢', '刀', '剑', '坚', '硬', '锐', '切'],
        木: ['木', '林', '树', '花', '草', '叶', '绿', '生', '长', '直'],
        水: ['水', '江', '河', '海', '雨', '露', '清', '润', '流', '波'],
        火: ['火', '光', '明', '热', '红', '亮', '辉', '烈', '炎', '阳'],
        土: ['土', '山', '石', '地', '田', '厚', '重', '稳', '固', '黄']
      };
  
      for (const [element, patterns] of Object.entries(meaningPatterns)) {
        for (const pattern of patterns) {
          if (character.includes(pattern)) {
            return element as WuxingElement;
          }
        }
      }
  
      return null;
    }
  
    /**
     * 确定主要五行
     */
    private determinePrimaryWuxing(factors: { element: WuxingElement; weight: number }[]): WuxingElement {
      if (factors.length === 0) {
        return '土'; // 默认返回土
      }
  
      // 统计各五行的权重
      const elementWeights = factors.reduce((acc, factor) => {
        acc[factor.element] = (acc[factor.element] || 0) + factor.weight;
        return acc;
      }, {} as Record<WuxingElement, number>);
  
      // 返回权重最高的五行
      return Object.entries(elementWeights).reduce((max, [element, weight]) => 
        weight > elementWeights[max] ? element as WuxingElement : max
      , '土' as WuxingElement);
    }
  
    /**
     * 生成五行解释
     */
    private generateWuxingExplanation(character: string, factors: any[], primaryWuxing: WuxingElement): string {
      const methodNames = {
        shape: '字形',
        sound: '字音',
        meaning: '字义'
      };
  
      const methods = factors.map(f => methodNames[f.method as keyof typeof methodNames]).filter(Boolean);
      
      if (methods.length === 0) {
        return `字符"${character}"经分析确定五行属${primaryWuxing}`;
      }
  
      return `字符"${character}"经${methods.join('、')}分析，综合确定五行属${primaryWuxing}`;
    }
  
    /**
     * 分析五行组合关系
     */
    private analyzeWuxingCombinations(wuxingData: CharacterWuxingData[]): WuxingCombination[] {
      const combinations: WuxingCombination[] = [];
      
      if (wuxingData.length === 2) {
        // 双字分析
        const [first, second] = wuxingData;
        const elements: WuxingElement[] = [first.primaryWuxing, second.primaryWuxing];
        
        combinations.push({
          elements,
          relationship: this.getWuxingRelationship(elements[0], elements[1]),
          score: this.calculateCombinationScore(elements[0], elements[1]),
          description: this.describeCombination(elements[0], elements[1]),
          suggestions: this.generateCombinationSuggestions(elements[0], elements[1])
        });
      } else if (wuxingData.length === 1) {
        // 单字分析
        const element = wuxingData[0].primaryWuxing;
        combinations.push({
          elements: [element],
          relationship: 'neutral',
          score: 75, // 单字默认分数
          description: `单字五行属${element}`,
          suggestions: [`建议搭配与${element}相生的五行字符`]
        });
      }
  
      return combinations;
    }
  
    /**
     * 获取五行关系
     */
    private getWuxingRelationship(element1: WuxingElement, element2: WuxingElement): 'generation' | 'destruction' | 'neutral' | 'harmony' {
      if (element1 === element2) {
        return 'harmony';
      }
  
      // 相生关系：木生火，火生土，土生金，金生水，水生木
      const generationPairs = [
        ['木', '火'], ['火', '土'], ['土', '金'], ['金', '水'], ['水', '木']
      ];
  
      // 相克关系：木克土，土克水，水克火，火克金，金克木
      const destructionPairs = [
        ['木', '土'], ['土', '水'], ['水', '火'], ['火', '金'], ['金', '木']
      ];
  
      for (const [gen1, gen2] of generationPairs) {
        if ((element1 === gen1 && element2 === gen2) || (element1 === gen2 && element2 === gen1)) {
          return 'generation';
        }
      }
  
      for (const [dest1, dest2] of destructionPairs) {
        if ((element1 === dest1 && element2 === dest2) || (element1 === dest2 && element2 === dest1)) {
          return 'destruction';
        }
      }
  
      return 'neutral';
    }
  
    /**
     * 计算组合分数
     */
    private calculateCombinationScore(element1: WuxingElement, element2: WuxingElement): number {
      const relationship = this.getWuxingRelationship(element1, element2);
      
      switch (relationship) {
        case 'harmony':
          return 85;
        case 'generation':
          return 90;
        case 'neutral':
          return 70;
        case 'destruction':
          return 40;
        default:
          return 60;
      }
    }
  
    /**
     * 描述五行组合
     */
    private describeCombination(element1: WuxingElement, element2: WuxingElement): string {
      const relationship = this.getWuxingRelationship(element1, element2);
      
      switch (relationship) {
        case 'harmony':
          return `${element1}${element2}同属，五行和谐统一`;
        case 'generation':
          return `${element1}${element2}相生，五行循环顺畅`;
        case 'neutral':
          return `${element1}${element2}五行平和，无明显冲突`;
        case 'destruction':
          return `${element1}${element2}相克，五行存在冲突`;
        default:
          return `${element1}${element2}五行关系复杂`;
      }
    }
  
    /**
     * 生成组合建议
     */
    private generateCombinationSuggestions(element1: WuxingElement, element2: WuxingElement): string[] {
      const relationship = this.getWuxingRelationship(element1, element2);
      
      switch (relationship) {
        case 'harmony':
          return ['五行和谐，可考虑加强此五行的特质'];
        case 'generation':
          return ['五行相生，有利于运势发展，建议保持'];
        case 'neutral':
          return ['五行平和，可通过其他因素进行调和'];
        case 'destruction':
          return ['五行相克，建议考虑调节或增加调和五行'];
        default:
          return ['建议综合考虑其他五行因素'];
      }
    }
  
    /**
     * 分析五行平衡性
     */
    private analyzeWuxingBalance(wuxingData: CharacterWuxingData[]): WuxingBalance {
      const counts = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
      
      // 统计各五行出现次数
      wuxingData.forEach(item => {
        counts[item.primaryWuxing]++;
        if (item.secondaryWuxing) {
          counts[item.secondaryWuxing] += 0.5;
        }
      });
  
      // 找出主导和缺失的五行
      const elements = Object.entries(counts) as [WuxingElement, number][];
      const dominant = elements.reduce((max, [element, count]) => 
        count > counts[max] ? element : max
      , '土' as WuxingElement);
  
      const lacking = elements.filter(([, count]) => count === 0).map(([element]) => element);
      const excessive = elements.filter(([, count]) => count > wuxingData.length * 0.6).map(([element]) => element);
  
      // 计算平衡分数
      const maxCount = Math.max(...Object.values(counts));
      const minCount = Math.min(...Object.values(counts));
      const balanceScore = maxCount === 0 ? 0 : Math.round((1 - (maxCount - minCount) / maxCount) * 100);
  
      return {
        金: counts.金,
        木: counts.木,
        水: counts.水,
        火: counts.火,
        土: counts.土,
        dominant,
        lacking: lacking.length > 0 ? lacking : undefined,
        excessive: excessive.length > 0 ? excessive : undefined,
        balanceScore
      };
    }
  
    /**
     * 生成五行建议
     */
    private generateWuxingRecommendations(balance: WuxingBalance, combinations: WuxingCombination[]): string[] {
      const recommendations: string[] = [];
  
      // 基于平衡性给出建议
      if (balance.lacking && balance.lacking.length > 0) {
        recommendations.push(`建议补充${balance.lacking.join('、')}元素的字符`);
      }
  
      if (balance.excessive && balance.excessive.length > 0) {
        recommendations.push(`${balance.excessive.join('、')}元素较多，建议平衡其他五行`);
      }
  
      // 基于组合关系给出建议
      const poorCombinations = combinations.filter(combo => combo.score < 60);
      if (poorCombinations.length > 0) {
        recommendations.push('存在五行冲突，建议调整字符搭配');
      }
  
      // 平衡性建议
      if (balance.balanceScore < 50) {
        recommendations.push('五行失衡，建议增加弱势五行字符');
      } else if (balance.balanceScore > 80) {
        recommendations.push('五行平衡良好，可保持现有搭配');
      }
  
      if (recommendations.length === 0) {
        recommendations.push('五行分布合理，符合平衡原则');
      }
  
      return recommendations;
    }
  
    /**
     * 计算整体和谐度
     */
    private calculateOverallHarmony(combinations: WuxingCombination[], balance: WuxingBalance): number {
      const combinationScore = combinations.length > 0 
        ? combinations.reduce((sum, combo) => sum + combo.score, 0) / combinations.length 
        : 70;
  
      const balanceScore = balance.balanceScore;
  
      return Math.round((combinationScore * 0.6 + balanceScore * 0.4));
    }
  
    /**
     * 计算整体置信度
     */
    private calculateOverallConfidence(wuxingData: CharacterWuxingData[]): number {
      if (wuxingData.length === 0) return 0;
      
      const avgConfidence = wuxingData.reduce((sum, item) => sum + item.confidence, 0) / wuxingData.length;
      
      // 根据分析方法调整置信度
      const comprehensiveCount = wuxingData.filter(item => item.analysisMethod === 'comprehensive').length;
      const comprehensiveRatio = comprehensiveCount / wuxingData.length;
      
      return Math.min(0.95, avgConfidence * (0.7 + 0.3 * comprehensiveRatio));
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

    /**
     * 生成五行候选字符（当没有具体字符时）
     */
    private async generateWuxingCandidates(input: StandardInput, startTime: number): Promise<PluginOutput> {
      try {
        // 获取性别信息
        const genderResult = input.context.pluginResults.get('gender');
        if (!genderResult?.results) {
          throw new Error('缺少性别信息');
        }
        
        const gender = genderResult.results.gender;
        const commonChars = genderResult.results.commonChars || new Set();
        
        // 获取八字五行需求（如果有的话）
        const baziResult = input.context.pluginResults.get('bazi');
        const xiYongShenResult = input.context.pluginResults.get('xiyongshen');
        
        // 确定需要的五行元素
        const requiredElements = this.determineRequiredElements(baziResult, xiYongShenResult);
        
        // 生成五行候选字符
        const favorableChars = this.generateFavorableCharsByElement(requiredElements, gender, commonChars);
        
        // 生成需要避免的字符
        const restrictedChars = this.generateRestrictedChars(requiredElements);
        
        return {
          pluginId: this.id,
          results: {
            requiredElements,
            favorableChars,
            restrictedChars,
            analysisType: 'candidate-generation',
            candidateCount: Array.from(favorableChars.values()).reduce((sum, chars) => sum + chars.length, 0)
          },
          confidence: 0.85, // 相对高的置信度
          metadata: {
            processingTime: Date.now() - startTime,
            analysisMode: 'generation',
            version: this.version,
            genderInfluence: gender,
            commonCharsUsed: commonChars.size > 0
          }
        };
        
      } catch (error) {
        throw new Error(`五行候选字符生成失败: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    /**
     * 确定需要的五行元素
     */
    private determineRequiredElements(baziResult?: any, xiYongShenResult?: any): string[] {
      const elements = [];
      
      // 如果有喜用神信息，优先使用
      if (xiYongShenResult?.results?.favorableElements) {
        elements.push(...xiYongShenResult.results.favorableElements);
      }
      
      // 如果有八字信息，分析五行缺失
      if (baziResult?.results?.wuxingAnalysis) {
        const analysis = baziResult.results.wuxingAnalysis;
        if (analysis.deficiencies) {
          elements.push(...analysis.deficiencies);
        }
      }
      
      // 如果没有明确信息，使用平衡的五行组合
      if (elements.length === 0) {
        elements.push('木', '火', '土'); // 默认的吉利组合
      }
      
      return [...new Set(elements)]; // 去重
    }

    /**
     * 按五行元素生成有利字符
     */
    private generateFavorableCharsByElement(requiredElements: string[], gender: string, commonChars: Set<string>): Map<string, string[]> {
      const favorableChars = new Map<string, string[]>();
      
      for (const element of requiredElements) {
        const chars = this.getCharactersByElement(element, gender, commonChars);
        favorableChars.set(element, chars);
      }
      
      return favorableChars;
    }

    /**
     * 根据五行元素获取字符
     */
    private getCharactersByElement(element: string, gender: string, commonChars: Set<string>): string[] {
      const elementChars: Record<string, string[]> = {
        '木': ['林', '森', '杰', '松', '柏', '梓', '栋', '楠', '榕', '桂', '桃', '李', '朵', '花', '草', '芳', '芯', '茗', '茜', '莉', '菲', '萍', '蕾', '薇'],
        '火': ['炎', '焱', '烁', '煜', '熠', '灿', '耀', '辉', '明', '晨', '曦', '旭', '昊', '昱', '晟', '晴', '暖', '阳', '光', '亮', '丹', '赤', '红'],
        '土': ['坤', '埔', '城', '堡', '墨', '增', '壮', '壁', '均', '坚', '垒', '培', '基', '塘', '境', '墅', '岩', '峰', '峻', '崇', '嵩', '岱', '岭'],
        '金': ['鑫', '钢', '铁', '银', '金', '铜', '钧', '钟', '铭', '锋', '锐', '镇', '锦', '键', '链', '钱', '铃', '锡', '钰', '铎', '锌', '锂', '钊'],
        '水': ['江', '河', '海', '湖', '溪', '泉', '波', '浪', '涛', '润', '泽', '洁', '清', '澄', '淳', '沐', '沛', '汇', '池', '潭', '瀚', '渊', '洋', '滨']
      };
      
      let chars = elementChars[element] || [];
      
      // 如果有常用字信息，优先使用常用字
      if (commonChars.size > 0) {
        const commonElementChars = chars.filter(char => commonChars.has(char));
        if (commonElementChars.length > 0) {
          chars = commonElementChars;
        }
      }
      
      // 根据性别进行调整
      if (gender === 'female') {
        // 女性偏好的字符
        const femalePreferred = chars.filter(char => 
          ['花', '芳', '芯', '茗', '茜', '莉', '菲', '萍', '蕾', '薇', '晴', '暖', '丹', '红', '洁', '清', '澄', '淳'].includes(char)
        );
        if (femalePreferred.length > 0) {
          chars = [...femalePreferred, ...chars.filter(char => !femalePreferred.includes(char))];
        }
      } else {
        // 男性偏好的字符
        const malePreferred = chars.filter(char => 
          ['杰', '松', '柏', '栋', '楠', '炎', '烁', '煜', '熠', '辉', '明', '昊', '坤', '城', '堡', '壮', '峰', '峻', '崇', '嵩', '鑫', '钢', '铁', '锋', '锐', '镇', '江', '河', '海', '瀚', '渊', '洋'].includes(char)
        );
        if (malePreferred.length > 0) {
          chars = [...malePreferred, ...chars.filter(char => !malePreferred.includes(char))];
        }
      }
      
      return chars.slice(0, 15); // 限制数量
    }

    /**
     * 生成需要避免的字符
     */
    private generateRestrictedChars(requiredElements: string[]): Set<string> {
      const restrictedChars = new Set<string>();
      
      // 根据五行相克原理，避免相克的字符
      const conflictMap: Record<string, string[]> = {
        '木': ['金'], // 金克木
        '火': ['水'], // 水克火
        '土': ['木'], // 木克土
        '金': ['火'], // 火克金
        '水': ['土']  // 土克水
      };
      
      for (const element of requiredElements) {
        const conflictElements = conflictMap[element] || [];
        for (const conflictElement of conflictElements) {
          const conflictChars = this.getCharactersByElement(conflictElement, 'neutral', new Set());
          conflictChars.forEach(char => restrictedChars.add(char));
        }
      }
      
      return restrictedChars;
    }
  }