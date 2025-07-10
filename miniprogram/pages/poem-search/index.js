// pages/poem-search/index.js
Page({
  data: {
    searchKeyword: '',
    currentTab: 0,
    dynasties: ['全部', '先秦', '两汉', '魏晋', '南北朝', '隋代', '唐代', '五代', '宋代', '金朝', '元代', '明代', '清代', '近代'],
    selectedDynasty: '全部',
    categories: ['全部', '诗', '词', '曲', '赋', '文言文'],
    selectedCategory: '全部',
    themes: ['山水', '田园', '边塞', '爱情', '离别', '思乡', '送别', '抒情', '咏物', '写景'],
    selectedThemes: [],
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

  // 切换标签页
  switchTab: function(e) {
    const tab = parseInt(e.currentTarget.dataset.tab);
    this.setData({
      currentTab: tab
    });
  },

  // 滑动切换标签页
  swiperChange: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
  },

  // 选择朝代
  selectDynasty: function(e) {
    this.setData({
      selectedDynasty: e.currentTarget.dataset.dynasty
    });
  },

  // 选择类别
  selectCategory: function(e) {
    this.setData({
      selectedCategory: e.currentTarget.dataset.category
    });
  },

  // 选择主题
  toggleTheme: function(e) {
    const theme = e.currentTarget.dataset.theme;
    const selectedThemes = [...this.data.selectedThemes];

    const index = selectedThemes.indexOf(theme);
    if (index > -1) {
      selectedThemes.splice(index, 1);
    } else {
      selectedThemes.push(theme);
    }

    this.setData({
      selectedThemes
    });
  },

  // 搜索诗词
  searchPoems: function() {
    if (!this.data.searchKeyword.trim() &&
        this.data.selectedDynasty === '全部' &&
        this.data.selectedCategory === '全部' &&
        this.data.selectedThemes.length === 0) {
      wx.showToast({
        title: '请输入关键词或选择筛选条件',
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
          title: '静夜思',
          author: '李白',
          dynasty: '唐代',
          category: '诗',
          content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
          themes: ['思乡', '抒情']
        },
        {
          title: '登鹳雀楼',
          author: '王之涣',
          dynasty: '唐代',
          category: '诗',
          content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
          themes: ['山水', '写景']
        },
        {
          title: '望岳',
          author: '杜甫',
          dynasty: '唐代',
          category: '诗',
          content: '岱宗夫如何？齐鲁青未了。造化钟神秀，阴阳割昏晓。荡胸生层云，决眦入归鸟。会当凌绝顶，一览众山小。',
          themes: ['山水', '写景']
        },
        {
          title: '江雪',
          author: '柳宗元',
          dynasty: '唐代',
          category: '诗',
          content: '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。',
          themes: ['山水', '写景']
        }
      ];

      // 根据条件筛选结果
      let filteredResults = mockResults;

      if (this.data.selectedDynasty !== '全部') {
        filteredResults = filteredResults.filter(item =>
          item.dynasty === this.data.selectedDynasty
        );
      }

      if (this.data.selectedCategory !== '全部') {
        filteredResults = filteredResults.filter(item =>
          item.category === this.data.selectedCategory
        );
      }

      if (this.data.selectedThemes.length > 0) {
        filteredResults = filteredResults.filter(item =>
          this.data.selectedThemes.some(theme => item.themes.includes(theme))
        );
      }

      if (this.data.searchKeyword) {
        const keyword = this.data.searchKeyword;
        filteredResults = filteredResults.filter(item =>
          item.title.includes(keyword) ||
          item.author.includes(keyword) ||
          item.content.includes(keyword)
        );
      }

      this.setData({
        searchResults: filteredResults,
        loading: false
      });
    }, 1000);
  },

  // 查看诗词详情
  viewPoemDetail: function(e) {
    const index = e.currentTarget.dataset.index;
    const poemData = this.data.searchResults[index];

    wx.navigateTo({
      url: '/pages/poem-detail/index',
      success: function(res) {
        res.eventChannel.emit('poemData', { poem: poemData });
      }
    });
  }
});
