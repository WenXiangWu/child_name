import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui';

interface CulturalTreasureTemplateProps {
  children: React.ReactNode;
  title: string;
  description: string;
  pageTitle: string;
  pageSubtitle?: string;
  icon?: string;
  breadcrumbs?: Array<{
    label: string;
    href: string;
  }>;
  stats?: Array<{
    label: string;
    value: string | number;
    icon?: string;
  }>;
  headerActions?: React.ReactNode;
  showBackToHome?: boolean;
}

const CulturalTreasureTemplate: React.FC<CulturalTreasureTemplateProps> = ({
  children,
  title,
  description,
  pageTitle,
  pageSubtitle,
  icon = '📚',
  breadcrumbs = [],
  stats = [],
  headerActions,
  showBackToHome = true
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cultural-paper via-white to-cultural-jade-50 relative overflow-hidden">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="传统文化,典籍宝库,诗词,百家姓,规范汉字,文化传承" />
      </Head>

      {/* 背景装饰元素 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-cultural-gold/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-cultural-jade/10 rotate-45 animate-bounce-gentle"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-cultural-red/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 border border-cultural-gold/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-cultural-jade/5 rounded-full"></div>
      </div>

      {/* 导航栏 */}
      <nav className="relative z-20 bg-gradient-to-r from-white via-cultural-paper to-white shadow-cultural border-b-2 border-cultural-gold/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-cultural-red to-cultural-gold rounded-full flex items-center justify-center shadow-cultural group-hover:shadow-cultural-lg transition-all duration-300">
                  <span className="text-white text-lg font-bold font-heading">名</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-cultural-ink font-heading group-hover:text-cultural-red transition-colors duration-300">
                    宝宝取名专家
                  </h1>
                  <span className="text-xs text-cultural-gold font-medium">典籍宝库</span>
                </div>
              </Link>
              
              {/* 面包屑导航 */}
              {breadcrumbs.length > 0 && (
                <div className="hidden md:flex items-center space-x-2 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                      {index > 0 && (
                        <svg className="w-4 h-4 text-cultural-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                      <Link
                        href={crumb.href}
                        className="text-cultural-ink hover:text-cultural-red transition-colors duration-300 font-medium"
                      >
                        {crumb.label}
                      </Link>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {headerActions}
              {showBackToHome && (
                <Link href="/">
                  <Button variant="secondary" size="sm">
                    返回首页
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 页面头部 */}
      <section className="relative z-10 py-16 bg-gradient-to-r from-cultural-red/5 via-cultural-gold/5 to-cultural-jade/5">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {/* 装饰性顶部条纹 */}
          <div className="w-24 h-1 bg-gradient-to-r from-cultural-red via-cultural-gold to-cultural-jade mx-auto mb-8 rounded-full"></div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl mr-4 animate-bounce-gentle">{icon}</div>
            <div>
              <h1 className="text-5xl font-bold text-cultural-ink font-heading mb-2">
                {pageTitle}
              </h1>
              {pageSubtitle && (
                <p className="text-xl text-cultural-gold font-medium">{pageSubtitle}</p>
              )}
            </div>
          </div>
          
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            {description}
          </p>
          
          {/* 统计信息 */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-cultural border border-cultural-gold/20">
                  <div className="flex items-center justify-center mb-3">
                    {stat.icon && <span className="text-2xl mr-2">{stat.icon}</span>}
                    <div className="text-3xl font-bold text-cultural-red">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </div>
                  </div>
                  <div className="text-sm text-cultural-ink font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
          
          {/* 装饰性底部条纹 */}
          <div className="w-16 h-1 bg-gradient-to-r from-cultural-jade via-cultural-gold to-cultural-red mx-auto mt-8 rounded-full"></div>
        </div>
      </section>

      {/* 主要内容区域 */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="relative z-10 bg-gradient-to-r from-cultural-ink via-gray-800 to-cultural-ink text-white py-16 mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cultural-red to-cultural-gold rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">名</span>
                </div>
                <h3 className="text-xl font-bold font-heading">宝宝取名专家</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                传承中华文化智慧，为每个家庭提供专业的取名服务，让传统文化在新时代焕发光彩。
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4 text-cultural-gold">典籍宝库</h3>
              <div className="space-y-2">
                <Link href="/poetry" className="block text-gray-300 hover:text-cultural-gold text-sm transition-colors duration-300">
                  📖 诗词典籍
                </Link>
                <Link href="/baijiaxing" className="block text-gray-300 hover:text-cultural-gold text-sm transition-colors duration-300">
                  📜 百家姓谱
                </Link>
                <Link href="/standard-characters" className="block text-gray-300 hover:text-cultural-gold text-sm transition-colors duration-300">
                  🏛️ 规范汉字
                </Link>
                <Link href="/culture/lunar-calendar" className="block text-gray-300 hover:text-cultural-gold text-sm transition-colors duration-300">
                  🏮 农历万年历
                </Link>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <h3 className="text-lg font-semibold mb-4 text-cultural-jade">文化传承</h3>
              <div className="text-gray-300 text-sm space-y-2">
                <div className="flex items-center justify-center md:justify-end">
                  <span className="mr-2">🏛️</span>
                  <span>国家规范汉字标准</span>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <span className="mr-2">📚</span>
                  <span>传统文化典籍</span>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <span className="mr-2">🎨</span>
                  <span>中华美学传统</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-cultural-gold"></div>
              <span className="mx-4 text-cultural-gold">✦</span>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-cultural-gold"></div>
            </div>
            <p className="text-gray-400 text-sm">
              &copy; 2024 宝宝取名专家 · 传承文化，守护传统 · 让每个名字都有故事
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CulturalTreasureTemplate;
