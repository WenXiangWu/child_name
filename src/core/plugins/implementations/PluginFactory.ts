/**
 * 统一插件工厂 - 6层架构版本
 * 管理所有18个插件的创建和注册
 */

import { NamingPlugin, PluginFactory, PluginConfig, CertaintyLevel } from '../interfaces/NamingPlugin';

// 导入各层类型定义
import { Layer1PluginType } from './layer1';
import { Layer2PluginType } from './layer2';
import { Layer3PluginType } from './layer3';
import { Layer4PluginType } from './layer4';
import { Layer5PluginType } from './layer5';
import { Layer6PluginType } from './layer6';

// 插件ID类型定义（用于运行时）
export type PluginId = 
  | 'surname' | 'gender' | 'birth-time'  // Layer 1
  | 'bazi' | 'zodiac' | 'xiyongshen'     // Layer 2
  | 'wuxing-selection' | 'zodiac-selection' | 'meaning-selection' | 'stroke-selection' | 'phonetic-selection'  // Layer 3
  | 'character-filter'  // Layer 4
  | 'name-combination'  // Layer 5
  | 'sancai-scoring' | 'phonetic-scoring' | 'wuxing-balance-scoring' | 'dayan-scoring' | 'comprehensive-scoring';  // Layer 6

// 插件类名类型定义（用于类型检查）
export type PluginType = 
  | Layer1PluginType 
  | Layer2PluginType 
  | Layer3PluginType 
  | Layer4PluginType 
  | Layer5PluginType 
  | Layer6PluginType;

// 统一插件标识符类型（支持两种命名方式）
export type PluginIdentifier = PluginId | PluginType;

// Layer 1 导入 (3个插件)
import { SurnamePlugin, GenderPlugin, BirthTimePlugin } from './layer1';

// Layer 2 导入 (3个插件)  
import { BaZiPlugin, XiYongShenPlugin, ZodiacPlugin } from './layer2';

// Layer 3 导入 (5个插件)
import { 
  WuxingSelectionPlugin, 
  ZodiacSelectionPlugin, 
  MeaningSelectionPlugin, 
  StrokeSelectionPlugin, 
  PhoneticSelectionPlugin 
} from './layer3';

// Layer 4 导入 (1个插件)
import { CharacterFilterPlugin } from './layer4';

// Layer 5 导入 (1个插件)
import { NameCombinationPlugin } from './layer5';
import { SimpleNamePlugin } from './layer5/SimpleNamePlugin';

// Layer 6 导入 (5个插件)
import { 
  SancaiScoringPlugin, 
  PhoneticScoringPlugin, 
  WuxingBalanceScoringPlugin, 
  DayanScoringPlugin, 
  ComprehensiveScoringPlugin 
} from './layer6';

export class QimingPluginFactory implements PluginFactory {
  private static instance: QimingPluginFactory;
  private pluginConstructors: Map<string, new () => NamingPlugin>;

  private constructor() {
    this.pluginConstructors = new Map();
    this.registerAllPlugins();
  }

  static getInstance(): QimingPluginFactory {
    if (!QimingPluginFactory.instance) {
      QimingPluginFactory.instance = new QimingPluginFactory();
    }
    return QimingPluginFactory.instance;
  }

  private registerAllPlugins(): void {
    // Layer 1: 基础信息层 (3个插件)
    this.pluginConstructors.set('surname', SurnamePlugin);
    this.pluginConstructors.set('gender', GenderPlugin);
    this.pluginConstructors.set('birth-time', BirthTimePlugin);

    // Layer 2: 命理分析层 (3个插件)
    this.pluginConstructors.set('bazi', BaZiPlugin);
    this.pluginConstructors.set('xiyongshen', XiYongShenPlugin);
    this.pluginConstructors.set('zodiac', ZodiacPlugin);

    // Layer 3: 选字策略层 (5个插件)
    this.pluginConstructors.set('wuxing-selection', WuxingSelectionPlugin);
    this.pluginConstructors.set('zodiac-selection', ZodiacSelectionPlugin);
    this.pluginConstructors.set('meaning-selection', MeaningSelectionPlugin);
    this.pluginConstructors.set('stroke-selection', StrokeSelectionPlugin);
    this.pluginConstructors.set('phonetic-selection', PhoneticSelectionPlugin);

    // Layer 4: 字符筛选层 (1个插件)
    this.pluginConstructors.set('character-filter', CharacterFilterPlugin);

    // Layer 5: 名字生成层 (1个插件)
    this.pluginConstructors.set('name-combination', NameCombinationPlugin);
    this.pluginConstructors.set('simple-name', SimpleNamePlugin);

    // Layer 6: 名字评分层 (5个插件)
    this.pluginConstructors.set('sancai-scoring', SancaiScoringPlugin);
    this.pluginConstructors.set('phonetic-scoring', PhoneticScoringPlugin);
    this.pluginConstructors.set('wuxing-balance-scoring', WuxingBalanceScoringPlugin);
    this.pluginConstructors.set('dayan-scoring', DayanScoringPlugin);
    this.pluginConstructors.set('comprehensive-scoring', ComprehensiveScoringPlugin);
  }

  createPlugin(id: string, config?: PluginConfig): NamingPlugin {
    const PluginConstructor = this.pluginConstructors.get(id);
    if (!PluginConstructor) {
      throw new Error(`未知的插件ID: ${id}`);
    }
    return new PluginConstructor();
  }

  getAvailablePlugins(): string[] {
    return Array.from(this.pluginConstructors.keys());
  }

  getPluginsByLayer(layer: number): string[] {
    const plugins = Array.from(this.pluginConstructors.entries());
    return plugins
      .filter(([, PluginConstructor]) => {
        const instance = new PluginConstructor();
        return instance.layer === layer;
      })
      .map(([id]) => id);
  }

  /**
   * 根据确定性等级获取应启用的插件列表
   * 对应文档定义的确定性等级管理
   */
  getEnabledPluginsByCertaintyLevel(certaintyLevel: CertaintyLevel): string[] {
    const layerPlugins = {
      1: this.getPluginsByLayer(1), // 3个
      2: this.getPluginsByLayer(2), // 3个
      3: this.getPluginsByLayer(3), // 5个
      4: this.getPluginsByLayer(4), // 1个
      5: this.getPluginsByLayer(5), // 1个
      6: this.getPluginsByLayer(6)  // 5个
    };
    
    switch (certaintyLevel) {
      case CertaintyLevel.FULLY_DETERMINED:
        // Level 1: 启用全部18个插件
        return [...layerPlugins[1], ...layerPlugins[2], ...layerPlugins[3], 
                ...layerPlugins[4], ...layerPlugins[5], ...layerPlugins[6]];
      
      case CertaintyLevel.PARTIALLY_DETERMINED:
        // Level 2: 启用13个插件 (跳过部分Layer 3可选插件)
        return [...layerPlugins[1], ...layerPlugins[2], 
                ...layerPlugins[3].slice(0, 3), // 只启用前3个策略插件
                ...layerPlugins[4], ...layerPlugins[5], 
                ...layerPlugins[6].slice(0, 3)]; // 只启用前3个评分插件
      
      case CertaintyLevel.ESTIMATED:
        // Level 3: 启用9个插件 (保守模式)
        return [...layerPlugins[1], ...layerPlugins[2].slice(0, 1), // 只用基础八字
                ...layerPlugins[3].slice(0, 2), // 只用核心策略
                ...layerPlugins[4], ...layerPlugins[5],
                ...layerPlugins[6].slice(0, 1)]; // 只用综合评分
      
      case CertaintyLevel.UNKNOWN:
        // Level 4: 启用6个插件 (基础模式)
        return [...layerPlugins[1].slice(0, 2), // 姓氏+性别
                ...layerPlugins[3].slice(0, 1), // 基础策略
                ...layerPlugins[4], ...layerPlugins[5],
                ...layerPlugins[6].slice(-1)]; // 综合评分
      
      default:
        return this.getBasicPlugins();
    }
  }

  private getBasicPlugins(): string[] {
    return ['surname', 'gender', 'stroke-selection', 'character-filter', 'name-combination', 'comprehensive-scoring'];
  }

  /**
   * 获取插件统计信息
   */
  getPluginStatistics() {
    const stats = {
      totalPlugins: this.pluginConstructors.size,
      byLayer: {} as Record<number, number>
    };
    
    for (let layer = 1; layer <= 6; layer++) {
      stats.byLayer[layer] = this.getPluginsByLayer(layer).length;
    }
    
    return stats;
  }
}

// 导出单例实例
export const pluginFactory = QimingPluginFactory.getInstance();
