import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface CulturalPageTemplateProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  keywords?: string;
  breadcrumbs?: BreadcrumbItem[];
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  culturalTheme?: 'confucian' | 'taoist' | 'buddhist' | 'traditional' | 'scholarly';
  showProgress?: boolean;
  progress?: number;
  headerActions?: React.ReactNode;
  className?: string;
}

const culturalThemes = {
  confucian: {
    name: '儒家文化',
    colors: {
      primary: 'cultural-red',
      secondary: 'cultural-gold',
      accent: 'amber'
    },
    gradient: 'from-cultural-red-900 via-cultural-ink-800 to-cultural-gold-900',
    bgPattern: 'from-cultural-red-50 via-cultural-paper to-cultural-gold-50',
    decorativeElements: ['🏛️', '📜', '🎋', '🔥'],
    borderPattern: 'border-cultural-red-200'
  },
  taoist: {
    name: '道家文化',
    colors: {
      primary: 'cultural-jade',
      secondary: 'emerald',
      accent: 'teal'
    },
    gradient: 'from-cultural-jade-900 via-emerald-800 to-teal-900',
    bgPattern: 'from-cultural-jade-50 via-emerald-50 to-teal-50',
    decorativeElements: ['☯️', '🌿', '🏔️', '💧'],
    borderPattern: 'border-cultural-jade-200'
  },
  buddhist: {
    name: '佛家文化',
    colors: {
      primary: 'cultural-gold',
      secondary: 'orange',
      accent: 'yellow'
    },
    gradient: 'from-cultural-gold-900 via-orange-800 to-yellow-900',
    bgPattern: 'from-cultural-gold-50 via-orange-50 to-yellow-50',
    decorativeElements: ['🪷', '🕉️', '🏮', '✨'],
    borderPattern: 'border-cultural-gold-200'
  },
  traditional: {
    name: '传统文化',
    colors: {
      primary: 'cultural-ink',
      secondary: 'cultural-red',
      accent: 'cultural-gold'
    },
    gradient: 'from-cultural-ink-900 via-cultural-red-800 to-cultural-gold-900',
    bgPattern: 'from-cultural-paper via-white to-cultural-gold-50',
    decorativeElements: ['🐉', '🦅', '🌸', '🎨'],
    borderPattern: 'border-cultural-ink-200'
  },
  scholarly: {
    name: '学者文化',
    colors: {
      primary: 'cultural-ink',
      secondary: 'slate',
      accent: 'cultural-paper'
    },
    gradient: 'from-cultural-ink-900 via-slate-800 to-gray-900',
    bgPattern: 'from-cultural-paper via-slate-50 to-gray-50',
    decorativeElements: ['📚', '🖋️', '📖', '🎓'],
    borderPattern: 'border-cultural-ink-200'
  }
};

export const CulturalPageTemplate: React.FC<CulturalPageTemplateProps> = ({
  children,
  title,
  description,
  keywords,
  breadcrumbs = [],
  heroTitle,
  heroSubtitle,
  heroDescription,
  culturalTheme = 'traditional',
  showProgress = false,
  progress = 0,
  headerActions,
  className = ''
}) => {
  const router = useRouter();
  const theme = culturalThemes[culturalTheme];

  // 默认面包屑
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: '首页', href: '/' },
    { label: '文化传承', href: '/culture/overview' },
    ...breadcrumbs
  ];

  const handleBack = () => {
    router.push('/culture/overview');
  };

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
        <meta property="og:title" content={title} />
        {description && <meta property="og:description" content={description} />}
        <meta name="twitter:title" content={title} />
        {description && <meta name="twitter:description" content={description} />}
      </Head>

      <div className={`min-h-screen bg-gradient-to-br ${theme.bgPattern} ${className}`}>
        {/* 传统文化装饰顶部边框 */}
        <div className="h-1 bg-gradient-to-r from-cultural-red-500 via-cultural-gold-500 to-cultural-jade-500"></div>
        
        {/* 固定顶部导航 - 传统文化风格 */}
        <div className="sticky top-0 bg-cultural-paper/95 backdrop-blur-sm shadow-cultural border-b border-cultural-gold-200 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* 面包屑导航 - 传统风格 */}
            <nav className="flex items-center gap-3 text-sm mb-3">
              {defaultBreadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {item.href ? (
                    <Link 
                      href={item.href} 
                      className="text-cultural-ink-600 hover:text-cultural-red-600 transition-colors duration-300 font-medium flex items-center gap-1"
                    >
                      {index === 0 && <span className="text-cultural-gold-500">🏠</span>}
                      {index === 1 && <span className="text-cultural-red-500">🏛️</span>}
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-cultural-ink-800 font-semibold flex items-center gap-1">
                      <span className="text-cultural-jade-500">📖</span>
                      {item.label}
                    </span>
                  )}
                  {index < defaultBreadcrumbs.length - 1 && (
                    <span className="text-cultural-gold-400 font-bold">❯</span>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* 学习进度条 - 传统风格 */}
            {showProgress && (
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-cultural-paper rounded-full h-3 border border-cultural-gold-200 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-cultural-red-500 via-cultural-gold-500 to-cultural-jade-500 h-full rounded-full transition-all duration-700 relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-cultural-ink-600 font-medium">{Math.round(progress)}%</span>
                  <span className="text-cultural-gold-500">📊</span>
                </div>
              </div>
            )}

            {/* 右侧操作按钮 */}
            {headerActions && (
              <div className="absolute top-4 right-4 flex items-center gap-3">
                {headerActions}
              </div>
            )}
          </div>
        </div>

        {/* 英雄区域 - 传统文化风格 */}
        {(heroTitle || heroSubtitle || heroDescription) && (
          <div className={`relative py-20 bg-gradient-to-br ${theme.gradient} text-white overflow-hidden`}>
            {/* 传统文化背景装饰 */}
            <div className="absolute inset-0 opacity-10">
              {/* 传统纹样 */}
              <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/30 rounded-full"></div>
              <div className="absolute top-20 right-20 w-24 h-24 border-2 border-white/30 rounded-full"></div>
              <div className="absolute bottom-20 left-1/4 w-40 h-40 border-2 border-white/30 rounded-full"></div>
              <div className="absolute top-1/3 right-1/3 w-28 h-28 border-2 border-white/30 rounded-full"></div>
              
              {/* 传统文化图案 */}
              <div className="absolute top-1/4 left-1/4 text-8xl opacity-20">{theme.decorativeElements[0]}</div>
              <div className="absolute bottom-1/4 right-1/4 text-6xl opacity-20">{theme.decorativeElements[1]}</div>
              <div className="absolute top-1/2 right-1/6 text-7xl opacity-20">{theme.decorativeElements[2]}</div>
              <div className="absolute bottom-1/3 left-1/6 text-5xl opacity-20">{theme.decorativeElements[3]}</div>
            </div>
            
            {/* 传统云纹装饰 */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
                <path d="M0 400 Q300 200 600 400 T1200 400 V800 H0 Z" fill="white"/>
                <path d="M0 450 Q400 250 800 450 T1200 450 V800 H0 Z" fill="white"/>
              </svg>
            </div>
            
            <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
              <div className="mb-8">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                  <span className="w-3 h-3 bg-cultural-gold-400 rounded-full animate-pulse"></span>
                  <span className="text-cultural-gold-200 font-medium">{theme.name}</span>
                  <span className="text-white/60">•</span>
                  <span className="text-white/80">传承千年智慧</span>
                </div>
              </div>
              
              {heroTitle && (
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cultural-gold-200 to-white bg-clip-text text-transparent leading-tight">
                  {heroTitle}
                </h1>
              )}
              
              {heroSubtitle && (
                <div className="text-2xl md:text-3xl font-medium mb-6 text-cultural-gold-100 tracking-wide">
                  {heroSubtitle}
                </div>
              )}
              
              {heroDescription && (
                <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto mb-10 leading-relaxed font-light">
                  {heroDescription}
                </p>
              )}

              {/* 传统文化装饰分割线 */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-cultural-gold-400"></div>
                <span className="text-cultural-gold-400 text-2xl">❋</span>
                <div className="w-32 h-px bg-cultural-gold-400"></div>
                <span className="text-cultural-gold-400 text-2xl">❋</span>
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-cultural-gold-400"></div>
              </div>
            </div>
          </div>
        )}

        {/* 主要内容区域 */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* 返回按钮 - 传统风格 */}
          <div className="mb-8">
            <Button
              variant="secondary"
              onClick={handleBack}
              className="group border-cultural-gold-300 text-cultural-ink-700 hover:bg-cultural-gold-50 hover:border-cultural-gold-400 transition-all duration-300"
            >
              <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-cultural-gold-600 mr-1">🏛️</span>
              返回文化传承
            </Button>
          </div>

          {/* 页面内容容器 - 传统文化风格 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-cultural-lg border border-cultural-gold-200 overflow-hidden">
            {/* 传统装饰顶部 */}
            <div className="h-2 bg-gradient-to-r from-cultural-red-400 via-cultural-gold-400 to-cultural-jade-400"></div>
            
            {children}
            
            {/* 传统装饰底部 */}
            <div className="h-2 bg-gradient-to-r from-cultural-jade-400 via-cultural-gold-400 to-cultural-red-400"></div>
          </div>
        </div>

        {/* 页面底部 - 传统文化风格 */}
        <div className={`bg-gradient-to-r ${theme.bgPattern} py-16 mt-16 border-t ${theme.borderPattern}`}>
          <div className="max-w-4xl mx-auto px-4 text-center">
            {/* 传统装饰元素 */}
            <div className="flex items-center justify-center gap-6 mb-6">
              {theme.decorativeElements.map((element, index) => (
                <span key={index} className="text-3xl opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default">
                  {element}
                </span>
              ))}
            </div>
            
            <div className="text-2xl font-bold text-cultural-ink-800 mb-4 tracking-wide">
              {theme.name} • 传统文化与现代科学的完美融合
            </div>
            <div className="text-cultural-ink-600 leading-relaxed">
              理性传承，科学应用，让古老智慧在新时代焕发生机
            </div>
            
            {/* 传统印章风格装饰 */}
            <div className="mt-8 inline-block p-4 border-2 border-cultural-red-300 rounded-lg bg-cultural-red-50">
              <div className="text-cultural-red-700 font-bold text-sm">
                📜 传承文化 • 启迪智慧 📜
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CulturalPageTemplate;
