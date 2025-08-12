#!/bin/bash

# 数据文件整理脚本
# 第二阶段：数据文件整理

echo "🚀 开始第二阶段：数据文件整理..."

# 创建数据目录结构
echo "📁 创建数据目录结构..."
mkdir -p data/{characters,names,poetry,rules,configs}

# 移动字符数据
echo "🔤 移动字符数据..."
mv public/data/standard-characters*.json data/characters/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv public/data/final-enhanced-character-database*.json data/characters/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv public/data/real-stroke-data.json data/characters/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv public/data/wuxing_dict_*.json data/characters/ 2>/dev/null || echo "⚠️  文件已移动或不存在"

# 移动姓名数据
echo "👤 移动姓名数据..."
mv public/data/baijiaxing.* data/names/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv public/data/name-corpus.txt data/names/ 2>/dev/null || echo "⚠️  文件已移动或不存在"

# 移动诗词数据
echo "📖 移动诗词数据..."
mv public/data/chinese-poetry/ data/poetry/ 2>/dev/null || echo "⚠️  目录已移动或不存在"
mv public/data/poetry/ data/poetry/ 2>/dev/null || echo "⚠️  目录已移动或不存在"

# 移动规则数据
echo "📋 移动规则数据..."
mv public/data/sancai-*.json data/rules/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv public/data/sancai.txt data/rules/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv public/data/zodiac-data.json data/rules/ 2>/dev/null || echo "⚠️  文件已移动或不存在"

# 移动配置数据
echo "⚙️  移动配置数据..."
mv public/data/word-index.json data/configs/ 2>/dev/null || echo "⚠️  文件已移动或不存在"
mv public/data/word-chunks/ data/configs/ 2>/dev/null || echo "⚠️  目录已移动或不存在"
mv public/data/processed/ data/configs/ 2>/dev/null || echo "⚠️  目录已移动或不存在"

# 创建数据索引
echo "📋 创建数据索引..."
cat > data/index.json << 'EOF'
{
  "version": "1.0.0",
  "lastUpdated": "2024-01-01",
  "datasets": {
    "characters": {
      "standard": "characters/standard-characters.json",
      "standardMin": "characters/standard-characters.min.json",
      "database": "characters/final-enhanced-character-database.json",
      "databaseMin": "characters/final-enhanced-character-database.min.json",
      "strokes": "characters/real-stroke-data.json",
      "wuxingSimplified": "characters/wuxing_dict_jianti.json",
      "wuxingTraditional": "characters/wuxing_dict_fanti.json"
    },
    "names": {
      "familyNames": "names/baijiaxing.json",
      "familyNamesTxt": "names/baijiaxing.txt",
      "corpus": "names/name-corpus.txt"
    },
    "poetry": {
      "chinese": "poetry/chinese-poetry/",
      "processed": "poetry/poetry/"
    },
    "rules": {
      "sancaiRules": "rules/sancai-rules.json",
      "sancaiData": "rules/sancai.txt",
      "zodiac": "rules/zodiac-data.json"
    },
    "configs": {
      "wordIndex": "configs/word-index.json",
      "wordChunks": "configs/word-chunks/",
      "processed": "configs/processed/"
    }
  }
}
EOF

echo "✅ 第二阶段：数据文件整理完成！"
echo "📁 数据文件已整理到 data/ 目录"
echo "📋 数据索引已创建：data/index.json"
