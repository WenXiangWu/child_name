/**
 * qiming取名系统统一接口
 * 提供与qiming项目完全兼容的API
 */

export * from './types';
export * from './constants';
export { SancaiWugeCalculator } from './sancai-calculator';
export { QimingDataLoader } from './data-loader';
export { QimingNameGenerator } from './name-generator';
export { PinyinAnalyzer } from './pinyin-analyzer';

import { QimingNameGenerator } from './name-generator';
import { SancaiWugeCalculator } from './sancai-calculator';
import { QimingDataLoader } from './data-loader';
import { PinyinAnalyzer } from './pinyin-analyzer';
import { NameGenerationConfig, GeneratedName, NameValidationResult, PhoneticAnalysis } from './types';
import { ensureDataReady, isDataReady, getLoadingState } from './global-preloader';

/**
 * qiming主要API类
 * 整合所有功能，提供简单易用的接口
 */
export class QimingAPI {
  private generator: QimingNameGenerator;
  private calculator: SancaiWugeCalculator;
  private dataLoader: QimingDataLoader;
  private pinyinAnalyzer: PinyinAnalyzer;
  private initialized: boolean = false;

  constructor() {
    this.generator = new QimingNameGenerator();
    this.calculator = new SancaiWugeCalculator();
    this.dataLoader = QimingDataLoader.getInstance();
    this.pinyinAnalyzer = PinyinAnalyzer.getInstance();
  }

  /**
   * 初始化系统
   * 预加载所有必要的数据
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('初始化qiming取名系统...');
    const startTime = Date.now();

    try {
      await Promise.all([
        this.dataLoader.preloadCoreData(),
        this.pinyinAnalyzer.initialize()
      ]);

      this.initialized = true;
      const endTime = Date.now();
      console.log(`qiming系统初始化完成，耗时: ${endTime - startTime}ms`);
    } catch (error) {
      console.error('qiming系统初始化失败:', error);
      throw error;
    }
  }

  /**
   * 生成名字 - 主要功能
   * 对应qiming/2generate_name.py
   */
  async generateNames(config: NameGenerationConfig): Promise<GeneratedName[]> {
    await this.ensureInitialized();
    return this.generator.generateNames(config);
  }

  /**
   * 验证单个名字
   * 对应qiming/4check_sancai_wuge.py的单个名字检查
   */
  async validateName(
    fullName: string, 
    useTraditional: boolean = false
  ): Promise<NameValidationResult> {
    await this.ensureInitialized();
    return await this.calculator.checkSancaiWuge(fullName, useTraditional);
  }

  /**
   * 批量验证名字
   * 对应qiming/4check_sancai_wuge.py的批量检查
   */
  async validateNames(
    nameList: string[], 
    useTraditional: boolean = false
  ): Promise<Map<string, NameValidationResult>> {
    await this.ensureInitialized();
    return await this.generator.batchCheckNames(nameList, useTraditional);
  }

  /**
   * 声调分析
   * 对应qiming/3analysis_name.py
   */
  async analyzeByTone(
    names: string[],
    targetMidTone: number,
    targetLastTone: number
  ): Promise<{
    filteredNames: string[];
    midCharacters: Set<string>;
    lastCharacters: Set<string>;
  }> {
    await this.ensureInitialized();
    return this.generator.filterByTone(names, targetMidTone, targetLastTone);
  }

  /**
   * 生成小名
   * 对应qiming/6xiaoming.py
   */
  async generateXiaoming(wuxing: 'jin' | 'mu' | 'shui' | 'huo' | 'tu'): Promise<string[]> {
    await this.ensureInitialized();
    return this.generator.generateXiaoming(wuxing);
  }

  /**
   * 随机选择名字
   * 对应qiming/5get-by-god.py
   */
  randomSelectNames(nameList: string[], count: number = 10): string[] {
    return this.generator.randomSelectNames(nameList, count);
  }

  /**
   * 获取系统状态
   */
  getSystemStatus(): Record<string, any> {
    return {
      initialized: this.initialized,
      dataStatus: this.dataLoader.getLoadStatus(),
      generatorStatus: this.generator.getStatus(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 确保系统已初始化
   * 优先使用全局预加载器，回退到传统初始化
   */
  private async ensureInitialized(): Promise<void> {
    // 首先检查全局预加载状态
    if (isDataReady()) {
      // 数据已预加载，只需要确保本地实例已初始化
      if (!this.initialized) {
        this.initialized = true;
        console.log('✅ 使用预加载数据，qiming实例已就绪');
      }
      return;
    }

    // 如果数据未预加载，使用全局预加载器
    console.log(`📊 当前预加载状态: ${getLoadingState()}`);
    await ensureDataReady();
    
    // 标记为已初始化
    this.initialized = true;
    console.log('✅ 通过全局预加载器完成qiming实例初始化');
  }

  /**
   * 分析名字的音律和谐度
   */
  async analyzeNamePhonetics(familyName: string, givenName: string): Promise<{
    analysis: PhoneticAnalysis[];
    harmony: number;
    tonePattern: string;
    suggestions: string[];
  }> {
    await this.initialize();
    return this.pinyinAnalyzer.analyzeNamePhonetics(familyName, givenName);
  }

  /**
   * 分析单个汉字的音律信息
   */
  async analyzeCharPhonetics(char: string): Promise<PhoneticAnalysis | null> {
    await this.initialize();
    return this.pinyinAnalyzer.analyzePhonetics(char);
  }

  /**
   * 获取拼音分析器统计信息
   */
  async getPinyinStats(): Promise<{
    totalChars: number;
    toneDistribution: { [tone: number]: number };
    wuxingDistribution: { [wuxing: string]: number };
  }> {
    await this.initialize();
    return this.pinyinAnalyzer.getStats();
  }
}

/**
 * 创建默认的qiming实例
 */
let defaultInstance: QimingAPI | null = null;

export function getQimingInstance(): QimingAPI {
  if (!defaultInstance) {
    defaultInstance = new QimingAPI();
  }
  return defaultInstance;
}

/**
 * 便捷函数：快速生成名字
 */
export async function quickGenerateNames(
  familyName: string,
  gender: 'male' | 'female' = 'female',
  options?: Partial<NameGenerationConfig>
): Promise<GeneratedName[]> {
  const qiming = getQimingInstance();
  
  const config: NameGenerationConfig = {
    familyName,
    gender,
    useTraditional: false,
    scoreThreshold: 85,
    ...options
  };

  return qiming.generateNames(config);
}

/**
 * 便捷函数：快速验证名字
 */
export async function quickValidateName(
  fullName: string,
  useTraditional: boolean = false
): Promise<NameValidationResult> {
  const qiming = getQimingInstance();
  return qiming.validateName(fullName, useTraditional);
}

/**
 * 便捷函数：初始化系统
 */
export async function initializeQiming(): Promise<void> {
  const qiming = getQimingInstance();
  await qiming.initialize();
}

/**
 * 测试函数：验证与qiming的兼容性
 */
export async function testQimingCompatibility(): Promise<{
  success: boolean;
  details: Record<string, any>;
}> {
  try {
    const qiming = getQimingInstance();
    await qiming.initialize();

    // 测试用例1：生成刘姓女孩名字
    const testNames1 = await qiming.generateNames({
      familyName: '刘',
      gender: 'female',
      useTraditional: false,
      scoreThreshold: 80
    });

    // 测试用例2：验证特定名字
    const testValidation1 = await qiming.validateName('刘泽娇', false);
    const testValidation2 = await qiming.validateName('刘泽娇', true);

    // 测试用例3：生成小名
    const testXiaoming = await qiming.generateXiaoming('shui');

    return {
      success: true,
      details: {
        generatedNamesCount: testNames1.length,
        topNames: testNames1.slice(0, 5).map(n => n.fullName),
        simplifiedValidation: {
          name: '刘泽娇',
          score: testValidation1.score,
          sancai: testValidation1.sancai.combination
        },
        traditionalValidation: {
          name: '刘泽娇',
          score: testValidation2.score,
          sancai: testValidation2.sancai.combination
        },
        xiaomingCount: testXiaoming.length,
        sampleXiaoming: testXiaoming.slice(0, 10)
      }
    };
  } catch (error) {
    return {
      success: false,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

// 默认导出qiming实例
export default getQimingInstance();