/**
 * React Hook for managing global data preloader state
 * 管理全局数据预加载状态的React Hook
 */

import { useState, useEffect } from 'react';
import { LoadingState, globalPreloader, getLoadingState, isDataReady } from '@/core/common/global-preloader';

export interface PreloaderState {
  loadingState: LoadingState;
  isReady: boolean;
  progress: any;
  error: string | null;
}

export function useDataPreloader() {
  const [state, setState] = useState<PreloaderState>({
    loadingState: LoadingState.IDLE,
    isReady: false,
    progress: null,
    error: null
  });

  useEffect(() => {
    // 初始状态检查
    const updateState = () => {
      const currentState = getLoadingState();
      const ready = isDataReady();
      const progress = globalPreloader.getLoadingProgress();

      setState({
        loadingState: currentState,
        isReady: ready,
        progress,
        error: currentState === LoadingState.ERROR ? '数据加载失败' : null
      });
    };

    // 立即更新一次
    updateState();

    // 定期检查状态（只在未完成时）
    let interval: NodeJS.Timeout;
    if (!isDataReady()) {
      interval = setInterval(updateState, 500); // 每500ms检查一次
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  // 手动触发预加载
  const triggerPreload = async () => {
    try {
      await globalPreloader.preloadData();
      setState(prev => ({
        ...prev,
        loadingState: LoadingState.COMPLETED,
        isReady: true,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loadingState: LoadingState.ERROR,
        error: error instanceof Error ? error.message : '未知错误'
      }));
    }
  };

  return {
    ...state,
    triggerPreload
  };
}