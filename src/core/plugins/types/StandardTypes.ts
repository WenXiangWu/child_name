/**
 * 标准化数据类型定义
 * 定义插件间通信的标准数据格式
 */

// 基础信息
export interface BasicInfo {
  name?: string;
  gender: 'male' | 'female';
  birthDate: string; // ISO 8601 格式
  birthTime?: string; // 24小时制，如 "14:30"
  birthPlace?: string;
}

// 姓名信息
export interface NameInfo {
  surname: string;
  givenName: string;
  fullName: string;
  pinyin?: string;
  traditional?: string;
}

// 五行属性
export interface WuxingInfo {
  element: '金' | '木' | '水' | '火' | '土';
  strength: number; // 0-100
  description?: string;
}

// 三才配置
export interface SancaiConfig {
  heaven: WuxingInfo;
  human: WuxingInfo;
  earth: WuxingInfo;
  overall: WuxingInfo;
}

// 五格配置
export interface WugeConfig {
  tian: number; // 天格
  ren: number;  // 人格
  di: number;   // 地格
  wai: number;  // 外格
  zong: number; // 总格
}

// 生肖信息
export interface ZodiacInfo {
  sign: string;
  year: number;
  compatibility: string[];
  conflicts: string[];
}

// 标准输入格式
export interface StandardInput {
  basicInfo: BasicInfo;
  preferences?: {
    nameLength?: number;
    excludedCharacters?: string[];
    preferredElements?: string[];
    avoidElements?: string[];
    culturalPreferences?: string[];
  };
  constraints?: {
    maxStrokeCount?: number;
    minStrokeCount?: number;
    requiredCharacters?: string[];
    forbiddenCharacters?: string[];
  };
  context?: {
    requestId: string;
    timestamp: string;
    source: string;
    metadata?: Record<string, any>;
  };
}

// 标准输出格式
export interface StandardOutput {
  success: boolean;
  data?: {
    names: NameSuggestion[];
    analysis?: {
      sancai?: SancaiConfig;
      wuge?: WugeConfig;
      zodiac?: ZodiacInfo;
      strokeAnalysis?: StrokeAnalysis;
    };
    recommendations?: string[];
    warnings?: string[];
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    processingTime: number;
    pluginsUsed: string[];
  };
}

// 姓名建议
export interface NameSuggestion {
  name: NameInfo;
  score: number; // 0-100
  reasons: string[];
  analysis: {
    sancai: SancaiConfig;
    wuge: WugeConfig;
    strokeCount: number;
    elementBalance: number;
    culturalFit: number;
  };
  tags: string[];
}

// 笔画分析
export interface StrokeAnalysis {
  totalStrokes: number;
  characterStrokes: number[];
  strokeDistribution: Record<string, number>;
  complexity: 'simple' | 'medium' | 'complex';
}

// 处理上下文
export interface ProcessingContext {
  requestId: string;
  input: StandardInput;
  intermediateResults: Map<string, any>;
  pluginResults: Map<string, any>;
  startTime: number;
  
  // 上下文方法
  getResult<T = any>(key: string): T | null;
  setResult(key: string, value: any): void;
  getPluginResult<T = any>(pluginId: string): T | null;
  setPluginResult(pluginId: string, value: any): void;
  
  // 日志记录
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void;
  
  // 进度跟踪
  updateProgress(pluginId: string, progress: number): void;
  getProgress(): Record<string, number>;
}

// 插件结果
export interface PluginResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata: {
    pluginId: string;
    executionTime: number;
    timestamp: string;
  };
}

// 验证结果
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

// 配置选项
export interface ProcessingOptions {
  enableValidation: boolean;
  enableFallback: boolean;
  timeout: number;
  retryCount: number;
  strictMode: boolean;
  debugMode: boolean;
}

// 导出所有类型
export type {
  BasicInfo,
  NameInfo,
  WuxingInfo,
  SancaiConfig,
  WugeConfig,
  ZodiacInfo,
  StandardInput,
  StandardOutput,
  NameSuggestion,
  StrokeAnalysis,
  ProcessingContext,
  PluginResult,
  ValidationResult,
  ProcessingOptions
};
