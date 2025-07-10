"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nameGenerator_1 = require("../../services/nameGenerator");
const storage_1 = require("../../utils/storage");
const user_1 = require("../../types/user");
Page({
    data: {
        recentNames: [],
        quickForm: {
            surname: '',
            gender: '',
        },
        isGenerating: false,
    },
    onLoad() {
        this.loadRecentNames();
        this.loadUserProfile();
    },
    onShow() {
        this.loadRecentNames();
    },
    /**
     * 加载最近起名记录
     */
    loadRecentNames() {
        const userData = storage_1.Storage.get('userData');
        if (userData?.history?.generatedNames) {
            // 只显示最近的3个名字
            const recentNames = userData.history.generatedNames.slice(0, 3);
            this.setData({ recentNames });
        }
    },
    /**
     * 加载用户资料
     */
    loadUserProfile() {
        const userData = storage_1.Storage.get('userData');
        if (userData?.profile) {
            this.setData({
                'quickForm.surname': userData.profile.surname || '',
                'quickForm.gender': userData.profile.gender || '',
            });
        }
    },
    /**
     * 跳转到起名流程
     */
    onStartNaming() {
        wx.navigateTo({
            url: '/pages/name-process/index',
        });
    },
    /**
     * 跳转到找字页面
     */
    onFindChar() {
        wx.switchTab({
            url: '/pages/char-search/index',
        });
    },
    /**
     * 选择性别
     */
    onSelectGender(e) {
        const { gender } = e.currentTarget.dataset;
        this.setData({
            'quickForm.gender': gender,
        });
    },
    /**
     * 快速生成名字
     */
    onQuickGenerate() {
        const { surname, gender } = this.data.quickForm;
        if (!surname) {
            wx.showToast({
                title: '请输入姓氏',
                icon: 'none',
            });
            return;
        }
        if (!gender) {
            wx.showToast({
                title: '请选择性别',
                icon: 'none',
            });
            return;
        }
        // 保存用户资料
        const userData = storage_1.Storage.get('userData') || JSON.parse(JSON.stringify(user_1.DEFAULT_USER_DATA));
        if (!userData.profile)
            userData.profile = {};
        userData.profile.surname = surname;
        userData.profile.gender = gender;
        storage_1.Storage.set('userData', userData);
        // 显示加载状态
        this.setData({ isGenerating: true });
        // 快速生成名字
        setTimeout(() => {
            try {
                // 生成名字
                const names = nameGenerator_1.NameGeneratorService.generateNames({
                    userInfo: {
                        surname,
                        gender: gender,
                    },
                    preference: {
                        nameLength: 2,
                        useUncommonChars: false,
                    },
                    count: 5,
                });
                // 保存生成的名字
                if (names.length > 0) {
                    const userData = storage_1.Storage.get('userData') || JSON.parse(JSON.stringify(user_1.DEFAULT_USER_DATA));
                    // 将新生成的名字添加到历史记录
                    userData.history.generatedNames = [
                        ...names,
                        ...(userData.history.generatedNames || []),
                    ].slice(0, 20); // 最多保留20条记录
                    storage_1.Storage.set('userData', userData);
                    // 更新页面数据
                    this.setData({
                        recentNames: names.slice(0, 3),
                        isGenerating: false,
                    });
                    // 显示生成成功提示
                    wx.showToast({
                        title: '起名成功',
                        icon: 'success',
                    });
                }
            }
            catch (error) {
                console.error('生成名字失败:', error);
                this.setData({ isGenerating: false });
                wx.showToast({
                    title: '生成失败，请重试',
                    icon: 'none',
                });
            }
        }, 1000); // 模拟生成过程的延迟
    },
    /**
     * 查看更多选项
     */
    onMoreOptions() {
        wx.navigateTo({
            url: '/pages/name-process/index',
        });
    },
    /**
     * 查看历史记录
     */
    onViewHistory() {
        wx.navigateTo({
            url: '/pages/history/index',
        });
    },
    /**
     * 处理名字点击
     */
    onNameTap(e) {
        const { index } = e.currentTarget.dataset;
        const name = this.data.recentNames[index];
        wx.navigateTo({
            url: `/pages/name-detail/index?name=${encodeURIComponent(JSON.stringify(name))}`,
        });
    },
});
