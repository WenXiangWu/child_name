/**
 * 周易卦象插件 - 基于三才五格计算周易卦象并进行象征意义分析
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

// 周易相关类型定义
interface Trigram {
  name: string;        // 卦名
  symbol: string;      // 卦象符号 
  binary: string;      // 二进制表示 (如: "111")
  wuxing: string;      // 对应五行
  meaning: string;     // 基本含义
  attributes: string[]; // 属性特征
}

interface Hexagram {
  upper: Trigram;      // 上卦
  lower: Trigram;      // 下卦
  name: string;        // 六十四卦名
  number: number;      // 卦序 (1-64)
  symbol: string;      // 完整卦象
  judgment: string;    // 卦辞
  image: string;       // 象辞
}

interface ChangingLines {
  positions: number[]; // 变爻位置 (1-6)
  meanings: string[];  // 变爻含义
  resultHexagram?: Hexagram; // 变卦
}

interface YijingAnalysis {
  mainHexagram: Hexagram;
  changingLines: ChangingLines;
  interpretation: {
    personality: string;
    career: string;
    relationships: string;
    health: string;
    fortune: string;
  };
  lifeGuidance: string[];
  favorableElements: string[];
  cautions: string[];
}

interface YijingResults {
  calculation: {
    method: string;
    sourceNumbers: number[];
    trigrams: { upper: Trigram; lower: Trigram };
  };
  analysis: YijingAnalysis;
  confidence: number;
  recommendations: string[];
}

export class YijingPlugin implements NamingPlugin {
  readonly id = 'yijing';
  readonly version = '1.0.0';
  readonly layer = 4;
  readonly dependencies: PluginDependency[] = [
    { pluginId: 'sancai', required: true }
  ];
  readonly metadata = {
    name: '周易卦象插件',
    description: '基于三才五格数据计算周易六十四卦，分析卦象的象征意义和人生指导',
    author: 'Qiming System',
    tags: ['yijing', 'hexagram', 'divination', 'traditional']
  };

  private dataLoader!: QimingDataLoader;
  private initialized = false;
  private trigrams!: Map<string, Trigram>;
  private hexagrams!: Map<number, Hexagram>;

  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    try {
      this.dataLoader = QimingDataLoader.getInstance();
      await this.dataLoader.preloadCoreData();
      
      // 初始化八卦和六十四卦数据
      await this.initializeTrigramData();
      await this.initializeHexagramData();
      
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

      // 计算周易卦象
      const results = await this.calculateYijing(sancaiResult.grids, sancaiResult.sancai);

      return {
        pluginId: this.id,
        results,
        confidence: 0.7, // 周易分析主观性较强，置信度适中
        metadata: {
          processingTime: Date.now(),
          calculationMethod: 'sancai-based',
          traditionSource: 'yijing-64-hexagrams'
        }
      };

    } catch (error) {
      throw new Error(`周易卦象分析失败: ${error instanceof Error ? error.message : String(error)}`);
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

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  async destroy(): Promise<void> {
    this.initialized = false;
    this.trigrams?.clear();
    this.hexagrams?.clear();
  }

  isAvailable(): boolean {
    return this.initialized && !!this.dataLoader;
  }

  getHealthStatus(): HealthStatus {
    return {
      status: this.initialized ? 'healthy' : 'unhealthy',
      message: this.initialized ? '周易卦象插件运行正常' : '插件未初始化',
      lastCheck: Date.now(),
      details: {
        initialized: this.initialized,
        trigramDataLoaded: this.trigrams?.size > 0,
        hexagramDataLoaded: this.hexagrams?.size > 0
      }
    };
  }

  /**
   * 初始化八卦数据
   */
  private async initializeTrigramData(): Promise<void> {
    this.trigrams = new Map();
    
    const trigramData: Trigram[] = [
      { name: '乾', symbol: '☰', binary: '111', wuxing: '金', meaning: '天、健、刚', attributes: ['刚健', '积极', '领导'] },
      { name: '坤', symbol: '☷', binary: '000', wuxing: '土', meaning: '地、顺、柔', attributes: ['包容', '顺从', '滋养'] },
      { name: '震', symbol: '☳', binary: '001', wuxing: '木', meaning: '雷、动、长男', attributes: ['震动', '行动', '创新'] },
      { name: '巽', symbol: '☴', binary: '110', wuxing: '木', meaning: '风、入、长女', attributes: ['柔顺', '渗透', '传播'] },
      { name: '坎', symbol: '☵', binary: '010', wuxing: '水', meaning: '水、险、中男', attributes: ['智慧', '困难', '流动'] },
      { name: '离', symbol: '☲', binary: '101', wuxing: '火', meaning: '火、明、中女', attributes: ['光明', '美丽', '文明'] },
      { name: '艮', symbol: '☶', binary: '100', wuxing: '土', meaning: '山、止、少男', attributes: ['稳定', '静止', '诚实'] },
      { name: '兑', symbol: '☱', binary: '011', wuxing: '金', meaning: '泽、悦、少女', attributes: ['喜悦', '交流', '收获'] }
    ];

    trigramData.forEach(trigram => {
      this.trigrams.set(trigram.binary, trigram);
    });
  }

  /**
   * 初始化六十四卦数据（简化版）
   */
  private async initializeHexagramData(): Promise<void> {
    this.hexagrams = new Map();
    
    // 这里只提供部分重要卦象的数据，实际应用中应该包含完整的64卦
    const hexagramData = [
      { number: 1, name: '乾', symbol: '☰☰', judgment: '元亨利贞', image: '天行健，君子以自强不息' },
      { number: 2, name: '坤', symbol: '☷☷', judgment: '元亨，利牝马之贞', image: '地势坤，君子以厚德载物' },
      { number: 3, name: '屯', symbol: '☵☳', judgment: '元亨利贞，勿用有攸往', image: '云雷屯，君子以经纶' },
      { number: 11, name: '泰', symbol: '☷☰', judgment: '小往大来，吉亨', image: '天地交泰，后以财成天地之道' },
      { number: 12, name: '否', symbol: '☰☷', judgment: '否之匪人，不利君子贞', image: '天地不交，否' },
      { number: 63, name: '既济', symbol: '☵☲', judgment: '亨，小利贞', image: '水在火上，既济' },
      { number: 64, name: '未济', symbol: '☲☵', judgment: '亨，小狐汔济，濡其尾', image: '火在水上，未济' }
      // 实际应用中应该包含所有64卦
    ];

    hexagramData.forEach(hex => {
      this.hexagrams.set(hex.number, {
        upper: this.getTrigramFromSymbol(hex.symbol.slice(0, 1)),
        lower: this.getTrigramFromSymbol(hex.symbol.slice(1, 2)),
        name: hex.name,
        number: hex.number,
        symbol: hex.symbol,
        judgment: hex.judgment,
        image: hex.image
      });
    });
  }

  /**
   * 根据符号获取八卦
   */
  private getTrigramFromSymbol(symbol: string): Trigram {
    const symbolMap: Record<string, string> = {
      '☰': '111', '☷': '000', '☳': '001', '☴': '110',
      '☵': '010', '☲': '101', '☶': '100', '☱': '011'
    };
    const binary = symbolMap[symbol];
    return this.trigrams.get(binary)!;
  }

  /**
   * 计算周易卦象
   */
  private async calculateYijing(grids: any, sancai: any): Promise<YijingResults> {
    const { tiange, renge, dige, waige, zongge } = grids;
    
    // 使用五格数据计算上下卦
    const upperTrigram = this.calculateTrigram([tiange, renge, waige]);
    const lowerTrigram = this.calculateTrigram([dige, renge, zongge]);
    
    // 查找对应的六十四卦
    const hexagramNumber = this.findHexagramNumber(upperTrigram, lowerTrigram);
    const mainHexagram = this.hexagrams.get(hexagramNumber) || this.createDefaultHexagram(upperTrigram, lowerTrigram);
    
    // 计算变爻
    const changingLines = this.calculateChangingLines([tiange, renge, dige, waige, zongge]);
    
    // 分析卦象
    const analysis = await this.analyzeHexagram(mainHexagram, changingLines, sancai);
    
    // 生成建议
    const recommendations = this.generateYijingRecommendations(analysis);

    return {
      calculation: {
        method: 'five-grids-mapping',
        sourceNumbers: [tiange, renge, dige, waige, zongge],
        trigrams: { upper: upperTrigram, lower: lowerTrigram }
      },
      analysis,
      confidence: 0.7,
      recommendations
    };
  }

  /**
   * 计算八卦
   */
  private calculateTrigram(numbers: number[]): Trigram {
    // 将数字转换为阴阳爻
    const yaoLines = numbers.map(num => (num % 2 === 1) ? '1' : '0');
    const binary = yaoLines.join('').slice(0, 3); // 取前三位
    
    return this.trigrams.get(binary) || this.trigrams.get('111')!; // 默认返回乾卦
  }

  /**
   * 查找六十四卦序号
   */
  private findHexagramNumber(upper: Trigram, lower: Trigram): number {
    // 简化的卦序计算（实际应该有完整的映射表）
    const upperIndex = parseInt(upper.binary, 2);
    const lowerIndex = parseInt(lower.binary, 2);
    
    // 这里使用简化的计算方式，实际应该使用标准的六十四卦顺序
    let hexagramNumber = upperIndex * 8 + lowerIndex + 1;
    
    // 确保在1-64范围内
    hexagramNumber = ((hexagramNumber - 1) % 64) + 1;
    
    return hexagramNumber;
  }

  /**
   * 创建默认六十四卦
   */
  private createDefaultHexagram(upper: Trigram, lower: Trigram): Hexagram {
    return {
      upper,
      lower,
      name: `${upper.name}${lower.name}`,
      number: 0,
      symbol: `${upper.symbol}${lower.symbol}`,
      judgment: '需要详细分析',
      image: `${upper.meaning}与${lower.meaning}相合`
    };
  }

  /**
   * 计算变爻
   */
  private calculateChangingLines(numbers: number[]): ChangingLines {
    const positions: number[] = [];
    const meanings: string[] = [];
    
    // 根据各格数值确定变爻位置
    numbers.forEach((num, index) => {
      if (num % 6 === 0) { // 可以调整判定条件
        positions.push(index + 1);
        meanings.push(this.getYaoMeaning(index + 1, num));
      }
    });

    return {
      positions,
      meanings
      // resultHexagram 在有变爻时计算
    };
  }

  /**
   * 获取爻的含义
   */
  private getYaoMeaning(position: number, value: number): string {
    const yaoMeanings: Record<number, string> = {
      1: '初爻动，基础变化，需谨慎起步',
      2: '二爻动，人际关系变化，注意合作',
      3: '三爻动，转折关键期，把握机遇',
      4: '四爻动，环境变化，适应调整',
      5: '五爻动，领导地位变化，承担责任',
      6: '上爻动，功成身退，知进退'
    };
    
    return yaoMeanings[position] || '变化中蕴含机遇';
  }

  /**
   * 分析卦象
   */
  private async analyzeHexagram(
    hexagram: Hexagram, 
    changingLines: ChangingLines, 
    sancai: any
  ): Promise<YijingAnalysis> {
    const interpretation = this.interpretHexagram(hexagram, sancai);
    const lifeGuidance = this.generateLifeGuidance(hexagram, changingLines);
    const favorableElements = this.getFavorableElements(hexagram);
    const cautions = this.getCautions(hexagram, changingLines);

    return {
      mainHexagram: hexagram,
      changingLines,
      interpretation,
      lifeGuidance,
      favorableElements,
      cautions
    };
  }

  /**
   * 解释卦象含义
   */
  private interpretHexagram(hexagram: Hexagram, sancai: any): YijingAnalysis['interpretation'] {
    const { upper, lower } = hexagram;
    
    return {
      personality: `具有${upper.meaning}的特质，${lower.meaning}的基础，性格${upper.attributes.join('、')}`,
      career: `适合发挥${upper.wuxing}与${lower.wuxing}属性的事业，${hexagram.judgment}`,
      relationships: `人际关系体现${upper.name}${lower.name}的特点，${upper.attributes[0]}与${lower.attributes[0]}并重`,
      health: `身体状况与${upper.wuxing}、${lower.wuxing}二气相关，需要平衡调节`,
      fortune: `运势如${hexagram.name}卦所示：${hexagram.judgment}`
    };
  }

  /**
   * 生成人生指导
   */
  private generateLifeGuidance(hexagram: Hexagram, changingLines: ChangingLines): string[] {
    const guidance: string[] = [];
    
    // 基于卦辞的指导
    guidance.push(`卦辞指导：${hexagram.judgment}`);
    guidance.push(`象辞启示：${hexagram.image}`);
    
    // 基于变爻的指导
    if (changingLines.positions.length > 0) {
      guidance.push('变爻提示：变化中孕育新机，需顺应天时');
      changingLines.meanings.forEach(meaning => {
        guidance.push(meaning);
      });
    } else {
      guidance.push('卦象稳定，宜守正待时，稳步发展');
    }
    
    // 基于上下卦的指导
    guidance.push(`上卦${hexagram.upper.name}示：${hexagram.upper.meaning}，当${hexagram.upper.attributes.join('、')}`);
    guidance.push(`下卦${hexagram.lower.name}示：${hexagram.lower.meaning}，当${hexagram.lower.attributes.join('、')}`);

    return guidance;
  }

  /**
   * 获取有利元素
   */
  private getFavorableElements(hexagram: Hexagram): string[] {
    const elements: string[] = [];
    
    // 五行相生的元素
    const wuxingSheng: Record<string, string> = {
      '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
    };
    
    elements.push(hexagram.upper.wuxing);
    elements.push(hexagram.lower.wuxing);
    elements.push(wuxingSheng[hexagram.upper.wuxing]);
    elements.push(wuxingSheng[hexagram.lower.wuxing]);
    
    return [...new Set(elements)]; // 去重
  }

  /**
   * 获取注意事项
   */
  private getCautions(hexagram: Hexagram, changingLines: ChangingLines): string[] {
    const cautions: string[] = [];
    
    // 五行相克的警示
    const wuxingKe: Record<string, string> = {
      '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
    };
    
    cautions.push(`注意避免${wuxingKe[hexagram.upper.wuxing]}属性的不利影响`);
    cautions.push(`注意避免${wuxingKe[hexagram.lower.wuxing]}属性的冲突`);
    
    // 变爻警示
    if (changingLines.positions.length > 2) {
      cautions.push('变爻过多，变化频繁，需要保持稳定');
    }
    
    // 卦象特定警示
    if (hexagram.name.includes('否') || hexagram.name.includes('困')) {
      cautions.push('当前卦象显示困难期，需要耐心等待时机');
    }

    return cautions;
  }

  /**
   * 生成周易建议
   */
  private generateYijingRecommendations(analysis: YijingAnalysis): string[] {
    const recommendations: string[] = [];
    
    // 主卦建议
    recommendations.push(`主卦${analysis.mainHexagram.name}：${analysis.mainHexagram.judgment}`);
    
    // 五行建议
    const favorableElements = analysis.favorableElements.join('、');
    recommendations.push(`有利五行：${favorableElements}，可在姓名、事业、环境中适当运用`);
    
    // 变爻建议
    if (analysis.changingLines.positions.length > 0) {
      recommendations.push(`有变爻在${analysis.changingLines.positions.join('、')}位，需要关注相应生活领域的变化`);
    } else {
      recommendations.push('卦象稳定，宜按部就班，稳中求进');
    }
    
    // 人生指导摘要
    const keyGuidance = analysis.lifeGuidance.slice(0, 2);
    recommendations.push(...keyGuidance);

    return recommendations;
  }
}
