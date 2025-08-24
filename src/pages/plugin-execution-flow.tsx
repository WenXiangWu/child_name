/**
 * 智能插件系统 - 专业取名页面
 * 展示6层插件系统的科学取名过程，提供美观的用户界面和详细的名字分析
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { Button, Input, Card } from '../components/ui';

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
  const [formData, setFormData] = useState({
    familyName: '',
    gender: '' as 'male' | 'female' | '',
    birthDate: '',
    birthTime: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<PluginExecutionLog[]>([]);
  const [pluginResults, setPluginResults] = useState<PluginResult[]>([]);
  const [generatedNames, setGeneratedNames] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showProcess, setShowProcess] = useState(false);
  const [selectedName, setSelectedName] = useState<any>(null);
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
    if (!formData.familyName || !formData.gender) {
      alert('请填写完整的基础信息');
      return;
    }

    setIsGenerating(true);
    setExecutionLogs([]);
    setPluginResults([]);
    setGeneratedNames([]);
    setCurrentLayer(0);
    setShowResults(false);
    setShowProcess(false);

    try {
      const response = await fetch('/api/generate-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyName: formData.familyName,
          gender: formData.gender,
          birthDate: formData.birthDate || undefined,
          birthTime: formData.birthTime || undefined,
          usePluginSystem: true,
          enableDetailedLogs: true,
          limit: 10
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setExecutionLogs(result.executionLogs || []);
        
        // 处理生成的名字
        if (result.data && result.data.names) {
          const processedNames = result.data.names.map((name: any, index: number) => ({
            id: index + 1,
            fullName: name.fullName || `${formData.familyName}${name.firstName || ''}${name.secondName || ''}`,
            firstName: name.firstName || name.givenName?.split('')[0] || '',
            secondName: name.secondName || name.givenName?.split('')[1] || '',
            meaning: name.meaning || name.explanation || '寓意美好',
            score: name.totalScore || name.score || 85,
            analysis: {
              sancai: name.analysis?.sancai || name.sancaiScore || 85,
              wuxing: name.analysis?.wuxing || name.wuxingScore || 85,
              phonetic: name.analysis?.phonetic || name.phoneticScore || 85,
              meaning: name.analysis?.meaning || name.meaningScore || 85,
              cultural: name.analysis?.cultural || name.culturalScore || 85,
              zodiac: name.analysis?.zodiac || name.zodiacScore || 85
            },
            details: name
          }));
          
          setGeneratedNames(processedNames);
          setShowResults(true);
        }
        
        // 解析插件执行结果
        parsePluginResults(result.executionLogs || []);
      } else {
        alert(`生成失败: ${result.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
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
    <Layout 
      title="智能插件系统 - 宝宝取名专家"
      description="体验我们的6层智能插件系统，科学分析，专业取名，为您的宝宝生成最佳名字"
    >
      <div className="min-h-screen bg-cultural-gradient">
        {/* 科普介绍区域 */}
        <section className="py-16 bg-cultural-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-cultural-gold rounded-full"></div>
            <div className="absolute top-32 right-20 w-24 h-24 border border-cultural-jade rotate-45"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-cultural-red/10 rounded-full"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold font-heading text-cultural-ink mb-6">
                🧩 智能插件系统
              </h1>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                基于传统文化智慧与现代科学方法，6层18个专业插件协同工作，为您的宝宝科学生成最佳名字
              </p>
            </div>

            {/* 插件系统科普 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">🔬</span>
                </div>
                <h3 className="text-xl font-bold text-cultural-ink mb-4">科学分层设计</h3>
                <p className="text-gray-600 leading-relaxed">
                  6个专业层级，从基础信息到最终评分，每一层都有专门的插件负责特定功能，确保分析的全面性和准确性
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-cultural-jade to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-cultural-ink mb-4">精准智能分析</h3>
                <p className="text-gray-600 leading-relaxed">
                  18个专业插件协同工作，从姓氏分析、五行平衡到音韵美感，每个维度都经过精密计算和文化考量
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-cultural-red to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">📊</span>
                </div>
                <h3 className="text-xl font-bold text-cultural-ink mb-4">透明化过程</h3>
                <p className="text-gray-600 leading-relaxed">
                  完整展示每个插件的分析过程，让您了解名字是如何生成的，每个评分的依据是什么
                </p>
              </Card>
            </div>

            {/* 6层架构展示 */}
            <Card variant="cultural" padding="lg" className="mb-16">
              <h2 className="text-3xl font-bold font-heading text-cultural-ink mb-8 text-center">
                🏗️ 六层插件架构
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(layerConfig).map(([layer, config]) => (
                  <div
                    key={layer}
                    className="bg-white rounded-xl p-6 border-2 border-cultural-gold/20 hover:border-cultural-gold/40 transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                        layer === '1' ? 'bg-blue-500' :
                        layer === '2' ? 'bg-yellow-500' :
                        layer === '3' ? 'bg-orange-500' :
                        layer === '4' ? 'bg-red-500' :
                        layer === '5' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}>
                        {layer}
                      </div>
                      <h3 className="font-bold text-cultural-ink">{config.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                    <div className="text-xs text-cultural-jade">
                      插件数量: {config.plugins.length}个
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* 美观的输入表单 */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Card variant="cultural" padding="lg" className="shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-heading text-cultural-ink mb-4">
                  🎯 开始智能取名
                </h2>
                <p className="text-gray-600">
                  填写宝宝的基本信息，我们的智能插件系统将为您生成专业的名字推荐
                </p>
        </div>

              <div className="space-y-8">
                {/* 基本信息 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="宝宝姓氏"
                    value={formData.familyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, familyName: e.target.value }))}
                    placeholder="请输入姓氏"
                    required
                  />

            <div>
                    <label className="block text-sm font-medium text-cultural-ink mb-3">
                      宝宝性别 <span className="text-cultural-red">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, gender: 'male' }))}
                        className={`p-6 border-2 rounded-xl transition-all ${
                          formData.gender === 'male'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-4xl mb-3">👦</div>
                        <div className="font-semibold">男宝宝</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, gender: 'female' }))}
                        className={`p-6 border-2 rounded-xl transition-all ${
                          formData.gender === 'female'
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-4xl mb-3">👧</div>
                        <div className="font-semibold">女宝宝</div>
                      </button>
                    </div>
                  </div>
            </div>

                {/* 出生信息 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="出生日期（可选）"
                  type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                    max={new Date().toISOString().split('T')[0]}
                    helperText="用于八字和五行分析"
                  />

                  <Input
                    label="出生时间（可选）"
                  type="time"
                    value={formData.birthTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                    helperText="用于精确八字分析"
                  />
                </div>

                {/* 生成按钮 */}
                <div className="text-center pt-6">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={!formData.familyName || !formData.gender || isGenerating}
                    loading={isGenerating}
                    className="px-12 py-4 text-lg"
                  >
                    {isGenerating ? '🔄 智能分析中...' : '🚀 启动插件系统'}
                  </Button>
                  
                  {(!formData.familyName || !formData.gender) && (
                    <p className="text-sm text-gray-500 mt-3">
                      请填写姓氏和性别信息
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 名字结果展示 */}
        {showResults && generatedNames.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold font-heading text-cultural-ink mb-4">
                  ✨ 智能生成结果
                </h2>
                <p className="text-xl text-gray-600">
                  基于6层插件系统分析，为您精选的优质名字
                </p>
                
                {/* 查看生成过程按钮 */}
                <div className="mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => setShowProcess(!showProcess)}
                    className="mr-4"
                  >
                    {showProcess ? '🔼 隐藏生成过程' : '🔽 查看生成过程'}
                  </Button>
                </div>
              </div>

              {/* 名字列表 */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {generatedNames.map((name) => (
                  <Card 
                    key={name.id} 
                    className="p-8 hover:shadow-2xl transition-all duration-300 border-2 border-cultural-gold/20 hover:border-cultural-gold/40 cursor-pointer"
                    onClick={() => setSelectedName(selectedName?.id === name.id ? null : name)}
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-3xl font-bold text-cultural-ink mb-3">{name.fullName}</h3>
                      <div className="flex justify-center items-center space-x-2 mb-4">
                        <span className="text-cultural-gold text-2xl">⭐</span>
                        <span className="text-2xl font-bold text-cultural-jade">{name.score}分</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-cultural-paper/50 rounded-lg p-4">
                        <h4 className="font-semibold text-cultural-ink mb-2">寓意解释</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{name.meaning}</p>
                      </div>
                      
                      {/* 评分雷达图 */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-blue-50 rounded p-2 text-center">
                          <div className="font-medium text-blue-700">三才五格</div>
                          <div className="text-blue-600 font-bold">{name.analysis.sancai}分</div>
                        </div>
                        <div className="bg-green-50 rounded p-2 text-center">
                          <div className="font-medium text-green-700">五行平衡</div>
                          <div className="text-green-600 font-bold">{name.analysis.wuxing}分</div>
                        </div>
                        <div className="bg-purple-50 rounded p-2 text-center">
                          <div className="font-medium text-purple-700">音韵美感</div>
                          <div className="text-purple-600 font-bold">{name.analysis.phonetic}分</div>
                        </div>
                        <div className="bg-yellow-50 rounded p-2 text-center">
                          <div className="font-medium text-yellow-700">文化底蕴</div>
                          <div className="text-yellow-600 font-bold">{name.analysis.cultural}分</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-6">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedName(name);
                          }}
                        >
                          📊 详细分析
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            // 下载功能
                            const content = `
姓名：${name.fullName}
综合评分：${name.score}分
寓意：${name.meaning}

详细评分：
- 三才五格：${name.analysis.sancai}分
- 五行平衡：${name.analysis.wuxing}分  
- 音韵美感：${name.analysis.phonetic}分
- 文化底蕴：${name.analysis.cultural}分
- 寓意内涵：${name.analysis.meaning}分
- 生肖契合：${name.analysis.zodiac}分

生成时间：${new Date().toLocaleString()}
                            `.trim();
                            
                            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${name.fullName}_取名分析报告.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          📥 下载
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* 名字详细分析弹窗 */}
              {selectedName && (
                <Card variant="cultural" padding="lg" className="mb-8 border-2 border-cultural-gold">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-cultural-ink">
                      📊 {selectedName.fullName} 详细分析报告
                    </h3>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedName(null)}
                    >
                      ✕ 关闭
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-cultural-ink mb-4">基本信息</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">完整姓名：</span>
                          <span className="font-semibold">{selectedName.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">综合评分：</span>
                          <span className="font-bold text-cultural-jade">{selectedName.score}分</span>
                        </div>
                        <div className="mt-4">
                          <span className="text-gray-600">寓意解释：</span>
                          <p className="mt-2 text-gray-800 leading-relaxed">{selectedName.meaning}</p>
                        </div>
                      </div>
        </div>

                    <div>
                      <h4 className="text-lg font-semibold text-cultural-ink mb-4">各维度评分</h4>
                      <div className="space-y-3">
                        {Object.entries(selectedName.analysis).map(([key, score]) => {
                          const labels: Record<string, string> = {
                            sancai: '三才五格',
                            wuxing: '五行平衡',
                            phonetic: '音韵美感',
                            meaning: '寓意内涵',
                            cultural: '文化底蕴',
                            zodiac: '生肖契合'
                          };
                          
                          return (
                            <div key={key} className="flex items-center space-x-4">
                              <span className="w-20 text-sm text-gray-600">{labels[key]}：</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-cultural-jade to-cultural-gold h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${Number(score)}%` }}
                                ></div>
                              </div>
                              <span className="w-12 text-sm font-semibold text-cultural-jade">{Number(score)}分</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* 插件执行过程展示（可展开） */}
        {showProcess && pluginResults.length > 0 && (
          <section className="py-16 bg-cultural-paper">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-heading text-cultural-ink mb-4">
                  🔍 插件执行过程
                </h2>
                <p className="text-gray-600">
                  详细展示6层插件系统的分析过程
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* 左侧：层级概览 */}
                <div className="lg:col-span-1">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-cultural-ink mb-4">执行层级概览</h3>
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
                  </Card>
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
                      <div className="space-y-4">
                        <div>
                          <span className="font-medium">插件ID:</span>
                          <span className="ml-2 text-gray-700">{plugin.pluginId}</span>
                        </div>
                        <div>
                          <span className="font-medium">状态:</span>
                          <span className="ml-2 text-gray-700">{plugin.status}</span>
                        </div>
                        {plugin.confidence && (
                          <div>
                            <span className="font-medium">置信度:</span>
                            <span className="ml-2 text-gray-700">{(plugin.confidence * 100).toFixed(1)}%</span>
                          </div>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedPlugin(null)}
                        >
                          关闭详情
                        </Button>
                      </div>
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
            </div>
          </section>
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
    </Layout>
  );
}
