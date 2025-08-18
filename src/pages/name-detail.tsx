/**
 * 名字详细分析页面
 * 基于产品设计文档的评分解释系统实现
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  getQimingInstance, 
  NameValidationResult,
  quickValidateName
} from '../lib/qiming';
import { WuxingScorer } from '../core/analysis/wuxing-scorer';
import { MeaningScorer } from '../core/analysis/meaning-scorer';
import { SocialScorer } from '../core/analysis/social-scorer';
import { PinyinAnalyzer } from '../core/analysis/pinyin-analyzer';
import { weightedScoreCalculator, ScoreComponents, DEFAULT_WEIGHTS } from '../core/calculation/weighted-score-calculator';
import { WeightConfig } from '../core/common/types';
import { evaluateNumber } from '../core/common/constants';

const NameDetailPage: React.FC = () => {
  const router = useRouter();
  const { name, weights: weightsParam } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [nameData, setNameData] = useState<NameValidationResult | null>(null);
  const [detailedScore, setDetailedScore] = useState<any>(null);
  const [userWeights, setUserWeights] = useState<WeightConfig>(DEFAULT_WEIGHTS);
  const [activeTab, setActiveTab] = useState('overview');
  const [showTraditional, setShowTraditional] = useState(false);

  // 解析权重参数
  useEffect(() => {
    if (weightsParam && typeof weightsParam === 'string') {
      try {
        const parsedWeights = JSON.parse(decodeURIComponent(weightsParam));
        setUserWeights(parsedWeights);
      } catch (error) {
        console.error('解析权重参数失败:', error);
        // 尝试从localStorage读取
        try {
          const storedWeights = localStorage.getItem('naming-weights');
          if (storedWeights) {
            setUserWeights(JSON.parse(storedWeights));
          }
        } catch (storageError) {
          console.error('从localStorage读取权重失败:', storageError);
        }
      }
    } else {
      // 如果URL没有权重参数，尝试从localStorage读取
      try {
        const storedWeights = localStorage.getItem('naming-weights');
        if (storedWeights) {
          setUserWeights(JSON.parse(storedWeights));
        }
      } catch (error) {
        console.error('从localStorage读取权重失败:', error);
      }
    }
  }, [weightsParam]);

  useEffect(() => {
    if (name && typeof name === 'string') {
      loadNameAnalysis(name);
    }
  }, [name, userWeights]);

  const loadNameAnalysis = async (fullName: string) => {
    try {
      setLoading(true);
      
      // 1. 获取基础的三才五格分析
      const result = await quickValidateName(fullName, showTraditional);
      setNameData(result);
      
      // 2. 如果名字长度为3（姓氏1字+名字2字），进行完整的五维评分分析
      if (fullName.length === 3) {
        const familyName = fullName[0];
        const givenName = fullName.slice(1);
        
        try {
          // 初始化各评分器
          const wuxingScorer = new WuxingScorer();
          const meaningScorer = new MeaningScorer();
          const socialScorer = new SocialScorer();
          const pinyinAnalyzer = PinyinAnalyzer.getInstance();
          
          // 计算各维度真实评分
          const [wuxingResult, meaningResult, socialResult, phoneticResult] = await Promise.all([
            wuxingScorer.calculateWuxingScore(familyName, givenName),
            meaningScorer.calculateMeaningScore(givenName[0], givenName[1]),
            socialScorer.calculateSocialScore(givenName[0], givenName[1]),
            Promise.resolve(pinyinAnalyzer.analyzeNamePhonetics(familyName, givenName))
          ]);
          
          // 构建评分组件
          const components: ScoreComponents = {
            sancai: result.score,                    // 三才五格评分
            wuxing: wuxingResult.score,              // 五行平衡评分
            sound: phoneticResult.harmony,           // 音韵美感评分
            meaning: meaningResult.score,            // 字义寓意评分
            social: socialResult.score               // 社会认可评分
          };
          
          // 使用用户设置的权重计算综合评分
          const detailedScoreData = weightedScoreCalculator.calculateDetailedScore(components, userWeights);
          
          // 更新名字数据，使用新的综合评分
          setNameData({
            ...result,
            score: detailedScoreData.totalScore
          });
          
          // 保存详细评分数据
          setDetailedScore({
            components,
            detailedScoreData,
            wuxingAnalysis: wuxingResult,
            meaningAnalysis: meaningResult,
            socialAnalysis: socialResult,
            phoneticAnalysis: phoneticResult
          });
          
        } catch (detailError) {
          console.error('详细评分计算失败，使用基础评分:', detailError);
        }
      }
      
    } catch (error) {
      console.error('分析名字失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在分析名字...</p>
        </div>
      </div>
    );
  }

  if (!nameData || !name) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">名字不存在</h2>
          <Link href="/naming" className="text-blue-600 hover:text-blue-800">
            返回取名页面
          </Link>
        </div>
      </div>
    );
  }

  // 获取评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-50';
    if (score >= 85) return 'text-blue-600 bg-blue-50';
    if (score >= 75) return 'text-yellow-600 bg-yellow-50';
    if (score >= 65) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  // 获取五格吉凶颜色
  const getGridColor = (value: number) => {
    const evaluation = evaluateNumber(value);
    switch (evaluation) {
      case '大吉':
        return 'text-green-600 bg-green-50 border-green-200';
      case '次吉':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case '中性':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case '凶':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // 将五行拼音转换为中文
  const getWuxingChinese = (pinyin: string) => {
    const wuxingMap: { [key: string]: string } = {
      '金': '金',
      '木': '木', 
      '水': '水',
      '火': '火',
      '土': '土'
    };
    return wuxingMap[pinyin] || pinyin;
  };

  // 生成星级评分
  const renderStars = (score: number) => {
    const stars = Math.round(score / 20);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} className={`text-lg ${i <= stars ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">({score}分)</span>
      </div>
    );
  };

  // 渲染雷达图数据
  const getRadarData = () => {
    const dimensions = [
      { name: '天格', value: nameData.grids.tiange, max: 100 },
      { name: '人格', value: nameData.grids.renge, max: 100 },
      { name: '地格', value: nameData.grids.dige, max: 100 },
      { name: '总格', value: nameData.grids.zongge, max: 100 },
      { name: '外格', value: nameData.grids.waige, max: 100 }
    ];
    
    return dimensions;
  };

  // 渲染概览标签页
  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* 总体评分 */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">总体评分</h3>
          <div className={`inline-flex items-center px-6 py-3 rounded-full text-3xl font-bold ${getScoreColor(nameData.score)}`}>
            {nameData.score} 分
          </div>
          <div className="mt-4">
            {renderStars(nameData.score)}
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${nameData.score}%` }}
              ></div>
            </div>
          </div>
          
          {/* 详细评分分解 */}
          {detailedScore && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4">🧮 评分计算详情</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* 各维度评分 */}
                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-700 mb-3">各维度评分：</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                      <span className="text-purple-700">🔮 三才五格：</span>
                      <span className="font-bold text-purple-800">{detailedScore.components.sancai}分</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-green-700">⚖️ 五行平衡：</span>
                      <span className="font-bold text-green-800">{detailedScore.components.wuxing}分</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-blue-700">🎵 音韵美感：</span>
                      <span className="font-bold text-blue-800">{detailedScore.components.sound}分</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="text-orange-700">📜 字义寓意：</span>
                      <span className="font-bold text-orange-800">{detailedScore.components.meaning}分</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-pink-50 rounded">
                      <span className="text-pink-700">👥 社会认可：</span>
                      <span className="font-bold text-pink-800">{detailedScore.components.social}分</span>
                    </div>
                  </div>
                </div>
                
                {/* 权重应用 */}
                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-700 mb-3">权重加权计算：</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">三才五格 × {detailedScore.detailedScoreData.weights.sancai}%：</span>
                      <span className="font-bold">{detailedScore.detailedScoreData.breakdown.sancai.weighted.toFixed(1)}分</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">五行平衡 × {detailedScore.detailedScoreData.weights.wuxing}%：</span>
                      <span className="font-bold">{detailedScore.detailedScoreData.breakdown.wuxing.weighted.toFixed(1)}分</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">音韵美感 × {detailedScore.detailedScoreData.weights.sound}%：</span>
                      <span className="font-bold">{detailedScore.detailedScoreData.breakdown.sound.weighted.toFixed(1)}分</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">字义寓意 × {detailedScore.detailedScoreData.weights.meaning}%：</span>
                      <span className="font-bold">{detailedScore.detailedScoreData.breakdown.meaning.weighted.toFixed(1)}分</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">社会认可 × {detailedScore.detailedScoreData.weights.social}%：</span>
                      <span className="font-bold">{detailedScore.detailedScoreData.breakdown.social.weighted.toFixed(1)}分</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-3">
                      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-50 to-green-50 rounded font-bold">
                        <span className="text-gray-800">✨ 加权总分：</span>
                        <span className="text-xl text-green-700">{detailedScore.detailedScoreData.totalScore}分</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <p className="text-sm text-gray-700 text-center">
                  <strong>📝 计算说明：</strong>使用个性化权重配置（三才五格{detailedScore.detailedScoreData.weights.sancai}% + 五行平衡{detailedScore.detailedScoreData.weights.wuxing}% + 音韵美感{detailedScore.detailedScoreData.weights.sound}% + 字义寓意{detailedScore.detailedScoreData.weights.meaning}% + 社会认可{detailedScore.detailedScoreData.weights.social}%）进行加权计算，体现您的个人偏好。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 基本信息 */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">基本信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">完整姓名:</span>
              <span className="font-semibold text-gray-800 text-xl">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">姓氏:</span>
              <span className="font-medium text-gray-800">{(name as string)[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">名字:</span>
              <span className="font-medium text-gray-800">{(name as string).slice(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">字数:</span>
              <span className="font-medium text-gray-800">{(name as string).length} 字</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">三才配置:</span>
              <span className="font-medium text-gray-800">{nameData.sancai.combination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">天格五行:</span>
              <span className="font-medium text-gray-800">{getWuxingChinese(nameData.sancai.heaven)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">人格五行:</span>
              <span className="font-medium text-gray-800">{getWuxingChinese(nameData.sancai.human)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">地格五行:</span>
              <span className="font-medium text-gray-800">{getWuxingChinese(nameData.sancai.earth)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 问题提醒 */}
      {nameData.issues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4">需要注意的问题</h3>
          <ul className="space-y-2">
            {nameData.issues.map((issue, index) => (
              <li key={index} className="flex items-start gap-2 text-red-700">
                <span className="text-red-500 mt-1">⚠️</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // 渲染三才五格标签页
  const renderSancaiTab = () => (
    <div className="space-y-8">
      {/* 五格数理展示 */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">五格数理</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            { name: '天格', value: nameData.grids.tiange, desc: '祖宗运势' },
            { name: '人格', value: nameData.grids.renge, desc: '主运势' },
            { name: '地格', value: nameData.grids.dige, desc: '前运势' },
            { name: '总格', value: nameData.grids.zongge, desc: '后运势' },
            { name: '外格', value: nameData.grids.waige, desc: '副运势' }
          ].map((grid, index) => (
            <div key={index} className="text-center bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-800 mb-2">{grid.value}</div>
              <div className="font-medium text-gray-800 mb-1">{grid.name}</div>
              <div className="text-xs text-gray-600">{grid.desc}</div>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded text-xs border ${getGridColor(grid.value)}`}>
                  {evaluateNumber(grid.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 三才配置详解 */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">三才配置详解</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center bg-blue-50 rounded-lg p-6">
            <div className="text-3xl mb-2">☁️</div>
            <div className="font-semibold text-blue-800">天格 - {getWuxingChinese(nameData.sancai.heaven)}</div>
            <div className="text-sm text-blue-600 mt-2">代表祖宗运势和家族传承</div>
          </div>
          <div className="text-center bg-green-50 rounded-lg p-6">
            <div className="text-3xl mb-2">👤</div>
            <div className="font-semibold text-green-800">人格 - {getWuxingChinese(nameData.sancai.human)}</div>
            <div className="text-sm text-green-600 mt-2">代表个人主运和性格特征</div>
          </div>
          <div className="text-center bg-yellow-50 rounded-lg p-6">
            <div className="text-3xl mb-2">🌍</div>
            <div className="font-semibold text-yellow-800">地格 - {getWuxingChinese(nameData.sancai.earth)}</div>
            <div className="text-sm text-yellow-600 mt-2">代表前运和早年运势</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="font-medium text-gray-800 mb-2">三才配置: {nameData.sancai.combination}</div>
          <div className="text-gray-600">{nameData.sancai.description}</div>
        </div>
      </div>

      {/* 雷达图展示 */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">五格雷达图</h3>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="space-y-3">
              {getRadarData().map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 w-12">{item.name}:</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(item.value, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-800 w-8">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-sm">五格分析图表</div>
              <div className="text-xs mt-2">展示各格数理的平衡状态</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 渲染详细解释标签页
  const renderExplanationTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">详细计算过程</h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {nameData.explanation}
          </pre>
        </div>
      </div>

      {/* 改名建议 */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">专业建议</h3>
        <div className="space-y-4">
          {nameData.score >= 90 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✅</span>
                <div>
                  <div className="font-medium text-green-800">优秀名字</div>
                  <div className="text-green-700 text-sm mt-1">
                    这是一个非常优秀的名字，各方面配置都很理想，建议使用。
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {nameData.score >= 70 && nameData.score < 90 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">ℹ️</span>
                <div>
                  <div className="font-medium text-blue-800">良好名字</div>
                  <div className="text-blue-700 text-sm mt-1">
                    这是一个不错的名字，大部分方面都比较理想，可以考虑使用。
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {nameData.score < 70 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 text-xl">⚠️</span>
                <div>
                  <div className="font-medium text-yellow-800">需要改进</div>
                  <div className="text-yellow-700 text-sm mt-1">
                    这个名字在某些方面可能需要改进，建议考虑其他选择。
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="font-medium text-blue-800 mb-2">文化寓意</div>
            <div className="text-blue-700 text-sm">
              名字不仅要考虑数理配置，还要注重文化内涵和美好寓意。
              建议结合家族传统和个人喜好来最终确定。
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/naming" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
              <span>←</span>
              <span>返回取名</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-800">名字详细分析</h1>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showTraditional}
                  onChange={(e) => {
                    setShowTraditional(e.target.checked);
                    if (name) loadNameAnalysis(name as string);
                  }}
                  className="rounded"
                />
                <span>繁体笔画</span>
              </label>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 名字标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{name}</h1>
          <p className="text-gray-600">
            {showTraditional ? '繁体' : '简体'}笔画计算 | 综合评分 {nameData.score} 分
          </p>
        </div>

        {/* 标签页导航 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            {[
              { id: 'overview', label: '综合概览', icon: '📋' },
              { id: 'sancai', label: '三才五格', icon: '🔮' },
              { id: 'explanation', label: '详细解释', icon: '📖' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 标签页内容 */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'sancai' && renderSancaiTab()}
        {activeTab === 'explanation' && renderExplanationTab()}

        {/* 操作按钮 */}
        <div className="text-center mt-12">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              返回上一页
            </button>
            <Link
              href="/naming"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              重新取名
            </Link>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${name} - 评分: ${nameData.score}分`);
                alert('已复制到剪贴板');
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              复制名字
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameDetailPage;