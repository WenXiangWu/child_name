// history/index.js
const app = getApp();

Page({
  data: {
    activeTab: 0,
    tabs: ['名字历史', '收藏名字', '浏览历史'],
    nameHistory: [],
    favoriteNames: [],
    browsingHistory: []
  },

  onLoad() {
    this.loadHistoryData();
  },

  onShow() {
    this.loadHistoryData();
  },

  // 加载历史数据
  loadHistoryData() {
    // 模拟从本地存储加载数据
    try {
      // 名字生成历史
      const nameHistory = [
        {
          id: 1,
          fullName: '张明辉',
          firstName: '明辉',
          date: '2023-05-15',
          score: 95
        },
        {
          id: 2,
          fullName: '张浩然',
          firstName: '浩然',
          date: '2023-05-10',
          score: 92
        }
      ];

      // 收藏的名字
      const favoriteNames = [
        {
          id: 3,
          fullName: '张俊杰',
          firstName: '俊杰',
          date: '2023-05-05',
          score: 90
        }
      ];

      // 浏览历史
      const browsingHistory = [
        {
          id: 1,
          type: 'char',
          content: '德',
          date: '2023-05-16'
        },
        {
          id: 2,
          type: 'char',
          content: '智',
          date: '2023-05-15'
        }
      ];

      this.setData({
        nameHistory,
        favoriteNames,
        browsingHistory
      });
    } catch (e) {
      console.error('加载历史数据失败', e);
    }
  },

  // 切换标签页
  changeTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      activeTab: index
    });
  },

  // 查看名字详情
  viewNameDetail(e) {
    const name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: `/pages/name-detail/index?shared=true&name=${encodeURIComponent(JSON.stringify(name))}`
    });
  },

  // 查看汉字详情
  viewCharDetail(e) {
    const char = e.currentTarget.dataset.char;
    wx.navigateTo({
      url: `/pages/char-detail/index?char=${char}`
    });
  },

  // 删除历史记录
  deleteHistory(e) {
    const type = e.currentTarget.dataset.type;
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '提示',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          // 根据类型删除不同的历史记录
          if (type === 'name') {
            this.setData({
              nameHistory: this.data.nameHistory.filter(item => item.id !== id)
            });
          } else if (type === 'favorite') {
            this.setData({
              favoriteNames: this.data.favoriteNames.filter(item => item.id !== id)
            });
          } else if (type === 'browsing') {
            this.setData({
              browsingHistory: this.data.browsingHistory.filter(item => item.id !== id)
            });
          }

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 清空历史记录
  clearHistory(e) {
    const type = e.currentTarget.dataset.type;

    wx.showModal({
      title: '提示',
      content: '确定要清空所有记录吗？',
      success: (res) => {
        if (res.confirm) {
          // 根据类型清空不同的历史记录
          if (type === 'name') {
            this.setData({
              nameHistory: []
            });
          } else if (type === 'favorite') {
            this.setData({
              favoriteNames: []
            });
          } else if (type === 'browsing') {
            this.setData({
              browsingHistory: []
            });
          }

          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  }
});
