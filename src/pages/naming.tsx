/**
 * 专业宝宝取名页面
 * 基于产品设计文档的完整实现
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  getQimingInstance, 
  GeneratedName, 
  NameGenerationConfig,
  WuxingElement,
  Gender,
  ZodiacAnimal,
  zodiacService
} from '../lib/qiming';
import StrokeAnalysisPopup from '../components/StrokeAnalysisPopup';
import WuxingAnalysisPopup from '../components/WuxingAnalysisPopup';
import SancaiCalculationPopup from '../components/SancaiCalculationPopup';
import CandidateFilteringPopup from '../components/CandidateFilteringPopup';
import PhoneticFilteringPopup from '../components/PhoneticFilteringPopup';
import { LunarCalendar as LunarCalendarLib, LunarInfo } from '@/lib/lunar';
import { createBaijiaxingSurnameInputHandler, getBaijiaxingList } from '@/utils/chineseValidation';

const NamingPage: React.FC = () => {
  const router = useRouter();
  
  // 基础信息状态
  const [currentStep, setCurrentStep] = useState(1);
  const [familyName, setFamilyName] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [useLunarAnalysis, setUseLunarAnalysis] = useState(true);
  const [lunarInfo, setLunarInfo] = useState<LunarInfo | null>(null);
  const [xiYongShenResult, setXiYongShenResult] = useState<any>(null);
  const [zodiac, setZodiac] = useState<ZodiacAnimal | null>(null);
  const [useZodiacFiltering, setUseZodiacFiltering] = useState(true);
  
  // 个性化设置状态
  const [weights, setWeights] = useState({
    sancai: 25,
    wuxing: 25,
    sound: 20,
    meaning: 20,
    social: 10
  });
  const [preferredWuxing, setPreferredWuxing] = useState<WuxingElement[]>([]);
  const [avoidedWords, setAvoidedWords] = useState<string>('');
  const [useTraditional, setUseTraditional] = useState(false);
  const [scoreThreshold, setScoreThreshold] = useState(85);
  
  // 生成状态
  const [loading, setLoading] = useState(false);
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [selectedNames, setSelectedNames] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'sancai' | 'zodiac'>('score');
  const [filterScore, setFilterScore] = useState(0);
  
  // 分页状态
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentConfig, setCurrentConfig] = useState<any>(null);
  const [generationProcess, setGenerationProcess] = useState<any>(null);
  const [showProcess, setShowProcess] = useState(false);
  
  // 界面状态
  const [showStrokeAnalysis, setShowStrokeAnalysis] = useState(false);
  const [showWuxingAnalysis, setShowWuxingAnalysis] = useState(false);
  const [showSancaiCalculation, setShowSancaiCalculation] = useState(false);
  const [showCandidateFiltering, setShowCandidateFiltering] = useState(false);
  const [showPhoneticFiltering, setShowPhoneticFiltering] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showCulturalInfo, setShowCulturalInfo] = useState(false);
  
  // 错误状态管理
  const [surnameError, setSurnameError] = useState<string>('');
  const [isValidSurname, setIsValidSurname] = useState<boolean>(true);

  // 预加载百家姓数据
  useEffect(() => {
    getBaijiaxingList().catch(console.error);
  }, []);

  // 创建姓氏输入处理函数（带百家姓校验）
  const handleFamilyNameChange = createBaijiaxingSurnameInputHandler(
    (value: string) => {
      setFamilyName(value);
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

  // 监听出生日期变化，自动计算生肖
  useEffect(() => {
    const calculateZodiac = async () => {
      if (birthDate) {
        try {
          const year = new Date(birthDate).getFullYear();
          await zodiacService.initialize();
          const calculatedZodiac = zodiacService.getZodiacByYear(year);
          setZodiac(calculatedZodiac);
          console.log(`出生年份 ${year} 对应生肖: ${calculatedZodiac}`);
        } catch (error) {
          console.error('计算生肖失败:', error);
        }
      } else {
        setZodiac(null);
      }
    };

    calculateZodiac();
  }, [birthDate]);

  // 时间描述函数 - 更精确的十二时辰划分
  const getTimeDescription = (time: string): string => {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    // 传统十二时辰对照 (每个时辰2小时，共24小时)
    const timeRanges = [
      { start: 1380, end: 1440, name: '子时', desc: '夜半', period: '23:00-01:00' }, // 23:00-24:00
      { start: 0, end: 60, name: '子时', desc: '夜半', period: '23:00-01:00' },     // 00:00-01:00
      { start: 60, end: 180, name: '丑时', desc: '鸡鸣', period: '01:00-03:00' },
      { start: 180, end: 300, name: '寅时', desc: '平旦', period: '03:00-05:00' },
      { start: 300, end: 420, name: '卯时', desc: '日出', period: '05:00-07:00' },
      { start: 420, end: 540, name: '辰时', desc: '食时', period: '07:00-09:00' },
      { start: 540, end: 660, name: '巳时', desc: '隅中', period: '09:00-11:00' },
      { start: 660, end: 780, name: '午时', desc: '日中', period: '11:00-13:00' },
      { start: 780, end: 900, name: '未时', desc: '日昳', period: '13:00-15:00' },
      { start: 900, end: 1020, name: '申时', desc: '晡时', period: '15:00-17:00' },
      { start: 1020, end: 1140, name: '酉时', desc: '日入', period: '17:00-19:00' },
      { start: 1140, end: 1260, name: '戌时', desc: '黄昏', period: '19:00-21:00' },
      { start: 1260, end: 1380, name: '亥时', desc: '人定', period: '21:00-23:00' }
    ];
    
    const timeRange = timeRanges.find(range => 
      totalMinutes >= range.start && totalMinutes < range.end
    );
    
    return timeRange ? `${timeRange.name} (${timeRange.desc}) ${timeRange.period}` : '';
  };

  // 五行元素选项
  const wuxingOptions = [
    { value: '金', label: '金', color: 'bg-yellow-100 text-yellow-800' },
    { value: '木', label: '木', color: 'bg-green-100 text-green-800' },
    { value: '水', label: '水', color: 'bg-blue-100 text-blue-800' },
    { value: '火', label: '火', color: 'bg-red-100 text-red-800' },
    { value: '土', label: '土', color: 'bg-brown-100 text-brown-800' }
  ];

  // 权重调整处理
  const handleWeightChange = (dimension: string, value: number) => {
    const remaining = 100 - value;
    const otherDimensions = Object.keys(weights).filter(key => key !== dimension);
    const otherTotal = otherDimensions.reduce((sum, key) => sum + weights[key as keyof typeof weights], 0);
    
    if (otherTotal === 0) return;
    
    const newWeights = { ...weights, [dimension]: value };
    otherDimensions.forEach(key => {
      newWeights[key as keyof typeof weights] = Math.round(
        (weights[key as keyof typeof weights] / otherTotal) * remaining
      );
    });
    
    setWeights(newWeights);
    
    // 保存权重到localStorage，供详情页使用
    try {
      localStorage.setItem('naming-weights', JSON.stringify(newWeights));
    } catch (error) {
      console.error('保存权重到localStorage失败:', error);
    }
  };

  // 生成名字
  const generateNames = async (offset: number = 0, append: boolean = false) => {
    if (!familyName || !gender) {
      alert('请先填写姓氏和选择性别');
      return;
    }

    setLoading(true);
    
    try {
      console.log('开始生成名字...', { offset, append });
      
      // 安全地构建请求体，避免循环引用
      const requestBody = {
        familyName: String(familyName || ''),
        gender: String(gender || ''),
        birthDate: String(birthDate || ''),
        birthTime: String(birthTime || ''),
        zodiac: zodiac || undefined,
        useZodiacFiltering: Boolean(useZodiacFiltering),
        preferredElements: Array.isArray(preferredWuxing) ? [...preferredWuxing] : [],
        avoidedWords: avoidedWords ? String(avoidedWords).split('') : [],
        scoreThreshold: Number(scoreThreshold || 80),
        useTraditional: Boolean(useTraditional),
        limit: 5,
        offset: Number(offset || 0),
        weights: {
          sancai: Number(weights.sancai),
          wuxing: Number(weights.wuxing),
          sound: Number(weights.sound),
          meaning: Number(weights.meaning),
          social: Number(weights.social)
        }
      };
      
      console.log('API请求参数:', {
        familyName: requestBody.familyName,
        gender: requestBody.gender,
        preferredElementsCount: requestBody.preferredElements.length,
        limit: requestBody.limit,
        offset: requestBody.offset
      });
      
      const response = await fetch('/api/generate-names-detailed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API错误: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('API响应:', result);

      if (!result.success) {
        throw new Error(result.error || '生成名字失败');
      }

      const { names, pagination, generationProcess } = result.data;
      
      if (append) {
        // 追加新名字
        setGeneratedNames(prev => [...prev, ...names]);
      } else {
        // 替换名字列表，重置分页
        setGeneratedNames(names);
        setCurrentStep(3);
        setCurrentOffset(0);
        // 保存生成过程数据
        setGenerationProcess(generationProcess);
      }
      
      setCurrentOffset(pagination.offset + pagination.limit);
      setHasMore(pagination.hasMore && names.length === pagination.limit);
      setCurrentConfig(requestBody);
      
      if (!names || names.length === 0) {
        if (!append) {
          alert('未能生成合适的名字，请尝试调整筛选条件');
        } else {
          alert('没有更多名字了');
        }
      }
    } catch (error) {
      console.error('生成名字失败:', error);
      alert('生成名字失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // "再来一批"功能
  const generateMoreNames = async () => {
    await generateNames(currentOffset, true);
  };

  // 过滤和排序名字
  const filteredAndSortedNames = generatedNames
    .filter(name => name.score >= filterScore)
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'name':
          return a.fullName.localeCompare(b.fullName);
        case 'sancai':
          return a.sancai.combination.localeCompare(b.sancai.combination);
        case 'zodiac':
          // 按生肖评估分数排序，如果没有生肖评估则按基础评分排序
          const aZodiacScore = a.zodiacEvaluation?.overallScore || a.score;
          const bZodiacScore = b.zodiacEvaluation?.overallScore || b.score;
          return bZodiacScore - aZodiacScore;
        default:
          return 0;
      }
    });

  // 收藏/取消收藏名字
  const toggleNameSelection = (fullName: string) => {
    const newSelected = new Set(selectedNames);
    if (newSelected.has(fullName)) {
      newSelected.delete(fullName);
    } else {
      newSelected.add(fullName);
    }
    setSelectedNames(newSelected);
  };

  // 获取评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 85) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 75) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 65) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // 渲染步骤1：基础信息采集
  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">基础信息</h2>
        <p className="text-gray-600">请填写宝宝的基本信息，我们将为您生成专业的名字推荐</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            宝宝姓氏 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={familyName}
            onChange={handleFamilyNameChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
              surnameError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }`}
            placeholder="请输入姓氏"
            maxLength={2}
          />
          {surnameError && (
            <p className="text-xs text-red-600 mt-2 animate-pulse">
              ⚠️ {surnameError}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            宝宝性别 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setGender('male')}
              className={`p-4 rounded-lg border-2 transition-all ${
                gender === 'male'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">👦</div>
              <div className="font-medium">男宝宝</div>
            </button>
            <button
              onClick={() => setGender('female')}
              className={`p-4 rounded-lg border-2 transition-all ${
                gender === 'female'
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">👧</div>
              <div className="font-medium">女宝宝</div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              出生日期 <span className="text-gray-400">(可选)</span>
            </label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  max={new Date().toISOString().split('T')[0]}
                />
                <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                  📅
                </div>
              </div>
              
              {/* 快速日期选择 */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(() => {
                  const today = new Date();
                  const yesterday = new Date(today);
                  yesterday.setDate(today.getDate() - 1);
                  const weekAgo = new Date(today);
                  weekAgo.setDate(today.getDate() - 7);
                  const monthAgo = new Date(today);
                  monthAgo.setMonth(today.getMonth() - 1);
                  
                  return [
                    { date: today.toISOString().split('T')[0], label: '今天' },
                    { date: yesterday.toISOString().split('T')[0], label: '昨天' },
                    { date: weekAgo.toISOString().split('T')[0], label: '一周前' },
                    { date: monthAgo.toISOString().split('T')[0], label: '一月前' },
                    { date: '2024-01-01', label: '2024年初' },
                    { date: '2023-12-31', label: '2023年末' }
                  ];
                })().map((preset) => (
                  <button
                    key={preset.date}
                    onClick={() => setBirthDate(preset.date)}
                    className={`px-2 py-1 rounded border text-center transition-all ${
                      birthDate === preset.date
                        ? 'bg-green-100 border-green-300 text-green-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            
            {birthDate && (
              <div className="mt-2 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 font-medium">
                  选择的日期：{new Date(birthDate).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </p>
                {zodiac && (
                  <p className="text-xs text-green-600 mt-1">
                    🐾 生肖：{zodiac}年
                  </p>
                )}
                <p className="text-xs text-green-600">
                  生辰八字计算将基于此日期时间
                </p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              出生时间 <span className="text-gray-400">(可选)</span>
            </label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="900"
                />
                <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                  🕐
                </div>
              </div>
              
              {/* 快速时间选择 - 完整十二时辰 */}
              <div className="space-y-2">
                <div className="text-xs text-gray-600 font-medium mb-2">传统十二时辰快速选择：</div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { time: '00:00', label: '子时', desc: '夜半' },
                    { time: '01:00', label: '丑时', desc: '鸡鸣' },
                    { time: '03:00', label: '寅时', desc: '平旦' },
                    { time: '05:00', label: '卯时', desc: '日出' },
                    { time: '07:00', label: '辰时', desc: '食时' },
                    { time: '09:00', label: '巳时', desc: '隅中' },
                    { time: '11:00', label: '午时', desc: '日中' },
                    { time: '13:00', label: '未时', desc: '日昳' },
                    { time: '15:00', label: '申时', desc: '晡时' },
                    { time: '17:00', label: '酉时', desc: '日入' },
                    { time: '19:00', label: '戌时', desc: '黄昏' },
                    { time: '21:00', label: '亥时', desc: '人定' }
                  ].map((preset) => (
                    <button
                      key={preset.time}
                      onClick={() => setBirthTime(preset.time)}
                      className={`px-2 py-2 rounded border text-center transition-all hover:shadow-sm ${
                        birthTime === preset.time
                          ? 'bg-blue-100 border-blue-300 text-blue-700 shadow-sm'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                      title={`${preset.label} (${preset.desc}) - ${preset.time}`}
                    >
                      <div className="font-medium">{preset.label}</div>
                      <div className="text-xs opacity-75">{preset.time}</div>
                    </button>
                  ))}
                </div>
                
                {/* 现代时间快速选择 */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-600 font-medium mb-2">现代时间快速选择：</div>
                  <div className="grid grid-cols-6 gap-2 text-xs">
                    {[
                      { time: '06:00', label: '早晨', icon: '🌅' },
                      { time: '08:00', label: '上班', icon: '💼' },
                      { time: '12:00', label: '中午', icon: '☀️' },
                      { time: '14:00', label: '午后', icon: '🌤️' },
                      { time: '18:00', label: '傍晚', icon: '🌆' },
                      { time: '22:00', label: '夜晚', icon: '🌙' }
                    ].map((preset) => (
                      <button
                        key={preset.time}
                        onClick={() => setBirthTime(preset.time)}
                        className={`px-2 py-2 rounded border text-center transition-all ${
                          birthTime === preset.time
                            ? 'bg-green-100 border-green-300 text-green-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                        title={`${preset.label} - ${preset.time}`}
                      >
                        <div className="text-lg mb-1">{preset.icon}</div>
                        <div className="font-medium">{preset.label}</div>
                        <div className="text-xs opacity-75">{preset.time}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {birthTime && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 font-medium">
                  选择的时间：{birthTime}
                </p>
                <p className="text-xs text-blue-600">
                  对应时辰：{getTimeDescription(birthTime)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-6">
          <button
            onClick={() => setCurrentStep(2)}
            disabled={!familyName || !gender}
            className={`px-8 py-3 rounded-lg font-medium transition-all ${
              familyName && gender
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            下一步：个性化设置
          </button>
          
          <button
            onClick={() => generateNames()}
            disabled={!familyName || !gender || loading}
            className={`px-8 py-3 rounded-lg font-medium border-2 transition-all ${
              familyName && gender && !loading
                ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                : 'border-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? '生成中...' : '快速生成'}
          </button>
        </div>
      </div>
    </div>
  );

  // 渲染步骤2：个性化设置
  const renderStep2 = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">个性化设置</h2>
        <p className="text-gray-600">调整评分权重和偏好，让名字更符合您的期望</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 评分权重调整 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">评分权重调整</h3>
          <div className="space-y-4">
            {Object.entries(weights).map(([key, value]) => {
              const labels = {
                sancai: '三才五格',
                wuxing: '五行平衡', 
                sound: '音韵美感',
                meaning: '字义寓意',
                social: '社会认可'
              };
              return (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      {labels[key as keyof typeof labels]}
                    </label>
                    <span className="text-sm text-gray-600">{value}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => handleWeightChange(key, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 偏好设置 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">偏好设置</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                五行偏好
              </label>
              <div className="flex flex-wrap gap-2">
                {wuxingOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      const element = option.value as WuxingElement;
                      setPreferredWuxing(prev => 
                        prev.includes(element)
                          ? prev.filter(x => x !== element)
                          : [...prev, element]
                      );
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      preferredWuxing.includes(option.value as WuxingElement)
                        ? option.color
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                避免字符
              </label>
              <input
                type="text"
                value={avoidedWords}
                onChange={(e) => setAvoidedWords(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="如：病、死、凶"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                评分要求
              </label>
              <select
                value={scoreThreshold}
                onChange={(e) => setScoreThreshold(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={60}>60分以上</option>
                <option value={70}>70分以上</option>
                <option value={80}>80分以上</option>
                <option value={85}>85分以上</option>
                <option value={90}>90分以上</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="useTraditional"
                checked={useTraditional}
                onChange={(e) => setUseTraditional(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="useTraditional" className="ml-2 text-sm text-gray-700">
                使用繁体字笔画计算
              </label>
            </div>

            {zodiac && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useZodiacFiltering"
                  checked={useZodiacFiltering}
                  onChange={(e) => setUseZodiacFiltering(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="useZodiacFiltering" className="ml-2 text-sm text-gray-700">
                  启用生肖筛选 ({zodiac}年适用)
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setCurrentStep(1)}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            上一步
          </button>
          <button
            onClick={() => generateNames()}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '生成中...' : '开始生成名字'}
          </button>
        </div>
      </div>
    </div>
  );

  // 渲染步骤3：结果展示
  const renderStep3 = () => (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">推荐名字</h2>
        <p className="text-gray-600">
          为 {familyName} 家的 {gender === 'female' ? '女宝宝' : '男宝宝'} 
          推荐了 {filteredAndSortedNames.length} 个优质名字
        </p>
        
        {/* 生成过程展示按钮 */}
        {generationProcess && (
          <button
            onClick={() => setShowProcess(!showProcess)}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm shadow-lg"
          >
            {showProcess ? '隐藏生成过程 📊' : '查看生成过程 🔍'}
          </button>
        )}
      </div>

      {/* 生成过程详情 */}
      {showProcess && generationProcess && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🔬</span>
            名字生成全过程分析
          </h3>
          
          <div className="space-y-4">
            {/* 步骤1：姓氏分析 */}
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
              <h4 className="font-medium text-blue-700 mb-2">步骤1：姓氏分析</h4>
              <p className="text-sm text-gray-600">{generationProcess.step1_familyAnalysis?.description}</p>
            </div>

            {/* 步骤2：笔画组合 */}
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-700">步骤2：笔画组合筛选</h4>
                <button
                  onClick={() => setShowStrokeAnalysis(true)}
                  className="w-6 h-6 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors flex items-center justify-center"
                  title="了解笔画组合筛选原理"
                >
                  ?
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{generationProcess.step2_strokeCombinations?.description}</p>
              <div className="text-xs text-gray-500">
                优选组合：
                {generationProcess.step2_strokeCombinations?.topCombinations?.slice(0, 3).map((combo: any, i: number) => (
                  <span key={i} className="ml-2 bg-gray-100 px-2 py-1 rounded">
                    {combo.mid}+{combo.last}画
                  </span>
                ))}
              </div>
            </div>

            {/* 步骤3：五行要求 */}
            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-purple-700">步骤3：五行配置</h4>
                <button
                  onClick={() => setShowWuxingAnalysis(true)}
                  className="w-6 h-6 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600 transition-colors flex items-center justify-center"
                  title="了解五行配置原理"
                >
                  ?
                </button>
              </div>
              <p className="text-sm text-gray-600">{generationProcess.step3_wuxingRequirements?.description}</p>
            </div>

            {/* 步骤4：三才五格分析 */}
            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-orange-700">步骤4：三才五格分析</h4>
                <button
                  onClick={() => setShowSancaiCalculation(true)}
                  className="w-6 h-6 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 transition-colors flex items-center justify-center"
                  title="了解三才五格计算原理"
                >
                  ?
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">{generationProcess.step4_sancaiWugeAnalysis?.description}</p>
              
              <div className="space-y-3">
                {generationProcess.step4_sancaiWugeAnalysis?.detailedAnalysis?.slice(0, 3).map((analysis: any, i: number) => (
                  <div key={i} className="bg-gray-50 p-3 rounded text-xs">
                    <div className="font-medium text-gray-700 mb-2">
                      组合{analysis.rank}：{analysis.combination.mid}画+{analysis.combination.last}画
                    </div>
                    
                    {/* 五格信息 */}
                    <div className="grid grid-cols-5 gap-2 mb-2 text-center">
                      <div className="bg-blue-100 p-1 rounded">
                        <div className="text-xs text-blue-600">天格</div>
                        <div className="font-medium">{analysis.grids?.tiange}</div>
                      </div>
                      <div className="bg-green-100 p-1 rounded">
                        <div className="text-xs text-green-600">人格</div>
                        <div className="font-medium">{analysis.grids?.renge}</div>
                      </div>
                      <div className="bg-yellow-100 p-1 rounded">
                        <div className="text-xs text-yellow-600">地格</div>
                        <div className="font-medium">{analysis.grids?.dige}</div>
                      </div>
                      <div className="bg-purple-100 p-1 rounded">
                        <div className="text-xs text-purple-600">总格</div>
                        <div className="font-medium">{analysis.grids?.zongge}</div>
                      </div>
                      <div className="bg-pink-100 p-1 rounded">
                        <div className="text-xs text-pink-600">外格</div>
                        <div className="font-medium">{analysis.grids?.waige}</div>
                      </div>
                    </div>
                    
                    {/* 三才配置 */}
                    <div className="mb-2">
                      <span className="text-gray-600">三才：</span>
                      <span className="font-medium text-indigo-600">{analysis.sancai?.combination}</span>
                      <span className="ml-2 text-sm px-2 py-1 rounded bg-indigo-100 text-indigo-700">
                        {analysis.sancai?.level}
                      </span>
                    </div>
                    
                    {/* 候选字信息 */}
                    <div className="flex gap-4 text-gray-600 mb-1">
                      <span>中字候选：{analysis.midCandidates?.common}/{analysis.midCandidates?.total}个</span>
                      <span>末字候选：{analysis.lastCandidates?.common}/{analysis.lastCandidates?.total}个</span>
                    </div>
                    <div className="text-gray-500">
                      <span>样例：{analysis.midCandidates?.samples?.slice(0, 4).join('、')} + {analysis.lastCandidates?.samples?.slice(0, 4).join('、')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 步骤5：候选字筛选 */}
            <div className="bg-white rounded-lg p-4 border-l-4 border-teal-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-teal-700">步骤5：候选字筛选</h4>
                <button
                  onClick={() => setShowCandidateFiltering(true)}
                  className="w-6 h-6 bg-teal-500 text-white rounded-full text-sm hover:bg-teal-600 transition-colors flex items-center justify-center"
                  title="了解候选字筛选原理"
                >
                  ?
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">{generationProcess.step5_candidateFiltering?.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-600">筛选标准：</span>
                  <ul className="list-disc list-inside text-gray-500 mt-1">
                    {generationProcess.step5_candidateFiltering?.filteringCriteria?.map((criteria: string, i: number) => (
                      <li key={i}>{criteria}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-gray-600">筛选结果：</span>
                  <div className="mt-1 text-gray-500">
                    <div>常用字库：{generationProcess.step5_candidateFiltering?.commonWordsCount}个</div>
                    <div>有效组合：{generationProcess.step5_candidateFiltering?.totalValidCombinations}种</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 步骤6：名字生成 */}
            <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-medium text-red-700 mb-2">步骤6：名字生成</h4>
              <p className="text-sm text-gray-600">{generationProcess.step6_nameGeneration?.description}</p>
              
              {/* 权重应用信息 */}
              {generationProcess.step6_nameGeneration?.weightingApplied && (
                <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      ⚖️
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        {generationProcess.step6_nameGeneration.weightingApplied.description}
                      </p>
                      <p className="text-xs text-blue-600 mb-2">
                        {generationProcess.step6_nameGeneration.weightingApplied.message}
                      </p>
                      {generationProcess.step6_nameGeneration.weightingApplied.weights && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">三才五格:</span>
                              <span className="font-medium text-purple-700">
                                {generationProcess.step6_nameGeneration.weightingApplied.weights.sancai}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">五行平衡:</span>
                              <span className="font-medium text-purple-700">
                                {generationProcess.step6_nameGeneration.weightingApplied.weights.wuxing}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">音韵美感:</span>
                              <span className="font-medium text-purple-700">
                                {generationProcess.step6_nameGeneration.weightingApplied.weights.sound}%
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">字义寓意:</span>
                              <span className="font-medium text-purple-700">
                                {generationProcess.step6_nameGeneration.weightingApplied.weights.meaning}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">社会认可:</span>
                              <span className="font-medium text-purple-700">
                                {generationProcess.step6_nameGeneration.weightingApplied.weights.social}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 步骤7：质量筛选 */}
            {generationProcess.step7_qualityFiltering && !generationProcess.step7_qualityFiltering.skipped && (
              <div className="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-indigo-700">步骤7：质量筛选</h4>
                  <button
                    onClick={() => setShowPhoneticFiltering(true)}
                    className="w-6 h-6 bg-indigo-500 text-white rounded-full text-sm hover:bg-indigo-600 transition-colors flex items-center justify-center"
                    title="了解音韵美感筛选原理"
                  >
                    ?
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-3">{generationProcess.step7_qualityFiltering?.description}</p>
                
                {generationProcess.step7_qualityFiltering.results && (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600 mb-2">
                      平均音律和谐度：<span className="font-medium text-indigo-600">
                        {Math.round(generationProcess.step7_qualityFiltering.summary?.avgHarmony || 0)}分
                      </span>
                    </div>
                  
                    {generationProcess.step7_qualityFiltering.results.slice(0, 2).map((result: any, i: number) => (
                      <div key={i} className="bg-indigo-50 p-2 rounded text-xs">
                        <div className="font-medium text-indigo-700">{result.name}</div>
                        <div className="text-gray-600">
                          音律评分：{result.phonetics?.harmony}分 | 
                          声调模式：{result.phonetics?.tonePattern} |
                          建议：{result.phonetics?.suggestions?.slice(0, 1).join('') || '音律搭配良好'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-blue-100 rounded-lg text-sm text-blue-800">
            <strong>生成总结：</strong>
            通过7步科学分析，从
            <span className="font-medium"> {generationProcess.step5_candidateFiltering?.totalValidCombinations || 0} </span>
            种可能组合中，精选出
            <span className="font-medium"> {generationProcess.step6_nameGeneration?.totalGenerated || 0} </span>
            个高质量名字
                          {generationProcess.step7_qualityFiltering && !generationProcess.step7_qualityFiltering.skipped && (
                <>，平均音律和谐度
                <span className="font-medium"> {Math.round(generationProcess.step7_qualityFiltering.summary?.avgHarmony || 0)}分</span>
                </>
              )}。
          </div>
        </div>
      )}

      {/* 控制面板 */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">排序:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'name' | 'sancai' | 'zodiac')}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="score">按评分</option>
              <option value="name">按名字</option>
              <option value="sancai">按三才</option>
              {zodiac && <option value="zodiac">按生肖</option>}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">筛选:</label>
            <select
              value={filterScore}
              onChange={(e) => setFilterScore(parseInt(e.target.value))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value={0}>全部</option>
              <option value={80}>≥80分</option>
              <option value={90}>≥90分</option>
              <option value={95}>≥95分</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              已选择 {selectedNames.size} 个名字
            </span>
          </div>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              调整设置
            </button>
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              重新开始
            </button>
          </div>
        </div>
      </div>

      {/* 名字列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedNames.map((name, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg border p-4 ${
              selectedNames.has(name.fullName) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">{name.fullName}</h3>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(name.score)}`}>
                  {name.score}分
                </div>
                <button
                  onClick={() => toggleNameSelection(name.fullName)}
                  className={`p-2 rounded text-sm ${
                    selectedNames.has(name.fullName)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {selectedNames.has(name.fullName) ? '已选' : '选择'}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">三才配置:</span>
                <span className="font-medium text-gray-800">{name.sancai.combination}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">字义组合:</span>
                <span className="font-medium text-gray-800">{name.midChar} + {name.lastChar}</span>
              </div>

              {/* 生肖评估显示 */}
              {name.zodiacEvaluation && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-green-700 font-medium">生肖评估 ({name.zodiacEvaluation.zodiac}年):</span>
                    <span className="font-medium text-green-800">{name.zodiacEvaluation.overallScore.toFixed(1)}分</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{name.midChar}:</span>
                      <span className={`font-medium ${
                        name.zodiacEvaluation.midCharEval.isFavorable ? 'text-green-600' : 
                        name.zodiacEvaluation.midCharEval.isUnfavorable ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {name.zodiacEvaluation.midCharEval.score}分
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{name.lastChar}:</span>
                      <span className={`font-medium ${
                        name.zodiacEvaluation.lastCharEval.isFavorable ? 'text-green-600' : 
                        name.zodiacEvaluation.lastCharEval.isUnfavorable ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {name.zodiacEvaluation.lastCharEval.score}分
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-5 gap-1 text-xs">
                {[
                  { label: '天', value: name.grids.tiange },
                  { label: '人', value: name.grids.renge },
                  { label: '地', value: name.grids.dige },
                  { label: '总', value: name.grids.zongge },
                  { label: '外', value: name.grids.waige }
                ].map((grid, i) => (
                  <div key={i} className="text-center bg-gray-50 rounded p-2">
                    <div className="text-gray-600">{grid.label}格</div>
                    <div className="font-semibold">{grid.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                // 构建包含权重信息的URL
                const weightsParam = encodeURIComponent(JSON.stringify(weights));
                router.push(`/name-detail?name=${encodeURIComponent(name.fullName)}&weights=${weightsParam}`);
              }}
              className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded text-sm"
            >
              查看详细分析
            </button>
          </div>
        ))}
      </div>

      {filteredAndSortedNames.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">没有找到符合条件的名字</p>
          <p className="text-gray-500 text-sm mt-2">请尝试调整筛选条件或降低评分要求</p>
        </div>
      )}

      {/* 再来一批按钮 */}
      {filteredAndSortedNames.length > 0 && hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={generateMoreNames}
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-medium transition-all ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                正在生成...
              </div>
            ) : (
              '再来一批名字 ✨'
            )}
          </button>
          <p className="text-gray-500 text-sm mt-2">
            已显示 {generatedNames.length} 个名字，点击查看更多
          </p>
        </div>
      )}

      {/* 没有更多名字的提示 */}
      {filteredAndSortedNames.length > 0 && !hasMore && (
        <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">🎉 已经为您展示了所有高质量的名字推荐</p>
          <p className="text-gray-500 text-sm mt-1">共 {generatedNames.length} 个精选名字</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-800">
              宝宝取名专家
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/baijiaxing" className="text-amber-600 hover:text-amber-800">
                百家姓
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-800">
                关于我们
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 进度指示器 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                <div
                  className={`ml-3 text-sm font-medium ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {step === 1 && '基础信息'}
                  {step === 2 && '个性设置'}
                  {step === 3 && '推荐结果'}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-4 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <main className="py-12 px-4">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </main>

      {/* 文化科普侧边栏 */}
      {showCulturalInfo && (
        <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-xl z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">文化科普</h3>
              <button
                onClick={() => setShowCulturalInfo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">三才五格</h4>
                <p className="text-sm text-blue-700">
                  三才五格是传统姓名学的核心理论，通过天格、人格、地格等数理分析姓名的吉凶。
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">五行平衡</h4>
                <p className="text-sm text-green-700">
                  五行相生相克，好的名字应该与个人八字相配，达到五行平衡。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 文化科普按钮 */}
      <button
        onClick={() => setShowCulturalInfo(true)}
        className="fixed right-6 bottom-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        📚
      </button>

      {/* 笔画组合分析科普弹窗 */}
      <StrokeAnalysisPopup
        isOpen={showStrokeAnalysis}
        onClose={() => setShowStrokeAnalysis(false)}
      />

      {/* 五行配置分析科普弹窗 */}
      <WuxingAnalysisPopup
        isOpen={showWuxingAnalysis}
        onClose={() => setShowWuxingAnalysis(false)}
      />

      {/* 三才五格计算科普弹窗 */}
      <SancaiCalculationPopup
        isOpen={showSancaiCalculation}
        onClose={() => setShowSancaiCalculation(false)}
      />

      {/* 候选字筛选科普弹窗 */}
      <CandidateFilteringPopup
        isOpen={showCandidateFiltering}
        onClose={() => setShowCandidateFiltering(false)}
      />

      {/* 音韵美感筛选科普弹窗 */}
      <PhoneticFilteringPopup
        isOpen={showPhoneticFiltering}
        onClose={() => setShowPhoneticFiltering(false)}
      />
    </div>
  );
};

export default NamingPage;