/**
 * 统一插件接口标准 - 6层架构版本
 * 严格按照文档《插件执行示例-吴姓男孩取名完整计算过程.md》定义
 */

export interface PluginMetadata {
  name: string;
  description: string;
  author: string;
  category: 'input' | 'analysis' | 'strategy' | 'filtering' | 'generation' | 'scoring';
  tags: string[];
}

export interface PluginDependency {
  pluginId: string;
  required: boolean;
  version?: string;
}

export interface PluginConfig {
  enabled: boolean;
  priority: number;
  timeout: number;
  retryCount: number;
  customSettings?: Record<string, any>;
}

export interface PluginContext {
  certaintyLevel: CertaintyLevel;
  log?: (level: 'info' | 'warn' | 'error', message: string) => void;
  metrics?: {
    startTime: number;
    pluginStats: Map<string, any>;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface PluginOutput {
  success: boolean;
  data: any;
  confidence: number;
  executionTime: number;
  metadata?: Record<string, any>;
  errors?: string[];
}

// 确定性等级枚举 - 对应文档定义
export enum CertaintyLevel {
  FULLY_DETERMINED = 1,    // 完整出生时间 - 启用全部插件
  PARTIALLY_DETERMINED = 2, // 缺少具体时辰 - 启用13个插件
  ESTIMATED = 3,           // 仅预产期 - 启用9个插件
  UNKNOWN = 4              // 基础信息 - 启用6个插件
}

// 标准输入接口
export interface StandardInput {
  // Layer 1 基础信息
  familyName: string;
  gender: 'male' | 'female';
  birthInfo?: {
    year: number;
    month: number;
    day: number;
    hour?: number;
    minute?: number;
  };
  
  // 用户偏好
  preferences?: {
    certaintyLevel?: CertaintyLevel;
    parallelExecution?: boolean;
    includeTraditionalAnalysis?: boolean;
    skipOptionalFailures?: boolean;
  };
  
  // 其他配置
  characters?: string[];  // 避忌字符
  elements?: string[];   // 偏好五行
}

/**
 * 核心插件接口 - 6层架构标准版本
 */
export interface NamingPlugin {
  // 插件基本信息 - 必须明确指定层级
  readonly id: string;
  readonly version: string;
  readonly layer: 1 | 2 | 3 | 4 | 5 | 6;  // 明确的6层定义
  readonly dependencies: PluginDependency[];
  readonly metadata: PluginMetadata;

  // 生命周期方法
  initialize(config: PluginConfig, context: PluginContext): Promise<void>;
  validate(input: StandardInput): Promise<ValidationResult>;
  process(input: StandardInput, context: PluginContext): Promise<PluginOutput>;
  cleanup?(): Promise<void>;
}

/**
 * 6层插件架构类型定义 - 对应文档层级
 */

// Layer 1: 基础信息层 - 3个插件
export interface Layer1Plugin extends NamingPlugin {
  readonly layer: 1;
  readonly category: 'input';
}

// Layer 2: 命理分析层 - 3个插件
export interface Layer2Plugin extends NamingPlugin {
  readonly layer: 2;
  readonly category: 'analysis';
}

// Layer 3: 选字策略层 - 5个插件
export interface Layer3Plugin extends NamingPlugin {
  readonly layer: 3;
  readonly category: 'strategy';
}

// Layer 4: 字符筛选层 - 1个插件
export interface Layer4Plugin extends NamingPlugin {
  readonly layer: 4;
  readonly category: 'filtering';
}

// Layer 5: 名字生成层 - 1个插件
export interface Layer5Plugin extends NamingPlugin {
  readonly layer: 5;
  readonly category: 'generation';
}

// Layer 6: 名字评分层 - 5个插件
export interface Layer6Plugin extends NamingPlugin {
  readonly layer: 6;
  readonly category: 'scoring';
}

/**
 * 插件工厂接口
 */
export interface PluginFactory {
  createPlugin(id: string, config?: PluginConfig): NamingPlugin;
  getAvailablePlugins(): string[];
  getPluginsByLayer(layer: number): string[];
  getEnabledPluginsByCertaintyLevel(certaintyLevel: CertaintyLevel): string[];
}
