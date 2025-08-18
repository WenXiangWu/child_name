#!/bin/bash

# 页面整理脚本
# 第四阶段：页面和组件整理

echo "🚀 开始第四阶段：页面和组件整理..."

# 创建页面分类目录
echo "📁 创建页面分类目录..."
mkdir -p src/pages/{naming,culture,analysis,tools,admin}

# 移动取名页面
echo "🔤 移动取名页面..."
mv src/pages/naming.tsx src/pages/naming/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/pages/qiming-results.tsx src/pages/naming/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/pages/name-detail.tsx src/pages/naming/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/pages/poetry-naming.tsx src/pages/naming/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/pages/poetry-name-detail.tsx src/pages/naming/ 2>/dev/null || echo "⚠️  文件已移动或不存在"

# 移动文化页面
echo "📚 移动文化页面..."
mv src/pages/culture/ src/pages/culture/ 2>/dev/null || echo "⚠️  目录已移动或不存在"
mv src/pages/baijiaxing.tsx src/pages/culture/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/pages/standard-characters.tsx src/pages/culture/ 2>/dev/null || echo "⚠️  文件已移动或不存在"

# 移动分析页面
echo "🔍 移动分析页面..."
mv src/pages/name-duplicate-check/ src/pages/analysis/ 2>/dev/null || echo "⚠️  目录已移动或不存在"

# 移动工具页面
echo "🛠️  移动工具页面..."
mv src/pages/text-converter.tsx src/pages/tools/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/pages/xinhua-dict.tsx src/pages/tools/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/pages/debug-lunar.tsx src/pages/tools/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/pages/test-poetry.tsx src/pages/tools/ 2>/dev/null || echo "⚠️  文件已移动或不存在"

# 移动管理页面
echo "⚙️  移动管理页面..."
mv src/pages/generate.tsx src/pages/admin/ 2>/dev/null || echo "⚠️  文件已移动或不存在"

# 整理组件目录
echo "🧩 整理组件目录..."
mkdir -p src/components/{ui,layout,features}
mkdir -p src/components/features/{naming,analysis,culture}

# 移动组件文件
echo "📦 移动组件文件..."
mv src/components/Layout.tsx src/components/layout/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/components/LunarCalendar.tsx src/components/ui/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv src/components/CandidateFilteringPopup.tsx src/components/ui/ 2>/dev/null || echo "⚠️  文件已移动或不存在"

# 创建组件索引文件
echo "📋 创建组件索引文件..."
cat > src/components/index.ts << 'EOF'
// 组件统一导出
export * from './ui';
export * from './layout';
export * from './features';
EOF

cat > src/components/ui/index.ts << 'EOF'
// UI组件导出
export { default as LunarCalendar } from './LunarCalendar';
export { default as CandidateFilteringPopup } from './CandidateFilteringPopup';
EOF

cat > src/components/layout/index.ts << 'EOF'
// 布局组件导出
export { default as Layout } from './Layout';
EOF

cat > src/components/features/index.ts << 'EOF'
// 功能组件导出
export * from './naming';
export * from './analysis';
export * from './culture';
EOF

echo "✅ 第四阶段：页面和组件整理完成！"
echo "📁 页面已按功能分类整理"
echo "🧩 组件已重新组织"
echo "📋 组件索引文件已创建"
