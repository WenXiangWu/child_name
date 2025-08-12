#!/bin/bash

# 配置整理脚本
# 第五阶段：配置和工具整理

echo "🚀 开始第五阶段：配置和工具整理..."

# 创建配置目录
echo "📁 创建配置目录..."
mkdir -p config/{development,production,test}

# 移动配置文件
echo "⚙️  移动配置文件..."
mv next.config.js config/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv tailwind.config.js config/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv postcss.config.js config/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv tsconfig.json config/ 2>/dev/null || echo "⚠️  文件已移动或不存在"

# 创建环境配置
echo "🌍 创建环境配置..."
cat > config/development/config.json << 'EOF'
{
  "environment": "development",
  "debug": true,
  "logLevel": "debug",
  "apiBaseUrl": "http://localhost:3000/api"
}
EOF

cat > config/production/config.json << 'EOF'
{
  "environment": "production",
  "debug": false,
  "logLevel": "error",
  "apiBaseUrl": "https://your-domain.com/api"
}
EOF

cat > config/test/config.json << 'EOF'
{
  "environment": "test",
  "debug": true,
  "logLevel": "warn",
  "apiBaseUrl": "http://localhost:3000/api"
}
EOF

# 创建脚本目录
echo "📜 创建脚本目录..."
mkdir -p scripts/{build,deploy,data,test,restructure}

# 创建构建脚本
echo "🔨 创建构建脚本..."
cat > scripts/build/build.sh << 'EOF'
#!/bin/bash
echo "Building project..."
npm run build
echo "Build completed!"
EOF

# 创建部署脚本
echo "🚀 创建部署脚本..."
cat > scripts/deploy/deploy.sh << 'EOF'
#!/bin/bash
echo "Deploying project..."
# TODO: 添加部署逻辑
echo "Deployment completed!"
EOF

# 创建数据处理脚本
echo "📊 创建数据处理脚本..."
cat > scripts/data/process-data.sh << 'EOF'
#!/bin/bash
echo "Processing data..."
# TODO: 添加数据处理逻辑
echo "Data processing completed!"
EOF

# 创建测试脚本
echo "🧪 创建测试脚本..."
cat > scripts/test/run-tests.sh << 'EOF'
#!/bin/bash
echo "Running tests..."
npm test
echo "Tests completed!"
EOF

# 设置脚本权限
echo "🔐 设置脚本权限..."
chmod +x scripts/build/build.sh
chmod +x scripts/deploy/deploy.sh
chmod +x scripts/data/process-data.sh
chmod +x scripts/test/run-tests.sh

# 创建脚本索引
echo "📋 创建脚本索引..."
cat > scripts/README.md << 'EOF'
# 脚本目录

## 构建脚本
- `build/build.sh` - 项目构建脚本

## 部署脚本
- `deploy/deploy.sh` - 项目部署脚本

## 数据处理脚本
- `data/process-data.sh` - 数据处理脚本

## 测试脚本
- `test/run-tests.sh` - 测试运行脚本

## 重构脚本
- `restructure/01-docs-reorganize.sh` - 文档整理
- `restructure/02-data-reorganize.sh` - 数据整理
- `restructure/03-code-restructure.sh` - 代码重构
- `restructure/04-pages-reorganize.sh` - 页面整理
- `restructure/05-config-reorganize.sh` - 配置整理
EOF

echo "✅ 第五阶段：配置和工具整理完成！"
echo "📁 配置文件已整理到 config/ 目录"
echo "📜 脚本文件已创建到 scripts/ 目录"
echo "🔐 脚本权限已设置"
echo "📋 脚本索引已创建：scripts/README.md"
