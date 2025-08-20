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
    context.log?.('info', `${this.id} 插件初始化成功`);
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
   * 获取字符筛选结果 - 模拟从插件上下文获取
   * TODO: 从实际的插件执行上下文获取
   */
  private async getCharacterFilterResult(context: PluginContext) {
    // 模拟字符筛选结果 - 基于文档示例
    return {
      candidatePool: {
        firstCharCandidates: [
          {
            character: '钦',
            scores: { wuxing: 95, zodiac: 75, meaning: 85, stroke: 95, overall: 87.5 },
            metadata: { strokes: 12, wuxing: '金', meaning: '恭敬钦佩', culturalLevel: 85 }
          },
          {
            character: '宣',
            scores: { wuxing: 85, zodiac: 95, meaning: 80, stroke: 95, overall: 88.75 },
            metadata: { strokes: 9, wuxing: '金', meaning: '宣扬传播', culturalLevel: 80 }
          }
        ],
        secondCharCandidates: [
          {
            character: '润',
            scores: { wuxing: 95, zodiac: 80, meaning: 88, stroke: 95, overall: 89.5 },
            metadata: { strokes: 16, wuxing: '水', meaning: '润泽滋润', culturalLevel: 85 }
          },
          {
            character: '锦',
            scores: { wuxing: 90, zodiac: 75, meaning: 90, stroke: 95, overall: 87.5 },
            metadata: { strokes: 16, wuxing: '金', meaning: '锦绣前程', culturalLevel: 88 }
          }
        ]
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