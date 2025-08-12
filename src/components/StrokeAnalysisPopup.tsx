/**
 * 笔画组合分析科普弹窗组件
 * 用于解释三才五格理论和筛选原理
 */
import React, { useState } from 'react';

interface StrokeAnalysisPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const StrokeAnalysisPopup: React.FC<StrokeAnalysisPopupProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'algorithm' | 'example'>('theory');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">📐 笔画组合筛选原理科普</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-blue-100">了解传统姓名学的数理分析体系</p>
        </div>

        {/* 标签切换 */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'theory'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('theory')}
          >
            🎯 基础理论
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'algorithm'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('algorithm')}
          >
            ⚙️ 筛选算法
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'example'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('example')}
          >
            💡 实际案例
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'theory' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">🔢 三才五格姓名学</h3>
                <p className="text-gray-600 mb-4">
                  三才五格理论是传统姓名学的核心，通过数理分析确定姓名的吉凶。
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">五格计算公式</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">天格</span>
                      <span className="text-blue-600">姓氏笔画 + 1</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">人格</span>
                      <span className="text-blue-600">姓氏笔画 + 名第一字笔画</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">地格</span>
                      <span className="text-blue-600">名第一字笔画 + 名第二字笔画</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">总格</span>
                      <span className="text-blue-600">所有笔画之和</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">外格</span>
                      <span className="text-blue-600">总格 - 人格 + 1</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">数字五行对应</h4>
                  <div className="grid grid-cols-5 gap-2 text-sm">
                    <div className="text-center p-2 bg-green-100 rounded">
                      <div className="font-bold">1,2</div>
                      <div className="text-green-700">木</div>
                    </div>
                    <div className="text-center p-2 bg-red-100 rounded">
                      <div className="font-bold">3,4</div>
                      <div className="text-red-700">火</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-100 rounded">
                      <div className="font-bold">5,6</div>
                      <div className="text-yellow-700">土</div>
                    </div>
                    <div className="text-center p-2 bg-gray-100 rounded">
                      <div className="font-bold">7,8</div>
                      <div className="text-gray-700">金</div>
                    </div>
                    <div className="text-center p-2 bg-blue-100 rounded">
                      <div className="font-bold">9,0</div>
                      <div className="text-blue-700">水</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">* 取个位数确定五行属性</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'algorithm' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">🔍 7层严格筛选</h3>
                <p className="text-gray-600 mb-4">
                  系统对361种可能的笔画组合进行7层筛选，确保只保留最优质的组合。
                </p>

                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded-r-lg">
                    <h4 className="font-semibold text-blue-800">第1层：全组合遍历</h4>
                    <p className="text-sm text-blue-700">遍历2-20画的所有组合：19×19 = 361种可能</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r-lg">
                    <h4 className="font-semibold text-green-800">第2层：五格吉数筛选</h4>
                    <p className="text-sm text-green-700">天格、人格、地格、总格、外格都必须是吉祥数字</p>
                    <div className="text-xs text-green-600 mt-1">
                      吉数：1,3,5,7,8,11,13,15,16,18,21,23,24,25,31,32,33,35,37,39,41,45,47,48,52,57,61,63,65,67,68,81
                    </div>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded-r-lg">
                    <h4 className="font-semibold text-purple-800">第3层：三才配置检查</h4>
                    <p className="text-sm text-purple-700">三才组合必须在122种已知吉利配置中</p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded-r-lg">
                    <h4 className="font-semibold text-red-800">第4层：排除凶相</h4>
                    <p className="text-sm text-red-700">过滤掉所有包含"凶"字的组合</p>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 p-3 rounded-r-lg">
                    <h4 className="font-semibold text-yellow-800">第5层：保留大吉</h4>
                    <p className="text-sm text-yellow-700">只保留"大吉"、"中吉"、"吉"级别的组合</p>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">筛选结果</span>
                    <span className="text-2xl font-bold text-red-600">1-5%</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    361种组合中，通常只有5-20种能通过全部筛选条件
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'example' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">📝 王姓分析案例</h3>
                <p className="text-gray-600 mb-4">
                  以王姓(4画)为例，展示完整的筛选过程和结果。
                </p>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3">成功案例：王 + 2画 + 5画</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700">五格计算</h5>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>天格：</span>
                          <span className="text-green-600">4+1=5 (土-吉)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>人格：</span>
                          <span className="text-green-600">4+2=6 (土-吉)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>地格：</span>
                          <span className="text-green-600">2+5=7 (金-吉)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>总格：</span>
                          <span className="text-green-600">4+2+5=11 (木-吉)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>外格：</span>
                          <span className="text-green-600">11-6+1=6 (土-吉)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700">三才配置</h5>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>天才：</span>
                          <span className="text-yellow-600">5 → 土</span>
                        </div>
                        <div className="flex justify-between">
                          <span>人才：</span>
                          <span className="text-yellow-600">6 → 土</span>
                        </div>
                        <div className="flex justify-between">
                          <span>地才：</span>
                          <span className="text-gray-600">7 → 金</span>
                        </div>
                        <div className="mt-2 p-2 bg-green-100 rounded text-center">
                          <span className="font-semibold text-green-800">土-土-金 = 大吉</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border-l-4 border-green-500">
                    <span className="text-green-700 font-medium">✅ 通过所有筛选条件</span>
                    <p className="text-sm text-gray-600 mt-1">
                      此组合可以产生：王 + 八(2画) + 石/正/世...(5画)
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">最终筛选结果</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span>初始组合数：</span>
                    <span className="font-bold">361种</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span>通过筛选：</span>
                    <span className="font-bold text-green-600">4种</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>通过率：</span>
                    <span className="font-bold text-red-600">1.1%</span>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      💡 这就是为什么系统生成的名字都具有优秀的数理配置！
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              💡 基于传统《康熙字典》笔画和古典五行理论
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              知道了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrokeAnalysisPopup;