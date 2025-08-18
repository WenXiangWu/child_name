/**
 * Layer 4 插件导出 - 组合计算层插件
 * 
 * 这一层插件依赖前面层次的结果，进行复杂的组合计算和综合分析
 */

// 三才五格插件
export { SancaiPlugin } from './SancaiPlugin';

// 周易卦象插件
export { YijingPlugin } from './YijingPlugin';

// 大衍数插件
export { DayanPlugin } from './DayanPlugin';

// 五行平衡插件
export { WuxingBalancePlugin } from './WuxingBalancePlugin';

// 名字生成插件
export { NameGenerationPlugin } from './NameGenerationPlugin';

// Layer 4 插件类型联合
export type Layer4PluginType = 
  | 'sancai'
  | 'yijing' 
  | 'dayan'
  | 'wuxing-balance'
  | 'name-generation';

// Layer 4 插件ID列表
export const LAYER4_PLUGIN_IDS: Layer4PluginType[] = [
  'sancai',
  'yijing',
  'dayan', 
  'wuxing-balance',
  'name-generation'
];

// Layer 4 插件元数据
export const LAYER4_METADATA = {
  layer: 4,
  name: '组合计算层',
  description: '基于前层结果进行复杂的组合计算，包括三才五格、周易卦象、大衍数理、五行平衡和最终名字生成',
  pluginCount: 5,
  complexity: 'high',
  dependencies: ['layer1', 'layer2', 'layer3']
} as const;
