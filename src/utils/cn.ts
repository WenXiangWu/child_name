import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind CSS 类名的工具函数
 * 使用 clsx 处理条件类名，使用 tailwind-merge 处理冲突的 Tailwind 类
 * 
 * @param inputs - 类名输入，支持字符串、对象、数组等多种格式
 * @returns 合并后的类名字符串
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4' (px-2 被 px-4 覆盖)
 * cn('text-red-500', { 'text-blue-500': isBlue }) // 根据条件应用类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
