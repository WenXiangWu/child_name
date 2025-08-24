import React from 'react';
import { clsx } from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'cultural' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick
}) => {
  const baseStyles = 'bg-white rounded-2xl border border-gray-100';
  
  const variants = {
    default: 'shadow-md',
    cultural: 'shadow-cultural border-cultural-gold/20 bg-gradient-to-br from-white to-cultural-paper/30',
    elevated: 'shadow-xl shadow-gray-200/50',
    bordered: 'border-2 border-cultural-jade/20 shadow-sm'
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const hoverStyles = hover ? 'transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer' : '';
  
  return (
    <div
      className={clsx(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverStyles,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
