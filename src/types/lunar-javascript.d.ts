declare module 'lunar-javascript' {
  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getLunar(): Lunar;
    toYmd(): string;
  }

  export class Lunar {
    static fromYmd(year: number, month: number, day: number): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getYearInChinese(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getFestivals(): string[];
    getJieQi(): string;
    getNextJieQi(): JieQi;
    getYearShengXiao(): string;
  }

  export class LunarTime {
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): LunarTime;
    getEightChar(): EightChar;
  }

  export class EightChar {
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
  }

  export class JieQi {
    getName(): string;
    getSolar(): Solar;
  }
}
