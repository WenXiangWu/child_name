// name-process/index.js
const app = getApp();

Page({
  data: {
    currentStep: 0,
    steps: ['基本信息', '出生信息', '起名偏好', '分析维度'],
    familyName: '',
    gender: 'neutral',
    nameLength: 2,
    birthDate: '2020-01-01',
    birthTime: '12:00',
    nameStyle: ['文艺', '大气', '优雅'],
    avoidChars: '',
    selectedFiveElements: ['金', '木', '水', '火', '土'],
    analysisDimensions: ['五行分析', '字义分析', '音律分析']
  },

  onLoad() {
    // 页面加载时的逻辑
  },

  // 切换步骤
  goToStep(e) {
    const step = parseInt(e.currentTarget.dataset.step);
    if (step >= 0 && step < this.data.steps.length) {
      this.setData({
        currentStep: step
      });
    }
  },

  // 轮播图变化
  swiperChange(e) {
    this.setData({
      currentStep: e.detail.current
    });
  },

  // 下一步
  nextStep() {
    if (this.data.currentStep < this.data.steps.length - 1) {
      this.setData({
        currentStep: this.data.currentStep + 1
      });
    } else {
      this.generateName();
    }
  },

  // 上一步
  prevStep() {
    if (this.data.currentStep > 0) {
      this.setData({
        currentStep: this.data.currentStep - 1
      });
    }
  },

  // 输入姓氏
  inputFamilyName(e) {
    this.setData({
      familyName: e.detail.value
    });
  },

  // 选择性别
  selectGender(e) {
    this.setData({
      gender: e.currentTarget.dataset.gender
    });
  },

  // 选择名字长度
  selectNameLength(e) {
    this.setData({
      nameLength: parseInt(e.currentTarget.dataset.length)
    });
  },

  // 选择出生日期
  bindDateChange(e) {
    this.setData({
      birthDate: e.detail.value
    });
  },

  // 选择出生时间
  bindTimeChange(e) {
    this.setData({
      birthTime: e.detail.value
    });
  },

  // 选择名字风格
  selectStyle(e) {
    const style = e.currentTarget.dataset.style;
    const nameStyle = [...this.data.nameStyle];

    const index = nameStyle.indexOf(style);
    if (index > -1) {
      nameStyle.splice(index, 1);
    } else {
      nameStyle.push(style);
    }

    this.setData({
      nameStyle
    });
  },

  // 输入避免的字符
  inputAvoidChars(e) {
    this.setData({
      avoidChars: e.detail.value
    });
  },

  // 选择五行属性
  toggleFiveElement(e) {
    const element = e.currentTarget.dataset.element;
    const selectedFiveElements = [...this.data.selectedFiveElements];

    const index = selectedFiveElements.indexOf(element);
    if (index > -1) {
      if (selectedFiveElements.length > 1) {
        selectedFiveElements.splice(index, 1);
      } else {
        wx.showToast({
          title: '至少选择一个五行属性',
          icon: 'none'
        });
        return;
      }
    } else {
      selectedFiveElements.push(element);
    }

    this.setData({
      selectedFiveElements
    });
  },

  // 选择分析维度
  toggleAnalysisDimension(e) {
    const dimension = e.currentTarget.dataset.dimension;
    const analysisDimensions = [...this.data.analysisDimensions];

    const index = analysisDimensions.indexOf(dimension);
    if (index > -1) {
      if (analysisDimensions.length > 1) {
        analysisDimensions.splice(index, 1);
      } else {
        wx.showToast({
          title: '至少选择一个分析维度',
          icon: 'none'
        });
        return;
      }
    } else {
      analysisDimensions.push(dimension);
    }

    this.setData({
      analysisDimensions
    });
  },

  // 生成名字并跳转到结果页
  generateName() {
    if (!this.data.familyName) {
      wx.showToast({
        title: '请输入姓氏',
        icon: 'none'
      });
      return;
    }

    // 收集所有参数
    const params = {
      familyName: this.data.familyName,
      gender: this.data.gender,
      nameLength: this.data.nameLength,
      birthDate: this.data.birthDate,
      birthTime: this.data.birthTime,
      nameStyle: this.data.nameStyle,
      avoidChars: this.data.avoidChars,
      fiveElements: this.data.selectedFiveElements,
      analysisDimensions: this.data.analysisDimensions
    };

    // 跳转到名字结果页
    wx.navigateTo({
      url: '/pages/name-detail/index?params=' + encodeURIComponent(JSON.stringify(params))
    });
  }
});
