/**
 * 诗词取名模块入口文件
 */

export * from './types';
export * from './poetry-namer';
export * from './text-processor';
export * from './random';

// 导出主要类和函数
export { PoetryNamer } from './poetry-namer';
export { TextProcessor } from './text-processor';

// 导入PoetryNamer类用于单例
import { PoetryNamer } from './poetry-namer';

// 创建单例实例
let poetryNamerInstance: PoetryNamer | null = null;

/**
 * 获取诗词取名器单例实例
 */
export function getPoetryNamerInstance(): PoetryNamer {
  if (!poetryNamerInstance) {
    poetryNamerInstance = new PoetryNamer();
  }
  return poetryNamerInstance;
}

/**
 * 重置诗词取名器实例（主要用于测试）
 */
export function resetPoetryNamerInstance(): void {
  poetryNamerInstance = null;
}