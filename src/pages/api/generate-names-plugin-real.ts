import { NextApiRequest, NextApiResponse } from 'next';
import { CertaintyLevel } from '../../core/plugins/interfaces/NamingPlugin';
import { confidenceCalculator, ConfidenceResult } from '../../core/plugins/utils/ConfidenceCalculator';
import { truePluginEngine } from '../../core/plugins/core/TruePluginEngine';

// 详细执行日志接口
interface PluginExecutionLog {
  pluginId: string;
  layer: 1 | 2 | 3 | 4;
  startTime: number;
  endTime?: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  input?: any;
  output?: any;
  error?: string;
  dependencies: string[];
  metadata: {
    description: string;
    confidence: number;
    executionTime?: number;
    category: string;
  };
}

// 详细日志收集器
class DetailedLogger {
  private logs: PluginExecutionLog[] = [];
  
  startPlugin(pluginId: string, layer: number, input: any, dependencies: string[] = []): PluginExecutionLog {
    const log: PluginExecutionLog = {
      pluginId,
      layer: layer as 1|2|3|4,
      startTime: Date.now(),
      status: 'running',
      input,
      dependencies,
      metadata: {
        description: this.getPluginDescription(pluginId),
        confidence: 0,
        category: this.getPluginCategory(pluginId)
      }
    };
    this.logs.push(log);
    this.logMessage(`🔄 [Layer ${layer}] 开始执行插件: ${pluginId} - ${log.metadata.description}`);
    return log;
  }
  
  completePlugin(pluginId: string, output: any, inputData: any = {}) {
    const log = this.logs.find(l => l.pluginId === pluginId && l.status === 'running');
    if (log) {
      // 使用智能置信度计算器
      const confidenceResult = confidenceCalculator.calculateConfidence({
        pluginId,
        inputData,
        context: {
          certaintyLevel: 'PARTIALLY_DETERMINED',
          availableData: this.getAvailablePlugins()
        }
      });
      
      log.endTime = Date.now();
      log.status = 'completed';
      log.output = {
        ...output,
        confidenceAnalysis: confidenceResult
      };
      log.metadata.confidence = confidenceResult.score;
      log.metadata.executionTime = log.endTime - log.startTime;
      
      this.logMessage(`✅ [Layer ${log.layer}] 插件完成: ${pluginId} (${log.metadata.executionTime}ms, 置信度: ${confidenceResult.score}%)`);
      
      // 如果置信度较低，输出详细原因
      if (confidenceResult.score < 80) {
        this.logMessage(`   📊 置信度分析: ${confidenceResult.level} - ${confidenceResult.factors.join(', ')}`);
        if (confidenceResult.recommendations.length > 0) {
          this.logMessage(`   💡 建议: ${confidenceResult.recommendations.join(', ')}`);
        }
      }
    }
  }
  
  private getAvailablePlugins(): string[] {
    return this.logs
      .filter(log => log.status === 'completed')
      .map(log => log.pluginId);
  }
  
  failPlugin(pluginId: string, error: string) {
    const log = this.logs.find(l => l.pluginId === pluginId && l.status === 'running');
    if (log) {
      log.endTime = Date.now();
      log.status = 'failed';
      log.error = error;
      log.metadata.executionTime = log.endTime! - log.startTime;
      this.logMessage(`❌ [Layer ${log.layer}] 插件失败: ${pluginId} - ${error} (${log.metadata.executionTime}ms)`);
    }
  }
  
  skipPlugin(pluginId: string, reason: string) {
    const log: PluginExecutionLog = {
      pluginId,
      layer: this.getPluginLayer(pluginId),
      startTime: Date.now(),
      endTime: Date.now(),
      status: 'skipped',
      dependencies: [],
      metadata: {
        description: this.getPluginDescription(pluginId),
        confidence: 0,
        executionTime: 0,
        category: this.getPluginCategory(pluginId)
      },
      error: reason
    };
    this.logs.push(log);
    this.logMessage(`⚠️ [Layer ${log.layer}] 插件跳过: ${pluginId} - ${reason}`);
  }
  
  getLogs(): PluginExecutionLog[] {
    return [...this.logs];
  }
  
  getLayerSummary() {
    const layerGroups = this.logs.reduce((acc, log) => {
      const layer = `layer${log.layer}`;
      if (!acc[layer]) {
        acc[layer] = {
          layer: log.layer,
          plugins: [],
          totalTime: 0,
          successCount: 0,
          failureCount: 0,
          skipCount: 0
        };
      }
      
      acc[layer].plugins.push(log);
      acc[layer].totalTime += log.metadata.executionTime || 0;
      
      switch (log.status) {
        case 'completed': acc[layer].successCount++; break;
        case 'failed': acc[layer].failureCount++; break;
        case 'skipped': acc[layer].skipCount++; break;
      }
      
      return acc;
    }, {} as Record<string, any>);
    
    return layerGroups;
  }
  
  getExecutionSummary() {
    const totalTime = this.logs.reduce((sum, log) => sum + (log.metadata.executionTime || 0), 0);
    const successCount = this.logs.filter(log => log.status === 'completed').length;
    const totalCount = this.logs.length;
    
    return {
      totalTime,
      totalPlugins: totalCount,
      successCount,
      failureCount: this.logs.filter(log => log.status === 'failed').length,
      skipCount: this.logs.filter(log => log.status === 'skipped').length,
      successRate: totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0
    };
  }
  
  private getPluginDescription(pluginId: string): string {
    const descriptions: Record<string, string> = {
      'surname': '解析姓氏信息和笔画数',
      'gender': '处理性别信息，获取对应常用字库',
      'birth-time': '分析出生时间，提取时间要素',
      'family-tradition': '处理家族传统和命名偏好',
      'bazi': '八字分析，确定命理基础',
      'zodiac': '生肖分析，获取生肖宜忌',
      'xiyongshen': '喜用神分析，确定五行需求',
      'stroke': '笔画分析，计算最优笔画组合',
      'wuxing-char': '五行字符筛选，按五行属性筛选候选字',
      'zodiac-char': '生肖用字分析，筛选生肖吉祥字',
      'meaning': '字义寓意分析，评估字符积极含义',
      'phonetic': '音韵分析，评估声调和谐度',
      'sancai': '三才五格计算，数理吉凶分析',
      'yijing': '易经卦象分析，周易数理推演',
      'dayan': '大衍之数计算，数字能量分析',
      'wuxing-balance': '五行平衡评估，整体五行和谐度',
      'name-generation': '最终名字生成和综合评分'
    };
    
    return descriptions[pluginId] || `插件: ${pluginId}`;
  }
  
  private getPluginCategory(pluginId: string): string {
    const categories: Record<string, string> = {
      'surname': '基础信息', 'gender': '基础信息', 'birth-time': '基础信息', 'family-tradition': '基础信息',
      'bazi': '命理分析', 'zodiac': '命理分析', 'xiyongshen': '命理分析',
      'stroke': '字符评估', 'wuxing-char': '字符评估', 'zodiac-char': '字符评估', 'meaning': '字符评估', 'phonetic': '字符评估',
      'sancai': '组合计算', 'yijing': '组合计算', 'dayan': '组合计算', 'wuxing-balance': '组合计算',
      'name-generation': '名字生成'
    };
    
    return categories[pluginId] || '未知类别';
  }
  
  private getPluginLayer(pluginId: string): 1 | 2 | 3 | 4 {
    const layers: Record<string, 1 | 2 | 3 | 4> = {
      'surname': 1, 'gender': 1, 'birth-time': 1, 'family-tradition': 1,
      'bazi': 2, 'zodiac': 2, 'xiyongshen': 2,
      'stroke': 3, 'wuxing-char': 3, 'zodiac-char': 3, 'meaning': 3, 'phonetic': 3,
      'sancai': 4, 'yijing': 4, 'dayan': 4, 'wuxing-balance': 4,
      'name-generation': 4
    };
    
    return layers[pluginId] || 1;
  }
  
  logMessage(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`);
  }
}

// 真实插件系统执行
async function executeRealPluginSystem(request: any, logger: DetailedLogger): Promise<any> {
  const startTime = Date.now();
  
  // 确定执行策略
  const certaintyLevel = determineCertaintyLevel(request);
  logger.logMessage(`📊 插件系统执行开始`);
  logger.logMessage(`├── 🎯 确定性等级: ${certaintyLevel}`);
  logger.logMessage(`├── 📋 请求信息: 姓氏"${request.familyName}", 性别"${request.gender}"`);
  logger.logMessage(`└── 🔄 执行策略: 真实插件引擎`);
  
  try {
    // 使用真正的插件系统引擎
    const engineResult = await truePluginEngine.executeFullPipeline({
      familyName: request.familyName,
      gender: request.gender,
      birthInfo: request.birthInfo,
      preferences: {
        certaintyLevel: certaintyLevel as any,
        includeTraditionalAnalysis: false,
        skipOptionalFailures: false
      },
      scoreThreshold: 80,
      useTraditional: false,
      avoidedWords: [],
      limit: 5,
      offset: 0
    });

    // 将引擎结果转换为日志格式
    logger.logMessage(`\n📋 真实插件执行结果:`);
    
    for (const [pluginId, result] of engineResult.pluginResults) {
      // 确定插件所属层级
      let layerNum = 1;
      if (['surname', 'gender', 'birth-time', 'family-tradition'].includes(pluginId)) {
        layerNum = 1;
      } else if (['bazi', 'zodiac', 'xiyongshen'].includes(pluginId)) {
        layerNum = 2;
      } else if (['stroke', 'wuxing-char', 'zodiac-char', 'meaning', 'phonetic'].includes(pluginId)) {
        layerNum = 3;
      } else {
        layerNum = 4;
      }

      // 记录插件执行
      logger.startPlugin(pluginId, layerNum as 1|2|3|4, {});
      
      if (result.success) {
        logger.completePlugin(pluginId, result.data, {});
      } else {
        logger.failPlugin(pluginId, result.metadata?.error || '执行失败');
      }
    }

    const totalTime = Date.now() - startTime;
    logger.logMessage(`\n🎯 真实插件系统执行完成，总耗时: ${totalTime}ms`);
    logger.logMessage(`📝 生成名字数量: ${engineResult.names.length}`);

    return {
      names: engineResult.names,
      totalTime,
      certaintyLevel,
      pluginCount: logger.getLogs().length,
      engineSuccess: engineResult.success
    };

  } catch (error) {
    logger.logMessage(`❌ 插件引擎执行失败: ${error instanceof Error ? error.message : '未知错误'}`);
    
    // 回退到基础模拟结果
    const names = [
      {
        fullName: `${request.familyName}博文`,
        familyName: request.familyName,
        midChar: '博',
        lastChar: '文',
        score: 78,
        grids: { tiange: 8, renge: 19, dige: 16, zongge: 23, waige: 5 },
        sancai: { heaven: '金', human: '水', earth: '土', combination: '金水土', level: '中吉' },
        explanation: '博学多才，文采斐然'
      }
    ];
    
    return {
      names,
      totalTime: Date.now() - startTime,
      certaintyLevel,
      pluginCount: logger.getLogs().length,
      engineSuccess: false,
      fallback: true
    };
  }
}

function determineCertaintyLevel(request: any): CertaintyLevel {
  if (request.birthInfo?.hour !== undefined) {
    return CertaintyLevel.FULLY_DETERMINED;
  } else if (request.birthInfo?.day !== undefined) {
    return CertaintyLevel.PARTIALLY_DETERMINED;
  } else if (request.birthInfo?.year !== undefined) {
    return CertaintyLevel.ESTIMATED;
  } else {
    return CertaintyLevel.UNKNOWN;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      familyName,
      gender,
      birthDate,
      birthTime,
      birthInfo,  // 新增：支持 birthInfo 结构
      preferredElements,
      avoidedWords,
      scoreThreshold,
      useTraditional,
      limit = 5,
      offset = 0,
      weights,
      preferences,  // 新增：支持 preferences 结构
      // 插件系统特有参数
      certaintyLevel,
      enableParallel = false,
      enableDetailedLogs = true
    } = req.body;

    // 验证必要参数
    if (!familyName || !gender) {
      return res.status(400).json({ 
        success: false, 
        error: '缺少必要参数：familyName 和 gender' 
      });
    }

    // 构建插件系统请求 - 优先使用 birthInfo 结构
    const namingRequest = {
      familyName,
      gender: gender as 'male' | 'female',
      birthInfo: birthInfo || (birthDate ? {
        year: new Date(birthDate).getFullYear(),
        month: new Date(birthDate).getMonth() + 1,
        day: new Date(birthDate).getDate(),
        hour: birthTime ? parseInt(birthTime.split(':')[0]) : undefined,
        minute: birthTime ? parseInt(birthTime.split(':')[1]) : undefined
      } : undefined),
      characters: avoidedWords,
      preferences: {
        certaintyLevel: preferences?.certaintyLevel || certaintyLevel || undefined,
        parallelExecution: enableParallel,
        includeTraditionalAnalysis: useTraditional || false,
        skipOptionalFailures: true
      }
    };

    console.log('🚀 真实插件系统生成名字开始:', {
      familyName: namingRequest.familyName,
      gender: namingRequest.gender,
      certaintyLevel: determineCertaintyLevel(namingRequest),
      parallelExecution: enableParallel,
      detailedLogs: enableDetailedLogs
    });

    const startTime = Date.now();
    const logger = new DetailedLogger();
    
    // 执行真实插件系统
    const result = await executeRealPluginSystem(namingRequest, logger);
    
    // 获取详细日志
    const executionLogs = logger.getLogs();
    const layerSummary = logger.getLayerSummary();
    const executionSummary = logger.getExecutionSummary();
    
    const totalTime = Date.now() - startTime;
    
    console.log('📊 真实插件系统执行完成:', {
      totalTime: `${totalTime}ms`,
      successRate: `${executionSummary.successRate}%`,
      pluginCount: executionSummary.totalPlugins,
      namesGenerated: result.names.length,
      engineSuccess: result.engineSuccess
    });

    // 构建响应
    const response = {
      success: true,
      data: {
        names: result.names.slice(offset, offset + limit),
        pagination: {
          limit,
          offset,
          total: result.names.length,
          hasMore: offset + limit < result.names.length
        },
        
        // 插件系统特有信息
        pluginSystem: {
          version: '2.0.0-real',
          certaintyLevel: result.certaintyLevel,
          executionStrategy: enableParallel ? '并行执行' : '串行执行',
          realEngine: result.engineSuccess,
          fallback: result.fallback || false,
          
          // 执行摘要
          executionSummary: {
            totalTime,
            totalPlugins: executionSummary.totalPlugins,
            successCount: executionSummary.successCount,
            failureCount: executionSummary.failureCount,
            skipCount: executionSummary.skipCount,
            successRate: executionSummary.successRate,
            
            // 分层统计
            layerBreakdown: Object.values(layerSummary).map((layer: any) => ({
              layer: layer.layer,
              pluginCount: layer.plugins.length,
              totalTime: layer.totalTime,
              successCount: layer.successCount,
              failureCount: layer.failureCount,
              skipCount: layer.skipCount,
              description: getLayerDescription(layer.layer)
            }))
          },
          
          // 详细执行日志
          detailedLogs: enableDetailedLogs ? executionLogs : undefined,
          
          // 分层结果
          layerResults: {
            layer1: {
              description: '基础信息层 - 姓氏、性别、时间信息处理',
              results: executionLogs.filter(log => log.layer === 1 && log.status === 'completed')
                .reduce((acc, log) => ({ ...acc, [log.pluginId]: log.output }), {})
            },
            layer2: {
              description: '命理基础层 - 八字、生肖、喜用神分析',
              results: executionLogs.filter(log => log.layer === 2 && log.status === 'completed')
                .reduce((acc, log) => ({ ...acc, [log.pluginId]: log.output }), {})
            },
            layer3: {
              description: '字符评估层 - 笔画、五行、音韵、字义分析',
              results: executionLogs.filter(log => log.layer === 3 && log.status === 'completed')
                .reduce((acc, log) => ({ ...acc, [log.pluginId]: log.output }), {})
            },
            layer4: {
              description: '组合计算层 - 三才五格、易经、大衍数理',
              results: executionLogs.filter(log => log.layer === 4 && log.status === 'completed')
                .reduce((acc, log) => ({ ...acc, [log.pluginId]: log.output }), {})
            }
          },
          
          // 警告和建议
          warnings: [
            ...executionLogs.filter(log => log.status === 'failed').map(log => 
              `插件 ${log.pluginId} 执行失败: ${log.error}`),
            ...executionLogs.filter(log => log.status === 'skipped').map(log => 
              `插件 ${log.pluginId} 被跳过: ${log.error}`)
          ],
          
          recommendations: [
            result.certaintyLevel === CertaintyLevel.FULLY_DETERMINED 
              ? '基于完整信息的全面分析，结果可信度高'
              : '建议提供更完整的出生信息以提高分析准确度',
            executionSummary.failureCount > 0 
              ? `有 ${executionSummary.failureCount} 个插件执行失败，可能影响分析完整性`
              : '所有插件执行成功，分析结果完整可靠',
            result.engineSuccess
              ? '✅ 使用真实取名引擎，结果可靠'
              : '⚠️ 取名引擎执行失败，使用备用逻辑'
          ]
        }
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('真实插件系统生成名字失败:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '真实插件系统执行失败',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}

// 辅助函数 - 获取层级描述
function getLayerDescription(layer: number): string {
  const descriptions = {
    1: '基础信息层 - 处理姓氏、性别、出生时间等基础信息',
    2: '命理基础层 - 进行八字、生肖、喜用神等命理分析',
    3: '字符评估层 - 评估候选字的笔画、五行、音韵、字义',
    4: '组合计算层 - 计算名字组合的三才五格、易经卦象等'
  };
  
  return descriptions[layer as keyof typeof descriptions] || '未知层级';
}
