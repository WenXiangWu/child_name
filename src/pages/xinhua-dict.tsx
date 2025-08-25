import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { Button, Input, Card, Loading } from '@/components/ui';
import { WordDataLoader, WordRecord } from '@/core/naming/word-loader';

interface SearchFilters {
  strokes?: number;
  pinyin?: string;
  radical?: string;
}

interface CharacterGroup {
  letter: string;
  characters: WordRecord[];
}

// 常用部首分类
const COMMON_RADICALS = [
  { name: '人部', radical: '人', description: '与人相关的字' },
  { name: '口部', radical: '口', description: '与说话、口相关的字' },
  { name: '心部', radical: '心', description: '与情感、思想相关的字' },
  { name: '手部', radical: '手', description: '与手、动作相关的字' },
  { name: '水部', radical: '水', description: '与水相关的字' },
  { name: '木部', radical: '木', description: '与植物相关的字' },
  { name: '火部', radical: '火', description: '与火相关的字' },
  { name: '土部', radical: '土', description: '与土地相关的字' },
  { name: '金部', radical: '金', description: '与金属相关的字' },
  { name: '日部', radical: '日', description: '与太阳、时间相关的字' },
  { name: '月部', radical: '月', description: '与月亮、肉体相关的字' },
  { name: '女部', radical: '女', description: '与女性相关的字' }
];

// 常用汉字推荐
const RECOMMENDED_CHARS = [
  '学', '文', '智', '慧', '德', '仁', '义', '礼', '信', '温', '雅', '静', 
  '美', '善', '真', '诚', '明', '亮', '清', '纯', '和', '平', '安', '康'
];

const XinhuaDictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<WordRecord[]>([]);
  const [selectedChar, setSelectedChar] = useState<WordRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [wordLoader] = useState(() => WordDataLoader.getInstance());
  const [activeTab, setActiveTab] = useState<'search' | 'browse' | 'radical'>('search');
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 搜索汉字
  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    // 添加到搜索历史
    if (term.length === 1 && !searchHistory.includes(term)) {
      setSearchHistory(prev => [term, ...prev.slice(0, 19)]); // 保留最近20个
    }

    setIsLoading(true);
    try {
      // 如果是单个汉字，直接查找
      if (term.length === 1) {
        const result = await wordLoader.getCharacterInfo(term);
        setSearchResults(result ? [result] : []);
        if (result) {
          setSelectedChar(result);
        }
      } else {
        // 多字符搜索，按字符分别查找
        const results: WordRecord[] = [];
        for (const char of term) {
          const result = await wordLoader.getCharacterInfo(char);
          if (result) {
            results.push(result);
          }
        }
        setSearchResults(results);
        if (results.length > 0) {
          setSelectedChar(results[0]);
        }
      }
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [wordLoader, searchHistory]);

  // 按笔画搜索
  const handleStrokeSearch = useCallback(async (strokes: number) => {
    setIsLoading(true);
    try {
      const chars = await wordLoader.getCharactersByStrokes(strokes);
      const results = await wordLoader.getCharactersInfo(chars.slice(0, 50)); // 限制结果数量
      setSearchResults(Array.from(results.values()));
    } catch (error) {
      console.error('按笔画搜索失败:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [wordLoader]);

  // 按拼音首字母搜索
  const handlePinyinSearch = useCallback(async (initial: string) => {
    setIsLoading(true);
    try {
      const chars = await wordLoader.getCharactersByPinyinInitial(initial);
      const results = await wordLoader.getCharactersInfo(chars.slice(0, 50)); // 限制结果数量
      setSearchResults(Array.from(results.values()));
    } catch (error) {
      console.error('按拼音搜索失败:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [wordLoader]);

  // 初始化word loader
  useEffect(() => {
    wordLoader.initialize().catch(console.error);
  }, [wordLoader]);

  return (
    <Layout 
      title="新华字典 - 汉字查询" 
      description="权威在线新华字典，支持汉字查询、笔画查找、拼音搜索、部首分类，传承中华文字文化"
    >
      <div className="min-h-screen bg-cultural-gradient">
        {/* 英雄区域 */}
        <section className="py-16 bg-cultural-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-cultural-gold rounded-full"></div>
            <div className="absolute top-32 right-20 w-24 h-24 border border-cultural-jade rotate-45"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-cultural-red/10 rounded-full"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold font-heading text-cultural-ink mb-6">
                📖 新华字典
              </h1>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                传承千年文字智慧，解读汉字深层内涵，为宝宝取名提供权威字典支持
              </p>
            </div>

            {/* 快捷功能导航 */}
            <div className="flex justify-center space-x-8 mb-8">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'search'
                    ? 'bg-cultural-gold text-white shadow-lg'
                    : 'bg-white text-cultural-ink hover:bg-cultural-gold/10'
                }`}
              >
                🔍 智能搜索
              </button>
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'browse'
                    ? 'bg-cultural-gold text-white shadow-lg'
                    : 'bg-white text-cultural-ink hover:bg-cultural-gold/10'
                }`}
              >
                📚 分类浏览
              </button>
              <button
                onClick={() => setActiveTab('radical')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'radical'
                    ? 'bg-cultural-gold text-white shadow-lg'
                    : 'bg-white text-cultural-ink hover:bg-cultural-gold/10'
                }`}
              >
                🏛️ 部首查字
              </button>
            </div>
          </div>
        </section>

        {/* 搜索区域 */}
        {activeTab === 'search' && (
          <section className="py-12">
            <div className="max-w-6xl mx-auto px-4">
              <Card variant="cultural" padding="lg" className="mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold font-heading text-cultural-ink mb-4">
                    🔍 智能汉字搜索
                  </h2>
                  <p className="text-gray-600">
                    输入汉字、拼音或笔画数，快速查找字典信息
                  </p>
                </div>

                <div className="space-y-6">
                  {/* 主搜索框 */}
                  <div className="relative">
                    <Input
                      label="汉字搜索"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                      placeholder="输入汉字、词语或拼音..."
                      leftIcon={<span>🔍</span>}
                      className="text-xl"
                    />
                    <div className="absolute right-2 top-9 flex space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSearch(searchTerm)}
                        disabled={isLoading}
                        loading={isLoading}
                      >
                        搜索
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHistory(!showHistory)}
                      >
                        📚
                      </Button>
                    </div>
                  </div>

                  {/* 搜索历史 */}
                  {showHistory && searchHistory.length > 0 && (
                    <Card padding="md" className="bg-cultural-paper/30">
                      <h4 className="text-sm font-semibold text-cultural-ink mb-3">最近搜索</h4>
                      <div className="flex flex-wrap gap-2">
                        {searchHistory.map((char, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchTerm(char);
                              handleSearch(char);
                              setShowHistory(false);
                            }}
                            className="px-3 py-1 bg-white rounded-lg text-cultural-ink hover:bg-cultural-gold/10 transition-colors"
                          >
                            {char}
                          </button>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* 快捷筛选 */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-cultural-ink mb-3">
                        按笔画查找
                      </label>
                      <select
                        value={filters.strokes || ''}
                        onChange={(e) => {
                          const strokes = parseInt(e.target.value);
                          if (strokes > 0) {
                            setFilters({ ...filters, strokes });
                            handleStrokeSearch(strokes);
                          }
                        }}
                        className="w-full px-4 py-3 border border-cultural-gold/30 rounded-xl focus:ring-2 focus:ring-cultural-gold focus:border-transparent bg-white"
                      >
                        <option value="">选择笔画数</option>
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num}画</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-cultural-ink mb-3">
                        按拼音查找
                      </label>
                      <select
                        value={filters.pinyin || ''}
                        onChange={(e) => {
                          const initial = e.target.value;
                          if (initial) {
                            setFilters({ ...filters, pinyin: initial });
                            handlePinyinSearch(initial);
                          }
                        }}
                        className="w-full px-4 py-3 border border-cultural-gold/30 rounded-xl focus:ring-2 focus:ring-cultural-gold focus:border-transparent bg-white"
                      >
                        <option value="">选择拼音首字母</option>
                        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                          <option key={letter} value={letter.toLowerCase()}>{letter}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setFilters({});
                          setSearchResults([]);
                          setSearchTerm('');
                          setSelectedChar(null);
                        }}
                        className="w-full"
                      >
                        🔄 清除筛选
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 搜索结果展示 */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* 搜索结果列表 */}
                <Card variant="cultural" padding="lg">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-cultural-ink">
                      搜索结果 ({searchResults.length})
                    </h3>
                    {searchResults.length > 0 && (
                      <span className="text-sm text-gray-500">
                        点击汉字查看详情
                      </span>
                    )}
                  </div>
                  
                  {isLoading ? (
                    <div className="text-center py-12">
                      <Loading variant="cultural" text="正在搜索汉字..." />
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {searchResults.map((char, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedChar(char)}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                            selectedChar?.word === char.word
                              ? 'border-cultural-gold bg-cultural-gold/10 shadow-lg'
                              : 'border-cultural-gold/20 hover:border-cultural-gold/40 hover:bg-cultural-paper/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-3xl font-bold text-cultural-ink">{char.word}</span>
                              <div>
                                <span className="text-lg text-cultural-jade font-medium">[{char.pinyin}]</span>
                                <div className="text-sm text-gray-500">{char.strokes}画 • {char.radicals}</div>
                              </div>
                            </div>
                            <div className="text-cultural-gold">
                              →
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {char.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 opacity-50">📖</div>
                      <p className="text-gray-500 mb-2">暂无搜索结果</p>
                      <p className="text-sm text-gray-400">请输入汉字或使用筛选条件进行搜索</p>
                    </div>
                  )}
                </Card>

                {/* 汉字详情展示 */}
                <Card variant="cultural" padding="lg">
                  <h3 className="text-xl font-bold text-cultural-ink mb-6">汉字详情</h3>
                  
                  {selectedChar ? (
                    <div className="space-y-8">
                      {/* 汉字展示 */}
                      <div className="text-center bg-cultural-paper/30 rounded-2xl p-8">
                        <div className="text-9xl font-bold text-cultural-ink mb-6 font-serif">
                          {selectedChar.word}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-white rounded-lg p-3">
                            <div className="text-cultural-jade font-semibold">拼音</div>
                            <div className="text-cultural-ink text-lg">{selectedChar.pinyin}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3">
                            <div className="text-cultural-jade font-semibold">笔画</div>
                            <div className="text-cultural-ink text-lg">{selectedChar.strokes}画</div>
                          </div>
                          <div className="bg-white rounded-lg p-3">
                            <div className="text-cultural-jade font-semibold">部首</div>
                            <div className="text-cultural-ink text-lg">{selectedChar.radicals}</div>
                          </div>
                          {selectedChar.oldword && selectedChar.oldword !== selectedChar.word && (
                            <div className="bg-white rounded-lg p-3">
                              <div className="text-cultural-jade font-semibold">繁体</div>
                              <div className="text-cultural-ink text-lg">{selectedChar.oldword}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 释义解释 */}
                      <div>
                        <h4 className="text-lg font-semibold text-cultural-ink mb-4 flex items-center">
                          <span className="mr-2">📝</span>
                          释义解释
                        </h4>
                        <div className="bg-cultural-paper/50 rounded-xl p-6">
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {selectedChar.explanation || '暂无释义信息'}
                          </p>
                        </div>
                      </div>

                      {/* 扩展信息 */}
                      {selectedChar.more && (
                        <div>
                          <h4 className="text-lg font-semibold text-cultural-ink mb-4 flex items-center">
                            <span className="mr-2">📚</span>
                            扩展信息
                          </h4>
                          <div className="bg-cultural-paper/50 rounded-xl p-6">
                            <p className="text-gray-700 leading-relaxed">
                              {selectedChar.more}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* 操作按钮 */}
                      <div className="flex space-x-4">
                        <Button
                          variant="primary"
                          onClick={() => {
                            // 复制汉字
                            navigator.clipboard.writeText(selectedChar.word);
                          }}
                          className="flex-1"
                        >
                          📋 复制汉字
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            // 分享功能
                            const text = `${selectedChar.word} [${selectedChar.pinyin}] - ${selectedChar.explanation}`;
                            navigator.clipboard.writeText(text);
                          }}
                          className="flex-1"
                        >
                          📤 分享释义
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="text-8xl mb-6 opacity-30">📖</div>
                      <p className="text-gray-500 text-lg mb-2">请选择一个汉字</p>
                      <p className="text-sm text-gray-400">查看详细的字典信息</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* 分类浏览 */}
        {activeTab === 'browse' && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4">
              <Card variant="cultural" padding="lg" className="mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold font-heading text-cultural-ink mb-4">
                    📚 常用汉字分类浏览
                  </h2>
                  <p className="text-gray-600">
                    精选适合取名的优质汉字，按分类整理便于查找
                  </p>
                </div>

                {/* 推荐汉字 */}
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-cultural-ink mb-6 flex items-center">
                    <span className="mr-2">⭐</span>
                    取名推荐汉字
                  </h3>
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
                    {RECOMMENDED_CHARS.map((char, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(char)}
                        className="aspect-square bg-white rounded-xl border-2 border-cultural-gold/20 hover:border-cultural-gold hover:bg-cultural-gold/10 transition-all duration-300 flex items-center justify-center text-2xl font-bold text-cultural-ink hover:scale-110"
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 拼音字母分类 */}
                <div>
                  <h3 className="text-xl font-bold text-cultural-ink mb-6 flex items-center">
                    <span className="mr-2">🔤</span>
                    按拼音首字母分类
                  </h3>
                  <div className="grid grid-cols-6 md:grid-cols-13 gap-3">
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                      <button
                        key={letter}
                        onClick={() => handlePinyinSearch(letter.toLowerCase())}
                        className="aspect-square bg-white rounded-lg border border-cultural-gold/30 hover:border-cultural-gold hover:bg-cultural-gold/10 transition-all duration-300 flex items-center justify-center text-lg font-bold text-cultural-ink hover:scale-105"
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* 部首查字 */}
        {activeTab === 'radical' && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4">
              <Card variant="cultural" padding="lg">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold font-heading text-cultural-ink mb-4">
                    🏛️ 部首查字
                  </h2>
                  <p className="text-gray-600">
                    按照汉字部首分类查找，了解汉字的造字规律和文化内涵
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {COMMON_RADICALS.map((radical, index) => (
                    <Card 
                      key={index}
                      padding="md" 
                      className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-cultural-gold/20 hover:border-cultural-gold/40"
                      onClick={() => {
                        // 这里可以添加按部首搜索的逻辑
                        handleSearch(radical.radical);
                      }}
                    >
                      <div className="text-center">
                        <div className="text-4xl font-bold text-cultural-ink mb-3">
                          {radical.radical}
                        </div>
                        <h4 className="text-lg font-semibold text-cultural-ink mb-2">
                          {radical.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {radical.description}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* 功能介绍 */}
        <section className="py-16 bg-cultural-paper">
          <div className="max-w-7xl mx-auto px-4">
            <Card variant="cultural" padding="lg">
              <h2 className="text-3xl font-bold font-heading text-cultural-ink mb-12 text-center">
                ✨ 字典功能特色
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cultural-red to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-cultural-ink mb-3">智能搜索</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    支持汉字、拼音、笔画等多种搜索方式，快速精准定位目标汉字
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cultural-jade to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">📚</span>
                  </div>
                  <h3 className="text-lg font-semibold text-cultural-ink mb-3">权威释义</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    基于权威字典数据，提供准确详细的汉字释义和文化内涵解读
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cultural-gold to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">🏛️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-cultural-ink mb-3">部首分类</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    按部首分类整理，帮助理解汉字造字规律和文化传承
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">⭐</span>
                  </div>
                  <h3 className="text-lg font-semibold text-cultural-ink mb-3">取名专用</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    精选适合取名的优质汉字，为宝宝取名提供专业字典支持
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default XinhuaDictionary;