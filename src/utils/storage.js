"use strict";
/**
 * 存储工具类
 * 封装微信小程序的存储API，提供类型安全的存储操作
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
class Storage {
    /**
     * 存储数据
     * @param key 键名
     * @param data 数据
     */
    static set(key, data) {
        try {
            wx.setStorageSync(key, JSON.stringify(data));
        }
        catch (e) {
            console.error(`存储数据失败: ${key}`, e);
        }
    }
    /**
     * 获取数据
     * @param key 键名
     * @returns 数据，如果不存在则返回null
     */
    static get(key) {
        try {
            const data = wx.getStorageSync(key);
            return data ? JSON.parse(data) : null;
        }
        catch (e) {
            console.error(`获取数据失败: ${key}`, e);
            return null;
        }
    }
    /**
     * 删除数据
     * @param key 键名
     */
    static remove(key) {
        try {
            wx.removeStorageSync(key);
        }
        catch (e) {
            console.error(`删除数据失败: ${key}`, e);
        }
    }
    /**
     * 清空所有数据
     */
    static clear() {
        try {
            wx.clearStorageSync();
        }
        catch (e) {
            console.error('清空存储失败', e);
        }
    }
    /**
     * 获取所有数据的键名
     * @returns 键名数组
     */
    static keys() {
        try {
            return wx.getStorageInfoSync().keys;
        }
        catch (e) {
            console.error('获取存储键名失败', e);
            return [];
        }
    }
    /**
     * 获取存储信息
     * @returns 存储信息，包括当前占用大小和限制大小（单位为KB）
     */
    static info() {
        try {
            const { currentSize, limitSize } = wx.getStorageInfoSync();
            return { currentSize, limitSize };
        }
        catch (e) {
            console.error('获取存储信息失败', e);
            return { currentSize: 0, limitSize: 0 };
        }
    }
}
exports.Storage = Storage;
