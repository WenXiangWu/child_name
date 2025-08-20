# API 接口统一重构指南

## 📋 背景说明

由于我们只能在 `src/core/plugins` 目录内进行变更，对于外部API接口的统一需要通过插件系统的标准化来实现。

## 🎯 目标

通过标准化插件系统接口，为外部API提供统一的调用方式，从而间接实现API接口的统一。

---

## 📊 当前API问题分析

### 问题1：多个重复的取名API
- `generate-names.ts`
- `generate-names-detailed.ts` 
- `generate-names-plugin.ts`
- `generate-names-plugin-real.ts`
- `generate-names-hybrid.ts`

### 问题2：不同的执行模式
- 传统模式
- 插件模式  
- 混合模式
- 详细模式

---

## 🛠️ 解决方案：统一插件接口

### 核心思路
通过创建统一的插件执行器，为所有API提供标准化的调用接口，让外部API可以通过简单的配置选择不同的执行模式。

### 实施步骤

#### Step 1: 创建统一的插件执行器
```typescript
// 在 src/core/plugins/core/ 目录下创建
export class UnifiedNamingExecutor {
  // 统一的取名执行接口
  async executeNaming(request: StandardNamingRequest): Promise<StandardNamingResponse>
  
  // 支持不同的执行模式
  async executeWithMode(mode: 'traditional' | 'plugin' | 'hybrid'): Promise<any>
}
```

#### Step 2: 标准化请求和响应格式
```typescript
// 统一的请求格式
interface StandardNamingRequest {
  // 基础信息
  familyName: string;
  gender: 'male' | 'female';
  birthInfo?: BirthInfo;
  
  // 执行配置
  executionMode: 'traditional' | 'plugin' | 'hybrid';
  certaintyLevel?: CertaintyLevel;
  enableDetailedLogs?: boolean;
  
  // 其他配置...
}

// 统一的响应格式
interface StandardNamingResponse {
  success: boolean;
  data: {
    recommendations: GeneratedName[];
    analysis: AnalysisResult;
    metadata: ExecutionMetadata;
  };
  error?: string;
}
```

#### Step 3: 创建模式适配器
```typescript
// 传统模式适配器
export class TraditionalModeAdapter {
  async execute(request: StandardNamingRequest): Promise<StandardNamingResponse>
}

// 插件模式适配器  
export class PluginModeAdapter {
  async execute(request: StandardNamingRequest): Promise<StandardNamingResponse>
}

// 混合模式适配器
export class HybridModeAdapter {
  async execute(request: StandardNamingRequest): Promise<StandardNamingResponse>
}
```

---

## 📁 在插件目录内的实施

### 创建的新文件

```
src/core/plugins/
├── api/                          # 🆕 API适配层
│   ├── UnifiedNamingExecutor.ts  # 统一执行器
│   ├── StandardTypes.ts          # 标准类型定义
│   ├── TraditionalModeAdapter.ts # 传统模式适配器
│   ├── PluginModeAdapter.ts      # 插件模式适配器
│   ├── HybridModeAdapter.ts      # 混合模式适配器
│   └── index.ts                  # 统一导出
```

### 使用方式

```typescript
// 外部API可以这样调用
import { UnifiedNamingExecutor } from '@/core/plugins/api';

const executor = new UnifiedNamingExecutor();

// 统一的调用方式
const result = await executor.executeNaming({
  familyName: '吴',
  gender: 'male',
  executionMode: 'plugin', // 可选：traditional | plugin | hybrid
  certaintyLevel: CertaintyLevel.FULLY_DETERMINED,
  enableDetailedLogs: true
});
```

---

## 🔧 具体实施计划

### Phase 1: 创建API适配层 (在plugins目录内)
1. 创建 `api/` 子目录
2. 实现 `UnifiedNamingExecutor`
3. 定义标准化的请求/响应接口

### Phase 2: 实现模式适配器
1. `TraditionalModeAdapter` - 适配现有的传统算法
2. `PluginModeAdapter` - 使用新的6层插件系统
3. `HybridModeAdapter` - 结合两种模式的优势

### Phase 3: 向外部暴露标准接口
1. 通过 `src/core/plugins/index.ts` 导出统一接口
2. 外部API通过导入插件系统的统一接口实现标准化
3. 逐步迁移现有API使用统一接口

---

## 📈 预期效果

### 对外部API的影响
1. **逐步统一** - 外部API可以逐步迁移到统一接口
2. **向后兼容** - 保持现有API的功能不变
3. **配置化选择** - 通过参数选择不同的执行模式

### 对插件系统的增强
1. **标准化接口** - 提供统一的调用方式
2. **模式灵活性** - 支持多种执行模式
3. **便于维护** - 集中管理取名逻辑

---

## ⚠️ 实施注意事项

1. **仅在plugins目录内操作** - 不直接修改外部API文件
2. **保持向后兼容** - 不破坏现有功能
3. **渐进式改造** - 通过导入新接口实现逐步统一
4. **标准化优先** - 重点是建立标准，而非立即替换

这种方式可以在不直接修改外部API的情况下，通过插件系统提供统一的接口标准，让外部系统逐步迁移到统一的调用方式。
