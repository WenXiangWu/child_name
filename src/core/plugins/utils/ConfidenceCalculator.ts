/**
 * 插件置信度计算器
 * 根据数据完整性、算法可靠性、外部因素等计算插件输出的可信度
 */

// 置信度计算结果接口
export interface ConfidenceResult {
  score: number;          // 总置信度 (0-100)
  level: 'low' | 'medium' | 'high' | 'excellent';
  breakdown: {
    dataCompleteness: number;     // 数据完整性 (0-40)
    dataPrecision: number;        // 数据精度 (0-30) 
    algorithmReliability: number; // 算法可靠性 (0-20)
    externalFactors: number;      // 外部因素 (0-10)
  };
  factors: string[];      // 影响因素说明
  recommendations: string[]; // 提升建议
}

// 插件输入数据接口
export interface PluginInputData {
  pluginId: string;
  inputData: any;
  context?: {
    certaintyLevel?: string;
    availableData?: string[];
    missingData?: string[];
  };
}

export class ConfidenceCalculator {
  
  /**
   * 计算插件置信度
   */
  calculateConfidence(input: PluginInputData): ConfidenceResult {
    const { pluginId, inputData, context } = input;
    
    // 根据插件类型选择计算方法
    switch (pluginId) {
      case 'surname':
        return this.calculateSurnameConfidence(inputData);
      case 'gender':
        return this.calculateGenderConfidence(inputData);
      case 'birth-time':
        return this.calculateBirthTimeConfidence(inputData);
      case 'bazi':
        return this.calculateBaziConfidence(inputData, context);
      case 'zodiac':
        return this.calculateZodiacConfidence(inputData);
      case 'xiyongshen':
        return this.calculateXiyongshenConfidence(inputData, context);
      case 'stroke':
        return this.calculateStrokeConfidence(inputData);
      case 'wuxing-char':
        return this.calculateWuxingCharConfidence(inputData, context);
      case 'meaning':
        return this.calculateMeaningConfidence(inputData);
      case 'phonetic':
        return this.calculatePhoneticConfidence(inputData);
      case 'sancai':
        return this.calculateSancaiConfidence(inputData);
      case 'yijing':
        return this.calculateYijingConfidence(inputData);
      case 'dayan':
        return this.calculateDayanConfidence(inputData);
      default:
        return this.calculateDefaultConfidence(inputData);
    }
  }
  
  /**
   * 姓氏插件置信度计算
   */
  private calculateSurnameConfidence(inputData: any): ConfidenceResult {
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    let dataCompleteness = 0;
    let dataPrecision = 0;
    let algorithmReliability = 20; // 姓氏解析算法很可靠
    let externalFactors = 10;
    
    // 数据完整性检查
    if (inputData.familyName) {
      dataCompleteness += 40; // 有姓氏信息
      factors.push('✅ 姓氏信息完整');
    } else {
      factors.push('❌ 缺少姓氏信息');
      recommendations.push('提供完整的姓氏信息');
    }
    
    // 数据精度检查
    if (inputData.familyName) {
      const name = inputData.familyName.trim();
      if (name.length === 1) {
        dataPrecision = 30; // 单字姓氏，精度最高
        factors.push('✅ 单字姓氏，解析精度高');
      } else if (name.length === 2) {
        dataPrecision = 25; // 复姓，精度较高
        factors.push('✅ 复姓，解析精度较高');
      } else if (name.length > 2) {
        dataPrecision = 15; // 可能包含名字，精度降低
        factors.push('⚠️ 姓氏过长，可能包含名字');
        recommendations.push('请确保只输入姓氏部分');
      }
    }
    
    const score = dataCompleteness + dataPrecision + algorithmReliability + externalFactors;
    
    return {
      score,
      level: this.getConfidenceLevel(score),
      breakdown: { dataCompleteness, dataPrecision, algorithmReliability, externalFactors },
      factors,
      recommendations
    };
  }
  
  /**
   * 性别插件置信度计算
   */
  private calculateGenderConfidence(inputData: any): ConfidenceResult {
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    let dataCompleteness = 0;
    let dataPrecision = 0;
    let algorithmReliability = 20;
    let externalFactors = 10;
    
    if (inputData.gender) {
      if (['male', 'female'].includes(inputData.gender)) {
        dataCompleteness = 40;
        dataPrecision = 30;
        factors.push('✅ 性别信息明确且标准');
      } else {
        dataCompleteness = 20;
        dataPrecision = 15;
        factors.push('⚠️ 性别信息格式非标准');
        recommendations.push('请使用标准的性别标识');
      }
    } else {
      factors.push('❌ 缺少性别信息');
      recommendations.push('请提供性别信息');
    }
    
    const score = dataCompleteness + dataPrecision + algorithmReliability + externalFactors;
    
    return {
      score,
      level: this.getConfidenceLevel(score),
      breakdown: { dataCompleteness, dataPrecision, algorithmReliability, externalFactors },
      factors,
      recommendations
    };
  }
  
  /**
   * 出生时间插件置信度计算 - 重点分析
   */
  private calculateBirthTimeConfidence(inputData: any): ConfidenceResult {
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    let dataCompleteness = 0;
    let dataPrecision = 0;
    let algorithmReliability = 20;
    let externalFactors = 0;
    
    // 数据完整性检查 (最高40分)
    if (inputData.year) {
      dataCompleteness += 10;
      factors.push('✅ 有出生年份');
    } else {
      factors.push('❌ 缺少出生年份');
      recommendations.push('提供出生年份');
    }
    
    if (inputData.month) {
      dataCompleteness += 10;
      factors.push('✅ 有出生月份');
    } else {
      factors.push('❌ 缺少出生月份');
      recommendations.push('提供出生月份');
    }
    
    if (inputData.day) {
      dataCompleteness += 10;
      factors.push('✅ 有出生日期');
    } else {
      factors.push('❌ 缺少出生日期');
      recommendations.push('提供出生日期');
    }
    
    if (inputData.hour !== undefined) {
      dataCompleteness += 10;
      factors.push('✅ 有出生时辰');
    } else {
      factors.push('⚠️ 缺少出生时辰');
      recommendations.push('提供出生时辰以提高八字分析准确度');
    }
    
    // 数据精度检查 (最高30分)
    if (inputData.hour !== undefined && inputData.minute !== undefined) {
      dataPrecision = 30;
      factors.push('✅ 精确到分钟，时辰判断最准确');
      externalFactors += 5;
    } else if (inputData.hour !== undefined) {
      // 这里是关键：为什么是95%而不是100%
      if (inputData.hour === 0 || inputData.hour === 23 || 
          inputData.hour % 2 === 1) { // 时辰边界附近
        dataPrecision = 25;
        factors.push('⚠️ 时辰边界附近，可能影响八字准确性');
        recommendations.push('提供精确分钟以确定时辰边界');
      } else {
        dataPrecision = 28;
        factors.push('✅ 时辰明确，八字分析可靠');
      }
      externalFactors += 3;
    } else {
      dataPrecision = 0;
      factors.push('❌ 无时辰信息，只能进行基础分析');
    }
    
    // 季节和历法准确性
    if (inputData.month && inputData.day) {
      externalFactors += 2;
      factors.push('✅ 可进行季节和节气分析');
    }
    
    const score = dataCompleteness + dataPrecision + algorithmReliability + externalFactors;
    
    return {
      score,
      level: this.getConfidenceLevel(score),
      breakdown: { dataCompleteness, dataPrecision, algorithmReliability, externalFactors },
      factors,
      recommendations
    };
  }
  
  /**
   * 八字插件置信度计算
   */
  private calculateBaziConfidence(inputData: any, context?: any): ConfidenceResult {
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    let dataCompleteness = 0;
    let dataPrecision = 0;
    let algorithmReliability = 18; // 八字算法相对复杂
    let externalFactors = 0;
    
    // 依赖birth-time插件的结果
    if (context?.availableData?.includes('birth-time')) {
      dataCompleteness = 35;
      factors.push('✅ 依赖出生时间数据');
      
      if (inputData.birthInfo?.hour !== undefined) {
        dataPrecision = 25;
        factors.push('✅ 有时辰信息，八字完整');
        externalFactors += 5;
      } else {
        dataPrecision = 15;
        factors.push('⚠️ 缺少时辰，八字不完整');
        recommendations.push('提供时辰信息以获得完整八字');
      }
    } else {
      factors.push('❌ 缺少出生时间依赖');
      recommendations.push('需要先完成出生时间分析');
    }
    
    // 历法转换准确性
    if (inputData.birthInfo?.year && inputData.birthInfo?.month) {
      externalFactors += 3;
      factors.push('✅ 可进行公历转农历');
    }
    
    const score = dataCompleteness + dataPrecision + algorithmReliability + externalFactors;
    
    return {
      score,
      level: this.getConfidenceLevel(score),
      breakdown: { dataCompleteness, dataPrecision, algorithmReliability, externalFactors },
      factors,
      recommendations
    };
  }
  
  /**
   * 生肖插件置信度计算
   */
  private calculateZodiacConfidence(inputData: any): ConfidenceResult {
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    let dataCompleteness = 0;
    let dataPrecision = 30; // 生肖判断相对简单
    let algorithmReliability = 20;
    let externalFactors = 5;
    
    if (inputData.year) {
      dataCompleteness = 40;
      factors.push('✅ 有出生年份，生肖确定');
      
      // 春节前后的特殊情况
      if (inputData.month && inputData.day) {
        if (inputData.month <= 2) {
          dataPrecision = 25;
          factors.push('⚠️ 春节前后，需要农历确认');
          recommendations.push('春节前后出生请确认农历年份');
        }
        externalFactors += 3;
      }
    } else {
      factors.push('❌ 缺少出生年份');
      recommendations.push('提供出生年份以确定生肖');
    }
    
    const score = dataCompleteness + dataPrecision + algorithmReliability + externalFactors;
    
    return {
      score,
      level: this.getConfidenceLevel(score),
      breakdown: { dataCompleteness, dataPrecision, algorithmReliability, externalFactors },
      factors,
      recommendations
    };
  }
  
  /**
   * 喜用神插件置信度计算
   */
  private calculateXiyongshenConfidence(inputData: any, context?: any): ConfidenceResult {
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    let dataCompleteness = 0;
    let dataPrecision = 0;
    let algorithmReliability = 15; // 喜用神分析较复杂，有争议
    let externalFactors = 0;
    
    // 依赖八字分析结果
    if (context?.availableData?.includes('bazi')) {
      dataCompleteness = 30;
      factors.push('✅ 基于八字分析结果');
      
      if (inputData.bazi && inputData.bazi.includes('完整八字')) {
        dataPrecision = 25;
        factors.push('✅ 八字完整，喜用神分析可靠');
        externalFactors += 5;
      } else {
        dataPrecision = 15;
        factors.push('⚠️ 八字不完整，喜用神分析精度降低');
        recommendations.push('完整八字信息可提高喜用神分析准确度');
      }
    } else {
      factors.push('❌ 缺少八字分析依赖');
      recommendations.push('需要先完成八字分析');
    }
    
    // 性别影响
    if (inputData.gender) {
      dataCompleteness += 10;
      externalFactors += 3;
      factors.push('✅ 考虑性别因素');
    }
    
    const score = dataCompleteness + dataPrecision + algorithmReliability + externalFactors;
    
    return {
      score,
      level: this.getConfidenceLevel(score),
      breakdown: { dataCompleteness, dataPrecision, algorithmReliability, externalFactors },
      factors,
      recommendations
    };
  }
  
  /**
   * 笔画插件置信度计算
   */
  private calculateStrokeConfidence(inputData: any): ConfidenceResult {
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    let dataCompleteness = 0;
    let dataPrecision = 30;
    let algorithmReliability = 20; // 笔画计算很可靠
    let externalFactors = 8;
    
    if (inputData.familyStrokes) {
      dataCompleteness = 40;
      factors.push('✅ 姓氏笔画明确');
    } else {
      factors.push('❌ 缺少姓氏笔画');
      recommendations.push('需要先分析姓氏笔画');
    }
    
    const score = dataCompleteness + dataPrecision + algorithmReliability + externalFactors;
    
    return {
      score,
      level: this.getConfidenceLevel(score),
      breakdown: { dataCompleteness, dataPrecision, algorithmReliability, externalFactors },
      factors,
      recommendations
    };
  }
  
  /**
   * 五行字符插件置信度计算
   */
  private calculateWuxingCharConfidence(inputData: any, context?: any): ConfidenceResult {
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    let dataCompleteness = 0;
    let dataPrecision = 0;
    let algorithmReliability = 18;
    let externalFactors = 0;
    
    // 依赖喜用神和笔画分析
    if (context?.availableData?.includes('xiyongshen') && 
        context?.availableData?.includes('stroke')) {
      dataCompleteness = 35;
      factors.push('✅ 基于喜用神和笔画分析');
      
      if (inputData.requirements && inputData.strokeCombinations) {
        dataPrecision = 25;
        factors.push('✅ 五行要求和笔画组合明确');
        externalFactors += 5;
      } else {
        dataPrecision = 15;
        factors.push('⚠️ 五行要求或笔画组合不完整');
      }
    } else {
      factors.push('❌ 缺少必要的依赖分析');
      recommendations.push('需要先完成喜用神和笔画分析');
    }
    
    const score = dataCompleteness + dataPrecision + algorithmReliability + externalFactors;
    
    return {
      score,
      level: this.getConfidenceLevel(score),
      breakdown: { dataCompleteness, dataPrecision, algorithmReliability, externalFactors },
      factors,
      recommendations
    };
  }
  
  /**
   * 字义插件置信度计算
   */
  private calculateMeaningConfidence(inputData: any): ConfidenceResult {
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    let dataCompleteness = 0;
    let dataPrecision = 25;
    let algorithmReliability = 15; // 字义分析主观性较强
    let externalFactors = 8;
    
    if (inputData.candidates && inputData.candidates.length > 0) {
      dataCompleteness = 35;
      factors.push(`✅ 有${inputData.candidates.length}个候选字`);
      
      if (inputData.candidates.length >= 10) {
        dataPrecision += 5;
        factors.push('✅ 候选字数量充足，分析更准确');
      }
    } else {
      factors.push('❌ 缺少候选字');
      recommendations.push('需要先筛选候选字');
    }
    
    const score = dataCompleteness + dataPrecision + algorithmReliability + externalFactors;
    
    return {
      score,
      level: this.getConfidenceLevel(score),
      breakdown: { dataCompleteness, dataPrecision, algorithmReliability, externalFactors },
      factors,
      recommendations
    };
  }
  
  /**
   * 音韵插件置信度计算
   */
  private calculatePhoneticConfidence(inputData: any): ConfidenceResult {
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    let dataCompleteness = 0;
    let dataPrecision = 28;
    let algorithmReliability = 20; // 音韵分析相对客观
    let externalFactors = 5;
    
    if (inputData.familyName && inputData.candidates) {
      dataCompleteness = 37;
      factors.push('✅ 姓氏和候选字完整');
    } else {
      factors.push('❌ 缺少姓氏或候选字信息');
      recommendations.push('需要姓氏和候选字信息');
    }
    
    const score = dataCompleteness + dataPrecision + algorithmReliability + externalFactors;
    
    return {
      score,
      level: this.getConfidenceLevel(score),
      breakdown: { dataCompleteness, dataPrecision, algorithmReliability, externalFactors },
      factors,
      recommendations
    };
  }
  
  /**
   * 三才插件置信度计算
   */
  private calculateSancaiConfidence(inputData: any): ConfidenceResult {
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    let dataCompleteness = 0;
    let dataPrecision = 30;
    let algorithmReliability = 20; // 三才计算很可靠
    let externalFactors = 6;
    
    if (inputData.familyStrokes && inputData.combinations) {
      dataCompleteness = 40;
      factors.push('✅ 姓氏笔画和名字组合完整');
    } else {
      factors.push('❌ 缺少必要的笔画信息');
      recommendations.push('需要姓氏和名字笔画信息');
    }
    
    const score = dataCompleteness + dataPrecision + algorithmReliability + externalFactors;
    
    return {
      score,
      level: this.getConfidenceLevel(score),
      breakdown: { dataCompleteness, dataPrecision, algorithmReliability, externalFactors },
      factors,
      recommendations
    };
  }
  
  /**
   * 易经插件置信度计算
   */
  private calculateYijingConfidence(inputData: any): ConfidenceResult {
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    let dataCompleteness = 0;
    let dataPrecision = 20;
    let algorithmReliability = 12; // 易经分析主观性很强
    let externalFactors = 3;
    
    if (inputData.names && inputData.names.length > 0) {
      dataCompleteness = 30;
      factors.push('✅ 有候选名字进行易经分析');
    } else {
      factors.push('❌ 缺少候选名字');
      recommendations.push('需要先生成候选名字');
    }
    
    const score = dataCompleteness + dataPrecision + algorithmReliability + externalFactors;
    
    return {
      score,
      level: this.getConfidenceLevel(score),
      breakdown: { dataCompleteness, dataPrecision, algorithmReliability, externalFactors },
      factors,
      recommendations
    };
  }
  
  /**
   * 大衍插件置信度计算
   */
  private calculateDayanConfidence(inputData: any): ConfidenceResult {
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    let dataCompleteness = 0;
    let dataPrecision = 25;
    let algorithmReliability = 18; // 数理计算较可靠
    let externalFactors = 7;
    
    if (inputData.names && inputData.names.length > 0) {
      dataCompleteness = 35;
      factors.push('✅ 有候选名字进行数理分析');
    } else {
      factors.push('❌ 缺少候选名字');
      recommendations.push('需要先生成候选名字');
    }
    
    const score = dataCompleteness + dataPrecision + algorithmReliability + externalFactors;
    
    return {
      score,
      level: this.getConfidenceLevel(score),
      breakdown: { dataCompleteness, dataPrecision, algorithmReliability, externalFactors },
      factors,
      recommendations
    };
  }
  
  /**
   * 默认置信度计算
   */
  private calculateDefaultConfidence(inputData: any): ConfidenceResult {
    const factors = ['⚠️ 未知插件类型，使用默认计算'];
    const recommendations = ['请实现该插件的置信度计算逻辑'];
    
    const score = 70; // 默认中等置信度
    
    return {
      score,
      level: this.getConfidenceLevel(score),
      breakdown: {
        dataCompleteness: 25,
        dataPrecision: 20,
        algorithmReliability: 15,
        externalFactors: 10
      },
      factors,
      recommendations
    };
  }
  
  /**
   * 根据分数获取置信度等级
   */
  private getConfidenceLevel(score: number): 'low' | 'medium' | 'high' | 'excellent' {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  }
  
  /**
   * 获取置信度等级描述
   */
  getConfidenceLevelDescription(level: string): string {
    const descriptions = {
      excellent: '极高置信度 - 结果非常可靠',
      high: '高置信度 - 结果可靠',
      medium: '中等置信度 - 结果基本可靠，建议补充信息',
      low: '低置信度 - 结果仅供参考，强烈建议补充信息'
    };
    
    return descriptions[level as keyof typeof descriptions] || '未知等级';
  }
  
  /**
   * 批量计算多个插件的置信度
   */
  batchCalculateConfidence(inputs: PluginInputData[]): ConfidenceResult[] {
    return inputs.map(input => this.calculateConfidence(input));
  }
}

// 导出单例
export const confidenceCalculator = new ConfidenceCalculator();
