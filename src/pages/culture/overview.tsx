import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

const CultureOverviewPage: React.FC = () => {
  const namingMethods = [
    {
      id: 'sancai-wuge',
      title: '三才五格分析',
      subtitle: '解密姓名中的数理奥秘',
      description: '从日本熊崎健翁的系统化整理到中华传统文化的深厚底蕴，探索姓名学中最具影响力的数理分析体系。',
      icon: '🔮',
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-600',
      bgGradient: 'from-purple-50 to-indigo-100',
      features: ['五维数理分析', '科学计算方法', '深厚文化底蕴'],
      path: '/culture/sancai-wuge'
    },
    {
      id: 'wuxing-balance',
      title: '五行平衡',
      subtitle: '和谐统一的能量调衡',
      description: '根据生辰八字分析五行属性，通过姓名调节人体能量平衡，实现命理与姓名的完美融合。',
      icon: '⚖️',
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-100',
      features: ['命理分析', '五行调衡', '个性化方案'],
      path: '/culture/wuxing-balance'
    },
    {
      id: 'phonetic-beauty',
      title: '音韵美感',
      subtitle: '声律之美的诗意表达',
      description: '分析声调格律、音韵搭配与节奏美感，确保名字不仅寓意深刻，更要读音优美、朗朗上口。',
      icon: '🎵',
      color: 'rose',
      gradient: 'from-rose-500 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-100',
      features: ['声调搭配', '音律分析', '诗韵美感'],
      path: '/culture/phonetic-beauty'
    },
    {
      id: 'bazi-xiyongshen',
      title: '八字喜用神',
      subtitle: '精准调衡的命理艺术',
      description: '源于唐代李虚中《命书》，通过分析出生时刻的五行强弱，确定最需补充的能量属性。',
      icon: '🔥',
      color: 'orange',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-100',
      features: ['精准诊断', '能量调衡', '因人制宜'],
      path: '/culture/bazi-xiyongshen'
    },
    {
      id: 'cultural-heritage',
      title: '意境底蕴派',
      subtitle: '穿越千年的取名智慧',
      description: '从《论语》到《史记》的血脉传承，从诗词歌赋到经史百家，将典籍精华熔铸于方寸之名。',
      icon: '📚',
      color: 'amber',
      gradient: 'from-amber-500 to-yellow-600',
      bgGradient: 'from-amber-50 to-yellow-100',
      features: ['经史为基', '诗词为翼', '意境深远'],
      path: '/culture/cultural-heritage'
    },
    {
      id: 'zodiac-naming',
      title: '生肖姓名学',
      subtitle: '传统智慧的现代传承',
      description: '根据十二生肖特性与五行理论，结合汉字字根象征意义，为宝宝选择符合生肖特征的美好名字。',
      icon: '🐲',
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-100',
      features: ['生肖特性', '五行调和', '字根分析'],
      path: '/culture/zodiac-naming'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>传统文化取名方法汇总 - 宝宝取名专家</title>
        <meta name="description" content="深入了解六大传统取名流派：三才五格、五行平衡、音韵美感、八字喜用神、意境底蕴派、生肖姓名学，掌握中华文化的取名智慧。" />
        <meta name="keywords" content="传统文化,取名方法,三才五格,五行平衡,音韵美感,八字喜用神,意境底蕴,生肖姓名学" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* 英雄区域 */}
        <div className="pt-20 pb-16 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute top-20 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-10 left-1/3 w-40 h-40 border border-white/20 rounded-full"></div>
            <div className="absolute top-1/4 right-1/4 text-8xl opacity-5">🏛️</div>
            <div className="absolute bottom-1/4 left-1/4 text-8xl opacity-5">📚</div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                六大取名流派完整解析
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              传统文化智慧
            </h1>
            <div className="text-2xl md:text-3xl font-medium mb-4 text-blue-100">
              结合传统文化智慧与现代科学方法
            </div>
            <p className="text-lg text-blue-200 max-w-4xl mx-auto mb-8 leading-relaxed">
              深入探索中华传统文化中的六大取名流派，从数理分析到文化传承，
              从声韵美感到命理调衡，再到生肖特性，为新生儿提供专业、个性化、有文化内涵的名字推荐。
            </p>
            
            {/* 统计数据 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl font-bold text-blue-200 mb-2">5000+</div>
                <div className="text-sm text-blue-300">年文化传承</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl font-bold text-purple-200 mb-2">6</div>
                <div className="text-sm text-purple-300">大取名流派</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl font-bold text-pink-200 mb-2">100万+</div>
                <div className="text-sm text-pink-300">成功案例</div>
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* 面包屑导航 */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-gray-800 transition-colors">首页</Link>
            <span>›</span>
            <span className="text-gray-800 font-medium">传统文化取名方法</span>
          </div>

          {/* 取名方法网格 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {namingMethods.map((method, index) => (
              <Link key={method.id} href={method.path} className="group">
                <div className={`bg-gradient-to-br ${method.bgGradient} p-8 rounded-2xl border border-${method.color}-200 group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-${method.color}-300`}>
                  <div className="flex items-start space-x-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${method.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{method.icon}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold text-${method.color}-800 mb-2 group-hover:text-${method.color}-900 transition-colors`}>
                        {method.title}
                      </h3>
                      <div className={`text-lg text-${method.color}-600 mb-3 font-medium`}>
                        {method.subtitle}
                      </div>
                      <p className={`text-${method.color}-700 leading-relaxed mb-4 text-sm`}>
                        {method.description}
                      </p>
                      
                      {/* 特色功能 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {method.features.map((feature, i) => (
                          <span 
                            key={i}
                            className={`px-3 py-1 bg-white text-${method.color}-600 text-xs rounded-full border border-${method.color}-200`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      <div className={`text-${method.color}-600 text-sm font-medium group-hover:text-${method.color}-700 transition-colors`}>
                        深入了解 →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 学习指南 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">📖 学习指南</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-bold text-blue-800 mb-2">新手入门</h3>
                <p className="text-sm text-blue-600 mb-3">
                  建议从三才五格开始，了解数理分析的基本原理
                </p>
                <Link 
                  href="/culture/sancai-wuge"
                  className="text-blue-700 text-xs font-medium hover:text-blue-800"
                >
                  开始学习 →
                </Link>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                <div className="text-3xl mb-3">⚖️</div>
                <h3 className="text-lg font-bold text-green-800 mb-2">进阶提升</h3>
                <p className="text-sm text-green-600 mb-3">
                  学习五行平衡与八字喜用神，掌握命理调衡
                </p>
                <Link 
                  href="/culture/wuxing-balance"
                  className="text-green-700 text-xs font-medium hover:text-green-800"
                >
                  深入学习 →
                </Link>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-3xl mb-3">🎭</div>
                <h3 className="text-lg font-bold text-purple-800 mb-2">文化修养</h3>
                <p className="text-sm text-purple-600 mb-3">
                  探索意境底蕴派，体验深厚的文化底蕴
                </p>
                <Link 
                  href="/culture/cultural-heritage"
                  className="text-purple-700 text-xs font-medium hover:text-purple-800"
                >
                  文化探索 →
                </Link>
              </div>

              <div className="text-center p-6 bg-rose-50 rounded-xl border border-rose-200">
                <div className="text-3xl mb-3">🎵</div>
                <h3 className="text-lg font-bold text-rose-800 mb-2">美感提升</h3>
                <p className="text-sm text-rose-600 mb-3">
                  学习音韵美感，让名字更加动听优美
                </p>
                <Link 
                  href="/culture/phonetic-beauty"
                  className="text-rose-700 text-xs font-medium hover:text-rose-800"
                >
                  美感学习 →
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-3xl mb-3">🐲</div>
                <h3 className="text-lg font-bold text-emerald-800 mb-2">生肖文化</h3>
                <p className="text-sm text-emerald-600 mb-3">
                  探索生肖姓名学，融合传统智慧与现代需求
                </p>
                <Link 
                  href="/culture/zodiac-naming"
                  className="text-emerald-700 text-xs font-medium hover:text-emerald-800"
                >
                  生肖探索 →
                </Link>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">综合应用</h3>
                <p className="text-sm text-gray-600 mb-3">
                  结合多种方法，打造最适合的取名方案
                </p>
                <Link 
                  href="/generate"
                  className="text-gray-700 text-xs font-medium hover:text-gray-800"
                >
                  智能取名 →
                </Link>
              </div>
            </div>
          </div>

          {/* 核心优势 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">🌟 为什么选择传统文化取名？</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🏛️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">深厚底蕴</h3>
                <p className="text-gray-600">
                  传承五千年文化精髓，每个名字都承载着深厚的历史文化内涵，
                  让孩子从小就与中华文明建立联系。
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🔬</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">科学方法</h3>
                <p className="text-gray-600">
                  结合现代科学技术，对传统理论进行数字化分析和优化，
                  确保取名方法既有文化内涵又符合现代需求。
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">个性定制</h3>
                <p className="text-gray-600">
                  根据每个孩子的具体情况，量身定制最适合的取名方案，
                  确保名字既有个人特色又符合家庭期望。
                </p>
              </div>
            </div>
          </div>

          {/* 开始使用 */}
          <div className="text-center bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">🚀 开始您的取名之旅</h2>
              <p className="text-lg text-gray-600 mb-8">
                选择最适合您的取名方式，为您的宝宝起一个既有文化内涵又寓意美好的名字
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/generate"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  🎯 智能取名
                </Link>
                <Link 
                  href="/culture/sancai-wuge"
                  className="px-8 py-4 bg-transparent border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                >
                  📚 深度学习
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 页面底部 */}
        <div className="bg-gradient-to-r from-gray-100 to-blue-100 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-4">
              🎓 传统文化与现代科学的完美融合
            </div>
            <div className="text-gray-600">
              理性传承，科学应用，让古老智慧在新时代焕发生机
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CultureOverviewPage;