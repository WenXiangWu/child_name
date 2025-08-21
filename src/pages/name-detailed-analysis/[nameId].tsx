import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';

interface ScoringDetail {
  score: number;
  reason: string;
  calculation: any;
}

interface ScoreDetails {
  sancai: ScoringDetail;
  wuxing: ScoringDetail;
  phonetic: ScoringDetail;
  meaning: ScoringDetail;
  cultural: ScoringDetail;
  zodiac: ScoringDetail;
}

interface NameDetailData {
  fullName: string;
  familyName: string;
  midChar: string;
  lastChar: string;
  components: {
    surname: { char: string; strokes: number; wuxing: string };
    first: { char: string; strokes: number; wuxing: string };
    second: { char: string; strokes: number; wuxing: string };
  };
  scores: {
    sancai: number;
    wuxing: number;
    phonetic: number;
    meaning: number;
    cultural: number;
    zodiac: number;
  };
  scoringDetails: ScoreDetails;
  comprehensiveScore: number;
  comprehensiveCalculation: string;
  grade: string;
  recommendation: string;
  grids: {
    tiange: number;
    renge: number;
    dige: number;
    waige: number;
    zongge: number;
  };
  sancai: {
    combination: string;
    level: string;
    heaven: string;
    human: string;
    earth: string;
  };
}

export default function NameDetailedAnalysis() {
  const router = useRouter();
  const { nameId } = router.query;
  
  const [nameData, setNameData] = useState<NameDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!nameId || typeof nameId !== 'string') return;
    
    // 从 sessionStorage 或 localStorage 获取名字数据
    const loadNameData = () => {
      try {
        // 首先尝试从 sessionStorage 获取
        const sessionData = sessionStorage.getItem('currentGeneratedNames');
        if (sessionData) {
          const generatedNames = JSON.parse(sessionData);
          const targetName = generatedNames.find((name: any) => 
            encodeURIComponent(name.fullName) === nameId || name.fullName === decodeURIComponent(nameId as string)
          );
          
          if (targetName && targetName.scoringDetails) {
            setNameData(targetName);
            setLoading(false);
            return;
          }
        }
        
        // 如果 sessionStorage 中没有，尝试 localStorage
        const localData = localStorage.getItem('lastGeneratedNames');
        if (localData) {
          const generatedNames = JSON.parse(localData);
          const targetName = generatedNames.find((name: any) => 
            encodeURIComponent(name.fullName) === nameId || name.fullName === decodeURIComponent(nameId as string)
          );
          
          if (targetName && targetName.scoringDetails) {
            setNameData(targetName);
            setLoading(false);
            return;
          }
        }
        
        // 如果都没有找到，显示错误
        setLoading(false);
      } catch (error) {
        console.error('加载名字数据失败:', error);
        setLoading(false);
      }
    };

    loadNameData();
  }, [nameId]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-100';
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 85) return 'text-blue-600 bg-blue-50';
    if (score >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'S级': return 'text-purple-600 bg-purple-100';
      case 'A级': return 'text-green-600 bg-green-100';
      case 'B级': return 'text-blue-600 bg-blue-100';
      case 'C级': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const formatCalculationDetail = (calculation: any) => {
    if (typeof calculation === 'string') {
      return calculation;
    }
    
    if (typeof calculation === 'object' && calculation !== null) {
      return Object.entries(calculation).map(([key, value]) => (
        <div key={key} className="text-sm">
          <span className="font-medium text-gray-600">{key}:</span>
          <span className="ml-2 text-gray-800">
            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </span>
        </div>
      ));
    }
    
    return String(calculation);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">正在加载名字详细分析...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!nameData) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">数据未找到</h1>
            <p className="text-gray-600 mb-6">无法找到该名字的详细分析数据</p>
            <Link 
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* 头部导航 */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
                >
                  <span>←</span>
                  <span>返回</span>
                </button>
                <div className="text-2xl font-bold text-gray-800">
                  {nameData.fullName} 详细分析
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getGradeColor(nameData.grade)}`}>
                {nameData.grade} · {nameData.comprehensiveScore}分
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 基本信息概览 */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">字符构成</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">姓氏:</span>
                    <span className="font-medium">{nameData.familyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">名字:</span>
                    <span className="font-medium">{nameData.midChar} + {nameData.lastChar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">全名:</span>
                    <span className="font-medium text-lg">{nameData.fullName}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">笔画结构</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{nameData.components.surname.char}:</span>
                    <span className="font-medium">{nameData.components.surname.strokes}画</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{nameData.components.first.char}:</span>
                    <span className="font-medium">{nameData.components.first.strokes}画</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{nameData.components.second.char}:</span>
                    <span className="font-medium">{nameData.components.second.strokes}画</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">五行属性</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{nameData.components.surname.char}:</span>
                    <span className="font-medium">{nameData.components.surname.wuxing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{nameData.components.first.char}:</span>
                    <span className="font-medium">{nameData.components.first.wuxing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{nameData.components.second.char}:</span>
                    <span className="font-medium">{nameData.components.second.wuxing}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 五格数理 */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">五格数理</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">天格</div>
                <div className="text-2xl font-bold text-gray-800">{nameData.grids.tiange}</div>
                <div className="text-xs text-gray-500 mt-1">{nameData.sancai.heaven}</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">人格</div>
                <div className="text-2xl font-bold text-blue-600">{nameData.grids.renge}</div>
                <div className="text-xs text-blue-500 mt-1">{nameData.sancai.human}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">地格</div>
                <div className="text-2xl font-bold text-green-600">{nameData.grids.dige}</div>
                <div className="text-xs text-green-500 mt-1">{nameData.sancai.earth}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">总格</div>
                <div className="text-2xl font-bold text-gray-800">{nameData.grids.zongge}</div>
                <div className="text-xs text-gray-500 mt-1">总体</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">外格</div>
                <div className="text-2xl font-bold text-gray-800">{nameData.grids.waige}</div>
                <div className="text-xs text-gray-500 mt-1">外在</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800">三才配置: {nameData.sancai.combination}</div>
              <div className="text-xs text-blue-600 mt-1">{nameData.sancai.level}</div>
            </div>
          </div>

          {/* 各维度详细评分 */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">各维度详细评分</h2>
            
            {/* 三才配置评分 */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('sancai')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔮</span>
                      <h3 className="text-lg font-semibold text-gray-800">三才配置</h3>
                    </div>
                    <div className="text-sm text-gray-600">权重: 25%</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-lg font-semibold ${getScoreColor(nameData.scores.sancai)}`}>
                      {nameData.scores.sancai}分
                    </div>
                    <span className={`transition-transform ${expandedSections.sancai ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {nameData.scoringDetails.sancai.reason}
                </div>
              </div>
              
              {expandedSections.sancai && (
                <div className="px-6 pb-6 border-t bg-gray-50">
                  <h4 className="font-medium text-gray-800 mb-3 mt-4">详细计算过程:</h4>
                  <div className="space-y-2 text-sm">
                    {formatCalculationDetail(nameData.scoringDetails.sancai.calculation)}
                  </div>
                </div>
              )}
            </div>

            {/* 五行平衡评分 */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('wuxing')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚖️</span>
                      <h3 className="text-lg font-semibold text-gray-800">五行平衡</h3>
                    </div>
                    <div className="text-sm text-gray-600">权重: 25%</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-lg font-semibold ${getScoreColor(nameData.scores.wuxing)}`}>
                      {nameData.scores.wuxing}分
                    </div>
                    <span className={`transition-transform ${expandedSections.wuxing ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {nameData.scoringDetails.wuxing.reason}
                </div>
              </div>
              
              {expandedSections.wuxing && (
                <div className="px-6 pb-6 border-t bg-gray-50">
                  <h4 className="font-medium text-gray-800 mb-3 mt-4">详细计算过程:</h4>
                  <div className="space-y-2 text-sm">
                    {formatCalculationDetail(nameData.scoringDetails.wuxing.calculation)}
                  </div>
                </div>
              )}
            </div>

            {/* 音韵美感评分 */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('phonetic')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎵</span>
                      <h3 className="text-lg font-semibold text-gray-800">音韵美感</h3>
                    </div>
                    <div className="text-sm text-gray-600">权重: 15%</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-lg font-semibold ${getScoreColor(nameData.scores.phonetic)}`}>
                      {nameData.scores.phonetic}分
                    </div>
                    <span className={`transition-transform ${expandedSections.phonetic ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {nameData.scoringDetails.phonetic.reason}
                </div>
              </div>
              
              {expandedSections.phonetic && (
                <div className="px-6 pb-6 border-t bg-gray-50">
                  <h4 className="font-medium text-gray-800 mb-3 mt-4">详细计算过程:</h4>
                  <div className="space-y-2 text-sm">
                    {formatCalculationDetail(nameData.scoringDetails.phonetic.calculation)}
                  </div>
                </div>
              )}
            </div>

            {/* 寓意内涵评分 */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('meaning')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💎</span>
                      <h3 className="text-lg font-semibold text-gray-800">寓意内涵</h3>
                    </div>
                    <div className="text-sm text-gray-600">权重: 15%</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-lg font-semibold ${getScoreColor(nameData.scores.meaning)}`}>
                      {nameData.scores.meaning}分
                    </div>
                    <span className={`transition-transform ${expandedSections.meaning ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {nameData.scoringDetails.meaning.reason}
                </div>
              </div>
              
              {expandedSections.meaning && (
                <div className="px-6 pb-6 border-t bg-gray-50">
                  <h4 className="font-medium text-gray-800 mb-3 mt-4">详细计算过程:</h4>
                  <div className="space-y-2 text-sm">
                    {formatCalculationDetail(nameData.scoringDetails.meaning.calculation)}
                  </div>
                </div>
              )}
            </div>

            {/* 文化底蕴评分 */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('cultural')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📚</span>
                      <h3 className="text-lg font-semibold text-gray-800">文化底蕴</h3>
                    </div>
                    <div className="text-sm text-gray-600">权重: 12%</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-lg font-semibold ${getScoreColor(nameData.scores.cultural)}`}>
                      {nameData.scores.cultural}分
                    </div>
                    <span className={`transition-transform ${expandedSections.cultural ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {nameData.scoringDetails.cultural.reason}
                </div>
              </div>
              
              {expandedSections.cultural && (
                <div className="px-6 pb-6 border-t bg-gray-50">
                  <h4 className="font-medium text-gray-800 mb-3 mt-4">详细计算过程:</h4>
                  <div className="space-y-2 text-sm">
                    {formatCalculationDetail(nameData.scoringDetails.cultural.calculation)}
                  </div>
                </div>
              )}
            </div>

            {/* 生肖契合评分 */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('zodiac')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🐲</span>
                      <h3 className="text-lg font-semibold text-gray-800">生肖契合</h3>
                    </div>
                    <div className="text-sm text-gray-600">权重: 8%</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-lg font-semibold ${getScoreColor(nameData.scores.zodiac)}`}>
                      {nameData.scores.zodiac}分
                    </div>
                    <span className={`transition-transform ${expandedSections.zodiac ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {nameData.scoringDetails.zodiac.reason}
                </div>
              </div>
              
              {expandedSections.zodiac && (
                <div className="px-6 pb-6 border-t bg-gray-50">
                  <h4 className="font-medium text-gray-800 mb-3 mt-4">详细计算过程:</h4>
                  <div className="space-y-2 text-sm">
                    {formatCalculationDetail(nameData.scoringDetails.zodiac.calculation)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 综合评分总结 */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">综合评分总结</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">加权计算过程</h3>
                <div className="text-sm text-gray-600 font-mono bg-gray-50 p-3 rounded">
                  {nameData.comprehensiveCalculation}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">专家建议</h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {nameData.recommendation}
                </div>
              </div>
            </div>
          </div>

          {/* 返回按钮 */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回名字列表
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
