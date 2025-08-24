import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Button, Input, Card } from '@/components/ui';

const QuickNamingPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    familyName: '',
    gender: '' as 'male' | 'female' | '',
    birthDate: '',
    preferences: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.familyName || !formData.gender) return;

    setIsLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      router.push({
        pathname: '/naming/results',
        query: {
          familyName: formData.familyName,
          gender: formData.gender,
          birthDate: formData.birthDate || undefined
        }
      });
    }, 1500);
  };

  const preferenceOptions = [
    { id: 'traditional', label: '传统文化', icon: '🏛️' },
    { id: 'modern', label: '现代时尚', icon: '✨' },
    { id: 'nature', label: '自然元素', icon: '🌿' },
    { id: 'wisdom', label: '智慧学识', icon: '📚' },
    { id: 'virtue', label: '品德修养', icon: '💎' },
    { id: 'prosperity', label: '富贵吉祥', icon: '🎋' }
  ];

  const togglePreference = (prefId: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(prefId)
        ? prev.preferences.filter(p => p !== prefId)
        : [...prev.preferences, prefId]
    }));
  };

  return (
    <Layout 
      title="快速取名 - 宝宝取名专家"
      description="快速为您的宝宝生成专业的名字推荐，简单几步即可获得满意的名字。"
    >
      <div className="min-h-screen bg-cultural-gradient py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-heading text-cultural-ink mb-4">
              快速取名
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              简单几步，为您的宝宝生成专业的名字推荐
            </p>
          </div>

          {/* 取名表单 */}
          <Card variant="cultural" padding="lg" className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 基本信息 */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-cultural-ink mb-4">
                  基本信息
                </h2>
                
                <Input
                  label="宝宝姓氏"
                  value={formData.familyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, familyName: e.target.value }))}
                  placeholder="请输入姓氏"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-cultural-ink mb-3">
                    宝宝性别 <span className="text-cultural-red">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, gender: 'male' }))}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        formData.gender === 'male'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-4xl mb-3">👦</div>
                      <div className="font-semibold">男宝宝</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, gender: 'female' }))}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        formData.gender === 'female'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-4xl mb-3">👧</div>
                      <div className="font-semibold">女宝宝</div>
                    </button>
                  </div>
                </div>

                <Input
                  label="出生日期（可选）"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                  helperText="提供出生日期可以进行更精准的五行分析"
                />
              </div>

              {/* 偏好设置 */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-cultural-ink mb-4">
                  取名偏好（可选）
                </h2>
                <p className="text-gray-600 mb-4">选择您希望名字体现的特质</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {preferenceOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => togglePreference(option.id)}
                      className={`p-4 border-2 rounded-xl transition-all text-center ${
                        formData.preferences.includes(option.id)
                          ? 'border-cultural-gold bg-cultural-gold/10 text-cultural-gold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className="font-medium text-sm">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!formData.familyName || !formData.gender}
                  loading={isLoading}
                >
                  {isLoading ? '正在生成名字...' : '开始生成名字'}
                </Button>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  点击生成后，我们将为您推荐20个精选名字
                </p>
              </div>
            </form>
          </Card>

          {/* 特色说明 */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-cultural-jade/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">快速生成</h3>
              <p className="text-sm text-gray-600">3秒内生成20个精选名字</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-cultural-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">权威标准</h3>
              <p className="text-sm text-gray-600">严格遵循国家规范汉字表</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-cultural-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">文化内涵</h3>
              <p className="text-sm text-gray-600">融合传统文化智慧</p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuickNamingPage;
