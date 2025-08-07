/**
 * 通用规范汉字表验证测试页面
 * 用于测试和验证标准字符过滤功能
 */

import React, { useState, useEffect } from 'react';
import { StandardCharactersValidator } from '../lib/qiming/standard-characters-validator';
import { QimingNameGenerator } from '../lib/qiming/name-generator';

const StandardCharactersTestPage: React.FC = () => {
  const [validator, setValidator] = useState<StandardCharactersValidator | null>(null);
  const [nameGenerator, setNameGenerator] = useState<QimingNameGenerator | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [complianceReport, setComplianceReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testName, setTestName] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);

  useEffect(() => {
    const initValidator = async () => {
      const validatorInstance = StandardCharactersValidator.getInstance();
      const generatorInstance = new QimingNameGenerator();
      
      await validatorInstance.initialize();
      setValidator(validatorInstance);
      setNameGenerator(generatorInstance);
      
      // 获取基本统计信息
      const stats = validatorInstance.getStats();
      setTestResults(stats);
    };

    initValidator();
  }, []);

  const runComplianceAnalysis = async () => {
    if (!nameGenerator) return;
    
    setLoading(true);
    try {
      console.log('开始分析数据源合规性...');
      const report = await nameGenerator.analyzeDataCompliance();
      setComplianceReport(report);
    } catch (error) {
      console.error('合规性分析失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateTestName = async () => {
    if (!nameGenerator || !testName.trim()) return;
    
    try {
      const result = await nameGenerator.validateName(testName.trim());
      setValidationResult(result);
    } catch (error) {
      console.error('名字验证失败:', error);
    }
  };

  const testCharacters = [
    { char: '王', expected: true, description: '常见汉字' },
    { char: '龘', expected: true, description: '复杂但标准的汉字' },
    { char: '𤶸', expected: false, description: '生僻Unicode字符' },
    { char: '❤', expected: false, description: '表情符号' },
    { char: '①', expected: false, description: '特殊数字符号' }
  ];

  const runBasicTests = () => {
    if (!validator) return;
    
    const results = testCharacters.map(test => ({
      ...test,
      actual: validator.isStandardCharacter(test.char),
      passed: validator.isStandardCharacter(test.char) === test.expected
    }));
    
    setTestResults(prev => ({
      ...prev,
      basicTests: results
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            通用规范汉字表验证测试
          </h1>
          <p className="text-gray-600">
            测试标准字符验证功能和数据源合规性
          </p>
        </div>

        {/* 基本统计信息 */}
        {testResults && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">验证器统计信息</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.standardCharsCount}
                </div>
                <div className="text-sm text-gray-600">标准汉字</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {testResults.duoyinCount}
                </div>
                <div className="text-sm text-gray-600">多音字</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {testResults.simplifiedMappingCount}
                </div>
                <div className="text-sm text-gray-600">繁→简映射</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {testResults.traditionalMappingCount}
                </div>
                <div className="text-sm text-gray-600">简→繁映射</div>
              </div>
            </div>
          </div>
        )}

        {/* 基本功能测试 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">基本功能测试</h2>
            <button
              onClick={runBasicTests}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              disabled={!validator}
            >
              运行测试
            </button>
          </div>
          
          {testResults?.basicTests && (
            <div className="space-y-2">
              {testResults.basicTests.map((test: any, index: number) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-md ${
                    test.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-mono">{test.char}</span>
                    <span className="text-sm text-gray-600">{test.description}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${test.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {test.passed ? '✅ 通过' : '❌ 失败'}
                    </span>
                    <span className="text-xs text-gray-500">
                      期望: {test.expected ? '标准' : '非标准'}, 
                      实际: {test.actual ? '标准' : '非标准'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 名字验证测试 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">名字验证测试</h2>
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="输入要验证的名字"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            />
            <button
              onClick={validateTestName}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              disabled={!nameGenerator || !testName.trim()}
            >
              验证名字
            </button>
          </div>
          
          {validationResult && (
            <div className={`p-4 rounded-md ${
              validationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center mb-2">
                <span className={`text-lg ${validationResult.isValid ? 'text-green-600' : 'text-yellow-600'}`}>
                  {validationResult.isValid ? '✅ 名字符合规范' : '⚠️ 名字包含非标准字符'}
                </span>
              </div>
              
              {validationResult.invalidChars.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm text-gray-600 mb-1">非标准字符:</p>
                  <div className="flex flex-wrap gap-2">
                    {validationResult.invalidChars.map((char: string, index: number) => (
                      <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {validationResult.suggestions.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">建议替换:</p>
                  <ul className="text-sm text-gray-700">
                    {validationResult.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="ml-4">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 数据源合规性分析 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">数据源合规性分析</h2>
            <button
              onClick={runComplianceAnalysis}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              disabled={!nameGenerator || loading}
            >
              {loading ? '分析中...' : '开始分析'}
            </button>
          </div>
          
          {complianceReport && (
            <div className="space-y-4">
              {Object.entries(complianceReport).map(([dataSource, report]: [string, any]) => (
                <div key={dataSource} className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-semibold mb-2">{report.sourceName}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">总字符数:</span>
                      <span className="ml-2 font-medium">{report.totalChars}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">标准字符:</span>
                      <span className="ml-2 font-medium text-green-600">{report.standardChars}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">非标准字符:</span>
                      <span className="ml-2 font-medium text-red-600">{report.nonStandardChars}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">合规率:</span>
                      <span className={`ml-2 font-medium ${
                        report.complianceRate >= 95 ? 'text-green-600' : 
                        report.complianceRate >= 90 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {report.complianceRate}%
                      </span>
                    </div>
                  </div>
                  
                  {report.sampleNonStandard.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-1">非标准字符样本:</p>
                      <div className="flex flex-wrap gap-1">
                        {report.sampleNonStandard.map((char: string, index: number) => (
                          <span key={index} className="bg-red-100 text-red-800 px-1 py-0.5 rounded text-xs">
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StandardCharactersTestPage;
