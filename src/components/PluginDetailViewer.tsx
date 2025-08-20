/**
 * 插件详细信息查看器组件
 * 用于展示单个插件的输入、输出和执行过程
 */

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, CheckCircleIcon, XCircleIcon, ClockIcon, PlayIcon } from '@heroicons/react/24/outline';

interface PluginDetailViewerProps {
  plugin: {
    pluginId: string;
    layer: number;
    status: 'pending' | 'running' | 'success' | 'error' | 'skipped';
    input?: any;
    output?: any;
    confidence?: number;
    executionTime?: number;
    errorMessage?: string;
    analysis?: string[];
  };
  layerInfo: {
    name: string;
    color: string;
    description: string;
  };
  executionLogs: Array<{
    timestamp: number;
    level: 'info' | 'warn' | 'error';
    message: string;
    pluginId?: string;
    data?: any;
  }>;
}

const PluginDetailViewer: React.FC<PluginDetailViewerProps> = ({
  plugin,
  layerInfo,
  executionLogs
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getStatusIcon = () => {
    switch (plugin.status) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      case 'running':
        return <ClockIcon className="w-6 h-6 text-blue-500 animate-spin" />;
      case 'skipped':
        return <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-white text-xs">跳</span>
        </div>;
      default:
        return <PlayIcon className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (plugin.status) {
      case 'success': return '执行成功';
      case 'error': return '执行失败';
      case 'running': return '正在执行';
      case 'skipped': return '已跳过';
      default: return '等待执行';
    }
  };

  const getStatusColor = () => {
    switch (plugin.status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'running': return 'bg-blue-50 border-blue-200';
      case 'skipped': return 'bg-gray-50 border-gray-200';
      default: return 'bg-white border-gray-200';
    }
  };

  // 获取插件相关的日志
  const pluginLogs = executionLogs.filter(log => log.pluginId === plugin.pluginId);

  // 提取输入输出数据
  const getInputData = () => {
    // 从日志中提取输入数据
    const inputLog = pluginLogs.find(log => log.message.includes('开始分析') || log.message.includes('开始'));
    return inputLog?.data || plugin.input || null;
  };

  const getOutputData = () => {
    // 从日志中提取输出数据
    const outputLog = pluginLogs.find(log => log.message.includes('分析结果'));
    return outputLog?.data || plugin.output || null;
  };

  // 插件功能描述
  const getPluginDescription = () => {
    const descriptions: Record<string, string> = {
      'surname': '分析姓氏的字音、字形、五行属性和文化内涵，为后续起名提供基础信息',
      'gender': '根据性别确定起名策略，男孩偏向楚辞，女孩偏向诗经，制定字符偏好',
      'birth-time': '分析出生时间，计算八字、干支纪年，确定命理基础信息',
      'bazi': '计算八字四柱，分析天干地支组合，确定五行强弱分布',
      'zodiac': '根据出生年份确定生肖，分析生肖特征和起名宜忌',
      'xiyongshen': '基于八字分析确定喜用神，指导五行补益策略',
      'wuxing-selection': '制定五行选字策略，根据命理需求选择合适五行的字',
      'zodiac-selection': '制定生肖选字策略，选择与生肖相配的字符',
      'meaning-selection': '制定寓意选字策略，选择寓意美好的字符',
      'stroke-selection': '制定笔画选字策略，确保笔画数符合命理要求',
      'phonetic-selection': '制定音韵选字策略，确保名字读音优美',
      'character-filter': '综合各种选字策略，筛选出最优候选字符池',
      'name-combination': '基于筛选后的字符池，生成所有可能的名字组合',
      'comprehensive-scoring': '对生成的名字进行综合评分，包括五格、三才、音韵等'
    };
    return descriptions[plugin.pluginId] || '未知插件功能';
  };

  const SectionHeader: React.FC<{ title: string; section: string; icon?: React.ReactNode }> = ({ title, section, icon }) => (
    <div
      className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
      onClick={() => toggleSection(section)}
    >
      <div className="flex items-center space-x-2">
        {icon}
        <span className="font-medium text-gray-900">{title}</span>
      </div>
      {expandedSections.has(section) ? 
        <ChevronDownIcon className="w-4 h-4 text-gray-400" /> :
        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
      }
    </div>
  );

  return (
    <div className={`border rounded-lg p-6 ${getStatusColor()}`}>
      {/* 插件概览 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{plugin.pluginId}</h3>
              <p className="text-sm text-gray-600">{layerInfo.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${layerInfo.color}`}>
              {getStatusText()}
            </div>
            {plugin.confidence !== undefined && (
              <div className="text-sm text-gray-600 mt-1">
                置信度: {(plugin.confidence * 100).toFixed(1)}%
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-700 bg-white rounded-lg p-3 border">
          {getPluginDescription()}
        </p>
      </div>

      {/* 详细信息sections */}
      <div className="space-y-4">
        {/* 输入数据 */}
        <div>
          <SectionHeader 
            title="输入数据" 
            section="input"
            icon={<div className="w-4 h-4 bg-blue-500 rounded-full"></div>}
          />
          {expandedSections.has('input') && (
            <div className="mt-3 bg-white rounded-lg p-4 border">
              {getInputData() ? (
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(getInputData(), null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500 italic">暂无输入数据</p>
              )}
            </div>
          )}
        </div>

        {/* 执行过程 */}
        <div>
          <SectionHeader 
            title="执行过程" 
            section="process"
            icon={<ClockIcon className="w-4 h-4 text-orange-500" />}
          />
          {expandedSections.has('process') && (
            <div className="mt-3 bg-white rounded-lg p-4 border">
              {pluginLogs.length > 0 ? (
                <div className="space-y-2">
                  {pluginLogs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        log.level === 'error' ? 'bg-red-500' :
                        log.level === 'warn' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-700">{log.message}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">暂无执行日志</p>
              )}
            </div>
          )}
        </div>

        {/* 输出结果 */}
        <div>
          <SectionHeader 
            title="输出结果" 
            section="output"
            icon={<div className="w-4 h-4 bg-green-500 rounded-full"></div>}
          />
          {expandedSections.has('output') && (
            <div className="mt-3 bg-white rounded-lg p-4 border">
              {getOutputData() ? (
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(getOutputData(), null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500 italic">暂无输出数据</p>
              )}
            </div>
          )}
        </div>

        {/* 错误信息 */}
        {plugin.status === 'error' && plugin.errorMessage && (
          <div>
            <SectionHeader 
              title="错误信息" 
              section="error"
              icon={<XCircleIcon className="w-4 h-4 text-red-500" />}
            />
            {expandedSections.has('error') && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{plugin.errorMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* 性能指标 */}
        {plugin.executionTime !== undefined && (
          <div>
            <SectionHeader 
              title="性能指标" 
              section="performance"
              icon={<div className="w-4 h-4 bg-purple-500 rounded-full"></div>}
            />
            {expandedSections.has('performance') && (
              <div className="mt-3 bg-white rounded-lg p-4 border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700">执行时间</div>
                    <div className="text-lg text-gray-900">{plugin.executionTime}ms</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">置信度</div>
                    <div className="text-lg text-gray-900">
                      {plugin.confidence ? `${(plugin.confidence * 100).toFixed(1)}%` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PluginDetailViewer;
