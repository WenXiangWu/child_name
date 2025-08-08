import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

const ZodiacNamingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'history' | 'theory' | 'practice' | 'cases' | 'modern'>('overview');
  const [progress, setProgress] = useState(0);
  const [selectedZodiac, setSelectedZodiac] = useState<string>('');
  const [nameExample, setNameExample] = useState<any>(null);

  // 计算学习进度
  useEffect(() => {
    const sections = ['overview', 'history', 'theory', 'practice', 'cases', 'modern'];
    const currentIndex = sections.indexOf(activeSection);
    setProgress(((currentIndex + 1) / sections.length) * 100);
  }, [activeSection]);

  // 十二生肖详细信息
  const zodiacData = {
    '鼠': {
      element: '水',
      traits: '机灵、适应力强、善于积累',
      favorable: ['米/豆（粟、登）', '宀（安、宇）', '口（嘉、君）'],
      unfavorable: ['午/马（骏、驰）', '火字根（炎、焱）', '日字根（明、昭）'],
      examples: [
        { name: '子涵', meaning: '子水生旺，涵养深厚', gender: '通用' },
        { name: '瑞霖', meaning: '甘露降临，吉祥如意', gender: '男' },
        { name: '安宁', meaning: '居有定所，心境安宁', gender: '女' }
      ]
    },
    '牛': {
      element: '土',
      traits: '勤劳、踏实、有耐力',
      favorable: ['艹/田（苗、畴）', '车（轩、辕）', '鸟（翎、鹤）'],
      unfavorable: ['羊字根（群、美）', '马字根（骏、驰）', '心字根（慧、思）'],
      examples: [
        { name: '牧野', meaning: '田野牧歌，自然纯朴', gender: '男' },
        { name: '安禾', meaning: '五谷丰登，安居乐业', gender: '女' },
        { name: '轩昂', meaning: '气宇轩昂，志向高远', gender: '男' }
      ]
    },
    '虎': {
      element: '木',
      traits: '威猛、独立、有领导力',
      favorable: ['山/林（岳、森）', '王（琳、珠）', '木（桐、杨）'],
      unfavorable: ['申/猴（坤、申）', '蛇字根（建、廷）', '人字根（仁、佳）'],
      examples: [
        { name: '峻峰', meaning: '山峰峻岭，志向高远', gender: '男' },
        { name: '琳玥', meaning: '美玉生辉，品格高洁', gender: '女' },
        { name: '森朗', meaning: '森林广阔，心境开朗', gender: '男' }
      ]
    },
    '兔': {
      element: '木',
      traits: '温和、机敏、善于跳跃',
      favorable: ['月（朦、朗）', '艹（茜、芊）', '宀（宁、安）'],
      unfavorable: ['酉/鸡（鸣、翔）', '金字根（锋、铭）', '日字根（明、昭）'],
      examples: [
        { name: '若曦', meaning: '若月清辉，温柔如水', gender: '女' },
        { name: '月瑶', meaning: '明月如玉，纯洁美好', gender: '女' },
        { name: '安然', meaning: '安居乐业，怡然自得', gender: '通用' }
      ]
    },
    '龙': {
      element: '土',
      traits: '尊贵、有抱负、变化多端',
      favorable: ['水/雨（沛、霖）', '王（珺、琪）', '星（星、晨）'],
      unfavorable: ['戌/狗（猛、威）', '山字根（峰、岭）', '田字根（畴、疆）'],
      examples: [
        { name: '云泽', meaning: '云行雨施，恩泽四方', gender: '男' },
        { name: '君灏', meaning: '君临天下，浩然正气', gender: '男' },
        { name: '星辰', meaning: '星辰大海，志向远大', gender: '通用' }
      ]
    },
    '蛇': {
      element: '火',
      traits: '智慧、神秘、有洞察力',
      favorable: ['口/宀（嘉、宏）', '木字根（桐、林）', '衣（裳、袖）'],
      unfavorable: ['亥/猪（豪、家）', '虎字根（彪、寅）', '日字根（明、昭）'],
      examples: [
        { name: '思楠', meaning: '思维敏捷，如楠木般坚韧', gender: '男' },
        { name: '锦程', meaning: '前程似锦，未来光明', gender: '男' },
        { name: '婉宁', meaning: '温婉安宁，品格优雅', gender: '女' }
      ]
    },
    '马': {
      element: '火',
      traits: '奔放、自由、有活力',
      favorable: ['艹/木（芊、楷）', '寅（寅、演）', '午（许、杵）'],
      unfavorable: ['子/水（沐、洁）', '田字根（畴、疆）', '车字根（轩、辕）'],
      examples: [
        { name: '骏驰', meaning: '骏马奔驰，一往无前', gender: '男' },
        { name: '柏然', meaning: '柏树挺拔，自然纯真', gender: '男' },
        { name: '芊羽', meaning: '芊芊绿草，轻盈如羽', gender: '女' }
      ]
    },
    '羊': {
      element: '土',
      traits: '温和、善良、有同情心',
      favorable: ['艹/禾（芮、穗）', '卯（柳、茆）', '木字根（林、桐）'],
      unfavorable: ['丑/牛（牧、特）', '戌/狗（威、猛）', '王字根（琪、珺）'],
      examples: [
        { name: '芊羽', meaning: '芊芊细草，轻羽飞扬', gender: '女' },
        { name: '和悦', meaning: '和谐喜悦，性情温和', gender: '女' },
        { name: '木森', meaning: '森林茂盛，生机勃勃', gender: '男' }
      ]
    },
    '猴': {
      element: '金',
      traits: '聪明、机敏、好动',
      favorable: ['木字根（桐、林）', '宀（安、宇）', '子（浩、泽）'],
      unfavorable: ['寅/虎（彪、寅）', '火字根（炎、焱）', '山字根（峰、岭）'],
      examples: [
        { name: '梓轩', meaning: '梓木高贵，轩昂不凡', gender: '男' },
        { name: '泽林', meaning: '恩泽如林，润物无声', gender: '男' },
        { name: '安琪', meaning: '平安吉祥，珍贵如琪', gender: '女' }
      ]
    },
    '鸡': {
      element: '金',
      traits: '勤劳、准时、有条理',
      favorable: ['米/豆（粒、登）', '巳字根（熙、起）', '山字根（峰、岭）'],
      unfavorable: ['卯/兔（柳、茆）', '犬字根（猛、威）', '心字根（慧、思）'],
      examples: [
        { name: '鸣谦', meaning: '鸣声谦和，品德高尚', gender: '男' },
        { name: '禹哲', meaning: '如禹王般睿智通达', gender: '男' },
        { name: '晨曦', meaning: '晨光熹微，新的开始', gender: '女' }
      ]
    },
    '狗': {
      element: '土',
      traits: '忠诚、勇敢、有责任心',
      favorable: ['亻（佑、信）', '宀（安、宇）', '午字根（许、骏）'],
      unfavorable: ['辰/龙（宸、振）', '酉字根（酒、醇）', '鸡字根（鸣、翔）'],
      examples: [
        { name: '安然', meaning: '安稳宁静，处之泰然', gender: '通用' },
        { name: '彦博', meaning: '才德兼备，博学多才', gender: '男' },
        { name: '佳宁', meaning: '佳人安宁，品格优秀', gender: '女' }
      ]
    },
    '猪': {
      element: '水',
      traits: '善良、诚实、有福气',
      favorable: ['豆/禾（登、稷）', '卯字根（柳、茆）', '木字根（林、桐）'],
      unfavorable: ['巳/蛇（迅、建）', '辶字根（迪、运）', '猴字根（申、坤）'],
      examples: [
        { name: '乐康', meaning: '快乐健康，福泽深厚', gender: '男' },
        { name: '禾润', meaning: '禾苗润泽，丰收在望', gender: '男' },
        { name: '柳青', meaning: '柳枝青翠，生机盎然', gender: '女' }
      ]
    }
  };

  // 处理生肖选择
  const handleZodiacSelect = (zodiac: string) => {
    setSelectedZodiac(zodiac);
    setNameExample(zodiacData[zodiac as keyof typeof zodiacData] || null);
  };

  return (
    <Layout>
      <Head>
        <title>生肖姓名学：传统智慧的现代传承 - 宝宝取名专家</title>
        <meta name="description" content="深入了解生肖姓名学的历史渊源、理论体系和实践应用，学习如何运用生肖特性为宝宝取一个寓意深刻的好名字。" />
        <meta name="keywords" content="生肖姓名学,十二生肖,取名,传统文化,甲骨姓名学,生肖取名,文化传承" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* 固定顶部导航 */}
        <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm border-b z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            {/* 面包屑 */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Link href="/" className="hover:text-gray-800 transition-colors">首页</Link>
              <span>›</span>
              <Link href="/#culture" className="hover:text-gray-800 transition-colors">传统文化</Link>
              <span>›</span>
              <span className="text-gray-800 font-medium">生肖姓名学</span>
            </div>
            
            {/* 学习进度条 */}
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* 英雄区域 */}
        <div className="pt-24 pb-12 bg-gradient-to-r from-green-900 via-emerald-900 to-teal-900 text-white relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute top-20 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-10 left-1/3 w-40 h-40 border border-white/20 rounded-full"></div>
            {/* 生肖装饰元素 */}
            <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🐲</div>
            <div className="absolute bottom-1/4 left-1/4 text-6xl opacity-5">🐅</div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                千年传承的生肖智慧与现代命名艺术
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent">
              生肖姓名学
            </h1>
            <div className="text-2xl md:text-3xl font-medium mb-4 text-green-100">
              传统智慧的现代传承
            </div>
            <p className="text-lg text-green-200 max-w-3xl mx-auto mb-8 leading-relaxed">
              从战国雏形到现代发展，生肖姓名学承载着深厚的文化内涵。
              探索十二生肖的特性奥秘，学习如何将古老智慧融入现代命名实践。
            </p>
            
            {/* 核心特点 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">🐉</div>
                <div className="font-semibold mb-2">生肖为主</div>
                <div className="text-sm text-green-200">以生肖特性为核心，姓名为客体</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">⚖️</div>
                <div className="font-semibold mb-2">五行平衡</div>
                <div className="text-sm text-green-200">结合五行生克，追求和谐统一</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">🔮</div>
                <div className="font-semibold mb-2">现代应用</div>
                <div className="text-sm text-green-200">传统智慧与现代审美的完美结合</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setActiveSection('overview')}
                className="px-8 py-3 bg-white text-green-900 rounded-lg font-semibold hover:bg-green-50 transition-all transform hover:scale-105"
              >
                开始探索
              </button>
              <button 
                onClick={() => setActiveSection('practice')}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-900 transition-all"
              >
                实用指南
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* 模块化导航 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 学习模块导航</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { id: 'overview', icon: '🌟', title: '核心概览', desc: '理解基本原理' },
                  { id: 'history', icon: '📜', title: '历史演进', desc: '从占卜到文化' },
                  { id: 'theory', icon: '⚡', title: '理论体系', desc: '五行与字根' },
                  { id: 'practice', icon: '🛠️', title: '实用指南', desc: '十二生肖取名' },
                  { id: 'cases', icon: '💎', title: '经典案例', desc: '成功范例解析' },
                  { id: 'modern', icon: '🚀', title: '现代思考', desc: '传承与创新' }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`p-4 rounded-xl transition-all duration-300 text-left group ${
                      activeSection === section.id
                        ? 'bg-green-600 text-white shadow-lg transform scale-105'
                        : 'bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 hover:shadow-md'
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
                      activeSection === section.id ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {section.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 内容区域 */}
            <div className="p-8 min-h-[600px]">
              {/* 核心概览模块 */}
              {activeSection === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🌟 生肖姓名学核心概览</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      深入理解生肖姓名学的基本原理，掌握这门传统文化瑰宝的精髓
                    </p>
                  </div>

                  {/* 核心理念卡片 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
                      <div className="text-3xl mb-4">🎯</div>
                      <h3 className="text-xl font-bold text-green-800 mb-3">什么是生肖姓名学？</h3>
                      <p className="text-green-700">
                        根据天干地支五行和生肖动物特性为主体，结合汉字形音义和五行为客体，
                        推论主客间对个人运势影响的命理学学问。
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-xl border border-blue-200">
                      <div className="text-3xl mb-4">⚖️</div>
                      <h3 className="text-xl font-bold text-blue-800 mb-3">核心判读原则</h3>
                      <p className="text-blue-700">
                        <strong>主体</strong>：生肖（农历年支）<br/>
                        <strong>客体</strong>：姓名<br/>
                        评论主体与客体间调性是否和谐统一。
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-xl border border-orange-200">
                      <div className="text-3xl mb-4">⚠️</div>
                      <h3 className="text-xl font-bold text-orange-800 mb-3">重要提醒</h3>
                      <p className="text-orange-700">
                        仅以"年支"五行为推论基础，若无八字完整信息相辅，
                        不宜妄断单一姓名之优劣。需综合考虑。
                      </p>
                    </div>
                  </div>

                  {/* 五行生克基础 */}
                  <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">🌀 五行生克基础理论</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-200">
                        <h4 className="text-lg font-bold text-amber-800 mb-4">📈 相生关系</h4>
                        <div className="space-y-3">
                          {[
                            { from: '木', to: '火', desc: '木燃生火，如虎用火字增威' },
                            { from: '火', to: '土', desc: '火烧成土，如蛇用土字得助' },
                            { from: '土', to: '金', desc: '土生金，如牛用金字旺财' },
                            { from: '金', to: '水', desc: '金生水，如猴用水字聪慧' },
                            { from: '水', to: '木', desc: '水养木，如鼠用木字成长' }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                              <span className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {item.from}
                              </span>
                              <span className="text-amber-600">→</span>
                              <span className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {item.to}
                              </span>
                              <span className="text-sm text-amber-700 flex-1">{item.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200">
                        <h4 className="text-lg font-bold text-red-800 mb-4">📉 相克关系</h4>
                        <div className="space-y-3">
                          {[
                            { from: '木', to: '土', desc: '木克土，虎忌纯土字根' },
                            { from: '土', to: '水', desc: '土克水，牛忌水字过多' },
                            { from: '水', to: '火', desc: '水克火，鼠忌火字强烈' },
                            { from: '火', to: '金', desc: '火克金，马忌金字锐利' },
                            { from: '金', to: '木', desc: '金克木，猴忌木字繁茂' }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                              <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {item.from}
                              </span>
                              <span className="text-red-600">⚔</span>
                              <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {item.to}
                              </span>
                              <span className="text-sm text-red-700 flex-1">{item.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 学习路径 */}
                  <div className="bg-white border-2 border-dashed border-gray-300 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">🗺️ 建议学习路径</h3>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      {[
                        { step: 1, title: '历史演进', desc: '了解发展脉络', next: 'history' },
                        { step: 2, title: '理论体系', desc: '掌握核心原理', next: 'theory' },
                        { step: 3, title: '实用指南', desc: '学习实际应用', next: 'practice' },
                        { step: 4, title: '经典案例', desc: '分析成功范例', next: 'cases' },
                        { step: 5, title: '现代思考', desc: '传承与创新', next: 'modern' }
                      ].map((item, index) => (
                        <div key={item.step} className="flex flex-col items-center text-center">
                          <button
                            onClick={() => setActiveSection(item.next as any)}
                            className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3 hover:bg-green-700 transition-all transform hover:scale-110"
                          >
                            {item.step}
                          </button>
                          <div className="font-semibold text-gray-800 mb-1">{item.title}</div>
                          <div className="text-sm text-gray-600">{item.desc}</div>
                          {index < 4 && <div className="hidden md:block text-2xl text-gray-400 mt-4">→</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 历史演进模块 */}
              {activeSection === 'history' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">📜 从占卜工具到文化符号的历史演变</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      探索生肖姓名学从战国时期的占卜应用，到现代文化传承的完整历史脉络
                    </p>
                  </div>

                  {/* 历史时间线 */}
                  <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-500 to-emerald-500"></div>
                    
                    {[
                      {
                        period: '战国雏形',
                        year: '公元前3世纪',
                        icon: '📚',
                        title: '占卜起源',
                        content: '秦简《日书》记载十二兽名（子鼠、丑牛等），用于刑事侦查、医疗占卜及命名规范。动物序列尚未定型，午为鹿、酉为雉。',
                        side: 'left',
                        highlight: '最早的十二生肖记录'
                      },
                      {
                        period: '东汉定型',
                        year: '1世纪',
                        icon: '🏛️',
                        title: '体系确立',
                        content: '王充《论衡》确立地支与动物固定对应，绑定五行属性（子鼠属水、午马属火），奠定姓名学五行生克基础。',
                        side: 'right',
                        highlight: '现代生肖体系的奠基'
                      },
                      {
                        period: '魏晋至唐宋',
                        year: '3-13世纪',
                        icon: '🎭',
                        title: '文化融合',
                        content: '道教六甲神将生肖神化，佛教《大集经》推动民俗普及，唐代生肖俑随葬、沈炯生肖诗，姓名从占卜转向文化意象。',
                        side: 'left',
                        highlight: '从占卜到文化艺术'
                      },
                      {
                        period: '宋元明清',
                        year: '10-19世纪',
                        icon: '⚙️',
                        title: '规则精细化',
                        content: '刑冲合害体系完善，六冲六害的五行解释成型，字形喜忌定型（牛用"田"字根、蛇忌"虎"字根），动物习性映射汉字结构。',
                        side: 'right',
                        highlight: '理论体系的成熟完善'
                      },
                      {
                        period: '现代传承',
                        year: '20世纪至今',
                        icon: '🔄',
                        title: '传承与创新',
                        content: '在科学精神冲击下坚持文化传承，结合现代审美需求，发展出兼顾传统智慧与实用性的现代生肖姓名学。',
                        side: 'left',
                        highlight: '传统与现代的平衡'
                      }
                    ].map((item, index) => (
                      <div key={index} className={`relative flex items-center mb-12 ${item.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-1/2 ${item.side === 'left' ? 'pr-8' : 'pl-8'}`}>
                          <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${item.side === 'left' ? 'border-green-500' : 'border-emerald-500'}`}>
                            <div className="flex items-center mb-3">
                              <span className="text-2xl mr-3">{item.icon}</span>
                              <div>
                                <div className="font-bold text-gray-800">{item.period}</div>
                                <div className="text-sm text-gray-500">{item.year}</div>
                              </div>
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${item.side === 'left' ? 'text-green-700' : 'text-emerald-700'}`}>
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-3">{item.content}</p>
                            <div className={`text-xs px-3 py-1 rounded-full inline-block ${item.side === 'left' ? 'bg-green-100 text-green-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              💡 {item.highlight}
                            </div>
                          </div>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-green-500 rounded-full"></div>
                        <div className="w-1/2"></div>
                      </div>
                    ))}
                  </div>

                  {/* 现代价值思考 */}
                  <div className="bg-gradient-to-r from-gray-50 to-green-50 p-8 rounded-2xl border-2 border-dashed border-gray-300">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">💭 历史演变的深层价值</h3>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">🌱</div>
                        <div className="text-lg font-semibold text-gray-800">从实用工具到文化载体</div>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                        生肖姓名学的历史演变反映了中华文化的深层逻辑：<strong className="text-green-600">实用性与文化性的统一</strong>。
                        从最初的占卜工具，到后来的文化符号，再到现代的命名艺术，
                        它始终在<strong className="text-green-600">传承文化记忆</strong>的同时满足时代需求。
                        这种演变过程本身就是中华文明<strong className="text-green-600">与时俱进、守正创新</strong>精神的体现。
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 其他模块内容将在后续补充 */}
              {activeSection === 'theory' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">⚡ 五行、生肖习性与字形关联理论</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      深入理解生肖姓名学的核心理论体系，掌握五行生克、生肖特性和汉字字根的关联规律
                    </p>
                  </div>
                  
                  {/* 理论体系概述 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">🎯 理论核心三要素</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">⚖️</span>
                        </div>
                        <h4 className="text-lg font-bold text-blue-800 mb-3">五行生克原则</h4>
                        <p className="text-sm text-blue-600 mb-4">生肖五行属性决定字根选择的基本方向</p>
                        <div className="text-xs text-blue-500 bg-blue-50 p-2 rounded">
                          如：虎属木，宜用水字（水生木）
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">🐅</span>
                        </div>
                        <h4 className="text-lg font-bold text-green-800 mb-3">生肖习性特征</h4>
                        <p className="text-sm text-green-600 mb-4">根据动物生活习性确定字根喜忌</p>
                        <div className="text-xs text-green-500 bg-green-50 p-2 rounded">
                          如：牛喜"田"字（耕田劳作）
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-200 text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📝</span>
                        </div>
                        <h4 className="text-lg font-bold text-purple-800 mb-3">汉字字形结构</h4>
                        <p className="text-sm text-purple-600 mb-4">汉字部首偏旁承载的象征意义</p>
                        <div className="text-xs text-purple-500 bg-purple-50 p-2 rounded">
                          如："宀"字头代表居所安定
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 详细理论说明 */}
                  <div className="text-center">
                    <div className="inline-block bg-yellow-100 px-4 py-2 rounded-lg">
                      <span className="text-yellow-800 text-sm">💡 提示：点击下方"实用指南"查看具体的十二生肖取名详解</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 实用指南模块 */}
              {activeSection === 'practice' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🛠️ 十二生肖取名实用指南</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      系统学习每个生肖的取名规律，掌握字根选择的具体方法和实用技巧
                    </p>
                  </div>

                  {/* 生肖选择器 */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-200">
                    <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">🎯 生肖取名分析器</h3>
                    <div className="max-w-2xl mx-auto">
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-indigo-700 mb-2">选择生肖</label>
                        <select
                          value={selectedZodiac}
                          onChange={(e) => handleZodiacSelect(e.target.value)}
                          className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="">请选择生肖</option>
                          {Object.keys(zodiacData).map(zodiac => (
                            <option key={zodiac} value={zodiac}>{zodiac}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 分析结果展示 */}
                    {nameExample && (
                      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">
                          生肖{selectedZodiac}取名指南
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h5 className="font-semibold text-blue-800 mb-2">🌟 生肖特质</h5>
                              <p className="text-sm text-blue-700 mb-2">
                                <strong>五行属性：</strong>{nameExample.element}
                              </p>
                              <p className="text-sm text-blue-700">
                                <strong>性格特点：</strong>{nameExample.traits}
                              </p>
                            </div>
                            
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h5 className="font-semibold text-green-800 mb-2">✅ 宜用字根</h5>
                              <div className="space-y-1">
                                {nameExample.favorable.map((item: string, index: number) => (
                                  <div key={index} className="text-sm text-green-700">{item}</div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg">
                              <h5 className="font-semibold text-red-800 mb-2">❌ 忌用字根</h5>
                              <div className="space-y-1">
                                {nameExample.unfavorable.map((item: string, index: number) => (
                                  <div key={index} className="text-sm text-red-700">{item}</div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-yellow-800 mb-3">💎 推荐名字</h5>
                            <div className="space-y-3">
                              {nameExample.examples.map((example: any, index: number) => (
                                <div key={index} className="bg-white p-3 rounded border border-yellow-200">
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-yellow-800">{example.name}</span>
                                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded">
                                      {example.gender}
                                    </span>
                                  </div>
                                  <div className="text-xs text-yellow-700">{example.meaning}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 五步取名法 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
                    <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">📋 五步完成生肖取名法</h3>
                    <div className="space-y-4">
                      {[
                        { step: 1, title: '确定生肖', desc: '根据农历出生年份确定生肖', example: '如2025年生肖蛇' },
                        { step: 2, title: '查询五行', desc: '了解生肖的五行属性和喜忌', example: '蛇属火，宜木土，忌水金' },
                        { step: 3, title: '选择字根', desc: '根据生肖习性选择合适字根', example: '蛇喜口宀字根，忌虎亥字根' },
                        { step: 4, title: '组合名字', desc: '结合姓氏和性别组合名字', example: '男孩：思楠，女孩：婉宁' },
                        { step: 5, title: '验证效果', desc: '检查音韵、寓意和实用性', example: '朗朗上口，寓意美好，书写简便' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-sm">
                          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {item.step}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-green-800 mb-1">{item.title}</h4>
                            <p className="text-green-700 text-sm mb-2">{item.desc}</p>
                            <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                              示例：{item.example}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 其他模块内容省略，以保持代码长度合理 */}
              {activeSection === 'cases' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">💎 经典案例深度解析</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      通过古今名人的取名案例，深入理解生肖姓名学的实际应用和文化价值
                    </p>
                  </div>

                  {/* 古代名人案例 */}
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-8 rounded-2xl border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-6 text-center">🏛️ 古代名人的生肖取名智慧</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200">
                        <h4 className="text-xl font-bold text-amber-800 mb-4 text-center">朱元璋（龙年）</h4>
                        <div className="space-y-4">
                          <div className="bg-amber-50 p-4 rounded-lg">
                            <div className="font-semibold text-amber-700 mb-2">🐲 生肖分析</div>
                            <div className="space-y-2 text-sm">
                              <div><span className="font-medium">生肖：</span>龙（土）</div>
                              <div><span className="font-medium">字根：</span>"元"字含"二"字根，龙喜天空广阔</div>
                              <div><span className="font-medium">寓意：</span>元始天尊，璋为美玉，龙配美玉</div>
                            </div>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-lg">
                            <div className="font-semibold text-amber-700 mb-2">👑 历史印证</div>
                            <div className="text-sm text-amber-600">
                              朱元璋确实成为了明朝开国皇帝，"元璋"之名预示了他的帝王命运，
                              体现了龙年生人的尊贵气质和王者风范。
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200">
                        <h4 className="text-xl font-bold text-amber-800 mb-4 text-center">李白（猴年）</h4>
                        <div className="space-y-4">
                          <div className="bg-amber-50 p-4 rounded-lg">
                            <div className="font-semibold text-amber-700 mb-2">🐵 生肖分析</div>
                            <div className="space-y-2 text-sm">
                              <div><span className="font-medium">生肖：</span>猴（金）</div>
                              <div><span className="font-medium">字根：</span>"白"字属金，与猴金相配</div>
                              <div><span className="font-medium">寓意：</span>纯洁如白，机敏灵活</div>
                            </div>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-lg">
                            <div className="font-semibold text-amber-700 mb-2">🎭 才华印证</div>
                            <div className="text-sm text-amber-600">
                              李白一生才华横溢，诗风飘逸潇洒，正如猴的机敏灵活，
                              "白"字更突出其诗歌的清新脱俗。
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 成功要素分析 */}
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🎯 成功取名的关键要素</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center p-6 bg-green-50 rounded-xl">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <h4 className="font-bold text-green-800 mb-2">生肖匹配</h4>
                        <p className="text-sm text-green-600">名字与生肖特性高度吻合，体现生肖优势</p>
                      </div>
                      
                      <div className="text-center p-6 bg-blue-50 rounded-xl">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <h4 className="font-bold text-blue-800 mb-2">五行平衡</h4>
                        <p className="text-sm text-blue-600">字根五行与生肖五行相生相助</p>
                      </div>
                      
                      <div className="text-center p-6 bg-purple-50 rounded-xl">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <h4 className="font-bold text-purple-800 mb-2">寓意深刻</h4>
                        <p className="text-sm text-purple-600">承载美好愿望和人生理想</p>
                      </div>
                      
                      <div className="text-center p-6 bg-orange-50 rounded-xl">
                        <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold">4</span>
                        </div>
                        <h4 className="font-bold text-orange-800 mb-2">音韵和谐</h4>
                        <p className="text-sm text-orange-600">读音优美，朗朗上口</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'modern' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🚀 现代思考：传承与创新的智慧平衡</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      在现代社会语境下，探索生肖姓名学的价值与局限，寻求传统智慧与现代需求的平衡点
                    </p>
                  </div>

                  {/* 现代挑战 */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-200">
                    <h3 className="text-2xl font-bold text-orange-800 mb-6 text-center">⚡ 现代应用的挑战与思考</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-red-700 mb-4">🔍 理性质疑</h4>
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg border border-red-200">
                            <div className="font-semibold text-red-800 mb-2">科学依据不足</div>
                            <div className="text-sm text-red-600 mb-2">
                              生肖与个人性格、命运的关联缺乏严格的科学证据支撑
                            </div>
                            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                              💡 改进：将其视为文化传承工具，而非命运预测方法
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-red-200">
                            <div className="font-semibold text-red-800 mb-2">过度迷信倾向</div>
                            <div className="text-sm text-red-600 mb-2">
                              部分人过分依赖生肖理论，可能影响理性思考
                            </div>
                            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                              💡 改进：强调其文化价值，避免迷信倾向
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-orange-700 mb-4">🌐 实用考虑</h4>
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg border border-orange-200">
                            <div className="font-semibold text-orange-800 mb-2">国际化适应</div>
                            <div className="text-sm text-orange-600 mb-2">
                              全球化背景下，需要考虑名字的国际接受度和发音便利性
                            </div>
                            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                              💡 解决：选择发音简单、寓意通用的生肖用字
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-orange-200">
                            <div className="font-semibold text-orange-800 mb-2">现代价值观适配</div>
                            <div className="text-sm text-orange-600 mb-2">
                              传统观念需要与现代平等、多元价值观相协调
                            </div>
                            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                              💡 解决：保留文化精华，摒弃落后观念
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 现代价值重构 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
                    <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">🔧 现代价值的重新定位</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-green-700 mb-4 text-center">🎨 文化认同工具</h4>
                        <div className="space-y-3 text-sm text-green-600">
                          <div className="flex items-start space-x-2">
                            <span className="text-green-500">✓</span>
                            <span>增强文化自信和身份认同</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-green-500">✓</span>
                            <span>传承中华文化符号系统</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-green-500">✓</span>
                            <span>建立家庭文化传统</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-green-700 mb-4 text-center">💝 心理暗示载体</h4>
                        <div className="space-y-3 text-sm text-green-600">
                          <div className="flex items-start space-x-2">
                            <span className="text-green-500">✓</span>
                            <span>承载父母的美好期望</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-green-500">✓</span>
                            <span>给予孩子积极的心理暗示</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-green-500">✓</span>
                            <span>培养优秀品格和理想</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-green-700 mb-4 text-center">🌈 创意灵感源泉</h4>
                        <div className="space-y-3 text-sm text-green-600">
                          <div className="flex items-start space-x-2">
                            <span className="text-green-500">✓</span>
                            <span>丰富取名的创意思路</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-green-500">✓</span>
                            <span>提供有文化内涵的选择</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-green-500">✓</span>
                            <span>避免过于随意的命名</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 未来发展展望 */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-200 text-center">
                    <h3 className="text-2xl font-bold text-purple-800 mb-4">🌟 守正创新的未来之路</h3>
                    <div className="max-w-4xl mx-auto">
                      <p className="text-lg text-purple-700 leading-relaxed mb-6">
                        生肖姓名学在新时代的意义，不在于<strong className="text-purple-800">预测命运</strong>，
                        而在于<strong className="text-purple-800">传承文化</strong>。
                        它为现代父母提供了一个连接传统的桥梁，让孩子的名字不仅仅是称呼，
                        更是一份<strong className="text-purple-800">文化礼物</strong>。
                      </p>
                      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                        <div className="text-purple-600 italic text-lg mb-4">
                          "古为今用，推陈出新。让传统智慧在现代语境中焕发新的生命力。"
                        </div>
                        <div className="text-sm text-purple-500">
                          —— 合理的态度是：尊重传统、理性对待、创新应用
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-2xl mb-2">📖</div>
                          <div className="font-semibold text-purple-700">文化传承</div>
                          <div className="text-xs text-purple-600">保持文化记忆</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-2xl mb-2">🔬</div>
                          <div className="font-semibold text-purple-700">理性应用</div>
                          <div className="text-xs text-purple-600">避免迷信倾向</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-2xl mb-2">🚀</div>
                          <div className="font-semibold text-purple-700">创新发展</div>
                          <div className="text-xs text-purple-600">适应时代需求</div>
                        </div>
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
                    const sections = ['overview', 'history', 'theory', 'practice', 'cases', 'modern'];
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
                    const sections = ['overview', 'history', 'theory', 'practice', 'cases', 'modern'];
                    const currentIndex = sections.indexOf(activeSection);
                    if (currentIndex < sections.length - 1) {
                      setActiveSection(sections[currentIndex + 1] as any);
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
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
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105"
            >
              ← 返回首页
            </Link>
          </div>
        </div>

        {/* 页面底部 */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-4">
              🐲 传统智慧与现代应用的和谐统一
            </div>
            <div className="text-gray-600">
              让生肖文化在新时代绽放光彩，为孩子取一个承载文化底蕴的好名字
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ZodiacNamingPage;
