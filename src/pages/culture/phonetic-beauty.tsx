import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

const PhoneticBeautyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'theory' | 'analysis' | 'examples'>('theory');

  return (
    <Layout>
      <Head>
        <title>音韵美感分析 - 宝宝取名专家</title>
        <meta name="description" content="分析声调搭配，确保名字读音优美和谐，朗朗上口，富有音律美感。" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
        {/* 导航面包屑 */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-800">首页</Link>
              <span>›</span>
              <Link href="/#culture" className="hover:text-gray-800">传统文化</Link>
              <span>›</span>
              <span className="text-gray-800 font-medium">音韵美感分析</span>
            </div>
          </div>
        </div>

        {/* 页面头部 */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">🎵 音韵美感分析</h1>
            <p className="text-xl text-rose-100 max-w-2xl mx-auto">
              分析声调搭配，确保名字读音优美和谐，朗朗上口，富有音律美感
            </p>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* 标签导航 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-8 py-4 font-medium transition-all ${
                  activeTab === 'theory'
                    ? 'border-b-2 border-rose-500 text-rose-600 bg-rose-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('theory')}
              >
                🎼 音韵理论
              </button>
              <button
                className={`px-8 py-4 font-medium transition-all ${
                  activeTab === 'analysis'
                    ? 'border-b-2 border-rose-500 text-rose-600 bg-rose-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('analysis')}
              >
                🔊 声调分析
              </button>
              <button
                className={`px-8 py-4 font-medium transition-all ${
                  activeTab === 'examples'
                    ? 'border-b-2 border-rose-500 text-rose-600 bg-rose-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('examples')}
              >
                🎯 美感案例
              </button>
            </div>

            {/* 内容区域 */}
            <div className="p-8">
              {activeTab === 'theory' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">🎼 汉语音韵美学理论</h2>
                    <p className="text-gray-600 mb-6 text-lg">
                      音韵美感是中华文化的重要组成部分，通过声调、声母、韵母的巧妙搭配，创造出朗朗上口的美妙音效。
                    </p>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold text-purple-800 mb-4">🎵 四声调系统</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400 text-center">
                          <div className="text-2xl font-bold text-blue-700 mb-2">一声</div>
                          <div className="text-sm text-gray-600 mb-2">阴平</div>
                          <div className="text-xs text-blue-600">高平调 ˉ</div>
                          <div className="text-sm text-gray-700 mt-2">如：妈、天、高</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-l-4 border-green-400 text-center">
                          <div className="text-2xl font-bold text-green-700 mb-2">二声</div>
                          <div className="text-sm text-gray-600 mb-2">阳平</div>
                          <div className="text-xs text-green-600">升调 ˊ</div>
                          <div className="text-sm text-gray-700 mt-2">如：麻、田、豪</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-l-4 border-orange-400 text-center">
                          <div className="text-2xl font-bold text-orange-700 mb-2">三声</div>
                          <div className="text-sm text-gray-600 mb-2">上声</div>
                          <div className="text-xs text-orange-600">降升调 ˇ</div>
                          <div className="text-sm text-gray-700 mt-2">如：马、甜、好</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-l-4 border-red-400 text-center">
                          <div className="text-2xl font-bold text-red-700 mb-2">四声</div>
                          <div className="text-sm text-gray-600 mb-2">去声</div>
                          <div className="text-xs text-red-600">降调 ˋ</div>
                          <div className="text-sm text-gray-700 mt-2">如：骂、电、号</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold text-rose-800 mb-4">🎯 平仄音律</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-bold text-pink-700 mb-3">平声特点</h4>
                          <div className="space-y-2 text-sm text-gray-700">
                            <div>• 包含：一声（阴平）、二声（阳平）</div>
                            <div>• 特征：音调舒缓平稳，读音悠长</div>
                            <div>• 效果：营造优雅安详的音韵感</div>
                            <div>• 示例：天（tiān）、和（hé）、美（měi）</div>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-bold text-rose-700 mb-3">仄声特点</h4>
                          <div className="space-y-2 text-sm text-gray-700">
                            <div>• 包含：三声（上声）、四声（去声）</div>
                            <div>• 特征：音调变化明显，读音有力</div>
                            <div>• 效果：增强节奏感和表现力</div>
                            <div>• 示例：好（hǎo）、乐（lè）、智（zhì）</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-4">🎨 音韵搭配原则</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white p-4 rounded-lg border-t-4 border-indigo-400">
                          <div className="font-bold text-indigo-700 mb-2">平仄相间</div>
                          <div className="text-gray-600">平声与仄声交替出现，形成音律起伏的美感。</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-t-4 border-purple-400">
                          <div className="font-bold text-purple-700 mb-2">避免单调</div>
                          <div className="text-gray-600">防止连续使用相同声调，保持音韵的丰富性。</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-t-4 border-pink-400">
                          <div className="font-bold text-pink-700 mb-2">朗朗上口</div>
                          <div className="text-gray-600">确保名字易读、好记，发音流畅自然。</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">🔊 声调分析算法</h2>
                    
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold text-cyan-800 mb-4">⚙️ 音韵分析流程</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-cyan-200 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <div>
                            <div className="font-medium text-gray-800 mb-1">拼音提取</div>
                            <div className="text-sm text-gray-600">从GSC拼音字典中获取每个汉字的准确拼音和声调</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-cyan-200 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <div>
                            <div className="font-medium text-gray-800 mb-1">声调分析</div>
                            <div className="text-sm text-gray-600">识别声母、韵母、声调，计算音韵和谐度</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-cyan-200 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <div>
                            <div className="font-medium text-gray-800 mb-1">平仄判定</div>
                            <div className="text-sm text-gray-600">根据声调确定平仄属性，分析音律节奏</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-cyan-200 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                          <div>
                            <div className="font-medium text-gray-800 mb-1">和谐度计算</div>
                            <div className="text-sm text-gray-600">综合评估音韵搭配的协调性和美感</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-emerald-800 mb-4">📊 和谐度算法</h3>
                        <div className="bg-white p-4 rounded border-l-4 border-emerald-400 font-mono text-sm">
                          <div className="text-gray-600 mb-2">// 音韵和谐度计算</div>
                          <div className="text-purple-600">harmony = (</div>
                          <div className="text-blue-600 ml-2">toneVariety * 0.4 +</div>
                          <div className="text-green-600 ml-2">rhythmBalance * 0.3 +</div>
                          <div className="text-orange-600 ml-2">phoneticFlow * 0.3</div>
                          <div className="text-purple-600">) * 100;</div>
                        </div>
                        <div className="mt-3 text-xs text-gray-600">
                          💡 综合考虑声调变化、节奏平衡、语音流畅度
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-red-800 mb-4">🎯 评分标准</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center p-2 bg-white rounded">
                            <span className="font-medium">90-100分</span>
                            <span className="text-green-600">音韵极佳</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded">
                            <span className="font-medium">80-89分</span>
                            <span className="text-blue-600">音韵优良</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded">
                            <span className="font-medium">70-79分</span>
                            <span className="text-yellow-600">音韵良好</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded">
                            <span className="font-medium">60-69分</span>
                            <span className="text-orange-600">音韵一般</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded">
                            <span className="font-medium">低于60分</span>
                            <span className="text-red-600">需要改进</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800 mb-4">🎼 声调模式分析</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                        <div className="bg-white p-3 rounded border-t-4 border-blue-400 text-center">
                          <div className="font-bold text-blue-700">平平仄</div>
                          <div className="text-xs text-gray-600 mt-1">优雅舒缓</div>
                          <div className="text-xs text-blue-600 mt-1">如：天美慧</div>
                        </div>
                        <div className="bg-white p-3 rounded border-t-4 border-green-400 text-center">
                          <div className="font-bold text-green-700">平仄平</div>
                          <div className="text-xs text-gray-600 mt-1">起伏有致</div>
                          <div className="text-xs text-green-600 mt-1">如：天智华</div>
                        </div>
                        <div className="bg-white p-3 rounded border-t-4 border-orange-400 text-center">
                          <div className="font-bold text-orange-700">仄平仄</div>
                          <div className="text-xs text-gray-600 mt-1">节奏感强</div>
                          <div className="text-xs text-orange-600 mt-1">如：智天乐</div>
                        </div>
                        <div className="bg-white p-3 rounded border-t-4 border-purple-400 text-center">
                          <div className="font-bold text-purple-700">仄仄平</div>
                          <div className="text-xs text-gray-600 mt-1">层次丰富</div>
                          <div className="text-xs text-purple-600 mt-1">如：智慧天</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'examples' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 音韵美感案例分析</h2>
                    
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold text-green-800 mb-4">🌟 优秀音韵案例</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg border-l-4 border-green-400">
                            <div className="font-bold text-lg text-gray-800 mb-2">李诗涵 (lǐ shī hán)</div>
                            <div className="text-sm text-gray-600 mb-2">声调：3-1-2 (仄平平)</div>
                            <div className="text-xs text-green-600">和谐度：92分</div>
                            <div className="text-sm text-gray-700 mt-2">
                              分析：仄声开头有力，后续平声舒缓，音韵层次丰富，朗朗上口。
                            </div>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
                            <div className="font-bold text-lg text-gray-800 mb-2">王雅琪 (wáng yǎ qí)</div>
                            <div className="text-sm text-gray-600 mb-2">声调：2-3-2 (平仄平)</div>
                            <div className="text-xs text-blue-600">和谐度：88分</div>
                            <div className="text-sm text-gray-700 mt-2">
                              分析：平仄平模式经典，中间仄声突出，整体音韵平衡优美。
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg border-l-4 border-purple-400">
                            <div className="font-bold text-lg text-gray-800 mb-2">陈浩然 (chén hào rán)</div>
                            <div className="text-sm text-gray-600 mb-2">声调：2-4-2 (平仄平)</div>
                            <div className="text-xs text-purple-600">和谐度：90分</div>
                            <div className="text-sm text-gray-700 mt-2">
                              分析：阳平起调温和，去声铿锵有力，阳平收尾流畅自然。
                            </div>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border-l-4 border-orange-400">
                            <div className="font-bold text-lg text-gray-800 mb-2">张梦瑶 (zhāng mèng yáo)</div>
                            <div className="text-sm text-gray-600 mb-2">声调：1-4-2 (平仄平)</div>
                            <div className="text-xs text-orange-600">和谐度：85分</div>
                            <div className="text-sm text-gray-700 mt-2">
                              分析：阴平稳重，去声转折，阳平上扬，音韵富有变化。
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold text-orange-800 mb-4">⚠️ 需要改进的案例</h3>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border-l-4 border-red-400">
                          <div className="font-bold text-lg text-gray-800 mb-2">李力立 (lǐ lì lì)</div>
                          <div className="text-sm text-gray-600 mb-2">声调：3-4-4 (仄仄仄)</div>
                          <div className="text-xs text-red-600">和谐度：45分</div>
                          <div className="text-sm text-gray-700 mt-2">
                            问题：连续仄声，缺乏音韵起伏，读音略显生硬。
                          </div>
                          <div className="text-sm text-green-700 mt-1">
                            建议：可考虑"李力华"(lǐ lì huá) 3-4-2，增加平声调节。
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-400">
                          <div className="font-bold text-lg text-gray-800 mb-2">王欢欢 (wáng huān huān)</div>
                          <div className="text-sm text-gray-600 mb-2">声调：2-1-1 (平平平)</div>
                          <div className="text-xs text-yellow-600">和谐度：52分</div>
                          <div className="text-sm text-gray-700 mt-2">
                            问题：连续平声，音韵较为单调，缺乏层次感。
                          </div>
                          <div className="text-sm text-green-700 mt-1">
                            建议：可考虑"王欢乐"(wáng huān lè) 2-1-4，增加仄声变化。
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-4">📈 音韵优化建议</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white p-4 rounded-lg border-t-4 border-indigo-400">
                          <div className="font-bold text-indigo-700 mb-2">声调搭配</div>
                          <div className="text-gray-600 space-y-1">
                            <div>• 避免三字同调</div>
                            <div>• 平仄相间最佳</div>
                            <div>• 起伏有致为美</div>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-t-4 border-purple-400">
                          <div className="font-bold text-purple-700 mb-2">语音流畅</div>
                          <div className="text-gray-600 space-y-1">
                            <div>• 声母避免相同</div>
                            <div>• 韵母富有变化</div>
                            <div>• 易读好记为准</div>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-t-4 border-pink-400">
                          <div className="font-bold text-pink-700 mb-2">文化内涵</div>
                          <div className="text-gray-600 space-y-1">
                            <div>• 结合字意美感</div>
                            <div>• 体现文化底蕴</div>
                            <div>• 音义和谐统一</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 返回首页按钮 */}
          <div className="text-center">
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              ← 返回首页
            </Link>
          </div>
        </div>

        {/* 页面底部 */}
        <div className="bg-gradient-to-r from-rose-100 to-pink-100 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-sm text-gray-600">
              🎵 传统音韵美学与现代语言分析的完美结合
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PhoneticBeautyPage;