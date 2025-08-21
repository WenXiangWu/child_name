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
    try {
      // 1. 加载主数据库 - final-enhanced-character-database.json
      await this.loadFinalEnhancedDatabase();
      
      // 2. 加载fallback数据库 - real-stroke-data.json
      await this.loadRealStrokeDatabase();
      
      // 3. 加载拼音数据库 - pinyin-processed.json  
      await this.loadPinyinDatabase();
      
      this.isInitialized = true;
      
    } catch (error) {
      throw error;
    }
  }

  /**
   * 加载主要字符数据库 - 从文件系统读取JSON文件
   */
  private async loadFinalEnhancedDatabase(): Promise<void> {
    try {
      // 使用动态import而不是require
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // 构建绝对路径
      const filePath = path.join(process.cwd(), 'public', 'data', 'characters', 'final-enhanced-character-database.json');
      
      // 检查文件是否存在
      try {
        await fs.access(filePath);
      } catch {
        throw new Error(`数据文件不存在: ${filePath}`);
      }
      
      // 读取并解析JSON文件
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      // 检查数据结构 - 如果有data属性则使用，否则直接使用根对象
      const data = jsonData.data || jsonData;
      this.databases.final_enhanced = new Map(Object.entries(data));

    } catch (error) {
      throw new Error(`无法加载字符数据库: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 加载笔画fallback数据库 - 从文件系统读取JSON文件
   */
  private async loadRealStrokeDatabase(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const filePath = path.join(process.cwd(), 'public', 'data', 'characters', 'real-stroke-data.json');
      
      try {
        await fs.access(filePath);
      } catch {
        throw new Error(`笔画数据文件不存在: ${filePath}`);
      }
      
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      // 检查数据结构 - 如果有data属性则使用，否则直接使用根对象
      const data = jsonData.data || jsonData;
      this.databases.real_stroke = new Map(Object.entries(data));

    } catch (error) {
      throw new Error(`无法加载笔画数据库: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 加载拼音fallback数据库 - 从文件系统读取JSON文件
   */
  private async loadPinyinDatabase(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const filePath = path.join(process.cwd(), 'public', 'data', 'configs', 'processed', 'pinyin-processed.json');
      
      try {
        await fs.access(filePath);
      } catch {
        throw new Error(`拼音数据文件不存在: ${filePath}`);
      }
      
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      // 检查数据结构 - 如果有data属性则使用，否则直接使用根对象
      const data = jsonData.data || jsonData;
      this.databases.pinyin_processed = new Map(Object.entries(data));

    } catch (error) {
      throw new Error(`无法加载拼音数据库: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 获取所有适合起名的字符
   * 从完整数据库中筛选出isStandard && isNamingRecommended的字符
   */
  async getAllNamingCharacters(): Promise<UnifiedCharacterInfo[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const namingCharacters: UnifiedCharacterInfo[] = [];
    let totalChars = 0;
    let standardChars = 0;
    let namingRecommendedChars = 0;
    let bothQualifiedChars = 0;
    let dataCompleteChars = 0;
    let fallbackSuccessChars = 0;
    
    try {
      console.log(`🔍 开始扫描字符数据库，主数据库大小: ${this.databases.final_enhanced.size}`);
      
      // 遍历主数据库中的所有字符
      for (const [char, data] of this.databases.final_enhanced) {
        totalChars++;
        
        try {
          // 统计标准字符
          if (data.isStandard) {
            standardChars++;
          }
          
          // 统计推荐起名字符 (使用实际存在的标准来判断)
          const isNamingRecommended = this.isCharacterSuitableForNaming(data);
          if (isNamingRecommended) {
            namingRecommendedChars++;
          }
          
          // 检查是否适合起名
          if (data.isStandard && isNamingRecommended) {
            bothQualifiedChars++;
            
            if (this.isDataComplete(data)) {
              // 数据完整，直接添加
              dataCompleteChars++;
              namingCharacters.push(this.formatCharacterInfo(data, [], 1.0));
            } else {
              // 数据不完整，尝试fallback合并
              const mergedData = await this.mergeWithFallback(char, data);
              const confidence = this.calculateConfidence(mergedData);
              
              // 只有合并后数据质量足够好才添加
              if (confidence >= 0.7) {
                fallbackSuccessChars++;
                namingCharacters.push(this.formatCharacterInfo(mergedData.data, mergedData.fallbackUsed, confidence));
              }
            }
          }
        } catch (error) {
          // 单个字符处理失败，跳过但不影响整体
          console.warn(`处理字符 ${char} 时出错:`, error);
        }
      }
      
      console.log(`📊 字符数据库统计:
        - 总字符数: ${totalChars}
        - 标准字符数: ${standardChars}  
        - 推荐起名字符数: ${namingRecommendedChars}
        - 同时满足两个条件的字符数: ${bothQualifiedChars}
        - 数据完整字符数: ${dataCompleteChars}
        - Fallback成功字符数: ${fallbackSuccessChars}
        - 最终适合起名字符数: ${namingCharacters.length}`);
      
      return namingCharacters;
      
    } catch (error) {
      console.error('获取起名字符列表失败:', error);
      throw new Error(`获取起名字符列表失败: ${error}`);
    }
  }

  /**
   * 获取字符信息 - 核心API
   * 严格按照文档的fallback机制实现
   */
  async getCharacterInfo(char: string): Promise<UnifiedCharacterInfo> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Step 1: 优先从主数据库获取
    const primaryData = this.databases.final_enhanced.get(char);
    
    if (primaryData && this.isDataComplete(primaryData)) {
      // 主数据库数据完整，直接返回
      return this.formatCharacterInfo(primaryData, [], 1.0);
    }

    // Step 2: 主数据库数据不完整或不存在，启用fallback机制
    
    const mergedData = await this.mergeWithFallback(char, primaryData);
    const confidence = this.calculateConfidence(mergedData);
    
    return this.formatCharacterInfo(mergedData.data, mergedData.fallbackUsed, confidence);
  }

  /**
   * 判断字符是否适合起名
   * 基于实际字符特征进行判断
   */
  private isCharacterSuitableForNaming(data: any): boolean {
    // 1. 必须是标准字符
    if (!data.isStandard) return false;
    
    // 2. 必须有基本的字符信息
    if (!data.char || !data.pinyin || !data.wuxing) return false;
    
    // 3. 排除一些不适合起名的字符
    const unsuitableChars = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '○', '〇'];
    if (unsuitableChars.includes(data.char)) return false;
    
    // 4. 排除单一笔画太少的字符（通常不适合起名）
    if (data.strokes?.traditional && data.strokes.traditional < 2) return false;
    
    // 5. 排除笔画过多的字符（实用性差）
    if (data.strokes?.traditional && data.strokes.traditional > 25) return false;
    
    // 6. 必须有含义
    if (!data.meanings || data.meanings.length === 0) return false;
    
    // 7. 排除一些特殊字符和标点
    const charCode = data.char.charCodeAt(0);
    if (charCode < 0x4E00 || charCode > 0x9FFF) return false; // 基本汉字范围
    
    return true;
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
        // 静默失败，继续处理其他字符
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
