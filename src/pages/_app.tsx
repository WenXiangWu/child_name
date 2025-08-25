import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { globalPreloader, LoadingState } from '@/core/common/global-preloader';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 在应用启动时立即开始数据预加载
    const startPreload = async () => {
      try {
        console.log('🚀 应用启动，开始数据预加载...');
        await globalPreloader.preloadData();
        console.log('✅ 数据预加载完成，应用已就绪');
      } catch (error) {
        console.error('❌ 数据预加载失败，但应用仍可使用:', error);
      }
    };

    // 异步执行，不阻塞页面渲染
    startPreload();

    // 添加全局数据状态监控（开发环境）
    if (process.env.NODE_ENV === 'development') {
      (window as any).__qiming_preloader = globalPreloader;
      console.log('🔧 开发模式：可通过 window.__qiming_preloader 查看加载状态');
    }
  }, []);

  return (
    <>
      <Head>
        <title>宝宝取名网 - 帮助父母找到完美的名字</title>
        <meta name="description" content="为您的宝宝找到一个有意义、吉祥的好名字，结合传统文化与现代审美，让宝宝的名字独特而美好。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}