// pages/poem-detail/index.js
Page({
  data: {
    poem: null,
    showAnnotation: false,
    annotations: {
      '床前明月光': '描述在床前看到的明亮月光，表现出夜晚的宁静。',
      '疑是地上霜': '月光如此明亮，使人误以为地上覆盖着霜。',
      '举头望明月': '抬头仰望明亮的月亮。',
      '低头思故乡': '低头沉思，思念远方的家乡。这句表达了作者的思乡之情。'
    },
    relatedPoems: [
      {
        title: '望月怀远',
        author: '张九龄',
        dynasty: '唐代'
      },
      {
        title: '月夜',
        author: '杜甫',
        dynasty: '唐代'
      },
      {
        title: '春夜喜雨',
        author: '杜甫',
        dynasty: '唐代'
      }
    ]
  },

  onLoad: function() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('poemData', (data) => {
      this.setData({
        poem: data.poem
      });
    });
  },

  // 显示/隐藏注释
  toggleAnnotation: function() {
    this.setData({
      showAnnotation: !this.data.showAnnotation
    });
  },

  // 分享诗词
  onShareAppMessage: function() {
    return {
      title: this.data.poem ? `${this.data.poem.title} - ${this.data.poem.author}` : '古诗词鉴赏',
      path: '/pages/poem-detail/index'
    };
  },

  // 收藏诗词
  favoritePoem: function() {
    wx.showToast({
      title: '收藏成功',
      icon: 'success'
    });
  },

  // 复制诗词内容
  copyPoemContent: function() {
    if (this.data.poem) {
      wx.setClipboardData({
        data: `${this.data.poem.title}\n${this.data.poem.dynasty} · ${this.data.poem.author}\n\n${this.data.poem.content}`,
        success: function() {
          wx.showToast({
            title: '已复制到剪贴板',
            icon: 'success'
          });
        }
      });
    }
  },

  // 查看相关诗词
  viewRelatedPoem: function(e) {
    const index = e.currentTarget.dataset.index;
    // 这里应该是跳转到对应诗词的详情页
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  }
});
