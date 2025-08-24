/**
 * 取名处理管道 - 协调插件执行顺序和数据流转
 */

import { 
  NamingPlugin, 
  StandardInput, 
  PluginOutput, 
  CertaintyLevel,
  ValidationResult,
  PluginContext
} from '../interfaces/NamingPlugin';
import { DependencyGraph } from '../utils/DependencyGraph';
import { PluginLifecycleManager, PluginStatus } from '../utils/PluginLifecycleManager';

// 管道输入类型
export interface PipelineInput {
  requestId: string;
  certaintyLevel: CertaintyLevel;
  data: {
    familyName: string;
    gender: 'male' | 'female';
    characters?: string[];
    birthInfo?: {
      year: number;
      month: number;
      day?: number;
      hour?: number;
      minute?: number;
    };
    predueDate?: {
      year: number;
      month: number;
      weekOffset?: number;
    };
    familyTradition?: any;
  };
  options?: {
    timeout?: number;
    retryCount?: number;
    skipOptionalFailures?: boolean;
    parallelExecution?: boolean;
  };
}

// 管道输出类型
export interface PipelineOutput {
  requestId: string;
  success: boolean;
  results: Map<string, PluginOutput>;
  errors: PipelineError[];
  warnings: string[];
  metadata: {
    processingTime: number;
    executedPlugins: string[];
    skippedPlugins: string[];
    failedPlugins: string[];
    executionStrategy: string;
    certaintyLevel: CertaintyLevel;
  };
}

// 管道错误类型
export interface PipelineError {
  pluginId: string;
  error: string;
  fatal: boolean;
  timestamp: number;
  context?: any;
}

// 执行上下文
export interface ExecutionContext {
  requestId: string;
  startTime: number;
  certaintyLevel: CertaintyLevel;
  pluginResults: Map<string, any>;
  errors: PipelineError[];
  warnings: string[];
  executedPlugins: string[];
  skippedPlugins: string[];
  options: Required<PipelineInput['options']>;
}

// 插件容器接口
export interface IPluginContainer {
  getPlugin(pluginId: string): NamingPlugin | undefined;
  getEnabledPlugins(level: CertaintyLevel): string[];
  getExecutionOrder(enabledPlugins: string[]): string[];
  isPluginAvailable(pluginId: string): boolean;
}

export class NamingPipeline {
  private dependencyGraph = new DependencyGraph();
  private lifecycleManager = new PluginLifecycleManager();

  constructor(
    private container: IPluginContainer
  ) {}

  /**
   * 执行管道
   */
  async execute(input: PipelineInput): Promise<PipelineOutput> {
    const context = this.createExecutionContext(input);
    
    try {
      // 1. 验证输入
      const inputValidation = this.validateInput(input);
      if (!inputValidation.valid) {
        throw new Error(`输入验证失败: ${inputValidation.errors.join(', ')}`);
      }

      // 2. 获取启用的插件
      const enabledPlugins = this.container.getEnabledPlugins(input.certaintyLevel);
      if (enabledPlugins.length === 0) {
        throw new Error('没有可用的插件');
      }

      // 3. 获取执行顺序
      const executionOrder = this.container.getExecutionOrder(enabledPlugins);
      
      // 4. 根据策略执行插件
      if (context.options?.parallelExecution) {
        await this.executeParallelStrategy(executionOrder, input, context);
      } else {
        await this.executeSequentialStrategy(executionOrder, input, context);
      }

      // 5. 构建输出
      return this.buildPipelineOutput(context, true);

    } catch (error) {
      context.errors.push({
        pluginId: 'pipeline',
        error: error instanceof Error ? error.message : String(error),
        fatal: true,
        timestamp: Date.now()
      });
      
      return this.buildPipelineOutput(context, false);
    }
  }

  /**
   * 顺序执行策略
   */
  private async executeSequentialStrategy(
    executionOrder: string[],
    input: PipelineInput,
    context: ExecutionContext
  ): Promise<void> {
    // 按层级分组
    const layeredOrder = this.groupByLayers(executionOrder);
    
    for (const layer of layeredOrder) {
      await this.executeLayer(layer, input, context);
    }
  }

  /**
   * 并行执行策略
   */
  private async executeParallelStrategy(
    executionOrder: string[],
    input: PipelineInput,
    context: ExecutionContext
  ): Promise<void> {
    // 按层级分组，同层内可以并行执行
    const layeredOrder = this.groupByLayers(executionOrder);
    
    for (const layer of layeredOrder) {
      // 检查依赖关系，确定可以并行的插件组
      const parallelGroups = this.getParallelGroups(layer, context);
      
      for (const group of parallelGroups) {
        if (group.length === 1) {
          // 单个插件，直接执行
          await this.executePlugin(group[0], input, context);
        } else {
          // 多个插件，并行执行
          await this.executePluginsInParallel(group, input, context);
        }
      }
    }
  }

  /**
   * 执行层
   */
  private async executeLayer(
    layer: string[],
    input: PipelineInput,
    context: ExecutionContext
  ): Promise<void> {
    for (const pluginId of layer) {
      await this.executePlugin(pluginId, input, context);
    }
  }

  /**
   * 并行执行插件组
   */
  private async executePluginsInParallel(
    pluginIds: string[],
    input: PipelineInput,
    context: ExecutionContext
  ): Promise<void> {
    const promises = pluginIds.map(pluginId => 
      this.executePlugin(pluginId, input, context)
    );
    
    await Promise.allSettled(promises);
  }

  /**
   * 执行单个插件
   */
  private async executePlugin(
    pluginId: string,
    input: PipelineInput,
    context: ExecutionContext
  ): Promise<void> {
    const plugin = this.container.getPlugin(pluginId);
    if (!plugin) {
      context.warnings.push(`插件 ${pluginId} 不存在`);
      context.skippedPlugins.push(pluginId);
      return;
    }

    // 检查插件是否可用
    if (!this.container.isPluginAvailable(pluginId)) {
      context.warnings.push(`插件 ${pluginId} 不可用`);
      context.skippedPlugins.push(pluginId);
      return;
    }

    try {
      // 验证依赖
      const dependencyCheck = this.validateDependencies(plugin, context);
      if (!dependencyCheck.valid) {
        if (dependencyCheck.hasRequiredMissing) {
          throw new Error(`缺少必需依赖: ${dependencyCheck.missingRequired.join(', ')}`);
        } else {
          context.warnings.push(`插件 ${pluginId} 的可选依赖缺失: ${dependencyCheck.missingOptional.join(', ')}`);
        }
      }

      // 构建标准输入
      const standardInput = this.buildStandardInput(input, context);
      
      // 验证插件输入
      const validation = await plugin.validate(standardInput);
      if (!validation.valid) {
        if (context.options?.skipOptionalFailures && this.isOptionalPlugin(pluginId)) {
          context.warnings.push(`可选插件 ${pluginId} 验证失败，跳过执行: ${validation.errors.join(', ')}`);
          context.skippedPlugins.push(pluginId);
          return;
        } else {
          throw new Error(`输入验证失败: ${validation.errors.join(', ')}`);
        }
      }

      // 执行插件
      const result = await this.executeWithTimeout(
        plugin, 
        standardInput, 
        context.options?.timeout || 5000
      );

      // 验证输出
      const outputValidation = this.validateOutput(result);
      if (!outputValidation.valid) {
        throw new Error(`输出验证失败: ${outputValidation.errors.join(', ')}`);
      }

      // 存储结果
      context.pluginResults.set(pluginId, result);
      context.executedPlugins.push(pluginId);
      
      this.lifecycleManager.recordHealthCheck(pluginId, true, { 
        processingTime: Date.now() - context.startTime,
        confidence: result.confidence
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      context.errors.push({
        pluginId,
        error: errorMessage,
        fatal: !context.options?.skipOptionalFailures || !this.isOptionalPlugin(pluginId),
        timestamp: Date.now()
      });

      this.lifecycleManager.markError(pluginId, errorMessage);

      // 如果是必需插件失败，且不允许跳过，则抛出错误
      if (!context.options?.skipOptionalFailures || !this.isOptionalPlugin(pluginId)) {
        throw error;
      } else {
        context.skippedPlugins.push(pluginId);
      }
    }
  }

  /**
   * 带超时的插件执行
   */
  private async executeWithTimeout(
    plugin: NamingPlugin,
    input: StandardInput,
    timeout: number,
    context?: PluginContext
  ): Promise<PluginOutput> {
    return new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`插件执行超时 (${timeout}ms)`));
      }, timeout);

      try {
        const pluginContext: PluginContext = context || {
          certaintyLevel: input.preferences?.certaintyLevel || CertaintyLevel.UNKNOWN
        };
        const result = await plugin.process(input, pluginContext);
        clearTimeout(timer);
        resolve(result);
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  /**
   * 验证输入
   */
  private validateInput(input: PipelineInput): ValidationResult {
    const errors: string[] = [];
    
    if (!input.requestId) {
      errors.push('缺少请求ID');
    }
    
    if (!input.data.familyName) {
      errors.push('缺少姓氏');
    }
    
    if (!input.data.gender) {
      errors.push('缺少性别信息');
    }
    
    if (!Object.values(CertaintyLevel).includes(input.certaintyLevel)) {
      errors.push('无效的确定性等级');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * 验证依赖
   */
  private validateDependencies(
    plugin: NamingPlugin,
    context: ExecutionContext
  ): {
    valid: boolean;
    hasRequiredMissing: boolean;
    missingRequired: string[];
    missingOptional: string[];
  } {
    const missingRequired: string[] = [];
    const missingOptional: string[] = [];

    plugin.dependencies.forEach(dep => {
      if (!context.pluginResults.has(dep.pluginId)) {
        if (dep.required) {
          missingRequired.push(dep.pluginId);
        } else {
          missingOptional.push(dep.pluginId);
        }
      }
    });

    return {
      valid: missingRequired.length === 0,
      hasRequiredMissing: missingRequired.length > 0,
      missingRequired,
      missingOptional
    };
  }

  /**
   * 验证输出
   */
  private validateOutput(output: PluginOutput): ValidationResult {
    const errors: string[] = [];
    
    if (!output.data) {
      errors.push('输出缺少数据');
    }
    
    if (output.confidence < 0 || output.confidence > 1) {
      errors.push('置信度必须在0-1之间');
    }
    
    if (!output.success) {
      errors.push('插件执行失败');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * 构建标准输入
   */
  private buildStandardInput(
    input: PipelineInput,
    context: ExecutionContext
  ): StandardInput {
    return {
      familyName: input.data.familyName,
      gender: input.data.gender,
      birthInfo: input.data.birthInfo ? {
        year: input.data.birthInfo.year,
        month: input.data.birthInfo.month,
        day: input.data.birthInfo.day || 1,
        hour: input.data.birthInfo.hour,
        minute: input.data.birthInfo.minute
      } : undefined,
      preferences: {
        certaintyLevel: input.certaintyLevel,
        parallelExecution: input.options?.parallelExecution,
        skipOptionalFailures: input.options?.skipOptionalFailures
      },
      characters: input.data.characters
    };
  }

  /**
   * 创建执行上下文
   */
  private createExecutionContext(input: PipelineInput): ExecutionContext {
    return {
      requestId: input.requestId,
      startTime: Date.now(),
      certaintyLevel: input.certaintyLevel,
      pluginResults: new Map(),
      errors: [],
      warnings: [],
      executedPlugins: [],
      skippedPlugins: [],
      options: {
        timeout: input.options?.timeout || 5000,
        retryCount: input.options?.retryCount || 3,
        skipOptionalFailures: input.options?.skipOptionalFailures ?? true,
        parallelExecution: input.options?.parallelExecution ?? false
      }
    };
  }

  /**
   * 按层级分组
   */
  private groupByLayers(pluginIds: string[]): string[][] {
    const layers = new Map<number, string[]>();
    
    pluginIds.forEach(pluginId => {
      const plugin = this.container.getPlugin(pluginId);
      if (plugin) {
        const layer = plugin.layer;
        if (!layers.has(layer)) {
          layers.set(layer, []);
        }
        layers.get(layer)!.push(pluginId);
      }
    });

    const sortedLayers = Array.from(layers.keys()).sort((a, b) => a - b);
    return sortedLayers.map(layer => layers.get(layer)!);
  }

  /**
   * 获取可并行执行的插件组
   */
  private getParallelGroups(
    layerPlugins: string[],
    context: ExecutionContext
  ): string[][] {
    const groups: string[][] = [];
    const processed = new Set<string>();

    layerPlugins.forEach(pluginId => {
      if (processed.has(pluginId)) return;

      const group = [pluginId];
      processed.add(pluginId);

      // 查找可以与当前插件并行执行的其他插件
      layerPlugins.forEach(otherPluginId => {
        if (processed.has(otherPluginId)) return;
        
        if (!this.hasDirectDependency(pluginId, otherPluginId) &&
            !this.hasDirectDependency(otherPluginId, pluginId)) {
          group.push(otherPluginId);
          processed.add(otherPluginId);
        }
      });

      groups.push(group);
    });

    return groups;
  }

  /**
   * 检查直接依赖关系
   */
  private hasDirectDependency(from: string, to: string): boolean {
    const plugin = this.container.getPlugin(from);
    return plugin?.dependencies.some(dep => dep.pluginId === to) || false;
  }

  /**
   * 检查是否为可选插件
   */
  private isOptionalPlugin(pluginId: string): boolean {
    // 可以根据插件配置或元数据来判断
    // 这里简化处理，认为Layer 4的插件相对可选
    const plugin = this.container.getPlugin(pluginId);
    return plugin?.layer === 4;
  }

  /**
   * 构建管道输出
   */
  private buildPipelineOutput(
    context: ExecutionContext,
    success: boolean
  ): PipelineOutput {
    const processingTime = Date.now() - context.startTime;
    const failedPlugins = context.errors
      .filter(error => error.fatal)
      .map(error => error.pluginId);

    return {
      requestId: context.requestId,
      success,
      results: new Map(Array.from(context.pluginResults.entries()).map(
        ([pluginId, results]) => [
          pluginId,
          {
            success: true,
            data: results,
            confidence: 1.0,
            executionTime: processingTime,
            metadata: { pluginId }
          }
        ]
      )),
      errors: context.errors,
      warnings: context.warnings,
      metadata: {
        processingTime,
        executedPlugins: context.executedPlugins,
        skippedPlugins: context.skippedPlugins,
        failedPlugins,
        executionStrategy: context.options?.parallelExecution ? 'parallel' : 'sequential',
        certaintyLevel: context.certaintyLevel
      }
    };
  }

  /**
   * 获取管道统计信息
   */
  getStatistics(): {
    lifecycle: any;
    dependencyGraph: any;
  } {
    return {
      lifecycle: this.lifecycleManager.getHealthMetrics(),
      dependencyGraph: this.dependencyGraph.getStatistics()
    };
  }

  /**
   * 生成执行计划
   */
  generateExecutionPlan(
    certaintyLevel: CertaintyLevel,
    parallelExecution = false
  ): {
    enabledPlugins: string[];
    executionOrder: string[];
    layeredOrder: string[][];
    parallelGroups?: string[][];
    estimatedTime: number;
  } {
    const enabledPlugins = this.container.getEnabledPlugins(certaintyLevel);
    const executionOrder = this.container.getExecutionOrder(enabledPlugins);
    const layeredOrder = this.groupByLayers(executionOrder);

    let parallelGroups: string[][] | undefined;
    if (parallelExecution) {
      parallelGroups = [];
      layeredOrder.forEach(layer => {
        const groups = this.getParallelGroups(layer, {
          pluginResults: new Map()
        } as ExecutionContext);
        parallelGroups!.push(...groups);
      });
    }

    // 估算执行时间（简化）
    const estimatedTime = enabledPlugins.length * 200; // 每个插件平均200ms

    return {
      enabledPlugins,
      executionOrder,
      layeredOrder,
      parallelGroups,
      estimatedTime
    };
  }
}