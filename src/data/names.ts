// 名字数据库
// 实际项目中，这些数据应该存储在数据库中，这里仅作为示例

export interface NameData {
  character: string;
  pinyin: string;
  meaning: string;
  gender: 'male' | 'female' | 'both';
  popularity: number; // 1-100
  strokes: number;
  fiveElements?: '金' | '木' | '水' | '火' | '土';
}

// 常用字库
export const commonCharacters: NameData[] = [
  // 男孩常用字
  { character: '浩', pinyin: 'hào', meaning: '广大、众多、盛大', gender: 'male', popularity: 85, strokes: 10, fiveElements: '水' },
  { character: '宇', pinyin: 'yǔ', meaning: '宇宙、空间', gender: 'male', popularity: 80, strokes: 6, fiveElements: '土' },
  { character: '轩', pinyin: 'xuān', meaning: '高大、气度不凡', gender: 'male', popularity: 78, strokes: 7, fiveElements: '木' },
  { character: '睿', pinyin: 'ruì', meaning: '聪明、有智慧', gender: 'male', popularity: 75, strokes: 14, fiveElements: '火' },
  { character: '博', pinyin: 'bó', meaning: '博学、渊博', gender: 'male', popularity: 72, strokes: 12, fiveElements: '水' },
  { character: '文', pinyin: 'wén', meaning: '文采、文雅', gender: 'both', popularity: 68, strokes: 4, fiveElements: '水' },
  { character: '子', pinyin: 'zǐ', meaning: '智者、君子', gender: 'male', popularity: 65, strokes: 3, fiveElements: '水' },
  { character: '涵', pinyin: 'hán', meaning: '包容、涵养', gender: 'both', popularity: 62, strokes: 11, fiveElements: '水' },
  { character: '瑞', pinyin: 'ruì', meaning: '吉祥、好预兆', gender: 'both', popularity: 60, strokes: 13, fiveElements: '金' },
  { character: '泽', pinyin: 'zé', meaning: '恩泽、润泽', gender: 'male', popularity: 58, strokes: 8, fiveElements: '水' },
  
  // 女孩常用字
  { character: '雅', pinyin: 'yǎ', meaning: '文雅、高雅', gender: 'female', popularity: 88, strokes: 12, fiveElements: '木' },
  { character: '婷', pinyin: 'tíng', meaning: '美好、亭亭玉立', gender: 'female', popularity: 86, strokes: 12, fiveElements: '火' },
  { character: '怡', pinyin: 'yí', meaning: '愉快、和悦', gender: 'female', popularity: 82, strokes: 8, fiveElements: '木' },
  { character: '欣', pinyin: 'xīn', meaning: '快乐、欢欣', gender: 'female', popularity: 78, strokes: 8, fiveElements: '金' },
  { character: '瑶', pinyin: 'yáo', meaning: '美玉、珍贵', gender: 'female', popularity: 75, strokes: 13, fiveElements: '金' },
  { character: '诗', pinyin: 'shī', meaning: '诗意、文学', gender: 'female', popularity: 72, strokes: 8, fiveElements: '金' },
  { character: '梦', pinyin: 'mèng', meaning: '理想、梦想', gender: 'female', popularity: 70, strokes: 11, fiveElements: '木' },
  { character: '静', pinyin: 'jìng', meaning: '安静、文静', gender: 'female', popularity: 68, strokes: 14, fiveElements: '金' },
  { character: '嫣', pinyin: 'yān', meaning: '美好、娇艳', gender: 'female', popularity: 65, strokes: 14, fiveElements: '土' },
  { character: '语', pinyin: 'yǔ', meaning: '言语、表达', gender: 'female', popularity: 62, strokes: 9, fiveElements: '木' },
  
  // 通用字
  { character: '安', pinyin: 'ān', meaning: '平安、安宁', gender: 'both', popularity: 80, strokes: 6, fiveElements: '土' },
  { character: '佳', pinyin: 'jiā', meaning: '美好、优秀', gender: 'both', popularity: 78, strokes: 8, fiveElements: '木' },
  { character: '雨', pinyin: 'yǔ', meaning: '雨水、恩泽', gender: 'both', popularity: 75, strokes: 8, fiveElements: '水' },
  { character: '宁', pinyin: 'níng', meaning: '安宁、平静', gender: 'both', popularity: 72, strokes: 5, fiveElements: '火' },
  { character: '和', pinyin: 'hé', meaning: '和睦、和谐', gender: 'both', popularity: 70, strokes: 8, fiveElements: '金' },
];

// 诗词来源信息
export interface PoetrySource {
  type: 'poetry';
  book: string;           // 典籍名称
  title: string;          // 作品标题
  author: string | null;  // 作者
  dynasty: string;        // 朝代
  sentence: string;       // 来源句子
  highlightedSentence: string; // 高亮句子
  content: string;        // 完整内容
}

// 名字组合推荐
export interface NameCombination {
  firstName: string;
  secondName: string;
  thirdName?: string;     // 第三个字（可选，用于三字名）
  meaning: string;
  gender: 'male' | 'female';
  popularity: number;
  fullName?: string;      // 完整姓名
  familyName?: string;    // 姓氏
  source?: PoetrySource;  // 诗词来源信息（可选）
}

export const nameRecommendations: NameCombination[] = [
  // 男孩名推荐
  { firstName: '浩', secondName: '然', meaning: '宽广、正大、光明磊落', gender: 'male', popularity: 65 },
  { firstName: '睿', secondName: '轩', meaning: '聪明、智慧、气宇轩昂', gender: 'male', popularity: 78 },
  { firstName: '子', secondName: '墨', meaning: '有学识、有才华、有深度', gender: 'male', popularity: 45 },
  { firstName: '宇', secondName: '辰', meaning: '如宇宙般广阔、如晨曦般光明', gender: 'male', popularity: 58 },
  { firstName: '锦', secondName: '程', meaning: '前程似锦、未来美好', gender: 'male', popularity: 35 },
  { firstName: '博', secondName: '文', meaning: '博学多识、文采斐然', gender: 'male', popularity: 62 },
  { firstName: '泽', secondName: '宇', meaning: '恩泽广被、胸怀宇宙', gender: 'male', popularity: 48 },
  { firstName: '皓', secondName: '轩', meaning: '光明磊落、气宇轩昂', gender: 'male', popularity: 72 },
  { firstName: '志', secondName: '远', meaning: '志向远大、抱负不凡', gender: 'male', popularity: 55 },
  { firstName: '明', secondName: '哲', meaning: '聪明睿智、通达事理', gender: 'male', popularity: 40 },
  
  // 女孩名推荐
  { firstName: '梦', secondName: '瑶', meaning: '如梦似幻、美玉般纯洁', gender: 'female', popularity: 72 },
  { firstName: '语', secondName: '嫣', meaning: '能言善辩、温婉美丽', gender: 'female', popularity: 48 },
  { firstName: '欣', secondName: '怡', meaning: '开心快乐、温和优雅', gender: 'female', popularity: 68 },
  { firstName: '诗', secondName: '涵', meaning: '如诗如画、包容深厚', gender: 'female', popularity: 53 },
  { firstName: '雨', secondName: '桐', meaning: '滋润万物、坚韧挺拔', gender: 'female', popularity: 32 },
  { firstName: '佳', secondName: '琪', meaning: '美好、珍贵如玉', gender: 'female', popularity: 65 },
  { firstName: '静', secondName: '怡', meaning: '文静优雅、心情愉悦', gender: 'female', popularity: 58 },
  { firstName: '雅', secondName: '婷', meaning: '高雅、亭亭玉立', gender: 'female', popularity: 75 },
  { firstName: '芸', secondName: '熙', meaning: '文雅、光明美好', gender: 'female', popularity: 42 },
  { firstName: '思', secondName: '颖', meaning: '思想灵敏、聪明伶俐', gender: 'female', popularity: 63 },
];

// 根据性别获取推荐名字
export function getRecommendedNames(gender: 'male' | 'female', count: number = 5): NameCombination[] {
  const filteredNames = nameRecommendations.filter(name => name.gender === gender);
  // 随机选择指定数量的名字
  return filteredNames.sort(() => 0.5 - Math.random()).slice(0, count);
}