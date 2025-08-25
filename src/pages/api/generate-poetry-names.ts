import { NextApiRequest, NextApiResponse } from 'next';
import { getPoetryNamerInstance, PoetryNamingConfig, PoetryNameResult } from '../../lib/poetry-namer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      familyName,
      gender,
      books,
      nameCount = 6,
      avoidedWords = [],
      useCommonChars = true,
      nameLength = 2
    } = req.body;

    // 验证必要参数
    if (!familyName || !gender) {
      return res.status(400).json({ 
        success: false, 
        error: '缺少必要参数：familyName 和 gender' 
      });
    }

    // 验证性别参数
    if (gender !== 'male' && gender !== 'female') {
      return res.status(400).json({ 
        success: false, 
        error: '性别参数无效，请使用 male 或 female' 
      });
    }

    // 构建诗词取名配置
    const config: PoetryNamingConfig = {
      familyName,
      gender: gender as 'male' | 'female',
      books,
      nameCount: Math.min(nameCount, 20), // 最多一次生成20个
      avoidedWords,
      useCommonChars,
      nameLength: nameLength as 2 | 3 // 名字长度
    };

    console.log('🎨 诗词取名配置:', {
      familyName: config.familyName,
      gender: config.gender,
      books: config.books,
      nameCount: config.nameCount
    });

    // 获取诗词取名器实例
    const poetryNamer = getPoetryNamerInstance();
    
    // 生成诗词名字
    const startTime = Date.now();
    const names = await poetryNamer.generateNames(config);
    const endTime = Date.now();
    
    console.log(`✨ 诗词取名完成，耗时：${endTime - startTime}ms，生成 ${names.length} 个名字`);

    // 格式化返回数据，确保与现有API接口兼容
    const formattedNames = names.map((name: PoetryNameResult) => ({
      fullName: name.fullName,
      familyName: name.familyName,
      firstName: name.name.charAt(0) || '',
      secondName: name.name.charAt(1) || '',
      thirdName: name.name.charAt(2) || '', // 添加第三个字符支持
      meaning: `出自《${name.title}》: "${name.sentence}"`,
      popularity: 75, // 诗词名字默认给较高的文化价值评分
      source: {
        type: 'poetry',
        book: name.book,
        title: name.title,
        author: name.author,
        dynasty: name.dynasty,
        sentence: name.sentence,
        highlightedSentence: name.highlightedSentence,
        content: name.content
      }
    }));

    res.status(200).json({
      success: true,
      data: {
        names: formattedNames,
        metadata: {
          total: formattedNames.length,
          generationTime: endTime - startTime,
          config: {
            familyName: config.familyName,
            gender: config.gender,
            books: config.books,
            nameCount: config.nameCount
          }
        }
      }
    });

  } catch (error) {
    console.error('❌ 诗词名字生成失败:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '诗词名字生成失败',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}