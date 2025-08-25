import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { CulturalTreasureTemplate } from '@/components/Layout';
import { Button, Card } from '@/components/ui';
import { PoetryItem, PoetryCategory, PoetrySearchResult, PoetryStats, POETRY_CATEGORIES } from '../../types/poetry';
import poetryService from '../../services/poetryService';

const PoetryBrowserPage: NextPage = () => {
  const [allPoetry, setAllPoetry] = useState<PoetryItem[]>([]);
  const [displayedPoetry, setDisplayedPoetry] = useState<PoetryItem[]>([]);
  const [searchResults, setSearchResults] = useState<PoetrySearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PoetryCategory | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [stats, setStats] = useState<PoetryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 重置缓存以加载最新配置
        poetryService.resetCache();
        
        const [poetry, poetryStats] = await Promise.all([
          poetryService.getAllPoetry(),
          poetryService.getStats()
        ]);
        setAllPoetry(poetry);
        setDisplayedPoetry(poetry.slice(0, itemsPerPage));
        setStats(poetryStats);
      } catch (error) {
        console.error('Error loading poetry data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 分类筛选
  useEffect(() => {
    if (selectedCategory === 'all') {
      const filtered = allPoetry.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      setDisplayedPoetry(filtered);
    } else {
      const filtered = allPoetry.filter(item => item.category === selectedCategory);
      const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      setDisplayedPoetry(paginated);
    }
  }, [selectedCategory, allPoetry, currentPage]);

  // 搜索功能
  const handleSearch = async (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(1);
    
    if (!keyword.trim()) {
      setIsSearchMode(false);
      setSearchResults([]);
      return;
    }

    setIsSearchMode(true);
    try {
      const results = await poetryService.searchPoetry(keyword);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // 高亮搜索关键词
  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;
    
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === keyword.toLowerCase() ? 
        <span key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">{part}</span> : 
        part
    );
  };

  // 切换分类
  const handleCategoryChange = (category: PoetryCategory | 'all') => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setIsSearchMode(false);
    setSearchKeyword('');
  };

  // 分页处理
  const getTotalPages = () => {
    if (selectedCategory === 'all') {
      return Math.ceil(allPoetry.length / itemsPerPage);
    } else {
      const filtered = allPoetry.filter(item => item.category === selectedCategory);
      return Math.ceil(filtered.length / itemsPerPage);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <CulturalTreasureTemplate
        title="诗词典籍 - 传统文化典籍"
        description="正在加载诗词数据，请稍候..."
        pageTitle="诗词典籍"
        pageSubtitle="加载中..."
        icon="📚"
      >
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cultural-gold border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-xl text-cultural-ink font-heading">正在加载诗词数据...</p>
            <p className="text-sm text-gray-600 mt-2">传承千年文化，品味诗词之美</p>
          </div>
        </div>
      </CulturalTreasureTemplate>
    );
  }



  const statsData = stats ? [
    { label: '总收录', value: stats.totalCount, icon: '📖' },
    { label: '分类数', value: Object.keys(POETRY_CATEGORIES).length, icon: '📂' },
    { label: '支持搜索', value: '全文', icon: '🔍' },
    { label: '文化传承', value: '千年', icon: '🏛️' }
  ] : [];

  return (
    <CulturalTreasureTemplate
      title="诗词典籍 - 传统文化典籍"
      description="探索中华传统文化的瑰宝，浏览收录的古典诗词，包括诗经、楚辞、唐诗、宋词等经典文学作品"
      pageTitle="诗词典籍"
      pageSubtitle="探索中华传统文化的瑰宝"
      icon="📚"

      stats={statsData}
    >
        {/* 搜索和筛选区域 */}
        <Card variant="cultural" className="mb-8 shadow-cultural-lg">
          <div className="p-8">
            {/* 搜索框 */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="搜索诗词内容、标题、作者..."
                  className="w-full px-6 py-4 pl-14 text-lg border-2 border-cultural-gold/30 rounded-2xl focus:ring-4 focus:ring-cultural-gold/20 focus:border-cultural-gold transition-all duration-300 bg-white/90 backdrop-blur-sm font-heading"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-cultural-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchKeyword && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-cultural-red hover:text-cultural-red/80 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* 分类筛选 */}
            {!isSearchMode && (
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`px-6 py-3 rounded-xl font-medium font-heading transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-cultural-red to-cultural-gold text-white shadow-cultural'
                      : 'bg-white/80 text-cultural-ink hover:bg-cultural-paper border-2 border-cultural-gold/30 hover:border-cultural-gold/50'
                  }`}
                >
                  全部 ({stats?.totalCount || 0})
                </button>
                {Object.values(POETRY_CATEGORIES).map((category) => (
                  <button
                    key={category.key}
                    onClick={() => handleCategoryChange(category.key)}
                    className={`px-6 py-3 rounded-xl font-medium font-heading transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
                      selectedCategory === category.key
                        ? `bg-gradient-to-r from-cultural-jade to-cultural-gold text-white shadow-cultural`
                        : 'bg-white/80 text-cultural-ink hover:bg-cultural-paper border-2 border-cultural-gold/30 hover:border-cultural-gold/50'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-sm opacity-75 bg-white/20 px-2 py-1 rounded-full">
                      {stats?.categoryStats[category.key] || 0}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* 主要内容区域 */}
        {isSearchMode ? (
          /* 搜索结果 */
          <div>
            <Card variant="cultural" className="mb-8 text-center shadow-cultural">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-cultural-ink font-heading mb-2">
                  搜索结果 "{searchKeyword}"
                </h2>
                <p className="text-cultural-gold font-medium">找到 {searchResults.length} 篇相关诗词</p>
              </div>
            </Card>

            {searchResults.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((result, index) => (
                  <Link
                    key={`search-${result.item.id}-${index}`}
                    href={`/poetry/${result.item.id}`}
                    className="block group"
                  >
                    <Card 
                      hover
                      className="h-full bg-gradient-to-br from-white to-cultural-paper/30 border-2 border-cultural-gold/20 group-hover:border-cultural-gold/50 shadow-cultural group-hover:shadow-cultural-lg transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <span className={`w-4 h-4 rounded-full ${POETRY_CATEGORIES[result.item.category].color} mr-3 shadow-sm`}></span>
                          <span className="text-sm text-cultural-jade font-medium">{POETRY_CATEGORIES[result.item.category].name}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-cultural-ink mb-3 font-heading group-hover:text-cultural-red transition-colors duration-300">
                          {highlightText(result.item.title, searchKeyword)}
                        </h3>
                        
                        {result.item.author && (
                          <p className="text-sm text-gray-600 mb-4 font-medium">
                            {highlightText(`${result.item.author} • ${result.item.dynasty}`, searchKeyword)}
                          </p>
                        )}

                        <div className="space-y-3 mb-4">
                          {result.matchedContent.slice(0, 3).map((match, idx) => (
                            <p key={idx} className="text-sm text-gray-700 bg-cultural-paper/50 p-3 rounded-lg border border-cultural-gold/20">
                              {highlightText(match, searchKeyword)}
                            </p>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-cultural-gold/20">
                          <span className="text-xs text-gray-500">
                            {result.item.characterCount || result.item.content.length} 字
                          </span>
                          <span className="text-sm text-cultural-gold font-medium group-hover:text-cultural-red transition-colors duration-300">
                            查看详情 →
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card variant="cultural" className="text-center py-16 shadow-cultural">
                <div className="text-8xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-cultural-ink mb-4 font-heading">未找到相关诗词</h3>
                <p className="text-gray-600 mb-6">尝试使用其他关键词搜索，或浏览分类内容</p>
                <Button 
                  variant="secondary" 
                  onClick={() => handleSearch('')}
                >
                  清空搜索
                </Button>
              </Card>
            )}
          </div>
        ) : (
          /* 分类浏览 */
          <div>
            {selectedCategory !== 'all' && (
              <Card variant="cultural" className="mb-8 shadow-cultural-lg">
                <div className="p-8 text-center">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <span className="text-6xl animate-bounce-gentle">{POETRY_CATEGORIES[selectedCategory].icon}</span>
                    <div className="text-left">
                      <h2 className="text-3xl font-bold text-cultural-ink font-heading">
                        {POETRY_CATEGORIES[selectedCategory].name}
                      </h2>
                      <p className="text-cultural-gold font-medium mt-2">
                        {POETRY_CATEGORIES[selectedCategory].description}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 flex items-center">
                        <span className="mr-2">📅</span>
                        {POETRY_CATEGORIES[selectedCategory].dynasty} • 
                        共 {stats?.categoryStats[selectedCategory] || 0} 篇
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {displayedPoetry.length > 0 ? (
              <>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {displayedPoetry.map((item) => (
                    <Link
                      key={item.id}
                      href={`/poetry/${item.id}`}
                      className="block group"
                    >
                      <Card 
                        hover
                        className="h-full bg-gradient-to-br from-white to-cultural-paper/30 border-2 border-cultural-gold/20 group-hover:border-cultural-gold/50 shadow-cultural group-hover:shadow-cultural-lg transition-all duration-300"
                      >
                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            <span className={`w-4 h-4 rounded-full ${POETRY_CATEGORIES[item.category].color} mr-3 shadow-sm`}></span>
                            <span className="text-sm text-cultural-jade font-medium">{POETRY_CATEGORIES[item.category].name}</span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-cultural-ink mb-3 font-heading group-hover:text-cultural-red transition-colors duration-300">
                            {item.title}
                          </h3>
                          
                          {item.author && (
                            <p className="text-sm text-gray-600 mb-3 font-medium">
                              {item.author} • {item.dynasty}
                            </p>
                          )}

                          {/* 诗经特有信息 */}
                          {item.chapter && item.section && (
                            <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-xs text-blue-700 font-medium">
                                📖 {item.chapter} • {item.section}
                              </p>
                            </div>
                          )}

                          {/* 宋词词牌名 */}
                          {item.rhythmic && (
                            <div className="mb-3 p-2 bg-green-50 rounded-lg border border-green-200">
                              <p className="text-xs text-green-700 font-medium">
                                🎵 词牌：{item.rhythmic}
                              </p>
                            </div>
                          )}

                          <div className="text-gray-700 leading-relaxed mb-4">
                            <p className="line-clamp-4 font-body">
                              {item.content.length > 120 ? 
                                `${item.content.substring(0, 120)}...` : 
                                item.content
                              }
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-cultural-gold/20">
                            <span className="text-xs text-gray-500 flex items-center space-x-2">
                              <span>📝 {item.characterCount || item.content.length} 字</span>
                              <span>•</span>
                              <span>📄 {item.lineCount || 1} 句</span>
                            </span>
                            <span className="text-sm text-cultural-gold font-medium group-hover:text-cultural-red transition-colors duration-300">
                              查看详情 →
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* 分页 */}
                {getTotalPages() > 1 && (
                  <Card variant="cultural" className="mt-12 shadow-cultural">
                    <div className="p-6">
                      <nav className="flex items-center justify-center space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          上一页
                        </Button>
                        
                        <div className="flex items-center space-x-1">
                          {[...Array(Math.min(getTotalPages(), 10))].map((_, index) => {
                            const page = index + 1;
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                  currentPage === page
                                    ? 'bg-gradient-to-r from-cultural-red to-cultural-gold text-white shadow-cultural'
                                    : 'text-cultural-ink hover:bg-cultural-paper border border-cultural-gold/30 hover:border-cultural-gold/50'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </div>
                        
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === getTotalPages()}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          下一页
                        </Button>
                      </nav>
                      
                      <div className="text-center mt-4 text-sm text-gray-600">
                        第 {currentPage} 页，共 {getTotalPages()} 页
                      </div>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <Card variant="cultural" className="text-center py-20 shadow-cultural">
                <div className="text-8xl mb-6">📚</div>
                <h3 className="text-2xl font-bold text-cultural-ink mb-4 font-heading">暂无诗词数据</h3>
                <p className="text-gray-600 mb-6">请检查数据文件是否正确加载，或尝试其他分类</p>
                <Button 
                  variant="primary" 
                  onClick={() => window.location.reload()}
                >
                  重新加载
                </Button>
              </Card>
            )}
          </div>
        )}
    </CulturalTreasureTemplate>
  );
};

export default PoetryBrowserPage;