import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Button, Card } from '@/components/ui';

export default function Home() {
  const router = useRouter();
  




  return (
    <Layout 
      title="宝宝取名专家 - 智慧取名，科学传承"
      description="融合AI智能分析与传统文化智慧，为新生代打造专属美名。专业的宝宝取名服务，严格遵循《通用规范汉字表》国家标准，8大维度科学分析。"
    >
      {/* 英雄区域 - 重新设计的布局 */}
      <section id="hero-section" className="relative bg-gradient-to-br from-gray-50 via-white to-slate-50 overflow-hidden py-20 lg:py-32">
        {/* 简约背景装饰 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-24 h-24 border border-gray-200 rounded-full"></div>
          <div className="absolute bottom-32 left-20 w-16 h-16 bg-gray-100 rounded-full"></div>
        </div>

        <div className="relative max-w-8xl mx-auto px-10 text-center">
          <div className="space-y-20">
            {/* 1. 主标题区域 */}
            <div id="hero-title" className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold font-heading text-slate-800 leading-tight tracking-tight">
                智慧取名
                <span className="text-amber-600 ml-4">
                  科学传承
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                融合传统文化智慧与现代AI技术，为宝宝打造独特美名
              </p>
            </div>

                        {/* 2. 网站特色展示 */}
            <div id="hero-features" className="relative">
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                {/* 左侧 - 科学性特点 */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="text-center lg:text-left">
                    <h3 className="text-2xl lg:text-3xl font-bold text-cultural-ink mb-4 font-heading">
                      🔬 科学严谨
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      遵循国家标准，融合现代科学
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      {
                        icon: '🏛️',
                        title: '国家标准',
                        desc: '严格遵循《通用规范汉字表》',
                        color: 'bg-cultural-red-500'
                      },
                      {
                        icon: '🧠',
                        title: 'AI智能',
                        desc: '六层智能分析系统',
                        color: 'bg-blue-500'
                      },
                      {
                        icon: '📊',
                        title: '数据驱动',
                        desc: '基于500万+诗词数据库',
                        color: 'bg-cultural-jade-500'
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                        <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-white text-xl">{item.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-gray-800 font-heading">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 中间 - 核心展示 */}
                <div className="lg:col-span-1 text-center">
                  <div className="relative w-80 h-80 mx-auto">
                    {/* 围绕的小圆圈 */}
                    {[
                      { icon: '📚', angle: 0, color: 'bg-cultural-red-500', title: '诗词文化' },
                      { icon: '⚖️', angle: 60, color: 'bg-cultural-jade-500', title: '五行平衡' },
                      { icon: '🎵', angle: 120, color: 'bg-purple-500', title: '音韵美学' },
                      { icon: '✨', angle: 180, color: 'bg-pink-500', title: '寓意深度' },
                      { icon: '🔮', angle: 240, color: 'bg-blue-500', title: '命理分析' },
                      { icon: '🏆', angle: 300, color: 'bg-green-500', title: '综合评分' }
                    ].map((item, index) => {
                      const radius = 120;
                      const x = Math.cos((item.angle - 90) * Math.PI / 180) * radius;
                      const y = Math.sin((item.angle - 90) * Math.PI / 180) * radius;
                      
                      // 根据位置决定提示框的位置
                      const isBottomHalf = item.angle > 90 && item.angle < 270;
                      const tooltipPosition = isBottomHalf ? '-bottom-12' : '-top-12';
                      const arrowPosition = isBottomHalf ? 'bottom-full' : 'top-full';
                      const arrowBorder = isBottomHalf ? 'border-b-black/90 border-t-transparent' : 'border-t-black/90 border-b-transparent';
                      
                      return (
                        <div
                          key={index}
                          className="absolute group"
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                          }}
                        >
                          <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 cursor-pointer relative z-10`}>
                            <span className="text-white text-xl">{item.icon}</span>
                          </div>
                          {/* 悬浮提示 */}
                          <div className={`absolute ${tooltipPosition} left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-xl border border-gray-600`} style={{ zIndex: 1000 }}>
                            {item.title}
                            {/* 小箭头指示 */}
                            <div className={`absolute ${arrowPosition} left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-l-transparent border-r-transparent ${arrowBorder}`} style={{ borderTopWidth: isBottomHalf ? '0' : '4px', borderBottomWidth: isBottomHalf ? '4px' : '0' }}></div>
                          </div>
                        </div>
                      );
                    })}

                    {/* 中心圆形 - 放在后面以确保不被遮挡 */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-gradient-to-br from-cultural-gold-400 via-cultural-gold-500 to-cultural-gold-600 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden z-5">
                      {/* 背景装饰 */}
                      <div className="absolute inset-0 bg-cultural-gold-600/20 rounded-full animate-pulse"></div>
                      
                      <div className="relative z-10 text-center text-white px-4">
                        <div className="text-4xl mb-3">🎯</div>
                        <div className="text-xl font-bold font-heading leading-tight">智慧取名</div>
                        <div className="text-sm opacity-90 mt-1">科学传承</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <h4 className="text-xl font-bold text-cultural-ink font-heading">六维度综合分析</h4>
                    <p className="text-gray-600">传统文化 × 现代科学 = 完美名字</p>
                  </div>
                </div>

                {/* 右侧 - 文化特色 */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="text-center lg:text-right">
                    <h3 className="text-2xl lg:text-3xl font-bold text-cultural-ink mb-4 font-heading">
                      🏮 文化传承
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      深厚底蕴，传承千年智慧
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      {
                        icon: '📜',
                        title: '诗词典故',
                        desc: '源自诗经楚辞唐诗宋词',
                        color: 'bg-cultural-gold-500'
                      },
                      {
                        icon: '☯️',
                        title: '五行八字',
                        desc: '传统命理学精准分析',
                        color: 'bg-cultural-jade-500'
                      },
                      {
                        icon: '🎭',
                        title: '音韵美学',
                        desc: '声韵搭配和谐优美',
                        color: 'bg-purple-500'
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center p-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group lg:flex-row-reverse lg:space-x-reverse lg:space-x-4 space-x-4">
                        <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                          <span className="text-white text-xl">{item.icon}</span>
                        </div>
                        <div className="flex-1 lg:text-right min-w-0">
                          <h4 className="text-base font-bold text-gray-800 font-heading">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 底部统计数据 */}
              <div className="mt-16 bg-gradient-to-r from-cultural-paper via-white to-cultural-jade-50/30 rounded-3xl p-8 shadow-xl border border-cultural-gold/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { number: '权威数据', label: '官方标准', icon: '🏛️' },
                    { number: '文化传承', label: '千年智慧', icon: '📜' },
                    { number: '科学分析', label: 'AI智能', icon: '🧠' },
                    { number: '专业认证', label: '值得信赖', icon: '🏆' }
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

            {/* 3. 行动按钮 */}
            <div id="hero-cta" className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => router.push('/naming')}
              >
                立即开始取名
              </button>
              <button 
                className="bg-white hover:bg-gray-50 text-slate-800 border-2 border-amber-600 px-12 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
                onClick={() => router.push('/culture/overview')}
              >
                了解文化背景
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 数据库详细介绍区域 */}
      <section id="database-section" className="py-24 bg-gradient-to-br from-white via-slate-50/50 to-gray-50/30 border-t border-gray-200/60 relative">
        {/* 专业背景装饰 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-1/4 w-24 h-24 border border-blue-200/40 rounded-lg rotate-12"></div>
          <div className="absolute bottom-16 right-1/4 w-20 h-20 bg-gradient-to-br from-blue-50/60 to-slate-50/60 rounded-full"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_49%,_rgba(148,163,184,0.03)_50%,_transparent_51%)] bg-[length:60px_60px]"></div>
        </div>
        <div className="max-w-8xl mx-auto px-10">
          <div id="database-title" className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading text-cultural-ink mb-6">
              🏛️ 8大权威数据库支撑
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto font-medium leading-relaxed">
              区别于其他取名网站，我们整合了最全面的权威数据资源
            </p>
          </div>

          <div id="database-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-${item.color}-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl text-white">{item.icon}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-neutral-800 mb-3 font-heading">
                    {item.title}
                  </h3>
                  
                  <div className={`text-2xl font-bold mb-3 text-${item.color}-500 font-heading`}>
                    {item.data}
                  </div>
                  
                  <p className="text-neutral-600 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
                
                {/* 悬浮效果 */}
                <div className={`absolute inset-0 bg-${item.color}-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </Card>
            ))}
          </div>

          {/* 底部总结 */}
          <div id="database-summary" className="mt-16 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-cultural-ink mb-6 font-heading">
                🎯 为什么我们的数据库如此重要？
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 mb-2 text-base font-heading">权威性保证</div>
                    <div className="text-sm text-gray-600 leading-relaxed">所有数据来源于官方权威机构，确保准确可靠</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-lg">✓</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 mb-2 text-base font-heading">全面性覆盖</div>
                    <div className="text-sm text-gray-600 leading-relaxed">从古典文学到现代标准，涵盖取名所需的所有维度</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-lg">✓</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 mb-2 text-base font-heading">智能化分析</div>
                    <div className="text-sm text-gray-600 leading-relaxed">AI算法深度挖掘数据价值，提供个性化推荐</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 智能分析系统展示 */}
      <section id="plugin-system-section" className="py-16 bg-gradient-to-br from-slate-50/40 via-white to-blue-50/20 border-t border-slate-200/50 relative">
        {/* 科技感背景装饰 */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-16 right-20 w-28 h-28 border-2 border-dashed border-blue-300/30 rounded-xl"></div>
          <div className="absolute bottom-20 left-16 w-32 h-16 bg-gradient-to-r from-blue-100/40 to-slate-100/40 rounded-full transform -rotate-12"></div>
          <div className="absolute top-1/2 right-1/3 w-6 h-6 bg-blue-200/50 rounded-full"></div>
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_rgba(59,130,246,0.02)_60deg,_transparent_120deg)] bg-[length:100px_100px]"></div>
        </div>
        <div className="max-w-8xl mx-auto px-10">
          <div id="plugin-title" className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading text-cultural-ink mb-6">
              🎯 六步科学取名流程
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto font-medium leading-relaxed">
              科学严谨的分析步骤，确保每个名字都蕴含深厚文化底蕴
            </p>
          </div>

          <div className="max-w-8xl mx-auto">
            <div id="plugin-layers" className="space-y-6">
              {[
                {
                  step: '第一步',
                  title: '基础信息收集',
                  desc: '收集宝宝的基本信息，为后续分析奠定基础',
                  icon: '👤',
                  color: 'bg-blue-500',
                  tools: [
                    { name: '性别识别', desc: '根据宝宝性别推荐合适的字符选择', icon: '👶' },
                    { name: '出生时间分析', desc: '分析出生时辰的五行属性和特点', icon: '🕐' },
                    { name: '家族传承考量', desc: '结合家族文化和起名传统', icon: '🏠' }
                  ]
                },
                {
                  step: '第二步', 
                  title: '命理深度分析',
                  desc: '根据生辰八字进行专业的命理分析',
                  icon: '⚖️',
                  color: 'bg-green-500',
                  tools: [
                    { name: '八字解析', desc: '精准计算生辰八字的天干地支', icon: '📊' },
                    { name: '喜用神确定', desc: '找出命局中最需要补充的五行', icon: '🔥' },
                    { name: '五行平衡', desc: '确保名字能够调和命理五行', icon: '🌟' }
                  ]
                },
                {
                  step: '第三步',
                  title: '文化内涵筛选',
                  desc: '从传统文化中筛选有深度内涵的字符',
                  icon: '📚',
                  color: 'bg-purple-500',
                  tools: [
                    { name: '诗词意境', desc: '从古典诗词中提取美好意境', icon: '🎭' },
                    { name: '音韵和谐', desc: '确保名字读音优美动听', icon: '🎵' },
                    { name: '典故引用', desc: '引用经典文化典故增加底蕴', icon: '📜' }
                  ]
                },
                {
                  step: '第四步',
                  title: '字符规范筛查',
                  desc: '确保所选字符符合现代规范和审美',
                  icon: '✅',
                  color: 'bg-orange-500',
                  tools: [
                    { name: '规范汉字检查', desc: '确保使用国家标准规范汉字', icon: '📝' },
                    { name: '字形美观度', desc: '评估字形结构的视觉美感', icon: '🎨' },
                    { name: '笔画分析', desc: '分析笔画数理的吉凶寓意', icon: '✏️' }
                  ]
                },
                {
                  step: '第五步',
                  title: '智能组合生成',
                  desc: '运用算法智能组合最佳的名字搭配',
                  icon: '🎨',
                  color: 'bg-pink-500',
                  tools: [
                    { name: '名字组合', desc: '智能匹配最和谐的字符组合', icon: '🔗' },
                    { name: '音律搭配', desc: '优化声调和韵律的协调性', icon: '🎼' },
                    { name: '寓意融合', desc: '确保整体寓意积极美好', icon: '💫' }
                  ]
                },
                {
                  step: '第六步',
                  title: '综合质量评估',
                  desc: '多维度评估名字质量，确保推荐最佳方案',
                  icon: '🏆',
                  color: 'bg-red-500',
                  tools: [
                    { name: '综合评分', desc: '从多个维度对名字进行综合评分', icon: '📈' },
                    { name: '数理分析', desc: '运用传统数理学进行深度分析', icon: '🔢' },
                    { name: '质量排序', desc: '按照质量评分进行智能排序', icon: '🏅' }
                  ]
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <Card className="p-6 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 group">
                    <div className="flex items-start space-x-6">
                      <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl text-white">{step.icon}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <span className="text-base font-bold text-white bg-cultural-gold-500 px-4 py-2 rounded-lg shadow-lg">
                            {step.step}
                          </span>
                          <h3 className="text-2xl font-bold text-gray-800 font-heading">
                            {step.title}
                          </h3>
                        </div>
                        
                        <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                          {step.desc}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {step.tools.map((tool, toolIndex) => (
                            <div 
                              key={toolIndex}
                              className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all duration-300 group/tool"
                            >
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover/tool:bg-cultural-gold-100 transition-colors duration-300">
                                  <span className="text-base">{tool.icon}</span>
                                </div>
                                <h4 className="text-base font-bold text-gray-800 font-heading">
                                  {tool.name}
                                </h4>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {tool.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  {/* 连接线 */}
                  {index < 5 && (
                    <div className="flex justify-center py-2">
                      <div className="w-1 h-6 bg-gray-300 rounded-full"></div>
                      <div className="absolute w-3 h-3 bg-gray-300 rounded-full transform translate-y-2"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 诗词取名模块 */}
      <section id="poetry-naming-section" className="py-24 bg-gradient-to-br from-amber-50/30 via-white to-cultural-jade-50/40 border-t border-cultural-gold/30 relative">
        {/* 文化艺术背景装饰 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-12 left-16 w-20 h-20 border-2 border-cultural-gold/25 rounded-full"></div>
          <div className="absolute bottom-16 right-20 w-24 h-6 bg-gradient-to-r from-cultural-red/15 to-cultural-gold/15 rounded-full transform rotate-45"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 border border-cultural-jade/20 rounded-lg rotate-45"></div>
          {/* 中国风云纹背景 */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(217,119,6,0.03)_0%,_transparent_50%,_rgba(22,101,52,0.03)_100%)]"></div>
        </div>
        <div className="max-w-8xl mx-auto px-10">
          <div id="poetry-title" className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading text-cultural-ink mb-6">
              📖 诗词取名专区
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto font-medium leading-relaxed">
              从千年诗词文化中汲取灵感，为宝宝取一个富有诗意和文化底蕴的美名
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* 左侧 - 诗词展示 */}
                <div className="space-y-8">
              <Card className="p-8 bg-gradient-to-br from-cultural-gold-50 to-white border-2 border-cultural-gold-200 shadow-lg">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-cultural-gold-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">📚</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-cultural-ink font-heading">经典诗词库</h3>
                      <p className="text-sm text-gray-600">500万+ 古典诗词典籍</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 border border-cultural-gold-100">
                    <div className="text-center space-y-4">
                      <h4 className="text-lg font-bold text-cultural-ink font-heading">《诗经·周南·关雎》</h4>
                      <div className="space-y-2 text-gray-700">
                        <p className="text-base leading-relaxed">关关雎鸠，在河之洲。</p>
                        <p className="text-base leading-relaxed">窈窕淑女，君子好逑。</p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center mt-4">
                        <span className="bg-cultural-gold-100 text-cultural-gold-700 px-3 py-1 rounded-full text-sm font-medium">雎</span>
                        <span className="bg-cultural-jade-100 text-cultural-jade-700 px-3 py-1 rounded-full text-sm font-medium">窈</span>
                        <span className="bg-cultural-red-100 text-cultural-red-700 px-3 py-1 rounded-full text-sm font-medium">淑</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-cultural-jade-50 to-white border-2 border-cultural-jade-200 shadow-lg">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-cultural-jade-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">🎭</span>
                    </div>
                  <div>
                      <h3 className="text-xl font-bold text-cultural-ink font-heading">唐诗宋词</h3>
                      <p className="text-sm text-gray-600">李白杜甫苏轼等名家作品</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-cultural-jade-100">
                    <div className="text-center space-y-4">
                      <h4 className="text-lg font-bold text-cultural-ink font-heading">《水调歌头》苏轼</h4>
                      <div className="space-y-2 text-gray-700">
                        <p className="text-base leading-relaxed">但愿人长久，千里共婵娟。</p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center mt-4">
                        <span className="bg-cultural-jade-100 text-cultural-jade-700 px-3 py-1 rounded-full text-sm font-medium">婵</span>
                        <span className="bg-cultural-gold-100 text-cultural-gold-700 px-3 py-1 rounded-full text-sm font-medium">娟</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* 右侧 - 功能介绍 */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-cultural-ink font-heading">智能诗词取名</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  运用先进的自然语言处理技术，从浩瀚的古典诗词中智能提取适合的字符，
                  结合音韵学和语义学原理，为您的宝宝取一个既有文化内涵又音韵优美的名字。
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  {
                    icon: '🔍',
                    title: '智能检索',
                    desc: '从500万+诗词中智能检索匹配的字符',
                    color: 'bg-blue-100 text-blue-600'
                  },
                  {
                    icon: '🎨',
                    title: '意境分析',
                    desc: '深度分析诗词意境，确保名字蕴含美好寓意',
                    color: 'bg-purple-100 text-purple-600'
                  },
                  {
                    icon: '🎵',
                    title: '音韵优化',
                    desc: '结合声韵学原理，确保名字读音和谐优美',
                    color: 'bg-pink-100 text-pink-600'
                  },
                  {
                    icon: '📜',
                    title: '典故追溯',
                    desc: '提供详细的诗词出处和典故说明',
                    color: 'bg-amber-100 text-amber-600'
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color}`}>
                      <span className="text-xl">{feature.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 font-heading mb-2">{feature.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
                  
              <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="primary" 
                    size="lg"
                  className="flex-1 py-4 text-lg font-semibold"
                  onClick={() => router.push('/poetry-naming')}
                >
                  🎨 开始诗词取名
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="flex-1 py-4 text-lg font-semibold"
                  onClick={() => router.push('/poetry')}
                >
                  📚 浏览诗词库
                  </Button>
              </div>
            </div>
                </div>

          {/* 底部 - 诗词分类展示 */}
          <div id="poetry-categories" className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-cultural-ink font-heading mb-4">
                📖 诗词分类体系
              </h3>
              <p className="text-lg text-gray-600">
                涵盖各个历史时期的经典文学作品，确保取名的文化深度
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { name: '诗经', count: '305篇', icon: '📜', color: 'bg-cultural-red-500' },
                { name: '楚辞', count: '17篇', icon: '🌿', color: 'bg-cultural-jade-500' },
                { name: '唐诗', count: '50,000+', icon: '🏮', color: 'bg-cultural-gold-500' },
                { name: '宋词', count: '20,000+', icon: '🎭', color: 'bg-purple-500' },
                { name: '元曲', count: '4,000+', icon: '🎪', color: 'bg-pink-500' },
                { name: '古文', count: '1,000+', icon: '📚', color: 'bg-blue-500' }
              ].map((category, index) => (
                <div key={index} className="text-center group cursor-pointer" onClick={() => router.push(`/poetry?category=${category.name}`)}>
                  <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <span className="text-2xl text-white">{category.icon}</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-800 font-heading mb-1">{category.name}</h4>
                  <p className="text-sm text-gray-600">{category.count}</p>
                </div>
              ))}
              </div>
          </div>
        </div>
      </section>

      {/* 功能特色区域 */}
      <section id="features-section" className="py-24 bg-gradient-to-br from-emerald-50/40 via-white to-amber-50/40 border-t border-emerald-200/40 relative">
        {/* 传统文化背景装饰 */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-32 h-8 bg-gradient-to-r from-emerald-200/30 to-amber-200/30 rounded-full transform -rotate-12"></div>
          <div className="absolute bottom-20 right-16 w-20 h-20 border-2 border-amber-300/25 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-emerald-100/40 rounded-lg rotate-45"></div>
          {/* 传统图案背景 */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_rgba(16,185,129,0.02)_0%,_transparent_25%,_transparent_75%,_rgba(245,158,11,0.02)_100%)]"></div>
        </div>
        <div className="max-w-8xl mx-auto px-10">
          {/* 标题区域 */}
          <div id="features-title" className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading text-cultural-ink mb-6">
              传统文化智慧
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto font-medium leading-relaxed">
              结合传统文化智慧与现代科学方法，为新生儿提供专业、个性化、有文化内涵的名字推荐
            </p>
          </div>

          {/* 功能卡片网格 */}
          <div id="features-cards" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section id="why-choose-us-section" className="py-24 bg-gradient-to-br from-slate-100/50 via-white to-stone-50/60 border-t border-slate-300/40 relative">
        {/* 稳重可信背景装饰 */}
        <div className="absolute inset-0 opacity-12">
          <div className="absolute top-16 right-24 w-36 h-12 bg-gradient-to-r from-slate-200/40 to-stone-200/40 rounded-full transform rotate-12"></div>
          <div className="absolute bottom-24 left-20 w-28 h-28 border border-slate-300/25 rounded-xl"></div>
          <div className="absolute top-1/3 left-1/3 w-8 h-8 bg-stone-200/30 rounded-full"></div>
          {/* 专业可靠背景 */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(71,85,105,0.01)_0%,_transparent_25%,_transparent_75%,_rgba(120,113,108,0.01)_100%)]"></div>
        </div>
        <div className="max-w-8xl mx-auto px-10">
          <div id="why-choose-us-title" className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-cultural-ink mb-6 font-heading">为什么选择我们</h2>
            <p className="text-xl lg:text-2xl text-gray-600 font-medium leading-relaxed">专业、科学、个性化的取名服务</p>
          </div>

          <div id="why-choose-us-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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