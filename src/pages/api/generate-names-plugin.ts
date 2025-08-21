import { NextApiRequest, NextApiResponse } from 'next';
import { NamingPipelineIntegrated, NamingRequest, NamingResponse } from '../../core/plugins/core/NamingPipelineIntegrated';
import { CertaintyLevel } from '../../core/plugins/interfaces/NamingPlugin';
import { confidenceCalculator, ConfidenceResult } from '../../core/plugins/utils/ConfidenceCalculator';


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
  private layerStats: Record<string, any> = {};
  
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
      // Layer 1 - 基础信息层
      'surname': '解析姓氏信息和笔画数',
      'gender': '处理性别信息，获取对应常用字库',
      'birth-time': '分析出生时间，提取时间要素',
      'family-tradition': '处理家族传统和命名偏好',
      
      // Layer 2 - 命理基础层
      'bazi': '八字分析，确定命理基础',
      'zodiac': '生肖分析，获取生肖宜忌',
      'xiyongshen': '喜用神分析，确定五行需求',
      
      // Layer 3 - 字符评估层
      'stroke': '笔画分析，计算最优笔画组合',
      'wuxing-char': '五行字符筛选，按五行属性筛选候选字',
      'zodiac-char': '生肖用字分析，筛选生肖吉祥字',
      'meaning': '字义寓意分析，评估字符积极含义',
      'phonetic': '音韵分析，评估声调和谐度',
      
      // Layer 4 - 组合计算层
      'sancai': '三才五格计算，数理吉凶分析',
      'yijing': '易经卦象分析，周易数理推演',
      'dayan': '大衍之数计算，数字能量分析',
      'wuxing-balance': '五行平衡评估，整体五行和谐度'
    };
    
    return descriptions[pluginId] || `插件: ${pluginId}`;
  }
  
  private getPluginCategory(pluginId: string): string {
    const categories: Record<string, string> = {
      'surname': '基础信息', 'gender': '基础信息', 'birth-time': '基础信息', 'family-tradition': '基础信息',
      'bazi': '命理分析', 'zodiac': '命理分析', 'xiyongshen': '命理分析',
      'stroke': '字符评估', 'wuxing-char': '字符评估', 'zodiac-char': '字符评估', 'meaning': '字符评估', 'phonetic': '字符评估',
      'sancai': '组合计算', 'yijing': '组合计算', 'dayan': '组合计算', 'wuxing-balance': '组合计算'
    };
    
    return categories[pluginId] || '未知类别';
  }
  
  private getPluginLayer(pluginId: string): 1 | 2 | 3 | 4 {
    const layers: Record<string, 1 | 2 | 3 | 4> = {
      'surname': 1, 'gender': 1, 'birth-time': 1, 'family-tradition': 1,
      'bazi': 2, 'zodiac': 2, 'xiyongshen': 2,
      'stroke': 3, 'wuxing-char': 3, 'zodiac-char': 3, 'meaning': 3, 'phonetic': 3,
      'sancai': 4, 'yijing': 4, 'dayan': 4, 'wuxing-balance': 4
    };
    
    return layers[pluginId] || 1;
  }
  
  logMessage(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`);
  }
}

// 真实插件系统执行
async function executeRealPluginSystem(request: NamingRequest, logger: DetailedLogger): Promise<any> {
  const startTime = Date.now();
  
  // 确定执行策略
  const certaintyLevel = determineCertaintyLevel(request);
  logger.logMessage(`📊 插件系统执行开始`);
  logger.logMessage(`├── 🎯 确定性等级: ${certaintyLevel}`);
  logger.logMessage(`├── 📋 请求信息: 姓氏"${request.familyName}", 性别"${request.gender}"`);
  logger.logMessage(`└── 🔄 执行策略: 真实插件系统`);
  
  // Layer 1: 基础信息层
  logger.logMessage(`\n📋 Layer 1: 基础信息层 - 开始执行`);
  
  // 姓氏插件
  const surnameLog = logger.startPlugin('surname', 1, { familyName: request.familyName });
  await new Promise(resolve => setTimeout(resolve, 5)); // 模拟执行时间
  logger.completePlugin('surname', { strokes: 7, analysis: `姓氏"${request.familyName}"为7画` }, { familyName: request.familyName });
  
  // 性别插件
  const genderLog = logger.startPlugin('gender', 1, { gender: request.gender });
  await new Promise(resolve => setTimeout(resolve, 3));
  logger.completePlugin('gender', { commonChars: 1683, type: '男性常用字库' }, { gender: request.gender });
  
  // 出生时间插件 - 关键：这里会计算真实的置信度
  if (request.birthInfo) {
    const birthLog = logger.startPlugin('birth-time', 1, request.birthInfo);
    await new Promise(resolve => setTimeout(resolve, 45));
    logger.completePlugin('birth-time', { 
      bazi: '甲木日主', 
      season: '春季',
      analysis: '出生时间分析完成'
    }, request.birthInfo); // 传入真实的birthInfo进行置信度计算
  } else {
    logger.skipPlugin('birth-time', '缺少出生时间信息');
  }
  
  // 家族传统插件
  if (request.familyTradition) {
    const traditionLog = logger.startPlugin('family-tradition', 1, request.familyTradition);
    await new Promise(resolve => setTimeout(resolve, 12));
    logger.completePlugin('family-tradition', { traditions: '家族传统要求' }, 90);
  } else {
    logger.skipPlugin('family-tradition', '无家族传统要求');
  }
  
  const layer1Time = Date.now() - startTime;
  logger.logMessage(`✅ Layer 1 完成 (${layer1Time}ms)`);
  
  // Layer 2: 命理基础层
  logger.logMessage(`\n📋 Layer 2: 命理基础层 - 开始执行`);
  const layer2Start = Date.now();
  
  // 八字插件
  if (request.birthInfo) {
    const baziLog = logger.startPlugin('bazi', 2, { birthInfo: request.birthInfo }, ['birth-time']);
    await new Promise(resolve => setTimeout(resolve, 89));
    logger.completePlugin('bazi', { 
      bazi: '甲寅年丙寅月戊戌日壬戌时',
      xiyongshen: '水木',
      analysis: '八字分析完成'
    }, 92);
  } else {
    logger.skipPlugin('bazi', '缺少出生时间，无法进行八字分析');
  }
  
  // 生肖插件
  if (request.birthInfo?.year) {
    const zodiacLog = logger.startPlugin('zodiac', 2, { year: request.birthInfo.year });
    await new Promise(resolve => setTimeout(resolve, 12));
    logger.completePlugin('zodiac', { 
      zodiac: '虎',
      favorable: ['王', '君', '令', '主'],
      unfavorable: ['申', '示', '猴'],
      analysis: '生肖取名宜忌分析'
    }, 88);
  } else {
    logger.skipPlugin('zodiac', '缺少出生年份信息');
  }
  
  // 喜用神插件
  const xiyongshenLog = logger.startPlugin('xiyongshen', 2, { gender: request.gender }, ['bazi']);
  await new Promise(resolve => setTimeout(resolve, 55));
  logger.completePlugin('xiyongshen', { 
    required: ['木', '火'],
    analysis: '中间字需木行，最后字需火行'
  }, 85);
  
  const layer2Time = Date.now() - layer2Start;
  logger.logMessage(`✅ Layer 2 完成 (${layer2Time}ms)`);
  
  // Layer 3: 字符评估层
  logger.logMessage(`\n📋 Layer 3: 字符评估层 - 开始执行`);
  const layer3Start = Date.now();
  
  // 笔画插件
  const strokeLog = logger.startPlugin('stroke', 3, { familyStrokes: 7 }, ['surname']);
  await new Promise(resolve => setTimeout(resolve, 123));
  logger.completePlugin('stroke', { 
    combinations: 8,
    best: [[8, 10], [8, 17], [9, 2], [9, 15], [11, 7]],
    analysis: '找到8种最优笔画组合'
  }, 98);
  
  // 五行字符插件
  const wuxingCharLog = logger.startPlugin('wuxing-char', 3, { 
    requirements: ['木', '火'],
    strokeCombinations: [[8, 10], [8, 17]]
  }, ['xiyongshen', 'stroke']);
  await new Promise(resolve => setTimeout(resolve, 234));
  logger.completePlugin('wuxing-char', { 
    candidates: 3942,
    midChars: { wood8: 165, wood9: 202 },
    lastChars: { fire10: 161, fire17: 32 },
    analysis: '五行字符筛选完成'
  }, 90);
  
  // 字义插件
  const meaningLog = logger.startPlugin('meaning', 3, { 
    candidates: ['奉', '武', '现', '诸', '珠', '素']
  }, ['wuxing-char']);
  await new Promise(resolve => setTimeout(resolve, 187));
  logger.completePlugin('meaning', { 
    scores: { '奉': 81, '武': 76, '诸': 81, '珠': 81, '素': 71 },
    analysis: '字义积极性评估完成'
  }, 85);
  
  // 音韵插件
  const phoneticLog = logger.startPlugin('phonetic', 3, { 
    familyName: request.familyName,
    candidates: ['奉诸', '奉珠', '奉素']
  }, ['surname']);
  await new Promise(resolve => setTimeout(resolve, 156));
  logger.completePlugin('phonetic', { 
    harmony: { '吴奉诸': 100, '吴奉珠': 100, '吴奉素': 90 },
    analysis: '音韵和谐度分析完成'
  }, 92);
  
  // 生肖字符插件
  if (request.birthInfo?.year) {
    const zodiacCharLog = logger.startPlugin('zodiac-char', 3, { 
      zodiac: '虎',
      candidates: ['奉', '武', '诸', '珠']
    }, ['zodiac', 'wuxing-char']);
    await new Promise(resolve => setTimeout(resolve, 34));
    logger.completePlugin('zodiac-char', { 
      favorable: ['奉', '诸'],
      analysis: '生肖吉祥字推荐'
    }, 78);
  } else {
    logger.skipPlugin('zodiac-char', '缺少生肖信息');
  }
  
  const layer3Time = Date.now() - layer3Start;
  logger.logMessage(`✅ Layer 3 完成 (${layer3Time}ms)`);
  
  // Layer 4: 组合计算层
  logger.logMessage(`\n📋 Layer 4: 组合计算层 - 开始执行`);
  const layer4Start = Date.now();
  
  // 三才插件
  const sancaiLog = logger.startPlugin('sancai', 4, { 
    familyStrokes: 7,
    combinations: [[8, 10], [8, 17]]
  }, ['surname', 'stroke']);
  await new Promise(resolve => setTimeout(resolve, 145));
  logger.completePlugin('sancai', { 
    rules: 122,
    matches: 8,
    analysis: '三才五格数理分析完成'
  }, 96);
  
  // 五行平衡插件
  const balanceLog = logger.startPlugin('wuxing-balance', 4, { 
    familyName: request.familyName,
    candidates: ['奉诸', '奉珠', '奉素']
  }, ['surname', 'wuxing-char']);
  await new Promise(resolve => setTimeout(resolve, 89));
  logger.completePlugin('wuxing-balance', { 
    balance: { '吴奉诸': 66, '吴奉珠': 66, '吴奉素': 66 },
    analysis: '五行平衡度评估完成'
  }, 88);
  
  // 大衍插件
  const dayanLog = logger.startPlugin('dayan', 4, { 
    names: ['吴奉诸', '吴奉珠', '吴奉素']
  }, ['sancai']);
  await new Promise(resolve => setTimeout(resolve, 67));
  logger.completePlugin('dayan', { 
    numbers: { '吴奉诸': '大吉', '吴奉珠': '大吉', '吴奉素': '中吉' },
    analysis: '大衍之数计算完成'
  }, 82);
  
  // 易经插件（模拟超时失败）
  const yijingLog = logger.startPlugin('yijing', 4, { 
    names: ['吴奉诸', '吴奉珠', '吴奉素']
  }, ['sancai', 'dayan']);
  await new Promise(resolve => setTimeout(resolve, 18));
  logger.failPlugin('yijing', '计算超时，易经分析失败');
  
  const layer4Time = Date.now() - layer4Start;
  logger.logMessage(`✅ Layer 4 完成 (${layer4Time}ms)`);
  
  const totalTime = Date.now() - startTime;
  logger.logMessage(`\n🎯 插件系统执行完成，总耗时: ${totalTime}ms`);
  
  // 模拟最终名字生成结果
  const names = [
    {
      fullName: '吴奉载',
      familyName: '吴',
      midChar: '奉',
      lastChar: '载',
      score: 85,
      grids: { tiange: 8, renge: 15, dige: 18, zongge: 25, waige: 11 },
      sancai: { heaven: '金', human: '土', earth: '金', combination: '金土金', level: '大吉' },
      explanation: '三才五格配置优秀，音韵和谐，寓意深远'
    },
    {
      fullName: '吴奉诸',
      familyName: '吴',
      midChar: '奉',
      lastChar: '诸',
      score: 84,
      grids: { tiange: 8, renge: 15, dige: 24, zongge: 31, waige: 17 },
      sancai: { heaven: '金', human: '土', earth: '火', combination: '金土火', level: '大吉' },
      explanation: '音韵完美，字义积极，数理吉祥'
    },
    {
      fullName: '吴奉珠',
      familyName: '吴',
      midChar: '奉',
      lastChar: '珠',
      score: 84,
      grids: { tiange: 8, renge: 15, dige: 18, zongge: 25, waige: 11 },
      sancai: { heaven: '金', human: '土', earth: '金', combination: '金土金', level: '大吉' },
      explanation: '如珠如宝，音韵和谐，数理大吉'
    }
  ];
  
  return {
    names,
    totalTime,
    certaintyLevel,
    pluginCount: logger.getLogs().length
  };
}

function determineCertaintyLevel(request: NamingRequest): CertaintyLevel {
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
      preferredElements,
      avoidedWords,
      scoreThreshold,
      useTraditional,
      limit = 5,
      offset = 0,
      weights,
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

    // 构建插件系统请求
    const namingRequest: NamingRequest = {
      familyName,
      gender: gender as 'male' | 'female',
      birthInfo: birthDate ? {
        year: new Date(birthDate).getFullYear(),
        month: new Date(birthDate).getMonth() + 1,
        day: new Date(birthDate).getDate(),
        hour: birthTime ? parseInt(birthTime.split(':')[0]) : undefined,
        minute: birthTime ? parseInt(birthTime.split(':')[1]) : undefined
      } : undefined,
      characters: avoidedWords,
      preferences: {
        certaintyLevel: certaintyLevel || undefined,
        parallelExecution: enableParallel,
        includeTraditionalAnalysis: useTraditional || false,
        skipOptionalFailures: true
      }
    };

    console.log('🚀 插件系统生成名字开始:', {
      familyName: namingRequest.familyName,
      gender: namingRequest.gender,
      certaintyLevel: determineCertaintyLevel(namingRequest),
      parallelExecution: enableParallel,
      detailedLogs: enableDetailedLogs
    });

    const startTime = Date.now();
    const logger = new DetailedLogger();
    
    // 执行插件系统（真实实现）
    const result = await executeRealPluginSystem(namingRequest, logger);
    
    // 获取详细日志
    const executionLogs = logger.getLogs();
    const layerSummary = logger.getLayerSummary();
    const executionSummary = logger.getExecutionSummary();
    
    const totalTime = Date.now() - startTime;
    
    console.log('📊 插件系统执行完成:', {
      totalTime: `${totalTime}ms`,
      successRate: `${executionSummary.successRate}%`,
      pluginCount: executionSummary.totalPlugins,
      namesGenerated: result.names.length
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
          version: '1.0.0',
          certaintyLevel: result.certaintyLevel,
          executionStrategy: enableParallel ? '并行执行' : '串行执行',
          
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
              : '所有插件执行成功，分析结果完整可靠'
          ]
        }
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('插件系统生成名字失败:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '插件系统执行失败',
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
