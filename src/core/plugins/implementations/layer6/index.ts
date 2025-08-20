/**
 * Layer 6 名字评分层插件统一导出
 * 对应文档定义的5个评分插件
 */

export { SancaiScoringPlugin } from './SancaiScoringPlugin';
export { PhoneticScoringPlugin } from './PhoneticScoringPlugin';
export { WuxingBalanceScoringPlugin } from './WuxingBalanceScoringPlugin';
export { DayanScoringPlugin } from './DayanScoringPlugin';
export { ComprehensiveScoringPlugin } from './ComprehensiveScoringPlugin';

export const LAYER6_PLUGINS = [
  'SancaiScoringPlugin',
  'PhoneticScoringPlugin',
  'WuxingBalanceScoringPlugin', 
  'DayanScoringPlugin',
  'ComprehensiveScoringPlugin'
] as const;

export type Layer6PluginType = typeof LAYER6_PLUGINS[number];
