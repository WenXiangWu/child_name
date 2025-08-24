/**
 * 诗词取名引擎
 * 复制并适配gushi_namer的Namer类核心逻辑
 */

import { PoetryEntry, PoetryNameResult, PoetryNamingConfig, PoetryBook, getRecommendedBooks, CommonCharData, Dynasty } from './types';
import { TextProcessor } from './text-processor';
import { choose, between } from './random';

export class PoetryNamer {
  private textProcessor: TextProcessor;
  private loadedBooks: Map<PoetryBook, PoetryEntry[]> = new Map();
  private loading: boolean = false;
  private commonChars: Map<'male' | 'female', Set<string>> = new Map();

  constructor() {
    this.textProcessor = new TextProcessor();
  }

  /**
   * 加载常用字数据
   */
  private async loadCommonChars(gender: 'male' | 'female'): Promise<Set<string>> {
    if (this.commonChars.has(gender)) {
      return this.commonChars.get(gender)!;
    }

    try {
      console.log(`📚 开始加载${gender === 'male' ? '男性' : '女性'}常用字...`);
      
      let data: CommonCharData;
      const fileName = `common-chars-${gender}.json`;

      if (typeof window !== 'undefined') {
        // 客户端：使用相对路径
        const response = await fetch(`/data/configs/processed/${fileName}`);
        if (!response.ok) {
          throw new Error(`Failed to load common chars: ${response.statusText}`);
        }
        data = await response.json();
      } else {
        // 服务端：使用文件系统读取
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'public', 'data', 'configs', 'processed', fileName);
        
        if (!fs.existsSync(filePath)) {
          throw new Error(`Common chars file not found: ${filePath}`);
        }
        
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        data = JSON.parse(fileContent);
      }

      // 转换为Set用于快速查找
      const charSet = new Set(data.data.map(item => item.char));
      this.commonChars.set(gender, charSet);
      
      console.log(`✅ ${gender === 'male' ? '男性' : '女性'}常用字加载完成，共 ${charSet.size} 个字`);
      return charSet;
    } catch (error) {
      console.error(`❌ 加载${gender === 'male' ? '男性' : '女性'}常用字失败:`, error);
      throw error;
    }
  }

  /**
   * 获取诗词文件路径映射
   */
  private getPoetryFilePath(book: PoetryBook): string {
    const pathMap: Record<PoetryBook, string> = {
      'shijing': 'chinese-poetry/诗经/shijing.json',
      'chuci': 'chinese-poetry/楚辞/chuci.json', 
      'tangshi': 'chinese-poetry/全唐诗/唐诗三百首.json',
      'songci': 'chinese-poetry/宋词/宋词三百首.json',
      'yuefu': 'chinese-poetry/蒙学/qianjiashi.json', // 使用千家诗作为乐府替代
      'gushi': 'chinese-poetry/蒙学/tangshisanbaishou.json', // 使用唐诗三百首
      'cifu': 'chinese-poetry/四书五经/mengzi.json' // 使用孟子作为辞赋替代
    };
    
    return pathMap[book] || `chinese-poetry/${book}.json`;
  }

  /**
   * 转换原始诗词数据为标准格式
   */
  private convertToStandardFormat(rawData: any, book: PoetryBook): PoetryEntry[] {
    const results: PoetryEntry[] = [];
    let items: any[] = [];
    
    // 处理不同的数据结构
    if (Array.isArray(rawData)) {
      items = rawData;
    } else if (rawData.content && Array.isArray(rawData.content)) {
      // 处理蒙学类的嵌套结构
      for (const section of rawData.content) {
        if (section.content && Array.isArray(section.content)) {
          items.push(...section.content);
        }
      }
    } else {
      console.warn('未知的数据格式:', rawData);
      return results;
    }
    
    for (const item of items) {
      try {
        let content = '';
        let title = item.title || item.chapter || '无题';
        let author = item.author || null;
        let dynasty = this.getDynastyByBook(book);
        
        // 处理不同的content格式
        if (Array.isArray(item.content)) {
          content = item.content.join('');
        } else if (typeof item.content === 'string') {
          content = item.content;
        } else if (item.paragraphs && Array.isArray(item.paragraphs)) {
          content = item.paragraphs.join('');
        } else if (item.strains && Array.isArray(item.strains)) {
          content = item.strains.join('');
        }
        
        // 过滤掉内容太短的条目
        if (content && content.length > 10) {
          results.push({
            content,
            title,
            author,
            book,
            dynasty
          });
        }
      } catch (error) {
        console.warn(`处理诗词条目时出错:`, error, item);
      }
    }
    
    return results;
  }

  /**
   * 根据典籍获取朝代
   */
  private getDynastyByBook(book: PoetryBook): Dynasty {
    const dynastyMap: Record<PoetryBook, Dynasty> = {
      'shijing': '先秦',
      'chuci': '先秦',
      'tangshi': '唐代',
      'songci': '宋代',
      'yuefu': '汉魏六朝',
      'gushi': '多朝代',
      'cifu': '多朝代'
    };
    
    return dynastyMap[book] || '多朝代';
  }

  /**
   * 加载诗词典籍数据
   * 适配chinese-poetry目录结构
   */
  async loadBook(book: PoetryBook): Promise<PoetryEntry[]> {
    // 如果已经加载过，直接返回缓存数据
    if (this.loadedBooks.has(book)) {
      return this.loadedBooks.get(book)!;
    }

    try {
      this.loading = true;
      console.log(`📚 开始加载诗词典籍: ${book}`);
      
      const filePath = this.getPoetryFilePath(book);
      let rawData: any;
      
      if (typeof window !== 'undefined') {
        // 客户端：使用相对路径
        const response = await fetch(`/data/poetry/${filePath}`);
        if (!response.ok) {
          throw new Error(`Failed to load ${book}: ${response.statusText}`);
        }
        rawData = await response.json();
      } else {
        // 服务端：使用文件系统读取
        const fs = await import('fs');
        const path = await import('path');
        const fullPath = path.join(process.cwd(), 'public', 'data', 'poetry', filePath);
        
        if (!fs.existsSync(fullPath)) {
          throw new Error(`Poetry file not found: ${fullPath}`);
        }
        
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        rawData = JSON.parse(fileContent);
      }
      
      // 转换为标准格式
      const data = this.convertToStandardFormat(rawData, book);
      
      console.log(`✅ ${book} 加载完成，共 ${data.length} 篇作品`);
      
      // 缓存数据
      this.loadedBooks.set(book, data);
      return data;
    } catch (error) {
      console.error(`❌ 加载诗词典籍失败: ${book}`, error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * 生成两字名字
   * 复制自gushi_namer的getTwoChar方法
   */
  private getTwoChar(charArray: string[]): string {
    const len = charArray.length;
    if (len < 2) {
      throw new Error('字符数组长度不足以生成名字');
    }

    const first = between(0, len);
    let second = between(0, len);
    
    // 确保两个字符不相同，避免重复字符
    let attempts = 0;
    while (second === first && attempts < 100) {
      second = between(0, len);
      attempts++;
    }
    
    // 如果尝试100次仍然相同，说明可选字符太少，随机选择
    if (attempts >= 100) {
      second = (first + 1) % len;
    }
    
    // 按位置顺序排列，保持诗文中的原始顺序
    return first <= second ? 
      `${charArray[first]}${charArray[second]}` : 
      `${charArray[second]}${charArray[first]}`;
  }

  /**
   * 从单篇诗文生成名字
   * 复制自gushi_namer的genName方法核心逻辑
   */
  private generateNameFromPoetry(
    poetry: PoetryEntry, 
    familyName: string, 
    avoidedWords: string[] = [],
    commonCharsSet: Set<string> | null = null
  ): PoetryNameResult | null {
    try {
      const { content, title, author, book, dynasty } = poetry;
      
      if (!content) {
        return null;
      }

      // 1. 分割句子
      const sentences = this.textProcessor.splitSentence(content);
      if (sentences.length === 0) {
        return null;
      }

      // 2. 随机选择一个句子
      const sentence = choose(sentences);

      // 3. 处理句子，获取可用字符
      const characters = this.textProcessor.processSentence(sentence);
      if (characters.length <= 2) {
        return null;
      }

      // 4. 过滤避免使用的字符和非常用字
      const filteredCharacters = characters.filter(char => {
        // 检查是否在避免字符列表中
        if (avoidedWords.includes(char)) {
          return false;
        }
        
        // 如果启用了常用字过滤，检查是否在常用字集合中
        if (commonCharsSet && !commonCharsSet.has(char)) {
          return false;
        }
        
        return true;
      });
      
      if (filteredCharacters.length <= 2) {
        return null;
      }

      // 5. 生成两字名字
      const name = this.getTwoChar(filteredCharacters);
      const fullName = familyName + name;

      // 6. 生成高亮句子
      const highlightedSentence = this.textProcessor.highlightNameInSentence(sentence, name);

      return {
        name,
        fullName,
        familyName,
        sentence,
        content,
        title,
        author,
        book,
        dynasty,
        highlightedSentence
      };
    } catch (error) {
      console.warn('生成名字时出错:', error);
      return null;
    }
  }

  /**
   * 生成诗词名字 - 主要接口
   * 复制并扩展gushi_namer的核心逻辑
   */
  async generateNames(config: PoetryNamingConfig): Promise<PoetryNameResult[]> {
    console.log('🎨 开始生成诗词名字，配置:', config);
    
    const { 
      familyName, 
      gender, 
      books = getRecommendedBooks(gender), 
      nameCount = 6,
      avoidedWords = [],
      useCommonChars = true
    } = config;

    const results: PoetryNameResult[] = [];
    const maxAttempts = nameCount * 10; // 最多尝试10倍数量
    let attempts = 0;

    // 加载常用字数据（如果启用）
    let commonCharsSet: Set<string> | null = null;
    if (useCommonChars) {
      commonCharsSet = await this.loadCommonChars(gender);
    }

    // 加载所有需要的典籍
    const loadPromises = books.map(book => this.loadBook(book));
    const loadedBooksData = await Promise.all(loadPromises);
    
    // 合并所有诗词数据
    const allPoetries: PoetryEntry[] = [];
    loadedBooksData.forEach(bookData => {
      allPoetries.push(...bookData);
    });

    console.log(`📖 总共加载 ${allPoetries.length} 篇诗文`);

    // 生成名字，直到达到目标数量或尝试次数上限
    while (results.length < nameCount && attempts < maxAttempts) {
      attempts++;
      
      // 随机选择一篇诗文
      const randomPoetry = choose(allPoetries);
      
      // 尝试从这篇诗文生成名字
      const nameResult = this.generateNameFromPoetry(
        randomPoetry, 
        familyName, 
        avoidedWords,
        commonCharsSet
      );
      
      if (nameResult) {
        // 检查是否已经生成过相同的名字
        const isDuplicate = results.some(existing => 
          existing.name === nameResult.name
        );
        
        if (!isDuplicate) {
          results.push(nameResult);
          console.log(`✨ 生成名字 ${results.length}/${nameCount}: ${nameResult.fullName} (来自《${nameResult.title}》)`);
        }
      }
    }

    console.log(`🎭 诗词取名完成，共生成 ${results.length} 个名字，尝试了 ${attempts} 次`);
    
    // 如果生成的名字不够，给出提示
    if (results.length < nameCount) {
      console.warn(`⚠️  只生成了 ${results.length} 个名字，少于目标数量 ${nameCount}`);
    }

    return results;
  }

  /**
   * 根据指定典籍生成名字
   */
  async generateNamesFromBook(
    book: PoetryBook, 
    familyName: string, 
    nameCount: number = 6,
    avoidedWords: string[] = []
  ): Promise<PoetryNameResult[]> {
    const bookData = await this.loadBook(book);
    const results: PoetryNameResult[] = [];
    const maxAttempts = nameCount * 5;
    let attempts = 0;

    while (results.length < nameCount && attempts < maxAttempts) {
      attempts++;
      
      const randomPoetry = choose(bookData);
      const nameResult = this.generateNameFromPoetry(
        randomPoetry, 
        familyName, 
        avoidedWords
      );
      
      if (nameResult && !results.some(existing => existing.name === nameResult.name)) {
        results.push(nameResult);
      }
    }

    return results;
  }

  /**
   * 检查是否正在加载数据
   */
  isLoading(): boolean {
    return this.loading;
  }

  /**
   * 清除缓存的数据
   */
  clearCache(): void {
    this.loadedBooks.clear();
    console.log('🧹 已清除诗词数据缓存');
  }

  /**
   * 获取已加载的典籍列表
   */
  getLoadedBooks(): PoetryBook[] {
    return Array.from(this.loadedBooks.keys());
  }
}