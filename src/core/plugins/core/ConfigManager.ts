/**
 * 配置管理器类
 * 负责插件配置的加载、验证和管理
 */

import { PluginConfig } from '../interfaces/NamingPlugin';

export interface GlobalConfig {
  plugins: {
    autoLoad: boolean;
    scanPaths: string[];
    manifestFile: string;
    defaultConfig: Partial<PluginConfig>;
  };
  container: {
    maxConcurrentPlugins: number;
    defaultTimeout: number;
    enableFallback: boolean;
    strictMode: boolean;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableFileLog: boolean;
    logFilePath: string;
  };
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author?: string;
  category: 'input' | 'calculation' | 'evaluation' | 'output';
  tags: string[];
  dependencies: string[];
  entryPoint: string;
  configSchema?: Record<string, any>;
  defaultConfig?: Partial<PluginConfig>;
}

export class ConfigManager {
  private globalConfig: GlobalConfig;
  private pluginConfigs: Map<string, PluginConfig> = new Map();
  private manifests: Map<string, PluginManifest> = new Map();

  constructor(config?: Partial<GlobalConfig>) {
    this.globalConfig = {
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
        level: 'info',
        enableFileLog: false,
        logFilePath: './logs/plugins.log'
      },
      ...config
    };
  }

  /**
   * 加载全局配置
   */
  async loadGlobalConfig(configPath?: string): Promise<void> {
    try {
      if (configPath) {
        // 从文件加载配置
        const configData = await this.loadConfigFile(configPath);
        this.globalConfig = { ...this.globalConfig, ...configData };
      }
    } catch (error) {
      console.warn('加载全局配置失败，使用默认配置:', error);
    }
  }

  /**
   * 加载插件清单
   */
  async loadPluginManifests(): Promise<void> {
    for (const scanPath of this.globalConfig.plugins.scanPaths) {
      try {
        const manifestPath = `${scanPath}/${this.globalConfig.plugins.manifestFile}`;
        const manifest = await this.loadManifestFile(manifestPath);
        
        if (manifest && this.validateManifest(manifest)) {
          this.manifests.set(manifest.id, manifest);
          
          // 设置默认配置
          const defaultConfig = {
            ...this.globalConfig.plugins.defaultConfig,
            ...manifest.defaultConfig
          };
          
          this.pluginConfigs.set(manifest.id, defaultConfig as PluginConfig);
        }
      } catch (error) {
        console.warn(`加载插件清单失败 ${scanPath}:`, error);
      }
    }
  }

  /**
   * 获取插件配置
   */
  getPluginConfig(pluginId: string): PluginConfig | null {
    return this.pluginConfigs.get(pluginId) || null;
  }

  /**
   * 更新插件配置
   */
  updatePluginConfig(pluginId: string, config: Partial<PluginConfig>): void {
    const existingConfig = this.pluginConfigs.get(pluginId);
    if (existingConfig) {
      this.pluginConfigs.set(pluginId, { ...existingConfig, ...config });
    }
  }

  /**
   * 获取插件清单
   */
  getPluginManifest(pluginId: string): PluginManifest | null {
    return this.manifests.get(pluginId) || null;
  }

  /**
   * 获取所有插件清单
   */
  getAllManifests(): PluginManifest[] {
    return Array.from(this.manifests.values());
  }

  /**
   * 获取全局配置
   */
  getGlobalConfig(): GlobalConfig {
    return { ...this.globalConfig };
  }

  /**
   * 验证插件清单
   */
  private validateManifest(manifest: any): manifest is PluginManifest {
    const requiredFields = ['id', 'name', 'version', 'description', 'category', 'entryPoint'];
    
    for (const field of requiredFields) {
      if (!manifest[field]) {
        console.warn(`插件清单缺少必需字段: ${field}`);
        return false;
      }
    }

    // 验证分类
    const validCategories = ['input', 'calculation', 'evaluation', 'output'];
    if (!validCategories.includes(manifest.category)) {
      console.warn(`插件清单分类无效: ${manifest.category}`);
      return false;
    }

    // 验证版本格式
    if (!this.isValidVersion(manifest.version)) {
      console.warn(`插件清单版本格式无效: ${manifest.version}`);
      return false;
    }

    return true;
  }

  /**
   * 验证版本格式
   */
  private isValidVersion(version: string): boolean {
    const versionRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
    return versionRegex.test(version);
  }

  /**
   * 加载配置文件
   */
  private async loadConfigFile(configPath: string): Promise<any> {
    try {
      // 这里应该根据实际的文件格式来加载
      // 暂时返回空对象，实际实现时需要根据文件类型来解析
      return {};
    } catch (error) {
      throw new Error(`加载配置文件失败: ${error}`);
    }
  }

  /**
   * 加载清单文件
   */
  private async loadManifestFile(manifestPath: string): Promise<any> {
    try {
      // 这里应该根据实际的文件格式来加载
      // 暂时返回空对象，实际实现时需要根据文件类型来解析
      return {};
    } catch (error) {
      throw new Error(`加载清单文件失败: ${error}`);
    }
  }

  /**
   * 导出配置
   */
  exportConfig(): string {
    return JSON.stringify({
      global: this.globalConfig,
      plugins: Object.fromEntries(this.pluginConfigs),
      manifests: Object.fromEntries(this.manifests)
    }, null, 2);
  }

  /**
   * 重置配置
   */
  reset(): void {
    this.pluginConfigs.clear();
    this.manifests.clear();
  }
}
