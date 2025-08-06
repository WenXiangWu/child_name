import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = '宝宝取名网 - 帮助父母找到完美的名字',
  description = '为您的宝宝找到一个有意义、吉祥的好名字，结合传统文化与现代审美，让宝宝的名字独特而美好。'
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-700 flex items-center">
            <span className="mr-2">👶</span>
            宝宝取名网
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-primary-600">
              首页
            </Link>
            <Link href="/generate" className="text-gray-600 hover:text-primary-600">
              名字生成
            </Link>
            <Link href="/xinhua-dict" className="text-gray-600 hover:text-primary-600">
              新华字典
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary-600">
              关于我们
            </Link>
          </nav>
          
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-2">
              <nav className="flex flex-col space-y-2">
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-primary-600 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  首页
                </Link>
                <Link 
                  href="/generate" 
                  className="text-gray-600 hover:text-primary-600 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  名字生成
                </Link>
                <Link 
                  href="/xinhua-dict" 
                  className="text-gray-600 hover:text-primary-600 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  新华字典
                </Link>
                <Link 
                  href="/about" 
                  className="text-gray-600 hover:text-primary-600 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  关于我们
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">宝宝取名网</h3>
              <p className="text-gray-600">
                帮助父母为宝宝找到一个有意义、吉祥的好名字，结合传统文化与现代审美，让宝宝的名字独特而美好。
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">快速链接</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-primary-600">
                    首页
                  </Link>
                </li>
                <li>
                  <Link href="/generate" className="text-gray-600 hover:text-primary-600">
                    名字生成
                  </Link>
                </li>
                <li>
                  <Link href="/xinhua-dict" className="text-gray-600 hover:text-primary-600">
                    新华字典
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-primary-600">
                    关于我们
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">联系我们</h3>
              <p className="text-gray-600">
                如有任何问题或建议，请随时与我们联系。
              </p>
              <p className="text-gray-600 mt-2">
                邮箱：contact@babyname.example.com
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500">
            <p>© {new Date().getFullYear()} 宝宝取名网 - 让每个名字都充满爱与祝福</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;