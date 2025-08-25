/**
 * 姓氏校验工具函数测试
 */

import {
  isChineseOnly,
  hasNonChinese,
  filterChineseOnly,
  isCommonSurname,
  validateSurname,
  isBaijiaxingSurname,
  validateSurnameWithBaijiaxing,
  getBaijiaxingList
} from '../chineseValidation';

describe('汉字校验工具函数', () => {
  describe('isChineseOnly', () => {
    test('应该正确识别纯汉字', () => {
      expect(isChineseOnly('李')).toBe(true);
      expect(isChineseOnly('张三')).toBe(true);
      expect(isChineseOnly('王小明')).toBe(true);
    });

    test('应该拒绝包含非汉字的字符串', () => {
      expect(isChineseOnly('李a')).toBe(false);
      expect(isChineseOnly('张3')).toBe(false);
      expect(isChineseOnly('王 ')).toBe(false);
      expect(isChineseOnly('李!')).toBe(false);
    });

    test('应该拒绝空字符串', () => {
      expect(isChineseOnly('')).toBe(false);
      expect(isChineseOnly('   ')).toBe(false);
    });
  });

  describe('hasNonChinese', () => {
    test('应该正确检测非汉字字符', () => {
      expect(hasNonChinese('李a')).toBe(true);
      expect(hasNonChinese('张3')).toBe(true);
      expect(hasNonChinese('王 ')).toBe(true);
      expect(hasNonChinese('李!')).toBe(true);
    });

    test('不应该检测到纯汉字字符串中的非汉字', () => {
      expect(hasNonChinese('李')).toBe(false);
      expect(hasNonChinese('张三')).toBe(false);
      expect(hasNonChinese('王小明')).toBe(false);
    });
  });

  describe('filterChineseOnly', () => {
    test('应该过滤掉非汉字字符', () => {
      expect(filterChineseOnly('李a')).toBe('李');
      expect(filterChineseOnly('张3三')).toBe('张三');
      expect(filterChineseOnly('王 小 明')).toBe('王小明');
      expect(filterChineseOnly('李!@#$%')).toBe('李');
    });

    test('应该保留纯汉字字符串', () => {
      expect(filterChineseOnly('李')).toBe('李');
      expect(filterChineseOnly('张三')).toBe('张三');
      expect(filterChineseOnly('王小明')).toBe('王小明');
    });

    test('应该处理空字符串', () => {
      expect(filterChineseOnly('')).toBe('');
      expect(filterChineseOnly('123')).toBe('');
      expect(filterChineseOnly('abc')).toBe('');
    });
  });

  describe('isCommonSurname', () => {
    test('应该正确识别常见姓氏', () => {
      expect(isCommonSurname('王')).toBe(true);
      expect(isCommonSurname('李')).toBe(true);
      expect(isCommonSurname('张')).toBe(true);
      expect(isCommonSurname('刘')).toBe(true);
    });

    test('应该拒绝不常见的字符', () => {
      expect(isCommonSurname('甲')).toBe(false);
      expect(isCommonSurname('乙')).toBe(false);
      expect(isCommonSurname('丙')).toBe(false);
    });
  });

  describe('validateSurname', () => {
    test('应该通过有效的姓氏', () => {
      const result1 = validateSurname('李');
      expect(result1.isValid).toBe(true);
      expect(result1.filteredValue).toBe('李');
      expect(result1.message).toBe('');

      const result2 = validateSurname('王');
      expect(result2.isValid).toBe(true);
      expect(result2.filteredValue).toBe('王');
      expect(result2.message).toBe('');

      const result3 = validateSurname('欧阳');
      expect(result3.isValid).toBe(true);
      expect(result3.filteredValue).toBe('欧阳');
      expect(result3.message).toBe('');
    });

    test('应该拒绝包含非汉字的输入', () => {
      const result1 = validateSurname('李a');
      expect(result1.isValid).toBe(false);
      expect(result1.filteredValue).toBe('李');
      expect(result1.message).toContain('只能输入汉字');

      const result2 = validateSurname('王3');
      expect(result2.isValid).toBe(false);
      expect(result2.filteredValue).toBe('王');
      expect(result2.message).toContain('只能输入汉字');
    });

    test('应该限制姓氏长度', () => {
      const result = validateSurname('李小明');
      expect(result.isValid).toBe(false);
      expect(result.filteredValue).toBe('李小');
      expect(result.message).toContain('最多只能输入2个汉字');
    });

    test('应该接受空输入', () => {
      const result1 = validateSurname('');
      expect(result1.isValid).toBe(true);
      expect(result1.filteredValue).toBe('');
      expect(result1.message).toBe('');

      const result2 = validateSurname('   ');
      expect(result2.isValid).toBe(true);
      expect(result2.filteredValue).toBe('');
      expect(result2.message).toBe('');
    });
  });

  describe('百家姓校验功能', () => {
    // Mock fetch for testing
    beforeAll(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            origin: [
              { surname: '赵', place: '天水' },
              { surname: '钱', place: '彭城' },
              { surname: '孙', place: '乐安' },
              { surname: '李', place: '陇西' },
              { surname: '王', place: '太原' },
              { surname: '张', place: '清河' },
              { surname: '刘', place: '彭城' },
              { surname: '司马', place: '河内' },
              { surname: '欧阳', place: '渤海' },
              { surname: '诸葛', place: '琅琊' },
              { surname: '上官', place: '天水' },
              { surname: '夏侯', place: '谯郡' }
            ]
          })
        })
      ) as jest.Mock;
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    test('应该能够获取百家姓列表', async () => {
      const surnameList = await getBaijiaxingList();
      expect(Array.isArray(surnameList)).toBe(true);
      expect(surnameList.length).toBeGreaterThan(0);
      expect(surnameList).toContain('赵');
      expect(surnameList).toContain('钱');
      expect(surnameList).toContain('孙');
      expect(surnameList).toContain('李');
    });

    test('isBaijiaxingSurname应该正确验证百家姓', async () => {
      // 测试常见姓氏
      expect(await isBaijiaxingSurname('李')).toBe(true);
      expect(await isBaijiaxingSurname('王')).toBe(true);
      expect(await isBaijiaxingSurname('张')).toBe(true);
      expect(await isBaijiaxingSurname('刘')).toBe(true);
      
      // 测试复姓
      expect(await isBaijiaxingSurname('司马')).toBe(true);
      expect(await isBaijiaxingSurname('欧阳')).toBe(true);
      expect(await isBaijiaxingSurname('诸葛')).toBe(true);
      
      // 测试不在百家姓中的姓氏
      expect(await isBaijiaxingSurname('测试')).toBe(false);
      expect(await isBaijiaxingSurname('不存在')).toBe(false);
    });

    test('validateSurnameWithBaijiaxing应该正确验证姓氏', async () => {
      // 测试有效姓氏
      const validResult = await validateSurnameWithBaijiaxing('李');
      expect(validResult.isValid).toBe(true);
      expect(validResult.message).toBe('');
      expect(validResult.filteredValue).toBe('李');

      // 测试无效姓氏
      const invalidResult = await validateSurnameWithBaijiaxing('测试');
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.message).toContain('不在百家姓中');
      expect(invalidResult.filteredValue).toBe('测试');

      // 测试包含非汉字的输入
      const mixedResult = await validateSurnameWithBaijiaxing('李a');
      expect(mixedResult.isValid).toBe(false);
      expect(mixedResult.message).toContain('只能输入汉字');

      // 测试空输入
      const emptyResult = await validateSurnameWithBaijiaxing('');
      expect(emptyResult.isValid).toBe(true);
      expect(emptyResult.message).toBe('');
      expect(emptyResult.filteredValue).toBe('');
    });

    test('复姓应该被正确识别', async () => {
      const compoundSurnames = ['司马', '欧阳', '诸葛', '上官', '夏侯'];
      
      for (const surname of compoundSurnames) {
        const result = await isBaijiaxingSurname(surname);
        expect(result).toBe(true);
      }
    });

    test('应该处理边界情况', async () => {
      // 测试空字符串
      expect(await isBaijiaxingSurname('')).toBe(false);
      expect(await isBaijiaxingSurname('   ')).toBe(false);
      
      // 测试null和undefined
      expect(await isBaijiaxingSurname(null as any)).toBe(false);
      expect(await isBaijiaxingSurname(undefined as any)).toBe(false);
    });
  });
});
