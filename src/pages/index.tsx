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
      title="宝宝取名专家 - 智慧取名，科学传承"
      description="融合AI智能分析与传统文化智慧，为新生代打造专属美名。专业的宝宝取名服务，严格遵循《通用规范汉字表》国家标准，8大维度科学分析。"
    >
      {/* 英雄区域 - 优化视觉层次，增加留白 */}
      <section className="relative min-h-screen bg-gradient-to-br from-cultural-paper via-white to-cultural-jade-50/30 overflow-hidden flex items-center">
        {/* 简化背景装饰，减少视觉干扰 */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-20 right-20 w-24 h-24 border border-cultural-gold/30 rounded-full"></div>
          <div className="absolute bottom-32 left-20 w-16 h-16 bg-cultural-jade/5 rounded-full"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-8 py-32 text-center">
          <div className="space-y-24">
            {/* 权威标签 - 更突出 */}
            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm border-2 border-cultural-gold/30 rounded-full px-8 py-4 shadow-lg">
              <span className="text-cultural-gold text-xl">🏛️</span>
              <span className="text-lg font-semibold text-cultural-ink">国家规范汉字标准 · 权威认证</span>
            </div>
            
            {/* 主标题 - 增加留白和对比 */}
            <div className="space-y-12">
              <h1 className="text-6xl lg:text-7xl font-bold font-heading text-cultural-ink leading-[1.1] tracking-tight">
                为宝宝取一个
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cultural-red via-cultural-gold to-cultural-jade">
                  传世美名
                </span>
              </h1>
              
              <p className="text-2xl lg:text-3xl text-neutral-600 leading-relaxed max-w-4xl mx-auto font-light">
                融合传统文化智慧与现代AI技术
                <br />
                <span className="text-cultural-gold font-medium">30秒生成专属美名</span>
              </p>
            </div>

            {/* 核心数据展示 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cultural-gold/20">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                <div className="space-y-3">
                  <div className="text-4xl font-bold text-cultural-red font-heading">500万+</div>
                  <div className="text-base text-gray-600 font-medium">诗词典籍</div>
                </div>
                <div className="space-y-3">
                  <div className="text-4xl font-bold text-cultural-gold font-heading">47,000+</div>
                  <div className="text-base text-gray-600 font-medium">康熙字典</div>
                </div>
                <div className="space-y-3">
                  <div className="text-4xl font-bold text-cultural-jade font-heading">8,105个</div>
                  <div className="text-base text-gray-600 font-medium">规范汉字</div>
                </div>
                <div className="space-y-3">
                  <div className="text-4xl font-bold text-purple-600 font-heading">6层</div>
                  <div className="text-base text-gray-600 font-medium">智能分析</div>
                </div>
              </div>
            </div>

            {/* 特色亮点 - 横向排列 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="flex flex-col items-center space-y-4 p-6 text-center" variant="bordered">
                <div className="w-16 h-16 bg-cultural-jade/10 rounded-2xl flex items-center justify-center">
                  <span className="text-cultural-jade text-2xl">🏛️</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-lg font-heading">权威标准</div>
                  <div className="text-base text-gray-600">8,105个规范汉字</div>
                </div>
              </Card>
              
              <Card className="flex flex-col items-center space-y-4 p-6 text-center" variant="bordered">
                <div className="w-16 h-16 bg-cultural-red/10 rounded-2xl flex items-center justify-center">
                  <span className="text-cultural-red text-2xl">📚</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-lg font-heading">文化传承</div>
                  <div className="text-base text-gray-600">诗词典籍取名</div>
                </div>
              </Card>

              <Card className="flex flex-col items-center space-y-4 p-6 text-center" variant="bordered">
                <div className="w-16 h-16 bg-cultural-gold/10 rounded-2xl flex items-center justify-center">
                  <span className="text-cultural-gold text-2xl">🧩</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-lg font-heading">智能分析</div>
                  <div className="text-base text-gray-600">多维度评分</div>
                </div>
              </Card>

              <Card className="flex flex-col items-center space-y-4 p-6 text-center" variant="bordered">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-purple-600 text-2xl">⚡</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-lg font-heading">即时生成</div>
                  <div className="text-base text-gray-600">秒级响应</div>
                </div>
              </Card>
            </div>

            {/* 行动按钮 - 应用60-30-10原则 */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Button 
                variant="primary" 
                size="lg"
                className="px-16 py-6 text-xl font-semibold bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-500 shadow-2xl hover:shadow-primary-500/25 transform hover:scale-105 transition-all duration-300"
                onClick={() => {
                  // 滚动到快速体验区域
                  document.getElementById('quick-start')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
              >
                ✨ 立即开始取名
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                className="px-16 py-6 text-xl font-medium border-2 border-neutral-300 text-neutral-700 hover:border-cultural-jade hover:text-cultural-jade hover:bg-cultural-jade-50/50 transition-all duration-300"
                onClick={() => router.push('/culture/overview')}
              >
                📚 了解文化背景
              </Button>
            </div>

            {/* 滚动提示 */}
            <div className="pt-8">
              <div className="animate-bounce">
                <svg className="w-6 h-6 mx-auto text-cultural-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <p className="text-base text-gray-500 mt-2 font-medium">向下滚动开始体验</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8大核心数据库展示区域 - 优化留白和排版 */}
      <section className="py-32 bg-gradient-to-br from-neutral-50 via-white to-cultural-jade-50/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-32">
            <div className="inline-flex items-center space-x-3 bg-cultural-jade-50 border border-cultural-jade-200 rounded-full px-6 py-3 mb-8">
              <span className="text-cultural-jade-600 text-lg">🏛️</span>
              <span className="text-cultural-jade-700 font-semibold">权威数据支撑</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold font-heading text-neutral-800 mb-8 leading-tight">
              8大权威数据库
            </h2>
            <p className="text-2xl text-neutral-600 max-w-3xl mx-auto font-light leading-relaxed">
              整合最全面的权威数据资源
              <br />
              <span className="text-cultural-gold-600 font-medium">确保每个名字都有深厚底蕴</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                icon: '📚',
                title: '诗词典籍',
                data: '500万+',
                desc: '涵盖诗经、楚辞、唐诗、宋词等经典文学作品',
                color: 'cultural-red'
              },
              {
                icon: '📖',
                title: '康熙字典',
                data: '47,000+',
                desc: '清朝官修的汉语辞书，汉字研究的重要依据',
                color: 'info'
              },
              {
                icon: '👥',
                title: '百家姓',
                data: '504个',
                desc: '完整收录中华姓氏，确保姓名搭配和谐',
                color: 'cultural-jade'
              },
              {
                icon: '📝',
                title: '新华字典',
                data: '70,000+',
                desc: '现代汉语标准字典，确保字义准确',
                color: 'primary'
              },
              {
                icon: '✅',
                title: '规范汉字库',
                data: '8,105个',
                desc: '国家语委发布的《通用规范汉字表》',
                color: 'accent'
              },
              {
                icon: '📅',
                title: '农历万年历',
                data: '4,000年',
                desc: '精确的农历数据，支持生辰八字分析',
                color: 'cultural-jade'
              },
              {
                icon: '🔍',
                title: '重名查询',
                data: '实时',
                desc: '基于大数据的重名率分析，确保名字独特性',
                color: 'cultural-red'
              },
              {
                icon: '🤖',
                title: 'AI智能分析',
                data: '6层',
                desc: '多层级智能插件系统，科学精准取名',
                color: 'info'
              }
            ].map((item, index) => (
              <Card 
                key={index}
                hover
                className="group relative overflow-hidden border border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="p-10 text-center">
                  <div className={`w-24 h-24 mx-auto mb-8 bg-${item.color}-500 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-4xl text-white">{item.icon}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-neutral-800 mb-6 font-heading">
                    {item.title}
                  </h3>
                  
                  <div className={`text-5xl font-bold mb-6 text-${item.color}-500 font-heading`}>
                    {item.data}
                  </div>
                  
                  <p className="text-neutral-600 leading-relaxed text-lg">
                    {item.desc}
                  </p>
                </div>
                
                {/* 悬浮效果 */}
                <div className={`absolute inset-0 bg-${item.color}-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </Card>
            ))}
          </div>

          {/* 底部总结 */}
          <div className="mt-20 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
              <h3 className="text-3xl font-bold text-cultural-ink mb-8 font-heading">
                🎯 为什么我们的数据库如此重要？
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 mb-2 text-lg font-heading">权威性保证</div>
                    <div className="text-base text-gray-600 leading-relaxed">所有数据来源于官方权威机构，确保准确可靠</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xl">✓</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 mb-2 text-lg font-heading">全面性覆盖</div>
                    <div className="text-base text-gray-600 leading-relaxed">从古典文学到现代标准，涵盖取名所需的所有维度</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-xl">✓</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 mb-2 text-lg font-heading">智能化分析</div>
                    <div className="text-base text-gray-600 leading-relaxed">AI算法深度挖掘数据价值，提供个性化推荐</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6层智能插件系统展示 */}
      <section className="py-24 bg-gradient-to-br from-white via-gray-50/30 to-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading text-cultural-ink mb-6">
              🧠 6层智能插件系统
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto font-medium leading-relaxed">
              科学的分层架构，确保每个名字都经过全方位的智能分析
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  layer: 'Layer 1',
                  title: '基础信息分析',
                  desc: '性别识别、生辰解析、家族传承',
                  icon: '👤',
                  color: 'bg-blue-500',
                  plugins: ['性别插件', '生辰时间插件', '家族传统插件']
                },
                {
                  layer: 'Layer 2', 
                  title: '命理分析',
                  desc: '八字分析、五行平衡、喜用神确定',
                  icon: '⚖️',
                  color: 'bg-green-500',
                  plugins: ['八字插件', '喜用神插件', '五行平衡插件']
                },
                {
                  layer: 'Layer 3',
                  title: '文化筛选',
                  desc: '诗词典故、寓意选择、音韵分析',
                  icon: '📚',
                  color: 'bg-purple-500',
                  plugins: ['意境选择插件', '音韵选择插件', '诗词典故插件']
                },
                {
                  layer: 'Layer 4',
                  title: '字符过滤',
                  desc: '规范汉字、字形美观、笔画分析',
                  icon: '✅',
                  color: 'bg-orange-500',
                  plugins: ['字符过滤插件']
                },
                {
                  layer: 'Layer 5',
                  title: '组合生成',
                  desc: '名字组合、音律搭配、寓意融合',
                  icon: '🎨',
                  color: 'bg-pink-500',
                  plugins: ['名字组合插件', '简单名字插件']
                },
                {
                  layer: 'Layer 6',
                  title: '综合评分',
                  desc: '多维度评分、排序推荐、质量保证',
                  icon: '🏆',
                  color: 'bg-red-500',
                  plugins: ['综合评分插件', '大衍评分插件', '传统评分插件']
                }
              ].map((layer, index) => (
                <div key={index} className="relative">
                  <Card className="p-8 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 group">
                    <div className="flex items-center space-x-8">
                      <div className={`w-20 h-20 ${layer.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-3xl text-white">{layer.icon}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <span className="text-base font-mono font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                            {layer.layer}
                          </span>
                          <h3 className="text-2xl font-bold text-gray-800 font-heading">
                            {layer.title}
                          </h3>
                        </div>
                        
                        <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                          {layer.desc}
                        </p>
                        
                        <div className="flex flex-wrap gap-3">
                          {layer.plugins.map((plugin, pluginIndex) => (
                            <span 
                              key={pluginIndex}
                              className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-full border font-medium"
                            >
                              {plugin}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  {/* 连接线 */}
                  {index < 5 && (
                    <div className="flex justify-center py-4">
                      <div className="w-1 h-8 bg-gray-300 rounded-full"></div>
                      <div className="absolute w-4 h-4 bg-gray-300 rounded-full transform translate-y-3"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 快速体验区域 - 移动到这里 */}
      <section id="quick-start" className="py-24 bg-gradient-to-br from-cultural-paper via-white to-cultural-gold/10 border-t border-cultural-gold/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading text-cultural-ink mb-6">
              🎯 快速体验
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 font-medium leading-relaxed">
              填写基本信息，即刻为您的宝宝生成美好名字
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card variant="cultural" className="shadow-2xl border-2 border-cultural-gold/30 p-10">
              <div className="space-y-10">
                <div className="space-y-8">
                  <Input
                    label="宝宝姓氏"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder="请输入姓氏"
                    required
                    className="text-xl h-14"
                  />
                  
                  <div>
                    <label className="block text-xl font-semibold text-cultural-ink mb-6 font-heading">
                      宝宝性别 <span className="text-cultural-red">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-6">
                      <button
                        onClick={() => setBabyGender('male')}
                        className={`p-8 border-2 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                          babyGender === 'male'
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-200'
                            : 'border-gray-200 hover:border-cultural-gold hover:bg-cultural-paper'
                        }`}
                      >
                        <div className="text-5xl mb-4">👦</div>
                        <div className="font-semibold text-xl font-heading">男宝宝</div>
                      </button>
                      <button
                        onClick={() => setBabyGender('female')}
                        className={`p-8 border-2 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                          babyGender === 'female'
                            ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-lg shadow-pink-200'
                            : 'border-gray-200 hover:border-cultural-gold hover:bg-cultural-paper'
                        }`}
                      >
                        <div className="text-5xl mb-4">👧</div>
                        <div className="font-semibold text-xl font-heading">女宝宝</div>
                      </button>
                    </div>
                  </div>

                  <Input
                    label="出生日期（可选）"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="text-xl h-14"
                  />

                  {birthDate && zodiac && (
                    <div className="p-6 bg-cultural-jade-50 rounded-2xl border border-cultural-jade-200">
                      <p className="text-base text-cultural-jade-700 font-medium flex items-center">
                        <span className="text-2xl mr-3">🐾</span>
                        生肖：{zodiac}年 • 将根据生肖特性推荐合适的名字
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="w-full py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105"
                    disabled={!babyGender || !familyName}
                    loading={isLoading}
                    onClick={handleStartNaming}
                  >
                    {isLoading ? '正在生成美名...' : '🎨 立即生成美名'}
                  </Button>
                </div>

                {/* 提示信息 */}
                <div className="text-center text-base text-gray-500 bg-gray-50 rounded-2xl p-6">
                  <p className="flex items-center justify-center space-x-3">
                    <span className="text-xl">🔒</span>
                    <span className="font-medium">您的信息仅用于生成名字，不会被存储或分享</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 功能特色区域 */}
      <section className="py-24 bg-gradient-to-br from-cultural-jade-50/30 via-white to-cultural-gold-50/30 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          {/* 标题区域 */}
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading text-cultural-ink mb-6">
              传统文化智慧
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto font-medium leading-relaxed">
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
      <section className="py-24 bg-gradient-to-br from-cultural-paper via-white to-cultural-gold-50/50 border-t border-cultural-gold/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-cultural-ink mb-6 font-heading">为什么选择我们</h2>
            <p className="text-xl lg:text-2xl text-gray-600 font-medium leading-relaxed">专业、科学、个性化的取名服务</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 官方权威保证 */}
            <Card variant="cultural" className="text-center border-2 border-cultural-jade-200 p-8">
              <div className="bg-cultural-jade-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏛️</span>
              </div>
              <h3 className="font-bold text-cultural-jade-800 mb-4 text-xl font-heading">官方权威</h3>
              <p className="text-base text-cultural-jade-700 font-medium mb-2">严格遵循《通用规范汉字表》</p>
              <p className="text-sm text-cultural-jade-600">教育部2013年发布的国家标准</p>
            </Card>
            
            <Card variant="default" className="text-center p-8">
              <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🧩</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-4 text-xl font-heading">智能插件</h3>
              <p className="text-base text-gray-600">多层级插件系统，智能分析生成个性化名字</p>
            </Card>
            
            <Card variant="default" className="text-center p-8">
              <div className="bg-yellow-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-4 text-xl font-heading">文化传承</h3>
              <p className="text-base text-gray-600">深度解读传统文化，传承中华文明智慧</p>
            </Card>
            
            <Card variant="default" className="text-center p-8">
              <div className="bg-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-4 text-xl font-heading">快速响应</h3>
              <p className="text-base text-gray-600">纯前端实现，秒级生成结果，保护隐私</p>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}