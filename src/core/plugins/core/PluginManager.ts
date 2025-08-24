/**
 * 插件管理器核心类
 * 负责协调整个插件系统的运行，包括加载、注册、执行和生命周期管理
 */

import { NamingPlugin, PluginContext, StandardInput, PluginOutput, ValidationResult, CertaintyLevel } from '../interfaces/NamingPlugin';
import { PluginContainer, ContainerConfig } from './PluginContainer';
import { PluginRegistry } from './PluginRegistry';
import { DependencyGraph } from './DependencyGraph';
import { ConfigManager, GlobalConfig } from './ConfigManager';
import { ErrorHandler, PluginSystemError, ErrorType, ErrorSeverity } from './ErrorHandler';

export interface ManagerConfig extends ContainerConfig {
  maxConcurrentPlugins: number;
  enableFallback: boolean;
  strictMode: boolean;
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

      // 错误处理器无需初始化

      // 加载已注册的插件
      await this.loadRegisteredPlugins();

      this.isInitialized = true;
    } catch (error) {
      const systemError = new PluginSystemError(
        'Plugin manager initialization failed',
        ErrorType.SYSTEM_ERROR,
        ErrorSeverity.HIGH,
        'PLUGIN_MANAGER_INIT_FAILED',
        { originalError: error }
      );
      this.errorHandler.handleError(systemError);
      throw error;
    }
  }

  /**
   * 注册插件
   */
  async registerPlugin(plugin: NamingPlugin): Promise<ValidationResult> {
    try {
      // 验证插件结构
      if (!plugin.id || !plugin.version || !plugin.layer) {
        return {
          valid: false,
          errors: ['Plugin missing required properties (id, version, layer)'],
          warnings: []
        };
      }

      // 将插件添加到内部管理
      // TODO: 使用正确的容器注册方法

      // 初始化插件
      const pluginConfig = await this.configManager.getPluginConfig(plugin.id);
      if (!pluginConfig) {
        return {
          valid: false,
          errors: [`No configuration found for plugin ${plugin.id}`],
          warnings: []
        };
      }
      await plugin.initialize(pluginConfig, this.createPluginContext(plugin.id));

      return { valid: true, errors: [], warnings: [] };
    } catch (error) {
      const systemError = new PluginSystemError(
        `Plugin registration failed: ${plugin.id}`,
        ErrorType.PLUGIN_INIT_FAILED,
        ErrorSeverity.HIGH,
        'PLUGIN_REGISTRATION_FAILED',
        { pluginId: plugin.id, originalError: error }
      );
      this.errorHandler.handleError(systemError);
      return {
        valid: false,
        errors: [systemError.message],
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
    const context = this.createPluginContext(`request-${Date.now()}`);

    try {
      // 获取启用的插件
      const enabledPlugins = this.container.getEnabledPlugins(input.preferences?.certaintyLevel || CertaintyLevel.UNKNOWN);
      
      // 获取执行顺序
      const executionOrder = this.container.getExecutionOrder(enabledPlugins);
      
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
          const systemError = new PluginSystemError(
            `Plugin execution failed: ${pluginId}`,
            ErrorType.PLUGIN_EXECUTION_FAILED,
            ErrorSeverity.MEDIUM,
            'PLUGIN_EXECUTION_FAILED',
            { pluginId, originalError: error }
          );
          this.errorHandler.handleError(systemError);
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
      const systemError = new PluginSystemError(
        'Plugin chain execution failed',
        ErrorType.SYSTEM_ERROR,
        ErrorSeverity.HIGH,
        'PLUGIN_CHAIN_EXECUTION_FAILED',
        { requestId: `request-${Date.now()}`, originalError: error }
      );
      this.errorHandler.handleError(systemError);
      throw error;
    }
  }

  /**
   * 获取插件状态
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      container: { status: 'active' }, // TODO: implement container.getStatus()
      registry: { status: 'active' }, // TODO: implement registry.getStatus()
      dependencyGraph: { status: 'active' }, // TODO: implement dependencyGraph.getStatus()
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
      // TODO: implement container.cleanup()
      // TODO: implement registry.cleanup()
      // TODO: implement errorHandler.cleanup()
      this.isInitialized = false;
    } catch (error) {
      const systemError = new PluginSystemError(
        'Plugin manager cleanup failed',
        ErrorType.SYSTEM_ERROR,
        ErrorSeverity.MEDIUM,
        'PLUGIN_MANAGER_CLEANUP_FAILED',
        { originalError: error }
      );
      this.errorHandler.handleError(systemError);
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
      certaintyLevel: CertaintyLevel.UNKNOWN,
      getPluginResult: (id: string) => null, // TODO: 实现结果获取逻辑
      setPluginResult: (id: string, result: any) => {}, // TODO: 实现结果设置逻辑
      log: (level: 'info' | 'warn' | 'error', message: string) => {
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
      return await plugin.process(input, this.createPluginContext(plugin.id));
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
