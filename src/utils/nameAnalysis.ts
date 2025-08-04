// 名字分析工具函数

/**
 * 计算名字的和谐度（示例算法）
 * @param familyName 姓氏
 * @param givenName 名字
 * @returns 和谐度评分（0-100）
 */
export function calculateHarmony(familyName: string, givenName: string): number {
  // 这里是一个简单的示例算法，实际项目中可能需要更复杂的算法
  // 比如考虑音韵、字形、笔画等因素
  
  // 1. 检查音节数量是否合适
  const totalLength = familyName.length + givenName.length;
  let score = 0;
  
  // 通常中文名字总长度为2-3个字
  if (totalLength === 2) score += 70;
  else if (totalLength === 3) score += 90;
  else if (totalLength === 4) score += 75;
  else score += 60;
  
  // 2. 模拟其他因素的影响
  // 这里只是随机因素，实际项目中应该基于语言学和命名学原理
  const randomFactor = Math.floor(Math.random() * 20);
  
  return Math.min(100, Math.max(0, score + randomFactor));
}

/**
 * 获取名字的五行属性（示例）
 * @param name 完整名字
 * @returns 五行属性数组
 */
export function getFiveElements(name: string): string[] {
  // 这里是一个简化的示例
  // 实际项目中应该有一个字符到五行的映射表
  const elements = ['金', '木', '水', '火', '土'];
  const result: string[] = [];
  
  // 简单示例：根据字符编码分配五行
  for (let i = 0; i < name.length; i++) {
    const charCode = name.charCodeAt(i);
    const elementIndex = charCode % elements.length;
    result.push(elements[elementIndex]);
  }
  
  return result;
}

/**
 * 获取名字的笔画数（示例）
 * @param name 名字
 * @returns 总笔画数
 */
export function getStrokeCount(name: string): number {
  // 这里是一个简化的示例
  // 实际项目中应该有一个汉字到笔画数的映射表
  
  // 简单示例：使用字符编码模拟笔画数
  let totalStrokes = 0;
  for (let i = 0; i < name.length; i++) {
    const charCode = name.charCodeAt(i);
    // 将Unicode编码映射到一个合理的笔画数范围（5-20）
    const strokes = 5 + (charCode % 16);
    totalStrokes += strokes;
  }
  
  return totalStrokes;
}

/**
 * 获取名字的性格特点（示例）
 * @param name 名字
 * @param gender 性别
 * @returns 性格特点数组
 */
export function getPersonalityTraits(name: string, gender: 'male' | 'female'): string[] {
  // 这里是一个简化的示例
  // 实际项目中应该基于名字的含义和特点进行分析
  
  const maleTraits = [
    '坚强自信', '勇敢无畏', '聪明睿智', '领导能力强',
    '有责任感', '有创造力', '善于思考', '稳重可靠',
    '积极进取', '温和儒雅', '正直诚实', '有远见卓识'
  ];
  
  const femaleTraits = [
    '温柔体贴', '聪明伶俐', '优雅大方', '有艺术天赋',
    '善解人意', '富有同情心', '细心周到', '活泼开朗',
    '坚韧不拔', '有创造力', '独立自主', '思维敏捷'
  ];
  
  const traits = gender === 'male' ? maleTraits : femaleTraits;
  const result: string[] = [];
  
  // 简单示例：根据名字选择特点
  // 实际项目中应该有更复杂的算法
  const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // 选择3-5个特点
  const count = 3 + (seed % 3);
  const usedIndices = new Set<number>();
  
  for (let i = 0; i < count; i++) {
    let index;
    do {
      index = (seed + i * 7) % traits.length;
    } while (usedIndices.has(index));
    
    usedIndices.add(index);
    result.push(traits[index]);
  }
  
  return result;
}

/**
 * 获取名字的流行度评分（示例）
 * @param firstName 名字首字
 * @param secondName 名字次字
 * @returns 流行度评分（0-100）
 */
export function getPopularityScore(firstName: string, secondName: string): number {
  // 这里是一个简化的示例
  // 实际项目中应该基于大数据分析或名字数据库
  
  // 简单示例：使用字符编码模拟流行度
  const firstCharCode = firstName.charCodeAt(0);
  const secondCharCode = secondName ? secondName.charCodeAt(0) : 0;
  
  // 生成一个0-100的随机数，但受字符编码影响
  const baseScore = (firstCharCode + secondCharCode) % 50;
  const randomFactor = Math.floor(Math.random() * 50);
  
  return baseScore + randomFactor;
}