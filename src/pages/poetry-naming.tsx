import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import NameCard from '@/components/NameCard';
import { usePoetryNamer } from '@/hooks/usePoetryNamer';
import { POETRY_BOOKS, PoetryBook } from '@/lib/poetry-namer';
import { cn } from '@/utils/cn';
import { createBaijiaxingSurnameInputHandler, getBaijiaxingList } from '@/utils/chineseValidation';

// 诗词来源的中文映射
const POETRY_SOURCE_MAP: Record<string, string> = {
  'tangshi': '唐诗',
  'songci': '宋词',
  'shijing': '诗经',
  'chuci': '楚辞',
  'lunyu': '论语',
  'mengzi': '孟子',
  'daxue': '大学',
  'zhongyong': '中庸',
  'yuanqu': '元曲',
  'huajianji': '花间集',
  'nantang': '南唐',
  'caocao': '曹操诗集',
  'shuimotangshi': '水墨唐诗',
  'nalanxingde': '纳兰性德',
  'youmengying': '幽梦影',
  'baijiaxing': '百家姓',
  'dizigui': '弟子规',
  'guwenguanzhi': '古文观止',
  'qianziwen': '千字文',
  'sanzijing': '三字经',
  'zengguangxianwen': '增广贤文',
  'youxueqionglin': '幼学琼林',
  'lidaiwenxuan': '历代文选'
};

/**
 * 获取诗词来源的中文名称
 * @param source 英文来源标识
 * @returns 中文来源名称
 */
function getChineseSourceName(source: string): string {
  return POETRY_SOURCE_MAP[source] || source;
}

export default function PoetryNaming() {
  const router = useRouter();
  const { gender, familyName } = router.query;
  
  const [lastName, setLastName] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [selectedBooks, setSelectedBooks] = useState<PoetryBook[]>([]);
  const [nameCount, setNameCount] = useState<number>(6);
  const [useCommonChars, setUseCommonChars] = useState<boolean>(true);
  const [nameLength, setNameLength] = useState<2 | 3>(2); // 名字长度：2字名或3字名
  
  // 初始化状态
  useEffect(() => {
    if (gender && (gender === 'male' || gender === 'female')) {
      setSelectedGender(gender as 'male' | 'female');
      // 根据性别设置默认典籍 - 男楚辞，女诗经
      const defaultBooks = gender === 'male' ? ['chuci', 'tangshi'] : ['shijing', 'songci'];
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
    useCommonChars,
    nameLength // 传递名字长度配置
  });
  
  // 错误状态管理
  const [surnameError, setSurnameError] = useState<string>('');
  const [isValidSurname, setIsValidSurname] = useState<boolean>(true);

  // 预加载百家姓数据
  useEffect(() => {
    getBaijiaxingList().catch(console.error);
  }, []);

  // 处理姓氏变更（带百家姓校验）
  const handleLastNameChange = createBaijiaxingSurnameInputHandler(
    (value: string) => {
      setLastName(value);
      clearNames(); // 清除之前的结果
    },
    (message: string) => {
      setSurnameError(message);
      // 如果有错误消息，3秒后自动清除
      if (message) {
        setTimeout(() => setSurnameError(''), 3000);
      }
    },
    (isValid: boolean) => {
      setIsValidSurname(isValid);
    }
  );
  
  // 处理性别变更
  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGender = e.target.value as 'male' | 'female';
    setSelectedGender(newGender);
    // 根据性别重新设置默认典籍 - 男楚辞，女诗经
    const defaultBooks = newGender === 'male' ? ['chuci', 'tangshi'] : ['shijing', 'songci'];
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
      {/* 区域1: 英雄区域 - 诗词文化主题 */}
      <section id="poetry-hero-section" className="relative bg-gradient-to-br from-cultural-paper via-white to-cultural-jade-50 overflow-hidden py-20 lg:py-32">
        {/* 简化的背景装饰 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-32 right-32 w-32 h-32 border border-cultural-gold/20 rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-24 h-24 border border-cultural-jade/20 rounded-full"></div>
        </div>

        <div className="relative max-w-8xl mx-auto px-10 text-center">
          <div className="space-y-12">
            {/* 区域1A: 页面标题区域 */}
            <div id="poetry-title-area" className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold font-heading text-cultural-ink leading-tight">
                  诗词取名
                </h1>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">📚</span>
                  <span className="text-sm text-cultural-ink/60 font-medium">传承文化智慧</span>
                </div>
              </div>
              
              <p className="text-xl lg:text-2xl text-cultural-ink/80 leading-relaxed max-w-4xl mx-auto">
                传承千年文化智慧，从经典诗词中为宝宝撷取美名
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-cultural-ink/60">
                <div className="flex items-center space-x-2">
                  <span className="text-cultural-red text-lg">📖</span>
                  <span>诗经楚辞</span>
                </div>
                <div className="w-px h-4 bg-cultural-gold/30"></div>
                <div className="flex items-center space-x-2">
                  <span className="text-cultural-jade text-lg">🎭</span>
                  <span>唐诗宋词</span>
                </div>
                <div className="w-px h-4 bg-cultural-gold/30"></div>
                <div className="flex items-center space-x-2">
                  <span className="text-cultural-gold text-lg">📜</span>
                  <span>论语老子</span>
                </div>
              </div>
            </div>

            {/* 区域1B: 传统文化特色说明 */}
            <div id="poetry-culture-features" className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: '👑',
                  title: '男楚辞，女诗经',
                  desc: '遵循传统取名智慧',
                  color: 'bg-cultural-red-500'
                },
                {
                  icon: '🎨',
                  title: '音韵之美',
                  desc: '平仄协调，朗朗上口',
                  color: 'bg-cultural-jade-500'
                },
                {
                  icon: '📖',
                  title: '文化内涵',
                  desc: '每个名字都有诗词出处',
                  color: 'bg-cultural-gold-500'
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-cultural-gold/40 transition-colors duration-200">
                  <div className="text-3xl mb-4 text-center">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-cultural-ink mb-2 text-center">{item.title}</h3>
                  <p className="text-cultural-ink/70 text-sm text-center">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 区域2: 主要内容区域 */}
      <section id="poetry-main-content" className="py-16 bg-gradient-to-b from-white to-cultural-paper/30">
        <div className="max-w-8xl mx-auto px-10">
          <div className="max-w-6xl mx-auto">
          
            {/* 区域2A: 配置面板 - 重新设计 */}
            <div id="poetry-config-panel" className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-12">
              {/* 面板标题 */}
              <div className="px-8 py-6 border-b border-gray-100">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-cultural-ink">
                    诗词取名配置
                  </h2>
                  <p className="text-cultural-ink/60 text-sm">
                    设置您的偏好，让诗词为宝宝献上最美的名字
                  </p>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* 区域2A1: 基础信息 - 卡片式布局 */}
                <div id="poetry-basic-info" className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* 姓氏输入 */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    <label className="flex items-center space-x-2 text-base font-semibold text-gray-700 mb-3">
                      <span className="text-lg">👤</span>
                      <span>宝宝姓氏</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={handleLastNameChange}
                      className={cn(
                        "w-full bg-white border rounded-lg px-3 py-2 text-center font-medium text-gray-800 focus:ring-2 focus:ring-cultural-ink/20 transition-colors duration-200",
                        surnameError 
                          ? "border-red-300 focus:border-red-500" 
                          : "border-gray-300 focus:border-cultural-ink"
                      )}
                      maxLength={2}
                      placeholder="李"
                    />
                    {surnameError ? (
                      <p className="text-xs text-red-600 mt-2 text-center animate-pulse">
                        ⚠️ {surnameError}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        请输入宝宝的姓氏
                      </p>
                    )}
                  </div>

                  {/* 性别选择 */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    <label className="flex items-center space-x-2 text-base font-semibold text-gray-700 mb-3">
                      <span className="text-lg">{selectedGender === 'male' ? '👦' : '👧'}</span>
                      <span>宝宝性别</span>
                    </label>
                    <select
                      value={selectedGender}
                      onChange={handleGenderChange}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-800 focus:border-cultural-ink focus:ring-2 focus:ring-cultural-ink/20 transition-colors duration-200"
                    >
                      <option value="male">👦 男孩</option>
                      <option value="female">👧 女孩</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {selectedGender === 'male' ? '男楚辞，浪漫深邃' : '女诗经，典雅温润'}
                    </p>
                  </div>

                  {/* 生成数量 */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    <label className="flex items-center space-x-2 text-base font-semibold text-gray-700 mb-3">
                      <span className="text-lg">🔢</span>
                      <span>生成数量</span>
                    </label>
                    <select
                      value={nameCount}
                      onChange={(e) => setNameCount(Number(e.target.value))}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-800 focus:border-cultural-ink focus:ring-2 focus:ring-cultural-ink/20 transition-colors duration-200"
                    >
                      <option value={6}>6个名字</option>
                      <option value={9}>9个名字</option>
                      <option value={12}>12个名字</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      生成 {nameCount} 个诗词名字
                    </p>
                  </div>

                  {/* 名字长度 */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    <label className="flex items-center space-x-2 text-base font-semibold text-gray-700 mb-3">
                      <span className="text-lg">📏</span>
                      <span>名字长度</span>
                    </label>
                    <select
                      value={nameLength}
                      onChange={(e) => setNameLength(Number(e.target.value) as 2 | 3)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-800 focus:border-cultural-ink focus:ring-2 focus:ring-cultural-ink/20 transition-colors duration-200"
                    >
                      <option value={2}>2字名</option>
                      <option value={3}>3字名</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {nameLength === 2 ? '如：浩然、思远' : '如：浩然宇、思远航'}
                    </p>
                  </div>

                  {/* 字符选择 */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    <label className="flex items-center space-x-2 text-base font-semibold text-gray-700 mb-3">
                      <span className="text-lg">🎯</span>
                      <span>字符偏好</span>
                    </label>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="useCommonChars"
                          checked={useCommonChars}
                          onChange={(e) => setUseCommonChars(e.target.checked)}
                          className="w-4 h-4 text-cultural-ink border-gray-300 rounded focus:ring-cultural-ink/20"
                        />
                        <label htmlFor="useCommonChars" className="text-sm font-medium text-gray-700">
                          只使用常用字
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {useCommonChars ? '✅ 更适合日常使用' : '⚠️ 可能包含生僻字'}
                      </p>
                    </div>
                  </div>
                </div>
            
                {/* 区域2A2: 典籍选择区域 */}
                <div id="poetry-books-selection" className="space-y-6">
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      选择诗词典籍
                    </h3>
                    <p className="text-gray-600 text-sm">
                      从经典文献中撷取美名，每本典籍都有独特的文化韵味
                    </p>
                    <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-lg px-4 py-2">
                      <span className="text-blue-600">💡</span>
                      <span className="text-sm text-blue-700">
                        推荐：{selectedGender === 'male' ? '男孩适合楚辞、唐诗' : '女孩适合诗经、宋词'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {POETRY_BOOKS.map((book) => {
                      const isSelected = selectedBooks.includes(book.value);
                      const bookIcons: Record<PoetryBook, string> = {
                        'shijing': '📖',
                        'chuci': '🎭', 
                        'tangshi': '🌸',
                        'songci': '🍃',
                        'yuefu': '🎵',
                        'gushi': '📜',
                        'cifu': '🏛️'
                      };
                      return (
                        <label key={book.value} className={cn(
                          'relative cursor-pointer block p-4 rounded-xl border-2 transition-colors duration-200',
                          isSelected 
                            ? 'border-cultural-ink bg-cultural-ink/5' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        )}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleBookChange(book.value, e.target.checked)}
                            className="sr-only"
                          />
                          
                          {/* 选中指示器 */}
                          <div className={cn(
                            'absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200',
                            isSelected 
                              ? 'bg-cultural-ink border-cultural-ink text-white' 
                              : 'border-gray-300 bg-white'
                          )}>
                            {isSelected && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="text-2xl text-center">
                              {bookIcons[book.value] || '📚'}
                            </div>
                            <div className="text-center">
                              <h4 className="text-base font-semibold text-gray-800 mb-1">
                                {book.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {book.dynasty}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {book.count}篇典藏
                              </p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
            
                {/* 区域2A3: 生成按钮区域 */}
                <div id="poetry-generate-button" className="text-center space-y-4">
                  <button
                    onClick={generateNames}
                    disabled={loading || selectedBooks.length === 0 || !lastName}
                    className={cn(
                      'inline-flex items-center space-x-3 px-6 py-3 rounded font-medium text-sm',
                      loading || selectedBooks.length === 0 || !lastName
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white'
                    )}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        <span>诗海寻名中...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">📚</span>
                        <span>开始诗词取名</span>
                      </>
                    )}
                  </button>
                  
                  {/* 错误提示 */}
                  {selectedBooks.length === 0 && (
                    <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 rounded-full px-6 py-3">
                      <span className="text-red-500 text-lg">⚠️</span>
                      <span className="text-red-700 font-medium">请至少选择一个典籍</span>
                    </div>
                  )}
                  
                  {!lastName && (
                    <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-200 rounded-full px-6 py-3">
                      <span className="text-orange-500 text-lg">📝</span>
                      <span className="text-orange-700 font-medium">请输入宝宝姓氏</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          
            {/* 区域2B: 错误提示 */}
            {error && (
              <div id="poetry-error-message" className="max-w-4xl mx-auto mb-12">
                <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="text-3xl">❌</div>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-red-800 mb-1">诗词取名遇到问题</h3>
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 区域2C: 结果展示区域 */}
            {names.length > 0 && (
              <div id="poetry-results-section" className="space-y-12">
                {/* 结果标题 */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center space-x-4 bg-white/90 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border border-cultural-gold/20">
                    <div className="text-3xl">📜</div>
                    <h2 className="text-3xl font-bold text-cultural-ink font-heading">
                      为您推荐的诗词名字
                    </h2>
                    <div className="text-3xl">✨</div>
                  </div>
                  <p className="text-cultural-ink/70 text-lg">
                    每个名字都承载着千年诗词的文化底蕴
                  </p>
                </div>
                
                {/* 区域2C1: 名字网格展示 */}
                <div id="poetry-names-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {names.map((name, index) => (
                    <div key={index} className="group relative bg-gradient-to-br from-white to-blue-50/30 rounded-xl border border-blue-100 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer" onClick={() => handleNameClick(name)}>
                      {/* 诗词来源标签 - 右上角 */}
                      {name.source?.type === 'poetry' && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg border-2 border-white font-medium">
                          {getChineseSourceName(name.source.book)}
                        </div>
                      )}
                      
                      {/* 名字主体内容 */}
                      <div className="space-y-4">
                        {/* 名字标题 */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors">
                              {name.familyName || lastName}
                              <span className="text-blue-600 ml-1">
                                {name.firstName}{name.secondName}{name.thirdName || ''}
                              </span>
                            </h3>
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                (name.popularity || 50) < 30 ? 'bg-emerald-100 text-emerald-700' :
                                (name.popularity || 50) < 70 ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {(name.popularity || 50) < 20 ? '罕见' :
                                 (name.popularity || 50) < 40 ? '少见' :
                                 (name.popularity || 50) < 60 ? '一般' :
                                 (name.popularity || 50) < 80 ? '常见' : '流行'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* 含义描述 */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-100/50">
                          <p className="text-gray-700 text-sm leading-relaxed">{name.meaning}</p>
                        </div>
                        
                        {/* 和谐度指标 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-semibold">和谐度</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 w-24 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min(100 - (name.popularity || 50)/2, 95)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600 font-medium">
                              {Math.round(Math.min(100 - (name.popularity || 50)/2, 95))}%
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700 transition-colors">
                            <span className="text-xs font-medium">查看详情</span>
                            <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 区域2C2: 操作按钮区域 */}
                <div id="poetry-action-buttons" className="flex items-center justify-center space-x-6">
                  <button
                    onClick={generateNames}
                    disabled={loading}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-2 rounded border text-sm',
                      loading 
                        ? 'border-gray-300 text-gray-500 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700'
                    )}
                  >
                    <span>🔄</span>
                    <span className="font-medium">再生成一批</span>
                  </button>
                  
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex items-center space-x-2 px-4 py-2 rounded border border-gray-300 text-gray-700 text-sm"
                  >
                    <span>⬆️</span>
                    <span className="font-medium">重新配置</span>
                  </button>
                </div>
              </div>
            )}
          
          </div>
        </div>
      </section>

      {/* 区域3: 底部装饰区域 */}
      <section id="poetry-footer-decoration" className="py-16 bg-gradient-to-r from-cultural-paper via-cultural-jade-50 to-cultural-gold-50">
        <div className="max-w-8xl mx-auto px-10 text-center">
          <div className="space-y-8">
            <div className="text-6xl opacity-30">📚✨🎭</div>
            <div className="max-w-4xl mx-auto space-y-4">
              <h3 className="text-2xl font-bold text-cultural-ink font-heading">
                传承千年文化，为宝宝取一个好名字
              </h3>
              <p className="text-cultural-ink/70 leading-relaxed">
                每个名字都承载着深厚的文化内涵，让宝宝的人生从一个美好的名字开始
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}