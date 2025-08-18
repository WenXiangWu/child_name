/**
 * 预产期处理器
 * 负责处理预产期相关的特殊逻辑，包括生肖年边界检查和双生肖分析
 */

export interface PredueInfo {
  year: number;
  month: number;
  weekOffset?: number;
  estimatedDate?: Date;
}

export interface ZodiacBoundary {
  crosses: boolean;
  previousZodiac?: string;
  nextZodiac?: string;
  crossoverDate?: Date;
  probability: {
    previous: number;
    next: number;
  };
}

export interface PredueAnalysis {
  type: 'single-zodiac' | 'cross-zodiac' | 'uncertain';
  scenarios: Array<{
    zodiac: string;
    probability: number;
    strategy: string;
    confidence: number;
  }>;
  recommendation: {
    primary: string;
    fallback: string;
    strategy: string;
    reasoning: string;
  };
  confidence: number;
  dateRange: {
    start: Date;
    end: Date;
    mostLikely: Date;
  };
  warnings: string[];
  metadata: {
    boundaryCheck: boolean;
    weekOffset: number;
    monthBoundary: boolean;
  };
}

export interface DateRange {
  start: Date;
  end: Date;
  center: Date;
  days: number;
}

export class PredueDateHandler {
  private readonly WEEK_OFFSET_DEFAULT = 2;
  private readonly BOUNDARY_THRESHOLD = 3; // 3周内视为边界情况

  constructor() {}

  /**
   * 处理预产期信息
   */
  async processPredue(predueInfo: PredueInfo): Promise<PredueAnalysis> {
    const { year, month, weekOffset = this.WEEK_OFFSET_DEFAULT } = predueInfo;
    
    // 计算可能的日期范围
    const dateRange = this.calculateDateRange(year, month, weekOffset);
    
    // 检查是否跨越生肖年
    const zodiacBoundary = this.checkZodiacBoundary(dateRange);
    
    if (zodiacBoundary.crosses) {
      return this.handleCrossZodiacScenario(zodiacBoundary, dateRange, weekOffset);
    } else {
      return this.handleSingleZodiacScenario(dateRange, weekOffset);
    }
  }

  /**
   * 计算日期范围
   */
  private calculateDateRange(year: number, month: number, weekOffset: number): DateRange {
    // 计算预产期的中心日期
    const centerDate = new Date(year, month - 1, 15); // 假设月中
    
    // 根据周偏移计算实际范围
    const daysOffset = weekOffset * 7;
    const startDate = new Date(centerDate.getTime() - daysOffset * 24 * 60 * 60 * 1000);
    const endDate = new Date(centerDate.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    
    return {
      start: startDate,
      end: endDate,
      center: centerDate,
      days: daysOffset * 2
    };
  }

  /**
   * 检查生肖年边界
   */
  private checkZodiacBoundary(dateRange: DateRange): ZodiacBoundary {
    const { start, end } = dateRange;
    
    // 检查是否跨越农历新年
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    
    if (startYear !== endYear) {
      // 跨越年份，需要进一步检查
      const boundaryInfo = this.analyzeYearBoundary(startYear, endYear, dateRange);
      return {
        crosses: true,
        previousZodiac: boundaryInfo.previousZodiac,
        nextZodiac: boundaryInfo.nextZodiac,
        crossoverDate: boundaryInfo.crossoverDate,
        probability: boundaryInfo.probability
      };
    }
    
    // 同一年内，检查是否接近年末/年初
    const month = start.getMonth() + 1; // getMonth() 返回 0-11
    const day = start.getDate();
    
    if (this.isNearYearBoundary(month, day, dateRange.days)) {
      const boundaryInfo = this.analyzeMonthBoundary(start.getFullYear(), month, day, dateRange.days);
      return {
        crosses: boundaryInfo.crosses,
        previousZodiac: boundaryInfo.previousZodiac,
        nextZodiac: boundaryInfo.nextZodiac,
        crossoverDate: boundaryInfo.crossoverDate,
        probability: boundaryInfo.probability
      };
    }
    
    return {
      crosses: false,
      probability: { previous: 1.0, next: 0.0 }
    };
  }

  /**
   * 分析年份边界
   */
  private analyzeYearBoundary(startYear: number, endYear: number, dateRange: DateRange): {
    previousZodiac: string;
    nextZodiac: string;
    crossoverDate: Date;
    probability: { previous: number; next: number };
  } {
    // 这里应该集成实际的农历计算逻辑
    // 暂时使用简化的生肖计算
    const previousZodiac = this.getZodiacByYear(startYear);
    const nextZodiac = this.getZodiacByYear(endYear);
    
    // 估算跨越日期（通常在1月底到2月初）
    const crossoverDate = new Date(startYear, 1, 15); // 2月15日作为估算
    
    // 根据日期范围计算概率
    const totalDays = dateRange.days;
    const daysBeforeCrossover = this.daysBetween(dateRange.start, crossoverDate);
    const daysAfterCrossover = this.daysBetween(crossoverDate, dateRange.end);
    
    const previousProb = Math.max(0, Math.min(1, daysBeforeCrossover / totalDays));
    const nextProb = Math.max(0, Math.min(1, daysAfterCrossover / totalDays));
    
    return {
      previousZodiac,
      nextZodiac,
      crossoverDate,
      probability: {
        previous: previousProb,
        next: nextProb
      }
    };
  }

  /**
   * 分析月份边界
   */
  private analyzeMonthBoundary(year: number, month: number, day: number, totalDays: number): {
    crosses: boolean;
    previousZodiac?: string;
    nextZodiac?: string;
    crossoverDate?: Date;
    probability: { previous: number; next: number };
  } {
    // 检查是否接近年末（12月）或年初（1月）
    if (month === 12 && day >= 25) {
      // 接近年末，可能跨越到下一年的生肖
      const nextYear = year + 1;
      const previousZodiac = this.getZodiacByYear(year);
      const nextZodiac = this.getZodiacByYear(nextYear);
      
      const daysInMonth = 31;
      const daysFromBoundary = daysInMonth - day;
      const probability = Math.min(1, daysFromBoundary / totalDays);
      
      return {
        crosses: probability > 0.3,
        previousZodiac,
        nextZodiac,
        crossoverDate: new Date(nextYear, 0, 1), // 1月1日
        probability: {
          previous: 1 - probability,
          next: probability
        }
      };
    }
    
    if (month === 1 && day <= 7) {
      // 接近年初，可能属于上一年的生肖
      const previousYear = year - 1;
      const previousZodiac = this.getZodiacByYear(previousYear);
      const nextZodiac = this.getZodiacByYear(year);
      
      const probability = Math.min(1, day / totalDays);
      
      return {
        crosses: probability > 0.3,
        previousZodiac,
        nextZodiac,
        crossoverDate: new Date(year, 0, 1), // 1月1日
        probability: {
          previous: probability,
          next: 1 - probability
        }
      };
    }
    
    return {
      crosses: false,
      probability: { previous: 1.0, next: 0.0 }
    };
  }

  /**
   * 检查是否接近年份边界
   */
  private isNearYearBoundary(month: number, day: number, totalDays: number): boolean {
    if (month === 12 && day >= (31 - totalDays)) {
      return true;
    }
    
    if (month === 1 && day <= totalDays) {
      return true;
    }
    
    return false;
  }

  /**
   * 处理跨越生肖年的场景
   */
  private handleCrossZodiacScenario(
    boundary: ZodiacBoundary,
    dateRange: DateRange,
    weekOffset: number
  ): PredueAnalysis {
    const { previousZodiac, nextZodiac, probability } = boundary;
    
    if (!previousZodiac || !nextZodiac) {
      return this.createUncertainAnalysis(dateRange, weekOffset);
    }
    
    const scenarios = [
      {
        zodiac: previousZodiac,
        probability: probability.previous,
        strategy: 'conservative-previous',
        confidence: Math.min(0.8, probability.previous)
      },
      {
        zodiac: nextZodiac,
        probability: probability.next,
        strategy: 'adaptive-next',
        confidence: Math.min(0.8, probability.next)
      }
    ];
    
    // 确定主要推荐
    const primary = probability.previous > 0.6 ? previousZodiac : nextZodiac;
    const fallback = probability.previous > 0.6 ? nextZodiac : previousZodiac;
    
    return {
      type: 'cross-zodiac',
      scenarios,
      recommendation: {
        primary,
        fallback,
        strategy: 'dual-zodiac-synthesis',
        reasoning: `预产期跨越生肖年边界，建议以${primary}为主，${fallback}为辅进行姓名分析`
      },
      confidence: Math.max(probability.previous, probability.next),
      dateRange: {
        start: dateRange.start,
        end: dateRange.end,
        mostLikely: dateRange.center
      },
      warnings: [
        '预产期跨越生肖年边界，分析结果存在不确定性',
        '建议提供更精确的预产期信息',
        '姓名分析将采用双生肖策略'
      ],
      metadata: {
        boundaryCheck: true,
        weekOffset,
        monthBoundary: this.isMonthBoundary(dateRange)
      }
    };
  }

  /**
   * 处理单一生肖年的场景
   */
  private handleSingleZodiacScenario(dateRange: DateRange, weekOffset: number): PredueAnalysis {
    const zodiac = this.getZodiacByYear(dateRange.center.getFullYear());
    
    return {
      type: 'single-zodiac',
      scenarios: [{
        zodiac,
        probability: 1.0,
        strategy: 'standard-analysis',
        confidence: 0.9
      }],
      recommendation: {
        primary: zodiac,
        fallback: zodiac,
        strategy: 'single-zodiac-standard',
        reasoning: `预产期在单一生肖年内，可直接使用${zodiac}进行姓名分析`
      },
      confidence: 0.9,
      dateRange: {
        start: dateRange.start,
        end: dateRange.end,
        mostLikely: dateRange.center
      },
      warnings: [],
      metadata: {
        boundaryCheck: false,
        weekOffset,
        monthBoundary: false
      }
    };
  }

  /**
   * 创建不确定分析结果
   */
  private createUncertainAnalysis(dateRange: DateRange, weekOffset: number): PredueAnalysis {
    return {
      type: 'uncertain',
      scenarios: [],
      recommendation: {
        primary: 'unknown',
        fallback: 'unknown',
        strategy: 'conservative-unknown',
        reasoning: '无法确定生肖信息，建议使用传统姓名学方法'
      },
      confidence: 0.3,
      dateRange: {
        start: dateRange.start,
        end: dateRange.end,
        mostLikely: dateRange.center
      },
      warnings: [
        '无法确定生肖信息',
        '建议提供更精确的预产期信息',
        '将使用保守的姓名分析策略'
      ],
      metadata: {
        boundaryCheck: false,
        weekOffset,
        monthBoundary: false
      }
    };
  }

  /**
   * 检查是否为月份边界
   */
  private isMonthBoundary(dateRange: DateRange): boolean {
    const startMonth = dateRange.start.getMonth();
    const endMonth = dateRange.end.getMonth();
    return startMonth !== endMonth;
  }

  /**
   * 计算两个日期之间的天数
   */
  private daysBetween(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * 根据年份获取生肖（简化实现）
   */
  private getZodiacByYear(year: number): string {
    const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    // 这里应该使用实际的农历计算，暂时使用简化算法
    const index = (year - 4) % 12;
    return zodiacs[index] || '未知';
  }

  /**
   * 获取预产期处理建议
   */
  getPredueRecommendations(predueInfo: PredueInfo): string[] {
    const recommendations: string[] = [];
    
    if (predueInfo.weekOffset && predueInfo.weekOffset > 3) {
      recommendations.push('预产期周数偏移较大，建议提供更精确的预产期信息');
    }
    
    if (predueInfo.month === 12 || predueInfo.month === 1) {
      recommendations.push('预产期接近年末或年初，可能存在生肖年跨越情况');
    }
    
    if (!predueInfo.estimatedDate) {
      recommendations.push('建议提供具体的预产期日期以获得更准确的分析');
    }
    
    return recommendations;
  }

  /**
   * 验证预产期信息
   */
  validatePredueInfo(predueInfo: PredueInfo): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (predueInfo.year < 1900 || predueInfo.year > 2100) {
      errors.push('年份超出有效范围（1900-2100）');
    }
    
    if (predueInfo.month < 1 || predueInfo.month > 12) {
      errors.push('月份无效');
    }
    
    if (predueInfo.weekOffset && (predueInfo.weekOffset < 1 || predueInfo.weekOffset > 8)) {
      errors.push('周数偏移超出合理范围（1-8周）');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 获取状态信息
   */
  getStatus() {
    return {
      boundaryThreshold: this.BOUNDARY_THRESHOLD,
      weekOffsetDefault: this.WEEK_OFFSET_DEFAULT,
      supportedYears: { min: 1900, max: 2100 }
    };
  }
}
