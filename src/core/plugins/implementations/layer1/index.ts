/**
 * Layer 1 插件统一导出
 * 基础输入层插件，包括姓氏、性别、出生时间
 */

export { SurnamePlugin } from './SurnamePlugin';
export { GenderPlugin } from './GenderPlugin';
export { BirthTimePlugin } from './BirthTimePlugin';

// 导出Layer 1插件列表，用于自动注册
export const LAYER1_PLUGINS = [
  'SurnamePlugin',
  'GenderPlugin', 
  'BirthTimePlugin'
] as const;

export type Layer1PluginType = typeof LAYER1_PLUGINS[number];
