/**
 * qiming功能测试页面
 * 用于验证我们的实现与原qiming项目的兼容性
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  getQimingInstance, 
  quickGenerateNames, 
  quickValidateName,
  testQimingCompatibility,
  NameGenerationConfig,
  GeneratedName,
  NameValidationResult 
} from '../lib/qiming';

const QimingTestPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [validationResult, setValidationResult] = useState<NameValidationResult | null>(null);
  const [compatibilityTest, setCompatibilityTest] = useState<any>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [pinyinAnalysis, setPinyinAnalysis] = useState<any>(null);
  const [pinyinTestName, setPinyinTestName] = useState('张浩然');

  // 表单状态
  const [familyName, setFamilyName] = useState('刘');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [testName, setTestName] = useState('刘泽娇');
  const [useTraditional, setUseTraditional] = useState(false);

  useEffect(() => {
    initializeSystem();
  }, []);

  // 初始化系统
  const initializeSystem = async () => {
    try {
      setLoading(true);
      const qiming = getQimingInstance();
      await qiming.initialize();
      setInitialized(true);
      
      // 获取系统状态
      const status = qiming.getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error('初始化失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成名字测试
  const handleGenerateNames = async () => {
    try {
      setLoading(true);
      const names = await quickGenerateNames(familyName, gender, {
        scoreThreshold: 80,
        useTraditional
      });
      setGeneratedNames(names);
    } catch (error) {
      console.error('生成名字失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 跳转到详细结果页面
  const handleGenerateNamesDetailed = () => {
    const params = new URLSearchParams({
      familyName,
      gender,
      useTraditional: useTraditional.toString(),
      scoreThreshold: '80'
    });
    
    router.push(`/qiming-results?${params.toString()}`);
  };

  // 名字验证测试
  const handleValidateName = async () => {
    try {
      setLoading(true);
      const result = await quickValidateName(testName, useTraditional);
      setValidationResult(result);
    } catch (error) {
      console.error('验证名字失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 兼容性测试
  const handleCompatibilityTest = async () => {
    try {
      setLoading(true);
      const result = await testQimingCompatibility();
      setCompatibilityTest(result);
    } catch (error) {
      console.error('兼容性测试失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 拼音分析测试
  const handlePinyinAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-pinyin');
      const result = await response.json();
      setPinyinAnalysis(result);
    } catch (error) {
      console.error('拼音分析测试失败:', error);
      alert('拼音分析测试失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          qiming功能测试页面
        </h1>

        {/* 系统状态 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">系统状态</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">初始化状态: </span>
              <span className={initialized ? 'text-green-600' : 'text-red-600'}>
                {initialized ? '已初始化' : '未初始化'}
              </span>
            </div>
            <div>
              <span className="font-medium">加载状态: </span>
              <span className={loading ? 'text-yellow-600' : 'text-green-600'}>
                {loading ? '加载中...' : '就绪'}
              </span>
            </div>
          </div>
          
          {systemStatus && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">数据加载状态:</h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {Object.entries(systemStatus.dataStatus).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}:</span>
                    <span className={value ? 'text-green-600' : 'text-gray-400'}>
                      {value ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 名字生成测试 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">名字生成测试</h2>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">姓氏</label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">性别</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="female">女</option>
                <option value="male">男</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useTraditional"
                checked={useTraditional}
                onChange={(e) => setUseTraditional(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="useTraditional" className="text-sm font-medium">
                使用繁体笔画
              </label>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleGenerateNames}
                disabled={loading || !initialized}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                生成名字
              </button>
              <button
                onClick={handleGenerateNamesDetailed}
                disabled={loading || !initialized}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                详细结果页面
              </button>
            </div>
          </div>

          {generatedNames.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">生成结果 (共{generatedNames.length}个):</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {generatedNames.slice(0, 20).map((name, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="font-semibold text-lg">{name.fullName}</div>
                    <div className="text-sm text-gray-600">
                      评分: {name.score} | 三才: {name.sancai.combination}
                    </div>
                    <div className="text-xs text-gray-500">
                      五格: 天{name.grids.tiange} 人{name.grids.renge} 地{name.grids.dige} 总{name.grids.zongge} 外{name.grids.waige}
                    </div>
                  </div>
                ))}
              </div>
              {generatedNames.length > 20 && (
                <div className="text-sm text-gray-500 mt-2">
                  只显示前20个结果，共生成{generatedNames.length}个名字
                </div>
              )}
            </div>
          )}
        </div>

        {/* 名字验证测试 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">名字验证测试</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">测试名字</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入要测试的名字"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleValidateName}
                disabled={loading || !initialized}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                验证名字
              </button>
            </div>
          </div>

          {validationResult && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium mb-3">验证结果:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm">
                    <span className="font-medium">姓名:</span> {testName}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">评分:</span> {validationResult.score}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">有效性:</span> 
                    <span className={validationResult.isValid ? 'text-green-600' : 'text-red-600'}>
                      {validationResult.isValid ? ' 有效' : ' 无效'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">三才:</span> {validationResult.sancai.combination}
                  </div>
                </div>
                <div>
                  <div className="text-sm">
                    <span className="font-medium">天格:</span> {validationResult.grids.tiange}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">人格:</span> {validationResult.grids.renge}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">地格:</span> {validationResult.grids.dige}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">总格:</span> {validationResult.grids.zongge}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">外格:</span> {validationResult.grids.waige}
                  </div>
                </div>
              </div>
              
              {validationResult.issues.length > 0 && (
                <div className="mt-3">
                  <span className="font-medium text-red-600">问题:</span>
                  <ul className="list-disc list-inside text-sm text-red-600">
                    {validationResult.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-3">
                <span className="font-medium">详细解释:</span>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 whitespace-pre-wrap">
                  {validationResult.explanation}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* 拼音分析测试 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">拼音声调分析测试</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              测试名字:
            </label>
            <input
              type="text"
              value={pinyinTestName}
              onChange={(e) => setPinyinTestName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
              placeholder="输入姓名，如：张浩然"
            />
          </div>
          
          <button
            onClick={handlePinyinAnalysis}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? '分析中...' : '开始拼音分析'}
          </button>

          {pinyinAnalysis && (
            <div className="mt-6">
              <div className="mb-4">
                <span className="font-medium">分析结果: </span>
                <span className={pinyinAnalysis.success ? 'text-green-600' : 'text-red-600'}>
                  {pinyinAnalysis.success ? '成功' : '失败'}
                </span>
              </div>

              {pinyinAnalysis.success && (
                <div className="space-y-4">
                  {/* 统计信息 */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">拼音数据统计</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>总字符数: {pinyinAnalysis.summary?.totalCharsInDict}</div>
                      <div>单字测试: {pinyinAnalysis.summary?.singleCharCount}</div>
                      <div>名字测试: {pinyinAnalysis.summary?.nameTestCount}</div>
                      <div>声调分布: 
                        {pinyinAnalysis.summary?.toneDistribution && 
                          Object.entries(pinyinAnalysis.summary.toneDistribution)
                            .map(([tone, count]) => `${tone}声:${count}`).slice(0,2).join(' ')
                        }
                      </div>
                    </div>
                  </div>

                  {/* 名字音律分析示例 */}
                  {pinyinAnalysis.data?.namePhoneticTests?.[0] && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">"{pinyinAnalysis.data.namePhoneticTests[0].analysis?.map((a: any) => a.char).join('')}" 音律分析</h3>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">音律和谐度:</span> 
                          <span className={`ml-2 ${pinyinAnalysis.data.namePhoneticTests[0].harmony >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {pinyinAnalysis.data.namePhoneticTests[0].harmony}分
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">声调模式:</span> {pinyinAnalysis.data.namePhoneticTests[0].tonePattern}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          {pinyinAnalysis.data.namePhoneticTests[0].analysis?.map((analysis: any, index: number) => (
                            <div key={index} className="bg-white p-2 rounded border">
                              <div className="font-medium">{analysis.char} ({analysis.pinyin})</div>
                              <div className="text-gray-600">
                                {analysis.toneAnalysis.description} - {analysis.toneAnalysis.category === 'ping' ? '平' : '仄'}
                              </div>
                              <div className="text-gray-500 text-xs">
                                声母:{analysis.initial} 韵母:{analysis.rhyme}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="bg-gray-100 p-4 rounded-lg mt-4">
                <details>
                  <summary className="cursor-pointer font-medium">查看完整测试数据</summary>
                  <pre className="text-sm whitespace-pre-wrap mt-2">
                    {JSON.stringify(pinyinAnalysis.data, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </div>

        {/* 兼容性测试 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">qiming兼容性测试</h2>
          
          <button
            onClick={handleCompatibilityTest}
            disabled={loading || !initialized}
            className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 mb-4"
          >
            运行兼容性测试
          </button>

          {compatibilityTest && (
            <div className="mt-4">
              <div className="mb-3">
                <span className="font-medium">测试结果: </span>
                <span className={compatibilityTest.success ? 'text-green-600' : 'text-red-600'}>
                  {compatibilityTest.success ? '通过' : '失败'}
                </span>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(compatibilityTest.details, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QimingTestPage;