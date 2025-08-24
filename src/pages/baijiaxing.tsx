import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CulturalTreasureTemplate } from '@/components/Layout';
import { Button, Card, Input } from '@/components/ui';

// 临时数据，避免构建时的JSON导入问题
const baijiaxingData = {
  title: '百家姓',
  author: '佚名',
  tags: '北宋',
  paragraphs: [
    '赵钱孙李，周吴郑王。',
    '冯陈褚卫，蒋沈韩杨。',
    '朱秦尤许，何吕施张。',
    '孔曹严华，金魏陶姜。'
  ],
  origin: [
    { surname: '赵', place: '天水郡' },
    { surname: '钱', place: '彭城郡' },
    { surname: '孙', place: '富春郡' },
    { surname: '李', place: '陇西郡' }
  ]
};

interface Surname {
  surname: string;
  place: string;
}

const BaijiaxingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurname, setSelectedSurname] = useState<Surname | null>(null);

  // 从paragraphs中提取所有姓氏
  const allSurnames = useMemo(() => {
    const surnames: string[] = [];
    
    // 从paragraphs中提取单姓
    baijiaxingData.paragraphs.forEach(paragraph => {
      // 移除标点符号，提取汉字
      const chars = paragraph.replace(/[，。]/g, '');
      for (const char of chars) {
        if (char && !surnames.includes(char)) {
          surnames.push(char);
        }
      }
    });

    return surnames;
  }, []);

  // 搜索过滤
  const filteredOrigins = useMemo(() => {
    if (!searchTerm) return baijiaxingData.origin;
    return baijiaxingData.origin.filter(item => 
      item.surname.includes(searchTerm) || 
      item.place.includes(searchTerm)
    );
  }, [searchTerm]);

  const handleSurnameClick = (surname: string) => {
    const origin = baijiaxingData.origin.find(item => item.surname === surname);
    setSelectedSurname(origin || null);
  };

  const breadcrumbs = [
    { label: '首页', href: '/' },
    { label: '典籍宝库', href: '/poetry' },
    { label: '百家姓谱', href: '/baijiaxing' }
  ];

  const statsData = [
    { label: '收录姓氏', value: allSurnames.length, icon: '👥' },
    { label: '详细释义', value: baijiaxingData.origin.length, icon: '📖' },
    { label: '成书时期', value: '北宋', icon: '📅' },
    { label: '文化价值', value: '千年', icon: '🏛️' }
  ];

  return (
    <CulturalTreasureTemplate
      title="百家姓科普 - 中华姓氏文化传承"
      description="探索中华姓氏文化，了解百家姓的历史渊源和地理分布，传承千年文化智慧"
      pageTitle="百家姓"
      pageSubtitle="赵钱孙李，周吴郑王"
      icon="📜"
      breadcrumbs={breadcrumbs}
      stats={statsData}
    >

      {/* 搜索功能 */}
      <Card variant="cultural" className="mb-8 shadow-cultural-lg">
        <div className="p-8 text-center">
          <h3 className="text-2xl font-bold text-cultural-ink font-heading mb-6">姓氏查询</h3>
          <div className="max-w-md mx-auto">
            <Input
              type="text"
              placeholder="搜索姓氏或籍贯..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-center text-lg"
            />
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
              <span className="flex items-center text-cultural-jade">
                <span className="mr-1">🔍</span>
                共找到 {filteredOrigins.length} 个姓氏
              </span>
              {searchTerm && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                >
                  清空搜索
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* 原文展示 */}
      <Card variant="cultural" className="mb-8 shadow-cultural-lg">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-cultural-ink font-heading mb-4">百家姓原文</h2>
            <p className="text-cultural-gold font-medium">点击姓氏查看详细信息</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {baijiaxingData.paragraphs.map((paragraph, index) => (
              <Card 
                key={index}
                variant="bordered"
                className="text-center p-6 bg-gradient-to-br from-cultural-paper to-white border-2 border-cultural-gold/30 hover:border-cultural-gold/50 transition-all duration-300 group"
              >
                <div className="text-3xl font-heading text-cultural-ink leading-relaxed">
                  {paragraph.split('').map((char, charIndex) => {
                    if (char === '，' || char === '。') {
                      return <span key={charIndex} className="text-cultural-gold mx-1">{char}</span>;
                    }
                    if (char && char !== '，' && char !== '。') {
                      return (
                        <span 
                          key={charIndex}
                          className="cursor-pointer hover:text-cultural-red hover:bg-cultural-paper rounded-lg px-2 py-1 mx-1 transition-all duration-300 transform hover:scale-110 inline-block"
                          onClick={() => handleSurnameClick(char)}
                          title={`点击查看 ${char} 姓详情`}
                        >
                          {char}
                        </span>
                      );
                    }
                    return char;
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* 姓氏详情弹窗 */}
      {selectedSurname && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSurname(null)}
        >
          <Card 
            variant="cultural"
            className="max-w-md w-full shadow-cultural-xl border-2 border-cultural-gold/50"
            onClick={(e?: React.MouseEvent) => e?.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cultural-red to-cultural-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-cultural">
                <span className="text-3xl font-bold text-white font-heading">
                  {selectedSurname.surname}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-cultural-ink font-heading mb-4">
                {selectedSurname.surname}姓
              </h3>
              
              <div className="bg-cultural-paper/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center text-cultural-jade mb-2">
                  <span className="mr-2">🏛️</span>
                  <span className="font-medium">籍贯郡望</span>
                </div>
                <p className="text-cultural-ink font-heading text-lg">
                  {selectedSurname.place}
                </p>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                了解更多姓氏历史渊源和地理分布，传承中华姓氏文化
              </p>
              
              <div className="flex space-x-3">
                <Button 
                  variant="secondary"
                  onClick={() => setSelectedSurname(null)}
                  className="flex-1"
                >
                  关闭
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => {
                    setSearchTerm(selectedSurname.surname);
                    setSelectedSurname(null);
                  }}
                  className="flex-1"
                >
                  查看更多
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 姓氏列表 */}
      <Card variant="cultural" className="shadow-cultural-lg">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-cultural-ink font-heading mb-4">姓氏详解</h2>
            <p className="text-cultural-gold font-medium">探索中华姓氏的历史渊源</p>
          </div>
          
          {filteredOrigins.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredOrigins.map((item, index) => (
                <Card 
                  key={index}
                  hover
                  className="text-center p-6 bg-gradient-to-br from-white to-cultural-paper/30 border-2 border-cultural-gold/30 hover:border-cultural-gold/60 shadow-cultural hover:shadow-cultural-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedSurname(item)}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cultural-red to-cultural-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-cultural group-hover:shadow-cultural-lg transition-all duration-300 group-hover:scale-110">
                    <span className="text-2xl font-bold text-white font-heading">
                      {item.surname}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-cultural-ink font-heading mb-3 group-hover:text-cultural-red transition-colors duration-300">
                    {item.surname}姓
                  </h3>
                  
                  <div className="bg-cultural-paper/50 rounded-lg p-3 border border-cultural-gold/20">
                    <div className="flex items-center justify-center text-cultural-jade text-sm mb-1">
                      <span className="mr-1">🏛️</span>
                      <span className="font-medium">郡望</span>
                    </div>
                    <p className="text-cultural-ink font-medium">
                      {item.place}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-cultural-ink mb-4 font-heading">未找到相关姓氏</h3>
              <p className="text-gray-600 mb-6">请尝试其他搜索词或浏览全部姓氏</p>
              <Button 
                variant="secondary" 
                onClick={() => setSearchTerm('')}
              >
                查看全部姓氏
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* 文化价值 */}
      <Card variant="cultural" className="mt-8 shadow-cultural-lg">
        <div className="p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cultural-ink font-heading mb-4">百家姓的文化价值</h2>
            <p className="text-cultural-gold font-medium">传承千年文化，弘扬姓氏之美</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="text-center p-8 bg-gradient-to-br from-white to-cultural-paper/30 border-2 border-cultural-jade/30 hover:border-cultural-jade/50 shadow-cultural hover:shadow-cultural-lg transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cultural-jade to-cultural-gold rounded-full flex items-center justify-center shadow-cultural">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-cultural-ink mb-4 font-heading">启蒙教育</h3>
              <p className="text-gray-600 leading-relaxed">
                作为古代幼学读物，帮助儿童认识汉字、了解姓氏，是传统文化启蒙的重要载体。
              </p>
            </Card>
            
            <Card hover className="text-center p-8 bg-gradient-to-br from-white to-cultural-paper/30 border-2 border-cultural-gold/30 hover:border-cultural-gold/50 shadow-cultural hover:shadow-cultural-lg transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cultural-gold to-cultural-red rounded-full flex items-center justify-center shadow-cultural">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-cultural-ink mb-4 font-heading">地理文化</h3>
              <p className="text-gray-600 leading-relaxed">
                记录了各姓氏的地理分布和历史迁徙，反映了中华民族的历史变迁和文化融合。
              </p>
            </Card>
            
            <Card hover className="text-center p-8 bg-gradient-to-br from-white to-cultural-paper/30 border-2 border-cultural-red/30 hover:border-cultural-red/50 shadow-cultural hover:shadow-cultural-lg transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cultural-red to-cultural-jade rounded-full flex items-center justify-center shadow-cultural">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-bold text-cultural-ink mb-4 font-heading">血脉传承</h3>
              <p className="text-gray-600 leading-relaxed">
                承载着家族血脉和文化传承，是中华民族凝聚力和认同感的重要源泉。
              </p>
            </Card>
          </div>
        </div>
      </Card>

      {/* 取名联系 */}
      <Card variant="cultural" className="mt-8 shadow-cultural-lg">
        <div className="p-8 text-center">
          <h2 className="text-3xl font-bold text-cultural-ink font-heading mb-8">百家姓与取名</h2>
          <div className="bg-gradient-to-r from-cultural-paper to-cultural-gold/10 rounded-2xl p-8 border-2 border-cultural-gold/30">
            <p className="text-lg text-cultural-ink mb-8 leading-relaxed font-medium">
              了解姓氏的历史渊源和文化内涵，有助于为宝宝起一个既符合传统文化又富有时代特色的好名字。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="text-left bg-white/50 rounded-xl p-6 border border-cultural-jade/30">
                <h4 className="font-bold text-cultural-jade mb-4 text-lg font-heading flex items-center">
                  <span className="mr-2">🏛️</span>
                  姓氏文化考量
                </h4>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-center"><span className="mr-2">•</span>了解姓氏历史渊源</li>
                  <li className="flex items-center"><span className="mr-2">•</span>考虑地域文化特色</li>
                  <li className="flex items-center"><span className="mr-2">•</span>传承家族文化传统</li>
                </ul>
              </div>
              
              <div className="text-left bg-white/50 rounded-xl p-6 border border-cultural-gold/30">
                <h4 className="font-bold text-cultural-gold mb-4 text-lg font-heading flex items-center">
                  <span className="mr-2">✨</span>
                  现代取名融合
                </h4>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-center"><span className="mr-2">•</span>结合传统与现代审美</li>
                  <li className="flex items-center"><span className="mr-2">•</span>注重音韵搭配协调</li>
                  <li className="flex items-center"><span className="mr-2">•</span>寓意美好吉祥如意</li>
                </ul>
              </div>
            </div>
            
            <Link href="/">
              <Button variant="primary" size="lg" className="shadow-cultural-lg">
                开始为宝宝取名 →
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </CulturalTreasureTemplate>
  );
};

export default BaijiaxingPage;
