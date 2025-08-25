import React from 'react';
import { Card } from './ui/Card/Card.modern';
import { cn } from '../utils/cn';

interface NameCardProps {
  familyName: string;
  givenName: string;
  meaning: string;
  popularity?: number; // 1-100
  harmony?: number; // 和谐度 1-100
  uniqueness?: number; // 独特性 1-100
  cultural?: number; // 文化内涵 1-100
  onClick?: () => void;
  className?: string;
}

const NameCard: React.FC<NameCardProps> = ({
  familyName,
  givenName,
  meaning,
  popularity = 50,
  harmony = 85,
  uniqueness = 70,
  cultural = 80,
  onClick,
  className,
}) => {
  // 计算流行度等级和颜色
  const getPopularityInfo = (score: number) => {
    if (score < 20) return { level: '罕见', color: 'bg-emerald-100 text-emerald-800', icon: '💎' };
    if (score < 40) return { level: '少见', color: 'bg-blue-100 text-blue-800', icon: '🌟' };
    if (score < 60) return { level: '适中', color: 'bg-purple-100 text-purple-800', icon: '⭐' };
    if (score < 80) return { level: '常见', color: 'bg-orange-100 text-orange-800', icon: '🔥' };
    return { level: '流行', color: 'bg-red-100 text-red-800', icon: '📈' };
  };

  // 计算综合评分
  const overallScore = Math.round((harmony + uniqueness + cultural) / 3);
  
  // 获取评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-purple-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const popularityInfo = getPopularityInfo(popularity);

  return (
    <Card 
      variant="cultural"
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden',
        'border border-neutral-200 hover:border-neutral-300',
        'bg-white hover:bg-neutral-50/50',
        'shadow-md hover:shadow-xl',
        'transform transition-all duration-300 ease-out',
        'rounded-2xl',
        onClick && 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
        className
      )}
    >
      {/* 文化装饰背景 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-4 right-4 text-6xl text-cultural-gold">
          {familyName}
        </div>
        <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-cultural-jade/30 rounded-full"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* 头部：名字和流行度 */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-4xl font-bold font-heading mb-4 group-hover:text-cultural-red transition-colors duration-300">
              <span className="text-neutral-800">{familyName}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500 ml-2">
                {givenName}
              </span>
            </h3>
            
            {/* 综合评分 */}
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-neutral-600 font-medium">综合评分</span>
              <div className={cn(
                'text-3xl font-bold font-mono',
                getScoreColor(overallScore)
              )}>
                {overallScore}
              </div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'text-xl',
                      i < Math.floor(overallScore / 20) ? 'text-primary-500' : 'text-neutral-300'
                    )}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* 流行度标签 */}
          <div className={cn(
            'flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium',
            'border border-current/20 backdrop-blur-sm',
            popularityInfo.color
          )}>
            <span className="text-lg">{popularityInfo.icon}</span>
            <span>{popularityInfo.level}</span>
          </div>
        </div>

        {/* 寓意描述 */}
        <div className="mb-6">
          <p className="text-neutral-700 leading-relaxed text-sm bg-cultural-paper/30 p-4 rounded-xl border border-cultural-gold/10">
            {meaning}
          </p>
        </div>

        {/* 详细评分 */}
        <div className="space-y-3 mb-6">
          {[
            { label: '音韵和谐', value: harmony, icon: '🎵', color: 'cultural-jade' },
            { label: '独特程度', value: uniqueness, icon: '💎', color: 'cultural-gold' },
            { label: '文化内涵', value: cultural, icon: '📚', color: 'cultural-red' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm font-medium text-neutral-700">
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      'h-full rounded-full transition-all duration-500 ease-out',
                      `bg-${item.color}`
                    )}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className="text-sm font-mono font-medium text-neutral-600 w-8 text-right">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 底部操作区 */}
        <div className="flex items-center justify-between pt-4 border-t border-cultural-gold/20">
          <div className="flex items-center space-x-4 text-xs text-neutral-500">
            <span className="flex items-center space-x-1">
              <span>📊</span>
              <span>流行度 {popularity}%</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>🎯</span>
              <span>匹配度 {overallScore}%</span>
            </span>
          </div>
          
          {onClick && (
            <div className="flex items-center space-x-2 text-cultural-gold group-hover:text-cultural-red transition-colors duration-300">
              <span className="text-sm font-medium">查看详情</span>
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* 悬浮效果装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-cultural-gold/5 to-cultural-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
};

export default NameCard;
