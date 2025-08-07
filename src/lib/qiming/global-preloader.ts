/**
 * 全局数据预加载管理器
 * 负责在应用启动时预加载所有核心数据，确保并发安全
 */

// 避免循环导入，在运行时动态加载

export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  COMPLETED = 'completed',
  ERROR = 'error'
}

class GlobalDataPreloader {
  private static instance: GlobalDataPreloader;
  private loadingState: LoadingState = LoadingState.IDLE;
  private loadingPromise: Promise<void> | null = null;
  private startTime: number = 0;
  private loadingProgress: {
    [key: string]: {
      completed: boolean;
      startTime: number;
      endTime?: number;
      error?: string;
    }
  } = {};

  private constructor() {
    // 初始化时不需要创建QimingAPI实例
  }

  static getInstance(): GlobalDataPreloader {
    if (!GlobalDataPreloader.instance) {
      GlobalDataPreloader.instance = new GlobalDataPreloader();
    }
    return GlobalDataPreloader.instance;
  }

  /**
   * 获取当前加载状态
   */
  getLoadingState(): LoadingState {
    return this.loadingState;
  }

  /**
   * 获取加载进度详情
   */
  getLoadingProgress() {
    return {
      state: this.loadingState,
      totalTime: this.loadingState === LoadingState.COMPLETED && this.startTime ? Date.now() - this.startTime : 0,
      details: this.loadingProgress
    };
  }

  /**
   * 检查是否已完成加载
   */
  isDataReady(): boolean {
    return this.loadingState === LoadingState.COMPLETED;
  }

  /**
   * 开始预加载数据（并发安全）
   * 如果已经在加载或已完成，返回现有的Promise
   */
  async preloadData(): Promise<void> {
    // 如果已经完成加载，直接返回
    if (this.loadingState === LoadingState.COMPLETED) {
      console.log('✅ 数据已预加载完成，无需重复加载');
      return Promise.resolve();
    }

    // 如果正在加载，返回现有的Promise
    if (this.loadingState === LoadingState.LOADING && this.loadingPromise) {
      console.log('⏳ 数据正在加载中，等待完成...');
      return this.loadingPromise;
    }

    // 开始新的加载过程
    this.loadingState = LoadingState.LOADING;
    this.startTime = Date.now();
    console.log('🚀 开始全局数据预加载...');

    this.loadingPromise = this.executePreload();
    
    try {
      await this.loadingPromise;
      this.loadingState = LoadingState.COMPLETED;
      const totalTime = Date.now() - this.startTime;
      console.log(`✅ 全局数据预加载完成，总耗时: ${totalTime}ms`);
      
      // 输出加载统计
      this.logLoadingStats();
    } catch (error) {
      this.loadingState = LoadingState.ERROR;
      console.error('❌ 全局数据预加载失败:', error);
      throw error;
    }

    return this.loadingPromise;
  }

  /**
   * 执行实际的预加载过程
   */
  private async executePreload(): Promise<void> {
    const tasks = [
      {
        name: 'qiming_system',
        description: '取名系统初始化',
        task: async () => {
          // 动态导入避免循环依赖
          const { QimingDataLoader } = await import('./data-loader');
          const { PinyinAnalyzer } = await import('./pinyin-analyzer');
          const { StandardCharactersValidator } = await import('./standard-characters-validator');
          
          // 预加载核心数据
          const dataLoader = QimingDataLoader.getInstance();
          const pinyinAnalyzer = PinyinAnalyzer.getInstance();
          const standardValidator = StandardCharactersValidator.getInstance();
          
          await Promise.all([
            dataLoader.preloadCoreData(),
            pinyinAnalyzer.initialize(),
            standardValidator.initialize() // 🎯 新增：预加载标准字符验证器
          ]);
        }
      }
    ];

    // 并行执行所有预加载任务
    await Promise.all(
      tasks.map(async (taskInfo) => {
        const taskStartTime = Date.now();
        this.loadingProgress[taskInfo.name] = {
          completed: false,
          startTime: taskStartTime
        };

        try {
          console.log(`📥 开始加载: ${taskInfo.description}...`);
          await taskInfo.task();
          
          const taskEndTime = Date.now();
          this.loadingProgress[taskInfo.name] = {
            completed: true,
            startTime: taskStartTime,
            endTime: taskEndTime
          };
          
          console.log(`✅ 完成加载: ${taskInfo.description} (${taskEndTime - taskStartTime}ms)`);
        } catch (error) {
          const taskEndTime = Date.now();
          this.loadingProgress[taskInfo.name] = {
            completed: false,
            startTime: taskStartTime,
            endTime: taskEndTime,
            error: error instanceof Error ? error.message : String(error)
          };
          
          console.error(`❌ 加载失败: ${taskInfo.description}`, error);
          throw error;
        }
      })
    );
  }

  /**
   * 输出加载统计信息
   */
  private logLoadingStats(): void {
    console.log('\n📊 数据预加载统计:');
    console.log('=' .repeat(50));
    
    let totalTaskTime = 0;
    for (const [taskName, progress] of Object.entries(this.loadingProgress)) {
      const duration = progress.endTime && progress.startTime ? progress.endTime - progress.startTime : 0;
      totalTaskTime += duration;
      
      const status = progress.completed ? '✅' : '❌';
      const errorMsg = progress.error ? ` (错误: ${progress.error})` : '';
      console.log(`  ${status} ${taskName}: ${duration}ms${errorMsg}`);
    }
    
    const totalTime = Date.now() - this.startTime;
    console.log('=' .repeat(50));
    console.log(`📈 总耗时: ${totalTime}ms`);
    console.log(`🔄 任务并行效率: ${totalTaskTime > 0 ? Math.round((totalTaskTime / totalTime) * 100) : 0}%`);
    console.log(`🎯 预加载状态: ${this.loadingState}`);
  }

  /**
   * 重置加载状态（用于测试或重新加载）
   */
  reset(): void {
    this.loadingState = LoadingState.IDLE;
    this.loadingPromise = null;
    this.startTime = 0;
    this.loadingProgress = {};
    console.log('🔄 全局预加载器已重置');
  }

  /**
   * 等待数据准备就绪
   * 如果数据未开始加载，会自动触发加载
   */
  async waitForDataReady(): Promise<void> {
    if (this.isDataReady()) {
      return Promise.resolve();
    }
    
    return this.preloadData();
  }
}

// 导出单例实例和工具函数
export const globalPreloader = GlobalDataPreloader.getInstance();

/**
 * 便捷函数：确保数据已准备就绪
 */
export async function ensureDataReady(): Promise<void> {
  return globalPreloader.waitForDataReady();
}

/**
 * 便捷函数：检查数据是否已准备
 */
export function isDataReady(): boolean {
  return globalPreloader.isDataReady();
}

/**
 * 便捷函数：获取加载状态
 */
export function getLoadingState(): LoadingState {
  return globalPreloader.getLoadingState();
}

/**
 * 便捷函数：获取加载进度
 */
export function getLoadingProgress() {
  return globalPreloader.getLoadingProgress();
}