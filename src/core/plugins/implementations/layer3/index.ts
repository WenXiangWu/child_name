/**
 * Layer 3 选字策略层插件统一导出
 * 对应文档定义的5个策略插件
 */

export { WuxingSelectionPlugin } from './WuxingSelectionPlugin';
export { ZodiacSelectionPlugin } from './ZodiacSelectionPlugin';
export { MeaningSelectionPlugin } from './MeaningSelectionPlugin';
export { StrokeSelectionPlugin } from './StrokeSelectionPlugin';
export { PhoneticSelectionPlugin } from './PhoneticSelectionPlugin';

export const LAYER3_PLUGINS = [
  'WuxingSelectionPlugin',
  'ZodiacSelectionPlugin', 
  'MeaningSelectionPlugin',
  'StrokeSelectionPlugin',
  'PhoneticSelectionPlugin'
] as const;

export type Layer3PluginType = typeof LAYER3_PLUGINS[number];
