// pages/name-search/index.js
Page({
  data: {
    searchKeyword: '',
    nameStyles: ['传统', '现代', '文艺', '独特'],
    selectedStyles: [],
    genders: ['男', '女', '通用'],
    selectedGender: '通用',
    nameLength: 2,
    searchResults: [],
    loading: false,
    hasSearched: false
  },

  onLoad: function() {
    // 页面加载时执行
  },

  // 输入搜索关键词
  inputKeyword: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 选择名字风格
  toggleStyle: function(e) {
    const style = e.currentTarget.dataset.style;
    const selectedStyles = [...this.data.selectedStyles];

    const index = selectedStyles.indexOf(style);
    if (index > -1) {
      selectedStyles.splice(index, 1);
    } else {
      selectedStyles.push(style);
    }

    this.setData({
      selectedStyles
    });
  },

  // 选择性别
  selectGender: function(e) {
    this.setData({
      selectedGender: e.currentTarget.dataset.gender
    });
  },

  // 选择名字长度
  setNameLength: function(e) {
    this.setData({
      nameLength: parseInt(e.currentTarget.dataset.length)
    });
  },

  // 搜索名字
  searchNames: function() {
    if (!this.data.searchKeyword.trim() && this.data.selectedStyles.length === 0) {
      wx.showToast({
        title: '请输入关键词或选择风格',
        icon: 'none'
      });
      return;
    }

    this.setData({
      loading: true,
      hasSearched: true
    });

    // 模拟搜索结果
    setTimeout(() => {
      const mockResults = [
        {
          name: '泽宇',
          gender: '男',
          score: 95,
          meaning: '智慧如水，气宇轩昂',
          styles: ['传统', '现代']
        },
        {
          name: '梓萱',
          gender: '女',
          score: 92,
          meaning: '如紫荆花般美丽，充满活力',
          styles: ['文艺', '现代']
        },
        {
          name: '浩然',
          gender: '男',
          score: 90,
          meaning: '正气浩然，品德高尚',
          styles: ['传统', '独特']
        },
        {
          name: '语嫣',
          gender: '女',
          score: 89,
          meaning: '言语温婉，美丽动人',
          styles: ['文艺', '独特']
        }
      ];

      // 根据条件筛选结果
      let filteredResults = mockResults;

      if (this.data.selectedGender !== '通用') {
        filteredResults = filteredResults.filter(item =>
          item.gender === this.data.selectedGender
        );
      }

      if (this.data.selectedStyles.length > 0) {
        filteredResults = filteredResults.filter(item =>
          this.data.selectedStyles.some(style => item.styles.includes(style))
        );
      }

      if (this.data.searchKeyword) {
        const keyword = this.data.searchKeyword.toLowerCase();
        filteredResults = filteredResults.filter(item =>
          item.name.includes(keyword) ||
          item.meaning.includes(keyword)
        );
      }

      this.setData({
        searchResults: filteredResults,
        loading: false
      });
    }, 1000);
  },

  // 查看名字详情
  viewNameDetail: function(e) {
    const index = e.currentTarget.dataset.index;
    const nameData = this.data.searchResults[index];

    wx.navigateTo({
      url: '/pages/name-detail/index',
      success: function(res) {
        res.eventChannel.emit('nameData', { name: nameData });
      }
    });
  }
});
