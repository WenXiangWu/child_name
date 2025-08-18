/**
 * qiming项目常量定义
 * 从constants.py转换而来，保持完全一致
 */

// 三才五格数理分类常量

// 吉祥运暗示数（代表健全,幸福,名誉等）
export const SANCAI_JIXIANG = [
  1, 3, 5, 7, 8, 11, 13, 15, 16, 18, 21, 23, 24, 25, 31, 32, 33, 35, 37, 39, 41, 45, 47, 48, 52, 57, 61, 63, 65, 67, 68, 81
];

// 次吉祥运暗示数（代表多少有些障碍，但能获得吉运）
export const SANCAI_XIAOJI = [
  6, 17, 26, 27, 29, 30, 38, 49, 51, 55, 58, 71, 73, 75
];

// 凶数运暗示数（代表逆境,沉浮,薄弱,病难,困难,多灾等）
export const SANCAI_XIONG = [
  2, 4, 9, 10, 12, 14, 19, 20, 22, 28, 34, 36, 40, 42, 43, 44, 46, 50, 53, 54, 56, 59, 60, 62, 64, 66, 69, 70, 72, 74, 76, 77, 78, 79, 80
];

// 首领运暗示数（智慧仁勇全备,立上位,能领导众人）
export const SANCAI_WISE = [
  3, 13, 16, 21, 23, 29, 31, 37, 39, 41, 45, 47
];

// 财富运暗示数（多钱财,富贵,白手可获巨财）
export const SANCAI_WEALTH = [
  15, 16, 24, 29, 32, 33, 41, 52
];

// 艺能运暗示数（富有艺术天才，对审美,艺术,演艺,体育有通达之能）
export const SANCAI_ARTIST = [
  13, 14, 18, 26, 29, 33, 35, 38, 48
];

// 女德运暗示数（具有妇德，品性温良，助夫爱子）
export const SANCAI_GOODWIFE = [
  5, 6, 11, 13, 15, 16, 24, 32, 35
];

// 女性孤寡运暗示数（难觅夫君，家庭不和，夫妻两虎相斗，离婚，严重者夫妻一方早亡）
export const SANCAI_DEATH = [
  21, 23, 26, 28, 29, 33, 39
];

// 孤独运暗示数（妻凌夫或夫克妻）
export const SANCAI_ALONE = [
  4, 10, 12, 14, 22, 28, 34
];

// 双妻运暗示数
export const SANCAI_MERRY = [
  5, 6, 15, 16, 32, 39, 41
];

// 刚情运暗示数（性刚固执,意气用事）
export const SANCAI_STUBBORN = [
  7, 17, 18, 25, 27, 28, 37, 47
];

// 温和运暗示数（性情平和,能得上下信望）
export const SANCAI_GENTLE = [
  5, 6, 11, 15, 16, 24, 31, 32, 35
];

// 参考好的数字组合
export const REFER_GOOD_NUM_LIST = [
  SANCAI_JIXIANG, SANCAI_XIAOJI, SANCAI_WISE, SANCAI_WEALTH, 
  SANCAI_ARTIST, SANCAI_GOODWIFE, SANCAI_MERRY, SANCAI_GENTLE
];

// 自己设定的好的搭配
export const GOOD_NUM_LIST = [
  SANCAI_JIXIANG, SANCAI_WISE, SANCAI_WEALTH, SANCAI_ARTIST, 
  SANCAI_GOODWIFE, SANCAI_MERRY, SANCAI_GENTLE
];

// 参考坏的搭配
export const REFER_BAD_NUM_LIST = [
  SANCAI_XIONG, SANCAI_DEATH, SANCAI_ALONE, SANCAI_STUBBORN
];

// 自己设定的坏的搭配
export const BAD_NUM_LIST = [
  SANCAI_XIONG, SANCAI_DEATH, SANCAI_ALONE
];

// 计算好数字集合 - 对应Python的good_num_set
const flattenArray = (arr: number[][]): number[] => arr.flat();
export const GOOD_NUM_SET = new Set(flattenArray(GOOD_NUM_LIST));

// 计算坏数字集合 - 对应Python的bad_num_set
export const BAD_NUM_SET = new Set(flattenArray(BAD_NUM_LIST));

// 筛选出有好没坏的三才五格数字 - 对应Python的best_num_set
export const BEST_NUM_SET = Array.from(GOOD_NUM_SET).filter(x => !BAD_NUM_SET.has(x));

// 其他常量
export const RESULT_UNKNOWN = '结果未知';

// 五行相关常量
export const WUXING_ELEMENTS = ['金', '木', '水', '火', '土'] as const;

// 数字到五行的映射（取个位数）
export const NUMBER_TO_WUXING: Record<number, string> = {
  1: '木',    // 甲乙木
  2: '木',
  3: '火',   // 丙丁火
  4: '火',
  5: '土',    // 戊己土
  6: '土',
  7: '金',   // 庚辛金
  8: '金',
  9: '水',  // 壬癸水
  0: '水'
};

// qiming中的优美声调组合
export const GOOD_TONE_COMBINATIONS: [number, number][] = [
  [4, 2], // 百度
  [4, 1],
  [4, 3],
  [3, 2], // 百度
  [3, 4],
  [1, 4],
  [1, 3],
];

// 默认配置值 - 对应qiming的config.py中的默认值
export const DEFAULT_CONFIG = {
  MIN_SINGLE_NUM: 2,          // 对应qiming的MIN_SINGLE_NUM = 2
  MAX_SINGLE_NUM: 20,         // 对应qiming的MAX_SINGLE_NUM = 20
  THRESHOLD_SCORE: 65,        // 对应qiming的THRESHOLD_SCORE = 65
  USE_TRADITIONAL: false,
  SPECIFIC_BEST: false,
};

// 导出工具函数
// 注意：qiming使用的是best_num_set（有好没坏的数字），不是good_num_set
export const isLuckyNumber = (num: number): boolean => BEST_NUM_SET.includes(num);
export const isUnluckyNumber = (num: number): boolean => BAD_NUM_SET.has(num);
export const isBestNumber = (num: number): boolean => BEST_NUM_SET.includes(num);

// 获取数字的五行属性
export const getNumberWuxing = (num: number): string => {
  const lastDigit = num % 10;
  return NUMBER_TO_WUXING[lastDigit] || 'unknown';
};

// 评估数字的吉凶等级
export const evaluateNumber = (num: number): string => {
  if (SANCAI_JIXIANG.includes(num)) return '大吉';
  if (SANCAI_XIAOJI.includes(num)) return '次吉';
  if (SANCAI_XIONG.includes(num)) return '凶';
  return '中性';
};

// 数字分类检查
export const getNumberCategories = (num: number): string[] => {
  const categories: string[] = [];
  
  if (SANCAI_JIXIANG.includes(num)) categories.push('吉祥运');
  if (SANCAI_XIAOJI.includes(num)) categories.push('次吉祥运');
  if (SANCAI_XIONG.includes(num)) categories.push('凶数运');
  if (SANCAI_WISE.includes(num)) categories.push('首领运');
  if (SANCAI_WEALTH.includes(num)) categories.push('财富运');
  if (SANCAI_ARTIST.includes(num)) categories.push('艺能运');
  if (SANCAI_GOODWIFE.includes(num)) categories.push('女德运');
  if (SANCAI_DEATH.includes(num)) categories.push('女性孤寡运');
  if (SANCAI_ALONE.includes(num)) categories.push('孤独运');
  if (SANCAI_MERRY.includes(num)) categories.push('双妻运');
  if (SANCAI_STUBBORN.includes(num)) categories.push('刚情运');
  if (SANCAI_GENTLE.includes(num)) categories.push('温和运');
  
  return categories;
};