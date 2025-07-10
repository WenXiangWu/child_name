import { Storage } from '../../utils/storage';
import { AppOption } from '../../types/app';

const app = getApp<AppOption>();

Page({
  data: {
    // 页面数据
  },

  onLoad() {
    // 页面加载
  },

  onShow() {
    // 页面显示
  },

  // 查看收藏
  viewFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/index'
    });
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有本地缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除所有缓存
          Storage.clear();

          // 重置应用设置
          app.resetSettings();

          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '起名助手 - 专业起名工具',
      path: '/pages/index/index',
      imageUrl: '/assets/images/share-bg.png'
    };
  }
});
