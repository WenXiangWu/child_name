/**
 * 名字生成插件 - Layer 4 的核心插件
 * 
 * 这个插件整合前面所有层级的分析结果，进行智能的名字生成
 * 不同于传统的QimingNameGenerator，它充分利用插件系统的分析数据
 */

import { 
  NamingPlugin, 
  PluginConfig, 
  PluginContext, 
  PluginDependency,
  StandardInput,
  PluginOutput,
  ValidationResult 
} from '../../interfaces/NamingPlugin';
import { QimingDataLoader } from '../../../common/data-loader';
import { GeneratedName } from '../../../common/types';
import { SancaiWugeCalculator } from '../../../calculation/sancai-calculator';
import { StandardCharactersValidator } from '../../../analysis/standard-characters-validator';

/**
 * 插件分析结果数据结构
 */
interface PluginAnalysisData {
  surname: {
    familyName: string;
    strokes: number;
    wuxing: string;
  };
  gender: {
    gender: 'male' | 'female';
    commonChars: Set<string>;
  };
  birthTime?: {
    bazi: string;
    season: string;
    dayMaster: string;
  };
  zodiac?: {
    animal: string;
    favorableChars: string[];
    unfavorableChars: string[];
  };
  xiyongshen?: {
    xiShen: string[];
    yongShen: string[];
    jiShen: string[];
  };
  stroke: {
    bestCombinations: Array<{
      mid: number;
      last: number;
      priority: number;
    }>;
  };
  wuxingChar: {
    requiredElements: string[];
    favorableChars: Map<string, string[]>;
    restrictedChars: Set<string>;
  };
  zodiacChar?: {
    suitableChars: Set<string>;
    unsuitableChars: Set<string>;
  };
  meaning?: {
    positiveChars: Set<string>;
    meaningfulCombinations: string[][];
  };
  phonetic?: {
    harmonicChars: Map<string, number>;
    avoidCombinations: string[][];
  };
}

/**
 * 名字候选结构
 */
interface NameCandidate {
  fullName: string;
  familyName: string;
  midChar: string;
  lastChar: string;
  score: number;
  confidence: number;
  analysis: {
    strokeAnalysis: any;
    wuxingAnalysis: any;
    sancaiAnalysis: any;
    semanticAnalysis: any;
    phoneticAnalysis: any;
  };
  reasons: string[];
}

export class NameGenerationPlugin implements NamingPlugin {
  readonly id = 'name-generation';
  readonly version = '1.0.0';
  readonly layer = 4;
  readonly dependencies: PluginDependency[] = [
    { pluginId: 'surname', required: true },
    { pluginId: 'gender', required: true },
    { pluginId: 'stroke', required: true },
    { pluginId: 'wuxing-char', required: true },
    { pluginId: 'birth-time', required: false },
    { pluginId: 'zodiac', required: false },
    { pluginId: 'xiyongshen', required: false },
    { pluginId: 'zodiac-char', required: false },
    { pluginId: 'meaning', required: false },
    { pluginId: 'phonetic', required: false }
  ];
  
  readonly metadata = {
    name: '智能名字生成插件',
    description: '基于前层插件分析结果，进行智能的名字生成和综合评分',
    author: 'Qiming Plugin System',
    category: 'output' as const,
    tags: ['name-generation', 'intelligent', 'comprehensive', 'scoring']
  };

  private dataLoader!: QimingDataLoader;
  private sancaiCalculator!: SancaiWugeCalculator;
  private standardCharValidator!: StandardCharactersValidator;
  private initialized = false;

  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    try {
      this.dataLoader = QimingDataLoader.getInstance();
      await this.dataLoader.preloadCoreData();
      
      this.sancaiCalculator = new SancaiWugeCalculator();
      
      // 初始化标准字符验证器
      this.standardCharValidator = StandardCharactersValidator.getInstance();
      await this.standardCharValidator.initialize();
      
      this.initialized = true;
      context.log?.('info', `${this.id} 插件初始化成功`);
    } catch (error) {
      context.log?.('error', `${this.id} 插件初始化失败: ${error}`);
      throw error;
    }
  }

  async process(input: StandardInput): Promise<PluginOutput> {
    if (!this.initialized) {
      throw new Error('名字生成插件未初始化');
    }

    const startTime = Date.now();

    try {
      // 1. 收集所有插件的分析结果
      const analysisData = await this.collectPluginResults(input);
      
      // 2. 生成名字候选
      const candidates = await this.generateNameCandidates(analysisData);
      
      // 3. 智能评分和排序
      const scoredNames = await this.scoreAndRankCandidates(candidates, analysisData);
      
      // 4. 转换为标准GeneratedName格式
      const finalNames = await this.convertToGeneratedNames(scoredNames);
      
      // 5. 生成详细分析报告
      const analysisReport = this.generateAnalysisReport(scoredNames, analysisData);

      const executionTime = Date.now() - startTime;
      const confidence = this.calculateOverallConfidence(analysisData);

      return {
        pluginId: this.id,
        results: {
          names: finalNames,
          totalGenerated: candidates.length,
          finalSelected: finalNames.length,
          analysisData,
          analysisReport,
          pluginContributions: this.getPluginContributions(input)
        },
        confidence,
        metadata: {
          processingTime: executionTime,
          executionTime,
          candidatesGenerated: candidates.length,
          pluginsUsed: Object.keys(analysisData).length,
          intelligentScoring: true,
          generationMethod: 'plugin-based-intelligent'
        }
      };

    } catch (error) {
      throw new Error(`名字生成失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  validate(input: StandardInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查必需的插件结果
    const requiredPlugins = ['surname', 'gender', 'stroke', 'wuxing-char'];
    for (const pluginId of requiredPlugins) {
      if (!input.context.pluginResults.has(pluginId)) {
        errors.push(`缺少必需的插件结果: ${pluginId}`);
      }
    }

    // 检查配置参数
    if (!input.data.preferences?.nameCount || input.data.preferences.nameCount < 1) {
      warnings.push('未指定生成名字数量，将使用默认值5');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }



  /**
   * 收集所有插件的分析结果
   */
  private async collectPluginResults(input: StandardInput): Promise<PluginAnalysisData> {
    const pluginResults = input.context.pluginResults;
    const data: Partial<PluginAnalysisData> = {};

    // 收集姓氏数据
    const surnameResult = pluginResults.get('surname');
    if (surnameResult?.results) {
      data.surname = {
        familyName: surnameResult.results.familyName,
        strokes: surnameResult.results.strokes,
        wuxing: surnameResult.results.wuxing || '未知'
      };
    }

    // 收集性别数据
    const genderResult = pluginResults.get('gender');
    if (genderResult?.results) {
      data.gender = {
        gender: genderResult.results.gender,
        commonChars: new Set(genderResult.results.commonChars || [])
      };
    }

    // 收集笔画数据
    const strokeResult = pluginResults.get('stroke');
    if (strokeResult?.results) {
      data.stroke = {
        bestCombinations: strokeResult.results.bestCombinations || []
      };
    }

    // 收集五行字符数据
    const wuxingCharResult = pluginResults.get('wuxing-char');
    if (wuxingCharResult?.results) {
      data.wuxingChar = {
        requiredElements: wuxingCharResult.results.requiredElements || [],
        favorableChars: new Map(Object.entries(wuxingCharResult.results.favorableChars || {})),
        restrictedChars: new Set(wuxingCharResult.results.restrictedChars || [])
      };
    }

    // 收集可选插件数据
    this.collectOptionalPluginData(pluginResults, data);

    return data as PluginAnalysisData;
  }

  /**
   * 收集可选插件数据
   */
  private collectOptionalPluginData(pluginResults: Map<string, any>, data: Partial<PluginAnalysisData>) {
    // 出生时间数据
    const birthTimeResult = pluginResults.get('birth-time');
    if (birthTimeResult?.results) {
      data.birthTime = {
        bazi: birthTimeResult.results.bazi,
        season: birthTimeResult.results.season,
        dayMaster: birthTimeResult.results.dayMaster
      };
    }

    // 生肖数据
    const zodiacResult = pluginResults.get('zodiac');
    if (zodiacResult?.results) {
      data.zodiac = {
        animal: zodiacResult.results.animal,
        favorableChars: zodiacResult.results.favorableChars || [],
        unfavorableChars: zodiacResult.results.unfavorableChars || []
      };
    }

    // 喜用神数据
    const xiyongResult = pluginResults.get('xiyongshen');
    if (xiyongResult?.results) {
      data.xiyongshen = {
        xiShen: xiyongResult.results.xiShen || [],
        yongShen: xiyongResult.results.yongShen || [],
        jiShen: xiyongResult.results.jiShen || []
      };
    }

    // 其他可选插件...
    this.collectAdditionalOptionalData(pluginResults, data);
  }

  /**
   * 收集其他可选插件数据
   */
  private collectAdditionalOptionalData(pluginResults: Map<string, any>, data: Partial<PluginAnalysisData>) {
    // 生肖字符数据
    const zodiacCharResult = pluginResults.get('zodiac-char');
    if (zodiacCharResult?.results) {
      data.zodiacChar = {
        suitableChars: new Set(zodiacCharResult.results.suitableChars || []),
        unsuitableChars: new Set(zodiacCharResult.results.unsuitableChars || [])
      };
    }

    // 语义数据
    const meaningResult = pluginResults.get('meaning');
    if (meaningResult?.results) {
      data.meaning = {
        positiveChars: new Set(meaningResult.results.positiveChars || []),
        meaningfulCombinations: meaningResult.results.meaningfulCombinations || []
      };
    }

    // 语音数据
    const phoneticResult = pluginResults.get('phonetic');
    if (phoneticResult?.results) {
      data.phonetic = {
        harmonicChars: new Map(Object.entries(phoneticResult.results.harmonicChars || {})),
        avoidCombinations: phoneticResult.results.avoidCombinations || []
      };
    }
  }

  /**
   * 生成名字候选
   */
  private async generateNameCandidates(analysisData: PluginAnalysisData): Promise<NameCandidate[]> {
    const candidates: NameCandidate[] = [];
    const { surname, gender, wuxingChar } = analysisData;
    let { stroke } = analysisData;

    // 安全检查：如果必要数据不存在，返回空数组
    if (!surname?.familyName) {
      console.warn('⚠️ 缺少姓氏信息，无法生成名字候选');
      return [];
    }

    if (!stroke?.bestCombinations || stroke.bestCombinations.length === 0) {
      console.warn('⚠️ 缺少笔画组合数据，使用默认组合');
      // 使用默认的笔画组合
      const defaultCombinations = [
        { mid: 8, last: 10, priority: 1 },
        { mid: 9, last: 15, priority: 2 },
        { mid: 11, last: 7, priority: 3 }
      ];
      stroke = { bestCombinations: defaultCombinations };
    }

    // 获取性别常用字，添加安全检查
    const commonChars = gender?.commonChars ? Array.from(gender.commonChars) : [];
    
    // 获取五行适宜字符
    const favorableChars = this.getFavorableCharacters(wuxingChar, analysisData);
    
    // 遍历最佳笔画组合
    for (const combination of stroke.bestCombinations.slice(0, 10)) { // 限制组合数量
      const midCandidates = await this.getCharactersByStroke(combination.mid, favorableChars, commonChars);
      const lastCandidates = await this.getCharactersByStroke(combination.last, favorableChars, commonChars);

      // 生成字符组合
      for (const midChar of midCandidates.slice(0, 20)) {
        for (const lastChar of lastCandidates.slice(0, 20)) {
          // 检查字符兼容性
          if (this.isCharacterCombinationValid(midChar, lastChar, analysisData)) {
            const candidate = await this.createNameCandidate(
              surname.familyName, 
              midChar, 
              lastChar, 
              analysisData
            );
            candidates.push(candidate);
          }
        }
      }
    }

    return candidates;
  }

  /**
   * 获取有利字符
   */
  private getFavorableCharacters(wuxingChar: any, analysisData: PluginAnalysisData): Set<string> {
    const favorableChars = new Set<string>();

    // 添加五行有利字符
    for (const chars of wuxingChar.favorableChars.values()) {
      chars.forEach((char: string) => favorableChars.add(char));
    }

    // 添加生肖有利字符
    if (analysisData.zodiacChar?.suitableChars) {
      analysisData.zodiacChar.suitableChars.forEach((char: string) => favorableChars.add(char));
    }

    // 添加语义积极字符
    if (analysisData.meaning?.positiveChars) {
      analysisData.meaning.positiveChars.forEach((char: string) => favorableChars.add(char));
    }

    return favorableChars;
  }

  /**
   * 根据笔画数获取字符
   */
  private async getCharactersByStroke(strokeCount: number, favorableChars: Set<string>, commonChars: string[]): Promise<string[]> {
    // 使用现有的方法获取指定笔画数的字符
    const characters = await this.dataLoader.getCharactersByStrokesFromWord(strokeCount);
    const candidates: string[] = [];

    let filteredCount = 0;
    for (const char of characters) {
      // 🔴 重要：只使用通用规范汉字表中的字符
      if (!this.standardCharValidator.isStandardCharacter(char)) {
        filteredCount++;
        continue; // 跳过非标准字符
      }

      // 优先选择有利字符和常用字符
      if (favorableChars.has(char) || commonChars.includes(char)) {
        candidates.unshift(char); // 添加到前面
      } else {
        candidates.push(char);
      }
    }
    
    console.log(`笔画${strokeCount}: 原始${characters.length}个字符, 过滤掉${filteredCount}个非标准字符, 保留${candidates.length}个标准字符`);

    return candidates;
  }

  /**
   * 检查字符组合有效性
   */
  private isCharacterCombinationValid(midChar: string, lastChar: string, analysisData: PluginAnalysisData): boolean {
    // 检查限制字符
    if (analysisData.wuxingChar.restrictedChars.has(midChar) || 
        analysisData.wuxingChar.restrictedChars.has(lastChar)) {
      return false;
    }

    // 检查生肖不宜字符
    if (analysisData.zodiacChar?.unsuitableChars.has(midChar) || 
        analysisData.zodiacChar?.unsuitableChars.has(lastChar)) {
      return false;
    }

    // 检查语音冲突
    if (analysisData.phonetic?.avoidCombinations.some(combo => 
        combo.includes(midChar) && combo.includes(lastChar))) {
      return false;
    }

    return true;
  }

  /**
   * 创建名字候选
   */
  private async createNameCandidate(
    familyName: string, 
    midChar: string, 
    lastChar: string, 
    analysisData: PluginAnalysisData
  ): Promise<NameCandidate> {
    const fullName = familyName + midChar + lastChar;
    
    // 进行各项分析
    const strokeAnalysis = await this.analyzeStroke(familyName, midChar, lastChar);
    const wuxingAnalysis = await this.analyzeWuxing(familyName, midChar, lastChar, analysisData);
    const sancaiAnalysis = await this.analyzeSancai(familyName, midChar, lastChar);
    const semanticAnalysis = this.analyzeSemantics(midChar, lastChar, analysisData);
    const phoneticAnalysis = this.analyzePhonetics(familyName, midChar, lastChar, analysisData);

    // 计算综合评分
    const score = this.calculateCompositeScore({
      strokeAnalysis,
      wuxingAnalysis,
      sancaiAnalysis,
      semanticAnalysis,
      phoneticAnalysis
    });

    // 计算置信度
    const confidence = this.calculateCandidateConfidence(analysisData);

    // 生成评分原因
    const reasons = this.generateScoringReasons({
      strokeAnalysis,
      wuxingAnalysis,
      sancaiAnalysis,
      semanticAnalysis,
      phoneticAnalysis
    });

    return {
      fullName,
      familyName,
      midChar,
      lastChar,
      score,
      confidence,
      analysis: {
        strokeAnalysis,
        wuxingAnalysis,
        sancaiAnalysis,
        semanticAnalysis,
        phoneticAnalysis
      },
      reasons
    };
  }

  /**
   * 笔画分析
   */
  private async analyzeStroke(familyName: string, midChar: string, lastChar: string): Promise<any> {
    // 获取每个字符的笔画数
    const familyInfo = await this.dataLoader.getCharacterInfo(familyName);
    const midInfo = await this.dataLoader.getCharacterInfo(midChar);
    const lastInfo = await this.dataLoader.getCharacterInfo(lastChar);
    
    const familyStrokes = typeof familyInfo?.strokes === 'number' ? familyInfo.strokes : familyInfo?.strokes?.simplified || 0;
    const midStrokes = typeof midInfo?.strokes === 'number' ? midInfo.strokes : midInfo?.strokes?.simplified || 0;
    const lastStrokes = typeof lastInfo?.strokes === 'number' ? lastInfo.strokes : lastInfo?.strokes?.simplified || 0;

    // 先计算五格，再计算三才
    const grids = await this.sancaiCalculator.calculateGrids(familyName, midChar, lastChar, false);
    const sancaiResult = await this.sancaiCalculator.calculateSancai(grids);

    return {
      familyStrokes,
      midStrokes,
      lastStrokes,
      totalStrokes: familyStrokes + midStrokes + lastStrokes,
      sancaiScore: sancaiResult.level === 'da_ji' ? 100 : sancaiResult.level === 'ji' ? 80 : 60,
      sancaiResult: sancaiResult,
      grids: grids
    };
  }

  /**
   * 五行分析
   */
  private async analyzeWuxing(
    familyName: string, 
    midChar: string, 
    lastChar: string, 
    analysisData: PluginAnalysisData
  ): Promise<any> {
    // 获取每个字符的五行属性
    const familyWuxing = await this.dataLoader.getWuxing(familyName);
    const midWuxing = await this.dataLoader.getWuxing(midChar);
    const lastWuxing = await this.dataLoader.getWuxing(lastChar);

    // 检查五行平衡
    const balance = this.checkWuxingBalance([familyWuxing, midWuxing, lastWuxing]);
    
    // 检查与喜用神的匹配
    const xiyongMatch = this.checkXiYongMatch([midWuxing, lastWuxing], analysisData.xiyongshen);

    return {
      familyWuxing,
      midWuxing,
      lastWuxing,
      balance,
      xiyongMatch,
      score: balance.score + xiyongMatch.score
    };
  }

  /**
   * 三才分析
   */
  private async analyzeSancai(familyName: string, midChar: string, lastChar: string): Promise<any> {
    const grids = await this.sancaiCalculator.calculateGrids(familyName, midChar, lastChar, false);
    const result = await this.sancaiCalculator.calculateSancai(grids);
    
    return {
      sancai: result,
      grids: grids,
      score: result.level === 'da_ji' ? 100 : result.level === 'ji' ? 80 : 60,
      level: result.level
    };
  }

  /**
   * 语义分析
   */
  private analyzeSemantics(midChar: string, lastChar: string, analysisData: PluginAnalysisData): any {
    let score = 50; // 基础分
    const reasons: string[] = [];

    // 检查积极含义
    if (analysisData.meaning?.positiveChars.has(midChar)) {
      score += 15;
      reasons.push(`"${midChar}"字含义积极`);
    }
    if (analysisData.meaning?.positiveChars.has(lastChar)) {
      score += 15;
      reasons.push(`"${lastChar}"字含义积极`);
    }

    // 检查有意义的组合
    if (analysisData.meaning?.meaningfulCombinations.some(combo => 
        combo.includes(midChar) && combo.includes(lastChar))) {
      score += 20;
      reasons.push('字符组合寓意深刻');
    }

    return {
      score: Math.min(score, 100),
      reasons,
      positiveChars: [midChar, lastChar].filter(char => 
        analysisData.meaning?.positiveChars.has(char))
    };
  }

  /**
   * 语音分析
   */
  private analyzePhonetics(
    familyName: string, 
    midChar: string, 
    lastChar: string, 
    analysisData: PluginAnalysisData
  ): any {
    let score = 50; // 基础分
    const reasons: string[] = [];

    // 检查语音和谐度
    const harmony = analysisData.phonetic?.harmonicChars;
    if (harmony) {
      const midHarmony = harmony.get(midChar) || 0;
      const lastHarmony = harmony.get(lastChar) || 0;
      score += (midHarmony + lastHarmony) / 2;
      
      if (midHarmony > 0) reasons.push(`"${midChar}"字音韵和谐`);
      if (lastHarmony > 0) reasons.push(`"${lastChar}"字音韵和谐`);
    }

    // 避免语音冲突的奖励
    const hasConflict = analysisData.phonetic?.avoidCombinations.some(combo =>
      combo.some(char => [familyName, midChar, lastChar].includes(char)));
    
    if (!hasConflict) {
      score += 10;
      reasons.push('避免了语音冲突');
    }

    return {
      score: Math.min(score, 100),
      reasons,
      harmony: score - 50
    };
  }

  /**
   * 计算综合评分
   */
  private calculateCompositeScore(analyses: any): number {
    const weights = {
      strokeAnalysis: 0.25,    // 笔画三才 25%
      wuxingAnalysis: 0.25,    // 五行平衡 25% 
      sancaiAnalysis: 0.20,    // 三才五格 20%
      semanticAnalysis: 0.15,  // 语义分析 15%
      phoneticAnalysis: 0.15   // 语音分析 15%
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const [key, weight] of Object.entries(weights)) {
      if (analyses[key]?.score !== undefined) {
        totalScore += analyses[key].score * weight;
        totalWeight += weight;
      }
    }

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  /**
   * 计算候选置信度
   */
  private calculateCandidateConfidence(analysisData: PluginAnalysisData): number {
    let confidence = 60; // 基础置信度

    // 根据可用插件数据调整置信度
    if (analysisData.birthTime) confidence += 10;
    if (analysisData.zodiac) confidence += 8;
    if (analysisData.xiyongshen) confidence += 12;
    if (analysisData.zodiacChar) confidence += 5;
    if (analysisData.meaning) confidence += 3;
    if (analysisData.phonetic) confidence += 2;

    return Math.min(confidence, 95);
  }

  /**
   * 评分和排序候选名字
   */
  private async scoreAndRankCandidates(
    candidates: NameCandidate[], 
    analysisData: PluginAnalysisData
  ): Promise<NameCandidate[]> {
    // 按综合评分排序
    candidates.sort((a, b) => {
      // 主要按评分排序
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // 评分相同时按置信度排序
      return b.confidence - a.confidence;
    });

    // 返回前N个最佳候选
    const maxResults = 20;
    return candidates.slice(0, maxResults);
  }

  /**
   * 转换为GeneratedName格式
   */
  private async convertToGeneratedNames(candidates: NameCandidate[]): Promise<GeneratedName[]> {
    const generatedNames: GeneratedName[] = [];

    for (const candidate of candidates.slice(0, 10)) { // 最多返回10个
      const { familyName, midChar, lastChar } = candidate;
      
      // 使用三才五格计算器获取完整数据
      const grids = await this.sancaiCalculator.calculateGrids(familyName, midChar, lastChar, false);
      const sancaiResult = await this.sancaiCalculator.calculateSancai(grids);

      const generatedName: GeneratedName = {
        fullName: candidate.fullName,
        familyName: candidate.familyName,
        midChar: candidate.midChar,
        lastChar: candidate.lastChar,
        grids: grids,
        sancai: sancaiResult,
        score: candidate.score,
        explanation: this.generateExplanation(candidate)
      };

      generatedNames.push(generatedName);
    }

    return generatedNames;
  }

  /**
   * 生成名字解释
   */
  private generateExplanation(candidate: NameCandidate): string {
    const reasons = candidate.reasons.slice(0, 3); // 最多3个主要原因
    const scoreDesc = candidate.score >= 90 ? '优秀' : 
                     candidate.score >= 80 ? '良好' : 
                     candidate.score >= 70 ? '中等' : '一般';
    
    return `${candidate.fullName} (${scoreDesc}评分: ${candidate.score}分) - ${reasons.join('；')}`;
  }

  /**
   * 生成分析报告
   */
  private generateAnalysisReport(candidates: NameCandidate[], analysisData: PluginAnalysisData): any {
    return {
      summary: {
        totalCandidates: candidates.length,
        averageScore: candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length,
        averageConfidence: candidates.reduce((sum, c) => sum + c.confidence, 0) / candidates.length,
        topScore: candidates[0]?.score || 0
      },
      pluginContributions: {
        corePlugins: ['surname', 'gender', 'stroke', 'wuxing-char'],
        optionalPlugins: Object.keys(analysisData).filter(key => 
          !['surname', 'gender', 'stroke', 'wuxingChar'].includes(key)),
        dataCompleteness: this.calculateDataCompleteness(analysisData)
      },
      recommendations: this.generateRecommendations(candidates)
    };
  }

  /**
   * 计算数据完整性
   */
  private calculateDataCompleteness(analysisData: PluginAnalysisData): number {
    const totalPossible = 10; // 总可能的插件数
    const available = Object.keys(analysisData).length;
    return Math.round((available / totalPossible) * 100);
  }

  /**
   * 生成推荐建议
   */
  private generateRecommendations(candidates: NameCandidate[]): string[] {
    const recommendations: string[] = [];
    
    if (candidates.length > 0) {
      const topCandidate = candidates[0];
      recommendations.push(`推荐名字："${topCandidate.fullName}"，综合评分${topCandidate.score}分`);
      
      if (topCandidate.score >= 90) {
        recommendations.push('此名字在各方面都表现优秀，强烈推荐使用');
      } else if (topCandidate.score >= 80) {
        recommendations.push('此名字综合表现良好，可以考虑使用');
      } else {
        recommendations.push('建议提供更多信息以生成更高质量的名字');
      }
    }

    return recommendations;
  }

  /**
   * 获取插件贡献信息
   */
  private getPluginContributions(input: StandardInput): Record<string, any> {
    const contributions: Record<string, any> = {};
    
    for (const [pluginId, result] of input.context.pluginResults) {
      contributions[pluginId] = {
        executed: true,
        confidence: result.confidence,
        dataProvided: !!result.results,
        executionTime: result.metadata?.executionTime || 0
      };
    }

    return contributions;
  }

  /**
   * 计算整体置信度
   */
  private calculateOverallConfidence(analysisData: PluginAnalysisData): number {
    const baseConfidence = 70;
    const pluginCount = Object.keys(analysisData).length;
    const bonusPerPlugin = 3;
    
    return Math.min(baseConfidence + (pluginCount * bonusPerPlugin), 95);
  }

  /**
   * 生成评分原因
   */
  private generateScoringReasons(analyses: any): string[] {
    const reasons: string[] = [];
    
    // 收集各分析的原因
    if (analyses.strokeAnalysis?.sancaiScore > 80) {
      reasons.push('三才五格配置优秀');
    }
    if (analyses.wuxingAnalysis?.score > 80) {
      reasons.push('五行搭配和谐');
    }
    if (analyses.semanticAnalysis?.reasons) {
      reasons.push(...analyses.semanticAnalysis.reasons);
    }
    if (analyses.phoneticAnalysis?.reasons) {
      reasons.push(...analyses.phoneticAnalysis.reasons);
    }

    return reasons.slice(0, 5); // 最多5个原因
  }

  /**
   * 检查五行平衡
   */
  private checkWuxingBalance(elements: string[]): { score: number; balance: string } {
    // 简化的五行平衡检查
    const elementCount = new Map<string, number>();
    elements.forEach(element => {
      elementCount.set(element, (elementCount.get(element) || 0) + 1);
    });

    const uniqueElements = elementCount.size;
    const maxCount = Math.max(...elementCount.values());
    
    let score = 50;
    if (uniqueElements === 3 && maxCount === 1) {
      score = 90; // 完美平衡
    } else if (uniqueElements === 2) {
      score = 70; // 良好平衡
    } else if (maxCount === 3) {
      score = 30; // 失衡
    }

    return {
      score,
      balance: score >= 80 ? '优秀' : score >= 60 ? '良好' : '一般'
    };
  }

  /**
   * 检查喜用神匹配
   */
  private checkXiYongMatch(elements: string[], xiyongshen?: any): { score: number; matches: string[] } {
    if (!xiyongshen) {
      return { score: 0, matches: [] };
    }

    const matches: string[] = [];
    let score = 0;

    const favorableElements = [...(xiyongshen.xiShen || []), ...(xiyongshen.yongShen || [])];
    
    elements.forEach(element => {
      if (favorableElements.includes(element)) {
        matches.push(element);
        score += 20;
      }
    });

    return { score: Math.min(score, 40), matches };
  }

  /**
   * 销毁插件，清理资源
   */
  async destroy(): Promise<void> {
    // 清理资源
    console.log('NameGenerationPlugin destroyed');
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
  getHealthStatus() {
    return {
      status: 'healthy' as const,
      message: 'Name generation plugin is running normally',
      lastCheck: Date.now()
    };
  }
}
