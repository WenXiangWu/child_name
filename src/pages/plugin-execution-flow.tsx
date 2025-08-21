/**
 * 插件执行流程详细展示页面
 * 显示完整的6层插件系统执行过程，包括每个插件的输入输出和分析流程
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PluginDetailViewer from '../components/PluginDetailViewer';

// 使用简单的SVG图标，避免heroicons依赖
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a1 1 0 011-1h1m0 0V7a1 1 0 011-1h3a1 1 0 011 1v3m0 0v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-1m0 0H8a1 1 0 01-1-1V8a1 1 0 011-1h1m0 0V6a1 1 0 011-1h1a1 1 0 011 1v1" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

interface PluginExecutionLog {
  timestamp: number;
  level: 'info' | 'warn' | 'error';
  message: string;
  pluginId?: string;
  layer?: number;
  data?: any;
}

interface PluginResult {
  pluginId: string;
  layer: number;
  status: 'pending' | 'running' | 'success' | 'error' | 'skipped';
  input?: any;
  output?: any;
  confidence?: number;
  executionTime?: number;
  errorMessage?: string;
  analysis?: string[];
}

interface GenerationRequest {
  familyName: string;
  gender: 'male' | 'female';
  birthInfo?: {
    year: number;
    month: number;
    day: number;
    hour?: number;
    minute?: number;
  };
}

export default function PluginExecutionFlow() {
  const [request, setRequest] = useState<GenerationRequest>({
    familyName: '吴',
    gender: 'male',
    birthInfo: {
      year: 2025,
      month: 10,
      day: 31,
      hour: 10,
      minute: 0
    }
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<PluginExecutionLog[]>([]);
  const [pluginResults, setPluginResults] = useState<PluginResult[]>([]);
  const [generatedNames, setGeneratedNames] = useState<any[]>([]);
  const [expandedPlugins, setExpandedPlugins] = useState<Set<string>>(new Set());
  const [currentLayer, setCurrentLayer] = useState<number>(0);
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(null);

  // 插件层级配置
  const layerConfig = {
    1: { name: 'Layer 1: 基础信息层', color: 'bg-blue-100 text-blue-800', description: '分析基础信息，为后续处理提供数据基础', plugins: ['surname', 'gender', 'birth-time'] },
    2: { name: 'Layer 2: 命理基础层', color: 'bg-yellow-100 text-yellow-800', description: '计算八字命理，确定五行喜用神', plugins: ['bazi', 'zodiac', 'xiyongshen'] },
    3: { name: 'Layer 3: 字符评估层', color: 'bg-orange-100 text-orange-800', description: '制定各种选字策略和评估标准', plugins: ['wuxing-selection', 'zodiac-selection', 'meaning-selection', 'stroke-selection', 'phonetic-selection'] },
    4: { name: 'Layer 4: 字符筛选层', color: 'bg-red-100 text-red-800', description: '综合各种策略筛选候选字符', plugins: ['character-filter'] },
    5: { name: 'Layer 5: 名字生成层', color: 'bg-purple-100 text-purple-800', description: '生成所有可能的名字组合', plugins: ['name-combination'] },
    6: { name: 'Layer 6: 名字评分层', color: 'bg-gray-100 text-gray-800', description: '对生成的名字进行综合评分', plugins: ['comprehensive-scoring'] }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setExecutionLogs([]);
    setPluginResults([]);
    setGeneratedNames([]);
    setCurrentLayer(0);

    try {
      const response = await fetch('/api/generate-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...request,
          usePluginSystem: true,
          enableDetailedLogs: true,
          limit: 3
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setExecutionLogs(result.executionLogs || []);
        setGeneratedNames(result.data.names || []);
        
        // 解析插件执行结果
        parsePluginResults(result.executionLogs || []);
      }
    } catch (error) {
      console.error('生成失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const parsePluginResults = (logs: PluginExecutionLog[]) => {
    const results: PluginResult[] = [];
    const pluginMap = new Map<string, PluginResult>();

    logs.forEach(log => {
      if (log.pluginId) {
        if (!pluginMap.has(log.pluginId)) {
          pluginMap.set(log.pluginId, {
            pluginId: log.pluginId,
            layer: log.layer || 0,
            status: 'pending',
            analysis: []
          });
        }

        const plugin = pluginMap.get(log.pluginId)!;

        if (log.message.includes('执行插件')) {
          plugin.status = 'running';
          setCurrentLayer(log.layer || 0);
        } else if (log.message.includes('执行成功')) {
          plugin.status = 'success';
          plugin.confidence = log.data?.confidence;
        } else if (log.message.includes('执行失败')) {
          plugin.status = 'error';
          plugin.errorMessage = log.data?.error;
        } else if (log.message.includes('跳过插件')) {
          plugin.status = 'skipped';
        } else {
          // 分析过程信息
          plugin.analysis?.push(log.message);
        }
      }
    });

    setPluginResults(Array.from(pluginMap.values()));
  };

  const togglePlugin = (pluginId: string) => {
    const newExpanded = new Set(expandedPlugins);
    if (newExpanded.has(pluginId)) {
      newExpanded.delete(pluginId);
    } else {
      newExpanded.add(pluginId);
    }
    setExpandedPlugins(newExpanded);
  };

  const getStatusIcon = (status: PluginResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'running':
        return <ClockIcon className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'skipped':
        return <div className="w-5 h-5 rounded-full bg-gray-300"></div>;
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-200"></div>;
    }
  };

  const getStatusColor = (status: PluginResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'running': return 'bg-blue-50 border-blue-200';
      case 'skipped': return 'bg-gray-50 border-gray-200';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">插件执行流程详细展示</h1>
              <p className="text-gray-600">实时查看6层插件系统的完整执行过程，包括每个插件的输入输出和分析流程</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/generate"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>🎯</span>
                <span>名字生成</span>
              </Link>
              <Link 
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>

        {/* 输入配置区域 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">生成配置</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">姓氏</label>
              <input
                type="text"
                value={request.familyName}
                onChange={(e) => setRequest({ ...request, familyName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
              <select
                value={request.gender}
                onChange={(e) => setRequest({ ...request, gender: e.target.value as 'male' | 'female' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">出生时间</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={`${request.birthInfo?.year}-${String(request.birthInfo?.month || 1).padStart(2, '0')}-${String(request.birthInfo?.day || 1).padStart(2, '0')}`}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setRequest({
                      ...request,
                      birthInfo: {
                        ...request.birthInfo!,
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        day: date.getDate()
                      }
                    });
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <input
                  type="time"
                  value={`${String(request.birthInfo?.hour || 0).padStart(2, '0')}:${String(request.birthInfo?.minute || 0).padStart(2, '0')}`}
                  onChange={(e) => {
                    const [hour, minute] = e.target.value.split(':').map(Number);
                    setRequest({
                      ...request,
                      birthInfo: {
                        ...request.birthInfo!,
                        hour,
                        minute
                      }
                    });
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <PlayIcon className="w-4 h-4 mr-2" />
            {isGenerating ? '生成中...' : '开始生成'}
          </button>
        </div>

        {/* 执行流程展示区域 */}
        {(pluginResults.length > 0 || isGenerating) && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* 左侧：层级概览 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">执行层级概览</h3>
                <div className="space-y-3">
                  {Object.entries(layerConfig).map(([layer, config]) => {
                    const layerNum = parseInt(layer);
                    const layerPlugins = pluginResults.filter(p => p.layer === layerNum);
                    const isActive = currentLayer === layerNum;
                    const isCompleted = layerPlugins.length > 0 && layerPlugins.every(p => p.status !== 'pending' && p.status !== 'running');
                    
                    return (
                      <div
                        key={layer}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          isActive ? 'border-blue-500 bg-blue-50' : 
                          isCompleted ? 'border-green-200 bg-green-50' : 
                          'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                            {config.name}
                          </span>
                          <div className="flex space-x-1">
                            {layerPlugins.map(plugin => (
                              <div key={plugin.pluginId} className="w-2 h-2 rounded-full">
                                {getStatusIcon(plugin.status)}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                          {layerPlugins.length > 0 ? 
                            `${layerPlugins.filter(p => p.status === 'success').length}/${layerPlugins.length} 成功` :
                            `${config.plugins.length} 个插件`
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 中间：插件列表 */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">插件执行详情</h3>
                
                {Object.entries(layerConfig).map(([layer, config]) => {
                  const layerNum = parseInt(layer);
                  const layerPlugins = pluginResults.filter(p => p.layer === layerNum);
                  
                  if (layerPlugins.length === 0) return null;
                  
                  return (
                    <div key={layer} className="mb-6">
                      <div className={`px-3 py-2 rounded-lg ${config.color} mb-3`}>
                        <h4 className="font-medium">{config.name}</h4>
                      </div>
                      
                      <div className="space-y-3">
                        {layerPlugins.map(plugin => (
                          <div
                            key={plugin.pluginId}
                            className={`border rounded-lg p-4 ${getStatusColor(plugin.status)}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {getStatusIcon(plugin.status)}
                                <span className="font-medium text-gray-900">{plugin.pluginId}</span>
                                {plugin.confidence !== undefined && (
                                  <span className="text-sm text-gray-600">
                                    置信度: {(plugin.confidence * 100).toFixed(1)}%
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => setSelectedPlugin(plugin.pluginId)}
                                className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                              >
                                <EyeIcon className="w-4 h-4" />
                                <span>详细查看</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 右侧：插件详细查看 */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">插件详情</h3>
                
                {selectedPlugin ? (
                  (() => {
                    const plugin = pluginResults.find(p => p.pluginId === selectedPlugin);
                    if (!plugin) return <p className="text-gray-500">插件信息未找到</p>;
                    
                    const layerInfo = layerConfig[plugin.layer as keyof typeof layerConfig];
                    return (
                      <PluginDetailViewer
                        plugin={plugin}
                        layerInfo={layerInfo}
                        executionLogs={executionLogs}
                      />
                    );
                  })()
                ) : (
                  <div className="text-center py-8">
                    <EyeIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">点击插件的"详细查看"按钮来查看详细信息</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 生成结果展示 */}
        {generatedNames.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">生成结果</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedNames.map((name, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <h4 className="text-xl font-bold text-gray-900">{name.fullName}</h4>
                    <p className="text-lg text-blue-600 font-semibold">评分: {name.score}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">五行组合:</span>
                      <span className="ml-2 text-gray-700">{name.sancai?.combination}</span>
                    </div>
                    <div>
                      <span className="font-medium">三才配置:</span>
                      <span className="ml-2 text-gray-700">{name.sancai?.level}</span>
                    </div>
                    <div>
                      <span className="font-medium">字义解释:</span>
                      <span className="ml-2 text-gray-700">{name.explanation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 执行日志 */}
        {executionLogs.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">详细执行日志</h3>
            <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="space-y-1 font-mono text-sm">
                {executionLogs.map((log, index) => (
                  <div
                    key={index}
                    className={`${
                      log.level === 'error' ? 'text-red-400' :
                      log.level === 'warn' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}
                  >
                    <span className="text-gray-500">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    {log.pluginId && (
                      <span className="text-blue-400 ml-2">[{log.pluginId}]</span>
                    )}
                    <span className="ml-2">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
