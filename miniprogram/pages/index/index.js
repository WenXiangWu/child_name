// index.js
const app = getApp();

Page({
  data: {
    banners: [
      {
        id: 1,
        image: '/images/banner1.png',
        title: '专业起名服务'
      },
      {
        id: 2,
        image: '/images/banner2.png',
        title: '多维度分析'
      },
      {
        id: 3,
        image: '/images/banner3.png',
        title: '海量字库'
      }
    ],
    features: [
      {
        id: 1,
        icon: '/images/feature-name.png',
        title: '智能起名',
        desc: '基于大数据分析，为宝宝提供优质名字'
      },
      {
        id: 2,
        icon: '/images/feature-analysis.png',
        title: '名字分析',
        desc: '多维度分析名字寓意、音律、五行等'
      },
      {
        id: 3,
        icon: '/images/feature-search.png',
        title: '找字助手',
        desc: '通过拼音、部首、笔画等多种方式查字'
      }
    ],
    quickForm: {
      surname: '',
      gender: '男'
    },
    isGenerating: false,
    recentNames: [
      {
        fullName: '张明辉',
        totalScore: 95,
        implication: '光明、辉煌'
      },
      {
        fullName: '李浩然',
        totalScore: 92,
        implication: '浩大、正气'
      }
    ]
  },

  onLoad() {
    // 页面加载时的逻辑
    console.log('页面加载完成');
  },

  // 开始起名
  onStartNaming() {
    wx.navigateTo({
      url: '/pages/name-process/index'
    });
  },

  // 找字功能
  onFindChar() {
    wx.switchTab({
      url: '/pages/char-search/index'
    });
  },

  // 更多选项
  onMoreOptions() {
    wx.navigateTo({
      url: '/pages/name-process/index'
    });
  },

  // 选择性别
  onSelectGender(e) {
    this.setData({
      'quickForm.gender': e.currentTarget.dataset.gender
    });
  },

  // 快速起名
  onQuickGenerate() {
    if (!this.data.quickForm.surname) {
      wx.showToast({
        title: '请输入姓氏',
        icon: 'none'
      });
      return;
    }

    this.setData({
      isGenerating: true
    });

    // 模拟生成过程
    setTimeout(() => {
      this.setData({
        isGenerating: false
      });

      // 跳转到名字结果页
      const params = {
        familyName: this.data.quickForm.surname,
        gender: this.data.quickForm.gender === '男' ? 'male' : 'female',
        nameLength: 2,
        isQuick: true
      };

      wx.navigateTo({
        url: `/pages/name-detail/index?params=${encodeURIComponent(JSON.stringify(params))}`
      });
    }, 1500);
  },

  // 查看历史记录
  onViewHistory() {
    wx.navigateTo({
      url: '/pages/history/index'
    });
  },

  // 点击名字
  onNameTap(e) {
    const index = e.currentTarget.dataset.index;
    const name = this.data.recentNames[index];

    // 构造一个简单的名字对象传递给详情页
    const nameDetail = {
      fullName: name.fullName,
      firstName: name.fullName.substring(1),
      score: name.totalScore,
      analysis: {
        meaning: name.implication
      }
    };

    wx.navigateTo({
      url: `/pages/name-detail/index?shared=true&name=${encodeURIComponent(JSON.stringify(nameDetail))}`
    });
  },

  // 分享小程序
  onShareAppMessage() {
    return {
      title: '起名助手 - 专业的宝宝起名小程序',
      path: '/pages/index/index'
    };
  }
});
