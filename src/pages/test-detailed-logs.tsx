/**
 * 详细日志测试页面
 */

import React, { useState } from 'react';
import { NextPage } from 'next';
import Layout from '../components/Layout';

const TestDetailedLogsPage: NextPage = () => {
  const [familyName, setFamilyName] = useState('吴');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [certaintyLevel, setCertaintyLevel] = useState<number>(1);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate-names-plugin-real', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          familyName,
          gender,
          birthInfo: certaintyLevel >= 2 ? {
            year: 2024,
            month: 6,
            day: certaintyLevel >= 3 ? 15 : undefined,
            hour: certaintyLevel >= 4 ? 10 : undefined,
            minute: certaintyLevel >= 4 ? 30 : undefined
          } : undefined,
          preferences: {
            certaintyLevel
          },
          limit: 3,
          enableDetailedLogs: true
        }),
      });

      const result = await response.json();
      setResult(result);
      
      if (!result.success) {
        setError(result.error || '测试失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误');
    } finally {
      setLoading(false);
    }
  };

  const formatLogLevel = (level: string) => {
    const colors = {
      info: 'text-blue-600',
      warn: 'text-yellow-600',
      error: 'text-red-600'
    };
    return colors[level as keyof typeof colors] || 'text-gray-600';
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Layout title="详细日志测试">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          插件系统详细日志测试
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">测试参数</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓氏
              </label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="吴"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性别
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确定性等级
              </label>
              <select
                value={certaintyLevel}
                onChange={(e) => setCertaintyLevel(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>🎯 完全确定 (15插件)</option>
                <option value={2}>📊 部分确定 (13插件)</option>
                <option value={3}>📈 预估阶段 (9插件)</option>
                <option value={4}>📝 基础模式 (6插件)</option>
              </select>
            </div>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold mb-2">当前模式说明:</h3>
            <div className="text-sm text-gray-600">
              {certaintyLevel === 1 && (
                <>
                  <p><strong>完全确定模式:</strong> 包含完整出生时间信息，启用所有15个插件进行全面分析。</p>
                  <p><strong>提供数据:</strong> 年、月、日、时、分</p>
                </>
              )}
              {certaintyLevel === 2 && (
                <>
                  <p><strong>部分确定模式:</strong> 有出生日期但缺少时辰信息，启用13个插件。</p>
                  <p><strong>提供数据:</strong> 年、月、日</p>
                </>
              )}
              {certaintyLevel === 3 && (
                <>
                  <p><strong>预估阶段模式:</strong> 基于预产期或有限信息，启用9个核心插件。</p>
                  <p><strong>提供数据:</strong> 年、月</p>
                </>
              )}
              {certaintyLevel === 4 && (
                <>
                  <p><strong>基础模式:</strong> 仅有基础信息，启用6个基础插件。</p>
                  <p><strong>提供数据:</strong> 姓氏、性别</p>
                </>
              )}
            </div>
          </div>

          <button
            onClick={runTest}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
{loading ? '生成中...' : `生成名字 (${certaintyLevel === 1 ? '完全确定' : certaintyLevel === 2 ? '部分确定' : certaintyLevel === 3 ? '预估阶段' : '基础'}模式)`}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">错误</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* 生成结果概览 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">生成结果</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="font-semibold">状态</h3>
                  <p className="text-green-600">{result.success ? '✅ 成功' : '❌ 失败'}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="font-semibold">生成数量</h3>
                  <p className="text-blue-600">{result.names?.length || 0} 个名字</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                  <h3 className="font-semibold">总时间</h3>
                  <p className="text-purple-600">{result.metadata?.totalTime || 0}ms</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                  <h3 className="font-semibold">确定性等级</h3>
                  <p className="text-orange-600">{result.metadata?.certaintyLevel || '未知'}</p>
                </div>
              </div>

              {result.names && result.names.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">生成的名字:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {result.names.map((name: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded p-2">
                        <span className="font-medium">{name.name}</span>
                        <span className="text-sm text-gray-600 ml-2">({name.totalScore}分)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 详细执行日志 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">详细执行日志</h2>
              
              {result.executionLogs && result.executionLogs.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {result.executionLogs.map((log: any, index: number) => (
                    <div key={index} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded text-sm">
                      <span className="text-gray-500 text-xs min-w-[60px]">
                        {formatTimestamp(log.timestamp)}
                      </span>
                      <span className={`font-medium min-w-[50px] ${formatLogLevel(log.level)}`}>
                        [{log.level.toUpperCase()}]
                      </span>
                      {log.pluginId && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium min-w-[80px]">
                          {log.pluginId}
                        </span>
                      )}
                      {log.layer && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          L{log.layer}
                        </span>
                      )}
                      <span className="flex-1 text-gray-800">{log.message}</span>
                      {log.data && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-blue-600">数据</summary>
                          <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto max-w-xs">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">无详细日志数据</p>
              )}
            </div>

            {/* 插件执行统计 */}
            {result.metadata && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">执行统计</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-semibold text-sm">执行插件</h3>
                    <p className="text-lg">{result.metadata.pluginsExecuted || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-semibold text-sm">启用插件</h3>
                    <p className="text-lg">{result.metadata.enabledPlugins || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-semibold text-sm">层数</h3>
                    <p className="text-lg">{result.metadata.layersProcessed || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-semibold text-sm">平均置信度</h3>
                    <p className="text-lg">{result.metadata.confidence || 0}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-semibold text-sm">生成方法</h3>
                    <p className="text-sm">{result.metadata.generationMethod || 'unknown'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TestDetailedLogsPage;
