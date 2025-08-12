/**
 * 姓氏插件 - Layer 1
 * 处理姓氏信息，包括笔画数、五行属性等基础信息
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

import { SancaiWugeCalculator } from '../../../calculation/sancai-calculator';
import { QimingDataLoader } from '../../../common/data-loader';

export class SurnamePlugin implements NamingPlugin {
  readonly id = 'surname';
  readonly version = '1.0.0';
  readonly layer = 1;
  readonly dependencies: PluginDependency[] = [];
  readonly metadata: PluginMetadata = {
    name: '姓氏分析插件',
    description: '分析姓氏的笔画数、五行属性等基础信息',
    author: 'System',
    category: 'input',
    tags: ['surname', 'strokes', 'wuxing', 'basic']
  };

  private config: PluginConfig | null = null;
  private sancaiCalculator: SancaiWugeCalculator;
  private dataLoader: QimingDataLoader;

  constructor() {
    this.sancaiCalculator = new SancaiWugeCalculator();
    this.dataLoader = QimingDataLoader.getInstance();
  }

  /**
   * 初始化插件
   */
  async initialize(config: PluginConfig, context: PluginContext): Promise<void> {
    this.config = config;
    await this.dataLoader.preloadCoreData();
    context.log('info', `姓氏插件初始化完成, 版本: ${this.version}`);
  }

  /**
   * 处理输入数据
   */
  async process(input: StandardInput): Promise<PluginOutput> {
    const startTime = Date.now();
    const { data } = input;
    
    if (!data.familyName) {
      throw new Error('缺少必要的姓氏信息');
    }

    const familyName = data.familyName.trim();
    
    // 分析姓氏信息
    const analysis = await this.analyzeSurname(familyName);
    
    return {
      pluginId: this.id,
      results: {
        surname: familyName,
        strokes: analysis.strokes,
        strokesTraditional: analysis.strokesTraditional,
        wuxing: analysis.wuxing,
        isSingleChar: analysis.isSingleChar,
        isCompoundSurname: analysis.isCompoundSurname,
        baijiaxingRank: analysis.baijiaxingRank,
        metadata: {
          source: 'baijiaxing',
          confidence: analysis.confidence,
          isCommon: analysis.isCommon
        }
      },
      confidence: analysis.confidence,
      metadata: {
        processingTime: Date.now() - startTime,
        dataSource: 'core-data'
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

    if (!data.familyName) {
      errors.push('姓氏信息不能为空');
    } else {
      const familyName = data.familyName.trim();
      
      // 验证姓氏长度
      if (familyName.length === 0) {
        errors.push('姓氏不能为空字符串');
      } else if (familyName.length > 3) {
        warnings.push('姓氏长度超过3个字符，可能不是有效姓氏');
      }

      // 验证字符类型
      if (!/^[\u4e00-\u9fff]+$/.test(familyName)) {
        errors.push('姓氏必须为汉字');
      }

      // 检查是否为常见姓氏
      if (familyName.length === 1) {
        // 单字姓氏检查（可以基于百家姓数据）
        // TODO: 这里可以添加更具体的验证逻辑
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 分析姓氏详细信息
   */
  private async analyzeSurname(surname: string) {
    const isSingleChar = surname.length === 1;
    const isCompoundSurname = surname.length > 1;
    
    // 计算笔画数
    const strokes = await this.sancaiCalculator.getStrokes(surname, false);
    const strokesTraditional = await this.sancaiCalculator.getStrokes(surname, true);
    
    // 获取五行属性 (简化实现，可以后续完善)
    const wuxing = this.getWuxingBySurname(surname);
    
    // 获取百家姓排名 (简化实现)
    const baijiaxingRank = await this.getBaijiaxingRank(surname);
    
    // 判断是否为常见姓氏
    const isCommon = baijiaxingRank > 0 && baijiaxingRank <= 100;
    
    // 计算置信度
    let confidence = 1.0;
    if (!isCommon) confidence *= 0.8;
    if (isCompoundSurname && surname.length > 2) confidence *= 0.7;
    
    return {
      strokes,
      strokesTraditional,
      wuxing,
      isSingleChar,
      isCompoundSurname,
      baijiaxingRank,
      isCommon,
      confidence
    };
  }

  /**
   * 根据姓氏获取五行属性
   * TODO: 这里可以实现更复杂的五行判断逻辑
   */
  private getWuxingBySurname(surname: string): string {
    // 简化实现：基于第一个字符的部首判断
    // 实际应该使用更专业的五行字典
    const firstChar = surname[0];
    
    // 常见的五行映射（简化版）
    const wuxingMap: Record<string, string[]> = {
      'jin': ['刘', '金', '申', '李', '钟', '谢', '秦'],
      'mu': ['林', '李', '杨', '朱', '柳', '梁', '杜'],
      'shui': ['王', '江', '池', '汤', '汪', '潘', '洪'],
      'huo': ['陈', '张', '赵', '许', '邓', '夏', '南'],
      'tu': ['黄', '吴', '袁', '白', '石', '田', '王']
    };
    
    for (const [element, surnames] of Object.entries(wuxingMap)) {
      if (surnames.includes(firstChar)) {
        return element;
      }
    }
    
    return 'unknown'; // 默认返回未知
  }

  /**
   * 获取百家姓排名
   * TODO: 基于实际的百家姓数据实现
   */
  private async getBaijiaxingRank(surname: string): Promise<number> {
    try {
      // 尝试从百家姓数据中查找
      // 这里是简化实现，实际应该加载百家姓数据文件
      const commonSurnamesRank: Record<string, number> = {
        '王': 1, '李': 2, '张': 3, '刘': 4, '陈': 5,
        '杨': 6, '黄': 7, '赵': 8, '吴': 9, '周': 10,
        '徐': 11, '孙': 12, '马': 13, '朱': 14, '胡': 15,
        '林': 16, '郭': 17, '何': 18, '高': 19, '罗': 20
      };
      
      return commonSurnamesRank[surname[0]] || 0;
    } catch (error) {
      console.warn('获取百家姓排名失败:', error);
      return 0;
    }
  }

  /**
   * 销毁插件，清理资源
   */
  async destroy(): Promise<void> {
    // 清理资源
    console.log('姓氏插件销毁完成');
  }

  /**
   * 检查插件是否可用
   */
  isAvailable(): boolean {
    return this.dataLoader !== null && this.sancaiCalculator !== null;
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
