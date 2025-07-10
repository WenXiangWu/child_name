import { NameGenerationParams, GeneratedName } from '../../types/naming';
import { NameGenerator } from '../../services/nameGenerator';
import { Storage } from '../../utils/storage';
import { AppOption } from '../../types/app';

const app = getApp<AppOption>();

Page({
  data: {
    currentTab: 0,
    loading: true,
    nameList: [] as GeneratedName[],
    selectedNameIndex: -1,
    selectedName: null as GeneratedName | null,
    formData: {
      familyName: '',
      gender: 'neutral',
      showFiveElements: true,
      showPronunciation: true,
      showMeaning: true,
      showWuge: false,
      showZodiac: false,
    }
  },

  onLoad() {
    // 获取事件通道
    const eventChannel = this.getOpenerEventChannel();

    // 监听参数传递
    eventChannel.on('nameGenerationParams', (params: NameGenerationParams) => {
      // 更新表单数据
      this.setData({
        'formData.familyName': params.familyName,
        'formData.gender': params.gender,
        'formData.showFiveElements': app.globalData.settings.showFiveElements,
        'formData.showPronunciation': app.globalData.settings.showPronunciation,
        'formData.showMeaning': app.globalData.settings.showMeaning,
      });

      // 生成名字
      this.generateNames(params);
    });
  },

  // 生成名字
  generateNames(params: NameGenerationParams) {
    this.setData({
      loading: true,
      nameList: [],
      selectedNameIndex: -1,
      selectedName: null
    });

    // 调用名字生成服务
    setTimeout(() => {
      const nameList = NameGenerator.generateNames(params);

      this.setData({
        nameList,
        loading: false
      });

      // 如果有名字，默认选中第一个
      if (nameList.length > 0) {
        this.selectName({ currentTarget: { dataset: { index: 0 } } } as any);
      }
    }, 1500); // 模拟网络延迟
  },

  // 重新生成名字
  regenerateNames() {
    // 获取上一次的参数
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('regenerate');

    // 显示加载状态
    this.setData({
      loading: true,
      nameList: [],
      selectedNameIndex: -1,
      selectedName: null
    });
  },

  // 选择名字
  selectName(e: WechatMiniprogram.TouchEvent) {
    const index = parseInt(e.currentTarget.dataset.index as string);
    const selectedName = this.data.nameList[index];

    this.setData({
      selectedNameIndex: index,
      selectedName,
      currentTab: 1 // 自动切换到分析标签
    });
  },

  // 切换标签
  switchTab(e: WechatMiniprogram.TouchEvent) {
    const tab = parseInt(e.currentTarget.dataset.tab as string);
    this.setData({
      currentTab: tab
    });
  },

  // 滑动切换
  swiperChange(e: WechatMiniprogram.SwiperChange) {
    this.setData({
      currentTab: e.detail.current
    });
  },

  // 收藏名字
  saveName() {
    if (!this.data.selectedName) {
      return;
    }

    try {
      // 获取已收藏的名字
      const favoriteNames = Storage.get<GeneratedName[]>('favoriteNames') || [];

      // 检查是否已收藏
      const isExist = favoriteNames.some(name => name.id === this.data.selectedName!.id);

      if (isExist) {
        wx.showToast({
          title: '已收藏过该名字',
          icon: 'none'
        });
        return;
      }

      // 添加到收藏
      favoriteNames.push(this.data.selectedName!);
      Storage.set('favoriteNames', favoriteNames);

      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      });
    } catch (e) {
      console.error('收藏名字失败:', e);
      wx.showToast({
        title: '收藏失败',
        icon: 'none'
      });
    }
  },

  // 分享
  onShareAppMessage() {
    if (this.data.selectedName) {
      return {
        title: `我为宝宝起了个好名字：${this.data.selectedName.fullName}`,
        path: '/pages/index/index',
        imageUrl: '/assets/images/share-bg.png'
      };
    }

    return {
      title: '起名助手 - 专业起名工具',
      path: '/pages/index/index'
    };
  }
});
