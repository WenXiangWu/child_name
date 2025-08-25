import { useState, useCallback } from 'react';
import { NameCombination } from '../data/names';

interface UsePoetryNamerParams {
  familyName: string;
  gender: 'male' | 'female';
  books?: string[];
  nameCount?: number;
  avoidedWords?: string[];
  useCommonChars?: boolean;
  nameLength?: 2 | 3; // 名字长度：2字名或3字名
}

interface UsePoetryNamerResult {
  names: NameCombination[];
  loading: boolean;
  error: string | null;
  generateNames: () => Promise<void>;
  clearNames: () => void;
}

export function usePoetryNamer(params: UsePoetryNamerParams): UsePoetryNamerResult {
  const [names, setNames] = useState<NameCombination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateNames = useCallback(async () => {
    if (!params.familyName || !params.gender) {
      setError('缺少必要参数：姓氏和性别');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🎨 开始调用诗词取名API，参数:', params);
      
      const response = await fetch('/api/generate-poetry-names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          familyName: params.familyName,
          gender: params.gender,
          books: params.books,
          nameCount: params.nameCount || 6,
          avoidedWords: params.avoidedWords || [],
          useCommonChars: params.useCommonChars !== false, // 默认为true
          nameLength: params.nameLength || 2 // 默认生成2字名
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '诗词取名失败');
      }

      console.log('✨ 诗词取名成功，收到', data.data.names.length, '个名字');
      setNames(data.data.names);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '诗词取名过程中发生未知错误';
      console.error('❌ 诗词取名失败:', errorMessage);
      setError(errorMessage);
      setNames([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const clearNames = useCallback(() => {
    setNames([]);
    setError(null);
  }, []);

  return {
    names,
    loading,
    error,
    generateNames,
    clearNames
  };
}