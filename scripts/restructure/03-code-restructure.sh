#!/bin/bash

# 代码重构脚本
# 第三阶段：源代码重构

echo "🚀 开始第三阶段：源代码重构..."

# 创建核心模块目录结构
echo "📁 创建核心模块目录结构..."
mkdir -p src/core/{naming,analysis,calculation,common}

# 移动取名核心模块
echo "🔤 移动取名核心模块..."
mv src/lib/qiming/name-generator.ts src/core/naming/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/lib/qiming/baijiaxing-loader.ts src/core/naming/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/lib/qiming/unified-character-loader.ts src/core/naming/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/lib/qiming/unified-data-adapter.ts src/core/naming/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/lib/qiming/word-loader.ts src/core/naming/ 2>/dev/null || echo "⚠️  文件已移动或不存在"

# 移动分析模块
echo "🔍 移动分析模块..."
mv src/lib/qiming/meaning-scorer.ts src/core/analysis/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/lib/qiming/social-scorer.ts src/core/analysis/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/lib/qiming/wuxing-scorer.ts src/core/analysis/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/lib/qiming/pinyin-analyzer.ts src/core/analysis/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/lib/qiming/zodiac-service.ts src/core/analysis/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/lib/qiming/standard-characters-validator.ts src/core/analysis/ 2>/dev/null || echo "⚠️  文件已移动或不存在"

# 移动计算模块
echo "🧮 移动计算模块..."
mv src/lib/qiming/sancai-calculator.ts src/core/calculation/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/lib/qiming/weighted-score-calculator.ts src/core/calculation/ 2>/dev/null || echo "⚠️  文件已移动或不存在"

# 移动通用模块
echo "📦 移动通用模块..."
mv src/lib/qiming/constants.ts src/core/common/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/lib/qiming/types.ts src/core/common/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/lib/qiming/data-loader.ts src/core/common/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/lib/qiming/global-preloader.ts src/core/common/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/lib/qiming/index.ts src/core/common/ 2>/dev/null || echo "⚠️  文件已移动或不存在"

# 创建模块导出文件
echo "📋 创建模块导出文件..."

# 核心模块统一入口
cat > src/core/index.ts << 'EOF'
// 核心模块统一入口
export * from './naming';
export * from './analysis';
export * from './calculation';
export * from './common';
EOF

# 取名模块导出
cat > src/core/naming/index.ts << 'EOF'
// 取名核心模块导出
export { NameGenerator } from './name-generator';
export { BaijiaxingLoader } from './baijiaxing-loader';
export { UnifiedCharacterLoader } from './unified-character-loader';
export { UnifiedDataAdapter } from './unified-data-adapter';
export { WordLoader } from './word-loader';
EOF

# 分析模块导出
cat > src/core/analysis/index.ts << 'EOF'
// 分析模块导出
export { MeaningScorer } from './meaning-scorer';
export { SocialScorer } from './social-scorer';
export { WuxingScorer } from './wuxing-scorer';
export { PinyinAnalyzer } from './pinyin-analyzer';
export { ZodiacService } from './zodiac-service';
export { StandardCharactersValidator } from './standard-characters-validator';
EOF

# 计算模块导出
cat > src/core/calculation/index.ts << 'EOF'
// 计算模块导出
export { SancaiCalculator } from './sancai-calculator';
export { WeightedScoreCalculator } from './weighted-score-calculator';
EOF

# 通用模块导出
cat > src/core/common/index.ts << 'EOF'
// 通用模块导出
export * from './constants';
export * from './types';
export { DataLoader } from './data-loader';
export { GlobalPreloader } from './global-preloader';
export { QimingNameGenerator } from './index';
EOF

# 创建插件系统预留目录
echo "🔌 创建插件系统预留目录..."
mkdir -p src/plugins/{core,extensions,adapters}
mkdir -p src/plugins/core/{layer1,layer2,layer3,layer4}
mkdir -p src/plugins/extensions/{poetry,culture,analysis}
mkdir -p src/plugins/adapters/{data,api,ui}

# 创建插件配置文件
echo "📋 创建插件配置文件..."
cat > src/plugins/plugin-manifest.json << 'EOF'
{
  "version": "1.0.0",
  "plugins": {},
  "levels": {
    "fully-determined": {
      "enabledPlugins": [],
      "processingStrategy": "sequential"
    },
    "partially-determined": {
      "enabledPlugins": [],
      "processingStrategy": "sequential"
    },
    "estimated": {
      "enabledPlugins": [],
      "processingStrategy": "sequential"
    },
    "unknown": {
      "enabledPlugins": [],
      "processingStrategy": "sequential"
    }
  }
}
EOF

cat > src/plugins/plugin-loader.ts << 'EOF'
// 插件加载器
export class PluginLoader {
  // TODO: 实现插件加载逻辑
}
EOF

cat > src/plugins/plugin-container.ts << 'EOF'
// 插件容器
export class PluginContainer {
  // TODO: 实现插件容器逻辑
}
EOF

echo "✅ 第三阶段：源代码重构完成！"
echo "📁 核心模块已整理到 src/core/ 目录"
echo "🔌 插件系统目录已创建：src/plugins/"
echo "📋 模块导出文件已创建"
