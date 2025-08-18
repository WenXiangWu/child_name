/**
 * 插件系统演示页面 - 展示完整的插件执行过程
 */

import React, { useState } from 'react';
import { NextPage } from 'next';
import Layout from '../components/Layout';

interface PluginExecutionStep {
  id: string;
  layer: number;
  pluginId: string;
  name: string;
  input: any;
  output: any;
  processingTime: number;
  confidence: number;
  description: string;
  details: {
    purpose: string;
    algorithm: string;
    dataSource: string;
    keyMetrics: Record<string, any>;
  };
}

interface LayerInfo {
  layer: number;
  name: string;
  description: string;
  purpose: string;
  plugins: string[];
}

const layerInfo: LayerInfo[] = [
  {
    layer: 1,
    name: "基础信息层",
    description: "处理用户输入的基本信息，为后续分析提供基础数据",
    purpose: "数据预处理和标准化",
    plugins: ["surname", "gender", "birth-time"]
  },
  {
    layer: 2,
    name: "命理基础层", 
    description: "基于传统命理学进行基础分析",
    purpose: "命理要素分析",
    plugins: ["zodiac", "xiyongshen", "bazi"]
  },
  {
    layer: 3,
    name: "字符评估层",
    description: "生成和评估候选字符",
    purpose: "字符候选和筛选",
    plugins: ["stroke", "wuxing-char", "meaning", "phonetic"]
  },
  {
    layer: 4,
    name: "组合计算层",
    description: "智能组合字符生成最终名字",
    purpose: "名字生成和评分",
    plugins: ["name-generation"]
  }
];

const PluginSystemDemo: NextPage = () => {
  const [familyName, setFamilyName] = useState('吴');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [executionSteps, setExecutionSteps] = useState<PluginExecutionStep[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);

  const executePluginSystem = async () => {
    setIsExecuting(true);
    setCurrentStep(0);
    setExecutionSteps([]);

    try {
      const response = await fetch('/api/generate-names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          familyName,
          gender,
          usePluginSystem: true,
          enableDetailedLogs: true,
          limit: 3
        }),
      });

      const result = await response.json();
      
      if (result.executionLogs) {
        const steps = parseExecutionLogs(result.executionLogs);
        setExecutionSteps(steps);
      }
    } catch (error) {
      console.error('插件系统执行失败:', error);
    } finally {
      setIsExecuting(false);
      setCurrentStep(-1);
    }
  };

  const parseExecutionLogs = (logs: any[]): PluginExecutionStep[] => {
    const steps: PluginExecutionStep[] = [];
    const pluginResults: Record<string, any> = {};
    
    logs.forEach((log, index) => {
      if (log.pluginId && log.message.includes('✅ 插件执行成功')) {
        const layer = getPluginLayer(log.pluginId);
        const pluginInfo = getPluginInfo(log.pluginId);
        
        steps.push({
          id: `${log.pluginId}-${index}`,
          layer,
          pluginId: log.pluginId,
          name: pluginInfo.name,
          input: pluginResults[log.pluginId]?.input || { familyName, gender },
          output: log.data || {},
          processingTime: log.processingTime || 0,
          confidence: log.data?.confidence || 0,
          description: pluginInfo.description,
          details: pluginInfo.details
        });
      }
    });

    return steps;
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

  const getPluginInfo = (pluginId: string) => {
    const pluginInfoMap: Record<string, any> = {
      'surname': {
        name: '姓氏分析插件',
        description: '分析姓氏的笔画、五行属性和百家姓排名',
        details: {
          purpose: '为名字生成提供姓氏基础信息',
          algorithm: '康熙字典笔画计算 + 五行推导',
          dataSource: '百家姓数据库 + 汉字属性库',
          keyMetrics: ['笔画数', '五行属性', '百家姓排名', '常用程度']
        }
      },
      'gender': {
        name: '性别常用字插件',
        description: '根据性别提供常用字符集合',
        details: {
          purpose: '为不同性别提供合适的字符候选',
          algorithm: '大数据统计分析 + 文化传统',
          dataSource: '67万+真实姓名数据统计',
          keyMetrics: ['男性常用字1683个', '女性常用字1372个', '使用频率', '文化适应性']
        }
      },
      'stroke': {
        name: '笔画组合生成插件',
        description: '基于三才五格理论计算最佳笔画组合',
        details: {
          purpose: '生成符合传统命理的笔画组合',
          algorithm: '三才五格算法 + 吉凶判断',
          dataSource: '康熙字典 + 三才五格规则库',
          keyMetrics: ['笔画组合数', '三才配置', '五格评分', '吉凶等级']
        }
      },
      'wuxing-char': {
        name: '五行字符分析插件', 
        description: '根据五行需求生成候选字符',
        details: {
          purpose: '提供符合五行要求的字符候选',
          algorithm: '五行相生相克理论 + 字符属性匹配',
          dataSource: '汉字五行属性数据库',
          keyMetrics: ['五行元素匹配', '相生相克关系', '平衡度', '适宜度']
        }
      },
      'meaning': {
        name: '寓意分析插件',
        description: '分析字符寓意和文化内涵',
        details: {
          purpose: '确保名字具有积极正面的寓意',
          algorithm: '语义分析 + 文化传统评估',
          dataSource: '汉字寓意数据库 + 文化典籍',
          keyMetrics: ['寓意分类', '文化深度', '现代适用性', '性别适应性']
        }
      },
      'phonetic': {
        name: '音韵美感插件',
        description: '分析名字的音韵和谐度',
        details: {
          purpose: '确保名字读音优美和谐',
          algorithm: '拼音分析 + 音韵规律',
          dataSource: '汉字拼音数据库 + 音韵规则',
          keyMetrics: ['声调搭配', '音韵和谐', '避免谐音', '朗朗上口']
        }
      },
      'xiyongshen': {
        name: '五行喜用神插件',
        description: '分析八字五行需求和喜用神',
        details: {
          purpose: '确定五行补益方向',
          algorithm: '八字分析 + 五行平衡理论',
          dataSource: '传统命理规则',
          keyMetrics: ['喜用神元素', '忌神元素', '五行平衡', '补益策略']
        }
      },
      'name-generation': {
        name: '智能名字生成插件',
        description: '综合所有分析结果，智能生成最优名字',
        details: {
          purpose: '生成综合评分最高的名字组合',
          algorithm: '多因子综合评分 + 智能筛选',
          dataSource: '前层插件分析结果',
          keyMetrics: ['综合评分', '各维度权重', '候选数量', '筛选标准']
        }
      }
    };
    return pluginInfoMap[pluginId] || { name: pluginId, description: '未知插件', details: {} };
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            插件化取名系统演示
          </h1>
          <p className="text-gray-600 mb-6">
            展示完整的插件执行过程，包括每一层级每个插件的功能、处理内容、输入输出和分析过程
          </p>

          {/* 输入控制 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">输入参数</h3>
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓氏
                </label>
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  性别
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={executePluginSystem}
                  disabled={isExecuting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isExecuting ? '执行中...' : '执行插件系统'}
                </button>
              </div>
            </div>
          </div>

          {/* 层级概览 */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">插件系统架构</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {layerInfo.map((layer) => (
                <div
                  key={layer.layer}
                  className={`border rounded-lg p-4 ${
                    layer.layer === 1 ? 'border-blue-200 bg-blue-50' :
                    layer.layer === 2 ? 'border-orange-200 bg-orange-50' :
                    layer.layer === 3 ? 'border-purple-200 bg-purple-50' :
                    'border-green-200 bg-green-50'
                  }`}
                >
                  <h4 className="font-semibold text-lg mb-2">
                    Layer {layer.layer}: {layer.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">{layer.description}</p>
                  <div className="text-xs">
                    <div className="font-medium mb-1">包含插件:</div>
                    <div className="space-y-1">
                      {layer.plugins.map((plugin) => (
                        <div key={plugin} className="bg-white px-2 py-1 rounded">
                          {getPluginInfo(plugin).name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 执行步骤详细展示 */}
          {executionSteps.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">详细执行过程</h3>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((layerNum) => {
                  const layerSteps = executionSteps.filter(step => step.layer === layerNum);
                  if (layerSteps.length === 0) return null;

                  return (
                    <div key={layerNum} className="border rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <span className={`inline-block w-8 h-8 rounded-full text-white text-center leading-8 mr-3 ${
                          layerNum === 1 ? 'bg-blue-500' :
                          layerNum === 2 ? 'bg-orange-500' :
                          layerNum === 3 ? 'bg-purple-500' :
                          'bg-green-500'
                        }`}>
                          {layerNum}
                        </span>
                        Layer {layerNum}: {layerInfo[layerNum - 1].name}
                      </h4>
                      
                      <div className="space-y-4">
                        {layerSteps.map((step, stepIndex) => (
                          <div key={step.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-semibold text-lg">{step.name}</h5>
                                <p className="text-gray-600 text-sm">{step.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  置信度: {Math.round(step.confidence * 100)}%
                                </div>
                                <div className="text-xs text-gray-400">
                                  耗时: {step.processingTime}ms
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              {/* 插件详情 */}
                              <div className="bg-white rounded p-3">
                                <h6 className="font-medium mb-2">插件功能</h6>
                                <div className="text-sm space-y-1">
                                  <div><strong>目的:</strong> {step.details.purpose}</div>
                                  <div><strong>算法:</strong> {step.details.algorithm}</div>
                                  <div><strong>数据源:</strong> {step.details.dataSource}</div>
                                </div>
                              </div>

                              {/* 输入数据 */}
                              <div className="bg-white rounded p-3">
                                <h6 className="font-medium mb-2">输入数据</h6>
                                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                                  {JSON.stringify(step.input, null, 2)}
                                </pre>
                              </div>

                              {/* 输出结果 */}
                              <div className="bg-white rounded p-3">
                                <h6 className="font-medium mb-2">输出结果</h6>
                                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                                  {JSON.stringify(step.output, null, 2)}
                                </pre>
                              </div>
                            </div>

                            {/* 关键指标 */}
                            <div className="mt-3 bg-white rounded p-3">
                              <h6 className="font-medium mb-2">关键指标</h6>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                {Object.entries(step.details.keyMetrics || {}).map(([key, value]) => (
                                  <div key={key} className="bg-gray-100 px-2 py-1 rounded">
                                    <strong>{key}:</strong> {value}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PluginSystemDemo;