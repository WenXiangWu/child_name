/**
 * 百家姓数据加载器
 * 提供姓氏验证和姓氏相关功能
 */
import { getStaticUrl } from '../../lib/config';

export interface BaijiaxingData {
  meta: {
    total_surnames: number;
    source: string;
    description: string;
  };
  surnames: string[];
  surname_set: string[];
}

export interface SurnameInfo {
  surname: string;
  isValid: boolean;
  isCommon: boolean;
  rank?: number;
  variants?: string[];
}

export class BaijiaxingLoader {
  private static instance: BaijiaxingLoader;
  private surnameData: BaijiaxingData | null = null;
  private surnameSet: Set<string> = new Set();
  private commonSurnames: Set<string> = new Set();

  private constructor() {}

  static getInstance(): BaijiaxingLoader {
    if (!BaijiaxingLoader.instance) {
      BaijiaxingLoader.instance = new BaijiaxingLoader();
    }
    return BaijiaxingLoader.instance;
  }

  /**
   * 初始化百家姓数据
   */
  async initialize(): Promise<void> {
    if (this.surnameData) return;

    try {
      const response = await fetch(getStaticUrl('names/baijiaxing.json'));
      this.surnameData = await response.json();

      // 构建快速查找集合
      this.surnameSet = new Set(this.surnameData?.surnames || []);

      // 定义常见姓氏（前100个最常见的）
      const topCommonSurnames = [
        '李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
        '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
        '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
        '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕',
        '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎',
        '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜',
        '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆',
        '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史',
        '顾', '侯', '邵', '孟', '龙', '万', '段', '漕', '钱', '汤',
        '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'
      ];

      topCommonSurnames.forEach(surname => {
        if (this.surnameSet.has(surname)) {
          this.commonSurnames.add(surname);
        }
      });

      console.log(`百家姓数据加载完成：${this.surnameData?.meta.total_surnames || 0}个姓氏，${this.commonSurnames.size}个常见姓氏`);
    } catch (error) {
      console.error('加载百家姓数据失败:', error);
      throw error;
    }
  }

  /**
   * 验证姓氏是否有效
   */
  async isValidSurname(surname: string): Promise<boolean> {
    await this.initialize();
    return this.surnameSet.has(surname);
  }

  /**
   * 检查是否为常见姓氏
   */
  async isCommonSurname(surname: string): Promise<boolean> {
    await this.initialize();
    return this.commonSurnames.has(surname);
  }

  /**
   * 获取姓氏详细信息
   */
  async getSurnameInfo(surname: string): Promise<SurnameInfo> {
    await this.initialize();

    const isValid = this.surnameSet.has(surname);
    const isCommon = this.commonSurnames.has(surname);
    
    let rank: number | undefined;
    if (isValid && this.surnameData) {
      rank = this.surnameData.surnames.indexOf(surname) + 1;
    }

    return {
      surname,
      isValid,
      isCommon,
      rank,
      variants: this.getSurnameVariants(surname)
    };
  }

  /**
   * 获取姓氏变体（繁简体转换等）
   * 这里是一个简化实现，实际可以扩展更完整的繁简转换
   */
  private getSurnameVariants(surname: string): string[] {
    const variants: string[] = [];
    
    // 简化的繁简对照表（只包含常见姓氏）
    const traditionalMap: { [key: string]: string } = {
      '陈': '陳', '郑': '鄭', '刘': '劉', '叶': '葉', '黄': '黃',
      '吕': '呂', '罗': '羅', '邓': '鄧', '贾': '賈', '韩': '韓',
      '冯': '馮', '曾': '曾', '萧': '蕭', '蒋': '蔣', '薛': '薛',
      '严': '嚴', '谢': '謝', '邹': '鄒', '贺': '賀', '龙': '龍',
      '钱': '錢', '汤': '湯', '邱': '丘'
    };

    const simplifiedMap: { [key: string]: string } = {};
    Object.entries(traditionalMap).forEach(([s, t]) => {
      simplifiedMap[t] = s;
    });

    // 添加繁体变体
    if (traditionalMap[surname]) {
      variants.push(traditionalMap[surname]);
    }

    // 添加简体变体
    if (simplifiedMap[surname]) {
      variants.push(simplifiedMap[surname]);
    }

    return variants;
  }

  /**
   * 搜索姓氏（支持模糊匹配）
   */
  async searchSurnames(query: string, limit: number = 20): Promise<string[]> {
    await this.initialize();
    
    if (!this.surnameData) return [];

    const results: string[] = [];
    
    // 精确匹配优先
    if (this.surnameSet.has(query)) {
      results.push(query);
    }

    // 部分匹配（对于复姓）
    for (const surname of this.surnameData.surnames) {
      if (surname.includes(query) && surname !== query) {
        results.push(surname);
        if (results.length >= limit) break;
      }
    }

    return results;
  }

  /**
   * 获取常见姓氏列表
   */
  async getCommonSurnames(): Promise<string[]> {
    await this.initialize();
    return Array.from(this.commonSurnames);
  }

  /**
   * 获取所有姓氏列表
   */
  async getAllSurnames(): Promise<string[]> {
    await this.initialize();
    return this.surnameData?.surnames || [];
  }

  /**
   * 批量验证姓氏
   */
  async validateSurnames(surnames: string[]): Promise<Map<string, SurnameInfo>> {
    await this.initialize();
    
    const results = new Map<string, SurnameInfo>();
    
    for (const surname of surnames) {
      const info = await this.getSurnameInfo(surname);
      results.set(surname, info);
    }

    return results;
  }

  /**
   * 获取姓氏统计信息
   */
  getStats(): {
    totalSurnames: number;
    commonSurnamesCount: number;
    loaded: boolean;
  } {
    return {
      totalSurnames: this.surnameData?.meta.total_surnames || 0,
      commonSurnamesCount: this.commonSurnames.size,
      loaded: !!this.surnameData
    };
  }

  /**
   * 清空缓存
   */
  clearCache(): void {
    this.surnameData = null;
    this.surnameSet.clear();
    this.commonSurnames.clear();
    console.log('百家姓数据缓存已清空');
  }

  /**
   * 姓氏排名（根据在百家姓中的位置）
   */
  async getSurnameRank(surname: string): Promise<number | null> {
    await this.initialize();
    
    if (!this.surnameData || !this.surnameSet.has(surname)) {
      return null;
    }

    return this.surnameData.surnames.indexOf(surname) + 1;
  }

  /**
   * 根据排名获取姓氏
   */
  async getSurnameByRank(rank: number): Promise<string | null> {
    await this.initialize();
    
    if (!this.surnameData || rank < 1 || rank > this.surnameData.surnames.length) {
      return null;
    }

    return this.surnameData.surnames[rank - 1];
  }

  /**
   * 获取姓氏的相似姓氏
   */
  async getSimilarSurnames(surname: string, limit: number = 10): Promise<string[]> {
    await this.initialize();
    
    if (!this.surnameData) return [];

    const similar: string[] = [];
    
    // 1. 添加变体
    const variants = this.getSurnameVariants(surname);
    variants.forEach(variant => {
      if (this.surnameSet.has(variant) && variant !== surname) {
        similar.push(variant);
      }
    });

    // 2. 添加同音姓氏（简化实现）
    const sameSoundGroups: { [key: string]: string[] } = {
      'li': ['李', '理', '里', '黎'],
      'wang': ['王', '汪'],
      'zhang': ['张', '章'],
      'liu': ['刘', '柳'],
      'chen': ['陈', '程'],
      'yang': ['杨', '羊'],
      'zhao': ['赵', '朝'],
      'huang': ['黄', '皇']
    };

    // 简化的同音查找（实际应该使用拼音库）
    for (const [sound, sameSound] of Object.entries(sameSoundGroups)) {
      if (sameSound.includes(surname)) {
        sameSound.forEach(s => {
          if (s !== surname && this.surnameSet.has(s) && !similar.includes(s)) {
            similar.push(s);
          }
        });
        break;
      }
    }

    return similar.slice(0, limit);
  }
}