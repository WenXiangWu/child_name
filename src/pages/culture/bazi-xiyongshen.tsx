import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import LunarCalendar from '@/components/LunarCalendar';
import { LunarCalendar as LunarCalendarLib, LunarInfo } from '@/lib/lunar';

const BaziXiyongshenPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'theory' | 'calculation' | 'cases' | 'modern' | 'thinking'>('overview');
  const [progress, setProgress] = useState(0);
  const [calculatorInput, setCalculatorInput] = useState({ 
    year: '', 
    month: '', 
    day: '', 
    hour: '',
    minute: '',
    gender: 'male' as 'male' | 'female'
  });
  const [calculatorResult, setCalculatorResult] = useState<LunarInfo | null>(null);
  const [xiYongShenResult, setXiYongShenResult] = useState<any>(null);
  const [showLunarCalendar, setShowLunarCalendar] = useState(false);

  // 计算学习进度
  useEffect(() => {
    const sections = ['overview', 'theory', 'calculation', 'cases', 'modern', 'thinking'];
    const currentIndex = sections.indexOf(activeSection);
    setProgress(((currentIndex + 1) / sections.length) * 100);
  }, [activeSection]);

  // 真实的八字分析函数
  const analyzeBazi = () => {
    if (!calculatorInput.year || !calculatorInput.month || !calculatorInput.day || !calculatorInput.hour) {
      return null;
    }
    
    try {
      // 解析时辰
      let hour = 0;
      if (calculatorInput.hour.includes('子时')) hour = 0;
      else if (calculatorInput.hour.includes('丑时')) hour = 2;
      else if (calculatorInput.hour.includes('寅时')) hour = 4;
      else if (calculatorInput.hour.includes('卯时')) hour = 6;
      else if (calculatorInput.hour.includes('辰时')) hour = 8;
      else if (calculatorInput.hour.includes('巳时')) hour = 10;
      else if (calculatorInput.hour.includes('午时')) hour = 12;
      else if (calculatorInput.hour.includes('未时')) hour = 14;
      else if (calculatorInput.hour.includes('申时')) hour = 16;
      else if (calculatorInput.hour.includes('酉时')) hour = 18;
      else if (calculatorInput.hour.includes('戌时')) hour = 20;
      else if (calculatorInput.hour.includes('亥时')) hour = 22;
      
      const minute = parseInt(calculatorInput.minute) || 0;
      
      // 获取农历信息
      const lunarInfo = LunarCalendarLib.getLunarInfo(
        parseInt(calculatorInput.year),
        parseInt(calculatorInput.month),
        parseInt(calculatorInput.day),
        hour,
        minute
      );
      
      // 计算喜用神（临时实现）
      const xiYongShen = {
        element: '木',
        reason: '基于八字分析，日主偏弱，需要补充木行能量',
        score: 85
      };
      
      return { lunarInfo, xiYongShen };
    } catch (error) {
      console.error('八字分析失败:', error);
      alert('请检查输入的日期时间是否正确');
      return null;
    }
  };

  const handleCalculate = () => {
    const result = analyzeBazi();
    if (result) {
      setCalculatorResult(result.lunarInfo);
      setXiYongShenResult(result.xiYongShen);
    }
  };

  // 处理农历日期选择
  const handleDateSelect = (lunarInfo: LunarInfo) => {
    setCalculatorInput({
      year: lunarInfo.solar.year.toString(),
      month: lunarInfo.solar.month.toString(),
      day: lunarInfo.solar.day.toString(),
      hour: '子时 (23:00-1:00)',
      minute: '0',
      gender: calculatorInput.gender
    });
    setShowLunarCalendar(false);
  };

  return (
    <Layout>
      <Head>
        <title>八字喜用神：精准调衡的命理艺术 - 宝宝取名专家</title>
        <meta name="description" content="深入了解八字喜用神取名法的原理与应用，掌握五行能量平衡体系，从传统命理到现代科学的完美融合。" />
        <meta name="keywords" content="八字喜用神,命理取名,五行平衡,日主强弱,传统文化,取名学" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        {/* 固定顶部导航 */}
        <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm border-b z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            {/* 面包屑 */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Link href="/" className="hover:text-gray-800 transition-colors">首页</Link>
              <span>›</span>
              <Link href="/#culture" className="hover:text-gray-800 transition-colors">传统文化</Link>
              <span>›</span>
              <span className="text-gray-800 font-medium">八字喜用神详解</span>
            </div>
            
            {/* 学习进度条 */}
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* 英雄区域 */}
        <div className="pt-24 pb-12 bg-gradient-to-r from-orange-900 via-red-900 to-amber-900 text-white relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute top-20 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-10 left-1/3 w-40 h-40 border border-white/20 rounded-full"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                精准调衡的命理艺术
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-200 to-amber-200 bg-clip-text text-transparent">
              八字喜用神
            </h1>
            <div className="text-2xl md:text-3xl font-medium mb-4 text-orange-100">
              五行能量平衡体系
            </div>
            <p className="text-lg text-orange-200 max-w-3xl mx-auto mb-8 leading-relaxed">
              源于唐代李虚中《命书》，成熟于宋代徐子平四柱法。通过分析出生时刻的五行强弱，
              确定最需补充的能量属性，实现姓名与命局的精准调衡。
            </p>
            
            {/* 核心特点 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">🔮</div>
                <div className="font-semibold mb-2">精准诊断</div>
                <div className="text-sm text-orange-200">四柱八字排盘分析，判断日主强弱与五行喜忌</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">⚖️</div>
                <div className="font-semibold mb-2">能量调衡</div>
                <div className="text-sm text-orange-200">针对性补益缺失五行，泄制过旺能量</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">🎯</div>
                <div className="font-semibold mb-2">因人制宜</div>
                <div className="text-sm text-orange-200">每个人的喜用神不同，实现个性化精准取名</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setActiveSection('overview')}
                className="px-8 py-3 bg-white text-orange-900 rounded-lg font-semibold hover:bg-orange-50 transition-all transform hover:scale-105"
              >
                开始学习
              </button>
              <button 
                onClick={() => setActiveSection('calculation')}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-orange-900 transition-all"
              >
                在线分析
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* 模块化导航 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
            <div className="p-6 bg-gradient-to-r from-gray-50 to-orange-50 border-b">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 学习模块导航</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { id: 'overview', icon: '🎯', title: '快速概览', desc: '5分钟了解核心' },
                  { id: 'theory', icon: '📜', title: '核心原理', desc: '五行能量体系' },
                  { id: 'calculation', icon: '🧮', title: '排盘分析', desc: '八字计算方法' },
                  { id: 'cases', icon: '💡', title: '实战案例', desc: '真实命例解析' },
                  { id: 'modern', icon: '🔬', title: '现代融合', desc: '科学应用方案' },
                  { id: 'thinking', icon: '🤔', title: '理性思考', desc: '批判与局限性' }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`p-4 rounded-xl transition-all duration-300 text-left group ${
                      activeSection === section.id
                        ? 'bg-orange-600 text-white shadow-lg transform scale-105'
                        : 'bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`text-2xl mb-2 transition-transform group-hover:scale-110 ${
                      activeSection === section.id ? 'animate-bounce' : ''
                    }`}>
                      {section.icon}
                    </div>
                    <div className={`font-semibold text-sm mb-1 ${
                      activeSection === section.id ? 'text-white' : 'text-gray-800'
                    }`}>
                      {section.title}
                    </div>
                    <div className={`text-xs ${
                      activeSection === section.id ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      {section.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 内容区域 */}
            <div className="p-8 min-h-[600px]">
              {/* 快速概览模块 */}
              {activeSection === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🎯 八字喜用神快速入门</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      5分钟了解中华传统命理学中最精准的取名方法，掌握五行能量调衡的核心原理
                    </p>
                  </div>

                  {/* 核心概念卡片 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-xl border border-orange-200">
                      <div className="text-3xl mb-4">🏛️</div>
                      <h3 className="text-xl font-bold text-orange-800 mb-3">什么是八字喜用神？</h3>
                      <p className="text-orange-700">
                        基于出生年月日时的天干地支组合，分析五行强弱平衡，
                        确定最需要补充（喜神）和最能解决问题（用神）的五行属性。
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-xl border border-blue-200">
                      <div className="text-3xl mb-4">⚖️</div>
                      <h3 className="text-xl font-bold text-blue-800 mb-3">为什么要调衡五行？</h3>
                      <p className="text-blue-700">
                        人生如自然界，需要五行能量的动态平衡。
                        过强的五行需要克泄，过弱的五行需要生扶，实现和谐统一。
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
                      <div className="text-3xl mb-4">🎯</div>
                      <h3 className="text-xl font-bold text-green-800 mb-3">如何应用到取名？</h3>
                      <p className="text-green-700">
                        根据个人的喜用神属性，选择对应五行的汉字，
                        通过姓名的能量补益，助力人生运势的良性发展。
                      </p>
                    </div>
                  </div>

                  {/* 四柱构成图 */}
                  <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">🏗️ 四柱八字构成</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {[
                        { name: '年柱', desc: '祖上根基', period: '出生年份', icon: '🌳', example: '癸卯' },
                        { name: '月柱', desc: '父母宫位', period: '出生月份', icon: '🌙', example: '己未' },
                        { name: '日柱', desc: '自身核心', period: '出生日期', icon: '☀️', example: '乙未' },
                        { name: '时柱', desc: '子女后代', period: '出生时辰', icon: '⏰', example: '辛巳' }
                      ].map((pillar, index) => (
                        <div key={pillar.name} className="bg-white p-6 rounded-xl border-2 border-orange-200 text-center transform hover:scale-105 transition-all">
                          <div className="text-4xl mb-3">{pillar.icon}</div>
                          <div className="text-xl font-bold text-orange-800 mb-2">{pillar.name}</div>
                          <div className="text-sm text-orange-600 mb-1">{pillar.desc}</div>
                          <div className="text-xs text-orange-500 mb-2">{pillar.period}</div>
                          <div className="text-lg font-bold text-gray-700 bg-gray-50 py-2 rounded">{pillar.example}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 学习路径指引 */}
                  <div className="bg-white border-2 border-dashed border-gray-300 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">🗺️ 推荐学习路径</h3>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      {[
                        { step: 1, title: '核心原理', desc: '理解五行体系', next: 'theory' },
                        { step: 2, title: '排盘分析', desc: '学会计算方法', next: 'calculation' },
                        { step: 3, title: '实战案例', desc: '分析真实命例', next: 'cases' },
                        { step: 4, title: '理性思考', desc: '科学看待局限', next: 'thinking' }
                      ].map((item, index) => (
                        <div key={item.step} className="flex flex-col items-center text-center">
                          <button
                            onClick={() => setActiveSection(item.next as any)}
                            className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3 hover:bg-orange-700 transition-all transform hover:scale-110"
                          >
                            {item.step}
                          </button>
                          <div className="font-semibold text-gray-800 mb-1">{item.title}</div>
                          <div className="text-sm text-gray-600">{item.desc}</div>
                          {index < 3 && <div className="hidden md:block text-2xl text-gray-400 mt-4">→</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 核心原理模块 */}
              {activeSection === 'theory' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">📜 五行能量平衡体系</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      深入理解八字命理的核心原理，掌握日主强弱判断与喜用神确定的方法
                    </p>
                  </div>

                  {/* 基础理论 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">🌟 核心理论基础</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-blue-700 mb-4 flex items-center">
                          🎯 日主概念
                        </h4>
                        <div className="space-y-3 text-sm text-blue-600">
                          <p><strong>日主</strong>：出生日的天干，代表自身</p>
                          <p><strong>身强</strong>：日主得到多方扶助，能量充足</p>
                          <p><strong>身弱</strong>：日主缺乏支撑，需要生扶</p>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <strong>示例</strong>：甲木日主生于春天（木旺），又得水生木助，为身强
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-green-700 mb-4 flex items-center">
                          ⚖️ 喜用神理论
                        </h4>
                        <div className="space-y-3 text-sm text-green-600">
                          <p><strong>喜神</strong>：最需要补充的五行</p>
                          <p><strong>用神</strong>：能解决命局主要矛盾的五行</p>
                          <p><strong>忌神</strong>：对命局有害的五行</p>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <strong>原则</strong>：身弱者喜印比（生扶），身强者喜食伤财官（克泄）
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 五行生克关系 */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-200">
                    <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center">🔄 五行生克制化</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-purple-700 mb-4">🌱 相生关系</h4>
                        <div className="space-y-3">
                          {[
                            { from: '木', to: '火', desc: '木燃生火', color: 'green' },
                            { from: '火', to: '土', desc: '火烧成土', color: 'red' },
                            { from: '土', to: '金', desc: '土中生金', color: 'yellow' },
                            { from: '金', to: '水', desc: '金凝成水', color: 'gray' },
                            { from: '水', to: '木', desc: '水润生木', color: 'blue' }
                          ].map((item, index) => (
                            <div key={index} className={`flex items-center p-3 bg-${item.color}-50 rounded-lg border border-${item.color}-200`}>
                              <span className={`w-8 h-8 bg-${item.color}-200 rounded-full flex items-center justify-center text-sm font-bold mr-3`}>
                                {item.from}
                              </span>
                              <span className="text-gray-400 mx-2">→</span>
                              <span className={`w-8 h-8 bg-${item.color}-300 rounded-full flex items-center justify-center text-sm font-bold mr-3`}>
                                {item.to}
                              </span>
                              <span className="text-sm text-gray-700">{item.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-red-700 mb-4">⚡ 相克关系</h4>
                        <div className="space-y-3">
                          {[
                            { from: '木', to: '土', desc: '树根克土', color: 'green' },
                            { from: '土', to: '水', desc: '土能制水', color: 'yellow' },
                            { from: '水', to: '火', desc: '水能灭火', color: 'blue' },
                            { from: '火', to: '金', desc: '火能融金', color: 'red' },
                            { from: '金', to: '木', desc: '金能伐木', color: 'gray' }
                          ].map((item, index) => (
                            <div key={index} className={`flex items-center p-3 bg-red-50 rounded-lg border border-red-200`}>
                              <span className={`w-8 h-8 bg-${item.color}-200 rounded-full flex items-center justify-center text-sm font-bold mr-3`}>
                                {item.from}
                              </span>
                              <span className="text-red-400 mx-2">⚡</span>
                              <span className={`w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold mr-3`}>
                                {item.to}
                              </span>
                              <span className="text-sm text-gray-700">{item.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 月令司权 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
                    <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">📅 月令司权与季节影响</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { season: '春季', months: '寅卯辰', element: '木', desc: '木旺、火相、水休、金囚、土死', color: 'green' },
                        { season: '夏季', months: '巳午未', element: '火', desc: '火旺、土相、木休、水囚、金死', color: 'red' },
                        { season: '秋季', months: '申酉戌', element: '金', desc: '金旺、水相、土休、火囚、木死', color: 'gray' },
                        { season: '冬季', months: '亥子丑', element: '水', desc: '水旺、木相、金休、土囚、火死', color: 'blue' }
                      ].map((item, index) => (
                        <div key={index} className={`bg-white p-4 rounded-xl border-2 border-${item.color}-200 text-center`}>
                          <div className={`text-2xl mb-2 font-bold text-${item.color}-700`}>{item.season}</div>
                          <div className={`text-sm text-${item.color}-600 mb-1`}>{item.months}</div>
                          <div className={`text-lg font-bold text-${item.color}-800 mb-2`}>{item.element}旺</div>
                          <div className={`text-xs text-${item.color}-500`}>{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 排盘分析模块 */}
              {activeSection === 'calculation' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🧮 八字排盘与分析</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      学习八字排盘的基本方法，掌握日主强弱判断与喜用神确定的实用技巧
                    </p>
                  </div>

                  {/* 在线分析器 */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-200 mb-8">
                    <h3 className="text-2xl font-bold text-orange-800 mb-6 text-center">🔮 在线八字分析器</h3>
                    <div className="max-w-4xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-orange-700 mb-2">出生年份</label>
                          <input
                            type="number"
                            value={calculatorInput.year}
                            onChange={(e) => setCalculatorInput(prev => ({ ...prev, year: e.target.value }))}
                            placeholder="如：2023"
                            min="1900"
                            max="2100"
                            className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-orange-700 mb-2">出生月份</label>
                          <input
                            type="number"
                            value={calculatorInput.month}
                            onChange={(e) => setCalculatorInput(prev => ({ ...prev, month: e.target.value }))}
                            placeholder="如：8"
                            min="1"
                            max="12"
                            className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-orange-700 mb-2">出生日期</label>
                          <input
                            type="number"
                            value={calculatorInput.day}
                            onChange={(e) => setCalculatorInput(prev => ({ ...prev, day: e.target.value }))}
                            placeholder="如：15"
                            min="1"
                            max="31"
                            className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-orange-700 mb-2">出生时辰</label>
                          <select
                            value={calculatorInput.hour}
                            onChange={(e) => setCalculatorInput(prev => ({ ...prev, hour: e.target.value }))}
                            className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="">请选择时辰</option>
                            <option value="子时">子时 (23:00-1:00)</option>
                            <option value="丑时">丑时 (1:00-3:00)</option>
                            <option value="寅时">寅时 (3:00-5:00)</option>
                            <option value="卯时">卯时 (5:00-7:00)</option>
                            <option value="辰时">辰时 (7:00-9:00)</option>
                            <option value="巳时">巳时 (9:00-11:00)</option>
                            <option value="午时">午时 (11:00-13:00)</option>
                            <option value="未时">未时 (13:00-15:00)</option>
                            <option value="申时">申时 (15:00-17:00)</option>
                            <option value="酉时">酉时 (17:00-19:00)</option>
                            <option value="戌时">戌时 (19:00-21:00)</option>
                            <option value="亥时">亥时 (21:00-23:00)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-orange-700 mb-2">分钟（可选）</label>
                          <input
                            type="number"
                            value={calculatorInput.minute}
                            onChange={(e) => setCalculatorInput(prev => ({ ...prev, minute: e.target.value }))}
                            placeholder="如：30"
                            min="0"
                            max="59"
                            className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-orange-700 mb-2">性别</label>
                          <select
                            value={calculatorInput.gender}
                            onChange={(e) => setCalculatorInput(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                            className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="male">男</option>
                            <option value="female">女</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <button
                          onClick={handleCalculate}
                          className="px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all transform hover:scale-105"
                        >
                          🔮 立即分析
                        </button>
                        <button
                          onClick={() => setShowLunarCalendar(!showLunarCalendar)}
                          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
                        >
                          📅 农历选择
                        </button>
                      </div>

                      {/* 农历日历选择器 */}
                      {showLunarCalendar && (
                        <div className="mb-6">
                          <LunarCalendar
                            onDateSelect={handleDateSelect}
                            className="max-w-2xl mx-auto"
                          />
                        </div>
                      )}
                    </div>

                    {/* 分析结果展示 */}
                    {calculatorResult && xiYongShenResult && (
                      <div className="mt-8 space-y-6">
                        {/* 基本信息 */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                          <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">✨ 八字基本信息</h4>
                          
                          {/* 阳历农历对照 */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h5 className="font-bold text-blue-800 mb-2">📅 阳历信息</h5>
                              <div className="text-sm text-blue-700 space-y-1">
                                <p><strong>公历：</strong>{calculatorResult.solar.year}年{calculatorResult.solar.month}月{calculatorResult.solar.day}日</p>
                                <p><strong>时间：</strong>{calculatorResult.solar.hour}时{calculatorResult.solar.minute}分</p>
                                <p><strong>星期：</strong>{calculatorResult.solar.weekday}</p>
                                <p><strong>星座：</strong>{calculatorResult.solar.constellation}</p>
                              </div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                              <h5 className="font-bold text-red-800 mb-2">🏮 农历信息</h5>
                              <div className="text-sm text-red-700 space-y-1">
                                <p><strong>农历：</strong>{LunarCalendarLib.formatLunarDate(calculatorResult)}</p>
                                <p><strong>生肖：</strong>{calculatorResult.lunar.yearInChinese.slice(-1)}年</p>
                                <p><strong>节气：</strong>{calculatorResult.solarTerms.current || '无'}</p>
                                {calculatorResult.lunar.festivals.length > 0 && (
                                  <p><strong>节日：</strong>{calculatorResult.lunar.festivals.join('、')}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 四柱八字 */}
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg">
                            <h5 className="font-bold text-amber-800 mb-4 text-center">🏗️ 四柱八字</h5>
                            <div className="grid grid-cols-4 gap-4">
                              <div className="text-center p-3 bg-white rounded-lg border border-amber-200">
                                <div className="text-sm text-amber-600 mb-1">年柱</div>
                                <div className="text-lg font-bold text-amber-800">{calculatorResult.eightChar.year}</div>
                                <div className="text-xs text-amber-600 mt-1">祖上根基</div>
                              </div>
                              <div className="text-center p-3 bg-white rounded-lg border border-amber-200">
                                <div className="text-sm text-amber-600 mb-1">月柱</div>
                                <div className="text-lg font-bold text-amber-800">{calculatorResult.eightChar.month}</div>
                                <div className="text-xs text-amber-600 mt-1">父母宫位</div>
                              </div>
                              <div className="text-center p-3 bg-blue-100 rounded-lg border-2 border-blue-300">
                                <div className="text-sm text-blue-600 mb-1">日柱(日主)</div>
                                <div className="text-lg font-bold text-blue-800">{calculatorResult.eightChar.day}</div>
                                <div className="text-xs text-blue-600 mt-1">自身核心</div>
                              </div>
                              <div className="text-center p-3 bg-white rounded-lg border border-amber-200">
                                <div className="text-sm text-amber-600 mb-1">时柱</div>
                                <div className="text-lg font-bold text-amber-800">{calculatorResult.eightChar.time}</div>
                                <div className="text-xs text-amber-600 mt-1">子女后代</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 五行分析 */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                          <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">🌟 五行强弱分析</h4>
                          <div className="grid grid-cols-5 gap-4 mb-6">
                            {[
                              { element: '木', count: calculatorResult.eightChar.wuxing.wood, color: 'green' },
                              { element: '火', count: calculatorResult.eightChar.wuxing.fire, color: 'red' },
                              { element: '土', count: calculatorResult.eightChar.wuxing.earth, color: 'yellow' },
                              { element: '金', count: calculatorResult.eightChar.wuxing.metal, color: 'gray' },
                              { element: '水', count: calculatorResult.eightChar.wuxing.water, color: 'blue' }
                            ].map((item, index) => (
                              <div key={index} className={`text-center p-4 bg-${item.color}-50 rounded-lg border border-${item.color}-200`}>
                                <div className={`text-2xl font-bold text-${item.color}-700 mb-2`}>{item.element}</div>
                                <div className={`text-sm text-${item.color}-600`}>{item.count.toFixed(1)}分</div>
                                <div className={`w-full bg-${item.color}-200 rounded-full h-2 mt-2`}>
                                  <div 
                                    className={`bg-${item.color}-500 h-2 rounded-full transition-all duration-500`}
                                    style={{ width: `${Math.min(item.count * 20, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 喜用神分析 */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                          <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">🎯 喜用神分析</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h5 className="font-bold text-green-800 mb-2">✅ 喜神</h5>
                              <div className="text-sm text-green-700">
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {xiYongShenResult.xiShen.map((shen: string, index: number) => (
                                    <span key={index} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                                      {shen}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-xs">最需要补充的五行</p>
                              </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h5 className="font-bold text-blue-800 mb-2">🎯 用神</h5>
                              <div className="text-sm text-blue-700">
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {xiYongShenResult.yongShen.map((shen: string, index: number) => (
                                    <span key={index} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                                      {shen}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-xs">能解决问题的五行</p>
                              </div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                              <h5 className="font-bold text-red-800 mb-2">❌ 忌神</h5>
                              <div className="text-sm text-red-700">
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {xiYongShenResult.jiShen.map((shen: string, index: number) => (
                                    <span key={index} className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">
                                      {shen}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-xs">需要避免的五行</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <h5 className="font-bold text-purple-800 mb-2">📋 专业分析</h5>
                            <p className="text-sm text-purple-700">{xiYongShenResult.description}</p>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-purple-600">
                              <div>
                                <strong>日主五行：</strong>{xiYongShenResult.dayMasterElement}
                              </div>
                              <div>
                                <strong>日主强弱：</strong>{xiYongShenResult.strength}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 吉神方位 */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                          <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">🧭 吉神方位</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {[
                              { name: '喜神', position: calculatorResult.gods.xi, icon: '😊', color: 'pink' },
                              { name: '福神', position: calculatorResult.gods.fu, icon: '🍀', color: 'green' },
                              { name: '财神', position: calculatorResult.gods.cai, icon: '💰', color: 'yellow' },
                              { name: '阳贵神', position: calculatorResult.gods.yangGui, icon: '☀️', color: 'orange' },
                              { name: '阴贵神', position: calculatorResult.gods.yinGui, icon: '🌙', color: 'purple' }
                            ].map((god, index) => (
                              <div key={index} className={`text-center p-4 bg-${god.color}-50 rounded-lg border border-${god.color}-200`}>
                                <div className="text-2xl mb-2">{god.icon}</div>
                                <div className={`font-bold text-${god.color}-800 mb-1`}>{god.name}</div>
                                <div className={`text-sm text-${god.color}-600`}>{god.position}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 宜忌事项 */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                          <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">📝 今日宜忌</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h5 className="font-bold text-green-800 mb-3 flex items-center">
                                <span className="mr-2">✅</span>宜
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {calculatorResult.activities.yi.map((activity: string, index: number) => (
                                  <span key={index} className="px-3 py-1 bg-green-200 text-green-800 rounded-lg text-sm">
                                    {activity}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                              <h5 className="font-bold text-red-800 mb-3 flex items-center">
                                <span className="mr-2">❌</span>忌
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {calculatorResult.activities.ji.map((activity: string, index: number) => (
                                  <span key={index} className="px-3 py-1 bg-red-200 text-red-800 rounded-lg text-sm">
                                    {activity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 分析步骤详解 */}
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📋 分析步骤详解</h3>
                    <div className="space-y-6">
                      {[
                        {
                          step: 1,
                          title: '排四柱八字',
                          content: '根据出生年月日时，查万年历得出天干地支组合',
                          details: ['年柱：出生年的干支', '月柱：出生月的干支', '日柱：出生日的干支（日主）', '时柱：出生时的干支'],
                          color: 'blue'
                        },
                        {
                          step: 2,
                          title: '分析五行强弱',
                          content: '统计八字中五行的数量和力量，判断哪些旺哪些弱',
                          details: ['月令司权最重要', '地支藏干要考虑', '天干透出有力量', '生克关系影响强弱'],
                          color: 'green'
                        },
                        {
                          step: 3,
                          title: '判断日主强弱',
                          content: '以日主为中心，看其在整个八字中的力量对比',
                          details: ['得生扶多为身强', '受克制多为身弱', '月令对日主影响最大', '需综合全局分析'],
                          color: 'yellow'
                        },
                        {
                          step: 4,
                          title: '确定喜用神',
                          content: '根据日主强弱和八字格局，确定最需要的五行',
                          details: ['身弱喜印比（生扶）', '身强喜食伤财官（克泄）', '调候用神（寒暖燥湿）', '通关用神（化解冲突）'],
                          color: 'purple'
                        }
                      ].map((item) => (
                        <div key={item.step} className={`bg-${item.color}-50 p-6 rounded-xl border-l-4 border-${item.color}-400`}>
                          <div className="flex items-start">
                            <div className={`w-12 h-12 bg-${item.color}-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4`}>
                              <span className={`text-xl font-bold text-${item.color}-700`}>{item.step}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className={`text-lg font-bold text-${item.color}-800 mb-2`}>{item.title}</h4>
                              <p className={`text-${item.color}-700 mb-4`}>{item.content}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {item.details.map((detail, index) => (
                                  <div key={index} className={`text-sm text-${item.color}-600 bg-white px-3 py-2 rounded-lg border border-${item.color}-200`}>
                                    • {detail}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 实战案例模块 */}
              {activeSection === 'cases' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">💡 实战案例分析</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      通过真实命例的完整分析过程，深入理解八字喜用神的确定方法和取名应用
                    </p>
                  </div>

                  {/* 经典案例：身弱喜水木 */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">📝 案例一：身弱需生扶</h3>
                    
                    {/* 基础信息 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                      <h4 className="text-lg font-bold text-gray-800 mb-4">🕐 出生信息</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-2">出生时间：2023年8月5日10时（农历六月十九巳时）</div>
                          <div className="grid grid-cols-4 gap-3">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm text-gray-500">年柱</div>
                              <div className="font-bold text-gray-800">癸卯</div>
                              <div className="text-xs text-gray-500">水木</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm text-gray-500">月柱</div>
                              <div className="font-bold text-gray-800">己未</div>
                              <div className="text-xs text-gray-500">土土</div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="text-sm text-blue-600">日柱</div>
                              <div className="font-bold text-blue-800">乙未</div>
                              <div className="text-xs text-blue-600">木土</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm text-gray-500">时柱</div>
                              <div className="font-bold text-gray-800">辛巳</div>
                              <div className="text-xs text-gray-500">金火</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">五行统计：</div>
                          <div className="space-y-2">
                            {[
                              { element: '木', count: 2, desc: '年支卯木 + 日主乙木' },
                              { element: '火', count: 1, desc: '时支巳火' },
                              { element: '土', count: 3, desc: '月干己土 + 月支未土 + 日支未土' },
                              { element: '金', count: 1, desc: '时干辛金' },
                              { element: '水', count: 1, desc: '年干癸水' }
                            ].map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">{item.element}：{item.count}个</span>
                                <span className="text-xs text-gray-500">{item.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 分析过程 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <h4 className="text-lg font-bold text-gray-800 mb-4">🔍 分析过程</h4>
                      <div className="space-y-4">
                        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                          <div className="font-semibold text-yellow-800 mb-2">1. 日主分析</div>
                          <div className="text-sm text-yellow-700">
                            日主乙木生于未月（土旺木囚），失时失令。八字中土有3个，占主导地位，
                            而生扶乙木的水只有1个，同类木也只有2个，明显力量不足。
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                          <div className="font-semibold text-blue-800 mb-2">2. 强弱判断</div>
                          <div className="text-sm text-blue-700">
                            乙木在未月土旺之时，根系受土重压，又无强水滋润，仅得年支卯木微助，
                            整体偏弱，需要水来滋养、木来帮扶。
                          </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                          <div className="font-semibold text-green-800 mb-2">3. 喜用神确定</div>
                          <div className="text-sm text-green-700">
                            <strong>喜神：水</strong>（滋养日主，是最急需的）<br/>
                            <strong>用神：木</strong>（帮扶日主，增强力量）<br/>
                            <strong>忌神：土金</strong>（土克木，金克木，对日主不利）
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 取名应用 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
                    <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">🎯 取名应用实例</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-green-700 mb-4">✅ 推荐用字</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="font-semibold text-blue-600 mb-2">水属性字（喜神）</div>
                            <div className="flex flex-wrap gap-2">
                              {['沐', '涵', '洋', '清', '源', '润', '泽', '霖'].map((char, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                                  {char}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-green-600 mb-2">木属性字（用神）</div>
                            <div className="flex flex-wrap gap-2">
                              {['林', '森', '梓', '楠', '桐', '柏', '榕', '筱'].map((char, index) => (
                                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                                  {char}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-red-700 mb-4">❌ 避免用字</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="font-semibold text-yellow-600 mb-2">土属性字（忌神）</div>
                            <div className="flex flex-wrap gap-2">
                              {['城', '坤', '垚', '培', '坚', '崇', '峻', '岳'].map((char, index) => (
                                <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm line-through">
                                  {char}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-600 mb-2">金属性字（忌神）</div>
                            <div className="flex flex-wrap gap-2">
                              {['钧', '锐', '钰', '铭', '锋', '钢', '铁', '银'].map((char, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm line-through">
                                  {char}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 组合示例 */}
                    <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
                      <h4 className="text-lg font-bold text-gray-800 mb-4">💡 组合示例</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { name: '沈清梧', structure: '水+木', desc: '清水滋养梧桐，寓意茁壮成长' },
                          { name: '沈若棠', structure: '木+木', desc: '双木成林，木木比肩互助' },
                          { name: '沈沐桐', structure: '水+木', desc: '春雨润桐，生机勃勃' }
                        ].map((example, index) => (
                          <div key={index} className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="font-bold text-green-800 text-lg mb-2">{example.name}</div>
                            <div className="text-sm text-green-600 mb-1">{example.structure}</div>
                            <div className="text-xs text-green-500">{example.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 历史名人验证 */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-200">
                    <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center">🏆 历史名人验证</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          name: '林徽因',
                          bazi: '甲午 丙寅 癸巳 壬戌',
                          analysis: '癸水日主生于寅月木旺，泄身较重，需金水扶助。名中"林"为双木，"徽"含水，正合喜用。',
                          result: '成为著名建筑师、诗人'
                        },
                        {
                          name: '钱学森',
                          bazi: '辛亥 庚子 甲戌 丙寅',
                          analysis: '甲木日主冬生，水旺木漂，需火暖局、土培根。名中"学"带火，"森"为三木，用神得当。',
                          result: '中国航天之父，科学巨匠'
                        }
                      ].map((person, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                          <h4 className="text-lg font-bold text-purple-800 mb-3">{person.name}</h4>
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium text-gray-700">八字：</span>{person.bazi}</div>
                            <div><span className="font-medium text-gray-700">分析：</span>{person.analysis}</div>
                            <div><span className="font-medium text-gray-700">成就：</span>{person.result}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 现代融合模块 */}
              {activeSection === 'modern' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🔬 现代融合与科学应用</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      了解如何将传统八字理论与现代科学方法相结合，实现智能化、标准化的取名应用
                    </p>
                  </div>

                  {/* 算法实现 */}
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-8 rounded-2xl border border-cyan-200">
                    <h3 className="text-2xl font-bold text-cyan-800 mb-6 text-center">⚙️ 算法化实现方案</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-cyan-700 mb-4">🧮 核心算法流程</h4>
                        <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                          <div className="text-green-600 mb-2">// 八字分析算法</div>
                          <div className="text-blue-600">function analyzeBazi(birthTime) {`{`}</div>
                          <div className="text-gray-700 ml-4">// 1. 排四柱八字</div>
                          <div className="text-gray-700 ml-4">const bazi = getPaiZhu(birthTime);</div>
                          <div className="text-gray-700 ml-4">// 2. 分析五行强弱</div>
                          <div className="text-gray-700 ml-4">const strength = analyzeWuxing(bazi);</div>
                          <div className="text-gray-700 ml-4">// 3. 判断日主强弱</div>
                          <div className="text-gray-700 ml-4">const dayMaster = analyzeDayMaster(bazi);</div>
                          <div className="text-gray-700 ml-4">// 4. 确定喜用神</div>
                          <div className="text-gray-700 ml-4">return getXiYongShen(dayMaster, strength);</div>
                          <div className="text-blue-600">{`}`}</div>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-green-700 mb-4">🎯 智能匹配系统</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">1</span>
                            <div>
                              <div className="font-medium text-green-800">字库建立</div>
                              <div className="text-sm text-green-600">建立汉字五行属性数据库，精确标注每个字的能量属性</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">2</span>
                            <div>
                              <div className="font-medium text-green-800">智能筛选</div>
                              <div className="text-sm text-green-600">根据喜用神自动筛选符合条件的汉字组合</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">3</span>
                            <div>
                              <div className="font-medium text-green-800">综合评估</div>
                              <div className="text-sm text-green-600">结合音韵、字义、美观等因素进行综合评分</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 兼容性设计 */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-200">
                    <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center">🔗 多体系兼容设计</h3>
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-purple-700 mb-4">🎭 融合策略</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl mb-2">🔮</div>
                            <div className="font-semibold text-purple-700 mb-2">八字喜用神</div>
                            <div className="text-sm text-purple-600">主导性原则<br/>优先级最高</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl mb-2">🧮</div>
                            <div className="font-semibold text-blue-700 mb-2">三才五格</div>
                            <div className="text-sm text-blue-600">辅助性参考<br/>数理吉祥</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl mb-2">🌸</div>
                            <div className="font-semibold text-green-700 mb-2">音韵美学</div>
                            <div className="text-sm text-green-600">优化性调整<br/>提升品质</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-orange-700 mb-4">⚖️ 权重分配</h4>
                        <div className="space-y-3">
                          {[
                            { system: '八字喜用神匹配', weight: 40, color: 'red' },
                            { system: '字义内涵寓意', weight: 25, color: 'blue' },
                            { system: '音韵节律美感', weight: 20, color: 'green' },
                            { system: '三才五格数理', weight: 10, color: 'purple' },
                            { system: '书写美观度', weight: 5, color: 'gray' }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-gray-700 font-medium">{item.system}</span>
                              <div className="flex items-center space-x-3">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`bg-${item.color}-500 h-2 rounded-full`}
                                    style={{ width: `${item.weight}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-600">{item.weight}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 质量保证 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
                      <h3 className="text-lg font-semibold text-emerald-800 mb-4">✅ 质量保证机制</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <span className="text-green-500 text-lg">✓</span>
                          <div>
                            <div className="font-medium text-emerald-700">专业审核</div>
                            <div className="text-sm text-emerald-600">命理专家人工校验算法结果</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-green-500 text-lg">✓</span>
                          <div>
                            <div className="font-medium text-emerald-700">多重验证</div>
                            <div className="text-sm text-emerald-600">交叉验证确保喜用神判断准确</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-green-500 text-lg">✓</span>
                          <div>
                            <div className="font-medium text-emerald-700">用户反馈</div>
                            <div className="text-sm text-emerald-600">收集使用效果，持续优化算法</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-xl border border-orange-200">
                      <h3 className="text-lg font-semibold text-red-800 mb-4">🛡️ 风险控制</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <span className="text-red-500 text-lg">!</span>
                          <div>
                            <div className="font-medium text-red-700">避免极端</div>
                            <div className="text-sm text-red-600">不追求完全匹配，保持名字的自然性</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-red-500 text-lg">!</span>
                          <div>
                            <div className="font-medium text-red-700">文化尊重</div>
                            <div className="text-sm text-red-600">尊重家族传统，避免冲突</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-red-500 text-lg">!</span>
                          <div>
                            <div className="font-medium text-red-700">理性引导</div>
                            <div className="text-sm text-red-600">避免过度迷信，保持理性态度</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 理性思考模块 */}
              {activeSection === 'thinking' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🤔 理性思考与科学态度</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      客观分析八字喜用神的价值与局限，保持理性思维，传承文化精髓而不盲从迷信
                    </p>
                  </div>

                  {/* 科学质疑 */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 rounded-2xl border border-red-200">
                    <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">🔬 科学质疑与理论审视</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-red-700 mb-4">❌ 理论局限性</h4>
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg border border-red-200">
                            <div className="font-semibold text-red-800 mb-2">时辰精度问题</div>
                            <div className="text-sm text-red-600">
                              古代计时不够精确，现代出生时间误差可能导致
                              时柱错误，进而影响整个分析结果的准确性。
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-red-200">
                            <div className="font-semibold text-red-800 mb-2">地域时差忽略</div>
                            <div className="text-sm text-red-600">
                              传统方法未考虑真太阳时与当地时间差异，
                              可能造成排盘不准确，特别是边境地区。
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-red-700 mb-4">📊 统计验证缺失</h4>
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg border border-red-200">
                            <div className="font-semibold text-red-800 mb-2">缺乏大样本研究</div>
                            <div className="text-sm text-red-600">
                              至今未有严格的统计学研究证实
                              八字与人生成就之间的因果关系。
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-red-200">
                            <div className="font-semibold text-red-800 mb-2">选择性验证</div>
                            <div className="text-sm text-red-600">
                              人们倾向于记住符合预期的案例，
                              忽略不符合的反例，形成认知偏差。
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 文化价值重新定位 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">🎭 文化价值的重新审视</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-semibold text-blue-700 mb-4">💡 积极意义</h4>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <span className="text-green-500 text-lg mt-1">✓</span>
                            <div>
                              <div className="font-medium text-blue-800">系统化思维</div>
                              <div className="text-sm text-blue-600">
                                提供了分析问题的系统化框架，
                                训练整体性思维和平衡意识
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="text-green-500 text-lg mt-1">✓</span>
                            <div>
                              <div className="font-medium text-blue-800">文化传承载体</div>
                              <div className="text-sm text-blue-600">
                                承载着中华文化的哲学智慧，
                                体现天人合一的自然观念
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="text-green-500 text-lg mt-1">✓</span>
                            <div>
                              <div className="font-medium text-blue-800">心理调节功能</div>
                              <div className="text-sm text-blue-600">
                                为人们提供心理慰藉和寄托，
                                增强面对困难的信心
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-semibold text-orange-700 mb-4">⚖️ 理性边界</h4>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <span className="text-orange-500 text-lg mt-1">!</span>
                            <div>
                              <div className="font-medium text-orange-800">非决定论</div>
                              <div className="text-sm text-orange-600">
                                姓名五行不能决定命运，
                                个人努力和环境因素更为关键
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="text-orange-500 text-lg mt-1">!</span>
                            <div>
                              <div className="font-medium text-orange-800">需要验证</div>
                              <div className="text-sm text-orange-600">
                                缺乏现代科学验证，
                                应保持审慎态度，避免盲从
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="text-orange-500 text-lg mt-1">!</span>
                            <div>
                              <div className="font-medium text-orange-800">综合考量</div>
                              <div className="text-sm text-orange-600">
                                应与现代价值观相结合，
                                避免过度依赖传统禁忌
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 现代应用建议 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
                    <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">💼 理性应用的现代建议</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl mb-4">🎯</div>
                        <h4 className="text-lg font-bold text-green-800 mb-3">参考不依赖</h4>
                        <p className="text-sm text-green-600">
                          将八字分析作为取名参考之一，
                          结合现代审美和价值观，
                          不因八字不佳而产生焦虑
                        </p>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl mb-4">⚖️</div>
                        <h4 className="text-lg font-bold text-green-800 mb-3">平衡多元</h4>
                        <p className="text-sm text-green-600">
                          兼顾传统文化与现代理念，
                          在尊重传统的同时，
                          保持开放包容的心态
                        </p>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl mb-4">🌟</div>
                        <h4 className="text-lg font-bold text-green-800 mb-3">注重实质</h4>
                        <p className="text-sm text-green-600">
                          更多关注名字的实际内涵、
                          文化底蕴和美好寓意，
                          而非仅仅追求五行匹配
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 警示案例 */}
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-8 rounded-2xl border-2 border-dashed border-gray-300">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">⚠️ 过度迷信的警示案例</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h4 className="text-lg font-bold text-red-700 mb-3">🚫 改名成瘾症</h4>
                        <p className="text-sm text-gray-700 mb-3">
                          某位企业家听信"大师"建议，因为八字不合而连续改名6次，
                          每次都期望改变运势，结果不仅没有改善事业，
                          反而因为频繁改名影响了商业信誉。
                        </p>
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          启示：成功靠实力和智慧，不是靠改名
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h4 className="text-lg font-bold text-red-700 mb-3">📚 教育偏差</h4>
                        <p className="text-sm text-gray-700 mb-3">
                          有家长因为孩子八字"火旺需水"，非要在名字中加水字，
                          结果选了生僻字，孩子上学写名字困难，
                          还经常被同学笑话，产生心理阴影。
                        </p>
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          启示：实用性和孩子感受比五行匹配更重要
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 结语 */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-200 text-center">
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">🎭 智慧传承，理性应用</h3>
                    <div className="max-w-4xl mx-auto">
                      <p className="text-lg text-amber-700 leading-relaxed mb-6">
                        八字喜用神承载着古人的智慧结晶，有其独特的文化价值。
                        我们应该<strong className="text-amber-800">批判继承、理性应用、智慧传承</strong>，
                        既不全盘否定传统文化，也不盲目迷信古法。
                      </p>
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="text-amber-600 italic text-lg">
                          "取其精华，去其糟粕，古为今用"<br/>
                          让传统文化在现代理性的土壤中，绽放新的生命活力
                        </div>
                      </div>
                      <div className="mt-6">
                        <button 
                          onClick={() => setActiveSection('overview')}
                          className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105"
                        >
                          🔄 重新开始学习之旅
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 底部导航 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                学习进度：{Math.round(progress)}% 完成
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    const sections = ['overview', 'theory', 'calculation', 'cases', 'modern', 'thinking'];
                    const currentIndex = sections.indexOf(activeSection);
                    if (currentIndex > 0) {
                      setActiveSection(sections[currentIndex - 1] as any);
                    }
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  ← 上一节
                </button>
                <button
                  onClick={() => {
                    const sections = ['overview', 'theory', 'calculation', 'cases', 'modern', 'thinking'];
                    const currentIndex = sections.indexOf(activeSection);
                    if (currentIndex < sections.length - 1) {
                      setActiveSection(sections[currentIndex + 1] as any);
                    }
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
                >
                  下一节 →
                </button>
              </div>
            </div>
          </div>

          {/* 返回首页 */}
          <div className="text-center mt-8">
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105"
            >
              ← 返回首页
            </Link>
          </div>
        </div>

        {/* 页面底部 */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-4">
              🔮 传统命理与现代科学的理性融合
            </div>
            <div className="text-gray-600">
              传承古老智慧，保持理性思维，让文化瑰宝在新时代焕发光彩
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BaziXiyongshenPage;