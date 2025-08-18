import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// 临时数据，避免构建时的JSON导入问题
const baijiaxingData = {
  title: '百家姓',
  author: '佚名',
  tags: '北宋',
  paragraphs: [
    '赵钱孙李，周吴郑王。',
    '冯陈褚卫，蒋沈韩杨。',
    '朱秦尤许，何吕施张。',
    '孔曹严华，金魏陶姜。'
  ],
  origin: [
    { surname: '赵', place: '天水郡' },
    { surname: '钱', place: '彭城郡' },
    { surname: '孙', place: '富春郡' },
    { surname: '李', place: '陇西郡' }
  ]
};

interface Surname {
  surname: string;
  place: string;
}

const BaijiaxingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurname, setSelectedSurname] = useState<Surname | null>(null);

  // 从paragraphs中提取所有姓氏
  const allSurnames = useMemo(() => {
    const surnames: string[] = [];
    
    // 从paragraphs中提取单姓
    baijiaxingData.paragraphs.forEach(paragraph => {
      // 移除标点符号，提取汉字
      const chars = paragraph.replace(/[，。]/g, '');
      for (const char of chars) {
        if (char && !surnames.includes(char)) {
          surnames.push(char);
        }
      }
    });

    return surnames;
  }, []);

  // 搜索过滤
  const filteredOrigins = useMemo(() => {
    if (!searchTerm) return baijiaxingData.origin;
    return baijiaxingData.origin.filter(item => 
      item.surname.includes(searchTerm) || 
      item.place.includes(searchTerm)
    );
  }, [searchTerm]);

  const handleSurnameClick = (surname: string) => {
    const origin = baijiaxingData.origin.find(item => item.surname === surname);
    setSelectedSurname(origin || null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <Head>
        <title>百家姓科普 - 中华姓氏文化传承</title>
        <meta name="description" content="探索中华姓氏文化，了解百家姓的历史渊源和地理分布，传承千年文化智慧。" />
      </Head>

      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-amber-600">📜</span>
              宝宝取名专家
            </Link>
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              ← 返回首页
            </Link>
          </div>
        </div>
      </nav>

      {/* 页面头部 */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">百家姓</h1>
          <p className="text-xl mb-4">赵钱孙李，周吴郑王</p>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            《百家姓》是中国古代幼学三大读物之一，收录了中华民族常见姓氏，
            反映了中国姓氏文化的深厚底蕴和历史传承。
          </p>
          
          {/* 统计信息 */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{allSurnames.length}</div>
              <div className="text-sm opacity-80">收录姓氏</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{baijiaxingData.origin.length}</div>
              <div className="text-sm opacity-80">详细释义</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">北宋</div>
              <div className="text-sm opacity-80">成书时期</div>
            </div>
          </div>
        </div>
      </section>

      {/* 搜索功能 */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <input
              type="text"
              placeholder="搜索姓氏或籍贯..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-6 py-3 border-2 border-gray-200 rounded-full text-lg focus:outline-none focus:border-amber-500 transition-colors"
            />
            <p className="text-gray-500 mt-2">
              共找到 {filteredOrigins.length} 个姓氏
            </p>
          </div>
        </div>
      </section>

      {/* 原文展示 */}
      <section className="py-12 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">百家姓原文</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {baijiaxingData.paragraphs.map((paragraph, index) => (
                <div 
                  key={index}
                  className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200"
                >
                  <div className="text-2xl font-serif text-gray-800 leading-relaxed">
                    {paragraph.split('').map((char, charIndex) => {
                      if (char === '，' || char === '。') {
                        return <span key={charIndex} className="text-amber-600">{char}</span>;
                      }
                      if (char && char !== '，' && char !== '。') {
                        return (
                          <span 
                            key={charIndex}
                            className="cursor-pointer hover:text-amber-600 hover:bg-amber-100 rounded px-1 transition-colors"
                            onClick={() => handleSurnameClick(char)}
                          >
                            {char}
                          </span>
                        );
                      }
                      return char;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 姓氏详情弹窗 */}
      {selectedSurname && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSurname(null)}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 mb-4">
                {selectedSurname.surname}
              </div>
              <div className="text-gray-600 mb-4">
                <span className="font-medium">籍贯：</span>
                {selectedSurname.place}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                点击姓氏了解更多历史渊源和地理分布
              </div>
              <button 
                onClick={() => setSelectedSurname(null)}
                className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 姓氏列表 */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">姓氏详解</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOrigins.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-amber-500"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">
                    {item.surname}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">籍贯：</span>
                    {item.place}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredOrigins.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                没有找到相关姓氏，请尝试其他搜索词
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 文化价值 */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">百家姓的文化价值</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">启蒙教育</h3>
              <p className="text-gray-600">
                作为古代幼学读物，帮助儿童认识汉字、了解姓氏，是传统文化启蒙的重要载体。
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">地理文化</h3>
              <p className="text-gray-600">
                记录了各姓氏的地理分布和历史迁徙，反映了中华民族的历史变迁和文化融合。
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">血脉传承</h3>
              <p className="text-gray-600">
                承载着家族血脉和文化传承，是中华民族凝聚力和认同感的重要源泉。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 取名联系 */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">百家姓与取名</h2>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8">
            <p className="text-lg text-gray-700 mb-6">
              了解姓氏的历史渊源和文化内涵，有助于为宝宝起一个既符合传统文化又富有时代特色的好名字。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-left">
                <h4 className="font-bold text-amber-700 mb-2">姓氏文化考量</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 了解姓氏历史渊源</li>
                  <li>• 考虑地域文化特色</li>
                  <li>• 传承家族文化传统</li>
                </ul>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-amber-700 mb-2">现代取名融合</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 结合传统与现代审美</li>
                  <li>• 注重音韵搭配协调</li>
                  <li>• 寓意美好吉祥如意</li>
                </ul>
              </div>
            </div>
            <div className="mt-6">
              <Link 
                href="/"
                className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
              >
                开始为宝宝取名 →
              </Link>
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
                传承中华文化智慧，为每个家庭提供专业的取名服务。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">相关链接</h3>
              <div className="space-y-2">
                <Link href="/poetry" className="block text-gray-400 hover:text-white text-sm">
                  诗词典籍
                </Link>
                <Link href="/culture/overview" className="block text-gray-400 hover:text-white text-sm">
                  文化科普
                </Link>
                <Link href="/naming" className="block text-gray-400 hover:text-white text-sm">
                  专业取名
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">文化传承</h3>
              <div className="text-gray-400 text-sm space-y-1">
                <div>📜 百家姓</div>
                <div>📚 诗经楚辞</div>
                <div>🏛️ 传统文化</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 宝宝取名专家. 传承文化，守护传统.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BaijiaxingPage;
