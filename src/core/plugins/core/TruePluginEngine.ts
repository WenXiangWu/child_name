/**
 * 真正的插件系统执行引擎
 * 
 * 这个引擎使用真实的插件容器和管道来执行完整的插件化名字生成流程
 */

import { PluginContainer } from './PluginContainer';
import { NamingPipelineIntegrated } from './NamingPipelineIntegrated';
import { pluginFactory, PluginType, PluginId } from '../implementations/PluginFactory';
import { PluginManager } from './PluginManager';
import { StandardInput, CertaintyLevel } from '../interfaces/NamingPlugin';
import { GeneratedName } from '../../common/types';

export interface TruePluginRequest {
  familyName: string;
  gender: 'male' | 'female';
  birthInfo?: {
    year: number;
    month: number;
    day: number;
    hour?: number;
    minute?: number;
  };
  preferences?: {
    nameCount?: number;
    scoreThreshold?: number;
    certaintyLevel?: number;
    includeTraditionalAnalysis?: boolean;
    skipOptionalFailures?: boolean;
  };
  characters?: string[];
  scoreThreshold?: number;
  useTraditional?: boolean;
  avoidedWords?: string[];
  limit?: number;
  offset?: number;
  preferredElements?: string[];
}

export interface TruePluginResult {
  success: boolean;
  names: GeneratedName[];
  pluginResults: Map<string, any>;
  totalTime: number;
  metadata: {
    pluginsExecuted: number;
    layersProcessed: number;
    generationMethod: string;
    confidence: number;
    analysisReport?: any;
  };
  executionLogs: Array<{
    timestamp: number;
    level: 'info' | 'warn' | 'error';
    message: string;
    pluginId?: string;
    layer?: number;
    data?: any;
  }>;
}

export class TruePluginEngine {
  private container: PluginContainer;
  private pipeline: NamingPipelineIntegrated;
  private pluginManager: PluginManager;
  private initialized = false;
  private executionLogs: Array<any> = [];

  constructor() {
    this.container = new PluginContainer();
    this.pipeline = new NamingPipelineIntegrated();
    this.pluginManager = new PluginManager();
  }

  /**
   * 初始化插件系统
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    this.log('info', '🚀 初始化真正的插件系统');

    try {
      // 1. 初始化插件管理器
      await this.pluginManager.initialize();
      this.log('info', '✅ 插件管理器初始化完成');

      // 2. 注册所有插件
      await this.registerAllPlugins();
      this.log('info', '✅ 所有插件注册完成');

      // 3. 初始化管道
      await this.pipeline.initialize();
      this.log('info', '✅ 执行管道初始化完成');

      this.initialized = true;
      this.log('info', '🎉 插件系统初始化成功');

    } catch (error) {
      this.log('error', '❌ 插件系统初始化失败', undefined, undefined, { error });
      throw new Error(`插件系统初始化失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 注册所有插件
   */
  private async registerAllPlugins(): Promise<void> {
    const pluginIds: PluginId[] = [
      // Layer 1: 基础信息层
      'surname', 'gender', 'birth-time',
      // Layer 2: 命理基础层
      'bazi', 'zodiac', 'xiyongshen',
      // Layer 3: 选字策略层
      'wuxing-selection', 'zodiac-selection', 'meaning-selection', 'stroke-selection', 'phonetic-selection',
      // Layer 4: 字符筛选层
      'character-filter',
      // Layer 5: 名字生成层
      'name-combination',
      // Layer 6: 名字评分层 (完整的5个评分插件)
      'sancai-scoring', 'phonetic-scoring', 'wuxing-balance-scoring', 'dayan-scoring', 'comprehensive-scoring'
    ];

    this.log('info', '🔄 开始注册插件', undefined, undefined, {
      totalPlugins: pluginIds.length,
      pluginList: pluginIds
    });

    for (const pluginId of pluginIds) {
      try {
        await this.container.registerPlugin(pluginId);
      } catch (error) {
        this.log('warn', `⚠️ 插件注册失败: ${pluginId}`, undefined, undefined, { 
          error: error instanceof Error ? error.message : String(error),
          errorCode: (error as any)?.code
        });
        // 继续注册其他插件，不中断流程
      }
    }
  }

  /**
   * 执行完整的插件化名字生成流程
   */
  async executeFullPipeline(request: TruePluginRequest): Promise<TruePluginResult> {
    const startTime = Date.now();
    this.executionLogs = []; // 重置日志

    try {
      // 确保初始化
      await this.initialize();

      this.log('info', '🧩 开始执行真正的插件系统流程', undefined, undefined, {
        familyName: request.familyName,
        gender: request.gender,
        hasBirthInfo: !!request.birthInfo
      });

      // 1. 构建标准输入
      const standardInput = this.buildStandardInput(request);
      this.log('info', '📋 构建标准输入完成');

      // 2. 执行插件管道
      const pipelineResult = await this.executePipeline(standardInput);
      this.log('info', '🔄 插件管道执行完成', undefined, undefined, {
        pluginsExecuted: pipelineResult.pluginResults.size
      });

      // 3. 提取名字生成结果
      const names = this.extractGeneratedNames(pipelineResult);
      this.log('info', '📝 名字提取完成', undefined, undefined, {
        namesGenerated: names.length
      });

      // 4. 计算元数据
      const metadata = this.calculateMetadata(pipelineResult, startTime);

      const totalTime = Date.now() - startTime;
      this.log('info', '🎯 插件系统执行完成', undefined, undefined, {
        totalTime: `${totalTime}ms`,
        success: true
      });

      return {
        success: true,
        names,
        pluginResults: pipelineResult.pluginResults,
        totalTime,
        metadata,
        executionLogs: this.executionLogs
      };

    } catch (error) {
      const totalTime = Date.now() - startTime;
      this.log('error', '❌ 插件系统执行失败', undefined, undefined, { 
        error: error instanceof Error ? error.message : String(error),
        totalTime: `${totalTime}ms`
      });

      return {
        success: false,
        names: [],
        pluginResults: new Map(),
        totalTime,
        metadata: {
          pluginsExecuted: 0,
          layersProcessed: 0,
          generationMethod: 'plugin-system-failed',
          confidence: 0
        },
        executionLogs: this.executionLogs
      };
    }
  }

  /**
   * 创建插件上下文
   */
  private createPluginContext(pluginId: string, input: any, config: any, executionContext?: Map<string, any>) {
    return {
      requestId: 'plugin-execution',
      certaintyLevel: input.preferences?.certaintyLevel || 'fully-determined',
      getPluginResult: <T = any>(id: string): T | null => {
        return executionContext?.get(id) || null;
      },
      setPluginResult: (id: string, result: any): void => {
        if (executionContext) {
          executionContext.set(id, result);
        }
      },
      getConfig: () => config,
      log: (level: 'info' | 'warn' | 'error', message: string) => {
        this.log(level, message, pluginId);
      }
    };
  }

  /**
   * 构建标准输入
   */
  private buildStandardInput(request: TruePluginRequest): StandardInput {
    return {
      // 基础信息直接放在根级别（按照StandardInput接口）
      familyName: request.familyName,
      gender: request.gender,
      birthInfo: request.birthInfo ? {
        year: request.birthInfo.year,
        month: request.birthInfo.month,
        day: request.birthInfo.day,
        hour: request.birthInfo.hour,
        minute: request.birthInfo.minute
      } : undefined,
      characters: request.characters || [],
      elements: request.preferredElements || [],
      preferences: {
        certaintyLevel: request.preferences?.certaintyLevel || CertaintyLevel.FULLY_DETERMINED,
        includeTraditionalAnalysis: request.preferences?.includeTraditionalAnalysis || request.useTraditional || false,
        skipOptionalFailures: request.preferences?.skipOptionalFailures !== false,
        parallelExecution: false
      }
    };
  }

  /**
   * 执行插件管道
   */
  private async executePipeline(input: StandardInput): Promise<any> {
    const pluginResults = new Map();
    const certaintyLevel = input.preferences?.certaintyLevel || CertaintyLevel.FULLY_DETERMINED;
    
    this.log('info', '📊 开始分层执行插件', undefined, undefined, {
      certaintyLevel: this.getCertaintyLevelName(certaintyLevel),
      enabledPlugins: this.getEnabledPluginsForLevel(certaintyLevel)
    });

    // 根据确定性等级获取启用的插件集合
    const enabledPlugins = this.getEnabledPluginsForLevel(certaintyLevel);
    
    // Layer 1: 基础信息层
    this.log('info', '🔵 Layer 1: 基础信息层');
    await this.executeLayerPlugins(1, enabledPlugins, input, pluginResults);

    // Layer 2: 命理基础层
    this.log('info', '🟡 Layer 2: 命理基础层');
    await this.executeLayerPlugins(2, enabledPlugins, input, pluginResults);

    // Layer 3: 字符评估层
    this.log('info', '🟠 Layer 3: 字符评估层');
    await this.executeLayerPlugins(3, enabledPlugins, input, pluginResults);

    // Layer 4: 字符筛选层
    this.log('info', '🔴 Layer 4: 字符筛选层');
    await this.executeLayerPlugins(4, enabledPlugins, input, pluginResults);

    // Layer 5: 名字生成层
    this.log('info', '🟣 Layer 5: 名字生成层');
    await this.executeLayerPlugins(5, enabledPlugins, input, pluginResults);

    // Layer 6: 名字评分层
    this.log('info', '🟤 Layer 6: 名字评分层');
    await this.executeLayerPlugins(6, enabledPlugins, input, pluginResults);

    return {
      pluginResults,
      input,
      metadata: {
        layersProcessed: 6,
        pluginsExecuted: pluginResults.size,
        certaintyLevel: this.getCertaintyLevelName(certaintyLevel),
        enabledPlugins: enabledPlugins.length
      }
    };
  }

  /**
   * 执行 Layer 1 插件
   */
  private async executeLayer1Plugins(input: StandardInput, results: Map<string, any>): Promise<void> {
    const layer1Plugins = ['surname', 'gender', 'birth-time'];

    for (const pluginId of layer1Plugins) {
      if (pluginId === 'birth-time' && !input.birthInfo) {
        this.log('info', `⏭️ 跳过插件: ${pluginId} (缺少出生信息)`);
        continue;
      }

      try {
        const plugin = pluginFactory.createPlugin(pluginId as any);
        const defaultConfig = {
          enabled: true,
          priority: 1,
          timeout: 30000,
          retryCount: 3
        };
        await plugin.initialize(defaultConfig, this.createPluginContext(pluginId, input, defaultConfig, results));
        
        this.log('info', `🔄 执行插件: ${pluginId}`, pluginId, 1);
        
        const result = await plugin.process(input, this.createPluginContext(pluginId, input, defaultConfig, results));
        results.set(pluginId, result);
        
        // 更新共享上下文
        results.set(pluginId, result);
        
        // 详细的结果日志
        this.logPluginResult(pluginId, 1, result);

        
      } catch (error) {
        this.log('error', `❌ 插件执行失败: ${pluginId}`, pluginId, 1, { error });
        // 继续执行其他插件
      }
    }
  }

  /**
   * 执行 Layer 2 插件
   */
  private async executeLayer2Plugins(input: StandardInput, results: Map<string, any>): Promise<void> {
    const layer2Plugins = ['zodiac', 'xiyongshen'];

    for (const pluginId of layer2Plugins) {
      if (pluginId === 'zodiac' && !input.birthInfo?.year) {
        this.log('info', `⏭️ 跳过插件: ${pluginId} (缺少出生年份)`);
        continue;
      }

      try {
        const plugin = pluginFactory.createPlugin(pluginId as any);
        const defaultConfig = {
          enabled: true,
          priority: 1,
          timeout: 30000,
          retryCount: 3
        };
        await plugin.initialize(defaultConfig, this.createPluginContext(pluginId, input, defaultConfig, results));
        
        this.log('info', `🔄 执行插件: ${pluginId}`, pluginId, 2);
        
        const result = await plugin.process(input, this.createPluginContext(pluginId, input, defaultConfig, results));
        results.set(pluginId, result);
        
        // 更新共享上下文
        results.set(pluginId, result);
        
        // 详细的结果日志
        this.logPluginResult(pluginId, 2, result);

        
      } catch (error) {
        this.log('error', `❌ 插件执行失败: ${pluginId}`, pluginId, 2, { error });
        // 继续执行其他插件
      }
    }
  }

  /**
   * 执行 Layer 3 插件
   */
  private async executeLayer3Plugins(input: StandardInput, results: Map<string, any>): Promise<void> {
    const layer3Plugins = ['stroke', 'wuxing-char', 'zodiac-char', 'meaning', 'phonetic'];

    for (const pluginId of layer3Plugins) {
      if (pluginId === 'zodiac-char' && !results.has('zodiac')) {
        this.log('info', `⏭️ 跳过插件: ${pluginId} (zodiac插件未成功执行)`);
        continue;
      }

      try {
        const plugin = pluginFactory.createPlugin(pluginId as any);
        const defaultConfig = {
          enabled: true,
          priority: 1,
          timeout: 30000,
          retryCount: 3
        };
        await plugin.initialize(defaultConfig, this.createPluginContext(pluginId, input, defaultConfig, results));
        
        this.log('info', `🔄 执行插件: ${pluginId}`, pluginId, 3);
        
        const result = await plugin.process(input, this.createPluginContext(pluginId, input, defaultConfig, results));
        results.set(pluginId, result);
        
        // 更新共享上下文
        results.set(pluginId, result);
        
        // 详细的结果日志
        this.logPluginResult(pluginId, 3, result);

        
      } catch (error) {
        this.log('error', `❌ 插件执行失败: ${pluginId}`, pluginId, 3, { error });
        // 继续执行其他插件
      }
    }
  }

  /**
   * 执行 Layer 4 插件（字符筛选）
   */
  private async executeLayer4Plugins(input: StandardInput, results: Map<string, any>): Promise<void> {
    const layer4Plugins = ['character-filter']; // 字符筛选插件

    for (const pluginId of layer4Plugins) {
      try {
        const plugin = pluginFactory.createPlugin(pluginId as any);
        const defaultConfig = {
          enabled: true,
          priority: 1,
          timeout: 30000,
          retryCount: 3
        };
        await plugin.initialize(defaultConfig, this.createPluginContext(pluginId, input, defaultConfig, results));
        
        this.log('info', `🔄 执行插件: ${pluginId}`, pluginId, 4);
        
        const result = await plugin.process(input, this.createPluginContext(pluginId, input, defaultConfig, results));
        results.set(pluginId, result);
        
        // 更新共享上下文
        results.set(pluginId, result);
        
        // 详细的结果日志
        this.logPluginResult(pluginId, 4, result);

        
      } catch (error) {
        this.log('error', `❌ 插件执行失败: ${pluginId}`, pluginId, 4, { error });
        // 字符筛选失败不致命，继续执行
      }
    }
  }

  /**
   * 执行 Layer 5 插件（关键：名字生成）
   */
  private async executeLayer5Plugins(input: StandardInput, results: Map<string, any>): Promise<void> {
    const layer5Plugins = ['name-combination']; // 名字组合生成插件

    for (const pluginId of layer5Plugins) {
      try {
        const plugin = pluginFactory.createPlugin(pluginId as any);
        const defaultConfig = {
          enabled: true,
          priority: 1,
          timeout: 30000,
          retryCount: 3
        };
        await plugin.initialize(defaultConfig, this.createPluginContext(pluginId, input, defaultConfig, results));
        
        this.log('info', `🔄 执行插件: ${pluginId}`, pluginId, 5);
        
        const result = await plugin.process(input, this.createPluginContext(pluginId, input, defaultConfig, results));
        results.set(pluginId, result);
        
        // 更新共享上下文
        results.set(pluginId, result);
        
        // 详细的结果日志
        this.logPluginResult(pluginId, 5, result);

        
      } catch (error) {
        this.log('error', `❌ 插件执行失败: ${pluginId}`, pluginId, 5, { error });
        throw error; // 名字生成失败是致命的
      }
    }
  }

  /**
   * 提取生成的名字
   */
  private extractGeneratedNames(pipelineResult: any): GeneratedName[] {
    const nameGenerationResult = pipelineResult.pluginResults.get('name-combination');
    const comprehensiveScoringResult = pipelineResult.pluginResults.get('comprehensive-scoring');
    
    if (!nameGenerationResult || !nameGenerationResult.data?.nameCandidates) {
      this.log('warn', '⚠️ 名字生成插件未返回有效结果');
      return [];
    }

    // 获取详细评分数据
    let scoredCandidates = nameGenerationResult.data.nameCandidates;
    if (comprehensiveScoringResult && comprehensiveScoringResult.data?.scoredCandidates) {
      scoredCandidates = comprehensiveScoringResult.data.scoredCandidates;
      this.log('info', `✅ 获取到 ${scoredCandidates.length} 个详细评分的名字候选`);
    } else {
      this.log('warn', '⚠️ 未获取到综合评分结果，使用基础数据');
    }

    // 将候选转换为GeneratedName格式，包含详细评分信息
    return scoredCandidates.map((candidate: any) => {
      // 计算五格数理
      const surnameStrokes = candidate.components?.surname?.strokes || 0;
      const firstStrokes = candidate.components?.first?.strokes || 0;
      const secondStrokes = candidate.components?.second?.strokes || 0;
      
      const grids = {
        tiange: surnameStrokes + 1,
        renge: surnameStrokes + firstStrokes,
        dige: firstStrokes + secondStrokes,
        zongge: surnameStrokes + firstStrokes + secondStrokes,
        waige: secondStrokes + 1
      };

      // 构建三才信息
      const sancai = {
        heaven: candidate.components?.surname?.wuxing || '未知',
        human: candidate.components?.first?.wuxing || '未知',
        earth: candidate.components?.second?.wuxing || '未知',
        combination: candidate.scoringDetails?.sancai?.calculation?.sancaiPattern || '未知',
        level: candidate.grade || '中等',
        description: candidate.recommendation || '五行调和，运势平稳'
      };

      return {
        fullName: candidate.fullName,
        familyName: candidate.components?.surname?.char || candidate.familyName,
        midChar: candidate.components?.first?.char || candidate.firstName, 
        lastChar: candidate.components?.second?.char || candidate.secondName,
        score: candidate.comprehensiveScore || candidate.metadata?.generationScore || 80,
        grids,
        sancai,
        explanation: candidate.recommendation || `${candidate.fullName}：蕴含深意，综合评分 ${candidate.comprehensiveScore || 80} 分`,
        
        // 添加详细评分信息（用于详细分析页面）
        components: candidate.components,
        scores: candidate.scores,
        scoringDetails: candidate.scoringDetails,
        comprehensiveScore: candidate.comprehensiveScore,
        comprehensiveCalculation: candidate.comprehensiveCalculation,
        grade: candidate.grade,
        recommendation: candidate.recommendation
      };
    });
  }

  /**
   * 计算元数据
   */
  private calculateMetadata(pipelineResult: any, startTime: number): any {
    const pluginsExecuted = pipelineResult.pluginResults.size;
    const layersProcessed = pipelineResult.metadata?.layersProcessed || 4;
    
    // 计算平均置信度
    let totalConfidence = 0;
    let validPlugins = 0;
    
    for (const [pluginId, result] of pipelineResult.pluginResults) {
      if (result.confidence !== undefined) {
        totalConfidence += result.confidence;
        validPlugins++;
      }
    }
    
    const averageConfidence = validPlugins > 0 ? Math.round(totalConfidence / validPlugins) : 0;

    return {
      pluginsExecuted,
      layersProcessed,
      generationMethod: 'true-plugin-system',
      confidence: averageConfidence,
      executionTime: Date.now() - startTime,
      analysisReport: {
        pluginContributions: Array.from(pipelineResult.pluginResults.keys()),
        layerBreakdown: {
          layer1: ['surname', 'gender', 'birth-time'].filter(p => pipelineResult.pluginResults.has(p)),
          layer2: ['zodiac', 'xiyongshen'].filter(p => pipelineResult.pluginResults.has(p)),
          layer3: ['stroke', 'wuxing-char', 'meaning', 'phonetic'].filter(p => pipelineResult.pluginResults.has(p)),
          layer4: ['name-generation'].filter(p => pipelineResult.pluginResults.has(p))
        }
      }
    };
  }

  /**
   * 记录插件详细结果
   */
  private logPluginResult(pluginId: string, layer: number, result: any): void {
    try {
      // 根据插件类型和结果格式化详细日志
      const summary = this.formatPluginResultSummary(pluginId, result);
      this.log('info', `📊 ${pluginId} 分析结果:`, pluginId, layer, summary);

      // 记录关键分析数据
      const analysisData = this.extractAnalysisData(pluginId, result);
      if (analysisData && Object.keys(analysisData).length > 0) {
        this.log('info', `🔍 ${pluginId} 分析细节:`, pluginId, layer, analysisData);
      }

      // 记录决策依据
      const decisions = this.extractDecisionBasis(pluginId, result);
      if (decisions && decisions.length > 0) {
        this.log('info', `⚡ ${pluginId} 决策依据:`, pluginId, layer, { decisions });
      }

    } catch (error) {
      this.log('warn', `⚠️ ${pluginId} 结果日志记录失败`, pluginId, layer, { error });
    }
  }

  /**
   * 格式化插件结果摘要
   */
  private formatPluginResultSummary(pluginId: string, result: any): any {
    // 修复：统一使用 data 字段而不是 results
    const data = result?.data;
    
    switch (pluginId) {
      case 'surname':
        return {
          familyName: data?.familyName,
          strokes: data?.characterInfo?.strokes?.traditional,
          wuxing: data?.characterInfo?.wuxing,
          pronunciation: data?.characterInfo?.primaryPinyin
        };

      case 'gender':
        return {
          gender: data?.gender,
          preferredCharacteristics: data?.characterFilter,
          avoidedCharacteristics: data?.literarySourcePreference?.discouraged
        };

      case 'birth-time':
        return {
          birthInfo: data?.birthInfo,
          lunarInfo: data?.lunarInfo,
          seasonalInfo: data?.seasonalInfo
        };

      case 'zodiac':
        return {
          zodiac: data?.zodiacAnalysis?.zodiacInfo?.animal || data?.primaryZodiac,
          element: data?.zodiacAnalysis?.zodiacInfo?.element,
          favorableCharacters: data?.zodiacAnalysis?.zodiacInfo?.favorableCharacters?.slice(0, 5) || [],
          unfavorableCharacters: data?.zodiacAnalysis?.zodiacInfo?.unfavorableCharacters?.slice(0, 5) || []
        };

      case 'xiyongshen':
        return {
          favoredElements: data?.recommendations?.primaryElements || data?.analysis?.yongShen,
          avoidedElements: data?.recommendations?.avoidElements || data?.analysis?.jiShen,
          elementalBalance: data?.recommendations?.balanceStrategy,
          strengthAnalysis: data?.analysis?.strongWeak
        };

      case 'stroke':
        return {
          bestCombinations: data?.bestCombinations?.slice(0, 3),
          familyNameStrokes: data?.familyNameStrokes,
          analysisType: data?.analysisType,
          totalCombinations: data?.totalCombinations
        };

      case 'wuxing-char':
        return {
          candidateCount: data?.candidatesByElement ? Object.values(data.candidatesByElement).reduce((sum: number, arr: any) => sum + (Array.isArray(arr) ? arr.length : 0), 0) : 0,
          targetElements: data?.targetElements,
          elementDistribution: data?.elementDistribution
        };

      case 'zodiac-char':
        return {
          suitableCharacters: data?.suitableCharacters?.length || 0,
          unsuitable: data?.unsuitable?.length || 0,
          zodiacCompatibility: data?.zodiacCompatibility,
          recommendations: data?.recommendations
        };

      case 'meaning':
        return {
          analyzedCharacters: data?.characterAnalysis?.length || 0,
          averageScore: data?.averageScore,
          topMeanings: data?.characterAnalysis?.slice(0, 3)?.map((c: any) => ({
            char: c.character,
            score: c.totalScore,
            meanings: c.meanings?.slice(0, 2)
          }))
        };

      case 'phonetic':
        return {
          harmonyScore: data?.harmonyAnalysis?.overallScore,
          tonePattern: data?.harmonyAnalysis?.tonePattern,
          recommendations: data?.recommendations?.slice(0, 3)
        };

      case 'name-generation':
        return {
          namesGenerated: data?.names?.length || 0,
          averageScore: data?.averageScore,
          topNames: data?.names?.slice(0, 3)?.map((name: any) => ({
            name: name.name,
            score: name.totalScore,
            reasoning: name.reasoning?.slice(0, 2)
          }))
        };

      case 'wuxing-selection':
        return {
          primaryElements: data?.baseStrategy?.primaryElements,
          avoidElements: data?.baseStrategy?.avoidElements,
          targetCombination: data?.baseStrategy?.targetCombination,
          strategicPrinciple: data?.baseStrategy?.strategicPrinciple
        };

      case 'zodiac-selection':
        return {
          approachType: data?.selectionStrategy?.approachType,
          highlyRecommended: data?.characterCriteria?.highlyRecommended?.characters?.slice(0, 3),
          discouraged: data?.characterCriteria?.discouraged?.characters?.slice(0, 3),
          forbidden: data?.characterCriteria?.forbidden?.characters?.slice(0, 3)
        };

      case 'meaning-selection':
        return {
          culturalDepth: data?.selectionStrategy?.culturalDepth,
          preferredCategories: data?.semanticCriteria?.preferredSemantics?.map((s: any) => s.category)?.slice(0, 2),
          literarySources: data?.culturalCriteria?.literarySources?.slice(0, 3)
        };

      case 'stroke-selection':
        return {
          recommendedType: data?.nameTypeSettings?.recommendedType,
          bestCombinations: data?.recommendations?.doubleCharBest?.slice(0, 2),
          familyNameStrokes: data?.surnameInfo?.familyNameStrokes
        };

      case 'phonetic-selection':
        return {
          surnameInfo: `${data?.phoneticAnalysis?.surnameInfo?.pinyin}(${data?.phoneticAnalysis?.surnameInfo?.tone}声)`,
          preferredPatterns: data?.phoneticCriteria?.preferredTonePatterns?.slice(0, 3),
          harmonyThreshold: data?.phoneticCriteria?.harmonyThreshold
        };

      default:
        return {
          hasResults: !!data,
          keyFields: data ? Object.keys(data).slice(0, 5) : []
        };
    }
  }

  /**
   * 提取分析数据
   */
  private extractAnalysisData(pluginId: string, result: any): any {
    const { data, metadata } = result;
    
    const analysisData: any = {
      processingTime: metadata?.processingTime,
      dataSource: metadata?.dataSource,
      confidence: result.confidence
    };

    switch (pluginId) {
      case 'stroke':
        if (data?.strokeData) {
          analysisData.strokeDetails = data.strokeData.map((item: any) => ({
            char: item.character,
            strokes: item.strokes,
            source: item.source
          }));
        }
        if (data?.combinations) {
          analysisData.combinations = data.combinations.map((combo: any) => ({
            pattern: combo.combination.join('+'),
            suitability: combo.suitability,
            notes: combo.notes
          }));
        }
        break;

      case 'xiyongshen':
        if (data?.bazi) {
          analysisData.baziAnalysis = {
            heavenlyStems: data.bazi.heavenlyStems,
            earthlyBranches: data.bazi.earthlyBranches,
            elementCount: data.bazi.elementCount
          };
        }
        break;

      case 'wuxing-char':
        if (data?.candidatesByElement) {
          analysisData.elementCandidates = {};
          for (const [element, chars] of Object.entries(data.candidatesByElement)) {
            analysisData.elementCandidates[element] = Array.isArray(chars) ? chars.length : 0;
          }
        }
        break;

      case 'name-generation':
        if (data?.names && data.names.length > 0) {
          analysisData.scoreDistribution = {
            highest: Math.max(...data.names.map((n: any) => n.totalScore || 0)),
            lowest: Math.min(...data.names.map((n: any) => n.totalScore || 0)),
            average: data.names.reduce((sum: number, n: any) => sum + (n.totalScore || 0), 0) / data.names.length
          };
        }
        break;
    }

    return analysisData;
  }

  /**
   * 提取决策依据
   */
  private extractDecisionBasis(pluginId: string, result: any): string[] {
    const decisions: string[] = [];
    const { data } = result;

    switch (pluginId) {
      case 'surname':
        if (data?.strokes) {
          decisions.push(`姓氏笔画数: ${data.strokes}`);
        }
        if (data?.wuxing) {
          decisions.push(`姓氏五行: ${data.wuxing}`);
        }
        break;

      case 'xiyongshen':
        if (data?.favoredElements) {
          decisions.push(`喜用神: ${data.favoredElements.join('、')}`);
        }
        if (data?.avoidedElements) {
          decisions.push(`忌用神: ${data.avoidedElements.join('、')}`);
        }
        break;

      case 'stroke':
        if (data?.bestCombinations && data.bestCombinations.length > 0) {
          const best = data.bestCombinations[0];
          decisions.push(`最佳笔画组合: ${best.mid}+${best.last} (总分:${best.score})`);
          decisions.push(`三才类型: ${best.sancaiType}`);
        }
        break;

      case 'wuxing-char':
        if (data?.targetElements) {
          decisions.push(`目标五行: ${data.targetElements.join('、')}`);
        }
        break;

      case 'zodiac-char':
        if (data?.zodiacCompatibility) {
          decisions.push(`生肖: ${data.zodiacCompatibility.zodiac}`);
          decisions.push(`生肖五行: ${data.zodiacCompatibility.element}`);
        }
        break;

      case 'name-generation':
        if (data?.names && data.names.length > 0) {
          decisions.push(`生成名字数量: ${data.names.length}`);
          decisions.push(`最高分名字: ${data.names[0]?.name} (${data.names[0]?.totalScore}分)`);
        }
        break;
    }

    return decisions;
  }

  /**
   * 根据确定性等级获取启用的插件
   */
  private getEnabledPluginsForLevel(certaintyLevel: CertaintyLevel): string[] {
    switch (certaintyLevel) {
      case CertaintyLevel.FULLY_DETERMINED:
        // Level 1: 完全确定 - 所有18个插件
        return [
          'surname', 'gender', 'birth-time',
          'bazi', 'zodiac', 'xiyongshen',
          'wuxing-selection', 'zodiac-selection', 'meaning-selection', 'stroke-selection', 'phonetic-selection',
          'character-filter', 'name-combination',
          'sancai-scoring', 'phonetic-scoring', 'wuxing-balance-scoring', 'dayan-scoring', 'comprehensive-scoring'
        ];
      
      case CertaintyLevel.PARTIALLY_DETERMINED:
        // Level 2: 部分确定 - 15个插件（去掉八字精确分析）
        return [
          'surname', 'gender', 'birth-time',
          'zodiac', 'xiyongshen',
          'wuxing-selection', 'zodiac-selection', 'meaning-selection', 'stroke-selection', 'phonetic-selection',
          'character-filter', 'name-combination',
          'sancai-scoring', 'phonetic-scoring', 'comprehensive-scoring'
        ];
      
      case CertaintyLevel.ESTIMATED:
        // Level 3: 预估阶段 - 10个核心插件
        return [
          'surname', 'gender', 'birth-time',
          'zodiac', 'wuxing-selection', 'meaning-selection',
          'character-filter', 'name-combination', 
          'sancai-scoring', 'comprehensive-scoring'
        ];
      
      case CertaintyLevel.UNKNOWN:
        // Level 4: 基础模式 - 6个基础插件
        return [
          'surname', 'gender',
          'name-combination', 'comprehensive-scoring'
        ];
      
      default:
        // 默认返回完全确定的插件集合
        return this.getEnabledPluginsForLevel(CertaintyLevel.FULLY_DETERMINED);
    }
  }

  /**
   * 获取确定性等级的友好名称
   */
  private getCertaintyLevelName(certaintyLevel: CertaintyLevel): string {
    switch (certaintyLevel) {
      case CertaintyLevel.FULLY_DETERMINED: return '完全确定';
      case CertaintyLevel.PARTIALLY_DETERMINED: return '部分确定';
      case CertaintyLevel.ESTIMATED: return '预估阶段';
      case CertaintyLevel.UNKNOWN: return '基础模式';
      default: return '未知等级';
    }
  }

  /**
   * 根据层级和启用插件列表执行插件
   */
  private async executeLayerPlugins(
    layer: number, 
    enabledPlugins: string[], 
    input: StandardInput, 
    results: Map<string, any>
  ): Promise<void> {
    const layerPlugins = this.getPluginsForLayer(layer, enabledPlugins);
    
    if (layerPlugins.length === 0) {
      this.log('info', `⏭️ 第${layer}层没有启用的插件`);
      return;
    }

    this.log('info', `🔧 第${layer}层将执行插件: ${layerPlugins.join(', ')}`);

    for (const pluginId of layerPlugins) {
      // 检查插件的前置条件
      if (this.shouldSkipPlugin(pluginId, input)) {
        this.log('info', `⏭️ 跳过插件: ${pluginId} (不满足执行条件)`);
        continue;
      }

      try {
        const plugin = pluginFactory.createPlugin(pluginId as any);
        const defaultConfig = {
          enabled: true,
          priority: 1,
          timeout: 30000,
          retryCount: 3
        };
        await plugin.initialize(defaultConfig, this.createPluginContext(pluginId, input, defaultConfig, results));
        
        this.log('info', `🔄 执行插件: ${pluginId}`, pluginId, layer);
        
        const result = await plugin.process(input, this.createPluginContext(pluginId, input, defaultConfig, results));
        results.set(pluginId, result);
        
        // 更新共享上下文
        results.set(pluginId, result);
        
        // 详细的结果日志
        this.logPluginResult(pluginId, layer, result);
        
        // 检查插件是否真正成功 - 如果data为null或undefined，认为是失败
        if (!result.success || result.data === null || result.data === undefined) {
          throw new Error(`插件 ${pluginId} 执行失败: 返回数据为空或无效`);
        }


        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        this.log('error', `❌ 插件执行失败: ${pluginId}`, pluginId, layer, { 
          error: errorMsg,
          stack: errorStack,
          errorType: error?.constructor?.name || 'Unknown'
        });
        
        // 修复：任何插件失败都应该停止执行，除非明确标记为可选
        if (this.isCriticalPlugin(pluginId) || input.preferences?.certaintyLevel === CertaintyLevel.FULLY_DETERMINED) {
          this.log('error', `🛑 关键插件 ${pluginId} 失败，停止执行后续插件`, pluginId, layer);
          throw error; // 关键插件失败或完全确定模式下，停止执行
        }
        
        // 可选插件失败时继续执行，但记录警告
        this.log('warn', `⚠️ 可选插件 ${pluginId} 失败，继续执行后续插件`, pluginId, layer);
      }
    }
  }

  /**
   * 获取指定层级的插件列表
   */
  private getPluginsForLayer(layer: number, enabledPlugins: string[]): string[] {
    const layerPluginMap: Record<number, string[]> = {
      1: ['surname', 'gender', 'birth-time'],
      2: ['bazi', 'zodiac', 'xiyongshen'],
      3: ['wuxing-selection', 'zodiac-selection', 'meaning-selection', 'stroke-selection', 'phonetic-selection'],
      4: ['character-filter'],
      5: ['name-combination'],
      6: ['sancai-scoring', 'phonetic-scoring', 'wuxing-balance-scoring', 'dayan-scoring', 'comprehensive-scoring']
    };

    const layerPlugins = layerPluginMap[layer] || [];
    const filteredPlugins = layerPlugins.filter(plugin => enabledPlugins.includes(plugin));
    
    // 调试日志
    this.log('info', `🔍 Layer ${layer} 插件过滤调试`, undefined, undefined, {
      layerPlugins,
      enabledPlugins: enabledPlugins.slice(0, 10), // 只显示前10个避免日志过长
      filteredPlugins,
      totalEnabledCount: enabledPlugins.length
    });
    
    return filteredPlugins;
  }

  /**
   * 检查是否应该跳过插件
   */
  private shouldSkipPlugin(pluginId: string, input: StandardInput): boolean {
    switch (pluginId) {
      case 'birth-time':
        return !input.birthInfo;
      case 'bazi':
        return !input.birthInfo || (!input.birthInfo.hour && input.preferences?.certaintyLevel === CertaintyLevel.FULLY_DETERMINED);
      case 'zodiac':
        return !input.birthInfo?.year;
      case 'xiyongshen':
        return !input.birthInfo;
      case 'zodiac-char':
        // 这个需要检查插件结果，但现在没有context，暂时不跳过
        return false;
      case 'family-tradition':
        return input.preferences?.certaintyLevel === CertaintyLevel.UNKNOWN; // 基础模式下跳过
      default:
        return false;
    }
  }

  /**
   * 检查是否为关键插件
   */
  private isCriticalPlugin(pluginId: string): boolean {
    return ['surname', 'name-generation'].includes(pluginId);
  }

  /**
   * 创建日志函数
   */
  private createLogFunction(pluginId: string) {
    return (level: 'info' | 'warn' | 'error', message: string) => {
      this.log(level, message, pluginId);
    };
  }

  /**
   * 记录日志
   */
  private log(
    level: 'info' | 'warn' | 'error', 
    message: string, 
    pluginId?: string, 
    layer?: number, 
    data?: any
  ): void {
    const logEntry = {
      timestamp: Date.now(),
      level,
      message,
      pluginId,
      layer,
      data
    };
    
    this.executionLogs.push(logEntry);
    
    // 同时输出到控制台
    const prefix = pluginId ? `[${pluginId}]` : '[TruePluginEngine]';
    const layerInfo = layer ? ` Layer${layer}` : '';
    console.log(`${prefix}${layerInfo} ${message}`, data || '');
  }
}

// 导出单例
export const truePluginEngine = new TruePluginEngine();
