import React, { useState, useEffect } from 'react';
import { LunarCalendar as LunarCalendarLib, LunarInfo } from '@/lib/lunar';

interface LunarCalendarProps {
  onDateSelect?: (lunarInfo: LunarInfo) => void;
  selectedDate?: Date;
  className?: string;
}

const LunarCalendar: React.FC<LunarCalendarProps> = ({
  onDateSelect,
  selectedDate,
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [currentLunarInfo, setCurrentLunarInfo] = useState<LunarInfo | null>(null);
  const [calendarDays, setCalendarDays] = useState<Array<{
    date: Date;
    lunarInfo: LunarInfo;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
  }>>([]);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  // 确保只在客户端执行
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 获取当前月份的所有日期
  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // 从周日开始

    const days: typeof calendarDays = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) { // 6周 * 7天
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      
      try {
        const lunarInfo = LunarCalendarLib.getLunarInfo(
          currentDay.getFullYear(),
          currentDay.getMonth() + 1,
          currentDay.getDate()
        );

        days.push({
          date: new Date(currentDay),
          lunarInfo,
          isCurrentMonth: currentDay.getMonth() === month,
          isToday: currentDay.toDateString() === today.toDateString(),
          isSelected: selectedDate ? currentDay.toDateString() === selectedDate.toDateString() : false
        });
      } catch (error) {
        console.error(`Failed to get lunar info for ${currentDay.getFullYear()}-${currentDay.getMonth() + 1}-${currentDay.getDate()}:`, error);
        // 重新抛出错误，让上层处理
        throw error;
      }
    }

    console.log('Generated days:', days.length, 'for month:', year, month);
    return days;
  };



  // 更新日历
  useEffect(() => {
    if (!isClient) return;
    
    const initializeCalendar = async () => {
      setLoading(true);
      console.log('LunarCalendar: Initializing calendar...');
      
      try {
        const loaded = await LunarCalendarLib.ensureLibraryLoaded();
        
        if (!loaded) {
          console.error('LunarCalendar: Lunar library not available');
          setLoading(false);
          throw new Error('Lunar library failed to load');
        }
        
        console.log('LunarCalendar: Library loaded, generating calendar days...');
        const days = generateCalendarDays(currentDate);
        setCalendarDays(days);
        
        // 更新当前显示的农历信息
        try {
          const lunarInfo = LunarCalendarLib.getLunarInfo(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            currentDate.getDate()
          );
          setCurrentLunarInfo(lunarInfo);
          console.log('LunarCalendar: Current lunar info loaded successfully');
        } catch (error) {
          console.warn('无法获取当前农历信息:', error);
        }
        
        setLoading(false);
        console.log('LunarCalendar: Calendar initialized successfully');
      } catch (error) {
        console.error('LunarCalendar: Failed to initialize:', error);
        setLoading(false);
        throw error;
      }
    };
    
    initializeCalendar();
  }, [currentDate, isClient]);

  // 处理日期点击
  const handleDateClick = (day: typeof calendarDays[0]) => {
    setCurrentDate(day.date);
    onDateSelect?.(day.lunarInfo);
  };

  // 切换月份
  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  // 获取节日颜色
  const getFestivalColor = (festivals: string[]) => {
    if (festivals.some(f => f.includes('春节') || f.includes('除夕'))) return 'text-red-600';
    if (festivals.some(f => f.includes('中秋') || f.includes('端午') || f.includes('清明'))) return 'text-orange-600';
    if (festivals.length > 0) return 'text-green-600';
    return '';
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  // 如果不是客户端环境或正在加载，显示加载状态
  if (!isClient || loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>
        <div className="p-8 text-center">
          <div className="text-lg text-gray-600 mb-4">正在加载农历日历...</div>
          <div className="animate-spin mx-auto w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 ${className}`}>
      {/* 头部：月份导航 */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white p-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/20 transition-all transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">上月</span>
          </button>
          
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
            </div>
            <div className="text-orange-100 text-sm">
              {currentDate.toLocaleDateString('zh-CN', { weekday: 'long' })}
            </div>
          </div>
          
          <button
            onClick={() => changeMonth(1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/20 transition-all transform hover:scale-105"
          >
            <span className="font-medium">下月</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 当前日期的详细信息 */}
        {currentLunarInfo && (
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
            <div className="text-center mb-4">
              <div className="text-lg font-semibold text-orange-100">📅 当前选中日期</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="text-center">
                <div className="text-red-100 mb-2 text-xs">🏮 农历</div>
                <div className="text-white font-bold text-lg">
                  {LunarCalendarLib.formatLunarDate(currentLunarInfo)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-red-100 mb-2 text-xs">🔮 八字</div>
                <div className="text-white font-mono font-bold text-base">
                  {LunarCalendarLib.formatEightChar(currentLunarInfo).split(' ')[2]}
                </div>
              </div>
              <div className="text-center">
                <div className="text-red-100 mb-2 text-xs">⭐ 星座</div>
                <div className="text-white font-bold text-lg">
                  {currentLunarInfo.solar.constellation}
                </div>
              </div>
              <div className="text-center">
                <div className="text-red-100 mb-2 text-xs">🌸 节气</div>
                <div className="text-white font-bold text-lg">
                  {currentLunarInfo.solarTerms.current || '无'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`p-4 text-center text-base font-bold ${
              index === 0 || index === 6 ? 'text-red-600 bg-red-50' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日历主体 */}
      <div className="grid grid-cols-7 bg-gray-50">
        {calendarDays.length === 0 ? (
          // 如果没有数据，显示空白网格
          Array.from({ length: 42 }, (_, index) => (
            <div key={index} className="h-24 border-r border-b bg-gray-50"></div>
          ))
        ) : (
          calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                relative p-3 h-24 border-r border-b cursor-pointer transition-all duration-200 
                hover:shadow-lg hover:z-10 hover:scale-105 hover:bg-white
                ${!day.isCurrentMonth ? 'bg-gray-100 text-gray-400' : 'bg-white'}
                ${day.isToday ? 'bg-gradient-to-br from-red-50 to-pink-50 ring-2 ring-red-300 shadow-lg' : ''}
                ${day.isSelected ? 'bg-gradient-to-br from-blue-50 to-indigo-50 ring-2 ring-blue-400 shadow-lg' : ''}
              `}
            >
              {/* 阳历日期 */}
              <div className={`text-xl font-bold mb-1 ${
                day.isToday ? 'text-red-600' : 
                day.isSelected ? 'text-blue-600' : 
                !day.isCurrentMonth ? 'text-gray-400' : 'text-gray-800'
              }`}>
                {day.date.getDate()}
              </div>

              {/* 农历日期 */}
              <div className={`text-xs font-medium ${
                !day.isCurrentMonth ? 'text-gray-300' : 
                day.isToday ? 'text-red-500' :
                day.isSelected ? 'text-blue-500' : 'text-gray-600'
              }`}>
                {day.lunarInfo?.lunar?.dayInChinese || ''}
              </div>

              {/* 节日标识 */}
              {day.lunarInfo?.lunar?.festivals?.length > 0 && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute -top-1 -right-1 text-xs">🎉</div>
                </div>
              )}

              {/* 今日特殊标识 */}
              {day.isToday && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1 left-1 text-xs font-bold text-red-600 bg-red-100 px-1 rounded">
                    今
                  </div>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-full"></div>
                </div>
              )}

              {/* 选中标识 */}
              {day.isSelected && !day.isToday && (
                <div className="absolute top-1 left-1 text-xs font-bold text-blue-600 bg-blue-100 px-1 rounded">
                  选
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 底部：节气和宜忌 */}
      {currentLunarInfo && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            {/* 节气 */}
            <div className="text-center bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-orange-600 mb-2 font-bold flex items-center justify-center">
                <span className="mr-1">🌸</span>节气
              </div>
              <div className="text-gray-900 font-semibold text-lg">
                {currentLunarInfo.solarTerms.current || '无节气'}
              </div>
              {currentLunarInfo.solarTerms.next && (
                <div className="text-xs text-gray-500 mt-1">
                  下个: {currentLunarInfo.solarTerms.next}
                </div>
              )}
            </div>

            {/* 宜 */}
            <div className="text-center bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-green-600 mb-2 font-bold flex items-center justify-center">
                <span className="mr-1">✅</span>宜
              </div>
              <div className="text-gray-900 text-sm font-medium">
                {currentLunarInfo.activities.yi.slice(0, 3).join('、') || '无特殊宜事'}
              </div>
            </div>

            {/* 忌 */}
            <div className="text-center bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-red-600 mb-2 font-bold flex items-center justify-center">
                <span className="mr-1">❌</span>忌
              </div>
              <div className="text-gray-900 text-sm font-medium">
                {currentLunarInfo.activities.ji.slice(0, 3).join('、') || '无特殊忌事'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LunarCalendar;
