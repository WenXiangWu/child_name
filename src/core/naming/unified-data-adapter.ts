/**
 * 统一数据适配器
 * 让现有的取名系统可以无缝使用统一字符数据库
 */

import { UnifiedCharacterLoader } from './unified-character-loader';
import { WuxingElement, CharacterInfo } from '../common/types';

export class UnifiedDataAdapter {
  private static instance: UnifiedDataAdapter;
  private unifiedLoader: UnifiedCharacterLoader;
  private initialized = false;

  private constructor() {
    this.unifiedLoader = UnifiedCharacterLoader.getInstance();
  }

  static getInstance(): UnifiedDataAdapter {
    if (!UnifiedDataAdapter.instance) {
      UnifiedDataAdapter.instance = new UnifiedDataAdapter();
    }
    return UnifiedDataAdapter.instance;
  }

  /**
   * 初始化适配器
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    await this.unifiedLoader.initialize();
    this.initialized = true;
    console.log('✅ 统一数据适配器初始化完成');
  }

  /**
   * 适配 getWordsByStrokeAndWuxing 方法
   * 替代原来的 QimingDataLoader.getWordsByStrokeAndWuxing
   */
  async getWordsByStrokeAndWuxing(
    strokes: number,
    wuxing: WuxingElement,
    useTraditional: boolean = false
  ): Promise<string[]> {
    return this.unifiedLoader.getCharactersByStrokeAndWuxing(strokes, wuxing, useTraditional);
  }

  /**
   * 适配 getCharacterInfo 方法
   * 替代原来的新华字典查询
   */
  async getCharacterInfo(char: string): Promise<CharacterInfo | null> {
    const unifiedInfo = this.unifiedLoader.getCharacterInfo(char);
    
    if (!unifiedInfo) return null;

    // 转换为现有系统期望的格式
    return {
      char: unifiedInfo.char,
      pinyin: unifiedInfo.primaryPinyin,
      tone: unifiedInfo.tone,
      strokes: {
        simplified: unifiedInfo.strokes.simplified,
        traditional: unifiedInfo.strokes.traditional
      },
      wuxing: unifiedInfo.wuxing,
      meanings: unifiedInfo.meanings || []
    };
  }

  /**
   * 适配 getTone 方法
   */
  async getTone(char: string): Promise<number> {
    return this.unifiedLoader.getCharacterTone(char);
  }

  /**
   * 适配 getWuxing 方法
   */
  async getWuxing(char: string): Promise<WuxingElement> {
    return this.unifiedLoader.getCharacterWuxing(char) || '金';
  }

  /**
   * 批量获取字符五行属性
   */
  async getCharactersWuxing(chars: string[]): Promise<Map<string, WuxingElement>> {
    const result = new Map<string, WuxingElement>();
    
    for (const char of chars) {
      const wuxing = this.unifiedLoader.getCharacterWuxing(char);
      if (wuxing) {
        result.set(char, wuxing);
      }
    }
    
    return result;
  }

  /**
   * 验证字符是否为标准字符
   */
  isStandardCharacter(char: string): boolean {
    const info = this.unifiedLoader.getCharacterInfo(char);
    return info?.isStandard || false;
  }

  /**
   * 获取常用取名用字
   * 基于数据源完整性筛选
   */
  async getCommonNameWords(targetGender: string): Promise<Set<string>> {
    // 获取数据完整度较高的字符作为常用字
    const commonChars = this.unifiedLoader.getCommonCharacters(2); // 至少2个数据源
    
    // 简单的性别过滤逻辑（可以后续优化）
    const genderFilteredChars = commonChars.filter(char => {
      const info = this.unifiedLoader.getCharacterInfo(char);
      if (!info) return false;
      
      // 基于五行和字符特征进行简单的性别倾向判断
      if (targetGender === '男') {
        // 男性偏好金、火行字
        return ['jin', 'huo', 'tu'].includes(info.wuxing);
      } else {
        // 女性偏好木、水行字
        return ['mu', 'shui', 'jin'].includes(info.wuxing);
      }
    });

    console.log(`为${targetGender}性获取常用字: ${genderFilteredChars.length}个`);
    return new Set(genderFilteredChars);
  }

  /**
   * 获取所有标准字符
   */
  getAllStandardCharacters(): string[] {
    return this.unifiedLoader.getAllStandardCharacters();
  }

  /**
   * 高级字符搜索
   */
  async searchCharacters(options: {
    wuxing?: WuxingElement;
    tone?: number;
    minStrokes?: number;
    maxStrokes?: number;
    useTraditional?: boolean;
    gender?: string;
  }): Promise<string[]> {
    let candidates = this.unifiedLoader.searchCharacters(options);
    
    // 如果指定了性别，进行性别过滤
    if (options.gender) {
      candidates = candidates.filter(char => {
        const info = this.unifiedLoader.getCharacterInfo(char);
        if (!info) return false;
        
        if (options.gender === '男') {
          return ['jin', 'huo', 'tu'].includes(info.wuxing);
        } else {
          return ['mu', 'shui', 'jin'].includes(info.wuxing);
        }
      });
    }

    return candidates;
  }

  /**
   * 获取统计信息
   */
  getStatistics() {
    const unifiedStats = this.unifiedLoader.getStatistics();
    const meta = this.unifiedLoader.getMeta();
    const quality = this.unifiedLoader.analyzeDataQuality();

    return {
      unified: unifiedStats,
      meta: meta,
      quality: quality
    };
  }

  /**
   * 生成数据完整性报告
   */
  generateDataReport(): {
    summary: string;
    totalCharacters: number;
    qualityScore: number;
    recommendations: string[];
  } {
    const quality = this.unifiedLoader.analyzeDataQuality();
    const stats = this.unifiedLoader.getStatistics();
    
    const recommendations: string[] = [];
    
    if (quality.qualityScore < 95) {
      recommendations.push('建议补充缺失字符的数据信息');
    }
    
    if (quality.incompleteCharacters.length > 0) {
      recommendations.push(`有 ${quality.incompleteCharacters.length} 个字符数据不完整`);
    }
    
    if (stats) {
      const traditionalCoverage = parseFloat(stats.fieldCompleteness.traditional.percentage);
      if (traditionalCoverage < 50) {
        recommendations.push('繁体字覆盖率较低，建议补充繁体字数据');
      }
    }

    return {
      summary: `统一字符数据库包含 ${quality.totalCharacters} 个标准汉字，数据完整度 ${quality.qualityScore}%`,
      totalCharacters: quality.totalCharacters,
      qualityScore: quality.qualityScore,
      recommendations
    };
  }

  /**
   * 兼容性检查
   * 检查是否可以完全替代现有数据源
   */
  async checkCompatibility(): Promise<{
    canReplace: boolean;
    issues: string[];
    coverage: {
      wuxingCoverage: number;
      pinyinCoverage: number;
      strokeCoverage: number;
    };
  }> {
    const issues: string[] = [];
    const stats = this.unifiedLoader.getStatistics();
    
    if (!stats) {
      return {
        canReplace: false,
        issues: ['无法获取统计信息'],
        coverage: { wuxingCoverage: 0, pinyinCoverage: 0, strokeCoverage: 0 }
      };
    }

    const wuxingCoverage = parseFloat(stats.fieldCompleteness.wuxing.percentage);
    const pinyinCoverage = parseFloat(stats.fieldCompleteness.pinyin.percentage);
    const strokeCoverage = parseFloat(stats.fieldCompleteness.strokes.percentage);

    if (wuxingCoverage < 99) {
      issues.push('五行数据覆盖率不足99%');
    }
    
    if (pinyinCoverage < 99) {
      issues.push('拼音数据覆盖率不足99%');
    }
    
    if (strokeCoverage < 99) {
      issues.push('笔画数据覆盖率不足99%');
    }

    const canReplace = issues.length === 0;

    return {
      canReplace,
      issues,
      coverage: {
        wuxingCoverage,
        pinyinCoverage,
        strokeCoverage
      }
    };
  }
}
