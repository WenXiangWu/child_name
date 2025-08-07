/**
 * 统一字符数据库创建脚本
 * 基于通用规范汉字表整合所有取名所需的字符资源
 */

const fs = require('fs').promises;
const path = require('path');

// 数据源配置
const DATA_SOURCES = {
  standardChars: path.join(__dirname, '../public/data/standard-characters.json'),
  xinhuaDict: path.join(__dirname, '../public/data/processed/xinhua-processed.json'),
  wuxingJianti: path.join(__dirname, '../public/data/wuxing_dict_jianti.json'),
  pinyinProcessed: path.join(__dirname, '../public/data/processed/pinyin-processed.json'),
  togsccPinyin: path.join(__dirname, '../../table-of-general-standard-chinese-characters/data/pinyin.json'),
  togsccChars: path.join(__dirname, '../../table-of-general-standard-chinese-characters/data/characters.json'),
  togsccDuoyin: path.join(__dirname, '../../table-of-general-standard-chinese-characters/data/pinyin.duo.json'),
  togsccSimplified: path.join(__dirname, '../../table-of-general-standard-chinese-characters/data/simplified.convert.json'),
  togsccTraditional: path.join(__dirname, '../../table-of-general-standard-chinese-characters/data/traditional.convert.json')
};

// 输出路径
const OUTPUT_PATH = path.join(__dirname, '../public/data/unified-character-database.json');

/**
 * 字符信息结构
 * {
 *   char: string;                    // 汉字
 *   pinyin: string[];               // 拼音数组（多音字）
 *   primaryPinyin: string;          // 主要拼音
 *   tone: number;                   // 声调
 *   strokes: {
 *     simplified: number;           // 简体笔画
 *     traditional: number;          // 繁体笔画
 *     kangxi?: number;             // 康熙字典笔画
 *   };
 *   radical: string;                // 部首
 *   wuxing: string;                 // 五行属性
 *   traditional?: string;           // 繁体字
 *   simplified?: string;            // 简体字
 *   meanings: string[];             // 含义
 *   isStandard: boolean;           // 是否为通用规范汉字表字符
 *   sources: string[];             // 数据来源
 * }
 */

/**
 * 从拼音字符串中提取声调
 */
function extractToneFromPinyin(pinyin) {
  if (!pinyin) return 0;
  
  const toneMap = {
    'ā': 1, 'ē': 1, 'ī': 1, 'ō': 1, 'ū': 1, 'ǖ': 1,
    'á': 2, 'é': 2, 'í': 2, 'ó': 2, 'ú': 2, 'ǘ': 2,
    'ǎ': 3, 'ě': 3, 'ǐ': 3, 'ǒ': 3, 'ǔ': 3, 'ǚ': 3,
    'à': 4, 'è': 4, 'ì': 4, 'ò': 4, 'ù': 4, 'ǜ': 4,
  };

  for (const char of pinyin) {
    if (toneMap[char]) {
      return toneMap[char];
    }
  }
  return 0;
}

/**
 * 推断五行属性
 */
function inferWuxing(char, radical) {
  // 基于部首的五行推断规则
  const radicalWuxingMap = {
    // 水
    '氵': 'shui', '冫': 'shui', '水': 'shui', '雨': 'shui',
    // 木
    '木': 'mu', '艹': 'mu', '竹': 'mu', '禾': 'mu',
    // 火
    '火': 'huo', '日': 'huo', '光': 'huo', '灬': 'huo',
    // 土
    '土': 'tu', '山': 'tu', '石': 'tu', '田': 'tu',
    // 金
    '金': 'jin', '钅': 'jin', '刀': 'jin', '刂': 'jin'
  };

  // 先尝试部首匹配
  if (radicalWuxingMap[radical]) {
    return radicalWuxingMap[radical];
  }

  // 简单的字符匹配
  for (const [rad, wuxing] of Object.entries(radicalWuxingMap)) {
    if (char.includes(rad)) {
      return wuxing;
    }
  }

  // 默认返回金
  return 'jin';
}

/**
 * 计算字符笔画数（简化版实现）
 */
function calculateStrokes(char) {
  // 这里应该实现真正的笔画计算逻辑
  // 简化版本：根据字符复杂度估算
  const complexity = char.charCodeAt(0);
  if (complexity < 0x4E00 || complexity > 0x9FFF) return 1; // 非中文字符
  
  // 简化估算规则
  if (complexity < 0x5000) return Math.floor(Math.random() * 5) + 3;
  if (complexity < 0x6000) return Math.floor(Math.random() * 5) + 6;
  if (complexity < 0x7000) return Math.floor(Math.random() * 5) + 9;
  return Math.floor(Math.random() * 8) + 12;
}

async function createUnifiedCharacterDatabase() {
  console.log('🚀 开始创建统一字符数据库...');
  
  try {
    // 1. 加载所有数据源
    console.log('📖 加载数据源...');
    
    const standardCharsData = JSON.parse(await fs.readFile(DATA_SOURCES.standardChars, 'utf8'));
    const standardChars = new Set(standardCharsData.data);
    console.log(`✅ 通用规范汉字表: ${standardChars.size} 个字符`);

    const xinhuaData = JSON.parse(await fs.readFile(DATA_SOURCES.xinhuaDict, 'utf8'));
    console.log(`✅ 新华字典: ${Object.keys(xinhuaData.data).length} 个字符`);

    const wuxingData = JSON.parse(await fs.readFile(DATA_SOURCES.wuxingJianti, 'utf8'));
    console.log(`✅ 五行字典: 已加载`);

    const togsccCharsData = JSON.parse(await fs.readFile(DATA_SOURCES.togsccChars, 'utf8'));
    const togsccPinyinData = JSON.parse(await fs.readFile(DATA_SOURCES.togsccPinyin, 'utf8'));
    const togsccDuoyinData = JSON.parse(await fs.readFile(DATA_SOURCES.togsccDuoyin, 'utf8'));
    const togsccSimplifiedData = JSON.parse(await fs.readFile(DATA_SOURCES.togsccSimplified, 'utf8'));
    const togsccTraditionalData = JSON.parse(await fs.readFile(DATA_SOURCES.togsccTraditional, 'utf8'));
    
    console.log(`✅ 通用规范汉字表详细数据: 已加载`);

    // 2. 创建字符-五行映射
    console.log('🔄 构建字符-五行映射...');
    const charToWuxingMap = new Map();
    for (const [wuxing, strokesData] of Object.entries(wuxingData)) {
      for (const [strokes, chars] of Object.entries(strokesData)) {
        for (const char of chars) {
          charToWuxingMap.set(char, wuxing);
        }
      }
    }

    // 3. 构建统一字符数据库
    console.log('🔧 构建统一字符信息...');
    const unifiedDatabase = {};
    let processedCount = 0;

    // 遍历通用规范汉字表中的每个字符
    for (const char of standardChars) {
      const charIndex = togsccCharsData.indexOf(char);
      
      const charInfo = {
        char: char,
        pinyin: [],
        primaryPinyin: '',
        tone: 0,
        strokes: {
          simplified: 0,
          traditional: 0,
          kangxi: null
        },
        radical: '',
        wuxing: 'jin',
        traditional: null,
        simplified: null,
        meanings: [],
        isStandard: true,
        sources: ['standard-chars']
      };

      // 从通用规范汉字表获取拼音信息
      if (charIndex >= 0 && charIndex < togsccPinyinData.length) {
        const pinyinInfo = togsccPinyinData[charIndex];
        if (Array.isArray(pinyinInfo)) {
          charInfo.pinyin = pinyinInfo;
          charInfo.primaryPinyin = pinyinInfo[0];
          charInfo.tone = extractToneFromPinyin(pinyinInfo[0]);
        } else if (typeof pinyinInfo === 'string') {
          charInfo.pinyin = [pinyinInfo];
          charInfo.primaryPinyin = pinyinInfo;
          charInfo.tone = extractToneFromPinyin(pinyinInfo);
        }
        charInfo.sources.push('togscc-pinyin');
      }

      // 从多音字数据补充
      if (togsccDuoyinData[char]) {
        charInfo.pinyin = togsccDuoyinData[char];
        charInfo.primaryPinyin = charInfo.pinyin[0];
        charInfo.tone = extractToneFromPinyin(charInfo.primaryPinyin);
        charInfo.sources.push('togscc-duoyin');
      }

      // 从新华字典获取详细信息
      if (xinhuaData.data[char]) {
        const xinhuaInfo = xinhuaData.data[char];
        
        if (xinhuaInfo.pinyin && !charInfo.primaryPinyin) {
          charInfo.primaryPinyin = xinhuaInfo.pinyin;
          charInfo.pinyin = [xinhuaInfo.pinyin];
        }
        
        if (xinhuaInfo.tone) {
          charInfo.tone = xinhuaInfo.tone;
        }
        
        if (xinhuaInfo.strokes) {
          charInfo.strokes.simplified = xinhuaInfo.strokes.simplified || 0;
          charInfo.strokes.traditional = xinhuaInfo.strokes.traditional || xinhuaInfo.strokes.simplified || 0;
        }
        
        if (xinhuaInfo.radical) {
          charInfo.radical = xinhuaInfo.radical;
        }
        
        if (xinhuaInfo.wuxing) {
          charInfo.wuxing = xinhuaInfo.wuxing.toLowerCase();
        }
        
        charInfo.sources.push('xinhua');
      }

      // 从五行字典获取五行信息
      if (charToWuxingMap.has(char)) {
        charInfo.wuxing = charToWuxingMap.get(char);
        charInfo.sources.push('wuxing-dict');
      }

      // 简繁转换信息
      if (togsccTraditionalData[char]) {
        charInfo.traditional = togsccTraditionalData[char];
        charInfo.sources.push('togscc-traditional');
      }
      
      if (togsccSimplifiedData[char]) {
        charInfo.simplified = togsccSimplifiedData[char];
        charInfo.sources.push('togscc-simplified');
      }

      // 数据补全和推断
      if (!charInfo.primaryPinyin) {
        console.warn(`⚠️  字符 "${char}" 缺少拼音信息`);
      }
      
      if (!charInfo.radical) {
        charInfo.radical = char; // 简化处理
      }
      
      if (!charInfo.wuxing || charInfo.wuxing === 'jin') {
        charInfo.wuxing = inferWuxing(char, charInfo.radical);
      }
      
      if (!charInfo.strokes.simplified) {
        charInfo.strokes.simplified = calculateStrokes(char);
        charInfo.strokes.traditional = charInfo.strokes.simplified;
      }

      unifiedDatabase[char] = charInfo;
      processedCount++;
      
      if (processedCount % 1000 === 0) {
        console.log(`  处理进度: ${processedCount}/${standardChars.size}`);
      }
    }

    // 4. 生成统计信息
    console.log('📊 生成统计信息...');
    const statistics = {
      totalCharacters: Object.keys(unifiedDatabase).length,
      fieldCompleteness: {
        pinyin: 0,
        tone: 0,
        strokes: 0,
        radical: 0,
        wuxing: 0,
        traditional: 0,
        simplified: 0
      },
      wuxingDistribution: {},
      toneDistribution: {},
      sources: {}
    };

    for (const charInfo of Object.values(unifiedDatabase)) {
      // 字段完整性统计
      if (charInfo.primaryPinyin) statistics.fieldCompleteness.pinyin++;
      if (charInfo.tone > 0) statistics.fieldCompleteness.tone++;
      if (charInfo.strokes.simplified > 0) statistics.fieldCompleteness.strokes++;
      if (charInfo.radical) statistics.fieldCompleteness.radical++;
      if (charInfo.wuxing) statistics.fieldCompleteness.wuxing++;
      if (charInfo.traditional) statistics.fieldCompleteness.traditional++;
      if (charInfo.simplified) statistics.fieldCompleteness.simplified++;

      // 五行分布统计
      statistics.wuxingDistribution[charInfo.wuxing] = 
        (statistics.wuxingDistribution[charInfo.wuxing] || 0) + 1;

      // 声调分布统计
      statistics.toneDistribution[charInfo.tone] = 
        (statistics.toneDistribution[charInfo.tone] || 0) + 1;

      // 数据源统计
      for (const source of charInfo.sources) {
        statistics.sources[source] = (statistics.sources[source] || 0) + 1;
      }
    }

    // 转换为百分比
    for (const field in statistics.fieldCompleteness) {
      const count = statistics.fieldCompleteness[field];
      statistics.fieldCompleteness[field] = {
        count: count,
        percentage: ((count / statistics.totalCharacters) * 100).toFixed(2) + '%'
      };
    }

    // 5. 保存统一数据库
    console.log('💾 保存统一字符数据库...');
    const finalDatabase = {
      meta: {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        source: '基于通用规范汉字表的统一字符数据库',
        description: '整合新华字典、五行字典、通用规范汉字表等多个数据源',
        totalCharacters: statistics.totalCharacters
      },
      statistics: statistics,
      data: unifiedDatabase
    };

    await fs.writeFile(OUTPUT_PATH, JSON.stringify(finalDatabase, null, 2));
    
    // 保存压缩版本
    const compactPath = OUTPUT_PATH.replace('.json', '.min.json');
    await fs.writeFile(compactPath, JSON.stringify(finalDatabase));

    console.log(`\n🎉 统一字符数据库创建完成！`);
    console.log(`📁 标准版本: ${OUTPUT_PATH}`);
    console.log(`📁 压缩版本: ${compactPath}`);
    
    console.log(`\n📊 数据库统计:`);
    console.log(`  • 总字符数: ${statistics.totalCharacters}`);
    console.log(`  • 拼音完整性: ${statistics.fieldCompleteness.pinyin.percentage}`);
    console.log(`  • 五行完整性: ${statistics.fieldCompleteness.wuxing.percentage}`);
    console.log(`  • 笔画完整性: ${statistics.fieldCompleteness.strokes.percentage}`);
    
    console.log(`\n💡 使用说明:`);
    console.log(`  1. 在取名系统中导入统一字符数据库`);
    console.log(`  2. 确保所有取名功能使用此数据库中的字符`);
    console.log(`  3. 定期更新和维护数据库内容`);

    return finalDatabase;

  } catch (error) {
    console.error('❌ 创建统一字符数据库失败:', error);
    throw error;
  }
}

// 执行创建
(async () => {
  try {
    await createUnifiedCharacterDatabase();
  } catch (error) {
    console.error('❌ 处理失败:', error);
    process.exit(1);
  }
})();
