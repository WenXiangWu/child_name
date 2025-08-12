import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import NameCard from '@/components/NameCard';
import { usePoetryNamer } from '@/hooks/usePoetryNamer';
import { POETRY_BOOKS, PoetryBook } from '@/lib/poetry-namer';

export default function PoetryNaming() {
  const router = useRouter();
  const { gender, familyName } = router.query;
  
  const [lastName, setLastName] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [selectedBooks, setSelectedBooks] = useState<PoetryBook[]>([]);
  const [nameCount, setNameCount] = useState<number>(6);
  const [useCommonChars, setUseCommonChars] = useState<boolean>(true);
  
  // 初始化状态
  useEffect(() => {
    if (gender && (gender === 'male' || gender === 'female')) {
      setSelectedGender(gender as 'male' | 'female');
      // 根据性别设置默认典籍
      const defaultBooks = gender === 'male' ? ['shijing', 'tangshi'] : ['chuci', 'songci'];
      setSelectedBooks(defaultBooks as PoetryBook[]);
    }
    
    if (familyName && typeof familyName === 'string') {
      setLastName(familyName);
    } else {
      setLastName('李'); // 默认姓氏
    }
  }, [gender, familyName]);
  
  // 使用诗词取名Hook
  const { 
    names, 
    loading, 
    error, 
    generateNames,
    clearNames
  } = usePoetryNamer({
    familyName: lastName,
    gender: selectedGender,
    books: selectedBooks,
    nameCount,
    avoidedWords: [],
    useCommonChars
  });
  
  // 处理姓氏变更
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    clearNames(); // 清除之前的结果
  };
  
  // 处理性别变更
  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGender = e.target.value as 'male' | 'female';
    setSelectedGender(newGender);
    // 根据性别重新设置默认典籍
    const defaultBooks = newGender === 'male' ? ['shijing', 'tangshi'] : ['chuci', 'songci'];
    setSelectedBooks(defaultBooks as PoetryBook[]);
    clearNames();
  };
  
  // 处理典籍选择
  const handleBookChange = (book: PoetryBook, checked: boolean) => {
    if (checked) {
      setSelectedBooks(prev => [...prev, book]);
    } else {
      setSelectedBooks(prev => prev.filter(b => b !== book));
    }
    clearNames();
  };
  
  // 处理名字点击
  const handleNameClick = (name: any) => {
    // 如果有诗词来源信息，跳转到特殊的诗词名字详情页
    if (name.source?.type === 'poetry') {
      router.push({
        pathname: '/poetry-name-detail',
        query: {
          familyName: name.familyName,
          firstName: name.firstName,
          secondName: name.secondName,
          book: name.source.book,
          title: name.source.title,
          author: name.source.author || '',
          dynasty: name.source.dynasty,
          sentence: name.source.sentence
        }
      });
    } else {
      // 普通名字跳转到普通详情页
      router.push(`/name/${name.familyName}-${name.firstName}-${name.secondName}`);
    }
  };

  return (
    <Layout
      title={`诗词取名 - ${selectedGender === 'male' ? '男' : '女'}宝宝 - 宝宝取名网`}
      description={`基于中华传统经典诗词文学，为您的${selectedGender === 'male' ? '男' : '女'}宝宝生成富有文化内涵的名字`}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              ✨ 诗词取名
            </h1>
            <p className="text-lg text-gray-600">
              翻阅经典，与一个好名字不期而遇
            </p>
            <div className="mt-4 text-sm text-gray-500">
              基于{selectedGender === 'male' ? '"男诗经，女楚辞"' : '"男诗经，女楚辞"'}的传统智慧
            </div>
          </div>
          
          {/* 配置面板 */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📝 取名配置
            </h2>
            
            {/* 基础信息 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓氏
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={handleLastNameChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  maxLength={2}
                  placeholder="请输入姓氏"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  性别
                </label>
                <select
                  value={selectedGender}
                  onChange={handleGenderChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="male">男孩</option>
                  <option value="female">女孩</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  生成数量
                </label>
                <select
                  value={nameCount}
                  onChange={(e) => setNameCount(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={6}>6个名字</option>
                  <option value={9}>9个名字</option>
                  <option value={12}>12个名字</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎯 字符选择
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useCommonChars"
                    checked={useCommonChars}
                    onChange={(e) => setUseCommonChars(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="useCommonChars" className="text-sm text-gray-700">
                    只使用常用字 (推荐)
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {useCommonChars ? '✅ 生成的名字只包含常用汉字，更适合实际使用' : '⚠️ 可能包含生僻字，请谨慎使用'}
                </p>
              </div>
            </div>
            
            {/* 典籍选择 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                📚 选择典籍 (可多选)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {POETRY_BOOKS.map((book) => (
                  <label key={book.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book.value)}
                      onChange={(e) => handleBookChange(book.value, e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">
                        {book.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {book.dynasty} · {book.count}篇
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              
              {/* 性别推荐提示 */}
              <div className="mt-3 text-xs text-gray-500">
                💡 推荐：{selectedGender === 'male' ? '男孩适合诗经、唐诗' : '女孩适合楚辞、宋词'}
              </div>
            </div>
            
            {/* 生成按钮 */}
            <div className="text-center">
              <button
                onClick={generateNames}
                disabled={loading || selectedBooks.length === 0 || !lastName}
                className={`px-8 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                  loading || selectedBooks.length === 0 || !lastName
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>诗海寻名中...</span>
                  </div>
                ) : (
                  <span>🎭 开始诗词取名</span>
                )}
              </button>
              
              {selectedBooks.length === 0 && (
                <div className="mt-2 text-sm text-red-500">
                  请至少选择一个典籍
                </div>
              )}
            </div>
          </div>
          
          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">❌</span>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
          
          {/* 结果展示 */}
          {names.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                📜 为您推荐的诗词名字
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {names.map((name, index) => (
                  <div key={index} className="relative">
                    <NameCard
                      familyName={name.familyName || lastName}
                      givenName={`${name.firstName}${name.secondName}`}
                      meaning={name.meaning}
                      popularity={name.popularity}
                      onClick={() => handleNameClick(name)}
                    />
                    
                    {/* 诗词来源标识 */}
                    {name.source?.type === 'poetry' && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                        {name.source.book}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* 重新生成按钮 */}
              <div className="text-center mt-8">
                <button
                  onClick={generateNames}
                  disabled={loading}
                  className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                >
                  🔄 再生成一批
                </button>
              </div>
            </div>
          )}
          
          {/* 返回按钮 */}
          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              ← 返回首页
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}