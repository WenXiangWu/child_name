/**
 * qiming名字生成结果详情页面
 * 用于展示详细的名字生成结果和分析
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  getQimingInstance, 
  GeneratedName, 
  NameGenerationConfig,
  NameValidationResult
} from '../lib/qiming';
import { QimingNameGenerator } from '../core/naming/name-generator';

const QimingResultsPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [config, setConfig] = useState<NameGenerationConfig | null>(null);
  const [selectedName, setSelectedName] = useState<GeneratedName | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterScore, setFilterScore] = useState(0);
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');
  const [exportFormat, setExportFormat] = useState<'html' | 'csv' | 'txt'>('html');

  const namesPerPage = 20;

  useEffect(() => {
    // 从URL参数获取配置信息
    const { familyName, gender, useTraditional, scoreThreshold } = router.query;
    
    if (familyName && gender) {
      const generationConfig: NameGenerationConfig = {
        familyName: familyName as string,
        gender: gender as 'male' | 'female',
        useTraditional: useTraditional === 'true',
        scoreThreshold: scoreThreshold ? parseInt(scoreThreshold as string) : 85
      };
      
      setConfig(generationConfig);
      generateNames(generationConfig);
    } else {
      setLoading(false);
    }
  }, [router.query]);

  const generateNames = async (config: NameGenerationConfig) => {
    try {
      setLoading(true);
      const qiming = getQimingInstance();
      const nameGenerator = new QimingNameGenerator();
      const names = await nameGenerator.generateNames(config);
      setGeneratedNames(names);
    } catch (error) {
      console.error('生成名字失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 过滤和排序名字
  const filteredNames = generatedNames
    .filter(name => name.score >= filterScore)
    .sort((a, b) => {
      if (sortBy === 'score') {
        return b.score - a.score;
      } else {
        return a.fullName.localeCompare(b.fullName);
      }
    });

  // 分页
  const totalPages = Math.ceil(filteredNames.length / namesPerPage);
  const startIndex = (currentPage - 1) * namesPerPage;
  const currentNames = filteredNames.slice(startIndex, startIndex + namesPerPage);

  // 获取评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-50';
    if (score >= 85) return 'text-blue-600 bg-blue-50';
    if (score >= 75) return 'text-yellow-600 bg-yellow-50';
    if (score >= 65) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  // 获取三才等级颜色
  const getSancaiColor = (level: string) => {
    switch (level) {
      case 'da_ji': return 'text-green-600 bg-green-50';
      case 'zhong_ji': return 'text-blue-600 bg-blue-50';
      case 'ji': return 'text-cyan-600 bg-cyan-50';
      case 'xiong': return 'text-orange-600 bg-orange-50';
      case 'da_xiong': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // 显示详细信息
  const showNameDetail = (name: GeneratedName) => {
    setSelectedName(name);
    setShowDetailModal(true);
  };

  // 导出结果
  const exportResults = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `${config?.familyName}-${config?.gender}-names-${timestamp}`;

    switch (exportFormat) {
      case 'html':
        exportAsHtml(filename);
        break;
      case 'csv':
        exportAsCsv(filename);
        break;
      case 'txt':
        exportAsTxt(filename);
        break;
    }
  };

  const exportAsHtml = (filename: string) => {
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>宝宝取名结果 - ${config?.familyName}${config?.gender === 'female' ? '女宝宝' : '男宝宝'}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; margin-bottom: 30px; }
        .summary { background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
        .name-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; }
        .name-card { border: 1px solid #ddd; border-radius: 6px; padding: 15px; background: white; }
        .name-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px; }
        .score { font-size: 16px; font-weight: bold; margin-bottom: 8px; }
        .score.high { color: #10b981; }
        .score.medium { color: #3b82f6; }
        .score.low { color: #f59e0b; }
        .details { font-size: 14px; color: #666; line-height: 1.4; }
        .grid-info { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 10px; }
        .grid-item { text-align: center; padding: 4px; background: #f1f5f9; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>宝宝取名结果</h1>
        <div class="summary">
            <p><strong>姓氏：</strong>${config?.familyName}</p>
            <p><strong>性别：</strong>${config?.gender === 'female' ? '女宝宝' : '男宝宝'}</p>
            <p><strong>生成时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
            <p><strong>总数量：</strong>${filteredNames.length} 个名字</p>
            <p><strong>评分要求：</strong>≥ ${config?.scoreThreshold || 85} 分</p>
        </div>
        <div class="name-grid">
            ${filteredNames.map(name => `
                <div class="name-card">
                    <div class="name-title">${name.fullName}</div>
                    <div class="score ${name.score >= 90 ? 'high' : name.score >= 80 ? 'medium' : 'low'}">
                        综合评分：${name.score} 分
                    </div>
                    <div class="details">
                        <p><strong>三才配置：</strong>${name.sancai.combination}</p>
                        <p><strong>名字寓意：</strong>${name.midChar} + ${name.lastChar}</p>
                    </div>
                    <div class="grid-info">
                        <div class="grid-item">天格<br>${name.grids.tiange}</div>
                        <div class="grid-item">人格<br>${name.grids.renge}</div>
                        <div class="grid-item">地格<br>${name.grids.dige}</div>
                        <div class="grid-item">总格<br>${name.grids.zongge}</div>
                        <div class="grid-item">外格<br>${name.grids.waige}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
    
    downloadFile(`${filename}.html`, html, 'text/html');
  };

  const exportAsCsv = (filename: string) => {
    const headers = ['姓名', '评分', '三才', '天格', '人格', '地格', '总格', '外格', '中间字', '最后字'];
    const rows = filteredNames.map(name => [
      name.fullName,
      name.score,
      name.sancai.combination,
      name.grids.tiange,
      name.grids.renge,
      name.grids.dige,
      name.grids.zongge,
      name.grids.waige,
      name.midChar,
      name.lastChar
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    downloadFile(`${filename}.csv`, csvContent, 'text/csv');
  };

  const exportAsTxt = (filename: string) => {
    const content = `宝宝取名结果报告
========================

基本信息：
姓氏：${config?.familyName}
性别：${config?.gender === 'female' ? '女宝宝' : '男宝宝'}
生成时间：${new Date().toLocaleString('zh-CN')}
总数量：${filteredNames.length} 个名字
评分要求：≥ ${config?.scoreThreshold || 85} 分

推荐名字列表：
========================

${filteredNames.map((name, index) => `
${index + 1}. ${name.fullName}
   综合评分：${name.score} 分
   三才配置：${name.sancai.combination}
   五格数理：天格${name.grids.tiange} 人格${name.grids.renge} 地格${name.grids.dige} 总格${name.grids.zongge} 外格${name.grids.waige}
   字义分析：${name.midChar}（中间字）+ ${name.lastChar}（最后字）
   详细说明：${name.explanation || '暂无详细说明'}
`).join('\n')}

========================
报告生成完毕
`;
    
    downloadFile(`${filename}.txt`, content, 'text/plain');
  };

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在生成名字，请稍候...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">参数错误</h2>
          <p className="text-gray-600 mb-6">缺少必要的生成参数</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🎯 新增：通用规范汉字表提示 */}
      <div className="bg-green-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  <span className="font-medium">规范取名保证</span>
                  {' '}本系统严格遵循《通用规范汉字表》(2013年教育部发布)，确保所有推荐名字使用国家标准规范汉字
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            宝宝取名结果
          </h1>
          <p className="text-gray-600">
            为 {config.familyName} 家的 {config.gender === 'female' ? '女宝宝' : '男宝宝'} 生成了 {filteredNames.length} 个优质名字
          </p>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{filteredNames.length}</div>
            <div className="text-sm text-gray-600">推荐名字总数</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {filteredNames.filter(n => n.score >= 90).length}
            </div>
            <div className="text-sm text-gray-600">优秀名字 (≥90分)</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round(filteredNames.reduce((sum, n) => sum + n.score, 0) / filteredNames.length)}
            </div>
            <div className="text-sm text-gray-600">平均评分</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">
              {config.useTraditional ? '繁体' : '简体'}
            </div>
            <div className="text-sm text-gray-600">笔画计算方式</div>
          </div>
        </div>

        {/* 控制面板 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">最低评分:</label>
              <select
                value={filterScore}
                onChange={(e) => setFilterScore(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value={0}>不限制</option>
                <option value={60}>≥60分</option>
                <option value={70}>≥70分</option>
                <option value={80}>≥80分</option>
                <option value={90}>≥90分</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">排序方式:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'score' | 'name')}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="score">按评分排序</option>
                <option value="name">按名字排序</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">导出格式:</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as 'html' | 'csv' | 'txt')}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="html">HTML网页</option>
                <option value="csv">CSV表格</option>
                <option value="txt">TXT文本</option>
              </select>
            </div>

            <button
              onClick={exportResults}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
            >
              导出结果
            </button>

            <Link
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
            >
              返回首页
            </Link>
          </div>
        </div>

        {/* 名字列表 */}
        {currentNames.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentNames.map((name, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{name.fullName}</h3>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(name.score)}`}>
                        {name.score}分
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">三才配置:</span>
                        <span className={`px-2 py-1 rounded text-xs ${getSancaiColor(name.sancai.level)}`}>
                          {name.sancai.combination}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">字义组合:</span>
                        <span className="text-gray-800">{name.midChar} + {name.lastChar}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2 mb-4">
                      <div className="text-center text-xs">
                        <div className="text-gray-600">天格</div>
                        <div className="font-semibold">{name.grids.tiange}</div>
                      </div>
                      <div className="text-center text-xs">
                        <div className="text-gray-600">人格</div>
                        <div className="font-semibold">{name.grids.renge}</div>
                      </div>
                      <div className="text-center text-xs">
                        <div className="text-gray-600">地格</div>
                        <div className="font-semibold">{name.grids.dige}</div>
                      </div>
                      <div className="text-center text-xs">
                        <div className="text-gray-600">总格</div>
                        <div className="font-semibold">{name.grids.zongge}</div>
                      </div>
                      <div className="text-center text-xs">
                        <div className="text-gray-600">外格</div>
                        <div className="font-semibold">{name.grids.waige}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => showNameDetail(name)}
                      className="w-full bg-blue-50 text-blue-600 py-2 rounded text-sm hover:bg-blue-100"
                    >
                      查看详细分析
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-400"
                >
                  上一页
                </button>
                
                <span className="text-sm text-gray-600">
                  第 {currentPage} 页，共 {totalPages} 页
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-400"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">没有找到符合条件的名字</p>
            <p className="text-gray-500 text-sm mt-2">请尝试降低评分要求或修改其他条件</p>
          </div>
        )}

        {/* 详细信息模态框 */}
        {showDetailModal && selectedName && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedName.fullName} 详细分析</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">基本信息</h3>
                      <div className="space-y-1 text-sm">
                        <div>姓氏: {selectedName.familyName}</div>
                        <div>中间字: {selectedName.midChar}</div>
                        <div>最后字: {selectedName.lastChar}</div>
                        <div>综合评分: {selectedName.score} 分</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">三才配置</h3>
                      <div className="space-y-1 text-sm">
                        <div>三才: {selectedName.sancai.combination}</div>
                        <div>天格五行: {selectedName.sancai.heaven}</div>
                        <div>人格五行: {selectedName.sancai.human}</div>
                        <div>地格五行: {selectedName.sancai.earth}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">五格数理</h3>
                    <div className="grid grid-cols-5 gap-3">
                      <div className="text-center bg-gray-50 p-3 rounded">
                        <div className="font-semibold text-lg">{selectedName.grids.tiange}</div>
                        <div className="text-xs text-gray-600">天格</div>
                      </div>
                      <div className="text-center bg-gray-50 p-3 rounded">
                        <div className="font-semibold text-lg">{selectedName.grids.renge}</div>
                        <div className="text-xs text-gray-600">人格</div>
                      </div>
                      <div className="text-center bg-gray-50 p-3 rounded">
                        <div className="font-semibold text-lg">{selectedName.grids.dige}</div>
                        <div className="text-xs text-gray-600">地格</div>
                      </div>
                      <div className="text-center bg-gray-50 p-3 rounded">
                        <div className="font-semibold text-lg">{selectedName.grids.zongge}</div>
                        <div className="text-xs text-gray-600">总格</div>
                      </div>
                      <div className="text-center bg-gray-50 p-3 rounded">
                        <div className="font-semibold text-lg">{selectedName.grids.waige}</div>
                        <div className="text-xs text-gray-600">外格</div>
                      </div>
                    </div>
                  </div>

                  {selectedName.explanation && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">详细解释</h3>
                      <pre className="text-sm text-gray-700 bg-gray-50 p-4 rounded whitespace-pre-wrap">
                        {selectedName.explanation}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QimingResultsPage;