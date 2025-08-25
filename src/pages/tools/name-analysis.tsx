import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button, Input, Card } from '@/components/ui';

interface NameAnalysis {
  fullName: string;
  meaning: string;
  score: number;
  analysis: {
    sancai: number;
    wuxing: number;
    phonetic: number;
    meaning: number;
    cultural: number;
    zodiac: number;
  };
  details: {
    strokes: string;
    fiveElements: string;
    pronunciation: string;
    zodiacMatch: string;
  };
}

const NameAnalysisPage: React.FC = () => {
  const [inputName, setInputName] = useState('');
  const [analysisResult, setAnalysisResult] = useState<NameAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!inputName.trim()) {
      alert('请输入要分析的姓名');
      return;
    }

    if (inputName.length < 2 || inputName.length > 4) {
      alert('请输入2-4个字的姓名');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // 模拟分析过程 - 在实际应用中这里会调用真正的分析API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: NameAnalysis = {
        fullName: inputName,
        meaning: generateMockMeaning(inputName),
        score: Math.floor(Math.random() * 20) + 80, // 80-100分
        analysis: {
          sancai: Math.floor(Math.random() * 20) + 80,
          wuxing: Math.floor(Math.random() * 20) + 80,
          phonetic: Math.floor(Math.random() * 20) + 80,
          meaning: Math.floor(Math.random() * 20) + 80,
          cultural: Math.floor(Math.random() * 20) + 80,
          zodiac: Math.floor(Math.random() * 20) + 80,
        },
        details: {
          strokes: generateMockStrokes(inputName),
          fiveElements: generateMockFiveElements(inputName),
          pronunciation: generateMockPronunciation(inputName),
          zodiacMatch: '属龙人适用，与生肖相配',
        }
      };
      
      setAnalysisResult(mockResult);
    } catch (error) {
      console.error('分析失败:', error);
      alert('分析失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockMeaning = (name: string): string => {
    const meanings = [
      '寓意美好，象征着智慧与品德的完美结合',
      '表达了对美好生活的向往和追求',
      '蕴含着深厚的文化底蕴和美好祝愿',
      '体现了父母对孩子未来的殷切期望',
      '融合了传统文化中的吉祥寓意'
    ];
    return meanings[Math.floor(Math.random() * meanings.length)];
  };

  const generateMockStrokes = (name: string): string => {
    const totalStrokes = name.split('').reduce((total, char) => {
      return total + (Math.floor(Math.random() * 15) + 3); // 3-18画
    }, 0);
    return `总笔画数：${totalStrokes}画`;
  };

  const generateMockFiveElements = (name: string): string => {
    const elements = ['金', '木', '水', '火', '土'];
    const nameElements = name.split('').map(() => 
      elements[Math.floor(Math.random() * elements.length)]
    );
    return `五行组合：${nameElements.join('-')}`;
  };

  const generateMockPronunciation = (name: string): string => {
    const tones = ['阴平', '阳平', '上声', '去声'];
    const nameTones = name.split('').map(() => 
      tones[Math.floor(Math.random() * tones.length)]
    );
    return `声调搭配：${nameTones.join(' ')}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLevel = (score: number): string => {
    if (score >= 95) return '极佳';
    if (score >= 90) return '优秀';
    if (score >= 85) return '良好';
    if (score >= 80) return '一般';
    return '较差';
  };

  return (
    <Layout 
      title="姓名分析 - 宝宝取名专家"
      description="专业的姓名综合分析工具，多维度解析姓名的文化内涵和寓意"
    >
      <div className="min-h-screen bg-cultural-gradient py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-heading text-cultural-ink mb-4">
              📊 姓名综合分析
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              输入姓名，获得全面的分析报告，包括五行、三才、音韵、寓意等多个维度的专业评估
            </p>
          </div>

          {/* 分析工具 */}
          <Card variant="cultural" padding="lg" className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-heading text-cultural-ink mb-4">
                🔍 开始分析
              </h2>
              <p className="text-gray-600">
                请输入要分析的完整姓名（2-4个字）
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <Input
                label="姓名"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="如：张浩然"
                maxLength={4}
                required
                leftIcon={<span>👤</span>}
              />

              <div className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={!inputName.trim() || isAnalyzing}
                  loading={isAnalyzing}
                  className="px-12 py-4"
                >
                  {isAnalyzing ? '🔄 分析中...' : '🚀 开始分析'}
                </Button>
              </div>
            </div>
          </Card>

          {/* 分析结果 */}
          {analysisResult && (
            <div className="space-y-8">
              {/* 总体评分 */}
              <Card variant="cultural" padding="lg">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-cultural-ink mb-4">
                    「{analysisResult.fullName}」分析报告
                  </h2>
                  <div className="flex justify-center items-center space-x-4 mb-6">
                    <span className="text-6xl font-bold text-cultural-gold">
                      {analysisResult.score}
                    </span>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-cultural-ink">分</div>
                      <div className={`text-lg font-semibold ${getScoreColor(analysisResult.score)}`}>
                        {getScoreLevel(analysisResult.score)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-cultural-paper/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-cultural-ink mb-3">寓意解释</h3>
                    <p className="text-gray-700 leading-relaxed">{analysisResult.meaning}</p>
                  </div>
                </div>
              </Card>

              {/* 详细评分 */}
              <Card variant="cultural" padding="lg">
                <h3 className="text-2xl font-bold font-heading text-cultural-ink mb-8 text-center">
                  📈 各维度评分详情
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(analysisResult.analysis).map(([key, score]) => {
                    const labels: Record<string, { name: string; icon: string; color: string }> = {
                      sancai: { name: '三才五格', icon: '🔮', color: 'from-blue-500 to-blue-600' },
                      wuxing: { name: '五行平衡', icon: '⚖️', color: 'from-green-500 to-green-600' },
                      phonetic: { name: '音韵美感', icon: '🎵', color: 'from-purple-500 to-purple-600' },
                      meaning: { name: '寓意内涵', icon: '📖', color: 'from-yellow-500 to-yellow-600' },
                      cultural: { name: '文化底蕴', icon: '🏛️', color: 'from-red-500 to-red-600' },
                      zodiac: { name: '生肖契合', icon: '🐲', color: 'from-indigo-500 to-indigo-600' }
                    };
                    
                    const info = labels[key];
                    return (
                      <div key={key} className="bg-white rounded-xl p-6 border border-cultural-gold/20 hover:border-cultural-gold/40 transition-all duration-300">
                        <div className="text-center">
                          <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            <span className="text-2xl text-white">{info.icon}</span>
                          </div>
                          <h4 className="text-lg font-semibold text-cultural-ink mb-2">{info.name}</h4>
                          <div className="text-3xl font-bold text-cultural-jade mb-2">{score}分</div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${info.color} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* 详细信息 */}
              <Card variant="cultural" padding="lg">
                <h3 className="text-2xl font-bold font-heading text-cultural-ink mb-8 text-center">
                  📋 详细信息
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                        <span className="mr-2">✏️</span>
                        笔画分析
                      </h4>
                      <p className="text-blue-700">{analysisResult.details.strokes}</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                        <span className="mr-2">🌿</span>
                        五行配置
                      </h4>
                      <p className="text-green-700">{analysisResult.details.fiveElements}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                        <span className="mr-2">🎶</span>
                        读音分析
                      </h4>
                      <p className="text-purple-700">{analysisResult.details.pronunciation}</p>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                        <span className="mr-2">🐉</span>
                        生肖匹配
                      </h4>
                      <p className="text-yellow-700">{analysisResult.details.zodiacMatch}</p>
                    </div>
                  </div>
                </div>

                {/* 下载报告按钮 */}
                <div className="text-center mt-8">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      const content = `
姓名分析报告

姓名：${analysisResult.fullName}
综合评分：${analysisResult.score}分 (${getScoreLevel(analysisResult.score)})

寓意解释：
${analysisResult.meaning}

各维度评分：
- 三才五格：${analysisResult.analysis.sancai}分
- 五行平衡：${analysisResult.analysis.wuxing}分
- 音韵美感：${analysisResult.analysis.phonetic}分
- 寓意内涵：${analysisResult.analysis.meaning}分
- 文化底蕴：${analysisResult.analysis.cultural}分
- 生肖契合：${analysisResult.analysis.zodiac}分

详细信息：
- ${analysisResult.details.strokes}
- ${analysisResult.details.fiveElements}
- ${analysisResult.details.pronunciation}
- ${analysisResult.details.zodiacMatch}

分析时间：${new Date().toLocaleString()}
                      `.trim();
                      
                      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${analysisResult.fullName}_姓名分析报告.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    📥 下载分析报告
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* 功能介绍 */}
          <Card variant="cultural" padding="lg" className="mt-12">
            <h3 className="text-2xl font-bold font-heading text-cultural-ink mb-8 text-center">
              ✨ 分析功能介绍
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🔮</span>
                </div>
                <h4 className="text-lg font-semibold text-cultural-ink mb-3">三才五格</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  基于姓名学理论，分析天格、地格、人格、外格、总格的数理配置和相互关系
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">⚖️</span>
                </div>
                <h4 className="text-lg font-semibold text-cultural-ink mb-3">五行平衡</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  分析姓名中金木水火土五行的分布，评估五行之间的平衡与协调程度
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🎵</span>
                </div>
                <h4 className="text-lg font-semibold text-cultural-ink mb-3">音韵美感</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  评估姓名的声调搭配、韵律节奏，分析读音的流畅性和悦耳程度
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">📖</span>
                </div>
                <h4 className="text-lg font-semibold text-cultural-ink mb-3">寓意内涵</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  分析汉字的字义、词义搭配，评估名字所蕴含的美好寓意和文化内涵
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🏛️</span>
                </div>
                <h4 className="text-lg font-semibold text-cultural-ink mb-3">文化底蕴</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  评估姓名的文化深度，包括典故出处、诗词韵味等传统文化元素
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🐲</span>
                </div>
                <h4 className="text-lg font-semibold text-cultural-ink mb-3">生肖契合</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  根据生肖特性分析姓名的适配度，考虑生肖的性格特点和忌用字
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default NameAnalysisPage;
