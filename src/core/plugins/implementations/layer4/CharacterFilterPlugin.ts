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
    // 从插件上下文获取Layer 3的真实策略结果
    const wuxingSelection = context.getPluginResult?.('wuxing-selection');
    const zodiacSelection = context.getPluginResult?.('zodiac-selection');
    const meaningSelection = context.getPluginResult?.('meaning-selection');
    const strokeSelection = context.getPluginResult?.('stroke-selection');
    const phoneticSelection = context.getPluginResult?.('phonetic-selection');
    
    context.log?.('info', `🔍 获取Layer3策略结果:`);
    context.log?.('info', `  - 五行策略: ${wuxingSelection ? '✅' : '❌'}`);
    context.log?.('info', `  - 生肖策略: ${zodiacSelection ? '✅' : '❌'}`);
    context.log?.('info', `  - 寓意策略: ${meaningSelection ? '✅' : '❌'}`);
    context.log?.('info', `  - 笔画策略: ${strokeSelection ? '✅' : '❌'}`);
    context.log?.('info', `  - 音韵策略: ${phoneticSelection ? '✅' : '❌'}`);
    
    return {
      wuxingSelection,
      zodiacSelection,
      meaningSelection,
      strokeSelection,
      phoneticSelection,
      // 保持兼容性的旧格式
      wuxingStrategy: wuxingSelection?.data,
      zodiacStrategy: zodiacSelection?.data,
      meaningStrategy: meaningSelection?.data,
      strokeStrategy: strokeSelection?.data,
      phoneticStrategy: phoneticSelection?.data
    };
  }

  /**
   * 执行分层筛选
   */
  private async executeLayeredFiltering(strategyResults: any, input: StandardInput, context: PluginContext) {
    // 初始字符池 - 从UnifiedCharacterLoader获取
    const initialPool = await this.getInitialCharacterPool(strategyResults, input, context);
    context.log?.('info', `🎯 开始Layer4正式筛选流程，初始候选池: ${initialPool.length} 个字符`);
    
    // 1. 五行筛选
    const beforeWuxing = initialPool.length;
    const wuxingFiltered = this.applyWuxingFilter(initialPool, strategyResults.wuxingStrategy);
    context.log?.('info', `🔥 五行筛选: ${beforeWuxing} → ${wuxingFiltered.length} 个字符 (筛掉 ${beforeWuxing - wuxingFiltered.length} 个)`);
    
    // 2. 生肖筛选
    const beforeZodiac = wuxingFiltered.length;
    const zodiacFiltered = this.applyZodiacFilter(wuxingFiltered, strategyResults.zodiacStrategy);
    context.log?.('info', `🐯 生肖筛选: ${beforeZodiac} → ${zodiacFiltered.length} 个字符 (筛掉 ${beforeZodiac - zodiacFiltered.length} 个)`);
    
    // 3. 寓意筛选
    const beforeMeaning = zodiacFiltered.length;
    const meaningFiltered = this.applyMeaningFilter(zodiacFiltered, strategyResults.meaningStrategy);
    context.log?.('info', `💭 寓意筛选: ${beforeMeaning} → ${meaningFiltered.length} 个字符 (筛掉 ${beforeMeaning - meaningFiltered.length} 个)`);
    
    // 4. 笔画筛选
    const beforeStroke = meaningFiltered.length;
    const strokeFiltered = this.applyStrokeFilter(meaningFiltered, strategyResults.strokeStrategy);
    context.log?.('info', `✏️  笔画筛选: ${beforeStroke} → ${strokeFiltered.length} 个字符 (筛掉 ${beforeStroke - strokeFiltered.length} 个)`);
    
    // 5. 音韵筛选
    const beforePhonetic = strokeFiltered.length;
    const phoneticFiltered = this.applyPhoneticFilter(strokeFiltered, strategyResults.phoneticStrategy, input.familyName);
    context.log?.('info', `🎵 音韵筛选: ${beforePhonetic} → ${phoneticFiltered.length} 个字符 (筛掉 ${beforePhonetic - phoneticFiltered.length} 个)`);
    
    context.log?.('info', `✅ Layer4筛选完成！最终剩余 ${phoneticFiltered.length} 个候选字符`);
    
    // 展示最终字符示例
    if (phoneticFiltered.length > 0) {
      const finalSample = phoneticFiltered.slice(0, 15).map(c => c.char).join('、');
      context.log?.('info', `🔤 最终字符示例: ${finalSample}${phoneticFiltered.length > 15 ? '...' : ''}`);
    }
    
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
   * 获取初始字符池 - 基于策略结果动态筛选
   */
  private async getInitialCharacterPool(strategyResults: any, input: StandardInput, context: PluginContext) {
    context.log?.('info', '🚀 开始动态构建字符候选池');
    
    try {
      // 从UnifiedCharacterLoader获取所有适合起名的字符
      const allCharacters = await this.charLoader.getAllNamingCharacters();
      context.log?.('info', `📚 从字符数据库获取到 ${allCharacters.length} 个适合起名的字符`);
      
      if (allCharacters.length === 0) {
        context.log?.('error', '❌ 字符数据库中没有适合起名的字符，检查数据库配置');
        return [];
      }
      
      // 基于Layer 3策略结果进行初步筛选
      let candidatePool = [...allCharacters];
      let stepCount = 1;
      
      context.log?.('info', `🔄 开始策略筛选流程，初始字符池: ${candidatePool.length} 个字符`);
      
      // 五行策略筛选
      if (strategyResults.wuxingSelection) {
        const beforeCount = candidatePool.length;
        candidatePool = this.applyWuxingPreFilter(candidatePool, strategyResults.wuxingSelection, context);
        context.log?.('info', `📝 步骤${stepCount++}: 五行预筛选 ${beforeCount} → ${candidatePool.length} 个字符 (筛掉 ${beforeCount - candidatePool.length} 个)`);
      } else {
        context.log?.('warn', `⚠️  步骤${stepCount++}: 跳过五行筛选（策略结果缺失）`);
      }
      
      // 生肖策略筛选
      if (strategyResults.zodiacSelection) {
        const beforeCount = candidatePool.length;
        candidatePool = this.applyZodiacPreFilter(candidatePool, strategyResults.zodiacSelection, context);
        context.log?.('info', `🐯 步骤${stepCount++}: 生肖预筛选 ${beforeCount} → ${candidatePool.length} 个字符 (筛掉 ${beforeCount - candidatePool.length} 个)`);
      } else {
        context.log?.('warn', `⚠️  步骤${stepCount++}: 跳过生肖筛选（策略结果缺失）`);
      }
      
      // 笔画策略筛选
      if (strategyResults.strokeSelection) {
        const beforeCount = candidatePool.length;
        candidatePool = this.applyStrokePreFilter(candidatePool, strategyResults.strokeSelection, context);
        context.log?.('info', `✏️  步骤${stepCount++}: 笔画预筛选 ${beforeCount} → ${candidatePool.length} 个字符 (筛掉 ${beforeCount - candidatePool.length} 个)`);
      } else {
        context.log?.('warn', `⚠️  步骤${stepCount++}: 跳过笔画筛选（策略结果缺失）`);
      }
      
      // 格式化为标准结构
      const characterPool = candidatePool.map(charInfo => ({
            char: charInfo.char,
            strokes: charInfo.strokes.traditional, // ⚠️ 使用传统笔画数
            wuxing: charInfo.wuxing,
            meaning: charInfo.meanings.join('，'),
            tone: charInfo.tone,
            radical: charInfo.radical,
            culturalLevel: charInfo.culturalLevel,
        confidence: charInfo.dataQuality.confidence,
        isFromStrategy: true // 标记为策略筛选结果
      }));
      
      context.log?.('info', `✅ 动态字符池构建完成！最终候选池包含 ${characterPool.length} 个字符`);
      
      // 展示前几个字符作为示例
      if (characterPool.length > 0) {
        const sampleChars = characterPool.slice(0, 10).map(c => c.char).join('、');
        context.log?.('info', `🔤 字符示例: ${sampleChars}${characterPool.length > 10 ? '...' : ''}`);
      }
      
      return characterPool;
      
    } catch (error) {
      context.log?.('error', `❌ 动态构建字符池失败: ${error}`);
      // fallback到空数组，让后续流程处理
      return [];
    }
  }

  /**
   * 五行预筛选 - 在初始字符池构建阶段应用
   */
  private applyWuxingPreFilter(characters: UnifiedCharacterInfo[], wuxingStrategy: any, context: PluginContext): UnifiedCharacterInfo[] {
    if (!wuxingStrategy?.baseStrategy?.primaryElements && !wuxingStrategy?.data?.baseStrategy?.primaryElements) {
      context.log?.('warn', '五行策略缺少主要元素信息，跳过五行预筛选');
      return characters;
    }
    
    // 兼容不同的数据结构
    const strategy = wuxingStrategy?.baseStrategy || wuxingStrategy?.data?.baseStrategy || wuxingStrategy;
    const { primaryElements = [], secondaryElements = [], avoidElements = [] } = strategy;
    
    // 五行中文到拼音映射
    const wuxingMap: { [key: string]: string } = {
      '金': 'jin',
      '木': 'mu', 
      '水': 'shui',
      '火': 'huo',
      '土': 'tu'
    };
    
    // 转换策略中的五行为拼音格式
    const preferredElementsPinyin = [...primaryElements, ...secondaryElements]
      .map(elem => wuxingMap[elem] || elem);
    const avoidElementsPinyin = avoidElements
      .map((elem: string) => wuxingMap[elem] || elem);
    
    context.log?.('info', `🔥 五行预筛选条件: 偏好[${preferredElementsPinyin.join(',')}] 避免[${avoidElementsPinyin.join(',')}]`);
    
    const filteredChars = characters.filter(char => {
      const isPreferred = preferredElementsPinyin.length === 0 || preferredElementsPinyin.includes(char.wuxing);
      const isAvoided = avoidElementsPinyin.includes(char.wuxing);
      return isPreferred && !isAvoided;
    });
    
    // 展示筛选样例
    if (filteredChars.length > 0) {
      const sampleChars = filteredChars.slice(0, 5).map(c => `${c.char}(${c.wuxing})`).join('、');
      context.log?.('info', `🔥 五行筛选样例: ${sampleChars}...`);
    }
    
    return filteredChars;
  }

  /**
   * 生肖预筛选 - 基于生肖喜忌偏旁筛选
   */
  private applyZodiacPreFilter(characters: UnifiedCharacterInfo[], zodiacStrategy: any, context: PluginContext): UnifiedCharacterInfo[] {
    // 兼容多种数据结构路径
    const strategy = zodiacStrategy?.baseStrategy || 
                    zodiacStrategy?.data?.baseStrategy || 
                    zodiacStrategy?.data?.characterCriteria ||
                    zodiacStrategy?.characterCriteria ||
                    zodiacStrategy;
    
    // 从不同的数据结构中提取偏旁信息
    let favorableRadicals: string[] = [];
    let unfavorableRadicals: string[] = [];
    
    if (strategy?.favorableRadicals) {
      favorableRadicals = strategy.favorableRadicals;
    } else if (strategy?.highlyRecommended?.radicals && strategy?.recommended?.radicals) {
      favorableRadicals = [...strategy.highlyRecommended.radicals, ...strategy.recommended.radicals];
    } else if (strategy?.recommendedRadicals) {
      favorableRadicals = strategy.recommendedRadicals;
    }
    
    if (strategy?.unfavorableRadicals) {
      unfavorableRadicals = strategy.unfavorableRadicals;
    } else if (strategy?.discouraged?.radicals) {
      unfavorableRadicals = strategy.discouraged.radicals || [];
    } else if (strategy?.forbidden?.radicals) {
      unfavorableRadicals = strategy.forbidden.radicals || [];
    } else if (strategy?.avoidRadicals) {
      unfavorableRadicals = strategy.avoidRadicals;
    }
    
    context.log?.('info', `🐯 生肖策略数据结构调试: ${JSON.stringify(strategy, null, 2).slice(0, 200)}...`);
    
    if (favorableRadicals.length === 0 && unfavorableRadicals.length === 0) {
      context.log?.('warn', '生肖策略缺少偏旁信息，跳过生肖预筛选');
      return characters;
    }
    
    context.log?.('info', `🐯 生肖预筛选条件: 喜用偏旁[${favorableRadicals.join(',')}] 忌用偏旁[${unfavorableRadicals.join(',')}]`);
    
    const filteredChars = characters.filter(char => {
      const hasFavorable = favorableRadicals.length === 0 || favorableRadicals.some((radical: string) => char.radical?.includes(radical));
      const hasUnfavorable = unfavorableRadicals.some((radical: string) => char.radical?.includes(radical));
      return hasFavorable && !hasUnfavorable;
    });
    
    // 展示筛选样例
    if (filteredChars.length > 0) {
      const sampleChars = filteredChars.slice(0, 5).map(c => `${c.char}(${c.radical})`).join('、');
      context.log?.('info', `🐯 生肖筛选样例: ${sampleChars}...`);
    }
    
    return filteredChars;
  }

  /**
   * 笔画预筛选 - 基于笔画策略筛选
   */
  private applyStrokePreFilter(characters: UnifiedCharacterInfo[], strokeStrategy: any, context: PluginContext): UnifiedCharacterInfo[] {
    // 兼容多种数据结构路径
    const strategy = strokeStrategy?.baseStrategy || 
                    strokeStrategy?.data?.baseStrategy || 
                    strokeStrategy?.data ||
                    strokeStrategy;
    
    context.log?.('info', `✏️  笔画策略数据结构调试: ${JSON.stringify(strategy, null, 2).slice(0, 300)}...`);
    
    // 从不同的数据结构中提取笔画信息
    let preferredStrokes: number[] = [];
    let avoidStrokes: number[] = [];
    
    // 从strokeCombinations中提取笔画
    if (strategy?.strokeCombinations?.doubleCharCombinations) {
      for (const combo of strategy.strokeCombinations.doubleCharCombinations) {
        if (combo.firstCharStrokes) preferredStrokes.push(combo.firstCharStrokes);
        if (combo.secondCharStrokes) preferredStrokes.push(combo.secondCharStrokes);
      }
    }
    
    // 从singleCharCombinations中提取笔画
    if (strategy?.strokeCombinations?.singleCharCombinations) {
      for (const combo of strategy.strokeCombinations.singleCharCombinations) {
        if (combo.charStrokes) preferredStrokes.push(combo.charStrokes);
      }
    }
    
    // 从其他可能的字段提取
    if (strategy?.preferredStrokes) {
      preferredStrokes = [...preferredStrokes, ...strategy.preferredStrokes];
    }
    
    if (strategy?.doubleCharBest) {
      const flatStrokes = strategy.doubleCharBest.flat();
      preferredStrokes = [...preferredStrokes, ...flatStrokes];
    }
    
    if (strategy?.singleCharBest) {
      preferredStrokes = [...preferredStrokes, ...strategy.singleCharBest];
    }
    
    if (strategy?.avoidStrokes) {
      avoidStrokes = strategy.avoidStrokes;
    }
    
    // 去重
    preferredStrokes = [...new Set(preferredStrokes)];
    avoidStrokes = [...new Set(avoidStrokes)];
    
    if (preferredStrokes.length === 0 && avoidStrokes.length === 0) {
      context.log?.('warn', '笔画策略缺少偏好笔画信息，跳过笔画预筛选');
      return characters;
    }
    
    context.log?.('info', `✏️  笔画预筛选条件: 偏好笔画[${preferredStrokes.join(',')}] 避免笔画[${avoidStrokes.join(',')}]`);
    
    const filteredChars = characters.filter(char => {
      const strokeCount = char.strokes.traditional;
      const isPreferred = preferredStrokes.length === 0 || preferredStrokes.includes(strokeCount);
      const isAvoided = avoidStrokes.includes(strokeCount);
      return isPreferred && !isAvoided;
    });
    
    // 展示筛选样例
    if (filteredChars.length > 0) {
      const sampleChars = filteredChars.slice(0, 5).map(c => `${c.char}(${c.strokes.traditional}笔)`).join('、');
      context.log?.('info', `✏️  笔画筛选样例: ${sampleChars}...`);
    }
    
    return filteredChars;
  }

  /**
   * 应用五行筛选
   */
  private applyWuxingFilter(characters: any[], wuxingStrategy: any) {
    // 兼容不同的数据结构 - 与预筛选保持一致
    const strategy = wuxingStrategy?.baseStrategy || wuxingStrategy?.data?.baseStrategy || wuxingStrategy;
    const { primaryElements = [], secondaryElements = [], avoidElements = [] } = strategy;
    
    // 五行中文到拼音映射
    const wuxingMap: { [key: string]: string } = {
      '金': 'jin',
      '木': 'mu', 
      '水': 'shui',
      '火': 'huo',
      '土': 'tu'
    };
    
    // 转换策略中的五行为拼音格式
    const preferredElementsPinyin = [...primaryElements, ...secondaryElements]
      .map(elem => wuxingMap[elem] || elem);
    const avoidElementsPinyin = avoidElements
      .map((elem: string) => wuxingMap[elem] || elem);
    const primaryElementsPinyin = primaryElements
      .map((elem: string) => wuxingMap[elem] || elem);
    
    return characters.filter(char => {
      const isPreferred = preferredElementsPinyin.includes(char.wuxing);
      const isAvoided = avoidElementsPinyin.includes(char.wuxing);
      
      return isPreferred && !isAvoided;
    }).map(char => ({
      ...char,
      wuxingScore: primaryElementsPinyin.includes(char.wuxing) ? 95 : 85
    }));
  }

  /**
   * 应用生肖筛选
   */
  private applyZodiacFilter(characters: any[], zodiacStrategy: any) {
    // 兼容不同的数据结构
    const strategy = zodiacStrategy?.baseStrategy || 
                    zodiacStrategy?.data?.baseStrategy || 
                    zodiacStrategy?.data?.characterCriteria ||
                    zodiacStrategy?.characterCriteria ||
                    zodiacStrategy;
    
    return characters.map(char => {
      let zodiacScore = 70; // 基础分数
      
      // 兼容不同的数据结构提取推荐字符
      const highlyRecommended = strategy?.highlyRecommended?.characters || [];
      const recommended = strategy?.recommended?.characters || [];
      const discouraged = strategy?.discouraged?.characters || [];
      
      if (highlyRecommended.includes(char.char)) {
        zodiacScore = 95;
      } else if (recommended.includes(char.char)) {
        zodiacScore = 85;
      } else if (discouraged.includes(char.char)) {
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
    // 兼容不同的数据结构 - 与预筛选保持一致
    const strategy = strokeStrategy?.baseStrategy || 
                    strokeStrategy?.data?.baseStrategy || 
                    strokeStrategy?.data ||
                    strokeStrategy;
    
    // 提取目标笔画数
    let targetStrokes: number[] = [];
    
    // 从strokeCombinations中提取笔画
    if (strategy?.strokeCombinations?.doubleCharCombinations) {
      for (const combo of strategy.strokeCombinations.doubleCharCombinations) {
        if (combo.firstCharStrokes) targetStrokes.push(combo.firstCharStrokes);
        if (combo.secondCharStrokes) targetStrokes.push(combo.secondCharStrokes);
      }
    }
    
    // 从其他可能的字段提取
    if (strategy?.doubleCharBest) {
      const flatStrokes = strategy.doubleCharBest.flat();
      targetStrokes = [...targetStrokes, ...flatStrokes];
    }
    
    if (strategy?.singleCharBest) {
      targetStrokes = [...targetStrokes, ...strategy.singleCharBest];
    }
    
    // 去重
    targetStrokes = [...new Set(targetStrokes)];
    
    if (targetStrokes.length === 0) {
      return characters; // 无筛选条件时返回所有字符
    }
    
    return characters.filter(char => 
      targetStrokes.includes(char.strokes)
    ).map(char => ({
      ...char,
      strokeScore: targetStrokes.includes(char.strokes) ? 95 : 80
    }));
  }

  /**
   * 应用音韵筛选
   */
  private applyPhoneticFilter(characters: any[], phoneticStrategy: any, familyName: string) {
    // 兼容不同的数据结构
    const strategy = phoneticStrategy?.baseStrategy || 
                    phoneticStrategy?.data?.baseStrategy || 
                    phoneticStrategy?.data ||
                    phoneticStrategy || {};
    
    // 模拟姓氏音调 (如"吴" = 2声)
    const surnametone = 2;
    
    // 安全获取策略参数，提供默认值
    const preferredTonePatterns = strategy.preferredTonePatterns || strategy.preferredTones || [];
    const avoidedTonePatterns = strategy.avoidedTonePatterns || strategy.avoidTones || [];
    const harmonyThreshold = strategy.harmonyThreshold || 70;
    
    return characters.map(char => {
      let phoneticScore = 70;
      
      // 简化的声调和谐度计算
      const tonePattern = `${surnametone}-${char.tone}`;
      if (preferredTonePatterns.length > 0 && preferredTonePatterns.some((pattern: string) => pattern.includes(tonePattern))) {
        phoneticScore = 90;
      } else if (avoidedTonePatterns.length > 0 && avoidedTonePatterns.includes(`${surnametone}-${char.tone}`)) {
        phoneticScore = 50;
      }
      
      return { ...char, phoneticScore };
    }).filter(char => char.phoneticScore >= harmonyThreshold - 10);
  }

  /**
   * 构建候选字符池
   */
  private buildCandidatePool(filteredCandidates: any) {
    const finalCandidates = filteredCandidates.phoneticFiltered;
    
    // 返回所有筛选后的字符，不在Layer 4进行笔画分组
    // 笔画分组应该在Layer 5根据策略来做
    return finalCandidates.map((char: any) => this.formatCandidateCharacter(char));
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
    // candidatePool现在是数组，不是对象
    const totalCandidates = Array.isArray(candidatePool) ? candidatePool.length : 0;
    
    // 质量分布统计
    const allCandidates = Array.isArray(candidatePool) ? candidatePool : [];
    const qualityDistribution = allCandidates.reduce((acc: any, candidate: any) => {
      if (candidate.scores?.overall >= 90) acc['优秀']++;
      else if (candidate.scores?.overall >= 80) acc['良好']++;
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
