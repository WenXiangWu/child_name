/**
 * 插件生命周期管理器 - 管理插件的状态和生命周期
 */

import { PluginDependency } from '../interfaces/NamingPlugin';

export enum PluginStatus {
  REGISTERED = 'registered',      // 已注册
  INITIALIZING = 'initializing',  // 初始化中
  ACTIVE = 'active',              // 活跃状态
  INACTIVE = 'inactive',          // 非活跃状态
  ERROR = 'error',                // 错误状态
  DESTROYED = 'destroyed'         // 已销毁
}

export interface PluginState {
  id: string;
  status: PluginStatus;
  lastStatusChange: number;
  initializationTime?: number;
  destructionTime?: number;
  errorCount: number;
  lastError?: string;
  healthCheckCount: number;
  lastHealthCheck: number;
  metadata: {
    version: string;
    layer: number;
    dependencies: PluginDependency[];
  };
}

export interface LifecycleEvent {
  pluginId: string;
  event: string;
  timestamp: number;
  details?: any;
}

export interface HealthMetrics {
  totalPlugins: number;
  activePlugins: number;
  errorPlugins: number;
  averageInitTime: number;
  totalErrors: number;
  uptime: number;
}

export class PluginLifecycleManager {
  private pluginStates: Map<string, PluginState> = new Map();
  private eventHistory: LifecycleEvent[] = [];
  private maxEventHistory = 1000;
  private startTime = Date.now();

  /**
   * 注册插件
   */
  registerPlugin(
    pluginId: string, 
    version: string, 
    layer: number, 
    dependencies: PluginDependency[]
  ): void {
    const state: PluginState = {
      id: pluginId,
      status: PluginStatus.REGISTERED,
      lastStatusChange: Date.now(),
      errorCount: 0,
      healthCheckCount: 0,
      lastHealthCheck: 0,
      metadata: {
        version,
        layer,
        dependencies
      }
    };

    this.pluginStates.set(pluginId, state);
    this.recordEvent(pluginId, 'register', { version, layer, dependencies });
  }

  /**
   * 标记插件开始初始化
   */
  markInitializing(pluginId: string): void {
    const state = this.pluginStates.get(pluginId);
    if (!state) {
      throw new Error(`Plugin ${pluginId} not registered`);
    }

    state.status = PluginStatus.INITIALIZING;
    state.lastStatusChange = Date.now();
    this.recordEvent(pluginId, 'initialization_start');
  }

  /**
   * 标记插件初始化完成
   */
  markInitialized(pluginId: string): void {
    const state = this.pluginStates.get(pluginId);
    if (!state) {
      throw new Error(`Plugin ${pluginId} not registered`);
    }

    const initTime = Date.now() - state.lastStatusChange;
    state.status = PluginStatus.ACTIVE;
    state.initializationTime = initTime;
    state.lastStatusChange = Date.now();
    
    this.recordEvent(pluginId, 'initialization_complete', { initTime });
  }

  /**
   * 标记插件初始化失败
   */
  markInitializationFailed(pluginId: string, error: string): void {
    const state = this.pluginStates.get(pluginId);
    if (!state) {
      throw new Error(`Plugin ${pluginId} not registered`);
    }

    state.status = PluginStatus.ERROR;
    state.lastStatusChange = Date.now();
    state.errorCount++;
    state.lastError = error;
    
    this.recordEvent(pluginId, 'initialization_failed', { error });
  }

  /**
   * 标记插件为活跃状态
   */
  markAsActive(pluginId: string): void {
    const state = this.pluginStates.get(pluginId);
    if (!state) {
      throw new Error(`Plugin ${pluginId} not registered`);
    }

    state.status = PluginStatus.ACTIVE;
    state.lastStatusChange = Date.now();
    this.recordEvent(pluginId, 'activate');
  }

  /**
   * 标记插件为非活跃状态
   */
  markAsInactive(pluginId: string): void {
    const state = this.pluginStates.get(pluginId);
    if (!state) {
      throw new Error(`Plugin ${pluginId} not registered`);
    }

    state.status = PluginStatus.INACTIVE;
    state.lastStatusChange = Date.now();
    this.recordEvent(pluginId, 'deactivate');
  }

  /**
   * 标记插件发生错误
   */
  markError(pluginId: string, error: string): void {
    const state = this.pluginStates.get(pluginId);
    if (!state) {
      throw new Error(`Plugin ${pluginId} not registered`);
    }

    state.status = PluginStatus.ERROR;
    state.lastStatusChange = Date.now();
    state.errorCount++;
    state.lastError = error;
    
    this.recordEvent(pluginId, 'error', { error });
  }

  /**
   * 标记插件已销毁
   */
  markDestroyed(pluginId: string): void {
    const state = this.pluginStates.get(pluginId);
    if (!state) {
      throw new Error(`Plugin ${pluginId} not registered`);
    }

    state.status = PluginStatus.DESTROYED;
    state.destructionTime = Date.now();
    state.lastStatusChange = Date.now();
    
    this.recordEvent(pluginId, 'destroy');
  }

  /**
   * 记录健康检查
   */
  recordHealthCheck(pluginId: string, healthy: boolean, details?: any): void {
    const state = this.pluginStates.get(pluginId);
    if (!state) {
      throw new Error(`Plugin ${pluginId} not registered`);
    }

    state.healthCheckCount++;
    state.lastHealthCheck = Date.now();
    
    if (!healthy) {
      state.errorCount++;
      state.lastError = details?.error || 'Health check failed';
    }

    this.recordEvent(pluginId, 'health_check', { healthy, details });
  }

  /**
   * 获取插件状态
   */
  getPluginState(pluginId: string): PluginState | undefined {
    return this.pluginStates.get(pluginId);
  }

  /**
   * 获取所有插件状态
   */
  getAllPluginStates(): PluginState[] {
    return Array.from(this.pluginStates.values());
  }

  /**
   * 按状态获取插件
   */
  getPluginsByStatus(status: PluginStatus): PluginState[] {
    return Array.from(this.pluginStates.values()).filter(
      state => state.status === status
    );
  }

  /**
   * 按层级获取插件
   */
  getPluginsByLayer(layer: number): PluginState[] {
    return Array.from(this.pluginStates.values()).filter(
      state => state.metadata.layer === layer
    );
  }

  /**
   * 获取健康的插件
   */
  getHealthyPlugins(): PluginState[] {
    return this.getPluginsByStatus(PluginStatus.ACTIVE);
  }

  /**
   * 获取有问题的插件
   */
  getProblematicPlugins(): PluginState[] {
    return Array.from(this.pluginStates.values()).filter(
      state => state.status === PluginStatus.ERROR || 
               state.errorCount > 0
    );
  }

  /**
   * 检查插件是否准备就绪
   */
  isPluginReady(pluginId: string): boolean {
    const state = this.pluginStates.get(pluginId);
    return state?.status === PluginStatus.ACTIVE;
  }

  /**
   * 检查所有依赖是否准备就绪
   */
    areDependenciesReady(pluginId: string): boolean {
    const state = this.pluginStates.get(pluginId);
    if (!state) {
      console.warn(`Plugin ${pluginId} not found in lifecycle manager`);
      return false;
    }

    // 只检查required的依赖是否准备就绪
    for (const dep of state.metadata.dependencies) {
      const depState = this.pluginStates.get(dep.pluginId);
      
      if (dep.required) {
        // 必需依赖必须存在且处于ACTIVE状态
        if (!depState) {
          console.warn(`Required dependency ${dep.pluginId} not found for plugin ${pluginId}`);
          return false;
        }
        if (depState.status !== PluginStatus.ACTIVE) {
          console.warn(`Required dependency ${dep.pluginId} not active for plugin ${pluginId}, current status: ${depState.status}`);
          return false;
        }
      } else {
        // 可选依赖可以失败或不存在，不影响当前插件初始化
        if (depState && depState.status !== PluginStatus.ACTIVE) {
          console.info(`Optional dependency ${dep.pluginId} not active for plugin ${pluginId}, but will continue`);
        }
        continue;
      }
    }

    return true;
  }

  /**
   * 获取可以启动的插件
   */
  getPluginsReadyToStart(): string[] {
    return Array.from(this.pluginStates.values())
      .filter(state => 
        state.status === PluginStatus.REGISTERED &&
        this.areDependenciesReady(state.id)
      )
      .map(state => state.id);
  }

  /**
   * 获取健康指标
   */
  getHealthMetrics(): HealthMetrics {
    const states = Array.from(this.pluginStates.values());
    const totalPlugins = states.length;
    const activePlugins = states.filter(s => s.status === PluginStatus.ACTIVE).length;
    const errorPlugins = states.filter(s => s.status === PluginStatus.ERROR).length;
    
    const initTimes = states
      .filter(s => s.initializationTime)
      .map(s => s.initializationTime!);
    const averageInitTime = initTimes.length > 0 
      ? initTimes.reduce((sum, time) => sum + time, 0) / initTimes.length
      : 0;

    const totalErrors = states.reduce((sum, state) => sum + state.errorCount, 0);
    const uptime = Date.now() - this.startTime;

    return {
      totalPlugins,
      activePlugins,
      errorPlugins,
      averageInitTime,
      totalErrors,
      uptime
    };
  }

  /**
   * 获取事件历史
   */
  getEventHistory(pluginId?: string, limit?: number): LifecycleEvent[] {
    let events = this.eventHistory;
    
    if (pluginId) {
      events = events.filter(event => event.pluginId === pluginId);
    }
    
    if (limit) {
      events = events.slice(-limit);
    }
    
    return events;
  }

  /**
   * 获取最近的错误
   */
  getRecentErrors(hours: number = 24): LifecycleEvent[] {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return this.eventHistory.filter(event => 
      event.timestamp > cutoff && 
      (event.event === 'error' || event.event === 'initialization_failed')
    );
  }

  /**
   * 生成状态报告
   */
  generateStatusReport(): {
    summary: HealthMetrics;
    pluginStates: PluginState[];
    recentErrors: LifecycleEvent[];
    layerDistribution: Map<number, { total: number; active: number; error: number }>;
  } {
    const summary = this.getHealthMetrics();
    const pluginStates = this.getAllPluginStates();
    const recentErrors = this.getRecentErrors();
    
    // 按层级统计
    const layerDistribution = new Map<number, { total: number; active: number; error: number }>();
    pluginStates.forEach(state => {
      const layer = state.metadata.layer;
      if (!layerDistribution.has(layer)) {
        layerDistribution.set(layer, { total: 0, active: 0, error: 0 });
      }
      
      const stats = layerDistribution.get(layer)!;
      stats.total++;
      if (state.status === PluginStatus.ACTIVE) stats.active++;
      if (state.status === PluginStatus.ERROR) stats.error++;
    });

    return {
      summary,
      pluginStates,
      recentErrors,
      layerDistribution
    };
  }

  /**
   * 重置插件状态
   */
  resetPlugin(pluginId: string): void {
    const state = this.pluginStates.get(pluginId);
    if (!state) {
      throw new Error(`Plugin ${pluginId} not registered`);
    }

    state.status = PluginStatus.REGISTERED;
    state.lastStatusChange = Date.now();
    state.errorCount = 0;
    state.lastError = undefined;
    state.initializationTime = undefined;
    state.destructionTime = undefined;
    
    this.recordEvent(pluginId, 'reset');
  }

  /**
   * 注销插件
   */
  unregisterPlugin(pluginId: string): void {
    const state = this.pluginStates.get(pluginId);
    if (state) {
      this.recordEvent(pluginId, 'unregister');
      this.pluginStates.delete(pluginId);
    }
  }

  /**
   * 清理过期事件
   */
  cleanupEvents(maxAge: number = 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - maxAge;
    this.eventHistory = this.eventHistory.filter(event => event.timestamp > cutoff);
  }

  /**
   * 获取插件启动顺序建议
   */
  getStartupOrder(): string[][] {
    const states = Array.from(this.pluginStates.values());
    const layerGroups = new Map<number, string[]>();

    // 按层级分组
    states.forEach(state => {
      const layer = state.metadata.layer;
      if (!layerGroups.has(layer)) {
        layerGroups.set(layer, []);
      }
      layerGroups.get(layer)!.push(state.id);
    });

    // 按层级顺序返回，并在每层内部按依赖关系排序
    const sortedLayers = Array.from(layerGroups.keys()).sort((a, b) => a - b);
    return sortedLayers.map(layer => {
      const pluginsInLayer = layerGroups.get(layer)!;
      // 在同一层内按依赖关系排序
      return this.sortPluginsByDependencies(pluginsInLayer);
    });
  }

  /**
   * 在同一层内按依赖关系排序插件
   */
  private sortPluginsByDependencies(pluginIds: string[]): string[] {
    const sorted: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (pluginId: string) => {
      if (visited.has(pluginId)) return;
      if (visiting.has(pluginId)) {
        // 循环依赖，按原顺序添加
        return;
      }

      visiting.add(pluginId);
      
      const state = this.pluginStates.get(pluginId);
      if (state) {
        // 先处理同层的依赖
        state.metadata.dependencies.forEach(dep => {
          if (pluginIds.includes(dep.pluginId) && !visited.has(dep.pluginId)) {
            visit(dep.pluginId);
          }
        });
      }

      visiting.delete(pluginId);
      visited.add(pluginId);
      sorted.push(pluginId);
    };

    pluginIds.forEach(pluginId => visit(pluginId));
    return sorted;
  }

  /**
   * 记录事件
   */
  private recordEvent(pluginId: string, event: string, details?: any): void {
    const lifecycleEvent: LifecycleEvent = {
      pluginId,
      event,
      timestamp: Date.now(),
      details
    };

    this.eventHistory.push(lifecycleEvent);

    // 限制事件历史大小
    if (this.eventHistory.length > this.maxEventHistory) {
      this.eventHistory = this.eventHistory.slice(-this.maxEventHistory);
    }
  }

  /**
   * 清空所有状态
   */
  clear(): void {
    this.pluginStates.clear();
    this.eventHistory = [];
    this.startTime = Date.now();
  }
}
