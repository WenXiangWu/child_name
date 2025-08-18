import React, { useState, useEffect } from 'react';

// 系统类型
type SystemType = 'traditional' | 'plugin';

// 确定性等级
enum CertaintyLevel {
  FULLY_DETERMINED = 'FULLY_DETERMINED',
  PARTIALLY_DETERMINED = 'PARTIALLY_DETERMINED', 
  ESTIMATED = 'ESTIMATED',
  UNKNOWN = 'UNKNOWN'
}

// 系统配置接口
interface SystemConfig {
  usePluginSystem: boolean;
  showComparison: boolean;
  enableDetailedLogs: boolean;
  enableParallel: boolean;
  certaintyLevel?: CertaintyLevel;
}

// 组件属性
interface SystemSelectorProps {
  config: SystemConfig;
  onChange: (config: SystemConfig) => void;
  birthInfo?: {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
  };
  disabled?: boolean;
}

// 系统特性对比数据
const systemFeatures = {
  traditional: {
    name: '传统系统',
    icon: '⚡',
    color: 'blue',
    description: '经过验证的稳定系统，快速生成高质量名字',
    pros: [
      '执行速度快，通常在1-2秒内完成',
      '代码成熟稳定，经过大量测试',
      '内存占用低，资源消耗少',
      '接口简单，易于理解和维护'
    ],
    cons: [
      '功能相对固定，扩展性有限',
      '缺少详细的分析过程展示',
      '无法根据信息完整度智能调整',
      '插件化能力不足'
    ],
    bestFor: '快速取名、批量处理、资源受限环境'
  },
  plugin: {
    name: '插件系统',
    icon: '🧩',
    color: 'purple',
    description: '模块化架构，提供深度分析和个性化配置',
    pros: [
      '模块化设计，功能可灵活组合',
      '详细的执行过程和分析日志',
      '智能确定性等级，自适应分析深度',
      '支持并行执行，性能可优化',
      '插件可独立更新和扩展'
    ],
    cons: [
      '初始化时间较长',
      '内存占用相对较高',
      '复杂度较高，学习成本大',
      '部分功能仍在完善中'
    ],
    bestFor: '专业分析、教学演示、功能定制、深度解释需求'
  }
};

// 确定性等级配置
const certaintyLevels = {
  [CertaintyLevel.FULLY_DETERMINED]: {
    name: '完全确定',
    icon: '🎯',
    description: '完整的出生时间信息',
    required: ['年', '月', '日', '时辰'],
    color: 'green',
    plugins: 20,
    accuracy: '95%+'
  },
  [CertaintyLevel.PARTIALLY_DETERMINED]: {
    name: '部分确定',
    icon: '📊',
    description: '有出生日期但缺少时辰',
    required: ['年', '月', '日'],
    color: 'blue',
    plugins: 15,
    accuracy: '85%+'
  },
  [CertaintyLevel.ESTIMATED]: {
    name: '预估阶段',
    icon: '📈',
    description: '基于预产期或有限信息',
    required: ['年', '月'],
    color: 'yellow',
    plugins: 10,
    accuracy: '70%+'
  },
  [CertaintyLevel.UNKNOWN]: {
    name: '基础模式',
    icon: '📝',
    description: '仅有基础信息',
    required: ['姓氏', '性别'],
    color: 'gray',
    plugins: 6,
    accuracy: '60%+'
  }
};

// 切换开关组件
const Toggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}> = ({ checked, onChange, label, description, disabled = false }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex-1">
        <div className="font-medium text-sm">{label}</div>
        {description && (
          <div className="text-xs text-gray-600 mt-1">{description}</div>
        )}
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked 
            ? 'bg-blue-600' 
            : 'bg-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

// 系统卡片组件
const SystemCard: React.FC<{
  type: SystemType;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}> = ({ type, isSelected, onSelect, disabled = false }) => {
  const system = systemFeatures[type];
  
  return (
    <div
      onClick={!disabled ? onSelect : undefined}
      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
        isSelected 
          ? `border-${system.color}-500 bg-${system.color}-50` 
          : 'border-gray-200 hover:border-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-2xl">{system.icon}</span>
        <div>
          <h3 className="font-semibold">{system.name}</h3>
          <p className="text-sm text-gray-600">{system.description}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div>
          <h4 className="text-sm font-medium text-green-600 mb-1">✅ 优势</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {system.pros.map((pro, index) => (
              <li key={index}>• {pro}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-orange-600 mb-1">⚠️ 限制</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {system.cons.map((con, index) => (
              <li key={index}>• {con}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-700">
            <strong>适用场景:</strong> {system.bestFor}
          </div>
        </div>
      </div>
    </div>
  );
};

// 确定性等级选择器
const CertaintyLevelSelector: React.FC<{
  selectedLevel: CertaintyLevel;
  recommendedLevel: CertaintyLevel;
  onSelect: (level: CertaintyLevel) => void;
  disabled?: boolean;
}> = ({ selectedLevel, recommendedLevel, onSelect, disabled = false }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">确定性等级选择</h4>
        <span className="text-sm text-gray-600">
          推荐: {certaintyLevels[recommendedLevel].name}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(certaintyLevels).map(([level, config]) => {
          const isSelected = selectedLevel === level;
          const isRecommended = recommendedLevel === level;
          
          return (
            <div
              key={level}
              onClick={!disabled ? () => onSelect(level as CertaintyLevel) : undefined}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                isSelected 
                  ? `border-${config.color}-500 bg-${config.color}-50` 
                  : 'border-gray-200 hover:border-gray-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${
                isRecommended ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{config.icon}</span>
                <div>
                  <div className="font-medium text-sm">{config.name}</div>
                  {isRecommended && (
                    <span className="text-xs text-blue-600 font-medium">推荐</span>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-gray-600 mb-2">
                {config.description}
              </div>
              
              <div className="flex justify-between text-xs">
                <span>插件数: {config.plugins}</span>
                <span className={`text-${config.color}-600 font-medium`}>
                  准确度: {config.accuracy}
                </span>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                需要: {config.required.join(', ')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 主组件
const SystemSelector: React.FC<SystemSelectorProps> = ({
  config,
  onChange,
  birthInfo,
  disabled = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 根据出生信息推荐确定性等级
  const getRecommendedCertaintyLevel = (): CertaintyLevel => {
    if (birthInfo?.hour !== undefined) {
      return CertaintyLevel.FULLY_DETERMINED;
    } else if (birthInfo?.day !== undefined) {
      return CertaintyLevel.PARTIALLY_DETERMINED;
    } else if (birthInfo?.year !== undefined) {
      return CertaintyLevel.ESTIMATED;
    } else {
      return CertaintyLevel.UNKNOWN;
    }
  };
  
  const recommendedLevel = getRecommendedCertaintyLevel();
  
  // 自动设置推荐的确定性等级
  useEffect(() => {
    if (config.usePluginSystem && !config.certaintyLevel) {
      onChange({
        ...config,
        certaintyLevel: recommendedLevel
      });
    }
  }, [config.usePluginSystem, recommendedLevel]);
  
  const handleSystemChange = (usePluginSystem: boolean) => {
    const newConfig: SystemConfig = {
      ...config,
      usePluginSystem,
      certaintyLevel: usePluginSystem ? (config.certaintyLevel || recommendedLevel) : undefined
    };
    onChange(newConfig);
  };
  
  const handleCertaintyLevelChange = (certaintyLevel: CertaintyLevel) => {
    onChange({
      ...config,
      certaintyLevel
    });
  };
  
  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      {/* 标题和展开按钮 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">🔧 系统配置</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? '收起配置' : '展开配置'}
        </button>
      </div>
      
      {/* 简化视图 */}
      {!isExpanded && (
        <div className="space-y-3">
          <Toggle
            checked={config.usePluginSystem}
            onChange={handleSystemChange}
            label="使用插件系统"
            description={`当前: ${config.usePluginSystem ? '插件系统 🧩' : '传统系统 ⚡'}`}
            disabled={disabled}
          />
          
          {config.usePluginSystem && (
            <Toggle
              checked={config.showComparison}
              onChange={(checked) => onChange({ ...config, showComparison: checked })}
              label="显示系统对比"
              description="同时运行两套系统并对比结果"
              disabled={disabled}
            />
          )}
        </div>
      )}
      
      {/* 详细配置 */}
      {isExpanded && (
        <div className="space-y-6">
          {/* 系统选择 */}
          <div>
            <h4 className="font-medium mb-3">选择取名系统</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SystemCard
                type="traditional"
                isSelected={!config.usePluginSystem}
                onSelect={() => handleSystemChange(false)}
                disabled={disabled}
              />
              <SystemCard
                type="plugin"
                isSelected={config.usePluginSystem}
                onSelect={() => handleSystemChange(true)}
                disabled={disabled}
              />
            </div>
          </div>
          
          {/* 插件系统配置 */}
          {config.usePluginSystem && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">插件系统配置</h4>
              
              {/* 确定性等级选择 */}
              <CertaintyLevelSelector
                selectedLevel={config.certaintyLevel || recommendedLevel}
                recommendedLevel={recommendedLevel}
                onSelect={handleCertaintyLevelChange}
                disabled={disabled}
              />
              
              {/* 高级选项 */}
              <div className="space-y-3">
                <h5 className="font-medium text-sm">高级选项</h5>
                
                <Toggle
                  checked={config.enableParallel}
                  onChange={(checked) => onChange({ ...config, enableParallel: checked })}
                  label="启用并行执行"
                  description="并行运行插件以提升性能（实验性功能）"
                  disabled={disabled}
                />
                
                <Toggle
                  checked={config.enableDetailedLogs}
                  onChange={(checked) => onChange({ ...config, enableDetailedLogs: checked })}
                  label="显示详细日志"
                  description="展示每个插件的执行过程和分析详情"
                  disabled={disabled}
                />
                
                <Toggle
                  checked={config.showComparison}
                  onChange={(checked) => onChange({ ...config, showComparison: checked })}
                  label="系统对比模式"
                  description="同时运行插件系统和传统系统进行对比"
                  disabled={disabled}
                />
              </div>
            </div>
          )}
          
          {/* 配置摘要 */}
          <div className="bg-gray-50 p-3 rounded-lg border-t">
            <h5 className="font-medium text-sm mb-2">当前配置摘要</h5>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• 系统: {config.usePluginSystem ? '插件系统 🧩' : '传统系统 ⚡'}</div>
              {config.usePluginSystem && config.certaintyLevel && (
                <>
                  <div>• 确定性等级: {certaintyLevels[config.certaintyLevel].name}</div>
                  <div>• 预计插件数: {certaintyLevels[config.certaintyLevel].plugins}</div>
                  <div>• 预计准确度: {certaintyLevels[config.certaintyLevel].accuracy}</div>
                </>
              )}
              <div>• 并行执行: {config.enableParallel ? '启用' : '禁用'}</div>
              <div>• 详细日志: {config.enableDetailedLogs ? '显示' : '隐藏'}</div>
              <div>• 系统对比: {config.showComparison ? '启用' : '禁用'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSelector;
export type { SystemConfig, SystemType };
export { CertaintyLevel };
