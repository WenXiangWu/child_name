import React, { useState, useEffect } from 'react';
import { CulturalPageTemplate } from '@/components/layout/CulturalPageTemplate';
import { Button, Card, Input } from '@/components/ui';

const SancaiWugeNewPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'history' | 'formula' | 'algorithm' | 'cases' | 'thinking'>('overview');
  const [progress, setProgress] = useState(0);
  const [calculatorInput, setCalculatorInput] = useState({ surname: '', firstName: '' });
  const [calculatorResult, setCalculatorResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 计算学习进度
  useEffect(() => {
    const sections = ['overview', 'history', 'formula', 'algorithm', 'cases', 'thinking'];
    const currentIndex = sections.indexOf(activeSection);
    setProgress(((currentIndex + 1) / sections.length) * 100);
  }, [activeSection]);

  // 模拟计算功能
  const handleCalculate = () => {
    if (!calculatorInput.surname || !calculatorInput.firstName) return;
    
    setIsCalculating(true);
    setTimeout(() => {
      const mockResult = {
        tiange: { value: 15, wuxing: '土', meaning: '稳重踏实，基础牢固' },
        renge: { value: 23, wuxing: '火', meaning: '积极向上，充满活力' },
        dige: { value: 18, wuxing: '金', meaning: '坚韧不拔，意志坚强' },
        zongge: { value: 32, wuxing: '木', meaning: '生机勃勃，发展顺利' },
        waige: { value: 10, wuxing: '水', meaning: '灵活变通，善于交际' },
        sancai: { tian: '土', ren: '火', di: '金' }
      };
      setCalculatorResult(mockResult);
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <CulturalPageTemplate
      title="三才五格：解密姓名中的数理奥秘 - 宝宝取名专家"
      description="深入了解三才五格剖象法的历史起源、计算原理和实际应用，从日本回流的中华传统文化与现代算法的完美结合"
      keywords="三才五格,五格剖象法,姓名学,数理计算,熊崎健翁,传统文化"
      breadcrumbs={[{ label: '三才五格详解' }]}
      heroTitle="三才五格"
      heroSubtitle="解密姓名中的数理奥秘"
      heroDescription="从日本熊崎健翁的系统化整理到中华传统文化的深厚底蕴，探索姓名学中最具影响力的数理分析体系，了解五个维度如何映射人生轨迹，掌握科学计算方法背后的文化智慧"
      culturalTheme="confucian"
      showProgress={true}
      progress={progress}
      headerActions={
        <Button variant="outline" size="sm" className="border-cultural-gold-300 text-cultural-ink-700">
          📊 在线计算
        </Button>
      }
    >
      <div className="p-8">
        {/* 学习模块导航 - 传统文化风格 */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-cultural-ink-800 mb-4 flex items-center justify-center gap-3">
              <span className="text-cultural-red-600">📚</span>
              学习模块导航
              <span className="text-cultural-gold-600">📖</span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-cultural-red-400 via-cultural-gold-400 to-cultural-jade-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { id: 'overview', icon: '🎯', title: '快速概览', desc: '5分钟了解核心', color: 'cultural-red' },
              { id: 'history', icon: '📜', title: '历史起源', desc: '文化传承脉络', color: 'cultural-gold' },
              { id: 'formula', icon: '📐', title: '计算公式', desc: '数理计算方法', color: 'cultural-jade' },
              { id: 'algorithm', icon: '⚙️', title: '算法原理', desc: '技术实现详解', color: 'blue' },
              { id: 'cases', icon: '💡', title: '实战案例', desc: '真实名字分析', color: 'purple' },
              { id: 'thinking', icon: '🤔', title: '理性思考', desc: '批判与局限性', color: 'gray' }
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`group p-4 rounded-xl transition-all duration-300 text-center border-2 ${
                  activeSection === section.id
                    ? `border-${section.color}-400 bg-${section.color}-50 shadow-cultural transform scale-105`
                    : 'border-cultural-paper hover:border-cultural-gold-300 hover:bg-cultural-gold-50 hover:shadow-md'
                }`}
              >
                <div className={`text-3xl mb-2 transition-transform duration-300 ${
                  activeSection === section.id ? 'animate-bounce' : 'group-hover:scale-110'
                }`}>
                  {section.icon}
                </div>
                <div className={`font-bold text-sm mb-1 ${
                  activeSection === section.id ? `text-${section.color}-800` : 'text-cultural-ink-700'
                }`}>
                  {section.title}
                </div>
                <div className={`text-xs ${
                  activeSection === section.id ? `text-${section.color}-600` : 'text-cultural-ink-500'
                }`}>
                  {section.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="min-h-[600px]">
          {/* 快速概览模块 */}
          {activeSection === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-cultural-ink-800 mb-4 flex items-center justify-center gap-3">
                  <span className="text-cultural-red-600">🎯</span>
                  三才五格快速入门
                </h2>
                <p className="text-lg text-cultural-ink-600 max-w-3xl mx-auto leading-relaxed">
                  5分钟了解姓名学中最重要的数理分析体系，掌握五个维度如何影响人生轨迹
                </p>
                <div className="mt-4 w-24 h-1 bg-gradient-to-r from-cultural-red-400 to-cultural-gold-400 mx-auto rounded-full"></div>
              </div>

              {/* 核心概念卡片 - 传统文化风格 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="p-6 border-2 border-cultural-red-200 bg-gradient-to-br from-cultural-red-50 to-cultural-paper hover:shadow-cultural-lg transition-all duration-300">
                  <div className="text-4xl mb-4 text-center">🏛️</div>
                  <h3 className="text-xl font-bold text-cultural-red-800 mb-3 text-center">什么是三才五格？</h3>
                  <p className="text-cultural-red-700 leading-relaxed">
                    将姓名分解为天格、人格、地格、总格、外格五个数理维度，再组合成天、人、地三才，
                    通过数字能量分析人生各阶段的运势特点。
                  </p>
                </Card>
                
                <Card className="p-6 border-2 border-cultural-gold-200 bg-gradient-to-br from-cultural-gold-50 to-cultural-paper hover:shadow-cultural-lg transition-all duration-300">
                  <div className="text-4xl mb-4 text-center">🧮</div>
                  <h3 className="text-xl font-bold text-cultural-gold-800 mb-3 text-center">计算原理是什么？</h3>
                  <p className="text-cultural-gold-700 leading-relaxed">
                    基于康熙字典笔画数，通过特定公式计算五格数值，再将数字转换为五行属性，
                    分析五行相生相克关系来判断吉凶。
                  </p>
                </Card>
                
                <Card className="p-6 border-2 border-cultural-jade-200 bg-gradient-to-br from-cultural-jade-50 to-cultural-paper hover:shadow-cultural-lg transition-all duration-300">
                  <div className="text-4xl mb-4 text-center">📈</div>
                  <h3 className="text-xl font-bold text-cultural-jade-800 mb-3 text-center">有什么实用价值？</h3>
                  <p className="text-cultural-jade-700 leading-relaxed">
                    提供姓名评价的量化标准，帮助理解传统文化中的姓名观念，
                    但应理性看待，作为文化传承而非绝对预测。
                  </p>
                </Card>
              </div>

              {/* 五格结构图 - 传统文化风格 */}
              <Card className="p-8 border-2 border-cultural-ink-200 bg-gradient-to-br from-cultural-paper to-white">
                <h3 className="text-2xl font-bold text-center text-cultural-ink-800 mb-8 flex items-center justify-center gap-3">
                  <span className="text-cultural-red-600">🏗️</span>
                  五格结构一目了然
                  <span className="text-cultural-gold-600">✨</span>
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {[
                    { name: '天格', color: 'blue', desc: '祖运基础', period: '先天影响', icon: '☁️' },
                    { name: '人格', color: 'green', desc: '主运核心', period: '性格命运', icon: '👤' },
                    { name: '地格', color: 'yellow', desc: '前运根基', period: '青年时期', icon: '🌱' },
                    { name: '总格', color: 'purple', desc: '后运轨迹', period: '中晚年', icon: '🎯' },
                    { name: '外格', color: 'red', desc: '副运助力', period: '社交外缘', icon: '🤝' }
                  ].map((grid, index) => (
                    <Card key={grid.name} className={`p-6 text-center border-2 border-${grid.color}-200 bg-${grid.color}-50 hover:shadow-lg transform hover:scale-105 transition-all duration-300`}>
                      <div className="text-4xl mb-3">{grid.icon}</div>
                      <div className={`text-xl font-bold text-${grid.color}-800 mb-2`}>{grid.name}</div>
                      <div className={`text-sm text-${grid.color}-600 mb-1 font-medium`}>{grid.desc}</div>
                      <div className={`text-xs text-${grid.color}-500`}>{grid.period}</div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* 计算公式模块 */}
          {activeSection === 'formula' && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-cultural-ink-800 mb-4 flex items-center justify-center gap-3">
                  <span className="text-cultural-jade-600">📐</span>
                  五格计算公式详解
                </h2>
                <p className="text-lg text-cultural-ink-600 max-w-4xl mx-auto leading-relaxed">
                  掌握精确的数理计算方法，理解每个格局的深层含义
                </p>
              </div>

              {/* 在线计算器 - 传统文化风格 */}
              <Card className="p-8 border-2 border-cultural-jade-200 bg-gradient-to-br from-cultural-jade-50 to-cultural-paper">
                <h3 className="text-2xl font-bold text-cultural-jade-800 mb-6 text-center flex items-center justify-center gap-3">
                  <span className="text-cultural-red-600">🧮</span>
                  在线五格计算器
                  <span className="text-cultural-gold-600">✨</span>
                </h3>
                <div className="max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-cultural-jade-700 mb-2">
                        姓氏 <span className="text-cultural-red-500">*</span>
                      </label>
                      <Input
                        value={calculatorInput.surname}
                        onChange={(e) => setCalculatorInput(prev => ({ ...prev, surname: e.target.value }))}
                        placeholder="请输入姓氏，如：王"
                        className="border-cultural-jade-300 focus:border-cultural-jade-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cultural-jade-700 mb-2">
                        名字 <span className="text-cultural-red-500">*</span>
                      </label>
                      <Input
                        value={calculatorInput.firstName}
                        onChange={(e) => setCalculatorInput(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="请输入名字，如：浩然"
                        className="border-cultural-jade-300 focus:border-cultural-jade-500"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <Button
                      onClick={handleCalculate}
                      disabled={!calculatorInput.surname || !calculatorInput.firstName || isCalculating}
                      className="px-8 py-3 bg-gradient-to-r from-cultural-jade-600 to-cultural-jade-700 hover:from-cultural-jade-700 hover:to-cultural-jade-800 text-white border-0"
                    >
                      {isCalculating ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          计算中...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <span className="text-cultural-gold-200">🔍</span>
                          立即计算
                        </span>
                      )}
                    </Button>
                  </div>
                </div>

                {/* 计算结果展示 */}
                {calculatorResult && (
                  <div className="mt-8 p-6 bg-white rounded-xl border-2 border-cultural-gold-200 shadow-cultural">
                    <h4 className="text-lg font-bold text-cultural-ink-800 mb-4 text-center flex items-center justify-center gap-2">
                      <span className="text-cultural-red-600">📊</span>
                      计算结果 - {calculatorInput.surname}{calculatorInput.firstName}
                      <span className="text-cultural-gold-600">✨</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                      {[
                        { name: '天格', key: 'tiange', color: 'blue' },
                        { name: '人格', key: 'renge', color: 'green' },
                        { name: '地格', key: 'dige', color: 'yellow' },
                        { name: '总格', key: 'zongge', color: 'purple' },
                        { name: '外格', key: 'waige', color: 'red' }
                      ].map((grid) => (
                        <Card key={grid.name} className={`p-4 text-center border-2 border-${grid.color}-200 bg-${grid.color}-50`}>
                          <div className={`text-${grid.color}-700 font-bold text-lg`}>{grid.name}</div>
                          <div className={`text-2xl font-bold text-${grid.color}-800`}>{calculatorResult[grid.key].value}</div>
                          <div className={`text-${grid.color}-600 text-sm`}>{calculatorResult[grid.key].wuxing}</div>
                          <div className={`text-xs text-${grid.color}-500 mt-2`}>{calculatorResult[grid.key].meaning}</div>
                        </Card>
                      ))}
                    </div>
                    <Card className="p-4 bg-gradient-to-r from-cultural-paper to-cultural-gold-50 border-2 border-cultural-gold-200">
                      <div className="text-center">
                        <div className="text-cultural-ink-700 mb-2 font-medium">三才组合：</div>
                        <div className="text-xl font-bold text-cultural-ink-800 flex items-center justify-center gap-3">
                          <span className="text-cultural-red-600">{calculatorResult.sancai.tian}</span>
                          <span className="text-cultural-gold-500">-</span>
                          <span className="text-cultural-jade-600">{calculatorResult.sancai.ren}</span>
                          <span className="text-cultural-gold-500">-</span>
                          <span className="text-blue-600">{calculatorResult.sancai.di}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* 其他模块内容可以继续添加... */}
          {activeSection !== 'overview' && activeSection !== 'formula' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🚧</div>
              <h3 className="text-2xl font-bold text-cultural-ink-800 mb-4">内容正在完善中</h3>
              <p className="text-cultural-ink-600 mb-8">
                该模块内容正在精心制作中，敬请期待更加丰富的传统文化内容
              </p>
              <Button
                onClick={() => setActiveSection('overview')}
                className="bg-gradient-to-r from-cultural-red-600 to-cultural-gold-600 text-white border-0"
              >
                返回概览
              </Button>
            </div>
          )}
        </div>

        {/* 底部导航 - 传统文化风格 */}
        <Card className="mt-12 p-6 border-2 border-cultural-gold-200 bg-gradient-to-r from-cultural-paper to-cultural-gold-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-cultural-ink-600 flex items-center gap-2">
              <span className="text-cultural-gold-600">📊</span>
              学习进度：{Math.round(progress)}% 完成
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => {
                  const sections = ['overview', 'history', 'formula', 'algorithm', 'cases', 'thinking'];
                  const currentIndex = sections.indexOf(activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(sections[currentIndex - 1] as any);
                  }
                }}
                variant="outline"
                className="border-cultural-ink-300 text-cultural-ink-600 hover:bg-cultural-ink-50"
              >
                ← 上一节
              </Button>
              <Button
                onClick={() => {
                  const sections = ['overview', 'history', 'formula', 'algorithm', 'cases', 'thinking'];
                  const currentIndex = sections.indexOf(activeSection);
                  if (currentIndex < sections.length - 1) {
                    setActiveSection(sections[currentIndex + 1] as any);
                  }
                }}
                className="bg-gradient-to-r from-cultural-red-600 to-cultural-gold-600 text-white border-0"
              >
                下一节 →
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </CulturalPageTemplate>
  );
};

export default SancaiWugeNewPage;
