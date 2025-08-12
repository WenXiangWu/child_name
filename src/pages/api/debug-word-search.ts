import type { NextApiRequest, NextApiResponse } from 'next';
import { WordDataLoader } from '../../core/naming/word-loader';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const wordLoader = WordDataLoader.getInstance();
    await wordLoader.initialize();
    
    // 测试6画字符
    const chars6 = await wordLoader.getCharactersByStrokes(6);
    console.log(`6画字符数量: ${chars6.length}`);
    console.log(`6画字符前10个: ${chars6.slice(0, 10)}`);
    
    // 测试l开头拼音的字符
    const charsL = await wordLoader.getCharactersByPinyinInitial('l');
    console.log(`l开头字符数量: ${charsL.length}`);
    console.log(`l开头字符前10个: ${charsL.slice(0, 10)}`);
    
    // 手动求交集测试
    const intersection = chars6.filter(char => charsL.includes(char));
    console.log(`6画且l开头字符数量: ${intersection.length}`);
    console.log(`6画且l开头字符前10个: ${intersection.slice(0, 10)}`);
    
    // 使用搜索API测试
    const searchResult = await wordLoader.searchCharacters({
      strokes: [6],
      pinyinInitials: ['l'],
      limit: 10
    });
    console.log(`搜索API结果数量: ${searchResult.length}`);
    
    res.status(200).json({
      success: true,
      data: {
        chars6Count: chars6.length,
        chars6Sample: chars6.slice(0, 10),
        charsLCount: charsL.length,
        charsLSample: charsL.slice(0, 10),
        intersectionCount: intersection.length,
        intersectionSample: intersection.slice(0, 10),
        searchResultCount: searchResult.length,
        searchResultSample: searchResult.map(r => ({
          word: r.word,
          strokes: r.strokes,
          pinyin: r.pinyin
        }))
      }
    });

  } catch (error) {
    console.error('Debug word search failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}