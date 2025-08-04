import React, { useState } from 'react';

interface PhoneticFilteringPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhoneticFilteringPopup: React.FC<PhoneticFilteringPopupProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'algorithm' | 'scoring' | 'examples'>('algorithm');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">🎵 音韵美感筛选原理</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-indigo-100">深入理解声调分析与音律和谐度计算机制</p>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'algorithm'
                ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('algorithm')}
          >
            🔬 分析算法
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'scoring'
                ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('scoring')}
          >
            📊 评分体系
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'examples'
                ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('examples')}
          >
            🎯 实例分析
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'algorithm' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">🔬 声调分析算法详解</h3>
                <p className="text-gray-600 mb-4">
                  系统基于GSC拼音数据库，实现精确的声调分析和音韵和谐度计算。
                </p>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-3">📚 数据源与基础</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                        <div className="font-bold text-blue-700 mb-1">GSC拼音字典</div>
                        <div className="text-gray-600">
                          • 包含7万+汉字的准确拼音<br/>
                          • 标准普通话读音规范<br/>
                          • 声调、声母、韵母完整信息
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border-l-4 border-indigo-400">
                        <div className="font-bold text-indigo-700 mb-1">算法核心</div>
                        <div className="text-gray-600">
                          • 实时拼音解析与提取<br/>
                          • 多维度音韵特征分析<br/>
                          • 智能和谐度量化计算
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-3">🔄 四步分析流程</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                        <div>
                          <div className="font-medium text-emerald-700">拼音提取 (Pinyin Extraction)</div>
                          <div className="text-sm text-gray-600">从GSC字典获取每个汉字的标准拼音</div>
                          <div className="bg-white p-2 mt-1 rounded font-mono text-xs">
                            getPinyin("浩") → "hào" [声母: h, 韵母: ào, 声调: 4]
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                        <div>
                          <div className="font-medium text-emerald-700">声调分析 (Tone Analysis)</div>
                          <div className="text-sm text-gray-600">识别四声调模式，分析平仄属性</div>
                          <div className="bg-white p-2 mt-1 rounded text-xs">
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <span className="bg-blue-100 p-1 rounded">一声(平)</span>
                              <span className="bg-green-100 p-1 rounded">二声(平)</span>
                              <span className="bg-orange-100 p-1 rounded">三声(仄)</span>
                              <span className="bg-red-100 p-1 rounded">四声(仄)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                        <div>
                          <div className="font-medium text-emerald-700">模式识别 (Pattern Recognition)</div>
                          <div className="text-sm text-gray-600">分析声调组合模式，评估音律节奏</div>
                          <div className="bg-white p-2 mt-1 rounded font-mono text-xs">
                            analyzePattern("王浩然") → "2-4-2" (平仄平) → 优秀模式
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                        <div>
                          <div className="font-medium text-emerald-700">和谐度计算 (Harmony Calculation)</div>
                          <div className="text-sm text-gray-600">综合评估音韵搭配的协调性和美感</div>
                          <div className="bg-white p-2 mt-1 rounded font-mono text-xs">
                            harmony = toneVariety×0.4 + rhythmBalance×0.3 + phoneticFlow×0.3
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-3">⚙️ 核心算法实现</h4>
                    <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <div className="text-gray-600 mb-2">// 音韵和谐度计算核心算法</div>
                      <div className="text-purple-600">function calculatePhoneticHarmony(fullName: string) {`{`}</div>
                      <div className="text-blue-600 ml-2">// 1. 拼音提取</div>
                      <div className="text-green-600 ml-2">const pinyinData = extractPinyin(fullName);</div>
                      <div className="text-blue-600 ml-2">// 2. 声调分析</div>
                      <div className="text-green-600 ml-2">const tones = analyzeTones(pinyinData);</div>
                      <div className="text-blue-600 ml-2">// 3. 音律计算</div>
                      <div className="text-green-600 ml-2">const variety = calculateToneVariety(tones);</div>
                      <div className="text-green-600 ml-2">const balance = calculateRhythmBalance(tones);</div>
                      <div className="text-green-600 ml-2">const flow = calculatePhoneticFlow(pinyinData);</div>
                      <div className="text-blue-600 ml-2">// 4. 综合评分</div>
                      <div className="text-red-600 ml-2">return variety * 0.4 + balance * 0.3 + flow * 0.3;</div>
                      <div className="text-purple-600">{`}`}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scoring' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">📊 音韵评分体系</h3>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-cyan-800 mb-3">🎯 三维评分模型</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border-t-4 border-blue-400">
                      <div className="font-bold text-blue-700 mb-2">声调多样性 (40%)</div>
                      <div className="text-sm text-gray-600 mb-2">Tone Variety Score</div>
                      <div className="space-y-1 text-xs">
                        <div>• 四声调组合：100分</div>
                        <div>• 三声调组合：85分</div>
                        <div>• 二声调组合：70分</div>
                        <div>• 单声调组合：30分</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border-t-4 border-green-400">
                      <div className="font-bold text-green-700 mb-2">节奏平衡 (30%)</div>
                      <div className="text-sm text-gray-600 mb-2">Rhythm Balance Score</div>
                      <div className="space-y-1 text-xs">
                        <div>• 平仄相间：100分</div>
                        <div>• 平仄平/仄平仄：90分</div>
                        <div>• 其他组合：60-80分</div>
                        <div>• 单调模式：40分</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border-t-4 border-purple-400">
                      <div className="font-bold text-purple-700 mb-2">语音流畅 (30%)</div>
                      <div className="text-sm text-gray-600 mb-2">Phonetic Flow Score</div>
                      <div className="space-y-1 text-xs">
                        <div>• 声母韵母和谐：100分</div>
                        <div>• 避免拗口组合：90分</div>
                        <div>• 流畅易读：80分</div>
                        <div>• 一般流畅：60分</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-orange-800 mb-3">🏆 综合评级标准</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-green-500">
                      <div>
                        <div className="font-bold text-green-700">90-100分：音韵极佳</div>
                        <div className="text-sm text-gray-600">声调丰富，节奏完美，朗朗上口</div>
                      </div>
                      <div className="text-2xl">🌟</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-blue-500">
                      <div>
                        <div className="font-bold text-blue-700">80-89分：音韵优良</div>
                        <div className="text-sm text-gray-600">搭配和谐，音律优美，易于记忆</div>
                      </div>
                      <div className="text-2xl">⭐</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-yellow-500">
                      <div>
                        <div className="font-bold text-yellow-700">70-79分：音韵良好</div>
                        <div className="text-sm text-gray-600">基本和谐，读音清晰，可以接受</div>
                      </div>
                      <div className="text-2xl">✨</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-orange-500">
                      <div>
                        <div className="font-bold text-orange-700">60-69分：音韵一般</div>
                        <div className="text-sm text-gray-600">略显单调，建议进一步优化</div>
                      </div>
                      <div className="text-2xl">💫</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-red-500">
                      <div>
                        <div className="font-bold text-red-700">低于60分：需要改进</div>
                        <div className="text-sm text-gray-600">音韵欠佳，建议重新选择组合</div>
                      </div>
                      <div className="text-2xl">⚠️</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-3">📈 评分权重说明</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded">
                      <div className="font-bold text-indigo-700 mb-2">权重设计理念</div>
                      <div className="text-gray-600 space-y-1">
                        <div>• <strong>声调多样性40%</strong>：音韵丰富度最重要</div>
                        <div>• <strong>节奏平衡30%</strong>：传统平仄美学</div>
                        <div>• <strong>语音流畅30%</strong>：现代实用性考量</div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-bold text-indigo-700 mb-2">动态调整机制</div>
                      <div className="text-gray-600 space-y-1">
                        <div>• 根据用户反馈优化权重</div>
                        <div>• 考虑地域语音差异</div>
                        <div>• 适应现代审美趋势</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">🎯 音韵分析实例对比</h3>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-emerald-800 mb-3">🌟 高分案例："李诗涵"</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="font-bold text-lg text-emerald-700 mb-3">基础信息</div>
                      <div className="space-y-2 text-sm">
                        <div><strong>拼音：</strong>lǐ shī hán</div>
                        <div><strong>声调：</strong>3-1-2 (仄平平)</div>
                        <div><strong>音律模式：</strong>仄平平</div>
                        <div><strong>综合评分：</strong><span className="text-green-600 font-bold">92分</span></div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="font-bold text-lg text-emerald-700 mb-3">详细分析</div>
                      <div className="space-y-2 text-sm">
                        <div>🎵 <strong>声调多样性：</strong>95分 (三声调丰富)</div>
                        <div>⚖️ <strong>节奏平衡：</strong>90分 (仄平平经典)</div>
                        <div>🌊 <strong>语音流畅：</strong>90分 (读音顺畅)</div>
                        <div>💡 <strong>优化建议：</strong>音韵搭配极佳，无需调整</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-indigo-800 mb-3">⭐ 良好案例："王浩然"</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="font-bold text-lg text-indigo-700 mb-3">基础信息</div>
                      <div className="space-y-2 text-sm">
                        <div><strong>拼音：</strong>wáng hào rán</div>
                        <div><strong>声调：</strong>2-4-2 (平仄平)</div>
                        <div><strong>音律模式：</strong>平仄平</div>
                        <div><strong>综合评分：</strong><span className="text-blue-600 font-bold">85分</span></div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="font-bold text-lg text-indigo-700 mb-3">详细分析</div>
                      <div className="space-y-2 text-sm">
                        <div>🎵 <strong>声调多样性：</strong>85分 (二四二组合)</div>
                        <div>⚖️ <strong>节奏平衡：</strong>90分 (平仄平优秀)</div>
                        <div>🌊 <strong>语音流畅：</strong>80分 (略有重音)</div>
                        <div>💡 <strong>优化建议：</strong>整体协调，可考虑其他韵母</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-red-800 mb-3">⚠️ 改进案例："李力立"</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="font-bold text-lg text-red-700 mb-3">基础信息</div>
                      <div className="space-y-2 text-sm">
                        <div><strong>拼音：</strong>lǐ lì lì</div>
                        <div><strong>声调：</strong>3-4-4 (仄仄仄)</div>
                        <div><strong>音律模式：</strong>仄仄仄</div>
                        <div><strong>综合评分：</strong><span className="text-red-600 font-bold">45分</span></div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="font-bold text-lg text-red-700 mb-3">问题分析</div>
                      <div className="space-y-2 text-sm">
                        <div>🎵 <strong>声调多样性：</strong>40分 (仅两种声调)</div>
                        <div>⚖️ <strong>节奏平衡：</strong>30分 (连续仄声)</div>
                        <div>🌊 <strong>语音流畅：</strong>65分 (发音较硬)</div>
                        <div>💡 <strong>优化建议：</strong>建议改为"李力华"(3-4-2)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-3">📊 系统输出示例</h4>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                    <div className="text-gray-600 mb-2">// 音韵分析结果JSON示例</div>
                    <div className="text-purple-600">{`{`}</div>
                    <div className="ml-2 text-blue-600">"name": "李诗涵",</div>
                    <div className="ml-2 text-green-600">"phonetics": {`{`}</div>
                    <div className="ml-4 text-red-600">"harmony": 92,</div>
                    <div className="ml-4 text-orange-600">"tonePattern": "3-1-2",</div>
                    <div className="ml-4 text-pink-600">"rhythmType": "仄平平",</div>
                    <div className="ml-4 text-indigo-600">"toneVariety": 95,</div>
                    <div className="ml-4 text-cyan-600">"rhythmBalance": 90,</div>
                    <div className="ml-4 text-purple-600">"phoneticFlow": 90,</div>
                    <div className="ml-4 text-gray-600">"suggestions": ["音韵搭配极佳", "朗朗上口", "易于记忆"]</div>
                    <div className="ml-2 text-green-600">{`}`}</div>
                    <div className="text-purple-600">{`}`}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              🎵 传统音韵美学与现代算法分析的完美结合
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              知道了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneticFilteringPopup;