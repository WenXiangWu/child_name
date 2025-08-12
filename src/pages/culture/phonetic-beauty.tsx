import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

const PhoneticLiteraryPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'theory' | 'analysis' | 'examples' | 'cases' | 'thinking'>('overview');
  const [progress, setProgress] = useState(0);
  const [analyzerInput, setAnalyzerInput] = useState({ name: '', syllables: '' });
  const [analyzerResult, setAnalyzerResult] = useState<any>(null);

  // 计算学习进度
  useEffect(() => {
    const sections = ['overview', 'theory', 'analysis', 'examples', 'cases', 'thinking'];
    const currentIndex = sections.indexOf(activeSection);
    setProgress(((currentIndex + 1) / sections.length) * 100);
  }, [activeSection]);

  // 声韵分析函数
  const analyzePhonetics = (name: string) => {
    if (!name) return null;
    
    // 模拟声韵分析（实际应该用完整的拼音数据库）
    const pinyinMap: { [key: string]: { pinyin: string, tone: number, initial: string, final: string } } = {
      '李': { pinyin: 'lǐ', tone: 3, initial: 'l', final: 'i' },
      '王': { pinyin: 'wáng', tone: 2, initial: 'w', final: 'ang' },
      '张': { pinyin: 'zhāng', tone: 1, initial: 'zh', final: 'ang' },
      '刘': { pinyin: 'liú', tone: 2, initial: 'l', final: 'iu' },
      '陈': { pinyin: 'chén', tone: 2, initial: 'ch', final: 'en' },
      '诗': { pinyin: 'shī', tone: 1, initial: 'sh', final: 'i' },
      '涵': { pinyin: 'hán', tone: 2, initial: 'h', final: 'an' },
      '雅': { pinyin: 'yǎ', tone: 3, initial: 'y', final: 'a' },
      '琪': { pinyin: 'qí', tone: 2, initial: 'q', final: 'i' },
      '浩': { pinyin: 'hào', tone: 4, initial: 'h', final: 'ao' },
      '然': { pinyin: 'rán', tone: 2, initial: 'r', final: 'an' },
      '梦': { pinyin: 'mèng', tone: 4, initial: 'm', final: 'eng' },
      '瑶': { pinyin: 'yáo', tone: 2, initial: 'y', final: 'ao' },
      '文': { pinyin: 'wén', tone: 2, initial: 'w', final: 'en' },
      '轩': { pinyin: 'xuān', tone: 1, initial: 'x', final: 'uan' }
    };
    
    const chars = name.split('');
    const phonetics = chars.map(char => pinyinMap[char] || { 
      pinyin: char, tone: 0, initial: '', final: char 
    });
    
    // 分析声调模式
    const tonePattern = phonetics.map(p => p.tone).join('-');
    const pingze = phonetics.map(p => p.tone === 1 || p.tone === 2 ? '平' : '仄').join('');
    
    // 计算音韵和谐度
    const toneVariety = new Set(phonetics.map(p => p.tone)).size / 4 * 100;
    const initialVariety = new Set(phonetics.map(p => p.initial)).size / phonetics.length * 100;
    const finalVariety = new Set(phonetics.map(p => p.final)).size / phonetics.length * 100;
    
    const harmony = Math.round((toneVariety * 0.4 + initialVariety * 0.3 + finalVariety * 0.3));
    
    return {
      phonetics,
      tonePattern,
      pingze,
      harmony,
      analysis: {
        toneVariety: Math.round(toneVariety),
        initialVariety: Math.round(initialVariety), 
        finalVariety: Math.round(finalVariety)
      }
    };
  };

  // 处理分析器输入
  const handleAnalyze = () => {
    const result = analyzePhonetics(analyzerInput.name);
    setAnalyzerResult(result);
  };

  return (
    <Layout>
      <Head>
        <title>声韵结构文学派：音律与诗意的完美融合 - 宝宝取名专家</title>
        <meta name="description" content="深入探索声韵结构文学派的理论基础、分析方法和实际应用，体验音韵美学与文学意境的完美结合。" />
        <meta name="keywords" content="声韵结构,音韵美学,文学取名,诗意命名,音律分析,传统文化" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        {/* 固定顶部导航 */}
        <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm border-b z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            {/* 面包屑 */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Link href="/" className="hover:text-gray-800 transition-colors">首页</Link>
              <span>›</span>
              <Link href="/#culture" className="hover:text-gray-800 transition-colors">传统文化</Link>
              <span>›</span>
              <span className="text-gray-800 font-medium">声韵结构文学派</span>
            </div>
            
            {/* 学习进度条 */}
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* 英雄区域 */}
        <div className="pt-24 pb-12 bg-gradient-to-r from-purple-900 via-pink-900 to-rose-900 text-white relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute top-20 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-10 left-1/3 w-40 h-40 border border-white/20 rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 text-6xl opacity-5">🎵</div>
            <div className="absolute bottom-1/4 left-1/4 text-5xl opacity-5">📚</div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
                音律与诗意的完美融合
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              声韵结构文学派
            </h1>
            <div className="text-2xl md:text-3xl font-medium mb-4 text-purple-100">
              音律美学与文学意境的艺术结合
            </div>
            <p className="text-lg text-purple-200 max-w-3xl mx-auto mb-8 leading-relaxed">
              探索声韵结构在姓名学中的独特地位，从平仄音律到诗词意境，从声调和谐到文学美感，
              体验中华文化中音韵与文学的深度融合，创造富有诗意的美好名字。
            </p>
            
            {/* 核心特点 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">🎼</div>
                <div className="font-semibold mb-2">音韵和谐</div>
                <div className="text-sm text-purple-200">平仄相间，声调起伏，创造优美的音律节奏</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">📖</div>
                <div className="font-semibold mb-2">文学意境</div>
                <div className="text-sm text-purple-200">诗词典故，文化内涵，承载深厚的文学底蕴</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">🎨</div>
                <div className="font-semibold mb-2">艺术美感</div>
                <div className="text-sm text-purple-200">音形义结合，追求名字的整体艺术效果</div>
              </div>
            </div>
            
            {/* 行动按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setActiveSection('overview')}
                className="px-8 py-3 bg-white text-purple-900 rounded-lg font-semibold hover:bg-purple-50 transition-all transform hover:scale-105"
              >
                开始学习
              </button>
              <button 
                onClick={() => setActiveSection('analysis')}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-900 transition-all"
              >
                声韵分析
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* 模块化导航 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
            <div className="p-6 bg-gradient-to-r from-gray-50 to-purple-50 border-b">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 学习模块导航</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { id: 'overview', icon: '🎯', title: '快速概览', desc: '5分钟了解核心' },
                  { id: 'theory', icon: '🎼', title: '理论基础', desc: '音韵美学原理' },
                  { id: 'analysis', icon: '🔍', title: '声韵分析', desc: '技术分析方法' },
                  { id: 'examples', icon: '📖', title: '文学典故', desc: '诗词名句赏析' },
                  { id: 'cases', icon: '💡', title: '实战案例', desc: '经典名字解析' },
                  { id: 'thinking', icon: '🤔', title: '理性思考', desc: '优势与局限性' }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`p-4 rounded-xl transition-all duration-300 text-left group ${
                      activeSection === section.id
                        ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                        : 'bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 hover:shadow-md'
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
                      activeSection === section.id ? 'text-purple-100' : 'text-gray-500'
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
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🎯 声韵结构文学派快速入门</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      5分钟了解声韵结构文学派的核心理念，掌握音韵美学与文学意境的完美结合
                    </p>
                  </div>

                  {/* 核心概念卡片 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                      <div className="text-3xl mb-4">🎼</div>
                      <h3 className="text-xl font-bold text-purple-800 mb-3">什么是声韵结构？</h3>
                      <p className="text-purple-700">
                        以汉语声韵学为基础，分析姓名中声母、韵母、声调的搭配关系，
                        追求音律和谐、朗朗上口的语音美感效果。
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
                      <div className="text-3xl mb-4">📚</div>
                      <h3 className="text-xl font-bold text-pink-800 mb-3">文学派的特色？</h3>
                      <p className="text-pink-700">
                        结合古典诗词、文学典故，追求名字的文化内涵和诗意美感，
                        让每个名字都承载深厚的文学底蕴和艺术价值。
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-xl border border-rose-200">
                      <div className="text-3xl mb-4">🎨</div>
                      <h3 className="text-xl font-bold text-rose-800 mb-3">有什么实用价值？</h3>
                      <p className="text-rose-700">
                        创造富有艺术美感的姓名，既有优美的音韵效果，
                        又承载深厚的文化内涵，体现家族的文化品味。
                      </p>
                    </div>
                  </div>

                  {/* 声韵美学原理 */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-200 mb-8">
                    <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">🎵 声韵美学核心原理</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border-l-4 border-indigo-400">
                          <h4 className="font-bold text-indigo-700 mb-3 flex items-center">
                            <span className="mr-2">🎼</span>平仄音律
                          </h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>平声</strong>：一声、二声，音调舒缓悠扬</div>
                            <div>• <strong>仄声</strong>：三声、四声，音调抑扬变化</div>
                            <div>• <strong>搭配原则</strong>：平仄相间，错落有致</div>
                            <div>• <strong>美感效果</strong>：朗朗上口，音韵和谐</div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg border-l-4 border-purple-400">
                          <h4 className="font-bold text-purple-700 mb-3 flex items-center">
                            <span className="mr-2">🔊</span>声调和谐
                          </h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>声调变化</strong>：避免单调重复</div>
                            <div>• <strong>音律节奏</strong>：起伏有致的韵律感</div>
                            <div>• <strong>语音流畅</strong>：易读易记的发音</div>
                            <div>• <strong>听觉美感</strong>：悦耳动听的音效</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border-l-4 border-pink-400">
                          <h4 className="font-bold text-pink-700 mb-3 flex items-center">
                            <span className="mr-2">📖</span>文学意境
                          </h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>诗词典故</strong>：古典诗词的文化底蕴</div>
                            <div>• <strong>意境营造</strong>：富有诗意的美好想象</div>
                            <div>• <strong>文化传承</strong>：承载传统文学精髓</div>
                            <div>• <strong>艺术品味</strong>：体现高雅的文化素养</div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg border-l-4 border-rose-400">
                          <h4 className="font-bold text-rose-700 mb-3 flex items-center">
                            <span className="mr-2">🎨</span>整体美感
                          </h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>音形义统一</strong>：声音、字形、含义协调</div>
                            <div>• <strong>艺术效果</strong>：追求名字的整体美感</div>
                            <div>• <strong>文化品味</strong>：体现深厚的文化修养</div>
                            <div>• <strong>个性特色</strong>：独特而富有内涵</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 经典案例展示 */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-200">
                    <h3 className="text-2xl font-bold text-emerald-800 mb-6 text-center">✨ 经典案例一览</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                          <span className="mr-2">🌸</span>诗意美名
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                            <span className="font-medium">李诗涵</span>
                            <span className="text-purple-600">仄平平 • 诗意涵养</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-pink-50 rounded">
                            <span className="font-medium">王雅琪</span>
                            <span className="text-pink-600">平仄平 • 雅致美玉</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-rose-50 rounded">
                            <span className="font-medium">陈梦瑶</span>
                            <span className="text-rose-600">平仄平 • 梦幻美玉</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                          <span className="mr-2">📚</span>文学典故
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="p-3 bg-blue-50 rounded">
                            <div className="font-medium text-blue-800">浩然</div>
                            <div className="text-blue-600 text-xs mt-1">
                              出自孟子"吾善养吾浩然之气"
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded">
                            <div className="font-medium text-green-800">文轩</div>
                            <div className="text-green-600 text-xs mt-1">
                              出自《文选》"文轩树羽盖"
                            </div>
                          </div>
                          <div className="p-3 bg-indigo-50 rounded">
                            <div className="font-medium text-indigo-800">思齐</div>
                            <div className="text-indigo-600 text-xs mt-1">
                              出自《诗经》"思齐大任"
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 理论基础模块 */}
              {activeSection === 'theory' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🎼 声韵美学理论基础</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      深入了解汉语声韵学原理，掌握音律美学与文学意境的理论基础
                    </p>
                  </div>

                  {/* 汉语声韵学基础 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200 mb-8">
                    <h3 className="text-2xl font-bold text-blue-800 mb-6">🔤 汉语声韵学基础</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-lg border-l-4 border-blue-400">
                        <h4 className="font-bold text-blue-700 mb-3">声母系统</h4>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div>• <strong>唇音</strong>：b p m f</div>
                          <div>• <strong>舌音</strong>：d t n l</div>
                          <div>• <strong>齿音</strong>：z c s</div>
                          <div>• <strong>翘舌音</strong>：zh ch sh r</div>
                          <div>• <strong>软腭音</strong>：g k h</div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg border-l-4 border-indigo-400">
                        <h4 className="font-bold text-indigo-700 mb-3">韵母系统</h4>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div>• <strong>单韵母</strong>：a o e i u ü</div>
                          <div>• <strong>复韵母</strong>：ai ei ao ou</div>
                          <div>• <strong>鼻韵母</strong>：an en ang eng</div>
                          <div>• <strong>特殊韵母</strong>：er</div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg border-l-4 border-purple-400">
                        <h4 className="font-bold text-purple-700 mb-3">声调系统</h4>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div>• <strong>一声</strong>：阴平 ˉ（高平）</div>
                          <div>• <strong>二声</strong>：阳平 ˊ（升调）</div>
                          <div>• <strong>三声</strong>：上声 ˇ（降升）</div>
                          <div>• <strong>四声</strong>：去声 ˋ（降调）</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 平仄音律理论 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 mb-8">
                    <h3 className="text-2xl font-bold text-green-800 mb-6">🎵 平仄音律理论</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg">
                          <h4 className="font-bold text-green-700 mb-4">平声特征</h4>
                          <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex items-center">
                              <span className="w-16 text-blue-600 font-medium">一声：</span>
                              <span>高平调，如"天妈高"</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-16 text-green-600 font-medium">二声：</span>
                              <span>升调，如"田麻豪"</span>
                            </div>
                            <div className="mt-4 p-3 bg-green-50 rounded text-xs">
                              <strong>音律特点：</strong>音调舒缓平稳，读音悠长，给人以安详宁静的感觉
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg">
                          <h4 className="font-bold text-orange-700 mb-4">仄声特征</h4>
                          <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex items-center">
                              <span className="w-16 text-orange-600 font-medium">三声：</span>
                              <span>降升调，如"好马老"</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-16 text-red-600 font-medium">四声：</span>
                              <span>降调，如"号骂号"</span>
                            </div>
                            <div className="mt-4 p-3 bg-orange-50 rounded text-xs">
                              <strong>音律特点：</strong>音调变化明显，节奏感强，给人以有力动感的感觉
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg">
                        <h4 className="font-bold text-purple-700 mb-4">平仄搭配模式</h4>
                        <div className="space-y-4 text-sm">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-blue-50 rounded text-center">
                              <div className="font-bold text-blue-700">平平仄</div>
                              <div className="text-xs text-gray-600 mt-1">如：天美慧</div>
                              <div className="text-xs text-blue-600 mt-1">优雅舒缓</div>
                            </div>
                            <div className="p-3 bg-green-50 rounded text-center">
                              <div className="font-bold text-green-700">平仄平</div>
                              <div className="text-xs text-gray-600 mt-1">如：天智华</div>
                              <div className="text-xs text-green-600 mt-1">起伏有致</div>
                            </div>
                            <div className="p-3 bg-orange-50 rounded text-center">
                              <div className="font-bold text-orange-700">仄平仄</div>
                              <div className="text-xs text-gray-600 mt-1">如：智天乐</div>
                              <div className="text-xs text-orange-600 mt-1">节奏感强</div>
                            </div>
                            <div className="p-3 bg-purple-50 rounded text-center">
                              <div className="font-bold text-purple-700">仄仄平</div>
                              <div className="text-xs text-gray-600 mt-1">如：智慧天</div>
                              <div className="text-xs text-purple-600 mt-1">层次丰富</div>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-purple-50 rounded text-xs">
                            <strong>最佳搭配：</strong>平仄相间，避免连续三个字同为平声或仄声，
                            追求音律的丰富变化和和谐统一。
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 文学美学理论 */}
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-8 rounded-2xl border border-rose-200">
                    <h3 className="text-2xl font-bold text-rose-800 mb-6">📚 文学美学理论</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border-l-4 border-rose-400">
                          <h4 className="font-bold text-rose-700 mb-3">诗词意境</h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>情景交融</strong>：名字承载美好情感</div>
                            <div>• <strong>含蓄蕴藉</strong>：意境深远而不直白</div>
                            <div>• <strong>雅俗共赏</strong>：既有文化又易理解</div>
                            <div>• <strong>时空超越</strong>：具有永恒的美感价值</div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg border-l-4 border-pink-400">
                          <h4 className="font-bold text-pink-700 mb-3">典故运用</h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>经典出处</strong>：源自经史子集</div>
                            <div>• <strong>文化传承</strong>：承载历史文化</div>
                            <div>• <strong>寓意深刻</strong>：富含人生哲理</div>
                            <div>• <strong>品味高雅</strong>：体现文化修养</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border-l-4 border-purple-400">
                          <h4 className="font-bold text-purple-700 mb-3">美学原则</h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>音形义统一</strong>：三美和谐统一</div>
                            <div>• <strong>整体协调</strong>：各要素相互呼应</div>
                            <div>• <strong>个性鲜明</strong>：独特而有特色</div>
                            <div>• <strong>时代适应</strong>：传统与现代结合</div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg border-l-4 border-indigo-400">
                          <h4 className="font-bold text-indigo-700 mb-3">创作技法</h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>化用典故</strong>：巧妙运用古典文献</div>
                            <div>• <strong>意象组合</strong>：美好意象的艺术组合</div>
                            <div>• <strong>音韵考虑</strong>：兼顾声韵美感</div>
                            <div>• <strong>文化融入</strong>：体现深厚文化底蕴</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 声韵分析模块 */}
              {activeSection === 'analysis' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🔍 声韵结构分析工具</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      运用科学的声韵分析方法，评估姓名的音律美感和文学价值
                    </p>
                  </div>

                  {/* 在线分析器 */}
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-8 rounded-2xl border border-cyan-200 mb-8">
                    <h3 className="text-2xl font-bold text-cyan-800 mb-6 text-center">🎯 声韵分析器</h3>
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              输入姓名进行分析：
                            </label>
                            <input
                              type="text"
                              value={analyzerInput.name}
                              onChange={(e) => setAnalyzerInput({...analyzerInput, name: e.target.value})}
                              placeholder="请输入姓名，如：李诗涵"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
                            />
                          </div>
                          
                          <button
                            onClick={handleAnalyze}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all transform hover:scale-105"
                          >
                            🔍 开始分析
                          </button>
                        </div>
                        
                        {analyzerResult && (
                          <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                            <h4 className="font-bold text-lg text-gray-800 mb-4">分析结果：</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                                  <div className="text-sm text-gray-600">拼音信息</div>
                                  <div className="font-medium">
                                    {analyzerResult.phonetics.map((p: any, i: number) => 
                                      <span key={i} className="mr-2">{p.pinyin}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded border-l-4 border-green-400">
                                  <div className="text-sm text-gray-600">声调模式</div>
                                  <div className="font-medium">{analyzerResult.tonePattern}</div>
                                </div>
                                <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                                  <div className="text-sm text-gray-600">平仄模式</div>
                                  <div className="font-medium">{analyzerResult.pingze}</div>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="bg-white p-3 rounded border-l-4 border-orange-400">
                                  <div className="text-sm text-gray-600">音韵和谐度</div>
                                  <div className="font-medium text-lg">
                                    {analyzerResult.harmony}分
                                    <span className={`ml-2 text-sm ${
                                      analyzerResult.harmony >= 80 ? 'text-green-600' :
                                      analyzerResult.harmony >= 60 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                      {analyzerResult.harmony >= 80 ? '优秀' :
                                       analyzerResult.harmony >= 60 ? '良好' : '一般'}
                                    </span>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded border-l-4 border-pink-400">
                                  <div className="text-sm text-gray-600">声调变化</div>
                                  <div className="font-medium">{analyzerResult.analysis.toneVariety}%</div>
                                </div>
                                <div className="bg-white p-3 rounded border-l-4 border-indigo-400">
                                  <div className="text-sm text-gray-600">音韵丰富度</div>
                                  <div className="font-medium">
                                    {Math.round((analyzerResult.analysis.initialVariety + analyzerResult.analysis.finalVariety) / 2)}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 分析原理说明 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
                    <h3 className="text-2xl font-bold text-green-800 mb-6">⚙️ 分析算法原理</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg">
                          <h4 className="font-bold text-green-700 mb-4">声韵分析步骤</h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                              <div>
                                <div className="font-medium">拼音提取</div>
                                <div className="text-gray-600">从字典中获取准确的拼音和声调</div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                              <div>
                                <div className="font-medium">声母韵母分析</div>
                                <div className="text-gray-600">识别声母、韵母的类型和特点</div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                              <div>
                                <div className="font-medium">平仄判定</div>
                                <div className="text-gray-600">根据声调确定平仄属性</div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                              <div>
                                <div className="font-medium">和谐度计算</div>
                                <div className="text-gray-600">综合评估音韵美感</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg">
                          <h4 className="font-bold text-blue-700 mb-4">评分算法</h4>
                          <div className="bg-gray-50 p-4 rounded font-mono text-sm mb-4">
                            <div className="text-gray-600 mb-2">// 音韵和谐度计算公式</div>
                            <div className="text-purple-600">harmony = (</div>
                            <div className="text-blue-600 ml-4">toneVariety * 0.4 +</div>
                            <div className="text-green-600 ml-4">initialVariety * 0.3 +</div>
                            <div className="text-orange-600 ml-4">finalVariety * 0.3</div>
                            <div className="text-purple-600">);</div>
                          </div>
                          <div className="space-y-2 text-sm text-gray-700">
                            <div>• <strong>声调多样性</strong>：40%权重</div>
                            <div>• <strong>声母多样性</strong>：30%权重</div>
                            <div>• <strong>韵母多样性</strong>：30%权重</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 文学典故模块 */}
              {activeSection === 'examples' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">📖 文学典故与诗意名字</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      探索古典文学中的美丽词汇，体验诗词典故在姓名中的艺术运用
                    </p>
                  </div>

                  {/* 诗经典故 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200 mb-8">
                    <h3 className="text-2xl font-bold text-blue-800 mb-6">📜 诗经雅名</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { name: '思齐', source: '《诗经·大雅·思齐》', quote: '思齐大任，文王之母', meaning: '思慕贤德，效法先贤' },
                        { name: '静姝', source: '《诗经·邶风·静女》', quote: '静女其姝，俟我于城隅', meaning: '文静美好的女子' },
                        { name: '琼瑶', source: '《诗经·卫风·木瓜》', quote: '投我以木瓜，报之以琼瑶', meaning: '美玉，珍贵美好' },
                        { name: '如雪', source: '《诗经·曹风·蜉蝣》', quote: '蜉蝣掘阅，麻衣如雪', meaning: '洁白如雪，纯洁美好' }
                      ].map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg border-l-4 border-blue-400">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xl font-bold text-blue-800">{item.name}</h4>
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">诗经</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{item.source}</div>
                          <div className="text-blue-700 italic mb-3">"{item.quote}"</div>
                          <div className="text-gray-700 text-sm">{item.meaning}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 楚辞典故 */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-200 mb-8">
                    <h3 className="text-2xl font-bold text-purple-800 mb-6">🌺 楚辞雅韵</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { name: '辰星', source: '《楚辞·远游》', quote: '奇傅说之托辰星兮', meaning: '明亮的星辰，光明璀璨' },
                        { name: '云君', source: '《楚辞·九歌·云中君》', quote: '云中君兮纷纷而来下', meaning: '云中仙君，高贵超然' },
                        { name: '素洁', source: '《楚辞·九叹·怨思》', quote: '情素洁于纽帛', meaning: '纯洁高尚的品格' },
                        { name: '怀德', source: '《楚辞·九章·橘颂》', quote: '秉德无私，参天地兮', meaning: '怀抱美德，品格高尚' }
                      ].map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg border-l-4 border-purple-400">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xl font-bold text-purple-800">{item.name}</h4>
                            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">楚辞</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{item.source}</div>
                          <div className="text-purple-700 italic mb-3">"{item.quote}"</div>
                          <div className="text-gray-700 text-sm">{item.meaning}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 唐诗宋词 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 mb-8">
                    <h3 className="text-2xl font-bold text-green-800 mb-6">🍃 唐诗宋词</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { name: '晨风', source: '李白《早发白帝城》', quote: '朝辞白帝彩云间', meaning: '清晨的风，清新自然' },
                        { name: '云帆', source: '李白《行路难》', quote: '长风破浪会有时，直挂云帆济沧海', meaning: '远大志向，乘风破浪' },
                        { name: '疏影', source: '林逋《山园小梅》', quote: '疏影横斜水清浅', meaning: '淡雅清幽，如梅花之美' },
                        { name: '清照', source: '李清照', quote: '知否？知否？应是绿肥红瘦', meaning: '清明照人，才情出众' }
                      ].map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg border-l-4 border-green-400">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xl font-bold text-green-800">{item.name}</h4>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">唐宋</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{item.source}</div>
                          <div className="text-green-700 italic mb-3">"{item.quote}"</div>
                          <div className="text-gray-700 text-sm">{item.meaning}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 文学意象分类 */}
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-8 rounded-2xl border border-rose-200">
                    <h3 className="text-2xl font-bold text-rose-800 mb-6">🎨 文学意象分类</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-lg">
                        <h4 className="font-bold text-rose-700 mb-4 flex items-center">
                          <span className="mr-2">🌸</span>自然意象
                        </h4>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div>• <strong>花木</strong>：梅兰竹菊，松柏梧桐</div>
                          <div>• <strong>山水</strong>：江河湖海，峰峦溪谷</div>
                          <div>• <strong>天象</strong>：日月星辰，云霞虹霓</div>
                          <div>• <strong>季节</strong>：春花秋月，夏雨冬雪</div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg">
                        <h4 className="font-bold text-purple-700 mb-4 flex items-center">
                          <span className="mr-2">💎</span>器物意象
                        </h4>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div>• <strong>珠玉</strong>：琼瑶珠璧，翡翠玛瑙</div>
                          <div>• <strong>文房</strong>：笔墨纸砚，书香墨韵</div>
                          <div>• <strong>乐器</strong>：琴瑟箫笛，钟鼓编磬</div>
                          <div>• <strong>器皿</strong>：鼎彝尊爵，瓶罐壶杯</div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg">
                        <h4 className="font-bold text-indigo-700 mb-4 flex items-center">
                          <span className="mr-2">✨</span>品德意象
                        </h4>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div>• <strong>品格</strong>：仁义礼智，温良恭俭</div>
                          <div>• <strong>志向</strong>：凌云之志，鸿鹄之志</div>
                          <div>• <strong>品质</strong>：清雅高洁，淡泊宁静</div>
                          <div>• <strong>境界</strong>：超然物外，宁静致远</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 实战案例模块 */}
              {activeSection === 'cases' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">💡 声韵文学派实战案例</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      通过具体案例深入理解声韵结构文学派的应用方法和美学价值
                    </p>
                  </div>

                  {/* 优秀案例分析 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 mb-8">
                    <h3 className="text-2xl font-bold text-green-800 mb-6">🌟 优秀案例深度解析</h3>
                    <div className="space-y-6">
                      {[
                        {
                          name: '李诗涵',
                          pinyin: 'lǐ shī hán',
                          tone: '3-1-2',
                          pingze: '仄平平',
                          score: 92,
                          analysis: '仄声开头铿锵有力，后续平声舒缓流畅，整体音韵层次丰富。"诗涵"二字富有文学气息，体现深厚的诗意内涵。',
                          literary: '取意于"腹有诗书气自华"，涵字有包容、涵养之意，寓意才情出众、学识渊博。',
                          features: ['音韵和谐', '文学意境', '寓意深刻', '朗朗上口']
                        },
                        {
                          name: '王雅琪',
                          pinyin: 'wáng yǎ qí',
                          tone: '2-3-2',
                          pingze: '平仄平',
                          score: 88,
                          analysis: '平仄平的经典模式，音韵起伏有致。雅字体现高雅品味，琪字如美玉般珍贵，组合优美。',
                          literary: '"雅"取自《诗经》雅颂传统，"琪"为美玉，两字组合寓意高雅如玉、品格高尚。',
                          features: ['平仄协调', '字义典雅', '音韵优美', '文化底蕴']
                        }
                      ].map((item, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl border border-green-200 shadow-sm">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg">
                                <h4 className="text-2xl font-bold text-green-800 mb-2">{item.name}</h4>
                                <div className="text-green-600 mb-2">{item.pinyin}</div>
                                <div className="text-sm text-gray-600 mb-2">声调：{item.tone}</div>
                                <div className="text-sm text-gray-600 mb-4">平仄：{item.pingze}</div>
                                <div className="text-3xl font-bold text-green-700">{item.score}分</div>
                                <div className="text-sm text-green-600">音韵和谐度</div>
                              </div>
                            </div>
                            
                            <div className="lg:col-span-2 space-y-6">
                              <div className="bg-blue-50 p-6 rounded-lg">
                                <h5 className="font-bold text-blue-800 mb-3 flex items-center">
                                  <span className="mr-2">🎵</span>声韵分析
                                </h5>
                                <p className="text-blue-700 text-sm leading-relaxed">{item.analysis}</p>
                              </div>
                              
                              <div className="bg-purple-50 p-6 rounded-lg">
                                <h5 className="font-bold text-purple-800 mb-3 flex items-center">
                                  <span className="mr-2">📚</span>文学内涵
                                </h5>
                                <p className="text-purple-700 text-sm leading-relaxed">{item.literary}</p>
                              </div>
                              
                              <div className="bg-orange-50 p-6 rounded-lg">
                                <h5 className="font-bold text-orange-800 mb-3 flex items-center">
                                  <span className="mr-2">✨</span>突出特点
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {item.features.map((feature, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 创作过程展示 */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-200 mb-8">
                    <h3 className="text-2xl font-bold text-purple-800 mb-6">🎨 创作过程展示</h3>
                    <div className="bg-white p-6 rounded-lg">
                      <h4 className="font-bold text-lg text-gray-800 mb-4">以"陈梦瑶"为例的创作过程：</h4>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">确定姓氏音韵</div>
                            <div className="text-sm text-gray-600 mt-1">
                              "陈"（chén）为阳平调，属平声，需要考虑后续字的声调搭配
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">选择文学意象</div>
                            <div className="text-sm text-gray-600 mt-1">
                              "梦"字富有诗意，寓意美好愿望；"瑶"为美玉，象征珍贵美好
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">声调搭配分析</div>
                            <div className="text-sm text-gray-600 mt-1">
                              陈（2声）+ 梦（4声）+ 瑶（2声）= 平仄平，形成优美的音律节奏
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">整体效果评估</div>
                            <div className="text-sm text-gray-600 mt-1">
                              音韵和谐，寓意美好，既有诗意又易于理解和记忆，符合声韵文学派的美学追求
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 不同风格对比 */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-800 mb-6">🎭 不同风格对比</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-lg">
                        <h4 className="font-bold text-blue-700 mb-4 flex items-center">
                          <span className="mr-2">🌸</span>婉约风格
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="p-3 bg-pink-50 rounded">
                            <div className="font-medium text-pink-800">李清雅</div>
                            <div className="text-xs text-gray-600 mt-1">
                              清如水，雅如兰，温婉柔美的女性气质
                            </div>
                          </div>
                          <div className="p-3 bg-purple-50 rounded">
                            <div className="font-medium text-purple-800">王静慧</div>
                            <div className="text-xs text-gray-600 mt-1">
                              静中生慧，宁静致远的内在品质
                            </div>
                          </div>
                          <div className="p-3 bg-rose-50 rounded">
                            <div className="font-medium text-rose-800">陈婉茹</div>
                            <div className="text-xs text-gray-600 mt-1">
                              温婉如玉，柔美似水的优雅气质
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg">
                        <h4 className="font-bold text-green-700 mb-4 flex items-center">
                          <span className="mr-2">🏔️</span>豪放风格
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="p-3 bg-blue-50 rounded">
                            <div className="font-medium text-blue-800">李浩然</div>
                            <div className="text-xs text-gray-600 mt-1">
                              浩然正气，心胸开阔的男性风范
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded">
                            <div className="font-medium text-green-800">王志远</div>
                            <div className="text-xs text-gray-600 mt-1">
                              志存高远，胸怀天下的远大抱负
                            </div>
                          </div>
                          <div className="p-3 bg-indigo-50 rounded">
                            <div className="font-medium text-indigo-800">陈磊落</div>
                            <div className="text-xs text-gray-600 mt-1">
                              磊落光明，坦荡豪迈的性格特征
                            </div>
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
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🤔 理性思考：优势与局限</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      客观分析声韵结构文学派的价值与限制，理性看待其在现代命名中的作用
                    </p>
                  </div>

                  {/* 主要优势 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 mb-8">
                    <h3 className="text-2xl font-bold text-green-800 mb-6">✅ 主要优势</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border-l-4 border-green-400">
                          <h4 className="font-bold text-green-700 mb-3 flex items-center">
                            <span className="mr-2">🎵</span>音韵美感
                          </h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>科学基础</strong>：基于语言学的音韵理论</div>
                            <div>• <strong>听觉美感</strong>：注重名字的音律和谐</div>
                            <div>• <strong>朗朗上口</strong>：易读易记，便于传播</div>
                            <div>• <strong>节奏感强</strong>：平仄相间的音律美</div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg border-l-4 border-emerald-400">
                          <h4 className="font-bold text-emerald-700 mb-3 flex items-center">
                            <span className="mr-2">📚</span>文化价值
                          </h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>传统传承</strong>：承载深厚的文化底蕴</div>
                            <div>• <strong>诗意美感</strong>：富有文学艺术价值</div>
                            <div>• <strong>典故运用</strong>：体现文化修养</div>
                            <div>• <strong>意境深远</strong>：营造美好的想象空间</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border-l-4 border-blue-400">
                          <h4 className="font-bold text-blue-700 mb-3 flex items-center">
                            <span className="mr-2">🎨</span>艺术性强
                          </h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>整体美感</strong>：音形义的统一</div>
                            <div>• <strong>个性鲜明</strong>：富有独特的艺术特色</div>
                            <div>• <strong>品味高雅</strong>：体现良好的文化品味</div>
                            <div>• <strong>创新发展</strong>：传统与现代的结合</div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg border-l-4 border-purple-400">
                          <h4 className="font-bold text-purple-700 mb-3 flex items-center">
                            <span className="mr-2">💡</span>实用价值
                          </h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>评价标准</strong>：提供客观的美感评判</div>
                            <div>• <strong>创作指导</strong>：为命名提供系统方法</div>
                            <div>• <strong>文化教育</strong>：普及传统文化知识</div>
                            <div>• <strong>审美培养</strong>：提升文化审美能力</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 存在局限 */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-200 mb-8">
                    <h3 className="text-2xl font-bold text-orange-800 mb-6">⚠️ 存在局限</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border-l-4 border-yellow-400">
                          <h4 className="font-bold text-yellow-700 mb-3 flex items-center">
                            <span className="mr-2">📖</span>文化门槛
                          </h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>知识要求高</strong>：需要深厚的文学功底</div>
                            <div>• <strong>理解困难</strong>：典故可能晦涩难懂</div>
                            <div>• <strong>时代差距</strong>：古典文化与现代生活脱节</div>
                            <div>• <strong>接受度差异</strong>：不同文化背景理解不同</div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg border-l-4 border-orange-400">
                          <h4 className="font-bold text-orange-700 mb-3 flex items-center">
                            <span className="mr-2">🎯</span>主观性强
                          </h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>审美差异</strong>：美感标准因人而异</div>
                            <div>• <strong>文化偏好</strong>：受个人文化背景影响</div>
                            <div>• <strong>时代特色</strong>：不同时代审美观念不同</div>
                            <div>• <strong>地域差异</strong>：方言影响音韵感受</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border-l-4 border-red-400">
                          <h4 className="font-bold text-red-700 mb-3 flex items-center">
                            <span className="mr-2">⚖️</span>实用限制
                          </h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>选择范围窄</strong>：符合要求的字词有限</div>
                            <div>• <strong>创新困难</strong>：容易落入传统模式</div>
                            <div>• <strong>现代适应</strong>：与现代命名需求冲突</div>
                            <div>• <strong>实际运用</strong>：日常使用中意义不大</div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg border-l-4 border-gray-400">
                          <h4 className="font-bold text-gray-700 mb-3 flex items-center">
                            <span className="mr-2">🔬</span>科学性质疑
                          </h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div>• <strong>缺乏实证</strong>：音韵对人生影响无科学证据</div>
                            <div>• <strong>心理作用</strong>：主要起到心理暗示效果</div>
                            <div>• <strong>文化建构</strong>：美感标准是文化建构的</div>
                            <div>• <strong>功能夸大</strong>：过度强调音韵的作用</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 理性建议 */}
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-200">
                    <h3 className="text-2xl font-bold text-indigo-800 mb-6">💡 理性建议</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-lg border-t-4 border-indigo-400">
                        <h4 className="font-bold text-indigo-700 mb-3">适度运用</h4>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div>• 作为参考标准而非绝对准则</div>
                          <div>• 结合现代命名的实际需求</div>
                          <div>• 避免过度追求完美音韵</div>
                          <div>• 平衡传统与现代的需要</div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg border-t-4 border-blue-400">
                        <h4 className="font-bold text-blue-700 mb-3">文化传承</h4>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div>• 传承优秀的文化传统</div>
                          <div>• 普及传统文化知识</div>
                          <div>• 培养文化审美能力</div>
                          <div>• 增强文化自信心</div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg border-t-4 border-purple-400">
                        <h4 className="font-bold text-purple-700 mb-3">创新发展</h4>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div>• 结合现代语言学成果</div>
                          <div>• 融入时代特色元素</div>
                          <div>• 拓展应用范围和方法</div>
                          <div>• 建立科学评价体系</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                      <h4 className="font-bold text-blue-800 mb-3 text-center">📝 总结建议</h4>
                      <p className="text-blue-700 text-sm leading-relaxed text-center">
                        声韵结构文学派作为传统文化的重要组成部分，具有独特的艺术价值和文化意义。
                        在现代命名实践中，我们应当理性对待，既要传承其优秀的文化内涵，
                        又要结合时代特点和实际需求，创新发展，让传统文化在新时代焕发新的活力。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 返回首页按钮 */}
          <div className="text-center">
            <Link 
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
            >
              ← 返回首页
            </Link>
          </div>
        </div>

        {/* 页面底部 */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-sm text-gray-600">
              🎵 声韵美学与文学意境的完美融合 • 传承中华文化瑰宝
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PhoneticLiteraryPage;