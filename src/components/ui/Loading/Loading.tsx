import React from 'react';
import { clsx } from 'clsx';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'cultural';
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  className
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'cultural') {
    return (
      <div className={clsx('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cultural-gold/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-cultural-gold border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-2 bg-cultural-gold/10 rounded-full flex items-center justify-center">
            <span className="text-2xl">🏛️</span>
          </div>
        </div>
        {text && (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-cultural-ink mb-2">{text}</h3>
            <p className="text-gray-600 text-sm">运用传统文化智慧，为您精心挑选...</p>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={clsx('flex items-center space-x-2', className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={clsx(
                'bg-cultural-gold rounded-full animate-bounce',
                sizes[size]
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>
        {text && (
          <span className={clsx('text-gray-600 ml-3', textSizes[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={clsx('flex items-center space-x-3', className)}>
      <svg
        className={clsx('animate-spin text-cultural-gold', sizes[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <span className={clsx('text-gray-600', textSizes[size])}>
          {text}
        </span>
      )}
    </div>
  );
};

export default Loading;
