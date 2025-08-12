// 从core模块重新导出所有需要的函数和类型
export { 
  getQimingInstance,
  QimingDataLoader 
} from '../../core/common/data-loader';

export type { 
  GeneratedName,
  NameGenerationConfig,
  WeightConfig,
  WuxingElement,
  Gender,
  ZodiacAnimal,
  NameValidationResult,
  CharacterInfo,
  WuxingDictionary
} from '../../core/common/types';

export { 
  WuxingScorer 
} from '../../core/analysis/wuxing-scorer';

export { 
  MeaningScorer 
} from '../../core/analysis/meaning-scorer';

export { 
  SocialScorer 
} from '../../core/analysis/social-scorer';

export { 
  PinyinAnalyzer 
} from '../../core/analysis/pinyin-analyzer';

export { 
  weightedScoreCalculator,
  DEFAULT_WEIGHTS 
} from '../../core/calculation/weighted-score-calculator';
export type { ScoreComponents } from '../../core/calculation/weighted-score-calculator';

export { 
  evaluateNumber 
} from '../../core/common/constants';

// 临时导出，这些函数需要实现
export const quickValidateName = async (fullName: string, useTraditional: boolean = false): Promise<any> => {
  // TODO: 实现快速名字验证功能
  console.warn('quickValidateName function not implemented yet');
  return {
    fullName,
    score: 0,
    sancai: { level: 'unknown', description: '未实现' },
    wuge: { total: 0, description: '未实现' }
  };
};

// 临时导出，这些服务需要实现
export const zodiacService = {
  initialize: async () => {
    console.warn('zodiacService.initialize not implemented yet');
  },
  getZodiacByYear: (year: number) => {
    console.warn('zodiacService.getZodiacByYear not implemented yet');
    return null;
  }
};
