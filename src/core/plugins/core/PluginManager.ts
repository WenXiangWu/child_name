/**
 * 插件管理器核心类
 * 负责协调整个插件系统的运行，包括加载、注册、执行和生命周期管理
 */

import { NamingPlugin, PluginContext, StandardInput, PluginOutput, ValidationResult } from '../interfaces/NamingPlugin';
import { PluginContainer, ContainerConfig } from './PluginContainer';
import { PluginRegistry } from './PluginRegistry';
import { DependencyGraph } from './DependencyGraph';
import { ConfigManager, GlobalConfig } from './ConfigManager';
import { ErrorHandler } from './ErrorHandler';

export interface ManagerConfig extends ContainerConfig {
  enableHotReload: boolean;
  enableMetrics: boolean;
  enableProfiling: boolean;
  maxRetryAttempts: number;
  circuitBreakerThreshold: number;
}

export interface ExecutionMetrics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  lastExecutionTime: number;
  errorRate: number;
}

export class PluginManager {
  private container: PluginContainer;
  private registry: PluginRegistry;
  private dependencyGraph: DependencyGraph;
  private configManager: ConfigManager;
  private errorHandler: ErrorHandler;
  private config: ManagerConfig;
  private metrics: Map<string, ExecutionMetrics> = new Map();
  private isInitialized = false;

  constructor(config: Partial<ManagerConfig> = {}) {
    this.config = {
      maxConcurrentPlugins: 10,
      defaultTimeout: 30000,
      enableFallback: true,
      strictMode: false,
      enableHotReload: false,
      enableMetrics: true,
      enableProfiling: false,
      maxRetryAttempts: 3,
      circuitBreakerThreshold: 0.5,
      ...config
    };

    this.container = new PluginContainer(this.config);
    this.registry = new PluginRegistry();
    this.dependencyGraph = new DependencyGraph();
    this.configManager = new ConfigManager();
    this.errorHandler = new ErrorHandler();
  }

  /**
   * 初始化插件管理器
   */
  async initialize(globalConfig?: GlobalConfig): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // 加载全局配置
      if (globalConfig) {
        await this.configManager.loadGlobalConfig(globalConfig);
      }

      // 初始化错误处理器
      await this.errorHandler.initialize();

      // 加载已注册的插件
      await this.loadRegisteredPlugins();

      this.isInitialized = true;
    } catch (error) {
      this.errorHandler.handleError('PLUGIN_MANAGER_INIT_FAILED', error);
      throw error;
    }
  }

  /**
   * 注册插件
   */
  async registerPlugin(plugin: NamingPlugin): Promise<ValidationResult> {
    try {
      // 验证插件
      const validation = await plugin.validate();
      if (!validation.valid) {
        return validation;
      }

      // 注册到容器
      const result = await this.container.registerPlugin(plugin);
      if (!result.valid) {
        return result;
      }

      // 初始化插件
      const pluginConfig = await this.configManager.getPluginConfig(plugin.id);
      await plugin.initialize(pluginConfig, this.createPluginContext(plugin.id));

      return { valid: true, errors: [], warnings: [] };
    } catch (error) {
      const errorResult = this.errorHandler.handleError('PLUGIN_REGISTRATION_FAILED', error);
      return {
        valid: false,
        errors: [errorResult.message],
        warnings: []
      };
    }
  }

  /**
   * 执行插件链
   */
  async executePluginChain(input: StandardInput): Promise<PluginOutput[]> {
    if (!this.isInitialized) {
      throw new Error('插件管理器未初始化');
    }

    const startTime = Date.now();
    const results: PluginOutput[] = [];
    const context = this.createPluginContext(input.requestId);

    try {
      // 获取执行顺序
      const executionOrder = this.container.getExecutionOrder();
      
      // 按顺序执行插件
      for (const pluginId of executionOrder) {
        const plugin = this.registry.getPlugin(pluginId);
        if (!plugin) {
          continue;
        }

        try {
          const result = await this.executePluginWithRetry(plugin, input, context);
          results.push(result);
          
          // 更新指标
          this.updateMetrics(pluginId, Date.now() - startTime, true);
        } catch (error) {
          const errorResult = this.errorHandler.handleError('PLUGIN_EXECUTION_FAILED', error);
          const fallbackResult = await this.tryFallbackPlugin(pluginId, input, context);
          
          if (fallbackResult) {
            results.push(fallbackResult);
          } else {
            // 记录失败
            this.updateMetrics(pluginId, Date.now() - startTime, false);
            throw error;
          }
        }
      }

      return results;
    } catch (error) {
      this.errorHandler.handleError('PLUGIN_CHAIN_EXECUTION_FAILED', error);
      throw error;
    }
  }

  /**
   * 获取插件状态
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      container: this.container.getStatus(),
      registry: this.registry.getStatus(),
      dependencyGraph: this.dependencyGraph.getStatus(),
      metrics: this.getMetricsSummary()
    };
  }

  /**
   * 获取插件执行指标
   */
  getPluginMetrics(pluginId: string): ExecutionMetrics | null {
    return this.metrics.get(pluginId) || null;
  }

  /**
   * 获取所有插件的指标摘要
   */
  getMetricsSummary() {
    const summary = {
      totalPlugins: this.metrics.size,
      totalExecutions: 0,
      totalSuccessfulExecutions: 0,
      totalFailedExecutions: 0,
      averageErrorRate: 0
    };

    for (const metrics of this.metrics.values()) {
      summary.totalExecutions += metrics.totalExecutions;
      summary.totalSuccessfulExecutions += metrics.successfulExecutions;
      summary.totalFailedExecutions += metrics.failedExecutions;
    }

    if (summary.totalExecutions > 0) {
      summary.averageErrorRate = summary.totalFailedExecutions / summary.totalExecutions;
    }

    return summary;
  }

  /**
   * 清理资源
   */
  async cleanup(): Promise<void> {
    try {
      await this.container.cleanup();
      await this.registry.cleanup();
      await this.errorHandler.cleanup();
      this.isInitialized = false;
    } catch (error) {
      this.errorHandler.handleError('PLUGIN_MANAGER_CLEANUP_FAILED', error);
    }
  }

  /**
   * 私有方法：加载已注册的插件
   */
  private async loadRegisteredPlugins(): Promise<void> {
    // TODO: 实现从配置文件或数据库加载已注册插件的逻辑
  }

  /**
   * 私有方法：创建插件上下文
   */
  private createPluginContext(pluginId: string): PluginContext {
    return {
      requestId: `ctx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      getPluginResult: (id: string) => null, // TODO: 实现结果获取逻辑
      setPluginResult: (id: string, result: any) => {}, // TODO: 实现结果设置逻辑
      getConfig: () => ({ enabled: true, priority: 100, timeout: 30000, retryCount: 3 }),
      log: (level, message, data) => {
        // TODO: 实现日志记录逻辑
      }
    };
  }

  /**
   * 私有方法：带重试的插件执行
   */
  private async executePluginWithRetry(
    plugin: NamingPlugin,
    input: StandardInput,
    context: PluginContext,
    attempt: number = 1
  ): Promise<PluginOutput> {
    try {
      return await plugin.process(input);
    } catch (error) {
      if (attempt < this.config.maxRetryAttempts) {
        // 指数退避重试
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executePluginWithRetry(plugin, input, context, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * 私有方法：尝试备用插件
   */
  private async tryFallbackPlugin(
    pluginId: string,
    input: StandardInput,
    context: PluginContext
  ): Promise<PluginOutput | null> {
    if (!this.config.enableFallback) {
      return null;
    }

    // TODO: 实现备用插件逻辑
    return null;
  }

  /**
   * 私有方法：更新执行指标
   */
  private updateMetrics(pluginId: string, executionTime: number, success: boolean): void {
    if (!this.config.enableMetrics) {
      return;
    }

    let metrics = this.metrics.get(pluginId);
    if (!metrics) {
      metrics = {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        averageExecutionTime: 0,
        lastExecutionTime: 0,
        errorRate: 0
      };
      this.metrics.set(pluginId, metrics);
    }

    metrics.totalExecutions++;
    metrics.lastExecutionTime = executionTime;

    if (success) {
      metrics.successfulExecutions++;
    } else {
      metrics.failedExecutions++;
    }

    // 更新平均执行时间
    metrics.averageExecutionTime = 
      (metrics.averageExecutionTime * (metrics.totalExecutions - 1) + executionTime) / metrics.totalExecutions;

    // 更新错误率
    metrics.errorRate = metrics.failedExecutions / metrics.totalExecutions;
  }
}
