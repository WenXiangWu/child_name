/**
 * 插件过程简化摘要组件
 * 更直观地展示每个插件的工作内容和分析结果
 */

import React from 'react';

interface PluginProcessSummaryProps {
  executionLogs: any[];
  generationMetadata: any;
}

interface PluginSummary {
  pluginId: string;
  pluginName: string;
  layer: number;
  status: 'success' | 'failed' | 'skipped';
  executionTime: number;
  analysisResults: {
    input: string;
    process: string;
    output: string;
    keyFindings: string[];
  };
}

const PluginNames: Record<string, string> = {
  'surname': '姓氏分析',
  'gender': '性别字符',
  'birth-time': '出生时间',
  'family-tradition': '家族传统',
  'zodiac': '生肖分析',
  'xiyongshen': '五行喜用神',
  'bazi': '八字分析',
  'stroke': '笔画计算',
  'wuxing-char': '五行字符',
  'meaning': '寓意分析',
  'phonetic': '音韵美感',
  'name-generation': '智能生成'
};

const LayerNames = {
  1: '基础信息层',
  2: '命理基础层', 
  3: '字符评估层',
  4: '组合计算层'
};

const PluginProcessSummary: React.FC<PluginProcessSummaryProps> = ({
  executionLogs,
  generationMetadata
}) => {
  // 解析执行日志生成插件摘要
  const generatePluginSummaries = (): PluginSummary[] => {
    const summaries: PluginSummary[] = [];
    const pluginTimestamps: Record<string, number> = {};
    const processedPlugins = new Set<string>(); // 防止重复处理
    
    // 收集插件执行信息
    executionLogs.forEach(log => {
      if (log.pluginId && log.message.includes('执行插件:')) {
        pluginTimestamps[log.pluginId] = log.timestamp;
      } else if (log.pluginId && (log.message.includes('执行成功') || log.message.includes('执行失败'))) {
        // 防止重复添加同一个插件
        if (!processedPlugins.has(log.pluginId)) {
          const startTime = pluginTimestamps[log.pluginId];
          const executionTime = startTime ? log.timestamp - startTime : 0;
          
          summaries.push({
            pluginId: log.pluginId,
            pluginName: PluginNames[log.pluginId] || log.pluginId,
            layer: log.layer || getPluginLayer(log.pluginId),
            status: log.message.includes('执行成功') ? 'success' : 'failed',
            executionTime,
            analysisResults: generateAnalysisResults(log.pluginId)
          });
          
          processedPlugins.add(log.pluginId);
        }
      }
    });

    // 添加跳过的插件
    const skippedLogs = executionLogs.filter(log => log.message.includes('跳过插件:'));
    skippedLogs.forEach(log => {
      const pluginId = log.message.match(/跳过插件: (\w+)/)?.[1];
      if (pluginId && !processedPlugins.has(pluginId)) {
        summaries.push({
          pluginId,
          pluginName: PluginNames[pluginId] || pluginId,
          layer: getPluginLayer(pluginId),
          status: 'skipped',
          executionTime: 0,
          analysisResults: {
            input: '无输入数据',
            process: '插件被跳过',
            output: '无输出',
            keyFindings: [log.message.split('(')[1]?.replace(')', '') || '缺少必要信息']
          }
        });
        
        processedPlugins.add(pluginId);
      }
    });

    return summaries.sort((a, b) => a.layer - b.layer);
  };

  const getPluginLayer = (pluginId: string): number => {
    const layerMap: Record<string, number> = {
      'surname': 1, 'gender': 1, 'birth-time': 1, 'family-tradition': 1,
      'zodiac': 2, 'xiyongshen': 2, 'bazi': 2,
      'stroke': 3, 'wuxing-char': 3, 'meaning': 3, 'phonetic': 3,
      'name-generation': 4
    };
    return layerMap[pluginId] || 0;
  };

  // 从真实的执行日志中提取每个插件的实际数据
  const extractRealPluginData = (pluginId: string): { 
    realInput: any, 
    realOutput: any, 
    realMetrics: any,
    realLogs: any[]
  } => {
    // 查找该插件的相关日志
    const pluginLogs = executionLogs.filter(log => log.pluginId === pluginId);
    const initLog = pluginLogs.find(log => log.message.includes('初始化完成'));
    const execLog = pluginLogs.find(log => log.message.includes('执行成功'));
    const dataLog = pluginLogs.find(log => log.message.includes('已加载'));

    // 从初始请求中提取真实输入数据
    const requestLog = executionLogs.find(log => 
      log.message.includes('开始执行真正的插件系统流程')
    );

    const realInput = requestLog?.data || {};
    const realOutput = execLog?.data || {};
    const realMetrics = {
      confidence: execLog?.data?.confidence || 0,
      dataLoaded: dataLog?.message || '',
      executionTime: execLog?.timestamp && initLog?.timestamp ? 
        (execLog.timestamp - initLog.timestamp) : 0,
      layer: execLog?.layer || 0
    };

    return { realInput, realOutput, realMetrics, realLogs: pluginLogs };
  };

  const generateAnalysisResults = (pluginId: string) => {
    // 获取真实数据
    const { realInput, realOutput, realMetrics, realLogs } = extractRealPluginData(pluginId);
    
    // 为每个插件生成更详细和准确的分析结果描述
    const analysisMap: Record<string, any> = {
      'surname': {
        input: `真实姓氏: "${realInput.familyName || '未指定'}"`,
        process: '分析姓氏笔画数、五行属性、百家姓排名',
        output: `姓氏基础数据 (置信度: ${realMetrics.confidence * 100}%)`,
        keyFindings: [
          `康熙笔画数计算`,
          `五行属性推导`, 
          `百家姓排名查询`,
          `执行时间: ${realMetrics.executionTime}ms`
        ]
      },
      'gender': {
        input: `真实性别: "${realInput.gender || '未指定'}"`,
        process: '从67万+真实姓名数据中筛选性别常用字',
        output: `性别专属常用字符集合 (置信度: ${realMetrics.confidence * 100}%)`,
        keyFindings: [
          realInput.gender === 'male' ? '男性常用字1683个' : '女性常用字1372个',
          '使用频率统计',
          '文化适应性分析',
          `执行时间: ${realMetrics.executionTime}ms`
        ]
      },
      'birth-time': {
        input: `真实出生信息: ${realInput.hasBirthInfo ? '已提供' : '未提供'}`,
        process: '分析农历信息、生肖属性、季节特征',
        output: `时间相关的命理基础数据 (置信度: ${realMetrics.confidence * 100}%)`,
        keyFindings: [
          '农历转换计算',
          '生肖年份确定', 
          '季节特征分析',
          `执行时间: ${realMetrics.executionTime}ms`
        ]
      },
      'family-tradition': {
        input: '家族信息和传统要求',
        process: '分析家族字辈、传统偏好、避讳规则',
        output: `家族传统约束条件和建议 (置信度: ${realMetrics.confidence * 100}%)`,
        keyFindings: [
          '字辈规律分析', 
          '家族传统考量', 
          '避讳字符识别',
          `执行时间: ${realMetrics.executionTime}ms`
        ]
      },
      'stroke': {
        input: `姓氏笔画数信息 (基于"${realInput.familyName || '未知'}")`,
        process: '基于三才五格理论计算最佳笔画组合',
        output: `按评分排序的笔画组合方案 (置信度: ${realMetrics.confidence * 100}%)`,
        keyFindings: [
          realMetrics.dataLoaded || '笔画数据已加载',
          '三才配置计算',
          '五格数理分析',
          `执行时间: ${realMetrics.executionTime}ms`
        ]
      },
      'wuxing-char': {
        input: '五行需求和笔画组合',
        process: '根据五行喜用神筛选候选字符',
        output: `按五行分类的候选字符库 (置信度: ${realMetrics.confidence * 100}%)`,
        keyFindings: [
          realMetrics.dataLoaded || '五行数据已加载',
          '五行元素匹配',
          '相生相克关系',
          `执行时间: ${realMetrics.executionTime}ms`
        ]
      },
      'meaning': {
        input: `性别: ${realInput.gender || '未知'}, 字符候选集`,
        process: '分析字符寓意和文化内涵',
        output: `按寓意分类的优质字符 (置信度: ${realMetrics.confidence * 100}%)`,
        keyFindings: [
          realMetrics.dataLoaded || '字义数据已加载',
          '寓意深度评估',
          '文化内涵分析',
          `执行时间: ${realMetrics.executionTime}ms`
        ]
      },
      'phonetic': {
        input: `姓氏: "${realInput.familyName || '未知'}", 性别: ${realInput.gender || '未知'}`,
        process: '分析名字音韵和谐度',
        output: `按声调分类的和谐字符 (置信度: ${realMetrics.confidence * 100}%)`,
        keyFindings: [
          realMetrics.dataLoaded || '音韵数据已加载',
          '声调搭配分析',
          '避免不良谐音',
          `执行时间: ${realMetrics.executionTime}ms`
        ]
      },
      'xiyongshen': {
        input: `出生信息: ${realInput.hasBirthInfo ? '已提供' : '使用通用策略'}`,
        process: '分析五行平衡和喜用神',
        output: `五行需求和补益方向 (置信度: ${realMetrics.confidence * 100}%)`,
        keyFindings: [
          '五行平衡分析',
          '喜用神推导',
          '忌神识别',
          `执行时间: ${realMetrics.executionTime}ms`
        ]
      },
      'zodiac': {
        input: `出生年份: ${realInput.hasBirthInfo ? '已提供' : '未提供'}`,
        process: '确定生肖属性、分析生肖特征',
        output: `生肖分析结果和建议 (置信度: ${realMetrics.confidence * 100}%)`,
        keyFindings: [
          '生肖年份确定',
          '生肖特征分析',
          '相配相克关系',
          `执行时间: ${realMetrics.executionTime}ms`
        ]
      },
      'zodiac-char': {
        input: '生肖属性和字符候选',
        process: '根据生肖喜忌筛选适宜字符',
        output: `生肖匹配的字符集合 (置信度: ${realMetrics.confidence * 100}%)`,
        keyFindings: [
          realMetrics.dataLoaded || '生肖用字数据已加载',
          '生肖偏好分析',
          '字符匹配度',
          `执行时间: ${realMetrics.executionTime}ms`
        ]
      },
      'name-generation': {
        input: `所有前层插件分析结果 (来自"${realInput.familyName || '未知'}"家族)`,
        process: '智能组合生成最优名字',
        output: `综合评分排序的名字候选 (置信度: ${realMetrics.confidence * 100}%)`,
        keyFindings: [
          `生成名字数量: ${realOutput.namesGenerated || '未知'}个`,
          '多维度数据整合',
          '智能字符组合',
          `执行时间: ${realMetrics.executionTime}ms`
        ]
      }
    };

    return analysisMap[pluginId] || {
      input: '插件输入数据',
      process: '数据处理和分析',
      output: '分析结果输出',
      keyFindings: ['数据处理', '结果分析']
    };
  };

  const summaries = generatePluginSummaries();
  const layerGroups = summaries.reduce((acc, summary) => {
    if (!acc[summary.layer]) acc[summary.layer] = [];
    acc[summary.layer].push(summary);
    return acc;
  }, {} as Record<number, PluginSummary[]>);

  // 如果没有执行日志，显示提示信息
  if (!executionLogs || executionLogs.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无分析过程数据</h3>
          <p className="text-gray-500">
            执行日志可能还在加载中，或者未启用详细分析记录
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 执行概览 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          智能取名过程分析
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">{summaries.filter(s => s.status === 'success').length}</div>
            <div className="text-sm text-gray-600">成功分析</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{summaries.filter(s => s.status === 'skipped').length}</div>
            <div className="text-sm text-gray-600">跳过模块</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(layerGroups).length}</div>
            <div className="text-sm text-gray-600">分析层级</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{generationMetadata?.executionTime || 0}ms</div>
            <div className="text-sm text-gray-600">总耗时</div>
          </div>
        </div>
      </div>

      {/* 分层分析过程 */}
      {[1, 2, 3, 4].map(layer => {
        const layerSummaries = layerGroups[layer] || [];
        if (layerSummaries.length === 0) return null;

        const layerColors = {
          1: { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
          2: { gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
          3: { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
          4: { gradient: 'from-green-500 to-green-600', bg: 'bg-green-50', border: 'border-green-200' }
        }[layer] || { gradient: 'from-gray-500 to-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };

        return (
          <div key={layer} className={`border rounded-lg ${layerColors.border}`}>
            {/* 层级标题 */}
            <div className={`bg-gradient-to-r ${layerColors.gradient} text-white p-4 rounded-t-lg`}>
              <h5 className="text-lg font-semibold flex items-center">
                <span className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  {layer}
                </span>
                {LayerNames[layer as keyof typeof LayerNames]}
                <span className="ml-auto text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {layerSummaries.length} 个模块
                </span>
              </h5>
            </div>

            {/* 层级内容 */}
            <div className={`${layerColors.bg} p-4 rounded-b-lg`}>
              <div className="grid gap-4">
                {layerSummaries.map((summary, index) => (
                  <div key={`${summary.pluginId}-${index}`} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* 插件标题栏 */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            summary.status === 'success' ? 'bg-green-500' :
                            summary.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                          }`} />
                          <div>
                            <h6 className="font-medium text-gray-900">{summary.pluginName}</h6>
                            <p className="text-xs text-gray-500">{summary.pluginId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-700">
                            {summary.status === 'success' ? `${summary.executionTime}ms` : 
                             summary.status === 'failed' ? '失败' : '跳过'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 分析过程 */}
                    <div className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <h6 className="text-xs font-medium text-gray-700 mb-2 block">📥 输入分析</h6>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{summary.analysisResults.input}</p>
                        </div>
                        <div>
                          <h6 className="text-xs font-medium text-gray-700 mb-2 block">⚙️ 处理过程</h6>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{summary.analysisResults.process}</p>
                        </div>
                        <div>
                          <h6 className="text-xs font-medium text-gray-700 mb-2 block">📤 输出结果</h6>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{summary.analysisResults.output}</p>
                        </div>
                      </div>

                      {/* 关键发现 */}
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 mb-2 block">🔍 关键分析点</h6>
                        <div className="flex flex-wrap gap-2">
                          {summary.analysisResults.keyFindings.map((finding, i) => (
                            <span key={i} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {finding}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PluginProcessSummary;
