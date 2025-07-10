// index.js
const app = getApp()

Page({
  data: {
    surname: '',
    gender: 'male',
    searchChar: ''
  },

  onLoad() {
    // 页面加载时的逻辑
  },

  // 输入姓氏
  inputSurname(e) {
    this.setData({
      surname: e.detail.value
    });
  },

  // 选择性别
  selectGender(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({
      gender: gender
    });
  },

  // 搜索名字
  searchNames() {
    if (!this.data.surname) {
      wx.showToast({
        title: '请输入姓氏',
        icon: 'none'
      });
      return;
    }

    // 跳转到起名流程页面
    wx.navigateTo({
      url: `/pages/name-process/index?surname=${this.data.surname}&gender=${this.data.gender}`
    });
  },

  // 蛇年好名
  goToSnakeYear() {
    wx.navigateTo({
      url: '/pages/name-search/index?type=snake'
    });
  },

  // 五行吉名
  goToFiveElements() {
    wx.navigateTo({
      url: '/pages/name-search/index?type=fiveElements'
    });
  },

  // 诗词佳名
  goToPoetryNames() {
    wx.navigateTo({
      url: '/pages/poem-search/index'
    });
  },

  // 好听名字
  goToNiceNames() {
    wx.navigateTo({
      url: '/pages/name-search/index?type=nice'
    });
  },

  // 属性查字
  goToRadicalSearch() {
    wx.switchTab({
      url: '/pages/char-search/index'
    });
  },

  // 生肖查字
  goToZodiacSearch() {
    wx.switchTab({
      url: '/pages/char-search/index'
    });
  },

  // 名字寓意
  goToNameMeaning() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 名字查诗
  goToNamePoetry() {
    wx.switchTab({
      url: '/pages/poem-search/index'
    });
  },

  // 输入查询字符
  inputSearchChar(e) {
    this.setData({
      searchChar: e.detail.value
    });
  },

  // 查询字符
  searchCharacter() {
    if (!this.data.searchChar) {
      wx.showToast({
        title: '请输入汉字',
        icon: 'none'
      });
      return;
    }

    wx.switchTab({
      url: '/pages/char-search/index'
    });
  }
})
