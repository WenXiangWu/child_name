import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { WordDataLoader, WordRecord } from '@/core/naming/word-loader';

interface SearchFilters {
  strokes?: number;
  pinyin?: string;
  radical?: string;
}

const XinhuaDictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<WordRecord[]>([]);
  const [selectedChar, setSelectedChar] = useState<WordRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [wordLoader] = useState(() => WordDataLoader.getInstance());

  // 搜索汉字
  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // 如果是单个汉字，直接查找
      if (term.length === 1) {
        const result = await wordLoader.getCharacterInfo(term);
        setSearchResults(result ? [result] : []);
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
      }
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [wordLoader]);

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
    <Layout title="新华字典 - 汉字查询" description="在线新华字典，支持汉字查询、笔画查找、拼音搜索">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">📖 新华字典</h1>
          <p className="text-xl text-gray-600">汉字查询 • 释义解析 • 拼音笔画</p>
        </div>

        {/* 搜索区域 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* 主搜索框 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                汉字搜索
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                  placeholder="输入汉字或词语..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleSearch(searchTerm)}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? '搜索中...' : '搜索'}
                </button>
              </div>
            </div>

            {/* 筛选器 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 按笔画筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">选择笔画数</option>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}画</option>
                  ))}
                </select>
              </div>

              {/* 按拼音首字母筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">选择拼音首字母</option>
                  {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                    <option key={letter} value={letter.toLowerCase()}>{letter}</option>
                  ))}
                </select>
              </div>

              {/* 清除筛选 */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({});
                    setSearchResults([]);
                    setSearchTerm('');
                  }}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  清除筛选
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 搜索结果列表 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                搜索结果 ({searchResults.length})
              </h2>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">搜索中...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.map((char, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedChar(char)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedChar?.word === char.word
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-gray-800">{char.word}</span>
                          <span className="text-sm text-gray-500">[{char.pinyin}]</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {char.strokes}画
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {char.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>暂无搜索结果</p>
                  <p className="text-sm mt-1">请输入汉字或使用筛选条件进行搜索</p>
                </div>
              )}
            </div>

            {/* 汉字详情 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">汉字详情</h2>
              
              {selectedChar ? (
                <div className="space-y-6">
                  {/* 汉字基本信息 */}
                  <div className="text-center border-b pb-6">
                    <div className="text-8xl font-bold text-gray-800 mb-4">{selectedChar.word}</div>
                    <div className="space-y-2">
                      <p className="text-lg text-gray-600">
                        拼音：<span className="font-medium">{selectedChar.pinyin}</span>
                      </p>
                      <p className="text-lg text-gray-600">
                        笔画：<span className="font-medium">{selectedChar.strokes}画</span>
                      </p>
                      <p className="text-lg text-gray-600">
                        部首：<span className="font-medium">{selectedChar.radicals}</span>
                      </p>
                      {selectedChar.oldword && selectedChar.oldword !== selectedChar.word && (
                        <p className="text-lg text-gray-600">
                          繁体：<span className="font-medium">{selectedChar.oldword}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 释义 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">释义</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedChar.explanation || '暂无释义信息'}
                      </p>
                    </div>
                  </div>

                  {/* 扩展信息 */}
                  {selectedChar.more && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">扩展信息</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">
                          {selectedChar.more}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📖</div>
                  <p>请从左侧选择一个汉字</p>
                  <p className="text-sm mt-1">查看详细信息</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">使用说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <h4 className="font-medium mb-2">🔍 搜索功能</h4>
                <ul className="space-y-1">
                  <li>• 输入单个汉字或词语进行查询</li>
                  <li>• 按笔画数筛选汉字</li>
                  <li>• 按拼音首字母分类查找</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">📚 字典信息</h4>
                <ul className="space-y-1">
                  <li>• 汉字拼音、笔画、部首</li>
                  <li>• 详细释义和扩展信息</li>
                  <li>• 繁简体对照</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default XinhuaDictionary;