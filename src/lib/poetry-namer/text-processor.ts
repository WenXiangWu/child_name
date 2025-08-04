/**
 * 文本处理器
 * 复制自gushi_namer的文本处理逻辑
 */

import { BAD_CHARS, TextCleaningConfig, DEFAULT_CLEANING_CONFIG } from './types';

export class TextProcessor {
  private config: TextCleaningConfig;

  constructor(config: Partial<TextCleaningConfig> = {}) {
    this.config = { ...DEFAULT_CLEANING_CONFIG, ...config };
  }

  /**
   * 格式化字符串 - 移除HTML标签和多余空白
   * 复制自gushi_namer的formatStr方法
   */
  formatStr(str: string): string {
    // 移除HTML标签和多余空白字符
    let result = str.replace(/(\s|　|"|"){1,}|<br>|<p>|<\/p>/g, '');
    // 移除括号内容
    result = result.replace(/\(.+\)/g, '');
    return result;
  }

  /**
   * 分割句子 - 基于中文标点符号
   * 复制自gushi_namer的splitSentence方法
   */
  splitSentence(content: string): string[] {
    if (!content) {
      return [];
    }

    let str = this.formatStr(content);
    // 基于中文标点符号分割
    str = str.replace(/！|。|？|；/g, s => `${s}|`);
    str = str.replace(/\|$/g, '');
    let arr = str.split('|');
    
    // 过滤掉太短的句子
    arr = arr.filter(item => item.length >= this.config.minSentenceLength);
    return arr;
  }

  /**
   * 清除标点符号
   * 复制自gushi_namer的cleanPunctuation方法
   */
  cleanPunctuation(str: string): string {
    if (!this.config.removePunctuation) {
      return str;
    }

    const puncReg = /[<>《》！*\(\^\)\$%~!@#…&%￥—\+=、。，？；''""：·`]/g;
    return str.replace(puncReg, '');
  }

  /**
   * 清除敏感词字符
   * 复制自gushi_namer的cleanBadChar方法
   */
  cleanBadChar(str: string): string {
    if (!this.config.filterBadChars) {
      return str;
    }

    return str.split('').filter(char => !BAD_CHARS.includes(char)).join('');
  }

  /**
   * 完整的文本清理流程
   */
  cleanText(text: string): string {
    let result = this.formatStr(text);
    result = this.cleanPunctuation(result);
    result = this.cleanBadChar(result);
    return result;
  }

  /**
   * 处理单个句子，返回可用的字符数组
   */
  processSentence(sentence: string): string[] {
    const cleanSentence = this.cleanText(sentence);
    
    // 检查句子长度是否满足要求
    if (cleanSentence.length <= this.config.maxNameLength) {
      return [];
    }

    return cleanSentence.split('');
  }

  /**
   * 高亮显示名字字符在句子中的位置
   * 生成HTML格式的高亮句子
   */
  highlightNameInSentence(sentence: string, name: string): string {
    let result = sentence;
    
    // 为名字中的每个字符添加高亮
    for (const char of name) {
      const regex = new RegExp(`[${char}]`, 'g');
      result = result.replace(regex, `<span class="font-bold text-primary-600 bg-primary-100 px-1 rounded">${char}</span>`);
    }
    
    return result;
  }

  /**
   * 验证文本是否包含足够的可用字符
   */
  hasEnoughCharacters(text: string, minChars: number = 3): boolean {
    const cleanText = this.cleanText(text);
    return cleanText.length >= minChars;
  }
}