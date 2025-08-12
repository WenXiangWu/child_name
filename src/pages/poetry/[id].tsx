import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { PoetryItem, POETRY_CATEGORIES } from '../../types/poetry';
import poetryService from '../../services/poetryService';

const PoetryDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [poetry, setPoetry] = useState<PoetryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载诗词详情
  useEffect(() => {
    const loadPoetryDetail = async () => {
      if (!id || typeof id !== 'string') return;

      setLoading(true);
      setError(null);

      try {
        const allPoetry = await poetryService.getAllPoetry();
        const foundPoetry = allPoetry.find(item => item.id === id);
        
        if (foundPoetry) {
          setPoetry(foundPoetry);
        } else {
          setError('未找到该诗词');
        }
      } catch (err) {
        console.error('Error loading poetry detail:', err);
        setError('加载诗词详情时出错');
      } finally {
        setLoading(false);
      }
    };

    loadPoetryDetail();
  }, [id]);

  // 格式化内容显示
  const formatContent = (contentArray: string[]) => {
    return contentArray.map((line, index) => (
      <p key={index} className="text-lg leading-relaxed mb-3 text-gray-800">
        {line}
      </p>
    ));
  };

  // 获取相关诗词推荐
  const getRelatedPoetry = async () => {
    if (!poetry) return [];
    
    const allPoetry = await poetryService.getAllPoetry();
    return allPoetry
      .filter(item => 
        item.id !== poetry.id && 
        (item.category === poetry.category || item.author === poetry.author)
      )
      .slice(0, 6);
  };

  const [relatedPoetry, setRelatedPoetry] = useState<PoetryItem[]>([]);

  useEffect(() => {
    if (poetry) {
      getRelatedPoetry().then(setRelatedPoetry);
    }
  }, [poetry]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">正在加载诗词详情...</p>
        </div>
      </div>
    );
  }

  if (error || !poetry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">诗词未找到</h1>
          <p className="text-gray-600 mb-6">{error || '请检查链接是否正确'}</p>
          <Link
            href="/poetry"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            返回诗词浏览
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = POETRY_CATEGORIES[poetry.category];

  return (
    <>
      <Head>
        <title>{poetry.title} - {poetry.author ? `${poetry.author} • ` : ''}{categoryInfo.name}</title>
        <meta name="description" content={`${poetry.title} - ${poetry.content.substring(0, 100)}...`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* 导航栏 */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  主页
                </Link>
                <span className="text-gray-300">/</span>
                <Link href="/poetry" className="text-indigo-600 hover:text-indigo-800 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  诗词浏览
                </Link>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`w-3 h-3 rounded-full ${categoryInfo.color}`}></span>
                <span className="text-sm text-gray-600">{categoryInfo.name}</span>
              </div>
            </div>
          </div>
        </nav>

        {/* 主要内容 */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* 诗词标题和信息 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{poetry.title}</h1>
              
              <div className="flex flex-wrap justify-center items-center gap-6 text-gray-600">
                {poetry.author && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium">作者：</span>
                    <span className="text-lg">{poetry.author}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <span className="text-sm font-medium">朝代：</span>
                  <span className="text-lg">{poetry.dynasty}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm font-medium">分类：</span>
                  <span className="text-lg">{categoryInfo.name}</span>
                </div>
              </div>

              {/* 诗经特有信息 */}
              {poetry.chapter && poetry.section && (
                <div className="mt-4 flex justify-center items-center gap-4 text-sm text-gray-500">
                  <span>出自：{poetry.chapter} • {poetry.section}</span>
                </div>
              )}

              {/* 宋词词牌名 */}
              {poetry.rhythmic && (
                <div className="mt-4 flex justify-center items-center text-sm text-gray-500">
                  <span>词牌：{poetry.rhythmic}</span>
                </div>
              )}
            </div>

            {/* 诗词内容 */}
            <div className="border-t pt-8">
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8">
                  {/* 蒙学类特殊展示 */}
                  {poetry.category === 'mengxue' ? (
                    <div className="space-y-3">
                      {poetry.contentArray.map((line, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <span className="text-sm text-gray-500 mt-1 w-8 text-center">
                            {index + 1}
                          </span>
                          <p className="text-lg leading-relaxed text-gray-800 flex-1 text-left">
                            {line}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* 普通诗词居中展示 */
                    <div className="text-center space-y-4">
                      {formatContent(poetry.contentArray)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 统计信息 */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex justify-center space-x-8 text-sm text-gray-500">
                <span>字数：{poetry.characterCount}</span>
                <span>句数：{poetry.lineCount}</span>
                <span>编号：{poetry.id}</span>
              </div>
            </div>
          </div>

          {/* 相关推荐 */}
          {relatedPoetry.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">相关推荐</h2>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {relatedPoetry.map((item) => (
                  <Link
                    key={item.id}
                    href={`/poetry/${item.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center mb-2">
                      <span className={`w-2 h-2 rounded-full ${POETRY_CATEGORIES[item.category].color} mr-2`}></span>
                      <span className="text-xs text-gray-500">{POETRY_CATEGORIES[item.category].name}</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    
                    {item.author && (
                      <p className="text-sm text-gray-600 mb-2">{item.author} • {item.dynasty}</p>
                    )}
                    
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {item.content.substring(0, 60)}...
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="bg-white border-t mt-16">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <p className="text-gray-600">
              传承中华文化 • 弘扬诗词之美 • 让古典诗词在新时代焕发光彩
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PoetryDetailPage;