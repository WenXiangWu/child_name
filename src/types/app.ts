// app.ts类型定义

export interface AppOption {
  globalData: {
    userInfo: WechatMiniprogram.UserInfo | null;
    hasUserInfo: boolean;
    canIUse: boolean;
    canIUseGetUserProfile: boolean;
    canIUseOpenData: boolean;
    systemInfo?: WechatMiniprogram.SystemInfo;
    settings: {
      theme: 'light' | 'dark';
      nameLength: number;
      nameGender: 'male' | 'female' | 'neutral';
      showFiveElements: boolean;
      showPronunciation: boolean;
      showMeaning: boolean;
      showPopularity: boolean;
    };
    version: string;
  };
  saveSettings: (settings: Partial<AppOption['globalData']['settings']>) => void;
  resetSettings: () => void;
  saveUserInfo: (userInfo: WechatMiniprogram.UserInfo) => void;
  clearUserInfo: () => void;
}
