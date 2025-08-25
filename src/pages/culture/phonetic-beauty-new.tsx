import React from 'react';
import { PageTemplate } from '@/components/layout/PageTemplate';
import { Button, Card } from '@/components/ui';

const PhoneticBeautyPage: React.FC = () => {
  return (
    <PageTemplate
      title="音韵美感分析 - 宝宝取名专家"
      description="深入了解汉语音韵学在取名中的应用，掌握声调搭配、音律分析与诗韵美感的核心技巧"
      keywords="音韵美感,声调搭配,音律分析,诗韵美感,汉语音韵学"
      category="culture"

      heroTitle="音韵美感"
      heroSubtitle="声律之美的诗意表达"
      heroDescription="分析声调格律、音韵搭配与节奏美感，确保名字不仅寓意深刻，更要读音优美、朗朗上口"
      headerActions={
        <Button variant="primary" size="sm">
          在线测试
        </Button>
      }
    >
      <div className="p-8">
        {/* 核心概念介绍 */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🎵 音韵美感的核心要素</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">🎼</div>
              <h3 className="text-xl font-bold text-rose-800 mb-3">声调搭配</h3>
              <p className="text-gray-600 text-sm">
                合理安排平仄声调，创造音律的起伏变化，
                让名字读起来抑扬顿挫，富有节奏感
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">🎶</div>
              <h3 className="text-xl font-bold text-rose-800 mb-3">韵母和谐</h3>
              <p className="text-gray-600 text-sm">
                避免相同韵母的重复，选择互补的韵母组合，
                确保发音清晰，听感舒适
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-xl font-bold text-rose-800 mb-3">诗韵意境</h3>
              <p className="text-gray-600 text-sm">
                借鉴古典诗词的音韵技巧，营造优美的意境，
                让名字具有诗意的美感
              </p>
            </Card>
          </div>
        </div>

        {/* 声调分析 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 声调搭配原理</h2>
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-8 rounded-xl border border-rose-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-rose-800 mb-4">四声基础知识</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-rose-200">
                    <span className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold">1</span>
                    <div>
                      <div className="font-medium text-rose-800">阴平（第一声）</div>
                      <div className="text-sm text-rose-600">高平调，如：妈、天、家</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-rose-200">
                    <span className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold">2</span>
                    <div>
                      <div className="font-medium text-rose-800">阳平（第二声）</div>
                      <div className="text-sm text-rose-600">中升调，如：麻、田、佳</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-rose-200">
                    <span className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold">3</span>
                    <div>
                      <div className="font-medium text-rose-800">上声（第三声）</div>
                      <div className="text-sm text-rose-600">低降升调，如：马、甜、假</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-rose-200">
                    <span className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold">4</span>
                    <div>
                      <div className="font-medium text-rose-800">去声（第四声）</div>
                      <div className="text-sm text-rose-600">高降调，如：骂、店、价</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-rose-800 mb-4">最佳搭配组合</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-rose-200">
                    <div className="font-medium text-rose-800 mb-2">✨ 优美组合</div>
                    <div className="text-sm text-rose-600 space-y-1">
                      <div>• 阴平 + 阳平：如"嘉怡"（jiā yí）</div>
                      <div>• 阳平 + 去声：如"文静"（wén jìng）</div>
                      <div>• 上声 + 阴平：如"雨晴"（yǔ qíng）</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-rose-200">
                    <div className="font-medium text-rose-800 mb-2">⚠️ 避免组合</div>
                    <div className="text-sm text-rose-600 space-y-1">
                      <div>• 连续上声：如"雨语"（yǔ yǔ）</div>
                      <div>• 连续去声：如"志慧"（zhì huì）</div>
                      <div>• 同韵母重复：如"安然"（ān rán）</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 实际应用案例 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">💡 音韵美感实例分析</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border border-green-200 bg-green-50">
              <h3 className="text-lg font-bold text-green-800 mb-4">✅ 优秀案例</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="font-bold text-green-700 mb-2">林风眠 (lín fēng mián)</div>
                  <div className="text-sm text-green-600 mb-2">阳平 + 阴平 + 阳平</div>
                  <div className="text-xs text-gray-600">
                    声调起伏自然，韵母搭配和谐，既有文人雅致，又朗朗上口
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="font-bold text-green-700 mb-2">白居易 (bái jū yì)</div>
                  <div className="text-sm text-green-600 mb-2">阳平 + 阴平 + 去声</div>
                  <div className="text-xs text-gray-600">
                    平仄相间，音律优美，体现了古人对音韵美感的追求
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border border-red-200 bg-red-50">
              <h3 className="text-lg font-bold text-red-800 mb-4">❌ 需要改进</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="font-bold text-red-700 mb-2">李理礼 (lǐ lǐ lǐ)</div>
                  <div className="text-sm text-red-600 mb-2">上声 + 上声 + 上声</div>
                  <div className="text-xs text-gray-600">
                    连续上声，读音拗口，缺乏音律变化，听感单调
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="font-bold text-red-700 mb-2">王望旺 (wáng wàng wàng)</div>
                  <div className="text-sm text-red-600 mb-2">阳平 + 去声 + 去声</div>
                  <div className="text-xs text-gray-600">
                    韵母重复，声调单一，缺乏美感，容易产生歧义
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 实用工具 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🔧 音韵分析工具</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-2">在线音韵测试器</h3>
              <p className="text-blue-600">输入姓名，即时分析音韵美感</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="请输入姓氏"
                  className="px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="请输入名字"
                  className="px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-center">
                <Button variant="primary" className="px-8 py-3">
                  分析音韵美感
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 学习建议 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">📚 深入学习建议</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📖</div>
              <h3 className="text-lg font-bold text-purple-800 mb-2">理论学习</h3>
              <p className="text-sm text-purple-600">
                深入学习汉语音韵学基础，了解古今音变化，
                掌握声韵调的基本规律
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎤</div>
              <h3 className="text-lg font-bold text-purple-800 mb-2">实践训练</h3>
              <p className="text-sm text-purple-600">
                多读古典诗词，培养语感，
                练习不同声调组合的发音效果
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="text-lg font-bold text-purple-800 mb-2">综合应用</h3>
              <p className="text-sm text-purple-600">
                结合字义、五行等因素，
                在音韵美感与其他要素间找到平衡
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default PhoneticBeautyPage;
