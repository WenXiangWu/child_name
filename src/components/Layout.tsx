import React from 'react';
import Head from 'next/head';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';
import { MobileNavigation } from './layout/MobileNavigation';

// 导出新的文化页面模板
export { CulturalTreasureTemplate } from './layout/CulturalTreasureTemplate';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showMobileNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = '宝宝取名专家 - 传承文化智慧，为宝宝取个好名字',
  description = '专业的宝宝取名服务，严格遵循《通用规范汉字表》国家标准，结合传统文化智慧与现代科学方法，为新生儿提供个性化、有文化内涵的名字推荐。',
  showMobileNav = true
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-cultural-gradient">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="宝宝取名,婴儿起名,新生儿取名,传统文化,规范汉字,诗词取名,五行取名,生辰八字" />
        <meta name="author" content="宝宝取名专家" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="宝宝取名专家" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        
        {/* 网站图标 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* 字体预加载 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <Header />

      <main className="flex-grow pb-16 lg:pb-0">
        {children}
      </main>

      <Footer />
      
      {showMobileNav && <MobileNavigation />}
    </div>
  );
};

export default Layout;