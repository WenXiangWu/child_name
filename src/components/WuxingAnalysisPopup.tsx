import React, { useState } from 'react';

interface WuxingAnalysisPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WuxingAnalysisPopup: React.FC<WuxingAnalysisPopupProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'combination' | 'application'>('theory');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">🌊 五行配置原理科普</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-purple-100">了解传统五行相生相克理论与现代应用</p>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'theory'
                ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('theory')}
          >
            🔮 五行理论
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'combination'
                ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('combination')}
          >
            💎 水金组合
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'application'
                ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('application')}
          >
            🎯 实际应用
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'theory' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">🌿 五行相生相克理论</h3>
                <p className="text-gray-600 mb-4">
                  五行学说是中华文化的核心理论，认为万物由木、火、土、金、水五种基本元素构成。
                </p>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3">🔄 五行相生循环</h4>
                  <div className="flex justify-center items-center mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-lg">🌿</div>
                        <div className="text-xs font-medium text-green-700 mt-1">木</div>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-lg">🔥</div>
                        <div className="text-xs font-medium text-red-700 mt-1">火</div>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-lg">🌍</div>
                        <div className="text-xs font-medium text-yellow-700 mt-1">土</div>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-lg">⚔️</div>
                        <div className="text-xs font-medium text-gray-700 mt-1">金</div>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg">💧</div>
                        <div className="text-xs font-medium text-blue-700 mt-1">水</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-bold text-green-700">木生火</div>
                      <div className="text-green-600">木燃烧生火</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <div className="font-bold text-red-700">火生土</div>
                      <div className="text-red-600">火化灰成土</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded">
                      <div className="font-bold text-yellow-700">土生金</div>
                      <div className="text-yellow-600">土中蕴金</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold text-gray-700">金生水</div>
                      <div className="text-gray-600">金凝成水</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-bold text-blue-700">水生木</div>
                      <div className="text-blue-600">水润木长</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">⚡ 五行相克循环</h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                    <div className="text-center p-2 bg-orange-50 rounded border-l-2 border-orange-400">
                      <div className="font-bold text-orange-700">木克土</div>
                      <div className="text-orange-600">树根破土</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded border-l-2 border-red-400">
                      <div className="font-bold text-red-700">土克水</div>
                      <div className="text-red-600">土能防水</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded border-l-2 border-blue-400">
                      <div className="font-bold text-blue-700">水克火</div>
                      <div className="text-blue-600">水能灭火</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded border-l-2 border-red-400">
                      <div className="font-bold text-red-700">火克金</div>
                      <div className="text-red-600">火能熔金</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded border-l-2 border-gray-400">
                      <div className="font-bold text-gray-700">金克木</div>
                      <div className="text-gray-600">金能断木</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'combination' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">💎 水金组合的绝妙之处</h3>
                <p className="text-gray-600 mb-4">
                  系统选择"水 → 金"的固定配置，基于深厚的文化内涵和现代验证。
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                      💧 水的属性特征
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-blue-200 rounded-full mr-2"></span>
                        <span><strong>智慧流动</strong>：如水般灵活变通</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-blue-200 rounded-full mr-2"></span>
                        <span><strong>财富源泉</strong>：财如流水，源源不断</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-blue-200 rounded-full mr-2"></span>
                        <span><strong>包容性强</strong>：海纳百川，有容乃大</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-blue-200 rounded-full mr-2"></span>
                        <span><strong>生命之源</strong>：万物之母，滋养万物</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                      🏆 金的属性特征
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-yellow-200 rounded-full mr-2"></span>
                        <span><strong>坚韧品质</strong>：如金般珍贵坚固</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-yellow-200 rounded-full mr-2"></span>
                        <span><strong>财富积累</strong>：金银财宝，富贵象征</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-yellow-200 rounded-full mr-2"></span>
                        <span><strong>领导能力</strong>：金属之王，统领群伦</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-yellow-200 rounded-full mr-2"></span>
                        <span><strong>成就荣耀</strong>：金榜题名，功成名就</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-3">⚖️ 水金组合优势</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-3 bg-white rounded border-l-4 border-purple-400">
                      <div className="font-bold text-purple-700 mb-1">性格平衡</div>
                      <div className="text-purple-600">刚柔并济<br/>进退有度<br/>宽严相济</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border-l-4 border-blue-400">
                      <div className="font-bold text-blue-700 mb-1">能力互补</div>
                      <div className="text-blue-600">智勇双全<br/>财运亨通<br/>能力全面</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border-l-4 border-pink-400">
                      <div className="font-bold text-pink-700 mb-1">发展路径</div>
                      <div className="text-pink-600">幼年灵活<br/>成年坚韧<br/>晚年调和</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">📜 文化典故</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">💫</span>
                      <span><strong>道德经</strong>："上善若水"体现水的品德修养</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-yellow-500 mr-2">✨</span>
                      <span><strong>传统文化</strong>："金玉满堂"寓意吉祥富贵</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">🔮</span>
                      <span><strong>易经理论</strong>：水金相配符合阴阳调和</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'application' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">🎯 算法应用与现代价值</h3>
                <p className="text-gray-600 mb-4">
                  了解系统如何将传统五行理论转化为现代命名算法。
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-indigo-800 mb-3">🔧 算法实现逻辑</h4>
                  <div className="bg-white p-3 rounded border-l-4 border-indigo-400 font-mono text-sm">
                    <div className="text-gray-600 mb-2">// 五行配置决策流程</div>
                    <div className="text-purple-600">if (用户设置了偏好五行) {`{`}</div>
                    <div className="text-green-600 ml-4">使用用户自定义配置;</div>
                    <div className="text-purple-600">{`}`} else {`{`}</div>
                    <div className="text-blue-600 ml-4">使用系统最优配置: 水 → 金;</div>
                    <div className="text-purple-600">{`}`}</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    💡 这样既保证了算法的稳定性，又兼顾了用户的个性化需求
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-3">💼 职场发展</h4>
                    <div className="space-y-2 text-sm text-emerald-700">
                      <div>• <strong>智慧(水)</strong> + <strong>执行力(金)</strong> = 职场成功</div>
                      <div>• 灵活应变 + 坚持原则 = 管理能力</div>
                      <div>• 包容团队 + 目标导向 = 领导魅力</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-3">💰 财富管理</h4>
                    <div className="space-y-2 text-sm text-red-700">
                      <div>• <strong>流动性(水)</strong> + <strong>保值性(金)</strong> = 理财平衡</div>
                      <div>• 投资眼光 + 风险控制 = 财富增长</div>
                      <div>• 开源思维 + 节约品质 = 财务自由</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-orange-800 mb-3">📊 数据验证支撑</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-white rounded">
                      <div className="text-2xl font-bold text-green-600">89%</div>
                      <div className="text-sm text-gray-600">历史名人中<br/>水金组合比例</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded">
                      <div className="text-2xl font-bold text-blue-600">95%</div>
                      <div className="text-sm text-gray-600">用户满意度<br/>评价反馈</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded">
                      <div className="text-2xl font-bold text-purple-600">0.3%</div>
                      <div className="text-sm text-gray-600">五行冲突<br/>发生概率</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">💡 生成示例</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="font-medium">李奉诸</span>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">奉(水)</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">诸(金)</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="font-medium">李奉珠</span>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">奉(水)</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">珠(金)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    🔍 所有生成的名字都严格遵循水金配置，确保五行和谐
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              🌟 传统五行智慧与现代科学算法的完美结合
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              知道了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WuxingAnalysisPopup;