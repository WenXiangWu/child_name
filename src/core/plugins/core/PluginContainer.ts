/**
 * 插件容器 - 管理插件的注册、初始化、生命周期和配置
 */

import { 
  NamingPlugin, 
  PluginConfig, 
  PluginContext, 
  CertaintyLevel,
  ValidationResult
} from '../interfaces/NamingPlugin';
import { DependencyGraph } from '../utils/DependencyGraph';
import { PluginLifecycleManager, PluginStatus } from '../utils/PluginLifecycleManager';
import { PluginFactory, PluginType } from '../implementations/PluginFactory';
import { IPluginContainer } from './NamingPipeline';

// 插件配置项
export interface PluginManifest {
  version: string;
  plugins: {
    [pluginId: string]: {
      enabled: boolean;
      config: PluginConfig;
      requiredLevels: CertaintyLevel[];
      fallbackPlugin?: string;
      priority: number;
    }
  };
  levels: {
    [level in CertaintyLevel]: {
      enabledPlugins: string[];
      processingStrategy: 'sequential' | 'parallel' | 'conditional';
      timeout: number;
    }
  };
}

// 插件错误类型
export class PluginError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly pluginId?: string,
    public readonly context?: any
  ) {
    super(message);
    this.name = 'PluginError';
  }
}

// 插件容器配置
export interface ContainerConfig {
  autoInitialize?: boolean;
  validateDependencies?: boolean;
  enableHealthChecks?: boolean;
  healthCheckInterval?: number;
  maxRetries?: number;
  defaultTimeout?: number;
}

export class PluginContainer implements IPluginContainer {
  private plugins: Map<string, NamingPlugin> = new Map();
  private configs: Map<string, PluginConfig> = new Map();
  private dependencyGraph = new DependencyGraph();
  private lifecycleManager = new PluginLifecycleManager();
  private manifest?: PluginManifest;
  private config: Required<ContainerConfig>;
  private healthCheckTimer?: NodeJS.Timeout;

  constructor(config: ContainerConfig = {}) {
    this.config = {
      autoInitialize: config.autoInitialize ?? true,
      validateDependencies: config.validateDependencies ?? true,
      enableHealthChecks: config.enableHealthChecks ?? true,
      healthCheckInterval: config.healthCheckInterval ?? 60000, // 1分钟
      maxRetries: config.maxRetries ?? 3,
      defaultTimeout: config.defaultTimeout ?? 5000
    };

    if (this.config.enableHealthChecks) {
      this.startHealthChecks();
    }
  }

  /**
   * 加载插件清单
   */
  async loadManifest(manifest: PluginManifest): Promise<void> {
    this.manifest = manifest;
    
    // 根据清单注册插件
    for (const [pluginId, pluginConfig] of Object.entries(manifest.plugins)) {
      if (pluginConfig.enabled) {
        try {
          await this.registerPlugin(pluginId as PluginType, pluginConfig.config);
        } catch (error) {
          console.error(`Failed to register plugin ${pluginId}:`, error);
        }
      }
    }
  }

  /**
   * 注册插件
   */
  async registerPlugin(
    pluginType: PluginType, 
    config?: PluginConfig
  ): Promise<void> {
    try {
      // 创建插件实例
      const plugin = PluginFactory.createPlugin(pluginType);
      const pluginId = plugin.id;

      // 检查是否已注册
      if (this.plugins.has(pluginId)) {
        throw new PluginError('ALREADY_REGISTERED', `Plugin ${pluginId} is already registered`);
      }

      // 验证插件
      const validation = await this.validatePlugin(plugin);
      if (!validation.valid) {
        throw new PluginError('INVALID_PLUGIN', validation.errors.join(', '), pluginId);
      }

      // 注册到生命周期管理器
      this.lifecycleManager.registerPlugin(
        pluginId,
        plugin.version,
        plugin.layer,
        plugin.dependencies.map(dep => dep.pluginId)
      );

      // 添加到依赖图
      this.dependencyGraph.addNode(pluginId, plugin.dependencies, plugin.layer);

      // 验证依赖关系
      if (this.config.validateDependencies) {
        const dependencyCheck = this.validateDependencies();
        if (!dependencyCheck.valid) {
          // 回滚注册
          this.dependencyGraph.removeNode(pluginId);
          this.lifecycleManager.unregisterPlugin(pluginId);
          
          throw new PluginError(
            'DEPENDENCY_ERROR', 
            `Dependency validation failed: ${dependencyCheck.missingDependencies.map(d => d.missingDep).join(', ')}`,
            pluginId
          );
        }
      }

      // 检查循环依赖
      if (this.dependencyGraph.hasCycles()) {
        // 回滚注册
        this.dependencyGraph.removeNode(pluginId);
        this.lifecycleManager.unregisterPlugin(pluginId);
        
        throw new PluginError('CIRCULAR_DEPENDENCY', 
          `Circular dependency detected involving ${pluginId}`, pluginId);
      }

      // 设置配置
      const pluginConfig = config || this.getDefaultConfig();
      this.configs.set(pluginId, pluginConfig);

      // 注册成功 - 先存储插件再初始化
      this.plugins.set(pluginId, plugin);

      // 初始化插件
      if (this.config.autoInitialize) {
        await this.initializePlugin(pluginId);
      }
      
      console.log(`✅ Plugin ${pluginId} registered successfully`);

    } catch (error) {
      const pluginId = PluginFactory.createPlugin(pluginType).id;
      this.lifecycleManager.markInitializationFailed(
        pluginId, 
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  }

  /**
   * 注销插件
   */
  async unregisterPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new PluginError('NOT_FOUND', `Plugin ${pluginId} not found`);
    }

    // 检查是否有其他插件依赖此插件
    const removeCheck = this.dependencyGraph.canRemove(pluginId);
    if (!removeCheck.canRemove) {
      throw new PluginError('PLUGIN_IN_USE', 
        `Plugin ${pluginId} is required by: ${removeCheck.blockedBy.join(', ')}`, pluginId);
    }

    try {
      // 销毁插件
      await plugin.destroy();
      this.lifecycleManager.markDestroyed(pluginId);

      // 从容器中移除
      this.plugins.delete(pluginId);
      this.configs.delete(pluginId);
      this.dependencyGraph.removeNode(pluginId);
      this.lifecycleManager.unregisterPlugin(pluginId);

      console.log(`🗑️ Plugin ${pluginId} unregistered successfully`);

    } catch (error) {
      this.lifecycleManager.markError(
        pluginId, 
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  }

  /**
   * 初始化插件
   */
  async initializePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    const config = this.configs.get(pluginId);
    
    if (!plugin || !config) {
      throw new PluginError('NOT_FOUND', `Plugin ${pluginId} not found`);
    }

    try {
      this.lifecycleManager.markInitializing(pluginId);

      // 检查依赖是否就绪
      if (!this.lifecycleManager.areDependenciesReady(pluginId)) {
        throw new PluginError('DEPENDENCIES_NOT_READY', 
          `Dependencies not ready for plugin ${pluginId}`, pluginId);
      }

      // 创建插件上下文
      const context = this.createPluginContext(pluginId);

      // 初始化插件
      await plugin.initialize(config, context);

      this.lifecycleManager.markInitialized(pluginId);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.lifecycleManager.markInitializationFailed(pluginId, errorMessage);
      throw new PluginError('INITIALIZATION_FAILED', errorMessage, pluginId);
    }
  }

  /**
   * 初始化所有插件
   */
  async initializeAll(): Promise<void> {
    const startupOrder = this.lifecycleManager.getStartupOrder();
    
    for (const layer of startupOrder) {
      await Promise.all(layer.map(pluginId => 
        this.initializePlugin(pluginId).catch(error => {
          console.error(`Failed to initialize plugin ${pluginId}:`, error);
        })
      ));
    }
  }

  /**
   * 获取插件
   */
  getPlugin(pluginId: string): NamingPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * 获取所有插件
   */
  getAllPlugins(): Map<string, NamingPlugin> {
    return new Map(this.plugins);
  }

  /**
   * 获取启用的插件
   */
  getEnabledPlugins(level: CertaintyLevel): string[] {
    if (this.manifest?.levels[level]) {
      return this.manifest.levels[level].enabledPlugins.filter(pluginId =>
        this.isPluginAvailable(pluginId)
      );
    }

    // 默认策略：按层级返回所有可用插件
    return Array.from(this.plugins.keys()).filter(pluginId =>
      this.isPluginAvailable(pluginId)
    );
  }

  /**
   * 获取执行顺序
   */
  getExecutionOrder(enabledPlugins: string[]): string[] {
    return this.dependencyGraph.topologicalSort(enabledPlugins);
  }

  /**
   * 检查插件是否可用
   */
  isPluginAvailable(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return false;

    const state = this.lifecycleManager.getPluginState(pluginId);
    return state?.status === PluginStatus.ACTIVE && plugin.isAvailable();
  }

  /**
   * 激活插件
   */
  async activatePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new PluginError('NOT_FOUND', `Plugin ${pluginId} not found`);
    }

    const state = this.lifecycleManager.getPluginState(pluginId);
    if (state?.status === PluginStatus.ACTIVE) {
      return; // 已经是活跃状态
    }

    // 如果未初始化，先初始化
    if (state?.status === PluginStatus.REGISTERED) {
      await this.initializePlugin(pluginId);
    }

    this.lifecycleManager.markAsActive(pluginId);
  }

  /**
   * 停用插件
   */
  async deactivatePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new PluginError('NOT_FOUND', `Plugin ${pluginId} not found`);
    }

    // 检查是否有活跃的依赖者
    const dependents = this.dependencyGraph.getDependents(pluginId);
    const activeDependents = dependents.filter(depId => this.isPluginAvailable(depId));
    
    if (activeDependents.length > 0) {
      throw new PluginError('HAS_ACTIVE_DEPENDENTS', 
        `Cannot deactivate plugin ${pluginId} - has active dependents: ${activeDependents.join(', ')}`,
        pluginId);
    }

    this.lifecycleManager.markAsInactive(pluginId);
  }

  /**
   * 重启插件
   */
  async restartPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new PluginError('NOT_FOUND', `Plugin ${pluginId} not found`);
    }

    try {
      // 停用
      await this.deactivatePlugin(pluginId);
      
      // 销毁
      await plugin.destroy();
      this.lifecycleManager.markDestroyed(pluginId);
      
      // 重新初始化
      await this.initializePlugin(pluginId);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.lifecycleManager.markError(pluginId, errorMessage);
      throw error;
    }
  }

  /**
   * 执行健康检查
   */
  async performHealthCheck(pluginId?: string): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    const pluginsToCheck = pluginId ? [pluginId] : Array.from(this.plugins.keys());

    for (const id of pluginsToCheck) {
      const plugin = this.plugins.get(id);
      if (!plugin) continue;

      try {
        const health = plugin.getHealthStatus();
        const isHealthy = health.status === 'healthy';
        results.set(id, isHealthy);
        
        this.lifecycleManager.recordHealthCheck(id, isHealthy, health);
        
        if (!isHealthy) {
          console.warn(`Plugin ${id} health check failed:`, health.message);
        }
      } catch (error) {
        results.set(id, false);
        this.lifecycleManager.recordHealthCheck(id, false, { 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return results;
  }

  /**
   * 获取容器统计信息
   */
  getStatistics(): {
    pluginCount: number;
    activePlugins: number;
    errorPlugins: number;
    healthMetrics: any;
    dependencyStats: any;
  } {
    const healthMetrics = this.lifecycleManager.getHealthMetrics();
    const dependencyStats = this.dependencyGraph.getStatistics();

    return {
      pluginCount: this.plugins.size,
      activePlugins: healthMetrics.activePlugins,
      errorPlugins: healthMetrics.errorPlugins,
      healthMetrics,
      dependencyStats
    };
  }

  /**
   * 生成状态报告
   */
  generateStatusReport(): any {
    return {
      container: this.getStatistics(),
      lifecycle: this.lifecycleManager.generateStatusReport(),
      dependencies: this.dependencyGraph.exportGraph()
    };
  }

  /**
   * 验证插件
   */
  private async validatePlugin(plugin: NamingPlugin): Promise<ValidationResult> {
    const errors: string[] = [];
    
    if (!plugin.id) {
      errors.push('Plugin must have an id');
    }
    
    if (!plugin.version) {
      errors.push('Plugin must have a version');
    }
    
    if (typeof plugin.layer !== 'number' || plugin.layer < 1 || plugin.layer > 4) {
      errors.push('Plugin must have a valid layer (1-4)');
    }
    
    if (!Array.isArray(plugin.dependencies)) {
      errors.push('Plugin must have dependencies array');
    }
    
    if (typeof plugin.process !== 'function') {
      errors.push('Plugin must implement process method');
    }
    
    if (typeof plugin.validate !== 'function') {
      errors.push('Plugin must implement validate method');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * 验证依赖关系
   */
  private validateDependencies(): {
    valid: boolean;
    missingDependencies: Array<{ pluginId: string; missingDep: string; required: boolean }>;
  } {
    const enabledPlugins = Array.from(this.plugins.keys());
    return this.dependencyGraph.validateDependencies(enabledPlugins);
  }

  /**
   * 创建插件上下文
   */
  private createPluginContext(pluginId: string): PluginContext {
    return {
      requestId: `init-${pluginId}-${Date.now()}`,
      getPluginResult: <T = any>(targetPluginId: string): T | null => {
        // 在初始化阶段，其他插件结果不可用
        return null;
      },
      setPluginResult: (targetPluginId: string, result: any): void => {
        // 在初始化阶段，不需要设置结果
      },
      getConfig: (): PluginConfig => {
        return this.configs.get(pluginId) || this.getDefaultConfig();
      },
      log: (level: string, message: string, data?: any) => {
        console.log(`[${level.toUpperCase()}] ${pluginId}: ${message}`, data || '');
      }
    };
  }

  /**
   * 获取默认配置
   */
  private getDefaultConfig(): PluginConfig {
    return {
      enabled: true,
      priority: 1,
      timeout: this.config.defaultTimeout,
      retryCount: this.config.maxRetries,
      customSettings: {}
    };
  }

  /**
   * 启动健康检查
   */
  private startHealthChecks(): void {
    this.healthCheckTimer = setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        console.error('Health check failed:', error);
      }
    }, this.config.healthCheckInterval);
  }

  /**
   * 停止健康检查
   */
  private stopHealthChecks(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = undefined;
    }
  }

  /**
   * 清理资源
   */
  async destroy(): Promise<void> {
    this.stopHealthChecks();

    // 按反向依赖顺序销毁插件
    const executionOrder = this.dependencyGraph.topologicalSort(Array.from(this.plugins.keys()));
    const destructionOrder = executionOrder.reverse();

    for (const pluginId of destructionOrder) {
      try {
        const plugin = this.plugins.get(pluginId);
        if (plugin) {
          await plugin.destroy();
          this.lifecycleManager.markDestroyed(pluginId);
        }
      } catch (error) {
        console.error(`Failed to destroy plugin ${pluginId}:`, error);
      }
    }

    this.plugins.clear();
    this.configs.clear();
    this.dependencyGraph.clear();
    this.lifecycleManager.clear();
  }
}