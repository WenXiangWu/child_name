import React, { useState } from 'react';

interface SancaiCalculationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SancaiCalculationPopup: React.FC<SancaiCalculationPopupProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'formulas' | 'analysis' | 'examples'>('formulas');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">🔢 三才五格计算原理</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-orange-100">深入理解姓名学数理计算的科学原理</p>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'formulas'
                ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('formulas')}
          >
            📐 计算公式
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'analysis'
                ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('analysis')}
          >
            🔍 算法分析
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'examples'
                ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('examples')}
          >
            💡 实战案例
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'formulas' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">📏 五格计算公式体系</h3>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-indigo-800 mb-3">🧮 核心公式</h4>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                      <div className="font-bold text-blue-700 mb-1">天格 = 姓氏笔画 + 1</div>
                      <div className="text-gray-600">代表祖运，由祖先传承而来</div>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-green-400">
                      <div className="font-bold text-green-700 mb-1">人格 = 姓氏笔画 + 名首字笔画</div>
                      <div className="text-gray-600">代表主运，影响人格特质</div>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                      <div className="font-bold text-yellow-700 mb-1">地格 = 名首字笔画 + 名次字笔画</div>
                      <div className="text-gray-600">代表前运，影响青年时期</div>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                      <div className="font-bold text-purple-700 mb-1">总格 = 所有笔画数之和</div>
                      <div className="text-gray-600">代表后运，影响中晚年运势</div>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-red-400">
                      <div className="font-bold text-red-700 mb-1">外格 = 总格 - 人格 + 1</div>
                      <div className="text-gray-600">代表副运，影响社交和外缘</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-3">🎨 数字五行对应</h4>
                  <div className="grid grid-cols-5 gap-3 text-center text-sm">
                    <div className="bg-green-100 p-3 rounded">
                      <div className="font-bold text-green-700">1, 2</div>
                      <div className="text-green-600">木</div>
                      <div className="text-xs text-green-500">生长、仁慈</div>
                    </div>
                    <div className="bg-red-100 p-3 rounded">
                      <div className="font-bold text-red-700">3, 4</div>
                      <div className="text-red-600">火</div>
                      <div className="text-xs text-red-500">热情、礼貌</div>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded">
                      <div className="font-bold text-yellow-700">5, 6</div>
                      <div className="text-yellow-600">土</div>
                      <div className="text-xs text-yellow-500">稳重、诚信</div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                      <div className="font-bold text-gray-700">7, 8</div>
                      <div className="text-gray-600">金</div>
                      <div className="text-xs text-gray-500">刚强、义气</div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded">
                      <div className="font-bold text-blue-700">9, 0</div>
                      <div className="text-blue-600">水</div>
                      <div className="text-xs text-blue-500">智慧、包容</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">🔍 步骤5算法深度分析</h3>
                
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-cyan-800 mb-3">⚙️ 候选字筛选流程</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-cyan-200 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <div className="font-medium text-gray-800">按笔画和五行获取候选字</div>
                        <div className="text-sm text-gray-600">从字典中精确匹配指定笔画数和五行属性的汉字</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-cyan-200 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <div className="font-medium text-gray-800">常用字过滤</div>
                        <div className="text-sm text-gray-600">基于12万人名语料库提取的常用字集合进行筛选</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-cyan-200 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <div className="font-medium text-gray-800">有效组合计算</div>
                        <div className="text-sm text-gray-600">中间字候选数 × 最后字候选数 = 总组合数</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-3">📊 性能优化策略</h4>
                    <div className="space-y-2 text-sm text-emerald-700">
                      <div>• <strong>分批处理</strong>：仅分析前5种最优组合</div>
                      <div>• <strong>异步查询</strong>：候选字检索并行处理</div>
                      <div>• <strong>内存缓存</strong>：常用字集合预加载</div>
                      <div>• <strong>精确统计</strong>：实时计算组合数量</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-3">🎯 质量保证机制</h4>
                    <div className="space-y-2 text-sm text-red-700">
                      <div>• <strong>五重筛选</strong>：笔画+五行+常用+繁简+组合</div>
                      <div>• <strong>数据验证</strong>：输入参数完整性检查</div>
                      <div>• <strong>异常处理</strong>：完善的错误恢复机制</div>
                      <div>• <strong>结果排序</strong>：按吉凶程度优先推荐</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-3">⚡ 计算复杂度分析</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded">
                      <div className="font-bold text-orange-700 mb-2">时间复杂度</div>
                      <div className="text-sm text-gray-700">
                        <div>单组合：O(C + S)</div>
                        <div>总体：O(5 × (C + S))</div>
                        <div className="text-xs text-gray-500 mt-1">C=候选字查询, S=三才计算</div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-bold text-orange-700 mb-2">实际性能</div>
                      <div className="text-sm text-gray-700">
                        <div>步骤5耗时：15-25ms</div>
                        <div>候选字查询：8-12ms</div>
                        <div className="text-xs text-gray-500 mt-1">基于生产环境监控数据</div>
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
                <h3 className="text-xl font-bold text-gray-800 mb-3">💡 "王浩然"完整计算实例</h3>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-indigo-800 mb-3">📝 基础数据</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-3 rounded border-2 border-indigo-200">
                      <div className="font-bold text-indigo-700">王</div>
                      <div className="text-sm text-gray-600">4画</div>
                    </div>
                    <div className="bg-white p-3 rounded border-2 border-indigo-200">
                      <div className="font-bold text-indigo-700">浩</div>
                      <div className="text-sm text-gray-600">11画 (水)</div>
                    </div>
                    <div className="bg-white p-3 rounded border-2 border-indigo-200">
                      <div className="font-bold text-indigo-700">然</div>
                      <div className="text-sm text-gray-600">12画 (金)</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-green-800 mb-3">🧮 五格计算过程</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                      <div className="font-bold text-blue-700">天格 = 4 + 1 = 5 → 土</div>
                      <div className="text-sm text-gray-600">代表祖运，稳重踏实的家族基因</div>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-green-400">
                      <div className="font-bold text-green-700">人格 = 4 + 11 = 15 → 土</div>
                      <div className="text-sm text-gray-600">代表主运，稳健的人格特质</div>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                      <div className="font-bold text-yellow-700">地格 = 11 + 12 = 23 → 火</div>
                      <div className="text-sm text-gray-600">代表前运，充满活力的青年时期</div>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                      <div className="font-bold text-purple-700">总格 = 4 + 11 + 12 = 27 → 金</div>
                      <div className="text-sm text-gray-600">代表后运，坚韧的中晚年运势</div>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-red-400">
                      <div className="font-bold text-red-700">外格 = 27 - 15 + 1 = 13 → 火</div>
                      <div className="text-sm text-gray-600">代表副运，热情的社交能力</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-orange-800 mb-3">🎯 三才分析结果</h4>
                  <div className="bg-white p-4 rounded border-2 border-orange-200">
                    <div className="text-center mb-3">
                      <div className="text-2xl font-bold text-orange-700">土 - 土 - 火</div>
                      <div className="text-sm text-gray-600">天才 - 人才 - 地才</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <div className="font-bold text-yellow-700">稳固基础</div>
                        <div className="text-yellow-600">土性稳重踏实</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="font-bold text-red-700">向上发展</div>
                        <div className="text-red-600">火土相生</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <div className="font-bold text-orange-700">事业兴旺</div>
                        <div className="text-orange-600">能量充沛</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-3">📈 算法输出数据示例</h4>
                  <div className="bg-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
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

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              🎓 传统姓名学与现代计算技术的完美融合
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              知道了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SancaiCalculationPopup;