import type { NextApiRequest, NextApiResponse } from 'next';
import { getRecommendedNames, NameCombination } from '@/data/names';

type ResponseData = {
  names: NameCombination[];
  message?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { gender, count, familyName } = req.query;
    
    // 验证参数
    if (!gender || (gender !== 'male' && gender !== 'female')) {
      return res.status(400).json({ 
        names: [], 
        message: '性别参数无效，请使用 male 或 female' 
      });
    }
    
    // 获取推荐名字
    const recommendedNames = getRecommendedNames(
      gender as 'male' | 'female',
      count ? parseInt(count as string) : 5
    );
    
    // 如果提供了姓氏，添加到结果中
    const result = recommendedNames.map(name => {
      return {
        ...name,
        fullName: `${familyName || ''}${name.firstName}${name.secondName}`
      };
    });
    
    res.status(200).json({ names: result });
  } catch (error) {
    console.error('获取名字推荐时出错:', error);
    res.status(500).json({ names: [], message: '服务器内部错误' });
  }
}