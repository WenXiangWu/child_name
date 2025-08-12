/**
 * Layer 2 插件统一导出
 * 命理基础层插件，包括八字四柱、生肖、五行喜用神
 */

export { BaZiPlugin } from './BaZiPlugin';
export { ZodiacPlugin } from './ZodiacPlugin';
export { XiYongShenPlugin } from './XiYongShenPlugin';

// 导出Layer 2插件列表，用于自动注册
export const LAYER2_PLUGINS = [
  'BaZiPlugin',
  'ZodiacPlugin', 
  'XiYongShenPlugin'
] as const;

export type Layer2PluginType = typeof LAYER2_PLUGINS[number];
