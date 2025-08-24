import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { clsx } from 'clsx';

interface TabBarItem {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}

const tabBarItems: TabBarItem[] = [
  { href: '/', icon: '🏠', label: '首页' },
  { href: '/naming/quick', icon: '⚡', label: '取名' },
  { href: '/culture/overview', icon: '📚', label: '文化' },
  { href: '/poetry', icon: '📖', label: '典籍' },
  { href: '/tools', icon: '🛠️', label: '工具' }
];

const MobileNavigation: React.FC = () => {
  const router = useRouter();
  
  const isActive = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };
  
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="grid grid-cols-5 py-2">
        {tabBarItems.map((item) => {
          const active = isActive(item.href);
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className="flex flex-col items-center py-2 px-1 transition-all duration-200"
            >
              <div className={clsx(
                'text-xl mb-1 transition-all duration-200',
                active ? 'text-cultural-gold scale-110' : 'text-gray-400'
              )}>
                {item.icon}
              </div>
              <span className={clsx(
                'text-xs font-medium transition-all duration-200',
                active ? 'text-cultural-gold' : 'text-gray-500'
              )}>
                {item.label}
              </span>
              {active && (
                <div className="w-1 h-1 bg-cultural-gold rounded-full mt-1 animate-fade-in"></div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
