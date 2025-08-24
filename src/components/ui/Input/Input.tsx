import React, { forwardRef, useState } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className,
    type = 'text',
    ...props 
  }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = props.value !== undefined ? String(props.value).length > 0 : false;
    
    const inputStyles = clsx(
      'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200',
      'focus:outline-none focus:ring-4',
      leftIcon && 'pl-12',
      rightIcon && 'pr-12',
      error 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
        : 'border-gray-300 focus:border-cultural-gold focus:ring-cultural-gold/20',
      focused && !error && 'shadow-lg shadow-cultural-gold/20',
      className
    );
    
    return (
      <div className="space-y-2">
        {label && (
          <label className={clsx(
            'block text-sm font-medium transition-colors duration-200',
            error ? 'text-red-700' : 'text-cultural-ink'
          )}>
            {label}
            {props.required && <span className="text-cultural-red ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            className={inputStyles}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
          
          {/* 验证状态指示 */}
          {hasValue && !error && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 bg-cultural-jade rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-600">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
