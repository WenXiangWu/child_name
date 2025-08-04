const fs = require('fs');
const path = require('path');

class CommonCharsGenerator {
  constructor() {
    this.projectRoot = path.dirname(__dirname);
    this.dataDir = path.join(this.projectRoot, 'public', 'data');
    this.processedDir = path.join(this.dataDir, 'processed');
    
    // 确保目录存在
    if (!fs.existsSync(this.processedDir)) {
      fs.mkdirSync(this.processedDir, { recursive: true });
    }
  }

  // 从现有的 name-corpus-processed.json 提取常用字
  async generateFromProcessedData() {
    console.log('=== 从预处理数据生成常用字文件 ===');
    
    const inputFile = path.join(this.processedDir, 'name-corpus-processed.json');
    
    if (!fs.existsSync(inputFile)) {
      console.error('✗ 未找到预处理数据文件:', inputFile);
      console.log('请先运行 data-preprocessor.js 生成预处理数据');
      return false;
    }

    try {
      console.log('✓ 读取预处理数据...');
      const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
      
      if (!data.indices || !data.indices.commonChars) {
        console.error('✗ 预处理数据中没有找到 commonChars 索引');
        return false;
      }

      const { male: maleData, female: femaleData } = data.indices.commonChars;
      
      // 处理男性常用字
      const maleChars = Object.entries(maleData)
        .filter(([char, count]) => count >= 2) // 过滤出现次数少的字符
        .sort(([,a], [,b]) => b - a) // 按频率降序排列
        .map(([char, count]) => ({ char, count }));
      
      const maleOutput = {
        meta: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          description: '男性取名常用字，按使用频率排序',
          totalChars: maleChars.length,
          minFrequency: 2,
          source: 'name-corpus-processed.json'
        },
        data: maleChars
      };
      
      // 处理女性常用字
      const femaleChars = Object.entries(femaleData)
        .filter(([char, count]) => count >= 2) // 过滤出现次数少的字符
        .sort(([,a], [,b]) => b - a) // 按频率降序排列
        .map(([char, count]) => ({ char, count }));
      
      const femaleOutput = {
        meta: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          description: '女性取名常用字，按使用频率排序',
          totalChars: femaleChars.length,
          minFrequency: 2,
          source: 'name-corpus-processed.json'
        },
        data: femaleChars
      };
      
      // 保存文件
      const maleFile = path.join(this.processedDir, 'common-chars-male.json');
      const femaleFile = path.join(this.processedDir, 'common-chars-female.json');
      
      fs.writeFileSync(maleFile, JSON.stringify(maleOutput, null, 2), 'utf8');
      fs.writeFileSync(femaleFile, JSON.stringify(femaleOutput, null, 2), 'utf8');
      
      console.log(`✅ 男性常用字: ${maleChars.length}个字符 -> ${path.relative(this.projectRoot, maleFile)}`);
      console.log(`✅ 女性常用字: ${femaleChars.length}个字符 -> ${path.relative(this.projectRoot, femaleFile)}`);
      
      // 显示频率最高的前10个字符
      console.log(`✅ 男性高频字符前10: ${maleChars.slice(0, 10).map(item => `${item.char}(${item.count})`).join(', ')}`);
      console.log(`✅ 女性高频字符前10: ${femaleChars.slice(0, 10).map(item => `${item.char}(${item.count})`).join(', ')}`);
      
      // 文件大小
      const maleSize = (fs.statSync(maleFile).size / 1024).toFixed(2);
      const femaleSize = (fs.statSync(femaleFile).size / 1024).toFixed(2);
      console.log(`✅ 文件大小: 男性 ${maleSize}KB, 女性 ${femaleSize}KB`);
      
      return true;
    } catch (error) {
      console.error('✗ 生成常用字文件失败:', error.message);
      return false;
    }
  }

  // 直接从原始数据生成常用字（更准确的统计）
  async generateFromRawData() {
    console.log('=== 从原始数据重新生成常用字文件 ===');
    
    const inputFile = path.join(this.dataDir, 'Chinese_Names_Corpus_Gender.txt');
    
    if (!fs.existsSync(inputFile)) {
      console.error('✗ 未找到原始数据文件:', inputFile);
      return false;
    }

    try {
      console.log('✓ 读取原始姓名数据...');
      const content = fs.readFileSync(inputFile, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      console.log(`✓ 共读取 ${lines.length} 行数据`);
      
      const maleChars = {};
      const femaleChars = {};
      let maleNameCount = 0;
      let femaleNameCount = 0;
      let processedCount = 0;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || !trimmedLine.includes(',')) continue;
        
        const [name, gender] = trimmedLine.split(',').map(s => s.trim());
        
        if (name && name.length >= 2 && (gender === '男' || gender === '女')) {
          // 只统计名字部分（跳过姓氏，即第一个字符）
          for (let i = 1; i < name.length; i++) {
            const char = name[i];
            
            if (gender === '男') {
              if (!maleChars[char]) {
                maleChars[char] = 0;
              }
              maleChars[char]++;
            } else {
              if (!femaleChars[char]) {
                femaleChars[char] = 0;
              }
              femaleChars[char]++;
            }
          }
          
          if (gender === '男') {
            maleNameCount++;
          } else {
            femaleNameCount++;
          }
          
          processedCount++;
        }
      }
      
      console.log(`✓ 处理完成: 男性姓名 ${maleNameCount} 个，女性姓名 ${femaleNameCount} 个`);
      
      // 处理男性常用字
      const maleCharsList = Object.entries(maleChars)
        .filter(([char, count]) => count >= 3) // 提高频率阈值
        .sort(([,a], [,b]) => b - a)
        .map(([char, count]) => ({ char, count }));
      
      const maleOutput = {
        meta: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          description: '男性取名常用字，按使用频率排序',
          totalChars: maleCharsList.length,
          minFrequency: 3,
          sourceNames: maleNameCount,
          source: 'Chinese_Names_Corpus_Gender.txt'
        },
        data: maleCharsList
      };
      
      // 处理女性常用字
      const femaleCharsList = Object.entries(femaleChars)
        .filter(([char, count]) => count >= 3) // 提高频率阈值
        .sort(([,a], [,b]) => b - a)
        .map(([char, count]) => ({ char, count }));
      
      const femaleOutput = {
        meta: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          description: '女性取名常用字，按使用频率排序',
          totalChars: femaleCharsList.length,
          minFrequency: 3,
          sourceNames: femaleNameCount,
          source: 'Chinese_Names_Corpus_Gender.txt'
        },
        data: femaleCharsList
      };
      
      // 保存文件
      const maleFile = path.join(this.processedDir, 'common-chars-male.json');
      const femaleFile = path.join(this.processedDir, 'common-chars-female.json');
      
      fs.writeFileSync(maleFile, JSON.stringify(maleOutput, null, 2), 'utf8');
      fs.writeFileSync(femaleFile, JSON.stringify(femaleOutput, null, 2), 'utf8');
      
      console.log(`✅ 男性常用字: ${maleCharsList.length}个字符 -> ${path.relative(this.projectRoot, maleFile)}`);
      console.log(`✅ 女性常用字: ${femaleCharsList.length}个字符 -> ${path.relative(this.projectRoot, femaleFile)}`);
      
      // 显示频率最高的前15个字符
      console.log(`✅ 男性高频字符前15: ${maleCharsList.slice(0, 15).map(item => `${item.char}(${item.count})`).join(', ')}`);
      console.log(`✅ 女性高频字符前15: ${femaleCharsList.slice(0, 15).map(item => `${item.char}(${item.count})`).join(', ')}`);
      
      // 文件大小
      const maleSize = (fs.statSync(maleFile).size / 1024).toFixed(2);
      const femaleSize = (fs.statSync(femaleFile).size / 1024).toFixed(2);
      console.log(`✅ 文件大小: 男性 ${maleSize}KB, 女性 ${femaleSize}KB`);
      
      return true;
    } catch (error) {
      console.error('✗ 生成常用字文件失败:', error.message);
      return false;
    }
  }
}

// 主执行函数
async function main() {
  const generator = new CommonCharsGenerator();
  
  console.log('开始生成常用字文件...\n');
  
  // 使用原始数据重新生成（更准确）
  const success = await generator.generateFromRawData();
  
  if (success) {
    console.log('\n🎉 常用字文件生成完成！');
  } else {
    console.log('\n❌ 常用字文件生成失败！');
    process.exit(1);
  }
}

// 如果直接运行这个脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = CommonCharsGenerator;