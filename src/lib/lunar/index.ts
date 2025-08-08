/**
 * Lunar Calendar 农历工具库封装
 * 基于本地 lunar.js 库，提供农历、八字、节气等功能
 */

// 直接导入本地 lunar.js
const LunarLib = require('./lunar.js');

// 提取所需的类
const { Solar, Lunar, EightChar, SolarUtil, LunarUtil } = LunarLib;

// 定义类型接口
export interface LunarInfo {
  // 农历信息
  lunar: {
    year: number;
    month: number;
    day: number;
    yearInChinese: string;
    monthInChinese: string;
    dayInChinese: string;
    yearInGanZhi: string;
    monthInGanZhi: string;
    dayInGanZhi: string;
    timeInGanZhi: string;
    isLeap: boolean;
    festivals: string[];
  };
  
  // 阳历信息
  solar: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    weekday: string;
    constellation: string;
  };
  
  // 八字信息
  eightChar: {
    year: string;
    month: string;
    day: string;
    time: string;
    dayMaster: string;
    nayin: string[];
    pengzu: string[];
    wuxing: {
      wood: number;
      fire: number;
      earth: number;
      metal: number;
      water: number;
    };
  };
  
  // 节气信息
  solarTerms: {
    current: string;
    next: string;
    nextDate: string;
  };
  
  // 神煞方位
  gods: {
    xi: string;    // 喜神
    fu: string;    // 福神
    cai: string;   // 财神
    yangGui: string; // 阳贵神
    yinGui: string;  // 阴贵神
    tai: string;   // 胎神
  };
  
  // 宜忌
  activities: {
    yi: string[];  // 宜
    ji: string[];  // 忌
  };
}

/**
 * 农历日历工具类
 */
export class LunarCalendar {
  
  /**
   * 检查库是否可用
   */
  static isLibraryAvailable(): boolean {
    console.log('Checking library availability...');
    console.log('LunarLib:', typeof LunarLib, !!LunarLib);
    console.log('Solar:', typeof Solar, !!Solar);
    console.log('Lunar:', typeof Lunar, !!Lunar);
    console.log('EightChar:', typeof EightChar, !!EightChar);
    
    if (Solar && Lunar && EightChar) {
      // 测试创建对象
      try {
        const testSolar = Solar.fromYmd(2025, 8, 8);
        console.log('Test Solar created:', !!testSolar, typeof testSolar);
        
        if (testSolar && typeof testSolar.getLunar === 'function') {
          const testLunar = testSolar.getLunar();
          console.log('Test Lunar created:', !!testLunar, typeof testLunar);
          return true;
        } else {
          console.error('Solar.getLunar is not a function');
          return false;
        }
      } catch (error) {
        console.error('Failed to create test Solar:', error);
        return false;
      }
    }
    console.log('One or more classes not available');
    return false;
  }

  /**
   * 确保库已加载（本地库始终可用）
   */
  static async ensureLibraryLoaded(): Promise<boolean> {
    return this.isLibraryAvailable();
  }
  
  /**
   * 根据阳历日期获取完整的农历信息
   */
  static getLunarInfo(year: number, month: number, day: number, hour: number = 0, minute: number = 0): LunarInfo {
    if (!this.isLibraryAvailable()) {
      throw new Error('Lunar library not available');
    }

    try {
      // 按照测试文件中确认的方法创建对象
      const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
      const lunar = solar.getLunar();
      const eightChar = lunar.getEightChar();
      
      // 只使用测试文件中确认存在的方法
      const lunarInfo: LunarInfo = {
        lunar: {
          year: lunar.getYear(),
          month: lunar.getMonth(),
          day: lunar.getDay(),
          yearInChinese: lunar.getYearInChinese(),
          monthInChinese: lunar.getMonthInChinese(),
          dayInChinese: lunar.getDayInChinese(),
          yearInGanZhi: lunar.getYearInGanZhi(),
          monthInGanZhi: lunar.getMonthInGanZhi(),
          dayInGanZhi: lunar.getDayInGanZhi(),
          timeInGanZhi: eightChar.getTime(),
          isLeap: lunar.getMonthInChinese().includes('闰'),
          festivals: lunar.getFestivals() || [],
        },
        
        solar: {
          year: solar.getYear(),
          month: solar.getMonth(),
          day: solar.getDay(),
          hour: solar.getHour(),
          minute: solar.getMinute(),
          weekday: solar.getWeekInChinese(),
          constellation: solar.getXingZuo(),
        },
        
        eightChar: {
          year: eightChar.getYear(),
          month: eightChar.getMonth(),
          day: eightChar.getDay(),
          time: eightChar.getTime(),
          dayMaster: eightChar.getDay().charAt(0),
          nayin: [
            eightChar.getYearNaYin(),
            eightChar.getMonthNaYin(),
            eightChar.getDayNaYin(),
            eightChar.getTimeNaYin()
          ],
          pengzu: [
            lunar.getPengZuGan(),
            lunar.getPengZuZhi()
          ].filter(p => p),
          wuxing: this.analyzeWuxing(eightChar),
        },
        
        solarTerms: {
          current: (lunar.getCurrentJieQi() + '') || '',
          next: lunar.getNextJieQi()?.getName() || '',
          nextDate: lunar.getNextJieQi()?.getSolar()?.toYmd() || '',
        },
        
        gods: {
          xi: `${lunar.getDayPositionXi()}(${lunar.getDayPositionXiDesc()})`,
          fu: `${lunar.getDayPositionFu()}(${lunar.getDayPositionFuDesc()})`,
          cai: `${lunar.getDayPositionCai()}(${lunar.getDayPositionCaiDesc()})`,
          yangGui: `${lunar.getDayPositionYangGui()}(${lunar.getDayPositionYangGuiDesc()})`,
          yinGui: `${lunar.getDayPositionYinGui()}(${lunar.getDayPositionYinGuiDesc()})`,
          tai: lunar.getDayPositionTai(),
        },
        
        activities: this.getDayActivities(lunar),
      };
      
      return lunarInfo;
    } catch (error) {
      console.error('获取农历信息失败:', error);
      throw new Error(`无效的日期: ${year}-${month}-${day}`);
    }
  }



  /**
   * 获取当前时间的农历信息
   */
  static getCurrentLunarInfo(): LunarInfo {
    const now = new Date();
    return this.getLunarInfo(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
      now.getHours(),
      now.getMinutes()
    );
  }

  /**
   * 格式化农历日期显示
   */
  static formatLunarDate(lunarInfo: LunarInfo): string {
    const { lunar } = lunarInfo;
    return `${lunar.yearInChinese}${lunar.monthInChinese}${lunar.dayInChinese}`;
  }

  /**
   * 格式化八字显示
   */
  static formatEightChar(lunarInfo: LunarInfo): string {
    const { eightChar } = lunarInfo;
    return `${eightChar.year} ${eightChar.month} ${eightChar.day} ${eightChar.time}`;
  }

  /**
   * 分析八字五行强弱
   */
  private static analyzeWuxing(eightChar: any): { wood: number; fire: number; earth: number; metal: number; water: number } {
    const wuxing = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    
    if (!eightChar) return wuxing;
    
    try {
      // 获取四柱干支
      const ganzhi = [
        eightChar.getYear(),
        eightChar.getMonth(),
        eightChar.getDay(),
        eightChar.getTime()
      ];
      
      // 天干地支对应的五行
      const ganWuxing: Record<string, keyof typeof wuxing> = {
        '甲': 'wood', '乙': 'wood',
        '丙': 'fire', '丁': 'fire',
        '戊': 'earth', '己': 'earth',
        '庚': 'metal', '辛': 'metal',
        '壬': 'water', '癸': 'water'
      };
      
      const zhiWuxing: Record<string, keyof typeof wuxing> = {
        '子': 'water', '亥': 'water',
        '寅': 'wood', '卯': 'wood',
        '巳': 'fire', '午': 'fire',
        '申': 'metal', '酉': 'metal',
        '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth'
      };
      
      // 统计各干支的五行
      ganzhi.forEach(gz => {
        if (gz && gz.length >= 2) {
          const gan = gz[0];
          const zhi = gz[1];
          
          if (ganWuxing[gan]) {
            wuxing[ganWuxing[gan]]++;
          }
          if (zhiWuxing[zhi]) {
            wuxing[zhiWuxing[zhi]]++;
          }
        }
      });
      
    } catch (error) {
      console.warn('分析五行失败:', error);
    }
    
    return wuxing;
  }

  /**
   * 获取当日宜忌事项
   */
  private static getDayActivities(lunar: any): { yi: string[]; ji: string[] } {
    try {
      const dayGan = lunar.getDayGan();
      const dayZhi = lunar.getDayZhi();
      const monthZhi = lunar.getMonthZhi();
      
      // 基于干支的基础宜忌规则
      const yi: string[] = [];
      const ji: string[] = [];
      
      // 根据日干的宜忌
      switch (dayGan) {
        case '甲':
          yi.push('开市', '立券', '交易', '纳财');
          ji.push('安葬', '破土');
          break;
        case '乙':
          yi.push('栽种', '嫁娶', '移徙');
          ji.push('开渠', '掘井');
          break;
        case '丙':
          yi.push('祭祀', '祈福', '求嗣');
          ji.push('出行', '入宅');
          break;
        case '丁':
          yi.push('冠笄', '嫁娶', '会亲友');
          ji.push('造桥', '造船');
          break;
        case '戊':
          yi.push('修造', '动土', '安床');
          ji.push('开市', '立券');
          break;
        case '己':
          yi.push('求医', '治病', '针灸');
          ji.push('嫁娶', '移徙');
          break;
        case '庚':
          yi.push('经络', '纳畜', '牧养');
          ji.push('安葬', '修坟');
          break;
        case '辛':
          yi.push('破屋', '坏垣', '解除');
          ji.push('嫁娶', '安床');
          break;
        case '壬':
          yi.push('入学', '习艺', '开池');
          ji.push('开仓', '出货');
          break;
        case '癸':
          yi.push('塞穴', '补垣', '造仓');
          ji.push('开市', '交易');
          break;
      }
      
      // 根据日支的宜忌
      switch (dayZhi) {
        case '子':
          yi.push('祭祀', '沐浴', '捕捉');
          ji.push('嫁娶', '安葬');
          break;
        case '丑':
          yi.push('纳采', '订盟', '安机械');
          ji.push('出行', '赴任');
          break;
        case '寅':
          yi.push('祈福', '求嗣', '开光');
          ji.push('安门', '理发');
          break;
        case '卯':
          yi.push('沐浴', '理发', '捕捉');
          ji.push('嫁娶', '安葬');
          break;
        case '辰':
          yi.push('开市', '立券', '纳财');
          ji.push('栽种', '安床');
          break;
        case '巳':
          yi.push('祭祀', '塑绘', '开光');
          ji.push('出行', '治病');
          break;
        case '午':
          yi.push('嫁娶', '冠笄', '修造');
          ji.push('开仓', '栽种');
          break;
        case '未':
          yi.push('祭祀', '祈福', '求嗣');
          ji.push('开市', '安床');
          break;
        case '申':
          yi.push('纳采', '订盟', '交易');
          ji.push('安葬', '破土');
          break;
        case '酉':
          yi.push('祭祀', '沐浴', '捕捉');
          ji.push('嫁娶', '入宅');
          break;
        case '戌':
          yi.push('修造', '动土', '安门');
          ji.push('开市', '交易');
          break;
        case '亥':
          yi.push('嫁娶', '移徙', '入宅');
          ji.push('开仓', '出货');
          break;
      }
      
      // 去重
      const uniqueYi = Array.from(new Set(yi));
      const uniqueJi = Array.from(new Set(ji));
      
      return {
        yi: uniqueYi.slice(0, 6), // 限制数量避免太多
        ji: uniqueJi.slice(0, 6)
      };
      
    } catch (error) {
      console.warn('获取宜忌事项失败:', error);
      return { yi: [], ji: [] };
    }
  }
}

export default LunarCalendar;