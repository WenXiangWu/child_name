/**
 * 随机数工具模块
 * 复制自gushi_namer的rand.js逻辑
 */

/**
 * 从数组中随机选择一个元素
 * @param arr 目标数组
 * @returns 随机选择的元素
 */
export function choose<T>(arr: T[]): T {
  const index = between(0, arr.length);
  return arr[index];
}

/**
 * 生成指定范围内的随机整数
 * @param min 最小值（包含）
 * @param max 最大值（不包含）
 * @returns 随机整数
 */
export function between(min: number, max: number): number {
  // max is not included
  return min + Math.floor(Math.random() * (max - min));
}

/**
 * 随机打乱数组顺序
 * @param arr 目标数组
 * @returns 打乱后的新数组
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 从数组中随机选择多个不重复的元素
 * @param arr 目标数组
 * @param count 选择数量
 * @returns 随机选择的元素数组
 */
export function chooseMultiple<T>(arr: T[], count: number): T[] {
  if (count >= arr.length) {
    return shuffle(arr);
  }
  
  const shuffled = shuffle(arr);
  return shuffled.slice(0, count);
}

export default {
  choose,
  between,
  shuffle,
  chooseMultiple
};