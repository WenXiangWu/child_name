/**
 * 汉字相关类型定义
 */

// 五行属性
export type FiveElement = '金' | '木' | '水' | '火' | '土';

// 汉字笔画类型
export type StrokeType = '横' | '竖' | '撇' | '捺' | '折' | '点' | '提' | '钩';

// 汉字基本信息
export interface Character {
  // 汉字
  char: string;
  // 拼音（可能有多个读音）
  pinyin: string[];
  // 声调（与拼音对应）
  tone: number[];
  // 部首
  radical: string;
  // 笔画数
  strokes: number;
  // 五行属性
  fiveElement: FiveElement;
  // 常用度（1-10，10为最常用）
  frequency: number;
  // 字义
  meaning: string[];
  // 字形结构（左右结构、上下结构等）
  structure: string;
  // 相关汉字（形近字、音近字等）
  relatedChars?: {
    // 形近字
    similar: string[];
    // 音近字
    homophone: string[];
    // 意近字
    synonym: string[];
  };
}

// 汉字查询参数
export interface CharacterSearchParams {
  // 按拼音查询
  pinyin?: string;
  // 按声调查询
  tone?: number;
  // 按部首查询
  radical?: string;
  // 按笔画数查询
  strokeCount?: number | [number, number]; // 可以是具体数字或范围
  // 按五行查询
  fiveElement?: FiveElement;
  // 按常用度查询
  minFrequency?: number;
  // 按结构查询
  structure?: string;
  // 限制返回结果数量
  limit?: number;
  // 分页
  page?: number;
}

// 汉字详情
export interface CharacterDetail extends Character {
  // 字源信息
  etymology?: {
    // 字形演变
    evolution: string[];
    // 造字法
    formation: string;
    // 原始含义
    originalMeaning: string;
  };
  // 详细释义
  detailedMeaning: {
    // 释义
    definition: string;
    // 例句
    examples: string[];
  }[];
  // 文化内涵
  culturalContext?: string;
  // 诗词用例
  poetryUsage?: {
    // 诗词名
    title: string;
    // 作者
    author: string;
    // 朝代
    dynasty: string;
    // 内容片段
    content: string;
  }[];
}
