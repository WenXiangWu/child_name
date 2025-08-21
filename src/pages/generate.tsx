import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NameCard from '@/components/NameCard';
import Layout from '@/components/Layout';
import { useNameGenerator } from '@/hooks/useNameGenerator';
import PluginExecutionViewer from '@/components/PluginExecutionViewer';
import PluginExecutionReport from '@/components/PluginExecutionReport';

export default function Generate() {
  const router = useRouter();
  const { gender, familyName } = router.query;
  
  const [lastName, setLastName] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [usePluginSystem, setUsePluginSystem] = useState<boolean>(true);
  const [showExecutionProcess, setShowExecutionProcess] = useState<boolean>(false);
  const [showDetailedReport, setShowDetailedReport] = useState<boolean>(false);
  
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
  
  // 处理姓氏变更
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };
  
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
        <h1 className="text-3xl font-bold text-center text-primary-700 mb-8">
          为您的{selectedGender === 'male' ? '男' : '女'}宝宝推荐的名字
        </h1>
        
        <div className="mb-8 space-y-4">
          {/* 第一行：基本设置 */}
          <div className="flex justify-center space-x-4">
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">姓氏:</span>
              <input
                type="text"
                value={lastName}
                onChange={handleLastNameChange}
                className="border border-gray-300 rounded px-3 py-1 w-16 text-center"
                maxLength={2}
              />
            </div>
            
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">性别:</span>
              <select
                value={selectedGender}
                onChange={handleGenderChange}
                className="border border-gray-300 rounded px-3 py-1"
              >
                <option value="male">男孩</option>
                <option value="female">女孩</option>
              </select>
            </div>
            
            <button
              onClick={regenerateNames}
              disabled={loading}
              className={`px-4 py-1 rounded bg-primary-600 text-white hover:bg-primary-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? '生成中...' : '重新生成'}
            </button>
          </div>

          {/* 第二行：生成模式选择 */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-4xl w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">选择取名方式</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 智能插件系统 */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="generationMode"
                    checked={usePluginSystem}
                    onChange={() => setUsePluginSystem(true)}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    usePluginSystem 
                      ? 'border-green-500 bg-green-50 shadow-lg' 
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                  }`}>
                    <div className="flex items-start">
                      <div className={`w-4 h-4 rounded-full mr-3 mt-1 ${
                        usePluginSystem ? 'bg-green-500' : 'border-2 border-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-2">
                          🧩 智能插件系统
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          基于多层插件智能分析，综合生肖、五行、八字、音韵等传统命理要素
                        </div>
                        <div className="text-xs">
                          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 mb-1">✨ 个性化程度高</span>
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mb-1">🎯 分析全面</span>
                          <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded mb-1">📊 评分精准</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>

                {/* 传统模式 */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="generationMode"
                    checked={!usePluginSystem}
                    onChange={() => setUsePluginSystem(false)}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    !usePluginSystem 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                  }`}>
                    <div className="flex items-start">
                      <div className={`w-4 h-4 rounded-full mr-3 mt-1 ${
                        !usePluginSystem ? 'bg-blue-500' : 'border-2 border-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-2">
                          🏛️ 传统模式
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          基于精选名字库快速生成，适合追求简洁高效的用户
                        </div>
                        <div className="text-xs">
                          <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded mr-2 mb-1">⚡ 速度快</span>
                          <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded mr-2 mb-1">📚 名字库丰富</span>
                          <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded mb-1">🔄 稳定可靠</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* 重要提示 */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2">⚠️</span>
                  <div className="text-sm text-yellow-800">
                    <strong>注意：</strong>
                    {usePluginSystem 
                      ? '智能插件系统需要更多计算时间，如遇到错误不会自动切换到传统模式。' 
                      : '传统模式使用预设的优质名字库，生成速度更快但个性化程度较低。'
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
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
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