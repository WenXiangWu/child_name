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
      { href: '/naming', label: '专业取名', icon: '🔧' },
      { href: '/poetry-naming', label: '诗词取名', icon: '📜' },
      { href: '/plugin-execution-flow', label: '插件系统', icon: '🧩' }
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
  },
  { href: '/about', label: '关于我们' }
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
      <button className="flex items-center space-x-2 text-cultural-ink hover:text-cultural-red transition-all duration-300 py-2 px-3 rounded-lg hover:bg-cultural-paper/50 font-medium">
        <span className="font-heading">{item.label}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-300 text-cultural-gold ${isOpen ? 'rotate-180' : ''}`}
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
                className="flex items-center space-x-3 px-5 py-3 hover:bg-gradient-to-r hover:from-cultural-paper hover:to-cultural-gold/5 transition-all duration-300 text-cultural-ink hover:text-cultural-red group/item border-l-4 border-transparent hover:border-cultural-gold"
              >
                {child.icon && (
                  <span className="text-xl group-hover/item:scale-110 transition-transform duration-300">
                    {child.icon}
                  </span>
                )}
                <div className="flex-1">
                  <span className="font-medium font-heading">{child.label}</span>
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
    <header className="bg-gradient-to-b from-cultural-paper to-white shadow-cultural-lg border-b-2 border-cultural-gold relative overflow-visible z-50">
      {/* 传统文化背景装饰 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-2 left-10 w-8 h-8 border border-cultural-red rounded-full"></div>
        <div className="absolute top-4 right-20 w-6 h-6 border border-cultural-jade rotate-45"></div>
        <div className="absolute bottom-2 left-1/3 w-4 h-4 bg-cultural-gold rounded-full"></div>
        <div className="absolute bottom-3 right-1/4 w-5 h-5 border border-cultural-red/30 rounded-full"></div>
      </div>
      
      {/* 顶部装饰条 */}
      <div className="h-2 bg-gradient-to-r from-cultural-red via-cultural-gold to-cultural-jade relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo区域 */}
          <div className="flex items-center space-x-4 relative z-10">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cultural-red via-cultural-gold to-cultural-jade rounded-full flex items-center justify-center shadow-cultural-lg group-hover:shadow-cultural-xl transition-all duration-300 transform group-hover:scale-105">
                  <span className="text-white text-xl font-bold font-heading">名</span>
                </div>
                {/* 装饰光环 */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cultural-red via-cultural-gold to-cultural-jade rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-cultural-ink font-heading group-hover:text-cultural-red transition-colors duration-300">宝宝取名专家</h1>
                <span className="text-xs text-cultural-gold font-medium">传承文化 · 智慧取名</span>
              </div>
            </Link>
            
            {/* 权威标识 */}
            <div className="hidden md:flex items-center space-x-2 ml-6">
              <div className="bg-gradient-to-r from-cultural-jade/10 to-cultural-jade/5 border border-cultural-jade/30 rounded-full px-4 py-2 shadow-sm">
                <span className="text-xs text-cultural-jade font-semibold flex items-center">
                  <span className="mr-2 text-sm">🏛️</span>
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
                    'text-cultural-ink hover:text-cultural-red transition-all duration-300 py-2 px-3 rounded-lg hover:bg-cultural-paper/50 font-medium font-heading relative group',
                    router.pathname === item.href && 'text-cultural-red font-semibold bg-cultural-paper/30'
                  )}
                >
                  {item.label}
                  {/* 活跃状态装饰 */}
                  {router.pathname === item.href && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-cultural-red to-cultural-gold rounded-full"></div>
                  )}
                  {/* 悬停装饰 */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cultural-gold to-cultural-jade rounded-full group-hover:w-6 transition-all duration-300"></div>
                </Link>
              )
            ))}
          </nav>

          {/* 行动按钮 */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => router.push('/naming/quick')}
              className="hidden md:inline-flex"
            >
              开始取名
            </Button>
            
            {/* 移动端菜单按钮 */}
            <button 
              className="lg:hidden p-2 text-cultural-ink hover:text-cultural-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-cultural-paper to-white border-t-2 border-cultural-gold shadow-cultural-lg relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-6 w-6 h-6 border border-cultural-red rounded-full"></div>
            <div className="absolute top-8 right-8 w-4 h-4 bg-cultural-jade rounded-full"></div>
            <div className="absolute bottom-6 left-1/3 w-5 h-5 border border-cultural-gold rotate-45"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
            <nav className="space-y-3">
              {navigationItems.map((item) => (
                <div key={item.href} className="bg-white/50 rounded-xl p-3 border border-cultural-gold/20">
                  <Link
                    href={item.href}
                    className="block text-cultural-ink hover:text-cultural-red font-medium font-heading py-2 px-2 rounded-lg hover:bg-cultural-paper/50 transition-all duration-300"
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
                          className="flex items-center space-x-3 text-gray-600 hover:text-cultural-red py-2 px-2 rounded-lg hover:bg-cultural-paper/30 transition-all duration-300 group"
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
                  size="md"
                  onClick={() => {
                    router.push('/naming/quick');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full shadow-cultural-lg"
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
