import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui';
import Link from 'next/link';

const ToolsPage: React.FC = () => {
  const tools = [
    {
      href: '/tools/name-analysis',
      icon: '📊',
      title: '姓名综合分析',
      description: '多维度专业分析，五格数理、音韵美感、字义寓意全面解读',
      color: 'from-cultural-red to-red-600',
      bgColor: 'from-cultural-red-50 to-red-100',
      category: '专业分析',
      features: ['五格数理', '音韵分析', '字义解读']
    },
    {
      href: '/name-duplicate-check',
      icon: '🔍',
      title: '重名查询',
      description: '基于大数据分析，精准查询名字重名情况，确保独特性',
      color: 'from-cultural-jade to-emerald-600',
      bgColor: 'from-cultural-jade-50 to-emerald-100',
      category: '查询工具',
      features: ['重名统计', '地域分布', '年龄分析']
    },
    {
      href: '/xinhua-dict',
      icon: '📚',
      title: '新华字典',
      description: '权威汉字释义查询，深入了解每个字的文化内涵和含义',
      color: 'from-cultural-gold to-amber-600',
      bgColor: 'from-cultural-gold-50 to-amber-100',
      category: '文化工具',
      features: ['字义解释', '词组搭配', '文化典故']
    },
    {
      href: '/standard-characters',
      icon: '🏛️',
      title: '规范汉字表',
      description: '国家通用规范汉字表查询，确保用字规范性和权威性',
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'from-indigo-50 to-blue-100',
      category: '权威标准',
      features: ['8105个汉字', '三级分类', '官方标准']
    },
    {
      href: '/culture/lunar-calendar',
      icon: '🏮',
      title: '农历万年历',
      description: '传统农历查询工具，公历农历转换，节气时令一目了然',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-100',
      category: '传统文化',
      features: ['公农历转换', '二十四节气', '传统节日']
    },
    {
      href: '/plugin-execution-flow',
      icon: '🔧',
      title: '取名流程',
      description: '智能取名插件执行流程展示，了解专业取名的科学过程',
      color: 'from-teal-500 to-cyan-600',
      bgColor: 'from-teal-50 to-cyan-100',
      category: '系统工具',
      features: ['流程可视化', '算法透明', '结果追溯']
    }
  ];

  return (
    <Layout 
      title="实用工具 - 宝宝取名专家"
      description="提供各种实用的取名相关工具，包括重名查询、新华字典、规范汉字表等。"
    >
      {/* 英雄区域 */}
      <section className="relative bg-cultural-hero py-20 overflow-hidden">
        {/* 传统文化背景装饰 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-cultural-gold rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border border-cultural-jade rotate-45"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-cultural-red/10 rounded-full"></div>
          <div className="absolute top-1/2 right-1/3 w-20 h-20 border-2 border-cultural-red/20 rotate-12"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          {/* 传统印章装饰 */}
          <div className="inline-flex items-center space-x-2 bg-cultural-red/10 border border-cultural-red/20 rounded-full px-6 py-2 mb-6">
            <span className="text-cultural-red">🛠️</span>
            <span className="text-sm font-medium text-cultural-red">传统文化 · 现代工具</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold font-heading text-cultural-ink mb-6">
            实用工具
            <span className="block text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cultural-red via-cultural-gold to-cultural-jade mt-2">
              智慧取名 · 文化传承
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            汇聚传统文化智慧与现代科技力量，为您提供专业、权威、便捷的取名辅助工具
          </p>
        </div>
      </section>

      {/* 工具展示区域 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* 工具网格 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <Link key={index} href={tool.href}>
                <Card 
                  hover
                  className={`group relative overflow-hidden bg-gradient-to-br ${tool.bgColor} border-2 border-gray-100 hover:border-cultural-gold/30 h-full transition-all duration-300`}
                >
                  {/* 传统装饰边框 */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cultural-red via-cultural-gold to-cultural-jade"></div>
                  
                  <div className="p-8">
                    {/* 分类标签 */}
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-xs px-3 py-1 bg-white/80 text-gray-600 rounded-full font-medium">
                        {tool.category}
                      </span>
                      <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-xl">{tool.icon}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-4 font-heading group-hover:text-cultural-ink transition-colors">
                      {tool.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                      {tool.description}
                    </p>
                    
                    {/* 功能特色 */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tool.features.map((feature, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-white/60 text-gray-700 rounded-md">
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-cultural-gold text-sm font-medium group-hover:text-cultural-red transition-colors">
                        立即使用
                      </span>
                      <svg className="w-5 h-5 text-cultural-gold group-hover:text-cultural-red group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* 悬浮装饰 */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-cultural-gold/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Card>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 工具分类说明 */}
      <section className="py-16 bg-cultural-paper">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-cultural-ink mb-4">
              工具分类说明
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              每个工具都承载着深厚的文化底蕴，结合现代科技为您提供专业服务
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                category: '专业分析',
                icon: '📊',
                description: '运用传统姓名学理论，结合现代数据分析技术',
                color: 'cultural-red',
                tools: ['姓名综合分析']
              },
              {
                category: '查询工具', 
                icon: '🔍',
                description: '基于大数据和权威资料的精准查询服务',
                color: 'cultural-jade',
                tools: ['重名查询']
              },
              {
                category: '文化工具',
                icon: '📚', 
                description: '传承中华文化，深入解读汉字文化内涵',
                color: 'cultural-gold',
                tools: ['新华字典']
              },
              {
                category: '权威标准',
                icon: '🏛️',
                description: '严格遵循国家标准，确保用字规范性',
                color: 'indigo-600',
                tools: ['规范汉字表']
              }
            ].map((category, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <div className={`w-16 h-16 mx-auto mb-4 bg-${category.color}/10 rounded-full flex items-center justify-center`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className={`text-lg font-bold text-${category.color} mb-3 font-heading`}>
                  {category.category}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="text-xs text-gray-500">
                  包含：{category.tools.join('、')}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 使用指南 */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 左侧内容 */}
            <div>
              <h2 className="text-3xl font-bold font-heading text-cultural-ink mb-6">
                使用指南
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-cultural-red rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">选择合适工具</h3>
                    <p className="text-gray-600 text-sm">根据您的需求选择相应的分析工具，每个工具都有详细的功能说明</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-cultural-gold rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">输入相关信息</h3>
                    <p className="text-gray-600 text-sm">按照提示输入姓名、汉字等相关信息，系统会进行智能验证</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-cultural-jade rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">获取分析结果</h3>
                    <p className="text-gray-600 text-sm">系统会基于传统文化理论和现代算法为您提供详细的分析报告</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧特色 */}
            <div className="relative">
              <Card className="p-8 bg-gradient-to-br from-cultural-jade-50 to-emerald-100 border-2 border-cultural-jade/20">
                <h3 className="text-xl font-bold text-cultural-jade mb-6 font-heading text-center">
                  🌟 工具特色
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: '🏛️', title: '权威标准', desc: '严格遵循国家规范汉字标准' },
                    { icon: '📚', title: '文化传承', desc: '深度融合传统文化智慧' },
                    { icon: '🔬', title: '科学分析', desc: '运用现代数据分析技术' },
                    { icon: '🎯', title: '精准服务', desc: '个性化定制分析方案' }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg">
                      <span className="text-lg">{feature.icon}</span>
                      <div>
                        <div className="font-semibold text-cultural-jade text-sm">{feature.title}</div>
                        <div className="text-xs text-gray-600">{feature.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              {/* 装饰元素 */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-cultural-gold rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cultural-red rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 温馨提示 */}
      <section className="py-12 bg-gradient-to-r from-cultural-red/5 via-cultural-gold/5 to-cultural-jade/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-cultural-gold/20">
            <h3 className="text-xl font-bold text-cultural-ink mb-4 font-heading">
              💡 温馨提示
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div className="space-y-2">
                <p>• 所有工具均基于权威资料和传统文化理论</p>
                <p>• 分析结果仅供参考，请结合个人喜好选择</p>
                <p>• 建议多维度分析，综合考虑各项因素</p>
              </div>
              <div className="space-y-2">
                <p>• 工具完全免费，无需注册即可使用</p>
                <p>• 数据处理在本地完成，保护您的隐私</p>
                <p>• 如有疑问，欢迎查看详细使用说明</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ToolsPage;
