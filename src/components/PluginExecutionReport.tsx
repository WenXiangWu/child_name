/**
 * 插件执行报告组件
 * 美观、直观地展示名字生成过程中所有插件的执行过程
 * 支持下载功能，用户友好的界面设计
 */

import React, { useState, useRef } from 'react';
// 使用简单的SVG图标，避免heroicons依赖
const DocumentArrowDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

const ExclamationTriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.954-.833-2.732 0L3.862 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a1 1 0 011-1h1m0 0V7a1 1 0 011-1h3a1 1 0 011 1v3m0 0v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-1m0 0H8a1 1 0 01-1-1V8a1 1 0 011-1h1m0 0V6a1 1 0 011-1h1a1 1 0 011 1v1" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Cog8ToothIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface ExecutionLog {
  timestamp: number;
  level: 'info' | 'warn' | 'error';
  message: string;
  pluginId?: string;
  layer?: number;
  data?: any;
}

interface PluginExecutionReportProps {
  executionLogs: ExecutionLog[];
  generatedNames: any[];
  generationMetadata?: any;
  requestConfig?: any;
}

interface ProcessedPlugin {
  pluginId: string;
  pluginName: string;
  layer: number;
  status: 'success' | 'failed' | 'skipped' | 'running';
  executionTime: number;
  confidence: number;
  inputSummary: string;
  outputSummary: string;
  keyPoints: string[];
  icon: string;
  description: string;
}

const PluginExecutionReport: React.FC<PluginExecutionReportProps> = ({
  executionLogs,
  generatedNames,
  generationMetadata,
  requestConfig
}) => {
  const [expandedLayers, setExpandedLayers] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6]));
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // 插件信息配置
  const pluginConfig = {
    'surname': { 
      name: '姓氏分析', 
      icon: '👤', 
      description: '分析姓氏的笔画、五行属性和文化背景',
      layer: 1
    },
    'gender': { 
      name: '性别字符筛选', 
      icon: '⚧️', 
      description: '基于性别筛选常用字符，确保名字的性别特征',
      layer: 1
    },
    'birth-time': { 
      name: '出生时间分析', 
      icon: '📅', 
      description: '分析出生时间的农历信息和时辰特点',
      layer: 1
    },
    'bazi': { 
      name: '八字分析', 
      icon: '☯️', 
      description: '计算生辰八字，确定五行组合和命格特征',
      layer: 2
    },
    'xiyongshen': { 
      name: '五行喜用神', 
      icon: '🔥', 
      description: '分析五行平衡，确定需要补充的五行元素',
      layer: 2
    },
    'zodiac': { 
      name: '生肖分析', 
      icon: '🐲', 
      description: '分析生肖特征和相应的取名宜忌',
      layer: 2
    },
    'wuxing-selection': { 
      name: '五行选字策略', 
      icon: '⭐', 
      description: '制定五行选字策略和评估标准',
      layer: 3
    },
    'meaning-selection': { 
      name: '寓意选字策略', 
      icon: '📚', 
      description: '制定字义寓意选择策略',
      layer: 3
    },
    'phonetic-selection': { 
      name: '音韵选字策略', 
      icon: '🎵', 
      description: '制定声调音韵搭配策略',
      layer: 3
    },
    'stroke-selection': { 
      name: '笔画选字策略', 
      icon: '✏️', 
      description: '制定笔画数理搭配策略',
      layer: 3
    },
    'zodiac-selection': { 
      name: '生肖选字策略', 
      icon: '🎭', 
      description: '制定生肖相配选字策略',
      layer: 3
    },
    'character-filter': { 
      name: '字符筛选', 
      icon: '🔍', 
      description: '综合各种策略筛选候选字符',
      layer: 4
    },
    'name-combination': { 
      name: '名字组合生成', 
      icon: '🧩', 
      description: '智能组合生成所有可能的名字',
      layer: 5
    },
    'comprehensive-scoring': { 
      name: '综合评分', 
      icon: '🏆', 
      description: '对生成的名字进行多维度综合评分',
      layer: 6
    }
  };

  // 层级配置
  const layerConfig = {
    1: { 
      name: '基础信息层', 
      color: 'bg-blue-500', 
      lightColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      description: '收集和分析基础的姓名、性别、出生信息'
    },
    2: { 
      name: '命理基础层', 
      color: 'bg-orange-500', 
      lightColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800',
      description: '计算八字命理，分析五行平衡和生肖特征'
    },
    3: { 
      name: '策略制定层', 
      color: 'bg-purple-500', 
      lightColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      description: '制定各种选字策略和评估标准'
    },
    4: { 
      name: '字符筛选层', 
      color: 'bg-red-500', 
      lightColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      description: '综合所有策略筛选最佳候选字符'
    },
    5: { 
      name: '名字生成层', 
      color: 'bg-green-500', 
      lightColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      description: '智能组合生成所有可能的名字'
    },
    6: { 
      name: '评分排序层', 
      color: 'bg-indigo-500', 
      lightColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-800',
      description: '对生成的名字进行综合评分和排序'
    }
  };

  // 处理执行日志
  const processExecutionLogs = (): ProcessedPlugin[] => {
    const plugins: ProcessedPlugin[] = [];
    const pluginMap = new Map<string, any>();
    const pluginTimestamps = new Map<string, number>();

    // 收集插件执行信息
    executionLogs.forEach(log => {
      if (log.pluginId) {
        if (!pluginMap.has(log.pluginId)) {
          pluginMap.set(log.pluginId, {
            pluginId: log.pluginId,
            status: 'running',
            logs: [],
            confidence: 0,
            executionTime: 0
          });
        }

        const plugin = pluginMap.get(log.pluginId);
        plugin.logs.push(log);

        if (log.message.includes('执行插件:')) {
          pluginTimestamps.set(log.pluginId, log.timestamp);
          plugin.status = 'running';
        } else if (log.message.includes('执行成功')) {
          plugin.status = 'success';
          plugin.confidence = log.data?.confidence || 0;
          const startTime = pluginTimestamps.get(log.pluginId);
          if (startTime) {
            plugin.executionTime = log.timestamp - startTime;
          }
        } else if (log.message.includes('执行失败')) {
          plugin.status = 'failed';
        } else if (log.message.includes('跳过插件')) {
          plugin.status = 'skipped';
        }
      }
    });

    // 生成处理后的插件信息
    pluginMap.forEach((data, pluginId) => {
      const config = pluginConfig[pluginId as keyof typeof pluginConfig];
      if (config) {
        plugins.push({
          pluginId,
          pluginName: config.name,
          layer: config.layer,
          status: data.status,
          executionTime: data.executionTime,
          confidence: data.confidence,
          inputSummary: generateInputSummary(pluginId, data.logs),
          outputSummary: generateOutputSummary(pluginId, data.logs, data.status),
          keyPoints: generateKeyPoints(pluginId, data.logs, data.status),
          icon: config.icon,
          description: config.description
        });
      }
    });

    return plugins.sort((a, b) => a.layer - b.layer);
  };

  const generateInputSummary = (pluginId: string, logs: any[]): string => {
    const summaries: Record<string, string> = {
      'surname': `姓氏"${requestConfig?.familyName || '未知'}"`,
      'gender': `性别"${requestConfig?.gender === 'male' ? '男' : '女'}"`,
      'birth-time': `出生时间${requestConfig?.birthInfo ? '已提供' : '未提供'}`,
      'bazi': '姓氏和出生时间信息',
      'xiyongshen': '八字命理分析结果',
      'zodiac': '出生年份生肖信息',
      'wuxing-selection': '五行需求和候选字符',
      'meaning-selection': '性别偏好和字义要求',
      'phonetic-selection': '姓氏声调和音韵要求',
      'stroke-selection': '姓氏笔画和数理要求',
      'zodiac-selection': '生肖特征和选字偏好',
      'character-filter': '所有策略制定结果',
      'name-combination': '筛选后的候选字符',
      'comprehensive-scoring': '生成的名字组合'
    };
    return summaries[pluginId] || '处理输入数据';
  };

  const generateOutputSummary = (pluginId: string, logs: any[], status: string): string => {
    if (status === 'skipped') return '插件被跳过';
    if (status === 'failed') return '执行失败';
    
    const summaries: Record<string, string> = {
      'surname': '姓氏基础属性（笔画、五行）',
      'gender': '性别专属常用字符集',
      'birth-time': '农历信息和时辰特征',
      'bazi': '五行组合和命格分析',
      'xiyongshen': '五行需求和补益方向',
      'zodiac': '生肖特征和取名建议',
      'wuxing-selection': '五行选字策略和权重',
      'meaning-selection': '寓意选字策略和标准',
      'phonetic-selection': '音韵搭配策略和规则',
      'stroke-selection': '笔画组合策略和评分',
      'zodiac-selection': '生肖选字策略和偏好',
      'character-filter': '候选字符和筛选结果',
      'name-combination': '所有可能的名字组合',
      'comprehensive-scoring': '排序后的最优名字'
    };
    return summaries[pluginId] || '处理结果输出';
  };

  const generateKeyPoints = (pluginId: string, logs: any[], status: string): string[] => {
    if (status === 'skipped') return ['插件未执行'];
    if (status === 'failed') return ['执行失败'];

    const keyPoints: Record<string, string[]> = {
      'surname': ['康熙笔画计算', '五行属性确定', '文化背景分析'],
      'gender': ['常用字符统计', '性别特征分析', '文化适应性'],
      'birth-time': ['农历转换', '时辰分析', '季节特征'],
      'bazi': ['天干地支', '五行组合', '命格特征'],
      'xiyongshen': ['五行平衡', '喜用神确定', '忌神识别'],
      'zodiac': ['生肖确定', '性格特征', '取名宜忌'],
      'wuxing-selection': ['五行匹配', '元素平衡', '策略权重'],
      'meaning-selection': ['字义分析', '文化内涵', '寓意深度'],
      'phonetic-selection': ['声调搭配', '音韵和谐', '谐音避免'],
      'stroke-selection': ['三才配置', '五格数理', '笔画组合'],
      'zodiac-selection': ['生肖偏好', '字形匹配', '文化寓意'],
      'character-filter': ['策略综合', '字符筛选', '质量评估'],
      'name-combination': ['智能组合', '排列优化', '重复过滤'],
      'comprehensive-scoring': ['多维评分', '权重计算', '排序优化']
    };
    return keyPoints[pluginId] || ['数据处理', '结果分析'];
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'skipped':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'running':
        return <PlayIcon className="w-5 h-5 text-blue-500 animate-pulse" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'skipped':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 下载功能
  const downloadReport = async (format: 'html' | 'json' | 'txt') => {
    setIsDownloading(true);
    
    try {
      const plugins = processExecutionLogs();
      const timestamp = new Date().toLocaleString('zh-CN');
      
      let content = '';
      let filename = '';
      let mimeType = '';

      switch (format) {
        case 'html':
          content = generateHTMLReport(plugins, timestamp);
          filename = `name-generation-report-${Date.now()}.html`;
          mimeType = 'text/html';
          break;
        case 'json':
          content = JSON.stringify({
            timestamp,
            requestConfig,
            executionLogs,
            processedPlugins: plugins,
            generatedNames,
            metadata: generationMetadata
          }, null, 2);
          filename = `name-generation-report-${Date.now()}.json`;
          mimeType = 'application/json';
          break;
        case 'txt':
          content = generateTextReport(plugins, timestamp);
          filename = `name-generation-report-${Date.now()}.txt`;
          mimeType = 'text/plain';
          break;
      }

      // 创建下载链接
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('下载报告失败:', error);
      alert('下载失败，请重试');
    } finally {
      setIsDownloading(false);
    }
  };

  const generateHTMLReport = (plugins: ProcessedPlugin[], timestamp: string): string => {
    const layerGroups = plugins.reduce((acc, plugin) => {
      if (!acc[plugin.layer]) acc[plugin.layer] = [];
      acc[plugin.layer].push(plugin);
      return acc;
    }, {} as Record<number, ProcessedPlugin[]>);

    return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>起名插件执行报告</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 40px; background: #f8fafc; }
            .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .header h1 { color: #1a202c; margin: 0; font-size: 2.5rem; }
            .header p { color: #718096; margin: 10px 0 0; font-size: 1.1rem; }
            .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
            .summary-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; border-radius: 12px; text-align: center; }
            .summary-card h3 { margin: 0 0 8px; font-size: 2rem; }
            .summary-card p { margin: 0; opacity: 0.9; }
            .layer { margin-bottom: 30px; border: 2px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
            .layer-header { padding: 20px; font-weight: bold; color: white; font-size: 1.2rem; }
            .layer-content { padding: 20px; background: #f7fafc; }
            .plugin { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
            .plugin-header { display: flex; align-items: center; margin-bottom: 16px; }
            .plugin-icon { font-size: 1.5rem; margin-right: 12px; }
            .plugin-name { font-weight: bold; font-size: 1.1rem; margin-right: 12px; }
            .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 500; }
            .status-success { background: #f0fff4; color: #38a169; border: 1px solid #9ae6b4; }
            .status-failed { background: #fed7d7; color: #e53e3e; border: 1px solid #feb2b2; }
            .status-skipped { background: #fefcbf; color: #d69e2e; border: 1px solid #faf089; }
            .plugin-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 16px; }
            .detail-section h4 { margin: 0 0 8px; color: #4a5568; font-size: 0.9rem; font-weight: 600; }
            .detail-section p { margin: 0; color: #718096; line-height: 1.5; }
            .key-points { margin-top: 16px; }
            .key-points ul { margin: 8px 0 0; padding-left: 20px; }
            .key-points li { color: #718096; margin-bottom: 4px; }
            .names-section { margin-top: 40px; }
            .names-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
            .name-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
            .name-card h3 { margin: 0 0 8px; color: #1a202c; text-align: center; font-size: 1.5rem; }
            .name-card .score { text-align: center; color: #3182ce; font-weight: bold; font-size: 1.2rem; margin-bottom: 16px; }
            .bg-blue-500 { background: linear-gradient(135deg, #3182ce, #2c5aa0); }
            .bg-orange-500 { background: linear-gradient(135deg, #dd6b20, #c05621); }
            .bg-purple-500 { background: linear-gradient(135deg, #805ad5, #6b46c1); }
            .bg-red-500 { background: linear-gradient(135deg, #e53e3e, #c53030); }
            .bg-green-500 { background: linear-gradient(135deg, #38a169, #2f855a); }
            .bg-indigo-500 { background: linear-gradient(135deg, #5a67d8, #4c51bf); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 起名插件执行报告</h1>
                <p>生成时间：${timestamp}</p>
                <p>姓氏：${requestConfig?.familyName || '未指定'} | 性别：${requestConfig?.gender === 'male' ? '男' : '女'}</p>
            </div>
            
            <div class="summary">
                <div class="summary-card">
                    <h3>${plugins.filter(p => p.status === 'success').length}</h3>
                    <p>成功执行</p>
                </div>
                <div class="summary-card">
                    <h3>${plugins.filter(p => p.status === 'skipped').length}</h3>
                    <p>跳过执行</p>
                </div>
                <div class="summary-card">
                    <h3>${Object.keys(layerGroups).length}</h3>
                    <p>处理层级</p>
                </div>
                <div class="summary-card">
                    <h3>${generatedNames?.length || 0}</h3>
                    <p>生成名字</p>
                </div>
            </div>

            ${Object.entries(layerGroups).map(([layer, layerPlugins]) => {
              const layerInfo = layerConfig[parseInt(layer) as keyof typeof layerConfig];
              return `
                <div class="layer">
                    <div class="layer-header ${layerInfo.color}">
                        Layer ${layer}: ${layerInfo.name}
                        <div style="font-size: 0.9rem; margin-top: 4px; opacity: 0.9;">${layerInfo.description}</div>
                    </div>
                    <div class="layer-content">
                        ${layerPlugins.map(plugin => `
                            <div class="plugin">
                                <div class="plugin-header">
                                    <span class="plugin-icon">${plugin.icon}</span>
                                    <span class="plugin-name">${plugin.pluginName}</span>
                                    <span class="status-badge status-${plugin.status}">${plugin.status === 'success' ? '成功' : plugin.status === 'failed' ? '失败' : '跳过'}</span>
                                    ${plugin.status === 'success' ? `<span style="margin-left: auto; color: #718096; font-size: 0.9rem;">${plugin.executionTime}ms</span>` : ''}
                                </div>
                                <p style="color: #718096; margin-bottom: 16px;">${plugin.description}</p>
                                <div class="plugin-details">
                                    <div class="detail-section">
                                        <h4>📥 输入数据</h4>
                                        <p>${plugin.inputSummary}</p>
                                    </div>
                                    <div class="detail-section">
                                        <h4>📤 输出结果</h4>
                                        <p>${plugin.outputSummary}</p>
                                    </div>
                                </div>
                                <div class="key-points">
                                    <h4>🔍 关键处理点</h4>
                                    <ul>
                                        ${plugin.keyPoints.map(point => `<li>${point}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
              `;
            }).join('')}

            ${generatedNames && generatedNames.length > 0 ? `
                <div class="names-section">
                    <h2 style="color: #1a202c; margin-bottom: 20px;">🎯 生成的名字</h2>
                    <div class="names-grid">
                        ${generatedNames.slice(0, 10).map(name => `
                            <div class="name-card">
                                <h3>${name.fullName}</h3>
                                <div class="score">评分: ${name.score}</div>
                                <div style="font-size: 0.9rem; color: #718096;">
                                    <p><strong>五行:</strong> ${name.wuxing || '未知'}</p>
                                    <p><strong>寓意:</strong> ${name.explanation || '美好寓意'}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    </body>
    </html>
    `;
  };

  const generateTextReport = (plugins: ProcessedPlugin[], timestamp: string): string => {
    const layerGroups = plugins.reduce((acc, plugin) => {
      if (!acc[plugin.layer]) acc[plugin.layer] = [];
      acc[plugin.layer].push(plugin);
      return acc;
    }, {} as Record<number, ProcessedPlugin[]>);

    let report = `起名插件执行报告\n`;
    report += `==========================================\n\n`;
    report += `生成时间: ${timestamp}\n`;
    report += `姓氏: ${requestConfig?.familyName || '未指定'}\n`;
    report += `性别: ${requestConfig?.gender === 'male' ? '男' : '女'}\n`;
    report += `出生信息: ${requestConfig?.birthInfo ? '已提供' : '未提供'}\n\n`;

    report += `执行概览\n`;
    report += `--------\n`;
    report += `成功执行: ${plugins.filter(p => p.status === 'success').length} 个插件\n`;
    report += `跳过执行: ${plugins.filter(p => p.status === 'skipped').length} 个插件\n`;
    report += `失败执行: ${plugins.filter(p => p.status === 'failed').length} 个插件\n`;
    report += `处理层级: ${Object.keys(layerGroups).length} 层\n`;
    report += `生成名字: ${generatedNames?.length || 0} 个\n\n`;

    Object.entries(layerGroups).forEach(([layer, layerPlugins]) => {
      const layerInfo = layerConfig[parseInt(layer) as keyof typeof layerConfig];
      report += `${layerInfo.name} (Layer ${layer})\n`;
      report += `${layerInfo.description}\n`;
      report += `${'='.repeat(50)}\n\n`;

      layerPlugins.forEach(plugin => {
        report += `${plugin.icon} ${plugin.pluginName}\n`;
        report += `状态: ${plugin.status === 'success' ? '成功' : plugin.status === 'failed' ? '失败' : '跳过'}\n`;
        if (plugin.status === 'success') {
          report += `执行时间: ${plugin.executionTime}ms\n`;
          report += `置信度: ${Math.round(plugin.confidence * 100)}%\n`;
        }
        report += `描述: ${plugin.description}\n`;
        report += `输入: ${plugin.inputSummary}\n`;
        report += `输出: ${plugin.outputSummary}\n`;
        report += `关键点: ${plugin.keyPoints.join(', ')}\n`;
        report += `\n`;
      });
    });

    if (generatedNames && generatedNames.length > 0) {
      report += `生成的名字\n`;
      report += `========\n\n`;
      generatedNames.slice(0, 10).forEach((name, index) => {
        report += `${index + 1}. ${name.fullName} (评分: ${name.score})\n`;
        report += `   五行: ${name.wuxing || '未知'}\n`;
        report += `   寓意: ${name.explanation || '美好寓意'}\n\n`;
      });
    }

    return report;
  };

  const plugins = processExecutionLogs();
  const layerGroups = plugins.reduce((acc, plugin) => {
    if (!acc[plugin.layer]) acc[plugin.layer] = [];
    acc[plugin.layer].push(plugin);
    return acc;
  }, {} as Record<number, ProcessedPlugin[]>);

  const totalExecutionTime = plugins.reduce((sum, plugin) => sum + plugin.executionTime, 0);

  if (!executionLogs || executionLogs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <Cog8ToothIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无执行数据</h3>
          <p className="text-gray-500">
            请先执行名字生成流程以查看详细的插件执行过程
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={reportRef} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 报告头部 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">🎯 起名插件执行报告</h2>
            <p className="text-blue-100 text-lg">
              详细展示 {plugins.length} 个插件在 {Object.keys(layerGroups).length} 个层级的执行过程
            </p>
            <div className="mt-4 flex items-center space-x-6 text-sm">
              <span>姓氏: {requestConfig?.familyName || '未指定'}</span>
              <span>性别: {requestConfig?.gender === 'male' ? '男' : '女'}</span>
              <span>生成时间: {new Date().toLocaleString('zh-CN')}</span>
            </div>
          </div>
          
          {/* 下载按钮组 */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => downloadReport('html')}
              disabled={isDownloading}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              <span>HTML报告</span>
            </button>
            <button
              onClick={() => downloadReport('json')}
              disabled={isDownloading}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              <span>JSON数据</span>
            </button>
            <button
              onClick={() => downloadReport('txt')}
              disabled={isDownloading}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              <span>文本报告</span>
            </button>
          </div>
        </div>
      </div>

      {/* 执行统计 */}
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {plugins.filter(p => p.status === 'success').length}
            </div>
            <div className="text-sm text-gray-600">成功执行</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {plugins.filter(p => p.status === 'skipped').length}
            </div>
            <div className="text-sm text-gray-600">跳过执行</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {plugins.filter(p => p.status === 'failed').length}
            </div>
            <div className="text-sm text-gray-600">执行失败</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {Object.keys(layerGroups).length}
            </div>
            <div className="text-sm text-gray-600">处理层级</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {totalExecutionTime}ms
            </div>
            <div className="text-sm text-gray-600">总执行时间</div>
          </div>
        </div>
      </div>

      {/* 插件执行流程 */}
      <div className="p-8">
        <div className="space-y-6">
          {Object.entries(layerGroups).map(([layer, layerPlugins]) => {
            const layerNum = parseInt(layer);
            const layerInfo = layerConfig[layerNum as keyof typeof layerConfig];
            const isExpanded = expandedLayers.has(layerNum);

            return (
              <div key={layer} className={`border-2 rounded-xl overflow-hidden ${layerInfo.borderColor}`}>
                {/* 层级标题 */}
                <div
                  onClick={() => toggleLayer(layerNum)}
                  className={`${layerInfo.color} text-white p-6 cursor-pointer hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg font-bold">
                        {layer}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{layerInfo.name}</h3>
                        <p className="text-sm opacity-90 mt-1">{layerInfo.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        {layerPlugins.length} 个插件
                      </div>
                      <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 层级内容 */}
                {isExpanded && (
                  <div className={`${layerInfo.lightColor} p-6`}>
                    <div className="grid gap-4">
                      {layerPlugins.map((plugin, index) => (
                        <div key={`${plugin.pluginId}-${index}`} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          {/* 插件标题栏 */}
                          <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="text-2xl">{plugin.icon}</div>
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900">{plugin.pluginName}</h4>
                                  <p className="text-sm text-gray-500">{plugin.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClass(plugin.status)}`}>
                                  {getStatusIcon(plugin.status)}
                                  <span className="ml-2">
                                    {plugin.status === 'success' ? '成功' : 
                                     plugin.status === 'failed' ? '失败' : 
                                     plugin.status === 'skipped' ? '跳过' : '运行中'}
                                  </span>
                                </div>
                                {plugin.status === 'success' && (
                                  <div className="text-sm text-gray-600">
                                    <ClockIcon className="w-4 h-4 inline mr-1" />
                                    {plugin.executionTime}ms
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 插件详情 */}
                          <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                  📥 输入数据
                                </h5>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {plugin.inputSummary}
                                </p>
                              </div>
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                  📤 输出结果
                                </h5>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {plugin.outputSummary}
                                </p>
                              </div>
                            </div>

                            {/* 关键处理点 */}
                            <div>
                              <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                🔍 关键处理点
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {plugin.keyPoints.map((point, i) => (
                                  <span
                                    key={i}
                                    className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-200"
                                  >
                                    {point}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {plugin.status === 'success' && plugin.confidence > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">置信度</span>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${plugin.confidence * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="font-medium text-green-600">
                                      {Math.round(plugin.confidence * 100)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 生成结果 */}
      {generatedNames && generatedNames.length > 0 && (
        <div className="bg-gray-50 p-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            🎯 生成的名字 ({generatedNames.length} 个)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {generatedNames.slice(0, 12).map((name, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="text-center mb-3">
                  <h4 className="text-xl font-bold text-gray-900">{name.fullName}</h4>
                  <div className="text-lg font-semibold text-blue-600">评分: {name.score}</div>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div><span className="font-medium">五行:</span> {name.wuxing || '平衡'}</div>
                  <div><span className="font-medium">寓意:</span> {name.explanation || '美好寓意'}</div>
                </div>
              </div>
            ))}
          </div>
          {generatedNames.length > 12 && (
            <div className="text-center mt-4 text-sm text-gray-500">
              显示前 12 个名字，完整列表请下载报告查看
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PluginExecutionReport;
