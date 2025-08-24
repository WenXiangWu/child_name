import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';

export interface ToastProps {
  id: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // 入场动画
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const variants = {
    success: {
      bg: 'bg-white border-l-4 border-cultural-jade',
      icon: '✓',
      iconBg: 'bg-cultural-jade',
      iconColor: 'text-white',
      titleColor: 'text-cultural-jade-800',
      messageColor: 'text-cultural-jade-600'
    },
    error: {
      bg: 'bg-white border-l-4 border-cultural-red',
      icon: '✕',
      iconBg: 'bg-cultural-red',
      iconColor: 'text-white',
      titleColor: 'text-cultural-red-800',
      messageColor: 'text-cultural-red-600'
    },
    warning: {
      bg: 'bg-white border-l-4 border-cultural-gold',
      icon: '⚠',
      iconBg: 'bg-cultural-gold',
      iconColor: 'text-white',
      titleColor: 'text-cultural-gold-800',
      messageColor: 'text-cultural-gold-600'
    },
    info: {
      bg: 'bg-white border-l-4 border-blue-500',
      icon: 'ℹ',
      iconBg: 'bg-blue-500',
      iconColor: 'text-white',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-600'
    }
  };

  const variant = variants[type];

  return (
    <div
      className={clsx(
        'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden transition-all duration-300 transform',
        variant.bg,
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        isLeaving && '-translate-x-full'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={clsx('w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5', variant.iconBg)}>
            <span className={clsx('text-sm font-bold', variant.iconColor)}>
              {variant.icon}
            </span>
          </div>
          <div className="flex-1">
            <h4 className={clsx('font-semibold text-sm', variant.titleColor)}>
              {title}
            </h4>
            {message && (
              <p className={clsx('text-sm mt-1', variant.messageColor)}>
                {message}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
