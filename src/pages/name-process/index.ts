import { NameGenerationParams, Gender, NameLength, FiveElement } from '../../types/naming';
import { AppOption } from '../../types/app';

const app = getApp<AppOption>();

Page({
  data: {
    currentStep: 0,
    formData: {
      familyName: '',
      gender: 'neutral' as Gender,
      nameLength: 2 as NameLength,
      style: 'traditional',
      showFiveElements: true,
      showPronunciation: true,
      showMeaning: true,
      showWuge: false,
      showZodiac: false,
    },
    birthDate: '',
    timeRanges: ['不清楚', '子时(23:00-01:00)', '丑时(01:00-03:00)', '寅时(03:00-05:00)',
                '卯时(05:00-07:00)', '辰时(07:00-09:00)', '巳时(09:00-11:00)',
                '午时(11:00-13:00)', '未时(13:00-15:00)', '申时(15:00-17:00)',
                '酉时(17:00-19:00)', '戌时(19:00-21:00)', '亥时(21:00-23:00)'],
    timeIndex: 0,
    meaningKeywords: [] as string[],
    avoidCharsInput: '',
    desiredFiveElements: [] as FiveElement[]
  },

  onLoad() {
    // 从全局设置中加载默认值
    const settings = app.globalData.settings;
    this.setData({
      'formData.nameLength': settings.nameLength,
      'formData.gender': settings.nameGender,
      'formData.showFiveElements': settings.showFiveElements,
      'formData.showPronunciation': settings.showPronunciation,
      'formData.showMeaning': settings.showMeaning,
    });
  },

  // 步骤导航
  goToStep(e: WechatMiniprogram.TouchEvent) {
    const step = parseInt(e.currentTarget.dataset.step as string);
    // 只允许导航到已完成的步骤
    if (step <= this.data.currentStep) {
      this.setData({
        currentStep: step
      });
    }
  },

  // 滑动切换步骤
  swiperChange(e: WechatMiniprogram.SwiperChange) {
    const current = e.detail.current;
    // 只允许向前滑动到已完成的步骤
    if (current <= this.data.currentStep) {
      this.setData({
        currentStep: current
      });
    }
  },

  // 下一步
  nextStep() {
    // 验证当前步骤
    if (!this.validateCurrentStep()) {
      return;
    }

    const nextStep = this.data.currentStep + 1;
    if (nextStep <= 3) {
      this.setData({
        currentStep: nextStep
      });
    }
  },

  // 上一步
  prevStep() {
    const prevStep = this.data.currentStep - 1;
    if (prevStep >= 0) {
      this.setData({
        currentStep: prevStep
      });
    }
  },

  // 验证当前步骤
  validateCurrentStep(): boolean {
    const { currentStep, formData } = this.data;

    // 步骤1：基本信息
    if (currentStep === 0) {
      if (!formData.familyName) {
        wx.showToast({
          title: '请输入姓氏',
          icon: 'none'
        });
        return false;
      }
    }

    return true;
  },

  // 输入姓氏
  inputFamilyName(e: WechatMiniprogram.Input) {
    this.setData({
      'formData.familyName': e.detail.value
    });
  },

  // 选择性别
  selectGender(e: WechatMiniprogram.TouchEvent) {
    const gender = e.currentTarget.dataset.gender as Gender;
    this.setData({
      'formData.gender': gender
    });
  },

  // 选择名字长度
  selectNameLength(e: WechatMiniprogram.TouchEvent) {
    const length = parseInt(e.currentTarget.dataset.length as string) as NameLength;
    this.setData({
      'formData.nameLength': length
    });
  },

  // 选择出生日期
  bindDateChange(e: WechatMiniprogram.PickerChange) {
    this.setData({
      birthDate: e.detail.value as string
    });
  },

  // 选择出生时辰
  bindTimeChange(e: WechatMiniprogram.PickerChange) {
    this.setData({
      timeIndex: e.detail.value as unknown as number
    });
  },

  // 选择名字风格
  selectStyle(e: WechatMiniprogram.TouchEvent) {
    const style = e.currentTarget.dataset.style as string;
    this.setData({
      'formData.style': style
    });
  },

  // 切换字义关键词
  toggleMeaning(e: WechatMiniprogram.TouchEvent) {
    const keyword = e.currentTarget.dataset.keyword as string;
    const meaningKeywords = [...this.data.meaningKeywords];

    const index = meaningKeywords.indexOf(keyword);
    if (index > -1) {
      meaningKeywords.splice(index, 1);
    } else {
      // 最多选择3个关键词
      if (meaningKeywords.length < 3) {
        meaningKeywords.push(keyword);
      } else {
        wx.showToast({
          title: '最多选择3个关键词',
          icon: 'none'
        });
        return;
      }
    }

    this.setData({
      meaningKeywords
    });
  },

  // 输入避免使用的字
  inputAvoidChars(e: WechatMiniprogram.Input) {
    this.setData({
      avoidCharsInput: e.detail.value
    });
  },

  // 切换五行属性
  toggleFiveElement(e: WechatMiniprogram.TouchEvent) {
    const element = e.currentTarget.dataset.element as FiveElement;
    const desiredFiveElements = [...this.data.desiredFiveElements];

    const index = desiredFiveElements.indexOf(element);
    if (index > -1) {
      desiredFiveElements.splice(index, 1);
    } else {
      // 最多选择2个五行属性
      if (desiredFiveElements.length < 2) {
        desiredFiveElements.push(element);
      } else {
        wx.showToast({
          title: '最多选择2个五行属性',
          icon: 'none'
        });
        return;
      }
    }

    this.setData({
      desiredFiveElements
    });
  },

  // 切换分析维度
  toggleAnalysisDimension(e: WechatMiniprogram.TouchEvent) {
    const dimension = e.currentTarget.dataset.dimension as string;
    const currentValue = this.data.formData[dimension as keyof typeof this.data.formData];

    this.setData({
      [`formData.${dimension}`]: !currentValue
    });
  },

  // 提交表单
  submitForm() {
    // 构建名字生成参数
    const params: NameGenerationParams = {
      familyName: this.data.formData.familyName,
      gender: this.data.formData.gender,
      nameLength: this.data.formData.nameLength,
      style: this.data.formData.style as any,
      desiredFiveElements: this.data.desiredFiveElements.length > 0 ? this.data.desiredFiveElements : undefined,
      meaningKeywords: this.data.meaningKeywords.length > 0 ? this.data.meaningKeywords : undefined,
      avoidChars: this.data.avoidCharsInput ? this.data.avoidCharsInput.split(',').map(c => c.trim()) : undefined,
      count: 10,
      includeAnalysis: true
    };

    // 添加出生信息
    if (this.data.birthDate) {
      const [year, month, day] = this.data.birthDate.split('-').map(Number);
      params.birthInfo = {
        year,
        month,
        day
      };

      // 添加时辰信息
      if (this.data.timeIndex > 0) {
        // 简单处理，将时辰转换为小时
        const hourMap = [0, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
        params.birthInfo.hour = hourMap[this.data.timeIndex];
      }
    }

    // 保存用户偏好到全局设置
    app.saveSettings({
      nameLength: this.data.formData.nameLength,
      nameGender: this.data.formData.gender,
      showFiveElements: this.data.formData.showFiveElements,
      showPronunciation: this.data.formData.showPronunciation,
      showMeaning: this.data.formData.showMeaning,
    });

    // 将参数传递到结果页面
    wx.navigateTo({
      url: '/pages/name-detail/index',
      success: (res) => {
        res.eventChannel.emit('nameGenerationParams', params);
      }
    });
  }
});
