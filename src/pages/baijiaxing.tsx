import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { CulturalTreasureTemplate } from '@/components/Layout';
import { Button, Card, Input } from '@/components/ui';

interface BaijiaxingOrigin {
  surname: string;
  place: string;
}

interface BaijiaxingData {
  title: string;
  author: string;
  tags: string;
  paragraphs: string[];
  origin: BaijiaxingOrigin[];
}

const BaijiaxingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurname, setSelectedSurname] = useState<BaijiaxingOrigin | null>(null);
  const [baijiaxingData, setBaijiaxingData] = useState<BaijiaxingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'original'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'common' | 'rare'>('all');

  // 加载真实的百家姓数据
  useEffect(() => {
    const loadBaijiaxingData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/names/baijiaxing.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBaijiaxingData(data);
        setError(null);
      } catch (err) {
        console.error('加载百家姓数据失败:', err);
        setError('加载数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    loadBaijiaxingData();
  }, []);

  // 常见姓氏列表
  const commonSurnames = [
    '李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
    '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
    '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧'
  ];

  // 从paragraphs中提取所有姓氏
  const allSurnames = useMemo(() => {
    if (!baijiaxingData) return [];
    
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
  }, [baijiaxingData]);

  // 搜索和分类过滤
  const filteredOrigins = useMemo(() => {
    if (!baijiaxingData) return [];
    
    let filtered = baijiaxingData.origin;
    
    // 分类过滤
    if (selectedCategory === 'common') {
      filtered = filtered.filter(item => commonSurnames.includes(item.surname));
    } else if (selectedCategory === 'rare') {
      filtered = filtered.filter(item => !commonSurnames.includes(item.surname));
    }
    
    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.surname.includes(searchTerm) || 
        item.place.includes(searchTerm)
      );
    }
    
    return filtered;
  }, [searchTerm, baijiaxingData, selectedCategory]);

  const handleSurnameClick = (surname: string) => {
    if (!baijiaxingData) return;
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
    { label: '详细释义', value: baijiaxingData?.origin.length || 0, icon: '📖' },
    { label: '成书时期', value: '北宋', icon: '📅' },
    { label: '文化价值', value: '千年', icon: '🏛️' }
  ];

  // 加载状态
  if (loading) {
    return (
      <CulturalTreasureTemplate
        title="百家姓科普 - 中华姓氏文化传承"
        description="探索中华姓氏文化，了解百家姓的历史渊源和地理分布，传承千年文化智慧"
        pageTitle="百家姓"
        pageSubtitle="正在加载数据..."
        icon="📜"
        breadcrumbs={breadcrumbs}
        stats={[]}
      >
        <Card variant="cultural" className="text-center py-20">
          <div className="animate-pulse">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-cultural-ink mb-4 font-heading">正在加载百家姓数据</h3>
            <p className="text-gray-600">请稍候，正在获取完整的姓氏信息...</p>
            <div className="mt-6 flex justify-center">
              <div className="w-8 h-8 border-4 border-cultural-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </Card>
      </CulturalTreasureTemplate>
    );
  }

  // 错误状态
  if (error) {
    return (
      <CulturalTreasureTemplate
        title="百家姓科普 - 中华姓氏文化传承"
        description="探索中华姓氏文化，了解百家姓的历史渊源和地理分布，传承千年文化智慧"
        pageTitle="百家姓"
        pageSubtitle="数据加载失败"
        icon="📜"
        breadcrumbs={breadcrumbs}
        stats={[]}
      >
        <Card variant="cultural" className="text-center py-20">
          <div className="text-6xl mb-6">❌</div>
          <h3 className="text-2xl font-bold text-cultural-ink mb-4 font-heading">数据加载失败</h3>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button 
            variant="primary" 
            onClick={() => window.location.reload()}
            className="px-8 py-3"
          >
            重新加载
          </Button>
        </Card>
      </CulturalTreasureTemplate>
    );
  }

  // 数据未加载完成
  if (!baijiaxingData) {
    return (
      <CulturalTreasureTemplate
        title="百家姓科普 - 中华姓氏文化传承"
        description="探索中华姓氏文化，了解百家姓的历史渊源和地理分布，传承千年文化智慧"
        pageTitle="百家姓"
        pageSubtitle="数据准备中..."
        icon="📜"
        breadcrumbs={breadcrumbs}
        stats={[]}
      >
        <Card variant="cultural" className="text-center py-20">
          <div className="text-6xl mb-6">⏳</div>
          <h3 className="text-2xl font-bold text-cultural-ink mb-4 font-heading">数据准备中</h3>
          <p className="text-gray-600">正在准备百家姓数据，请稍候...</p>
        </Card>
      </CulturalTreasureTemplate>
    );
  }

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
      {/* 控制面板 */}
      <Card variant="cultural" className="mb-8 shadow-cultural-lg">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* 搜索框 */}
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="搜索姓氏或郡望..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* 分类筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-cultural-ink">分类：</span>
              <div className="flex space-x-1">
                {[
                  { key: 'all', label: '全部', count: baijiaxingData.origin.length },
                  { key: 'common', label: '常见', count: baijiaxingData.origin.filter(item => commonSurnames.includes(item.surname)).length },
                  { key: 'rare', label: '罕见', count: baijiaxingData.origin.filter(item => !commonSurnames.includes(item.surname)).length }
                ].map(category => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key as any)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                      selectedCategory === category.key
                        ? 'bg-cultural-gold text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.label} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* 视图模式 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-cultural-ink">视图：</span>
              <div className="flex space-x-1">
                {[
                  { key: 'grid', label: '网格', icon: '⊞' },
                  { key: 'list', label: '列表', icon: '☰' },
                  { key: 'original', label: '原文', icon: '📜' }
                ].map(mode => (
                  <button
                    key={mode.key}
                    onClick={() => setViewMode(mode.key as any)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 flex items-center space-x-1 ${
                      viewMode === mode.key
                        ? 'bg-cultural-jade text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{mode.icon}</span>
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 搜索结果统计 */}
          {searchTerm && (
            <div className="mt-4 pt-4 border-t border-cultural-gold/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-cultural-jade">
                  找到 {filteredOrigins.length} 个匹配的姓氏
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                >
                  清空搜索
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 内容区域 */}
      {viewMode === 'original' && (
        <Card variant="cultural" className="mb-8 shadow-cultural-lg">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-cultural-ink font-heading mb-4">百家姓原文</h2>
              <p className="text-cultural-gold font-medium">点击姓氏查看详细信息</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {baijiaxingData.paragraphs.slice(0, 12).map((paragraph, index) => (
                  <Card 
                    key={index}
                    variant="bordered"
                    className="text-center p-6 bg-gradient-to-br from-cultural-paper to-white border border-cultural-gold/30 hover:border-cultural-gold/50 transition-all duration-300"
                  >
                    <div className="text-2xl font-heading text-cultural-ink leading-relaxed">
                      {paragraph.split('').map((char, charIndex) => {
                        if (char === '，' || char === '。') {
                          return <span key={charIndex} className="text-cultural-gold mx-1">{char}</span>;
                        }
                        if (char && char !== '，' && char !== '。') {
                          return (
                            <span 
                              key={charIndex}
                              className="cursor-pointer hover:text-cultural-red hover:bg-cultural-paper rounded-lg px-1 py-0.5 mx-0.5 transition-all duration-300 transform hover:scale-110 inline-block"
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
              
              {baijiaxingData.paragraphs.length > 12 && (
                <div className="text-center mt-8">
                  <p className="text-gray-600 mb-4">还有更多姓氏，请使用网格或列表视图浏览</p>
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant="secondary"
                      onClick={() => setViewMode('grid')}
                    >
                      切换到网格视图
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setViewMode('list')}
                    >
                      切换到列表视图
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {viewMode === 'grid' && (
        <Card variant="cultural" className="shadow-cultural-lg">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-cultural-ink font-heading mb-4">姓氏详解</h2>
              <p className="text-cultural-gold font-medium">探索中华姓氏的历史渊源</p>
            </div>
            
            {filteredOrigins.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {filteredOrigins.map((item, index) => (
                  <Card 
                    key={index}
                    hover
                    className="text-center p-4 bg-gradient-to-br from-white to-cultural-paper/30 border border-cultural-gold/30 hover:border-cultural-gold/60 shadow-sm hover:shadow-cultural transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedSurname(item)}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-cultural-red to-cultural-gold rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                      <span className="text-lg font-bold text-white font-heading">
                        {item.surname}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-bold text-cultural-ink font-heading mb-2 group-hover:text-cultural-red transition-colors duration-300">
                      {item.surname}姓
                    </h3>
                    
                    <div className="bg-cultural-paper/50 rounded-lg p-2 border border-cultural-gold/20">
                      <p className="text-xs text-cultural-ink font-medium truncate" title={item.place}>
                        {item.place}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-cultural-ink mb-4 font-heading">未找到相关姓氏</h3>
                <p className="text-gray-600 mb-6">请尝试其他搜索词或调整筛选条件</p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => setSearchTerm('')}
                  >
                    清空搜索
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => setSelectedCategory('all')}
                  >
                    查看全部
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {viewMode === 'list' && (
        <Card variant="cultural" className="shadow-cultural-lg">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-cultural-ink font-heading mb-4">姓氏列表</h2>
              <p className="text-cultural-gold font-medium">按字母顺序排列的姓氏详情</p>
            </div>
            
            {filteredOrigins.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredOrigins.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-cultural-paper/30 border border-cultural-gold/20 rounded-lg hover:border-cultural-gold/50 hover:shadow-sm transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedSurname(item)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-cultural-red to-cultural-gold rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                        <span className="text-sm font-bold text-white font-heading">
                          {item.surname}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-cultural-ink font-heading group-hover:text-cultural-red transition-colors duration-300">
                          {item.surname}姓
                        </h3>
                        <p className="text-sm text-gray-600">
                          郡望：{item.place}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {commonSurnames.includes(item.surname) && (
                        <span className="px-2 py-1 bg-cultural-jade/20 text-cultural-jade text-xs rounded-full">
                          常见
                        </span>
                      )}
                      <svg className="w-4 h-4 text-cultural-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">📋</div>
                <h3 className="text-2xl font-bold text-cultural-ink mb-4 font-heading">列表为空</h3>
                <p className="text-gray-600 mb-6">当前筛选条件下没有找到匹配的姓氏</p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => setSearchTerm('')}
                  >
                    清空搜索
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => setSelectedCategory('all')}
                  >
                    查看全部
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 姓氏详情弹窗 */}
      {selectedSurname && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSurname(null)}
        >
          <Card 
            variant="cultural"
            className="max-w-md w-full shadow-2xl border-2 border-cultural-gold/50 transform transition-all duration-300 scale-100"
            onClick={(e?: React.MouseEvent) => e?.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cultural-red to-cultural-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white font-heading">
                  {selectedSurname.surname}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-cultural-ink font-heading mb-6">
                {selectedSurname.surname}姓
              </h3>
              
              <div className="bg-cultural-paper/50 rounded-xl p-6 mb-6 border border-cultural-gold/30">
                <div className="flex items-center justify-center text-cultural-jade mb-3">
                  <span className="mr-2 text-xl">🏛️</span>
                  <span className="font-medium text-lg">历史郡望</span>
                </div>
                <p className="text-cultural-ink font-heading text-xl font-bold">
                  {selectedSurname.place}
                </p>
              </div>
              
              {commonSurnames.includes(selectedSurname.surname) && (
                <div className="mb-6">
                  <span className="inline-flex items-center px-4 py-2 bg-cultural-jade/20 text-cultural-jade rounded-full text-sm font-medium">
                    <span className="mr-2">⭐</span>
                    常见姓氏
                  </span>
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-8 leading-relaxed">
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

      {/* 文化价值介绍 */}
      <Card variant="cultural" className="mt-8 shadow-cultural-lg">
        <div className="p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cultural-ink font-heading mb-4">百家姓的文化价值</h2>
            <p className="text-cultural-gold font-medium">传承千年文化，弘扬姓氏之美</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="text-center p-8 bg-gradient-to-br from-white to-cultural-paper/30 border border-cultural-jade/30 hover:border-cultural-jade/50 shadow-sm hover:shadow-cultural transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-cultural-jade to-cultural-gold rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-cultural-ink mb-4 font-heading">启蒙教育</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                作为古代幼学读物，帮助儿童认识汉字、了解姓氏，是传统文化启蒙的重要载体。
              </p>
            </Card>
            
            <Card hover className="text-center p-8 bg-gradient-to-br from-white to-cultural-paper/30 border border-cultural-gold/30 hover:border-cultural-gold/50 shadow-sm hover:shadow-cultural transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-cultural-gold to-cultural-red rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-cultural-ink mb-4 font-heading">地理文化</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                记录了各姓氏的地理分布和历史迁徙，反映了中华民族的历史变迁和文化融合。
              </p>
            </Card>
            
            <Card hover className="text-center p-8 bg-gradient-to-br from-white to-cultural-paper/30 border border-cultural-red/30 hover:border-cultural-red/50 shadow-sm hover:shadow-cultural transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-cultural-red to-cultural-jade rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-bold text-cultural-ink mb-4 font-heading">血脉传承</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
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
          <div className="bg-gradient-to-r from-cultural-paper to-cultural-gold/10 rounded-2xl p-8 border border-cultural-gold/30">
            <p className="text-lg text-cultural-ink mb-8 leading-relaxed font-medium">
              了解姓氏的历史渊源和文化内涵，有助于为宝宝起一个既符合传统文化又富有时代特色的好名字。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="text-left bg-white/50 rounded-xl p-6 border border-cultural-jade/30">
                <h4 className="font-bold text-cultural-jade mb-4 text-lg font-heading flex items-center">
                  <span className="mr-2">🏛️</span>
                  姓氏文化考量
                </h4>
                <ul className="text-gray-700 space-y-2 text-sm">
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
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li className="flex items-center"><span className="mr-2">•</span>结合传统与现代审美</li>
                  <li className="flex items-center"><span className="mr-2">•</span>注重音韵搭配协调</li>
                  <li className="flex items-center"><span className="mr-2">•</span>寓意美好吉祥如意</li>
                </ul>
              </div>
            </div>
            
            <Link href="/">
              <Button variant="primary" size="lg" className="shadow-lg px-8 py-3">
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