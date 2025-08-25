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

      <div className="min-h-screen bg-gradient-to-br from-cultural-paper via-white to-cultural-jade-50">
        {/* 页面头部 */}
        <div className="bg-gradient-to-r from-cultural-red/90 via-cultural-gold/90 to-cultural-jade/90 text-white py-16 relative overflow-hidden">
          {/* 装饰背景元素 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-24 h-24 border-2 border-white rounded-full"></div>
            <div className="absolute top-20 right-20 w-16 h-16 border border-white rotate-45"></div>
            <div className="absolute bottom-16 left-1/4 w-12 h-12 bg-white/20 rounded-full"></div>
            <div className="absolute bottom-20 right-1/3 w-20 h-20 border border-white rounded-full"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">

            
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg mb-6 border border-white/30">
              <span className="text-3xl text-white font-bold">历</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              农历万年历
            </h1>
            <div className="text-xl md:text-2xl font-medium mb-4 text-white/90">
              传统文化的时间智慧
            </div>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              传承千年智慧的农历万年历，提供精准的农历转换、八字排盘、节气计算、
              吉神方位、宜忌事项等功能，助您把握时运。
            </p>

            {/* 实时时钟 */}
            {isClient && (
              <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2 text-white/90">当前时间</div>
                  <div className="text-3xl md:text-4xl font-bold text-white font-mono mb-2">
                    {currentTime.toLocaleTimeString('zh-CN', { 
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit', 
                      second: '2-digit'
                    })}
                  </div>
                  <div className="text-lg text-white/80">
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
                <div className="text-lg font-semibold mb-4 text-center text-white/90">今日农历</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-white/70 mb-2">公历</div>
                    <div className="text-white font-medium text-lg">
                      {currentLunarInfo.solar.year}年{currentLunarInfo.solar.month}月{currentLunarInfo.solar.day}日
                    </div>
                    <div className="text-white/60 text-sm mt-1">
                      {currentLunarInfo.solar.weekday} · {currentLunarInfo.solar.constellation}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/70 mb-2">农历</div>
                    <div className="text-white font-medium text-lg">
                      {LunarCalendarLib.formatLunarDate(currentLunarInfo)}
                    </div>
                    <div className="text-white/60 text-sm mt-1">
                      {currentLunarInfo.solarTerms.current || '无节气'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/70 mb-2">八字</div>
                    <div className="text-white font-medium font-mono text-lg">
                      {LunarCalendarLib.formatEightChar(currentLunarInfo)}
                    </div>
                    <div className="text-white/60 text-sm mt-1">
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
                    <div className="mt-4 animate-spin mx-auto w-8 h-8 border-4 border-cultural-gold/20 border-t-cultural-gold rounded-full"></div>
                  )}
                  {lunarLibraryFailed && (
                    <div className="mt-4">
                      <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-cultural-ink text-white rounded-lg hover:bg-cultural-ink/80 transition-colors"
                      >
                        重新加载
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
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-cultural-ink mb-4">详细信息</h3>
                    
                    {/* 阳历信息 */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-cultural-ink mb-3 flex items-center">
                        <span className="w-2 h-2 bg-cultural-gold rounded-full mr-3"></span>阳历信息
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
                      <h4 className="font-semibold text-cultural-red mb-3 flex items-center">
                        <span className="w-2 h-2 bg-cultural-red rounded-full mr-3"></span>农历信息
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
                            <span className="font-medium text-cultural-red">
                              {selectedLunarInfo.lunar.festivals.join('、')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 八字信息 */}
                    <div>
                      <h4 className="font-semibold text-cultural-jade mb-3 flex items-center">
                        <span className="w-2 h-2 bg-cultural-jade rounded-full mr-3"></span>八字信息
                      </h4>
                      <div className="bg-cultural-jade/5 p-4 rounded-lg border border-cultural-jade/20">
                        <div className="text-center font-mono text-lg font-bold text-cultural-ink mb-2">
                          {LunarCalendarLib.formatEightChar(selectedLunarInfo)}
                        </div>
                        <div className="grid grid-cols-4 gap-1 text-xs text-cultural-jade">
                          <div className="text-center">年柱</div>
                          <div className="text-center">月柱</div>
                          <div className="text-center">日柱</div>
                          <div className="text-center">时柱</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 五行分析 */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-cultural-ink mb-4">五行分析</h3>
                    <div className="space-y-4">
                      {[
                        { element: '木', count: selectedLunarInfo.eightChar.wuxing.wood, color: 'emerald' },
                        { element: '火', count: selectedLunarInfo.eightChar.wuxing.fire, color: 'cultural-red' },
                        { element: '土', count: selectedLunarInfo.eightChar.wuxing.earth, color: 'cultural-gold' },
                        { element: '金', count: selectedLunarInfo.eightChar.wuxing.metal, color: 'gray' },
                        { element: '水', count: selectedLunarInfo.eightChar.wuxing.water, color: 'cultural-jade' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                          <div className="flex items-center">
                            <span className={`w-8 h-8 bg-${item.color}-100 border border-${item.color}-200 rounded-full flex items-center justify-center text-sm font-bold mr-3 text-${item.color}-700`}>
                              {item.element}
                            </span>
                            <span className="font-medium text-gray-700">{item.element}行</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`bg-${item.color}-500 h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${Math.min(item.count * 30, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-600 w-10">
                              {item.count.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 吉神方位 */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-cultural-ink mb-4">吉神方位</h3>
                    <div className="space-y-3">
                      {[
                        { name: '喜神', position: selectedLunarInfo.gods.xi, color: 'cultural-red' },
                        { name: '福神', position: selectedLunarInfo.gods.fu, color: 'emerald' },
                        { name: '财神', position: selectedLunarInfo.gods.cai, color: 'cultural-gold' },
                        { name: '阳贵神', position: selectedLunarInfo.gods.yangGui, color: 'amber' },
                        { name: '阴贵神', position: selectedLunarInfo.gods.yinGui, color: 'cultural-jade' }
                      ].map((god, index) => god.position && (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                          <div className="flex items-center">
                            <span className={`w-3 h-3 bg-${god.color}-500 rounded-full mr-3`}></span>
                            <span className="font-medium text-gray-700">{god.name}</span>
                          </div>
                          <span className={`font-semibold text-${god.color}-700 bg-${god.color}-50 border border-${god.color}-200 px-3 py-1 rounded-lg text-sm`}>
                            {god.position}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 宜忌事项 */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-cultural-ink mb-4">宜忌事项</h3>
                    
                    {/* 宜 */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-emerald-700 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>宜
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLunarInfo.activities.yi.slice(0, 6).map((activity, index) => (
                          <span key={index} className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 忌 */}
                    <div>
                      <h4 className="font-semibold text-cultural-red mb-3 flex items-center">
                        <span className="w-2 h-2 bg-cultural-red rounded-full mr-3"></span>忌
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLunarInfo.activities.ji.slice(0, 6).map((activity, index) => (
                          <span key={index} className="px-3 py-1 bg-cultural-red/10 text-cultural-red border border-cultural-red/20 rounded-lg text-sm">
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
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold font-heading text-center text-cultural-ink mb-8">功能特点</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '历',
                  title: '精准转换',
                  desc: '公历农历精确对照，支持历史与未来日期查询',
                  color: 'cultural-gold'
                },
                {
                  icon: '算',
                  title: '八字排盘',
                  desc: '专业四柱八字排盘，五行分析，喜用神推算',
                  color: 'cultural-jade'
                },
                {
                  icon: '节',
                  title: '节气节日',
                  desc: '二十四节气，传统节日，民俗文化完整展现',
                  color: 'cultural-red'
                },
                {
                  icon: '神',
                  title: '吉神宜忌',
                  desc: '每日吉神方位，宜忌事项，助您趋吉避凶',
                  color: 'emerald'
                }
              ].map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-cultural-ink mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

         
        </div>
      </div>
    </Layout>
  );
};

export default LunarCalendarPage;
