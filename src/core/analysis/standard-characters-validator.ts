/**
 * 通用规范汉字表验证器
 * 基于2013年教育部发布的《通用规范汉字表》
 * 仅在名字生成阶段进行过滤，保持数据源的完整性
 */

import { getStaticUrl } from '../../lib/config';

export interface StandardCharactersData {
  meta: {
    source: string;
    date: string;
    totalChars: number;
    description: string;
    version: string;
  };
  data: string[];
  duoyin?: { [char: string]: string[] };
  simplified?: { [traditional: string]: string };
  traditional?: { [simplified: string]: string };
}

export class StandardCharactersValidator {
  private static instance: StandardCharactersValidator;
  private standardChars: Set<string> = new Set();
  private duoyinMap: Map<string, string[]> = new Map();
  private simplifiedMap: Map<string, string> = new Map();
  private traditionalMap: Map<string, string> = new Map();
  private initialized = false;

  private constructor() {}

  static getInstance(): StandardCharactersValidator {
    if (!StandardCharactersValidator.instance) {
      StandardCharactersValidator.instance = new StandardCharactersValidator();
    }
    return StandardCharactersValidator.instance;
  }

  /**
   * 初始化标准字符数据
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('开始初始化通用规范汉字表验证器...');
      
      // 从集成的通用规范汉字表数据加载
      const response = await fetch(getStaticUrl('characters/standard-characters.json'));
      
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }

      const data: StandardCharactersData = await response.json();
      
      // 构建标准字符集合
      this.standardChars = new Set(data.data);
      
      // 构建多音字映射
      if (data.duoyin) {
        for (const [char, pinyins] of Object.entries(data.duoyin)) {
          this.duoyinMap.set(char, pinyins);
        }
      }
      
      // 构建简繁转换映射
      if (data.simplified) {
        for (const [trad, simp] of Object.entries(data.simplified)) {
          this.simplifiedMap.set(trad, simp);
        }
      }
      
      if (data.traditional) {
        for (const [simp, trad] of Object.entries(data.traditional)) {
          this.traditionalMap.set(simp, trad);
        }
      }

      this.initialized = true;
      
      console.log(`✅ 通用规范汉字表验证器初始化完成:`);
      console.log(`  • 标准汉字: ${this.standardChars.size} 个`);
      console.log(`  • 多音字: ${this.duoyinMap.size} 个`);
      console.log(`  • 简繁映射: ${this.simplifiedMap.size} + ${this.traditionalMap.size} 条`);
      
    } catch (error) {
      console.error('❌ 通用规范汉字表验证器初始化失败:', error);
      throw error;
    }
  }

  /**
   * 检查单个字符是否为标准汉字
   */
  isStandardCharacter(char: string): boolean {
    if (!this.initialized) {
      console.warn('标准字符验证器未初始化，返回false');
      return false;
    }
    return this.standardChars.has(char);
  }

  /**
   * 检查字符串中的所有字符是否都是标准汉字
   */
  areAllStandardCharacters(text: string): boolean {
    if (!text) return false;
    
    for (const char of text) {
      if (!this.isStandardCharacter(char)) {
        return false;
      }
    }
    return true;
  }

  /**
   * 过滤出标准汉字
   * 用于名字生成阶段的最终过滤
   */
  filterStandardCharacters(chars: string[]): string[] {
    if (!this.initialized) {
      console.warn('标准字符验证器未初始化，返回原数组');
      return chars;
    }
    
    return chars.filter(char => this.isStandardCharacter(char));
  }

  /**
   * 验证名字是否符合通用规范汉字表要求
   */
  validateName(fullName: string): {
    isValid: boolean;
    invalidChars: string[];
    suggestions: string[];
  } {
    const invalidChars: string[] = [];
    const suggestions: string[] = [];
    
    for (const char of fullName) {
      if (!this.isStandardCharacter(char)) {
        invalidChars.push(char);
        
        // 尝试提供简体替换建议
        const simplified = this.simplifiedMap.get(char);
        if (simplified && this.isStandardCharacter(simplified)) {
          suggestions.push(`"${char}" → "${simplified}" (简化)`);
        }
      }
    }
    
    return {
      isValid: invalidChars.length === 0,
      invalidChars,
      suggestions
    };
  }

  /**
   * 获取多音字的所有读音
   */
  getDuoyinReadings(char: string): string[] | null {
    return this.duoyinMap.get(char) || null;
  }

  /**
   * 繁体字转简体字
   */
  toSimplified(char: string): string {
    return this.simplifiedMap.get(char) || char;
  }

  /**
   * 简体字转繁体字
   */
  toTraditional(char: string): string {
    return this.traditionalMap.get(char) || char;
  }

  /**
   * 批量验证候选字符
   * 返回验证结果和统计信息
   */
  validateCandidates(candidates: string[]): {
    validChars: string[];
    invalidChars: string[];
    validCount: number;
    invalidCount: number;
    validationRate: number;
  } {
    const validChars: string[] = [];
    const invalidChars: string[] = [];
    
    for (const char of candidates) {
      if (this.isStandardCharacter(char)) {
        validChars.push(char);
      } else {
        invalidChars.push(char);
      }
    }
    
    const validCount = validChars.length;
    const invalidCount = invalidChars.length;
    const total = validCount + invalidCount;
    const validationRate = total > 0 ? (validCount / total) * 100 : 0;
    
    return {
      validChars,
      invalidChars,
      validCount,
      invalidCount,
      validationRate: Math.round(validationRate * 100) / 100
    };
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    initialized: boolean;
    standardCharsCount: number;
    duoyinCount: number;
    simplifiedMappingCount: number;
    traditionalMappingCount: number;
  } {
    return {
      initialized: this.initialized,
      standardCharsCount: this.standardChars.size,
      duoyinCount: this.duoyinMap.size,
      simplifiedMappingCount: this.simplifiedMap.size,
      traditionalMappingCount: this.traditionalMap.size
    };
  }

  /**
   * 清理缓存
   */
  clearCache(): void {
    this.standardChars.clear();
    this.duoyinMap.clear();
    this.simplifiedMap.clear();
    this.traditionalMap.clear();
    this.initialized = false;
  }

  /**
   * 调试：输出非标准字符统计
   */
  async analyzeDataSource(
    dataSourceName: string, 
    characters: string[]
  ): Promise<{
    sourceName: string;
    totalChars: number;
    standardChars: number;
    nonStandardChars: number;
    complianceRate: number;
    sampleNonStandard: string[];
  }> {
    const validation = this.validateCandidates(characters);
    
    return {
      sourceName: dataSourceName,
      totalChars: characters.length,
      standardChars: validation.validCount,
      nonStandardChars: validation.invalidCount,
      complianceRate: validation.validationRate,
      sampleNonStandard: validation.invalidChars.slice(0, 10) // 前10个非标准字符样本
    };
  }
}
