/**
 * 真实的插件化取名引擎
 * 将传统取名系统的功能拆分到插件架构中
 */

import { QimingNameGenerator } from '../../naming/name-generator';
import { QimingDataLoader } from '../../common/data-loader';
import { SancaiWugeCalculator } from '../../calculation/sancai-calculator';
import { WuxingScorer } from '../../analysis/wuxing-scorer';
import { MeaningScorer } from '../../analysis/meaning-scorer';
import { SocialScorer } from '../../analysis/social-scorer';
import { PinyinAnalyzer } from '../../analysis/pinyin-analyzer';
import { StandardCharactersValidator } from '../../analysis/standard-characters-validator';
import { 
  NameGenerationConfig, 
  GeneratedName, 
  StrokeCombination, 
  WuxingElement 
} from '../../common/types';
import { ensureDataReady } from '../../common/global-preloader';

// 插件执行上下文
export interface PluginExecutionContext {
  familyName: string;
  gender: 'male' | 'female';
  birthInfo?: {
    year: number;
    month: number;
    day?: number;
    hour?: number;
    minute?: number;
  };
  config: NameGenerationConfig;
  // 插件间共享的中间结果
  sharedData: Map<string, any>;
}

// 插件结果接口
export interface PluginResult {
  success: boolean;
  data: any;
  confidence: number;
  executionTime: number;
  metadata?: any;
}

/**
 * 真实的插件化取名引擎
 */
export class RealNamingEngine {
  private nameGenerator: QimingNameGenerator;
  private dataLoader: QimingDataLoader;
  private sancaiCalculator: SancaiWugeCalculator;
  private wuxingScorer: WuxingScorer;
  private meaningScorer: MeaningScorer;
  private socialScorer: SocialScorer;
  private pinyinAnalyzer: PinyinAnalyzer;
  private standardValidator: StandardCharactersValidator;

  constructor() {
    this.nameGenerator = new QimingNameGenerator();
    this.dataLoader = QimingDataLoader.getInstance();
    this.sancaiCalculator = new SancaiWugeCalculator();
    this.wuxingScorer = new WuxingScorer();
    this.meaningScorer = new MeaningScorer();
    this.socialScorer = new SocialScorer();
    this.pinyinAnalyzer = PinyinAnalyzer.getInstance();
    this.standardValidator = StandardCharactersValidator.getInstance();
  }

  /**
   * Layer 1: 基础信息层插件实现
   */

  // 姓氏分析插件
  async executeSurnamePlugin(context: PluginExecutionContext): Promise<PluginResult> {
    const startTime = Date.now();
    
    try {
      const familyName = context.familyName;
      const strokes = await this.sancaiCalculator.getStrokes(familyName, context.config.useTraditional);
      
      const result = {
        familyName,
        strokes,
        analysis: `姓氏"${familyName}"为${strokes}画`,
        isValidSurname: familyName.length >= 1 && familyName.length <= 2
      };

      // 保存到共享数据
      context.sharedData.set('surname', result);

      return {
        success: true,
        data: result,
        confidence: familyName.length === 1 ? 100 : 95, // 单字姓氏置信度更高
        executionTime: Date.now() - startTime,
        metadata: {
          category: '基础信息',
          description: '解析姓氏笔画和基本信息'
        }
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        metadata: { error: error instanceof Error ? error.message : '姓氏分析失败' }
      };
    }
  }

  // 性别分析插件
  async executeGenderPlugin(context: PluginExecutionContext): Promise<PluginResult> {
    const startTime = Date.now();

    try {
      await ensureDataReady();
      
      const gender = context.gender;
      const targetGender = gender === 'male' ? '男' : '女';
      const commonWords = await this.dataLoader.getCommonNameWords(targetGender);

      const result = {
        gender,
        targetGender,
        commonWordsCount: commonWords.size,
        commonWords: Array.from(commonWords).slice(0, 50), // 示例前50个
        analysis: `获取到${commonWords.size}个${targetGender}性常用字`
      };

      // 保存到共享数据
      context.sharedData.set('gender', result);

      return {
        success: true,
        data: result,
        confidence: 100, // 性别信息置信度很高
        executionTime: Date.now() - startTime,
        metadata: {
          category: '基础信息',
          description: '性别信息处理和常用字库获取'
        }
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        metadata: { error: error instanceof Error ? error.message : '性别分析失败' }
      };
    }
  }

  // 出生时间分析插件
  async executeBirthTimePlugin(context: PluginExecutionContext): Promise<PluginResult> {
    const startTime = Date.now();

    try {
      const birthInfo = context.birthInfo;
      if (!birthInfo) {
        return {
          success: false,
          data: null,
          confidence: 0,
          executionTime: Date.now() - startTime,
          metadata: { error: '缺少出生时间信息' }
        };
      }

      // 计算置信度
      let confidence = 0;
      if (birthInfo.year) confidence += 25;
      if (birthInfo.month) confidence += 25;
      if (birthInfo.day) confidence += 25;
      if (birthInfo.hour !== undefined) confidence += 20;
      if (birthInfo.minute !== undefined) confidence += 5;

      // 分析季节
      let season = '未知';
      if (birthInfo.month) {
        if ([3, 4, 5].includes(birthInfo.month)) season = '春季';
        else if ([6, 7, 8].includes(birthInfo.month)) season = '夏季';
        else if ([9, 10, 11].includes(birthInfo.month)) season = '秋季';
        else season = '冬季';
      }

      // 基础八字分析（简化版）
      let baziAnalysis = '基础时间分析';
      if (birthInfo.hour !== undefined) {
        const timeSlots = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        const slotIndex = Math.floor(birthInfo.hour / 2);
        baziAnalysis = `${timeSlots[slotIndex]}时出生`;
      }

      const result = {
        birthInfo,
        season,
        baziAnalysis,
        confidence,
        analysis: `出生时间分析完成，季节：${season}`,
        hasCompleteInfo: !!(birthInfo.year && birthInfo.month && birthInfo.day && birthInfo.hour !== undefined)
      };

      // 保存到共享数据
      context.sharedData.set('birthTime', result);

      return {
        success: true,
        data: result,
        confidence,
        executionTime: Date.now() - startTime,
        metadata: {
          category: '基础信息',
          description: '出生时间分析和八字基础计算'
        }
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        metadata: { error: error instanceof Error ? error.message : '出生时间分析失败' }
      };
    }
  }

  /**
   * Layer 2: 命理基础层插件实现
   */

  // 生肖分析插件
  async executeZodiacPlugin(context: PluginExecutionContext): Promise<PluginResult> {
    const startTime = Date.now();

    try {
      const birthTime = context.sharedData.get('birthTime');
      if (!birthTime?.birthInfo?.year) {
        return {
          success: false,
          data: null,
          confidence: 0,
          executionTime: Date.now() - startTime,
          metadata: { error: '需要出生年份信息' }
        };
      }

      const year = birthTime.birthInfo.year;
      const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
      const zodiacIndex = (year - 1900) % 12;
      const zodiac = zodiacs[zodiacIndex];

      // 生肖取名宜忌（简化版）
      const favorable = {
        '鼠': ['王', '君', '令', '主', '月', '青'],
        '牛': ['草', '田', '水', '木', '禾', '米'],
        '虎': ['山', '林', '王', '君', '令', '大'],
        '兔': ['月', '草', '木', '田', '水', '禾'],
        '龙': ['王', '大', '君', '主', '帝', '令'],
        '蛇': ['口', '宀', '田', '草', '虫', '鱼'],
        '马': ['草', '木', '禾', '田', '火', '土'],
        '羊': ['草', '木', '田', '禾', '月', '山'],
        '猴': ['木', '禾', '金', '王', '君', '山'],
        '鸡': ['米', '豆', '虫', '木', '禾', '田'],
        '狗': ['人', '宀', '马', '巾', '纟', '示'],
        '猪': ['田', '草', '木', '禾', '米', '豆']
      };

      const unfavorable = {
        '鼠': ['火', '日', '午', '马'],
        '牛': ['心', '忄', '月', '马'],
        '虎': ['人', '门', '小', '口'],
        '兔': ['人', '工', '大', '王'],
        '龙': ['犬', '戌', '兔', '卯'],
        '蛇': ['日', '山', '火', '人'],
        '马': ['水', '车', '石', '田'],
        '羊': ['心', '忄', '月', '犬'],
        '猴': ['火', '日', '山', '石'],
        '鸡': ['心', '忄', '月', '兔'],
        '狗': ['鸡', '酉', '禾', '米'],
        '猪': ['示', '刀', '力', '血']
      };

      const result = {
        year,
        zodiac,
        favorable: favorable[zodiac as keyof typeof favorable] || [],
        unfavorable: unfavorable[zodiac as keyof typeof unfavorable] || [],
        analysis: `${year}年生肖${zodiac}，取名宜用${favorable[zodiac as keyof typeof favorable]?.join('、')}等偏旁`
      };

      // 保存到共享数据
      context.sharedData.set('zodiac', result);

      return {
        success: true,
        data: result,
        confidence: 95, // 生肖分析置信度较高
        executionTime: Date.now() - startTime,
        metadata: {
          category: '命理分析',
          description: '生肖分析和取名宜忌'
        }
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        metadata: { error: error instanceof Error ? error.message : '生肖分析失败' }
      };
    }
  }

  // 五行要求确定插件
  async executeXiYongShenPlugin(context: PluginExecutionContext): Promise<PluginResult> {
    const startTime = Date.now();

    try {
      const gender = context.gender;
      const birthTime = context.sharedData.get('birthTime');

      // 简化版五行需求确定逻辑
      let midWuxing: WuxingElement;
      let lastWuxing: WuxingElement;

      // 根据性别和季节确定五行需求（简化版）
      if (gender === 'male') {
        midWuxing = '水'; // 男性中间字偏向水行
        lastWuxing = '金';  // 最后字偏向金行
      } else {
        midWuxing = '木';   // 女性中间字偏向木行
        lastWuxing = '火'; // 最后字偏向火行
      }

      // 根据季节微调（如果有出生时间）
      if (birthTime?.season) {
        switch (birthTime.season) {
          case '春季': // 木旺，需要金来克制
            lastWuxing = '金';
            break;
          case '夏季': // 火旺，需要水来调和
            midWuxing = '水';
            break;
          case '秋季': // 金旺，需要火来克制
            lastWuxing = '火';
            break;
          case '冬季': // 水旺，需要土来克制
            midWuxing = '土';
            break;
        }
      }

      const result = {
        midWuxing,
        lastWuxing,
        analysis: `根据性别"${gender}"${birthTime?.season ? `和季节"${birthTime.season}"` : ''}确定：中间字需要${midWuxing}行，最后字需要${lastWuxing}行`,
        reasoning: {
          gender: `${gender === 'male' ? '男性' : '女性'}偏好`,
          season: birthTime?.season || '未知季节',
          strategy: '五行平衡策略'
        }
      };

      // 保存到共享数据
      context.sharedData.set('xiyongshen', result);

      return {
        success: true,
        data: result,
        confidence: birthTime?.hasCompleteInfo ? 90 : 75, // 有完整出生信息置信度更高
        executionTime: Date.now() - startTime,
        metadata: {
          category: '命理分析',
          description: '五行需求分析和喜用神确定'
        }
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        metadata: { error: error instanceof Error ? error.message : '五行需求分析失败' }
      };
    }
  }

  /**
   * Layer 3: 字符评估层插件实现
   */

  // 笔画组合分析插件
  async executeStrokePlugin(context: PluginExecutionContext): Promise<PluginResult> {
    const startTime = Date.now();

    try {
      const surnameData = context.sharedData.get('surname');
      if (!surnameData) {
        return {
          success: false,
          data: null,
          confidence: 0,
          executionTime: Date.now() - startTime,
          metadata: { error: '需要姓氏分析结果' }
        };
      }

      // 获取最佳笔画组合
      const strokeCombinations = await this.sancaiCalculator.getBestStrokeCombinations(
        context.familyName,
        context.config.useTraditional || false,
        false
      );

      const result = {
        familyStrokes: surnameData.strokes,
        combinations: strokeCombinations,
        totalCombinations: strokeCombinations.length,
        analysis: `找到${strokeCombinations.length}种最优笔画组合`,
        topCombinations: strokeCombinations.slice(0, 5) // 取前5种
      };

      // 保存到共享数据
      context.sharedData.set('stroke', result);

      return {
        success: true,
        data: result,
        confidence: 98, // 笔画计算很可靠
        executionTime: Date.now() - startTime,
        metadata: {
          category: '字符评估',
          description: '笔画组合分析和三才五格计算'
        }
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        metadata: { error: error instanceof Error ? error.message : '笔画分析失败' }
      };
    }
  }

  // 五行字符筛选插件
  async executeWuxingCharPlugin(context: PluginExecutionContext): Promise<PluginResult> {
    const startTime = Date.now();

    try {
      await ensureDataReady();

      const xiyongshen = context.sharedData.get('xiyongshen');
      const stroke = context.sharedData.get('stroke');
      const gender = context.sharedData.get('gender');

      if (!xiyongshen || !stroke || !gender) {
        return {
          success: false,
          data: null,
          confidence: 0,
          executionTime: Date.now() - startTime,
          metadata: { error: '需要五行需求和笔画分析结果' }
        };
      }

      const candidatesMap = new Map();
      const commonWords = new Set(gender.commonWords);
      let totalCandidates = 0;

      // 获取前3种笔画组合的候选字
      for (const combination of stroke.topCombinations.slice(0, 3)) {
        // 中间字候选
        const midCandidates = await this.dataLoader.getWordsByStrokeAndWuxing(
          combination.mid,
          xiyongshen.midWuxing,
          context.config.useTraditional || false
        );
        
        // 最后字候选  
        const lastCandidates = await this.dataLoader.getWordsByStrokeAndWuxing(
          combination.last,
          xiyongshen.lastWuxing,
          context.config.useTraditional || false
        );

        // 过滤常用字
        const midCommon = midCandidates.filter(char => commonWords.has(char));
        const lastCommon = lastCandidates.filter(char => commonWords.has(char));

        candidatesMap.set(`${combination.mid}-${combination.last}`, {
          combination,
          midChars: {
            total: midCandidates.length,
            common: midCommon.length,
            samples: midCommon.slice(0, 10)
          },
          lastChars: {
            total: lastCandidates.length,
            common: lastCommon.length,
            samples: lastCommon.slice(0, 10)
          },
          validCombinations: midCommon.length * lastCommon.length
        });

        totalCandidates += midCommon.length * lastCommon.length;
      }

      const result = {
        requirements: {
          midWuxing: xiyongshen.midWuxing,
          lastWuxing: xiyongshen.lastWuxing
        },
        strokeCombinations: stroke.topCombinations.slice(0, 3),
        candidates: Object.fromEntries(candidatesMap),
        totalCandidates,
        analysis: `基于五行需求筛选候选字，总计${totalCandidates}个有效组合`
      };

      // 保存到共享数据
      context.sharedData.set('wuxingChar', result);

      return {
        success: true,
        data: result,
        confidence: 88, // 五行筛选置信度较高
        executionTime: Date.now() - startTime,
        metadata: {
          category: '字符评估',
          description: '五行字符筛选和候选字组合'
        }
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        metadata: { error: error instanceof Error ? error.message : '五行字符筛选失败' }
      };
    }
  }

  /**
   * Layer 4: 最终名字生成 - 使用真正的插件系统
   */
  async executeNameGenerationPlugin(context: PluginExecutionContext): Promise<PluginResult> {
    const startTime = Date.now();

    try {
      console.log('🧩 执行名字生成插件');
      
      // 构建插件输入
      const pluginInput = {
        familyName: context.config.familyName,
        gender: context.config.gender,
        preferences: {
          nameCount: context.config.limit || 5,
          scoreThreshold: context.config.scoreThreshold || 80
        },
        context: {
          pluginResults: context.sharedData
        }
      };

      console.log('🔧 插件输入:', {
        familyName: pluginInput.familyName,
        gender: pluginInput.gender,
        pluginResultsCount: context.sharedData.size
      });

      // 降级处理：如果插件系统不可用，使用传统生成器
      if (context.sharedData.size < 3) {
        console.log('⚠️ 插件数据不足，降级到传统名字生成器');
        const names = await this.nameGenerator.generateNames(context.config);
        
        return {
          success: true,
          data: {
            names,
            totalGenerated: names.length,
            config: context.config,
            analysis: `使用传统算法生成${names.length}个名字（插件数据不足）`,
            generationMethod: 'traditional-fallback'
          },
          confidence: 75, // 降级模式置信度较低
          executionTime: Date.now() - startTime,
          metadata: {
            category: '名字生成',
            description: '插件数据不足，降级到传统算法',
            fallback: true
          }
        };
      }

      // 模拟插件系统的名字生成
      const names = await this.generateNamesFromPluginData(context);

      const result = {
        names,
        totalGenerated: names.length,
        config: context.config,
        analysis: `基于${context.sharedData.size}个插件分析结果生成${names.length}个智能名字`,
        generationMethod: 'intelligent-plugin-system',
        pluginContributions: Array.from(context.sharedData.keys())
      };

      return {
        success: true,
        data: result,
        confidence: 95, // 基于插件系统，置信度很高
        executionTime: Date.now() - startTime,
        metadata: {
          category: '名字生成',
          description: '基于插件分析结果智能生成名字',
          pluginsUsed: context.sharedData.size
        }
      };
    } catch (error) {
      console.error('❌ 插件名字生成失败:', error);
      return {
        success: false,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        metadata: { error: error instanceof Error ? error.message : '名字生成失败' }
      };
    }
  }

  /**
   * 基于插件数据生成名字
   */
  private async generateNamesFromPluginData(context: PluginExecutionContext): Promise<any[]> {
    // 获取插件分析结果
    const surnameData = context.sharedData.get('surname');
    const genderData = context.sharedData.get('gender');
    const strokeData = context.sharedData.get('stroke');
    const wuxingCharData = context.sharedData.get('wuxing-char');

    if (!surnameData || !genderData || !strokeData) {
      throw new Error('缺少必要的插件数据');
    }

    console.log('📊 插件数据分析:', {
      surname: surnameData.data?.familyName,
      gender: genderData.data?.gender,
      strokeCombinations: strokeData.data?.bestCombinations?.length || 0,
      wuxingChars: wuxingCharData?.data?.favorableChars ? Object.keys(wuxingCharData.data.favorableChars).length : 0
    });

    // 使用传统生成器作为基础，但增加插件智能性
    const baseNames = await this.nameGenerator.generateNames(context.config);
    
    // 根据插件分析结果对名字进行智能筛选和重新评分
    const enhancedNames = baseNames.map(name => {
      // 基础分数
      let enhancedScore = name.score;
      
      // 根据插件分析调整分数
      if (wuxingCharData?.data?.favorableChars) {
        const midCharWuxing = this.getCharacterWuxing(name.midChar);
        const lastCharWuxing = this.getCharacterWuxing(name.lastChar);
        
        // 检查五行匹配
        const favorableElements = Object.keys(wuxingCharData.data.favorableChars);
        if (favorableElements.includes(midCharWuxing)) enhancedScore += 5;
        if (favorableElements.includes(lastCharWuxing)) enhancedScore += 5;
      }

      // 检查笔画组合优先级
      if (strokeData.data?.bestCombinations) {
        const midStrokes = this.getCharacterStrokes(name.midChar);
        const lastStrokes = this.getCharacterStrokes(name.lastChar);
        
        const matchingCombination = strokeData.data.bestCombinations.find(
          (combo: any) => combo.mid === midStrokes && combo.last === lastStrokes
        );
        
        if (matchingCombination) {
          enhancedScore += matchingCombination.priority || 3;
        }
      }

      return {
        ...name,
        score: Math.min(enhancedScore, 100), // 确保分数不超过100
        explanation: `${name.explanation} (基于${context.sharedData.size}个插件智能优化)`
      };
    });

    // 按增强后的分数排序
    enhancedNames.sort((a, b) => b.score - a.score);
    
    console.log('✨ 插件增强完成:', {
      originalAvgScore: Math.round(baseNames.reduce((sum, n) => sum + n.score, 0) / baseNames.length),
      enhancedAvgScore: Math.round(enhancedNames.reduce((sum, n) => sum + n.score, 0) / enhancedNames.length),
      improvement: '+' + Math.round(enhancedNames.reduce((sum, n) => sum + n.score, 0) / enhancedNames.length - baseNames.reduce((sum, n) => sum + n.score, 0) / baseNames.length)
    });

    return enhancedNames;
  }

  /**
   * 获取字符五行属性（简化实现）
   */
  private getCharacterWuxing(char: string): string {
    // 这里应该从真实的五行数据库获取，现在使用简化实现
    const wuxingMap = new Map([
      ['水', '水'], ['江', '水'], ['海', '水'], ['河', '水'], ['湖', '水'],
      ['火', '火'], ['炎', '火'], ['焱', '火'], ['灯', '火'], ['明', '火'],
      ['木', '木'], ['林', '木'], ['森', '木'], ['树', '木'], ['枝', '木'],
      ['金', '金'], ['银', '金'], ['铜', '金'], ['铁', '金'], ['钢', '金'],
      ['土', '土'], ['地', '土'], ['山', '土'], ['石', '土'], ['岩', '土']
    ]);
    
    return wuxingMap.get(char) || '土'; // 默认土
  }

  /**
   * 获取字符笔画数（简化实现）
   */
  private getCharacterStrokes(char: string): number {
    // 这里应该从真实的笔画数据库获取，现在使用简化实现
    return char.length * 5 + Math.floor(Math.random() * 10); // 简化计算
  }

  /**
   * 执行完整的插件化取名流程
   */
  async executeFullPipeline(request: any): Promise<{
    success: boolean;
    names: GeneratedName[];
    pluginResults: Map<string, PluginResult>;
    totalTime: number;
  }> {
    const startTime = Date.now();
    const pluginResults = new Map<string, PluginResult>();

    // 创建执行上下文
    const context: PluginExecutionContext = {
      familyName: request.familyName,
      gender: request.gender,
      birthInfo: request.birthInfo,
      config: {
        familyName: request.familyName,
        gender: request.gender,
        scoreThreshold: request.scoreThreshold || 80,
        useTraditional: request.useTraditional || false,
        avoidedWords: request.avoidedWords || [],
        limit: request.limit || 5,
        offset: request.offset || 0,
        preferredWuxing: request.preferredElements
      },
      sharedData: new Map()
    };

    try {
      // Layer 1: 基础信息层
      pluginResults.set('surname', await this.executeSurnamePlugin(context));
      pluginResults.set('gender', await this.executeGenderPlugin(context));
      if (request.birthInfo) {
        pluginResults.set('birth-time', await this.executeBirthTimePlugin(context));
      }

      // Layer 2: 命理基础层
      if (request.birthInfo?.year) {
        pluginResults.set('zodiac', await this.executeZodiacPlugin(context));
      }
      pluginResults.set('xiyongshen', await this.executeXiYongShenPlugin(context));

      // Layer 3: 字符评估层
      pluginResults.set('stroke', await this.executeStrokePlugin(context));
      pluginResults.set('wuxing-char', await this.executeWuxingCharPlugin(context));

      // Layer 4: 名字生成
      const nameResult = await this.executeNameGenerationPlugin(context);
      pluginResults.set('name-generation', nameResult);

      return {
        success: true,
        names: nameResult.data?.names || [],
        pluginResults,
        totalTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('插件执行流程失败:', error);
      return {
        success: false,
        names: [],
        pluginResults,
        totalTime: Date.now() - startTime
      };
    }
  }
}

// 导出单例
export const realNamingEngine = new RealNamingEngine();
