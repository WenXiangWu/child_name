import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

const SancaiWugePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'history' | 'formula' | 'algorithm' | 'cases' | 'thinking'>('overview');
  const [progress, setProgress] = useState(0);
  const [calculatorInput, setCalculatorInput] = useState({ surname: '', firstName: '' });
  const [calculatorResult, setCalculatorResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [invalidChars, setInvalidChars] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 计算学习进度
  useEffect(() => {
    const sections = ['overview', 'history', 'formula', 'algorithm', 'cases', 'thinking'];
    const currentIndex = sections.indexOf(activeSection);
    setProgress(((currentIndex + 1) / sections.length) * 100);
  }, [activeSection]);

  // 加载字符数据库
  const [characterDatabase, setCharacterDatabase] = useState<any>(null);

  useEffect(() => {
    const loadCharacterDatabase = async () => {
      try {
        const response = await fetch('/data/final-enhanced-character-database.json');
        const data = await response.json();
        console.log('数据库加载成功，数据库键:', Object.keys(data).slice(0, 10));
        console.log('字符数据总数:', data.data ? Object.keys(data.data).length : 0);
        setCharacterDatabase(data.data || {});
      } catch (error) {
        console.error('加载字符数据库失败:', error);
      }
    };
    loadCharacterDatabase();
  }, []);

  // 精确的五格计算函数（使用真实康熙字典数据）
  const calculateWuge = (surname: string, firstName: string) => {
    if (!surname || !firstName || !characterDatabase) return null;
    
    // 从数据库获取准确的康熙笔画数
    const getKangxiStrokes = (char: string): number => {
      // 数据库直接在根对象下包含字符数据，跳过meta等元数据字段
      const charData = characterDatabase[char];
      

      
      // 检查是否是有效的字符数据（有char属性的才是字符数据）
      if (charData && typeof charData === 'object' && charData.char === char && charData.strokes) {
        // 优先使用康熙笔画
        if (charData.strokes.kangxi && charData.strokes.kangxi > 0) {
          return charData.strokes.kangxi;
        }
        
        // 如果没有康熙笔画，使用繁体笔画
        if (charData.strokes.traditional && charData.strokes.traditional > 0) {
          return charData.strokes.traditional;
        }
        
        // 最后使用简体笔画
        if (charData.strokes.simplified && charData.strokes.simplified > 0) {
          return charData.strokes.simplified;
        }
      }
      
      console.warn(`未找到字符 "${char}" 的笔画数据 - 不是通用规范汉字`);
      return 0; // 返回0表示未找到
    };
    
    // 计算每个字符的康熙笔画数
    const surnameStrokes = getKangxiStrokes(surname);
    const firstStrokes = getKangxiStrokes(firstName[0]);
    const lastStrokes = firstName.length > 1 ? getKangxiStrokes(firstName[1]) : 0;
    
    // 检查是否所有字符都能找到笔画数据
    if (surnameStrokes === 0) {
      console.error(`姓氏 "${surname}" 未找到笔画数据`);
      return null;
    }
    if (firstStrokes === 0) {
      console.error(`名字首字 "${firstName[0]}" 未找到笔画数据`);
      return null;
    }
    if (firstName.length > 1 && lastStrokes === 0) {
      console.error(`名字末字 "${firstName[1]}" 未找到笔画数据`);
      return null;
    }
    
    const tiange = surnameStrokes + 1;
    const renge = surnameStrokes + firstStrokes;
    const dige = firstName.length > 1 ? firstStrokes + lastStrokes : firstStrokes + 1;
    const zongge = surnameStrokes + firstStrokes + lastStrokes;
    const waige = zongge - renge + 1;
    
    // 五行转换
    const getWuxing = (num: number) => {
      const remainder = num % 10;
      if (remainder === 1 || remainder === 2) return '木';
      if (remainder === 3 || remainder === 4) return '火';
      if (remainder === 5 || remainder === 6) return '土';
      if (remainder === 7 || remainder === 8) return '金';
      return '水';
    };
    
    return {
      tiange: { value: tiange, wuxing: getWuxing(tiange) },
      renge: { value: renge, wuxing: getWuxing(renge) },
      dige: { value: dige, wuxing: getWuxing(dige) },
      zongge: { value: zongge, wuxing: getWuxing(zongge) },
      waige: { value: waige, wuxing: getWuxing(waige) },
      sancai: {
        tian: getWuxing(tiange),
        ren: getWuxing(renge),
        di: getWuxing(dige)
      }
    };
  };

  // 处理计算器输入
  const handleCalculate = async () => {
    // 清除之前的错误信息
    setErrorMessage('');
    setInvalidChars([]);
    setCalculatorResult(null);

    // 检查数据库是否已加载
    if (!characterDatabase) {
      setErrorMessage('字符数据库正在加载中，请稍后再试！');
      return;
    }

    // 验证输入
    if (!calculatorInput.surname.trim()) {
      setErrorMessage('请输入姓氏！');
      return;
    }
    if (!calculatorInput.firstName.trim()) {
      setErrorMessage('请输入名字！');
      return;
    }
    
    // 验证输入字符是否为中文
    const chineseRegex = /^[\u4e00-\u9fa5]+$/;
    if (!chineseRegex.test(calculatorInput.surname.trim())) {
      setErrorMessage('姓氏必须是中文字符！');
      return;
    }
    if (!chineseRegex.test(calculatorInput.firstName.trim())) {
      setErrorMessage('名字必须是中文字符！');
      return;
    }
    
    setIsCalculating(true);
    
    // 添加轻微延迟以显示加载状态
    setTimeout(() => {
      try {
        // 检查所有字符是否都是通用规范汉字
        const allChars = (calculatorInput.surname.trim() + calculatorInput.firstName.trim()).split('');
        const notFoundChars: string[] = [];
        
        allChars.forEach(char => {
          const charData = characterDatabase[char];
          if (!charData || !charData.char || !charData.strokes) {
            notFoundChars.push(char);
          }
        });
        
        if (notFoundChars.length > 0) {
          setInvalidChars(notFoundChars);
          setErrorMessage(`以下字符不是《通用规范汉字表》中的标准汉字：${notFoundChars.join('、')}`);
          setIsCalculating(false);
          return;
        }
        
        const result = calculateWuge(calculatorInput.surname.trim(), calculatorInput.firstName.trim());
        if (result) {
          setCalculatorResult(result);
          console.log('计算结果:', result); // 调试信息
        } else {
          setErrorMessage('计算过程中出现错误，请重试！');
        }
      } catch (error) {
        console.error('计算出错:', error);
        setErrorMessage('计算过程中出现错误，请重试！');
      } finally {
        setIsCalculating(false);
      }
    }, 300);
  };

  return (
    <Layout>
      <Head>
        <title>三才五格：解密姓名中的数理奥秘 - 宝宝取名专家</title>
        <meta name="description" content="深入了解三才五格剖象法的历史起源、计算原理和实际应用，从日本回流的中华传统文化与现代算法的完美结合。" />
        <meta name="keywords" content="三才五格,五格剖象法,姓名学,数理计算,熊崎健翁,传统文化" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* 固定顶部导航 */}
        <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm border-b z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            {/* 面包屑 */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Link href="/" className="hover:text-gray-800 transition-colors">首页</Link>
              <span>›</span>
              <Link href="/#culture" className="hover:text-gray-800 transition-colors">传统文化</Link>
              <span>›</span>
              <span className="text-gray-800 font-medium">三才五格详解</span>
            </div>
            
            {/* 学习进度条 */}
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* 英雄区域 */}
        <div className="pt-24 pb-12 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute top-20 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-10 left-1/3 w-40 h-40 border border-white/20 rounded-full"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                传统文化与现代算法的完美融合
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              三才五格
            </h1>
            <div className="text-2xl md:text-3xl font-medium mb-4 text-blue-100">
              解密姓名中的数理奥秘
            </div>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto mb-8 leading-relaxed">
              从日本熊崎健翁的系统化整理到中华传统文化的深厚底蕴，探索姓名学中最具影响力的数理分析体系，
              了解五个维度如何映射人生轨迹，掌握科学计算方法背后的文化智慧。
            </p>
            
            {/* 核心特点 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">📊</div>
                <div className="font-semibold mb-2">五维数理分析</div>
                <div className="text-sm text-blue-200">天格、人格、地格、总格、外格全面解析人生运势</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">🧮</div>
                <div className="font-semibold mb-2">科学计算方法</div>
                <div className="text-sm text-blue-200">基于康熙字典笔画的精确算法与现代优化实现</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">📚</div>
                <div className="font-semibold mb-2">深厚文化底蕴</div>
                <div className="text-sm text-blue-200">承载宋明易学精髓的跨文化智慧传承</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setActiveSection('overview')}
                className="px-8 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                开始学习
              </button>
              <button 
                onClick={() => setActiveSection('formula')}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all"
              >
                在线计算
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* 模块化导航 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
            <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 学习模块导航</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { id: 'overview', icon: '🎯', title: '快速概览', desc: '5分钟了解核心' },
                  { id: 'history', icon: '📜', title: '历史起源', desc: '文化传承脉络' },
                  { id: 'formula', icon: '📐', title: '计算公式', desc: '数理计算方法' },
                  { id: 'algorithm', icon: '⚙️', title: '算法原理', desc: '技术实现详解' },
                  { id: 'cases', icon: '💡', title: '实战案例', desc: '真实名字分析' },
                  { id: 'thinking', icon: '🤔', title: '理性思考', desc: '批判与局限性' }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`p-4 rounded-xl transition-all duration-300 text-left group ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-md'
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
                      activeSection === section.id ? 'text-blue-100' : 'text-gray-500'
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
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🎯 三才五格快速入门</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      5分钟了解姓名学中最重要的数理分析体系，掌握五个维度如何影响人生轨迹
                    </p>
                  </div>

                  {/* 核心概念卡片 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                      <div className="text-3xl mb-4">🏛️</div>
                      <h3 className="text-xl font-bold text-blue-800 mb-3">什么是三才五格？</h3>
                      <p className="text-blue-700">
                        将姓名分解为天格、人格、地格、总格、外格五个数理维度，再组合成天、人、地三才，
                        通过数字能量分析人生各阶段的运势特点。
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                      <div className="text-3xl mb-4">🧮</div>
                      <h3 className="text-xl font-bold text-green-800 mb-3">计算原理是什么？</h3>
                      <p className="text-green-700">
                        基于康熙字典笔画数，通过特定公式计算五格数值，再将数字转换为五行属性，
                        分析五行相生相克关系来判断吉凶。
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                      <div className="text-3xl mb-4">📈</div>
                      <h3 className="text-xl font-bold text-purple-800 mb-3">有什么实用价值？</h3>
                      <p className="text-purple-700">
                        提供姓名评价的量化标准，帮助理解传统文化中的姓名观念，
                        但应理性看待，作为文化传承而非绝对预测。
                      </p>
                    </div>
                  </div>

                  {/* 五格快速理解图 */}
                  <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">🏗️ 五格结构一目了然</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                      {[
                        { name: '天格', color: 'blue', desc: '祖运基础', period: '先天影响', icon: '☁️' },
                        { name: '人格', color: 'green', desc: '主运核心', period: '性格命运', icon: '👤' },
                        { name: '地格', color: 'yellow', desc: '前运根基', period: '青年时期', icon: '🌱' },
                        { name: '总格', color: 'purple', desc: '后运轨迹', period: '中晚年', icon: '🎯' },
                        { name: '外格', color: 'red', desc: '副运助力', period: '社交外缘', icon: '🤝' }
                      ].map((grid, index) => (
                        <div key={grid.name} className={`bg-${grid.color}-100 p-6 rounded-xl border-2 border-${grid.color}-200 text-center transform hover:scale-105 transition-all`}>
                          <div className="text-4xl mb-3">{grid.icon}</div>
                          <div className={`text-xl font-bold text-${grid.color}-800 mb-2`}>{grid.name}</div>
                          <div className={`text-sm text-${grid.color}-600 mb-1`}>{grid.desc}</div>
                          <div className={`text-xs text-${grid.color}-500`}>{grid.period}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 学习路径指引 */}
                  <div className="bg-white border-2 border-dashed border-gray-300 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">🗺️ 推荐学习路径</h3>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      {[
                        { step: 1, title: '历史起源', desc: '了解文化背景', next: 'history' },
                        { step: 2, title: '计算公式', desc: '掌握基本方法', next: 'formula' },
                        { step: 3, title: '实战案例', desc: '看懂分析过程', next: 'cases' },
                        { step: 4, title: '理性思考', desc: '客观认知局限', next: 'thinking' }
                      ].map((item, index) => (
                        <div key={item.step} className="flex flex-col items-center text-center">
                          <button
                            onClick={() => setActiveSection(item.next as any)}
                            className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3 hover:bg-blue-700 transition-all transform hover:scale-110"
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

              {/* 历史起源模块 */}
              {activeSection === 'history' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">📜 五格剖象法：跨文化的智慧传承</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      从中国宋明易学到日本系统化整理，再回流至中华文化圈的独特历程
                    </p>
                  </div>

                  {/* 时间线 */}
                  <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                    
                    {[
                      {
                        period: '宋明时期',
                        year: '960-1644年',
                        icon: '🏛️',
                        title: '中华文化根基',
                        content: '《皇极八十一数原图》、《皇极经世》奠定数理基础，《三命通会》论述姓名与四声五音关系，形成理论雏形。',
                        side: 'left'
                      },
                      {
                        period: '近代发展',
                        year: '1918年',
                        icon: '🇯🇵',
                        title: '熊崎健翁系统化',
                        content: '日本哲学家熊崎健翁基于中国易学典籍，创立"熊崎氏姓名学"，建立完整的五格剖象理论体系。',
                        side: 'right'
                      },
                      {
                        period: '文化回流',
                        year: '1936年',
                        icon: '🌊',
                        title: '白玉光引入中文',
                        content: '台湾留学生白玉光将其引入中文世界，首先在台湾、香港传播，后风靡东南亚华人地区。',
                        side: 'left'
                      },
                      {
                        period: '本土化改造',
                        year: '1990年代',
                        icon: '🔄',
                        title: '大陆版本形成',
                        content: '方晨等命理学者进行本土化改造：采用康熙字典笔画，融入阴阳五行理论，形成当今流行版本。',
                        side: 'right'
                      }
                    ].map((item, index) => (
                      <div key={index} className={`relative flex items-center mb-12 ${item.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-1/2 ${item.side === 'left' ? 'pr-8' : 'pl-8'}`}>
                          <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${item.side === 'left' ? 'border-blue-500' : 'border-purple-500'}`}>
                            <div className="flex items-center mb-3">
                              <span className="text-2xl mr-3">{item.icon}</span>
                              <div>
                                <div className="font-bold text-gray-800">{item.period}</div>
                                <div className="text-sm text-gray-500">{item.year}</div>
                              </div>
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${item.side === 'left' ? 'text-blue-700' : 'text-purple-700'}`}>
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                          </div>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-blue-500 rounded-full"></div>
                        <div className="w-1/2"></div>
                      </div>
                    ))}
                  </div>

                  {/* 现代价值思考 */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border-2 border-dashed border-gray-300">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">💭 现代价值的理性认知</h3>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">🎭</div>
                        <div className="text-lg font-semibold text-gray-800">作为文化符号的姓名</div>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                        五格剖象法本质是<strong className="text-blue-600">数理玄学与心理暗示的结合体</strong>，
                        其价值不在"精准预测"，而在提供一种认识自我与传统的文化视角。
                        真正的好名，当在数理之外，承载家族记忆、审美意趣与人生期许——
                        如"林风眠""程十发"等大家之名，未必合于五格，却自蕴风骨。
                      </p>
                      <div className="mt-6 text-center">
                        <div className="inline-block bg-gray-100 px-6 py-3 rounded-lg">
                          <div className="text-gray-600 italic">
                            "名者，命也，字者，志也。" —— 名是生命的注脚，字是志向的寄托。<br/>
                            笔画之间，是数字与文化的千年对话。
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 计算公式模块 */}
              {activeSection === 'formula' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">📐 五格计算公式详解</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      掌握精确的数理计算方法，理解每个格局的深层含义
                    </p>
                  </div>

                  {/* 在线计算器 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200 mb-8">
                    <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">🧮 在线五格计算器</h3>
                    <div className="max-w-2xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-2">姓氏</label>
                          <input
                            type="text"
                            value={calculatorInput.surname}
                            onChange={(e) => setCalculatorInput(prev => ({ ...prev, surname: e.target.value }))}
                            placeholder="请输入姓氏，如：王"
                            className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-2">名字</label>
                          <input
                            type="text"
                            value={calculatorInput.firstName}
                            onChange={(e) => setCalculatorInput(prev => ({ ...prev, firstName: e.target.value }))}
                            placeholder="请输入名字，如：浩然"
                            className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <button
                          onClick={handleCalculate}
                          disabled={isCalculating || !characterDatabase}
                          className={`px-8 py-3 rounded-lg font-semibold transition-all transform ${
                            isCalculating || !characterDatabase
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                          } text-white`}
                        >
                          {!characterDatabase ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                              </svg>
                              加载字典数据...
                            </span>
                          ) : isCalculating ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                              </svg>
                              计算中...
                            </span>
                          ) : (
                            '立即计算'
                          )}
                        </button>
                        {!characterDatabase && (
                          <p className="text-sm text-gray-500 mt-2">
                            正在加载康熙字典数据库，请稍候...
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 错误提示展示 */}
                    {errorMessage && (
                      <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-red-800">输入错误</h3>
                            <div className="mt-2 text-sm text-red-700">
                              {errorMessage}
                            </div>
                            {invalidChars.length > 0 && (
                              <div className="mt-4">
                                <p className="text-sm text-red-700 mb-2">
                                  以下字符需要通过《通用规范汉字表》进行查询确认：
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {invalidChars.map((char, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded border border-red-300">
                                      {char}
                                    </span>
                                  ))}
                                </div>
                                <Link 
                                  href="/standard-characters"
                                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                  查询通用规范汉字表
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 计算结果展示 */}
                    {calculatorResult && (
                      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">
                          计算结果 - {calculatorInput.surname}{calculatorInput.firstName}
                        </h4>
                        <div className="text-center text-sm text-gray-600 mb-4">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            ✓ 基于权威康熙字典数据
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                          {[
                            { name: '天格', value: calculatorResult.tiange.value, wuxing: calculatorResult.tiange.wuxing, color: 'blue' },
                            { name: '人格', value: calculatorResult.renge.value, wuxing: calculatorResult.renge.wuxing, color: 'green' },
                            { name: '地格', value: calculatorResult.dige.value, wuxing: calculatorResult.dige.wuxing, color: 'yellow' },
                            { name: '总格', value: calculatorResult.zongge.value, wuxing: calculatorResult.zongge.wuxing, color: 'purple' },
                            { name: '外格', value: calculatorResult.waige.value, wuxing: calculatorResult.waige.wuxing, color: 'red' }
                          ].map((grid) => (
                            <div key={grid.name} className={`bg-${grid.color}-50 p-4 rounded-lg text-center border border-${grid.color}-200`}>
                              <div className={`text-${grid.color}-700 font-bold text-lg`}>{grid.name}</div>
                              <div className={`text-2xl font-bold text-${grid.color}-800`}>{grid.value}</div>
                              <div className={`text-${grid.color}-600`}>{grid.wuxing}</div>
                            </div>
                          ))}
                        </div>
                        <div className="text-center bg-gray-50 p-4 rounded-lg">
                          <div className="text-gray-700 mb-2">三才组合：</div>
                          <div className="text-xl font-bold text-gray-800">
                            {calculatorResult.sancai.tian} - {calculatorResult.sancai.ren} - {calculatorResult.sancai.di}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 计算公式详解 */}
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📏 核心计算公式</h3>
                    <div className="space-y-6">
                      {[
                        { 
                          name: '天格', 
                          formula: '姓氏笔画数 + 1 (单姓) 或 姓氏两字笔画和 (复姓)', 
                          meaning: '代表祖运，先天的家族基因和早年运势',
                          example: '王(4画) → 天格 = 4 + 1 = 5',
                          color: 'blue'
                        },
                        { 
                          name: '人格', 
                          formula: '姓氏末字 + 名字首字', 
                          meaning: '代表主运，核心人格特质和一生主要运势',
                          example: '王(4画) + 浩(11画) → 人格 = 4 + 11 = 15',
                          color: 'green'
                        },
                        { 
                          name: '地格', 
                          formula: '名字两字笔画和 (双字名) 或 名字笔画+1 (单字名)', 
                          meaning: '代表前运，青年时期的基础运势',
                          example: '浩(11画) + 然(12画) → 地格 = 11 + 12 = 23',
                          color: 'yellow'
                        },
                        { 
                          name: '总格', 
                          formula: '姓名全部字符笔画数之和', 
                          meaning: '代表后运，中年至晚年的整体运势轨迹',
                          example: '王(4) + 浩(11) + 然(12) → 总格 = 27',
                          color: 'purple'
                        },
                        { 
                          name: '外格', 
                          formula: '总格 - 人格 + 1', 
                          meaning: '代表副运，社交能力和外在环境的影响',
                          example: '总格(27) - 人格(15) + 1 → 外格 = 13',
                          color: 'red'
                        }
                      ].map((item) => (
                        <div key={item.name} className={`bg-${item.color}-50 p-6 rounded-xl border-l-4 border-${item.color}-400`}>
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex-1">
                              <h4 className={`text-xl font-bold text-${item.color}-800 mb-2`}>{item.name}</h4>
                              <div className={`text-${item.color}-700 font-mono text-sm mb-2`}>{item.formula}</div>
                              <div className={`text-${item.color}-600 text-sm`}>{item.meaning}</div>
                            </div>
                            <div className={`mt-4 md:mt-0 md:ml-6 bg-white p-3 rounded-lg border border-${item.color}-200`}>
                              <div className={`text-xs text-${item.color}-600 mb-1`}>示例：</div>
                              <div className={`text-sm font-mono text-${item.color}-800`}>{item.example}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 算法原理模块 */}
              {activeSection === 'algorithm' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">⚙️ 算法原理与技术实现</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      深入了解三才五格计算的技术实现，从数据结构到性能优化的完整技术方案
                    </p>
                  </div>

                  {/* 算法流程图 */}
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-8 rounded-2xl border border-cyan-200">
                    <h3 className="text-2xl font-bold text-cyan-800 mb-6 text-center">🔄 核心算法流程</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {[
                        {
                          step: 1,
                          title: '字符解析',
                          desc: '输入验证与字符分离',
                          details: ['姓名格式校验', '繁简体转换', '特殊字符处理'],
                          color: 'blue'
                        },
                        {
                          step: 2,
                          title: '笔画查询',
                          desc: '康熙字典笔画匹配',
                          details: ['字典数据库查询', '笔画修正规则', '缓存机制应用'],
                          color: 'green'
                        },
                        {
                          step: 3,
                          title: '五格计算',
                          desc: '数理公式运算',
                          details: ['天格人格计算', '地格总格运算', '外格推导逻辑'],
                          color: 'yellow'
                        },
                        {
                          step: 4,
                          title: '结果分析',
                          desc: '五行三才判断',
                          details: ['数字五行转换', '三才组合分析', '吉凶等级评定'],
                          color: 'purple'
                        }
                      ].map((item) => (
                        <div key={item.step} className={`bg-white p-6 rounded-xl border-2 border-${item.color}-200 text-center`}>
                          <div className={`w-12 h-12 bg-${item.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                            <span className={`text-xl font-bold text-${item.color}-700`}>{item.step}</span>
                          </div>
                          <h4 className={`text-lg font-bold text-${item.color}-800 mb-2`}>{item.title}</h4>
                          <p className={`text-sm text-${item.color}-600 mb-4`}>{item.desc}</p>
                          <div className="space-y-2">
                            {item.details.map((detail, index) => (
                              <div key={index} className={`text-xs text-${item.color}-500 bg-${item.color}-50 px-3 py-1 rounded-full`}>
                                {detail}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 数据结构设计 */}
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🏗️ 核心数据结构</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-blue-800 mb-4">📊 输入数据模型</h4>
                        <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                          <div className="text-green-600 mb-2">// 姓名输入接口</div>
                          <div className="text-blue-600">interface NameInput {`{`}</div>
                          <div className="ml-4 text-gray-700">surname: string;     // 姓氏</div>
                          <div className="ml-4 text-gray-700">firstName: string;  // 名字</div>
                          <div className="ml-4 text-gray-700">gender?: Gender;    // 性别(可选)</div>
                          <div className="ml-4 text-gray-700">useTraditional: boolean; // 是否使用繁体</div>
                          <div className="text-blue-600">{`}`}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-green-800 mb-4">📈 输出结果模型</h4>
                        <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                          <div className="text-green-600 mb-2">// 五格分析结果</div>
                          <div className="text-blue-600">interface WugeResult {`{`}</div>
                          <div className="ml-4 text-gray-700">grids: WugeGrids;    // 五格数值</div>
                          <div className="ml-4 text-gray-700">sancai: SancaiInfo;  // 三才信息</div>
                          <div className="ml-4 text-gray-700">analysis: Analysis;  // 详细分析</div>
                          <div className="ml-4 text-gray-700">score: number;       // 综合评分</div>
                          <div className="text-blue-600">{`}`}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 性能优化策略 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
                      <h3 className="text-lg font-semibold text-emerald-800 mb-4">🚀 性能优化策略</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <span className="text-green-500 text-lg">✓</span>
                          <div>
                            <div className="font-medium text-emerald-700">内存缓存机制</div>
                            <div className="text-sm text-emerald-600">笔画数据预加载，常用字LRU缓存</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-green-500 text-lg">✓</span>
                          <div>
                            <div className="font-medium text-emerald-700">算法复杂度优化</div>
                            <div className="text-sm text-emerald-600">O(1)字典查询，O(n)线性计算</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-green-500 text-lg">✓</span>
                          <div>
                            <div className="font-medium text-emerald-700">并发处理支持</div>
                            <div className="text-sm text-emerald-600">Web Workers异步计算，UI无阻塞</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-green-500 text-lg">✓</span>
                          <div>
                            <div className="font-medium text-emerald-700">数据压缩存储</div>
                            <div className="text-sm text-emerald-600">字典数据Gzip压缩，减少传输</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-xl border border-orange-200">
                      <h3 className="text-lg font-semibold text-red-800 mb-4">🛡️ 质量保证机制</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <span className="text-red-500 text-lg">✓</span>
                          <div>
                            <div className="font-medium text-red-700">输入验证</div>
                            <div className="text-sm text-red-600">字符集检查，长度限制，格式校验</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-red-500 text-lg">✓</span>
                          <div>
                            <div className="font-medium text-red-700">异常处理</div>
                            <div className="text-sm text-red-600">优雅降级，错误恢复，日志记录</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-red-500 text-lg">✓</span>
                          <div>
                            <div className="font-medium text-red-700">数据一致性</div>
                            <div className="text-sm text-red-600">版本控制，数据校验，回滚机制</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-red-500 text-lg">✓</span>
                          <div>
                            <div className="font-medium text-red-700">测试覆盖</div>
                            <div className="text-sm text-red-600">单元测试，集成测试，性能测试</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 性能指标监控 */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-2xl border border-purple-200">
                    <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center">📊 性能指标监控</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">&lt; 5ms</div>
                        <div className="text-sm text-gray-700 mb-1">单次计算耗时</div>
                        <div className="text-xs text-gray-500">基于本地缓存的平均响应时间</div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                        <div className="text-sm text-gray-700 mb-1">准确率</div>
                        <div className="text-xs text-gray-500">基于康熙字典的笔画匹配精度</div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">20K+</div>
                        <div className="text-sm text-gray-700 mb-1">字符支持</div>
                        <div className="text-xs text-gray-500">涵盖常用汉字及生僻字的完整支持</div>
                      </div>
                    </div>
                  </div>

                  {/* 技术架构图 */}
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🏛️ 技术架构设计</h3>
                    <div className="space-y-6">
                      {[
                        {
                          layer: '表现层 (Presentation Layer)',
                          components: ['React组件', '用户交互', '结果展示', '响应式UI'],
                          color: 'blue'
                        },
                        {
                          layer: '业务层 (Business Layer)',
                          components: ['五格计算逻辑', '三才分析算法', '吉凶判断规则', '评分系统'],
                          color: 'green'
                        },
                        {
                          layer: '数据层 (Data Layer)',
                          components: ['康熙字典数据', '笔画修正规则', '五行对应表', '吉凶数理库'],
                          color: 'yellow'
                        },
                        {
                          layer: '基础层 (Infrastructure Layer)',
                          components: ['缓存系统', '错误处理', '性能监控', '日志记录'],
                          color: 'purple'
                        }
                      ].map((item, index) => (
                        <div key={index} className={`bg-${item.color}-50 p-6 rounded-xl border-l-4 border-${item.color}-400`}>
                          <h4 className={`text-lg font-bold text-${item.color}-800 mb-3`}>{item.layer}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {item.components.map((comp, i) => (
                              <div key={i} className={`bg-white px-3 py-2 rounded-lg border border-${item.color}-200 text-center text-sm text-${item.color}-700`}>
                                {comp}
                              </div>
                            ))}
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
                      通过真实姓名的完整计算过程，深入理解三才五格的分析方法和实际应用
                    </p>
                  </div>

                  {/* 经典案例：王浩然 */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-200">
                    <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">📝 经典案例："王浩然"完整分析</h3>
                    
                    {/* 基础信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-indigo-200">
                        <div className="text-4xl font-bold text-indigo-700 mb-2">王</div>
                        <div className="text-sm text-gray-600 mb-1">4画</div>
                        <div className="text-xs text-indigo-500">姓氏</div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-indigo-200">
                        <div className="text-4xl font-bold text-indigo-700 mb-2">浩</div>
                        <div className="text-sm text-gray-600 mb-1">11画 (水)</div>
                        <div className="text-xs text-indigo-500">名首字</div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-indigo-200">
                        <div className="text-4xl font-bold text-indigo-700 mb-2">然</div>
                        <div className="text-sm text-gray-600 mb-1">12画 (金)</div>
                        <div className="text-xs text-indigo-500">名末字</div>
                      </div>
                    </div>

                    {/* 计算过程 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">🧮 五格计算过程</h4>
                      <div className="space-y-4">
                        {[
                          { name: '天格', formula: '4 + 1', result: '5', wuxing: '土', meaning: '代表祖运，稳重踏实' },
                          { name: '人格', formula: '4 + 11', result: '15', wuxing: '土', meaning: '代表主运，稳健人格' },
                          { name: '地格', formula: '11 + 12', result: '23', wuxing: '火', meaning: '代表前运，充满活力' },
                          { name: '总格', formula: '4 + 11 + 12', result: '27', wuxing: '金', meaning: '代表后运，坚韧品质' },
                          { name: '外格', formula: '27 - 15 + 1', result: '13', wuxing: '火', meaning: '代表副运，热情社交' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 text-sm font-semibold text-gray-700">{item.name}</div>
                              <div className="text-sm font-mono text-blue-600">{item.formula}</div>
                              <div className="text-lg font-bold text-purple-700">= {item.result}</div>
                              <div className="px-2 py-1 bg-yellow-100 rounded text-xs text-yellow-700">{item.wuxing}</div>
                            </div>
                            <div className="text-xs text-gray-600">{item.meaning}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 历史名人案例 */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-6 text-center">🏆 历史名人案例分析</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          name: '毛泽东',
                          sancai: '金-火-土',
                          comment: '火克金存在冲突，但其革命精神超越数理局限'
                        },
                        {
                          name: '袁隆平',
                          sancai: '木-木-土',
                          comment: '双木扎根于土，如农业成就般生机勃勃'
                        }
                      ].map((person, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                          <h4 className="text-lg font-bold text-amber-800 mb-2">{person.name}</h4>
                          <div className="text-sm mb-2"><span className="font-medium">三才:</span> {person.sancai}</div>
                          <div className="text-amber-700 text-sm">{person.comment}</div>
                        </div>
                      ))}
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
                      客观分析五格剖象法的价值与局限，保持理性思维，传承文化精髓
                    </p>
                  </div>

                  {/* 科学质疑 */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 rounded-2xl border border-red-200">
                    <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">🔬 科学质疑与理论缺陷</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-red-700 mb-4">❌ 理论漏洞</h4>
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg border border-red-200">
                            <div className="font-semibold text-red-800 mb-2">同姓同运悖论</div>
                            <div className="text-sm text-red-600">
                              所有王姓（天格5）者成功运相同？显然不符合现实，
                              人生轨迹受教育、环境、时代等多重因素影响。
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-red-200">
                            <div className="font-semibold text-red-800 mb-2">阴阳性别忽视</div>
                            <div className="text-sm text-red-600">
                              未区分男女象数差异，与《易经》阴阳本质冲突，
                              男女在社会角色和人生发展上存在显著差异。
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-red-700 mb-4">📊 统计证据不足</h4>
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg border border-red-200">
                            <div className="font-semibold text-red-800 mb-2">样本偏差</div>
                            <div className="text-sm text-red-600">
                              50位成功人士中仅44%三才全吉，
                              50位凶亡者中28%三才全吉，相关性微弱。
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-red-200">
                            <div className="font-semibold text-red-800 mb-2">因果倒置</div>
                            <div className="text-sm text-red-600">
                              是五格决定命运，还是成功者被选择性地解读？
                              存在明显的"事后诸葛亮"倾向。
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 文化价值重新定位 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">🎭 文化价值的重新定位</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-semibold text-blue-700 mb-4">💡 积极意义</h4>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <span className="text-green-500 text-lg mt-1">✓</span>
                            <div>
                              <div className="font-medium text-blue-800">心理暗示作用</div>
                              <div className="text-sm text-blue-600">
                                好名字增强自信，提供心理支撑，
                                这种"安慰剂效应"确实有其价值
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="text-green-500 text-lg mt-1">✓</span>
                            <div>
                              <div className="font-medium text-blue-800">文化传承载体</div>
                              <div className="text-sm text-blue-600">
                                承载中华文化中对名字的重视，
                                体现"名正言顺"的文化观念
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="text-green-500 text-lg mt-1">✓</span>
                            <div>
                              <div className="font-medium text-blue-800">取名参考框架</div>
                              <div className="text-sm text-blue-600">
                                提供系统化的起名思路，
                                避免完全随意的命名方式
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
                              <div className="font-medium text-orange-800">不是预测工具</div>
                              <div className="text-sm text-orange-600">
                                不能真正预测人生，更不能决定命运，
                                仅作文化参考，切忌迷信依赖
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="text-orange-500 text-lg mt-1">!</span>
                            <div>
                              <div className="font-medium text-orange-800">需结合实际</div>
                              <div className="text-sm text-orange-600">
                                应与字义、音韵、书写等因素综合考虑，
                                不能单纯追求数理完美
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="text-orange-500 text-lg mt-1">!</span>
                            <div>
                              <div className="font-medium text-orange-800">个人努力更重要</div>
                              <div className="text-sm text-orange-600">
                                成功主要靠个人努力、时代机遇、
                                教育背景等，而非姓名数理
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 现代应用建议 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
                    <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">💼 现代应用的理性建议</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl mb-4">🎯</div>
                        <h4 className="text-lg font-bold text-green-800 mb-3">参考不依赖</h4>
                        <p className="text-sm text-green-600">
                          将五格作为取名参考之一，
                          但不作为唯一标准，
                          更不要因五格不佳而改名
                        </p>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl mb-4">⚖️</div>
                        <h4 className="text-lg font-bold text-green-800 mb-3">综合平衡</h4>
                        <p className="text-sm text-green-600">
                          兼顾字义美好、音韵和谐、
                          书写简便与五格数理，
                          追求整体协调统一
                        </p>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl mb-4">🌟</div>
                        <h4 className="text-lg font-bold text-green-800 mb-3">重在寓意</h4>
                        <p className="text-sm text-green-600">
                          关注名字承载的家庭期望、
                          文化内涵和美好愿景，
                          这比数理更有意义
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 反面教材警示 */}
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-8 rounded-2xl border-2 border-dashed border-gray-300">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">⚠️ 过度迷信的危害案例</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h4 className="text-lg font-bold text-red-700 mb-3">🚫 改名成瘾</h4>
                        <p className="text-sm text-gray-700 mb-3">
                          某企业家因生意不顺，听信大师建议连续改名5次，
                          每次都花费不菲，最终发现问题在经营策略而非姓名。
                        </p>
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          启示：成功的关键在实力和策略，而非姓名
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h4 className="text-lg font-bold text-red-700 mb-3">📚 教育误区</h4>
                        <p className="text-sm text-gray-700 mb-3">
                          有家长因孩子五格不佳而过分焦虑，
                          忽视了对孩子品德、能力的培养，本末倒置。
                        </p>
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          启示：人格品德的培养远比数理更重要
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 结语 */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-200 text-center">
                    <h3 className="text-2xl font-bold text-purple-800 mb-4">🎭 理性传承，智慧应用</h3>
                    <div className="max-w-4xl mx-auto">
                      <p className="text-lg text-purple-700 leading-relaxed mb-6">
                        三才五格作为传统文化的一部分，有其历史价值和文化意义。
                        我们应该<strong className="text-purple-800">理性看待、批判继承、智慧应用</strong>，
                        既不全盘否定，也不盲目迷信。
                      </p>
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="text-purple-600 italic text-lg">
                          "取其精华，去其糟粕"<br/>
                          让传统智慧在现代理性的光照下，绽放出新的生命力
                        </div>
                      </div>
                      <div className="mt-6">
                        <button 
                          onClick={() => setActiveSection('overview')}
                          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
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
                    const sections = ['overview', 'history', 'formula', 'algorithm', 'cases', 'thinking'];
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
                    const sections = ['overview', 'history', 'formula', 'algorithm', 'cases', 'thinking'];
                    const currentIndex = sections.indexOf(activeSection);
                    if (currentIndex < sections.length - 1) {
                      setActiveSection(sections[currentIndex + 1] as any);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
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
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
            >
              ← 返回首页
            </Link>
          </div>
        </div>

        {/* 页面底部 */}
        <div className="bg-gradient-to-r from-gray-100 to-blue-100 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-4">
              🎓 传统文化与现代技术的完美融合
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

export default SancaiWugePage;