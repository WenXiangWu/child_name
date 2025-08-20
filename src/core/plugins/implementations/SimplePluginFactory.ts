/**
 * 简化插件工厂
 * 仅包含已实现的核心插件，用于测试6层架构
 */

import { NamingPlugin } from '../interfaces/NamingPlugin';

// 已实现的插件
import { SurnamePlugin } from './layer1/SurnamePlugin';
import { GenderPlugin } from './layer1/GenderPlugin';
import { BirthTimePlugin } from './layer1/BirthTimePlugin';
import { XiYongShenPlugin } from './layer2/XiYongShenPlugin';
import { CharacterFilterPlugin } from './layer4/CharacterFilterPlugin';
import { ComprehensiveScoringPlugin } from './layer6/ComprehensiveScoringPlugin';

export class SimplePluginFactory {
  private static instance: SimplePluginFactory;
  private pluginConstructors: Map<string, new () => NamingPlugin> = new Map();

  private constructor() {
    this.registerCorePlugins();
  }

  static getInstance(): SimplePluginFactory {
    if (!SimplePluginFactory.instance) {
      SimplePluginFactory.instance = new SimplePluginFactory();
    }
    return SimplePluginFactory.instance;
  }

  /**
   * 注册核心插件
   */
  private registerCorePlugins() {
    // Layer 1: 基础信息层
    this.pluginConstructors.set('surname', SurnamePlugin);
    this.pluginConstructors.set('gender', GenderPlugin);
    this.pluginConstructors.set('birth-time', BirthTimePlugin);
    
    // Layer 2: 命理分析层
    this.pluginConstructors.set('xiyongshen', XiYongShenPlugin);
    
    // Layer 4: 字符筛选层
    this.pluginConstructors.set('character-filter', CharacterFilterPlugin);
    
    // Layer 6: 名字评分层
    this.pluginConstructors.set('comprehensive-scoring', ComprehensiveScoringPlugin);
  }

  /**
   * 创建插件实例
   */
  createPlugin(pluginId: string): NamingPlugin | null {
    const PluginConstructor = this.pluginConstructors.get(pluginId);
    if (!PluginConstructor) {
      console.warn(`插件未注册: ${pluginId}`);
      return null;
    }

    try {
      return new PluginConstructor();
    } catch (error) {
      console.error(`创建插件失败 ${pluginId}:`, error);
      return null;
    }
  }

  /**
   * 获取所有已注册的插件ID
   */
  getRegisteredPluginIds(): string[] {
    return Array.from(this.pluginConstructors.keys());
  }

  /**
   * 检查插件是否已注册
   */
  isPluginRegistered(pluginId: string): boolean {
    return this.pluginConstructors.has(pluginId);
  }

  /**
   * 按层级获取插件ID
   */
  getPluginsByLayer(layer: number): string[] {
    const layerPlugins: Record<number, string[]> = {
      1: ['surname', 'gender', 'birth-time'],
      2: ['xiyongshen'],
      4: ['character-filter'],
      6: ['comprehensive-scoring']
    };
    
    return layerPlugins[layer] || [];
  }
}
