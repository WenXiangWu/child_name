/**
 * 性别插件 - Layer 1
 * 处理性别信息，提供性别相关的偏好和建议
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
import { Gender } from '../../../common/types';

export class GenderPlugin implements NamingPlugin {
  readonly id = 'gender';
  readonly version = '1.0.0';
  readonly layer = 1;
  readonly dependencies: PluginDependency[] = [];
  readonly metadata: PluginMetadata = {
    name: '性别分析插件',
    description: '分析性别偏好，提供性别相关的命名建议和字符偏好',
    author: 'System',
    category: 'input',
    tags: ['gender', 'preferences', 'characters', 'basic']
  };

  private config: PluginConfig | null = null;
  private dataLoader: QimingDataLoader;

  constructor() {
    this.dataLoader = QimingDataLoader.getInstance();
  }

  /**
   * 初始化插件
   */
  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    this.config = config;
    await this.dataLoader.preloadCoreData();
    context.log('info', `性别插件初始化完成, 版本: ${this.version}`);
  }

  /**
   * 处理输入数据
   */
  async process(input: StandardInput): Promise<PluginOutput> {
    const startTime = Date.now();
    const { data } = input;
    
    if (!data.gender) {
      throw new Error('缺少必要的性别信息');
    }

    const gender = data.gender;
    
    // 分析性别偏好
    const analysis = await this.analyzeGenderPreferences(gender);
    
    return {
      pluginId: this.id,
      results: {
        gender,
        preferences: analysis.preferences,
        recommendations: analysis.recommendations,
        commonCharacters: analysis.commonCharacters,
        avoidedCharacters: analysis.avoidedCharacters,
        culturalBackground: analysis.culturalBackground,
        namingStyle: analysis.namingStyle
      },
      confidence: 1.0, // 性别信息通常是确定的
      metadata: {
        processingTime: Date.now() - startTime,
        dataSource: 'gender-preferences'
      }
    };
  }

  /**
   * 验证输入数据
   */
  validate(input: StandardInput): ValidationResult {
    const { data } = input;
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data.gender) {
      errors.push('性别信息不能为空');
    } else {
      const gender = data.gender;
      
      if (!['male', 'female'].includes(gender)) {
        errors.push('性别信息必须为 "male" 或 "female"');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 分析性别偏好
   */
  private async analyzeGenderPreferences(gender: Gender) {
    const isMale = gender === 'male';
    
    // 获取性别相关的常用字
    const targetGender = isMale ? '男' : '女';
    const commonWords = await this.dataLoader.getCommonNameWords(targetGender);
    const commonCharacters = Array.from(commonWords).slice(0, 100); // 取前100个常用字
    
    const preferences = {
      // 字义偏好
      meaningPreferences: isMale ? 
        ['强壮', '坚毅', '智慧', '豪放', '刚健', '博学', '英勇', '进取'] :
        ['温柔', '美丽', '贤淑', '优雅', '聪慧', '善良', '柔美', '纯洁'],
      
      // 字形偏好 (部首偏好)
      radicalPreferences: isMale ?
        ['亻', '力', '山', '石', '金', '木', '大', '宀'] :
        ['女', '亻', '心', '艹', '氵', '纟', '玉', '月'],
      
      // 音韵偏好
      phoneticPreferences: isMale ?
        ['阳平', '去声', '清脆', '响亮'] :
        ['阴平', '上声', '柔和', '婉转'],
      
      // 五行偏好倾向
      wuxingTendency: isMale ?
        ['金', '木', '火'] : // 男性倾向金木火（阳刚之气）
        ['水', '土', '木']   // 女性倾向水土木（阴柔之美）
    };

    const recommendations = {
      // 诗词来源推荐
      poetryRecommendations: isMale ?
        ['楚辞', '论语', '孟子', '唐诗', '宋词'] :
        ['诗经', '宋词', '唐诗', '古文观止', '女诗经'],
      
      // 字符类型推荐
      characterTypes: isMale ?
        ['单字名', '双字名', '文雅型', '阳刚型'] :
        ['双字名', '优雅型', '温柔型', '才女型'],
      
      // 避免的字符特征
      avoidedFeatures: isMale ?
        ['过于柔美', '女性化字符', '叠字'] :
        ['过于阳刚', '男性化字符', '生僻字']
    };

    // 需要避免的字符
    const avoidedCharacters = isMale ?
      ['娇', '柔', '妮', '娜', '妍', '婷', '嫣', '媛'] :
      ['刚', '猛', '威', '武', '雄', '豪', '霸', '勇'];

    // 文化背景偏好
    const culturalBackground = {
      traditional: isMale ?
        '传统文化中偏好体现男性阳刚之美，追求事业成功、品德高尚' :
        '传统文化中偏好体现女性阴柔之美，追求贤德淑雅、容貌姿态',
      
      modern: isMale ?
        '现代社会偏好体现男性责任感、创新精神、包容性' :
        '现代社会偏好体现女性独立性、才华、现代气质'
    };

    // 命名风格建议
    const namingStyle = {
      primary: isMale ? 'literary-masculine' : 'elegant-feminine',
      alternatives: isMale ?
        ['traditional-classic', 'modern-progressive', 'heroic-bold'] :
        ['traditional-graceful', 'modern-sophisticated', 'artistic-refined'],
      
      tone: isMale ? 'strong-confident' : 'gentle-melodious'
    };

    return {
      preferences,
      recommendations,
      commonCharacters,
      avoidedCharacters,
      culturalBackground,
      namingStyle
    };
  }

  /**
   * 获取性别相关的字符评分权重
   */
  getGenderWeights(gender: Gender) {
    const isMale = gender === 'male';
    
    return {
      // 字义权重
      meaningWeight: isMale ? 
        { strength: 1.2, wisdom: 1.1, gentleness: 0.8, beauty: 0.7 } :
        { beauty: 1.2, gentleness: 1.1, wisdom: 1.0, strength: 0.8 },
      
      // 音韵权重
      phoneticWeight: isMale ?
        { masculine: 1.2, neutral: 1.0, feminine: 0.7 } :
        { feminine: 1.2, neutral: 1.0, masculine: 0.7 },
      
      // 五行权重调整
      wuxingWeight: isMale ?
        { jin: 1.1, mu: 1.1, huo: 1.1, tu: 1.0, shui: 0.9 } :
        { shui: 1.1, tu: 1.1, mu: 1.0, jin: 0.9, huo: 0.9 }
    };
  }

  /**
   * 检查字符是否适合指定性别
   */
  isCharacterSuitableForGender(character: string, gender: Gender): {
    suitable: boolean;
    score: number;
    reason: string;
  } {
    const isMale = gender === 'male';
    
    // 强烈性别偏向的字符
    const strongMaleChars = ['强', '刚', '勇', '威', '豪', '雄', '武', '霸'];
    const strongFemaleChars = ['娇', '柔', '妮', '娜', '妍', '婷', '嫣', '媛'];
    
    if (isMale) {
      if (strongFemaleChars.includes(character)) {
        return { suitable: false, score: 0.2, reason: '过于女性化' };
      }
      if (strongMaleChars.includes(character)) {
        return { suitable: true, score: 1.2, reason: '符合男性特质' };
      }
    } else {
      if (strongMaleChars.includes(character)) {
        return { suitable: false, score: 0.2, reason: '过于男性化' };
      }
      if (strongFemaleChars.includes(character)) {
        return { suitable: true, score: 1.2, reason: '符合女性特质' };
      }
    }
    
    // 中性字符
    return { suitable: true, score: 1.0, reason: '中性字符，适合两性' };
  }

  /**
   * 销毁插件，清理资源
   */
  async destroy(): Promise<void> {
    console.log('性别插件销毁完成');
  }

  /**
   * 检查插件是否可用
   */
  isAvailable(): boolean {
    return this.dataLoader !== null;
  }

  /**
   * 获取插件健康状态
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    message: string;
    lastCheck: number;
  } {
    const isHealthy = this.isAvailable() && this.config !== null;
    
    return {
      status: isHealthy ? 'healthy' : 'degraded',
      message: isHealthy ? '插件运行正常' : '插件未完全初始化',
      lastCheck: Date.now()
    };
  }
}
