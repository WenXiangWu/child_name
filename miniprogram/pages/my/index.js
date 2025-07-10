// my/index.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    settings: {
      theme: 'light',
      showFiveElements: true,
      showPronunciation: true,
      showMeaning: true,
      showPopularity: true
    }
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }

    // 获取用户信息
    const userInfo = app.globalData.userInfo;
    const hasUserInfo = app.globalData.hasUserInfo;
    if (hasUserInfo) {
      this.setData({
        userInfo,
        hasUserInfo
      });
    }

    // 获取设置
    this.setData({
      settings: app.globalData.settings
    });
  },

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        app.saveUserInfo(res.userInfo);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    });
  },

  // 切换主题
  toggleTheme() {
    const theme = this.data.settings.theme === 'light' ? 'dark' : 'light';
    this.setData({
      'settings.theme': theme
    });
    app.saveSettings({ theme });
  },

  // 切换设置项
  toggleSetting(e) {
    const setting = e.currentTarget.dataset.setting;
    const value = !this.data.settings[setting];

    this.setData({
      [`settings.${setting}`]: value
    });

    // 保存设置
    const settingUpdate = {};
    settingUpdate[setting] = value;
    app.saveSettings(settingUpdate);
  },

  // 跳转到历史记录
  goToHistory() {
    wx.navigateTo({
      url: '/pages/history/index'
    });
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '提示',
      content: '确定要清除缓存吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.clearStorageSync();
            app.resetSettings();
            this.setData({
              settings: app.globalData.settings
            });
            wx.showToast({
              title: '缓存已清除',
              icon: 'success'
            });
          } catch (e) {
            wx.showToast({
              title: '清除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 关于我们
  aboutUs() {
    wx.showModal({
      title: '关于起名助手',
      content: '起名助手是一款专业的宝宝起名小程序，结合传统文化与现代科技，为您的宝宝提供优质的名字选择。\n\n版本：1.0.0\n开发者：起名助手团队',
      showCancel: false
    });
  },

  // 联系客服
  contactService() {
    // 微信小程序会自动处理客服消息
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.clearUserInfo();
          this.setData({
            userInfo: null,
            hasUserInfo: false
          });
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  }
});
