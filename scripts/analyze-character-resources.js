/**
 * 字符资源分析脚本
 * 分析各个数据源中的字符覆盖情况和数据完整性
 */

const fs = require('fs').promises;
const path = require('path');

// 数据源路径配置
const DATA_SOURCES = {
  standardChars: path.join(__dirname, '../public/data/standard-characters.json'),
  xinhuaDict: path.join(__dirname, '../public/data/processed/xinhua-processed.json'),
  wuxingJianti: path.join(__dirname, '../public/data/wuxing_dict_jianti.json'),
  wuxingFanti: path.join(__dirname, '../public/data/wuxing_dict_fanti.json'),
  pinyinProcessed: path.join(__dirname, '../public/data/processed/pinyin-processed.json'),
  togsccChars: path.join(__dirname, '../../table-of-general-standard-chinese-characters/data/characters.csv'),
  togsccPinyin: path.join(__dirname, '../../table-of-general-standard-chinese-characters/data/pinyin.json'),
  togsccDuoyin: path.join(__dirname, '../../table-of-general-standard-chinese-characters/data/pinyin.duo.json'),
  togsccSimplified: path.join(__dirname, '../../table-of-general-standard-chinese-characters/data/simplified.convert.json'),
  togsccTraditional: path.join(__dirname, '../../table-of-general-standard-chinese-characters/data/traditional.convert.json')
};

async function analyzeCharacterResources() {
  console.log('🔍 开始分析字符资源...');
  
  const analysis = {
    standardChars: new Set(),
    dataSources: {},
    coverage: {},
    conflicts: [],
    statistics: {}
  };

  try {
    // 1. 加载通用规范汉字表作为基准
    console.log('📖 加载通用规范汉字表...');
    const standardCharsData = JSON.parse(await fs.readFile(DATA_SOURCES.standardChars, 'utf8'));
    analysis.standardChars = new Set(standardCharsData.data);
    
    console.log(`✅ 通用规范汉字表: ${analysis.standardChars.size} 个字符`);

    // 2. 分析新华字典覆盖情况
    console.log('📖 分析新华字典覆盖情况...');
    const xinhuaData = JSON.parse(await fs.readFile(DATA_SOURCES.xinhuaDict, 'utf8'));
    const xinhuaChars = new Set(Object.keys(xinhuaData.data));
    
    analysis.dataSources.xinhua = {
      totalChars: xinhuaChars.size,
      standardCoverage: 0,
      nonStandardChars: [],
      missingStandardChars: []
    };

    // 分析覆盖情况
    let xinhuaStandardCount = 0;
    for (const char of analysis.standardChars) {
      if (xinhuaChars.has(char)) {
        xinhuaStandardCount++;
      } else {
        analysis.dataSources.xinhua.missingStandardChars.push(char);
      }
    }
    
    for (const char of xinhuaChars) {
      if (!analysis.standardChars.has(char)) {
        analysis.dataSources.xinhua.nonStandardChars.push(char);
      }
    }
    
    analysis.dataSources.xinhua.standardCoverage = 
      (xinhuaStandardCount / analysis.standardChars.size * 100).toFixed(2);

    console.log(`  • 新华字典总字符: ${xinhuaChars.size}`);
    console.log(`  • 标准字符覆盖: ${xinhuaStandardCount}/${analysis.standardChars.size} (${analysis.dataSources.xinhua.standardCoverage}%)`);
    console.log(`  • 缺失标准字符: ${analysis.dataSources.xinhua.missingStandardChars.length} 个`);
    console.log(`  • 非标准字符: ${analysis.dataSources.xinhua.nonStandardChars.length} 个`);

    // 3. 分析五行字典覆盖情况
    console.log('📖 分析五行字典覆盖情况...');
    const wuxingJiantiData = JSON.parse(await fs.readFile(DATA_SOURCES.wuxingJianti, 'utf8'));
    const wuxingChars = new Set();
    
    // 收集五行字典中的所有字符
    for (const wuxing of Object.keys(wuxingJiantiData)) {
      for (const strokes of Object.keys(wuxingJiantiData[wuxing])) {
        for (const char of wuxingJiantiData[wuxing][strokes]) {
          wuxingChars.add(char);
        }
      }
    }

    analysis.dataSources.wuxing = {
      totalChars: wuxingChars.size,
      standardCoverage: 0,
      nonStandardChars: [],
      missingStandardChars: []
    };

    let wuxingStandardCount = 0;
    for (const char of analysis.standardChars) {
      if (wuxingChars.has(char)) {
        wuxingStandardCount++;
      } else {
        analysis.dataSources.wuxing.missingStandardChars.push(char);
      }
    }
    
    for (const char of wuxingChars) {
      if (!analysis.standardChars.has(char)) {
        analysis.dataSources.wuxing.nonStandardChars.push(char);
      }
    }
    
    analysis.dataSources.wuxing.standardCoverage = 
      (wuxingStandardCount / analysis.standardChars.size * 100).toFixed(2);

    console.log(`  • 五行字典总字符: ${wuxingChars.size}`);
    console.log(`  • 标准字符覆盖: ${wuxingStandardCount}/${analysis.standardChars.size} (${analysis.dataSources.wuxing.standardCoverage}%)`);
    console.log(`  • 缺失标准字符: ${analysis.dataSources.wuxing.missingStandardChars.length} 个`);
    console.log(`  • 非标准字符: ${analysis.dataSources.wuxing.nonStandardChars.length} 个`);

    // 4. 分析数据字段完整性
    console.log('📊 分析数据字段完整性...');
    const fieldCompleteness = {
      pinyin: 0,
      tone: 0,
      strokes: 0,
      radical: 0,
      wuxing: 0,
      meanings: 0,
      traditional: 0
    };

    let sampleCount = 0;
    for (const char of Array.from(analysis.standardChars).slice(0, 100)) {
      const xinhuaInfo = xinhuaData.data[char];
      if (xinhuaInfo) {
        sampleCount++;
        if (xinhuaInfo.pinyin) fieldCompleteness.pinyin++;
        if (xinhuaInfo.tone) fieldCompleteness.tone++;
        if (xinhuaInfo.strokes) fieldCompleteness.strokes++;
        if (xinhuaInfo.radical) fieldCompleteness.radical++;
        if (xinhuaInfo.wuxing) fieldCompleteness.wuxing++;
        if (xinhuaInfo.meanings && xinhuaInfo.meanings.length > 0) fieldCompleteness.meanings++;
      }
    }

    analysis.statistics.fieldCompleteness = {};
    for (const field of Object.keys(fieldCompleteness)) {
      analysis.statistics.fieldCompleteness[field] = 
        sampleCount > 0 ? (fieldCompleteness[field] / sampleCount * 100).toFixed(2) + '%' : '0%';
    }

    console.log('📊 字段完整性分析 (基于前100个标准字符):');
    for (const [field, percentage] of Object.entries(analysis.statistics.fieldCompleteness)) {
      console.log(`  • ${field}: ${percentage}`);
    }

    // 5. 生成分析报告
    const reportPath = path.join(__dirname, '../analysis-report.json');
    await fs.writeFile(reportPath, JSON.stringify(analysis, null, 2));
    
    console.log(`\n📄 分析报告已生成: ${reportPath}`);
    
    // 6. 输出关键建议
    console.log('\n💡 整合建议:');
    console.log('1. 新华字典覆盖率较高，可作为主要数据源');
    console.log('2. 五行字典需要补充缺失的标准字符');
    console.log('3. 需要为缺失字符寻找替代数据源或制定默认值策略');
    console.log('4. 建议优先整合拼音、五行、笔画等核心取名要素');

    return analysis;

  } catch (error) {
    console.error('❌ 分析过程失败:', error);
    throw error;
  }
}

// 执行分析
(async () => {
  try {
    await analyzeCharacterResources();
  } catch (error) {
    console.error('❌ 字符资源分析失败:', error);
    process.exit(1);
  }
})();
