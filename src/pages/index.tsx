import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Button, Input, Card } from '@/components/ui';
import { ZodiacAnimal, zodiacService } from '../lib/qiming';

export default function Home() {
  const router = useRouter();
  const [babyGender, setBabyGender] = useState<'male' | 'female' | ''>('');
  const [familyName, setFamilyName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [birthTime, setBirthTime] = useState<string>('');
  const [zodiac, setZodiac] = useState<ZodiacAnimal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 监听出生日期变化，自动计算生肖
  useEffect(() => {
    const calculateZodiac = async () => {
      if (birthDate) {
        try {
          const year = new Date(birthDate).getFullYear();
          await zodiacService.initialize();
          const calculatedZodiac = zodiacService.getZodiacByYear(year);
          setZodiac(calculatedZodiac);
          console.log(`出生年份 ${year} 对应生肖: ${calculatedZodiac}`);
        } catch (error) {
          console.error('计算生肖失败:', error);
        }
      } else {
        setZodiac(null);
      }
    };

    calculateZodiac();
  }, [birthDate]);

  // 时间描述函数 - 更精确的十二时辰划分
  const getTimeDescription = (time: string): string => {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    // 传统十二时辰对照 (每个时辰2小时，共24小时)
    const timeRanges = [
      { start: 1380, end: 1440, name: '子时', desc: '夜半', period: '23:00-01:00' }, // 23:00-24:00
      { start: 0, end: 60, name: '子时', desc: '夜半', period: '23:00-01:00' },     // 00:00-01:00
      { start: 60, end: 180, name: '丑时', desc: '鸡鸣', period: '01:00-03:00' },
      { start: 180, end: 300, name: '寅时', desc: '平旦', period: '03:00-05:00' },
      { start: 300, end: 420, name: '卯时', desc: '日出', period: '05:00-07:00' },
      { start: 420, end: 540, name: '辰时', desc: '食时', period: '07:00-09:00' },
      { start: 540, end: 660, name: '巳时', desc: '隅中', period: '09:00-11:00' },
      { start: 660, end: 780, name: '午时', desc: '日中', period: '11:00-13:00' },
      { start: 780, end: 900, name: '未时', desc: '日昳', period: '13:00-15:00' },
      { start: 900, end: 1020, name: '申时', desc: '晡时', period: '15:00-17:00' },
      { start: 1020, end: 1140, name: '酉时', desc: '日入', period: '17:00-19:00' },
      { start: 1140, end: 1260, name: '戌时', desc: '黄昏', period: '19:00-21:00' },
      { start: 1260, end: 1380, name: '亥时', desc: '人定', period: '21:00-23:00' }
    ];
    
    const timeRange = timeRanges.find(range => 
      totalMinutes >= range.start && totalMinutes < range.end
    );
    
    return timeRange ? `${timeRange.name} (${timeRange.desc}) ${timeRange.period}` : '';
  };

  const handleStartNaming = () => {
    if (!babyGender) return;

    setIsLoading(true);
    router.push({
      pathname: '/generate',
      query: {
        gender: babyGender,
        familyName: familyName || undefined
      }
    });
  };

  return (
    <Layout 
      title="宝宝取名专家 - 传承文化智慧，为宝宝取个好名字"
      description="专业的宝宝取名服务，严格遵循《通用规范汉字表》国家标准，结合传统文化智慧与现代科学方法，为新生儿提供个性化、有文化内涵的名字推荐。"
    >
      {/* 英雄区域 */}
      <section className="relative min-h-screen bg-cultural-hero overflow-hidden">
        {/* 传统文化背景装饰 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-cultural-gold rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border border-cultural-jade rotate-45"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-cultural-red/10 rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 左侧内容 */}
            <div className="space-y-8">
              {/* 主标题 */}
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-cultural-gold/10 border border-cultural-gold/20 rounded-full px-4 py-2">
                  <span className="text-cultural-gold">🏛️</span>
                  <span className="text-sm font-medium text-cultural-gold">国家规范汉字标准</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold font-heading text-cultural-ink leading-tight">
                  为您的宝宝
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cultural-red via-cultural-gold to-cultural-jade">
                    取个好名字
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  传承千年文化智慧，融合现代科学方法，为新生儿提供专业、个性化、有文化内涵的名字推荐
                </p>
              </div>

              {/* 特色亮点 */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="flex items-center space-x-3 p-4" variant="bordered">
                  <div className="w-10 h-10 bg-cultural-jade/10 rounded-full flex items-center justify-center">
                    <span className="text-cultural-jade">🏛️</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">权威标准</div>
                    <div className="text-sm text-gray-600">8,105个规范汉字</div>
                  </div>
                </Card>
                
                <Card className="flex items-center space-x-3 p-4" variant="bordered">
                  <div className="w-10 h-10 bg-cultural-red/10 rounded-full flex items-center justify-center">
                    <span className="text-cultural-red">📚</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">文化传承</div>
                    <div className="text-sm text-gray-600">诗词典籍取名</div>
                  </div>
                </Card>
              </div>

              {/* 行动按钮 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => router.push('/naming/quick')}
                >
                  立即开始取名
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => router.push('/culture/overview')}
                >
                  了解文化背景
                </Button>
              </div>
            </div>

            {/* 右侧快速取名表单 */}
            <div className="relative">
              <Card variant="cultural" padding="lg" className="shadow-2xl">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold font-heading text-cultural-ink mb-2">快速体验</h3>
                    <p className="text-gray-600">填写基本信息，即刻生成美名</p>
                  </div>
                  
                  <div className="space-y-4">
                    <Input
                      label="宝宝姓氏"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      placeholder="请输入姓氏"
                      required
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-cultural-ink mb-2">
                        宝宝性别 <span className="text-cultural-red">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setBabyGender('male')}
                          className={`p-4 border-2 rounded-xl transition-all ${
                            babyGender === 'male'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-3xl mb-2">👦</div>
                          <div className="font-medium">男宝宝</div>
                        </button>
                        <button
                          onClick={() => setBabyGender('female')}
                          className={`p-4 border-2 rounded-xl transition-all ${
                            babyGender === 'female'
                              ? 'border-pink-500 bg-pink-50 text-pink-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-3xl mb-2">👧</div>
                          <div className="font-medium">女宝宝</div>
                        </button>
                      </div>
                    </div>

                    <Input
                      label="出生日期（可选）"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />

                    {birthDate && zodiac && (
                      <div className="p-3 bg-cultural-jade-50 rounded-lg">
                        <p className="text-xs text-cultural-jade-700 font-medium">
                          🐾 生肖：{zodiac}年
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      variant="primary" 
                      size="lg"
                      className="w-full"
                      disabled={!babyGender || !familyName}
                      loading={isLoading}
                      onClick={handleStartNaming}
                    >
                      生成美名
                    </Button>
                  </div>
                </div>
              </Card>
              
              {/* 装饰元素 */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-cultural-gold rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cultural-jade rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能特色区域 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* 标题区域 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading text-cultural-ink mb-4">
              传统文化智慧
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              结合传统文化智慧与现代科学方法，为新生儿提供专业、个性化、有文化内涵的名字推荐
            </p>
          </div>

          {/* 功能卡片网格 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🔮',
                title: '三才五格分析',
                description: '基于传统姓名学理论，精确计算三才五格数理',
                href: '/culture/sancai-wuge',
                gradient: 'from-purple-500 to-indigo-600',
                bgGradient: 'from-purple-50 to-indigo-100'
              },
              {
                icon: '⚖️',
                title: '五行平衡',
                description: '根据生辰信息分析五行属性，确保名字协调平衡',
                href: '/culture/wuxing-balance',
                gradient: 'from-emerald-500 to-teal-600',
                bgGradient: 'from-emerald-50 to-teal-100'
              },
              {
                icon: '🎵',
                title: '音韵美感',
                description: '分析声调搭配，确保名字读音优美和谐',
                href: '/culture/phonetic-beauty',
                gradient: 'from-rose-500 to-pink-600',
                bgGradient: 'from-rose-50 to-pink-100'
              },
              {
                icon: '🔥',
                title: '八字喜用神',
                description: '基于出生时刻精准分析命局，确定五行喜忌',
                href: '/culture/bazi-xiyongshen',
                gradient: 'from-orange-500 to-red-600',
                bgGradient: 'from-orange-50 to-red-100'
              },
              {
                icon: '📚',
                title: '意境底蕴派',
                description: '从经史子集中汲取智慧，承载千年文脉',
                href: '/culture/cultural-heritage',
                gradient: 'from-amber-500 to-yellow-600',
                bgGradient: 'from-amber-50 to-yellow-100'
              },
              {
                icon: '🐲',
                title: '生肖取名',
                description: '根据十二生肖特性与五行理论，选择符合生肖特征的美好名字',
                href: '/culture/zodiac-naming',
                gradient: 'from-lime-500 to-green-600',
                bgGradient: 'from-lime-50 to-green-100'
              }
            ].map((feature, index) => (
              <Link key={index} href={feature.href}>
                <Card 
                  hover
                  className={`group relative p-8 bg-gradient-to-br ${feature.bgGradient} border border-gray-100 h-full`}
                >
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center font-heading">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="mt-4 text-center">
                    <span className="text-cultural-gold text-sm font-medium group-hover:text-cultural-red transition-colors">
                      了解更多 →
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 为什么选择我们 */}
      <section className="py-16 bg-cultural-paper">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cultural-ink mb-4 font-heading">为什么选择我们</h2>
            <p className="text-gray-600">专业、科学、个性化的取名服务</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 官方权威保证 */}
            <Card variant="cultural" className="text-center border-2 border-cultural-jade-200">
              <div className="bg-cultural-jade-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="font-semibold text-cultural-jade-800 mb-2">官方权威</h3>
              <p className="text-sm text-cultural-jade-700 font-medium">严格遵循《通用规范汉字表》</p>
              <p className="text-xs text-cultural-jade-600 mt-1">教育部2013年发布的国家标准</p>
            </Card>
            
            <Card variant="default" className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧩</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">智能插件</h3>
              <p className="text-sm text-gray-600">多层级插件系统，智能分析生成个性化名字</p>
            </Card>
            
            <Card variant="default" className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">文化传承</h3>
              <p className="text-sm text-gray-600">深度解读传统文化，传承中华文明智慧</p>
            </Card>
            
            <Card variant="default" className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">快速响应</h3>
              <p className="text-sm text-gray-600">纯前端实现，秒级生成结果，保护隐私</p>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}