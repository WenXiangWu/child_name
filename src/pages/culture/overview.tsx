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
      gradient: 'from-purple-500 to-indigo-600',
      features: ['五维数理分析', '科学计算方法', '深厚文化底蕴'],
      path: '/culture/sancai-wuge'
    },
    {
      id: 'wuxing-balance',
      title: '五行平衡',
      subtitle: '和谐统一的能量调衡',
      description: '根据生辰八字分析五行属性，通过姓名调节人体能量平衡，实现命理与姓名的完美融合。',
      icon: '⚖️',
      gradient: 'from-cultural-jade-500 to-green-600',
      features: ['命理分析', '五行调衡', '个性化方案'],
      path: '/culture/wuxing-balance'
    },
    {
      id: 'phonetic-beauty',
      title: '音韵美感',
      subtitle: '声律之美的诗意表达',
      description: '分析声调格律、音韵搭配与节奏美感，确保名字不仅寓意深刻，更要读音优美、朗朗上口。',
      icon: '🎵',
      gradient: 'from-pink-500 to-rose-600',
      features: ['声调搭配', '音律分析', '诗韵美感'],
      path: '/culture/phonetic-beauty'
    },
    {
      id: 'bazi-xiyongshen',
      title: '八字喜用神',
      subtitle: '精准调衡的命理艺术',
      description: '源于唐代李虚中《命书》，通过分析出生时刻的五行强弱，确定最需补充的能量属性。',
      icon: '🔥',
      gradient: 'from-cultural-red-500 to-red-600',
      features: ['精准诊断', '能量调衡', '因人制宜'],
      path: '/culture/bazi-xiyongshen'
    },
    {
      id: 'cultural-heritage',
      title: '意境底蕴派',
      subtitle: '穿越千年的取名智慧',
      description: '从《论语》到《史记》的血脉传承，从诗词歌赋到经史百家，将典籍精华熔铸于方寸之名。',
      icon: '📚',
      gradient: 'from-cultural-gold-500 to-amber-600',
      features: ['经史为基', '诗词为翼', '意境深远'],
      path: '/culture/cultural-heritage'
    },
    {
      id: 'zodiac-naming',
      title: '生肖姓名学',
      subtitle: '传统智慧的现代传承',
      description: '根据十二生肖特性与五行理论，结合汉字字根象征意义，为宝宝选择符合生肖特征的美好名字。',
      icon: '🐲',
      gradient: 'from-blue-500 to-indigo-600',
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

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
        {/* 英雄区域 - 与主页保持一致的设计风格 */}
        <section className="relative bg-gradient-to-br from-gray-50 via-white to-slate-50 overflow-hidden py-20 lg:py-32">
          {/* 简约背景装饰 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-20 w-24 h-24 border border-gray-200 rounded-full"></div>
            <div className="absolute bottom-32 left-20 w-16 h-16 bg-gray-100 rounded-full"></div>
          </div>
          
          <div className="relative max-w-8xl mx-auto px-10 text-center">
            <div className="space-y-12">
              {/* 主标题区域 */}
              <div className="space-y-8">
                <h1 className="text-5xl lg:text-6xl font-bold font-heading text-slate-800 leading-tight tracking-tight">
                  传统文化智慧
                  <span className="text-amber-600 ml-4">
                    传承千年
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                  深入探索中华传统文化中的六大取名流派，为新生儿提供专业、个性化、有文化内涵的名字推荐
                </p>
              </div>

              {/* 统计数据 - 与主页保持一致的设计 */}
              <div className="bg-gradient-to-r from-cultural-paper via-white to-cultural-jade-50/30 rounded-3xl p-8 shadow-xl border border-cultural-gold/20">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
                  {[
                    { number: '5000+', label: '年文化传承', icon: '🏛️' },
                    { number: '6大', label: '取名流派', icon: '📚' },
                    { number: '专业权威', label: '传统精髓', icon: '🎯' }
                  ].map((stat, index) => (
                    <div key={index} className="group">
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className="text-3xl lg:text-4xl font-bold text-amber-600 font-heading mb-2 group-hover:scale-110 transition-transform duration-300">
                        {stat.number}
                      </div>
                      <div className="text-sm lg:text-base text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 主要内容 */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* 面包屑导航 */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-gray-800 transition-colors">首页</Link>
            <span>›</span>
            <span className="text-gray-800 font-medium">传统文化取名方法</span>
          </div>

          {/* 取名方法网格 - 使用与主页一致的卡片设计 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {namingMethods.map((method, index) => (
              <Link key={method.id} href={method.path} className="group">
                <div className="bg-white p-8 rounded-2xl border border-gray-200 group-hover:shadow-xl transition-all duration-300 group-hover:border-gray-300 h-full">
                  <div className="text-center space-y-6">
                    <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${method.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl text-white">{method.icon}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 font-heading group-hover:text-cultural-ink transition-colors">
                        {method.title}
                      </h3>
                      <div className="text-lg text-amber-600 mb-3 font-medium">
                        {method.subtitle}
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {method.description}
                      </p>
                    </div>
                    
                    {/* 特色功能 - 简化设计 */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {method.features.map((feature, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-amber-600 text-sm font-medium group-hover:text-amber-700 transition-colors">
                      深入了解 →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 学习指南 - 简化设计，使用统一样式 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-gray-200">
            <h2 className="text-3xl font-bold text-cultural-ink mb-8 text-center font-heading">
              📖 学习指南
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: '🎯',
                  title: '新手入门',
                  desc: '建议从三才五格开始，了解数理分析的基本原理',
                  link: '/culture/sancai-wuge',
                  linkText: '开始学习'
                },
                {
                  icon: '⚖️',
                  title: '进阶提升',
                  desc: '学习五行平衡与八字喜用神，掌握命理调衡',
                  link: '/culture/wuxing-balance',
                  linkText: '深入学习'
                },
                {
                  icon: '🎭',
                  title: '文化修养',
                  desc: '探索意境底蕴派，体验深厚的文化底蕴',
                  link: '/culture/cultural-heritage',
                  linkText: '文化探索'
                },
                {
                  icon: '🎵',
                  title: '美感提升',
                  desc: '学习音韵美感，让名字更加动听优美',
                  link: '/culture/phonetic-beauty',
                  linkText: '美感学习'
                },
                {
                  icon: '🐲',
                  title: '生肖文化',
                  desc: '探索生肖姓名学，融合传统智慧与现代需求',
                  link: '/culture/zodiac-naming',
                  linkText: '生肖探索'
                },
                {
                  icon: '🔄',
                  title: '综合应用',
                  desc: '结合多种方法，打造最适合的取名方案',
                  link: '/generate',
                  linkText: '智能取名'
                }
              ].map((guide, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 group">
                  <div className="text-3xl mb-4">{guide.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 font-heading">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {guide.desc}
                  </p>
                  <Link 
                    href={guide.link}
                    className="text-amber-600 text-sm font-medium hover:text-amber-700 transition-colors"
                  >
                    {guide.linkText} →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* 核心优势 - 与主页面保持一致的设计 */}
          <div className="bg-gradient-to-r from-cultural-paper via-white to-cultural-jade-50/30 rounded-2xl p-8 mb-16 border border-cultural-gold/20">
            <h2 className="text-3xl font-bold text-cultural-ink mb-8 text-center font-heading">
              🌟 为什么选择传统文化取名？
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🏛️',
                  title: '深厚底蕴',
                  desc: '传承五千年文化精髓，每个名字都承载着深厚的历史文化内涵，让孩子从小就与中华文明建立联系。',
                  color: 'bg-cultural-red-500'
                },
                {
                  icon: '🔬',
                  title: '科学方法',
                  desc: '结合现代科学技术，对传统理论进行数字化分析和优化，确保取名方法既有文化内涵又符合现代需求。',
                  color: 'bg-blue-500'
                },
                {
                  icon: '🎯',
                  title: '个性定制',
                  desc: '根据每个孩子的具体情况，量身定制最适合的取名方案，确保名字既有个人特色又符合家庭期望。',
                  color: 'bg-cultural-jade-500'
                }
              ].map((advantage, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${advantage.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <span className="text-2xl text-white">{advantage.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-cultural-ink mb-3 font-heading">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {advantage.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 开始使用 - 与主页面保持一致的设计 */}
          <div className="text-center bg-white rounded-2xl shadow-xl p-12 border border-gray-200">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-cultural-ink mb-6 font-heading">
                🚀 开始您的取名之旅
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                选择最适合您的取名方式，为您的宝宝起一个既有文化内涵又寓意美好的名字
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/naming"
                  className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  🎯 立即开始取名
                </Link>
                <Link 
                  href="/culture/sancai-wuge"
                  className="px-8 py-4 bg-white border-2 border-amber-600 text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-all duration-300"
                >
                  📚 深度学习
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 页面底部 - 简化设计 */}
        <div className="bg-gradient-to-r from-cultural-paper via-white to-cultural-jade-50/30 py-12 border-t border-gray-200/60">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-2xl font-bold text-cultural-ink mb-4 font-heading">
              🎓 传统文化与现代科学的完美融合
            </div>
            <div className="text-gray-600 leading-relaxed">
              理性传承，科学应用，让古老智慧在新时代焕发生机
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CultureOverviewPage;