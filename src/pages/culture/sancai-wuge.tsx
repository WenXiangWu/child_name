import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

const SancaiWugePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'formulas' | 'analysis' | 'examples'>('formulas');

  return (
    <Layout>
      <Head>
        <title>三才五格计算原理 - 宝宝取名专家</title>
        <meta name="description" content="深入理解姓名学数理计算的科学原理，掌握三才五格的完整计算流程。" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        {/* 导航面包屑 */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-800">首页</Link>
              <span>›</span>
              <Link href="/#culture" className="hover:text-gray-800">传统文化</Link>
              <span>›</span>
              <span className="text-gray-800 font-medium">三才五格计算原理</span>
            </div>
          </div>
        </div>

        {/* 页面头部 */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">🔢 三才五格计算原理</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              深入理解姓名学数理计算的科学原理，透视算法的技术实现过程
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
                  activeTab === 'formulas'
                    ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('formulas')}
              >
                📐 计算公式
              </button>
              <button
                className={`px-8 py-4 font-medium transition-all ${
                  activeTab === 'analysis'
                    ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('analysis')}
              >
                🔍 算法分析
              </button>
              <button
                className={`px-8 py-4 font-medium transition-all ${
                  activeTab === 'examples'
                    ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('examples')}
              >
                💡 实战案例
              </button>
            </div>

            {/* 内容区域 */}
            <div className="p-8">
              {activeTab === 'formulas' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">📏 五格计算公式体系</h2>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-4">🧮 核心公式</h3>
                      <div className="space-y-4 font-mono text-sm">
                        <div className="bg-white p-4 rounded border-l-4 border-blue-400">
                          <div className="font-bold text-blue-700 mb-2">天格 = 姓氏笔画 + 1</div>
                          <div className="text-gray-600">代表祖运，由祖先传承而来</div>
                        </div>
                        <div className="bg-white p-4 rounded border-l-4 border-green-400">
                          <div className="font-bold text-green-700 mb-2">人格 = 姓氏笔画 + 名首字笔画</div>
                          <div className="text-gray-600">代表主运，影响人格特质</div>
                        </div>
                        <div className="bg-white p-4 rounded border-l-4 border-yellow-400">
                          <div className="font-bold text-yellow-700 mb-2">地格 = 名首字笔画 + 名次字笔画</div>
                          <div className="text-gray-600">代表前运，影响青年时期</div>
                        </div>
                        <div className="bg-white p-4 rounded border-l-4 border-purple-400">
                          <div className="font-bold text-purple-700 mb-2">总格 = 所有笔画数之和</div>
                          <div className="text-gray-600">代表后运，影响中晚年运势</div>
                        </div>
                        <div className="bg-white p-4 rounded border-l-4 border-red-400">
                          <div className="font-bold text-red-700 mb-2">外格 = 总格 - 人格 + 1</div>
                          <div className="text-gray-600">代表副运，影响社交和外缘</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800 mb-4">🎨 数字五行对应</h3>
                      <div className="grid grid-cols-5 gap-4 text-center text-sm">
                        <div className="bg-green-100 p-4 rounded-lg">
                          <div className="font-bold text-green-700">1, 2</div>
                          <div className="text-green-600 text-lg mb-1">木</div>
                          <div className="text-xs text-green-500">生长、仁慈</div>
                        </div>
                        <div className="bg-red-100 p-4 rounded-lg">
                          <div className="font-bold text-red-700">3, 4</div>
                          <div className="text-red-600 text-lg mb-1">火</div>
                          <div className="text-xs text-red-500">热情、礼貌</div>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg">
                          <div className="font-bold text-yellow-700">5, 6</div>
                          <div className="text-yellow-600 text-lg mb-1">土</div>
                          <div className="text-xs text-yellow-500">稳重、诚信</div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                          <div className="font-bold text-gray-700">7, 8</div>
                          <div className="text-gray-600 text-lg mb-1">金</div>
                          <div className="text-xs text-gray-500">刚强、义气</div>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-lg">
                          <div className="font-bold text-blue-700">9, 0</div>
                          <div className="text-blue-600 text-lg mb-1">水</div>
                          <div className="text-xs text-blue-500">智慧、包容</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">🔍 步骤5算法深度分析</h2>
                    
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold text-cyan-800 mb-4">⚙️ 候选字筛选流程</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-cyan-200 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <div>
                            <div className="font-medium text-gray-800 mb-1">按笔画和五行获取候选字</div>
                            <div className="text-sm text-gray-600">从字典中精确匹配指定笔画数和五行属性的汉字</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-cyan-200 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <div>
                            <div className="font-medium text-gray-800 mb-1">常用字过滤</div>
                            <div className="text-sm text-gray-600">基于12万人名语料库提取的常用字集合进行筛选</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-cyan-200 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <div>
                            <div className="font-medium text-gray-800 mb-1">有效组合计算</div>
                            <div className="text-sm text-gray-600">中间字候选数 × 最后字候选数 = 总组合数</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-emerald-800 mb-4">📊 性能优化策略</h3>
                        <div className="space-y-3 text-sm text-emerald-700">
                          <div>• <strong>分批处理</strong>：仅分析前5种最优组合</div>
                          <div>• <strong>异步查询</strong>：候选字检索并行处理</div>
                          <div>• <strong>内存缓存</strong>：常用字集合预加载</div>
                          <div>• <strong>精确统计</strong>：实时计算组合数量</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-red-800 mb-4">🎯 质量保证机制</h3>
                        <div className="space-y-3 text-sm text-red-700">
                          <div>• <strong>五重筛选</strong>：笔画+五行+常用+繁简+组合</div>
                          <div>• <strong>数据验证</strong>：输入参数完整性检查</div>
                          <div>• <strong>异常处理</strong>：完善的错误恢复机制</div>
                          <div>• <strong>结果排序</strong>：按吉凶程度优先推荐</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-orange-800 mb-4">⚡ 计算复杂度分析</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg">
                          <div className="font-bold text-orange-700 mb-3">时间复杂度</div>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div>单组合：O(C + S)</div>
                            <div>总体：O(5 × (C + S))</div>
                            <div className="text-xs text-gray-500 mt-2">C=候选字查询, S=三才计算</div>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <div className="font-bold text-orange-700 mb-3">实际性能</div>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div>步骤5耗时：15-25ms</div>
                            <div>候选字查询：8-12ms</div>
                            <div className="text-xs text-gray-500 mt-2">基于生产环境监控数据</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'examples' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">💡 "王浩然"完整计算实例</h2>
                    
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-4">📝 基础数据</h3>
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div className="bg-white p-4 rounded-lg border-2 border-indigo-200">
                          <div className="font-bold text-indigo-700 text-lg">王</div>
                          <div className="text-sm text-gray-600">4画</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-2 border-indigo-200">
                          <div className="font-bold text-indigo-700 text-lg">浩</div>
                          <div className="text-sm text-gray-600">11画 (水)</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-2 border-indigo-200">
                          <div className="font-bold text-indigo-700 text-lg">然</div>
                          <div className="text-sm text-gray-600">12画 (金)</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold text-green-800 mb-4">🧮 五格计算过程</h3>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
                          <div className="font-bold text-blue-700 mb-1">天格 = 4 + 1 = 5 → 土</div>
                          <div className="text-sm text-gray-600">代表祖运，稳重踏实的家族基因</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-l-4 border-green-400">
                          <div className="font-bold text-green-700 mb-1">人格 = 4 + 11 = 15 → 土</div>
                          <div className="text-sm text-gray-600">代表主运，稳健的人格特质</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-400">
                          <div className="font-bold text-yellow-700 mb-1">地格 = 11 + 12 = 23 → 火</div>
                          <div className="text-sm text-gray-600">代表前运，充满活力的青年时期</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-l-4 border-purple-400">
                          <div className="font-bold text-purple-700 mb-1">总格 = 4 + 11 + 12 = 27 → 金</div>
                          <div className="text-sm text-gray-600">代表后运，坚韧的中晚年运势</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-l-4 border-red-400">
                          <div className="font-bold text-red-700 mb-1">外格 = 27 - 15 + 1 = 13 → 火</div>
                          <div className="text-sm text-gray-600">代表副运，热情的社交能力</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold text-orange-800 mb-4">🎯 三才分析结果</h3>
                      <div className="bg-white p-6 rounded-lg border-2 border-orange-200">
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-orange-700">土 - 土 - 火</div>
                          <div className="text-sm text-gray-600">天才 - 人才 - 地才</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <div className="font-bold text-yellow-700">稳固基础</div>
                            <div className="text-yellow-600">土性稳重踏实</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="font-bold text-red-700">向上发展</div>
                            <div className="text-red-600">火土相生</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="font-bold text-orange-700">事业兴旺</div>
                            <div className="text-orange-600">能量充沛</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800 mb-4">📈 算法输出数据示例</h3>
                      <div className="bg-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                        <div className="text-gray-600 mb-2">// 步骤5输出的详细分析对象</div>
                        <div className="text-purple-600">{`{`}</div>
                        <div className="ml-2 text-blue-600">rank: 1,</div>
                        <div className="ml-2 text-green-600">combination: {`{`} mid: 11, last: 12 {`}`},</div>
                        <div className="ml-2 text-red-600">grids: {`{`} tiange: 5, renge: 15, dige: 23, zongge: 27, waige: 13 {`}`},</div>
                        <div className="ml-2 text-yellow-600">sancai: {`{`} heaven: "土", human: "土", earth: "火", level: "吉" {`}`},</div>
                        <div className="ml-2 text-pink-600">midCandidates: {`{`} total: 156, common: 23, samples: ["浩","海","淮"...] {`}`},</div>
                        <div className="ml-2 text-indigo-600">validCombinations: 45</div>
                        <div className="text-purple-600">{`}`}</div>
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
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              ← 返回首页
            </Link>
          </div>
        </div>

        {/* 页面底部 */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-sm text-gray-600">
              🎓 传统姓名学与现代计算技术的完美融合
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SancaiWugePage;