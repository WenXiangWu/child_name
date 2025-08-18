import React from 'react';

interface NameCardProps {
  familyName: string;
  givenName: string;
  meaning: string;
  popularity?: number; // 1-100
  onClick?: () => void;
}

const NameCard: React.FC<NameCardProps> = ({
  familyName,
  givenName,
  meaning,
  popularity = 50,
  onClick,
}) => {
  // 计算流行度等级
  const getPopularityLevel = (score: number) => {
    if (score < 20) return '罕见';
    if (score < 40) return '少见';
    if (score < 60) return '一般';
    if (score < 80) return '常见';
    return '流行';
  };

  // 计算流行度颜色
  const getPopularityColor = (score: number) => {
    if (score < 30) return 'bg-green-100 text-green-800';
    if (score < 70) return 'bg-blue-100 text-blue-800';
    return 'bg-orange-100 text-orange-800';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-800">
          {familyName}<span className="text-primary-600">{givenName}</span>
        </h3>
        <span 
          className={`text-xs px-2 py-1 rounded-full ${getPopularityColor(popularity)}`}
        >
          {getPopularityLevel(popularity)}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{meaning}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">和谐度</span>
          <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-primary-500 h-2 rounded-full" 
              style={{ width: `${Math.min(100 - popularity/2, 95)}%` }}
            ></div>
          </div>
        </div>
        <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
          查看详情
        </button>
      </div>
    </div>
  );
};

export default NameCard;