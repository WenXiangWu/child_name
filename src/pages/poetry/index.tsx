import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">正在加载诗词数据...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>诗词浏览 - 传统文化典籍</title>
        <meta name="description" content="浏览收录的古典诗词，包括诗经、楚辞、唐诗、宋词等经典文学作品" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* 导航栏 */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-indigo-600 hover:text-indigo-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                返回主页
              </Link>
              
              <div className="flex items-center space-x-4">
                <Link href="/culture/overview" className="text-gray-600 hover:text-gray-800">
                  文化科普
                </Link>
                <Link href="/naming" className="text-gray-600 hover:text-gray-800">
                  专业取名
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* 头部区域 */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 诗词典籍</h1>
              <p className="text-lg text-gray-600">探索中华传统文化的瑰宝</p>
              {stats && (
                <div className="mt-4 flex justify-center items-center space-x-6 text-sm text-gray-500">
                  <span>📖 总收录: {stats.totalCount.toLocaleString()} 篇</span>
                  <span>📂 分类: {Object.keys(POETRY_CATEGORIES).length} 种</span>
                  <span>🔍 支持全文搜索</span>
                </div>
              )}
            </div>

            {/* 搜索框 */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="搜索诗词内容、标题、作者..."
                  className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 分类筛选 */}
            {!isSearchMode && (
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  全部 ({stats?.totalCount || 0})
                </button>
                {Object.values(POETRY_CATEGORIES).map((category) => (
                  <button
                    key={category.key}
                    onClick={() => handleCategoryChange(category.key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      selectedCategory === category.key
                        ? `${category.color} text-white`
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-sm opacity-75">
                      ({stats?.categoryStats[category.key] || 0})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {isSearchMode ? (
            /* 搜索结果 */
            <div>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  搜索结果 "{searchKeyword}"
                </h2>
                <p className="text-gray-600">找到 {searchResults.length} 篇相关诗词</p>
              </div>

              {searchResults.length > 0 ? (
                                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {searchResults.map((result, index) => (
                      <Link
                        key={`search-${result.item.id}-${index}`}
                        href={`/poetry/${result.item.id}`}
                        className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] p-6"
                      >
                        <div className="flex items-center mb-4">
                          <span className={`w-3 h-3 rounded-full ${POETRY_CATEGORIES[result.item.category].color} mr-3`}></span>
                          <span className="text-sm text-gray-500">{POETRY_CATEGORIES[result.item.category].name}</span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {highlightText(result.item.title, searchKeyword)}
                        </h3>
                        
                        {result.item.author && (
                          <p className="text-sm text-gray-600 mb-3">
                            {highlightText(`${result.item.author} • ${result.item.dynasty}`, searchKeyword)}
                          </p>
                        )}

                        <div className="space-y-2">
                          {result.matchedContent.slice(0, 3).map((match, idx) => (
                            <p key={idx} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                              {highlightText(match, searchKeyword)}
                            </p>
                          ))}
                        </div>

                        <div className="mt-4 text-right">
                          <span className="text-sm text-indigo-600 font-medium">查看详情 →</span>
                        </div>
                      </Link>
                    ))}
                  </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">未找到相关诗词</h3>
                  <p className="text-gray-600">尝试使用其他关键词搜索</p>
                </div>
              )}
            </div>
          ) : (
            /* 分类浏览 */
            <div>
              {selectedCategory !== 'all' && (
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center space-x-3 bg-white rounded-lg p-6 shadow-md">
                    <span className="text-4xl">{POETRY_CATEGORIES[selectedCategory].icon}</span>
                    <div className="text-left">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {POETRY_CATEGORIES[selectedCategory].name}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {POETRY_CATEGORIES[selectedCategory].description}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {POETRY_CATEGORIES[selectedCategory].dynasty} • 
                        共 {stats?.categoryStats[selectedCategory] || 0} 篇
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {displayedPoetry.length > 0 ? (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayedPoetry.map((item) => (
                      <Link
                        key={item.id}
                        href={`/poetry/${item.id}`}
                        className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] p-6"
                      >
                        <div className="flex items-center mb-4">
                          <span className={`w-3 h-3 rounded-full ${POETRY_CATEGORIES[item.category].color} mr-3`}></span>
                          <span className="text-sm text-gray-500">{POETRY_CATEGORIES[item.category].name}</span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h3>
                        
                        {item.author && (
                          <p className="text-sm text-gray-600 mb-3">
                            {item.author} • {item.dynasty}
                          </p>
                        )}

                        {/* 诗经特有信息 */}
                        {item.chapter && item.section && (
                          <p className="text-xs text-blue-600 mb-2">
                            {item.chapter} • {item.section}
                          </p>
                        )}

                        {/* 宋词词牌名 */}
                        {item.rhythmic && (
                          <p className="text-xs text-green-600 mb-2">
                            词牌：{item.rhythmic}
                          </p>
                        )}

                        <div className="text-gray-700 leading-relaxed">
                          <p className="line-clamp-4">
                            {item.content.length > 120 ? 
                              `${item.content.substring(0, 120)}...` : 
                              item.content
                            }
                          </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {item.characterCount || item.content.length} 字 • {item.lineCount || 1} 句
                          </span>
                          <span className="text-sm text-indigo-600 font-medium">查看详情 →</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* 分页 */}
                  {getTotalPages() > 1 && (
                    <div className="mt-12 flex justify-center">
                      <nav className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-2 rounded-md ${
                            currentPage === 1
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          上一页
                        </button>
                        
                        {[...Array(Math.min(getTotalPages(), 10))].map((_, index) => {
                          const page = index + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 rounded-md ${
                                currentPage === page
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === getTotalPages()}
                          className={`px-3 py-2 rounded-md ${
                            currentPage === getTotalPages()
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          下一页
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无诗词数据</h3>
                  <p className="text-gray-600">请检查数据文件是否正确加载</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部信息 */}
        <div className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            <p className="text-gray-600">
              传承中华文化 • 弘扬诗词之美 • 让古典诗词在新时代焕发光彩
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PoetryBrowserPage;