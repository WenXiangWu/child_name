// name-detail/index.js
const app = getApp();

Page({
  data: {
    params: {},
    names: [
      {
        fullName: '张明辉',
        firstName: '明辉',
        score: 95,
        analysis: {
          fiveElements: '木火',
          meaning: '光明、辉煌',
          pronunciation: '平仄搭配和谐',
          popularity: '常见度适中'
        }
      },
      {
        fullName: '张浩然',
        firstName: '浩然',
        score: 92,
        analysis: {
          fiveElements: '水火',
          meaning: '浩大、正气',
          pronunciation: '平仄搭配和谐',
          popularity: '较为常见'
        }
      },
      {
        fullName: '张俊杰',
        firstName: '俊杰',
        score: 90,
        analysis: {
          fiveElements: '金木',
          meaning: '英俊、杰出',
          pronunciation: '平仄搭配和谐',
          popularity: '较为常见'
        }
      }
    ],
    currentName: 0,
    isFavorite: false
  },

  onLoad(options) {
    if (options.params) {
      try {
        const params = JSON.parse(decodeURIComponent(options.params));
        this.setData({ params });

        // 根据性别调整示例名字
        if (params.gender === 'female') {
          this.setData({
            names: [
              {
                fullName: params.familyName + '雅婷',
                firstName: '雅婷',
                score: 95,
                analysis: {
                  fiveElements: '木火',
                  meaning: '优雅、亭亭玉立',
                  pronunciation: '平仄搭配和谐',
                  popularity: '常见度适中'
                }
              },
              {
                fullName: params.familyName + '诗怡',
                firstName: '诗怡',
                score: 92,
                analysis: {
                  fiveElements: '金木',
                  meaning: '文雅、怡然自得',
                  pronunciation: '平仄搭配和谐',
                  popularity: '较为常见'
                }
              },
              {
                fullName: params.familyName + '梦瑶',
                firstName: '梦瑶',
                score: 90,
                analysis: {
                  fiveElements: '木水',
                  meaning: '如梦如幻、美玉',
                  pronunciation: '平仄搭配和谐',
                  popularity: '较为常见'
                }
              }
            ]
          });
        } else {
          // 使用姓氏替换示例名字中的姓
          const names = this.data.names.map(name => {
            return {
              ...name,
              fullName: params.familyName + name.firstName
            };
          });
          this.setData({ names });
        }
      } catch (e) {
        console.error('解析参数失败', e);
      }
    }
  },

  // 切换名字
  changeName(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    if (index >= 0 && index < this.data.names.length) {
      this.setData({
        currentName: index,
        isFavorite: false
      });
    }
  },

  // 收藏名字
  toggleFavorite() {
    this.setData({
      isFavorite: !this.data.isFavorite
    });

    if (this.data.isFavorite) {
      wx.showToast({
        title: '已收藏',
        icon: 'success'
      });
    }
  },

  // 分享名字
  onShareAppMessage() {
    const currentName = this.data.names[this.data.currentName];
    return {
      title: `我为宝宝起了个好名字：${currentName.fullName}`,
      path: `/pages/name-detail/index?shared=true&name=${encodeURIComponent(JSON.stringify(currentName))}`
    };
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 重新起名
  reGenerate() {
    wx.navigateBack({
      delta: 1
    });
  }
});
