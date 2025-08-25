import React, { useState } from 'react';
import { CulturalPageTemplate } from '@/components/layout/CulturalPageTemplate';
import { Button, Card, Input } from '@/components/ui';

const WuxingBalanceNewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'theory' | 'combination' | 'application'>('theory');

  const wuxingElements = [
    {
      name: '木',
      color: 'green',
      character: '木',
      nature: '生发向上',
      season: '春季',
      direction: '东方',
      personality: '仁慈、进取、创新',
      suitable: '文学、艺术、教育',
      icon: '🌳'
    },
    {
      name: '火',
      color: 'red',
      character: '火',
      nature: '炎热向上',
      season: '夏季',
      direction: '南方',
      personality: '热情、积极、礼貌',
      suitable: '表演、销售、领导',
      icon: '🔥'
    },
    {
      name: '土',
      color: 'yellow',
      character: '土',
      nature: '承载包容',
      season: '长夏',
      direction: '中央',
      personality: '稳重、诚信、包容',
      suitable: '管理、服务、建筑',
      icon: '🏔️'
    },
    {
      name: '金',
      color: 'gray',
      character: '金',
      nature: '收敛肃杀',
      season: '秋季',
      direction: '西方',
      personality: '果断、正义、理性',
      suitable: '金融、法律、技术',
      icon: '⚔️'
    },
    {
      name: '水',
      color: 'blue',
      character: '水',
      nature: '润下滋养',
      season: '冬季',
      direction: '北方',
      personality: '智慧、灵活、深沉',
      suitable: '研究、策划、咨询',
      icon: '💧'
    }
  ];

  return (
    <CulturalPageTemplate
      title="五行平衡配置原理 - 宝宝取名专家"
      description="了解传统五行相生相克理论与现代应用，掌握名字五行配置的深层智慧"
      keywords="五行平衡,五行相生相克,传统文化,姓名学,阴阳五行"

      heroTitle="五行平衡"
      heroSubtitle="和谐统一的能量调衡"
      heroDescription="根据生辰八字分析五行属性，通过姓名调节人体能量平衡，实现命理与姓名的完美融合，传承千年的中华智慧"
      culturalTheme="taoist"
      headerActions={
        <Button variant="outline" size="sm" className="border-cultural-jade-300 text-cultural-ink-700">
          ⚖️ 五行测试
        </Button>
      }
    >
      <div className="p-8">
        {/* 标签导航 - 传统文化风格 */}
        <div className="mb-12">
          <div className="flex justify-center mb-8">
            <div className="flex bg-cultural-paper rounded-xl border-2 border-cultural-jade-200 p-1 shadow-cultural">
              {[
                { id: 'theory', label: '理论基础', icon: '📚' },
                { id: 'combination', label: '搭配原理', icon: '⚖️' },
                { id: 'application', label: '实际应用', icon: '🎯' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cultural-jade-500 to-cultural-jade-600 text-white shadow-cultural'
                      : 'text-cultural-ink-600 hover:bg-cultural-jade-50 hover:text-cultural-jade-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 理论基础 */}
        {activeTab === 'theory' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-cultural-ink-800 mb-4 flex items-center justify-center gap-3">
                <span className="text-cultural-jade-600">📚</span>
                五行理论基础
                <span className="text-cultural-gold-600">✨</span>
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-cultural-jade-400 via-cultural-gold-400 to-cultural-red-400 mx-auto rounded-full"></div>
            </div>

            {/* 五行元素展示 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
              {wuxingElements.map((element, index) => (
                <Card key={element.name} className={`p-6 text-center border-2 border-${element.color}-200 bg-${element.color}-50 hover:shadow-cultural-lg transition-all duration-300 transform hover:scale-105`}>
                  <div className="text-5xl mb-4">{element.icon}</div>
                  <div className={`text-3xl font-bold text-${element.color}-800 mb-2`}>{element.character}</div>
                  <div className={`text-lg font-semibold text-${element.color}-700 mb-3`}>{element.name}</div>
                  <div className={`text-sm text-${element.color}-600 space-y-1`}>
                    <div><strong>性质：</strong>{element.nature}</div>
                    <div><strong>季节：</strong>{element.season}</div>
                    <div><strong>方位：</strong>{element.direction}</div>
                  </div>
                </Card>
              ))}
            </div>

            {/* 五行相生相克图 */}
            <Card className="p-8 border-2 border-cultural-jade-200 bg-gradient-to-br from-cultural-jade-50 to-cultural-paper">
              <h3 className="text-2xl font-bold text-cultural-jade-800 mb-6 text-center flex items-center justify-center gap-3">
                <span className="text-cultural-red-600">☯️</span>
                五行相生相克关系图
                <span className="text-cultural-gold-600">🔄</span>
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 相生关系 */}
                <div>
                  <h4 className="text-xl font-bold text-green-800 mb-4 text-center">🌱 相生关系（相互促进）</h4>
                  <div className="space-y-3">
                    {[
                      { from: '木', to: '火', relation: '木生火', desc: '木材燃烧生火', color: 'green' },
                      { from: '火', to: '土', relation: '火生土', desc: '火烧成灰化土', color: 'red' },
                      { from: '土', to: '金', relation: '土生金', desc: '土中蕴藏金属', color: 'yellow' },
                      { from: '金', to: '水', relation: '金生水', desc: '金属凝结水珠', color: 'gray' },
                      { from: '水', to: '木', relation: '水生木', desc: '水分滋养树木', color: 'blue' }
                    ].map((item, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 bg-${item.color}-50 rounded-lg border border-${item.color}-200`}>
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl font-bold text-${item.color}-700`}>{item.from}</span>
                          <span className="text-green-600">→</span>
                          <span className={`text-2xl font-bold text-${item.color}-700`}>{item.to}</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold text-${item.color}-800`}>{item.relation}</div>
                          <div className={`text-xs text-${item.color}-600`}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 相克关系 */}
                <div>
                  <h4 className="text-xl font-bold text-red-800 mb-4 text-center">⚔️ 相克关系（相互制约）</h4>
                  <div className="space-y-3">
                    {[
                      { from: '木', to: '土', relation: '木克土', desc: '树根破坏土壤', color: 'green' },
                      { from: '土', to: '水', relation: '土克水', desc: '土壤吸收水分', color: 'yellow' },
                      { from: '水', to: '火', relation: '水克火', desc: '水能扑灭火焰', color: 'blue' },
                      { from: '火', to: '金', relation: '火克金', desc: '火能熔化金属', color: 'red' },
                      { from: '金', to: '木', relation: '金克木', desc: '金属能砍伐树木', color: 'gray' }
                    ].map((item, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 bg-${item.color}-50 rounded-lg border border-${item.color}-200`}>
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl font-bold text-${item.color}-700`}>{item.from}</span>
                          <span className="text-red-600">⚡</span>
                          <span className={`text-2xl font-bold text-${item.color}-700`}>{item.to}</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold text-${item.color}-800`}>{item.relation}</div>
                          <div className={`text-xs text-${item.color}-600`}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* 五行与人格特质 */}
            <Card className="p-8 border-2 border-cultural-gold-200 bg-gradient-to-br from-cultural-gold-50 to-cultural-paper">
              <h3 className="text-2xl font-bold text-cultural-gold-800 mb-6 text-center flex items-center justify-center gap-3">
                <span className="text-cultural-jade-600">👤</span>
                五行与人格特质对应
                <span className="text-cultural-red-600">🎭</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {wuxingElements.map((element) => (
                  <Card key={element.name} className={`p-4 border border-${element.color}-200 bg-${element.color}-50`}>
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">{element.icon}</div>
                      <div className={`text-xl font-bold text-${element.color}-800`}>{element.name}</div>
                    </div>
                    <div className={`text-sm text-${element.color}-700 space-y-2`}>
                      <div>
                        <strong>性格：</strong>
                        <div className={`text-${element.color}-600`}>{element.personality}</div>
                      </div>
                      <div>
                        <strong>适合：</strong>
                        <div className={`text-${element.color}-600`}>{element.suitable}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 搭配原理 */}
        {activeTab === 'combination' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-cultural-ink-800 mb-4 flex items-center justify-center gap-3">
                <span className="text-cultural-jade-600">⚖️</span>
                五行搭配原理
                <span className="text-cultural-gold-600">🔄</span>
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-cultural-jade-400 via-cultural-gold-400 to-cultural-red-400 mx-auto rounded-full"></div>
            </div>

            {/* 最佳搭配组合 */}
            <Card className="p-8 border-2 border-cultural-jade-200 bg-gradient-to-br from-cultural-jade-50 to-cultural-paper">
              <h3 className="text-2xl font-bold text-cultural-jade-800 mb-6 text-center">✨ 最佳搭配组合</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: '相生组合（推荐）',
                    type: 'positive',
                    combinations: [
                      { first: '木', second: '火', desc: '木火通明，文采斐然', example: '林炎、森焱' },
                      { first: '火', second: '土', desc: '火土相生，稳重热情', example: '炎坤、焱培' },
                      { first: '土', second: '金', desc: '土金相生，诚信果断', example: '坤铭、培锐' },
                      { first: '金', second: '水', desc: '金水相生，智慧理性', example: '铭泽、锐润' },
                      { first: '水', second: '木', desc: '水木相生，灵活进取', example: '泽林、润森' }
                    ]
                  },
                  {
                    title: '同类组合（平衡）',
                    type: 'neutral',
                    combinations: [
                      { first: '木', second: '木', desc: '双木成林，生机勃勃', example: '林森、松柏' },
                      { first: '火', second: '火', desc: '双火炽热，热情洋溢', example: '炎焱、烈炽' },
                      { first: '土', second: '土', desc: '厚德载物，稳重踏实', example: '坤培、厚德' },
                      { first: '金', second: '金', desc: '金玉满堂，坚韧不拔', example: '铭锐、钢铁' },
                      { first: '水', second: '水', desc: '水流不息，智慧深邃', example: '泽润、江海' }
                    ]
                  }
                ].map((group, index) => (
                  <div key={index}>
                    <h4 className={`text-lg font-bold mb-4 ${group.type === 'positive' ? 'text-green-800' : 'text-blue-800'}`}>
                      {group.title}
                    </h4>
                    <div className="space-y-3">
                      {group.combinations.map((combo, i) => (
                        <Card key={i} className={`p-4 border ${group.type === 'positive' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-xl font-bold ${group.type === 'positive' ? 'text-green-700' : 'text-blue-700'}`}>
                                {combo.first}
                              </span>
                              <span className={group.type === 'positive' ? 'text-green-600' : 'text-blue-600'}>+</span>
                              <span className={`text-xl font-bold ${group.type === 'positive' ? 'text-green-700' : 'text-blue-700'}`}>
                                {combo.second}
                              </span>
                            </div>
                            <div className={`text-sm font-medium ${group.type === 'positive' ? 'text-green-600' : 'text-blue-600'}`}>
                              {combo.example}
                            </div>
                          </div>
                          <div className={`text-sm ${group.type === 'positive' ? 'text-green-600' : 'text-blue-600'}`}>
                            {combo.desc}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 需要避免的组合 */}
            <Card className="p-8 border-2 border-red-200 bg-gradient-to-br from-red-50 to-cultural-paper">
              <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">⚠️ 需要谨慎的组合</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { first: '木', second: '金', desc: '金克木，可能导致性格冲突', impact: '进取与保守的矛盾' },
                  { first: '火', second: '水', desc: '水克火，容易产生内在冲突', impact: '热情与冷静的对立' },
                  { first: '土', second: '木', desc: '木克土，可能影响稳定性', impact: '变化与稳定的冲突' },
                  { first: '金', second: '火', desc: '火克金，理性与感性的冲突', impact: '逻辑与直觉的矛盾' },
                  { first: '水', second: '土', desc: '土克水，灵活性受限', impact: '变通与固执的对立' }
                ].map((combo, index) => (
                  <Card key={index} className="p-4 border border-red-200 bg-red-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold text-red-700">{combo.first}</span>
                      <span className="text-red-600">⚡</span>
                      <span className="text-xl font-bold text-red-700">{combo.second}</span>
                    </div>
                    <div className="text-sm text-red-600 mb-1">{combo.desc}</div>
                    <div className="text-xs text-red-500">{combo.impact}</div>
                  </Card>
                ))}
              </div>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 text-lg">💡</span>
                  <div className="text-sm text-yellow-800">
                    <strong>温馨提示：</strong>
                    相克组合并非绝对不可用，在某些情况下反而能形成互补，关键在于整体的平衡与和谐。
                    建议结合具体的生辰八字和个人特质进行综合考虑。
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 实际应用 */}
        {activeTab === 'application' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-cultural-ink-800 mb-4 flex items-center justify-center gap-3">
                <span className="text-cultural-jade-600">🎯</span>
                实际应用指南
                <span className="text-cultural-gold-600">📋</span>
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-cultural-jade-400 via-cultural-gold-400 to-cultural-red-400 mx-auto rounded-full"></div>
            </div>

            {/* 应用步骤 */}
            <Card className="p-8 border-2 border-cultural-jade-200 bg-gradient-to-br from-cultural-jade-50 to-cultural-paper">
              <h3 className="text-2xl font-bold text-cultural-jade-800 mb-6 text-center">📋 五行取名应用步骤</h3>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: '分析生辰八字',
                    desc: '根据出生年月日时，分析八字中五行的强弱分布',
                    details: ['确定日主五行', '分析五行旺衰', '找出喜用神', '确定忌神'],
                    color: 'red'
                  },
                  {
                    step: 2,
                    title: '确定补益方向',
                    desc: '根据八字分析结果，确定需要补充或平衡的五行',
                    details: ['补充缺失五行', '增强偏弱五行', '平衡过旺五行', '避免忌神五行'],
                    color: 'yellow'
                  },
                  {
                    step: 3,
                    title: '选择合适汉字',
                    desc: '选择符合五行需求的汉字进行组合',
                    details: ['查找对应五行的字', '考虑字义寓意', '注意音韵搭配', '避免生僻字'],
                    color: 'green'
                  },
                  {
                    step: 4,
                    title: '验证整体效果',
                    desc: '检验名字的整体五行配置是否达到预期效果',
                    details: ['计算五格数理', '分析三才配置', '检查音韵美感', '确认寓意吉祥'],
                    color: 'blue'
                  }
                ].map((item) => (
                  <Card key={item.step} className={`p-6 border-2 border-${item.color}-200 bg-${item.color}-50`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-${item.color}-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xl font-bold text-${item.color}-800 mb-2`}>{item.title}</h4>
                        <p className={`text-${item.color}-700 mb-4`}>{item.desc}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {item.details.map((detail, index) => (
                            <div key={index} className={`text-sm text-${item.color}-600 flex items-center gap-2`}>
                              <span className={`w-2 h-2 bg-${item.color}-400 rounded-full`}></span>
                              {detail}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* 成功案例 */}
            <Card className="p-8 border-2 border-cultural-gold-200 bg-gradient-to-br from-cultural-gold-50 to-cultural-paper">
              <h3 className="text-2xl font-bold text-cultural-gold-800 mb-6 text-center">🏆 成功案例分析</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: '张雨萱',
                    birth: '2023年春分',
                    analysis: '八字偏燥，需要水木调节',
                    solution: '雨（水）+ 萱（木），水生木，相生有情',
                    result: '性格温和，学习能力强，人际关系和谐',
                    wuxing: ['水', '木']
                  },
                  {
                    name: '李炎坤',
                    birth: '2023年冬至',
                    analysis: '八字偏寒，需要火土温暖',
                    solution: '炎（火）+ 坤（土），火生土，温暖厚德',
                    result: '性格热情，做事踏实，领导能力突出',
                    wuxing: ['火', '土']
                  }
                ].map((case_item, index) => (
                  <Card key={index} className="p-6 border border-cultural-ink-200 bg-white">
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold text-cultural-ink-800 mb-1">{case_item.name}</h4>
                      <div className="text-sm text-cultural-ink-600">{case_item.birth}</div>
                      <div className="flex justify-center gap-2 mt-2">
                        {case_item.wuxing.map((element, i) => (
                          <span key={i} className="px-2 py-1 bg-cultural-jade-100 text-cultural-jade-700 rounded-full text-xs">
                            {element}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong className="text-cultural-red-700">分析：</strong>
                        <span className="text-cultural-ink-600">{case_item.analysis}</span>
                      </div>
                      <div>
                        <strong className="text-cultural-gold-700">方案：</strong>
                        <span className="text-cultural-ink-600">{case_item.solution}</span>
                      </div>
                      <div>
                        <strong className="text-cultural-jade-700">效果：</strong>
                        <span className="text-cultural-ink-600">{case_item.result}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </CulturalPageTemplate>
  );
};

export default WuxingBalanceNewPage;
