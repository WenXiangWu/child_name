import type { NameAnalysisResult } from './naming';

/**
 * 用户设置
 */
export interface UserSettings {
  /** 主题模式 */
  theme: 'light' | 'dark' | 'system';
  /** 是否开启声音 */
  soundEnabled: boolean;
  /** 是否显示详细分析 */
  showDetailedAnalysis: boolean;
  /** 是否自动保存历史 */
  autoSaveHistory: boolean;
  /** 默认起名偏好 */
  defaultNamingPreference?: {
    nameLength: 1 | 2;
    preferredWuxing?: string[];
    meaningKeywords?: string[];
  };
}

/**
 * 用户数据
 */
export interface UserData {
  /** 用户设置 */
  settings: UserSettings;
  /** 收藏的名字 */
  favoriteNames: NameAnalysisResult[];
  /** 历史记录 */
  history: {
    /** 生成的名字历史 */
    generatedNames: NameAnalysisResult[];
    /** 查询的汉字历史 */
    searchedCharacters: string[];
    /** 最近使用的偏好设置 */
    recentPreferences: any[];
  };
  /** 用户基本信息 */
  profile?: {
    surname?: string;
    gender?: '男' | '女';
    birthDate?: string;
  };
  /** 微信用户信息 */
  userInfo?: WechatMiniprogram.UserInfo;
}

/**
 * 默认用户设置
 */
export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'system',
  soundEnabled: true,
  showDetailedAnalysis: true,
  autoSaveHistory: true,
};

/**
 * 默认用户数据
 */
export const DEFAULT_USER_DATA: UserData = {
  settings: DEFAULT_USER_SETTINGS,
  favoriteNames: [],
  history: {
    generatedNames: [],
    searchedCharacters: [],
    recentPreferences: [],
  },
};
