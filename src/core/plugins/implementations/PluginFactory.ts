/**
 * 插件工厂 - 负责创建和管理插件实例
 */

import { NamingPlugin } from '../interfaces/NamingPlugin';
import { SurnamePlugin } from './layer1/SurnamePlugin';
import { GenderPlugin } from './layer1/GenderPlugin';
import { BirthTimePlugin } from './layer1/BirthTimePlugin';
import { FamilyTraditionPlugin } from '../examples/FamilyTraditionPlugin';
import { BaZiPlugin } from './layer2/BaZiPlugin';
import { ZodiacPlugin } from './layer2/ZodiacPlugin';
import { XiYongShenPlugin } from './layer2/XiYongShenPlugin';
import { 
  StrokePlugin, 
  WuxingCharPlugin, 
  ZodiacCharPlugin, 
  MeaningPlugin, 
  PhoneticPlugin 
} from './layer3/index';
import {
  SancaiPlugin,
  YijingPlugin,
  DayanPlugin,
  WuxingBalancePlugin
} from './layer4/index';

export type PluginType = 
  | 'surname'
  | 'gender' 
  | 'birth-time'
  | 'family-tradition'
  | 'bazi'
  | 'zodiac'
  | 'xiyongshen'
  | 'stroke'
  | 'wuxing-char'
  | 'zodiac-char'
  | 'meaning'
  | 'phonetic'
  | 'sancai'
  | 'yijing'
  | 'dayan'
  | 'wuxing-balance';

export class PluginFactory {
  private static pluginClasses: Record<PluginType, new () => NamingPlugin> = {
    'surname': SurnamePlugin,
    'gender': GenderPlugin,
    'birth-time': BirthTimePlugin,
    'family-tradition': FamilyTraditionPlugin,
    'bazi': BaZiPlugin,
    'zodiac': ZodiacPlugin,
    'xiyongshen': XiYongShenPlugin,
    'stroke': StrokePlugin,
    'wuxing-char': WuxingCharPlugin,
    'zodiac-char': ZodiacCharPlugin,
    'meaning': MeaningPlugin,
    'phonetic': PhoneticPlugin,
    'sancai': SancaiPlugin,
    'yijing': YijingPlugin,
    'dayan': DayanPlugin,
    'wuxing-balance': WuxingBalancePlugin
  };

  /**
   * 创建插件实例
   */
  static createPlugin(pluginType: PluginType): NamingPlugin {
    const PluginClass = this.pluginClasses[pluginType];
    if (!PluginClass) {
      throw new Error(`Unknown plugin type: ${pluginType}`);
    }
    return new PluginClass();
  }

  /**
   * 获取所有可用的插件类型
   */
  static getAvailablePlugins(): PluginType[] {
    return Object.keys(this.pluginClasses) as PluginType[];
  }

  /**
   * 检查插件类型是否存在
   */
  static hasPlugin(pluginType: string): pluginType is PluginType {
    return pluginType in this.pluginClasses;
  }

  /**
   * 批量创建插件
   */
  static createMultiplePlugins(pluginTypes: PluginType[]): NamingPlugin[] {
    return pluginTypes.map(type => this.createPlugin(type));
  }

  /**
   * 按层级创建插件
   */
  static createPluginsByLayer(layer: number): NamingPlugin[] {
    const layerPlugins: Record<number, PluginType[]> = {
      1: ['surname', 'gender', 'birth-time', 'family-tradition'],
      2: ['bazi', 'zodiac', 'xiyongshen'],
      3: ['stroke', 'wuxing-char', 'zodiac-char', 'meaning', 'phonetic'],
      4: ['sancai', 'yijing', 'dayan', 'wuxing-balance']
    };

    const pluginTypes = layerPlugins[layer] || [];
    return this.createMultiplePlugins(pluginTypes);
  }

  /**
   * 获取插件层级信息
   */
  static getLayerInfo(): Record<number, { plugins: PluginType[], description: string }> {
    return {
      1: {
        plugins: ['surname', 'gender', 'birth-time', 'family-tradition'],
        description: '基础信息层 - 处理姓氏、性别、出生时间等基础信息'
      },
      2: {
        plugins: ['bazi', 'zodiac', 'xiyongshen'],
        description: '命理基础层 - 处理八字、生肖、五行喜用神等传统命理要素'
      },
      3: {
        plugins: ['stroke', 'wuxing-char', 'zodiac-char', 'meaning', 'phonetic'],
        description: '字符评估层 - 分析字符的笔画、五行、生肖适宜性、寓意、音韵等'
      },
      4: {
        plugins: [],
        description: '组合计算层 - 进行三才五格、周易卦象、综合评分等高级计算'
      }
    };
  }

  /**
   * 根据确定性等级获取推荐插件
   */
  static getRecommendedPlugins(certaintyLevel: number): PluginType[] {
    switch (certaintyLevel) {
      case 1: // 完全确定
        return [
          'surname', 'gender', 'birth-time',
          'bazi', 'zodiac', 'xiyongshen',
          'stroke', 'wuxing-char', 'zodiac-char', 'meaning', 'phonetic'
        ];
      case 2: // 部分确定
        return [
          'surname', 'gender', 'birth-time',
          'zodiac', 'xiyongshen',
          'stroke', 'wuxing-char', 'zodiac-char', 'meaning', 'phonetic'
        ];
      case 3: // 预估阶段
        return [
          'surname', 'gender', 'birth-time',
          'zodiac', 'stroke', 'meaning', 'phonetic'
        ];
      case 4: // 完全未知
        return ['surname', 'gender', 'stroke', 'meaning', 'phonetic'];
      default:
        return ['surname', 'gender', 'stroke', 'meaning'];
    }
  }
}