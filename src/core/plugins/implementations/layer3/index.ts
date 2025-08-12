/**
 * Layer 3 插件索引
 * 字符评估层 - 负责单个字符的详细分析和评估
 */

export { StrokePlugin } from './StrokePlugin';
export { WuxingCharPlugin } from './WuxingCharPlugin';
export { ZodiacCharPlugin } from './ZodiacCharPlugin';
export { MeaningPlugin } from './MeaningPlugin';
export { PhoneticPlugin } from './PhoneticPlugin';

// 导出类型定义
export type {
  CharacterStrokeData,
  StrokeCombination,
  SancaiBaseData
} from './StrokePlugin';

export type {
  WuxingElement,
  CharacterWuxingData,
  WuxingCombination,
  WuxingBalance
} from './WuxingCharPlugin';

export type {
  ZodiacAnimal,
  ZodiacCharacterEvaluation,
  ZodiacPreferences,
  DualZodiacAnalysis
} from './ZodiacCharPlugin';

export type {
  CharacterMeaning,
  CulturalDepthAnalysis,
  ModernApplicabilityAnalysis,
  CombinationHarmony
} from './MeaningPlugin';

export type {
  ToneType,
  CharacterPhonetics,
  TonePattern,
  RhythmAnalysis,
  HomophoneRisk,
  PhoneticOptimization
} from './PhoneticPlugin';