/**
 * 国家通用规范汉字表查询页面
 * 提供汉字查询、验证和相关信息展示
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StandardCharactersValidator } from '../lib/qiming/standard-characters-validator';

const StandardCharactersPage: React.FC = () => {
  const [validator, setValidator] = useState<StandardCharactersValidator | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchMode, setSearchMode] = useState<'single' | 'batch'>('single');
  const [batchInput, setBatchInput] = useState('');
  const [batchResults, setBatchResults] = useState<any[]>([]);

  useEffect(() => {
    const initValidator = async () => {
      try {
        const validatorInstance = StandardCharactersValidator.getInstance();
        await validatorInstance.initialize();
        setValidator(validatorInstance);
        setLoading(false);
      } catch (error) {
        console.error('初始化验证器失败:', error);
        setLoading(false);
      }
    };

    initValidator();
  }, []);

  const handleSingleSearch = () => {
    if (!validator || !searchQuery.trim()) return;
    
    const char = searchQuery.trim().charAt(0);
    const isStandard = validator.isStandardCharacter(char);
    const duoyinReadings = validator.getDuoyinReadings(char);
    const simplified = validator.toSimplified(char);
    const traditional = validator.toTraditional(char);
    
    setSearchResults({
      char,
      isStandard,
      duoyinReadings,
      simplified: simplified !== char ? simplified : null,
      traditional: traditional !== char ? traditional : null
    });
  };

  const handleBatchSearch = () => {
    if (!validator || !batchInput.trim()) return;
    
    const chars = Array.from(batchInput.trim());
    const results = chars.map(char => {
      const isStandard = validator.isStandardCharacter(char);
      const duoyinReadings = validator.getDuoyinReadings(char);
      
      return {
        char,
        isStandard,
        duoyinReadings
      };
    });
    
    setBatchResults(results);
  };

  const clearResults = () => {
    setSearchResults(null);
    setBatchResults([]);
    setSearchQuery('');
    setBatchInput('');
  };

  const stats = validator?.getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载汉字表数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-green-600">🏛️</span>
                宝宝取名专家
              </Link>
              <h1 className="text-lg font-semibold text-gray-700">
                国家通用规范汉字表
              </h1>
            </div>
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              返回首页
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 页面标题和介绍 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            国家通用规范汉字表
          </h2>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-green-800">官方权威标准</h3>
                <p className="text-green-700 mt-2">
                  2013年6月5日由中华人民共和国教育部、国家语言文字工作委员会发布
                </p>
              </div>
            </div>
            
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {stats.standardCharsCount}
                  </div>
                  <div className="text-sm text-green-700 font-medium">标准汉字</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.duoyinCount}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">多音字</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {stats.simplifiedMappingCount}
                  </div>
                  <div className="text-sm text-purple-700 font-medium">繁→简映射</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {stats.traditionalMappingCount}
                  </div>
                  <div className="text-sm text-orange-700 font-medium">简→繁映射</div>
                </div>
              </div>
            )}
          </div>

          {/* 官方链接 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">官方文档链接</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="http://www.moe.gov.cn/jyb_sjzl/ziliao/A19/201306/t20130601_186002.html"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>📄</span>
                教育部官方公告
              </a>
              <a 
                href="https://zh.wiktionary.org/wiki/Appendix:通用规范汉字表"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <span>📚</span>
                维基词典汉字表
              </a>
              <a 
                href="https://github.com/jaywcjlove/table-of-general-standard-chinese-characters"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <span>💾</span>
                开源数据项目
              </a>
            </div>
          </div>
        </div>

        {/* 查询功能 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">快速查询</h3>
          
          {/* 查询模式切换 */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setSearchMode('single')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  searchMode === 'single'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                单字查询
              </button>
              <button
                onClick={() => setSearchMode('batch')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  searchMode === 'batch'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                批量查询
              </button>
            </div>
          </div>

          {/* 单字查询 */}
          {searchMode === 'single' && (
            <div className="max-w-md mx-auto">
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="输入要查询的汉字"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl"
                  maxLength={1}
                />
                <button
                  onClick={handleSingleSearch}
                  disabled={!searchQuery.trim()}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  查询
                </button>
              </div>

              {/* 单字查询结果 */}
              {searchResults && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <span className="text-6xl font-bold text-gray-800">
                      {searchResults.char}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-center">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        searchResults.isStandard
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {searchResults.isStandard ? '✅ 标准汉字' : '❌ 非标准汉字'}
                      </span>
                    </div>
                    
                    {searchResults.duoyinReadings && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">多音字读音:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {searchResults.duoyinReadings.map((reading: string, index: number) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {reading}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {(searchResults.simplified || searchResults.traditional) && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">简繁转换:</p>
                        <div className="flex justify-center gap-4">
                          {searchResults.simplified && (
                            <span className="text-sm">
                              繁体: <span className="font-bold text-lg">{searchResults.char}</span> → 
                              简体: <span className="font-bold text-lg">{searchResults.simplified}</span>
                            </span>
                          )}
                          {searchResults.traditional && (
                            <span className="text-sm">
                              简体: <span className="font-bold text-lg">{searchResults.char}</span> → 
                              繁体: <span className="font-bold text-lg">{searchResults.traditional}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 批量查询 */}
          {searchMode === 'batch' && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <textarea
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  placeholder="输入要查询的文字或句子，每个字符都会被验证"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-600">
                    {batchInput.length} 个字符
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={clearResults}
                      className="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm"
                    >
                      清空
                    </button>
                    <button
                      onClick={handleBatchSearch}
                      disabled={!batchInput.trim()}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      批量查询
                    </button>
                  </div>
                </div>
              </div>

              {/* 批量查询结果 */}
              {batchResults.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">查询结果</h4>
                    <div className="text-sm text-gray-600">
                      总计 {batchResults.length} 个字符，
                      其中 {batchResults.filter(r => r.isStandard).length} 个标准汉字，
                      {batchResults.filter(r => !r.isStandard).length} 个非标准字符
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-15 gap-2">
                    {batchResults.map((result, index) => (
                      <div
                        key={index}
                        className={`text-center p-3 rounded-lg border ${
                          result.isStandard
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                        title={`${result.char} - ${result.isStandard ? '标准汉字' : '非标准字符'}${
                          result.duoyinReadings ? `\n读音: ${result.duoyinReadings.join(', ')}` : ''
                        }`}
                      >
                        <div className="text-lg font-bold text-gray-800 mb-1">
                          {result.char}
                        </div>
                        <div className={`text-xs ${
                          result.isStandard ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.isStandard ? '✓' : '✗'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 使用说明 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">使用说明</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-3">单字查询</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• 输入单个汉字进行查询</li>
                <li>• 显示是否为通用规范汉字表中的标准汉字</li>
                <li>• 如果是多音字，显示所有读音</li>
                <li>• 提供简繁体转换信息</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-3">批量查询</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• 输入文字或句子进行批量验证</li>
                <li>• 逐字验证是否为标准汉字</li>
                <li>• 绿色表示标准汉字，红色表示非标准字符</li>
                <li>• 鼠标悬停显示详细信息</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-lg font-semibold text-yellow-800 mb-2">重要提示</h4>
            <p className="text-yellow-700 text-sm">
              本系统基于2013年教育部发布的《通用规范汉字表》，收录8105个标准汉字。
              在起名时建议使用标准汉字，确保名字的规范性和官方认可度。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardCharactersPage;
