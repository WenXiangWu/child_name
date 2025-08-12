/**
 * 三才五格插件 - 负责计算和分析传统姓名学中的三才五格体系
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

// 三才五格相关类型定义
interface GridData {
  tiange: number;      // 天格
  renge: number;       // 人格  
  dige: number;        // 地格
  waige: number;       // 外格
  zongge: number;      // 总格
}

interface SancaiData {
  tian: string;        // 天才（天格所属五行）
  ren: string;         // 人才（人格所属五行）
  di: string;          // 地才（地格所属五行）
  relationship: string; // 三才关系
  score: number;       // 三才评分
}

interface GridAnalysis {
  grid: keyof GridData;
  value: number;
  wuxing: string;
  meaning: string;
  score: number;
  interpretation: string;
}

interface SancaiAnalysis {
  combination: string;
  relationship: 'excellent' | 'good' | 'average' | 'poor' | 'bad';
  score: number;
  interpretation: string;
  effects: {
    personality: string;
    career: string;
    health: string;
    relationships: string;
  };
}

interface SancaiResults {
  grids: GridData;
  gridAnalyses: GridAnalysis[];
  sancai: SancaiData;
  sancaiAnalysis: SancaiAnalysis;
  overallScore: number;
  recommendations: string[];
}

export class SancaiPlugin implements NamingPlugin {
  readonly id = 'sancai';
  readonly version = '1.0.0';
  readonly layer = 4;
  readonly dependencies: PluginDependency[] = [
    { pluginId: 'surname', required: true },
    { pluginId: 'stroke', required: true }
  ];
  readonly metadata = {
    name: '三才五格插件',
    description: '计算和分析传统姓名学中的三才五格体系，包括天格、人格、地格、外格、总格的吉凶分析',
    author: 'Qiming System',
    tags: ['sancai', 'wuge', 'traditional', 'numerology']
  };

  private dataLoader!: QimingDataLoader;
  private initialized = false;

  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    try {
      this.dataLoader = QimingDataLoader.getInstance();
      await this.dataLoader.preloadCoreData();
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
      const { characters } = input.data;
      if (!characters || characters.length === 0) {
        throw new Error('缺少字符数据');
      }

      // 获取姓氏数据
      const surnameResult = input.context.pluginResults.get('surname');
      if (!surnameResult || !surnameResult.strokes) {
        throw new Error('缺少姓氏笔画信息，请确保姓氏插件已执行');
      }

      // 获取字符笔画数据
      const strokeResult = input.context.pluginResults.get('stroke');
      if (!strokeResult || !strokeResult.strokeData) {
        throw new Error('缺少字符笔画信息，请确保笔画插件已执行');
      }

      // 计算三才五格
      const results = await this.calculateSancai(
        surnameResult.strokes,
        strokeResult.strokeData,
        characters
      );

      return {
        pluginId: this.id,
        results,
        confidence: 0.95,
        metadata: {
          processingTime: Date.now(),
          dataSource: 'traditional-sancai',
          calculationMethod: 'five-grids'
        }
      };

    } catch (error) {
      throw new Error(`三才五格计算失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  validate(input: StandardInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查基本数据
    if (!input.data.characters || input.data.characters.length === 0) {
      errors.push('缺少字符数据');
    }

    // 检查字符数量（通常为1-2个字符）
    if (input.data.characters && input.data.characters.length > 2) {
      warnings.push('字符数量超过2个，可能影响三才五格准确性');
    }

    // 检查姓氏数据
    const surnameResult = input.context.pluginResults.get('surname');
    if (!surnameResult) {
      errors.push('缺少姓氏信息，请确保姓氏插件已执行');
    }

    // 检查笔画数据
    const strokeResult = input.context.pluginResults.get('stroke');
    if (!strokeResult) {
      errors.push('缺少笔画信息，请确保笔画插件已执行');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  async destroy(): Promise<void> {
    this.initialized = false;
  }

  isAvailable(): boolean {
    return this.initialized && !!this.dataLoader;
  }

  getHealthStatus(): HealthStatus {
    return {
      status: this.initialized ? 'healthy' : 'unhealthy',
      message: this.initialized ? '三才五格插件运行正常' : '插件未初始化',
      lastCheck: Date.now(),
      details: {
        initialized: this.initialized,
        dataLoaderAvailable: !!this.dataLoader
      }
    };
  }

  /**
   * 计算三才五格
   */
  private async calculateSancai(
    surnameStrokes: number,
    strokeData: any[],
    characters: string[]
  ): Promise<SancaiResults> {
    // 构建完整的笔画数组：姓氏 + 名字字符
    const allStrokes = [surnameStrokes];
    strokeData.forEach(data => {
      allStrokes.push(data.strokes);
    });

    // 计算五格
    const grids = this.calculateGrids(allStrokes);
    
    // 分析各格的含义
    const gridAnalyses = await this.analyzeGrids(grids);
    
    // 计算三才
    const sancai = await this.calculateSancaiRelation(grids);
    
    // 三才分析
    const sancaiAnalysis = await this.analyzeSancai(sancai);
    
    // 计算总评分
    const overallScore = this.calculateOverallScore(gridAnalyses, sancaiAnalysis);
    
    // 生成建议
    const recommendations = this.generateRecommendations(gridAnalyses, sancaiAnalysis, overallScore);

    return {
      grids,
      gridAnalyses,
      sancai,
      sancaiAnalysis,
      overallScore,
      recommendations
    };
  }

  /**
   * 计算五格数值
   */
  private calculateGrids(strokes: number[]): GridData {
    const len = strokes.length;
    
    let tiange: number, renge: number, dige: number, waige: number, zongge: number;

    if (len === 2) {
      // 单字名
      tiange = strokes[0] + 1;
      renge = strokes[0] + strokes[1];
      dige = strokes[1] + 1;
      waige = 2; // 单字名外格固定为2
      zongge = strokes[0] + strokes[1];
    } else if (len === 3) {
      // 双字名
      tiange = strokes[0] + 1;
      renge = strokes[0] + strokes[1];
      dige = strokes[1] + strokes[2];
      waige = strokes[0] + strokes[2];
      zongge = strokes[0] + strokes[1] + strokes[2];
    } else {
      throw new Error(`不支持的字符数量: ${len - 1}`);
    }

    return { tiange, renge, dige, waige, zongge };
  }

  /**
   * 分析各格含义
   */
  private async analyzeGrids(grids: GridData): Promise<GridAnalysis[]> {
    const analyses: GridAnalysis[] = [];
    
    for (const [gridName, value] of Object.entries(grids)) {
      const wuxing = this.getNumberWuxing(value);
      const { meaning, score, interpretation } = await this.getNumberMeaning(value, gridName as keyof GridData);
      
      analyses.push({
        grid: gridName as keyof GridData,
        value,
        wuxing,
        meaning,
        score,
        interpretation
      });
    }
    
    return analyses;
  }

  /**
   * 计算三才关系
   */
  private async calculateSancaiRelation(grids: GridData): Promise<SancaiData> {
    const tian = this.getNumberWuxing(grids.tiange);
    const ren = this.getNumberWuxing(grids.renge);
    const di = this.getNumberWuxing(grids.dige);
    
    const relationship = this.analyzeSancaiRelationship(tian, ren, di);
    const score = this.calculateSancaiScore(tian, ren, di);
    
    return {
      tian,
      ren,
      di,
      relationship,
      score
    };
  }

  /**
   * 根据数字获取五行属性
   */
  private getNumberWuxing(num: number): string {
    const remainder = num % 10;
    const wuxingMap: Record<number, string> = {
      1: '木', 2: '木',
      3: '火', 4: '火',
      5: '土', 6: '土',
      7: '金', 8: '金',
      9: '水', 0: '水'
    };
    return wuxingMap[remainder];
  }

  /**
   * 获取数字含义
   */
  private async getNumberMeaning(num: number, gridType: keyof GridData): Promise<{
    meaning: string;
    score: number;
    interpretation: string;
  }> {
    // 数理含义数据库（简化版）
    const numberMeanings: Record<number, {
      lucky: boolean;
      meaning: string;
      description: string;
    }> = {
      1: { lucky: true, meaning: '太极之数', description: '万物开泰，吉祥如意，功成名就' },
      2: { lucky: false, meaning: '两仪之数', description: '混沌未分，进退保守，志望难达' },
      3: { lucky: true, meaning: '三才之数', description: '天地人和，大事大业，繁荣昌盛' },
      4: { lucky: false, meaning: '四象之数', description: '万事休止，不足不满，难得平安' },
      5: { lucky: true, meaning: '五行之数', description: '五行俱权，循环相生，圆通畅达' },
      6: { lucky: true, meaning: '六爻之数', description: '发展变化，天赋美德，吉祥安泰' },
      7: { lucky: true, meaning: '七政之数', description: '精力旺盛，头脑明敏，排除万难' },
      8: { lucky: true, meaning: '八卦之数', description: '意志如铁，富于进取，功成名就' },
      9: { lucky: false, meaning: '大成之数', description: '盛极必衰，缺乏实力，难以成功' },
      10: { lucky: false, meaning: '终数', description: '万事终局，充满损耗，前途暗淡' },
      // 可以继续添加更多数字...
    };

    const meaning = numberMeanings[num] || { lucky: false, meaning: '未知', description: '需要进一步分析' };
    
    let score = meaning.lucky ? 80 : 40;
    
    // 根据格的类型调整评分
    const gridWeights = {
      tiange: 0.1,  // 天格影响较小
      renge: 0.3,   // 人格最重要
      dige: 0.25,   // 地格重要
      waige: 0.15,  // 外格中等
      zongge: 0.2   // 总格重要
    };
    
    score *= (1 + gridWeights[gridType]);
    score = Math.min(100, Math.max(0, score));

    return {
      meaning: meaning.meaning,
      score,
      interpretation: meaning.description
    };
  }

  /**
   * 分析三才关系
   */
  private analyzeSancaiRelationship(tian: string, ren: string, di: string): string {
    // 五行相生相克关系
    const shengRelation: Record<string, string> = {
      '木': '火',
      '火': '土', 
      '土': '金',
      '金': '水',
      '水': '木'
    };

    const keRelation: Record<string, string> = {
      '木': '土',
      '火': '金',
      '土': '水',
      '金': '木',
      '水': '火'
    };

    // 分析天-人关系
    let tianRenRelation = '';
    if (shengRelation[tian] === ren) {
      tianRenRelation = '天生人';
    } else if (shengRelation[ren] === tian) {
      tianRenRelation = '人生天';
    } else if (keRelation[tian] === ren) {
      tianRenRelation = '天克人';
    } else if (keRelation[ren] === tian) {
      tianRenRelation = '人克天';
    } else {
      tianRenRelation = '天人和';
    }

    // 分析人-地关系
    let renDiRelation = '';
    if (shengRelation[ren] === di) {
      renDiRelation = '人生地';
    } else if (shengRelation[di] === ren) {
      renDiRelation = '地生人';
    } else if (keRelation[ren] === di) {
      renDiRelation = '人克地';
    } else if (keRelation[di] === ren) {
      renDiRelation = '地克人';
    } else {
      renDiRelation = '人地和';
    }

    return `${tianRenRelation}，${renDiRelation}`;
  }

  /**
   * 计算三才评分
   */
  private calculateSancaiScore(tian: string, ren: string, di: string): number {
    const shengRelation: Record<string, string> = {
      '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
    };

    const keRelation: Record<string, string> = {
      '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
    };

    let score = 50; // 基础分

    // 天-人关系评分
    if (shengRelation[tian] === ren) {
      score += 25; // 天生人，大吉
    } else if (shengRelation[ren] === tian) {
      score += 15; // 人生天，中吉
    } else if (keRelation[tian] === ren) {
      score -= 20; // 天克人，不利
    } else if (keRelation[ren] === tian) {
      score -= 10; // 人克天，小不利
    } else {
      score += 5; // 天人和，平吉
    }

    // 人-地关系评分
    if (shengRelation[ren] === di) {
      score += 25; // 人生地，大吉
    } else if (shengRelation[di] === ren) {
      score += 15; // 地生人，中吉
    } else if (keRelation[ren] === di) {
      score -= 20; // 人克地，不利
    } else if (keRelation[di] === ren) {
      score -= 10; // 地克人，小不利
    } else {
      score += 5; // 人地和，平吉
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 三才分析
   */
  private async analyzeSancai(sancai: SancaiData): Promise<SancaiAnalysis> {
    const { tian, ren, di, score } = sancai;
    
    let relationship: SancaiAnalysis['relationship'];
    if (score >= 90) relationship = 'excellent';
    else if (score >= 75) relationship = 'good';
    else if (score >= 60) relationship = 'average';
    else if (score >= 40) relationship = 'poor';
    else relationship = 'bad';

    const interpretation = this.getSancaiInterpretation(tian, ren, di, relationship);
    const effects = this.getSancaiEffects(tian, ren, di);

    return {
      combination: `${tian}${ren}${di}`,
      relationship,
      score,
      interpretation,
      effects
    };
  }

  /**
   * 获取三才解释
   */
  private getSancaiInterpretation(tian: string, ren: string, di: string, relationship: string): string {
    const baseInterpretations: Record<string, string> = {
      'excellent': '三才配置极佳，天时地利人和，必有大成就。',
      'good': '三才配置良好，多能成功发达，基础稳固。',
      'average': '三才配置一般，需要努力才能有所成就。',
      'poor': '三才配置欠佳，容易遇到困难，需谨慎行事。',
      'bad': '三才配置不利，多有挫折，需要加倍努力。'
    };

    const specific = `天才${tian}、人才${ren}、地才${di}的组合`;
    return `${specific}，${baseInterpretations[relationship]}`;
  }

  /**
   * 获取三才影响
   */
  private getSancaiEffects(tian: string, ren: string, di: string): SancaiAnalysis['effects'] {
    // 简化的五行特质映射
    const wuxingTraits: Record<string, {
      personality: string;
      career: string; 
      health: string;
      relationships: string;
    }> = {
      '木': {
        personality: '仁慈温和，积极向上',
        career: '适合教育、文化、林业等行业',
        health: '注意肝胆系统保养',
        relationships: '人际关系和谐，得贵人相助'
      },
      '火': {
        personality: '热情活泼，聪明伶俐',
        career: '适合技术、文艺、服务等行业',
        health: '注意心血管系统保养',
        relationships: '人缘佳，朋友众多'
      },
      '土': {
        personality: '稳重踏实，忠诚可靠',
        career: '适合建筑、房地产、农业等',
        health: '注意脾胃消化系统',
        relationships: '重情重义，关系稳定'
      },
      '金': {
        personality: '刚毅果断，执行力强',
        career: '适合金融、机械、医疗等',
        health: '注意呼吸系统保养',
        relationships: '讲究原则，选择性交友'
      },
      '水': {
        personality: '智慧灵活，适应性强',
        career: '适合商贸、物流、咨询等',
        health: '注意肾脏泌尿系统',
        relationships: '变通性强，广结善缘'
      }
    };

    // 以人格（中才）为主，结合天格和地格影响
    const primaryTraits = wuxingTraits[ren];
    const tianInfluence = wuxingTraits[tian];
    const diInfluence = wuxingTraits[di];

    return {
      personality: `${primaryTraits.personality}，受${tian}才影响${tianInfluence.personality.slice(0, 4)}，受${di}才影响${diInfluence.personality.slice(0, 4)}`,
      career: primaryTraits.career,
      health: primaryTraits.health,
      relationships: primaryTraits.relationships
    };
  }

  /**
   * 计算总评分
   */
  private calculateOverallScore(gridAnalyses: GridAnalysis[], sancaiAnalysis: SancaiAnalysis): number {
    // 各格权重
    const gridWeights = {
      tiange: 0.1,
      renge: 0.3,
      dige: 0.25,
      waige: 0.15,
      zongge: 0.2
    };

    // 计算加权平均格局分数
    let gridScore = 0;
    gridAnalyses.forEach(analysis => {
      gridScore += analysis.score * gridWeights[analysis.grid];
    });

    // 三才分数权重40%，格局分数权重60%
    const overallScore = gridScore * 0.6 + sancaiAnalysis.score * 0.4;
    
    return Math.round(overallScore);
  }

  /**
   * 生成建议
   */
  private generateRecommendations(
    gridAnalyses: GridAnalysis[],
    sancaiAnalysis: SancaiAnalysis,
    overallScore: number
  ): string[] {
    const recommendations: string[] = [];

    // 总体评价
    if (overallScore >= 90) {
      recommendations.push('三才五格配置极佳，姓名格局上乘，有利于人生发展');
    } else if (overallScore >= 75) {
      recommendations.push('三才五格配置良好，整体格局不错，可以考虑使用');
    } else if (overallScore >= 60) {
      recommendations.push('三才五格配置一般，建议结合其他因素综合考虑');
    } else {
      recommendations.push('三才五格配置欠佳，建议重新考虑字符组合');
    }

    // 三才建议
    if (sancaiAnalysis.relationship === 'excellent' || sancaiAnalysis.relationship === 'good') {
      recommendations.push(`三才${sancaiAnalysis.combination}配置${sancaiAnalysis.relationship === 'excellent' ? '极佳' : '良好'}，有利于性格发展和事业成功`);
    } else if (sancaiAnalysis.relationship === 'poor' || sancaiAnalysis.relationship === 'bad') {
      recommendations.push(`三才配置需要改善，当前${sancaiAnalysis.combination}组合可能影响运势发展`);
    }

    // 格局建议
    const weakGrids = gridAnalyses.filter(analysis => analysis.score < 60);
    if (weakGrids.length > 0) {
      const gridNames = { tiange: '天格', renge: '人格', dige: '地格', waige: '外格', zongge: '总格' };
      const weakGridNames = weakGrids.map(grid => gridNames[grid.grid]).join('、');
      recommendations.push(`${weakGridNames}评分较低，建议调整字符笔画以改善格局`);
    }

    // 重点提醒
    const renge = gridAnalyses.find(analysis => analysis.grid === 'renge');
    if (renge && renge.score < 60) {
      recommendations.push('人格为姓名之核心，当前人格评分偏低，强烈建议优化');
    }

    return recommendations;
  }
}
