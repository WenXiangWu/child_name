"use strict";
/// <reference path="../typings/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("./utils/storage");
App({
    globalData: {
        userInfo: null,
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        canIUseGetUserProfile: false,
        canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
        settings: {
            theme: 'light',
            nameLength: 2,
            nameGender: 'neutral',
            showFiveElements: true,
            showPronunciation: true,
            showMeaning: true,
            showPopularity: true
        },
        version: '1.0.0',
    },
    onLaunch() {
        // 获取系统信息
        const systemInfo = wx.getSystemInfoSync();
        this.globalData.systemInfo = systemInfo;
        // 判断是否可以使用 getUserProfile
        if (typeof wx.getUserProfile === 'function') {
            this.globalData.canIUseGetUserProfile = true;
        }
        // 加载设置
        const settings = storage_1.Storage.get('settings');
        if (settings) {
            this.globalData.settings = { ...this.globalData.settings, ...settings };
        }
        // 检查用户登录状态
        wx.checkSession({
            success: () => {
                // session_key 未过期，并且在本生命周期一直有效
                try {
                    const userInfo = wx.getStorageSync('userInfo');
                    if (userInfo) {
                        this.globalData.userInfo = JSON.parse(userInfo);
                        this.globalData.hasUserInfo = true;
                    }
                }
                catch (e) {
                    console.error('读取用户信息失败', e);
                }
            },
            fail: () => {
                // session_key 已经失效，需要重新执行登录流程
                this.globalData.hasUserInfo = false;
                this.globalData.userInfo = null;
            }
        });
    },
    // 保存设置
    saveSettings(settings) {
        this.globalData.settings = { ...this.globalData.settings, ...settings };
        storage_1.Storage.set('settings', this.globalData.settings);
    },
    // 重置设置
    resetSettings() {
        this.globalData.settings = {
            theme: 'light',
            nameLength: 2,
            nameGender: 'neutral',
            showFiveElements: true,
            showPronunciation: true,
            showMeaning: true,
            showPopularity: true
        };
        storage_1.Storage.set('settings', this.globalData.settings);
    },
    // 保存用户信息
    saveUserInfo(userInfo) {
        this.globalData.userInfo = userInfo;
        this.globalData.hasUserInfo = true;
        try {
            wx.setStorageSync('userInfo', JSON.stringify(userInfo));
        }
        catch (e) {
            console.error('保存用户信息失败', e);
        }
    },
    // 清除用户信息
    clearUserInfo() {
        this.globalData.userInfo = null;
        this.globalData.hasUserInfo = false;
        try {
            wx.removeStorageSync('userInfo');
        }
        catch (e) {
            console.error('清除用户信息失败', e);
        }
    }
});
