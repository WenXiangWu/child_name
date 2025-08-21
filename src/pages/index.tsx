import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-green-600">🏛️</span>
                宝宝取名专家
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-normal">
                  规范汉字
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/naming" className="text-gray-600 hover:text-gray-800">
                  专业取名
                </Link>
                <Link href="/standard-characters" className="text-green-600 hover:text-green-800 flex items-center gap-1 font-medium">
                  <span>🏛️</span>
                  国家通用规范汉字表
                </Link>
                <Link href="/name-duplicate-check" className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
                  <span>🔍</span>
                  重名查询
                </Link>
                <Link href="/text-converter" className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
                  <span>🔄</span>
                  简繁转换
                </Link>
                <Link href="/poetry" className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
                  <span>📚</span>
                  诗词典籍
                </Link>
                <Link href="/baijiaxing" className="text-amber-600 hover:text-amber-800 flex items-center gap-1">
                  <span>📜</span>
                  百家姓
                </Link>
                <Link href="/culture/overview" className="text-gray-600 hover:text-gray-800">
                  文化科普
                </Link>
                <Link href="/culture/lunar-calendar" className="text-red-600 hover:text-red-800 flex items-center gap-1">
                  <span>🏮</span>
                  农历万年历
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-800">
                  关于我们
                </Link>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            为您的宝宝
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
              取个好名字
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            <span className="font-semibold text-green-700">严格遵循《通用规范汉字表》国家标准</span>，结合传统文化智慧与现代科学方法，为新生儿提供专业、个性化、有文化内涵的名字推荐
          </p>
          
          {/* 🎯 新增：通用规范汉字表官方保证 */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-green-800">
                  官方权威保证
                </h3>
              </div>
            </div>
            <div className="text-center">
              <p className="text-green-700 mb-3">
                <span className="font-medium">严格遵循《通用规范汉字表》</span>
                - 2013年中华人民共和国教育部发布的国家标准
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-green-600">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  8,105个标准汉字
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  597个多音字数据
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  3,009条简繁转换
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  100%规范汉字保证
                </div>
              </div>
            </div>
          </div>
          {/* 传统文化特色 */}
          <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">传统文化智慧</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  结合传统文化智慧与现代科学方法，为新生儿提供专业、个性化、有文化内涵的名字推荐
                </p>
              </div>

              {/* 滚动展示的五种取名方式 */}
              <div className="relative overflow-hidden rounded-2xl border-4 border-red-500 bg-white/80 backdrop-blur-sm">
                <div 
                  className="flex gap-8 p-8 animate-scroll hover:pause-animation"
                  style={{
                    width: 'calc(100% * 2)',
                    animation: 'scroll 25s linear infinite'
                  }}
                >
                  {/* 重复两次卡片以实现无缝滚动 */}
                  {Array.from({ length: 2 }).map((_, repeatIndex) => (
                    <div key={repeatIndex} className="flex gap-8 min-w-full">
                      {/* 三才五格分析 */}
                      <Link href="/culture/sancai-wuge" className="group min-w-[300px]">
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-100 group-hover:from-purple-100 group-hover:to-indigo-200 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🔮</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">三才五格分析</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            基于传统姓名学理论，精确计算三才五格数理，确保名字蕴含美好寓意与运势。
                          </p>
                          <div className="mt-4 text-purple-600 text-sm font-medium group-hover:text-purple-700">
                            了解更多 →
                          </div>
                        </div>
                      </Link>

                      {/* 五行平衡 */}
                      <Link href="/culture/wuxing-balance" className="group min-w-[300px]">
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 group-hover:from-emerald-100 group-hover:to-teal-200 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                            <span className="text-2xl">⚖️</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">五行平衡</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            根据生辰信息分析五行属性，确保名字协调平衡，符合个人命理特征。
                          </p>
                          <div className="mt-4 text-emerald-600 text-sm font-medium group-hover:text-emerald-700">
                            了解更多 →
                          </div>
                        </div>
                      </Link>

                      {/* 音韵美感 */}
                      <Link href="/culture/phonetic-beauty" className="group min-w-[300px]">
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-rose-50 to-pink-100 group-hover:from-rose-100 group-hover:to-pink-200 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🎵</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">音韵美感</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            分析声调搭配，确保名字读音优美和谐，朗朗上口，富有音律美感。
                          </p>
                          <div className="mt-4 text-rose-600 text-sm font-medium group-hover:text-rose-700">
                            了解更多 →
                          </div>
                        </div>
                      </Link>

                      {/* 八字喜用神 */}
                      <Link href="/culture/bazi-xiyongshen" className="group min-w-[300px]">
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-100 group-hover:from-orange-100 group-hover:to-red-200 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🔥</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">八字喜用神</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            基于出生时刻精准分析命局，确定五行喜忌，实现个性化精准补益。
                          </p>
                          <div className="mt-4 text-orange-600 text-sm font-medium group-hover:text-orange-700">
                            了解更多 →
                          </div>
                        </div>
                      </Link>

                      {/* 意境底蕴派 */}
                      <Link href="/culture/cultural-heritage" className="group min-w-[300px]">
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-100 group-hover:from-amber-100 group-hover:to-yellow-200 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📚</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">意境底蕴派</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            从经史子集中汲取智慧，将深厚文化内涵融入姓名，承载千年文脉。
                          </p>
                          <div className="mt-4 text-amber-600 text-sm font-medium group-hover:text-amber-700">
                            了解更多 →
                          </div>
                        </div>
                      </Link>

                      {/* 生肖取名 */}
                      <Link href="/culture/zodiac-naming" className="group min-w-[300px]">
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-lime-50 to-green-100 group-hover:from-lime-100 group-hover:to-green-200 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-lime-500 to-green-600 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🐲</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">生肖取名</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            根据十二生肖特性与五行理论，结合汉字字根象征意义，为宝宝选择符合生肖特征的美好名字。
                          </p>
                          <div className="mt-4 text-lime-600 text-sm font-medium group-hover:text-lime-700">
                            了解更多 →
                          </div>
                        </div>
                      </Link>

                      {/* 诗词典籍 */}
                      <Link href="/poetry" className="group min-w-[300px]">
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-100 group-hover:from-cyan-100 group-hover:to-blue-200 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📖</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">诗词典籍</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            浏览收录的诗经、楚辞、唐诗、宋词等经典诗词，为取名提供灵感源泉。
                          </p>
                          <div className="mt-4 text-cyan-600 text-sm font-medium group-hover:text-cyan-700">
                            浏览典籍 →
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <style jsx>{`
                @keyframes scroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                  animation: scroll 25s linear infinite;
                }
                .pause-animation:hover .animate-scroll {
                  animation-play-state: paused;
                }
              `}</style>
            </div>
          </section>
        </div>
      </section>

      {/* 快速开始 */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">快速开始取名</h2>
            <p className="text-gray-600">简单几步，为您的宝宝生成专业的名字推荐</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 基本信息 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    宝宝姓氏 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder="请输入姓氏"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    宝宝性别 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setBabyGender('male')}
                      className={`p-4 rounded-lg border-2 transition-all ${babyGender === 'male'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="text-2xl mb-2">👦</div>
                      <div className="font-medium">男宝宝</div>
                    </button>
                    <button
                      onClick={() => setBabyGender('female')}
                      className={`p-4 rounded-lg border-2 transition-all ${babyGender === 'female'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="text-2xl mb-2">👧</div>
                      <div className="font-medium">女宝宝</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    出生日期 <span className="text-gray-400">(可选)</span>
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        max={new Date().toISOString().split('T')[0]}
                      />
                      <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                        📅
                      </div>
                    </div>
                    
                    {/* 快速日期选择 */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {(() => {
                        const today = new Date();
                        const yesterday = new Date(today);
                        yesterday.setDate(today.getDate() - 1);
                        const weekAgo = new Date(today);
                        weekAgo.setDate(today.getDate() - 7);
                        const monthAgo = new Date(today);
                        monthAgo.setMonth(today.getMonth() - 1);
                        
                        return [
                          { date: today.toISOString().split('T')[0], label: '今天' },
                          { date: yesterday.toISOString().split('T')[0], label: '昨天' },
                          { date: weekAgo.toISOString().split('T')[0], label: '一周前' },
                          { date: monthAgo.toISOString().split('T')[0], label: '一月前' },
                          { date: '2024-01-01', label: '2024年初' },
                          { date: '2023-12-31', label: '2023年末' }
                        ];
                      })().map((preset) => (
                        <button
                          key={preset.date}
                          onClick={() => setBirthDate(preset.date)}
                          className={`px-2 py-1 rounded border text-center transition-all ${
                            birthDate === preset.date
                              ? 'bg-green-100 border-green-300 text-green-700'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {birthDate && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-700 font-medium">
                        选择的日期：{new Date(birthDate).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </p>
                      {zodiac && (
                        <p className="text-xs text-green-600 mt-1">
                          🐾 生肖：{zodiac}年
                        </p>
                      )}
                      <p className="text-xs text-green-600">
                        生辰八字计算将基于此日期时间
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    出生时间 <span className="text-gray-400">(可选)</span>
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="time"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        step="900"
                      />
                      <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                        🕐
                      </div>
                    </div>
                    
                    {/* 快速时间选择 - 完整十二时辰 */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-600 font-medium mb-2">传统十二时辰快速选择：</div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        {[
                          { time: '00:00', label: '子时', desc: '夜半' },
                          { time: '01:00', label: '丑时', desc: '鸡鸣' },
                          { time: '03:00', label: '寅时', desc: '平旦' },
                          { time: '05:00', label: '卯时', desc: '日出' },
                          { time: '07:00', label: '辰时', desc: '食时' },
                          { time: '09:00', label: '巳时', desc: '隅中' },
                          { time: '11:00', label: '午时', desc: '日中' },
                          { time: '13:00', label: '未时', desc: '日昳' },
                          { time: '15:00', label: '申时', desc: '晡时' },
                          { time: '17:00', label: '酉时', desc: '日入' },
                          { time: '19:00', label: '戌时', desc: '黄昏' },
                          { time: '21:00', label: '亥时', desc: '人定' }
                        ].map((preset) => (
                          <button
                            key={preset.time}
                            onClick={() => setBirthTime(preset.time)}
                            className={`px-2 py-2 rounded border text-center transition-all hover:shadow-sm ${
                              birthTime === preset.time
                                ? 'bg-blue-100 border-blue-300 text-blue-700 shadow-sm'
                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                            }`}
                            title={`${preset.label} (${preset.desc}) - ${preset.time}`}
                          >
                            <div className="font-medium">{preset.label}</div>
                            <div className="text-xs opacity-75">{preset.time}</div>
                          </button>
                        ))}
                      </div>
                      
                      {/* 现代时间快速选择 */}
                      <div className="pt-2 border-t border-gray-200">
                        <div className="text-xs text-gray-600 font-medium mb-2">现代时间快速选择：</div>
                        <div className="grid grid-cols-6 gap-2 text-xs">
                          {[
                            { time: '06:00', label: '早晨', icon: '🌅' },
                            { time: '08:00', label: '上班', icon: '💼' },
                            { time: '12:00', label: '中午', icon: '☀️' },
                            { time: '14:00', label: '午后', icon: '🌤️' },
                            { time: '18:00', label: '傍晚', icon: '🌆' },
                            { time: '22:00', label: '夜晚', icon: '🌙' }
                          ].map((preset) => (
                            <button
                              key={preset.time}
                              onClick={() => setBirthTime(preset.time)}
                              className={`px-2 py-2 rounded border text-center transition-all ${
                                birthTime === preset.time
                                  ? 'bg-green-100 border-green-300 text-green-700'
                                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                              }`}
                              title={`${preset.label} - ${preset.time}`}
                            >
                              <div className="text-lg mb-1">{preset.icon}</div>
                              <div className="font-medium">{preset.label}</div>
                              <div className="text-xs opacity-75">{preset.time}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {birthTime && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700 font-medium">
                        选择的时间：{birthTime}
                      </p>
                      <p className="text-xs text-blue-600">
                        对应时辰：{getTimeDescription(birthTime)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col justify-center space-y-4">
                {/* 诗词取名 - 新增的特色功能 */}
                <Link
                  href={babyGender && familyName ? `/poetry-naming?gender=${babyGender}&familyName=${familyName}${birthDate ? `&birthDate=${birthDate}` : ''}${birthTime ? `&birthTime=${birthTime}` : ''}` : '#'}
                  className={`text-center px-8 py-4 rounded-lg font-medium transition-all ${babyGender && familyName
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  onClick={(e) => {
                    if (!babyGender || !familyName) {
                      e.preventDefault();
                      alert('请先填写姓氏和选择性别');
                    }
                  }}
                >
                  ✨ 诗词取名 (特色推荐)
                </Link>

                {/* 智能插件系统取名 */}
                <button
                  onClick={() => {
                    if (!babyGender) return;
                    setIsLoading(true);
                    const params = new URLSearchParams({
                      familyName: familyName || '王',
                      gender: babyGender,
                      useTraditional: 'false',
                      scoreThreshold: '85',
                      usePlugin: 'true'
                    });
                    if (birthDate) params.set('birthDate', birthDate);
                    if (birthTime) params.set('birthTime', birthTime);
                    router.push(`/qiming-results?${params.toString()}`);
                  }}
                  disabled={!babyGender || isLoading}
                  className={`px-8 py-3 rounded-lg font-medium border-2 transition-all ${babyGender && !isLoading
                      ? 'border-green-600 text-green-600 hover:bg-green-50 bg-green-25'
                      : 'border-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg">🧩 智能插件系统</span>
                    <span className="text-xs text-gray-500 mt-1">多维度分析 | 个性化推荐</span>
                  </div>
                </button>

                {/* 传统模式取名 */}
                <button
                  onClick={() => {
                    if (!babyGender) return;
                    setIsLoading(true);
                    const params = new URLSearchParams({
                      familyName: familyName || '王',
                      gender: babyGender,
                      useTraditional: 'false',
                      scoreThreshold: '85',
                      usePlugin: 'false'
                    });
                    if (birthDate) params.set('birthDate', birthDate);
                    if (birthTime) params.set('birthTime', birthTime);
                    router.push(`/qiming-results?${params.toString()}`);
                  }}
                  disabled={!babyGender || isLoading}
                  className={`px-8 py-3 rounded-lg font-medium border-2 transition-all ${babyGender && !isLoading
                      ? 'border-blue-600 text-blue-600 hover:bg-blue-50 bg-blue-25'
                      : 'border-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg">🏛️ 传统算法</span>
                    <span className="text-xs text-gray-500 mt-1">稳定可靠 | 速度快</span>
                  </div>
                </button>

                {/* 专业取名入口 */}
                <Link
                  href={babyGender && familyName ? `/naming?gender=${babyGender}&familyName=${familyName}${birthDate ? `&birthDate=${birthDate}` : ''}${birthTime ? `&birthTime=${birthTime}` : ''}` : '/naming'}
                  className={`text-center px-6 py-2 rounded-lg font-medium border transition-all ${babyGender && familyName
                      ? 'border-gray-400 text-gray-600 hover:bg-gray-50'
                      : 'border-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  onClick={(e) => {
                    if (!babyGender || !familyName) {
                      e.preventDefault();
                      alert('请先填写姓氏和选择性别');
                    }
                  }}
                >
                  📊 专业详细分析
                </Link>

                {/* 取名方式说明 */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-center text-sm font-semibold text-gray-700 mb-3">取名方式对比</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <div className="flex items-center mb-2">
                        <span className="text-green-600 mr-1">🧩</span>
                        <span className="font-medium text-green-800">智能插件系统</span>
                      </div>
                      <ul className="text-green-700 space-y-1">
                        <li>• 多层级插件分析（生肖、五行、八字等）</li>
                        <li>• 支持出生日期时间，精准八字分析</li>
                        <li>• 高度个性化，基于具体信息定制</li>
                        <li>• 出错时不会自动降级，确保透明</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                      <div className="flex items-center mb-2">
                        <span className="text-blue-600 mr-1">🏛️</span>
                        <span className="font-medium text-blue-800">传统算法</span>
                      </div>
                      <ul className="text-blue-700 space-y-1">
                        <li>• 经典三才五格算法</li>
                        <li>• 速度快，稳定可靠</li>
                        <li>• 基于优质名字库，适合快速需求</li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-center text-xs text-gray-500 mt-3">
                    <div className="flex items-center justify-center gap-4">
                      <span className="flex items-center gap-1">
                        <span className="text-green-600">🏛️</span>
                        <span>100%规范汉字保证</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-purple-600">📚</span>
                        <span>诗词取名支持</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 功能亮点 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">为什么选择我们</h2>
            <p className="text-gray-600">专业、科学、个性化的取名服务</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 🎯 重点突出：官方权威保证 */}
            <div className="text-center border-2 border-green-200 rounded-xl p-6 bg-green-50">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="font-semibold text-green-800 mb-2">官方权威</h3>
              <p className="text-sm text-green-700 font-medium">严格遵循《通用规范汉字表》</p>
              <p className="text-xs text-green-600 mt-1">教育部2013年发布的国家标准</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧩</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">智能插件</h3>
              <p className="text-sm text-gray-600">多层级插件系统，智能分析生成个性化名字</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">文化传承</h3>
              <p className="text-sm text-gray-600">深度解读传统文化，传承中华文明智慧</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">快速响应</h3>
              <p className="text-sm text-gray-600">纯前端实现，秒级生成结果，保护隐私</p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">宝宝取名专家</h3>
              <p className="text-gray-400 text-sm">
                专业的宝宝取名服务，结合传统文化与现代科技，为每个家庭提供最适合的名字。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">快速链接</h3>
              <div className="space-y-2">
                <Link href="/naming" className="block text-gray-400 hover:text-white text-sm">
                  专业取名
                </Link>
                <Link href="/cultural-info" className="block text-gray-400 hover:text-white text-sm">
                  文化科普
                </Link>
                <Link href="/about" className="block text-gray-400 hover:text-white text-sm">
                  关于我们
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">联系我们</h3>
              <div className="text-gray-400 text-sm space-y-1">
                <div>📧 contact@babyname.com</div>
                <div>📱 400-888-8888</div>
                <div>🕒 7×24小时在线服务</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 宝宝取名专家. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}