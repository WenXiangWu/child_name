const fs = require('fs');
const path = require('path');

// 配置源数据路径和目标路径
const SOURCE_PATH = '../chinese-poetry';
const TARGET_PATH = './public/data/chinese-poetry';

// 数据映射配置
const DATA_CONFIG = [
  {
    category: 'shijing',
    name: '诗经',
    sourcePath: '诗经/shijing.json',
    targetFile: 'shijing.json',
    type: 'shijing'
  },
  {
    category: 'tangshi',
    name: '唐诗',
    sourcePath: '全唐诗',
    targetFile: 'tangshi.json',
    type: 'tangshi',
    limit: 10000 // 限制数量避免文件过大
  },
  {
    category: 'songci',
    name: '宋词',
    sourcePath: '宋词',
    targetFile: 'songci.json',
    type: 'songci',
    limit: 8000
  },
  {
    category: 'chuci',
    name: '楚辞',
    sourcePath: '楚辞',
    targetFile: 'chuci.json',
    type: 'chuci'
  },
  {
    category: 'lunyu',
    name: '论语',
    sourcePath: '论语',
    targetFile: 'lunyu.json',
    type: 'lunyu'
  }
];

// 工具函数：生成唯一ID
function generateId(category, index) {
  return `${category}-${index.toString().padStart(6, '0')}`;
}

// 工具函数：清理和格式化内容
function cleanContent(content) {
  if (typeof content === 'string') {
    return content.replace(/[""]/g, '"').replace(/['']/g, "'").trim();
  }
  return content;
}

// 工具函数：计算统计信息
function calculateStats(contentArray) {
  const content = contentArray.join('');
  return {
    characterCount: content.length,
    lineCount: contentArray.length
  };
}

// 处理诗经数据
function processShijing(sourceFile) {
  console.log(`处理诗经数据: ${sourceFile}`);
  const data = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  
  return data.map((item, index) => {
    const contentArray = Array.isArray(item.content) ? item.content : [item.content || ''];
    const stats = calculateStats(contentArray);
    
    return {
      id: generateId('shijing', index),
      title: cleanContent(item.title || '未命名'),
      author: null, // 诗经作者不详
      dynasty: '先秦',
      content: contentArray.join(''),
      contentArray: contentArray.map(cleanContent),
      category: 'shijing',
      chapter: cleanContent(item.chapter),
      section: cleanContent(item.section),
      ...stats
    };
  });
}

// 处理唐诗数据
function processTangshi(sourceDir, limit) {
  console.log(`处理唐诗数据: ${sourceDir}`);
  const files = fs.readdirSync(sourceDir).filter(f => f.startsWith('poet.tang.') && f.endsWith('.json'));
  let allPoems = [];
  
  for (const file of files) {
    if (allPoems.length >= limit) break;
    
    try {
      const filePath = path.join(sourceDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      const poems = data.map((item, fileIndex) => {
        const contentArray = Array.isArray(item.paragraphs) ? item.paragraphs : [item.paragraphs || ''];
        const stats = calculateStats(contentArray);
        
        return {
          id: generateId('tangshi', allPoems.length + fileIndex),
          title: cleanContent(item.title || '无题'),
          author: cleanContent(item.author),
          dynasty: '唐代',
          content: contentArray.join(''),
          contentArray: contentArray.map(cleanContent),
          category: 'tangshi',
          ...stats
        };
      });
      
      allPoems = allPoems.concat(poems);
      console.log(`已加载 ${file}: ${poems.length} 首诗，总计: ${allPoems.length}`);
      
    } catch (error) {
      console.warn(`跳过文件 ${file}: ${error.message}`);
    }
  }
  
  return allPoems.slice(0, limit);
}

// 处理宋词数据
function processSongci(sourceDir, limit) {
  console.log(`处理宋词数据: ${sourceDir}`);
  const files = fs.readdirSync(sourceDir).filter(f => f.startsWith('ci.song.') && f.endsWith('.json'));
  let allCi = [];
  
  for (const file of files) {
    if (allCi.length >= limit) break;
    
    try {
      const filePath = path.join(sourceDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      const ci = data.map((item, fileIndex) => {
        const contentArray = Array.isArray(item.paragraphs) ? item.paragraphs : [item.paragraphs || ''];
        const stats = calculateStats(contentArray);
        
        return {
          id: generateId('songci', allCi.length + fileIndex),
          title: cleanContent(item.title || item.rhythmic || '无题'),
          author: cleanContent(item.author),
          dynasty: '宋代',
          content: contentArray.join(''),
          contentArray: contentArray.map(cleanContent),
          category: 'songci',
          rhythmic: cleanContent(item.rhythmic), // 词牌名
          ...stats
        };
      });
      
      allCi = allCi.concat(ci);
      console.log(`已加载 ${file}: ${ci.length} 首词，总计: ${allCi.length}`);
      
    } catch (error) {
      console.warn(`跳过文件 ${file}: ${error.message}`);
    }
  }
  
  return allCi.slice(0, limit);
}

// 通用处理函数
function processGeneric(sourceDir, category, dynasty) {
  console.log(`处理${category}数据: ${sourceDir}`);
  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json'));
  let allItems = [];
  
  for (const file of files) {
    try {
      const filePath = path.join(sourceDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      const items = (Array.isArray(data) ? data : [data]).map((item, fileIndex) => {
        let contentArray = [];
        
        if (item.content) {
          contentArray = Array.isArray(item.content) ? item.content : [item.content];
        } else if (item.paragraphs) {
          contentArray = Array.isArray(item.paragraphs) ? item.paragraphs : [item.paragraphs];
        } else {
          contentArray = [''];
        }
        
        const stats = calculateStats(contentArray);
        
        return {
          id: generateId(category, allItems.length + fileIndex),
          title: cleanContent(item.title || '未命名'),
          author: cleanContent(item.author),
          dynasty: dynasty,
          content: contentArray.join(''),
          contentArray: contentArray.map(cleanContent),
          category: category,
          ...stats
        };
      });
      
      allItems = allItems.concat(items);
      console.log(`已加载 ${file}: ${items.length} 项，总计: ${allItems.length}`);
      
    } catch (error) {
      console.warn(`跳过文件 ${file}: ${error.message}`);
    }
  }
  
  return allItems;
}

// 主处理函数
async function migratePoetryData() {
  console.log('开始迁移诗词数据...\n');
  
  // 确保目标目录存在
  if (!fs.existsSync(TARGET_PATH)) {
    fs.mkdirSync(TARGET_PATH, { recursive: true });
  }
  
  for (const config of DATA_CONFIG) {
    try {
      const sourcePath = path.join(SOURCE_PATH, config.sourcePath);
      
      if (!fs.existsSync(sourcePath)) {
        console.warn(`源路径不存在，跳过: ${sourcePath}`);
        continue;
      }
      
      let processedData = [];
      
      switch (config.type) {
        case 'shijing':
          processedData = processShijing(sourcePath);
          break;
        case 'tangshi':
          processedData = processTangshi(sourcePath, config.limit);
          break;
        case 'songci':
          processedData = processSongci(sourcePath, config.limit);
          break;
        case 'chuci':
          processedData = processGeneric(sourcePath, 'chuci', '战国');
          break;
        case 'lunyu':
          processedData = processGeneric(sourcePath, 'lunyu', '春秋');
          break;
        default:
          console.warn(`未知的数据类型: ${config.type}`);
          continue;
      }
      
      // 写入目标文件
      const targetFile = path.join(TARGET_PATH, config.targetFile);
      fs.writeFileSync(targetFile, JSON.stringify(processedData, null, 2), 'utf8');
      
      console.log(`✅ ${config.name}: ${processedData.length} 条数据已保存到 ${config.targetFile}\n`);
      
    } catch (error) {
      console.error(`❌ 处理 ${config.name} 时出错:`, error.message);
    }
  }
  
  console.log('诗词数据迁移完成！');
}

// 运行迁移
if (require.main === module) {
  migratePoetryData().catch(console.error);
}

module.exports = { migratePoetryData };