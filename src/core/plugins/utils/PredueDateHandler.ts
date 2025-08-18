/**
 * 预产期处理器 - 专门处理预产期相关的复杂逻辑和风险评估
 */

// 预产期信息
export interface PredueInfo {
  year: number;
  month: number;
  weekOffset?: number; // 预产期前后几周的范围，默认2周
}

// 日期范围
export interface DateRange {
  startDate: Date;
  endDate: Date;
  totalDays: number;
}

// 生肖边界信息
export interface ZodiacBoundary {
  crosses: boolean;
  previousZodiac: string;
  nextZodiac: string;
  crossoverDate: Date;
  probability: {
    previous: number;
    next: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
}

// 预产期分析结果
export interface PredueAnalysis {
  type: 'cross-zodiac' | 'single-zodiac';
  scenarios: Array<{
    zodiac: string;
    probability: number;
    strategy: string;
    dateRange: DateRange;
  }>;
  recommendation: {
    primary: string;
    fallback?: string;
    strategy: 'dual-zodiac-synthesis' | 'conservative-primary' | 'adaptive-strategy';
    confidence: number;
  };
  risks: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    mitigations: string[];
  };
}

// 生肖计算结果
export interface ZodiacCalculation {
  zodiac: string;
  zodiacYear: number;
  chineseNewYear: Date;
  isLeapYear: boolean;
  confidence: number;
}

export class PredueDateHandler {
  // 生肖轮回表
  private readonly zodiacCycle = [
    '鼠', '牛', '虎', '兔', '龙', '蛇', 
    '马', '羊', '猴', '鸡', '狗', '猪'
  ];

  // 农历新年日期缓存（简化版，实际应该用准确的农历计算）
  private readonly chineseNewYearDates: Record<number, Date> = {
    2024: new Date(2024, 1, 10), // 2月10日
    2025: new Date(2025, 0, 29), // 1月29日
    2026: new Date(2026, 1, 17), // 2月17日
    2027: new Date(2027, 1, 6),  // 2月6日
    2028: new Date(2028, 0, 26), // 1月26日
    2029: new Date(2029, 1, 13), // 2月13日
    2030: new Date(2030, 1, 3),  // 2月3日
  };

  /**
   * 处理预产期信息
   */
  async processPredue(predueInfo: PredueInfo): Promise<PredueAnalysis> {
    const { year, month, weekOffset = 2 } = predueInfo;

    // 计算可能的日期范围
    const dateRange = this.calculateDateRange(year, month, weekOffset);

    // 检查是否跨越生肖年
    const zodiacBoundary = this.checkZodiacBoundary(dateRange);

    if (zodiacBoundary.crosses) {
      return this.handleCrossZodiacScenario(zodiacBoundary, dateRange);
    } else {
      return this.handleSingleZodiacScenario(dateRange);
    }
  }

  /**
   * 计算日期范围
   */
  private calculateDateRange(year: number, month: number, weekOffset: number): DateRange {
    // 计算预产期中心日期（月中）
    const centerDate = new Date(year, month - 1, 15);
    
    // 计算前后偏移的毫秒数
    const offsetMs = weekOffset * 7 * 24 * 60 * 60 * 1000;
    
    const startDate = new Date(centerDate.getTime() - offsetMs);
    const endDate = new Date(centerDate.getTime() + offsetMs);
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

    return {
      startDate,
      endDate,
      totalDays
    };
  }

  /**
   * 检查生肖边界
   */
  private checkZodiacBoundary(dateRange: DateRange): ZodiacBoundary {
    const startYear = dateRange.startDate.getFullYear();
    const endYear = dateRange.endDate.getFullYear();

    // 检查是否跨年
    if (startYear === endYear) {
      // 同一年内，检查是否跨农历新年
      const chineseNewYear = this.getChineseNewYear(startYear);
      
      if (dateRange.startDate <= chineseNewYear && dateRange.endDate >= chineseNewYear) {
        // 跨农历新年
        return this.createZodiacBoundary(
          dateRange,
          chineseNewYear,
          this.getZodiacByYear(startYear - 1),
          this.getZodiacByYear(startYear)
        );
      } else {
        // 不跨农历新年
        return {
          crosses: false,
          previousZodiac: this.getZodiacByYear(startYear),
          nextZodiac: this.getZodiacByYear(startYear),
          crossoverDate: chineseNewYear,
          probability: { previous: 1.0, next: 0.0 },
          riskLevel: 'low'
        };
      }
    } else {
      // 跨公历年，可能跨多个农历年
      const endYearNewYear = this.getChineseNewYear(endYear);
      
      return this.createZodiacBoundary(
        dateRange,
        endYearNewYear,
        this.getZodiacByYear(startYear),
        this.getZodiacByYear(endYear)
      );
    }
  }

  /**
   * 创建生肖边界信息
   */
  private createZodiacBoundary(
    dateRange: DateRange,
    crossoverDate: Date,
    previousZodiac: string,
    nextZodiac: string
  ): ZodiacBoundary {
    // 计算概率分布
    const totalDays = dateRange.totalDays;
    const daysBeforeCrossover = Math.max(0, 
      Math.ceil((crossoverDate.getTime() - dateRange.startDate.getTime()) / (24 * 60 * 60 * 1000))
    );
    const daysAfterCrossover = Math.max(0, totalDays - daysBeforeCrossover);

    const previousProbability = daysBeforeCrossover / totalDays;
    const nextProbability = daysAfterCrossover / totalDays;

    // 评估风险等级
    let riskLevel: 'low' | 'medium' | 'high';
    const balanceRatio = Math.min(previousProbability, nextProbability) / Math.max(previousProbability, nextProbability);
    
    if (balanceRatio > 0.3) {
      riskLevel = 'high'; // 两个生肖的概率都比较高
    } else if (balanceRatio > 0.1) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low'; // 主要集中在一个生肖
    }

    return {
      crosses: true,
      previousZodiac,
      nextZodiac,
      crossoverDate,
      probability: {
        previous: Math.round(previousProbability * 100) / 100,
        next: Math.round(nextProbability * 100) / 100
      },
      riskLevel
    };
  }

  /**
   * 处理跨生肖场景
   */
  private async handleCrossZodiacScenario(
    boundary: ZodiacBoundary,
    dateRange: DateRange
  ): Promise<PredueAnalysis> {
    const { previousZodiac, nextZodiac, probability, crossoverDate } = boundary;

    // 创建两个场景
    const scenarios = [
      {
        zodiac: previousZodiac,
        probability: probability.previous,
        strategy: 'conservative-previous',
        dateRange: {
          startDate: dateRange.startDate,
          endDate: new Date(Math.min(crossoverDate.getTime(), dateRange.endDate.getTime())),
          totalDays: Math.ceil((crossoverDate.getTime() - dateRange.startDate.getTime()) / (24 * 60 * 60 * 1000))
        }
      },
      {
        zodiac: nextZodiac,
        probability: probability.next,
        strategy: 'adaptive-next',
        dateRange: {
          startDate: new Date(Math.max(crossoverDate.getTime(), dateRange.startDate.getTime())),
          endDate: dateRange.endDate,
          totalDays: Math.ceil((dateRange.endDate.getTime() - crossoverDate.getTime()) / (24 * 60 * 60 * 1000))
        }
      }
    ];

    // 确定推荐策略
    const primaryZodiac = probability.previous > probability.next ? previousZodiac : nextZodiac;
    const fallbackZodiac = probability.previous > probability.next ? nextZodiac : previousZodiac;
    const confidence = Math.max(probability.previous, probability.next);

    // 生成风险分析
    const risks = this.analyzeRisks(boundary, scenarios);

    return {
      type: 'cross-zodiac',
      scenarios,
      recommendation: {
        primary: primaryZodiac,
        fallback: fallbackZodiac,
        strategy: 'dual-zodiac-synthesis',
        confidence
      },
      risks
    };
  }

  /**
   * 处理单生肖场景
   */
  private async handleSingleZodiacScenario(dateRange: DateRange): Promise<PredueAnalysis> {
    const year = dateRange.startDate.getFullYear();
    const zodiac = this.getZodiacByYear(year);

    const scenario = {
      zodiac,
      probability: 1.0,
      strategy: 'single-zodiac-standard',
      dateRange
    };

    const risks = {
      level: 'low' as const,
      factors: ['预产期在单一生肖年内'],
      mitigations: ['使用标准生肖分析策略']
    };

    return {
      type: 'single-zodiac',
      scenarios: [scenario],
      recommendation: {
        primary: zodiac,
        strategy: 'conservative-primary',
        confidence: 0.9
      },
      risks
    };
  }

  /**
   * 分析风险
   */
  private analyzeRisks(
    boundary: ZodiacBoundary,
    scenarios: any[]
  ): PredueAnalysis['risks'] {
    const factors: string[] = [];
    const mitigations: string[] = [];

    if (boundary.riskLevel === 'high') {
      factors.push('两个生肖的概率都比较高，存在较大不确定性');
      factors.push(`${boundary.previousZodiac}和${boundary.nextZodiac}的特质差异较大`);
      mitigations.push('采用双生肖综合分析策略');
      mitigations.push('重点关注两个生肖的共同特质');
      mitigations.push('准备备选方案以应对生肖变化');
    } else if (boundary.riskLevel === 'medium') {
      factors.push('存在一定的生肖切换可能性');
      mitigations.push('以主要生肖为准，兼顾次要生肖特征');
      mitigations.push('预留调整空间');
    } else {
      factors.push('生肖相对确定，风险较低');
      mitigations.push('按标准流程处理，适当考虑边际情况');
    }

    // 添加时间相关的风险因素
    const timeDiff = Math.abs(boundary.crossoverDate.getTime() - Date.now());
    const daysToNewYear = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
    
    if (daysToNewYear < 30) {
      factors.push('临近农历新年，时间压力较大');
      mitigations.push('加快决策进程，及时调整策略');
    }

    return {
      level: boundary.riskLevel,
      factors,
      mitigations
    };
  }

  /**
   * 获取农历新年日期
   */
  private getChineseNewYear(year: number): Date {
    return this.chineseNewYearDates[year] || this.estimateChineseNewYear(year);
  }

  /**
   * 估算农历新年日期（简化算法）
   */
  private estimateChineseNewYear(year: number): Date {
    // 农历新年大致在1月21日到2月20日之间
    // 这里使用简化算法，实际应该用精确的农历计算
    const baseDate = new Date(year, 0, 21); // 1月21日作为基准
    const offset = ((year - 2000) * 11) % 30; // 简化的周期偏移
    return new Date(baseDate.getTime() + offset * 24 * 60 * 60 * 1000);
  }

  /**
   * 根据年份获取生肖
   */
  private getZodiacByYear(year: number): string {
    // 以1900年为鼠年起点
    const index = (year - 1900) % 12;
    return this.zodiacCycle[index];
  }

  /**
   * 获取生肖详细信息
   */
  getZodiacInfo(year: number): ZodiacCalculation {
    const zodiac = this.getZodiacByYear(year);
    const chineseNewYear = this.getChineseNewYear(year);
    const isLeapYear = this.isLeapYear(year);

    // 计算置信度（基于农历新年日期的准确性）
    const confidence = this.chineseNewYearDates[year] ? 0.95 : 0.8;

    return {
      zodiac,
      zodiacYear: year,
      chineseNewYear,
      isLeapYear,
      confidence
    };
  }

  /**
   * 判断是否为闰年
   */
  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  /**
   * 计算生肖兼容性
   */
  calculateZodiacCompatibility(zodiac1: string, zodiac2: string): {
    compatibility: 'excellent' | 'good' | 'average' | 'poor';
    score: number;
    description: string;
  } {
    // 生肖兼容性矩阵（简化版）
    const compatibilityMatrix: Record<string, Record<string, number>> = {
      '鼠': { '龙': 90, '猴': 85, '牛': 80, '虎': 30, '马': 25 },
      '牛': { '蛇': 90, '鸡': 85, '鼠': 80, '羊': 30, '马': 25 },
      '虎': { '马': 90, '狗': 85, '猪': 80, '蛇': 30, '猴': 25 },
      // ... 其他生肖的兼容性
    };

    const score = compatibilityMatrix[zodiac1]?.[zodiac2] || 
                 compatibilityMatrix[zodiac2]?.[zodiac1] || 
                 50; // 默认中等兼容性

    let compatibility: 'excellent' | 'good' | 'average' | 'poor';
    let description: string;

    if (score >= 85) {
      compatibility = 'excellent';
      description = `${zodiac1}和${zodiac2}非常和谐，是理想的组合`;
    } else if (score >= 70) {
      compatibility = 'good';
      description = `${zodiac1}和${zodiac2}比较和谐，相处融洽`;
    } else if (score >= 50) {
      compatibility = 'average';
      description = `${zodiac1}和${zodiac2}兼容性一般，需要相互理解`;
    } else {
      compatibility = 'poor';
      description = `${zodiac1}和${zodiac2}存在一定冲突，需要化解`;
    }

    return { compatibility, score, description };
  }

  /**
   * 生成预产期建议
   */
  generateRecommendations(analysis: PredueAnalysis): string[] {
    const recommendations: string[] = [];

    if (analysis.type === 'cross-zodiac') {
      recommendations.push(`预产期跨越${analysis.scenarios[0].zodiac}年和${analysis.scenarios[1].zodiac}年`);
      recommendations.push(`建议采用${analysis.recommendation.strategy}策略`);
      
      if (analysis.risks.level === 'high') {
        recommendations.push('风险较高，建议准备多套方案');
        recommendations.push('重点关注两个生肖的共同特征');
      }
      
      recommendations.push(`主要按${analysis.recommendation.primary}年特质设计`);
      if (analysis.recommendation.fallback) {
        recommendations.push(`备选方案考虑${analysis.recommendation.fallback}年特质`);
      }
    } else {
      recommendations.push(`预产期在${analysis.scenarios[0].zodiac}年内`);
      recommendations.push('可按标准生肖分析流程进行');
      recommendations.push('风险较低，策略相对稳定');
    }

    // 添加风险缓解建议
    analysis.risks.mitigations.forEach(mitigation => {
      recommendations.push(mitigation);
    });

    return recommendations;
  }

  /**
   * 验证预产期信息
   */
  validatePredueInfo(predueInfo: PredueInfo): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 验证年份
    const currentYear = new Date().getFullYear();
    if (predueInfo.year < currentYear || predueInfo.year > currentYear + 2) {
      errors.push('年份应该在当前年份到未来2年之间');
    }

    // 验证月份
    if (predueInfo.month < 1 || predueInfo.month > 12) {
      errors.push('月份必须在1-12之间');
    }

    // 验证周偏移
    if (predueInfo.weekOffset !== undefined) {
      if (predueInfo.weekOffset < 1 || predueInfo.weekOffset > 8) {
        warnings.push('周偏移量建议在1-8周之间');
      }
    }

    // 检查是否过于遥远
    const predueDate = new Date(predueInfo.year, predueInfo.month - 1, 15);
    const monthsAway = (predueDate.getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000);
    
    if (monthsAway > 12) {
      warnings.push('预产期距离较远，生肖预测的准确性可能会受影响');
    }

    if (monthsAway < 0) {
      warnings.push('预产期已过，建议使用实际出生时间');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}
