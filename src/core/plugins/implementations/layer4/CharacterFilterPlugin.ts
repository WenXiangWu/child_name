/**
 * 综合字符筛选插件
 * Layer 4: 字符筛选层
 * 
 * 功能：基于Layer 3策略结果，进行综合字符筛选和候选字符池构建
 * 依赖：Layer 3 所有策略插件
 */

import { Layer4Plugin, PluginConfig, PluginContext, StandardInput, PluginOutput, ValidationResult } from '../../interfaces/NamingPlugin';
import { UnifiedCharacterLoader, UnifiedCharacterInfo } from '../../data/UnifiedCharacterLoader';

export class CharacterFilterPlugin implements Layer4Plugin {
  readonly id = 'character-filter';
  readonly version = '1.0.0';
  readonly layer = 4 as const;
  readonly category = 'filtering' as const;
  readonly dependencies = [
    { pluginId: 'wuxing-selection', required: true },
    { pluginId: 'zodiac-selection', required: false },
    { pluginId: 'meaning-selection', required: false },
    { pluginId: 'stroke-selection', required: true },
    { pluginId: 'phonetic-selection', required: false }
  ];
  readonly metadata = {
    name: '综合字符筛选插件',
    description: '基于前层策略分析结果，进行综合的字符筛选和候选字符池构建',
    author: 'Qiming Plugin System',
    category: 'filtering' as const,
    tags: ['filtering', 'character-selection', 'comprehensive', 'candidate-pool']
  };

  private initialized = false;
  private charLoader: UnifiedCharacterLoader;

  constructor() {
    this.charLoader = UnifiedCharacterLoader.getInstance();
  }

  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    try {
      // 初始化UnifiedCharacterLoader
      await this.charLoader.initialize();
      context.log?.('info', 'UnifiedCharacterLoader初始化完成');
      
      this.initialized = true;
      context.log?.('info', `${this.id} 插件初始化成功`);
    } catch (error) {
      context.log?.('error', `${this.id} 插件初始化失败: ${error}`);
      throw error;
    }
  }

  async validate(input: StandardInput): Promise<ValidationResult> {
    if (!input.familyName) {
      return {
        valid: false,
        errors: ['缺少姓氏信息']
      };
    }
    return { valid: true, errors: [] };
  }

  async process(input: StandardInput, context: PluginContext): Promise<PluginOutput> {
    const startTime = Date.now();
    
    try {
      if (!this.initialized) {
        throw new Error('插件未初始化');
      }

      context.log?.('info', '开始综合字符筛选');
      
      // Step 1: 获取Layer 3所有策略结果 (模拟)
      const strategyResults = await this.getStrategyResults(context);
      
      // Step 2: 执行分层筛选
      const filteredCandidates = await this.executeLayeredFiltering(strategyResults, input, context);
      
      // Step 3: 构建最终候选字符池
      const candidatePool = this.buildCandidatePool(filteredCandidates);
      
      // Step 4: 生成筛选总结
      const filteringSummary = this.generateFilteringSummary(candidatePool);
      
      const result = {
        candidatePool,
        filteringSummary,
        strategyApplication: {
          wuxingFilter: filteredCandidates.wuxingFiltered.length,
          zodiacFilter: filteredCandidates.zodiacFiltered.length,
          meaningFilter: filteredCandidates.meaningFiltered.length,
          strokeFilter: filteredCandidates.strokeFiltered.length,
          phoneticFilter: filteredCandidates.phoneticFiltered.length
        },
        confidence: this.calculateOverallConfidence(filteredCandidates)
      };

      return {
        success: true,
        data: result,
        confidence: result.confidence,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      context.log?.('error', `字符筛选失败: ${error}`);
      return {
        success: false,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * 获取Layer 3策略结果 - 模拟
   * TODO: 从实际的插件上下文获取
   */
  private async getStrategyResults(context: PluginContext) {
    // 模拟从Layer 3插件获取策略结果
    return {
      wuxingStrategy: {
        primaryElements: ['金'],
        secondaryElements: ['水'], 
        avoidElements: ['火', '土'],
        priority: [
          { element: '金', priority: 95, targetCount: 1 },
          { element: '水', priority: 85, targetCount: 1 }
        ]
      },
      zodiacStrategy: {
        highlyRecommended: { characters: ['宸', '宏', '君', '哲', '启'], weight: 2.0 },
        recommended: { characters: ['林', '森', '柏', '松'], weight: 1.0 },
        discouraged: { characters: ['明', '昌', '晨', '阳'], penalty: -1.0 }
      },
      meaningStrategy: {
        preferredSemantics: ['智慧才华', '品德修养'],
        culturalDepth: 0.85,
        genderSpecificity: 0.9
      },
      strokeStrategy: {
        doubleCharBest: [[9, 16], [11, 14], [13, 12]],
        singleCharBest: [9, 11, 13, 15],
        recommendedType: 'doubleChar'
      },
      phoneticStrategy: {
        preferredTonePatterns: ['2-1-4', '1-3-4', '4-2-1'],
        avoidedTonePatterns: ['2-2-2', '4-4-4'],
        harmonyThreshold: 80
      }
    };
  }

  /**
   * 执行分层筛选
   */
  private async executeLayeredFiltering(strategyResults: any, input: StandardInput, context: PluginContext) {
    // 初始字符池 - 从UnifiedCharacterLoader获取
    const initialPool = await this.getInitialCharacterPool();
    
    // 1. 五行筛选
    const wuxingFiltered = this.applyWuxingFilter(initialPool, strategyResults.wuxingStrategy);
    
    // 2. 生肖筛选
    const zodiacFiltered = this.applyZodiacFilter(wuxingFiltered, strategyResults.zodiacStrategy);
    
    // 3. 寓意筛选
    const meaningFiltered = this.applyMeaningFilter(zodiacFiltered, strategyResults.meaningStrategy);
    
    // 4. 笔画筛选
    const strokeFiltered = this.applyStrokeFilter(meaningFiltered, strategyResults.strokeStrategy);
    
    // 5. 音韵筛选
    const phoneticFiltered = this.applyPhoneticFilter(strokeFiltered, strategyResults.phoneticStrategy, input.familyName);
    
    return {
      initial: initialPool,
      wuxingFiltered,
      zodiacFiltered,
      meaningFiltered,
      strokeFiltered,
      phoneticFiltered
    };
  }

  /**
   * 获取初始字符池 - 从UnifiedCharacterLoader获取
   */
  private async getInitialCharacterPool() {
    // 常用起名候选字符列表
    const candidateChars = ['钦', '宣', '润', '锦', '浩', '铭', '峰', '磊', '森', '林'];
    
    const characterPool = [];
    
    for (const char of candidateChars) {
      try {
        const charInfo = await this.charLoader.getCharacterInfo(char);
        
        // 只选择适合起名的字符
        if (charInfo.isStandard && charInfo.isNamingRecommended) {
          characterPool.push({
            char: charInfo.char,
            strokes: charInfo.strokes.traditional, // ⚠️ 使用传统笔画数
            wuxing: charInfo.wuxing,
            meaning: charInfo.meanings.join('，'),
            tone: charInfo.tone,
            radical: charInfo.radical,
            culturalLevel: charInfo.culturalLevel,
            confidence: charInfo.dataQuality.confidence
          });
        }
      } catch (error) {
        console.warn(`获取字符${char}信息失败:`, error);
      }
    }
    
    return characterPool;
  }

  /**
   * 应用五行筛选
   */
  private applyWuxingFilter(characters: any[], wuxingStrategy: any) {
    const preferredElements = [...wuxingStrategy.primaryElements, ...wuxingStrategy.secondaryElements];
    
    return characters.filter(char => {
      const isPreferred = preferredElements.includes(char.wuxing);
      const isAvoided = wuxingStrategy.avoidElements.includes(char.wuxing);
      
      return isPreferred && !isAvoided;
    }).map(char => ({
      ...char,
      wuxingScore: wuxingStrategy.primaryElements.includes(char.wuxing) ? 95 : 85
    }));
  }

  /**
   * 应用生肖筛选
   */
  private applyZodiacFilter(characters: any[], zodiacStrategy: any) {
    return characters.map(char => {
      let zodiacScore = 70; // 基础分数
      
      if (zodiacStrategy.highlyRecommended.characters.includes(char.char)) {
        zodiacScore = 95;
      } else if (zodiacStrategy.recommended.characters.includes(char.char)) {
        zodiacScore = 85;
      } else if (zodiacStrategy.discouraged.characters.includes(char.char)) {
        zodiacScore = 40;
      }
      
      return { ...char, zodiacScore };
    }).filter(char => char.zodiacScore >= 60); // 过滤低分字符
  }

  /**
   * 应用寓意筛选
   */
  private applyMeaningFilter(characters: any[], meaningStrategy: any) {
    return characters.map(char => {
      let meaningScore = 70;
      
      // 基于字义判断 (简化实现)
      if (char.meaning.includes('智慧') || char.meaning.includes('才华')) {
        meaningScore = 90;
      } else if (char.meaning.includes('品德') || char.meaning.includes('修养')) {
        meaningScore = 88;
      } else if (char.meaning.includes('美好') || char.meaning.includes('吉祥')) {
        meaningScore = 85;
      }
      
      return { ...char, meaningScore };
    }).filter(char => char.meaningScore >= 70);
  }

  /**
   * 应用笔画筛选
   */
  private applyStrokeFilter(characters: any[], strokeStrategy: any) {
    const targetStrokes = strokeStrategy.doubleCharBest.flat();
    
    return characters.filter(char => 
      targetStrokes.includes(char.strokes)
    ).map(char => ({
      ...char,
      strokeScore: strokeStrategy.doubleCharBest.some(combo => combo.includes(char.strokes)) ? 95 : 80
    }));
  }

  /**
   * 应用音韵筛选
   */
  private applyPhoneticFilter(characters: any[], phoneticStrategy: any, familyName: string) {
    // 模拟姓氏音调 (如"吴" = 2声)
    const surnametone = 2;
    
    return characters.map(char => {
      let phoneticScore = 70;
      
      // 简化的声调和谐度计算
      const tonePattern = `${surnametone}-${char.tone}`;
      if (phoneticStrategy.preferredTonePatterns.some((pattern: string) => pattern.includes(tonePattern))) {
        phoneticScore = 90;
      } else if (phoneticStrategy.avoidedTonePatterns.includes(`${surnametone}-${char.tone}`)) {
        phoneticScore = 50;
      }
      
      return { ...char, phoneticScore };
    }).filter(char => char.phoneticScore >= phoneticStrategy.harmonyThreshold - 10);
  }

  /**
   * 构建候选字符池
   */
  private buildCandidatePool(filteredCandidates: any) {
    const finalCandidates = filteredCandidates.phoneticFiltered;
    
    // 分为第一字和第二字候选
    const firstCharCandidates = finalCandidates
      .filter((char: any) => char.strokes === 9)
      .map((char: any) => this.formatCandidateCharacter(char));
    
    const secondCharCandidates = finalCandidates
      .filter((char: any) => char.strokes === 16)
      .map((char: any) => this.formatCandidateCharacter(char));
    
    return {
      firstCharCandidates,
      secondCharCandidates
    };
  }

  /**
   * 格式化候选字符
   */
  private formatCandidateCharacter(char: any) {
    const overallScore = (
      (char.wuxingScore || 70) * 0.3 +
      (char.zodiacScore || 70) * 0.2 +
      (char.meaningScore || 70) * 0.2 +
      (char.strokeScore || 70) * 0.15 +
      (char.phoneticScore || 70) * 0.15
    );
    
    return {
      character: char.char,
      scores: {
        wuxing: char.wuxingScore || 70,
        zodiac: char.zodiacScore || 70,
        meaning: char.meaningScore || 70,
        stroke: char.strokeScore || 70,
        phonetic: char.phoneticScore || 70,
        overall: Math.round(overallScore * 10) / 10
      },
      metadata: {
        strokes: char.strokes,
        wuxing: char.wuxing,
        meaning: char.meaning,
        tone: char.tone,
        radical: char.radical,
        culturalLevel: this.calculateCulturalLevel(char)
      }
    };
  }

  /**
   * 计算文化内涵水平
   */
  private calculateCulturalLevel(char: any): number {
    let level = 70;
    
    // 基于字义评估文化水平
    if (char.meaning.includes('德') || char.meaning.includes('智')) level += 15;
    if (char.meaning.includes('雅') || char.meaning.includes('文')) level += 10;
    if (char.meaning.includes('美') || char.meaning.includes('善')) level += 5;
    
    return Math.min(level, 95);
  }

  /**
   * 生成筛选总结
   */
  private generateFilteringSummary(candidatePool: any) {
    const totalCandidates = candidatePool.firstCharCandidates.length + candidatePool.secondCharCandidates.length;
    
    // 质量分布统计
    const allCandidates = [...candidatePool.firstCharCandidates, ...candidatePool.secondCharCandidates];
    const qualityDistribution = allCandidates.reduce((acc: any, candidate: any) => {
      if (candidate.scores.overall >= 90) acc['优秀']++;
      else if (candidate.scores.overall >= 80) acc['良好']++;
      else acc['一般']++;
      return acc;
    }, { '优秀': 0, '良好': 0, '一般': 0 });
    
    return {
      totalCandidates,
      qualityDistribution,
      averageScore: totalCandidates > 0 ? 
        allCandidates.reduce((sum: number, c: any) => sum + c.scores.overall, 0) / totalCandidates : 0
    };
  }

  /**
   * 计算总体置信度
   */
  private calculateOverallConfidence(filteredCandidates: any): number {
    const stages = Object.keys(filteredCandidates).length;
    const finalCount = filteredCandidates.phoneticFiltered.length;
    
    if (finalCount === 0) return 0;
    if (finalCount >= 10) return 0.95;
    if (finalCount >= 5) return 0.85;
    return 0.75;
  }
}
