import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import LunarCalendar from '@/components/LunarCalendar';

import { LunarCalendar as LunarCalendarLib, LunarInfo } from '@/lib/lunar';

const LunarCalendarPage: React.FC = () => {
  const [selectedLunarInfo, setSelectedLunarInfo] = useState<LunarInfo | null>(null);
  const [currentLunarInfo, setCurrentLunarInfo] = useState<LunarInfo | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [lunarLibraryFailed, setLunarLibraryFailed] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('正在初始化农历库...');
  const [currentTime, setCurrentTime] = useState(new Date());

  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 实时时钟更新
  useEffect(() => {
    if (!isClient) return;
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient]);

  // 获取当前日期的农历信息
  useEffect(() => {
    if (!isClient) return;
    
    const initializeLunar = async () => {
      console.log('Initializing lunar library...');
      setLoadingMessage('正在加载农历库...');
      
      try {
        const loaded = await LunarCalendarLib.ensureLibraryLoaded();
        
        if (!loaded) {
          console.error('Lunar library failed to load');
          setLoadingMessage('农历库加载失败，请刷新页面重试');
          setLunarLibraryFailed(true);
          return;
        }
        
        setLoadingMessage('正在获取农历信息...');
        
        // 重试机制
        let retries = 3;
        while (retries > 0) {
          try {
            const current = LunarCalendarLib.getCurrentLunarInfo();
            setCurrentLunarInfo(current);
            setSelectedLunarInfo(current);
            setLunarLibraryFailed(false);
            console.log('Lunar library initialized successfully');
            setLoadingMessage('');
            return;
          } catch (error) {
            retries--;
            console.warn(`Retry ${3 - retries}/3:`, error);
            if (retries === 0) {
              throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } catch (error) {
        console.error('获取当前农历信息失败:', error);
        setLoadingMessage(`初始化失败: ${error instanceof Error ? error.message : '未知错误'}`);
        setLunarLibraryFailed(true);
      }
    };
    
    initializeLunar();
  }, [isClient]);

  // 处理日期选择
  const handleDateSelect = (lunarInfo: LunarInfo) => {
    setSelectedLunarInfo(lunarInfo);
  };



  return (
    <Layout>
      <Head>
        <title>农历万年历：传统文化的时间智慧 - 宝宝取名专家</title>
        <meta name="description" content="精美的农历万年历，提供阳历农历对照、节气节日、八字信息、吉神方位、宜忌事项等丰富功能。" />
        <meta name="keywords" content="农历,万年历,八字,节气,宜忌,吉神方位,传统文化" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
        {/* 页面头部 */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* 面包屑 */}
            <div className="flex items-center justify-center gap-2 text-red-100 mb-6">
              <Link href="/" className="hover:text-white transition-colors">首页</Link>
              <span>›</span>
              <Link href="/#culture" className="hover:text-white transition-colors">传统文化</Link>
              <span>›</span>
              <span className="text-white font-medium">农历万年历</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              🏮 农历万年历
            </h1>
            <div className="text-2xl md:text-3xl font-medium mb-4 text-orange-100">
              传统文化的时间智慧
            </div>
            <p className="text-lg text-red-200 max-w-3xl mx-auto mb-8 leading-relaxed">
              传承千年智慧的农历万年历，提供精准的农历转换、八字排盘、节气计算、
              吉神方位、宜忌事项等功能，助您把握时运。
            </p>

            {/* 实时时钟 */}
            {isClient && (
              <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2 text-orange-100">🕐 当前时间</div>
                  <div className="text-3xl md:text-4xl font-bold text-white font-mono mb-2">
                    {currentTime.toLocaleTimeString('zh-CN', { 
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit', 
                      second: '2-digit'
                    })}
                  </div>
                  <div className="text-lg text-red-100">
                    {currentTime.toLocaleDateString('zh-CN', { 
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric',
                      weekday: 'long'
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 今日农历信息预览 */}
            {currentLunarInfo && (
              <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-lg font-semibold mb-4 text-center">📅 今日农历</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-red-100 mb-2">📅 公历</div>
                    <div className="text-white font-medium text-lg">
                      {currentLunarInfo.solar.year}年{currentLunarInfo.solar.month}月{currentLunarInfo.solar.day}日
                    </div>
                    <div className="text-red-200 text-sm mt-1">
                      {currentLunarInfo.solar.weekday} · {currentLunarInfo.solar.constellation}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-100 mb-2">🏮 农历</div>
                    <div className="text-white font-medium text-lg">
                      {LunarCalendarLib.formatLunarDate(currentLunarInfo)}
                    </div>
                    <div className="text-red-200 text-sm mt-1">
                      {currentLunarInfo.solarTerms.current || '无节气'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-100 mb-2">🔮 八字</div>
                    <div className="text-white font-medium font-mono text-lg">
                      {LunarCalendarLib.formatEightChar(currentLunarInfo)}
                    </div>
                    <div className="text-red-200 text-sm mt-1">
                      四柱干支
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* 农历日历 */}
            <div className="xl:col-span-3">
              {!isClient || lunarLibraryFailed ? (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <div className="text-lg text-gray-600 mb-4">
                    {loadingMessage || '正在初始化农历功能...'}
                  </div>
                  {!lunarLibraryFailed && (
                    <div className="mt-4 animate-spin mx-auto w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full"></div>
                  )}
                  {lunarLibraryFailed && (
                    <div className="mt-4">
                      <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        🔄 重新加载
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <LunarCalendar
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedLunarInfo ? new Date(
                    selectedLunarInfo.solar.year,
                    selectedLunarInfo.solar.month - 1,
                    selectedLunarInfo.solar.day
                  ) : undefined}
                />
              )}
            </div>

            {/* 详细信息面板 */}
            <div className="xl:col-span-2 space-y-6">
              {selectedLunarInfo && (
                <>
                  {/* 基本信息 */}
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📋 详细信息</h3>
                    
                    {/* 阳历信息 */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-blue-700 mb-3 flex items-center">
                        <span className="mr-2">📅</span>阳历信息
                      </h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                          <span>公历：</span>
                          <span className="font-medium">
                            {selectedLunarInfo.solar.year}年{selectedLunarInfo.solar.month}月{selectedLunarInfo.solar.day}日
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>星期：</span>
                          <span className="font-medium">{selectedLunarInfo.solar.weekday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>星座：</span>
                          <span className="font-medium">{selectedLunarInfo.solar.constellation}</span>
                        </div>
                      </div>
                    </div>

                    {/* 农历信息 */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                        <span className="mr-2">🏮</span>农历信息
                      </h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                          <span>农历：</span>
                          <span className="font-medium">
                            {LunarCalendarLib.formatLunarDate(selectedLunarInfo)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>生肖：</span>
                          <span className="font-medium">
                            {selectedLunarInfo.lunar.yearInChinese.slice(-1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>节气：</span>
                          <span className="font-medium">
                            {selectedLunarInfo.solarTerms.current || '无'}
                          </span>
                        </div>
                        {selectedLunarInfo.lunar.festivals.length > 0 && (
                          <div className="flex justify-between">
                            <span>节日：</span>
                            <span className="font-medium text-red-600">
                              {selectedLunarInfo.lunar.festivals.join('、')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 八字信息 */}
                    <div>
                      <h4 className="font-semibold text-purple-700 mb-3 flex items-center">
                        <span className="mr-2">🔮</span>八字信息
                      </h4>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-center font-mono text-lg font-bold text-purple-800 mb-2">
                          {LunarCalendarLib.formatEightChar(selectedLunarInfo)}
                        </div>
                        <div className="grid grid-cols-4 gap-1 text-xs text-purple-600">
                          <div className="text-center">年柱</div>
                          <div className="text-center">月柱</div>
                          <div className="text-center">日柱</div>
                          <div className="text-center">时柱</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 五行分析 */}
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">🌟 五行分析</h3>
                    <div className="space-y-3">
                      {[
                        { element: '木', count: selectedLunarInfo.eightChar.wuxing.wood, color: 'green' },
                        { element: '火', count: selectedLunarInfo.eightChar.wuxing.fire, color: 'red' },
                        { element: '土', count: selectedLunarInfo.eightChar.wuxing.earth, color: 'yellow' },
                        { element: '金', count: selectedLunarInfo.eightChar.wuxing.metal, color: 'gray' },
                        { element: '水', count: selectedLunarInfo.eightChar.wuxing.water, color: 'blue' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className={`flex items-center text-${item.color}-700`}>
                            <span className={`w-6 h-6 bg-${item.color}-200 rounded-full flex items-center justify-center text-sm font-bold mr-3`}>
                              {item.element}
                            </span>
                            <span className="font-medium">{item.element}行</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`w-20 bg-${item.color}-200 rounded-full h-2`}>
                              <div 
                                className={`bg-${item.color}-500 h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${Math.min(item.count * 30, 100)}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-semibold text-${item.color}-600 w-8`}>
                              {item.count.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 吉神方位 */}
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">🧭 吉神方位</h3>
                    <div className="space-y-3">
                      {[
                        { name: '喜神', position: selectedLunarInfo.gods.xi, icon: '😊', color: 'pink' },
                        { name: '福神', position: selectedLunarInfo.gods.fu, icon: '🍀', color: 'green' },
                        { name: '财神', position: selectedLunarInfo.gods.cai, icon: '💰', color: 'yellow' },
                        { name: '阳贵神', position: selectedLunarInfo.gods.yangGui, icon: '☀️', color: 'orange' },
                        { name: '阴贵神', position: selectedLunarInfo.gods.yinGui, icon: '🌙', color: 'purple' }
                      ].map((god, index) => god.position && (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{god.icon}</span>
                            <span className={`font-medium text-${god.color}-700`}>{god.name}</span>
                          </div>
                          <span className={`font-bold text-${god.color}-800 bg-${god.color}-100 px-3 py-1 rounded-full`}>
                            {god.position}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 宜忌事项 */}
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📝 宜忌事项</h3>
                    
                    {/* 宜 */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                        <span className="mr-2">✅</span>宜
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLunarInfo.activities.yi.slice(0, 6).map((activity, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 忌 */}
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                        <span className="mr-2">❌</span>忌
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLunarInfo.activities.ji.slice(0, 6).map((activity, index) => (
                          <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 功能特点 */}
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">💎 功能特点</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '📅',
                  title: '精准转换',
                  desc: '公历农历精确对照，支持历史与未来日期查询'
                },
                {
                  icon: '🔮',
                  title: '八字排盘',
                  desc: '专业四柱八字排盘，五行分析，喜用神推算'
                },
                {
                  icon: '🌸',
                  title: '节气节日',
                  desc: '二十四节气，传统节日，民俗文化完整展现'
                },
                {
                  icon: '🧭',
                  title: '吉神宜忌',
                  desc: '每日吉神方位，宜忌事项，助您趋吉避凶'
                }
              ].map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 返回链接 */}
          <div className="text-center mt-12">
            <Link 
              href="/culture/bazi-xiyongshen"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 mr-4"
            >
              🔮 八字喜用神分析
            </Link>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LunarCalendarPage;
