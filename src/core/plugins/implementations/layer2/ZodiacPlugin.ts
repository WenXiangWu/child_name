/**
 * 生肖插件 - Layer 2
 * 基于现有ZodiacService实现，处理生肖分析和字符评估
 */

import { 
  NamingPlugin, 
  StandardInput, 
  PluginOutput, 
  PluginContext, 
  ValidationResult,
  PluginMetadata,
  PluginDependency,
  CertaintyLevel,
  PluginConfig
} from '../../interfaces/NamingPlugin';

import { ZodiacService } from '../../../analysis/zodiac-service';
import { ZodiacAnimal, ZodiacCharacterEvaluation } from '../../../common/types';

interface ZodiacAnalysisResult {
  primaryZodiac: ZodiacAnimal;
  fallbackZodiac?: ZodiacAnimal;
  strategy: 'single-zodiac' | 'dual-zodiac' | 'generic';
  confidence: number;
  
  // 生肖信息
  zodiacInfo: {
    animal: ZodiacAnimal;
    element: string;
    traits: string[];
    favorableRadicals: string[];
    unfavorableRadicals: string[];
    favorableCharacters: string[];
    unfavorableCharacters: string[];
  };
  
  // 备选生肖信息（跨年情况）
  fallbackInfo?: {
    animal: ZodiacAnimal;
    element: string;
    traits: string[];
  };
  
  // 综合建议
  recommendations: {
    preferredRadicals: string[];
    avoidedRadicals: string[];
    namingPrinciples: string[];
    riskAssessment?: string;
  };
}

export class ZodiacPlugin implements NamingPlugin {
  readonly id = 'zodiac';
  readonly version = '1.0.0';
  readonly layer = 2;
  readonly dependencies: PluginDependency[] = [
    { pluginId: 'birth-time', required: true }
  ];
  readonly metadata: PluginMetadata = {
    name: '生肖分析插件',
    description: '基于出生时间分析生肖信息，提供生肖相关的命名建议',
    author: 'System',
    category: 'calculation',
    tags: ['zodiac', 'animal', 'characters', 'traditional']
  };

  private config: PluginConfig | null = null;
  private zodiacService: ZodiacService;

  constructor() {
    this.zodiacService = ZodiacService.getInstance();
  }

  /**
   * 初始化插件
   */
  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    this.config = config;
    
    // 初始化生肖服务
    try {
      await this.zodiacService.initialize();
      context.log('info', `生肖插件初始化完成, 版本: ${this.version}`);
    } catch (error) {
      context.log('error', '生肖数据加载失败，将使用简化模式', error);
    }
  }

  /**
   * 处理输入数据
   */
  async process(input: StandardInput): Promise<PluginOutput> {
    const startTime = Date.now();
    const context = input.context;
    
    context.log && context.log('info', '🐲 开始生肖分析');
    
    // 获取出生时间插件的结果
    const timeResult = input.context.pluginResults.get('birth-time');
    if (!timeResult) {
      context.log && context.log('error', '❌ 缺少出生时间信息');
      throw new Error('未找到出生时间插件的结果');
    }

    context.log && context.log('info', '📅 获取出生时间信息', { 
      hasTimeResult: !!timeResult,
      confidence: timeResult.confidence 
    });

    const timeInfo = timeResult.data?.timeInfo;
    if (!timeInfo) {
      context.log && context.log('error', '❌ 出生时间结果格式错误', {
        hasData: !!timeResult.data,
        dataKeys: timeResult.data ? Object.keys(timeResult.data) : [],
        fullResult: timeResult
      });
      throw new Error('出生时间插件结果中缺少timeInfo字段');
    }

    context.log && context.log('info', '⏰ 时间信息分析', {
      type: timeInfo.type,
      year: timeInfo.year,
      hasExactDate: !!(timeInfo.month && timeInfo.day)
    });

    let zodiacAnalysis: ZodiacAnalysisResult;
    
    // 根据时间信息类型进行处理
    if (timeInfo.type === 'exact') {
      context.log && context.log('info', '🎯 执行精确时间生肖分析');
      zodiacAnalysis = await this.processExactTime(timeInfo, context);
    } else if (timeInfo.type === 'predue') {
      context.log && context.log('info', '📊 执行预产期生肖分析');
      zodiacAnalysis = await this.processPredueMode(timeInfo, timeResult, context);
    } else {
      context.log && context.log('error', '❌ 不支持的时间类型', { type: timeInfo.type });
      throw new Error(`不支持的时间信息类型: ${timeInfo.type}`);
    }

    context.log && context.log('info', '✅ 生肖分析完成', {
      primaryZodiac: zodiacAnalysis.primaryZodiac,
      strategy: zodiacAnalysis.strategy,
      confidence: zodiacAnalysis.confidence,
      hasFallback: !!zodiacAnalysis.fallbackZodiac
    });

    const characterGuidance = this.generateCharacterGuidance(zodiacAnalysis);
    
    context.log && context.log('info', '📝 生成字符指导建议', {
      preferredRadicals: zodiacAnalysis.recommendations.preferredRadicals.length,
      avoidedRadicals: zodiacAnalysis.recommendations.avoidedRadicals.length,
      namingPrinciples: zodiacAnalysis.recommendations.namingPrinciples.length
    });

    return {
      success: true,
      data: {
        pluginId: this.id,
        zodiacAnalysis,
        primaryZodiac: zodiacAnalysis.primaryZodiac,
        strategy: zodiacAnalysis.strategy,
        recommendations: zodiacAnalysis.recommendations,
        characterGuidance,
        namingPrinciples: zodiacAnalysis.recommendations.namingPrinciples
      },
      confidence: zodiacAnalysis.confidence,
      executionTime: Date.now() - startTime,
      metadata: {
        processingTime: Date.now() - startTime,
        dataSource: 'zodiac-service',
        analysisMethod: zodiacAnalysis.strategy
      }
    };
  }

  /**
   * 处理确定时间
   */
  private async processExactTime(timeInfo: any, context?: any): Promise<ZodiacAnalysisResult> {
    context && context.log && context.log('info', '🔍 计算确切生肖', { year: timeInfo.year });
    
    const zodiac = this.zodiacService.getZodiacByYear(timeInfo.year);
    
    if (!zodiac) {
      context && context.log && context.log('error', '❌ 生肖计算失败', { year: timeInfo.year });
      throw new Error(`无法计算 ${timeInfo.year} 年的生肖`);
    }
    
    context && context.log && context.log('info', '🐲 生肖确定', { year: timeInfo.year, zodiac });
    
    const zodiacInfo = this.zodiacService.getZodiacInfo(zodiac);
    
    context && context.log && context.log('info', '📋 获取生肖详细信息', {
      zodiac,
      element: zodiacInfo.element,
      traits: zodiacInfo.traits.length,
      favorableRadicals: zodiacInfo.favorable.radicals.length,
      unfavorableRadicals: zodiacInfo.unfavorable.radicals.length
    });
    
    return {
      primaryZodiac: zodiac,
      strategy: 'single-zodiac',
      confidence: 1.0,
      zodiacInfo: {
        animal: zodiac,
        element: zodiacInfo.element,
        traits: zodiacInfo.traits,
        favorableRadicals: zodiacInfo.favorable.radicals,
        unfavorableRadicals: zodiacInfo.unfavorable.radicals,
        favorableCharacters: zodiacInfo.favorable.characters,
        unfavorableCharacters: zodiacInfo.unfavorable.characters
      },
      recommendations: this.generateSingleZodiacRecommendations(zodiacInfo)
    };
  }

  /**
   * 处理预产期模式
   */
  private async processPredueMode(timeInfo: any, timeResult: any, context?: any): Promise<ZodiacAnalysisResult> {
    const { year } = timeInfo;
    context && context.log && context.log('info', '📅 预产期生肖分析', { year });
    
    // 计算可能的生肖
    let possibleZodiacs = timeResult.possibleZodiacs;
    if (!possibleZodiacs || possibleZodiacs.length === 0) {
      context && context.log && context.log('info', '🔄 计算预产期生肖', { year });
      const calculatedZodiac = this.zodiacService.getZodiacByYear(year);
      context && context.log && context.log('info', '✅ 预产期生肖计算完成', { year, zodiac: calculatedZodiac });
      possibleZodiacs = [calculatedZodiac];
    }
    
    // 过滤掉null值
    possibleZodiacs = possibleZodiacs.filter((zodiac: ZodiacAnimal | null): zodiac is ZodiacAnimal => zodiac !== null && zodiac !== undefined);
    
    context && context.log && context.log('info', '🔍 可能生肖过滤', { 
      originalCount: timeResult.possibleZodiacs?.length || 0,
      validCount: possibleZodiacs.length,
      possibleZodiacs 
    });
    
    if (possibleZodiacs.length === 0) {
      context && context.log && context.log('error', '❌ 无有效生肖', { year });
      throw new Error(`无法为 ${year} 年计算有效的生肖`);
    }
    
    if (possibleZodiacs.length === 1) {
      // 单生肖情况
      const zodiac = possibleZodiacs[0];
      context && context.log && context.log('info', '🎯 单生肖模式', { zodiac, confidence: 0.8 });
      
      const zodiacInfo = this.zodiacService.getZodiacInfo(zodiac);
      
      return {
        primaryZodiac: zodiac,
        strategy: 'single-zodiac',
        confidence: 0.8,
        zodiacInfo: {
          animal: zodiac,
          element: zodiacInfo.element,
          traits: zodiacInfo.traits,
          favorableRadicals: zodiacInfo.favorable.radicals,
          unfavorableRadicals: zodiacInfo.unfavorable.radicals,
          favorableCharacters: zodiacInfo.favorable.characters,
          unfavorableCharacters: zodiacInfo.unfavorable.characters
        },
        recommendations: this.generateSingleZodiacRecommendations(zodiacInfo)
      };
    } else {
      // 双生肖情况（跨年）
      const primaryZodiac = possibleZodiacs[0];
      const fallbackZodiac = possibleZodiacs[1];
      const crossesNewYear = timeResult.riskFactors?.crossesNewYear;
      const confidence = crossesNewYear ? 0.6 : 0.7;
      
      context && context.log && context.log('info', '🔀 双生肖模式（跨年）', { 
        primaryZodiac, 
        fallbackZodiac, 
        crossesNewYear,
        confidence 
      });
      
      const primaryInfo = this.zodiacService.getZodiacInfo(primaryZodiac);
      const fallbackInfo = this.zodiacService.getZodiacInfo(fallbackZodiac);
      
      context && context.log && context.log('info', '📊 双生肖信息整合', {
        primary: { zodiac: primaryZodiac, element: primaryInfo.element },
        fallback: { zodiac: fallbackZodiac, element: fallbackInfo.element }
      });
      
      return {
        primaryZodiac,
        fallbackZodiac,
        strategy: 'dual-zodiac',
        confidence,
        zodiacInfo: {
          animal: primaryZodiac,
          element: primaryInfo.element,
          traits: primaryInfo.traits,
          favorableRadicals: primaryInfo.favorable.radicals,
          unfavorableRadicals: primaryInfo.unfavorable.radicals,
          favorableCharacters: primaryInfo.favorable.characters,
          unfavorableCharacters: primaryInfo.unfavorable.characters
        },
        fallbackInfo: {
          animal: fallbackZodiac,
          element: fallbackInfo.element,
          traits: fallbackInfo.traits
        },
        recommendations: this.generateDualZodiacRecommendations(primaryInfo, fallbackInfo)
      };
    }
  }

  /**
   * 生成单生肖建议
   */
  private generateSingleZodiacRecommendations(zodiacInfo: any) {
    return {
      preferredRadicals: zodiacInfo.favorable.radicals,
      avoidedRadicals: zodiacInfo.unfavorable.radicals,
      namingPrinciples: [
        `${zodiacInfo.name}年生人，宜用${zodiacInfo.favorable.radicals.slice(0, 3).join('、')}等偏旁`,
        `避免使用${zodiacInfo.unfavorable.radicals.slice(0, 3).join('、')}等偏旁`,
        `可选用${zodiacInfo.favorable.characters.slice(0, 5).join('、')}等字`,
        `性格特点：${zodiacInfo.traits.slice(0, 3).join('、')}`
      ]
    };
  }

  /**
   * 生成双生肖建议
   */
  private generateDualZodiacRecommendations(primaryInfo: any, fallbackInfo: any) {
    // 找出两个生肖的共同喜用偏旁
    const commonFavorable = primaryInfo.favorable.radicals.filter(
      (radical: string) => fallbackInfo.favorable.radicals.includes(radical)
    );
    
    // 找出两个生肖都忌讳的偏旁
    const commonUnfavorable = primaryInfo.unfavorable.radicals.filter(
      (radical: string) => fallbackInfo.unfavorable.radicals.includes(radical)
    );
    
    return {
      preferredRadicals: commonFavorable.length > 0 ? commonFavorable : primaryInfo.favorable.radicals,
      avoidedRadicals: commonUnfavorable.length > 0 ? commonUnfavorable : primaryInfo.unfavorable.radicals,
      namingPrinciples: [
        `跨年生人，主要按${primaryInfo.name}年处理，备选${fallbackInfo.name}年`,
        commonFavorable.length > 0 
          ? `优选共同喜用偏旁：${commonFavorable.slice(0, 3).join('、')}`
          : `优先使用${primaryInfo.name}年喜用偏旁：${primaryInfo.favorable.radicals.slice(0, 3).join('、')}`,
        commonUnfavorable.length > 0
          ? `避免共同忌讳偏旁：${commonUnfavorable.slice(0, 3).join('、')}`
          : `避免${primaryInfo.name}年忌讳偏旁：${primaryInfo.unfavorable.radicals.slice(0, 3).join('、')}`,
        '建议选择保守稳妥的字符组合'
      ],
      riskAssessment: '跨年生肖存在不确定性，建议出生后根据确切时间调整'
    };
  }

  /**
   * 生成字符指导
   */
  private generateCharacterGuidance(zodiacAnalysis: ZodiacAnalysisResult) {
    return {
      favorableTypes: [
        `含${zodiacAnalysis.zodiacInfo.favorableRadicals.slice(0, 3).join('、')}偏旁的字`,
        `寓意${zodiacAnalysis.zodiacInfo.traits.slice(0, 2).join('、')}的字`,
        `五行属${zodiacAnalysis.zodiacInfo.element}的字`
      ],
      unfavorableTypes: [
        `含${zodiacAnalysis.zodiacInfo.unfavorableRadicals.slice(0, 3).join('、')}偏旁的字`,
        `与${zodiacAnalysis.primaryZodiac}生肖相冲的字`
      ],
      recommendations: zodiacAnalysis.strategy === 'dual-zodiac' 
        ? ['优选两生肖共同适宜的字符', '避免任一生肖的忌讳字符', '可适当偏向主生肖的喜好']
        : ['按生肖喜忌选择偏旁部首', '结合生肖特性选择寓意', '考虑生肖五行属性']
    };
  }

  /**
   * 评估字符适宜性
   */
  evaluateCharacterForZodiac(character: string, zodiac?: ZodiacAnimal): ZodiacCharacterEvaluation | null {
    try {
      const targetZodiac = zodiac || this.getDefaultZodiac();
      if (!targetZodiac) return null;
      
      return this.zodiacService.evaluateCharacterForZodiac(character, targetZodiac);
    } catch (error) {
      console.warn('字符生肖评估失败:', error);
      return null;
    }
  }

  /**
   * 批量评估字符
   */
  evaluateCharacters(characters: string[], zodiac?: ZodiacAnimal): ZodiacCharacterEvaluation[] {
    return characters.map(char => this.evaluateCharacterForZodiac(char, zodiac))
                   .filter(Boolean) as ZodiacCharacterEvaluation[];
  }

  /**
   * 获取默认生肖（用于测试）
   */
  private getDefaultZodiac(): ZodiacAnimal | null {
    try {
      const currentYear = new Date().getFullYear();
      return this.zodiacService.getZodiacByYear(currentYear);
    } catch {
      return null;
    }
  }

  /**
   * 验证输入数据
   */
  validate(input: StandardInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查是否有出生时间依赖
    if (!input.context.pluginResults.has('birth-time')) {
      errors.push('生肖分析需要出生时间插件的结果');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 销毁插件，清理资源
   */
  async destroy(): Promise<void> {
    console.log('生肖插件销毁完成');
  }

  /**
   * 检查插件是否可用
   */
  isAvailable(): boolean {
    return this.zodiacService !== null;
  }

  /**
   * 获取插件健康状态
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    message: string;
    lastCheck: number;
  } {
    const isHealthy = this.config !== null && this.zodiacService !== null;
    
    return {
      status: isHealthy ? 'healthy' : 'degraded',
      message: isHealthy ? '插件运行正常' : '插件未完全初始化',
      lastCheck: Date.now()
    };
  }
}
