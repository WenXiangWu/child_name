"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app = getApp();
// 模拟数据
const pinyinGroups = [
    {
        initial: 'A',
        pinyins: ['a', 'ai', 'an', 'ang', 'ao']
    },
    {
        initial: 'B',
        pinyins: ['ba', 'bai', 'ban', 'bang', 'bao', 'bei', 'ben', 'beng', 'bi', 'bian', 'biao', 'bie', 'bin', 'bing', 'bo', 'bu']
    },
    {
        initial: 'C',
        pinyins: ['ca', 'cai', 'can', 'cang', 'cao', 'ce', 'cen', 'ceng', 'cha', 'chai', 'chan', 'chang', 'chao', 'che', 'chen', 'cheng', 'chi', 'chong', 'chou', 'chu', 'chua', 'chuai', 'chuan', 'chuang', 'chui', 'chun', 'chuo', 'ci', 'cong', 'cou', 'cu', 'cuan', 'cui', 'cun', 'cuo']
    }
    // 其他拼音组...
];
const radicalGroups = [
    {
        strokeCount: 1,
        radicals: ['一', '丨', '丶', '丿']
    },
    {
        strokeCount: 2,
        radicals: ['十', '厂', '刀', '力', '匕', '人', '入', '八', '冂', '冖', '几', '凵', '刂', '勹', '匚', '匸', '卜', '卩', '厶', '又']
    },
    {
        strokeCount: 3,
        radicals: ['口', '囗', '土', '士', '夂', '夊', '夕', '大', '女', '子', '宀', '寸', '小', '尢', '尸', '屮', '山', '川', '工', '己', '巾', '干', '幺', '广', '廴', '廾', '弋', '弓', '彐', '彡', '彳']
    }
    // 其他部首组...
];
Page({
    data: {
        currentTab: 0,
        searchKeyword: '',
        selectedPinyin: '',
        selectedRadical: '',
        strokeCount: 5,
        strokeRange: [1, 10],
        selectedElement: '',
        searchResults: [],
        loading: false,
        hasSearched: false,
        pinyinGroups,
        radicalGroups
    },
    // 切换标签
    switchTab(e) {
        const tab = parseInt(e.currentTarget.dataset.tab);
        this.setData({
            currentTab: tab
        });
    },
    // 滑动切换
    swiperChange(e) {
        this.setData({
            currentTab: e.detail.current
        });
    },
    // 输入关键词
    inputKeyword(e) {
        this.setData({
            searchKeyword: e.detail.value
        });
    },
    // 搜索汉字
    searchChars() {
        if (!this.data.searchKeyword) {
            wx.showToast({
                title: '请输入搜索关键词',
                icon: 'none'
            });
            return;
        }
        this.setData({
            loading: true,
            hasSearched: true
        });
        // 模拟搜索
        setTimeout(() => {
            // 这里应该调用实际的搜索API
            const mockResults = [
                {
                    char: '德',
                    pinyin: ['de'],
                    tone: [2],
                    meaning: ['道德', '恩惠', '感恩', '品行'],
                    strokes: 15,
                    radical: '彳',
                    fiveElement: '火'
                },
                {
                    char: '智',
                    pinyin: ['zhi'],
                    tone: [4],
                    meaning: ['聪明', '智慧', '见识', '才智'],
                    strokes: 12,
                    radical: '日',
                    fiveElement: '火'
                },
                {
                    char: '信',
                    pinyin: ['xin'],
                    tone: [4],
                    meaning: ['诚实', '信任', '相信', '信念'],
                    strokes: 9,
                    radical: '亻',
                    fiveElement: '金'
                }
                // 根据搜索关键词返回不同的结果
            ];
            this.setData({
                searchResults: mockResults,
                loading: false
            });
        }, 800);
    },
    // 选择拼音
    selectPinyin(e) {
        const pinyin = e.currentTarget.dataset.pinyin;
        // 如果已选中，则取消选中
        if (this.data.selectedPinyin === pinyin) {
            this.setData({
                selectedPinyin: ''
            });
            return;
        }
        this.setData({
            selectedPinyin: pinyin,
            searchKeyword: pinyin,
            loading: true,
            hasSearched: true
        });
        // 模拟搜索
        setTimeout(() => {
            // 这里应该调用实际的搜索API
            const mockResults = [
                {
                    char: '德',
                    pinyin: ['de'],
                    tone: [2],
                    meaning: ['道德', '恩惠', '感恩', '品行'],
                    strokes: 15,
                    radical: '彳',
                    fiveElement: '火'
                },
                {
                    char: '得',
                    pinyin: ['de'],
                    tone: [2],
                    meaning: ['获得', '得到', '成功', '适合'],
                    strokes: 11,
                    radical: '彳',
                    fiveElement: '火'
                }
                // 根据拼音返回不同的结果
            ];
            this.setData({
                searchResults: mockResults,
                loading: false
            });
        }, 800);
    },
    // 选择部首
    selectRadical(e) {
        const radical = e.currentTarget.dataset.radical;
        // 如果已选中，则取消选中
        if (this.data.selectedRadical === radical) {
            this.setData({
                selectedRadical: ''
            });
            return;
        }
        this.setData({
            selectedRadical: radical,
            searchKeyword: radical,
            loading: true,
            hasSearched: true
        });
        // 模拟搜索
        setTimeout(() => {
            // 这里应该调用实际的搜索API
            const mockResults = [
                {
                    char: '德',
                    pinyin: ['de'],
                    tone: [2],
                    meaning: ['道德', '恩惠', '感恩', '品行'],
                    strokes: 15,
                    radical: '彳',
                    fiveElement: '火'
                },
                {
                    char: '得',
                    pinyin: ['de'],
                    tone: [2],
                    meaning: ['获得', '得到', '成功', '适合'],
                    strokes: 11,
                    radical: '彳',
                    fiveElement: '火'
                },
                {
                    char: '很',
                    pinyin: ['hen'],
                    tone: [3],
                    meaning: ['非常', '十分', '程度高'],
                    strokes: 9,
                    radical: '彳',
                    fiveElement: '水'
                }
                // 根据部首返回不同的结果
            ];
            this.setData({
                searchResults: mockResults,
                loading: false
            });
        }, 800);
    },
    // 笔画数变化
    strokeCountChange(e) {
        const strokeCount = e.detail.value;
        this.setData({
            strokeCount,
            loading: true,
            hasSearched: true
        });
        // 模拟搜索
        setTimeout(() => {
            // 这里应该调用实际的搜索API
            const mockResults = [
                {
                    char: '中',
                    pinyin: ['zhong'],
                    tone: [1],
                    meaning: ['中间', '中国', '命中', '适中'],
                    strokes: 4,
                    radical: '丨',
                    fiveElement: '火'
                },
                {
                    char: '义',
                    pinyin: ['yi'],
                    tone: [4],
                    meaning: ['道义', '正义', '意义', '义气'],
                    strokes: 5,
                    radical: '丶',
                    fiveElement: '木'
                },
                {
                    char: '仁',
                    pinyin: ['ren'],
                    tone: [2],
                    meaning: ['仁爱', '仁慈', '仁义', '仁德'],
                    strokes: 4,
                    radical: '亻',
                    fiveElement: '水'
                }
                // 根据笔画数返回不同的结果
            ];
            this.setData({
                searchResults: mockResults,
                loading: false
            });
        }, 800);
    },
    // 输入最小笔画
    inputMinStroke(e) {
        const min = parseInt(e.detail.value || '1');
        this.setData({
            'strokeRange[0]': min
        });
    },
    // 输入最大笔画
    inputMaxStroke(e) {
        const max = parseInt(e.detail.value || '10');
        this.setData({
            'strokeRange[1]': max
        });
    },
    // 按笔画范围搜索
    searchByStrokeRange() {
        const [min, max] = this.data.strokeRange;
        if (min > max) {
            wx.showToast({
                title: '最小笔画不能大于最大笔画',
                icon: 'none'
            });
            return;
        }
        this.setData({
            loading: true,
            hasSearched: true
        });
        // 模拟搜索
        setTimeout(() => {
            // 这里应该调用实际的搜索API
            const mockResults = [
                {
                    char: '德',
                    pinyin: ['de'],
                    tone: [2],
                    meaning: ['道德', '恩惠', '感恩', '品行'],
                    strokes: 15,
                    radical: '彳',
                    fiveElement: '火'
                },
                {
                    char: '智',
                    pinyin: ['zhi'],
                    tone: [4],
                    meaning: ['聪明', '智慧', '见识', '才智'],
                    strokes: 12,
                    radical: '日',
                    fiveElement: '火'
                },
                {
                    char: '信',
                    pinyin: ['xin'],
                    tone: [4],
                    meaning: ['诚实', '信任', '相信', '信念'],
                    strokes: 9,
                    radical: '亻',
                    fiveElement: '金'
                }
                // 根据笔画范围返回不同的结果
            ];
            this.setData({
                searchResults: mockResults,
                loading: false
            });
        }, 800);
    },
    // 选择五行属性
    selectElement(e) {
        const element = e.currentTarget.dataset.element;
        // 如果已选中，则取消选中
        if (this.data.selectedElement === element) {
            this.setData({
                selectedElement: ''
            });
            return;
        }
        this.setData({
            selectedElement: element,
            loading: true,
            hasSearched: true
        });
        // 模拟搜索
        setTimeout(() => {
            // 这里应该调用实际的搜索API
            const mockResults = [
                {
                    char: '金',
                    pinyin: ['jin'],
                    tone: [1],
                    meaning: ['金属', '金子', '货币', '坚固'],
                    strokes: 8,
                    radical: '钅',
                    fiveElement: '金'
                },
                {
                    char: '银',
                    pinyin: ['yin'],
                    tone: [2],
                    meaning: ['银子', '银色', '银行'],
                    strokes: 11,
                    radical: '钅',
                    fiveElement: '金'
                },
                {
                    char: '铁',
                    pinyin: ['tie'],
                    tone: [3],
                    meaning: ['铁器', '坚固', '坚强'],
                    strokes: 13,
                    radical: '钅',
                    fiveElement: '金'
                }
                // 根据五行属性返回不同的结果
            ];
            this.setData({
                searchResults: mockResults,
                loading: false
            });
        }, 800);
    },
    // 查看汉字详情
    viewCharDetail(e) {
        const char = e.currentTarget.dataset.char;
        // 跳转到汉字详情页
        wx.navigateTo({
            url: '/pages/char-detail/index',
            success: (res) => {
                res.eventChannel.emit('charData', char);
            }
        });
    }
});
