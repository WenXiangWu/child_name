#!/bin/bash

# 文档整理脚本
# 第一阶段：文档整理

echo "🚀 开始第一阶段：文档整理..."

# 创建文档目录结构
echo "📁 创建文档目录结构..."
mkdir -p docs/{design,api,deployment,requirements}

# 移动设计文档
echo "📄 移动设计文档..."
mv "Chinesebabyname项目设计文档.md" docs/design/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv "fate项目设计及功能详解文档.md" docs/design/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv "qiming功能实现对照表.md" docs/design/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv "取名因素体系与插件化架构" docs/design/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv "插件化重构详细计划.md" docs/design/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv "核心设计文档.md" docs/design/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv "模块架构分析报告.md" docs/design/ 2>/dev/null || echo "⚠️  文件已移动或不存在"

# 创建文档索引
echo "📋 创建文档索引..."
cat > docs/README.md << 'EOF'
# 项目文档中心

## 📚 设计文档
- [Chinese Baby Name Design](./design/Chinesebabyname项目设计文档.md)
- [Fate System Design](./design/fate项目设计及功能详解文档.md)
- [Qiming Implementation Guide](./design/qiming功能实现对照表.md)
- [Naming Factors Architecture](./design/取名因素体系与插件化架构)
- [Plugin Refactoring Plan](./design/插件化重构详细计划.md)
- [Core Design Document](./design/核心设计文档.md)
- [Module Architecture Analysis](./design/模块架构分析报告.md)

## 🔧 API文档
- [Naming API](./api/API文档.md)

## 🚀 部署文档
- [Deployment Guide](./deployment/部署文档.md)
- [Environment Setup](./deployment/环境配置.md)

## 📋 需求文档
- [Requirements Analysis](./requirements/需求分析.md)
EOF

echo "✅ 第一阶段：文档整理完成！"
echo "📁 文档已整理到 docs/ 目录"
echo "📋 文档索引已创建：docs/README.md"
