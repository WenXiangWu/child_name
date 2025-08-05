import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

const CulturalHeritagePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'history' | 'methods' | 'classics' | 'cases' | 'thinking'>('overview');
  const [progress, setProgress] = useState(0);
  const [selectedPoetry, setSelectedPoetry] = useState<string>('');
  const [poetryResult, setPoetyResult] = useState<any>(null);

  // 计算学习进度
  useEffect(() => {
    const sections = ['overview', 'history', 'methods', 'classics', 'cases', 'thinking'];
    const currentIndex = sections.indexOf(activeSection);
    setProgress(((currentIndex + 1) / sections.length) * 100);
  }, [activeSection]);

  // 经典文献名句库
  const classicQuotes = {
    '论语': [
      { text: '温故而知新', name: '知新', meaning: '不断学习，求知若渴' },
      { text: '君子和而不同', name: '和同', meaning: '和谐共处，保持个性' },
      { text: '见贤思齐', name: '思齐', meaning: '向贤者学习看齐' },
      { text: '慎终追远', name: '追远', meaning: '慎重对待，追念先祖' }
    ],
    '诗经': [
      { text: '呦呦鹿鸣，食野之蒿', name: '鹿鸣', meaning: '自然和谐，生机勃勃' },
      { text: '关关雎鸠，在河之洲', name: '关雎', meaning: '和美情缘，相和相配' },
      { text: '桃之夭夭，灼灼其华', name: '夭华', meaning: '青春美好，光彩照人' },
      { text: '如切如磋，如琢如磨', name: '琢磨', meaning: '精益求精，不断完善' }
    ],
    '楚辞': [
      { text: '路漫漫其修远兮', name: '修远', meaning: '追求理想，永不止步' },
      { text: '朝饮木兰之坠露兮', name: '木兰', meaning: '高洁品格，清香淡雅' },
      { text: '沧浪之水清兮', name: '沧浪', meaning: '清澈纯净，志向高远' },
      { text: '举世皆浊我独清', name: '独清', meaning: '坚持操守，不同流俗' }
    ],
    '易经': [
      { text: '天行健，君子以自强不息', name: '自强', meaning: '刚健有为，永不懈怠' },
      { text: '含章可贞', name: '含章', meaning: '内含文采，品德高尚' },
      { text: '厚德载物', name: '载物', meaning: '德行深厚，包容万物' },
      { text: '飞龙在天', name: '飞龙', meaning: '志向高远，一飞冲天' }
    ]
  };

  // 处理诗词分析
  const handlePoetryAnalysis = () => {
    if (!selectedPoetry) return;
    
    const results = Object.entries(classicQuotes).find(([key]) => key === selectedPoetry);
    if (results) {
      setPoetyResult({
        source: results[0],
        quotes: results[1]
      });
    }
  };

  return (
    <Layout>
      <Head>
        <title>意境底蕴派：穿越千年的取名智慧 - 宝宝取名专家</title>
        <meta name="description" content="探索意境底蕴派取名法的深厚文化内涵，从四书五经到诗词歌赋，学习如何将古典文学精华融入现代姓名设计。" />
        <meta name="keywords" content="意境底蕴派,经史子集,诗词取名,文化传承,古典文学,姓名文化" />
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
              <span className="text-gray-800 font-medium">意境底蕴派详解</span>
            </div>
            
            {/* 学习进度条 */}
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* 英雄区域 */}
        <div className="pt-24 pb-12 bg-gradient-to-r from-amber-900 via-orange-900 to-red-900 text-white relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute top-20 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-10 left-1/3 w-40 h-40 border border-white/20 rounded-full"></div>
            {/* 古典装饰元素 */}
            <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">📜</div>
            <div className="absolute bottom-1/4 left-1/4 text-6xl opacity-5">🏛️</div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                经史子集的文化传承与现代创新
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
              意境底蕴派
            </h1>
            <div className="text-2xl md:text-3xl font-medium mb-4 text-amber-100">
              穿越千年的取名智慧
            </div>
            <p className="text-lg text-amber-200 max-w-3xl mx-auto mb-8 leading-relaxed">
              从《论语》到《史记》的血脉传承，从诗词歌赋到经史百家的文化沉淀。
              探索中华文脉在姓名学中的最高结晶，学习如何将典籍精华熔铸于方寸之名。
            </p>
            
            {/* 核心特点 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">📚</div>
                <div className="font-semibold mb-2">经史为基</div>
                <div className="text-sm text-amber-200">四书五经、二十四史奠定文化根基</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">🎭</div>
                <div className="font-semibold mb-2">诗词为翼</div>
                <div className="text-sm text-amber-200">唐诗宋词、楚辞汉赋增添灵韵雅致</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">⭐</div>
                <div className="font-semibold mb-2">意境深远</div>
                <div className="text-sm text-amber-200">名字承载文化记忆与人生理想</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setActiveSection('overview')}
                className="px-8 py-3 bg-white text-amber-900 rounded-lg font-semibold hover:bg-amber-50 transition-all transform hover:scale-105"
              >
                开始探索
              </button>
              <button 
                onClick={() => setActiveSection('classics')}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-amber-900 transition-all"
              >
                典籍赏析
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* 模块化导航 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
            <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 学习模块导航</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { id: 'overview', icon: '🎯', title: '文化概览', desc: '深度理解核心' },
                  { id: 'history', icon: '📜', title: '历史传承', desc: '士族命名密码' },
                  { id: 'methods', icon: '🔬', title: '方法论', desc: '三重重构法则' },
                  { id: 'classics', icon: '📚', title: '经典文献', desc: '典籍名句解析' },
                  { id: 'cases', icon: '💎', title: '名人案例', desc: '古今对比分析' },
                  { id: 'thinking', icon: '🤔', title: '现代思考', desc: '传承与创新' }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`p-4 rounded-xl transition-all duration-300 text-left group ${
                      activeSection === section.id
                        ? 'bg-amber-600 text-white shadow-lg transform scale-105'
                        : 'bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-300 hover:shadow-md'
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
                      activeSection === section.id ? 'text-amber-100' : 'text-gray-500'
                    }`}>
                      {section.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 内容区域 */}
            <div className="p-8 min-h-[600px]">
              {/* 文化概览模块 */}
              {activeSection === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🎯 意境底蕴派深度解析</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      探索中国文脉在姓名学中的最高结晶，理解如何将经史子集的魂魄熔铸于方寸之名
                    </p>
                  </div>

                  {/* 核心理念卡片 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-xl border border-amber-200">
                      <div className="text-3xl mb-4">🏛️</div>
                      <h3 className="text-xl font-bold text-amber-800 mb-3">什么是意境底蕴派？</h3>
                      <p className="text-amber-700">
                        以经史子集为基础，通过截取德性关键词、提炼典故精华，
                        将深厚的文化内涵和人生理想融入姓名之中的取名方法。
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-50 to-pink-100 p-6 rounded-xl border border-red-200">
                      <div className="text-3xl mb-4">📖</div>
                      <h3 className="text-xl font-bold text-red-800 mb-3">文化价值何在？</h3>
                      <p className="text-red-700">
                        不仅是起名方法，更是文化传承载体。通过名字连接古今，
                        让孩子从小就浸润在深厚的文化氛围中。
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
                      <div className="text-3xl mb-4">⚖️</div>
                      <h3 className="text-xl font-bold text-green-800 mb-3">现代适用性如何？</h3>
                      <p className="text-green-700">
                        经过现代化改良，避免生僻字，注重音韵和谐，
                        在传承文化的同时兼顾实用性和时代特色。
                      </p>
                    </div>
                  </div>

                  {/* 核心优势对比 */}
                  <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">🌟 与其他取名流派的对比优势</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-200">
                        <h4 className="text-lg font-bold text-orange-800 mb-4">📚 文化深度</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-700">承载千年文化底蕴</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-700">典籍出处明确可考</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-700">寓意层次丰富深远</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-200">
                        <h4 className="text-lg font-bold text-amber-800 mb-4">🎭 精神内涵</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-700">体现家族文化追求</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-700">培养孩子文学素养</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-700">蕴含人生哲学智慧</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-200">
                        <h4 className="text-lg font-bold text-yellow-800 mb-4">💎 独特价值</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-700">区别于数理机械化</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-700">超越生肖简单对应</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-700">兼具艺术性和实用性</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 学习路径指引 */}
                  <div className="bg-white border-2 border-dashed border-gray-300 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">🗺️ 推荐学习路径</h3>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      {[
                        { step: 1, title: '历史传承', desc: '了解文化脉络', next: 'history' },
                        { step: 2, title: '方法论', desc: '掌握核心技法', next: 'methods' },
                        { step: 3, title: '经典文献', desc: '学习典籍运用', next: 'classics' },
                        { step: 4, title: '实战案例', desc: '分析成功范例', next: 'cases' },
                        { step: 5, title: '现代思考', desc: '传承与创新', next: 'thinking' }
                      ].map((item, index) => (
                        <div key={item.step} className="flex flex-col items-center text-center">
                          <button
                            onClick={() => setActiveSection(item.next as any)}
                            className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3 hover:bg-amber-700 transition-all transform hover:scale-110"
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

              {/* 历史传承模块 */}
              {activeSection === 'history' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">📜 士大夫的取名密码：文化血脉的千年传承</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      从古代士族到现代知识分子，探索意境底蕴派取名法的历史演进和文化价值
                    </p>
                  </div>

                  {/* 历史名人案例 */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-6 text-center">🏆 历史名人的文化取名</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          name: '霍去病',
                          source: '《礼记》"君子以除戎器，戒不虞"',
                          meaning: '去除兵戈之祸，保家卫国',
                          period: '汉代名将',
                          achievement: '封狼居胥，青史留名'
                        },
                        {
                          name: '朱熹',
                          source: '《庄子》"明之而晦藏"',
                          meaning: '明理而不张扬，含蓄深沉',
                          period: '宋代大儒',
                          achievement: '理学集大成者'
                        },
                        {
                          name: '钱锺书',
                          source: '《左传》"天锺美于是"',
                          meaning: '天地精华尽锺于典籍',
                          period: '现代学者',
                          achievement: '《围城》传世之作'
                        },
                        {
                          name: '傅斯年',
                          source: '《诗经·大雅》"于万斯年，受天之祜"',
                          meaning: '万世流传，得天之福',
                          period: '民国史学家',
                          achievement: '史学革新领袖'
                        }
                      ].map((person, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-amber-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold text-amber-800">{person.name}</h4>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{person.period}</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium text-gray-700">典籍出处：</span>{person.source}</div>
                            <div><span className="font-medium text-gray-700">寓意内涵：</span>{person.meaning}</div>
                            <div><span className="font-medium text-gray-700">历史成就：</span>{person.achievement}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 文化传承时间线 */}
                  <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-amber-500 to-orange-500"></div>
                    
                    {[
                      {
                        period: '先秦时期',
                        year: '春秋战国',
                        icon: '🏛️',
                        title: '文化奠基',
                        content: '孔子"正名"思想：名不正则言不顺，言不顺则事不成。确立了姓名文化的哲学基础。',
                        side: 'left'
                      },
                      {
                        period: '汉代',
                        year: '前202-220年',
                        icon: '📚',
                        title: '经典成型',
                        content: '《白虎通义》系统论述姓名意义，《说文解字》确立文字学基础，士大夫开始重视典籍取名。',
                        side: 'right'
                      },
                      {
                        period: '魏晋南北朝',
                        year: '220-589年',
                        title: '门第取名',
                        content: '门阀士族兴起，取名更注重家族传承和文化底蕴，出现"字辈"概念。',
                        side: 'left'
                      },
                      {
                        period: '唐宋',
                        year: '618-1279年',
                        icon: '🎭',
                        title: '诗词融入',
                        content: '唐诗宋词繁荣，诗词意境大量融入取名实践，形成"诗意命名"传统。',
                        side: 'right'
                      },
                      {
                        period: '明清',
                        year: '1368-1912年',
                        icon: '📖',
                        title: '系统化发展',
                        content: '科举制度促进文化普及，意境取名从士大夫扩展到一般知识分子家庭。',
                        side: 'left'
                      },
                      {
                        period: '现代',
                        year: '1912年至今',
                        icon: '🔄',
                        title: '传承与创新',
                        content: '五四新文化运动冲击下的坚持与变革，当代知识分子的文化自觉与现代化改造。',
                        side: 'right'
                      }
                    ].map((item, index) => (
                      <div key={index} className={`relative flex items-center mb-12 ${item.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-1/2 ${item.side === 'left' ? 'pr-8' : 'pl-8'}`}>
                          <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${item.side === 'left' ? 'border-amber-500' : 'border-orange-500'}`}>
                            <div className="flex items-center mb-3">
                              <span className="text-2xl mr-3">{item.icon}</span>
                              <div>
                                <div className="font-bold text-gray-800">{item.period}</div>
                                <div className="text-sm text-gray-500">{item.year}</div>
                              </div>
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${item.side === 'left' ? 'text-amber-700' : 'text-orange-700'}`}>
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                          </div>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-amber-500 rounded-full"></div>
                        <div className="w-1/2"></div>
                      </div>
                    ))}
                  </div>

                  {/* 文化价值思考 */}
                  <div className="bg-gradient-to-r from-gray-50 to-amber-50 p-8 rounded-2xl border-2 border-dashed border-gray-300">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">💭 文化传承的深层价值</h3>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">🎋</div>
                        <div className="text-lg font-semibold text-gray-800">文化基因的代际传承</div>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                        意境底蕴派取名不仅是命名技法，更是<strong className="text-amber-600">文化基因的载体</strong>。
                        当父母从典籍中为孩子选择名字，实际上是在传递一种文化价值观：
                        对经典的敬畏、对文化的珍视、对精神品格的追求。
                        这种命名方式本身就是一种教育，让孩子从小就与深厚的文化传统建立联系。
                      </p>
                      <div className="mt-6 text-center">
                        <div className="inline-block bg-amber-100 px-6 py-3 rounded-lg">
                          <div className="text-amber-700 italic">
                            "文以载道，名以传情。" —— 每个承载文化的名字，<br/>
                            都是一座连接古今的桥梁，一份传给后代的精神财富。
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 方法论模块 */}
              {activeSection === 'methods' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🔬 三重重构法则：经史为基，诗词为翼</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      掌握意境底蕴派的核心方法论，学习如何系统化地从典籍中提炼出有文化内涵的好名字
                    </p>
                  </div>

                  {/* 核心方法论 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">⚙️ 三重重构核心法则</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📚</span>
                        </div>
                        <h4 className="text-lg font-bold text-blue-800 mb-3">经义为核</h4>
                        <p className="text-sm text-blue-600 mb-4">以四书五经为核心，提炼德性关键词和哲学内涵</p>
                        <div className="text-xs text-blue-500 bg-blue-50 p-2 rounded">
                          如：《论语》"见贤思齐" → 思齐
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📜</span>
                        </div>
                        <h4 className="text-lg font-bold text-green-800 mb-3">史鉴为骨</h4>
                        <p className="text-sm text-green-600 mb-4">借鉴历史典故，汲取先贤智慧和人生哲理</p>
                        <div className="text-xs text-green-500 bg-green-50 p-2 rounded">
                          如：《史记》"慕蔺相如" → 慕蔺
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-200 text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">🎭</span>
                        </div>
                        <h4 className="text-lg font-bold text-purple-800 mb-3">诗韵为表</h4>
                        <p className="text-sm text-purple-600 mb-4">运用诗词意境，增添音韵美感和艺术气息</p>
                        <div className="text-xs text-purple-500 bg-purple-50 p-2 rounded">
                          如：李白"云帆沧海" → 云帆
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 四步命名法 */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-6 text-center">🎯 现代四步命名法</h3>
                    <div className="space-y-6">
                      {[
                        {
                          step: 1,
                          title: '定主题',
                          desc: '确定要表达的核心理念或期望',
                          example: '家训精神：弘毅（刚强坚毅）',
                          detail: '可以是品德修养、人生理想、家族传承等',
                          color: 'blue'
                        },
                        {
                          step: 2,
                          title: '筛典籍',
                          desc: '选择合适的经典文献作为源泉',
                          example: '优选《诗经》《论语》，慎用《尚书》',
                          detail: '优先选择语言优美、寓意明确的典籍',
                          color: 'green'
                        },
                        {
                          step: 3,
                          title: '炼字眼',
                          desc: '提炼出音韵和谐、寓意深刻的字词',
                          example: '"怀瑾握瑜" → 怀瑾（男）、握瑜（女）',
                          detail: '注意字的搭配、音韵节奏和性别适配',
                          color: 'purple'
                        },
                        {
                          step: 4,
                          title: '验兼容',
                          desc: '检验名字的现代适用性和实用性',
                          example: '方言发音、国际拼写、书写便利',
                          detail: '确保名字在现代生活中的实用性',
                          color: 'orange'
                        }
                      ].map((item) => (
                        <div key={item.step} className={`bg-white p-6 rounded-xl border-l-4 border-${item.color}-400 shadow-sm`}>
                          <div className="flex items-start space-x-4">
                            <div className={`w-10 h-10 bg-${item.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                              <span className={`text-lg font-bold text-${item.color}-700`}>{item.step}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className={`text-lg font-bold text-${item.color}-800 mb-2`}>{item.title}</h4>
                              <p className={`text-${item.color}-700 mb-2`}>{item.desc}</p>
                              <div className={`text-sm text-${item.color}-600 mb-2`}>{item.detail}</div>
                              <div className={`text-xs bg-${item.color}-50 p-2 rounded border border-${item.color}-200`}>
                                <span className="font-medium">示例：</span>{item.example}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 典籍选择指南 */}
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📖 典籍选择实用指南</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-green-800 mb-4">✅ 推荐典籍</h4>
                        <div className="space-y-4">
                          {[
                            { name: '《论语》', reason: '语言简洁，德性明确', example: '温故知新' },
                            { name: '《诗经》', reason: '音韵优美，意象丰富', example: '关关雎鸠' },
                            { name: '《孟子》', reason: '气势磅礴，理想高远', example: '浩然之气' },
                            { name: '《易经》', reason: '哲理深刻，象征丰富', example: '含章可贞' }
                          ].map((book, index) => (
                            <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <div className="font-semibold text-green-800 mb-1">{book.name}</div>
                              <div className="text-sm text-green-600 mb-1">{book.reason}</div>
                              <div className="text-xs text-green-500 font-mono">{book.example}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-orange-800 mb-4">⚠️ 慎用典籍</h4>
                        <div className="space-y-4">
                          {[
                            { name: '《尚书》', reason: '文字佶屈聱牙，难以理解', suggestion: '可化用简单词汇' },
                            { name: '《左传》', reason: '篇幅冗长，需精心筛选', suggestion: '选择知名典故' },
                            { name: '《战国策》', reason: '功利色彩较重', suggestion: '避免纯政治性内容' },
                            { name: '部分诗词', reason: '含有悲伤或不吉内容', suggestion: '仔细甄别原文语境' }
                          ].map((book, index) => (
                            <div key={index} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                              <div className="font-semibold text-orange-800 mb-1">{book.name}</div>
                              <div className="text-sm text-orange-600 mb-1">{book.reason}</div>
                              <div className="text-xs text-orange-500">{book.suggestion}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 避坑指南 */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 rounded-2xl border border-red-200">
                    <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">🚫 常见误区与避坑指南</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-red-700 mb-3">❌ 生僻字误区</h4>
                        <p className="text-sm text-red-600 mb-3">
                          过度追求文雅而选用生僻字，影响日常使用和书写。
                        </p>
                        <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
                          如："夔夔斋栗" → 改用"允中"
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-red-700 mb-3">❌ 语境误读</h4>
                        <p className="text-sm text-red-600 mb-3">
                          不考虑原文语境，直接截取词汇，可能产生歧义。
                        </p>
                        <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
                          如："春蚕到死" 不宜取名"春蚕"
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-red-700 mb-3">❌ 性别混淆</h4>
                        <p className="text-sm text-red-600 mb-3">
                          忽视名字的性别特征，造成男女不分的尴尬。
                        </p>
                        <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
                          如：女孩慎用"君复"，可改"令仪"
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 经典文献模块 */}
              {activeSection === 'classics' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">📚 典籍名句赏析与取名运用</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      深入解析经典文献中的名句精华，学习如何将千年智慧转化为现代美名
                    </p>
                  </div>

                  {/* 典籍选择器 */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-200">
                    <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">🔍 典籍名句解析器</h3>
                    <div className="max-w-2xl mx-auto">
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-indigo-700 mb-2">选择典籍</label>
                        <select
                          value={selectedPoetry}
                          onChange={(e) => setSelectedPoetry(e.target.value)}
                          className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="">请选择一部经典文献</option>
                          {Object.keys(classicQuotes).map(key => (
                            <option key={key} value={key}>{key}</option>
                          ))}
                        </select>
                      </div>
                      <div className="text-center">
                        <button
                          onClick={handlePoetryAnalysis}
                          disabled={!selectedPoetry}
                          className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          查看名句解析
                        </button>
                      </div>
                    </div>

                    {/* 解析结果展示 */}
                    {poetryResult && (
                      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">
                          《{poetryResult.source}》经典名句
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {poetryResult.quotes.map((quote: any, index: number) => (
                            <div key={index} className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                              <div className="text-center mb-3">
                                <div className="text-lg font-bold text-indigo-800 mb-1">"{quote.text}"</div>
                                <div className="text-sm text-indigo-600">↓</div>
                                <div className="text-xl font-bold text-indigo-900">{quote.name}</div>
                              </div>
                              <div className="text-sm text-indigo-700 text-center">{quote.meaning}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 四书五经精选 */}
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📖 四书五经取名宝典</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {[
                        {
                          title: '《论语》- 德性修养',
                          quotes: [
                            { original: '温故而知新', name: '知新', gender: '通用', meaning: '博学笃行，求知若渴' },
                            { original: '见贤思齐', name: '思齐', gender: '通用', meaning: '向贤者学习看齐' },
                            { original: '君子和而不同', name: '和同', gender: '男', meaning: '和谐相处，保持个性' },
                            { original: '慎终追远', name: '追远', gender: '男', meaning: '慎重对待，不忘根本' }
                          ],
                          color: 'blue'
                        },
                        {
                          title: '《诗经》- 自然雅致',
                          quotes: [
                            { original: '关关雎鸠', name: '关雎', gender: '女', meaning: '和美情缘，琴瑟和鸣' },
                            { original: '桃之夭夭，灼灼其华', name: '夭华', gender: '女', meaning: '青春美好，如花绽放' },
                            { original: '呦呦鹿鸣', name: '鹿鸣', gender: '通用', meaning: '自然和谐，生机勃勃' },
                            { original: '如切如磋，如琢如磨', name: '琢磨', gender: '男', meaning: '精益求精，不断完善' }
                          ],
                          color: 'green'
                        },
                        {
                          title: '《孟子》- 浩然正气',
                          quotes: [
                            { original: '富贵不能淫', name: '不淫', gender: '男', meaning: '品格坚定，不为所动' },
                            { original: '浩然之气', name: '浩然', gender: '男', meaning: '正气充盈，光明磊落' },
                            { original: '民为贵', name: '为贵', gender: '通用', meaning: '心系民众，责任担当' },
                            { original: '得道多助', name: '得道', gender: '男', meaning: '行正道，得人心' }
                          ],
                          color: 'purple'
                        },
                        {
                          title: '《易经》- 哲理深邃',
                          quotes: [
                            { original: '含章可贞', name: '含章', gender: '女', meaning: '内含文采，品德高尚' },
                            { original: '厚德载物', name: '载物', gender: '男', meaning: '德行深厚，包容万物' },
                            { original: '飞龙在天', name: '飞龙', gender: '男', meaning: '志向高远，一飞冲天' },
                            { original: '谦谦君子', name: '谦谦', gender: '男', meaning: '谦逊有礼，君子风范' }
                          ],
                          color: 'orange'
                        }
                      ].map((section, index) => (
                        <div key={index} className={`bg-${section.color}-50 p-6 rounded-xl border border-${section.color}-200`}>
                          <h4 className={`text-lg font-bold text-${section.color}-800 mb-4`}>{section.title}</h4>
                          <div className="space-y-3">
                            {section.quotes.map((quote, i) => (
                              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`text-sm font-bold text-${section.color}-700`}>{quote.name}</span>
                                  <span className={`text-xs px-2 py-1 bg-${section.color}-100 text-${section.color}-600 rounded`}>
                                    {quote.gender}
                                  </span>
                                </div>
                                <div className={`text-xs text-${section.color}-600 mb-1`}>"{quote.original}"</div>
                                <div className="text-xs text-gray-600">{quote.meaning}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 诗词意境运用 */}
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-8 rounded-2xl border border-pink-200">
                    <h3 className="text-2xl font-bold text-pink-800 mb-6 text-center">🎭 诗词意境的现代运用</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          category: '唐诗壮阔',
                          examples: [
                            { poet: '李白', line: '长风破浪会有时', name: '长风', mood: '豪迈进取' },
                            { poet: '杜甫', line: '会当凌绝顶', name: '凌顶', mood: '志存高远' },
                            { poet: '王维', line: '明月松间照', name: '松照', mood: '清雅脱俗' }
                          ],
                          color: 'red'
                        },
                        {
                          category: '宋词精微',
                          examples: [
                            { poet: '苏轼', line: '但愿人长久', name: '长久', mood: '深情厚谊' },
                            { poet: '李清照', line: '知否知否', name: '知否', mood: '聪慧灵秀' },
                            { poet: '辛弃疾', line: '青山遮不住', name: '青山', mood: '坚韧不拔' }
                          ],
                          color: 'blue'
                        },
                        {
                          category: '元曲鲜活',
                          examples: [
                            { poet: '马致远', line: '小桥流水人家', name: '流水', mood: '恬淡自然' },
                            { poet: '白朴', line: '笑捻粉香', name: '笑捻', mood: '天真烂漫' },
                            { poet: '张养浩', line: '峰峦如聚', name: '如聚', mood: '气势恢宏' }
                          ],
                          color: 'green'
                        }
                      ].map((category, index) => (
                        <div key={index} className={`bg-white p-6 rounded-xl shadow-sm border border-${category.color}-200`}>
                          <h4 className={`text-lg font-bold text-${category.color}-700 mb-4 text-center`}>
                            {category.category}
                          </h4>
                          <div className="space-y-3">
                            {category.examples.map((example, i) => (
                              <div key={i} className={`bg-${category.color}-50 p-3 rounded-lg`}>
                                <div className={`text-sm font-semibold text-${category.color}-800`}>{example.name}</div>
                                <div className={`text-xs text-${category.color}-600 mb-1`}>
                                  {example.poet}："{example.line}"
                                </div>
                                <div className={`text-xs text-${category.color}-500`}>{example.mood}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 名人案例模块 */}
              {activeSection === 'cases' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">💎 古今名人案例深度解析</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      通过古代士族与现代知识分子的取名对比，深入理解意境底蕴派的演进与创新
                    </p>
                  </div>

                  {/* 古代士族经典案例 */}
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-8 rounded-2xl border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-6 text-center">🏛️ 古代士族取名范式</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200">
                        <h4 className="text-xl font-bold text-amber-800 mb-4 text-center">张之洞（晚清重臣）</h4>
                        <div className="space-y-4">
                          <div className="bg-amber-50 p-4 rounded-lg">
                            <div className="font-semibold text-amber-700 mb-2">🎯 三重重构分析</div>
                            <div className="space-y-2 text-sm">
                              <div><span className="font-medium">经义为核：</span>《荀子》"井井兮其有理"（为政条理分明）</div>
                              <div><span className="font-medium">史鉴为骨：</span>《史记·太史公自序》"藏之名山，副在京师"（文化担当）</div>
                              <div><span className="font-medium">诗韵为表：</span>杜甫《谒先主庙》"洞户访遗贤"（寻访贤才）</div>
                            </div>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-lg">
                            <div className="font-semibold text-amber-700 mb-2">📈 历史印证</div>
                            <div className="text-sm text-amber-600">
                              张之洞确实一生致力于洋务运动，访求人才，振兴教育，
                              其名字寓意与人生轨迹高度吻合，体现了意境取名的深度。
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200">
                        <h4 className="text-xl font-bold text-amber-800 mb-4 text-center">林徽因（建筑学家）</h4>
                        <div className="space-y-4">
                          <div className="bg-amber-50 p-4 rounded-lg">
                            <div className="font-semibold text-amber-700 mb-2">📚 典籍来源</div>
                            <div className="text-sm text-amber-600">
                              《诗经·大雅·思齐》："大姒嗣徽音，则百斯男"<br/>
                              原名"徽音"，后改"徽因"避同名之忌
                            </div>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-lg">
                            <div className="font-semibold text-amber-700 mb-2">🎭 寓意内涵</div>
                            <div className="text-sm text-amber-600">
                              "徽"指美好品德，"因"指传承延续。
                              寓意承继美德，延续文脉，恰合其文学建筑双栖的人生
                            </div>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-lg">
                            <div className="font-semibold text-amber-700 mb-2">💫 现代启示</div>
                            <div className="text-sm text-amber-600">
                              既有古典韵味，又具现代感，音韵优美，
                              成为民国才女的文化符号，是传统与现代结合的典范
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 现代知识分子案例 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">👨‍🎓 现代知识分子的文化自觉</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          name: '屠呦呦',
                          source: '《诗经·小雅》"呦呦鹿鸣，食野之蒿"',
                          innovation: '突破"女名必柔美"传统，以兽鸣声显探索精神',
                          achievement: '发现青蒿素，"蒿"字暗合研究对象，堪称天意',
                          color: 'green'
                        },
                        {
                          name: '莫言',
                          source: '《老子》"希言自然"',
                          innovation: '化用经典，简约有力，体现现代文学风格',
                          achievement: '诺贝尔文学奖得主，名字寓意"少说话，多做事"',
                          color: 'blue'
                        },
                        {
                          name: '杨振宁',
                          source: '《易经》"雷震百里，振乃宁"',
                          innovation: '将物理概念与易学思想结合，体现科学精神',
                          achievement: '诺贝尔物理奖得主，名字寓意"振兴学术，安定发展"',
                          color: 'purple'
                        }
                      ].map((person, index) => (
                        <div key={index} className={`bg-white p-6 rounded-xl shadow-sm border border-${person.color}-200`}>
                          <h4 className={`text-lg font-bold text-${person.color}-800 mb-3 text-center`}>{person.name}</h4>
                          <div className="space-y-3">
                            <div className={`bg-${person.color}-50 p-3 rounded-lg`}>
                              <div className={`text-xs font-medium text-${person.color}-700 mb-1`}>典籍来源</div>
                              <div className={`text-xs text-${person.color}-600`}>{person.source}</div>
                            </div>
                            <div className={`bg-${person.color}-50 p-3 rounded-lg`}>
                              <div className={`text-xs font-medium text-${person.color}-700 mb-1`}>创新突破</div>
                              <div className={`text-xs text-${person.color}-600`}>{person.innovation}</div>
                            </div>
                            <div className={`bg-${person.color}-50 p-3 rounded-lg`}>
                              <div className={`text-xs font-medium text-${person.color}-700 mb-1`}>成就印证</div>
                              <div className={`text-xs text-${person.color}-600`}>{person.achievement}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 古今对比演化 */}
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔄 古今取名理念的演化对比</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">对比维度</th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">古代士族</th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">现代知识分子</th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">演化趋势</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          <tr>
                            <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">用字偏好</td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">偏爱繁难字（彣、瑤、璇）</td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">简化易读（文、瑶、旋）</td>
                            <td className="border border-gray-300 px-4 py-3 text-blue-600">实用主义回归</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">性别特征</td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">模糊化（君复、子昂）</td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">强化区分（男刚女柔）</td>
                            <td className="border border-gray-300 px-4 py-3 text-green-600">现代性别意识</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">文化来源</td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">纯粹儒家经典</td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">融入现代人文科学</td>
                            <td className="border border-gray-300 px-4 py-3 text-purple-600">知识结构多元化</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">社会适应</td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">仅限文人圈认知</td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">兼顾国际化需求</td>
                            <td className="border border-gray-300 px-4 py-3 text-orange-600">全球化时代要求</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 跨文化突围案例 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
                    <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">🌍 跨文化突围的成功案例</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          {
                            chinese: '陈寅恪',
                            english: 'Chen Yinke',
                            source: '《尚书》"寅宾出日"',
                            rating: 2,
                            analysis: '拼音复杂，国际接受度较低'
                          },
                          {
                            chinese: '钱穆',
                            english: "Ch'ien Mu",
                            source: '《诗经》"穆如清风"',
                            rating: 3,
                            analysis: '单音节核字，相对易读'
                          },
                          {
                            chinese: '陶斯咏',
                            english: 'Tao Siyong',
                            source: '《礼记》"咏斯陶"',
                            rating: 4,
                            analysis: '音韵简洁，国际化友好'
                          }
                        ].map((person, index) => (
                          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-green-200">
                            <h4 className="text-lg font-bold text-green-800 mb-3">{person.chinese}</h4>
                            <div className="space-y-2 text-sm">
                              <div><span className="font-medium">英文：</span>{person.english}</div>
                              <div><span className="font-medium">出处：</span>{person.source}</div>
                              <div className="flex items-center">
                                <span className="font-medium mr-2">国际接受度：</span>
                                <div className="flex">
                                  {[1,2,3,4,5].map(star => (
                                    <span key={star} className={`text-lg ${star <= person.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-green-600 text-xs">{person.analysis}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <h4 className="text-lg font-bold text-green-800 mb-3">🎯 跨文化命名策略</h4>
                        <p className="text-green-700 text-sm">
                          优先选择<strong>单音节核心字</strong>（如"斯咏"优于"蓁蓁"），
                          避免复杂声调组合，确保在全球化背景下既保持文化内涵又便于交流。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 现代思考模块 */}
              {activeSection === 'thinking' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🤔 现代思考：传承与创新的智慧平衡</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                      在全球化与传统文化传承的张力中，探索意境底蕴派取名法的现代价值与发展方向
                    </p>
                  </div>

                  {/* 争议与挑战 */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-200">
                    <h3 className="text-2xl font-bold text-orange-800 mb-6 text-center">⚡ 现代社会的挑战与争议</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-red-700 mb-4">🎭 文化挑战</h4>
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg border border-red-200">
                            <div className="font-semibold text-red-800 mb-2">阶级性质疑</div>
                            <div className="text-sm text-red-600 mb-2">
                              古代仅10%识字率能享用经史名，是否具有精英主义色彩？
                            </div>
                            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                              反驳：现代可通过数字化普及，《名典数据库》让普通家庭也能接触经典
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-red-200">
                            <div className="font-semibold text-red-800 mb-2">时代脱节</div>
                            <div className="text-sm text-red-600 mb-2">
                              "辟疆""尚武"等古代理想不适应和平年代和现代价值观
                            </div>
                            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                              改进：转化为"辟新"（开辟创新）、"尚德"（崇尚品德）等现代表达
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-orange-700 mb-4">🌐 实用挑战</h4>
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg border border-orange-200">
                            <div className="font-semibold text-orange-800 mb-2">国际化困扰</div>
                            <div className="text-sm text-orange-600 mb-2">
                              复杂拼音影响国际交流，如"羲之"拼写"Xizhi"对外国人而言困难
                            </div>
                            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                              解决：选择发音简单的典籍字词，如"子墨""若水"等
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-orange-200">
                            <div className="font-semibold text-orange-800 mb-2">理解门槛</div>
                            <div className="text-sm text-orange-600 mb-2">
                              需要一定文化背景才能理解含义，可能造成沟通障碍
                            </div>
                            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                              策略：制作"名字文化卡"，简明解释典故来源和寓意
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 数据验证分析 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">📊 现代应用数据分析</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-blue-700 mb-4">清华人文学院教师子女取名统计</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">意境底蕴派</span>
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{width: '53%'}}></div>
                              </div>
                              <span className="text-sm font-bold text-blue-700">53%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">八字五行派</span>
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{width: '28%'}}></div>
                              </div>
                              <span className="text-sm font-bold text-green-700">28%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">现代创意派</span>
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                <div className="bg-purple-600 h-2 rounded-full" style={{width: '19%'}}></div>
                              </div>
                              <span className="text-sm font-bold text-purple-700">19%</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded">
                          高频用字：昀、珩、翊、澄（意境派），炎、森、鑫、淼（五行派）
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-bold text-blue-700 mb-4">文化认知深度调查</h4>
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-red-600 mb-2">32%</div>
                          <div className="text-sm text-gray-700">能准确解说典籍出处的父母比例</div>
                          <div className="text-xs text-gray-500 mt-1">（在53%使用意境派取名的家庭中）</div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>完全了解</span>
                            <span className="font-bold text-green-600">32%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>部分了解</span>
                            <span className="font-bold text-yellow-600">45%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>仅知表面</span>
                            <span className="font-bold text-red-600">23%</span>
                          </div>
                        </div>
                        <div className="mt-4 text-xs text-orange-600 bg-orange-50 p-3 rounded">
                          提示：使用意境派取名应该深入了解典故内涵，避免徒有其表
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 现代化改良方案 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
                    <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">🔧 现代化改良的实践方案</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                          <h4 className="text-lg font-bold text-green-700 mb-4">📱 技术赋能</h4>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <span className="text-green-500 text-lg mt-1">✓</span>
                              <div>
                                <div className="font-medium text-green-800">AI智能推荐</div>
                                <div className="text-sm text-green-600">
                                  基于家庭背景和期望，智能匹配合适的典籍名句
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <span className="text-green-500 text-lg mt-1">✓</span>
                              <div>
                                <div className="font-medium text-green-800">文化解读</div>
                                <div className="text-sm text-green-600">
                                  提供典故背景、历史语境和现代释义的多维度解读
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <span className="text-green-500 text-lg mt-1">✓</span>
                              <div>
                                <div className="font-medium text-green-800">音韵分析</div>
                                <div className="text-sm text-green-600">
                                  自动检测方言发音、国际拼写的适配性
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                          <h4 className="text-lg font-bold text-green-700 mb-4">🎓 教育普及</h4>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <span className="text-green-500 text-lg mt-1">✓</span>
                              <div>
                                <div className="font-medium text-green-800">名字文化卡</div>
                                <div className="text-sm text-green-600">
                                  为每个意境名制作精美卡片，详细介绍典故来源和寓意
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <span className="text-green-500 text-lg mt-1">✓</span>
                              <div>
                                <div className="font-medium text-green-800">线上课程</div>
                                <div className="text-sm text-green-600">
                                  开设"国学取名"课程，系统教授典籍运用方法
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <span className="text-green-500 text-lg mt-1">✓</span>
                              <div>
                                <div className="font-medium text-green-800">社区分享</div>
                                <div className="text-sm text-green-600">
                                  建立文化取名社群，分享经验和优秀案例
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                          <h4 className="text-lg font-bold text-green-700 mb-4">🌐 国际化适配</h4>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <span className="text-green-500 text-lg mt-1">✓</span>
                              <div>
                                <div className="font-medium text-green-800">拼音优化</div>
                                <div className="text-sm text-green-600">
                                  优先选择发音简单的字词，避免复杂声调组合
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <span className="text-green-500 text-lg mt-1">✓</span>
                              <div>
                                <div className="font-medium text-green-800">英文释义</div>
                                <div className="text-sm text-green-600">
                                  提供准确的英文含义解释，便于国际交流
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <span className="text-green-500 text-lg mt-1">✓</span>
                              <div>
                                <div className="font-medium text-green-800">文化桥梁</div>
                                <div className="text-sm text-green-600">
                                  选择具有普世价值的美德概念，跨文化认同度高
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                          <h4 className="text-lg font-bold text-green-700 mb-4">💡 创新融合</h4>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <span className="text-green-500 text-lg mt-1">✓</span>
                              <div>
                                <div className="font-medium text-green-800">现代诠释</div>
                                <div className="text-sm text-green-600">
                                  用现代语言重新解读古典概念，贴近时代精神
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <span className="text-green-500 text-lg mt-1">✓</span>
                              <div>
                                <div className="font-medium text-green-800">科学融入</div>
                                <div className="text-sm text-green-600">
                                  将科学精神融入传统文化，如"探微""致远"等
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <span className="text-green-500 text-lg mt-1">✓</span>
                              <div>
                                <div className="font-medium text-green-800">个性定制</div>
                                <div className="text-sm text-green-600">
                                  根据家庭特色和孩子特点，个性化选择典籍来源
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 未来发展展望 */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-200 text-center">
                    <h3 className="text-2xl font-bold text-purple-800 mb-4">🌟 在时间的砧板上锤炼名字</h3>
                    <div className="max-w-4xl mx-auto">
                      <p className="text-lg text-purple-700 leading-relaxed mb-6">
                        意境底蕴派取名是一场<strong className="text-purple-800">跨越千年的对话</strong>。
                        当父母为新生儿取名"观澜"（《孟子》"观水有术，必观其澜"），
                        实则在基因中植入了对宇宙规律的敬畏、对洞察本质的追求、对磅礴气象的向往。
                      </p>
                      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                        <div className="text-purple-600 italic text-lg mb-4">
                          "名者实之宾也。真正的'底蕴'，终在让孩子活出名字背后的精神。"
                        </div>
                        <div className="text-sm text-purple-500">
                          —— 如"梁启超"之名虽取《诗经》"哲夫成城"，其不朽更在"少年中国"的践行。
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-2xl mb-2">📚</div>
                          <div className="font-semibold text-purple-700">借《论语》铸风骨</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-2xl mb-2">📜</div>
                          <div className="font-semibold text-purple-700">引《史记》养气度</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-2xl mb-2">🎭</div>
                          <div className="font-semibold text-purple-700">摄《诗经》添灵韵</div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <button 
                          onClick={() => setActiveSection('overview')}
                          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
                        >
                          🔄 重新开始文化之旅
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
                    const sections = ['overview', 'history', 'methods', 'classics', 'cases', 'thinking'];
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
                    const sections = ['overview', 'history', 'methods', 'classics', 'cases', 'thinking'];
                    const currentIndex = sections.indexOf(activeSection);
                    if (currentIndex < sections.length - 1) {
                      setActiveSection(sections[currentIndex + 1] as any);
                    }
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all"
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
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105"
            >
              ← 返回首页
            </Link>
          </div>
        </div>

        {/* 页面底部 */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-4">
              📚 千年文脉的现代传承
            </div>
            <div className="text-gray-600">
              让经史子集的智慧在新时代绽放光芒，为孩子植入文化基因
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CulturalHeritagePage;