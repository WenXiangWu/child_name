// 全局类型定义
export interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo;
  };
}

// 用户信息类型
export interface UserInfo extends WechatMiniprogram.UserInfo {
  settings?: UserSettings;
}

// 用户设置类型
export interface UserSettings {
  theme?: 'light' | 'dark';
  language?: 'zh_CN' | 'zh_TW';
}

// 名字分析结果类型
export interface NameAnalysis {
  name: string;
  score: number;
  details: {
    wuxing: WuxingAnalysis;
    meaning: MeaningAnalysis;
    pronunciation: PronunciationAnalysis;
  };
}

// 五行分析类型
export interface WuxingAnalysis {
  elements: string[];
  balance: number;
  description: string;
}

// 字义分析类型
export interface MeaningAnalysis {
  meanings: string[];
  tone: string;
  style: string;
}

// 发音分析类型
export interface PronunciationAnalysis {
  pinyin: string[];
  rhythm: number;
  harmony: number;
}
