/**
 * 八字四柱插件 - Layer 2
 * 处理八字四柱的计算和分析，支持确定时间和预产期模式
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

interface BaZiPillar {
  heavenStem: string;  // 天干
  earthBranch: string; // 地支
  wuxing: string;      // 五行
  yinyang: 'yin' | 'yang'; // 阴阳
}

interface BaZiResult {
  year: BaZiPillar;
  month: BaZiPillar;
  day: BaZiPillar;
  hour?: BaZiPillar;
  
  // 分析结果
  dayMaster: string;           // 日主
  dayMasterWuxing: string;     // 日主五行
  strongWeak: 'strong' | 'weak' | 'balanced'; // 强弱
  usefulGods: string[];        // 用神
  avoidGods: string[];         // 忌神
  
  // 五行统计
  wuxingCount: {
    jin: number;
    mu: number;
    shui: number;
    huo: number;
    tu: number;
  };
  
  // 分析质量
  analysisQuality: 'precise' | 'estimated' | 'probabilistic';
  confidence: number;
}

export class BaZiPlugin implements NamingPlugin {
  readonly id = 'bazi';
  readonly version = '1.0.0';
  readonly layer = 2;
  readonly dependencies: PluginDependency[] = [
    { pluginId: 'birth-time', required: true }
  ];
  readonly metadata: PluginMetadata = {
    name: '八字四柱分析插件',
    description: '计算和分析八字四柱，提供日主、用神、忌神等信息',
    author: 'System',
    category: 'calculation',
    tags: ['bazi', 'fourpillars', 'wuxing', 'fortune']
  };

  private config: PluginConfig | null = null;

  // 天干地支数据
  private readonly heavenStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  private readonly earthBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  // 天干五行
  private readonly stemWuxing: Record<string, string> = {
    '甲': 'mu', '乙': 'mu',
    '丙': 'huo', '丁': 'huo',
    '戊': 'tu', '己': 'tu',
    '庚': 'jin', '辛': 'jin',
    '壬': 'shui', '癸': 'shui'
  };

  // 地支五行
  private readonly branchWuxing: Record<string, string> = {
    '子': 'shui', '丑': 'tu', '寅': 'mu', '卯': 'mu',
    '辰': 'tu', '巳': 'huo', '午': 'huo', '未': 'tu',
    '申': 'jin', '酉': 'jin', '戌': 'tu', '亥': 'shui'
  };

  // 天干阴阳
  private readonly stemYinYang: Record<string, 'yin' | 'yang'> = {
    '甲': 'yang', '乙': 'yin',
    '丙': 'yang', '丁': 'yin',
    '戊': 'yang', '己': 'yin',
    '庚': 'yang', '辛': 'yin',
    '壬': 'yang', '癸': 'yin'
  };

  // 地支阴阳
  private readonly branchYinYang: Record<string, 'yin' | 'yang'> = {
    '子': 'yang', '丑': 'yin', '寅': 'yang', '卯': 'yin',
    '辰': 'yang', '巳': 'yin', '午': 'yang', '未': 'yin',
    '申': 'yang', '酉': 'yin', '戌': 'yang', '亥': 'yin'
  };

  /**
   * 初始化插件
   */
  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    this.config = config;
    context.log('info', `八字四柱插件初始化完成, 版本: ${this.version}`);
  }

  /**
   * 处理输入数据
   */
  async process(input: StandardInput): Promise<PluginOutput> {
    const startTime = Date.now();
    
    // 获取出生时间插件的结果
    const timeResult = input.context.getPluginResult('birth-time');
    if (!timeResult) {
      throw new Error('未找到出生时间插件的结果');
    }

    const timeInfo = timeResult.timeInfo;
    
    // 根据时间信息的类型进行不同处理
    let baziResult: BaZiResult;
    
    if (timeInfo.type === 'exact') {
      baziResult = await this.processExactTime(timeInfo);
    } else if (timeInfo.type === 'predue') {
      baziResult = await this.processPredueMode(timeInfo, timeResult);
    } else {
      throw new Error('不支持的时间信息类型');
    }

    return {
      pluginId: this.id,
      results: {
        bazi: baziResult,
        dayMaster: baziResult.dayMaster,
        dayMasterWuxing: baziResult.dayMasterWuxing,
        strongWeak: baziResult.strongWeak,
        usefulGods: baziResult.usefulGods,
        avoidGods: baziResult.avoidGods,
        wuxingBalance: baziResult.wuxingCount,
        analysisQuality: baziResult.analysisQuality,
        recommendations: this.generateRecommendations(baziResult)
      },
      confidence: baziResult.confidence,
      metadata: {
        processingTime: Date.now() - startTime,
        dataSource: 'bazi-calculation',
        analysisMethod: baziResult.analysisQuality
      }
    };
  }

  /**
   * 处理确定时间的八字计算
   */
  private async processExactTime(timeInfo: any): Promise<BaZiResult> {
    const { year, month, day, hour } = timeInfo;
    
    // 计算年柱
    const yearPillar = this.calculateYearPillar(year);
    
    // 计算月柱
    const monthPillar = this.calculateMonthPillar(year, month);
    
    // 计算日柱
    const dayPillar = this.calculateDayPillar(year, month, day);
    
    // 计算时柱（如果有时间）
    const hourPillar = hour !== undefined ? this.calculateHourPillar(hour, dayPillar) : undefined;
    
    // 分析八字
    const analysis = this.analyzeBaZi(yearPillar, monthPillar, dayPillar, hourPillar);
    
    return {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
      ...analysis,
      analysisQuality: hourPillar ? 'precise' : 'estimated',
      confidence: hourPillar ? 0.95 : 0.85
    };
  }

  /**
   * 处理预产期模式的八字计算
   */
  private async processPredueMode(timeInfo: any, timeResult: any): Promise<BaZiResult> {
    const { year, month } = timeInfo;
    
    // 对于预产期，使用概率性分析
    const yearPillar = this.calculateYearPillar(year);
    
    // 月柱相对确定
    const monthPillar = this.calculateMonthPillar(year, month);
    
    // 日柱使用月中估算
    const estimatedDay = 15; // 假设月中
    const dayPillar = this.calculateDayPillar(year, month, estimatedDay);
    
    // 时柱不计算
    
    // 简化分析
    const analysis = this.analyzeBaZiSimplified(yearPillar, monthPillar, dayPillar);
    
    return {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      ...analysis,
      analysisQuality: 'probabilistic',
      confidence: timeResult.riskFactors?.crossesNewYear ? 0.6 : 0.7
    };
  }

  /**
   * 计算年柱
   */
  private calculateYearPillar(year: number): BaZiPillar {
    // 简化算法：以公历年为基准
    const stemIndex = (year - 4) % 10;
    const branchIndex = (year - 4) % 12;
    
    const heavenStem = this.heavenStems[stemIndex];
    const earthBranch = this.earthBranches[branchIndex];
    
    return {
      heavenStem,
      earthBranch,
      wuxing: this.stemWuxing[heavenStem],
      yinyang: this.stemYinYang[heavenStem]
    };
  }

  /**
   * 计算月柱
   */
  private calculateMonthPillar(year: number, month: number): BaZiPillar {
    // 简化算法：基于年干和月份计算月干
    const yearStemIndex = (year - 4) % 10;
    const monthStemIndex = (yearStemIndex * 2 + month) % 10;
    const monthBranchIndex = (month + 1) % 12; // 调整为农历月份
    
    const heavenStem = this.heavenStems[monthStemIndex];
    const earthBranch = this.earthBranches[monthBranchIndex];
    
    return {
      heavenStem,
      earthBranch,
      wuxing: this.stemWuxing[heavenStem],
      yinyang: this.stemYinYang[heavenStem]
    };
  }

  /**
   * 计算日柱
   */
  private calculateDayPillar(year: number, month: number, day: number): BaZiPillar {
    // 简化算法：基于日期计算日干支
    const baseDate = new Date(1900, 0, 1);
    const targetDate = new Date(year, month - 1, day);
    const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const stemIndex = daysDiff % 10;
    const branchIndex = daysDiff % 12;
    
    const heavenStem = this.heavenStems[stemIndex];
    const earthBranch = this.earthBranches[branchIndex];
    
    return {
      heavenStem,
      earthBranch,
      wuxing: this.stemWuxing[heavenStem],
      yinyang: this.stemYinYang[heavenStem]
    };
  }

  /**
   * 计算时柱
   */
  private calculateHourPillar(hour: number, dayPillar: BaZiPillar): BaZiPillar {
    // 时辰对应地支
    const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
    const earthBranch = this.earthBranches[hourBranchIndex];
    
    // 根据日干计算时干
    const dayIndex = this.heavenStems.indexOf(dayPillar.heavenStem);
    const hourStemIndex = (dayIndex * 2 + Math.floor(hour / 2)) % 10;
    const heavenStem = this.heavenStems[hourStemIndex];
    
    return {
      heavenStem,
      earthBranch,
      wuxing: this.stemWuxing[heavenStem],
      yinyang: this.stemYinYang[heavenStem]
    };
  }

  /**
   * 分析八字（完整版）
   */
  private analyzeBaZi(
    year: BaZiPillar, 
    month: BaZiPillar, 
    day: BaZiPillar, 
    hour?: BaZiPillar
  ) {
    const dayMaster = day.heavenStem;
    const dayMasterWuxing = day.wuxing;
    
    // 统计五行
    const wuxingCount = this.countWuxing([year, month, day, hour].filter(Boolean) as BaZiPillar[]);
    
    // 分析强弱
    const strongWeak = this.analyzeStrengthWeakness(dayMasterWuxing, wuxingCount, month);
    
    // 确定用神忌神
    const { usefulGods, avoidGods } = this.determineGodsComplete(dayMasterWuxing, strongWeak, wuxingCount);
    
    return {
      dayMaster,
      dayMasterWuxing,
      strongWeak,
      usefulGods,
      avoidGods,
      wuxingCount
    };
  }

  /**
   * 分析八字（简化版）
   */
  private analyzeBaZiSimplified(year: BaZiPillar, month: BaZiPillar, day: BaZiPillar) {
    const dayMaster = day.heavenStem;
    const dayMasterWuxing = day.wuxing;
    
    // 简化的五行统计
    const wuxingCount = this.countWuxing([year, month, day]);
    
    // 简化的强弱分析
    const strongWeak = this.analyzeStrengthWeaknessSimplified(dayMasterWuxing, wuxingCount);
    
    // 简化的用神忌神
    const { usefulGods, avoidGods } = this.determineGodsSimplified(dayMasterWuxing, strongWeak);
    
    return {
      dayMaster,
      dayMasterWuxing,
      strongWeak,
      usefulGods,
      avoidGods,
      wuxingCount
    };
  }

  /**
   * 统计五行
   */
  private countWuxing(pillars: BaZiPillar[]) {
    const count = { jin: 0, mu: 0, shui: 0, huo: 0, tu: 0 };
    
    pillars.forEach(pillar => {
      const stemWuxing = this.stemWuxing[pillar.heavenStem] as keyof typeof count;
      const branchWuxing = this.branchWuxing[pillar.earthBranch] as keyof typeof count;
      
      count[stemWuxing]++;
      count[branchWuxing]++;
    });
    
    return count;
  }

  /**
   * 分析强弱
   */
  private analyzeStrengthWeakness(
    dayMasterWuxing: string, 
    wuxingCount: any, 
    monthPillar: BaZiPillar
  ): 'strong' | 'weak' | 'balanced' {
    const dayMasterCount = wuxingCount[dayMasterWuxing as keyof typeof wuxingCount];
    const monthWuxing = this.branchWuxing[monthPillar.earthBranch];
    
    // 简化判断：主要看同类五行数量和月令
    let strength = dayMasterCount;
    
    // 月令加强
    if (monthWuxing === dayMasterWuxing) {
      strength += 2;
    }
    
    if (strength >= 4) return 'strong';
    if (strength <= 1) return 'weak';
    return 'balanced';
  }

  /**
   * 简化强弱分析
   */
  private analyzeStrengthWeaknessSimplified(dayMasterWuxing: string, wuxingCount: any): 'strong' | 'weak' | 'balanced' {
    const dayMasterCount = wuxingCount[dayMasterWuxing as keyof typeof wuxingCount];
    
    if (dayMasterCount >= 3) return 'strong';
    if (dayMasterCount <= 1) return 'weak';
    return 'balanced';
  }

  /**
   * 确定用神忌神（完整版）
   */
  private determineGodsComplete(
    dayMasterWuxing: string, 
    strongWeak: string, 
    wuxingCount: any
  ) {
    const usefulGods: string[] = [];
    const avoidGods: string[] = [];
    
    if (strongWeak === 'strong') {
      // 身强用克泄耗
      usefulGods.push(...this.getClashingElements(dayMasterWuxing));
      usefulGods.push(...this.getDrainingElements(dayMasterWuxing));
      avoidGods.push(dayMasterWuxing);
      avoidGods.push(...this.getSupportingElements(dayMasterWuxing));
    } else if (strongWeak === 'weak') {
      // 身弱用生扶
      usefulGods.push(dayMasterWuxing);
      usefulGods.push(...this.getSupportingElements(dayMasterWuxing));
      avoidGods.push(...this.getClashingElements(dayMasterWuxing));
      avoidGods.push(...this.getDrainingElements(dayMasterWuxing));
    } else {
      // 平衡时根据缺失五行
      const missingElements = this.getMissingElements(wuxingCount);
      usefulGods.push(...missingElements);
    }
    
    return { usefulGods, avoidGods };
  }

  /**
   * 确定用神忌神（简化版）
   */
  private determineGodsSimplified(dayMasterWuxing: string, strongWeak: string) {
    const usefulGods: string[] = [];
    const avoidGods: string[] = [];
    
    if (strongWeak === 'strong') {
      usefulGods.push(...this.getClashingElements(dayMasterWuxing));
      avoidGods.push(dayMasterWuxing);
    } else if (strongWeak === 'weak') {
      usefulGods.push(dayMasterWuxing);
      usefulGods.push(...this.getSupportingElements(dayMasterWuxing));
      avoidGods.push(...this.getClashingElements(dayMasterWuxing));
    } else {
      usefulGods.push('mu', 'huo', 'tu', 'jin', 'shui'); // 平衡时不特别偏向
    }
    
    return { usefulGods, avoidGods };
  }

  /**
   * 获取相克五行
   */
  private getClashingElements(wuxing: string): string[] {
    const clashMap: Record<string, string[]> = {
      'jin': ['mu'],
      'mu': ['tu'],
      'shui': ['huo'],
      'huo': ['jin'],
      'tu': ['shui']
    };
    return clashMap[wuxing] || [];
  }

  /**
   * 获取相生五行
   */
  private getSupportingElements(wuxing: string): string[] {
    const supportMap: Record<string, string[]> = {
      'jin': ['tu'],
      'mu': ['shui'],
      'shui': ['jin'],
      'huo': ['mu'],
      'tu': ['huo']
    };
    return supportMap[wuxing] || [];
  }

  /**
   * 获取泄耗五行
   */
  private getDrainingElements(wuxing: string): string[] {
    const drainMap: Record<string, string[]> = {
      'jin': ['shui'],
      'mu': ['huo'],
      'shui': ['mu'],
      'huo': ['tu'],
      'tu': ['jin']
    };
    return drainMap[wuxing] || [];
  }

  /**
   * 获取缺失五行
   */
  private getMissingElements(wuxingCount: any): string[] {
    const missing: string[] = [];
    Object.entries(wuxingCount).forEach(([element, count]) => {
      if ((count as number) === 0) {
        missing.push(element);
      }
    });
    return missing;
  }

  /**
   * 生成建议
   */
  private generateRecommendations(baziResult: BaZiResult): string[] {
    const recommendations: string[] = [];
    
    recommendations.push(`日主${baziResult.dayMaster}，五行属${baziResult.dayMasterWuxing}`);
    recommendations.push(`八字${baziResult.strongWeak === 'strong' ? '偏强' : baziResult.strongWeak === 'weak' ? '偏弱' : '平衡'}`);
    
    if (baziResult.usefulGods.length > 0) {
      recommendations.push(`宜用五行：${baziResult.usefulGods.join('、')}`);
    }
    
    if (baziResult.avoidGods.length > 0) {
      recommendations.push(`忌用五行：${baziResult.avoidGods.join('、')}`);
    }
    
    if (baziResult.analysisQuality === 'probabilistic') {
      recommendations.push('基于预产期的概率性分析，建议结合其他方法验证');
    }
    
    return recommendations;
  }

  /**
   * 验证输入数据
   */
  validate(input: StandardInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查是否有出生时间依赖
    if (!input.context.getPluginResult || !input.context.getPluginResult('birth-time')) {
      errors.push('八字计算需要出生时间插件的结果');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 销毁插件，清理资源
   */
  async destroy(): Promise<void> {
    console.log('八字四柱插件销毁完成');
  }

  /**
   * 检查插件是否可用
   */
  isAvailable(): boolean {
    return true;
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
