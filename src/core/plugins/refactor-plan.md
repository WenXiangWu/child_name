# 插件系统重构计划

## 📋 现状分析

### 当前插件结构与文档定义的6层架构对比

| 文档定义的6层架构 | 当前实现层级 | 状态 | 需要的调整 |
|------------------|-------------|------|------------|
| **Layer 1: 基础信息层** | layer1/ ✅ | 已实现 | 需优化数据获取方式 |
| **Layer 2: 命理分析层** | layer2/ ✅ | 已实现 | 需优化算法逻辑 |
| **Layer 3: 选字策略层** | layer3/ ❌ | 功能错位 | 需重新定义职责 |
| **Layer 4: 字符筛选层** | 无对应 ❌ | 缺失 | 需新建 |
| **Layer 5: 名字生成层** | layer4/NameGenerationPlugin ⚠️ | 位置错误 | 需重新组织 |
| **Layer 6: 名字评分层** | layer4/SancaiPlugin等 ⚠️ | 位置错误 | 需重新组织 |

### 问题识别

#### 1. **Layer 3 功能错位** 🔴
当前layer3实现的是字符评估功能，但文档定义的Layer 3应该是选字策略制定：
- ❌ 当前：`MeaningPlugin`, `PhoneticPlugin`, `StrokePlugin`等做字符评估
- ✅ 应该是：`WuxingSelectionPlugin`, `ZodiacSelectionPlugin`等制定策略

#### 2. **Layer 4 架构混乱** 🔴  
当前layer4混合了多种功能：
- ❌ `NameGenerationPlugin` (应该是Layer 5)
- ❌ `SancaiPlugin`, `DayanPlugin`等 (应该是Layer 6)
- ❌ 缺少真正的字符筛选功能

#### 3. **缺少关键层级** 🔴
- ❌ 缺少Layer 4: 字符筛选层 (应该做综合筛选)
- ❌ 缺少Layer 5: 名字生成层 (应该做组合生成)
- ❌ 缺少Layer 6: 名字评分层 (应该做最终评分)

---

## 🎯 重构目标

### 核心原则
1. **严格按照文档定义的6层架构重组**
2. **在现有插件目录内进行重构**  
3. **保持向后兼容性**
4. **实现标准化的数据获取方式**

### 重构策略
- ✅ **重新组织现有插件**：按6层架构重新分类
- ✅ **补全缺失层级**：新建缺失的Layer 4字符筛选层
- ✅ **标准化接口**：统一所有插件的接口规范
- ✅ **优化数据访问**：统一使用`UnifiedCharacterLoader`

---

## 📅 分阶段重构计划

### **Phase 1: 插件重新分类和组织** (优先级: 🔴 Critical)

#### 1.1 重新定义Layer 3 - 选字策略层
```bash
# 当前layer3目录重命名为layer3-old备份
mv implementations/layer3 implementations/layer3-old

# 创建新的layer3目录，实现真正的选字策略
mkdir implementations/layer3-new
```

**新Layer 3插件列表**：
- `WuxingSelectionPlugin` - 五行选字策略
- `ZodiacSelectionPlugin` - 生肖选字策略  
- `MeaningSelectionPlugin` - 寓意选字策略
- `StrokeSelectionPlugin` - 笔画选字策略
- `PhoneticSelectionPlugin` - 音韵选字策略

#### 1.2 重新组织Layer 4 - 创建字符筛选层
```bash
# 当前layer4重命名备份
mv implementations/layer4 implementations/layer4-old

# 创建新的layer4目录
mkdir implementations/layer4-new
```

**新Layer 4插件**：
- `CharacterFilterPlugin` - 综合字符筛选插件

#### 1.3 创建Layer 5 - 名字生成层
```bash
mkdir implementations/layer5
```

**Layer 5插件**：
- `NameCombinationPlugin` - 名字组合生成插件 (从layer4-old迁移)

#### 1.4 创建Layer 6 - 名字评分层
```bash
mkdir implementations/layer6
```

**Layer 6插件**：
- `SancaiScoringPlugin` - 三才五格评分 (从layer4-old迁移)
- `PhoneticScoringPlugin` - 音韵美感评分 (从layer3-old迁移)
- `WuxingBalanceScoringPlugin` - 五行平衡评分 (从layer4-old迁移)
- `DayanScoringPlugin` - 大衍数理评分 (从layer4-old迁移)
- `ComprehensiveScoringPlugin` - 综合评分排序 (新建)

---

### **Phase 2: 接口标准化** (优先级: 🟡 High)

#### 2.1 更新插件接口规范
- 统一`NamingPlugin`接口，明确6层架构
- 定义标准的输入输出格式
- 实现标准的依赖管理机制

#### 2.2 统一数据获取方式
- 所有插件统一使用`UnifiedCharacterLoader`
- 严格遵循繁体笔画计算规则
- 实现标准字符验证机制

---

### **Phase 3: 插件实现优化** (优先级: 🟢 Medium)

#### 3.1 优化现有插件
- Layer 1-2插件：保持现有功能，优化数据获取
- Layer 3插件：重新实现为策略制定功能
- Layer 4-6插件：按新架构重新实现

#### 3.2 实现缺失功能
- 补全所有18个标准插件
- 实现完整的6层执行流程
- 添加详细的日志和监控

---

## 🛠️ 具体实施步骤

### Step 1: 创建重构脚本
```bash
# 在src/core/plugins目录下创建重构脚本
touch plugins-refactor.sh
```

### Step 2: 备份现有插件
```bash
# 创建备份目录
mkdir -p backups/$(date +%Y%m%d-%H%M%S)
cp -r implementations/ backups/$(date +%Y%m%d-%H%M%S)/
```

### Step 3: 重新组织插件目录
```bash
# 按新的6层架构重新组织
# 详细步骤见下面的实施脚本
```

---

## 📊 重构后的目录结构

```
src/core/plugins/
├── implementations/
│   ├── layer1/                 # 基础信息层 (3个插件)
│   │   ├── SurnamePlugin.ts   # ✅ 保持
│   │   ├── GenderPlugin.ts    # ✅ 保持  
│   │   └── BirthTimePlugin.ts # ✅ 保持
│   ├── layer2/                 # 命理分析层 (3个插件)
│   │   ├── BaZiPlugin.ts      # ✅ 保持
│   │   ├── XiYongShenPlugin.ts # ✅ 保持
│   │   └── ZodiacPlugin.ts    # ✅ 保持
│   ├── layer3/                 # 选字策略层 (5个插件) 🆕
│   │   ├── WuxingSelectionPlugin.ts
│   │   ├── ZodiacSelectionPlugin.ts
│   │   ├── MeaningSelectionPlugin.ts
│   │   ├── StrokeSelectionPlugin.ts
│   │   └── PhoneticSelectionPlugin.ts
│   ├── layer4/                 # 字符筛选层 (1个插件) 🆕
│   │   └── CharacterFilterPlugin.ts
│   ├── layer5/                 # 名字生成层 (1个插件) 🆕
│   │   └── NameCombinationPlugin.ts
│   ├── layer6/                 # 名字评分层 (5个插件) 🆕
│   │   ├── SancaiScoringPlugin.ts
│   │   ├── PhoneticScoringPlugin.ts
│   │   ├── WuxingBalanceScoringPlugin.ts
│   │   ├── DayanScoringPlugin.ts
│   │   └── ComprehensiveScoringPlugin.ts
│   └── backup/                 # 备份旧实现 🗂️
│       ├── layer3-old/
│       └── layer4-old/
```

---

## ⚠️ 重构风险与缓解

### 风险评估
1. **兼容性风险** 🔴
   - 现有API调用可能受影响
   - 插件ID和接口可能发生变化

2. **功能回归风险** 🟡  
   - 重新实现过程中可能引入bug
   - 性能可能暂时下降

### 缓解措施
- ✅ **分阶段实施**：逐步迁移，保持测试覆盖
- ✅ **向后兼容**：保留旧插件ID的兼容层
- ✅ **全面测试**：每个阶段都进行完整测试

---

## 📈 成功指标

### 架构合规性
- ✅ 18个插件完全符合6层架构定义
- ✅ 所有插件都使用`UnifiedCharacterLoader`获取数据
- ✅ 插件间依赖关系清晰明确

### 代码质量
- ✅ 插件接口100%标准化
- ✅ 单元测试覆盖率>90%
- ✅ 代码复杂度降低30%

### 功能完整性
- ✅ 完整实现文档定义的6层执行流程
- ✅ 支持所有确定性等级的动态插件启用
- ✅ 详细的执行日志和性能监控

---

这个重构计划专门针对`src/core/plugins`目录，确保：
1. **只在插件目录内进行变更**
2. **严格遵循文档定义的6层架构**  
3. **保持系统的向后兼容性**
4. **实现标准化的插件接口**
