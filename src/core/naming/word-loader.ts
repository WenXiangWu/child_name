/**
 * 汉字基础数据分片加载器
 * 处理26MB的word.json文件，实现按需加载和高效索引
 */
import { getStaticUrl } from '../../lib/config';

export interface WordRecord {
  word: string;
  oldword: string;
  strokes: string;
  pinyin: string;
  radicals: string;
  explanation: string;
  more?: string;
}

export interface WordIndex {
  meta: {
    total_records: number;
    chunk_size: number;
    num_chunks: number;
    version: string;
  };
  char_index: { [char: string]: number };  // 字符 -> 分片编号
  stroke_index: { [strokes: number]: string[] };  // 笔画数 -> 字符列表
  pinyin_index: { [letter: string]: string[] };   // 拼音首字母 -> 字符列表
}

export class WordDataLoader {
  private static instance: WordDataLoader;
  private index: WordIndex | null = null;
  private chunkCache: Map<number, WordRecord[]> = new Map();
  private maxCacheSize = 5; // 最多缓存5个分片

  private constructor() {}

  static getInstance(): WordDataLoader {
    if (!WordDataLoader.instance) {
      WordDataLoader.instance = new WordDataLoader();
    }
    return WordDataLoader.instance;
  }

  /**
   * 初始化索引
   */
  async initialize(): Promise<void> {
    if (this.index) return;

    try {
      const response = await fetch(getStaticUrl('configs/word-index.json'));
      this.index = await response.json();
      console.log(`汉字索引加载完成: ${this.index?.meta.total_records || 0}个字符`);
    } catch (error) {
      console.error('加载汉字索引失败:', error);
      throw error;
    }
  }

  /**
   * 加载指定分片
   */
  private async loadChunk(chunkIndex: number): Promise<WordRecord[]> {
    if (this.chunkCache.has(chunkIndex)) {
      return this.chunkCache.get(chunkIndex)!;
    }

    try {
              const response = await fetch(getStaticUrl(`configs/word-chunks/chunk-${chunkIndex.toString().padStart(3, '0')}.json`));
      const chunkData = await response.json();

      // 缓存管理
      if (this.chunkCache.size >= this.maxCacheSize) {
        const oldestKey = this.chunkCache.keys().next().value;
        if (oldestKey !== undefined) {
          this.chunkCache.delete(oldestKey);
        }
      }
      this.chunkCache.set(chunkIndex, chunkData);

      console.log(`加载分片 ${chunkIndex}: ${chunkData.length}条记录`);
      return chunkData;
    } catch (error) {
      console.error(`加载分片 ${chunkIndex} 失败:`, error);
      throw error;
    }
  }

  /**
   * 根据字符查找详细信息
   */
  async getCharacterInfo(char: string): Promise<WordRecord | null> {
    await this.initialize();
    
    if (!this.index || !this.index.char_index[char]) {
      return null;
    }

    const chunkIndex = this.index.char_index[char];
    const chunkData = await this.loadChunk(chunkIndex);
    
    return chunkData.find(record => record.word === char) || null;
  }

  /**
   * 根据笔画数查找字符列表
   */
  async getCharactersByStrokes(strokes: number): Promise<string[]> {
    await this.initialize();
    
    if (!this.index || !this.index.stroke_index[strokes]) {
      return [];
    }

    return this.index.stroke_index[strokes];
  }

  /**
   * 根据拼音首字母查找字符列表
   */
  async getCharactersByPinyinInitial(initial: string): Promise<string[]> {
    await this.initialize();
    
    if (!this.index || !this.index.pinyin_index[initial.toLowerCase()]) {
      return [];
    }

    return this.index.pinyin_index[initial.toLowerCase()];
  }

  /**
   * 批量获取字符信息
   */
  async getCharactersInfo(chars: string[]): Promise<Map<string, WordRecord>> {
    await this.initialize();
    
    const result = new Map<string, WordRecord>();
    const chunkGroups = new Map<number, string[]>();

    // 按分片分组
    for (const char of chars) {
      if (this.index && this.index.char_index[char] !== undefined) {
        const chunkIndex = this.index.char_index[char];
        if (!chunkGroups.has(chunkIndex)) {
          chunkGroups.set(chunkIndex, []);
        }
        chunkGroups.get(chunkIndex)!.push(char);
      }
    }

    // 批量加载分片
    for (const [chunkIndex, charsInChunk] of Array.from(chunkGroups.entries())) {
      const chunkData = await this.loadChunk(chunkIndex);
      for (const record of chunkData) {
        if (charsInChunk.includes(record.word)) {
          result.set(record.word, record);
        }
      }
    }

    return result;
  }

  /**
   * 高级搜索：根据多个条件筛选字符
   */
  async searchCharacters(options: {
    strokes?: number[];
    pinyinInitials?: string[];
    radicals?: string[];
    limit?: number;
  }): Promise<WordRecord[]> {
    await this.initialize();
    
    if (!this.index) return [];

    let candidates = new Set<string>();

    // 根据笔画筛选
    if (options.strokes && options.strokes.length > 0) {
      for (const stroke of options.strokes) {
        const chars = this.index.stroke_index[stroke] || [];
        chars.forEach(char => candidates.add(char));
      }
    }

    // 根据拼音首字母筛选
    if (options.pinyinInitials && options.pinyinInitials.length > 0) {
      const pinyinCandidates = new Set<string>();
      for (const initial of options.pinyinInitials) {
        const chars = this.index.pinyin_index[initial.toLowerCase()] || [];
        chars.forEach(char => pinyinCandidates.add(char));
      }
      
      if (candidates.size > 0) {
        // 求交集
        candidates = new Set(Array.from(candidates).filter(char => pinyinCandidates.has(char)));
      } else {
        candidates = pinyinCandidates;
      }
    }

    // 如果没有任何筛选条件，返回空数组
    if (candidates.size === 0 && !options.strokes && !options.pinyinInitials) {
      return [];
    }

    // 获取详细信息
    const candidatesList = Array.from(candidates);
    const limit = options.limit || 100;
    const limitedCandidates = candidatesList.slice(0, limit);
    
    const detailedInfo = await this.getCharactersInfo(limitedCandidates);
    
    const results: WordRecord[] = [];
    for (const char of limitedCandidates) {
      const info = detailedInfo.get(char);
      if (info) {
        // 可以在这里添加部首筛选
        if (!options.radicals || options.radicals.length === 0 || 
            options.radicals.includes(info.radicals)) {
          results.push(info);
        }
      }
    }

    return results;
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    totalRecords: number;
    numChunks: number;
    chunkSize: number;
    cacheSize: number;
    strokeRange: [number, number];
    pinyinInitials: string[];
  } | null {
    if (!this.index) return null;

    const strokes = Object.keys(this.index.stroke_index).map(Number);
    const strokeRange: [number, number] = [Math.min(...strokes), Math.max(...strokes)];

    return {
      totalRecords: this.index.meta.total_records,
      numChunks: this.index.meta.num_chunks,
      chunkSize: this.index.meta.chunk_size,
      cacheSize: this.chunkCache.size,
      strokeRange,
      pinyinInitials: Object.keys(this.index.pinyin_index).sort()
    };
  }

  /**
   * 清空缓存
   */
  clearCache(): void {
    this.chunkCache.clear();
    console.log('汉字数据缓存已清空');
  }
}