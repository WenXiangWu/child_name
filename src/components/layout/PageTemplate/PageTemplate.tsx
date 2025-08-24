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

export interface PageTemplateProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  keywords?: string;
  category?: 'culture' | 'naming' | 'tools' | 'poetry' | 'analysis';
  breadcrumbs?: BreadcrumbItem[];
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
  headerActions?: React.ReactNode;
  className?: string;
}

const categoryConfig = {
  culture: {
    name: '文化传承',
    icon: '🏛️',
    color: 'cultural-red',
    gradient: 'from-cultural-red-500 to-cultural-gold-500',
    bgGradient: 'from-cultural-red-50 to-cultural-gold-50',
    heroGradient: 'from-cultural-red-900 via-cultural-ink-800 to-cultural-gold-900'
  },
  naming: {
    name: '智能取名',
    icon: '🎯',
    color: 'cultural-jade',
    gradient: 'from-cultural-jade-500 to-emerald-500',
    bgGradient: 'from-cultural-jade-50 to-emerald-50',
    heroGradient: 'from-cultural-jade-900 via-emerald-800 to-teal-900'
  },
  tools: {
    name: '实用工具',
    icon: '🔧',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    heroGradient: 'from-blue-900 via-indigo-800 to-purple-900'
  },
  poetry: {
    name: '诗词取名',
    icon: '📚',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    heroGradient: 'from-purple-900 via-pink-800 to-rose-900'
  },
  analysis: {
    name: '名字分析',
    icon: '📊',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
    heroGradient: 'from-emerald-900 via-teal-800 to-cyan-900'
  }
};

export const PageTemplate: React.FC<PageTemplateProps> = ({
  children,
  title,
  description,
  keywords,
  category = 'culture',
  breadcrumbs = [],
  heroTitle,
  heroSubtitle,
  heroDescription,
  showBackButton = true,
  backButtonText = '返回首页',
  backButtonHref = '/',
  headerActions,
  className = ''
}) => {
  const router = useRouter();
  const config = categoryConfig[category];

  // 默认面包屑
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: '首页', href: '/' },
    { label: config.name },
    ...breadcrumbs
  ];

  const handleBack = () => {
    if (backButtonHref) {
      router.push(backButtonHref);
    } else {
      router.back();
    }
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

      <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} ${className}`}>
        {/* 英雄区域 */}
        {(heroTitle || heroSubtitle || heroDescription) && (
          <div className={`pt-20 pb-16 bg-gradient-to-r ${config.heroGradient} text-white relative overflow-hidden`}>
            {/* 背景装饰 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
              <div className="absolute top-20 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
              <div className="absolute bottom-10 left-1/3 w-40 h-40 border border-white/20 rounded-full"></div>
              <div className="absolute top-1/4 right-1/4 text-8xl opacity-5">{config.icon}</div>
            </div>
            
            <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                  <span className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></span>
                  {config.name}
                </div>
              </div>
              
              {heroTitle && (
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  {heroTitle}
                </h1>
              )}
              
              {heroSubtitle && (
                <div className="text-xl md:text-2xl font-medium mb-4 text-gray-100">
                  {heroSubtitle}
                </div>
              )}
              
              {heroDescription && (
                <p className="text-lg text-gray-200 max-w-4xl mx-auto mb-8 leading-relaxed">
                  {heroDescription}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 主要内容 */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* 顶部导航栏 */}
          <div className="flex items-center justify-between mb-8">
            {/* 面包屑导航 */}
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              {defaultBreadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {item.href ? (
                    <Link 
                      href={item.href} 
                      className="hover:text-gray-800 transition-colors duration-200 hover:underline"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-gray-800 font-medium">{item.label}</span>
                  )}
                  {index < defaultBreadcrumbs.length - 1 && (
                    <span className="text-gray-400">›</span>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* 右侧操作按钮 */}
            <div className="flex items-center gap-3">
              {headerActions}
              {showBackButton && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {backButtonText}
                </Button>
              )}
            </div>
          </div>

          {/* 页面内容 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {children}
          </div>
        </div>

        {/* 页面底部装饰 */}
        <div className={`bg-gradient-to-r ${config.bgGradient} py-12 mt-16`}>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <span className="text-3xl">{config.icon}</span>
              {config.name} - 传统文化与现代科学的完美融合
            </div>
            <div className="text-gray-600">
              理性传承，科学应用，让古老智慧在新时代焕发生机
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PageTemplate;
