/**
 * 核心插件系统统一导出
 */

// 核心接口
export * from './interfaces/NamingPlugin';

// 核心类
export { PluginContainer } from './core/PluginContainer';
export type { ContainerConfig } from './core/PluginContainer';
export { DependencyGraph } from './core/DependencyGraph';
export { PluginRegistry } from './core/PluginRegistry';
export type { RegistryEntry } from './core/PluginRegistry';
export { ConfigManager } from './core/ConfigManager';
export type { GlobalConfig, PluginManifest } from './core/ConfigManager';

// 类型导出
export type {
  PluginDependency,
  PluginMetadata,
  PluginConfig,
  PluginContext,
  ValidationResult
} from './interfaces/NamingPlugin';

// 默认配置
export const DEFAULT_CONTAINER_CONFIG = {
  maxConcurrentPlugins: 10,
  defaultTimeout: 30000,
  enableFallback: true,
  strictMode: false
};

export const DEFAULT_GLOBAL_CONFIG = {
  plugins: {
    autoLoad: true,
    scanPaths: ['./plugins', './src/plugins'],
    manifestFile: 'plugin-manifest.json',
    defaultConfig: {
      enabled: true,
      priority: 100,
      timeout: 30000,
      retryCount: 3
    }
  },
  container: {
    maxConcurrentPlugins: 10,
    defaultTimeout: 30000,
    enableFallback: true,
    strictMode: false
  },
  logging: {
    level: 'info' as const,
    enableFileLog: false,
    logFilePath: './logs/plugins.log'
  }
};
