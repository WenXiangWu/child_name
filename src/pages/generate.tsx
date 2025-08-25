import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NameCard from '@/components/NameCard';
import Layout from '@/components/Layout';
import { useNameGenerator } from '@/hooks/useNameGenerator';
import PluginExecutionViewer from '@/components/PluginExecutionViewer';
import PluginExecutionReport from '@/components/PluginExecutionReport';
import { createBaijiaxingSurnameInputHandler, getBaijiaxingList } from '@/utils/chineseValidation';

export default function Generate() {
  const router = useRouter();
  const { gender, familyName } = router.query;
  
  const [lastName, setLastName] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [usePluginSystem, setUsePluginSystem] = useState<boolean>(true);
  const [showExecutionProcess, setShowExecutionProcess] = useState<boolean>(false);
  const [showDetailedReport, setShowDetailedReport] = useState<boolean>(false);
  const [surnameError, setSurnameError] = useState<string>('');
  const [isValidSurname, setIsValidSurname] = useState<boolean>(true);
  
  // 预加载百家姓数据
  useEffect(() => {
    getBaijiaxingList().catch(console.error);
  }, []);
  
  // 初始化状态
  useEffect(() => {
    if (gender && (gender === 'male' || gender === 'female')) {
      setSelectedGender(gender as 'male' | 'female');
    }
    
    if (familyName && typeof familyName === 'string') {
      setLastName(familyName);
    } else {
      setLastName('张'); // 默认姓氏
    }
  }, [gender, familyName]);
  
  // 使用自定义Hook获取名字
  const { 
    names, 
    loading, 
    error, 
    executionLogs,
    generationMetadata,
    regenerateNames 
  } = useNameGenerator({
    gender: selectedGender,
    familyName: lastName,
    count: 6,
    usePluginSystem
  });
  
  // 处理姓氏变更（带百家姓校验）
  const handleLastNameChange = createBaijiaxingSurnameInputHandler(
    (value: string) => {
      setLastName(value);
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
    setSelectedGender(e.target.value as 'male' | 'female');
  };
  
  const handleNameClick = (name: any) => {
    // 跳转到名字详情页
    router.push(`/name/${name.familyName}-${name.firstName}-${name.secondName}`);
  };
  
  return (
    <Layout
      title={`${selectedGender === 'male' ? '男' : '女'}宝宝名字推荐 - 宝宝取名网`}
      description={`为您的${selectedGender === 'male' ? '男' : '女'}宝宝生成独特而美好的名字`}
    >
      <div className="container mx-auto px-4 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cultural-red-500 to-pink-600 rounded-2xl shadow-lg mb-6">
            <span className="text-2xl text-white">
              {selectedGender === 'male' ? '👦' : '👧'}
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold font-heading text-cultural-ink mb-4">
            为您的{selectedGender === 'male' ? '男' : '女'}宝宝推荐的名字
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            基于传统文化智慧与现代AI技术，为宝宝精心挑选独特而美好的名字
          </p>
        </div>
        
        {/* 快速设置卡片 */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-white via-cultural-paper to-white rounded-3xl shadow-xl border-2 border-cultural-gold/20 p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cultural-gold-500 to-cultural-gold-600 rounded-xl shadow-lg mb-4">
                <span className="text-xl text-white">⚡</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-cultural-ink mb-2">快速取名设置</h3>
              <p className="text-gray-600">输入基本信息，即可获得专业的名字推荐</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* 姓氏输入 */}
              <div>
                <label className="flex items-center text-base font-bold text-cultural-ink mb-3 font-heading">
                  <span className="w-8 h-8 bg-cultural-red-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">姓</span>
                  </span>
                  宝宝姓氏
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={lastName}
                    onChange={handleLastNameChange}
                    className={`w-full px-4 py-3 text-lg text-center border-2 rounded-xl focus:ring-4 transition-all duration-300 ${
                      surnameError 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50' 
                        : 'border-cultural-gold/30 focus:border-cultural-gold-500 focus:ring-cultural-gold-100 bg-white'
                    } placeholder:text-gray-400 font-bold text-xl`}
                    placeholder="张"
                    maxLength={2}
                  />
                </div>
                {surnameError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-700 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {surnameError}
                    </p>
                  </div>
                )}
              </div>
              
              {/* 性别选择 */}
              <div>
                <label className="flex items-center text-base font-bold text-cultural-ink mb-3 font-heading">
                  <span className="w-8 h-8 bg-cultural-jade-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">性</span>
                  </span>
                  宝宝性别
                </label>
                <select
                  value={selectedGender}
                  onChange={handleGenderChange}
                  className="w-full px-4 py-3 text-lg border-2 border-cultural-jade/30 rounded-xl focus:ring-4 focus:ring-cultural-jade-100 focus:border-cultural-jade-500 bg-white transition-all duration-300 font-bold"
                >
                  <option value="male">👦 男宝宝</option>
                  <option value="female">👧 女宝宝</option>
                </select>
              </div>
              
              {/* 生成按钮 */}
              <div>
                <button
                  onClick={regenerateNames}
                  disabled={loading}
                  className={`w-full px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                    loading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-cultural-gold-500 to-cultural-gold-600 text-white hover:from-cultural-gold-600 hover:to-cultural-gold-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        生成中...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">⚡</span>
                        重新生成
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 生成模式选择 */}
        <div className="mb-12 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-white via-blue-50/30 to-white rounded-3xl shadow-xl border-2 border-blue-100 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mb-4">
                <span className="text-xl text-white">🧩</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-cultural-ink mb-2">选择取名方式</h3>
              <p className="text-gray-600">根据您的需求选择最适合的取名模式</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 智能插件系统 */}
              <label className="cursor-pointer group">
                <input
                  type="radio"
                  name="generationMode"
                  checked={usePluginSystem}
                  onChange={() => setUsePluginSystem(true)}
                  className="sr-only"
                />
                <div className={`relative p-6 border-2 rounded-2xl transition-all duration-300 ${
                  usePluginSystem 
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl scale-105' 
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50 hover:shadow-lg'
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center transition-all ${
                        usePluginSystem ? 'bg-green-500' : 'border-2 border-gray-300 group-hover:border-green-400'
                      }`}>
                        {usePluginSystem && <span className="text-white text-sm">✓</span>}
                      </div>
                      <div className="text-xl font-bold text-gray-800 font-heading flex items-center">
                        <span className="mr-2">🧩</span>
                        智能插件系统
                      </div>
                    </div>
                    
                    <div className="text-gray-600 leading-relaxed">
                      基于多层插件智能分析，综合生肖、五行、八字、音韵等传统命理要素，为您生成高度个性化的专属名字
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">✨ 个性化程度高</span>
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">🎯 分析全面</span>
                      <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">📊 评分精准</span>
                    </div>
                    
                    <div className="pt-2 text-sm text-green-600 font-medium">
                      💡 推荐：追求高质量个性化名字的家长
                    </div>
                  </div>
                  
                  {usePluginSystem && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </label>

              {/* 传统模式 */}
              <label className="cursor-pointer group">
                <input
                  type="radio"
                  name="generationMode"
                  checked={!usePluginSystem}
                  onChange={() => setUsePluginSystem(false)}
                  className="sr-only"
                />
                <div className={`relative p-6 border-2 rounded-2xl transition-all duration-300 ${
                  !usePluginSystem 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl scale-105' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-lg'
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center transition-all ${
                        !usePluginSystem ? 'bg-blue-500' : 'border-2 border-gray-300 group-hover:border-blue-400'
                      }`}>
                        {!usePluginSystem && <span className="text-white text-sm">✓</span>}
                      </div>
                      <div className="text-xl font-bold text-gray-800 font-heading flex items-center">
                        <span className="mr-2">🏛️</span>
                        传统精选模式
                      </div>
                    </div>
                    
                    <div className="text-gray-600 leading-relaxed">
                      基于精心筛选的优质名字库快速生成，采用经过验证的经典组合，适合追求简洁高效的用户
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">⚡ 速度快</span>
                      <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">📚 名字库丰富</span>
                      <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">🔄 稳定可靠</span>
                    </div>
                    
                    <div className="pt-2 text-sm text-blue-600 font-medium">
                      💡 推荐：快速获得优质名字推荐的家长
                    </div>
                  </div>
                  
                  {!usePluginSystem && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* 温馨提示 */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
              <div className="flex items-start">
                <span className="text-amber-600 mr-3 text-lg">💡</span>
                <div className="text-sm text-amber-800">
                  <div className="font-bold mb-1">温馨提示：</div>
                  <div>
                    {usePluginSystem 
                      ? '智能插件系统会进行深度分析，生成时间约10-30秒，请耐心等待精彩结果！' 
                      : '传统精选模式基于优质名字库，可在3秒内快速生成多个高质量名字推荐。'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="text-center text-red-500 mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {names.map((name, index) => (
                <NameCard
                  key={index}
                  familyName={name.familyName}
                  givenName={`${name.firstName}${name.secondName}`}
                  meaning={name.meaning}
                  popularity={name.popularity}
                  onClick={() => handleNameClick(name)}
                />
              ))}
            </div>
            
            {/* 插件执行过程查看器 - 仅在使用插件系统时显示 */}
            {usePluginSystem && names.length > 0 && (
              <div className="mt-8 space-y-6">
                {/* 简化版本的执行查看器 */}
                <div>
                  <PluginExecutionViewer 
                    executionLogs={executionLogs}
                    generationMetadata={generationMetadata}
                    isOpen={showExecutionProcess}
                    onToggle={() => setShowExecutionProcess(!showExecutionProcess)}
                  />
                </div>
                
                {/* 切换详细报告的按钮 */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowDetailedReport(!showDetailedReport)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded text-sm"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {showDetailedReport ? '🔼 隐藏详细执行报告' : '📊 查看详细执行报告'}
                  </button>
                </div>

                {/* 详细执行报告 */}
                {showDetailedReport && (
                  <div className="mt-6">
                    <PluginExecutionReport
                      executionLogs={executionLogs}
                      generatedNames={names}
                      generationMetadata={generationMetadata}
                      requestConfig={{ 
                        familyName: lastName, 
                        gender: selectedGender,
                        birthInfo: undefined 
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            返回首页
          </button>
        </div>
      </div>
    </Layout>
  );
}