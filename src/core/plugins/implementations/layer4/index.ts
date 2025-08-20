/**
 * Layer 4 字符筛选层插件统一导出
 * 对应文档定义的1个筛选插件
 */

export { CharacterFilterPlugin } from './CharacterFilterPlugin';

export const LAYER4_PLUGINS = [
  'CharacterFilterPlugin'
] as const;

export type Layer4PluginType = typeof LAYER4_PLUGINS[number];
