import Link from 'next/link';
import Layout from '@/components/Layout';

export default function NotFound() {
  return (
    <Layout
      title="页面未找到 - 宝宝取名网"
      description="您访问的页面不存在"
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-medium text-gray-700 mb-6">页面未找到</h2>
        <p className="text-gray-600 text-center max-w-md mb-8">
          很抱歉，您要访问的页面不存在或已被移除。
        </p>
        <div className="flex space-x-4">
          <Link 
            href="/" 
            className="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
          >
            返回首页
          </Link>
          <Link 
            href="/generate" 
            className="px-6 py-2 rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            生成名字
          </Link>
        </div>
      </div>
    </Layout>
  );
}