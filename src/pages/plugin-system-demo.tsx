import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import SystemSelector, { SystemConfig, CertaintyLevel } from '../components/SystemSelector';
import PluginExecutionViewer from '../components/PluginExecutionViewer';

// 表单数据接口
interface FormData {
  familyName: string;
  gender: 'male' | 'female';
  birthDate: string;
  birthTime: string;
  scoreThreshold: number;
  limit: number;
}

// 生成结果接口
interface GenerationResult {
  mode: 'traditional' | 'plugin' | 'comparison';
  success: boolean;
  data: any;
  error?: string;
}

const PluginSystemDemo: React.FC = () => {
  // 表单状态
  const [formData, setFormData] = useState<FormData>({
    familyName: '吴',
    gender: 'male',
    birthDate: '2024-01-15',
    birthTime: '14:30',
    scoreThreshold: 85,
    limit: 5
  });

  // 系统配置状态
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    usePluginSystem: false,
    showComparison: false,
    enableDetailedLogs: true,
    enableParallel: false,
    certaintyLevel: CertaintyLevel.PARTIALLY_DETERMINED
  });

  // 生成状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [executionTime, setExecutionTime] = useState<number>(0);

  // 解析出生信息
  const birthInfo = React.useMemo(() => {
    if (!formData.birthDate) return undefined;
    
    const date = new Date(formData.birthDate);
    const result = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: undefined as number | undefined
    };
    
    if (formData.birthTime) {
      const [hour, minute] = formData.birthTime.split(':').map(Number);
      result.hour = hour;
    }
    
    return result;
  }, [formData.birthDate, formData.birthTime]);

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.familyName.trim()) {
      alert('请输入姓氏');
      return;
    }

    setIsGenerating(true);
    setResult(null);
    
    const startTime = Date.now();

    try {
      // 构建请求数据
      const requestData = {
        familyName: formData.familyName,
        gender: formData.gender,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        scoreThreshold: formData.scoreThreshold,
        limit: formData.limit,
        // 系统配置
        usePluginSystem: systemConfig.usePluginSystem,
        showComparison: systemConfig.showComparison,
        enableDetailedLogs: systemConfig.enableDetailedLogs,
        enableParallel: systemConfig.enableParallel,
        certaintyLevel: systemConfig.certaintyLevel
      };

      console.log('🚀 开始生成名字:', requestData);

      // 调用混合API
      const response = await fetch('/api/generate-names-hybrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);

      if (data.success) {
        setResult(data);
        console.log('✅ 名字生成成功:', data);
      } else {
        setResult({
          mode: 'traditional',
          success: false,
          data: null,
          error: data.error || '生成失败'
        });
        console.error('❌ 名字生成失败:', data.error);
      }

    } catch (error) {
      console.error('❌ 请求失败:', error);
      setResult({
        mode: 'traditional',
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '网络错误'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    setFormData({
      familyName: '',
      gender: 'male',
      birthDate: '',
      birthTime: '',
      scoreThreshold: 80,
      limit: 5
    });
    setResult(null);
    setExecutionTime(0);
  };

  return (
    <Layout>
      <Head>
        <title>插件系统演示 - 宝宝取名网</title>
        <meta name="description" content="插件系统与传统系统对比演示" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧩 插件系统演示
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            体验全新的模块化取名系统，对比传统系统与插件系统的差异，
            深度了解名字生成的每一个步骤和分析过程。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：表单和系统配置 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 系统配置 */}
            <SystemSelector
              config={systemConfig}
              onChange={setSystemConfig}
              birthInfo={birthInfo}
              disabled={isGenerating}
            />

            {/* 表单 */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">📝 取名信息</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 姓氏 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    姓氏 *
                  </label>
                  <input
                    type="text"
                    value={formData.familyName}
                    onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入姓氏"
                    disabled={isGenerating}
                    required
                  />
                </div>

                {/* 性别 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    性别 *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isGenerating}
                  >
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                </div>

                {/* 出生日期 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    出生日期
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isGenerating}
                  />
                </div>

                {/* 出生时间 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    出生时间
                  </label>
                  <input
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isGenerating}
                  />
                </div>

                {/* 评分阈值 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    评分阈值: {formData.scoreThreshold}
                  </label>
                  <input
                    type="range"
                    min="70"
                    max="95"
                    step="5"
                    value={formData.scoreThreshold}
                    onChange={(e) => setFormData({ ...formData, scoreThreshold: Number(e.target.value) })}
                    className="w-full"
                    disabled={isGenerating}
                  />
                </div>

                {/* 生成数量 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    生成数量
                  </label>
                  <select
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isGenerating}
                  >
                    <option value={3}>3个</option>
                    <option value={5}>5个</option>
                    <option value={10}>10个</option>
                  </select>
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className={`flex-1 py-2 px-4 rounded-md font-medium ${
                      isGenerating
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white transition-colors`}
                  >
                    {isGenerating ? '🔄 生成中...' : '🚀 开始生成'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isGenerating}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    重置
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 右侧：结果展示 */}
          <div className="lg:col-span-2">
            {/* 执行状态 */}
            {(isGenerating || result) && (
              <div className="mb-6">
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {isGenerating ? (
                        <>
                          <div className="animate-spin">🔄</div>
                          <span className="font-medium">正在生成名字...</span>
                        </>
                      ) : result?.success ? (
                        <>
                          <span className="text-green-500">✅</span>
                          <span className="font-medium">生成完成</span>
                        </>
                      ) : (
                        <>
                          <span className="text-red-500">❌</span>
                          <span className="font-medium">生成失败</span>
                        </>
                      )}
                    </div>
                    
                    {executionTime > 0 && (
                      <div className="text-sm text-gray-600">
                        耗时: {executionTime}ms
                      </div>
                    )}
                  </div>

                  {result?.error && (
                    <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded">
                      错误: {result.error}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 结果展示 */}
            {result?.success && (
              <div className="space-y-6">
                {/* 对比模式结果 */}
                {result.mode === 'comparison' && result.data.comparison && (
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">📊 系统对比报告</h3>
                    
                    {/* 对比摘要 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">
                          {result.data.comparison.summary.nameOverlap}
                        </div>
                        <div className="text-sm text-gray-600">名字重叠率</div>
                      </div>
                      
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {result.data.comparison.summary.scoreConsistency}
                        </div>
                        <div className="text-sm text-gray-600">评分一致性</div>
                      </div>
                      
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-2xl font-bold text-purple-600">
                          {result.data.comparison.summary.fasterSystem}
                        </div>
                        <div className="text-sm text-gray-600">更快系统</div>
                      </div>
                      
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <div className="text-2xl font-bold text-orange-600">
                          {result.data.comparison.summary.featureAdvantage}
                        </div>
                        <div className="text-sm text-gray-600">功能优势</div>
                      </div>
                    </div>

                    {/* 结论和建议 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">📋 分析结论</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {result.data.comparison.conclusions.map((conclusion: string, index: number) => (
                            <li key={index}>• {conclusion}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">💡 使用建议</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {result.data.comparison.recommendations.map((recommendation: string, index: number) => (
                            <li key={index}>• {recommendation}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 插件系统详细日志 */}
                {(result.mode === 'plugin' || result.mode === 'comparison') && 
                 result.data.pluginSystem?.detailedLogs && (
                  <PluginExecutionViewer
                    executionLogs={result.data.pluginSystem.detailedLogs}
                    executionSummary={result.data.pluginSystem.executionSummary}
                    isRunning={false}
                  />
                )}

                {/* 生成的名字 */}
                {result.data.names && (
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      🎯 生成的名字 ({result.data.names.length}个)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.data.names.map((name: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-lg">{name.fullName}</h4>
                            <div className="text-lg font-bold text-blue-600">
                              {name.score}分
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            {name.explanation}
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            三才: {name.sancai?.combination} • 
                            等级: {name.sancai?.level}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 空状态 */}
            {!result && !isGenerating && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">🧩</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  插件系统演示
                </h3>
                <p className="text-gray-600 mb-4">
                  配置左侧参数，点击"开始生成"体验插件系统的强大功能
                </p>
                <div className="text-sm text-gray-500">
                  💡 建议先尝试对比模式，同时体验两套系统的差异
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PluginSystemDemo;
