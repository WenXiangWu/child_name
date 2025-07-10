// char-detail/index.js
const app = getApp();

Page({
  data: {
    char: '',
    charData: {
      char: '德',
      pinyin: ['dé'],
      tone: [2],
      radical: '心',
      strokes: 15,
      structure: '左右结构',
      fiveElement: '火',
      frequency: 8,
      meaning: ['道德', '恩惠', '品行']
    },
    phrases: [
      { phrase: '道德', pinyin: 'dào dé' },
      { phrase: '美德', pinyin: 'měi dé' },
      { phrase: '品德', pinyin: 'pǐn dé' },
      { phrase: '德行', pinyin: 'dé xíng' },
      { phrase: '德育', pinyin: 'dé yù' },
      { phrase: '德才', pinyin: 'dé cái' }
    ],
    fiveElementAnalysis: '此字五行属火，代表温暖、热情、活力。用于人名时，有助于增强人的进取心、创造力和领导能力。',
    nameAnalysis: '在姓名学中，"德"字寓意高尚的品德和才能，象征着正直、善良和才华。用于人名时，寄托了父母对孩子品行端正、德才兼备的期望。',
    activeTab: 0,
    tabs: ['基本信息', '字义解释', '常用词组']
  },

  onLoad(options) {
    if (options.char) {
      this.setData({
        'charData.char': options.char
      });
      this.loadCharInfo(options.char);
    }
  },

  // 加载汉字信息
  loadCharInfo(char) {
    // 模拟加载汉字信息
    const charInfo = {
      char: char,
      pinyin: ['dé'],
      tone: [2],
      radical: '心',
      strokes: 15,
      structure: '左右结构',
      fiveElement: '火',
      frequency: 8,
      meaning: ['道德', '恩惠', '品行'],
      etymology: {
        evolution: ['甲骨文', '金文', '小篆', '楷书'],
        formation: '形声字',
        originalMeaning: '直行'
      },
      detailedMeaning: [
        {
          definition: '道德，品行，如：品德、道德、德行、德育。',
          examples: ['品德高尚', '道德模范']
        },
        {
          definition: '恩惠，恩泽，如：恩德、德政、报德。',
          examples: ['知恩图报', '感恩戴德']
        },
        {
          definition: '才能，本领，如：德才兼备、德艺双馨。',
          examples: ['德才兼备', '德艺双馨']
        }
      ],
      commonPhrases: ['道德', '美德', '品德', '德行', '德育', '德才', '德政', '恩德', '阴德', '德艺双馨'],
      culturalContext: '德是中国传统文化的核心价值观之一，强调个人品行和道德修养。在儒家思想中，"德"是君子必备的品质，也是治国安邦的根本。',
      poetryUsage: [
        {
          title: '劝学',
          author: '荀子',
          dynasty: '战国',
          content: '积土成山，风雨兴焉；积水成渊，蛟龙生焉；积善成德，而神明自得。'
        },
        {
          title: '论语·为政',
          author: '孔子',
          dynasty: '春秋',
          content: '为政以德，譬如北辰，居其所而众星共之。'
        }
      ]
    };

    // 更新charData
    this.setData({
      charData: {
        char: charInfo.char,
        pinyin: charInfo.pinyin,
        radical: charInfo.radical,
        strokes: charInfo.strokes,
        fiveElement: charInfo.fiveElement,
        meaning: charInfo.meaning
      }
    });

    // 更新词组
    const phrases = charInfo.commonPhrases.slice(0, 6).map(phrase => {
      return {
        phrase: phrase,
        pinyin: this.getPinyinForPhrase(phrase)
      };
    });

    this.setData({
      phrases: phrases
    });
  },

  // 模拟获取词组拼音
  getPinyinForPhrase(phrase) {
    const pinyinMap = {
      '道德': 'dào dé',
      '美德': 'měi dé',
      '品德': 'pǐn dé',
      '德行': 'dé xíng',
      '德育': 'dé yù',
      '德才': 'dé cái',
      '德政': 'dé zhèng',
      '恩德': 'ēn dé',
      '阴德': 'yīn dé',
      '德艺双馨': 'dé yì shuāng xīn'
    };
    return pinyinMap[phrase] || 'pīn yīn';
  },

  // 切换标签页
  changeTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      activeTab: index
    });
  },

  // 获取结构分析
  getStructureAnalysis(char) {
    return '左右结构，左边为"彳"，表示行走；右边为"直"，表示直行。整体表示人按照正确的道路前行。';
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 收藏汉字
  collectChar() {
    wx.showToast({
      title: '收藏成功',
      icon: 'success'
    });
  },

  // 用于起名
  useInName() {
    wx.navigateTo({
      url: '/pages/name-process/index?char=' + this.data.charData.char
    });
  },

  // 分享汉字
  onShareAppMessage() {
    return {
      title: `汉字详解：${this.data.charData.char}`,
      path: `/pages/char-detail/index?char=${this.data.charData.char}`
    };
  }
});
