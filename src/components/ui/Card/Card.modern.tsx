import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

/**
 * 现代化卡片组件 - 遵循设计系统规范
 * 支持多种变体、内边距、交互状态和文化特色
 */

const cardVariants = cva(
  [
    // 基础样式
    'bg-white rounded-2xl border',
    'transition-all duration-300 ease-out',
    'relative overflow-hidden',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-neutral-200 shadow-sm',
          'hover:shadow-md',
        ],
        elevated: [
          'border-neutral-100 shadow-lg shadow-neutral-200/50',
          'hover:shadow-xl hover:shadow-neutral-200/60',
        ],
        cultural: [
          'border-cultural-gold/20 shadow-cultural',
          'bg-gradient-to-br from-white to-cultural-paper/30',
          'hover:shadow-cultural-lg hover:border-cultural-gold/30',
          // 文化装饰元素
          'before:absolute before:top-0 before:left-0 before:w-full before:h-1',
          'before:bg-gradient-to-r before:from-cultural-red before:via-cultural-gold before:to-cultural-jade',
          'before:opacity-60',
        ],
        bordered: [
          'border-2 border-neutral-200 shadow-none',
          'hover:border-neutral-300',
        ],
        ghost: [
          'border-transparent shadow-none bg-transparent',
          'hover:bg-neutral-50',
        ],
        gradient: [
          'border-transparent shadow-lg',
          'bg-gradient-to-br from-primary-50 via-white to-primary-100',
          'hover:from-primary-100 hover:to-primary-200',
        ],
      },
      padding: {
        none: '',
        xs: 'p-3',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      hover: {
        true: [
          'cursor-pointer',
          'hover:scale-[1.02]',
          'active:scale-[0.98]',
        ],
      },
      interactive: {
        true: [
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2',
          'focus-visible:ring-2 focus-visible:ring-primary-500/50',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    padding, 
    hover, 
    interactive,
    children,
    onClick,
    ...props 
  }, ref) => {
    const isInteractive = onClick || interactive;
    
    return (
      <div
        className={cn(cardVariants({ 
          variant, 
          padding, 
          hover: hover || !!onClick,
          interactive: !!isInteractive,
          className 
        }))}
        ref={ref}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e as any);
          }
        } : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * 卡片头部组件
 */
const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

/**
 * 卡片标题组件
 */
const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight font-heading',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

/**
 * 卡片描述组件
 */
const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-neutral-500', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/**
 * 卡片内容组件
 */
const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

/**
 * 卡片底部组件
 */
const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  cardVariants 
};
