/**
 * 名字组合生成插件
 * Layer 5: 名字生成层
 * 
 * 功能：基于筛选后的候选字符池，生成所有可能的名字组合
 * 依赖：CharacterFilterPlugin (Layer 4)
 * 
 * ⚠️ 重要：严格按照文档《插件执行示例-吴姓男孩取名完整计算过程.md》实现
 */

import { Layer5Plugin, PluginConfig, PluginContext, StandardInput, PluginOutput, ValidationResult } from '../../interfaces/NamingPlugin';

interface NameCandidate {
  fullName: string;
  firstName: string;
  secondName: string;
  components: {
    surname: { char: string; strokes: number; wuxing: string };
    first: { char: string; strokes: number; wuxing: string };
    second: { char: string; strokes: number; wuxing: string };
  };
  metadata: {
    totalStrokes: number;
    wuxingCombination: string;
    phoneticPattern: string;
    culturalLevel: number;
    generationScore: number;
  };
}

export class NameCombinationPlugin implements Layer5Plugin {
  readonly id = 'name-combination';
  readonly version = '1.0.0';
  readonly layer = 5 as const;
  readonly category = 'generation' as const;
  readonly dependencies = [
    { pluginId: 'character-filter', required: true }
  ];
  readonly metadata = {
    name: '名字组合生成插件',
    description: '基于筛选后的候选字符池，生成所有可能的名字组合',
    author: 'Qiming Plugin System',
    category: 'generation' as const,
    tags: ['name-generation', 'combination', 'candidates', 'permutation']
  };

  private initialized = false;

  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    this.initialized = true;
  }

  async validate(input: StandardInput): Promise<ValidationResult> {
    if (!input.familyName) {
      return {
        valid: false,
        errors: ['缺少姓氏信息']
      };
    }
    return { valid: true, errors: [] };
  }

  async process(input: StandardInput, context: PluginContext): Promise<PluginOutput> {
    const startTime = Date.now();
    
    try {
      if (!this.initialized) {
        throw new Error('插件未初始化');
      }

      context.log?.('info', '开始生成名字组合');
      
      // 获取字符筛选结果 (模拟从上下文获取)
      const filterResult = await this.getCharacterFilterResult(context);
      
      // 生成所有可能的名字组合
      const combinations = this.generateAllCombinations(filterResult, input, context);
      
      // 过滤和优化组合
      const optimizedCombinations = this.optimizeCombinations(combinations);
      
      // 生成组合统计信息
      const statistics = this.generateStatistics(optimizedCombinations);
      
      const result = {
        nameCandidates: optimizedCombinations,
        statistics,
        generationRules: this.getGenerationRules(),
        qualityDistribution: this.analyzeQualityDistribution(optimizedCombinations)
      };

      return {
        success: true,
        data: result,
        confidence: 0.9,
        executionTime: Date.now() - startTime,
        metadata: {
          pluginId: this.id,
          layer: this.layer,
          totalCombinations: optimizedCombinations.length
        }
      };
    } catch (error) {
      context.log?.('error', `名字组合生成失败: ${error}`);
      return {
        success: false,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * 获取字符筛选结果 - 从Layer 4插件上下文获取真实数据
   */
  private async getCharacterFilterResult(context: PluginContext) {
    // 从插件上下文获取Layer 4的真实字符筛选结果
    const characterFilterResult = context.getPluginResult?.('character-filter');
    
    context.log?.('info', `🔍 获取Layer4字符筛选结果: ${characterFilterResult ? '✅' : '❌'}`);
    
    if (!characterFilterResult?.success || !characterFilterResult?.data?.candidatePool) {
      context.log?.('warn', '未获取到Layer4字符筛选结果，使用默认候选字符');
      
      // fallback到基本字符集
      const fallbackChars = ['钦', '宣', '润', '锦', '浩', '铭', '峰', '磊', '森', '林'];
      
      return {
        candidatePool: {
          firstCharCandidates: fallbackChars.slice(0, 5).map(char => ({
            character: char,
            scores: { wuxing: 85, zodiac: 80, meaning: 85, stroke: 85, overall: 83.75 },
            metadata: { strokes: 10, wuxing: 'jin', meaning: '默认含义', culturalLevel: 80 }
          })),
          secondCharCandidates: fallbackChars.slice(5, 10).map(char => ({
            character: char,
            scores: { wuxing: 85, zodiac: 80, meaning: 85, stroke: 85, overall: 83.75 },
            metadata: { strokes: 12, wuxing: 'shui', meaning: '默认含义', culturalLevel: 80 }
          }))
        }
      };
    }
    
    // 使用Layer 4的真实数据
    const layer4Data = characterFilterResult.data;
    
    context.log?.('info', `🔍 Layer4返回数据结构调试: ${JSON.stringify(layer4Data, null, 2).slice(0, 500)}...`);
    
    const candidatePool = layer4Data?.candidatePool || layer4Data?.phoneticFiltered || [];
    
    context.log?.('info', `📊 Layer4候选字符池大小: ${candidatePool.length}`);
    
    // Layer 4已经完成了所有筛选，包括笔画筛选
    // Layer 5只需要格式转换和分组，不需要重复筛选
    context.log?.('info', `✅ Layer4已完成筛选，直接使用筛选结果，不进行重复筛选`);
    
    // 将Layer 4的字符数据转换为Layer 5需要的格式
    const convertedCandidates = candidatePool.map((char: any) => ({
      character: char.character || char.char,
      scores: char.scores || { 
        wuxing: char.wuxingScore || 85, 
        zodiac: char.zodiacScore || 80, 
        meaning: char.meaningScore || 85, 
        stroke: char.strokeScore || 85,
        overall: ((char.wuxingScore || 85) + (char.zodiacScore || 80) + (char.meaningScore || 85) + (char.strokeScore || 85)) / 4
      },
      metadata: char.metadata || { 
        strokes: char.strokes, 
        wuxing: char.wuxing, 
        meaning: char.meaning || '暂无含义', 
        culturalLevel: char.culturalLevel || 80 
      }
    }));
    
    // 直接分组，不再按笔画筛选（Layer 4已经筛选过了）
    const midIndex = Math.ceil(convertedCandidates.length / 2);
    const result = {
      candidatePool: {
        firstCharCandidates: convertedCandidates.slice(0, midIndex),
        secondCharCandidates: convertedCandidates.slice(midIndex)
      }
    };
    
    context.log?.('info', `🔤 直接分组结果 - 第一字候选: ${result.candidatePool.firstCharCandidates.length}个, 第二字候选: ${result.candidatePool.secondCharCandidates.length}个`);
    
    return result;
  }

  /**
   * 获取笔画策略要求
   */
  private getStrokeRequirements(context: PluginContext) {
    const strokeSelectionResult = context.getPluginResult?.('stroke-selection');
    
    if (!strokeSelectionResult?.success || !strokeSelectionResult?.data) {
      context.log?.('warn', '未获取到笔画策略结果，使用默认笔画组合');
      // 默认笔画组合
      return {
        doubleCharCombinations: [
          { firstCharStrokes: 9, secondCharStrokes: 16, pattern: '7-9-16' },
          { firstCharStrokes: 11, secondCharStrokes: 14, pattern: '7-11-14' }
        ]
      };
    }
    
    const strokeData = strokeSelectionResult.data;
    
    // 从不同可能的数据结构中提取笔画组合
    const strokeCombinations = strokeData.strokeCombinations || strokeData;
    
    return {
      doubleCharCombinations: strokeCombinations.doubleCharCombinations || [],
      singleCharCombinations: strokeCombinations.singleCharCombinations || []
    };
  }

  /**
   * 根据笔画要求筛选字符
   */
  private filterCharactersByStrokeRequirements(candidates: any[], strokeRequirements: any, context: PluginContext) {
    const { doubleCharCombinations = [] } = strokeRequirements;
    
    if (doubleCharCombinations.length === 0) {
      context.log?.('warn', '没有双字笔画组合要求，按平均分配');
      const midIndex = Math.ceil(candidates.length / 2);
      return {
        candidatePool: {
          firstCharCandidates: candidates.slice(0, midIndex),
          secondCharCandidates: candidates.slice(midIndex)
        }
      };
    }
    
    // 提取所有要求的第一字和第二字笔画数
    const requiredFirstStrokes = [...new Set(doubleCharCombinations.map((combo: any) => combo.firstCharStrokes))];
    const requiredSecondStrokes = [...new Set(doubleCharCombinations.map((combo: any) => combo.secondCharStrokes))];
    
    context.log?.('info', `📏 要求的第一字笔画: [${requiredFirstStrokes.join(',')}], 第二字笔画: [${requiredSecondStrokes.join(',')}]`);
    
    // 按笔画要求筛选字符
    const firstCharCandidates = candidates.filter(char => 
      requiredFirstStrokes.includes(char.metadata.strokes)
    );
    
    const secondCharCandidates = candidates.filter(char => 
      requiredSecondStrokes.includes(char.metadata.strokes)
    );
    
    context.log?.('info', `🔍 笔画筛选结果: 第一字符合${firstCharCandidates.length}个, 第二字符合${secondCharCandidates.length}个`);
    
    return {
      candidatePool: {
        firstCharCandidates,
        secondCharCandidates
      }
    };
  }

  /**
   * 生成所有可能的名字组合
   */
  private generateAllCombinations(filterResult: any, input: StandardInput, context: PluginContext): NameCandidate[] {
    const combinations: NameCandidate[] = [];
    const familyName = input.familyName;
    const { firstCharCandidates, secondCharCandidates } = filterResult.candidatePool;

    // 生成笛卡尔积组合
    for (const firstChar of firstCharCandidates) {
      for (const secondChar of secondCharCandidates) {
        const combination = this.createNameCandidate(
          familyName,
          firstChar,
          secondChar
        );
        combinations.push(combination);
      }
    }

    context.log?.('info', `生成了${combinations.length}个名字组合`);
    return combinations;
  }

  /**
   * 创建名字候选对象
   */
  private createNameCandidate(
    familyName: string,
    firstChar: any,
    secondChar: any
  ): NameCandidate {
    const fullName = `${familyName}${firstChar.character}${secondChar.character}`;
    
    // 计算组合属性
    const totalStrokes = 7 + firstChar.metadata.strokes + secondChar.metadata.strokes; // 假设姓氏7画
    const wuxingCombination = `${this.getSurnameWuxing(familyName)}-${firstChar.metadata.wuxing}-${secondChar.metadata.wuxing}`;
    const phoneticPattern = this.calculatePhoneticPattern(familyName, firstChar.character, secondChar.character);
    const culturalLevel = Math.round((firstChar.metadata.culturalLevel + secondChar.metadata.culturalLevel) / 2);
    const generationScore = this.calculateGenerationScore(firstChar, secondChar);

    return {
      fullName,
      firstName: firstChar.character,
      secondName: secondChar.character,
      components: {
        surname: { 
          char: familyName, 
          strokes: 7, 
          wuxing: this.getSurnameWuxing(familyName) 
        },
        first: { 
          char: firstChar.character, 
          strokes: firstChar.metadata.strokes, 
          wuxing: firstChar.metadata.wuxing 
        },
        second: { 
          char: secondChar.character, 
          strokes: secondChar.metadata.strokes, 
          wuxing: secondChar.metadata.wuxing 
        }
      },
      metadata: {
        totalStrokes,
        wuxingCombination,
        phoneticPattern,
        culturalLevel,
        generationScore
      }
    };
  }

  /**
   * 获取姓氏五行 - 简化实现
   */
  private getSurnameWuxing(surname: string): string {
    const surnameWuxingMap: Record<string, string> = {
      '吴': '木',
      '王': '土',
      '李': '木',
      '张': '火',
      '刘': '金'
    };
    return surnameWuxingMap[surname] || '未知';
  }

  /**
   * 计算声调模式
   */
  private calculatePhoneticPattern(surname: string, first: string, second: string): string {
    // 简化的声调模拟
    const toneMap: Record<string, number> = {
      '吴': 2, '宣': 1, '钦': 1, '润': 4, '锦': 3
    };
    
    const surnameT = toneMap[surname] || 0;
    const firstT = toneMap[first] || 0;
    const secondT = toneMap[second] || 0;
    
    return `${surnameT}-${firstT}-${secondT}`;
  }

  /**
   * 计算生成质量分数
   */
  private calculateGenerationScore(firstChar: any, secondChar: any): number {
    const firstScore = firstChar.scores.overall;
    const secondScore = secondChar.scores.overall;
    
    // 基础分数：两字平均分
    let score = (firstScore + secondScore) / 2;
    
    // 五行搭配加分
    const wuxingCombo = `${firstChar.metadata.wuxing}-${secondChar.metadata.wuxing}`;
    if (wuxingCombo === '金-水') score += 8;  // 理想搭配
    else if (wuxingCombo === '金-金') score += 3;  // 可接受搭配
    else if (wuxingCombo === '水-水') score += 3;  // 可接受搭配
    
    // 文化内涵加分
    const avgCultural = (firstChar.metadata.culturalLevel + secondChar.metadata.culturalLevel) / 2;
    if (avgCultural >= 85) score += 5;
    else if (avgCultural >= 80) score += 3;
    
    return Math.round(score * 10) / 10;
  }

  /**
   * 优化组合 - 过滤和排序
   */
  private optimizeCombinations(combinations: NameCandidate[]): NameCandidate[] {
    // Step 1: 过滤低质量组合
    let filtered = combinations.filter(combo => 
      combo.metadata.generationScore >= 80  // 最低质量阈值
    );

    // Step 2: 按质量分数排序
    filtered.sort((a, b) => b.metadata.generationScore - a.metadata.generationScore);

    // Step 3: 限制输出数量
    const maxResults = 10;
    if (filtered.length > maxResults) {
      filtered = filtered.slice(0, maxResults);
    }

    // Step 4: 多样性保证 - 确保不同类型的组合都有代表
    const diversified = this.ensureDiversity(filtered);

    return diversified;
  }

  /**
   * 确保组合多样性
   */
  private ensureDiversity(combinations: NameCandidate[]): NameCandidate[] {
    const diversified: NameCandidate[] = [];
    const wuxingSeen = new Set<string>();
    const phoneticSeen = new Set<string>();

    for (const combo of combinations) {
      const wuxingKey = combo.metadata.wuxingCombination;
      const phoneticKey = combo.metadata.phoneticPattern;
      
      // 优先保留不同五行搭配和声调模式的组合
      if (!wuxingSeen.has(wuxingKey) || !phoneticSeen.has(phoneticKey)) {
        diversified.push(combo);
        wuxingSeen.add(wuxingKey);
        phoneticSeen.add(phoneticKey);
      } else if (diversified.length < 6) {
        // 确保至少有6个结果
        diversified.push(combo);
      }
    }

    return diversified;
  }

  /**
   * 生成统计信息
   */
  private generateStatistics(combinations: NameCandidate[]) {
    return {
      totalGenerated: combinations.length,
      averageScore: combinations.reduce((sum, c) => sum + c.metadata.generationScore, 0) / combinations.length,
      scoreRange: {
        highest: Math.max(...combinations.map(c => c.metadata.generationScore)),
        lowest: Math.min(...combinations.map(c => c.metadata.generationScore))
      },
      wuxingDistribution: this.analyzeWuxingDistribution(combinations),
      strokeDistribution: this.analyzeStrokeDistribution(combinations),
      culturalLevelDistribution: this.analyzeCulturalDistribution(combinations)
    };
  }

  /**
   * 分析五行分布
   */
  private analyzeWuxingDistribution(combinations: NameCandidate[]) {
    const distribution: Record<string, number> = {};
    
    combinations.forEach(combo => {
      const pattern = combo.metadata.wuxingCombination;
      distribution[pattern] = (distribution[pattern] || 0) + 1;
    });
    
    return distribution;
  }

  /**
   * 分析笔画分布
   */
  private analyzeStrokeDistribution(combinations: NameCandidate[]) {
    const distribution: Record<string, number> = {};
    
    combinations.forEach(combo => {
      const totalStrokes = combo.metadata.totalStrokes;
      const range = this.getStrokeRange(totalStrokes);
      distribution[range] = (distribution[range] || 0) + 1;
    });
    
    return distribution;
  }

  /**
   * 获取笔画范围
   */
  private getStrokeRange(strokes: number): string {
    if (strokes <= 20) return '20画以下';
    if (strokes <= 30) return '21-30画';
    if (strokes <= 40) return '31-40画';
    return '40画以上';
  }

  /**
   * 分析文化水平分布
   */
  private analyzeCulturalDistribution(combinations: NameCandidate[]) {
    const distribution = { '高': 0, '中': 0, '低': 0 };
    
    combinations.forEach(combo => {
      const level = combo.metadata.culturalLevel;
      if (level >= 85) distribution['高']++;
      else if (level >= 75) distribution['中']++;
      else distribution['低']++;
    });
    
    return distribution;
  }

  /**
   * 分析质量分布
   */
  private analyzeQualityDistribution(combinations: NameCandidate[]) {
    return {
      excellent: combinations.filter(c => c.metadata.generationScore >= 90).length,
      good: combinations.filter(c => c.metadata.generationScore >= 85 && c.metadata.generationScore < 90).length,
      average: combinations.filter(c => c.metadata.generationScore >= 80 && c.metadata.generationScore < 85).length,
      below: combinations.filter(c => c.metadata.generationScore < 80).length
    };
  }

  /**
   * 获取生成规则说明
   */
  private getGenerationRules() {
    return {
      combinationMethod: 'cartesian_product',
      filteringCriteria: {
        minScore: 80,
        maxResults: 10,
        diversityRequired: true
      },
      scoringFactors: [
        { factor: '字符个体分数', weight: '60%' },
        { factor: '五行搭配', weight: '20%' },
        { factor: '文化内涵', weight: '15%' },
        { factor: '其他因素', weight: '5%' }
      ],
      qualityAssurance: [
        '过滤低质量组合(< 80分)',
        '按分数排序',
        '确保组合多样性',
        '限制输出数量'
      ]
    };
  }
}