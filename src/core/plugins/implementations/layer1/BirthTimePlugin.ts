/**
 * 出生时间插件 - Layer 1
 * 处理出生时间信息，支持确定时间和预产期两种模式
 */

import { 
  NamingPlugin, 
  StandardInput, 
  PluginOutput, 
  PluginContext, 
  ValidationResult,
  PluginMetadata,
  PluginDependency,
  CertaintyLevel,
  PluginConfig
} from '../../interfaces/NamingPlugin';

interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
}

interface PredueDate {
  year: number;
  month: number;
  weekOffset?: number; // 预产期前后偏差周数，默认2周
}

export class BirthTimePlugin implements NamingPlugin {
  readonly id = 'birth-time';
  readonly version = '1.0.0';
  readonly layer = 1;
  readonly dependencies: PluginDependency[] = [];
  readonly metadata: PluginMetadata = {
    name: '出生时间分析插件',
    description: '分析出生时间信息，支持确定时间和预产期模式，提供时间相关的基础数据',
    author: 'System',
    category: 'input',
    tags: ['time', 'birth', 'predue', 'lunar', 'basic']
  };

  private config: PluginConfig | null = null;

  /**
   * 初始化插件
   */
  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    this.config = config;
    context.log('info', `出生时间插件初始化完成, 版本: ${this.version}`);
  }

  /**
   * 处理输入数据
   */
  async process(input: StandardInput): Promise<PluginOutput> {
    const startTime = Date.now();
    const { data } = input;
    
    // 判断处理模式
    if (data.birthInfo && data.birthInfo.day !== undefined) {
      return this.processExactTime(data.birthInfo as BirthInfo, startTime);
    } else if (data.predueDate) {
      return this.processPredueDate(data.predueDate, startTime);
    } else {
      throw new Error('缺少出生时间信息或预产期信息');
    }
  }

  /**
   * 处理确定的出生时间
   */
  private async processExactTime(birthInfo: BirthInfo, startTime: number): Promise<PluginOutput> {
    const analysis = this.analyzeExactTime(birthInfo);
    
    return {
      pluginId: this.id,
      results: {
        timeInfo: {
          type: 'exact',
          year: birthInfo.year,
          month: birthInfo.month,
          day: birthInfo.day,
          hour: birthInfo.hour,
          minute: birthInfo.minute,
          confidence: 1.0
        },
        lunarInfo: analysis.lunarInfo,
        zodiacInfo: analysis.zodiacInfo,
        seasonInfo: analysis.seasonInfo,
        timeCharacteristics: analysis.timeCharacteristics,
        recommendations: {
          strategy: 'precise',
          certaintyLevel: CertaintyLevel.FULLY_DETERMINED,
          useBaziCalculation: true,
          useHourAnalysis: !!birthInfo.hour
        }
      },
      confidence: 1.0,
      metadata: {
        processingTime: Date.now() - startTime,
        dataSource: 'exact-birth-time'
      }
    };
  }

  /**
   * 处理预产期模式
   */
  private async processPredueDate(predueDate: PredueDate, startTime: number): Promise<PluginOutput> {
    const analysis = this.analyzePredueDate(predueDate);
    
    return {
      pluginId: this.id,
      results: {
        timeInfo: {
          type: 'predue',
          year: predueDate.year,
          month: predueDate.month,
          weekOffset: predueDate.weekOffset || 2,
          confidence: analysis.confidence
        },
        possibleZodiacs: analysis.possibleZodiacs,
        dateRange: analysis.dateRange,
        riskFactors: analysis.riskFactors,
        recommendations: {
          strategy: analysis.crossesNewYear ? 'dual-zodiac-conservative' : 'single-zodiac-estimation',
          certaintyLevel: analysis.crossesNewYear ? CertaintyLevel.ESTIMATED : CertaintyLevel.PARTIALLY_DETERMINED,
          useBaziCalculation: false,
          useGenericWuxing: true,
          fallbackStrategies: analysis.fallbackStrategies
        }
      },
      confidence: analysis.confidence,
      metadata: {
        processingTime: Date.now() - startTime,
        dataSource: 'predue-estimation',
        strategy: analysis.crossesNewYear ? 'cross-year-analysis' : 'single-year-analysis'
      }
    };
  }

  /**
   * 验证输入数据
   */
  validate(input: StandardInput): ValidationResult {
    const { data } = input;
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查是否提供了时间信息
    if (!data.birthInfo && !data.predueDate) {
      errors.push('必须提供出生时间信息或预产期信息');
      return { valid: false, errors, warnings };
    }

    // 验证确定出生时间
    if (data.birthInfo && data.birthInfo.day !== undefined) {
      const validation = this.validateBirthInfo(data.birthInfo as BirthInfo);
      errors.push(...validation.errors);
      warnings.push(...validation.warnings);
    }

    // 验证预产期信息
    if (data.predueDate) {
      const validation = this.validatePredueDate(data.predueDate);
      errors.push(...validation.errors);
      warnings.push(...validation.warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 验证出生时间信息
   */
  private validateBirthInfo(birthInfo: BirthInfo): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const currentYear = new Date().getFullYear();

    // 验证年份
    if (!birthInfo.year || birthInfo.year < 1900 || birthInfo.year > currentYear + 1) {
      errors.push(`年份无效: ${birthInfo.year}`);
    }

    // 验证月份
    if (!birthInfo.month || birthInfo.month < 1 || birthInfo.month > 12) {
      errors.push(`月份无效: ${birthInfo.month}`);
    }

    // 验证日期
    if (!birthInfo.day || birthInfo.day < 1 || birthInfo.day > 31) {
      errors.push(`日期无效: ${birthInfo.day}`);
    }

    // 验证具体日期的合理性
    if (birthInfo.year && birthInfo.month && birthInfo.day) {
      const date = new Date(birthInfo.year, birthInfo.month - 1, birthInfo.day);
      if (date.getFullYear() !== birthInfo.year || 
          date.getMonth() !== birthInfo.month - 1 || 
          date.getDate() !== birthInfo.day) {
        errors.push('日期不存在');
      }
    }

    // 验证小时（可选）
    if (birthInfo.hour !== undefined) {
      if (birthInfo.hour < 0 || birthInfo.hour > 23) {
        errors.push(`小时无效: ${birthInfo.hour}`);
      }
    }

    // 验证分钟（可选）
    if (birthInfo.minute !== undefined) {
      if (birthInfo.minute < 0 || birthInfo.minute > 59) {
        errors.push(`分钟无效: ${birthInfo.minute}`);
      }
    }

    // 检查未来时间
    const birthDateTime = new Date(
      birthInfo.year, 
      birthInfo.month - 1, 
      birthInfo.day,
      birthInfo.hour || 0,
      birthInfo.minute || 0
    );
    
    if (birthDateTime > new Date()) {
      warnings.push('出生时间在未来，请确认时间是否正确');
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * 验证预产期信息
   */
  private validatePredueDate(predueDate: PredueDate): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const currentYear = new Date().getFullYear();

    // 验证年份
    if (!predueDate.year || predueDate.year < currentYear - 1 || predueDate.year > currentYear + 2) {
      errors.push(`预产期年份无效: ${predueDate.year}`);
    }

    // 验证月份
    if (!predueDate.month || predueDate.month < 1 || predueDate.month > 12) {
      errors.push(`预产期月份无效: ${predueDate.month}`);
    }

    // 验证周偏差
    if (predueDate.weekOffset !== undefined) {
      if (predueDate.weekOffset < 0 || predueDate.weekOffset > 8) {
        warnings.push('预产期偏差超过8周，可能不太准确');
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * 分析确定出生时间
   */
  private analyzeExactTime(birthInfo: BirthInfo) {
    const date = new Date(birthInfo.year, birthInfo.month - 1, birthInfo.day);
    
    // 农历信息（简化实现）
    const lunarInfo = {
      year: birthInfo.year,
      month: birthInfo.month,
      day: birthInfo.day,
      isLeapMonth: false, // TODO: 实现农历转换
      lunarYear: '甲子', // TODO: 实现天干地支计算
      // 这里可以集成lunar库进行更精确的农历计算
    };

    // 生肖信息
    const zodiac = this.calculateZodiac(birthInfo.year);
    const zodiacInfo = {
      animal: zodiac,
      element: this.getZodiacElement(zodiac),
      year: birthInfo.year
    };

    // 季节信息
    const seasonInfo = this.getSeasonInfo(birthInfo.month);

    // 时间特征
    const timeCharacteristics = {
      isExactTime: true,
      hasHourInfo: !!birthInfo.hour,
      season: seasonInfo.season,
      monthType: seasonInfo.monthType,
      timeQuality: 'precise'
    };

    return {
      lunarInfo,
      zodiacInfo,
      seasonInfo,
      timeCharacteristics
    };
  }

  /**
   * 分析预产期
   */
  private analyzePredueDate(predueDate: PredueDate) {
    const { year, month, weekOffset = 2 } = predueDate;
    
    // 计算可能的日期范围
    const baseDate = new Date(year, month - 1, 15); // 假设月中为预产期
    const startDate = new Date(baseDate.getTime() - weekOffset * 7 * 24 * 60 * 60 * 1000);
    const endDate = new Date(baseDate.getTime() + weekOffset * 7 * 24 * 60 * 60 * 1000);
    
    const dateRange = {
      start: {
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
        day: startDate.getDate()
      },
      end: {
        year: endDate.getFullYear(),
        month: endDate.getMonth() + 1,
        day: endDate.getDate()
      }
    };

    // 检查是否跨年
    const crossesNewYear = startDate.getFullYear() !== endDate.getFullYear();
    
    // 计算可能的生肖
    const possibleZodiacs = crossesNewYear ? 
      [this.calculateZodiac(startDate.getFullYear()), this.calculateZodiac(endDate.getFullYear())] :
      [this.calculateZodiac(year)];

    // 风险因素分析
    const riskFactors = {
      crossesNewYear,
      spanMultipleSeasons: this.checkSeasonCrossing(startDate, endDate),
      uncertaintyLevel: weekOffset > 3 ? 'high' : weekOffset > 1 ? 'medium' : 'low'
    };

    // 置信度计算
    let confidence = 0.8;
    if (crossesNewYear) confidence -= 0.2;
    if (weekOffset > 2) confidence -= 0.1;
    if (riskFactors.spanMultipleSeasons) confidence -= 0.1;

    // 备选策略
    const fallbackStrategies = [
      crossesNewYear ? 'dual-zodiac-conservative' : 'single-zodiac-optimistic',
      'generic-seasonal-analysis',
      'traditional-five-elements-balance'
    ];

    return {
      dateRange,
      possibleZodiacs,
      crossesNewYear,
      riskFactors,
      confidence: Math.max(0.3, confidence), // 最低置信度
      fallbackStrategies
    };
  }

  /**
   * 计算生肖
   */
  private calculateZodiac(year: number): string {
    const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    const baseYear = 1900; // 鼠年
    const index = (year - baseYear) % 12;
    return zodiacAnimals[index >= 0 ? index : index + 12];
  }

  /**
   * 获取生肖对应的五行
   */
  private getZodiacElement(zodiac: string): string {
    const elementMap: Record<string, string> = {
      '鼠': '水', '牛': '土', '虎': '木', '兔': '木',
      '龙': '土', '蛇': '火', '马': '火', '羊': '土',
      '猴': '金', '鸡': '金', '狗': '土', '猪': '水'
    };
    return elementMap[zodiac] || 'unknown';
  }

  /**
   * 获取季节信息
   */
  private getSeasonInfo(month: number) {
    const seasons = {
      spring: { months: [3, 4, 5], name: '春', characteristics: '生机勃勃，万物复苏' },
      summer: { months: [6, 7, 8], name: '夏', characteristics: '阳气旺盛，生长茂盛' },
      autumn: { months: [9, 10, 11], name: '秋', characteristics: '收获成熟，金气肃杀' },
      winter: { months: [12, 1, 2], name: '冬', characteristics: '蛰伏储藏，水气内敛' }
    };

    for (const [season, info] of Object.entries(seasons)) {
      if (info.months.includes(month)) {
        return {
          season,
          name: info.name,
          characteristics: info.characteristics,
          monthType: month === info.months[1] ? 'mid' : 
                    month === info.months[0] ? 'early' : 'late'
        };
      }
    }

    return { season: 'unknown', name: '未知', characteristics: '', monthType: 'unknown' };
  }

  /**
   * 检查是否跨季节
   */
  private checkSeasonCrossing(startDate: Date, endDate: Date): boolean {
    const startSeason = this.getSeasonInfo(startDate.getMonth() + 1).season;
    const endSeason = this.getSeasonInfo(endDate.getMonth() + 1).season;
    return startSeason !== endSeason;
  }

  /**
   * 销毁插件，清理资源
   */
  async destroy(): Promise<void> {
    console.log('出生时间插件销毁完成');
  }

  /**
   * 检查插件是否可用
   */
  isAvailable(): boolean {
    return true; // 此插件不依赖外部资源
  }

  /**
   * 获取插件健康状态
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    message: string;
    lastCheck: number;
  } {
    const isHealthy = this.config !== null;
    
    return {
      status: isHealthy ? 'healthy' : 'degraded',
      message: isHealthy ? '插件运行正常' : '插件未完全初始化',
      lastCheck: Date.now()
    };
  }
}
