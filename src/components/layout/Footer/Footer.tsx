import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cultural-ink text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cultural-red to-cultural-gold rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">名</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading">宝宝取名专家</h3>
                <span className="text-cultural-gold text-sm">传承文化 · 智慧取名</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              专业的宝宝取名服务，结合传统文化与现代科技，为每个家庭提供最适合的名字。
              严格遵循《通用规范汉字表》国家标准，传承千年文化智慧。
            </p>
            
            {/* 权威认证 */}
            <div className="mt-4 flex items-center space-x-4">
              <div className="bg-cultural-jade/20 border border-cultural-jade/30 rounded-lg px-3 py-2">
                <span className="text-xs text-cultural-jade font-medium flex items-center">
                  <span className="mr-1">🏛️</span>
                  国家规范汉字标准
                </span>
              </div>
              <div className="bg-cultural-gold/20 border border-cultural-gold/30 rounded-lg px-3 py-2">
                <span className="text-xs text-cultural-gold font-medium flex items-center">
                  <span className="mr-1">📚</span>
                  传统文化传承
                </span>
              </div>
            </div>
          </div>
          
          {/* 快速链接 */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cultural-gold">快速链接</h4>
            <div className="space-y-3">
              <Link href="/naming/quick" className="block text-gray-300 hover:text-white transition-colors text-sm">
                快速取名
              </Link>
              <Link href="/naming/professional" className="block text-gray-300 hover:text-white transition-colors text-sm">
                专业取名
              </Link>
              <Link href="/culture/overview" className="block text-gray-300 hover:text-white transition-colors text-sm">
                文化传承
              </Link>
              <Link href="/poetry" className="block text-gray-300 hover:text-white transition-colors text-sm">
                诗词典籍
              </Link>
              <Link href="/standard-characters" className="block text-gray-300 hover:text-white transition-colors text-sm">
                规范汉字表
              </Link>
            </div>
          </div>
          
          {/* 联系我们 */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cultural-gold">联系我们</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <span>📧</span>
                <span>contact@babyname.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📱</span>
                <span>400-888-8888</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🕒</span>
                <span>7×24小时在线服务</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🏛️</span>
                <span>遵循国家标准规范</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部版权 */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                &copy; 2024 宝宝取名专家. 保留所有权利.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                严格遵循《通用规范汉字表》(GB 2013) 国家标准
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-xs text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                服务条款
              </Link>
              <Link href="/about" className="hover:text-white transition-colors">
                关于我们
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
