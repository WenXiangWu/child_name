/**
 * Layer 5 名字生成层插件统一导出
 * 对应文档定义的1个生成插件
 */

export { NameCombinationPlugin } from './NameCombinationPlugin';

export const LAYER5_PLUGINS = [
  'NameCombinationPlugin'
] as const;

export type Layer5PluginType = typeof LAYER5_PLUGINS[number];
