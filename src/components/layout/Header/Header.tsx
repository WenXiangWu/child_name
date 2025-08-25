import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { clsx } from 'clsx';
import { Button } from '@/components/ui';

interface NavItem {
  href: string;
  label: string;
  icon?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  { href: '/', label: '首页' },
  {
    href: '/naming',
    label: '智能取名',
    children: [
      { href: '/naming', label: '快速取名', icon: '🔧' },
      { href: '/poetry-naming', label: '诗词取名', icon: '📜' },
      { href: '/plugin-execution-flow', label: '科学取名', icon: '🧩' }
    ]
  },
  {
    href: '/culture/overview',
    label: '文化传承',
    children: [
      { href: '/culture/overview', label: '文化概览', icon: '📚' },
      { href: '/culture/sancai-wuge-new', label: '三才五格', icon: '🔮' },
      { href: '/culture/wuxing-balance-new', label: '五行平衡', icon: '⚖️' },
      { href: '/culture/phonetic-beauty-new', label: '音韵美感', icon: '🎵' },
      { href: '/culture/bazi-xiyongshen', label: '八字喜用神', icon: '🔥' },
      { href: '/culture/zodiac-naming', label: '生肖取名', icon: '🐲' },
      { href: '/culture/cultural-heritage', label: '文化底蕴', icon: '📖' }
    ]
  },
  {
    href: '/poetry',
    label: '典籍宝库',
    children: [
      { href: '/poetry', label: '诗词典籍', icon: '📖' },
      { href: '/baijiaxing', label: '百家姓谱', icon: '📜' },
      { href: '/standard-characters', label: '规范汉字', icon: '🏛️' },
      { href: '/culture/lunar-calendar', label: '农历万年历', icon: '🏮' }
    ]
  },
  {
    href: '/tools',
    label: '实用工具',
    children: [
      { href: '/tools/name-analysis', label: '姓名分析', icon: '📊' },
      { href: '/name-duplicate-check', label: '重名查询', icon: '🔍' },
      { href: '/xinhua-dict', label: '新华字典', icon: '📚' },
      { href: '/plugin-execution-flow', label: '插件流程', icon: '🔧' },
      { href: '/ui-demo', label: 'UI演示', icon: '🎨' }
    ]
  }
];

const NavDropdown: React.FC<{ item: NavItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMouseEnter = () => {
    console.log('Mouse enter:', item.label, 'Children:', item.children?.length);
    setIsOpen(true);
  };
  
  const handleMouseLeave = () => {
    console.log('Mouse leave:', item.label);
    setIsOpen(false);
  };
  
  return (
    <div 
      ref={containerRef}
      className="relative dropdown-container group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center space-x-2 text-slate-800 hover:text-amber-600 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gray-50 font-medium text-base whitespace-nowrap">
        <span className="font-heading">{item.label}</span>
        <svg 
          className={`w-5 h-5 transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* 始终渲染下拉菜单，用样式控制显示 */}
      {item.children && (
        <div 
          className={`dropdown-menu absolute top-full left-0 w-72 bg-white rounded-2xl shadow-2xl border-2 border-cultural-gold/20 py-3 overflow-hidden backdrop-blur-sm transition-all duration-300 ${
            isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
          }`}
          style={{ 
            marginTop: '4px',
            zIndex: 999999,
            position: 'absolute'
          }}
        >
          {/* 装饰性顶部条纹 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cultural-red via-cultural-gold to-cultural-jade"></div>
          
          {/* 传统装饰元素 */}
          <div className="absolute top-2 right-4 w-6 h-6 border border-cultural-jade/20 rounded-full"></div>
          <div className="absolute bottom-3 left-4 w-4 h-4 bg-cultural-gold/10 rounded-full"></div>
          
          <div className="relative z-10">
            {item.children.map((child, index) => (
              <Link
                key={`${child.href}-${index}`}
                href={child.href}
                className="flex items-center space-x-3 px-5 py-4 hover:bg-gradient-to-r hover:from-cultural-paper hover:to-cultural-gold/5 transition-all duration-300 text-cultural-ink hover:text-cultural-red group/item border-l-4 border-transparent hover:border-cultural-gold"
              >
                {child.icon && (
                  <span className="text-xl group-hover/item:scale-110 transition-transform duration-300">
                    {child.icon}
                  </span>
                )}
                <div className="flex-1">
                  <span className="font-medium font-heading text-base">{child.label}</span>
                </div>
                <svg className="w-4 h-4 text-cultural-gold opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Header: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative z-50">
      
      <div className="max-w-8xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo区域 */}
          <div className="flex items-center space-x-3 md:space-x-6 relative z-10">
            <Link href="/" className="flex items-center space-x-2 md:space-x-4 group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-amber-600">
                <span className="text-white text-lg md:text-xl font-bold font-heading">名</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 font-heading group-hover:text-amber-600 transition-colors duration-300 whitespace-nowrap">宝宝取名专家</h1>
                <span className="text-xs md:text-sm text-gray-500 font-medium whitespace-nowrap">科学取名 传承文化</span>
              </div>
            </Link>
            
            {/* 权威标识 */}
            <div className="hidden lg:flex items-center">
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                <span className="text-sm text-gray-700 font-medium flex items-center whitespace-nowrap">
                  <span className="mr-2">📋</span>
                  国家规范汉字标准
                </span>
              </div>
            </div>
          </div>

          {/* 桌面端导航 */}
          <nav className="hidden lg:flex items-center space-x-6 relative z-[100]">
            {navigationItems.map((item) => (
              item.children ? (
                <NavDropdown key={item.href} item={item} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'text-slate-800 hover:text-amber-600 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gray-50 font-medium font-heading relative group text-base whitespace-nowrap',
                    router.pathname === item.href && 'text-amber-600 font-semibold bg-gray-50'
                  )}
                >
                  {item.label}
                  {/* 活跃状态装饰 */}
                  {router.pathname === item.href && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-amber-600 rounded-full"></div>
                  )}
                  {/* 悬停装饰 */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-amber-600 rounded-full group-hover:w-6 transition-all duration-300"></div>
                </Link>
              )
            ))}
          </nav>

          {/* 行动按钮 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/naming/quick')}
              className="hidden md:inline-flex bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-2.5 text-base rounded-lg transition-colors duration-300 whitespace-nowrap"
            >
              开始取名
            </button>
            
            {/* 移动端菜单按钮 */}
            <button 
              className="lg:hidden p-3 text-slate-800 hover:text-amber-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg relative overflow-hidden">

          
          <div className="max-w-8xl mx-auto px-6 py-6 relative z-10">
            <nav className="space-y-3">
              {navigationItems.map((item) => (
                <div key={item.href} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <Link
                    href={item.href}
                    className="block text-slate-800 hover:text-amber-600 font-medium font-heading py-3 px-3 rounded-lg hover:bg-white transition-all duration-300 text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-2 space-y-1 mt-3 border-l-2 border-cultural-gold/30 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center space-x-3 text-gray-600 hover:text-cultural-red py-4 px-4 rounded-lg hover:bg-cultural-paper/30 transition-all duration-300 group text-base"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.icon && (
                            <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                              {child.icon}
                            </span>
                          )}
                          <span className="font-medium">{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t-2 border-cultural-gold/30">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => {
                    router.push('/naming/quick');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full shadow-cultural-lg text-lg font-medium py-4 whitespace-nowrap"
                >
                  开始取名
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
