/**
 * 插件注册表类
 * 负责插件的存储、查找和生命周期管理
 */

import { NamingPlugin, PluginMetadata } from '../interfaces/NamingPlugin';

export interface RegistryEntry {
  plugin: NamingPlugin;
  metadata: PluginMetadata;
  registeredAt: Date;
  lastUsed: Date;
  usageCount: number;
  status: 'active' | 'disabled' | 'error';
}

export class PluginRegistry {
  private plugins: Map<string, RegistryEntry> = new Map();
  private categories: Map<string, Set<string>> = new Map();
  private tags: Map<string, Set<string>> = new Map();

  /**
   * 注册插件
   */
  async register(plugin: NamingPlugin): Promise<void> {
    const metadata = await plugin.getMetadata();
    
    // 检查插件ID是否已存在
    if (this.plugins.has(metadata.id)) {
      throw new Error(`插件 ${metadata.id} 已存在`);
    }

    // 创建注册条目
    const entry: RegistryEntry = {
      plugin,
      metadata,
      registeredAt: new Date(),
      lastUsed: new Date(),
      usageCount: 0,
      status: 'active'
    };

    // 添加到主注册表
    this.plugins.set(metadata.id, entry);

    // 添加到分类索引
    this.addToCategory(metadata.id, metadata.category);

    // 添加到标签索引
    for (const tag of metadata.tags) {
      this.addToTag(metadata.id, tag);
    }
  }

  /**
   * 注销插件
   */
  unregister(pluginId: string): boolean {
    const entry = this.plugins.get(pluginId);
    if (!entry) {
      return false;
    }

    // 从分类索引中移除
    this.removeFromCategory(entry.metadata.category, pluginId);

    // 从标签索引中移除
    for (const tag of entry.metadata.tags) {
      this.removeFromTag(tag, pluginId);
    }

    // 从主注册表中移除
    this.plugins.delete(pluginId);

    return true;
  }

  /**
   * 获取插件
   */
  getPlugin(pluginId: string): NamingPlugin | null {
    const entry = this.plugins.get(pluginId);
    if (!entry || entry.status !== 'active') {
      return null;
    }

    // 更新使用统计
    entry.lastUsed = new Date();
    entry.usageCount++;

    return entry.plugin;
  }

  /**
   * 获取插件元数据
   */
  getMetadata(pluginId: string): PluginMetadata | null {
    const entry = this.plugins.get(pluginId);
    return entry?.metadata || null;
  }

  /**
   * 获取所有插件
   */
  getAllPlugins(): NamingPlugin[] {
    return Array.from(this.plugins.values())
      .filter(entry => entry.status === 'active')
      .map(entry => entry.plugin);
  }

  /**
   * 按分类获取插件
   */
  getPluginsByCategory(category: string): NamingPlugin[] {
    const pluginIds = this.categories.get(category);
    if (!pluginIds) {
      return [];
    }

    return Array.from(pluginIds)
      .map(id => this.getPlugin(id))
      .filter(Boolean) as NamingPlugin[];
  }

  /**
   * 按标签获取插件
   */
  getPluginsByTag(tag: string): NamingPlugin[] {
    const pluginIds = this.tags.get(tag);
    if (!pluginIds) {
      return [];
    }

    return Array.from(pluginIds)
      .map(id => this.getPlugin(id))
      .filter(Boolean) as NamingPlugin[];
  }

  /**
   * 搜索插件
   */
  searchPlugins(query: string): NamingPlugin[] {
    const results: NamingPlugin[] = [];
    const lowerQuery = query.toLowerCase();

    for (const [id, entry] of this.plugins) {
      if (entry.status !== 'active') continue;

      // 检查名称、描述、标签
      if (entry.metadata.name.toLowerCase().includes(lowerQuery) ||
          entry.metadata.description.toLowerCase().includes(lowerQuery) ||
          entry.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        results.push(entry.plugin);
      }
    }

    return results;
  }

  /**
   * 获取插件数量
   */
  getPluginCount(): number {
    return this.plugins.size;
  }

  /**
   * 获取分类列表
   */
  getCategories(): string[] {
    return Array.from(this.categories.keys());
  }

  /**
   * 获取标签列表
   */
  getTags(): string[] {
    return Array.from(this.tags.keys());
  }

  /**
   * 获取注册表状态
   */
  getStatus() {
    const status = {
      totalPlugins: this.plugins.size,
      activePlugins: 0,
      disabledPlugins: 0,
      errorPlugins: 0,
      categories: this.getCategories(),
      tags: this.getTags()
    };

    for (const entry of this.plugins.values()) {
      switch (entry.status) {
        case 'active':
          status.activePlugins++;
          break;
        case 'disabled':
          status.disabledPlugins++;
          break;
        case 'error':
          status.errorPlugins++;
          break;
      }
    }

    return status;
  }

  /**
   * 添加分类索引
   */
  private addToCategory(pluginId: string, category: string): void {
    if (!this.categories.has(category)) {
      this.categories.set(category, new Set());
    }
    this.categories.get(category)!.add(pluginId);
  }

  /**
   * 移除分类索引
   */
  private removeFromCategory(category: string, pluginId: string): void {
    const categorySet = this.categories.get(category);
    if (categorySet) {
      categorySet.delete(pluginId);
      if (categorySet.size === 0) {
        this.categories.delete(category);
      }
    }
  }

  /**
   * 添加标签索引
   */
  private addToTag(pluginId: string, tag: string): void {
    if (!this.tags.has(tag)) {
      this.tags.set(tag, new Set());
    }
    this.tags.get(tag)!.add(pluginId);
  }

  /**
   * 移除标签索引
   */
  private removeFromTag(tag: string, pluginId: string): void {
    const tagSet = this.tags.get(tag);
    if (tagSet) {
      tagSet.delete(pluginId);
      if (tagSet.size === 0) {
        this.tags.delete(tag);
      }
    }
  }

  /**
   * 清理资源
   */
  async cleanup(): Promise<void> {
    for (const [id, entry] of this.plugins) {
      try {
        await entry.plugin.cleanup?.();
      } catch (error) {
        console.warn(`插件 ${id} 清理失败:`, error);
      }
    }

    this.plugins.clear();
    this.categories.clear();
    this.tags.clear();
  }
}
