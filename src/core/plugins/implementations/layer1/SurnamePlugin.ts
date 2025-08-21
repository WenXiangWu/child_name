/**
 * 姓氏分析插件
 * Layer 1: 基础信息层
 * 
 * 功能：分析姓氏的字符信息、笔画数、五行属性、百家姓排名等
 * 依赖：无 (Layer 1基础插件)
 * 
 * ⚠️ 重要：严格按照文档《插件执行示例-吴姓男孩取名完整计算过程.md》实现
 */

import { 
  Layer1Plugin, 
  StandardInput, 
  PluginOutput, 
  PluginContext, 
  ValidationResult,
  PluginMetadata,
  PluginDependency,
  PluginConfig
} from '../../interfaces/NamingPlugin';

import { UnifiedCharacterLoader, UnifiedCharacterInfo } from '../../data/UnifiedCharacterLoader';

export class SurnamePlugin implements Layer1Plugin {
  readonly id = 'surname';
  readonly version = '1.0.0';
  readonly layer = 1 as const;
  readonly category = 'input' as const;
  readonly dependencies: PluginDependency[] = [];
  readonly metadata: PluginMetadata = {
    name: '姓氏分析插件',
    description: '分析姓氏的字符信息、笔画数、五行属性、百家姓排名等基础信息',
    author: 'Qiming Plugin System',
    category: 'input' as const,
    tags: ['surname', 'strokes', 'wuxing', 'baijiaxing', 'layer1']
  };

  private initialized = false;
  private charLoader: UnifiedCharacterLoader;
  private baijiaxingData: any; // TODO: 类型定义

  constructor() {
    this.charLoader = UnifiedCharacterLoader.getInstance();
  }

  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    try {
      // 初始化UnifiedCharacterLoader
      await this.charLoader.initialize();
      context.log?.('info', 'UnifiedCharacterLoader初始化完成');
      
      // 加载百家姓数据
      this.baijiaxingData = await this.loadBaijiaxingData();
      
      this.initialized = true;
    } catch (error) {
      context.log?.('error', `${this.id} 插件初始化失败: ${error}`);
      throw error;
    }
  }

  async validate(input: StandardInput): Promise<ValidationResult> {
    if (!input.familyName || typeof input.familyName !== 'string') {
      return {
        valid: false,
        errors: ['缺少必要参数：familyName (字符串类型)']
      };
    }
    
    if (input.familyName.trim().length === 0) {
      return {
        valid: false,
        errors: ['姓氏不能为空']
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

      if (!input.familyName) {
        throw new Error('缺少姓氏信息');
      }
      
      const familyName = input.familyName.trim();
      context.log?.('info', `开始分析姓氏: ${familyName}`);
      
      // 根据文档《插件执行示例-吴姓男孩取名完整计算过程.md》实现
      const analysis = await this.analyzeSurnameComplete(familyName, context);
      
      return {
        success: true,
        data: analysis,
        confidence: analysis.dataQuality.completenessScore,
        executionTime: Date.now() - startTime,
        metadata: {
          pluginId: this.id,
          layer: this.layer,
          dataSource: analysis.dataQuality.sourceType
        }
      };
    } catch (error) {
      context.log?.('error', `姓氏分析失败: ${error}`);
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
   * 完整的姓氏分析 - 严格按照文档实现
   */
  private async analyzeSurnameComplete(familyName: string, context: PluginContext) {
    // Step 1: 字符信息获取 (模拟UnifiedCharacterLoader的数据结构)
    const characterInfo = await this.getCharacterInfo(familyName);
    
    // Step 2: 百家姓排名查询
    const baijiaxingRank = this.getBaijiaxingRank(familyName);
    
    // Step 3: 计算衍生属性
    const derivedProperties = this.calculateDerivedProperties(characterInfo, baijiaxingRank);
    
    // Step 4: 数据质量评估
    const dataQuality = this.assessDataQuality(characterInfo, baijiaxingRank);
    
    return {
      familyName,
      characterInfo: {
        char: characterInfo.char,
        traditional: characterInfo.traditional || characterInfo.char,
        simplified: characterInfo.simplified || characterInfo.char,
        pinyin: characterInfo.pinyin,
        primaryPinyin: characterInfo.primaryPinyin,
        tone: characterInfo.tone,
        strokes: characterInfo.strokes,
        radical: characterInfo.radical,
        wuxing: characterInfo.wuxing,
        meanings: characterInfo.meanings,
        isStandard: characterInfo.isStandard,
        sources: characterInfo.sources
      },
      derivedProperties,
      dataQuality
    };
  }

  /**
   * 获取字符信息 - 临时简化版本
   */
  private async getCharacterInfo(char: string): Promise<UnifiedCharacterInfo> {
    // 临时简化实现，避免复杂的数据加载问题
    try {
      return await this.charLoader.getCharacterInfo(char);
    } catch (error) {
      // 如果数据加载失败，抛出错误，不使用任何模拟数据
      console.error(`❌ 字符数据加载失败: ${char}`, error);
      throw new Error(`无法获取字符"${char}"的数据，请确保数据文件完整`);
    }
  }



  /**
   * 百家姓排名查询 - 按照文档实现
   */
  private getBaijiaxingRank(surname: string): number {
    // 模拟百家姓数据结构
    const baijiaxingText = '赵钱孙李，周吴郑王。冯陈褚卫，蒋沈韩杨。';
    const cleanText = baijiaxingText.replace(/[，。]/g, '');
    
    let position = 0;
    for (const char of cleanText) {
      position++;
      if (char === surname) {
        return position;
      }
    }
    return -1; // 未找到
  }

  /**
   * 计算衍生属性
   */
  private calculateDerivedProperties(charInfo: any, baijiaxingRank: number) {
    const isSingleChar = charInfo.char.length === 1;
    const isCompoundSurname = charInfo.char.length > 1;
    
    // 天格计算 (单姓规则)
    const tianGeBase = isSingleChar ? charInfo.strokes.traditional + 1 : charInfo.strokes.traditional;
    
    // 计算置信度
    const confidence = this.calculateConfidence(charInfo, baijiaxingRank);
    
    return {
      isSingleChar,
      isCompoundSurname,
      baijiaxingRank: baijiaxingRank > 0 ? baijiaxingRank : -1,
      tianGeBase,
      calculationStrokes: charInfo.strokes.traditional, // ⚠️ 命理计算专用
      confidence
    };
  }

  /**
   * 数据质量评估
   */
  private assessDataQuality(charInfo: any, baijiaxingRank: number) {
    const sourceType = charInfo.sources.includes('百家姓') ? 'final-enhanced-character-database' : 'fallback';
    const completenessScore = this.calculateCompleteness(charInfo);
    const fallbackUsed = sourceType === 'fallback';
    const validationPassed = charInfo.isStandard && charInfo.strokes.traditional > 0;
    
    return {
      sourceType,
      completenessScore,
      fallbackUsed,
      validationPassed,
      isValidNamingCharacter: charInfo.isStandard && validationPassed
    };
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(charInfo: any, baijiaxingRank: number): number {
    let confidence = 0.5; // 基础置信度
    
    if (charInfo.isStandard) confidence += 0.2;
    if (charInfo.strokes.traditional > 0) confidence += 0.2;
    if (baijiaxingRank > 0) confidence += 0.1;
    if (charInfo.sources.length > 1) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * 计算数据完整性得分
   */
  private calculateCompleteness(charInfo: any): number {
    const fields = [
      charInfo.primaryPinyin,
      charInfo.tone > 0,
      charInfo.strokes.traditional > 0,
      charInfo.wuxing,
      charInfo.radical,
      charInfo.meanings.length > 0
    ];
    
    const completedFields = fields.filter(Boolean).length;
    return completedFields / fields.length;
  }

  /**
   * 加载百家姓数据
   */
  private async loadBaijiaxingData() {
    // TODO: 从实际的baijiaxing.json文件加载
    return {
      title: '百家姓',
      paragraphs: [
        '赵钱孙李，周吴郑王。',
        '冯陈褚卫，蒋沈韩杨。',
        // ... 更多百家姓内容
      ]
    };
  }
}
