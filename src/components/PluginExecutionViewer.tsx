import React, { useState, useEffect } from 'react';

// 插件执行日志接口
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

// 执行摘要接口
interface ExecutionSummary {
  totalTime: number;
  totalPlugins: number;
  successCount: number;
  failureCount: number;
  skipCount: number;
  successRate: number;
  layerBreakdown: Array<{
    layer: number;
    pluginCount: number;
    totalTime: number;
    successCount: number;
    failureCount: number;
    skipCount: number;
    description: string;
  }>;
}

// 组件属性接口
interface PluginExecutionViewerProps {
  executionLogs: PluginExecutionLog[];
  executionSummary: ExecutionSummary;
  isRunning: boolean;
  onPluginClick?: (log: PluginExecutionLog) => void;
}

// 状态图标组件
const StatusIcon: React.FC<{ status: PluginExecutionLog['status'] }> = ({ status }) => {
  const icons = {
    pending: '⏳',
    running: '🔄',
    completed: '✅',
    failed: '❌',
    skipped: '⚠️'
  };
  
  const colors = {
    pending: 'text-gray-400',
    running: 'text-blue-500 animate-spin',
    completed: 'text-green-500',
    failed: 'text-red-500',
    skipped: 'text-yellow-500'
  };
  
  return (
    <span className={`inline-block w-6 h-6 text-center ${colors[status]}`}>
      {icons[status]}
    </span>
  );
};

// 进度条组件
const ProgressBar: React.FC<{ value: number; max?: number; className?: string }> = ({ 
  value, 
  max = 100, 
  className = '' 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// 执行时间格式化
const formatExecutionTime = (ms?: number): string => {
  if (!ms) return '0ms';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

// 置信度颜色
const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return 'text-green-600';
  if (confidence >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

// 层级颜色
const getLayerColor = (layer: number): string => {
  const colors = {
    1: 'bg-blue-100 border-blue-300',
    2: 'bg-green-100 border-green-300', 
    3: 'bg-yellow-100 border-yellow-300',
    4: 'bg-purple-100 border-purple-300'
  };
  return colors[layer as keyof typeof colors] || 'bg-gray-100 border-gray-300';
};

// 插件卡片组件
const PluginCard: React.FC<{ 
  log: PluginExecutionLog; 
  onClick?: () => void;
  isExpanded?: boolean;
}> = ({ log, onClick, isExpanded = false }) => {
  return (
    <div 
      className={`border rounded-lg p-3 mb-2 cursor-pointer transition-all hover:shadow-md ${
        log.status === 'completed' ? 'border-green-200 bg-green-50' :
        log.status === 'failed' ? 'border-red-200 bg-red-50' :
        log.status === 'skipped' ? 'border-yellow-200 bg-yellow-50' :
        log.status === 'running' ? 'border-blue-200 bg-blue-50' :
        'border-gray-200 bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <StatusIcon status={log.status} />
          <div>
            <div className="font-medium text-sm">{log.pluginId}</div>
            <div className="text-xs text-gray-600">{log.metadata.description}</div>
          </div>
        </div>
        
        <div className="text-right text-xs">
          {log.metadata.executionTime && (
            <div className="text-gray-500">
              {formatExecutionTime(log.metadata.executionTime)}
            </div>
          )}
          {log.status === 'completed' && (
            <div className={`font-medium ${getConfidenceColor(log.metadata.confidence)}`}>
              {log.metadata.confidence}%
            </div>
          )}
        </div>
      </div>
      
      {log.status === 'failed' && log.error && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
          错误: {log.error}
        </div>
      )}
      
      {log.dependencies.length > 0 && isExpanded && (
        <div className="mt-2 text-xs text-gray-500">
          依赖: {log.dependencies.join(', ')}
        </div>
      )}
      
      {isExpanded && log.output && (
        <div className="mt-2 text-xs">
          <details className="cursor-pointer">
            <summary className="text-gray-600">查看输出</summary>
            <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(log.output, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

// 层级展示组件
const LayerSection: React.FC<{ 
  layer: number;
  logs: PluginExecutionLog[];
  layerSummary: ExecutionSummary['layerBreakdown'][0];
  onPluginClick?: (log: PluginExecutionLog) => void;
}> = ({ layer, logs, layerSummary, onPluginClick }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(null);
  
  const layerNames = {
    1: '基础信息层',
    2: '命理基础层',
    3: '字符评估层',
    4: '组合计算层'
  };
  
  const completedCount = logs.filter(log => log.status === 'completed').length;
  const totalCount = logs.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  return (
    <div className={`border rounded-lg mb-4 ${getLayerColor(layer)}`}>
      {/* 层级头部 */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-bold">Layer {layer}</span>
            <span className="font-medium">{layerNames[layer as keyof typeof layerNames]}</span>
            <span className="text-sm text-gray-600">
              ({completedCount}/{totalCount})
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {formatExecutionTime(layerSummary.totalTime)}
            </div>
            <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
          </div>
        </div>
        
        {/* 进度条 */}
        <div className="mt-2">
          <ProgressBar value={progress} className="h-2" />
        </div>
        
        {/* 层级描述 */}
        <div className="mt-2 text-sm text-gray-600">
          {layerSummary.description}
        </div>
      </div>
      
      {/* 插件列表 */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {logs.map((log) => (
            <PluginCard
              key={log.pluginId}
              log={log}
              isExpanded={selectedPlugin === log.pluginId}
              onClick={() => {
                setSelectedPlugin(selectedPlugin === log.pluginId ? null : log.pluginId);
                onPluginClick?.(log);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 执行摘要组件
const ExecutionSummaryCard: React.FC<{ summary: ExecutionSummary; isRunning: boolean }> = ({ 
  summary, 
  isRunning 
}) => {
  return (
    <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-3">📊 插件系统执行概览</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatExecutionTime(summary.totalTime)}
          </div>
          <div className="text-sm text-gray-600">总执行时间</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {summary.successRate}%
          </div>
          <div className="text-sm text-gray-600">成功率</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {summary.totalPlugins}
          </div>
          <div className="text-sm text-gray-600">总插件数</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {summary.layerBreakdown.length}
          </div>
          <div className="text-sm text-gray-600">执行层数</div>
        </div>
      </div>
      
      {/* 状态统计 */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-1">
          <span className="text-green-500">✅</span>
          <span>成功: {summary.successCount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-red-500">❌</span>
          <span>失败: {summary.failureCount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-yellow-500">⚠️</span>
          <span>跳过: {summary.skipCount}</span>
        </div>
      </div>
      
      {isRunning && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <div className="animate-spin">🔄</div>
            <span>插件系统正在执行中...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// 主组件
const PluginExecutionViewer: React.FC<PluginExecutionViewerProps> = ({
  executionLogs,
  executionSummary,
  isRunning,
  onPluginClick
}) => {
  const [selectedLog, setSelectedLog] = useState<PluginExecutionLog | null>(null);
  
  // 按层级分组日志
  const layerGroups = executionLogs.reduce((groups, log) => {
    const layerKey = `layer${log.layer}`;
    if (!groups[layerKey]) {
      groups[layerKey] = [];
    }
    groups[layerKey].push(log);
    return groups;
  }, {} as Record<string, PluginExecutionLog[]>);
  
  // 排序层级
  const sortedLayers = Object.keys(layerGroups)
    .sort((a, b) => parseInt(a.replace('layer', '')) - parseInt(b.replace('layer', '')))
    .map(key => ({
      layer: parseInt(key.replace('layer', '')),
      logs: layerGroups[key]
    }));
  
  const handlePluginClick = (log: PluginExecutionLog) => {
    setSelectedLog(log);
    onPluginClick?.(log);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 执行摘要 */}
      <ExecutionSummaryCard summary={executionSummary} isRunning={isRunning} />
      
      {/* 分层执行详情 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">📋 分层执行详情</h3>
        
        {sortedLayers.map(({ layer, logs }) => {
          const layerSummary = executionSummary.layerBreakdown.find(
            breakdown => breakdown.layer === layer
          );
          
          if (!layerSummary) return null;
          
          return (
            <LayerSection
              key={layer}
              layer={layer}
              logs={logs}
              layerSummary={layerSummary}
              onPluginClick={handlePluginClick}
            />
          );
        })}
      </div>
      
      {/* 插件详情弹窗 */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">插件详情: {selectedLog.pluginId}</h3>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">状态</label>
                <div className="flex items-center space-x-2">
                  <StatusIcon status={selectedLog.status} />
                  <span className="capitalize">{selectedLog.status}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">描述</label>
                <p className="text-sm text-gray-600">{selectedLog.metadata.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">层级</label>
                  <span className="text-sm">Layer {selectedLog.layer}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">类别</label>
                  <span className="text-sm">{selectedLog.metadata.category}</span>
                </div>
              </div>
              
              {selectedLog.metadata.executionTime && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">执行时间</label>
                    <span className="text-sm">{formatExecutionTime(selectedLog.metadata.executionTime)}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">置信度</label>
                    <span className={`text-sm ${getConfidenceColor(selectedLog.metadata.confidence)}`}>
                      {selectedLog.metadata.confidence}%
                    </span>
                  </div>
                </div>
              )}
              
              {selectedLog.dependencies.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">依赖插件</label>
                  <div className="text-sm text-gray-600">
                    {selectedLog.dependencies.join(', ')}
                  </div>
                </div>
              )}
              
              {selectedLog.error && (
                <div>
                  <label className="block text-sm font-medium text-red-700">错误信息</label>
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {selectedLog.error}
                  </div>
                </div>
              )}
              
              {selectedLog.output && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">输出结果</label>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                    {JSON.stringify(selectedLog.output, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PluginExecutionViewer;
