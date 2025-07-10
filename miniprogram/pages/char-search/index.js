// char-search/index.js
const app = getApp();

Page({
  data: {
    activeTab: 0,
    tabs: ['拼音', '部首', '笔画', '五行'],
    searchText: '',
    radicals: ['一', '丨', '丿', '丶', '乙', '亅', '二', '亠', '人', '儿', '入', '八', '冂', '冖', '冫', '几', '凵', '刀', '力', '勹', '匕', '匚', '匸', '十', '卜', '卩', '厂', '厶', '又', '口', '囗', '土', '士', '夂', '夊', '夕', '大', '女', '子', '宀', '寸', '小', '尢', '尸', '屮', '山', '巛', '工', '己', '巾', '干', '幺', '广', '廴', '廾', '弋', '弓', '彐', '彡', '彳', '心', '戈', '戶', '手', '支', '攴', '文', '斗', '斤', '方', '无', '日', '曰', '月', '木', '欠', '止', '歹', '殳', '毋', '比', '毛', '氏', '气', '水', '火', '爪', '父', '爻', '爿', '片', '牙', '牛', '犬', '玄', '玉', '瓜', '瓦', '甘', '生', '用', '田', '疋', '疒', '癶', '白', '皮', '皿', '目', '矛', '矢', '石', '示', '禸', '禾', '穴', '立', '竹', '米', '糸', '缶', '网', '羊', '羽', '老', '而', '耒', '耳', '聿', '肉', '臣', '自', '至', '臼', '舌', '舛', '舟', '艮', '色', '艸', '虍', '虫', '血', '行', '衣', '襾', '見', '角', '言', '谷', '豆', '豕', '豸', '貝', '赤', '走', '足', '身', '車', '辛', '辰', '辵', '邑', '酉', '釆', '里', '金', '長', '門', '阜', '隶', '隹', '雨', '青', '非', '面', '革', '韋', '韭', '音', '頁', '風', '飛', '食', '首', '香', '馬', '骨', '高', '髟', '鬥', '鬯', '鬲', '鬼', '魚', '鳥', '鹵', '鹿', '麥', '麻', '黃', '黍', '黑', '黹', '黽', '鼎', '鼓', '鼠', '鼻', '齊', '齒', '龍', '龜', '龠'],
    selectedRadical: '',
    strokes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    selectedStroke: 0,
    fiveElements: ['金', '木', '水', '火', '土'],
    selectedElement: '',
    searchResults: []
  },

  // 切换标签页
  changeTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      activeTab: index,
      searchResults: []
    });
  },

  // 输入拼音搜索
  inputSearch(e) {
    this.setData({
      searchText: e.detail.value
    });
  },

  // 执行拼音搜索
  searchByPinyin() {
    if (!this.data.searchText) {
      wx.showToast({
        title: '请输入拼音',
        icon: 'none'
      });
      return;
    }

    // 模拟搜索结果
    const results = [
      {
        char: '德',
        pinyin: ['de'],
        tone: [2],
        meaning: ['道德', '恩惠', '品行'],
        strokes: 15,
        radical: '心',
        fiveElement: '火'
      },
      {
        char: '得',
        pinyin: ['de'],
        tone: [2],
        meaning: ['获得', '认为', '能够'],
        strokes: 11,
        radical: '彳',
        fiveElement: '火'
      }
    ];

    this.setData({
      searchResults: results
    });
  },

  // 选择部首
  selectRadical(e) {
    const radical = e.currentTarget.dataset.radical;
    this.setData({
      selectedRadical: radical
    });

    // 模拟搜索结果
    const results = [
      {
        char: '德',
        pinyin: ['de'],
        tone: [2],
        meaning: ['道德', '恩惠', '品行'],
        strokes: 15,
        radical: '心',
        fiveElement: '火'
      },
      {
        char: '忠',
        pinyin: ['zhong'],
        tone: [1],
        meaning: ['忠诚', '尽心尽力'],
        strokes: 8,
        radical: '心',
        fiveElement: '火'
      },
      {
        char: '志',
        pinyin: ['zhi'],
        tone: [4],
        meaning: ['意向', '志向', '记录'],
        strokes: 7,
        radical: '心',
        fiveElement: '火'
      }
    ];

    if (radical === '心') {
      this.setData({
        searchResults: results
      });
    } else {
      this.setData({
        searchResults: []
      });
    }
  },

  // 选择笔画
  selectStroke(e) {
    const stroke = parseInt(e.currentTarget.dataset.stroke);
    this.setData({
      selectedStroke: stroke
    });

    // 模拟搜索结果
    const results = [
      {
        char: '中',
        pinyin: ['zhong'],
        tone: [1],
        meaning: ['中间', '中国', '命中'],
        strokes: 4,
        radical: '丨',
        fiveElement: '火'
      },
      {
        char: '义',
        pinyin: ['yi'],
        tone: [4],
        meaning: ['道义', '正义', '意义'],
        strokes: 4,
        radical: '丶',
        fiveElement: '木'
      },
      {
        char: '仁',
        pinyin: ['ren'],
        tone: [2],
        meaning: ['仁爱', '仁慈', '仁义'],
        strokes: 4,
        radical: '人',
        fiveElement: '水'
      }
    ];

    if (stroke === 4) {
      this.setData({
        searchResults: results
      });
    } else {
      this.setData({
        searchResults: []
      });
    }
  },

  // 选择五行
  selectElement(e) {
    const element = e.currentTarget.dataset.element;
    this.setData({
      selectedElement: element
    });

    // 模拟搜索结果
    const results = [
      {
        char: '德',
        pinyin: ['de'],
        tone: [2],
        meaning: ['道德', '恩惠', '品行'],
        strokes: 15,
        radical: '心',
        fiveElement: '火'
      },
      {
        char: '智',
        pinyin: ['zhi'],
        tone: [4],
        meaning: ['智慧', '聪明', '见识'],
        strokes: 12,
        radical: '日',
        fiveElement: '火'
      },
      {
        char: '信',
        pinyin: ['xin'],
        tone: [4],
        meaning: ['诚实', '相信', '信任'],
        strokes: 9,
        radical: '亻',
        fiveElement: '金'
      }
    ];

    if (element === '火' || element === '金') {
      this.setData({
        searchResults: results.filter(item => item.fiveElement === element)
      });
    } else {
      this.setData({
        searchResults: []
      });
    }
  },

  // 查看字详情
  viewCharDetail(e) {
    const char = e.currentTarget.dataset.char;
    wx.navigateTo({
      url: `/pages/char-detail/index?char=${char}`
    });
  },

  // 清空搜索
  clearSearch() {
    this.setData({
      searchText: '',
      selectedRadical: '',
      selectedStroke: 0,
      selectedElement: '',
      searchResults: []
    });
  }
});
