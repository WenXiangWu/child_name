/**
 * 错误处理机制
 * 定义插件系统的错误类型和处理方式
 */

// 错误类型枚举
export enum ErrorType {
  // 插件相关错误
  PLUGIN_NOT_FOUND = 'PLUGIN_NOT_FOUND',
  PLUGIN_LOAD_FAILED = 'PLUGIN_LOAD_FAILED',
  PLUGIN_INIT_FAILED = 'PLUGIN_INIT_FAILED',
  PLUGIN_EXECUTION_FAILED = 'PLUGIN_EXECUTION_FAILED',
  PLUGIN_TIMEOUT = 'PLUGIN_TIMEOUT',
  PLUGIN_DEPENDENCY_MISSING = 'PLUGIN_DEPENDENCY_MISSING',
  PLUGIN_CIRCULAR_DEPENDENCY = 'PLUGIN_CIRCULAR_DEPENDENCY',
  
  // 配置相关错误
  CONFIG_INVALID = 'CONFIG_INVALID',
  CONFIG_MISSING = 'CONFIG_MISSING',
  CONFIG_LOAD_FAILED = 'CONFIG_LOAD_FAILED',
  
  // 数据相关错误
  DATA_INVALID = 'DATA_INVALID',
  DATA_MISSING = 'DATA_MISSING',
  DATA_FORMAT_ERROR = 'DATA_FORMAT_ERROR',
  
  // 系统相关错误
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  RESOURCE_EXHAUSTED = 'RESOURCE_EXHAUSTED',
  
  // 验证相关错误
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',
  
  // 未知错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// 错误严重程度
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// 基础错误类
export class PluginSystemError extends Error {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly code: string;
  public readonly details?: any;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN_ERROR,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    code?: string,
    details?: any,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'PluginSystemError';
    this.type = type;
    this.severity = severity;
    this.code = code || type;
    this.details = details;
    this.timestamp = new Date();
    this.context = context;

    // 确保错误堆栈正确
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PluginSystemError);
    }
  }

  /**
   * 转换为可序列化的对象
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      severity: this.severity,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack
    };
  }

  /**
   * 创建用户友好的错误消息
   */
  getUserMessage(): string {
    const messages: Record<ErrorType, string> = {
      [ErrorType.PLUGIN_NOT_FOUND]: '插件未找到',
      [ErrorType.PLUGIN_LOAD_FAILED]: '插件加载失败',
      [ErrorType.PLUGIN_INIT_FAILED]: '插件初始化失败',
      [ErrorType.PLUGIN_EXECUTION_FAILED]: '插件执行失败',
      [ErrorType.PLUGIN_TIMEOUT]: '插件执行超时',
      [ErrorType.PLUGIN_DEPENDENCY_MISSING]: '插件依赖缺失',
      [ErrorType.PLUGIN_CIRCULAR_DEPENDENCY]: '检测到循环依赖',
      [ErrorType.CONFIG_INVALID]: '配置无效',
      [ErrorType.CONFIG_MISSING]: '配置缺失',
      [ErrorType.CONFIG_LOAD_FAILED]: '配置加载失败',
      [ErrorType.DATA_INVALID]: '数据无效',
      [ErrorType.DATA_MISSING]: '数据缺失',
      [ErrorType.DATA_FORMAT_ERROR]: '数据格式错误',
      [ErrorType.SYSTEM_ERROR]: '系统错误',
      [ErrorType.NETWORK_ERROR]: '网络错误',
      [ErrorType.PERMISSION_DENIED]: '权限不足',
      [ErrorType.RESOURCE_EXHAUSTED]: '资源不足',
      [ErrorType.VALIDATION_FAILED]: '验证失败',
      [ErrorType.CONSTRAINT_VIOLATION]: '约束违反',
      [ErrorType.UNKNOWN_ERROR]: '未知错误'
    };

    return messages[this.type] || this.message;
  }
}

// 具体错误类
export class PluginNotFoundError extends PluginSystemError {
  constructor(pluginId: string, context?: Record<string, any>) {
    super(
      `插件 ${pluginId} 未找到`,
      ErrorType.PLUGIN_NOT_FOUND,
      ErrorSeverity.HIGH,
      `PLUGIN_NOT_FOUND_${pluginId}`,
      { pluginId },
      context
    );
    this.name = 'PluginNotFoundError';
  }
}

export class PluginLoadError extends PluginSystemError {
  constructor(pluginId: string, reason: string, context?: Record<string, any>) {
    super(
      `插件 ${pluginId} 加载失败: ${reason}`,
      ErrorType.PLUGIN_LOAD_FAILED,
      ErrorSeverity.HIGH,
      `PLUGIN_LOAD_FAILED_${pluginId}`,
      { pluginId, reason },
      context
    );
    this.name = 'PluginLoadError';
  }
}

export class PluginExecutionError extends PluginSystemError {
  constructor(pluginId: string, reason: string, context?: Record<string, any>) {
    super(
      `插件 ${pluginId} 执行失败: ${reason}`,
      ErrorType.PLUGIN_EXECUTION_FAILED,
      ErrorSeverity.MEDIUM,
      `PLUGIN_EXECUTION_FAILED_${pluginId}`,
      { pluginId, reason },
      context
    );
    this.name = 'PluginExecutionError';
  }
}

export class PluginTimeoutError extends PluginSystemError {
  constructor(pluginId: string, timeout: number, context?: Record<string, any>) {
    super(
      `插件 ${pluginId} 执行超时 (${timeout}ms)`,
      ErrorType.PLUGIN_TIMEOUT,
      ErrorSeverity.MEDIUM,
      `PLUGIN_TIMEOUT_${pluginId}`,
      { pluginId, timeout },
      context
    );
    this.name = 'PluginTimeoutError';
  }
}

export class DependencyError extends PluginSystemError {
  constructor(pluginId: string, missingDeps: string[], context?: Record<string, any>) {
    super(
      `插件 ${pluginId} 依赖缺失: ${missingDeps.join(', ')}`,
      ErrorType.PLUGIN_DEPENDENCY_MISSING,
      ErrorSeverity.HIGH,
      `DEPENDENCY_MISSING_${pluginId}`,
      { pluginId, missingDependencies: missingDeps },
      context
    );
    this.name = 'DependencyError';
  }
}

export class CircularDependencyError extends PluginSystemError {
  constructor(cycle: string[], context?: Record<string, any>) {
    super(
      `检测到循环依赖: ${cycle.join(' -> ')}`,
      ErrorType.PLUGIN_CIRCULAR_DEPENDENCY,
      ErrorSeverity.CRITICAL,
      'CIRCULAR_DEPENDENCY',
      { cycle },
      context
    );
    this.name = 'CircularDependencyError';
  }
}

export class ValidationError extends PluginSystemError {
  constructor(field: string, value: any, rule: string, context?: Record<string, any>) {
    super(
      `字段 ${field} 验证失败: 值 "${value}" 不符合规则 "${rule}"`,
      ErrorType.VALIDATION_FAILED,
      ErrorSeverity.MEDIUM,
      `VALIDATION_FAILED_${field}`,
      { field, value, rule },
      context
    );
    this.name = 'ValidationError';
  }
}

// 错误处理器
export class ErrorHandler {
  private errorListeners: Array<(error: PluginSystemError) => void> = [];
  private errorLog: PluginSystemError[] = [];
  private maxLogSize: number = 1000;

  /**
   * 添加错误监听器
   */
  addErrorListener(listener: (error: PluginSystemError) => void): void {
    this.errorListeners.push(listener);
  }

  /**
   * 移除错误监听器
   */
  removeErrorListener(listener: (error: PluginSystemError) => void): void {
    const index = this.errorListeners.indexOf(listener);
    if (index > -1) {
      this.errorListeners.splice(index, 1);
    }
  }

  /**
   * 处理错误
   */
  handleError(error: PluginSystemError): void {
    // 记录错误
    this.logError(error);

    // 通知监听器
    this.notifyListeners(error);

    // 根据严重程度采取不同措施
    this.handleBySeverity(error);
  }

  /**
   * 记录错误
   */
  private logError(error: PluginSystemError): void {
    this.errorLog.push(error);
    
    // 限制日志大小
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // 控制台输出
    console.error(`[${error.severity.toUpperCase()}] ${error.message}`, {
      type: error.type,
      code: error.code,
      details: error.details,
      context: error.context,
      stack: error.stack
    });
  }

  /**
   * 通知监听器
   */
  private notifyListeners(error: PluginSystemError): void {
    for (const listener of this.errorListeners) {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('错误监听器执行失败:', listenerError);
      }
    }
  }

  /**
   * 根据严重程度处理错误
   */
  private handleBySeverity(error: PluginSystemError): void {
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        // 严重错误，可能需要重启系统
        console.error('严重错误，建议检查系统状态');
        break;
      case ErrorSeverity.HIGH:
        // 高严重性错误，记录详细日志
        console.error('高严重性错误，请检查相关配置');
        break;
      case ErrorSeverity.MEDIUM:
        // 中等严重性错误，记录警告
        console.warn('中等严重性错误，系统继续运行');
        break;
      case ErrorSeverity.LOW:
        // 低严重性错误，记录信息
        console.info('低严重性错误，不影响系统运行');
        break;
    }
  }

  /**
   * 获取错误日志
   */
  getErrorLog(): PluginSystemError[] {
    return [...this.errorLog];
  }

  /**
   * 清理错误日志
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * 获取错误统计
   */
  getErrorStats(): Record<ErrorType, number> {
    const stats: Record<ErrorType, number> = {} as Record<ErrorType, number>;
    
    for (const error of this.errorLog) {
      stats[error.type] = (stats[error.type] || 0) + 1;
    }
    
    return stats;
  }
}

// 导出所有错误类型和处理器
export {
  PluginSystemError,
  PluginNotFoundError,
  PluginLoadError,
  PluginExecutionError,
  PluginTimeoutError,
  DependencyError,
  CircularDependencyError,
  ValidationError,
  ErrorHandler
};
