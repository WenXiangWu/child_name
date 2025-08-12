/**
 * qiming数据加载器
 * 负责加载和处理qiming项目中的各种数据文件
 */

import { WuxingDictionary, CharacterInfo, WuxingElement, XinhuaDict, XinhuaDictEntry } from './types';
import { WordDataLoader, WordRecord } from '../naming/word-loader';
import { BaijiaxingLoader, SurnameInfo } from '../naming/baijiaxing-loader';
import { getStaticUrl } from '../../lib/config';

export class QimingDataLoader {
  private static instance: QimingDataLoader;
  private wuxingDataSimplified?: WuxingDictionary;
  private wuxingDataTraditional?: WuxingDictionary;
  private xinchuaDict?: Map<string, CharacterInfo>;
  private pinyinData?: Map<string, { pinyin: string; tone: number }>;

  private sancaiRules?: Map<string, any>;
  private commonNameWords?: Set<string>;
  private commonNameWordsCache: Map<string, Set<string>> = new Map();
  private wordLoader: WordDataLoader;
  private baijiaxingLoader: BaijiaxingLoader;

  private constructor() {
    this.wordLoader = WordDataLoader.getInstance();
    this.baijiaxingLoader = BaijiaxingLoader.getInstance();
  }

  static getInstance(): QimingDataLoader {
    if (!QimingDataLoader.instance) {
      QimingDataLoader.instance = new QimingDataLoader();
    }
    return QimingDataLoader.instance;
  }

  /**
   * 加载五行字典数据（简体）
   * 对应qiming/data/wuxing_dict_jianti.json
   */
  async loadWuxingDataSimplified(): Promise<WuxingDictionary> {
    if (this.wuxingDataSimplified) {
      console.log('返回已缓存的简体五行数据');
      return this.wuxingDataSimplified;
    }

    try {
      console.log('开始加载简体五行数据...');
      const response = await fetch(getStaticUrl('characters/wuxing_dict_jianti.json'));
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json() as WuxingDictionary;
      this.wuxingDataSimplified = data;
      
      // 统计数据
      const stats = this.getWuxingDataStats(data);
      console.log('简体五行数据加载完成:', stats);
      
      return data;
    } catch (error) {
      console.error('Failed to load simplified wuxing data:', error);
      // 返回空的数据结构
      return {};
    }
  }

  /**
   * 获取五行数据统计信息
   */
  private getWuxingDataStats(data: WuxingDictionary): Record<string, any> {
    const stats: Record<string, any> = {};
    
    Object.keys(data).forEach(wuxing => {
      const wuxingData = data[wuxing];
      const strokeCounts = Object.keys(wuxingData || {}).length;
      let totalChars = 0;
      
      Object.values(wuxingData || {}).forEach(chars => {
        totalChars += (chars as string[]).length;
      });
      
      stats[wuxing] = {
        strokeTypes: strokeCounts,
        totalChars: totalChars
      };
    });
    
    return stats;
  }

  /**
   * 加载五行字典数据（繁体）
   * 对应qiming/data/wuxing_dict_fanti.json
   */
  async loadWuxingDataTraditional(): Promise<WuxingDictionary> {
    if (this.wuxingDataTraditional) {
      return this.wuxingDataTraditional;
    }

    try {
      const response = await fetch(getStaticUrl('characters/wuxing_dict_fanti.json'));
      const data = await response.json() as WuxingDictionary;
      this.wuxingDataTraditional = data;
      return data;
    } catch (error) {
      console.error('Failed to load traditional wuxing data:', error);
      return {};
    }
  }

  /**
   * 根据笔画和五行获取汉字
   * 复现qiming/helper.py中的get_word_by_bihua函数
   */
  async getWordsByStrokeAndWuxing(
    strokes: number,
    wuxing: WuxingElement,
    useTraditional: boolean = false
  ): Promise<string[]> {
    const wuxingData = useTraditional 
      ? await this.loadWuxingDataTraditional()
      : await this.loadWuxingDataSimplified();

    const strokeKey = strokes.toString();
    const candidates = wuxingData[wuxing]?.[strokeKey] || [];
    
    console.log(`查找 ${wuxing} 行 ${strokes} 笔画的字，找到 ${candidates.length} 个候选字:`, candidates.slice(0, 10));
    
    return candidates;
  }

  /**
   * 获取已加载的新华字典数据（同步）
   * 直接返回预加载的数据，无需重复加载
   */
  getXinhuaDict(): Map<string, CharacterInfo> | null {
    return this.xinchuaDict || null;
  }

  /**
   * 加载新华字典数据
   * 直接使用预处理的JSON文件，性能更高
   */
  async loadXinhuaDict(): Promise<Map<string, CharacterInfo>> {
    if (this.xinchuaDict) {
      return this.xinchuaDict;
    }

    this.xinchuaDict = new Map();

    try {
      console.log('正在加载预处理的xinhua字典...');
      const processedResponse = await fetch(getStaticUrl('configs/processed/xinhua-processed.json'));
      
      if (!processedResponse.ok) {
        throw new Error(`HTTP错误: ${processedResponse.status} ${processedResponse.statusText}`);
      }
      
      const processedData = await processedResponse.json();  
      
      // 从预处理数据构建Map
      for (const [char, info] of Object.entries(processedData.data)) {
        this.xinchuaDict.set(char, info as CharacterInfo);
      }
      
      console.log(`✅ xinhua字典加载完成: ${this.xinchuaDict.size}条记录`);
      console.log(`✅ 数据源: ${processedData.meta.source}, 版本: ${processedData.meta.version}`);
      
      return this.xinchuaDict;
      
    } catch (error) {
      console.error('❌ xinhua字典加载失败:', error);
              console.error('❌ 请检查文件是否存在: configs/processed/xinhua-processed.json');
      return new Map();
    }
  }



  /**
   * 加载拼音声调数据
   * 直接使用预处理的JSON文件，性能更高
   */
  async loadPinyinData(): Promise<Map<string, { pinyin: string; tone: number }>> {
    if (this.pinyinData) {
      return this.pinyinData;
    }

    this.pinyinData = new Map();

    try {
      console.log('正在加载预处理的拼音数据...');
      const processedResponse = await fetch(getStaticUrl('configs/processed/pinyin-processed.json'));
      
      if (!processedResponse.ok) {
        throw new Error(`HTTP错误: ${processedResponse.status} ${processedResponse.statusText}`);
      }
      
      const processedData = await processedResponse.json();
      
      // 验证数据结构
      if (processedData.data && typeof processedData.data === 'object') {
        Object.entries(processedData.data).forEach(([char, info]: [string, any]) => {
          this.pinyinData!.set(char, {
            pinyin: info.pinyin,
            tone: info.tone
          });
        });
        
        console.log(`✅ 拼音数据加载完成: ${this.pinyinData.size}条记录`);
        console.log(`✅ 数据源: ${processedData.meta.source}, 版本: ${processedData.meta.version}`);
        
        return this.pinyinData;
      } else {
        throw new Error('拼音数据文件格式不正确');
      }
      
    } catch (error) {
      console.error('❌ 拼音数据加载失败:', error);
              console.error('❌ 请检查文件是否存在: configs/processed/pinyin-processed.json');
      return this.pinyinData;
    }
  }

  /**
   * 获取汉字的声调
   * 复现qiming/helper.py中的get_tone函数
   */
  async getTone(char: string): Promise<number> {
    // 首先尝试从xinhua字典获取
    const xinhuaDict = await this.loadXinhuaDict();
    const xinhuaInfo = xinhuaDict.get(char);
    if (xinhuaInfo?.tone) {
      return xinhuaInfo.tone;
    }
    
    // 如果xinhua没有，再从拼音数据获取
    const pinyinData = await this.loadPinyinData();
    return pinyinData.get(char)?.tone || 0;
  }

  /**
   * 从拼音中提取声调
   * 支持带声调符号的拼音，如：yào, shè, tán等
   */
  private extractToneFromPinyin(pinyin: string): number {
    if (!pinyin || pinyin === 'error') return 0;
    
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
   * 获取字符的五行属性（公共方法）
   * 优先从xinhua-processed.json获取，回退到五行字典
   */
  async getCharacterWuxing(char: string): Promise<WuxingElement> {
    return await this.inferWuxingFromChar(char);
  }

  /**
   * 获取字符五行属性（兼容旧接口）
   * @deprecated 请使用 getCharacterWuxing
   */
  async getWuxing(char: string): Promise<WuxingElement> {
    return await this.getCharacterWuxing(char);
  }

  /**
   * 批量获取字符的五行属性
   * 优化性能，避免重复数据加载
   */
  async getCharactersWuxing(chars: string[]): Promise<Map<string, WuxingElement>> {
    const result = new Map<string, WuxingElement>();
    
    // 确保新华字典已加载
    await this.loadXinhuaDict();
    
    // 优先从新华字典预处理数据获取
    const remainingChars: string[] = [];
    
    for (const char of chars) {
      if (this.xinchuaDict) {
        const charInfo = this.xinchuaDict.get(char);
        if (charInfo?.wuxing) {
          result.set(char, charInfo.wuxing);
          continue;
        }
      }
      remainingChars.push(char);
    }
    
    console.log(`从新华字典获取了 ${result.size} 个字符的五行信息`);
    
    // 对剩余字符从五行字典查找
    if (remainingChars.length > 0) {
      await this.loadWuxingDataSimplified();
      await this.loadWuxingDataTraditional();
      
      for (const char of remainingChars) {
        const wuxing = await this.inferWuxingFromChar(char);
        result.set(char, wuxing);
      }
      
      console.log(`为剩余 ${remainingChars.length} 个字符获取了五行信息`);
    }
    
    return result;
  }

  /**
   * 根据汉字获取五行属性
   * 优先从xinhua-processed.json获取，回退到五行字典
   */
  private async inferWuxingFromChar(char: string): Promise<WuxingElement> {
    // 1. 优先从新华字典预处理数据获取
    if (this.xinchuaDict) {
      const charInfo = this.xinchuaDict.get(char);
      if (charInfo?.wuxing) {
        return charInfo.wuxing;
      }
    }

    // 2. 如果新华字典没有加载，尝试加载并查询
    try {
      const xinhuaDict = await this.loadXinhuaDict();
      const charInfo = xinhuaDict.get(char);
      if (charInfo?.wuxing) {
        return charInfo.wuxing;
      }
    } catch (error) {
      console.warn(`从新华字典获取"${char}"的五行信息失败:`, error);
    }

    // 3. 回退到简体五行字典
    try {
      const wuxingData = await this.loadWuxingDataSimplified();
      for (const [wuxing, strokesData] of Object.entries(wuxingData)) {
        for (const chars of Object.values(strokesData)) {
          if (Array.isArray(chars) && chars.includes(char)) {
            return wuxing as WuxingElement;
          }
        }
      }
    } catch (error) {
      console.warn(`从简体五行字典获取"${char}"的五行信息失败:`, error);
    }

    // 4. 回退到繁体五行字典
    try {
      const wuxingDataTraditional = await this.loadWuxingDataTraditional();
      for (const [wuxing, strokesData] of Object.entries(wuxingDataTraditional)) {
        for (const chars of Object.values(strokesData)) {
          if (Array.isArray(chars) && chars.includes(char)) {
            return wuxing as WuxingElement;
          }
        }
      }
    } catch (error) {
      console.warn(`从繁体五行字典获取"${char}"的五行信息失败:`, error);
    }

    // 5. 最终回退：基于部首的简化推断
    const radicalWuxingMap: { [key: string]: WuxingElement } = {
      // 水
      '氵': 'shui', '冫': 'shui', '水': 'shui', '雨': 'shui',
      // 木
      '木': 'mu', '艹': 'mu', '竹': 'mu', '禾': 'mu',
      // 火
      '火': 'huo', '日': 'huo', '光': 'huo', '灬': 'huo',
      // 土
      '土': 'tu', '山': 'tu', '石': 'tu', '田': 'tu',
      // 金
      '金': 'jin', '钅': 'jin', '刀': 'jin', '刂': 'jin'
    };

    // 简单的部首匹配
    for (const [radical, wuxing] of Object.entries(radicalWuxingMap)) {
      if (char.includes(radical)) {
        return wuxing;
      }
    }

    // 默认返回金
    console.warn(`无法确定"${char}"的五行属性，使用默认值：金`);
    return 'jin';
  }



  /**
   * 获取常用名字用字
   * 直接从独立的常用字文件读取，性能更高
   * 必须指定性别参数，确保明确的性别差异化
   */
  async getCommonNameWords(targetGender: string): Promise<Set<string>> {
    // 验证性别参数
    if (!targetGender || (targetGender !== '男' && targetGender !== '女')) {
      throw new Error(`无效的性别参数: ${targetGender}，必须是 '男' 或 '女'`);
    }
    
    const cacheKey = `commonWords_${targetGender}`;
    if (this.commonNameWordsCache?.has(cacheKey)) {
      const cached = this.commonNameWordsCache.get(cacheKey)!;
      console.log(`返回已缓存的${targetGender}性常用字数量：${cached.size}`);
      return cached;
    }

    const commonWords = new Set<string>();
    
    try {
      // 直接从独立的常用字文件读取
      const genderKey = targetGender === '男' ? 'male' : 'female';
      const fileName = `common-chars-${genderKey}.json`;
      
      console.log(`开始加载${targetGender}性常用字文件: ${fileName}`);
              const response = await fetch(getStaticUrl(`configs/processed/${fileName}`));
      
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        // 添加所有常用字符到结果集
        for (const item of data.data) {
          if (item.char) {
            commonWords.add(item.char);
          }
        }
        
        console.log(`✅ 从独立文件加载${targetGender}性常用字数量：${commonWords.size}`);
        console.log(`✅ 数据源：${data.meta.sourceNames}个${targetGender}性姓名，最小频率：${data.meta.minFrequency}`);
        
        // 缓存结果
        this.commonNameWordsCache.set(cacheKey, commonWords);
        return commonWords;
      } else {
        throw new Error('常用字文件格式不正确');
      }
      
    } catch (error) {
      console.error(`❌ 从独立文件加载${targetGender}性常用字失败:`, error);
      console.error('❌ 常用字文件加载失败，请检查文件是否存在：', `processed/common-chars-${targetGender === '男' ? 'male' : 'female'}.json`);
    }

    // 缓存结果
    this.commonNameWordsCache.set(cacheKey, commonWords);
    console.log(`缓存${targetGender}性常用字数量：${commonWords.size}`);

    return commonWords;
  }

  /**
   * 获取已加载的三才规则（同步）
   * 直接返回预加载的数据，无需重复加载
   */
  getSancaiRules(): Map<string, any> | null {
    return this.sancaiRules || null;
  }

  /**
   * 加载三才五格规则
   * 使用结构化的 sancai-rules.json 文件
   */
  async loadSancaiRules(): Promise<Map<string, any>> {
    if (this.sancaiRules) {
      return this.sancaiRules;
    }

    this.sancaiRules = new Map();

    try {
      console.log('开始加载三才规则文件...');
      const response = await fetch(getStaticUrl('rules/sancai-rules.json'));
      
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }
      
      const rulesData = await response.json();
      console.log(`从JSON文件读取到 ${Object.keys(rulesData).length} 条三才规则`);

      // 将JSON数据转换为Map
      for (const [combination, rule] of Object.entries(rulesData)) {
        this.sancaiRules.set(combination, rule);
      }

      console.log(`✅ 三才规则加载完成: ${this.sancaiRules.size} 条规则`);
    } catch (error) {
      console.error('❌ 三才规则加载失败:', error);
      console.error('❌ 请检查文件是否存在: sancai-rules.json');
    }

    return this.sancaiRules;
  }

  /**
   * 映射三才等级
   */
  private mapSancaiLevel(level: string): string {
    const mapping: Record<string, string> = {
      '大吉': 'da_ji',
      '中吉': 'zhong_ji',
      '吉': 'ji',
      '凶': 'xiong',
      '大凶': 'da_xiong'
    };
    return mapping[level] || 'ji';
  }

  /**
   * 获取汉字的详细信息
   */
  async getCharacterInfo(char: string): Promise<CharacterInfo | null> {
    const xinhuaDict = await this.loadXinhuaDict();
    return xinhuaDict.get(char) || null;
  }

  /**
   * 批量获取汉字信息
   */
  async getCharactersInfo(chars: string[]): Promise<Map<string, CharacterInfo>> {
    const result = new Map<string, CharacterInfo>();
    const xinhuaDict = await this.loadXinhuaDict();

    for (const char of chars) {
      const info = xinhuaDict.get(char);
      if (info) {
        result.set(char, info);
      }
    }

    return result;
  }

  /**
   * 预加载所有核心数据
   * 用于应用启动时的初始化
   */
  async preloadCoreData(): Promise<void> {
    console.log('开始预加载qiming核心数据...');
    
    const startTime = Date.now();
    
    // 按顺序加载基础数据，确保依赖关系正确
    console.log('1. 加载新华字典数据...');
    await this.loadXinhuaDict();
    
    console.log('2. 加载其他核心数据...');
    await Promise.all([
      this.loadWuxingDataSimplified(),
      this.loadWuxingDataTraditional(), // 也预加载繁体五行数据
      this.loadPinyinData(),
      this.loadSancaiRules(),
    ]);

    console.log('3. 加载性别相关常用字...');
    await Promise.all([
      this.getCommonNameWords('男'),  // 预加载男性常用字
      this.getCommonNameWords('女')   // 预加载女性常用字
    ]);

    const endTime = Date.now();
    console.log(`✅ qiming核心数据加载完成，耗时: ${endTime - startTime}ms`);
    
    // 输出数据统计
    console.log('📊 数据加载统计:');
    console.log(`  • 新华字典: ${this.xinchuaDict?.size || 0} 条记录`);
    console.log(`  • 五行字典: ${Object.keys(this.wuxingDataSimplified || {}).length} 个五行分类`);
    console.log(`  • 拼音数据: ${this.pinyinData?.size || 0} 条记录`);
    console.log(`  • 三才规则: ${this.sancaiRules?.size || 0} 条规则`);
  }

  /**
   * 清理缓存数据
   */
  clearCache(): void {
    this.wuxingDataSimplified = undefined;
    this.wuxingDataTraditional = undefined;
    this.xinchuaDict = undefined;
    this.pinyinData = undefined;

    this.sancaiRules = undefined;
    this.commonNameWords = undefined;
  }

  /**
   * 获取数据加载状态
   */
  getLoadStatus(): Record<string, boolean> {
    return {
      wuxingDataSimplified: !!this.wuxingDataSimplified,
      wuxingDataTraditional: !!this.wuxingDataTraditional,
      xinhuaDict: !!this.xinchuaDict,
      pinyinData: !!this.pinyinData,

      sancaiRules: !!this.sancaiRules,
      commonNameWords: !!this.commonNameWords
    };
  }

  // === 汉字基础数据相关方法（word.json分片加载）===

  /**
   * 获取字符的详细信息（从word.json）
   */
  async getCharacterDetail(char: string): Promise<any> {
    return await this.wordLoader.getCharacterInfo(char);
  }

  /**
   * 根据笔画数获取字符列表（从word.json）
   */
  async getCharactersByStrokesFromWord(strokes: number): Promise<string[]> {
    return await this.wordLoader.getCharactersByStrokes(strokes);
  }

  /**
   * 高级字符搜索（从word.json）
   */
  async searchCharacters(options: {
    strokes?: number[];
    pinyinInitials?: string[];
    radicals?: string[];
    limit?: number;
  }): Promise<any[]> {
    return await this.wordLoader.searchCharacters(options);
  }

  /**
   * 获取汉字数据统计信息
   */
  getWordDataStats() {
    return this.wordLoader.getStats();
  }

  /**
   * 清空汉字数据缓存
   */
  clearWordDataCache(): void {
    this.wordLoader.clearCache();
  }

  // === 百家姓数据相关方法 ===

  /**
   * 验证姓氏是否有效
   */
  async isValidSurname(surname: string): Promise<boolean> {
    return await this.baijiaxingLoader.isValidSurname(surname);
  }

  /**
   * 检查是否为常见姓氏
   */
  async isCommonSurname(surname: string): Promise<boolean> {
    return await this.baijiaxingLoader.isCommonSurname(surname);
  }

  /**
   * 获取姓氏详细信息
   */
  async getSurnameInfo(surname: string): Promise<SurnameInfo> {
    return await this.baijiaxingLoader.getSurnameInfo(surname);
  }

  /**
   * 搜索姓氏
   */
  async searchSurnames(query: string, limit: number = 20): Promise<string[]> {
    return await this.baijiaxingLoader.searchSurnames(query, limit);
  }

  /**
   * 获取常见姓氏列表
   */
  async getCommonSurnames(): Promise<string[]> {
    return await this.baijiaxingLoader.getCommonSurnames();
  }

  /**
   * 获取所有姓氏列表
   */
  async getAllSurnames(): Promise<string[]> {
    return await this.baijiaxingLoader.getAllSurnames();
  }

  /**
   * 批量验证姓氏
   */
  async validateSurnames(surnames: string[]): Promise<Map<string, SurnameInfo>> {
    return await this.baijiaxingLoader.validateSurnames(surnames);
  }

  /**
   * 获取姓氏排名
   */
  async getSurnameRank(surname: string): Promise<number | null> {
    return await this.baijiaxingLoader.getSurnameRank(surname);
  }

  /**
   * 根据排名获取姓氏
   */
  async getSurnameByRank(rank: number): Promise<string | null> {
    return await this.baijiaxingLoader.getSurnameByRank(rank);
  }

  /**
   * 获取相似姓氏
   */
  async getSimilarSurnames(surname: string, limit: number = 10): Promise<string[]> {
    return await this.baijiaxingLoader.getSimilarSurnames(surname, limit);
  }

  /**
   * 获取百家姓统计信息
   */
  getBaijiaxingStats() {
    return this.baijiaxingLoader.getStats();
  }

  /**
   * 清空百家姓数据缓存
   */
  clearBaijiaxingCache(): void {
    this.baijiaxingLoader.clearCache();
  }
}

// 导出单例实例获取函数
export function getQimingInstance(): QimingDataLoader {
  return QimingDataLoader.getInstance();
}