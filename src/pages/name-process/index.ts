import { NameGenerationParams, Gender, NameLength } from '../../types/naming';
import { FiveElement } from '../../types/character';
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
    desiredFiveElements: [] as FiveElement[],
    isSubmitting: false, // 添加提交状态控制
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

    // 如果有缓存的表单数据，恢复它
    const cachedFormData = wx.getStorageSync('nameProcessFormData');
    if (cachedFormData) {
      try {
        const parsedData = JSON.parse(cachedFormData);
        this.setData({
          ...parsedData
        });
      } catch (e) {
        console.error('解析缓存表单数据失败', e);
      }
    }
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
      // 缓存当前表单数据
      this.saveFormDataToCache();
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
    const { currentStep, formData, birthDate } = this.data;

    // 步骤1：基本信息
    if (currentStep === 0) {
      if (!formData.familyName.trim()) {
        wx.showToast({
          title: '请输入姓氏',
          icon: 'none'
        });
        return false;
      }

      // 验证姓氏是否为汉字
      if (!/^[\u4e00-\u9fa5]{1,2}$/.test(formData.familyName)) {
        wx.showToast({
          title: '姓氏必须为1-2个汉字',
          icon: 'none'
        });
        return false;
      }
    }

    // 步骤2：出生信息 - 可选，但如果有日期，验证格式
    if (currentStep === 1) {
      if (birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
        wx.showToast({
          title: '出生日期格式不正确',
          icon: 'none'
        });
        return false;
      }
    }

    // 步骤3：起名偏好 - 可以没有特别的验证

    // 步骤4：分析维度 - 至少选择一个分析维度
    if (currentStep === 3) {
      if (!formData.showFiveElements &&
          !formData.showPronunciation &&
          !formData.showMeaning &&
          !formData.showWuge &&
          !formData.showZodiac) {
        wx.showToast({
          title: '请至少选择一个分析维度',
          icon: 'none'
        });
        return false;
      }

      // 如果选择了生肖分析但没有出生日期
      if (formData.showZodiac && !birthDate) {
        wx.showToast({
          title: '生肖分析需要出生日期',
          icon: 'none'
        });
        return false;
      }
    }

    return true;
  },

  // 缓存表单数据
  saveFormDataToCache() {
    try {
      const dataToCache = {
        formData: this.data.formData,
        birthDate: this.data.birthDate,
        timeIndex: this.data.timeIndex,
        meaningKeywords: this.data.meaningKeywords,
        avoidCharsInput: this.data.avoidCharsInput,
        desiredFiveElements: this.data.desiredFiveElements
      };
      wx.setStorageSync('nameProcessFormData', JSON.stringify(dataToCache));
    } catch (e) {
      console.error('缓存表单数据失败', e);
    }
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
    // 最终验证
    if (!this.validateCurrentStep()) {
      return;
    }

    // 防止重复提交
    if (this.data.isSubmitting) {
      return;
    }

    this.setData({
      isSubmitting: true
    });

    // 显示加载提示
    wx.showLoading({
      title: '正在生成名字...',
      mask: true
    });

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

        // 隐藏加载提示
        wx.hideLoading();

        // 重置提交状态
        this.setData({
          isSubmitting: false
        });
      },
      fail: () => {
        // 隐藏加载提示
        wx.hideLoading();

        // 重置提交状态
        this.setData({
          isSubmitting: false
        });

        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  }
});
