/**
 * 统一字符数据加载器
 * 基于通用规范汉字表的统一字符数据库
 */

import { getStaticUrl } from '../config';
import { WuxingElement } from './types';

export interface UnifiedCharacterInfo {
  char: string;
  pinyin: string[];
  primaryPinyin: string;
  tone: number;
  strokes: {
    simplified: number;
    traditional: number;
    kangxi?: number;
  };
  radical: string;
  wuxing: WuxingElement;
  traditional?: string;
  simplified?: string;
  meanings: string[];
  isStandard: boolean;
  sources: string[];
}

export interface UnifiedCharacterDatabase {
  meta: {
    version: string;
    createdAt: string;
    source: string;
    description: string;
    totalCharacters: number;
  };
  statistics: {
    totalCharacters: number;
    fieldCompleteness: Record<string, { count: number; percentage: string }>;
    wuxingDistribution: Record<string, number>;
    toneDistribution: Record<string, number>;
    sources: Record<string, number>;
  };
  data: Record<string, UnifiedCharacterInfo>;
}

export class UnifiedCharacterLoader {
  private static instance: UnifiedCharacterLoader;
  private database: UnifiedCharacterDatabase | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): UnifiedCharacterLoader {
    if (!UnifiedCharacterLoader.instance) {
      UnifiedCharacterLoader.instance = new UnifiedCharacterLoader();
    }
    return UnifiedCharacterLoader.instance;
  }

  /**
   * 初始化统一字符数据库
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🚀 开始初始化统一字符数据库...');
      
      const response = await fetch(getStaticUrl('unified-character-database.min.json'));
      
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }

      this.database = await response.json();
      this.initialized = true;
      
      console.log(`✅ 统一字符数据库初始化完成:`);
      console.log(`  • 总字符数: ${this.database.meta.totalCharacters}`);
      console.log(`  • 数据完整性: 拼音${this.database.statistics.fieldCompleteness.pinyin.percentage}, 五行${this.database.statistics.fieldCompleteness.wuxing.percentage}`);
      
    } catch (error) {
      console.error('❌ 统一字符数据库初始化失败:', error);
      throw error;
    }
  }

  /**
   * 获取字符信息
   */
  getCharacterInfo(char: string): UnifiedCharacterInfo | null {
    if (!this.database || !this.database.data[char]) {
      return null;
    }
    return this.database.data[char];
  }

  /**
   * 批量获取字符信息
   */
  getCharactersInfo(chars: string[]): Map<string, UnifiedCharacterInfo> {
    const result = new Map<string, UnifiedCharacterInfo>();
    
    if (!this.database) return result;

    for (const char of chars) {
      const info = this.database.data[char];
      if (info) {
        result.set(char, info);
      }
    }

    return result;
  }

  /**
   * 根据笔画和五行获取字符列表
   */
  getCharactersByStrokeAndWuxing(strokes: number, wuxing: WuxingElement, useTraditional: boolean = false): string[] {
    if (!this.database) return [];

    const candidates: string[] = [];
    
    for (const [char, info] of Object.entries(this.database.data)) {
      const targetStrokes = useTraditional ? info.strokes.traditional : info.strokes.simplified;
      
      if (targetStrokes === strokes && info.wuxing === wuxing) {
        candidates.push(char);
      }
    }

    console.log(`查找 ${wuxing} 行 ${strokes} 笔画的字，找到 ${candidates.length} 个候选字`);
    
    return candidates;
  }

  /**
   * 根据五行获取所有字符
   */
  getCharactersByWuxing(wuxing: WuxingElement): string[] {
    if (!this.database) return [];

    const candidates: string[] = [];
    
    for (const [char, info] of Object.entries(this.database.data)) {
      if (info.wuxing === wuxing) {
        candidates.push(char);
      }
    }

    return candidates;
  }

  /**
   * 根据声调获取字符列表
   */
  getCharactersByTone(tone: number): string[] {
    if (!this.database) return [];

    const candidates: string[] = [];
    
    for (const [char, info] of Object.entries(this.database.data)) {
      if (info.tone === tone) {
        candidates.push(char);
      }
    }

    return candidates;
  }

  /**
   * 搜索字符
   */
  searchCharacters(options: {
    wuxing?: WuxingElement;
    tone?: number;
    minStrokes?: number;
    maxStrokes?: number;
    useTraditional?: boolean;
    radical?: string;
    pinyin?: string;
  }): string[] {
    if (!this.database) return [];

    const candidates: string[] = [];
    
    for (const [char, info] of Object.entries(this.database.data)) {
      // 五行筛选
      if (options.wuxing && info.wuxing !== options.wuxing) continue;
      
      // 声调筛选
      if (options.tone !== undefined && info.tone !== options.tone) continue;
      
      // 笔画筛选
      const targetStrokes = options.useTraditional ? info.strokes.traditional : info.strokes.simplified;
      if (options.minStrokes && targetStrokes < options.minStrokes) continue;
      if (options.maxStrokes && targetStrokes > options.maxStrokes) continue;
      
      // 部首筛选
      if (options.radical && info.radical !== options.radical) continue;
      
      // 拼音筛选
      if (options.pinyin && !info.pinyin.some(p => p.includes(options.pinyin!))) continue;
      
      candidates.push(char);
    }

    return candidates;
  }

  /**
   * 验证字符是否在数据库中
   */
  isValidCharacter(char: string): boolean {
    return !!(this.database && this.database.data[char]);
  }

  /**
   * 获取字符的拼音
   */
  getCharacterPinyin(char: string): string[] {
    const info = this.getCharacterInfo(char);
    return info ? info.pinyin : [];
  }

  /**
   * 获取字符的五行属性
   */
  getCharacterWuxing(char: string): WuxingElement | null {
    const info = this.getCharacterInfo(char);
    return info ? info.wuxing : null;
  }

  /**
   * 获取字符的笔画数
   */
  getCharacterStrokes(char: string, useTraditional: boolean = false): number {
    const info = this.getCharacterInfo(char);
    if (!info) return 0;
    
    return useTraditional ? info.strokes.traditional : info.strokes.simplified;
  }

  /**
   * 获取字符的声调
   */
  getCharacterTone(char: string): number {
    const info = this.getCharacterInfo(char);
    return info ? info.tone : 0;
  }

  /**
   * 获取数据库统计信息
   */
  getStatistics() {
    return this.database?.statistics || null;
  }

  /**
   * 获取数据库元信息
   */
  getMeta() {
    return this.database?.meta || null;
  }

  /**
   * 获取所有标准字符
   */
  getAllStandardCharacters(): string[] {
    if (!this.database) return [];
    
    return Object.keys(this.database.data).filter(char => 
      this.database!.data[char].isStandard
    );
  }

  /**
   * 根据常用度筛选字符（基于数据源数量）
   */
  getCommonCharacters(minSources: number = 2): string[] {
    if (!this.database) return [];

    const candidates: string[] = [];
    
    for (const [char, info] of Object.entries(this.database.data)) {
      if (info.sources.length >= minSources) {
        candidates.push(char);
      }
    }

    return candidates;
  }

  /**
   * 分析字符数据质量
   */
  analyzeDataQuality(): {
    totalCharacters: number;
    completeCharacters: number;
    incompleteCharacters: string[];
    qualityScore: number;
  } {
    if (!this.database) {
      return {
        totalCharacters: 0,
        completeCharacters: 0,
        incompleteCharacters: [],
        qualityScore: 0
      };
    }

    const incompleteCharacters: string[] = [];
    let completeCount = 0;

    for (const [char, info] of Object.entries(this.database.data)) {
      const isComplete = !!(
        info.primaryPinyin &&
        info.tone > 0 &&
        info.strokes.simplified > 0 &&
        info.radical &&
        info.wuxing
      );

      if (isComplete) {
        completeCount++;
      } else {
        incompleteCharacters.push(char);
      }
    }

    const totalCharacters = Object.keys(this.database.data).length;
    const qualityScore = totalCharacters > 0 ? (completeCount / totalCharacters) * 100 : 0;

    return {
      totalCharacters,
      completeCharacters: completeCount,
      incompleteCharacters,
      qualityScore: Math.round(qualityScore * 100) / 100
    };
  }

  /**
   * 清理缓存
   */
  clearCache(): void {
    this.database = null;
    this.initialized = false;
  }
}
