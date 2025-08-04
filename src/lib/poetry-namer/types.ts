/**
 * 诗词取名模块类型定义
 * 基于gushi_namer项目的核心逻辑
 */

// 诗词典籍类型
export type PoetryBook = 'shijing' | 'chuci' | 'tangshi' | 'songci' | 'yuefu' | 'gushi' | 'cifu';

// 朝代类型
export type Dynasty = '先秦' | '春秋' | '唐代' | '宋代' | '汉魏六朝' | '多朝代' | '魏晋';

// 诗词条目数据结构
export interface PoetryEntry {
  content: string;    // 诗文内容
  title: string;      // 作品标题
  author: string | null; // 作者姓名，可能为null
  book: string;       // 典籍名称
  dynasty: Dynasty;   // 朝代
}

// 诗词取名结果
export interface PoetryNameResult {
  name: string;                // 生成的名字（两个字）
  fullName: string;           // 完整姓名
  familyName: string;         // 姓氏
  sentence: string;           // 来源句子
  content: string;            // 完整诗文内容
  title: string;              // 作品标题
  author: string | null;      // 作者
  book: string;               // 典籍
  dynasty: Dynasty;           // 朝代
  highlightedSentence: string; // 高亮显示的句子（HTML格式）
}

// 诗词取名配置
export interface PoetryNamingConfig {
  familyName: string;         // 姓氏
  gender: 'male' | 'female';  // 性别（用于选择典籍倾向）
  books?: PoetryBook[];       // 指定典籍，默认根据性别选择
  nameCount?: number;         // 生成名字数量，默认6个
  avoidedWords?: string[];    // 避免使用的字符
  useCommonChars?: boolean;   // 是否只使用常用字，默认true
}

// 典籍信息
export interface BookInfo {
  value: PoetryBook;
  name: string;
  description: string;
  count: number;
  dynasty: Dynasty;
  recommended: 'male' | 'female' | 'both'; // 推荐性别
}

// 所有支持的典籍信息
export const POETRY_BOOKS: BookInfo[] = [
  {
    value: 'shijing',
    name: '诗经',
    description: '中国最早诗歌总集，"男诗经"传统',
    count: 305,
    dynasty: '先秦',
    recommended: 'male'
  },
  {
    value: 'chuci',
    name: '楚辞',
    description: '屈原等楚国诗人作品，"女楚辞"传统',
    count: 17,
    dynasty: '先秦',
    recommended: 'female'
  },
  {
    value: 'tangshi',
    name: '唐诗',
    description: '盛唐气象，意境深远',
    count: 1922,
    dynasty: '唐代',
    recommended: 'both'
  },
  {
    value: 'songci',
    name: '宋词',
    description: '婉约豪放，词藻华美',
    count: 1334,
    dynasty: '宋代',
    recommended: 'both'
  },
  {
    value: 'yuefu',
    name: '乐府诗集',
    description: '民歌精华，朴实自然',
    count: 1220,
    dynasty: '汉魏六朝',
    recommended: 'both'
  },
  {
    value: 'gushi',
    name: '古诗三百首',
    description: '经典古诗选集',
    count: 1676,
    dynasty: '多朝代',
    recommended: 'both'
  },
  {
    value: 'cifu',
    name: '著名辞赋',
    description: '辞赋文学精华',
    count: 284,
    dynasty: '多朝代',
    recommended: 'both'
  }
];

// 根据性别获取推荐典籍
export function getRecommendedBooks(gender: 'male' | 'female'): PoetryBook[] {
  const books = POETRY_BOOKS.filter(book => 
    book.recommended === gender || book.recommended === 'both'
  );
  
  // 根据传统"男诗经，女楚辞"进行排序
  if (gender === 'male') {
    return books.sort((a, b) => {
      if (a.value === 'shijing') return -1;
      if (b.value === 'shijing') return 1;
      return 0;
    }).map(book => book.value);
  } else {
    return books.sort((a, b) => {
      if (a.value === 'chuci') return -1;
      if (b.value === 'chuci') return 1;
      return 0;
    }).map(book => book.value);
  }
}

// 敏感词列表（与gushi_namer保持一致）
export const BAD_CHARS = [
  '胸', '鬼', '懒', '禽', '鸟', '鸡', '我', '邪', '罪', '凶', '丑', '仇', 
  '鼠', '蟋', '蟀', '淫', '秽', '妹', '狐', '鸡', '鸭', '蝇', '悔', '鱼', 
  '肉', '苦', '犬', '吠', '窥', '血', '丧', '饥', '女', '搔', '父', '母', 
  '昏', '狗', '蟊', '疾', '病', '痛', '死', '潦', '哀', '痒', '害', '蛇', 
  '牲', '妇', '狸', '鹅', '穴', '畜', '烂', '兽', '靡', '爪', '氓', '劫', 
  '鬣', '螽', '毛', '婚', '姻', '匪', '婆', '羞', '辱'
];

// 文本清理配置
export interface TextCleaningConfig {
  removePunctuation: boolean;   // 是否移除标点符号
  filterBadChars: boolean;     // 是否过滤敏感词
  minSentenceLength: number;   // 最小句子长度
  maxNameLength: number;       // 最大名字长度
}

// 默认文本清理配置
export const DEFAULT_CLEANING_CONFIG: TextCleaningConfig = {
  removePunctuation: true,
  filterBadChars: true,
  minSentenceLength: 2,
  maxNameLength: 2
};

// 常用字数据结构
export interface CommonCharData {
  meta: {
    version: string;
    lastUpdated: string;
    description: string;
    totalChars: number;
    minFrequency: number;
    sourceNames: number;
    source: string;
  };
  data: Array<{
    char: string;
    count: number;
  }>;
}