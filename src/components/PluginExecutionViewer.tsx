/**
 * 插件执行过程查看器组件
 * 展示详细的插件执行步骤和数据流
 */

import React, { useState } from 'react';
import PluginProcessSummary from './PluginProcessSummary';

interface ExecutionLog {
  timestamp: number;
  level: string;
  message: string;
  pluginId?: string;
  layer?: number;
  data?: any;
}

interface PluginExecutionViewerProps {
  executionLogs: ExecutionLog[];
  generationMetadata?: any;
  isOpen: boolean;
  onToggle: () => void;
}

interface ProcessedPluginStep {
  pluginId: string;
  pluginName: string;
    layer: number;
  status: 'success' | 'failed' | 'skipped';
  executionTime: number;
  confidence: number;
  inputData: any;
  outputData: any;
  processingDetails: string[];
  dataTransformations: Array<{
    step: string;
    input: any;
    output: any;
    description: string;
  }>;
}

const LayerColors = {
  1: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: '🔵' },
  2: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: '🟡' },
  3: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', icon: '🟠' },
  4: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: '🔴' }
};

const PluginNames: Record<string, string> = {
  'surname': '姓氏分析插件',
  'gender': '性别常用字插件',
  'birth-time': '出生时间插件',
  'zodiac': '生肖分析插件',
  'xiyongshen': '五行喜用神插件',
  'bazi': '八字分析插件',
  'stroke': '笔画计算插件',
  'wuxing-char': '五行字符插件',
  'meaning': '寓意分析插件',
  'phonetic': '音韵美感插件',
  'name-generation': '智能名字生成插件'
};

const PluginExecutionViewer: React.FC<PluginExecutionViewerProps> = ({
  executionLogs,
  generationMetadata,
  isOpen,
  onToggle
}) => {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [expandedLayers, setExpandedLayers] = useState<Set<number>>(new Set([1, 2, 3, 4]));
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');

  // 处理执行日志，提取插件步骤
  const processExecutionLogs = (): ProcessedPluginStep[] => {
    const steps: ProcessedPluginStep[] = [];
    const pluginTimestamps: Record<string, number> = {};
    
    executionLogs.forEach(log => {
      if (log.pluginId && log.message.includes('执行插件:')) {
        pluginTimestamps[log.pluginId] = log.timestamp;
      } else if (log.pluginId && (log.message.includes('执行成功') || log.message.includes('执行失败'))) {
        const startTime = pluginTimestamps[log.pluginId];
        const executionTime = startTime ? log.timestamp - startTime : 0;
        
        const step: ProcessedPluginStep = {
          pluginId: log.pluginId,
          pluginName: PluginNames[log.pluginId] || log.pluginId,
          layer: log.layer || 0,
          status: log.message.includes('执行成功') ? 'success' : 'failed',
          executionTime,
          confidence: log.data?.confidence || 0,
          inputData: extractInputData(log, executionLogs),
          outputData: log.data || {},
          processingDetails: extractProcessingDetails(log.pluginId, executionLogs),
          dataTransformations: extractDataTransformations(log.pluginId, executionLogs)
        };
        
        steps.push(step);
      }
    });

    // 添加跳过的插件
    const skippedLogs = executionLogs.filter(log => log.message.includes('跳过插件:'));
    skippedLogs.forEach(log => {
      const pluginId = log.message.match(/跳过插件: (\w+)/)?.[1];
      if (pluginId) {
        steps.push({
          pluginId,
          pluginName: PluginNames[pluginId] || pluginId,
          layer: getPluginLayer(pluginId),
          status: 'skipped',
          executionTime: 0,
          confidence: 0,
          inputData: {},
          outputData: {},
          processingDetails: [log.message],
          dataTransformations: []
        });
      }
    });

    return steps.sort((a, b) => a.layer - b.layer);
  };

  const extractInputData = (log: ExecutionLog, logs: ExecutionLog[]): any => {
    // 从日志中提取输入数据
    const inputLogs = logs.filter(l => 
      l.timestamp < log.timestamp && 
      l.message.includes('构建标准输入')
    );
    return inputLogs.length > 0 ? inputLogs[0].data : {};
  };

  const extractProcessingDetails = (pluginId: string, logs: ExecutionLog[]): string[] => {
    // 提取插件处理详情
    return logs
      .filter(log => log.pluginId === pluginId && log.level === 'info')
      .map(log => log.message);
  };

  const extractDataTransformations = (pluginId: string, logs: ExecutionLog[]): Array<{
    step: string;
    input: any;
    output: any;
    description: string;
  }> => {
    // 提取数据转换步骤
    const transformations: Array<{
      step: string;
      input: any;
      output: any;
      description: string;
    }> = [];

    // 根据插件类型生成示例数据转换步骤
    switch (pluginId) {
      case 'surname':
        transformations.push({
          step: '1. 姓氏识别',
          input: { familyName: '张' },
          output: { familyName: '张', strokes: 7, wuxing: '火' },
          description: '分析姓氏笔画数和五行属性'
        });
        break;
      case 'gender':
        transformations.push({
          step: '1. 性别字符筛选',
          input: { gender: 'male' },
          output: { commonChars: ['文', '明', '华', '强'], totalChars: 1683 },
          description: '根据性别提供常用字符集合'
        });
        break;
      case 'stroke':
        transformations.push({
          step: '1. 笔画组合计算',
          input: { familyNameStrokes: 7 },
          output: { bestCombinations: [{ mid: 1, last: 5, score: 85 }] },
          description: '基于三才五格理论计算最佳笔画组合'
        });
        break;
      case 'wuxing-char':
        transformations.push({
          step: '1. 五行需求分析',
          input: { requiredElements: ['木', '水'] },
          output: { favorableChars: { '木': ['林', '森'], '水': ['江', '河'] } },
          description: '根据五行需求筛选候选字符'
        });
        break;
      case 'name-generation':
        transformations.push({
          step: '1. 数据整合',
          input: { stroke: {}, wuxing: {}, meaning: {} },
          output: { integratedData: {} },
          description: '整合所有前层插件的分析结果'
        }, {
          step: '2. 字符筛选',
          input: { candidates: ['文', '明', '华'] },
          output: { filteredCandidates: ['文', '明'] },
          description: '根据标准字符表过滤候选字符'
        }, {
          step: '3. 名字生成',
          input: { filteredCandidates: ['文', '明'] },
          output: { names: [{ fullName: '张文明', score: 85 }] },
          description: '智能组合生成最优名字'
        });
        break;
    }

    return transformations;
  };

  const getPluginLayer = (pluginId: string): number => {
    const layerMap: Record<string, number> = {
      'surname': 1, 'gender': 1, 'birth-time': 1,
      'zodiac': 2, 'xiyongshen': 2, 'bazi': 2,
      'stroke': 3, 'wuxing-char': 3, 'meaning': 3, 'phonetic': 3,
      'name-generation': 4
    };
    return layerMap[pluginId] || 0;
  };

  const toggleLayer = (layer: number) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(layer)) {
      newExpanded.delete(layer);
    } else {
      newExpanded.add(layer);
    }
    setExpandedLayers(newExpanded);
  };

  const steps = processExecutionLogs();
  const layerGroups = steps.reduce((acc, step) => {
    if (!acc[step.layer]) acc[step.layer] = [];
    acc[step.layer].push(step);
    return acc;
  }, {} as Record<number, ProcessedPluginStep[]>);

    if (!isOpen) {
    return (
      <div className="mt-6">
        <div className="flex justify-center">
          <button
            onClick={onToggle}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            🔍 查看生成过程
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          点击查看详细的插件分析过程和数据流
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 border border-gray-200 rounded-lg bg-white">
      {/* 头部 */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            插件执行过程详情
          </h3>
          <button
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 视图切换 */}
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('summary')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'summary'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📊 分析摘要
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'detailed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔍 详细日志
          </button>
        </div>
      </div>

      {/* 执行统计 */}
      <div className="p-4 bg-blue-50 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{steps.filter(s => s.status === 'success').length}</div>
            <div className="text-sm text-gray-600">成功执行</div>
          </div>
        <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{steps.filter(s => s.status === 'skipped').length}</div>
            <div className="text-sm text-gray-600">跳过执行</div>
          </div>
        <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{steps.filter(s => s.status === 'failed').length}</div>
            <div className="text-sm text-gray-600">执行失败</div>
          </div>
        <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{steps.reduce((sum, s) => sum + s.executionTime, 0)}ms</div>
            <div className="text-sm text-gray-600">总耗时</div>
          </div>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="p-4">
        {viewMode === 'summary' ? (
          <PluginProcessSummary 
            executionLogs={executionLogs}
            generationMetadata={generationMetadata}
          />
        ) : (
          <div className="space-y-4">
            {/* 完整日志列表 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">完整执行日志</h5>
              {!executionLogs || executionLogs.length === 0 ? (
                <div className="bg-white rounded border p-4 text-center text-gray-500">
                  <p>暂无执行日志数据</p>
                  <p className="text-sm mt-1">执行日志可能还在加载中，或者未启用详细日志记录</p>
                </div>
              ) : (
                <div className="bg-white rounded border max-h-96 overflow-y-auto">
                  {executionLogs.map((log, index) => (
                  <div key={index} className={`p-3 border-b border-gray-100 text-sm ${
                    log.level === 'error' ? 'bg-red-50 text-red-700' :
                    log.level === 'warn' ? 'bg-yellow-50 text-yellow-700' :
                    'text-gray-700'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 mr-2">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        {log.pluginId && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                            {log.pluginId}
                          </span>
                        )}
                        {log.layer && (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-2">
                            Layer {log.layer}
                          </span>
                        )}
                        <span>{log.message}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        log.level === 'error' ? 'bg-red-200 text-red-800' :
                        log.level === 'warn' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {log.level}
                      </span>
                    </div>
                    {log.data && Object.keys(log.data).length > 0 && (
                      <div className="mt-2 ml-2">
                        <details className="text-xs">
                          <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                            查看数据 ({Object.keys(log.data).length} 项)
                          </summary>
                          <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 分层插件步骤视图 */}
        {[1, 2, 3, 4].map(layer => {
          const layerSteps = layerGroups[layer] || [];
          if (layerSteps.length === 0) return null;

          const layerColor = LayerColors[layer as keyof typeof LayerColors];
          const isExpanded = expandedLayers.has(layer);
          
          return (
            <div key={layer} className={`border rounded-lg ${layerColor.border}`}>
              {/* 层级标题 */}
              <div 
                className={`p-3 ${layerColor.bg} border-b ${layerColor.border} cursor-pointer`}
                onClick={() => toggleLayer(layer)}
              >
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold ${layerColor.text} flex items-center`}>
                    <span className="text-lg mr-2">{layerColor.icon}</span>
                    Layer {layer}: {getLayerName(layer)}
                    <span className="ml-2 text-sm bg-white px-2 py-1 rounded">
                      {layerSteps.length} 个插件
                    </span>
                  </h4>
                  <svg 
                    className={`w-5 h-5 ${layerColor.text} transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* 层级内容 */}
              {isExpanded && (
                <div className="p-3 space-y-3">
                  {layerSteps.map((step, index) => (
                    <div key={`${step.pluginId}-${index}`} className="bg-white border border-gray-200 rounded-lg">
                      {/* 插件标题 */}
                      <div 
                        className="p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedStep(selectedStep === step.pluginId ? null : step.pluginId)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              step.status === 'success' ? 'bg-green-500' :
                              step.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                            }`} />
              <div>
                              <h5 className="font-medium text-gray-900">{step.pluginName}</h5>
                              <p className="text-sm text-gray-500">ID: {step.pluginId}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {step.status === 'success' ? `${step.executionTime}ms` : step.status}
                            </div>
                            {step.status === 'success' && (
                              <div className="text-xs text-gray-500">
                                置信度: {Math.round(step.confidence * 100)}%
              </div>
                            )}
                </div>
                </div>
              </div>
              
                      {/* 插件详情 */}
                      {selectedStep === step.pluginId && (
                        <div className="p-3 bg-gray-50">
                          <div className="space-y-4">
                            {/* 处理步骤 */}
                            {step.processingDetails.length > 0 && (
                  <div>
                                <h6 className="text-sm font-medium text-gray-900 mb-2">处理步骤:</h6>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {step.processingDetails.map((detail, i) => (
                                    <li key={i} className="flex items-start">
                                      <span className="w-4 h-4 text-blue-500 mr-2">•</span>
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                </div>
              )}
              
                            {/* 数据转换 */}
                            {step.dataTransformations.length > 0 && (
                              <div>
                                <h6 className="text-sm font-medium text-gray-900 mb-2">数据转换流程:</h6>
                                <div className="space-y-3">
                                  {step.dataTransformations.map((transform, i) => (
                                    <div key={i} className="bg-white border border-gray-200 rounded p-3">
                                      <div className="text-sm font-medium text-gray-900 mb-2">{transform.step}</div>
                                      <div className="text-xs text-gray-600 mb-2">{transform.description}</div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                          <div className="text-xs font-medium text-gray-700 mb-1">输入:</div>
                                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-20">
                                            {JSON.stringify(transform.input, null, 2)}
                                          </pre>
                                        </div>
                <div>
                                          <div className="text-xs font-medium text-gray-700 mb-1">输出:</div>
                                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-20">
                                            {JSON.stringify(transform.output, null, 2)}
                                          </pre>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                  </div>
                </div>
              )}
              
                            {/* 最终输出数据 */}
                            {step.status === 'success' && Object.keys(step.outputData).length > 0 && (
                <div>
                                <h6 className="text-sm font-medium text-gray-900 mb-2">输出数据:</h6>
                                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32">
                                  {JSON.stringify(step.outputData, null, 2)}
                                </pre>
                              </div>
                            )}
                  </div>
                </div>
              )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
          </div>
        )}
      </div>
    </div>
  );
};

const getLayerName = (layer: number): string => {
  const names = {
    1: '基础信息层',
    2: '命理基础层',
    3: '字符评估层',
    4: '组合计算层'
  };
  return names[layer as keyof typeof names] || `Layer ${layer}`;
};

export default PluginExecutionViewer;