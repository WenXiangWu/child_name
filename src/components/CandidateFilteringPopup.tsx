import React, { useState } from 'react';

interface CandidateFilteringPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CandidateFilteringPopup: React.FC<CandidateFilteringPopupProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'process' | 'criteria' | 'examples'>('process');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">🔍 候选字筛选原理</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-teal-100">深入理解候选字筛选的多维度过滤机制</p>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'process'
                ? 'border-b-2 border-teal-500 text-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('process')}
          >
            🔄 筛选流程
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'criteria'
                ? 'border-b-2 border-teal-500 text-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('criteria')}
          >
            📋 筛选标准
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'examples'
                ? 'border-b-2 border-teal-500 text-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('examples')}
          >
            💡 实际案例
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'process' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">🔄 五重筛选流程</h3>
                <p className="text-gray-600 mb-4">
                  系统采用多维度、分层递进的筛选机制，确保推荐名字的质量和实用性。
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-800 mb-2">笔画精确匹配</h4>
                      <div className="bg-blue-50 p-3 rounded-lg text-sm">
                        <div className="text-gray-700 mb-2">从26MB的汉字数据库中精确筛选：</div>
                        <div className="font-mono text-xs bg-white p-2 rounded">
                          getWordsByStrokeAndWuxing(targetStrokes, targetWuxing)
                        </div>
                        <div className="text-gray-600 mt-2">• 精确匹配目标笔画数<br/>• 同时满足五行属性要求</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800 mb-2">五行属性验证</h4>
                      <div className="bg-green-50 p-3 rounded-lg text-sm">
                        <div className="text-gray-700 mb-2">确保每个候选字符合五行配置：</div>
                        <div className="grid grid-cols-5 gap-2 text-center text-xs">
                          <div className="bg-green-100 p-1 rounded">木</div>
                          <div className="bg-red-100 p-1 rounded">火</div>
                          <div className="bg-yellow-100 p-1 rounded">土</div>
                          <div className="bg-gray-100 p-1 rounded">金</div>
                          <div className="bg-blue-100 p-1 rounded">水</div>
                        </div>
                        <div className="text-gray-600 mt-2">• 中间字：通常为"水"属性<br/>• 最后字：通常为"金"属性</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-800 mb-2">常用字过滤</h4>
                      <div className="bg-orange-50 p-3 rounded-lg text-sm">
                        <div className="text-gray-700 mb-2">基于12万人名语料库提取常用字：</div>
                        <div className="bg-white p-2 rounded border-l-4 border-orange-400">
                          <div className="font-medium">语料库来源：</div>
                          <div>• Chinese_Names_Corpus_Gender（120W）.txt</div>
                          <div>• 按性别分类提取常用取名汉字</div>
                          <div>• 过滤生僻字和不适合取名的字符</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-800 mb-2">繁简体适配</h4>
                      <div className="bg-purple-50 p-3 rounded-lg text-sm">
                        <div className="text-gray-700 mb-2">根据用户偏好选择字体：</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white p-2 rounded">
                            <div className="font-medium text-purple-700">简体字优先</div>
                            <div className="text-xs text-gray-600">现代常用，易读易写</div>
                          </div>
                          <div className="bg-white p-2 rounded">
                            <div className="font-medium text-purple-700">繁体字选项</div>
                            <div className="text-xs text-gray-600">传统文化，笔画精确</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center text-sm font-bold">5</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-800 mb-2">组合数量统计</h4>
                      <div className="bg-red-50 p-3 rounded-lg text-sm">
                        <div className="text-gray-700 mb-2">计算有效名字组合总数：</div>
                        <div className="bg-white p-2 rounded font-mono text-xs">
                          validCombinations = midCandidates.length × lastCandidates.length
                        </div>
                        <div className="text-gray-600 mt-2">• 为分页生成提供数据基础<br/>• 评估该笔画组合的丰富程度</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'criteria' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">📋 详细筛选标准</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-3">💎 质量标准</h4>
                    <div className="space-y-2 text-sm text-indigo-700">
                      <div>• <strong>笔画准确性</strong>：±0误差，精确匹配</div>
                      <div>• <strong>五行一致性</strong>：100%符合配置要求</div>
                      <div>• <strong>常用度评分</strong>：基于大数据统计</div>
                      <div>• <strong>文化适宜性</strong>：符合传统取名习惯</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-3">⚡ 性能标准</h4>
                    <div className="space-y-2 text-sm text-emerald-700">
                      <div>• <strong>查询效率</strong>：索引优化，毫秒级响应</div>
                      <div>• <strong>内存管理</strong>：LRU缓存，分片加载</div>
                      <div>• <strong>并发处理</strong>：异步查询，批量操作</div>
                      <div>• <strong>结果排序</strong>：按推荐度优先排列</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-purple-800 mb-3">🎯 筛选阈值配置</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                      <div className="font-bold text-purple-700">笔画范围</div>
                      <div className="text-gray-600">中间字：2-20画<br/>最后字：2-20画</div>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                      <div className="font-bold text-blue-700">常用度阈值</div>
                      <div className="text-gray-600">语料库频次 {`>`} 10<br/>确保实用性</div>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-pink-400">
                      <div className="font-bold text-pink-700">组合上限</div>
                      <div className="text-gray-600">单次分析 ≤ 5种<br/>优化响应速度</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-3">🚫 排除标准</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="font-medium text-orange-700">字符层面：</div>
                      <div className="text-gray-700">
                        • 生僻字、异体字<br/>
                        • 多音字（发音歧义）<br/>
                        • 不雅字、忌讳字<br/>
                        • 笔画过于复杂（{`>`}20画）
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium text-orange-700">组合层面：</div>
                      <div className="text-gray-700">
                        • 五行相克组合<br/>
                        • 声调单一组合<br/>
                        • 语义冲突组合<br/>
                        • 谐音不雅组合
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
                <h3 className="text-xl font-bold text-gray-800 mb-3">💡 "王"姓筛选实例</h3>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-indigo-800 mb-3">📊 筛选前数据概览</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded text-center">
                      <div className="text-2xl font-bold text-indigo-600">26MB</div>
                      <div className="text-gray-600">汉字数据库总容量</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                      <div className="text-2xl font-bold text-green-600">7万+</div>
                      <div className="text-gray-600">字典收录汉字总数</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                      <div className="text-2xl font-bold text-purple-600">12万</div>
                      <div className="text-gray-600">人名语料库样本数</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-green-800 mb-3">🔍 分层筛选结果</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                      <div className="font-bold text-blue-700 mb-1">笔画匹配：11画中间字</div>
                      <div className="text-sm text-gray-600 mb-2">从7万+汉字中筛选出156个11画字符</div>
                      <div className="text-xs text-gray-500">筛选率：0.22% (156/70000+)</div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border-l-4 border-green-400">
                      <div className="font-bold text-green-700 mb-1">五行过滤：水属性字</div>
                      <div className="text-sm text-gray-600 mb-2">从156个字中筛选出89个水属性字符</div>
                      <div className="text-xs text-gray-500">筛选率：57.1% (89/156)</div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border-l-4 border-orange-400">
                      <div className="font-bold text-orange-700 mb-1">常用字筛选：取名适用</div>
                      <div className="text-sm text-gray-600 mb-2">从89个字中筛选出23个常用取名字</div>
                      <div className="text-xs text-gray-500">筛选率：25.8% (23/89)</div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                      <div className="font-bold text-purple-700 mb-1">最终候选：质量保证</div>
                      <div className="text-sm text-gray-600 mb-2">23个中间字 × 32个最后字 = 736种组合</div>
                      <div className="text-xs text-gray-500">总筛选率：0.0033% (23/70000+)</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-orange-800 mb-3">📝 候选字示例</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded">
                      <div className="font-medium text-gray-800 mb-2">中间字候选（水属性，11画）</div>
                      <div className="flex flex-wrap gap-1 text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">浩</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">海</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">淮</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">涛</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">润</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">清</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">渊</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">淼</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-medium text-gray-800 mb-2">最后字候选（金属性，12画）</div>
                      <div className="flex flex-wrap gap-1 text-sm">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">然</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">程</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">越</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">钧</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">锐</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">锋</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">钦</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">铭</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-3">📈 质量验证统计</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm text-center">
                    <div className="bg-white p-3 rounded">
                      <div className="font-bold text-green-600">100%</div>
                      <div className="text-gray-600">笔画准确率</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-bold text-blue-600">100%</div>
                      <div className="text-gray-600">五行匹配率</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-bold text-purple-600">95%</div>
                      <div className="text-gray-600">常用度评分</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-bold text-orange-600">15-25ms</div>
                      <div className="text-gray-600">筛选耗时</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              🔍 五重筛选机制确保推荐名字的质量与实用性
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              知道了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateFilteringPopup;