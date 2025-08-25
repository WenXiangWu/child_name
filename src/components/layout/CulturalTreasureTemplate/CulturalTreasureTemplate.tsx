import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { MobileNavigation } from '../MobileNavigation';

interface CulturalTreasureTemplateProps {
  children: React.ReactNode;
  title: string;
  description: string;
  pageTitle: string;
  pageSubtitle?: string;
  icon?: string;
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

      {/* 标准导航栏 */}
      <Header />



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

      {/* 标准页脚 */}
      <Footer />
      
      {/* 移动端导航 */}
      <MobileNavigation />
    </div>
  );
};

export default CulturalTreasureTemplate;
