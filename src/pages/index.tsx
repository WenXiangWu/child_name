import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Home() {
  const router = useRouter();
  const [babyGender, setBabyGender] = useState<'male' | 'female' | ''>('');
  const [familyName, setFamilyName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleStartNaming = () => {
    if (!babyGender) return;

    setIsLoading(true);
    router.push({
      pathname: '/generate',
      query: {
        gender: babyGender,
        familyName: familyName || undefined
      }
    });
  };

  const handleStartNamingDetailed = () => {
    if (!babyGender) return;

    setIsLoading(true);
    const params = new URLSearchParams({
      familyName: familyName || '王', // 默认姓氏
      gender: babyGender,
      useTraditional: 'false',
      scoreThreshold: '85'
    });

    router.push(`/qiming-results?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-gray-800">
                宝宝取名专家
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/naming" className="text-gray-600 hover:text-gray-800">
                  专业取名
                </Link>
                <Link href="/cultural-info" className="text-gray-600 hover:text-gray-800">
                  文化科普
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-800">
                  关于我们
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/qiming-test" className="text-sm text-gray-500 hover:text-gray-700">
                功能测试
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            为您的宝宝
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
              取个好名字
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            结合传统文化智慧与现代科学方法，为新生儿提供专业、个性化、有文化内涵的名字推荐
          </p>
          {/* 传统文化特色 */}
          <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">传统文化智慧</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  结合传统文化智慧与现代科学方法，为新生儿提供专业、个性化、有文化内涵的名字推荐
                </p>
              </div>

              <div className="border-4 border-red-500 rounded-2xl p-8 bg-white/80 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* 三才五格分析 */}
                  <Link href="/culture/sancai-wuge" className="group">
                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-100 group-hover:from-purple-100 group-hover:to-indigo-200 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🔮</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">三才五格分析</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        基于传统姓名学理论，精确计算三才五格数理，确保名字蕴含美好寓意与运势。
                      </p>
                      <div className="mt-4 text-purple-600 text-sm font-medium group-hover:text-purple-700">
                        了解更多 →
                      </div>
                    </div>
                  </Link>

                  {/* 五行平衡 */}
                  <Link href="/culture/wuxing-balance" className="group">
                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 group-hover:from-emerald-100 group-hover:to-teal-200 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl">⚖️</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">五行平衡</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        根据生辰信息分析五行属性，确保名字协调平衡，符合个人命理特征。
                      </p>
                      <div className="mt-4 text-emerald-600 text-sm font-medium group-hover:text-emerald-700">
                        了解更多 →
                      </div>
                    </div>
                  </Link>

                  {/* 音韵美感 */}
                  <Link href="/culture/phonetic-beauty" className="group">
                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-rose-50 to-pink-100 group-hover:from-rose-100 group-hover:to-pink-200 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🎵</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">音韵美感</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        分析声调搭配，确保名字读音优美和谐，朗朗上口，富有音律美感。
                      </p>
                      <div className="mt-4 text-rose-600 text-sm font-medium group-hover:text-rose-700">
                        了解更多 →
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* 快速开始 */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">快速开始取名</h2>
            <p className="text-gray-600">简单几步，为您的宝宝生成专业的名字推荐</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 基本信息 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    宝宝姓氏 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder="请输入姓氏"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    宝宝性别 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setBabyGender('male')}
                      className={`p-4 rounded-lg border-2 transition-all ${babyGender === 'male'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="text-2xl mb-2">👦</div>
                      <div className="font-medium">男宝宝</div>
                    </button>
                    <button
                      onClick={() => setBabyGender('female')}
                      className={`p-4 rounded-lg border-2 transition-all ${babyGender === 'female'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="text-2xl mb-2">👧</div>
                      <div className="font-medium">女宝宝</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col justify-center space-y-4">
                {/* 诗词取名 - 新增的特色功能 */}
                <Link
                  href={babyGender && familyName ? `/poetry-naming?gender=${babyGender}&familyName=${familyName}` : '#'}
                  className={`text-center px-8 py-4 rounded-lg font-medium transition-all ${babyGender && familyName
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  onClick={(e) => {
                    if (!babyGender || !familyName) {
                      e.preventDefault();
                      alert('请先填写姓氏和选择性别');
                    }
                  }}
                >
                  ✨ 诗词取名 (特色推荐)
                </Link>

                <Link
                  href="/naming"
                  className={`text-center px-8 py-3 rounded-lg font-medium border-2 transition-all ${babyGender && familyName
                      ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                      : 'border-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  onClick={(e) => {
                    if (!babyGender || !familyName) {
                      e.preventDefault();
                      alert('请先填写姓氏和选择性别');
                    }
                  }}
                >
                  🚀 专业取名分析
                </Link>

                <button
                  onClick={handleStartNamingDetailed}
                  disabled={!babyGender || isLoading}
                  className={`px-8 py-3 rounded-lg font-medium border-2 transition-all ${babyGender && !isLoading
                      ? 'border-gray-400 text-gray-600 hover:bg-gray-50'
                      : 'border-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {isLoading ? '生成中...' : '📋 快速生成结果'}
                </button>

                <div className="text-center text-sm text-gray-500">
                  诗词取名：基于古典文学，文化内涵深厚
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 功能亮点 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">为什么选择我们</h2>
            <p className="text-gray-600">专业、科学、个性化的取名服务</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">算法透明</h3>
              <p className="text-sm text-gray-600">完全公开评分逻辑，每个分数都有详细解释</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">个性定制</h3>
              <p className="text-sm text-gray-600">权重自由调整，满足不同家庭的独特需求</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">文化传承</h3>
              <p className="text-sm text-gray-600">深度解读传统文化，传承中华文明智慧</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">快速响应</h3>
              <p className="text-sm text-gray-600">纯前端实现，秒级生成结果，保护隐私</p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">宝宝取名专家</h3>
              <p className="text-gray-400 text-sm">
                专业的宝宝取名服务，结合传统文化与现代科技，为每个家庭提供最适合的名字。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">快速链接</h3>
              <div className="space-y-2">
                <Link href="/naming" className="block text-gray-400 hover:text-white text-sm">
                  专业取名
                </Link>
                <Link href="/cultural-info" className="block text-gray-400 hover:text-white text-sm">
                  文化科普
                </Link>
                <Link href="/about" className="block text-gray-400 hover:text-white text-sm">
                  关于我们
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">联系我们</h3>
              <div className="text-gray-400 text-sm space-y-1">
                <div>📧 contact@babyname.com</div>
                <div>📱 400-888-8888</div>
                <div>🕒 7×24小时在线服务</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 宝宝取名专家. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}