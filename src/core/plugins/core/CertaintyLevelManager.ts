/**
 * 确定性等级管理器 - 管理不同确定性等级下的插件配置和执行策略
 */

import { CertaintyLevel } from '../interfaces/NamingPlugin';
import { PluginContainer } from './PluginContainer';

// 等级配置
export interface LevelConfig {
  enabledPlugins: string[];
  processingStrategy: 'full-analysis' | 'simplified-bazi' | 'conservative-estimation' | 'traditional-analysis';
  confidenceThreshold: number;
  fallbackStrategy: 'none' | 'probabilistic' | 'generic-balance' | 'classic-numerology';
  timeout: number;
  parallelExecution: boolean;
  skipOptionalFailures: boolean;
}

// 切换结果
export interface SwitchResult {
  success: boolean;
  fromLevel: CertaintyLevel;
  toLevel: CertaintyLevel;
  switchedPlugins?: {
    enabled: string[];
    disabled: string[];
  };
  newStrategy?: string;
  reason?: string;
  details?: string[];
}

// 数据兼容性检查结果
export interface CompatibilityCheck {
  compatible: boolean;
  issues: string[];
  requiredData: string[];
  missingData: string[];
  adaptations: Record<string, string>;
}

// 处理策略
export interface ProcessingStrategy {
  level: CertaintyLevel;
  strategy: string;
  adaptations: {
    zodiac?: string;
    bazi?: string;
    wuxing?: string;
  };
  confidence: number;
}

// 预产期信息
export interface PredueInfo {
  year: number;
  month: number;
  weekOffset?: number;
}

// 预产期分析结果
export interface PredueAnalysis {
  type: 'cross-zodiac' | 'single-zodiac';
  scenarios?: Array<{
    zodiac: string;
    probability: number;
    strategy: string;
  }>;
  recommendation: {
    primary: string;
    fallback?: string;
    strategy: string;
  };
  confidence: number;
}

export class CertaintyLevelManager {
  private levelConfigs: Map<CertaintyLevel, LevelConfig> = new Map();
  private currentLevel: CertaintyLevel = CertaintyLevel.FULLY_DETERMINED;

  constructor(private container: PluginContainer) {
    this.initializeLevelConfigs();
  }

  /**
   * 初始化等级配置
   */
  private initializeLevelConfigs(): void {
    // Level 1: 完全确定 - 所有16个插件
    this.levelConfigs.set(CertaintyLevel.FULLY_DETERMINED, {
      enabledPlugins: [
        'surname', 'gender', 'birth-time',
        'bazi', 'zodiac', 'xiyongshen',
        'stroke', 'wuxing-char', 'zodiac-char', 'meaning', 'phonetic',
        'sancai', 'yijing', 'dayan', 'wuxing-balance'
      ],
      processingStrategy: 'full-analysis',
      confidenceThreshold: 0.9,
      fallbackStrategy: 'none',
      timeout: 10000,
      parallelExecution: true,
      skipOptionalFailures: false
    });

    // Level 2: 部分确定 - 13个插件（去掉具体时辰相关）
    this.levelConfigs.set(CertaintyLevel.PARTIALLY_DETERMINED, {
      enabledPlugins: [
        'surname', 'gender', 'birth-time',
        'bazi', 'zodiac', 'xiyongshen',
        'stroke', 'wuxing-char', 'zodiac-char', 'meaning', 'phonetic',
        'sancai', 'dayan', 'wuxing-balance'
      ],
      processingStrategy: 'simplified-bazi',
      confidenceThreshold: 0.8,
      fallbackStrategy: 'probabilistic',
      timeout: 8000,
      parallelExecution: true,
      skipOptionalFailures: true
    });

    // Level 3: 预估阶段 - 9个核心插件
    this.levelConfigs.set(CertaintyLevel.ESTIMATED, {
      enabledPlugins: [
        'surname', 'gender', 'birth-time',
        'zodiac', 'stroke', 'meaning', 'phonetic', 'sancai', 'dayan'
      ],
      processingStrategy: 'conservative-estimation',
      confidenceThreshold: 0.6,
      fallbackStrategy: 'generic-balance',
      timeout: 6000,
      parallelExecution: false,
      skipOptionalFailures: true
    });

    // Level 4: 完全未知 - 6个基础插件
    this.levelConfigs.set(CertaintyLevel.UNKNOWN, {
      enabledPlugins: [
        'surname', 'gender', 'stroke', 'meaning', 'phonetic', 'sancai'
      ],
      processingStrategy: 'traditional-analysis',
      confidenceThreshold: 0.5,
      fallbackStrategy: 'classic-numerology',
      timeout: 5000,
      parallelExecution: false,
      skipOptionalFailures: true
    });
  }

  /**
   * 获取当前等级
   */
  getCurrentLevel(): CertaintyLevel {
    return this.currentLevel;
  }

  /**
   * 获取等级配置
   */
  getLevelConfig(level: CertaintyLevel): LevelConfig {
    const config = this.levelConfigs.get(level);
    if (!config) {
      throw new Error(`Unknown certainty level: ${level}`);
    }
    return { ...config }; // 返回副本
  }

  /**
   * 获取启用的插件
   */
  getEnabledPlugins(level: CertaintyLevel): string[] {
    const config = this.getLevelConfig(level);
    return config.enabledPlugins.filter(pluginId => 
      this.container.isPluginAvailable(pluginId)
    );
  }

  /**
   * 切换确定性等级
   */
  async switchLevel(
    targetLevel: CertaintyLevel,
    context?: any
  ): Promise<SwitchResult> {
    const fromLevel = this.currentLevel;
    
    if (fromLevel === targetLevel) {
      return {
        success: true,
        fromLevel,
        toLevel: targetLevel,
        reason: 'Already at target level'
      };
    }

    try {
      const currentConfig = this.getLevelConfig(fromLevel);
      const targetConfig = this.getLevelConfig(targetLevel);

      // 分析需要启用/禁用的插件
      const toEnable = targetConfig.enabledPlugins.filter(
        id => !currentConfig.enabledPlugins.includes(id)
      );
      const toDisable = currentConfig.enabledPlugins.filter(
        id => !targetConfig.enabledPlugins.includes(id)
      );

      // 检查数据兼容性
      const compatibility = await this.checkDataCompatibility(
        fromLevel, 
        targetLevel, 
        context
      );

      if (!compatibility.compatible) {
        return {
          success: false,
          fromLevel,
          toLevel: targetLevel,
          reason: 'DATA_INCOMPATIBLE',
          details: compatibility.issues
        };
      }

      // 执行切换
      await this.performLevelSwitch(toEnable, toDisable);

      // 更新当前等级
      this.currentLevel = targetLevel;

      return {
        success: true,
        fromLevel,
        toLevel: targetLevel,
        switchedPlugins: { enabled: toEnable, disabled: toDisable },
        newStrategy: targetConfig.processingStrategy
      };

    } catch (error) {
      // 回滚到原始状态
      await this.rollbackSwitch(fromLevel);
      
      return {
        success: false,
        fromLevel,
        toLevel: targetLevel,
        reason: 'SWITCH_FAILED',
        details: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  /**
   * 检查数据兼容性
   */
  private async checkDataCompatibility(
    fromLevel: CertaintyLevel,
    toLevel: CertaintyLevel,
    context: any
  ): Promise<CompatibilityCheck> {
    const issues: string[] = [];
    const requiredData: string[] = [];
    const missingData: string[] = [];
    const adaptations: Record<string, string> = {};

    const fromConfig = this.getLevelConfig(fromLevel);
    const toConfig = this.getLevelConfig(toLevel);

    // 检查从高等级向低等级切换
    if (this.getLevelPriority(fromLevel) > this.getLevelPriority(toLevel)) {
      // 降级：检查是否会丢失重要数据
      const droppedPlugins = fromConfig.enabledPlugins.filter(
        id => !toConfig.enabledPlugins.includes(id)
      );

      if (droppedPlugins.includes('bazi') || droppedPlugins.includes('xiyongshen')) {
        issues.push('降级将丢失八字和喜用神分析结果');
        adaptations['wuxing'] = 'switch-to-generic-balance';
      }

      if (droppedPlugins.includes('yijing')) {
        issues.push('降级将丢失周易卦象分析');
      }
    }

    // 检查从低等级向高等级切换
    if (this.getLevelPriority(fromLevel) < this.getLevelPriority(toLevel)) {
      // 升级：检查是否有足够的数据支持
      const newPlugins = toConfig.enabledPlugins.filter(
        id => !fromConfig.enabledPlugins.includes(id)
      );

      if (newPlugins.includes('bazi') && !context?.birthInfo?.hour) {
        missingData.push('具体出生时辰信息');
        requiredData.push('birthInfo.hour');
      }

      if (newPlugins.includes('yijing') && !context?.sancaiResults) {
        missingData.push('三才五格计算结果');
        requiredData.push('sancai');
      }
    }

    return {
      compatible: issues.length === 0 && missingData.length === 0,
      issues,
      requiredData,
      missingData,
      adaptations
    };
  }

  /**
   * 执行等级切换
   */
  private async performLevelSwitch(
    toEnable: string[],
    toDisable: string[]
  ): Promise<void> {
    // 禁用不需要的插件
    for (const pluginId of toDisable) {
      try {
        await this.container.deactivatePlugin(pluginId);
      } catch (error) {
        console.warn(`Failed to deactivate plugin ${pluginId}:`, error);
      }
    }

    // 启用新插件
    for (const pluginId of toEnable) {
      try {
        await this.container.activatePlugin(pluginId);
      } catch (error) {
        console.warn(`Failed to activate plugin ${pluginId}:`, error);
      }
    }
  }

  /**
   * 回滚切换
   */
  private async rollbackSwitch(originalLevel: CertaintyLevel): Promise<void> {
    try {
      const originalConfig = this.getLevelConfig(originalLevel);
      
      // 重新激活原有插件
      for (const pluginId of originalConfig.enabledPlugins) {
        if (this.container.getPlugin(pluginId)) {
          await this.container.activatePlugin(pluginId);
        }
      }
      
      this.currentLevel = originalLevel;
    } catch (error) {
      console.error('Failed to rollback level switch:', error);
    }
  }

  /**
   * 处理预产期场景
   */
  async handlePredueDate(predueInfo: PredueInfo): Promise<ProcessingStrategy> {
    const { year, month, weekOffset = 2 } = predueInfo;

    // 分析风险因素
    const riskFactors = this.analyzePredueRisks(year, month, weekOffset);

    if (riskFactors.crossesNewYear) {
      // 跨年情况：更保守的策略
      return {
        level: CertaintyLevel.ESTIMATED,
        strategy: 'dual-zodiac-conservative',
        adaptations: {
          zodiac: 'dual-analysis',
          bazi: 'probabilistic',
          wuxing: 'generic-balance'
        },
        confidence: 0.6
      };
    } else {
      // 不跨年：正常预估策略
      return {
        level: CertaintyLevel.ESTIMATED,
        strategy: 'single-zodiac-estimation',
        adaptations: {
          zodiac: 'estimated-with-fallback',
          bazi: 'month-based',
          wuxing: 'conservative-balance'
        },
        confidence: 0.75
      };
    }
  }

  /**
   * 分析预产期风险
   */
  private analyzePredueRisks(
    year: number,
    month: number,
    weekOffset: number
  ): { crossesNewYear: boolean; riskLevel: 'low' | 'medium' | 'high' } {
    // 检查是否跨越生肖年（简化：假设生肖年在2月初）
    const crossesNewYear = (month === 12 && weekOffset >= 2) || 
                          (month === 1 && weekOffset >= 2) ||
                          (month === 2 && weekOffset >= 1);

    // 评估风险等级
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (crossesNewYear) {
      riskLevel = 'high';
    } else if (weekOffset > 2) {
      riskLevel = 'medium';
    }

    return { crossesNewYear, riskLevel };
  }

  /**
   * 获取等级优先级
   */
  private getLevelPriority(level: CertaintyLevel): number {
    const priorities = {
      [CertaintyLevel.FULLY_DETERMINED]: 4,
      [CertaintyLevel.PARTIALLY_DETERMINED]: 3,
      [CertaintyLevel.ESTIMATED]: 2,
      [CertaintyLevel.UNKNOWN]: 1
    };
    return priorities[level];
  }

  /**
   * 自动选择确定性等级
   */
  async autoSelectLevel(inputData: any): Promise<{
    recommendedLevel: CertaintyLevel;
    reason: string;
    confidence: number;
  }> {
    let score = 0;
    const reasons: string[] = [];

    // 评估出生信息完整性
    if (inputData.birthInfo) {
      if (inputData.birthInfo.hour !== undefined && inputData.birthInfo.minute !== undefined) {
        score += 40;
        reasons.push('具有完整的出生时间信息');
      } else if (inputData.birthInfo.day !== undefined) {
        score += 30;
        reasons.push('具有出生日期信息');
      } else {
        score += 20;
        reasons.push('仅有年月信息');
      }
    } else if (inputData.predueDate) {
      score += 15;
      reasons.push('基于预产期预估');
    } else {
      score += 5;
      reasons.push('缺少时间信息');
    }

    // 评估基础信息完整性
    if (inputData.familyName && inputData.gender) {
      score += 20;
      reasons.push('基础信息完整');
    } else {
      score -= 10;
      reasons.push('基础信息不完整');
    }

    // 评估额外信息
    if (inputData.familyTradition) {
      score += 10;
      reasons.push('有家族传统信息');
    }

    if (inputData.characters) {
      score += 10;
      reasons.push('已有候选字符');
    }

    // 确定等级
    let recommendedLevel: CertaintyLevel;
    let confidence: number;

    if (score >= 70) {
      recommendedLevel = CertaintyLevel.FULLY_DETERMINED;
      confidence = 0.9;
    } else if (score >= 50) {
      recommendedLevel = CertaintyLevel.PARTIALLY_DETERMINED;
      confidence = 0.8;
    } else if (score >= 30) {
      recommendedLevel = CertaintyLevel.ESTIMATED;
      confidence = 0.6;
    } else {
      recommendedLevel = CertaintyLevel.UNKNOWN;
      confidence = 0.4;
    }

    return {
      recommendedLevel,
      reason: reasons.join('；'),
      confidence
    };
  }

  /**
   * 获取等级统计信息
   */
  getLevelStatistics(): {
    currentLevel: CertaintyLevel;
    availablePlugins: Record<CertaintyLevel, number>;
    activePlugins: number;
    levelConfigs: Record<CertaintyLevel, LevelConfig>;
  } {
    const availablePlugins: Record<CertaintyLevel, number> = {} as any;
    const levelConfigs: Record<CertaintyLevel, LevelConfig> = {} as any;

    for (const level of Object.values(CertaintyLevel).filter(v => typeof v === 'number') as CertaintyLevel[]) {
      const config = this.getLevelConfig(level);
      availablePlugins[level] = config.enabledPlugins.filter(id => 
        this.container.isPluginAvailable(id)
      ).length;
      levelConfigs[level] = config;
    }

    const currentConfig = this.getLevelConfig(this.currentLevel);
    const activePlugins = currentConfig.enabledPlugins.filter(id => 
      this.container.isPluginAvailable(id)
    ).length;

    return {
      currentLevel: this.currentLevel,
      availablePlugins,
      activePlugins,
      levelConfigs
    };
  }

  /**
   * 更新等级配置
   */
  updateLevelConfig(level: CertaintyLevel, updates: Partial<LevelConfig>): void {
    const currentConfig = this.getLevelConfig(level);
    const newConfig = { ...currentConfig, ...updates };
    this.levelConfigs.set(level, newConfig);
  }

  /**
   * 验证等级切换可行性
   */
  validateLevelSwitch(
    fromLevel: CertaintyLevel,
    toLevel: CertaintyLevel
  ): {
    feasible: boolean;
    warnings: string[];
    requirements: string[];
  } {
    const warnings: string[] = [];
    const requirements: string[] = [];

    const fromConfig = this.getLevelConfig(fromLevel);
    const toConfig = this.getLevelConfig(toLevel);

    // 检查插件可用性
    const missingPlugins = toConfig.enabledPlugins.filter(id => 
      !this.container.isPluginAvailable(id)
    );

    if (missingPlugins.length > 0) {
      warnings.push(`目标等级需要的插件不可用: ${missingPlugins.join(', ')}`);
    }

    // 检查升级要求
    if (this.getLevelPriority(toLevel) > this.getLevelPriority(fromLevel)) {
      requirements.push('可能需要额外的输入数据');
      if (toConfig.enabledPlugins.includes('bazi')) {
        requirements.push('需要准确的出生时间信息');
      }
    }

    // 检查降级影响
    if (this.getLevelPriority(toLevel) < this.getLevelPriority(fromLevel)) {
      warnings.push('降级可能会丢失分析精度');
    }

    return {
      feasible: missingPlugins.length === 0,
      warnings,
      requirements
    };
  }
}