/**
 * 数据预处理器 - 将原始数据文件转换为优化的JSON格式
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class DataPreprocessor {
  constructor() {
    this.dataDir = path.join(__dirname, '../public/data');
    this.processedDir = path.join(this.dataDir, 'processed');
    this.ensureProcessedDir();
  }

  ensureProcessedDir() {
    if (!fs.existsSync(this.processedDir)) {
      fs.mkdirSync(this.processedDir, { recursive: true });
      console.log('✓ 创建processed目录');
    }
  }

  // 计算文件校验和
  calculateChecksum(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  // 预处理xinhua字典
  async processXinhuaDict() {
    console.log('\n=== 预处理xinhua字典 ===');
    
    const inputFile = path.join(this.dataDir, 'xinhua.csv');
    const outputFile = path.join(this.processedDir, 'xinhua-processed.json');
    
    try {
      const content = fs.readFileSync(inputFile, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      console.log(`✓ 读取${lines.length}行数据`);
      
      const processed = {
        meta: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          source: 'xinhua.csv',
          totalRecords: 0,
          checksum: this.calculateChecksum(content)
        },
        data: {},
        indices: {
          byPinyin: {},
          byStrokes: {},
          byRadical: {}
        }
      };
      
      let validCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const columns = line.split(',');
        if (columns.length >= 4) {
          const char = columns[0].trim();
          const radical = columns[1].trim();
          const strokesStr = columns[2].trim();
          const pinyin = columns[3].trim();
          
          // 验证数据
          if (!char || char.length !== 1 || pinyin === 'error') {
            errorCount++;
            continue;
          }
          
          const strokes = parseInt(strokesStr) || 0;
          if (strokes <= 0 || strokes > 50) {
            errorCount++;
            continue;
          }
          
          // 提取声调
          const tone = this.extractTone(pinyin);
          
          // 推断五行
          const wuxing = this.inferWuxing(char);
          
          // 存储字符数据
          processed.data[char] = {
            char,
            pinyin,
            tone,
            strokes: {
              simplified: strokes,
              traditional: strokes // 暂时使用相同值
            },
            radical,
            wuxing,
            meanings: []
          };
          
          // 建立索引
          if (!processed.indices.byPinyin[pinyin]) {
            processed.indices.byPinyin[pinyin] = [];
          }
          processed.indices.byPinyin[pinyin].push(char);
          
          if (!processed.indices.byStrokes[strokes]) {
            processed.indices.byStrokes[strokes] = [];
          }
          processed.indices.byStrokes[strokes].push(char);
          
          if (!processed.indices.byRadical[radical]) {
            processed.indices.byRadical[radical] = [];
          }
          processed.indices.byRadical[radical].push(char);
          
          validCount++;
          
          // 特别记录"奉"字
          if (char === '奉') {
            console.log(`✓ 成功处理"奉"字: 笔画=${strokes}, 拼音=${pinyin}, 部首=${radical}`);
          }
        } else {
          errorCount++;
        }
      }
      
      processed.meta.totalRecords = validCount;
      
      // 保存处理后的数据
      fs.writeFileSync(outputFile, JSON.stringify(processed, null, 2), 'utf8');
      
      console.log(`✓ 处理完成: ${validCount}个有效记录, ${errorCount}个错误记录`);
      console.log(`✓ 保存到: ${outputFile}`);
      console.log(`✓ 文件大小: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
      
      return true;
    } catch (error) {
      console.error('✗ 处理xinhua字典失败:', error.message);
      return false;
    }
  }


  // 预处理拼音数据
  async processPinyinData() {
    console.log('\n=== 预处理拼音数据 ===');
    
    const inputFile = path.join(this.dataDir, 'gsc_pinyin.csv');
    const outputFile = path.join(this.processedDir, 'pinyin-processed.json');
    
    try {
      // 尝试多种编码方式读取文件
      let content;
      let encoding = 'utf8';
      
      try {
        content = fs.readFileSync(inputFile, 'utf8');
        console.log('✓ 使用UTF-8编码读取文件');
      } catch (err) {
        try {
          content = fs.readFileSync(inputFile, 'gbk');
          encoding = 'gbk';
          console.log('✓ 使用GBK编码读取文件');
        } catch (err2) {
          content = fs.readFileSync(inputFile, 'latin1');
          encoding = 'latin1';
          console.log('✓ 使用Latin1编码读取文件');
        }
      }
      
      const lines = content.split('\n').filter(line => line.trim());
      
      console.log(`✓ 读取${lines.length}行拼音数据 (编码: ${encoding})`);
      
      const processed = {
        meta: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          source: 'gsc_pinyin.csv',
          totalRecords: 0,
          encoding: encoding,
          checksum: this.calculateChecksum(content)
        },
        data: {}
      };
      
      let validCount = 0;
      let errorCount = 0;
      let headerSkipped = false;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        // 跳过标题行
        if (!headerSkipped && (trimmedLine.includes('num,word,pinyin') || trimmedLine.includes('num') && trimmedLine.includes('word'))) {
          headerSkipped = true;
          console.log('✓ 跳过标题行:', trimmedLine.substring(0, 50));
          continue;
        }
        
        const columns = trimmedLine.split(',');
        if (columns.length >= 3) {
          // CSV格式: num,word,pinyin,radical,stroke_count,wuxing,traditional,wubi
          const char = columns[1] ? columns[1].trim() : ''; // word字段
          const pinyin = columns[2] ? columns[2].trim().replace(/"/g, '') : ''; // pinyin字段，移除引号
          
          if (char && char.length === 1 && pinyin && pinyin !== 'error') {
            processed.data[char] = {
              char,
              pinyin,
              tone: this.extractTone(pinyin)
            };
            validCount++;
            
            // 调试：显示前几个处理的字符
            if (validCount <= 5) {
              console.log(`处理字符 ${validCount}: ${char} -> ${pinyin} (声调: ${this.extractTone(pinyin)})`);
            }
          } else {
            errorCount++;
            if (errorCount <= 3) {
              console.log(`跳过无效数据: char="${char}", pinyin="${pinyin}"`);
            }
          }
        } else {
          errorCount++;
        }
      }
      
      processed.meta.totalRecords = validCount;
      
      fs.writeFileSync(outputFile, JSON.stringify(processed, null, 2), 'utf8');
      
      console.log(`✓ 处理完成: ${validCount}个有效记录, ${errorCount}个错误记录`);
      console.log(`✓ 保存到: ${outputFile}`);
      
      return true;
    } catch (error) {
      console.error('✗ 处理拼音数据失败:', error.message);
      return false;
    }
  }

  // 预处理姓名语料库
  async processNameCorpus() {
    console.log('\n=== 预处理姓名语料库 ===');
    
    const inputFile = path.join(this.dataDir, 'Chinese_Names_Corpus_Gender.txt');
    const outputFile = path.join(this.processedDir, 'name-corpus-processed.json');
    
    try {
      const content = fs.readFileSync(inputFile, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      console.log(`✓ 读取${lines.length}行姓名数据`);
      
      const processed = {
        meta: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          source: 'Chinese_Names_Corpus_Gender.txt',
          totalRecords: 0,
          checksum: this.calculateChecksum(content)
        },
        data: {
          male: [],
          female: [],
          all: []
        },
        indices: {
          byGender: {
            male: new Set(),
            female: new Set()
          },
          commonChars: {
            male: {},
            female: {}
          }
        }
      };
      
      let validCount = 0;
      let errorCount = 0;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || !trimmedLine.includes(',')) continue;
        
        const [name, gender] = trimmedLine.split(',').map(s => s.trim());
        
        if (name && (gender === '男' || gender === '女')) {
          const entry = { name, gender };
          
          processed.data.all.push(entry);
          
          if (gender === '男') {
            processed.data.male.push(name);
            processed.indices.byGender.male.add(name);
            
            // 统计男性常用字（只统计名字部分，跳过姓氏）
            if (name.length >= 2) {
              for (let i = 1; i < name.length; i++) {
                const char = name[i];
                if (!processed.indices.commonChars.male[char]) {
                  processed.indices.commonChars.male[char] = 0;
                }
                processed.indices.commonChars.male[char]++;
              }
            }
          } else {
            processed.data.female.push(name);
            processed.indices.byGender.female.add(name);
            
            // 统计女性常用字（只统计名字部分，跳过姓氏）
            if (name.length >= 2) {
              for (let i = 1; i < name.length; i++) {
                const char = name[i];
                if (!processed.indices.commonChars.female[char]) {
                  processed.indices.commonChars.female[char] = 0;
                }
                processed.indices.commonChars.female[char]++;
              }
            }
          }
          
          validCount++;
        } else {
          errorCount++;
        }
      }
      
      // 转换Set为Array以便JSON序列化
      processed.indices.byGender.male = Array.from(processed.indices.byGender.male);
      processed.indices.byGender.female = Array.from(processed.indices.byGender.female);
      
      processed.meta.totalRecords = validCount;
      
      fs.writeFileSync(outputFile, JSON.stringify(processed, null, 2), 'utf8');
      
      console.log(`✓ 处理完成: ${validCount}个有效记录, ${errorCount}个错误记录`);
      console.log(`✓ 男性姓名: ${processed.data.male.length}个`);
      console.log(`✓ 女性姓名: ${processed.data.female.length}个`);
      console.log(`✓ 保存到: ${outputFile}`);
      
      return true;
    } catch (error) {
      console.error('✗ 处理姓名语料库失败:', error.message);
      return false;
    }
  }

  // 辅助方法：提取声调
  extractTone(pinyin) {
    const toneMarks = {
      'ā': 1, 'á': 2, 'ǎ': 3, 'à': 4,
      'ē': 1, 'é': 2, 'ě': 3, 'è': 4,
      'ī': 1, 'í': 2, 'ǐ': 3, 'ì': 4,
      'ō': 1, 'ó': 2, 'ǒ': 3, 'ò': 4,
      'ū': 1, 'ú': 2, 'ǔ': 3, 'ù': 4,
      'ǖ': 1, 'ǘ': 2, 'ǚ': 3, 'ǜ': 4
    };
    
    for (const char of pinyin) {
      if (toneMarks[char]) {
        return toneMarks[char];
      }
    }
    
    return 0; // 轻声
  }

  // 辅助方法：推断五行
  inferWuxing(char) {
    // 简化的五行推断规则
    const wuxingMap = {
      '木': ['木', '林', '森', '杨', '柳', '桃', '梅'],
      '火': ['火', '炎', '焱', '光', '明', '亮', '晴'],
      '土': ['土', '地', '山', '石', '岩', '峰', '岭'],
      '金': ['金', '银', '铁', '钢', '刀', '剑', '钱'],
      '水': ['水', '江', '河', '海', '湖', '泉', '雨']
    };
    
    for (const [element, chars] of Object.entries(wuxingMap)) {
      if (chars.includes(char)) {
        return element;
      }
    }
    
    return '土'; // 默认五行
  }

  // 运行所有预处理任务
  async processAll() {
    console.log('🚀 开始数据预处理...\n');
    
    const startTime = Date.now();
    const tasks = [
      { name: 'xinhua字典', func: () => this.processXinhuaDict() },
      { name: '拼音数据', func: () => this.processPinyinData() },
      { name: '姓名语料库', func: () => this.processNameCorpus() }
    ];
    
    let successCount = 0;
    let failCount = 0;
    
    for (const task of tasks) {
      try {
        const success = await task.func();
        if (success) {
          console.log(`✅ ${task.name} 预处理成功`);
          successCount++;
        } else {
          console.log(`❌ ${task.name} 预处理失败`);
          failCount++;
        }
      } catch (error) {
        console.error(`❌ ${task.name} 预处理出错:`, error.message);
        failCount++;
      }
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`\n🎉 预处理完成！`);
    console.log(`✅ 成功: ${successCount}个任务`);
    console.log(`❌ 失败: ${failCount}个任务`);
    console.log(`⏱️ 总耗时: ${duration}秒`);
    
    // 列出生成的文件
    console.log('\n📁 生成的文件:');
    const processedFiles = fs.readdirSync(this.processedDir);
    processedFiles.forEach(file => {
      const filePath = path.join(this.processedDir, file);
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024).toFixed(2);
      console.log(`  - ${file} (${size} KB)`);
    });
  }
}

// 运行预处理器
if (require.main === module) {
  const processor = new DataPreprocessor();
  processor.processAll().catch(console.error);
}

module.exports = DataPreprocessor;