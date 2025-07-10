"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Page({
    data: {
        charData: {},
        phrases: [],
        fiveElementAnalysis: '',
        nameAnalysis: ''
    },
    onLoad() {
        // 获取事件通道
        const eventChannel = this.getOpenerEventChannel();
        // 监听参数传递
        eventChannel.on('charData', (char) => {
            this.setData({
                charData: char
            });
            // 加载相关数据
            this.loadPhrases(char.char);
            this.loadAnalysis(char);
        });
    },
    // 加载常用词组
    loadPhrases(char) {
        // 模拟数据，实际应该从API获取
        const mockPhrases = [];
        if (char === '德') {
            mockPhrases.push({ phrase: '道德', pinyin: 'dào dé' }, { phrase: '品德', pinyin: 'pǐn dé' }, { phrase: '德才', pinyin: 'dé cái' }, { phrase: '德高望重', pinyin: 'dé gāo wàng zhòng' }, { phrase: '美德', pinyin: 'měi dé' });
        }
        else if (char === '智') {
            mockPhrases.push({ phrase: '智慧', pinyin: 'zhì huì' }, { phrase: '智力', pinyin: 'zhì lì' }, { phrase: '智商', pinyin: 'zhì shāng' }, { phrase: '聪明才智', pinyin: 'cōng míng cái zhì' }, { phrase: '足智多谋', pinyin: 'zú zhì duō móu' });
        }
        else {
            // 默认词组
            mockPhrases.push({ phrase: char + '字', pinyin: '' }, { phrase: '好' + char, pinyin: '' });
        }
        this.setData({
            phrases: mockPhrases
        });
    },
    // 加载分析内容
    loadAnalysis(char) {
        // 五行分析
        let fiveElementAnalysis = '';
        switch (char.fiveElement) {
            case '金':
                fiveElementAnalysis = '金属性的字代表着坚强、刚毅、果断、威严。适合有领导能力、决断力强的人。';
                break;
            case '木':
                fiveElementAnalysis = '木属性的字代表着生长、向上、温和、仁爱。适合性格温和、有爱心、富有创造力的人。';
                break;
            case '水':
                fiveElementAnalysis = '水属性的字代表着聪明、智慧、灵活、善变。适合思维活跃、富有智慧的人。';
                break;
            case '火':
                fiveElementAnalysis = '火属性的字代表着热情、活力、光明、温暖。适合性格开朗、热情洋溢的人。';
                break;
            case '土':
                fiveElementAnalysis = '土属性的字代表着稳重、踏实、包容、厚德。适合性格稳重、为人诚恳的人。';
                break;
        }
        // 姓名学分析
        const nameAnalysis = `"${char.char}"字在姓名学中属于${char.fiveElement}性，笔画为${char.strokes}画，用作人名意义优美，寓意${char.meaning.join('、')}。此字结构${this.getStructureAnalysis(char.char)}，读音为"${char.pinyin[0]}"，声调为${this.getToneDescription(char.tone[0])}，音律优美，适合作为名字使用。`;
        this.setData({
            fiveElementAnalysis,
            nameAnalysis
        });
    },
    // 获取结构分析
    getStructureAnalysis(char) {
        // 简单示例，实际应该有更复杂的分析
        const structures = ['左右结构', '上下结构', '半包围结构', '全包围结构', '独体结构'];
        return structures[Math.floor(Math.random() * structures.length)];
    },
    // 获取声调描述
    getToneDescription(tone) {
        const descriptions = [
            '阴平（平稳舒缓）',
            '阳平（轻快上扬）',
            '上声（先降后升）',
            '去声（高降有力）',
            '轻声（轻柔短促）'
        ];
        return descriptions[tone - 1] || '未知声调';
    },
    // 用于起名
    useInName() {
        // 跳转到起名流程页面，并传递选中的字
        wx.navigateTo({
            url: '/pages/name-process/index',
            success: (res) => {
                res.eventChannel.emit('selectedChar', this.data.charData);
            }
        });
    }
});
