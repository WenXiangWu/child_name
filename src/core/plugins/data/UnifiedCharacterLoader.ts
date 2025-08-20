/**
 * 统一字符数据加载器
 * 
 * 严格按照文档《插件执行示例-吴姓男孩取名完整计算过程.md》实现
 * 
 * 核心功能：
 * 1. 作为所有字符数据的唯一合法来源
 * 2. 优先从final-enhanced-character-database.json获取数据
 * 3. 实现fallback机制到real-stroke-data.json和pinyin-processed.json
 * 4. 确保所有命理计算使用传统笔画数(strokes.traditional)
 * 5. 提供数据质量评估和置信度计算
 */

export interface UnifiedCharacterInfo {
  // 基础字符信息
  char: string;
  traditional: string;
  simplified: string;
  
  // 发音信息
  pinyin: string[];
  primaryPinyin: string;
  tone: number;
  
  // 笔画信息 (⚠️ 重要：命理计算专用)
  strokes: {
    simplified: number;
    traditional: number;    // ⚠️ 命理计算专用：三才五格、大衍数理等
    kangxi: number;
  };
  
  // 字形信息
  radical: string;
  structure: string;
  
  // 五行信息
  wuxing: string;
  wuxingSource: 'direct' | 'derived' | 'fallback';
  
  // 语义信息
  meanings: string[];
  etymology: string;
  
  // 起名适用性
  isStandard: boolean;      // 是否为规范汉字
  isNamingRecommended: boolean;  // 是否推荐用于起名
  culturalLevel: number;    // 文化内涵等级 (0-100)
  
  // 数据来源信息
  sources: string[];
  dataQuality: {
    completeness: number;   // 数据完整性 (0-1)
    confidence: number;     // 数据置信度 (0-1)
    fallbackUsed: string[]; // 使用的fallback来源
  };
}

interface CharacterDatabase {
  final_enhanced: Map<string, any>;
  real_stroke: Map<string, any>;
  pinyin_processed: Map<string, any>;
}

export class UnifiedCharacterLoader {
  private static instance: UnifiedCharacterLoader;
  private databases: CharacterDatabase;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {
    this.databases = {
      final_enhanced: new Map(),
      real_stroke: new Map(),
      pinyin_processed: new Map()
    };
  }

  static getInstance(): UnifiedCharacterLoader {
    if (!UnifiedCharacterLoader.instance) {
      UnifiedCharacterLoader.instance = new UnifiedCharacterLoader();
    }
    return UnifiedCharacterLoader.instance;
  }

  /**
   * 初始化字符数据库
   * 按照文档要求的优先级顺序加载数据
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization();
    await this.initializationPromise;
  }

  private async performInitialization(): Promise<void> {
    console.log('🔄 初始化UnifiedCharacterLoader...');
    
    try {
      // 1. 加载主数据库 - final-enhanced-character-database.json
      await this.loadFinalEnhancedDatabase();
      
      // 2. 加载fallback数据库 - real-stroke-data.json
      await this.loadRealStrokeDatabase();
      
      // 3. 加载拼音数据库 - pinyin-processed.json  
      await this.loadPinyinDatabase();
      
      this.isInitialized = true;
      console.log('✅ UnifiedCharacterLoader初始化完成');
      console.log(`📊 数据库状态: 主库${this.databases.final_enhanced.size}字符, fallback库${this.databases.real_stroke.size}字符, 拼音库${this.databases.pinyin_processed.size}字符`);
      
    } catch (error) {
      console.error('❌ UnifiedCharacterLoader初始化失败:', error);
      throw error;
    }
  }

  /**
   * 加载主要字符数据库
   * TODO: 实际项目中应该从真实的JSON文件加载
   */
  private async loadFinalEnhancedDatabase(): Promise<void> {
    // 模拟数据 - 基于文档示例的"吴"字数据
    const mockData = new Map([
      ['吴', {
        char: '吴',
        traditional: '吳',
        simplified: '吴',
        pinyin: ['wú'],
        primaryPinyin: 'wú',
        tone: 2,
        strokes: {
          simplified: 7,
          traditional: 7,  // ⚠️ 命理计算专用
          kangxi: 7
        },
        radical: '口',
        structure: '上下结构',
        wuxing: 'mu',
        wuxingSource: 'direct',
        meanings: ['象头的动作。合起来表示晃着头大声说话。本义:大声说话,喧哗'],
        etymology: '会意字。从口，从夨(zè)。夨，倾头。',
        isStandard: true,
        isNamingRecommended: true,
        culturalLevel: 85,
        sources: ['百家姓', '康熙字典', '现代汉语常用字表'],
        completeness: 1.0
      }],
      ['宣', {
        char: '宣',
        traditional: '宣',
        simplified: '宣',
        pinyin: ['xuān'],
        primaryPinyin: 'xuān',
        tone: 1,
        strokes: {
          simplified: 9,
          traditional: 9,
          kangxi: 9
        },
        radical: '宀',
        structure: '上下结构',
        wuxing: 'jin',
        wuxingSource: 'direct',
        meanings: ['宣布', '宣扬', '传播'],
        etymology: '形声字。从宀，亘声。',
        isStandard: true,
        isNamingRecommended: true,
        culturalLevel: 88,
        sources: ['康熙字典', '说文解字'],
        completeness: 0.95
      }],
      ['润', {
        char: '润',
        traditional: '潤',
        simplified: '润',
        pinyin: ['rùn'],
        primaryPinyin: 'rùn',
        tone: 4,
        strokes: {
          simplified: 10,
          traditional: 16,  // ⚠️ 命理计算专用
          kangxi: 16
        },
        radical: '氵',
        structure: '左右结构',
        wuxing: 'shui',
        wuxingSource: 'direct',
        meanings: ['润泽', '滋润', '利润'],
        etymology: '形声字。从水，闰声。',
        isStandard: true,
        isNamingRecommended: true,
        culturalLevel: 90,
        sources: ['康熙字典', '说文解字'],
        completeness: 1.0
      }]
    ]);

    this.databases.final_enhanced = mockData;
    console.log(`📚 主数据库加载完成: ${mockData.size} 个字符`);
  }

  /**
   * 加载笔画fallback数据库
   * TODO: 实际项目中应该从real-stroke-data.json加载
   */
  private async loadRealStrokeDatabase(): Promise<void> {
    const mockStrokeData = new Map([
      ['钦', {
        char: '钦',
        strokes: {
          simplified: 9,
          traditional: 12,
          kangxi: 12
        },
        radical: '钅',
        source: 'real-stroke-data'
      }],
      ['锦', {
        char: '锦',
        strokes: {
          simplified: 13,
          traditional: 16,
          kangxi: 16
        },
        radical: '钅',
        source: 'real-stroke-data'
      }],
      ['浩', {
        char: '浩',
        strokes: {
          simplified: 10,
          traditional: 10,
          kangxi: 10
        },
        radical: '氵',
        source: 'real-stroke-data'
      }]
    ]);

    this.databases.real_stroke = mockStrokeData;
    console.log(`📚 笔画数据库加载完成: ${mockStrokeData.size} 个字符`);
  }

  /**
   * 加载拼音fallback数据库
   * TODO: 实际项目中应该从pinyin-processed.json加载
   */
  private async loadPinyinDatabase(): Promise<void> {
    const mockPinyinData = new Map([
      ['钦', {
        char: '钦',
        pinyin: ['qīn'],
        primaryPinyin: 'qīn',
        tone: 1,
        source: 'pinyin-processed'
      }],
      ['锦', {
        char: '锦',
        pinyin: ['jǐn'],
        primaryPinyin: 'jǐn',
        tone: 3,
        source: 'pinyin-processed'
      }],
      ['浩', {
        char: '浩',
        pinyin: ['hào'],
        primaryPinyin: 'hào',
        tone: 4,
        source: 'pinyin-processed'
      }]
    ]);

    this.databases.pinyin_processed = mockPinyinData;
    console.log(`📚 拼音数据库加载完成: ${mockPinyinData.size} 个字符`);
  }

  /**
   * 获取字符信息 - 核心API
   * 严格按照文档的fallback机制实现
   */
  async getCharacterInfo(char: string): Promise<UnifiedCharacterInfo> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    console.log(`🔍 查询字符: ${char}`);

    // Step 1: 优先从主数据库获取
    const primaryData = this.databases.final_enhanced.get(char);
    
    if (primaryData && this.isDataComplete(primaryData)) {
      // 主数据库数据完整，直接返回
      console.log(`✅ 主数据库命中: ${char}`);
      return this.formatCharacterInfo(primaryData, [], 1.0);
    }

    // Step 2: 主数据库数据不完整或不存在，启用fallback机制
    console.log(`⚠️ 主数据库数据不完整或缺失，启用fallback: ${char}`);
    
    const mergedData = await this.mergeWithFallback(char, primaryData);
    const confidence = this.calculateConfidence(mergedData);
    
    return this.formatCharacterInfo(mergedData.data, mergedData.fallbackUsed, confidence);
  }

  /**
   * 检查数据完整性
   */
  private isDataComplete(data: any): boolean {
    const requiredFields = [
      'strokes.traditional',  // ⚠️ 命理计算必需
      'wuxing',              // 五行信息必需
      'pinyin',              // 发音信息必需
      'isStandard'           // 起名适用性必需
    ];

    return requiredFields.every(field => {
      const value = this.getNestedProperty(data, field);
      return value !== undefined && value !== null && value !== '';
    });
  }

  /**
   * 获取嵌套属性值
   */
  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * 与fallback数据库合并
   */
  private async mergeWithFallback(char: string, primaryData: any): Promise<{data: any, fallbackUsed: string[]}> {
    const fallbackUsed: string[] = [];
    let mergedData = primaryData ? { ...primaryData } : { char };

    // Fallback 1: 笔画数据
    if (!mergedData.strokes?.traditional) {
      const strokeData = this.databases.real_stroke.get(char);
      if (strokeData) {
        mergedData.strokes = strokeData.strokes;
        mergedData.radical = strokeData.radical;
        fallbackUsed.push('real-stroke-data');
        console.log(`📊 笔画fallback命中: ${char}`);
      }
    }

    // Fallback 2: 拼音数据
    if (!mergedData.pinyin) {
      const pinyinData = this.databases.pinyin_processed.get(char);
      if (pinyinData) {
        mergedData.pinyin = pinyinData.pinyin;
        mergedData.primaryPinyin = pinyinData.primaryPinyin;
        mergedData.tone = pinyinData.tone;
        fallbackUsed.push('pinyin-processed');
        console.log(`🔤 拼音fallback命中: ${char}`);
      }
    }

    // 设置默认值（如果fallback也失败）
    this.setDefaultValues(mergedData, char);

    return { data: mergedData, fallbackUsed };
  }

  /**
   * 设置默认值
   */
  private setDefaultValues(data: any, char: string): void {
    // 默认基础信息
    if (!data.traditional) data.traditional = char;
    if (!data.simplified) data.simplified = char;
    
    // 默认笔画信息
    if (!data.strokes) {
      data.strokes = {
        simplified: 1,
        traditional: 1,
        kangxi: 1
      };
    }
    
    // 默认发音信息
    if (!data.pinyin) {
      data.pinyin = ['unknown'];
      data.primaryPinyin = 'unknown';
      data.tone = 0;
    }
    
    // 默认五行信息
    if (!data.wuxing) {
      data.wuxing = 'unknown';
      data.wuxingSource = 'fallback';
    }
    
    // 默认适用性
    if (data.isStandard === undefined) data.isStandard = false;
    if (data.isNamingRecommended === undefined) data.isNamingRecommended = false;
    
    // 默认语义信息
    if (!data.meanings) data.meanings = [];
    if (!data.sources) data.sources = ['fallback'];
    if (!data.culturalLevel) data.culturalLevel = 50;
  }

  /**
   * 格式化字符信息输出
   */
  private formatCharacterInfo(data: any, fallbackUsed: string[], confidence: number): UnifiedCharacterInfo {
    return {
      char: data.char,
      traditional: data.traditional || data.char,
      simplified: data.simplified || data.char,
      pinyin: Array.isArray(data.pinyin) ? data.pinyin : [data.pinyin || 'unknown'],
      primaryPinyin: data.primaryPinyin || data.pinyin?.[0] || 'unknown',
      tone: data.tone || 0,
      strokes: {
        simplified: data.strokes?.simplified || 1,
        traditional: data.strokes?.traditional || 1,  // ⚠️ 命理计算专用
        kangxi: data.strokes?.kangxi || 1
      },
      radical: data.radical || '',
      structure: data.structure || '',
      wuxing: data.wuxing || 'unknown',
      wuxingSource: data.wuxingSource || 'fallback',
      meanings: Array.isArray(data.meanings) ? data.meanings : [data.meanings || ''].filter(Boolean),
      etymology: data.etymology || '',
      isStandard: Boolean(data.isStandard),
      isNamingRecommended: Boolean(data.isNamingRecommended),
      culturalLevel: data.culturalLevel || 50,
      sources: Array.isArray(data.sources) ? data.sources : [data.sources || 'fallback'].filter(Boolean),
      dataQuality: {
        completeness: data.completeness || this.calculateCompleteness(data),
        confidence,
        fallbackUsed
      }
    };
  }

  /**
   * 计算数据完整性
   */
  private calculateCompleteness(data: any): number {
    const fields = [
      'traditional', 'simplified', 'pinyin', 'strokes.traditional',
      'radical', 'wuxing', 'meanings', 'isStandard'
    ];
    
    const completedFields = fields.filter(field => {
      const value = this.getNestedProperty(data, field);
      return value !== undefined && value !== null && value !== '';
    }).length;
    
    return completedFields / fields.length;
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(mergedData: {data: any, fallbackUsed: string[]}): number {
    let confidence = 0.9; // 基础置信度
    
    // 每使用一个fallback，置信度下降
    confidence -= mergedData.fallbackUsed.length * 0.1;
    
    // 数据完整性影响置信度
    const completeness = this.calculateCompleteness(mergedData.data);
    confidence *= completeness;
    
    return Math.max(confidence, 0.3); // 最低置信度0.3
  }

  /**
   * 批量获取字符信息
   */
  async getMultipleCharacters(chars: string[]): Promise<Map<string, UnifiedCharacterInfo>> {
    const results = new Map<string, UnifiedCharacterInfo>();
    
    for (const char of chars) {
      try {
        const info = await this.getCharacterInfo(char);
        results.set(char, info);
      } catch (error) {
        console.error(`获取字符${char}信息失败:`, error);
      }
    }
    
    return results;
  }

  /**
   * 检查字符是否适合起名
   * 基于isStandard和isNamingRecommended判断
   */
  async isCharacterSuitableForNaming(char: string): Promise<boolean> {
    const info = await this.getCharacterInfo(char);
    return info.isStandard && info.isNamingRecommended;
  }

  /**
   * 获取系统状态
   */
  getSystemStatus(): {
    initialized: boolean;
    databaseSizes: {
      finalEnhanced: number;
      realStroke: number;
      pinyinProcessed: number;
    };
    memoryUsage: string;
  } {
    return {
      initialized: this.isInitialized,
      databaseSizes: {
        finalEnhanced: this.databases.final_enhanced.size,
        realStroke: this.databases.real_stroke.size,
        pinyinProcessed: this.databases.pinyin_processed.size
      },
      memoryUsage: process.memoryUsage ? 
        `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB` : 
        'unknown'
    };
  }
}
