import React, { useState } from 'react';
import { PageTemplate } from '@/components/layout/PageTemplate';
import { Button, Card, Input } from '@/components/ui';

const AdvancedNamingPage: React.FC = () => {
  const [formData, setFormData] = useState({
    familyName: '',
    gender: 'male' as 'male' | 'female',
    birthDate: '',
    birthTime: '',
    preferences: [] as string[],
    avoidWords: ''
  });

  const preferences = [
    { id: 'literature', label: '文学典雅', icon: '📚' },
    { id: 'nature', label: '自然清新', icon: '🌿' },
    { id: 'wisdom', label: '智慧聪颖', icon: '🧠' },
    { id: 'strength', label: '坚强勇敢', icon: '💪' },
    { id: 'gentle', label: '温和善良', icon: '🌸' },
    { id: 'success', label: '成功事业', icon: '🏆' }
  ];

  const handlePreferenceToggle = (prefId: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(prefId)
        ? prev.preferences.filter(p => p !== prefId)
        : [...prev.preferences, prefId]
    }));
  };

  return (
    <PageTemplate
      title="高级智能取名 - 宝宝取名专家"
      description="基于生辰八字、五行平衡、音韵美感的综合智能取名系统，为您的宝宝量身定制最佳名字"
      keywords="高级取名,智能取名,生辰八字,五行平衡,个性化取名"
      category="naming"
      breadcrumbs={[{ label: '高级智能取名' }]}
      heroTitle="高级智能取名"
      heroSubtitle="多维度综合分析，个性化定制"
      heroDescription="结合传统文化智慧与现代AI技术，从生辰八字、五行配置、音韵美感等多个维度为您的宝宝量身定制最佳名字"
    >
      <div className="p-8">
        {/* 功能特色 */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🎯 高级取名功能特色</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="text-lg font-bold text-cultural-jade-800 mb-2">八字分析</h3>
              <p className="text-sm text-gray-600">
                精准分析生辰八字，确定喜用神，
                为五行配置提供科学依据
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-lg font-bold text-cultural-jade-800 mb-2">五行平衡</h3>
              <p className="text-sm text-gray-600">
                智能计算五行强弱，通过姓名
                调节能量平衡，促进和谐发展
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-lg font-bold text-cultural-jade-800 mb-2">音韵优化</h3>
              <p className="text-sm text-gray-600">
                分析声调搭配和韵母组合，
                确保名字读音优美动听
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-bold text-cultural-jade-800 mb-2">个性定制</h3>
              <p className="text-sm text-gray-600">
                根据家庭偏好和期望，
                量身定制独特的名字方案
              </p>
            </Card>
          </div>
        </div>

        {/* 取名表单 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 详细信息填写</h2>
          <Card className="p-8">
            <div className="space-y-8">
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">👶 基本信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓氏 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.familyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, familyName: e.target.value }))}
                      placeholder="请输入姓氏，如：张"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      性别 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === 'male'}
                          onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                          className="mr-2"
                        />
                        <span className="text-sm">男孩 👦</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === 'female'}
                          onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                          className="mr-2"
                        />
                        <span className="text-sm">女孩 👧</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 生辰信息 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🕐 生辰信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      出生日期 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      出生时间 <span className="text-gray-500">(可选，用于精确八字分析)</span>
                    </label>
                    <Input
                      type="time"
                      value={formData.birthTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 text-sm">💡</span>
                    <div className="text-sm text-blue-700">
                      <strong>提示：</strong>出生时间越精确，八字分析越准确。如果不确定具体时间，可以留空，系统将使用日期进行基础分析。
                    </div>
                  </div>
                </div>
              </div>

              {/* 偏好设置 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">❤️ 名字偏好</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {preferences.map((pref) => (
                    <label
                      key={pref.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.preferences.includes(pref.id)
                          ? 'border-cultural-jade-500 bg-cultural-jade-50'
                          : 'border-gray-200 hover:border-cultural-jade-300 hover:bg-cultural-jade-25'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.preferences.includes(pref.id)}
                        onChange={() => handlePreferenceToggle(pref.id)}
                        className="sr-only"
                      />
                      <span className="text-2xl">{pref.icon}</span>
                      <span className={`text-sm font-medium ${
                        formData.preferences.includes(pref.id) ? 'text-cultural-jade-800' : 'text-gray-700'
                      }`}>
                        {pref.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 避讳设置 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🚫 避讳设置</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    避免使用的字词 <span className="text-gray-500">(可选)</span>
                  </label>
                  <Input
                    value={formData.avoidWords}
                    onChange={(e) => setFormData(prev => ({ ...prev, avoidWords: e.target.value }))}
                    placeholder="请输入需要避免的字词，用逗号分隔，如：军,病,死"
                    className="w-full"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    可以输入家族长辈名字中的字、不吉利的字词等需要避免的内容
                  </div>
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="text-center pt-6 border-t border-gray-200">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-12 py-4 text-lg"
                  disabled={!formData.familyName || !formData.birthDate}
                >
                  🎯 开始智能取名
                </Button>
                <div className="mt-4 text-sm text-gray-500">
                  点击后将进行深度分析，预计需要 10-30 秒
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 服务说明 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 服务说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border border-green-200 bg-green-50">
              <h3 className="text-lg font-bold text-green-800 mb-4">✅ 我们提供</h3>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>10-20个精选名字推荐</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>详细的八字五行分析报告</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>音韵美感和寓意解释</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>三才五格数理评分</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>生肖宜忌字分析</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border border-blue-200 bg-blue-50">
              <h3 className="text-lg font-bold text-blue-800 mb-4">💡 温馨提示</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-start space-x-2">
                  <span className="mt-0.5">•</span>
                  <span>建议提供准确的出生信息以获得最佳分析结果</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="mt-0.5">•</span>
                  <span>系统会综合多个因素，可能需要一些时间进行计算</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="mt-0.5">•</span>
                  <span>推荐结果仅供参考，最终决定权在您</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="mt-0.5">•</span>
                  <span>如有特殊需求，可联系客服进行个性化定制</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 成功案例 */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-xl border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">🏆 成功案例展示</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-purple-700">张雨萱</div>
                <div className="text-sm text-gray-600">2023年春分出生 · 女孩</div>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• 八字喜水木，名字五行配置完美</div>
                <div>• 音韵搭配优美，寓意清新雅致</div>
                <div>• 三才五格评分：92分</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-purple-700">李浩然</div>
                <div className="text-sm text-gray-600">2023年夏至出生 · 男孩</div>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• 八字偏弱，通过名字补充火土能量</div>
                <div>• 寓意宽广正大，符合家长期望</div>
                <div>• 三才五格评分：89分</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-purple-700">王诗涵</div>
                <div className="text-sm text-gray-600">2023年秋分出生 · 女孩</div>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• 结合诗经典故，文化底蕴深厚</div>
                <div>• 五行平衡，音韵和谐优美</div>
                <div>• 三才五格评分：95分</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default AdvancedNamingPage;
