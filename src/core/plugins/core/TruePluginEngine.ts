/**
 * 真正的插件系统执行引擎
 * 
 * 这个引擎使用真实的插件容器和管道来执行完整的插件化名字生成流程
 */

import { PluginContainer } from './PluginContainer';
import { NamingPipelineIntegrated } from './NamingPipelineIntegrated';
import { PluginFactory, PluginType } from '../implementations/PluginFactory';
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
    const pluginTypes: PluginType[] = [
      // Layer 1: 基础信息层
      'surname', 'gender', 'birth-time',
      // Layer 2: 命理基础层
      'zodiac',
      // Layer 3: 字符评估层
      'stroke', 'wuxing-char', 'meaning',
      // Layer 4: 组合计算层
      'name-generation'
    ];

    this.log('info', '🔄 开始注册插件', undefined, undefined, {
      totalPlugins: pluginTypes.length,
      pluginList: pluginTypes
    });

    for (const pluginType of pluginTypes) {
      try {
        await this.container.registerPlugin(pluginType);
        this.log('info', `✅ 插件注册成功: ${pluginType}`);
      } catch (error) {
        this.log('warn', `⚠️ 插件注册失败: ${pluginType}`, undefined, undefined, { 
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
  private createPluginContext(pluginId: string, input: StandardInput, config: any) {
    return {
      requestId: input.requestId,
      getPluginResult: <T = any>(id: string): T | null => {
        return input.context.pluginResults.get(id) || null;
      },
      setPluginResult: (id: string, result: any): void => {
        input.context.pluginResults.set(id, result);
      },
      getConfig: () => config,
      log: this.createLogFunction(pluginId)
    };
  }

  /**
   * 构建标准输入
   */
  private buildStandardInput(request: TruePluginRequest): StandardInput {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      requestId,
      certaintyLevel: request.preferences?.certaintyLevel || CertaintyLevel.FULLY_DETERMINED,
      data: {
        familyName: request.familyName,
        gender: request.gender,
        characters: request.characters || [],
        birthInfo: request.birthInfo ? {
          year: request.birthInfo.year,
          month: request.birthInfo.month,
          day: request.birthInfo.day,
          hour: request.birthInfo.hour,
          minute: request.birthInfo.minute
        } : undefined,
        preferences: {
          nameCount: request.preferences?.nameCount || request.limit || 5,
          scoreThreshold: request.preferences?.scoreThreshold || request.scoreThreshold || 80,
          certaintyLevel: request.preferences?.certaintyLevel,
          includeTraditionalAnalysis: request.preferences?.includeTraditionalAnalysis || request.useTraditional || false,
          skipOptionalFailures: request.preferences?.skipOptionalFailures !== false,
          preferredElements: request.preferredElements,
          avoidedWords: request.avoidedWords || []
        }
      },
      context: {
        requestId,
        startTime: Date.now(),
        certaintyLevel: request.preferences?.certaintyLevel || CertaintyLevel.FULLY_DETERMINED,
        pluginResults: new Map(),
        errors: [],
        warnings: [],
        log: (level: 'info' | 'warn' | 'error', message: string, data?: any) => {
          this.log(level, message, undefined, undefined, data);
        }
      }
    };
  }

  /**
   * 执行插件管道
   */
  private async executePipeline(input: StandardInput): Promise<any> {
    const pluginResults = new Map();
    const certaintyLevel = input.certaintyLevel;
    
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

    // Layer 4: 组合计算层（包含名字生成）
    this.log('info', '🔴 Layer 4: 组合计算层');
    await this.executeLayerPlugins(4, enabledPlugins, input, pluginResults);

    return {
      pluginResults,
      input,
      metadata: {
        layersProcessed: 4,
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
    const layer1Plugins = ['surname', 'gender', 'birth-time', 'family-tradition'];

    for (const pluginId of layer1Plugins) {
      if (pluginId === 'birth-time' && !input.data.birthInfo) {
        this.log('info', `⏭️ 跳过插件: ${pluginId} (缺少出生信息)`);
        continue;
      }

      try {
        const plugin = PluginFactory.createPlugin(pluginId as any);
        const defaultConfig = {
          enabled: true,
          priority: 1,
          timeout: 30000,
          retryCount: 3
        };
        await plugin.initialize(defaultConfig, this.createPluginContext(pluginId, input, defaultConfig));
        
        this.log('info', `🔄 执行插件: ${pluginId}`, pluginId, 1);
        
        const result = await plugin.process(input);
        results.set(pluginId, result);
        
        // 更新共享上下文
        input.context.pluginResults.set(pluginId, result);
        
        // 详细的结果日志
        this.logPluginResult(pluginId, 1, result);
        
        this.log('info', `✅ 插件执行成功: ${pluginId}`, pluginId, 1, {
          confidence: result.confidence
        });
        
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
      if (pluginId === 'zodiac' && !input.data.birthInfo?.year) {
        this.log('info', `⏭️ 跳过插件: ${pluginId} (缺少出生年份)`);
        continue;
      }

      try {
        const plugin = PluginFactory.createPlugin(pluginId as any);
        const defaultConfig = {
          enabled: true,
          priority: 1,
          timeout: 30000,
          retryCount: 3
        };
        await plugin.initialize(defaultConfig, this.createPluginContext(pluginId, input, defaultConfig));
        
        this.log('info', `🔄 执行插件: ${pluginId}`, pluginId, 2);
        
        const result = await plugin.process(input);
        results.set(pluginId, result);
        
        // 更新共享上下文
        input.context.pluginResults.set(pluginId, result);
        
        // 详细的结果日志
        this.logPluginResult(pluginId, 2, result);
        
        this.log('info', `✅ 插件执行成功: ${pluginId}`, pluginId, 2, {
          confidence: result.confidence
        });
        
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
      if (pluginId === 'zodiac-char' && !input.context.pluginResults.has('zodiac')) {
        this.log('info', `⏭️ 跳过插件: ${pluginId} (zodiac插件未成功执行)`);
        continue;
      }

      try {
        const plugin = PluginFactory.createPlugin(pluginId as any);
        const defaultConfig = {
          enabled: true,
          priority: 1,
          timeout: 30000,
          retryCount: 3
        };
        await plugin.initialize(defaultConfig, this.createPluginContext(pluginId, input, defaultConfig));
        
        this.log('info', `🔄 执行插件: ${pluginId}`, pluginId, 3);
        
        const result = await plugin.process(input);
        results.set(pluginId, result);
        
        // 更新共享上下文
        input.context.pluginResults.set(pluginId, result);
        
        // 详细的结果日志
        this.logPluginResult(pluginId, 3, result);
        
        this.log('info', `✅ 插件执行成功: ${pluginId}`, pluginId, 3, {
          confidence: result.confidence
        });
        
      } catch (error) {
        this.log('error', `❌ 插件执行失败: ${pluginId}`, pluginId, 3, { error });
        // 继续执行其他插件
      }
    }
  }

  /**
   * 执行 Layer 4 插件（关键：名字生成）
   */
  private async executeLayer4Plugins(input: StandardInput, results: Map<string, any>): Promise<void> {
    const layer4Plugins = ['name-generation']; // 只执行名字生成插件

    for (const pluginId of layer4Plugins) {
      try {
        const plugin = PluginFactory.createPlugin(pluginId as any);
        const defaultConfig = {
          enabled: true,
          priority: 1,
          timeout: 30000,
          retryCount: 3
        };
        await plugin.initialize(defaultConfig, this.createPluginContext(pluginId, input, defaultConfig));
        
        this.log('info', `🔄 执行插件: ${pluginId}`, pluginId, 4);
        
        const result = await plugin.process(input);
        results.set(pluginId, result);
        
        // 更新共享上下文
        input.context.pluginResults.set(pluginId, result);
        
        // 详细的结果日志
        this.logPluginResult(pluginId, 4, result);
        
        this.log('info', `✅ 插件执行成功: ${pluginId}`, pluginId, 4, {
          confidence: result.confidence,
          namesGenerated: result.results?.names?.length || 0
        });
        
      } catch (error) {
        this.log('error', `❌ 插件执行失败: ${pluginId}`, pluginId, 4, { error });
        throw error; // 名字生成失败是致命的
      }
    }
  }

  /**
   * 提取生成的名字
   */
  private extractGeneratedNames(pipelineResult: any): GeneratedName[] {
    const nameGenerationResult = pipelineResult.pluginResults.get('name-generation');
    
    if (!nameGenerationResult || !nameGenerationResult.results?.names) {
      this.log('warn', '⚠️ 名字生成插件未返回有效结果');
      return [];
    }

    return nameGenerationResult.results.names;
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
    const { results } = result;
    
    switch (pluginId) {
      case 'surname':
        return {
          familyName: results?.familyName,
          strokes: results?.strokes,
          wuxing: results?.wuxing,
          pronunciation: results?.pronunciation
        };

      case 'gender':
        return {
          gender: results?.gender,
          preferredCharacteristics: results?.preferredCharacteristics?.slice(0, 3),
          avoidedCharacteristics: results?.avoidedCharacteristics?.slice(0, 3)
        };

      case 'birth-time':
        return {
          birthInfo: results?.birthInfo,
          lunarInfo: results?.lunarInfo,
          seasonalInfo: results?.seasonalInfo
        };

      case 'zodiac':
        return {
          zodiac: results?.zodiac,
          element: results?.element,
          favorableCharacters: results?.favorableCharacters?.slice(0, 5),
          unfavorableCharacters: results?.unfavorableCharacters?.slice(0, 5)
        };

      case 'xiyongshen':
        return {
          favoredElements: results?.favoredElements,
          avoidedElements: results?.avoidedElements,
          elementalBalance: results?.elementalBalance,
          strengthAnalysis: results?.strengthAnalysis
        };

      case 'stroke':
        return {
          bestCombinations: results?.bestCombinations?.slice(0, 3),
          familyNameStrokes: results?.familyNameStrokes,
          analysisType: results?.analysisType,
          totalCombinations: results?.totalCombinations
        };

      case 'wuxing-char':
        return {
          candidateCount: results?.candidatesByElement ? Object.values(results.candidatesByElement).reduce((sum: number, arr: any) => sum + (Array.isArray(arr) ? arr.length : 0), 0) : 0,
          targetElements: results?.targetElements,
          elementDistribution: results?.elementDistribution
        };

      case 'zodiac-char':
        return {
          suitableCharacters: results?.suitableCharacters?.length || 0,
          unsuitable: results?.unsuitable?.length || 0,
          zodiacCompatibility: results?.zodiacCompatibility,
          recommendations: results?.recommendations
        };

      case 'meaning':
        return {
          analyzedCharacters: results?.characterAnalysis?.length || 0,
          averageScore: results?.averageScore,
          topMeanings: results?.characterAnalysis?.slice(0, 3)?.map((c: any) => ({
            char: c.character,
            score: c.totalScore,
            meanings: c.meanings?.slice(0, 2)
          }))
        };

      case 'phonetic':
        return {
          harmonyScore: results?.harmonyAnalysis?.overallScore,
          tonePattern: results?.harmonyAnalysis?.tonePattern,
          recommendations: results?.recommendations?.slice(0, 3)
        };

      case 'name-generation':
        return {
          namesGenerated: results?.names?.length || 0,
          averageScore: results?.averageScore,
          topNames: results?.names?.slice(0, 3)?.map((name: any) => ({
            name: name.name,
            score: name.totalScore,
            reasoning: name.reasoning?.slice(0, 2)
          }))
        };

      default:
        return {
          hasResults: !!results,
          keyFields: results ? Object.keys(results).slice(0, 5) : []
        };
    }
  }

  /**
   * 提取分析数据
   */
  private extractAnalysisData(pluginId: string, result: any): any {
    const { results, metadata } = result;
    
    const analysisData: any = {
      processingTime: metadata?.processingTime,
      dataSource: metadata?.dataSource,
      confidence: result.confidence
    };

    switch (pluginId) {
      case 'stroke':
        if (results?.strokeData) {
          analysisData.strokeDetails = results.strokeData.map((item: any) => ({
            char: item.character,
            strokes: item.strokes,
            source: item.source
          }));
        }
        if (results?.combinations) {
          analysisData.combinations = results.combinations.map((combo: any) => ({
            pattern: combo.combination.join('+'),
            suitability: combo.suitability,
            notes: combo.notes
          }));
        }
        break;

      case 'xiyongshen':
        if (results?.bazi) {
          analysisData.baziAnalysis = {
            heavenlyStems: results.bazi.heavenlyStems,
            earthlyBranches: results.bazi.earthlyBranches,
            elementCount: results.bazi.elementCount
          };
        }
        break;

      case 'wuxing-char':
        if (results?.candidatesByElement) {
          analysisData.elementCandidates = {};
          for (const [element, chars] of Object.entries(results.candidatesByElement)) {
            analysisData.elementCandidates[element] = Array.isArray(chars) ? chars.length : 0;
          }
        }
        break;

      case 'name-generation':
        if (results?.names && results.names.length > 0) {
          analysisData.scoreDistribution = {
            highest: Math.max(...results.names.map((n: any) => n.totalScore || 0)),
            lowest: Math.min(...results.names.map((n: any) => n.totalScore || 0)),
            average: results.names.reduce((sum: number, n: any) => sum + (n.totalScore || 0), 0) / results.names.length
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
    const { results } = result;

    switch (pluginId) {
      case 'surname':
        if (results?.strokes) {
          decisions.push(`姓氏笔画数: ${results.strokes}`);
        }
        if (results?.wuxing) {
          decisions.push(`姓氏五行: ${results.wuxing}`);
        }
        break;

      case 'xiyongshen':
        if (results?.favoredElements) {
          decisions.push(`喜用神: ${results.favoredElements.join('、')}`);
        }
        if (results?.avoidedElements) {
          decisions.push(`忌用神: ${results.avoidedElements.join('、')}`);
        }
        break;

      case 'stroke':
        if (results?.bestCombinations && results.bestCombinations.length > 0) {
          const best = results.bestCombinations[0];
          decisions.push(`最佳笔画组合: ${best.mid}+${best.last} (总分:${best.score})`);
          decisions.push(`三才类型: ${best.sancaiType}`);
        }
        break;

      case 'wuxing-char':
        if (results?.targetElements) {
          decisions.push(`目标五行: ${results.targetElements.join('、')}`);
        }
        break;

      case 'zodiac-char':
        if (results?.zodiacCompatibility) {
          decisions.push(`生肖: ${results.zodiacCompatibility.zodiac}`);
          decisions.push(`生肖五行: ${results.zodiacCompatibility.element}`);
        }
        break;

      case 'name-generation':
        if (results?.names && results.names.length > 0) {
          decisions.push(`生成名字数量: ${results.names.length}`);
          decisions.push(`最高分名字: ${results.names[0]?.name} (${results.names[0]?.totalScore}分)`);
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
        // Level 1: 完全确定 - 所有15个插件
        return [
          'surname', 'gender', 'birth-time', 'family-tradition',
          'bazi', 'zodiac', 'xiyongshen',
          'stroke', 'wuxing-char', 'zodiac-char', 'meaning', 'phonetic',
          'sancai', 'dayan', 'name-generation'
        ];
      
      case CertaintyLevel.PARTIALLY_DETERMINED:
        // Level 2: 部分确定 - 13个插件（去掉精确时辰相关）
        return [
          'surname', 'gender', 'birth-time',
          'zodiac', 'xiyongshen',
          'stroke', 'wuxing-char', 'zodiac-char', 'meaning', 'phonetic',
          'sancai', 'dayan', 'name-generation'
        ];
      
      case CertaintyLevel.ESTIMATED:
        // Level 3: 预估阶段 - 9个核心插件
        return [
          'surname', 'gender', 'birth-time',
          'zodiac', 'stroke', 'meaning', 'phonetic',
          'sancai', 'name-generation'
        ];
      
      case CertaintyLevel.UNKNOWN:
        // Level 4: 基础模式 - 6个基础插件
        return [
          'surname', 'gender',
          'stroke', 'meaning', 'phonetic',
          'name-generation'
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
        const plugin = PluginFactory.createPlugin(pluginId as any);
        const defaultConfig = {
          enabled: true,
          priority: 1,
          timeout: 30000,
          retryCount: 3
        };
        await plugin.initialize(defaultConfig, this.createPluginContext(pluginId, input, defaultConfig));
        
        this.log('info', `🔄 执行插件: ${pluginId}`, pluginId, layer);
        
        const result = await plugin.process(input);
        results.set(pluginId, result);
        
        // 更新共享上下文
        input.context.pluginResults.set(pluginId, result);
        
        // 详细的结果日志
        this.logPluginResult(pluginId, layer, result);
        
        this.log('info', `✅ 插件执行成功: ${pluginId}`, pluginId, layer, {
          confidence: result.confidence
        });
        
      } catch (error) {
        this.log('error', `❌ 插件执行失败: ${pluginId}`, pluginId, layer, { error });
        // 根据确定性等级决定是否继续执行
        if (input.certaintyLevel === CertaintyLevel.FULLY_DETERMINED && this.isCriticalPlugin(pluginId)) {
          throw error; // 在完全确定模式下，关键插件失败应该停止执行
        }
        // 其他情况继续执行
      }
    }
  }

  /**
   * 获取指定层级的插件列表
   */
  private getPluginsForLayer(layer: number, enabledPlugins: string[]): string[] {
    const layerPluginMap: Record<number, string[]> = {
      1: ['surname', 'gender', 'birth-time', 'family-tradition'],
      2: ['bazi', 'zodiac', 'xiyongshen'],
      3: ['stroke', 'wuxing-char', 'zodiac-char', 'meaning', 'phonetic'],
      4: ['sancai', 'dayan', 'yijing', 'wuxing-balance', 'name-generation']
    };

    const layerPlugins = layerPluginMap[layer] || [];
    return layerPlugins.filter(plugin => enabledPlugins.includes(plugin));
  }

  /**
   * 检查是否应该跳过插件
   */
  private shouldSkipPlugin(pluginId: string, input: StandardInput): boolean {
    switch (pluginId) {
      case 'birth-time':
        return !input.data.birthInfo;
      case 'bazi':
        return !input.data.birthInfo || (!input.data.birthInfo.hour && input.certaintyLevel === CertaintyLevel.FULLY_DETERMINED);
      case 'zodiac':
        return !input.data.birthInfo?.year;
      case 'xiyongshen':
        return !input.data.birthInfo;
      case 'zodiac-char':
        return !input.context.pluginResults.has('zodiac');
      case 'family-tradition':
        return input.certaintyLevel === CertaintyLevel.UNKNOWN; // 基础模式下跳过
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
