import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';

interface PoetryNameInfo {
  familyName: string;
  firstName: string;
  secondName: string;
  book: string;
  title: string;
  author: string;
  dynasty: string;
  sentence: string;
}

export default function PoetryNameDetail() {
  const router = useRouter();
  const [nameInfo, setNameInfo] = useState<PoetryNameInfo | null>(null);

  useEffect(() => {
    const {
      familyName,
      firstName,
      secondName,
      book,
      title,
      author,
      dynasty,
      sentence
    } = router.query;

    if (familyName && firstName && secondName && book && title && sentence) {
      setNameInfo({
        familyName: familyName as string,
        firstName: firstName as string,
        secondName: secondName as string,
        book: book as string,
        title: title as string,
        author: (author as string) || '佚名',
        dynasty: dynasty as string,
        sentence: sentence as string
      });
    }
  }, [router.query]);

  if (!nameInfo) {
    return (
      <Layout title="名字详情加载中...">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">正在加载名字详情...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const fullName = nameInfo.familyName + nameInfo.firstName + nameInfo.secondName;

  // 高亮显示名字字符
  const highlightSentence = (sentence: string, name: string) => {
    let result = sentence;
    for (const char of name) {
      const regex = new RegExp(`[${char}]`, 'g');
      result = result.replace(regex, `<span class="font-bold text-purple-600 bg-purple-100 px-1 rounded">${char}</span>`);
    }
    return result;
  };

  return (
    <Layout
      title={`${fullName} - 诗词名字详情`}
      description={`${fullName}的详细信息，来自《${nameInfo.title}》`}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>←</span>
            <span>返回</span>
          </button>

          {/* 名字标题 */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">{fullName}</h1>
            <div className="text-xl text-gray-600">
              来自 <span className="text-purple-600 font-semibold">{nameInfo.book}</span>
            </div>
          </div>

          {/* 诗词来源卡片 */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📜 诗词出处</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
            </div>

            {/* 作品信息 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">典籍</div>
                <div className="text-lg font-semibold text-purple-700">{nameInfo.book}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">作品</div>
                <div className="text-lg font-semibold text-gray-800">{nameInfo.title}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">作者</div>
                <div className="text-lg font-semibold text-gray-800">
                  <span className="text-sm text-gray-500">[{nameInfo.dynasty}]</span> {nameInfo.author}
                </div>
              </div>
            </div>

            {/* 诗句展示 */}
            <div className="bg-white rounded-xl p-6 shadow-inner">
              <div className="text-center text-2xl leading-relaxed text-gray-800">
                <span className="text-gray-400 text-xl">「</span>
                <span 
                  dangerouslySetInnerHTML={{ 
                    __html: highlightSentence(nameInfo.sentence, nameInfo.firstName + nameInfo.secondName) 
                  }} 
                />
                <span className="text-gray-400 text-xl">」</span>
              </div>
            </div>
          </div>

          {/* 名字分析 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 字义分析 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">📝</span>
                字义分析
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-lg font-semibold text-purple-600 mb-2">
                    {nameInfo.firstName} • {nameInfo.secondName}
                  </div>
                  <div className="text-gray-600 leading-relaxed">
                    从古典诗文中撷取而来，承载着深厚的文化内涵。
                    "{nameInfo.firstName}{nameInfo.secondName}"二字在诗句中的和谐搭配，
                    展现了古人对美好品格和人生境界的向往。
                  </div>
                </div>
              </div>
            </div>

            {/* 文化内涵 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🏮</span>
                文化内涵
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">典籍传统</div>
                  <div className="text-gray-700">
                    {nameInfo.book === '诗经' && '《诗经》是中国最早的诗歌总集，体现了"男诗经"的取名传统'}
                    {nameInfo.book === '楚辞' && '《楚辞》是屈原等楚国诗人的作品集，体现了"女楚辞"的取名传统'}
                    {nameInfo.book === '唐诗' && '唐诗代表了中国古典诗歌的巅峰，意境深远，气象恢宏'}
                    {nameInfo.book === '宋词' && '宋词以其婉约豪放的风格，展现了不同的人生感悟'}
                    {!['诗经', '楚辞', '唐诗', '宋词'].includes(nameInfo.book) && '承载着中华文化的深厚底蕴'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">时代背景</div>
                  <div className="text-gray-700">
                    {nameInfo.dynasty}时期的文学作品，反映了那个时代的文化特色和人文精神。
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 推荐理由 */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">💫</span>
              推荐理由
            </h3>
            <div className="text-gray-700 leading-relaxed">
              这个名字不仅音韵优美，更承载着深厚的文化内涵。从经典诗文中提取的字词组合，
              既体现了传统文化的魅力，又寄托了对孩子美好品格的期望。
              选择这样的名字，是对中华文化传统的传承，也是给孩子最珍贵的文化礼物。
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-12 text-center space-x-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
            >
              返回名字列表
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}