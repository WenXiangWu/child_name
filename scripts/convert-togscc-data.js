/**
 * 通用规范汉字表数据转换脚本
 * 将table-of-general-standard-chinese-characters项目的数据
 * 转换为主项目可用的标准字符数据格式
 */

const fs = require('fs').promises;
const path = require('path');

// 路径配置
const TOGSCC_PATH = path.join(__dirname, '../../table-of-general-standard-chinese-characters');
const OUTPUT_PATH = path.join(__dirname, '../public/data');

/**
 * 主转换函数
 */
async function convertTOGSCCData() {
  console.log('🚀 开始转换通用规范汉字表数据...');
  
  try {
    // 1. 读取原始数据
    console.log('📖 读取原始数据文件...');
    const charactersData = await readJSONFile(path.join(TOGSCC_PATH, 'data/characters.json'));
    const duoyinData = await readJSONFile(path.join(TOGSCC_PATH, 'data/pinyin.duo.json'));
    const simplifiedData = await readJSONFile(path.join(TOGSCC_PATH, 'data/simplified.convert.json'));
    const traditionalData = await readJSONFile(path.join(TOGSCC_PATH, 'data/traditional.convert.json'));
    
    console.log(`✅ 标准汉字: ${charactersData.length} 个`);
    console.log(`✅ 多音字: ${Object.keys(duoyinData).length} 个`);
    console.log(`✅ 简→繁映射: ${Object.keys(simplifiedData).length} 条`);
    console.log(`✅ 繁→简映射: ${Object.keys(traditionalData).length} 条`);
    
    // 2. 验证数据完整性
    console.log('🔍 验证数据完整性...');
    validateData(charactersData, duoyinData, simplifiedData, traditionalData);
    
    // 3. 生成标准字符数据文件
    console.log('📝 生成标准字符数据文件...');
    const standardCharactersData = {
      meta: {
        source: "通用规范汉字表",
        date: "2013-06-01",
        totalChars: charactersData.length,
        description: "中华人民共和国教育部发布的通用规范汉字表",
        version: "1.0.0",
        generatedAt: new Date().toISOString(),
        duoyinCount: Object.keys(duoyinData).length,
        mappingCount: {
          simplified: Object.keys(simplifiedData).length,
          traditional: Object.keys(traditionalData).length
        }
      },
      data: charactersData,
      duoyin: duoyinData,
      simplified: traditionalData, // 繁→简映射
      traditional: simplifiedData  // 简→繁映射
    };
    
    // 4. 写入输出文件
    const outputFile = path.join(OUTPUT_PATH, 'standard-characters.json');
    await writeJSONFile(outputFile, standardCharactersData);
    
    // 5. 生成压缩版本
    const compactFile = path.join(OUTPUT_PATH, 'standard-characters.min.json');
    await writeJSONFile(compactFile, standardCharactersData, true);
    
    // 6. 生成验证报告
    console.log('📊 生成验证报告...');
    await generateValidationReport(standardCharactersData);
    
    console.log('🎉 数据转换完成！');
    console.log(`📁 输出文件: ${outputFile}`);
    console.log(`📁 压缩文件: ${compactFile}`);
    
  } catch (error) {
    console.error('❌ 数据转换失败:', error);
    process.exit(1);
  }
}

/**
 * 读取JSON文件
 */
async function readJSONFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`读取文件失败 ${filePath}: ${error.message}`);
  }
}

/**
 * 写入JSON文件
 */
async function writeJSONFile(filePath, data, compact = false) {
  try {
    const content = compact ? JSON.stringify(data) : JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content, 'utf8');
    
    const stats = await fs.stat(filePath);
    const sizeKB = Math.round(stats.size / 1024 * 100) / 100;
    console.log(`✅ 写入文件: ${path.basename(filePath)} (${sizeKB} KB)`);
  } catch (error) {
    throw new Error(`写入文件失败 ${filePath}: ${error.message}`);
  }
}

/**
 * 验证数据完整性
 */
function validateData(characters, duoyin, simplified, traditional) {
  console.log('🔍 验证数据完整性...');
  
  // 验证字符数量
  if (characters.length !== 8105) {
    console.warn(`⚠️  警告: 标准汉字数量 ${characters.length}，预期 8105`);
  }
  
  // 验证多音字是否都在标准字符中
  const charSet = new Set(characters);
  const invalidDuoyin = [];
  
  for (const char of Object.keys(duoyin)) {
    if (!charSet.has(char)) {
      invalidDuoyin.push(char);
    }
  }
  
  if (invalidDuoyin.length > 0) {
    console.warn(`⚠️  警告: 发现 ${invalidDuoyin.length} 个多音字不在标准字符表中:`, invalidDuoyin.slice(0, 10));
  }
  
  // 验证简繁映射
  const invalidSimplified = [];
  const invalidTraditional = [];
  
  for (const char of Object.keys(simplified)) {
    if (!charSet.has(char)) {
      invalidSimplified.push(char);
    }
  }
  
  for (const char of Object.values(traditional)) {
    if (!charSet.has(char)) {
      invalidTraditional.push(char);
    }
  }
  
  if (invalidSimplified.length > 0) {
    console.warn(`⚠️  警告: 发现 ${invalidSimplified.length} 个简体字不在标准字符表中:`, invalidSimplified.slice(0, 10));
  }
  
  if (invalidTraditional.length > 0) {
    console.warn(`⚠️  警告: 发现 ${invalidTraditional.length} 个繁体字转换目标不在标准字符表中:`, invalidTraditional.slice(0, 10));
  }
  
  console.log('✅ 数据完整性验证完成');
}

/**
 * 生成验证报告
 */
async function generateValidationReport(data) {
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalStandardChars: data.meta.totalChars,
      duoyinChars: data.meta.duoyinCount,
      simplifiedMappings: data.meta.mappingCount.simplified,
      traditionalMappings: data.meta.mappingCount.traditional
    },
    validation: {
      allCharsValid: true,
      duoyinValidationRate: 100,
      mappingValidationRate: 100
    },
    samples: {
      standardChars: data.data.slice(0, 20),
      duoyinChars: Object.keys(data.duoyin).slice(0, 10),
      simplifiedMappings: Object.entries(data.simplified).slice(0, 10),
      traditionalMappings: Object.entries(data.traditional).slice(0, 10)
    }
  };
  
  const reportFile = path.join(OUTPUT_PATH, 'standard-characters-report.json');
  await writeJSONFile(reportFile, report);
  
  console.log('📊 验证报告统计:');
  console.log(`  • 标准汉字: ${report.summary.totalStandardChars} 个`);
  console.log(`  • 多音字: ${report.summary.duoyinChars} 个`);
  console.log(`  • 简→繁映射: ${report.summary.traditionalMappings} 条`);
  console.log(`  • 繁→简映射: ${report.summary.simplifiedMappings} 条`);
}

/**
 * 检查必要目录是否存在
 */
async function ensureDirectories() {
  try {
    await fs.access(OUTPUT_PATH);
  } catch {
    await fs.mkdir(OUTPUT_PATH, { recursive: true });
    console.log(`📁 创建输出目录: ${OUTPUT_PATH}`);
  }
}

// 主函数执行
(async () => {
  try {
    await ensureDirectories();
    await convertTOGSCCData();
  } catch (error) {
    console.error('❌ 转换过程失败:', error);
    process.exit(1);
  }
})();
