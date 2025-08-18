import { useState, useEffect } from 'react';
import { nameRecommendations, NameCombination } from '@/data/names';

interface UseNameGeneratorProps {
  gender: 'male' | 'female';
  familyName?: string;
  count?: number;
  usePluginSystem?: boolean;
}

interface NameWithDetails extends NameCombination {
  familyName: string;
  fullName: string;
}

export function useNameGenerator({ 
  gender, 
  familyName = '张',
  count = 5,
  usePluginSystem = true
}: UseNameGeneratorProps) {
  const [names, setNames] = useState<NameWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [executionLogs, setExecutionLogs] = useState<any[]>([]);
  const [generationMetadata, setGenerationMetadata] = useState<any>(null);

  // 生成名字
  const generateNames = async () => {
    setLoading(true);
    setError(null);

    try {
      if (usePluginSystem) {
        // 使用插件系统API
        console.log('🧩 使用插件系统生成名字');
        
        const response = await fetch('/api/generate-names', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            familyName,
            gender,
            limit: count,
            usePluginSystem: true,
            enableDetailedLogs: true,
            scoreThreshold: 80
          }),
        });

        const result = await response.json();
        
        if (result.success && result.data?.names) {
          // 转换API结果为Hook期望的格式
          const namesWithDetails = result.data.names.map((name: any) => ({
            familyName: name.familyName,
            firstName: name.midChar,
            secondName: name.lastChar,
            fullName: name.fullName,
            meaning: name.explanation || '暂无详细说明',
            popularity: Math.round(name.score), // 使用评分作为受欢迎度
            gender: gender
          }));
          
          setNames(namesWithDetails);
          setExecutionLogs(result.executionLogs || []);
          setGenerationMetadata(result.metadata || null);
          console.log('✅ 插件系统生成成功:', namesWithDetails.length, '个名字');
        } else {
          // 插件系统失败时不再降级，直接显示错误
          console.error('❌ 插件系统生成失败:', result.error || result.message);
          setError(result.error || result.message || '插件系统生成名字失败');
          setNames([]);
        }
      } else {
        // 使用本地静态数据
        generateNamesLocal();
      }
    } catch (err) {
      if (usePluginSystem) {
        // 插件系统模式下不降级，直接显示错误
        console.error('❌ 插件系统API调用失败:', err);
        setError(err instanceof Error ? err.message : '插件系统连接失败');
        setNames([]);
        setLoading(false);
      } else {
        // 传统模式下降级到本地数据
        console.error('❌ API调用失败，降级到本地模式:', err);
        generateNamesLocal();
      }
    }
  };

  // 本地生成名字（降级方案）
  const generateNamesLocal = () => {
    console.log('🏛️ 使用本地数据生成名字');
    
    setTimeout(() => {
      try {
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
        console.log('✅ 本地模式生成成功:', namesWithDetails.length, '个名字');
      } catch (err) {
        setError('生成名字时出错，请重试');
        setLoading(false);
      }
    }, 800);
  };

  // 首次加载时生成名字
  useEffect(() => {
    generateNames();
  }, [gender, familyName, count]);

  return {
    names,
    loading,
    error,
    executionLogs,
    generationMetadata,
    regenerateNames: generateNames
  };
}