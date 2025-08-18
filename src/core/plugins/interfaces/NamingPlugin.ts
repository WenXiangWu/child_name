/**
 * 取名系统核心插件接口
 * 所有插件必须实现此接口
 */

export interface PluginDependency {
  pluginId: string;
  required: boolean;
  version?: string;
}

export interface PluginMetadata {
  name: string;
  description: string;
  author?: string;
  category: 'input' | 'calculation' | 'evaluation' | 'output';
  tags: string[];
}

export interface PluginConfig {
  enabled: boolean;
  priority: number;
  timeout: number;
  retryCount: number;
  fallbackPlugin?: string;
  customSettings?: Record<string, any>;
}

export interface PluginContext {
  requestId: string;
  getPluginResult<T = any>(pluginId: string): T | null;
  setPluginResult(pluginId: string, result: any): void;
  getConfig(): PluginConfig;
  log(level: 'info' | 'warn' | 'error', message: string, data?: any): void;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PluginError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

export interface PluginOutput {
  pluginId: string;
  results: any;
  confidence: number;
  metadata: {
    processingTime: number;
    dataSource?: string;
    version?: string;
    [key: string]: any;
  };
  errors?: PluginError[];
}

export interface StandardInput {
  readonly requestId: string;
  readonly certaintyLevel: CertaintyLevel;
  readonly data: InputData;
  readonly context: ProcessingContext;
}

export interface InputData {
  familyName?: string;
  gender?: 'male' | 'female';
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
  characters?: string[];
  preferences?: Record<string, any>;
}

export interface ProcessingContext {
  requestId: string;
  startTime: number;
  certaintyLevel: CertaintyLevel;
  pluginResults: Map<string, any>;
  errors: PluginError[];
  warnings: string[];
  log?: (level: 'info' | 'warn' | 'error', message: string, data?: any) => void;
}

export enum CertaintyLevel {
  FULLY_DETERMINED = 1,    // 完全确定 - 所有15个插件
  PARTIALLY_DETERMINED = 2, // 部分确定 - 12个插件
  ESTIMATED = 3,           // 预估阶段 - 9个插件
  UNKNOWN = 4              // 完全未知 - 6个插件
}

/**
 * 核心插件接口
 */
export interface NamingPlugin {
  readonly id: string;
  readonly version: string;
  readonly layer: 1 | 2 | 3 | 4;
  readonly dependencies: PluginDependency[];
  readonly metadata: PluginMetadata;
  
  /**
   * 初始化插件
   */
  initialize(config: PluginConfig, context: PluginContext): Promise<void>;
  
  /**
   * 处理输入数据
   */
  process(input: StandardInput): Promise<PluginOutput>;
  
  /**
   * 验证输入数据
   */
  validate(input: StandardInput): ValidationResult;
  
  /**
   * 销毁插件，清理资源
   */
  destroy(): Promise<void>;
  
  /**
   * 检查插件是否可用
   */
  isAvailable(): boolean;
  
  /**
   * 获取插件健康状态
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    message: string;
    lastCheck: number;
  };
}
