/**
 * 国家通用规范汉字表查询页面
 * 提供汉字查询、验证和相关信息展示
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CulturalTreasureTemplate } from '@/components/Layout';
import { Button, Card, Input } from '@/components/ui';
import { StandardCharactersValidator } from '../core/analysis/standard-characters-validator';

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



  const statsData = stats ? [
    { label: '标准汉字', value: stats.standardCharsCount, icon: '📝' },
    { label: '多音字', value: stats.duoyinCount, icon: '🔊' },
    { label: '繁→简映射', value: stats.simplifiedMappingCount, icon: '📖' },
    { label: '简→繁映射', value: stats.traditionalMappingCount, icon: '📚' }
  ] : [];

  if (loading) {
    return (
      <CulturalTreasureTemplate
        title="国家通用规范汉字表 - 官方权威标准"
        description="正在加载汉字表数据，请稍候..."
        pageTitle="规范汉字表"
        pageSubtitle="加载中..."
        icon="🏛️"
      >
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cultural-jade border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-xl text-cultural-ink font-heading">正在加载汉字表数据...</p>
            <p className="text-sm text-gray-600 mt-2">国家权威标准，规范用字典范</p>
          </div>
        </div>
      </CulturalTreasureTemplate>
    );
  }

  return (
    <CulturalTreasureTemplate
      title="国家通用规范汉字表 - 官方权威标准"
      description="2013年6月5日由中华人民共和国教育部、国家语言文字工作委员会发布的官方权威标准，收录8105个规范汉字"
      pageTitle="国家通用规范汉字表"
      pageSubtitle="官方权威标准 · 规范用字典范"
      icon="🏛️"

      stats={statsData}
    >
        {/* 官方权威标识 */}
        <Card variant="cultural" className="mb-8 shadow-cultural-lg border-2 border-cultural-jade/30">
          <div className="p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cultural-jade to-cultural-gold rounded-full flex items-center justify-center shadow-cultural mr-4">
                <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-cultural-jade font-heading">官方权威标准</h3>
                <p className="text-cultural-ink mt-2 font-medium">
                  中华人民共和国教育部、国家语言文字工作委员会发布
                </p>
                <p className="text-sm text-gray-600 mt-1">2013年6月5日正式颁布实施</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 官方链接 */}
        <Card variant="cultural" className="mb-8 shadow-cultural-lg">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-cultural-ink font-heading mb-6 text-center">官方文档链接</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a 
                href="http://www.moe.gov.cn/jyb_sjzl/ziliao/A19/201306/t20130601_186002.html"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card hover className="text-center p-6 bg-gradient-to-br from-cultural-jade/10 to-cultural-jade/5 border-2 border-cultural-jade/30 hover:border-cultural-jade/50 shadow-cultural hover:shadow-cultural-lg transition-all duration-300">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📄</div>
                  <h4 className="font-bold text-cultural-jade mb-2 font-heading">教育部官方公告</h4>
                  <p className="text-sm text-gray-600">查看官方发布文件</p>
                </Card>
              </a>
              
              <a 
                href="https://zh.wiktionary.org/wiki/Appendix:通用规范汉字表"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card hover className="text-center p-6 bg-gradient-to-br from-cultural-gold/10 to-cultural-gold/5 border-2 border-cultural-gold/30 hover:border-cultural-gold/50 shadow-cultural hover:shadow-cultural-lg transition-all duration-300">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📚</div>
                  <h4 className="font-bold text-cultural-gold mb-2 font-heading">维基词典汉字表</h4>
                  <p className="text-sm text-gray-600">在线查阅完整字表</p>
                </Card>
              </a>
              
              <a 
                href="https://github.com/jaywcjlove/table-of-general-standard-chinese-characters"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card hover className="text-center p-6 bg-gradient-to-br from-cultural-red/10 to-cultural-red/5 border-2 border-cultural-red/30 hover:border-cultural-red/50 shadow-cultural hover:shadow-cultural-lg transition-all duration-300">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💾</div>
                  <h4 className="font-bold text-cultural-red mb-2 font-heading">开源数据项目</h4>
                  <p className="text-sm text-gray-600">获取结构化数据</p>
                </Card>
              </a>
            </div>
          </div>
        </Card>

        {/* 查询功能 */}
        <Card variant="cultural" className="mb-8 shadow-cultural-lg">
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-cultural-ink font-heading mb-4">快速查询</h3>
              <p className="text-cultural-gold font-medium">验证汉字是否符合国家规范标准</p>
            </div>
            
            {/* 查询模式切换 */}
            <div className="flex justify-center mb-8">
              <div className="bg-cultural-paper/50 rounded-2xl p-2 flex border-2 border-cultural-gold/30">
                <button
                  onClick={() => setSearchMode('single')}
                  className={`px-6 py-3 rounded-xl font-medium font-heading transition-all duration-300 ${
                    searchMode === 'single'
                      ? 'bg-gradient-to-r from-cultural-jade to-cultural-gold text-white shadow-cultural'
                      : 'text-cultural-ink hover:text-cultural-red hover:bg-cultural-paper/50'
                  }`}
                >
                  单字查询
                </button>
                <button
                  onClick={() => setSearchMode('batch')}
                  className={`px-6 py-3 rounded-xl font-medium font-heading transition-all duration-300 ${
                    searchMode === 'batch'
                      ? 'bg-gradient-to-r from-cultural-jade to-cultural-gold text-white shadow-cultural'
                      : 'text-cultural-ink hover:text-cultural-red hover:bg-cultural-paper/50'
                  }`}
                >
                  批量查询
                </button>
              </div>
            </div>

            {/* 单字查询 */}
            {searchMode === 'single' && (
              <div className="max-w-lg mx-auto">
                <div className="flex gap-4 mb-8">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="输入要查询的汉字"
                    className="flex-1 text-center text-3xl font-heading"
                    maxLength={1}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSingleSearch}
                    disabled={!searchQuery.trim()}
                    className="px-8 shadow-cultural"
                  >
                    查询
                  </Button>
                </div>

                {/* 单字查询结果 */}
                {searchResults && (
                  <Card variant="cultural" className="shadow-cultural border-2 border-cultural-gold/30">
                    <div className="p-8">
                      <div className="text-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-cultural-jade to-cultural-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-cultural">
                          <span className="text-4xl font-bold text-white font-heading">
                            {searchResults.char}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="text-center">
                          <span className={`inline-flex items-center px-6 py-3 rounded-2xl text-lg font-bold font-heading shadow-cultural ${
                            searchResults.isStandard
                              ? 'bg-gradient-to-r from-cultural-jade to-cultural-gold text-white'
                              : 'bg-gradient-to-r from-cultural-red to-red-600 text-white'
                          }`}>
                            {searchResults.isStandard ? '✅ 标准汉字' : '❌ 非标准汉字'}
                          </span>
                        </div>
                        
                        {searchResults.duoyinReadings && (
                          <div className="bg-cultural-paper/50 rounded-2xl p-6 border border-cultural-gold/30">
                            <div className="text-center mb-4">
                              <h4 className="font-bold text-cultural-ink font-heading flex items-center justify-center">
                                <span className="mr-2">🔊</span>
                                多音字读音
                              </h4>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3">
                              {searchResults.duoyinReadings.map((reading: string, index: number) => (
                                <span key={index} className="bg-gradient-to-r from-cultural-jade/20 to-cultural-gold/20 text-cultural-ink px-4 py-2 rounded-xl text-lg font-medium border border-cultural-gold/30">
                                  {reading}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {(searchResults.simplified || searchResults.traditional) && (
                          <div className="bg-cultural-paper/50 rounded-2xl p-6 border border-cultural-gold/30">
                            <div className="text-center mb-4">
                              <h4 className="font-bold text-cultural-ink font-heading flex items-center justify-center">
                                <span className="mr-2">📖</span>
                                简繁转换
                              </h4>
                            </div>
                            <div className="space-y-3">
                              {searchResults.simplified && (
                                <div className="text-center bg-white/50 rounded-xl p-4 border border-cultural-jade/30">
                                  <span className="text-lg">
                                    繁体: <span className="font-bold text-2xl text-cultural-red font-heading">{searchResults.char}</span> → 
                                    简体: <span className="font-bold text-2xl text-cultural-jade font-heading">{searchResults.simplified}</span>
                                  </span>
                                </div>
                              )}
                              {searchResults.traditional && (
                                <div className="text-center bg-white/50 rounded-xl p-4 border border-cultural-gold/30">
                                  <span className="text-lg">
                                    简体: <span className="font-bold text-2xl text-cultural-jade font-heading">{searchResults.char}</span> → 
                                    繁体: <span className="font-bold text-2xl text-cultural-red font-heading">{searchResults.traditional}</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* 批量查询 */}
            {searchMode === 'batch' && (
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <textarea
                    value={batchInput}
                    onChange={(e) => setBatchInput(e.target.value)}
                    placeholder="输入要查询的文字或句子，每个字符都会被验证..."
                    className="w-full px-6 py-4 border-2 border-cultural-gold/30 rounded-2xl focus:ring-4 focus:ring-cultural-gold/20 focus:border-cultural-gold transition-all duration-300 bg-white/90 backdrop-blur-sm font-heading text-lg"
                    rows={6}
                  />
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center text-cultural-jade">
                        <span className="mr-1">📝</span>
                        {batchInput.length} 个字符
                      </span>
                      {batchResults.length > 0 && (
                        <span className="flex items-center text-cultural-gold">
                          <span className="mr-1">✅</span>
                          {batchResults.filter(r => r.isStandard).length} 个标准汉字
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        onClick={clearResults}
                        size="sm"
                      >
                        清空
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleBatchSearch}
                        disabled={!batchInput.trim()}
                        className="shadow-cultural"
                      >
                        批量查询
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 批量查询结果 */}
                {batchResults.length > 0 && (
                  <Card variant="cultural" className="shadow-cultural border-2 border-cultural-gold/30">
                    <div className="p-8">
                      <div className="mb-6">
                        <h4 className="text-2xl font-bold text-cultural-ink font-heading mb-4 text-center">查询结果</h4>
                        <div className="bg-cultural-paper/50 rounded-2xl p-6 border border-cultural-gold/30">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <span className="text-2xl">📊</span>
                              <div>
                                <div className="text-2xl font-bold text-cultural-ink">{batchResults.length}</div>
                                <div className="text-sm text-gray-600">总字符数</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                              <span className="text-2xl">✅</span>
                              <div>
                                <div className="text-2xl font-bold text-cultural-jade">{batchResults.filter(r => r.isStandard).length}</div>
                                <div className="text-sm text-gray-600">标准汉字</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                              <span className="text-2xl">❌</span>
                              <div>
                                <div className="text-2xl font-bold text-cultural-red">{batchResults.filter(r => !r.isStandard).length}</div>
                                <div className="text-sm text-gray-600">非标准字符</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-3">
                        {batchResults.map((result, index) => (
                          <div
                            key={index}
                            className={`text-center p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-110 cursor-pointer group ${
                              result.isStandard
                                ? 'bg-gradient-to-br from-cultural-jade/10 to-cultural-jade/5 border-cultural-jade/30 hover:border-cultural-jade/50'
                                : 'bg-gradient-to-br from-cultural-red/10 to-cultural-red/5 border-cultural-red/30 hover:border-cultural-red/50'
                            }`}
                            title={`${result.char} - ${result.isStandard ? '标准汉字' : '非标准字符'}${
                              result.duoyinReadings ? `\n读音: ${result.duoyinReadings.join(', ')}` : ''
                            }`}
                          >
                            <div className="text-2xl font-bold text-cultural-ink mb-2 font-heading group-hover:scale-110 transition-transform duration-300">
                              {result.char}
                            </div>
                            <div className={`text-lg font-bold ${
                              result.isStandard ? 'text-cultural-jade' : 'text-cultural-red'
                            }`}>
                              {result.isStandard ? '✓' : '✗'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}
        </div>

        </Card>

        {/* 使用说明 */}
        <Card variant="cultural" className="mt-8 shadow-cultural-lg">
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-cultural-ink font-heading mb-4">使用说明</h3>
              <p className="text-cultural-gold font-medium">了解查询功能，规范用字标准</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card hover className="p-6 bg-gradient-to-br from-cultural-jade/10 to-cultural-jade/5 border-2 border-cultural-jade/30 hover:border-cultural-jade/50 shadow-cultural hover:shadow-cultural-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cultural-jade to-cultural-gold rounded-full flex items-center justify-center mr-4 shadow-cultural">
                    <span className="text-xl">📝</span>
                  </div>
                  <h4 className="text-xl font-bold text-cultural-jade font-heading">单字查询</h4>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2 text-cultural-jade">•</span>
                    <span>输入单个汉字进行精确查询</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-cultural-jade">•</span>
                    <span>显示是否为国家规范汉字</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-cultural-jade">•</span>
                    <span>多音字显示所有标准读音</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-cultural-jade">•</span>
                    <span>提供简繁体转换对照</span>
                  </li>
                </ul>
              </Card>
              
              <Card hover className="p-6 bg-gradient-to-br from-cultural-gold/10 to-cultural-gold/5 border-2 border-cultural-gold/30 hover:border-cultural-gold/50 shadow-cultural hover:shadow-cultural-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cultural-gold to-cultural-red rounded-full flex items-center justify-center mr-4 shadow-cultural">
                    <span className="text-xl">📊</span>
                  </div>
                  <h4 className="text-xl font-bold text-cultural-gold font-heading">批量查询</h4>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2 text-cultural-gold">•</span>
                    <span>输入文字或句子批量验证</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-cultural-gold">•</span>
                    <span>逐字验证规范性标准</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-cultural-gold">•</span>
                    <span>颜色标识直观显示结果</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-cultural-gold">•</span>
                    <span>悬停显示详细字符信息</span>
                  </li>
                </ul>
              </Card>
            </div>
            
            <Card className="mt-8 p-6 bg-gradient-to-r from-cultural-paper to-cultural-gold/10 border-2 border-cultural-red/30">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-cultural-red to-cultural-gold rounded-full flex items-center justify-center mr-4 shadow-cultural flex-shrink-0">
                  <span className="text-xl">⚠️</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-cultural-red mb-3 font-heading">重要提示</h4>
                  <div className="space-y-2 text-cultural-ink">
                    <p className="font-medium">
                      本系统基于2013年教育部发布的《通用规范汉字表》，收录8105个标准汉字。
                    </p>
                    <p>
                      在起名时建议使用标准汉字，确保名字的规范性和官方认可度，避免在户籍登记、证件办理等场合遇到困难。
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Card>
    </CulturalTreasureTemplate>
  );
};

export default StandardCharactersPage;
