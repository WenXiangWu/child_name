/**
 * 姓氏校验工具函数
 * 基于百家姓数据验证用户输入的姓氏
 */

// 百家姓姓氏列表（从百家姓数据中提取）
let SURNAME_LIST: string[] = [];

/**
 * 加载百家姓数据
 */
async function loadBaijiaxingData(): Promise<string[]> {
  if (SURNAME_LIST.length > 0) {
    return SURNAME_LIST;
  }

  try {
    const response = await fetch('/data/names/baijiaxing.json');
    const data = await response.json();
    
    // 从origin数组中提取所有姓氏
    const surnames: string[] = data.origin.map((item: { surname: string }) => item.surname);
    SURNAME_LIST = [...new Set(surnames)]; // 去重
    
    return SURNAME_LIST;
  } catch (error) {
    console.error('加载百家姓数据失败:', error);
    
    // 如果加载失败，使用备用的常见姓氏列表
    SURNAME_LIST = [
      '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈',
      '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许',
      '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏',
      '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章',
      '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦',
      '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳',
      '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺',
      '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常',
      '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余',
      '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹'
    ];
    
    return SURNAME_LIST;
  }
}

/**
 * 检测字符串是否只包含汉字
 * @param text 待检测的字符串
 * @returns 是否为纯汉字
 */
export function isChineseOnly(text: string): boolean {
  if (!text || text.trim() === '') {
    return false;
  }
  
  // 汉字正则表达式，包含：
  // - 基本汉字：\u4e00-\u9fff (CJK Unified Ideographs)
  // - 扩展A：\u3400-\u4dbf (CJK Unified Ideographs Extension A)
  // - 兼容汉字：\uf900-\ufaff (CJK Compatibility Ideographs)
  const chineseRegex = /^[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]+$/;
  
  return chineseRegex.test(text);
}

/**
 * 检测字符串是否包含非汉字字符
 * @param text 待检测的字符串
 * @returns 是否包含非汉字字符
 */
export function hasNonChinese(text: string): boolean {
  if (!text) {
    return false;
  }
  
  // 检测是否包含非汉字字符
  const nonChineseRegex = /[^\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
  
  return nonChineseRegex.test(text);
}

/**
 * 过滤掉非汉字字符，只保留汉字
 * @param text 待过滤的字符串
 * @returns 过滤后只包含汉字的字符串
 */
export function filterChineseOnly(text: string): string {
  if (!text) {
    return '';
  }
  
  // 只保留汉字字符
  const chineseOnlyRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g;
  const matches = text.match(chineseOnlyRegex);
  
  return matches ? matches.join('') : '';
}

/**
 * 检测是否为百家姓中的姓氏（异步版本）
 * @param surname 姓氏字符串
 * @returns Promise<boolean> 是否为百家姓中的姓氏
 */
export async function isBaijiaxingSurname(surname: string): Promise<boolean> {
  if (!surname || surname.trim() === '') {
    return false;
  }
  
  const surnameList = await loadBaijiaxingData();
  return surnameList.includes(surname.trim());
}

/**
 * 检测是否为百家姓中的姓氏（同步版本，需要预先加载数据）
 * @param surname 姓氏字符串
 * @returns 是否为百家姓中的姓氏
 */
export function isBaijiaxingSurnameSync(surname: string): boolean {
  if (!surname || surname.trim() === '') {
    return false;
  }
  
  // 如果数据未加载，返回false
  if (SURNAME_LIST.length === 0) {
    return false;
  }
  
  return SURNAME_LIST.includes(surname.trim());
}

/**
 * 获取百家姓列表
 * @returns Promise<string[]> 百家姓姓氏列表
 */
export async function getBaijiaxingList(): Promise<string[]> {
  return await loadBaijiaxingData();
}

/**
 * 检测是否为常见的中文姓氏汉字（保留向后兼容性）
 * @param char 单个汉字
 * @returns 是否为常见姓氏
 */
export function isCommonSurname(char: string): boolean {
  // 常见的百家姓前100个姓氏
  const commonSurnames = [
    '王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
    '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
    '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
    '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕',
    '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎',
    '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜',
    '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆',
    '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史',
    '顾', '侯', '邵', '孟', '龙', '万', '段', '漕', '钱', '汤',
    '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'
  ];
  
  return commonSurnames.includes(char);
}

/**
 * 验证姓氏输入
 * @param surname 输入的姓氏
 * @returns 验证结果对象
 */
export interface SurnameValidationResult {
  isValid: boolean;
  message: string;
  filteredValue: string;
}

export function validateSurname(surname: string): SurnameValidationResult {
  // 空值处理
  if (!surname || surname.trim() === '') {
    return {
      isValid: true,
      message: '',
      filteredValue: ''
    };
  }
  
  // 过滤非汉字字符
  const filteredSurname = filterChineseOnly(surname);
  
  // 检查是否包含非汉字字符
  if (hasNonChinese(surname)) {
    return {
      isValid: false,
      message: '姓氏只能输入汉字，请检查输入',
      filteredValue: filteredSurname
    };
  }
  
  // 检查长度（姓氏通常1-2个字）
  if (filteredSurname.length > 2) {
    return {
      isValid: false,
      message: '姓氏最多只能输入2个汉字',
      filteredValue: filteredSurname.slice(0, 2)
    };
  }
  
  // 验证通过
  return {
    isValid: true,
    message: '',
    filteredValue: filteredSurname
  };
}

/**
 * 验证姓氏输入（基于百家姓）
 * @param surname 输入的姓氏
 * @returns Promise<SurnameValidationResult> 验证结果对象
 */
export async function validateSurnameWithBaijiaxing(surname: string): Promise<SurnameValidationResult> {
  // 基础验证
  const basicValidation = validateSurname(surname);
  if (!basicValidation.isValid || !basicValidation.filteredValue) {
    return basicValidation;
  }
  
  // 百家姓验证
  const isValidSurname = await isBaijiaxingSurname(basicValidation.filteredValue);
  if (!isValidSurname) {
    return {
      isValid: false,
      message: `"${basicValidation.filteredValue}" 不在百家姓中，请输入正确的姓氏`,
      filteredValue: basicValidation.filteredValue
    };
  }
  
  return {
    isValid: true,
    message: '',
    filteredValue: basicValidation.filteredValue
  };
}

/**
 * 验证姓氏输入（基于百家姓，同步版本）
 * @param surname 输入的姓氏
 * @returns SurnameValidationResult 验证结果对象
 */
export function validateSurnameWithBaijiaxingSync(surname: string): SurnameValidationResult {
  // 基础验证
  const basicValidation = validateSurname(surname);
  if (!basicValidation.isValid || !basicValidation.filteredValue) {
    return basicValidation;
  }
  
  // 百家姓验证（同步版本）
  const isValidSurname = isBaijiaxingSurnameSync(basicValidation.filteredValue);
  if (!isValidSurname) {
    return {
      isValid: false,
      message: `"${basicValidation.filteredValue}" 不在百家姓中，请输入正确的姓氏`,
      filteredValue: basicValidation.filteredValue
    };
  }
  
  return {
    isValid: true,
    message: '',
    filteredValue: basicValidation.filteredValue
  };
}

/**
 * 创建带汉字校验的输入处理函数（基础版本，保持向后兼容性）
 * @param setValue React的setState函数
 * @param onError 错误处理回调（可选）
 * @returns 输入处理函数
 */
export function createChineseInputHandler(
  setValue: (value: string) => void,
  onError?: (message: string) => void
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const validation = validateSurname(inputValue);
    
    // 总是设置过滤后的值
    setValue(validation.filteredValue);
    
    // 如果有错误且提供了错误处理函数，则调用
    if (!validation.isValid && onError) {
      onError(validation.message);
    }
  };
}

/**
 * 创建基于百家姓校验的输入处理函数
 * @param setValue React的setState函数
 * @param onError 错误处理回调（可选）
 * @param onValidationComplete 验证完成回调（可选）
 * @returns 输入处理函数
 */
export function createBaijiaxingSurnameInputHandler(
  setValue: (value: string) => void,
  onError?: (message: string) => void,
  onValidationComplete?: (isValid: boolean) => void
) {
  let validationTimeout: NodeJS.Timeout;

  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // 先进行基础验证和过滤
    const basicValidation = validateSurname(inputValue);
    setValue(basicValidation.filteredValue);
    
    // 清除之前的验证超时
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }
    
    // 如果有基础错误，立即显示
    if (!basicValidation.isValid) {
      if (onError) {
        onError(basicValidation.message);
      }
      if (onValidationComplete) {
        onValidationComplete(false);
      }
      return;
    }
    
    // 如果输入为空，清除错误
    if (!basicValidation.filteredValue) {
      if (onError) {
        onError('');
      }
      if (onValidationComplete) {
        onValidationComplete(true);
      }
      return;
    }
    
    // 延迟进行百家姓验证（避免输入过程中频繁验证）
    validationTimeout = setTimeout(async () => {
      try {
        const baijiaxingValidation = await validateSurnameWithBaijiaxing(basicValidation.filteredValue);
        
        if (onError) {
          onError(baijiaxingValidation.message);
        }
        
        if (onValidationComplete) {
          onValidationComplete(baijiaxingValidation.isValid);
        }
      } catch (error) {
        console.error('百家姓验证失败:', error);
        // 验证失败时，不显示错误，保持当前状态
      }
    }, 500); // 500ms延迟验证
  };
}
