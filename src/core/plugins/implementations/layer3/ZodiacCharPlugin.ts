/**
 * 生肖用字插件 - Layer 3
 * 根据生肖属性评估汉字的宜用性，包括生肖喜忌、字形匹配等
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
  
  import { QimingDataLoader } from '../../../common/data-loader';
  
  export type ZodiacAnimal = '鼠' | '牛' | '虎' | '兔' | '龙' | '蛇' | '马' | '羊' | '猴' | '鸡' | '狗' | '猪';
  
  export interface ZodiacCharacterEvaluation {
    character: string;
    zodiac: ZodiacAnimal;
    suitability: 'excellent' | 'good' | 'average' | 'poor' | 'avoid';
    score: number;
    reasons: {
      positive: string[];
      negative: string[];
      neutral: string[];
    };
    radicalAnalysis?: {
      radical: string;
      meaning: string;
      compatibility: 'favorable' | 'neutral' | 'unfavorable';
    };
    shapeAnalysis?: {
      shapeType: string;
      compatibility: 'favorable' | 'neutral' | 'unfavorable';
      explanation: string;
    };
  }
  
  export interface ZodiacPreferences {
    zodiac: ZodiacAnimal;
    favorableElements: string[];
    unfavorableElements: string[];
    favorableRadicals: string[];
    unfavorableRadicals: string[];
    favorableShapes: string[];
    unfavorableShapes: string[];
    seasonalPreferences?: string[];
    environmentalPreferences?: string[];
  }
  
  export interface DualZodiacAnalysis {
    primaryZodiac: ZodiacAnimal;
    fallbackZodiac: ZodiacAnimal;
    primaryEvaluation: ZodiacCharacterEvaluation;
    fallbackEvaluation: ZodiacCharacterEvaluation;
    combinedScore: number;
    recommendation: 'use-primary' | 'use-fallback' | 'use-conservative' | 'avoid';
    riskAnalysis: string[];
  }
  
  export class ZodiacCharPlugin implements NamingPlugin {
    readonly id = 'zodiac-char';
    readonly version = '1.0.0';
    readonly layer = 3;
    readonly dependencies: PluginDependency[] = [
      { pluginId: 'zodiac', required: true }
    ];
    readonly metadata: PluginMetadata = {
      name: '生肖用字分析插件',
      description: '根据生肖属性评估汉字的宜用性，提供生肖匹配度分析',
      author: 'System',
      category: 'evaluation',
      tags: ['zodiac', 'character-analysis', 'compatibility', 'traditional']
    };
  
    private config: PluginConfig | null = null;
    private dataLoader: QimingDataLoader;
    private zodiacPreferences: Map<ZodiacAnimal, ZodiacPreferences> = new Map();
    private radicalMeanings: Map<string, string> = new Map();
  
    constructor() {
      this.dataLoader = QimingDataLoader.getInstance();
    }
  
    /**
     * 初始化插件
     */
    async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
      this.config = config;
      
      try {
        // 加载生肖偏好数据
        await this.loadZodiacPreferences();
        await this.loadRadicalMeanings();
        
        context.log('info', `生肖用字插件初始化完成, 版本: ${this.version}`);
        context.log('info', `已加载 ${this.zodiacPreferences.size} 个生肖的用字偏好`);
      } catch (error) {
        context.log('error', '生肖用字数据加载失败', error);
        throw error;
      }
    }
  
    /**
     * 处理生肖用字分析
     */
    async process(input: StandardInput): Promise<PluginOutput> {
      const startTime = Date.now();
      
      const { characters } = input.data;
      if (!characters || characters.length === 0) {
        throw new Error('缺少字符数据');
      }
  
          // 获取生肖数据
    const zodiacData = input.context.pluginResults.get('zodiac');
      if (!zodiacData) {
        throw new Error('缺少生肖信息，请确保生肖插件已执行');
      }
  
      try {
        let results;
  
        if (zodiacData.strategy === 'dual-zodiac') {
          // 双生肖分析
          results = await this.processDualZodiacAnalysis(characters, zodiacData);
        } else {
          // 单生肖分析
          results = await this.processSingleZodiacAnalysis(characters, zodiacData);
        }
  
        return {
          pluginId: this.id,
          results,
          confidence: this.calculateConfidence(zodiacData, results),
          metadata: {
            processingTime: Date.now() - startTime,
            zodiacStrategy: zodiacData.strategy || 'single-zodiac',
            version: this.version,
            characterCount: characters.length
          }
        };
  
      } catch (error) {
        throw new Error(`生肖用字分析失败: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  
    /**
     * 验证输入数据
     */
    validate(input: StandardInput): ValidationResult {
      const errors: string[] = [];
      const warnings: string[] = [];
  
      // 检查是否有字符数据
      if (!input.data.characters || input.data.characters.length === 0) {
        errors.push('缺少字符数据');
      }
  
          // 检查是否有生肖数据
    const zodiacData = input.context.pluginResults.get('zodiac');
      if (!zodiacData) {
        errors.push('缺少生肖信息，请确保生肖插件已执行');
      }
  
      // 检查字符是否为汉字
      if (input.data.characters) {
        for (const char of input.data.characters) {
          if (!this.isChineseCharacter(char)) {
            warnings.push(`字符 "${char}" 不是标准汉字，生肖分析可能不准确`);
          }
          if (char.length !== 1) {
            errors.push(`字符 "${char}" 长度不正确，应为单个汉字`);
          }
        }
      }
  
      return {
        valid: errors.length === 0,
        errors,
        warnings
      };
    }
  
    /**
     * 销毁插件
     */
    async destroy(): Promise<void> {
      this.zodiacPreferences.clear();
      this.radicalMeanings.clear();
    }
  
    /**
     * 检查插件是否可用
     */
    isAvailable(): boolean {
      return this.zodiacPreferences.size === 12; // 应该有12个生肖的数据
    }
  
    /**
     * 获取插件健康状态
     */
    getHealthStatus() {
      const zodiacCount = this.zodiacPreferences.size;
      const radicalCount = this.radicalMeanings.size;
      
      if (zodiacCount !== 12) {
        return {
          status: 'unhealthy' as const,
          message: `生肖数据不完整 (${zodiacCount}/12)`,
          lastCheck: Date.now()
        };
      } else if (radicalCount < 50) {
        return {
          status: 'degraded' as const,
          message: `偏旁部首数据不足 (${radicalCount} 个)`,
          lastCheck: Date.now()
        };
      } else {
        return {
          status: 'healthy' as const,
          message: `生肖用字数据正常 (${zodiacCount} 生肖, ${radicalCount} 部首)`,
          lastCheck: Date.now()
        };
      }
    }
  
    /**
     * 加载生肖偏好数据
     */
    private async loadZodiacPreferences(): Promise<void> {
      const zodiacData = {
        '鼠': {
          favorableElements: ['水', '木', '金'],
          unfavorableElements: ['火', '土'],
          favorableRadicals: ['氵', '冰', '艹', '木', '禾', '米', '豆'],
          unfavorableRadicals: ['火', '灬', '日', '午', '马'],
          favorableShapes: ['洞穴', '房屋', '谷物'],
          unfavorableShapes: ['开放', '暴露'],
          environmentalPreferences: ['夜间', '隐秘', '储藏']
        },
        '牛': {
          favorableElements: ['土', '水', '木'],
          unfavorableElements: ['火', '金'],
          favorableRadicals: ['氵', '艹', '禾', '豆', '米', '麦'],
          unfavorableRadicals: ['火', '灬', '日', '心', '忄'],
          favorableShapes: ['平原', '田野', '稳重'],
          unfavorableShapes: ['尖锐', '不稳'],
          environmentalPreferences: ['田园', '草原', '稳定']
        },
        '虎': {
          favorableElements: ['木', '火', '土'],
          unfavorableElements: ['金', '水'],
          favorableRadicals: ['木', '林', '山', '王', '君', '令'],
          unfavorableRadicals: ['人', '亻', '门', '申', '袁'],
          favorableShapes: ['威武', '高大', '森林'],
          unfavorableShapes: ['笼子', '束缚'],
          environmentalPreferences: ['山林', '王者', '自由']
        },
        '兔': {
          favorableElements: ['木', '水', '火'],
          unfavorableElements: ['金', '土'],
          favorableRadicals: ['艹', '木', '月', '口', '宀'],
          unfavorableRadicals: ['酉', '西', '金', '刀', '力'],
          favorableShapes: ['草原', '安全', '柔美'],
          unfavorableShapes: ['尖锐', '威胁'],
          environmentalPreferences: ['月夜', '草地', '安静']
        },
        '龙': {
          favorableElements: ['水', '金', '土'],
          unfavorableElements: ['木', '火'],
          favorableRadicals: ['氵', '雨', '云', '王', '大', '君'],
          unfavorableRadicals: ['犭', '虫', '小', '臣'],
          favorableShapes: ['威严', '辽阔', '升腾'],
          unfavorableShapes: ['渺小', '低下'],
          environmentalPreferences: ['云天', '大海', '尊贵']
        },
        '蛇': {
          favorableElements: ['火', '土', '金'],
          unfavorableElements: ['水', '木'],
          favorableRadicals: ['口', '宀', '艹', '木', '衣'],
          unfavorableRadicals: ['氵', '亻', '人', '虫'],
          favorableShapes: ['蜿蜒', '隐蔽', '优雅'],
          unfavorableShapes: ['直线', '暴露'],
          environmentalPreferences: ['温暖', '隐秘', '草丛']
        },
        '马': {
          favorableElements: ['火', '木', '土'],
          unfavorableElements: ['水', '金'],
          favorableRadicals: ['艹', '木', '禾', '火', '纟'],
          unfavorableRadicals: ['氵', '车', '石', '田'],
          favorableShapes: ['奔跑', '自由', '开阔'],
          unfavorableShapes: ['束缚', '狭窄'],
          environmentalPreferences: ['草原', '奔驰', '自由']
        },
        '羊': {
          favorableElements: ['土', '木', '火'],
          unfavorableElements: ['水', '金'],
          favorableRadicals: ['艹', '木', '禾', '口', '山'],
          unfavorableRadicals: ['氵', '心', '忄', '犭'],
          favorableShapes: ['群体', '和谐', '温顺'],
          unfavorableShapes: ['孤独', '激进'],
          environmentalPreferences: ['草原', '群居', '和平']
        },
        '猴': {
          favorableElements: ['金', '水', '木'],
          unfavorableElements: ['火', '土'],
          favorableRadicals: ['木', '林', '山', '王', '君'],
          unfavorableRadicals: ['火', '灬', '石', '刀'],
          favorableShapes: ['灵活', '跳跃', '聪明'],
          unfavorableShapes: ['笨重', '呆板'],
          environmentalPreferences: ['森林', '山峰', '活跃']
        },
        '鸡': {
          favorableElements: ['土', '金', '水'],
          unfavorableElements: ['木', '火'],
          favorableRadicals: ['米', '豆', '虫', '艹', '禾'],
          unfavorableRadicals: ['犭', '狗', '人', '大'],
          favorableShapes: ['精细', '美丽', '准时'],
          unfavorableShapes: ['粗糙', '随意'],
          environmentalPreferences: ['庭院', '觅食', '规律']
        },
        '狗': {
          favorableElements: ['土', '金', '火'],
          unfavorableElements: ['木', '水'],
          favorableRadicals: ['人', '亻', '宀', '心', '忄'],
          unfavorableRadicals: ['鸡', '酉', '木', '禾'],
          favorableShapes: ['忠诚', '守护', '活跃'],
          unfavorableShapes: ['背叛', '懒散'],
          environmentalPreferences: ['家庭', '守护', '忠诚']
        },
        '猪': {
          favorableElements: ['水', '木', '土'],
          unfavorableElements: ['火', '金'],
          favorableRadicals: ['氵', '艹', '木', '禾', '豆', '米'],
          unfavorableRadicals: ['火', '灬', '日', '刀', '力'],
          favorableShapes: ['圆润', '安逸', '丰富'],
          unfavorableShapes: ['尖锐', '贫瘠'],
          environmentalPreferences: ['水边', '丰收', '安逸']
        }
      };
  
      for (const [zodiac, preferences] of Object.entries(zodiacData)) {
        this.zodiacPreferences.set(zodiac as ZodiacAnimal, preferences as ZodiacPreferences);
      }
    }
  
    /**
     * 加载偏旁部首含义
     */
    private async loadRadicalMeanings(): Promise<void> {
      const radicalData = {
        '氵': '水流',
        '艹': '草木',
        '木': '树木',
        '火': '火焰',
        '土': '土地',
        '金': '金属',
        '心': '心情',
        '忄': '情感',
        '人': '人类',
        '亻': '人旁',
        '口': '口腔',
        '宀': '房屋',
        '山': '山峰',
        '王': '君王',
        '君': '君主',
        '禾': '谷物',
        '米': '稻米',
        '豆': '豆类',
        '鸟': '飞鸟',
        '虫': '昆虫',
        '犭': '动物',
        '月': '月亮',
        '日': '太阳',
        '石': '石头',
        '刀': '刀具',
        '力': '力量'
      };
  
      for (const [radical, meaning] of Object.entries(radicalData)) {
        this.radicalMeanings.set(radical, meaning);
      }
    }
  
    /**
     * 单生肖分析
     */
    private async processSingleZodiacAnalysis(characters: string[], zodiacData: any) {
      const zodiac = zodiacData.primaryZodiac || zodiacData.zodiac;
      
      const evaluations = await Promise.all(
        characters.map(char => this.evaluateCharacterForZodiac(char, zodiac))
      );
  
      const overallScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length;
      const recommendations = this.generateSingleZodiacRecommendations(evaluations, zodiac);
  
      return {
        type: 'single-zodiac',
        zodiac,
        evaluations,
        overallScore: Math.round(overallScore),
        recommendations,
        summary: this.generateZodiacSummary(evaluations, zodiac)
      };
    }
  
    /**
     * 双生肖分析
     */
    private async processDualZodiacAnalysis(characters: string[], zodiacData: any) {
      const { primaryZodiac, fallbackZodiac, confidence } = zodiacData;
      
      const dualAnalyses = await Promise.all(
        characters.map(char => this.evaluateCharacterForDualZodiac(char, primaryZodiac, fallbackZodiac))
      );
  
      const overallScore = dualAnalyses.reduce((sum, analysis) => sum + analysis.combinedScore, 0) / dualAnalyses.length;
      const recommendations = this.generateDualZodiacRecommendations(dualAnalyses, primaryZodiac, fallbackZodiac);
  
      return {
        type: 'dual-zodiac',
        primaryZodiac,
        fallbackZodiac,
        analyses: dualAnalyses,
        overallScore: Math.round(overallScore),
        recommendations,
        strategy: 'conservative-approach',
        riskMinimization: this.generateRiskMinimizationStrategy(dualAnalyses)
      };
    }
  
    /**
     * 评估单个字符对特定生肖的适宜性
     */
    private async evaluateCharacterForZodiac(character: string, zodiac: ZodiacAnimal): Promise<ZodiacCharacterEvaluation> {
      const preferences = this.zodiacPreferences.get(zodiac);
      if (!preferences) {
        throw new Error(`未找到生肖 ${zodiac} 的偏好数据`);
      }
  
      const reasons = { positive: [], negative: [], neutral: [] };
      let score = 50; // 基础分数
  
      // 偏旁部首分析
      const radicalAnalysis = this.analyzeRadical(character, preferences);
      if (radicalAnalysis) {
        if (radicalAnalysis.compatibility === 'favorable') {
          score += 20;
          reasons.positive.push(`含${radicalAnalysis.radical}旁，${radicalAnalysis.meaning}，适合${zodiac}`);
        } else if (radicalAnalysis.compatibility === 'unfavorable') {
          score -= 15;
          reasons.negative.push(`含${radicalAnalysis.radical}旁，${radicalAnalysis.meaning}，不宜${zodiac}`);
        } else {
          reasons.neutral.push(`含${radicalAnalysis.radical}旁，${radicalAnalysis.meaning}，对${zodiac}影响中性`);
        }
      }
  
      // 字形结构分析
      const shapeAnalysis = this.analyzeShape(character, preferences);
      if (shapeAnalysis) {
        if (shapeAnalysis.compatibility === 'favorable') {
          score += 15;
          reasons.positive.push(shapeAnalysis.explanation);
        } else if (shapeAnalysis.compatibility === 'unfavorable') {
          score -= 10;
          reasons.negative.push(shapeAnalysis.explanation);
        } else {
          reasons.neutral.push(shapeAnalysis.explanation);
        }
      }
  
      // 语义分析
      const meaningScore = this.analyzeMeaning(character, preferences);
      score += meaningScore.score;
      if (meaningScore.reasons.length > 0) {
        if (meaningScore.score > 0) {
          reasons.positive.push(...meaningScore.reasons);
        } else if (meaningScore.score < 0) {
          reasons.negative.push(...meaningScore.reasons);
        } else {
          reasons.neutral.push(...meaningScore.reasons);
        }
      }
  
      // 确保分数在合理范围内
      score = Math.max(0, Math.min(100, score));
  
      // 确定适宜性等级
      let suitability: ZodiacCharacterEvaluation['suitability'];
      if (score >= 85) suitability = 'excellent';
      else if (score >= 70) suitability = 'good';
      else if (score >= 50) suitability = 'average';
      else if (score >= 30) suitability = 'poor';
      else suitability = 'avoid';
  
      return {
        character,
        zodiac,
        suitability,
        score: Math.round(score),
        reasons,
        radicalAnalysis,
        shapeAnalysis
      };
    }
  
    /**
     * 双生肖字符评估
     */
    private async evaluateCharacterForDualZodiac(
      character: string, 
      primaryZodiac: ZodiacAnimal, 
      fallbackZodiac: ZodiacAnimal
    ): Promise<DualZodiacAnalysis> {
      const primaryEval = await this.evaluateCharacterForZodiac(character, primaryZodiac);
      const fallbackEval = await this.evaluateCharacterForZodiac(character, fallbackZodiac);
  
      // 保守策略：取较低分数的70%加上较高分数的30%
      const combinedScore = Math.round(
        Math.min(primaryEval.score, fallbackEval.score) * 0.7 + 
        Math.max(primaryEval.score, fallbackEval.score) * 0.3
      );
  
      // 决策逻辑
      let recommendation: DualZodiacAnalysis['recommendation'];
      const minScore = Math.min(primaryEval.score, fallbackEval.score);
      const maxScore = Math.max(primaryEval.score, fallbackEval.score);
  
      if (minScore >= 70) {
        recommendation = primaryEval.score >= fallbackEval.score ? 'use-primary' : 'use-fallback';
      } else if (maxScore >= 60) {
        recommendation = 'use-conservative';
      } else {
        recommendation = 'avoid';
      }
  
      // 风险分析
      const riskAnalysis = this.analyzeRisks(primaryEval, fallbackEval);
  
      return {
        primaryZodiac,
        fallbackZodiac,
        primaryEvaluation: primaryEval,
        fallbackEvaluation: fallbackEval,
        combinedScore,
        recommendation,
        riskAnalysis
      };
    }
  
    /**
     * 分析偏旁部首
     */
    private analyzeRadical(character: string, preferences: ZodiacPreferences) {
      for (const radical of preferences.favorableRadicals) {
        if (character.includes(radical)) {
          return {
            radical,
            meaning: this.radicalMeanings.get(radical) || '特殊符号',
            compatibility: 'favorable' as const
          };
        }
      }
  
      for (const radical of preferences.unfavorableRadicals) {
        if (character.includes(radical)) {
          return {
            radical,
            meaning: this.radicalMeanings.get(radical) || '特殊符号',
            compatibility: 'unfavorable' as const
          };
        }
      }
  
      // 检查其他常见偏旁
      for (const [radical, meaning] of this.radicalMeanings) {
        if (character.includes(radical)) {
          return {
            radical,
            meaning,
            compatibility: 'neutral' as const
          };
        }
      }
  
      return null;
    }
  
    /**
     * 分析字形结构
     */
    private analyzeShape(character: string, preferences: ZodiacPreferences) {
      // 简化的字形分析
      const charCode = character.charCodeAt(0);
      const shapeFeatures = [];
  
      // 基于字符编码范围推断字形特征
      if (charCode >= 0x4e00 && charCode <= 0x5000) {
        shapeFeatures.push('简洁');
      } else if (charCode >= 0x5000 && charCode <= 0x6000) {
        shapeFeatures.push('中等');
      } else {
        shapeFeatures.push('复杂');
      }
  
      // 检查是否匹配生肖偏好
      for (const favorableShape of preferences.favorableShapes) {
        if (shapeFeatures.some(feature => feature === favorableShape)) {
          return {
            shapeType: favorableShape,
            compatibility: 'favorable' as const,
            explanation: `字形${favorableShape}，符合${preferences.zodiac}特性`
          };
        }
      }
  
      return {
        shapeType: shapeFeatures[0],
        compatibility: 'neutral' as const,
        explanation: `字形${shapeFeatures[0]}，对生肖影响中性`
      };
    }
  
    /**
     * 分析字义
     */
    private analyzeMeaning(character: string, preferences: ZodiacPreferences): { score: number; reasons: string[] } {
      // 简化的字义分析
      const meaningKeywords = {
        '水': ['水', '河', '江', '海', '湖', '泉', '雨', '雪'],
        '木': ['木', '林', '森', '树', '花', '草', '叶', '竹'],
        '火': ['火', '光', '明', '亮', '热', '阳', '炎', '焰'],
        '土': ['土', '山', '石', '地', '田', '园', '城', '墙'],
        '金': ['金', '银', '铁', '钢', '刀', '剑', '钟', '锋']
      };
  
      let score = 0;
      const reasons = [];
  
      // 检查五行偏好
      for (const element of preferences.favorableElements) {
        const keywords = meaningKeywords[element as keyof typeof meaningKeywords] || [];
        for (const keyword of keywords) {
          if (character.includes(keyword)) {
            score += 10;
            reasons.push(`含${keyword}字根，五行属${element}，适合此生肖`);
            break;
          }
        }
      }
  
      for (const element of preferences.unfavorableElements) {
        const keywords = meaningKeywords[element as keyof typeof meaningKeywords] || [];
        for (const keyword of keywords) {
          if (character.includes(keyword)) {
            score -= 8;
            reasons.push(`含${keyword}字根，五行属${element}，不宜此生肖`);
            break;
          }
        }
      }
  
      return { score, reasons };
    }
  
    /**
     * 风险分析
     */
    private analyzeRisks(primaryEval: ZodiacCharacterEvaluation, fallbackEval: ZodiacCharacterEvaluation): string[] {
      const risks = [];
  
      const scoreDiff = Math.abs(primaryEval.score - fallbackEval.score);
      if (scoreDiff > 30) {
        risks.push(`两个生肖的评分差异较大 (${scoreDiff}分)`);
      }
  
      if (primaryEval.suitability === 'avoid' || fallbackEval.suitability === 'avoid') {
        risks.push('在某个生肖下评级为"避免使用"');
      }
  
      if (primaryEval.reasons.negative.length > 2 || fallbackEval.reasons.negative.length > 2) {
        risks.push('存在较多不利因素');
      }
  
      if (risks.length === 0) {
        risks.push('风险较低，适合保守使用');
      }
  
      return risks;
    }
  
    /**
     * 生成单生肖建议
     */
    private generateSingleZodiacRecommendations(evaluations: ZodiacCharacterEvaluation[], zodiac: ZodiacAnimal): string[] {
      const recommendations = [];
      const avgScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length;
  
      if (avgScore >= 80) {
        recommendations.push(`字符与${zodiac}年生肖匹配度很高，建议使用`);
      } else if (avgScore >= 60) {
        recommendations.push(`字符与${zodiac}年生肖匹配度良好`);
      } else {
        recommendations.push(`字符与${zodiac}年生肖匹配度一般，建议考虑调整`);
      }
  
      const poorEvals = evaluations.filter(evaluation => evaluation.suitability === 'poor' || evaluation.suitability === 'avoid');
      if (poorEvals.length > 0) {
        recommendations.push(`字符 ${poorEvals.map(e => e.character).join('、')} 与${zodiac}年不够匹配`);
      }
  
      return recommendations;
    }
  
    /**
     * 生成双生肖建议
     */
    private generateDualZodiacRecommendations(
      analyses: DualZodiacAnalysis[], 
      primaryZodiac: ZodiacAnimal, 
      fallbackZodiac: ZodiacAnimal
    ): string[] {
      const recommendations = [];
      const avgScore = analyses.reduce((sum, analysis) => sum + analysis.combinedScore, 0) / analyses.length;
  
      recommendations.push(`采用${primaryZodiac}/${fallbackZodiac}双生肖保守策略`);
  
      if (avgScore >= 70) {
        recommendations.push('字符在双生肖下均表现良好，风险较低');
      } else if (avgScore >= 50) {
        recommendations.push('字符在双生肖下表现中等，可以接受');
      } else {
        recommendations.push('字符在双生肖下风险较高，建议重新选择');
      }
  
      const avoidCount = analyses.filter(a => a.recommendation === 'avoid').length;
      if (avoidCount > 0) {
        recommendations.push(`${avoidCount}个字符建议避免使用`);
      }
  
      return recommendations;
    }
  
    /**
     * 生成生肖总结
     */
    private generateZodiacSummary(evaluations: ZodiacCharacterEvaluation[], zodiac: ZodiacAnimal): string {
      const avgScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length;
      
      if (avgScore >= 80) {
        return `所选字符与${zodiac}年生肖高度匹配，有利于运势发展`;
      } else if (avgScore >= 60) {
        return `所选字符与${zodiac}年生肖较为匹配，整体协调`;
      } else {
        return `所选字符与${zodiac}年生肖匹配度有待提升`;
      }
    }
  
    /**
     * 生成风险最小化策略
     */
    private generateRiskMinimizationStrategy(analyses: DualZodiacAnalysis[]): string[] {
      const strategies = [];
  
      const highRiskCount = analyses.filter(a => a.riskAnalysis.length > 2).length;
      if (highRiskCount > 0) {
        strategies.push('优先考虑风险较低的字符');
      }
  
      const conservativeCount = analyses.filter(a => a.recommendation === 'use-conservative').length;
      if (conservativeCount > 0) {
        strategies.push('对不确定字符采用保守评估');
      }
  
      strategies.push('综合考虑两个生肖的影响，避免极端选择');
  
      return strategies;
    }
  
    /**
     * 计算置信度
     */
    private calculateConfidence(zodiacData: any, results: any): number {
      let baseConfidence = zodiacData.confidence || 0.8;
  
      // 根据生肖策略调整
      if (zodiacData.strategy === 'dual-zodiac') {
        baseConfidence *= 0.85; // 双生肖降低置信度
      }
  
      // 根据结果质量调整
      if (results.overallScore) {
        const scoreRatio = results.overallScore / 100;
        baseConfidence = baseConfidence * (0.8 + 0.2 * scoreRatio);
      }
  
      return Math.min(0.95, baseConfidence);
    }
  
    /**
     * 检查是否为中文字符
     */
    private isChineseCharacter(char: string): boolean {
      const unicode = char.charCodeAt(0);
      return (unicode >= 0x4e00 && unicode <= 0x9fff) || // 基本汉字
             (unicode >= 0x3400 && unicode <= 0x4dbf) || // 扩展A
             (unicode >= 0x20000 && unicode <= 0x2a6df);  // 扩展B
    }
  }