import { PoetryItem, PoetryCategory, PoetrySearchResult, PoetryStats, POETRY_CATEGORIES } from '../types/poetry';

class PoetryService {
  private poetryData: PoetryItem[] = [];
  private isLoaded = false;

  // 重置缓存方法
  resetCache() {
    this.poetryData = [];
    this.isLoaded = false;
  }

  // 数据源配置
  private readonly DATA_SOURCES = [
    {
      category: PoetryCategory.SHIJING,
      name: '诗经',
      files: ['/data/chinese-poetry/诗经/shijing.json'],
      dynasty: '先秦'
    },
    {
      category: PoetryCategory.TANGSHI,
      name: '唐诗',
      files: [
        '/data/chinese-poetry/全唐诗/poet.tang.0.json',
        '/data/chinese-poetry/全唐诗/poet.tang.1000.json',
        '/data/chinese-poetry/全唐诗/poet.tang.2000.json',
        '/data/chinese-poetry/全唐诗/poet.tang.3000.json',
        '/data/chinese-poetry/全唐诗/poet.tang.4000.json'
      ],
      dynasty: '唐代',
      limit: 5000 // 限制加载数量
    },
    {
      category: PoetryCategory.SONGCI,
      name: '宋词',
      files: [
        '/data/chinese-poetry/宋词/ci.song.0.json',
        '/data/chinese-poetry/宋词/ci.song.1000.json',
        '/data/chinese-poetry/宋词/ci.song.2000.json'
      ],
      dynasty: '宋代',
      limit: 3000
    },
    {
      category: PoetryCategory.YUANQU,
      name: '元曲',
      files: ['/data/chinese-poetry/元曲/yuanqu.json'],
      dynasty: '元代',
      limit: 2000 // 元曲文件很大，限制加载数量
    },
    {
      category: PoetryCategory.CHUCI,
      name: '楚辞',
      files: ['/data/chinese-poetry/楚辞/chuci.json'],
      dynasty: '战国'
    },
    {
      category: PoetryCategory.LUNYU,
      name: '论语',
      files: ['/data/chinese-poetry/论语/lunyu.json'],
      dynasty: '春秋'
    },
    {
      category: PoetryCategory.MENGXUE,
      name: '蒙学',
      files: [
        '/data/chinese-poetry/蒙学/sanzijing-new.json',
        '/data/chinese-poetry/蒙学/baijiaxing.json',
        '/data/chinese-poetry/蒙学/qianziwen.json',
        '/data/chinese-poetry/蒙学/dizigui.json'
      ],
      dynasty: '历代',
      isSingleWork: true // 标记为单一作品模式，需要特殊处理
    },
    {
      category: PoetryCategory.NALANXINGDE,
      name: '纳兰性德',
      files: ['/data/chinese-poetry/纳兰性德/纳兰性德诗集.json'],
      dynasty: '清代'
    },
    {
      category: PoetryCategory.SHUIMOTANGSHI,
      name: '水墨唐诗',
      files: ['/data/chinese-poetry/水墨唐诗/shuimotangshi.json'],
      dynasty: '唐代'
    },
    {
      category: PoetryCategory.CAOCAO,
      name: '曹操诗集',
      files: ['/data/chinese-poetry/曹操诗集/caocao.json'],
      dynasty: '三国'
    },
    {
      category: PoetryCategory.YOUMENGYING,
      name: '幽梦影',
      files: ['/data/chinese-poetry/幽梦影/youmengying.json'],
      dynasty: '清代'
    },
    {
      category: PoetryCategory.SISHUWUJING,
      name: '四书五经',
      files: [
        '/data/chinese-poetry/四书五经/daxue.json',
        '/data/chinese-poetry/四书五经/zhongyong.json',
        '/data/chinese-poetry/四书五经/mengzi.json'
      ],
      dynasty: '先秦'
    },
    {
      category: PoetryCategory.YUDINGQUANTANGSHI,
      name: '御定全唐詩',
      files: [
        '/data/chinese-poetry/御定全唐詩/json/801.json',
        '/data/chinese-poetry/御定全唐詩/json/802.json',
        '/data/chinese-poetry/御定全唐詩/json/803.json',
        '/data/chinese-poetry/御定全唐詩/json/804.json',
        '/data/chinese-poetry/御定全唐詩/json/805.json',
        '/data/chinese-poetry/御定全唐詩/json/806.json',
        '/data/chinese-poetry/御定全唐詩/json/807.json',
        '/data/chinese-poetry/御定全唐詩/json/808.json',
        '/data/chinese-poetry/御定全唐詩/json/809.json',
        '/data/chinese-poetry/御定全唐詩/json/810.json'
      ],
      dynasty: '唐代',
      limit: 3000 // 限制加载数量，避免过多
    },
    {
      category: PoetryCategory.WUDAISHICI,
      name: '五代诗词',
      files: [
        '/data/chinese-poetry/五代诗词/nantang/poetrys.json',
        '/data/chinese-poetry/五代诗词/huajianji/huajianji-1-juan.json',
        '/data/chinese-poetry/五代诗词/huajianji/huajianji-2-juan.json',
        '/data/chinese-poetry/五代诗词/huajianji/huajianji-3-juan.json'
      ],
      dynasty: '五代',
      limit: 1000
    }
  ];

  // 加载所有诗词数据
  async loadAllPoetry(): Promise<PoetryItem[]> {
    if (this.isLoaded) {
      return this.poetryData;
    }

    try {
      let allPoetry: PoetryItem[] = [];

      for (const source of this.DATA_SOURCES) {
        const categoryPoetry = await this.loadCategoryData(source);
        allPoetry = allPoetry.concat(categoryPoetry);
        
        console.log(`✅ 已加载 ${source.name}: ${categoryPoetry.length} 首`);
      }

      this.poetryData = allPoetry;
      this.isLoaded = true;

      console.log(`🎉 总共加载 ${this.poetryData.length} 首诗词`);
      return this.poetryData;
    } catch (error) {
      console.error('Error loading poetry data:', error);
      return [];
    }
  }

  // 加载单个分类的数据
  private async loadCategoryData(source: any): Promise<PoetryItem[]> {
    let categoryPoetry: PoetryItem[] = [];
    
    for (const file of source.files) {
      if (source.limit && categoryPoetry.length >= source.limit) {
        break;
      }
      
      try {
        const response = await fetch(file);
        if (!response.ok) {
          console.warn(`⚠️ 跳过文件 ${file}: ${response.statusText}`);
          continue;
        }
        
        const data = await response.json();
        const normalized = this.normalizePoetryData(data, source.category, source.dynasty, source.isSingleWork);
        
        // 应用限制
        const remaining = source.limit ? source.limit - categoryPoetry.length : normalized.length;
        categoryPoetry = categoryPoetry.concat(normalized.slice(0, remaining));
        
      } catch (error) {
        console.warn(`⚠️ 加载文件失败 ${file}:`, error instanceof Error ? error.message : String(error));
      }
    }
    
    return categoryPoetry;
  }

  // 处理单一作品格式（如蒙学典籍）
  private processSingleWork(data: any, category: PoetryCategory, dynasty?: string): PoetryItem[] {
    if (!data || !data.paragraphs || !Array.isArray(data.paragraphs)) {
      return [];
    }

    const contentArray = data.paragraphs.filter((s: string) => s && s.trim());
    const content = contentArray.join('');
    
    // 计算统计信息
    const characterCount = content.length;
    const lineCount = contentArray.length;

    // 为蒙学典籍创建单个条目
    const item: PoetryItem = {
      id: `${category}-${data.title || 'work'}`,
      title: data.title || '未命名',
      author: data.author || null,
      dynasty: dynasty || POETRY_CATEGORIES[category].dynasty,
      content,
      contentArray,
      category,
      characterCount,
      lineCount
    };

    return [item];
  }

  // 标准化不同格式的诗词数据
  private normalizePoetryData(data: any[] | any, category: PoetryCategory, dynasty?: string, isSingleWork?: boolean): PoetryItem[] {
    // 处理蒙学类型的单一作品格式
    if (isSingleWork && !Array.isArray(data)) {
      return this.processSingleWork(data, category, dynasty);
    }
    
    if (!Array.isArray(data)) {
      console.warn(`Invalid data format for category ${category}`);
      return [];
    }

    return data.map((item, index) => {
      const id = item.id || `${category}-${String(index).padStart(6, '0')}`;
      
      // 处理内容字段 - 适配不同的数据格式
      let content = '';
      let contentArray: string[] = [];

      if (typeof item.content === 'string') {
        content = item.content;
        contentArray = content.split(/[。！？；,，.]/).filter(s => s.trim().length > 0);
      } else if (Array.isArray(item.content)) {
        contentArray = item.content.filter((s: string) => s && s.trim());
        content = contentArray.join('');
      } else if (Array.isArray(item.paragraphs)) {
        // 处理唐诗/宋词/五代诗词格式
        contentArray = item.paragraphs.filter((s: string) => s && s.trim());
        content = contentArray.join('');
      } else if (Array.isArray(item.para)) {
        // 处理纳兰性德格式
        contentArray = item.para.filter((s: string) => s && s.trim());
        content = contentArray.join('');
      } else if (item.text) {
        // 处理蒙学格式
        content = item.text;
        contentArray = [content];
      } else if (item.sentence) {
        // 处理四书五经格式
        content = item.sentence;
        contentArray = [content];
      } else if (item.quote) {
        // 处理幽梦影格式
        content = item.quote;
        contentArray = [content];
      } else {
        content = '';
        contentArray = [];
      }

      // 计算统计信息
      const characterCount = content.length;
      const lineCount = contentArray.length;

      // 清理标题
      let title = item.title || item.name || '未命名';
      if (title.includes('·')) {
        title = title.split('·')[0].trim();
      }

      return {
        id,
        title: title,
        author: item.author || null,
        dynasty: dynasty || item.dynasty || POETRY_CATEGORIES[category].dynasty,
        content,
        contentArray,
        category,
        
        // 诗经特有字段
        chapter: item.chapter || null,
        section: item.section || null,
        
        // 宋词特有字段
        rhythmic: item.rhythmic || null,
        
        // 统计信息
        characterCount,
        lineCount
      };
    });
  }

  // 获取所有诗词
  async getAllPoetry(): Promise<PoetryItem[]> {
    return await this.loadAllPoetry();
  }

  // 按分类获取诗词
  async getPoetryByCategory(category: PoetryCategory): Promise<PoetryItem[]> {
    const allPoetry = await this.loadAllPoetry();
    return allPoetry.filter(item => item.category === category);
  }

  // 搜索诗词
  async searchPoetry(keyword: string): Promise<PoetrySearchResult[]> {
    if (!keyword.trim()) {
      return [];
    }

    const allPoetry = await this.loadAllPoetry();
    const results: PoetrySearchResult[] = [];

    for (const item of allPoetry) {
      const matchedContent: string[] = [];
      
      // 在标题中搜索
      if (item.title.includes(keyword)) {
        matchedContent.push(`标题: ${item.title}`);
      }

      // 在作者中搜索
      if (item.author && item.author.includes(keyword)) {
        matchedContent.push(`作者: ${item.author}`);
      }

      // 在内容中搜索
      if (item.content.includes(keyword)) {
        // 找出包含关键词的句子
        const matchingSentences = item.contentArray?.filter(sentence => 
          sentence.includes(keyword)
        ) || [];
        
        if (matchingSentences.length > 0) {
          matchedContent.push(...matchingSentences.slice(0, 3)); // 最多显示3句
        }
      }

      if (matchedContent.length > 0) {
        results.push({
          item,
          matchedContent,
          highlightText: keyword
        });
      }
    }

    return results.sort((a, b) => {
      // 按照匹配度排序：标题匹配 > 作者匹配 > 内容匹配
      const aInTitle = a.item.title.includes(keyword) ? 1 : 0;
      const bInTitle = b.item.title.includes(keyword) ? 1 : 0;
      return bInTitle - aInTitle;
    });
  }

  // 获取统计信息
  async getStats(): Promise<PoetryStats> {
    const allPoetry = await this.loadAllPoetry();
    const categoryStats: Record<PoetryCategory, number> = {} as any;

    // 初始化统计
    Object.values(PoetryCategory).forEach(category => {
      categoryStats[category] = 0;
    });

    // 计算每个分类的数量
    allPoetry.forEach(item => {
      categoryStats[item.category]++;
    });

    return {
      totalCount: allPoetry.length,
      categoryStats
    };
  }

  // 根据字符获取包含该字的所有诗词
  async getPoetryByCharacter(char: string): Promise<PoetrySearchResult[]> {
    return await this.searchPoetry(char);
  }

  // 推荐功能：获取随机诗词
  async getRandomPoetry(count: number = 10): Promise<PoetryItem[]> {
    const allPoetry = await this.loadAllPoetry();
    const shuffled = [...allPoetry].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

// 导出单例实例
export const poetryService = new PoetryService();
export default poetryService;