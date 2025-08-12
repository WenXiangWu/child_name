import React, { useState, useEffect } from 'react';
import { LunarCalendar as LunarCalendarLib } from '@/lib/lunar';

const DebugLunarPage: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  const addDebugInfo = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    setIsClient(true);
    addDebugInfo('页面开始加载');
  }, []);

  useEffect(() => {
    if (!isClient) return;

    addDebugInfo('开始检查 lunar 库状态');
    
    // 检查浏览器环境
    addDebugInfo(`浏览器环境: ${typeof window !== 'undefined'}`);
    
    // 检查库是否可用
    const isAvailable = LunarCalendarLib.isLibraryAvailable();
    addDebugInfo(`Lunar 库可用性: ${isAvailable}`);
    
    if (isAvailable) {
      try {
        const today = new Date();
        const lunarInfo = LunarCalendarLib.getLunarInfo(
          today.getFullYear(),
          today.getMonth() + 1,
          today.getDate()
        );
        addDebugInfo('✅ 成功获取农历信息');
        addDebugInfo(`农历日期: ${LunarCalendarLib.formatLunarDate(lunarInfo)}`);
        addDebugInfo(`八字: ${LunarCalendarLib.formatEightChar(lunarInfo)}`);
      } catch (error) {
        addDebugInfo(`❌ 获取农历信息失败: ${error}`);
      }
    } else {
      addDebugInfo('❌ Lunar 库不可用');
      
      // 尝试直接检查本地库
      try {
        const lunarLib = require('@/lib/lunar/lunar.js');
        addDebugInfo(`本地库导入结果: ${!!lunarLib}`);
        addDebugInfo(`Solar: ${!!lunarLib.Solar}`);
        addDebugInfo(`Lunar: ${!!lunarLib.Lunar}`);
        addDebugInfo(`EightChar: ${!!lunarLib.EightChar}`);
      } catch (error) {
        addDebugInfo(`本地库导入失败: ${error}`);
      }
    }
  }, [isClient]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔍 Lunar 库调试信息</h1>
      
      <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm">
        <div className="mb-4 text-green-300 font-bold">调试日志:</div>
        {debugInfo.map((info, index) => (
          <div key={index} className="mb-1">
            {info}
          </div>
        ))}
        {debugInfo.length === 0 && (
          <div className="text-gray-500">等待调试信息...</div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-blue-800 mb-4">📋 检查项目</h2>
        <div className="space-y-2 text-sm">
          <div>1. ✅ 本地 lunar.js 文件是否存在</div>
          <div>2. 🔄 库是否在浏览器环境中加载</div>
          <div>3. 🔄 是否能创建 Solar 对象</div>
          <div>4. 🔄 是否能获取农历信息</div>
          <div>5. 🔄 是否能正确格式化显示</div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setDebugInfo([]);
            window.location.reload();
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          🔄 重新检测
        </button>
      </div>
    </div>
  );
};

export default DebugLunarPage;
