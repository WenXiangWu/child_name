"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_USER_DATA = exports.DEFAULT_USER_SETTINGS = void 0;
/**
 * 默认用户设置
 */
exports.DEFAULT_USER_SETTINGS = {
    theme: 'system',
    soundEnabled: true,
    showDetailedAnalysis: true,
    autoSaveHistory: true,
};
/**
 * 默认用户数据
 */
exports.DEFAULT_USER_DATA = {
    settings: exports.DEFAULT_USER_SETTINGS,
    favoriteNames: [],
    history: {
        generatedNames: [],
        searchedCharacters: [],
        recentPreferences: [],
    },
};
