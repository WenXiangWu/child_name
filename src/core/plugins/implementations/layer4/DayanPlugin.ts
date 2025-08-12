/**
 * 大衍数插件 - 基于大衍筮法进行数理分析和性格命运预测
 */

import { 
  NamingPlugin, 
  StandardInput, 
  StandardOutput, 
  PluginConfig, 
  PluginContext,
  ValidationResult,
  HealthStatus,
  PluginDependency
} from '../../interfaces/NamingPlugin';
import { QimingDataLoader } from '../../../common/data-loader';

// 大衍数相关类型定义
interface DayanNumber {
  value: number;
  category: 'excellent' | 'good' | 'average' | 'poor' | 'bad';
  meaning: string;
  interpretation: string;
  effects: {
    personality: string;
    career: string;
    wealth: string;
    health: string;
    relationships: string;
  };
}

interface NumberAnalysis {
  number: number;
  classification: DayanNumber;
  genderSuitability: {
    male: number;
    female: number;
    neutral: number;
  };
  ageInfluence: {
    youth: string;    // 青年期 (0-30)
    middle: string;   // 中年期 (30-50) 
    senior: string;   // 老年期 (50+)
  };
  culturalBackground: string;
}

interface DayanCalculation {
  method: string;
  sourceGrids: {
    tiange: number;
    renge: number;
    dige: number;
    waige: number;
    zongge: number;
  };
  derivedNumbers: number[];
  primaryNumber: number;
  secondaryNumbers: number[];
}

interface DayanResults {
  calculation: DayanCalculation;
  primaryAnalysis: NumberAnalysis;
  secondaryAnalyses: NumberAnalysis[];
  genderCompatibility: {
    gender: string;
    compatibility: number;
    reasons: string[];
  };
  overallAssessment: {
    score: number;
    category: 'excellent' | 'good' | 'average' | 'poor' | 'bad';
    summary: string;
  };
  recommendations: string[];
}

export class DayanPlugin implements NamingPlugin {
  readonly id = 'dayan';
  readonly version = '1.0.0';
  readonly layer = 4;
  readonly dependencies: PluginDependency[] = [
    { pluginId: 'sancai', required: true },
    { pluginId: 'gender', required: true }
  ];
  readonly metadata = {
    name: '大衍数插件',
    description: '基于大衍筮法和81数理进行姓名的数理分析，评估性格特征和命运趋向',
    author: 'Qiming System',
    tags: ['dayan', 'numerology', 'analysis', 'traditional']
  };

  private dataLoader!: QimingDataLoader;
  private initialized = false;
  private dayanDatabase!: Map<number, DayanNumber>;

  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    try {
      this.dataLoader = QimingDataLoader.getInstance();
      await this.dataLoader.preloadCoreData();
      
      // 初始化大衍数数据库
      await this.initializeDayanDatabase();
      
      this.initialized = true;
      context.log?.('info', `${this.id} 插件初始化成功`);
    } catch (error) {
      context.log?.('error', `${this.id} 插件初始化失败: ${error}`);
      throw error;
    }
  }

  async process(input: StandardInput): Promise<StandardOutput> {
    if (!this.initialized) {
      throw new Error('插件未初始化');
    }

    try {
      // 获取三才五格数据
      const sancaiResult = input.context.pluginResults.get('sancai');
      if (!sancaiResult || !sancaiResult.grids) {
        throw new Error('缺少三才五格数据，请确保三才五格插件已执行');
      }

      // 获取性别数据
      const genderResult = input.context.pluginResults.get('gender');
      if (!genderResult || !genderResult.gender) {
        throw new Error('缺少性别信息，请确保性别插件已执行');
      }

      // 计算大衍数
      const results = await this.calculateDayan(
        sancaiResult.grids,
        genderResult.gender
      );

      return {
        pluginId: this.id,
        results,
        confidence: 0.8,
        metadata: {
          processingTime: Date.now(),
          numerologySystem: 'dayan-81-numbers',
          calculationMethod: 'grid-based'
        }
      };

    } catch (error) {
      throw new Error(`大衍数分析失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  validate(input: StandardInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查三才五格数据
    const sancaiResult = input.context.pluginResults.get('sancai');
    if (!sancaiResult) {
      errors.push('缺少三才五格数据，请确保三才五格插件已执行');
    } else if (!sancaiResult.grids) {
      errors.push('三才五格数据不完整');
    }

    // 检查性别数据
    const genderResult = input.context.pluginResults.get('gender');
    if (!genderResult) {
      errors.push('缺少性别信息，请确保性别插件已执行');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  async destroy(): Promise<void> {
    this.initialized = false;
    this.dayanDatabase?.clear();
  }

  isAvailable(): boolean {
    return this.initialized && !!this.dataLoader;
  }

  getHealthStatus(): HealthStatus {
    return {
      status: this.initialized ? 'healthy' : 'unhealthy',
      message: this.initialized ? '大衍数插件运行正常' : '插件未初始化',
      lastCheck: Date.now(),
      details: {
        initialized: this.initialized,
        databaseLoaded: this.dayanDatabase?.size > 0
      }
    };
  }

  /**
   * 初始化大衍数数据库（81数理）
   */
  private async initializeDayanDatabase(): Promise<void> {
    this.dayanDatabase = new Map();
    
    // 81数理的精选重要数字（实际应包含完整的1-81）
    const dayanData: Array<{ number: number; data: DayanNumber }> = [
      {
        number: 1,
        data: {
          value: 1,
          category: 'excellent',
          meaning: '太极始祖数',
          interpretation: '万物之始，天地开泰，富贵荣华，功成名就',
          effects: {
            personality: '领导能力强，开创精神，独立自主，意志坚定',
            career: '适合创业、领导管理，能在各行业中取得成功',
            wealth: '财运亨通，能积累丰厚财富，投资眼光独到',
            health: '体质强健，精力充沛，但需注意劳逸结合',
            relationships: '人缘良好，能获得他人信任和支持'
          }
        }
      },
      {
        number: 2,
        data: {
          value: 2,
          category: 'poor',
          meaning: '混沌未分数',
          interpretation: '二元分离，进退维谷，难以决断，事业不顺',
          effects: {
            personality: '性格犹豫，缺乏主见，容易受他人影响',
            career: '事业发展缓慢，容易遇到阻碍，需要他人帮助',
            wealth: '财运一般，不宜投资，适合稳健理财',
            health: '体质偏弱，需要注意保养，避免过度劳累',
            relationships: '人际关系复杂，容易产生误解'
          }
        }
      },
      {
        number: 3,
        data: {
          value: 3,
          category: 'excellent',
          meaning: '三才完备数',
          interpretation: '天地人和，智勇双全，功成名就，前程似锦',
          effects: {
            personality: '智慧超群，才华横溢，具有很强的适应能力',
            career: '多才多艺，适合教育、文化、艺术等领域',
            wealth: '财源广进，善于理财，有多种收入来源',
            health: '身心健康，精神饱满，长寿之相',
            relationships: '人际关系和谐，朋友众多，贵人运强'
          }
        }
      },
      {
        number: 5,
        data: {
          value: 5,
          category: 'excellent',
          meaning: '五行俱全数',
          interpretation: '阴阳和合，精神愉快，荣誉达至，一生平安',
          effects: {
            personality: '性格平和，处事公正，富有同情心',
            career: '事业稳定发展，能在工作中获得成就感',
            wealth: '财运稳定，收入持续增长，善于积累',
            health: '五脏调和，体魄健康，精神饱满',
            relationships: '家庭和睦，朋友真诚，人际和谐'
          }
        }
      },
      {
        number: 6,
        data: {
          value: 6,
          category: 'good',
          meaning: '安稳余庆数',
          interpretation: '天德地祥，福泽深厚，富贵荣华，万事如意',
          effects: {
            personality: '性格温和，重视家庭，有强烈的责任感',
            career: '工作踏实，能够获得上级认可，升迁顺利',
            wealth: '财运良好，有稳定的收入来源，生活富足',
            health: '身体健康，很少生病，长寿健康',
            relationships: '家庭幸福，夫妻恩爱，子女孝顺'
          }
        }
      },
      {
        number: 7,
        data: {
          value: 7,
          category: 'good',
          meaning: '刚毅果断数',
          interpretation: '意志坚强，勇往直前，能克服困难，获得成功',
          effects: {
            personality: '性格坚强，有毅力，不轻易放弃',
            career: '适合需要决断力的工作，能够承担重任',
            wealth: '通过努力获得财富，理财观念较强',
            health: '体质强健，抗压能力强，精力旺盛',
            relationships: '朋友不多但很真诚，重视友情'
          }
        }
      },
      {
        number: 8,
        data: {
          value: 8,
          category: 'excellent',
          meaning: '勤勉发展数',
          interpretation: '意志如铁，勤勉发展，才能兼备，成就大业',
          effects: {
            personality: '勤奋努力，意志坚定，有很强的进取心',
            career: '通过不懈努力获得成功，适合实业发展',
            wealth: '财运亨通，善于积累，能建立丰厚家业',
            health: '身体健康，耐力强，长寿之相',
            relationships: '人缘良好，能得到他人帮助和支持'
          }
        }
      },
      {
        number: 9,
        data: {
          value: 9,
          category: 'poor',
          meaning: '破舟进海数',
          interpretation: '大成之数，但蕴含危险，成败在于一念',
          effects: {
            personality: '聪明但易冲动，有极端倾向，情绪波动大',
            career: '才华出众但不稳定，容易大起大落',
            wealth: '财运不稳，有暴富可能但也易破财',
            health: '需要注意精神健康，避免过度紧张',
            relationships: '人际关系复杂，容易产生冲突'
          }
        }
      },
      {
        number: 11,
        data: {
          value: 11,
          category: 'excellent',
          meaning: '早春花草数',
          interpretation: '阴阳复新，享天赋幸福，万事顺利发达',
          effects: {
            personality: '性格开朗，充满活力，具有创新精神',
            career: '事业发展顺利，容易获得成功和认可',
            wealth: '财运旺盛，收入丰厚，投资运佳',
            health: '身心健康，活力充沛，青春常驻',
            relationships: '人际关系良好，容易获得他人喜爱'
          }
        }
      },
      {
        number: 13,
        data: {
          value: 13,
          category: 'excellent',
          meaning: '天才学艺数',
          interpretation: '智谋超群，学艺精湛，忍柔当事，大功告成',
          effects: {
            personality: '聪明睿智，学习能力强，富有创造力',
            career: '适合学术研究、艺术创作等智力工作',
            wealth: '通过才能获得财富，知识就是财富',
            health: '头脑清晰，但要注意用脑过度',
            relationships: '因才华而受人尊敬，朋友多为知识分子'
          }
        }
      },
      {
        number: 15,
        data: {
          value: 15,
          category: 'excellent',
          meaning: '福寿兴家数',
          interpretation: '福寿圆满，繁荣昌盛，雅量厚重，德高望重',
          effects: {
            personality: '性格温和，品德高尚，受人尊敬',
            career: '事业稳定发展，能够建功立业',
            wealth: '财运稳定，生活富足，子孙满堂',
            health: '身体健康，长寿之相，福泽深厚',
            relationships: '家庭和睦，人际和谐，德高望重'
          }
        }
      },
      {
        number: 16,
        data: {
          value: 16,
          category: 'excellent',
          meaning: '贵人相助数',
          interpretation: '贵人相助，能成大事，富贵荣华，众望所归',
          effects: {
            personality: '为人正直，具有领导魅力，能获得他人信任',
            career: '容易得到贵人帮助，事业发展顺利',
            wealth: '财运亨通，能积累丰厚财富',
            health: '身体健康，精神饱满，气质不凡',
            relationships: '人缘极佳，贵人运强，朋友众多'
          }
        }
      },
      {
        number: 21,
        data: {
          value: 21,
          category: 'excellent',
          meaning: '明月中天数',
          interpretation: '光风霁月，万物确立，官运亨通，大搏名利',
          effects: {
            personality: '性格光明，正直无私，具有很强的正义感',
            career: '适合从政或管理工作，官运亨通',
            wealth: '财运极佳，名利双收，声望很高',
            health: '身心健康，精神饱满，气质高雅',
            relationships: '人际关系良好，声望很高，众人敬仰'
          }
        }
      },
      {
        number: 23,
        data: {
          value: 23,
          category: 'excellent',
          meaning: '旭日东升数',
          interpretation: '旭日东升，名显四方，渐次进展，终成大业',
          effects: {
            personality: '充满朝气，积极向上，有很强的进取心',
            career: '事业蒸蒸日上，前程光明，成就显著',
            wealth: '财运旺盛，收入不断增加，事业有成',
            health: '身体健康，精力充沛，活力四射',
            relationships: '人际关系良好，能带给他人正能量'
          }
        }
      },
      {
        number: 24,
        data: {
          value: 24,
          category: 'excellent',
          meaning: '金钱丰足数',
          interpretation: '家门余庆，金钱丰盈，白手成家，财源广进',
          effects: {
            personality: '理财能力强，商业头脑发达，善于积累',
            career: '适合商业经营，能够白手起家',
            wealth: '财运极佳，能够积累巨大财富',
            health: '身体健康，精神饱满，生活富足',
            relationships: '家庭和睦，子孙昌盛，财富传承'
          }
        }
      },
      {
        number: 25,
        data: {
          value: 25,
          category: 'good',
          meaning: '英迈俊敏数',
          interpretation: '资性英敏，才能独特，克服傲慢，可获成功',
          effects: {
            personality: '聪明过人，才能出众，但需要控制傲慢',
            career: '凭借才能获得成功，适合专业技术工作',
            wealth: '通过才能获得财富，收入稳定',
            health: '体质良好，但要注意精神调节',
            relationships: '因才华受人敬佩，但需要谦逊待人'
          }
        }
      }
      // 实际应用中应该包含完整的1-81数理
    ];

    dayanData.forEach(({ number, data }) => {
      this.dayanDatabase.set(number, data);
    });
  }

  /**
   * 计算大衍数
   */
  private async calculateDayan(grids: any, gender: string): Promise<DayanResults> {
    const { tiange, renge, dige, waige, zongge } = grids;
    
    // 计算方法：基于五格数值
    const calculation: DayanCalculation = {
      method: 'five-grids-derivation',
      sourceGrids: { tiange, renge, dige, waige, zongge },
      derivedNumbers: [tiange, renge, dige, waige, zongge],
      primaryNumber: zongge, // 以总格为主要分析数
      secondaryNumbers: [renge, tiange] // 人格和天格为次要分析
    };

    // 分析主要数字
    const primaryAnalysis = await this.analyzeNumber(calculation.primaryNumber, gender);
    
    // 分析次要数字
    const secondaryAnalyses = await Promise.all(
      calculation.secondaryNumbers.map(num => this.analyzeNumber(num, gender))
    );

    // 性别兼容性分析
    const genderCompatibility = this.analyzeGenderCompatibility(
      primaryAnalysis,
      secondaryAnalyses,
      gender
    );

    // 总体评估
    const overallAssessment = this.calculateOverallAssessment(
      primaryAnalysis,
      secondaryAnalyses,
      genderCompatibility
    );

    // 生成建议
    const recommendations = this.generateDayanRecommendations(
      primaryAnalysis,
      secondaryAnalyses,
      genderCompatibility,
      overallAssessment
    );

    return {
      calculation,
      primaryAnalysis,
      secondaryAnalyses,
      genderCompatibility,
      overallAssessment,
      recommendations
    };
  }

  /**
   * 分析数字
   */
  private async analyzeNumber(number: number, gender: string): Promise<NumberAnalysis> {
    // 将数字转换为1-81范围内
    const normalizedNumber = ((number - 1) % 81) + 1;
    
    // 获取数理分析
    const classification = this.dayanDatabase.get(normalizedNumber) || this.getDefaultNumberMeaning(normalizedNumber);
    
    // 性别适宜性分析
    const genderSuitability = this.calculateGenderSuitability(normalizedNumber, gender);
    
    // 年龄影响分析
    const ageInfluence = this.analyzeAgeInfluence(normalizedNumber);
    
    // 文化背景
    const culturalBackground = this.getCulturalBackground(normalizedNumber);

    return {
      number: normalizedNumber,
      classification,
      genderSuitability,
      ageInfluence,
      culturalBackground
    };
  }

  /**
   * 获取默认数字含义
   */
  private getDefaultNumberMeaning(number: number): DayanNumber {
    // 简化的规律：奇数较吉，偶数较凶，特殊数字特殊处理
    const isOdd = number % 2 === 1;
    const isPrime = this.isPrime(number);
    
    let category: DayanNumber['category'];
    if (isPrime && isOdd) {
      category = 'excellent';
    } else if (isOdd) {
      category = 'good';
    } else if (number % 10 === 0) {
      category = 'poor';
    } else {
      category = 'average';
    }

    return {
      value: number,
      category,
      meaning: `${number}数理`,
      interpretation: this.getBasicInterpretation(number, category),
      effects: this.getBasicEffects(category)
    };
  }

  /**
   * 判断是否为质数
   */
  private isPrime(num: number): boolean {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }

  /**
   * 获取基本解释
   */
  private getBasicInterpretation(number: number, category: string): string {
    const interpretations: Record<string, string> = {
      'excellent': '数理极佳，大吉大利，事业有成，名利双收',
      'good': '数理良好，多有吉庆，发展顺利，收获成功',
      'average': '数理平常，吉凶参半，需要努力，可获小成',
      'poor': '数理欠佳，多有困难，需要谨慎，防范不测',
      'bad': '数理不吉，困难重重，需要坚持，方可转机'
    };
    return interpretations[category];
  }

  /**
   * 获取基本影响
   */
  private getBasicEffects(category: string): DayanNumber['effects'] {
    const effects: Record<string, DayanNumber['effects']> = {
      'excellent': {
        personality: '性格开朗积极，领导能力强，受人尊敬',
        career: '事业发展顺利，容易获得成功和认可',
        wealth: '财运亨通，收入丰厚，善于理财',
        health: '身体健康，精力充沛，长寿之相',
        relationships: '人际关系良好，贵人运强，朋友众多'
      },
      'good': {
        personality: '性格稳重，做事认真，有责任感',
        career: '工作踏实，能够获得稳定发展',
        wealth: '财运平稳，收入稳定，生活安定',
        health: '身体健康，注意保养，可享长寿',
        relationships: '人际关系和谐，家庭幸福美满'
      },
      'average': {
        personality: '性格一般，需要努力提升自己',
        career: '事业发展需要努力，可有小成',
        wealth: '财运一般，需要勤俭持家',
        health: '身体状况一般，需要注意保养',
        relationships: '人际关系平常，需要用心经营'
      },
      'poor': {
        personality: '性格内向，容易悲观，需要调整心态',
        career: '事业发展困难，需要坚持不懈',
        wealth: '财运不佳，需要谨慎理财',
        health: '身体状况需要关注，注意预防',
        relationships: '人际关系复杂，需要真诚待人'
      },
      'bad': {
        personality: '性格易怒，情绪波动大，需要修养',
        career: '事业多有挫折，需要极大毅力',
        wealth: '财运不济，容易破财，需要节制',
        health: '身体容易出问题，需要加强保养',
        relationships: '人际关系紧张，需要改善沟通'
      }
    };
    return effects[category];
  }

  /**
   * 计算性别适宜性
   */
  private calculateGenderSuitability(number: number, gender: string): NumberAnalysis['genderSuitability'] {
    // 简化的性别适宜性算法
    const base = 70;
    let male = base;
    let female = base;
    let neutral = base;

    // 奇数偏向男性，偶数偏向女性
    if (number % 2 === 1) {
      male += 15;
      female -= 10;
    } else {
      male -= 10;
      female += 15;
    }

    // 特殊数字调整
    if ([1, 3, 7, 8, 11, 13, 16, 21, 23].includes(number)) {
      neutral += 20; // 这些数字比较中性
    }

    // 确保在合理范围内
    male = Math.max(0, Math.min(100, male));
    female = Math.max(0, Math.min(100, female));
    neutral = Math.max(0, Math.min(100, neutral));

    return { male, female, neutral };
  }

  /**
   * 分析年龄影响
   */
  private analyzeAgeInfluence(number: number): NumberAnalysis['ageInfluence'] {
    // 不同数字在不同年龄段的影响
    const influences: Record<string, NumberAnalysis['ageInfluence']> = {
      'early': {
        youth: '青年时期运势旺盛，学业事业发展顺利',
        middle: '中年时期需要稳扎稳打，避免冒进',
        senior: '晚年时期安享天伦，子孙孝顺'
      },
      'steady': {
        youth: '青年时期需要努力奋斗，打好基础',
        middle: '中年时期迎来收获期，事业有成',
        senior: '晚年时期福泽深厚，安享晚年'
      },
      'late': {
        youth: '青年时期多有挫折，需要坚持',
        middle: '中年时期渐入佳境，否极泰来',
        senior: '晚年时期运势转好，享受成果'
      }
    };

    // 根据数字特征判断发展模式
    let pattern: string;
    if (number <= 10 || [11, 13, 15, 16, 21, 23, 24].includes(number)) {
      pattern = 'early'; // 早期发达型
    } else if (number >= 70) {
      pattern = 'late';  // 大器晚成型
    } else {
      pattern = 'steady'; // 稳步发展型
    }

    return influences[pattern];
  }

  /**
   * 获取文化背景
   */
  private getCulturalBackground(number: number): string {
    const backgrounds: Record<number, string> = {
      1: '《易经》乾卦，代表天、健、刚强，为万物之始',
      3: '三才数，天地人三才俱全，文化底蕴深厚',
      5: '五行数，代表金木水火土五行调和',
      8: '发财数，谐音"发"，在中华文化中寓意财富',
      9: '九五至尊，帝王之数，但物极必反',
      13: '智慧数，在西方被认为不吉，但在东方象征智慧',
      16: '天德地祥，古代认为是非常吉利的数字',
      21: '明月中天，代表光明、正直、成功',
      24: '金钱丰足，传统认为是财富聚集的数字'
    };

    return backgrounds[number] || `${number}数在传统数理学中有其特定含义和文化内涵`;
  }

  /**
   * 分析性别兼容性
   */
  private analyzeGenderCompatibility(
    primary: NumberAnalysis,
    secondary: NumberAnalysis[],
    gender: string
  ): DayanResults['genderCompatibility'] {
    const genderKey = gender as keyof NumberAnalysis['genderSuitability'];
    
    // 计算主要数字的性别适配度
    const primaryCompatibility = primary.genderSuitability[genderKey];
    
    // 计算次要数字的平均适配度
    const secondaryCompatibility = secondary.reduce((sum, analysis) => {
      return sum + analysis.genderSuitability[genderKey];
    }, 0) / secondary.length;
    
    // 综合计算
    const overallCompatibility = primaryCompatibility * 0.6 + secondaryCompatibility * 0.4;
    
    // 生成原因说明
    const reasons: string[] = [];
    if (primaryCompatibility >= 80) {
      reasons.push(`主要数理${primary.number}非常适合${gender === 'male' ? '男性' : '女性'}使用`);
    } else if (primaryCompatibility >= 60) {
      reasons.push(`主要数理${primary.number}较适合${gender === 'male' ? '男性' : '女性'}使用`);
    } else {
      reasons.push(`主要数理${primary.number}对${gender === 'male' ? '男性' : '女性'}适配度一般`);
    }

    return {
      gender,
      compatibility: Math.round(overallCompatibility),
      reasons
    };
  }

  /**
   * 计算总体评估
   */
  private calculateOverallAssessment(
    primary: NumberAnalysis,
    secondary: NumberAnalysis[],
    genderCompatibility: DayanResults['genderCompatibility']
  ): DayanResults['overallAssessment'] {
    // 评分权重
    const primaryWeight = 0.5;
    const secondaryWeight = 0.3;
    const genderWeight = 0.2;

    // 数理分类转分数
    const categoryScores: Record<string, number> = {
      'excellent': 95,
      'good': 80,
      'average': 65,
      'poor': 45,
      'bad': 25
    };

    // 计算主要数字得分
    const primaryScore = categoryScores[primary.classification.category];
    
    // 计算次要数字平均得分
    const secondaryScore = secondary.reduce((sum, analysis) => {
      return sum + categoryScores[analysis.classification.category];
    }, 0) / secondary.length;

    // 综合得分
    const totalScore = Math.round(
      primaryScore * primaryWeight +
      secondaryScore * secondaryWeight +
      genderCompatibility.compatibility * genderWeight
    );

    // 确定等级
    let category: DayanResults['overallAssessment']['category'];
    if (totalScore >= 90) category = 'excellent';
    else if (totalScore >= 75) category = 'good';
    else if (totalScore >= 60) category = 'average';
    else if (totalScore >= 40) category = 'poor';
    else category = 'bad';

    // 生成总结
    const summaries: Record<string, string> = {
      'excellent': '大衍数理配置极佳，数理大吉，前程似锦，名利双收',
      'good': '大衍数理配置良好，整体吉利，发展顺遂，可获成功',
      'average': '大衍数理配置一般，平稳发展，需要努力，可有小成',
      'poor': '大衍数理配置欠佳，多有困难，需要谨慎，加倍努力',
      'bad': '大衍数理配置不利，困难重重，需要坚持，寻求转机'
    };

    return {
      score: totalScore,
      category,
      summary: summaries[category]
    };
  }

  /**
   * 生成大衍数建议
   */
  private generateDayanRecommendations(
    primary: NumberAnalysis,
    secondary: NumberAnalysis[],
    genderCompatibility: DayanResults['genderCompatibility'],
    assessment: DayanResults['overallAssessment']
  ): string[] {
    const recommendations: string[] = [];

    // 总体建议
    recommendations.push(`大衍数理总评：${assessment.summary}`);

    // 主要数字建议
    recommendations.push(
      `主数理${primary.number}(${primary.classification.meaning})：${primary.classification.interpretation}`
    );

    // 性别适配建议
    if (genderCompatibility.compatibility >= 80) {
      recommendations.push('数理与性别高度匹配，有利于发挥个人特长');
    } else if (genderCompatibility.compatibility >= 60) {
      recommendations.push('数理与性别较为匹配，整体发展良好');
    } else {
      recommendations.push('数理与性别匹配度一般，建议结合其他因素考虑');
    }

    // 发展阶段建议
    recommendations.push(`人生发展：${primary.ageInfluence.youth}`);
    recommendations.push(`中年展望：${primary.ageInfluence.middle}`);

    // 优势发挥建议
    recommendations.push(`性格优势：${primary.classification.effects.personality}`);
    recommendations.push(`事业方向：${primary.classification.effects.career}`);

    // 注意事项
    if (assessment.category === 'poor' || assessment.category === 'bad') {
      recommendations.push('数理稍有不足，建议通过努力和修养来改善运势');
    }

    return recommendations;
  }
}
