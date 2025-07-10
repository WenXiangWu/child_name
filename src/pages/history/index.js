"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("../../utils/storage");
Page({
    data: {
        historyList: []
    },
    onLoad() {
        this.loadHistory();
    },
    onShow() {
        this.loadHistory();
    },
    // 加载历史记录
    loadHistory() {
        const historyList = storage_1.Storage.get('historyNames') || [];
        this.setData({
            historyList
        });
    },
    // 清空历史记录
    clearHistory() {
        wx.showModal({
            title: '确认清空',
            content: '确定要清空所有历史记录吗？',
            success: (res) => {
                if (res.confirm) {
                    storage_1.Storage.set('historyNames', []);
                    this.setData({
                        historyList: []
                    });
                    wx.showToast({
                        title: '已清空',
                        icon: 'success'
                    });
                }
            }
        });
    },
    // 查看名字详情
    viewNameDetail(e) {
        const name = e.currentTarget.dataset.name;
        wx.navigateTo({
            url: '/pages/name-detail/index',
            success: (res) => {
                res.eventChannel.emit('nameGenerationParams', {
                    familyName: name.familyName,
                    gender: name.gender,
                    selectedName: name
                });
            }
        });
    }
});
