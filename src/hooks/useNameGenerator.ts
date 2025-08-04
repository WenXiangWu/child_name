import { useState, useEffect } from 'react';
import { nameRecommendations, NameCombination } from '@/data/names';

interface UseNameGeneratorProps {
  gender: 'male' | 'female';
  familyName?: string;
  count?: number;
}

interface NameWithDetails extends NameCombination {
  familyName: string;
  fullName: string;
}

export function useNameGenerator({ 
  gender, 
  familyName = '张',
  count = 5 
}: UseNameGeneratorProps) {
  const [names, setNames] = useState<NameWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 生成名字
  const generateNames = () => {
    setLoading(true);
    setError(null);

    try {
      // 在实际项目中，这里应该调用API获取名字
      // 这里使用本地数据模拟
      setTimeout(() => {
        // 过滤出符合性别的名字
        const filteredNames = nameRecommendations.filter(name => name.gender === gender);
        
        // 随机选择指定数量的名字
        const shuffled = [...filteredNames].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);
        
        // 添加姓氏和全名
        const namesWithDetails = selected.map(name => ({
          ...name,
          familyName,
          fullName: `${familyName}${name.firstName}${name.secondName}`
        }));
        
        setNames(namesWithDetails);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('生成名字时出错，请重试');
      setLoading(false);
    }
  };

  // 首次加载时生成名字
  useEffect(() => {
    generateNames();
  }, [gender, familyName, count]);

  return {
    names,
    loading,
    error,
    regenerateNames: generateNames
  };
}