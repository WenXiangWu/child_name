/**
 * 集成取名管道 - 完整的取名系统集成实现
 */

import { CertaintyLevel } from '../interfaces/NamingPlugin';
import { PluginContainer, PluginManifest } from './PluginContainer';
import { NamingPipeline, PipelineInput, PipelineOutput } from './NamingPipeline';
import { CertaintyLevelManager } from './CertaintyLevelManager';
import { PredueDateHandler, PredueInfo } from '../utils/PredueDateHandler';
import { PluginFactory, PluginType } from '../implementations/PluginFactory';

// 取名请求接口
export interface NamingRequest {
  // 基础信息
  familyName: string;
  gender: 'male' | 'female';
  
  // 时间信息（二选一）
  birthInfo?: {
    year: number;
    month: number;
    day?: number;
    hour?: number;
    minute?: number;
  };
  predueDate?: PredueInfo;
  
  // 可选信息
  characters?: string[];
  familyTradition?: any;
  preferences?: {
    certaintyLevel?: CertaintyLevel;
    parallelExecution?: boolean;
    includeTraditionalAnalysis?: boolean;
    skipOptionalFailures?: boolean;
  };
}

// 取名响应接口
export interface NamingResponse {
  success: boolean;
  requestId: string;
  
  // 分析结果
  analysis: {
    certaintyLevel: CertaintyLevel;
    confidence: number;
    strategy: string;
  };
  
  // 各层次结果
  layer1Results?: any; // 基础信息层
  layer2Results?: any; // 命理基础层
  layer3Results?: any; // 字符评估层
  layer4Results?: any; // 组合计算层
  
  // 综合建议
  recommendations: string[];
  warnings: string[];
  
  // 元数据
  metadata: {
    processingTime: number;
    executedPlugins: string[];
    skippedPlugins: string[];
    version: string;
  };
  
  // 错误信息
  errors?: Array<{
    code: string;
    message: string;
    pluginId?: string;
  }>;
}

// 系统配置
export interface SystemConfig {
  version: string;
  enableHealthChecks: boolean;
  defaultTimeout: number;
  maxRetries: number;
  autoLevelSelection: boolean;
  cacheResults: boolean;
}

export class NamingPipelineIntegrated {
  private container: PluginContainer;
  private pipeline: NamingPipeline;
  private levelManager: CertaintyLevelManager;
  private predueHandler: PredueDateHandler;
  private config: SystemConfig;
  private initialized = false;

  constructor(config: Partial<SystemConfig> = {}) {
    this.config = {
      version: '1.0.0',
      enableHealthChecks: true,
      defaultTimeout: 8000,
      maxRetries: 3,
      autoLevelSelection: true,
      cacheResults: false,
      ...config
    };

    // 初始化组件
    this.container = new PluginContainer({
      enableHealthChecks: this.config.enableHealthChecks,
      defaultTimeout: this.config.defaultTimeout,
      maxRetries: this.config.maxRetries
    });

    this.pipeline = new NamingPipeline(this.container);
    this.levelManager = new CertaintyLevelManager(this.container);
    this.predueHandler = new PredueDateHandler();
  }

  /**
   * 初始化系统
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // 注册所有插件
      await this.registerAllPlugins();
      
      // 初始化所有插件
      await this.container.initializeAll();
      
      this.initialized = true;
      console.log('✅ 取名系统初始化完成');
      
    } catch (error) {
      console.error('❌ 取名系统初始化失败:', error);
      throw error;
    }
  }

  /**
   * 处理取名请求
   */
  async processNamingRequest(request: NamingRequest): Promise<NamingResponse> {
    if (!this.initialized) {
      await this.initialize();
    }

    const requestId = this.generateRequestId();
    const startTime = Date.now();

    try {
      // 1. 验证请求
      const validation = this.validateRequest(request);
      if (!validation.valid) {
        throw new Error(`请求验证失败: ${validation.errors.join(', ')}`);
      }

      // 2. 确定确定性等级
      const certaintyLevel = await this.determineCertaintyLevel(request);
      
      // 3. 处理预产期（如果适用）
      let predueAnalysis;
      if (request.predueDate) {
        predueAnalysis = await this.predueHandler.processPredue(request.predueDate);
      }

      // 4. 构建管道输入
      const pipelineInput = this.buildPipelineInput(request, requestId, certaintyLevel);

      // 5. 执行处理管道
      const pipelineOutput = await this.pipeline.execute(pipelineInput);

      // 6. 构建响应
      const response = this.buildResponse(
        request,
        requestId,
        pipelineOutput,
        certaintyLevel,
        predueAnalysis,
        startTime
      );

      return response;

    } catch (error) {
      return this.buildErrorResponse(
        requestId,
        error instanceof Error ? error.message : String(error),
        startTime
      );
    }
  }

  /**
   * 获取系统状态
   */
  getSystemStatus(): {
    initialized: boolean;
    health: any;
    statistics: any;
    version: string;
  } {
    return {
      initialized: this.initialized,
      health: this.container.performHealthCheck(),
      statistics: this.container.getStatistics(),
      version: this.config.version
    };
  }

  /**
   * 获取可用的确定性等级
   */
  getAvailableCertaintyLevels(): Array<{
    level: CertaintyLevel;
    description: string;
    requiredData: string[];
    enabledPlugins: number;
  }> {
    const levels = [
      CertaintyLevel.FULLY_DETERMINED,
      CertaintyLevel.PARTIALLY_DETERMINED,
      CertaintyLevel.ESTIMATED,
      CertaintyLevel.UNKNOWN
    ];
    
    return levels.map(level => {
      const config = this.levelManager.getLevelConfig(level);
      const enabledPlugins = this.levelManager.getEnabledPlugins(level).length;
      
      let description: string;
      let requiredData: string[];
      
      switch (level) {
        case CertaintyLevel.FULLY_DETERMINED:
          description = '完全确定：具有完整的出生时间信息';
          requiredData = ['familyName', 'gender', 'birthInfo.year', 'birthInfo.month', 'birthInfo.day', 'birthInfo.hour'];
          break;
        case CertaintyLevel.PARTIALLY_DETERMINED:
          description = '部分确定：具有出生日期但缺少具体时辰';
          requiredData = ['familyName', 'gender', 'birthInfo.year', 'birthInfo.month', 'birthInfo.day'];
          break;
        case CertaintyLevel.ESTIMATED:
          description = '预估阶段：基于预产期或有限信息';
          requiredData = ['familyName', 'gender', 'predueDate.year', 'predueDate.month'];
          break;
        case CertaintyLevel.UNKNOWN:
          description = '完全未知：仅有基础信息';
          requiredData = ['familyName', 'gender'];
          break;
        default:
          description = '未知等级';
          requiredData = [];
      }
      
      return {
        level,
        description,
        requiredData,
        enabledPlugins
      };
    });
  }

  /**
   * 预览处理计划
   */
  async previewProcessingPlan(request: NamingRequest): Promise<{
    certaintyLevel: CertaintyLevel;
    executionPlan: any;
    estimatedTime: number;
    warnings: string[];
  }> {
    const certaintyLevel = await this.determineCertaintyLevel(request);
    const executionPlan = this.pipeline.generateExecutionPlan(
      certaintyLevel,
      request.preferences?.parallelExecution
    );
    
    const warnings: string[] = [];
    
    // 添加预产期相关警告
    if (request.predueDate) {
      const validation = this.predueHandler.validatePredueInfo(request.predueDate);
      warnings.push(...validation.warnings);
    }
    
    // 添加等级相关警告
    if (certaintyLevel === CertaintyLevel.ESTIMATED || certaintyLevel === CertaintyLevel.UNKNOWN) {
      warnings.push('由于信息有限，分析结果可能不够精确');
    }

    return {
      certaintyLevel,
      executionPlan,
      estimatedTime: executionPlan.estimatedTime,
      warnings
    };
  }

  /**
   * 注册所有插件
   */
  private async registerAllPlugins(): Promise<void> {
    const pluginTypes: PluginType[] = [
      // Layer 1
      'surname', 'gender', 'birth-time', 'family-tradition',
      // Layer 2  
      'bazi', 'zodiac', 'xiyongshen',
      // Layer 3
      'stroke', 'wuxing-char', 'zodiac-char', 'meaning', 'phonetic',
      // Layer 4
      'sancai', 'yijing', 'dayan', 'wuxing-balance'
    ];

    for (const pluginType of pluginTypes) {
      try {
        await this.container.registerPlugin(pluginType);
      } catch (error) {
        console.warn(`插件 ${pluginType} 注册失败:`, error);
      }
    }
  }

  /**
   * 确定确定性等级
   */
  private async determineCertaintyLevel(request: NamingRequest): Promise<CertaintyLevel> {
    if (request.preferences?.certaintyLevel) {
      return request.preferences.certaintyLevel;
    }

    if (this.config.autoLevelSelection) {
      const autoSelection = await this.levelManager.autoSelectLevel(request);
      return autoSelection.recommendedLevel;
    }

    // 默认逻辑
    if (request.birthInfo?.hour !== undefined) {
      return CertaintyLevel.FULLY_DETERMINED;
    } else if (request.birthInfo?.day !== undefined) {
      return CertaintyLevel.PARTIALLY_DETERMINED;
    } else if (request.predueDate || request.birthInfo?.year) {
      return CertaintyLevel.ESTIMATED;
    } else {
      return CertaintyLevel.UNKNOWN;
    }
  }

  /**
   * 验证请求
   */
  private validateRequest(request: NamingRequest): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 必需字段验证
    if (!request.familyName) {
      errors.push('缺少姓氏信息');
    }

    if (!request.gender || !['male', 'female'].includes(request.gender)) {
      errors.push('性别信息无效');
    }

    // 时间信息验证
    if (!request.birthInfo && !request.predueDate) {
      warnings.push('缺少时间信息，将使用最基础的分析模式');
    }

    // 预产期验证
    if (request.predueDate) {
      const predueValidation = this.predueHandler.validatePredueInfo(request.predueDate);
      errors.push(...predueValidation.errors);
      warnings.push(...predueValidation.warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 构建管道输入
   */
  private buildPipelineInput(
    request: NamingRequest,
    requestId: string,
    certaintyLevel: CertaintyLevel
  ): PipelineInput {
    return {
      requestId,
      certaintyLevel,
      data: {
        familyName: request.familyName,
        gender: request.gender,
        characters: request.characters,
        birthInfo: request.birthInfo,
        predueDate: request.predueDate,
        familyTradition: request.familyTradition
      },
      options: {
        timeout: this.config.defaultTimeout,
        retryCount: this.config.maxRetries,
        skipOptionalFailures: request.preferences?.skipOptionalFailures ?? true,
        parallelExecution: request.preferences?.parallelExecution ?? false
      }
    };
  }

  /**
   * 构建响应
   */
  private buildResponse(
    request: NamingRequest,
    requestId: string,
    pipelineOutput: PipelineOutput,
    certaintyLevel: CertaintyLevel,
    predueAnalysis: any,
    startTime: number
  ): NamingResponse {
    // 按层级组织结果
    const layerResults = this.organizeResultsByLayer(pipelineOutput.results);
    
    // 生成综合建议
    const recommendations = this.generateRecommendations(
      pipelineOutput,
      predueAnalysis,
      certaintyLevel
    );

    return {
      success: pipelineOutput.success,
      requestId,
      analysis: {
        certaintyLevel,
        confidence: this.calculateOverallConfidence(pipelineOutput),
        strategy: pipelineOutput.metadata.executionStrategy
      },
      layer1Results: layerResults.layer1,
      layer2Results: layerResults.layer2,
      layer3Results: layerResults.layer3,
      layer4Results: layerResults.layer4,
      recommendations,
      warnings: pipelineOutput.warnings,
      metadata: {
        processingTime: Date.now() - startTime,
        executedPlugins: pipelineOutput.metadata.executedPlugins,
        skippedPlugins: pipelineOutput.metadata.skippedPlugins,
        version: this.config.version
      },
      errors: pipelineOutput.errors.map(error => ({
        code: 'PLUGIN_ERROR',
        message: error.error,
        pluginId: error.pluginId
      }))
    };
  }

  /**
   * 构建错误响应
   */
  private buildErrorResponse(
    requestId: string,
    errorMessage: string,
    startTime: number
  ): NamingResponse {
    return {
      success: false,
      requestId,
      analysis: {
        certaintyLevel: CertaintyLevel.UNKNOWN,
        confidence: 0,
        strategy: 'error'
      },
      recommendations: [],
      warnings: [],
      metadata: {
        processingTime: Date.now() - startTime,
        executedPlugins: [],
        skippedPlugins: [],
        version: this.config.version
      },
      errors: [{
        code: 'SYSTEM_ERROR',
        message: errorMessage
      }]
    };
  }

  /**
   * 按层级组织结果
   */
  private organizeResultsByLayer(results: Map<string, any>): {
    layer1: any;
    layer2: any;
    layer3: any;
    layer4: any;
  } {
    const layer1: any = {};
    const layer2: any = {};
    const layer3: any = {};
    const layer4: any = {};

    // Layer 1 plugins
    ['surname', 'gender', 'birth-time', 'family-tradition'].forEach(pluginId => {
      if (results.has(pluginId)) {
        layer1[pluginId] = results.get(pluginId);
      }
    });

    // Layer 2 plugins
    ['bazi', 'zodiac', 'xiyongshen'].forEach(pluginId => {
      if (results.has(pluginId)) {
        layer2[pluginId] = results.get(pluginId);
      }
    });

    // Layer 3 plugins
    ['stroke', 'wuxing-char', 'zodiac-char', 'meaning', 'phonetic'].forEach(pluginId => {
      if (results.has(pluginId)) {
        layer3[pluginId] = results.get(pluginId);
      }
    });

    // Layer 4 plugins
    ['sancai', 'yijing', 'dayan', 'wuxing-balance'].forEach(pluginId => {
      if (results.has(pluginId)) {
        layer4[pluginId] = results.get(pluginId);
      }
    });

    return { layer1, layer2, layer3, layer4 };
  }

  /**
   * 计算总体置信度
   */
  private calculateOverallConfidence(pipelineOutput: PipelineOutput): number {
    const results = Array.from(pipelineOutput.results.values());
    if (results.length === 0) return 0;

    const totalConfidence = results.reduce((sum, result) => sum + result.confidence, 0);
    return totalConfidence / results.length;
  }

  /**
   * 生成综合建议
   */
  private generateRecommendations(
    pipelineOutput: PipelineOutput,
    predueAnalysis: any,
    certaintyLevel: CertaintyLevel
  ): string[] {
    const recommendations: string[] = [];

    // 基于确定性等级的建议
    switch (certaintyLevel) {
      case CertaintyLevel.FULLY_DETERMINED:
        recommendations.push('基于完整信息的全面分析，结果可信度高');
        break;
      case CertaintyLevel.PARTIALLY_DETERMINED:
        recommendations.push('基于部分信息的分析，建议重点关注主要因素');
        break;
      case CertaintyLevel.ESTIMATED:
        recommendations.push('基于预估信息的分析，建议准备多套方案');
        break;
      case CertaintyLevel.UNKNOWN:
        recommendations.push('基于基础信息的传统分析，建议补充时间信息以提高准确度');
        break;
    }

    // 预产期相关建议
    if (predueAnalysis) {
      const predueRecommendations = this.predueHandler.generateRecommendations(predueAnalysis);
      recommendations.push(...predueRecommendations);
    }

    // 执行状态相关建议
    if (pipelineOutput.metadata.skippedPlugins.length > 0) {
      recommendations.push(`跳过了 ${pipelineOutput.metadata.skippedPlugins.length} 个插件，可能影响分析完整性`);
    }

    return recommendations;
  }

  /**
   * 生成请求ID
   */
  private generateRequestId(): string {
    return `naming-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * 销毁系统
   */
  async destroy(): Promise<void> {
    if (this.initialized) {
      await this.container.destroy();
      this.initialized = false;
    }
  }
}