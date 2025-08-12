# 插件系统核心架构

## 概述

这是取名系统插件化重构的核心基础设施，提供了完整的插件管理、依赖解析、配置管理和错误处理机制。

## 架构组件

### 1. 核心接口 (`interfaces/`)

- **`NamingPlugin`**: 所有插件必须实现的基础接口
- 定义了插件的生命周期、配置、依赖关系等核心概念

### 2. 核心类 (`core/`)

- **`PluginContainer`**: 插件容器，负责插件的注册、管理和执行
- **`DependencyGraph`**: 依赖图管理，处理插件间的依赖关系和循环依赖检测
- **`PluginRegistry`**: 插件注册表，管理插件的存储、查找和生命周期
- **`ConfigManager`**: 配置管理器，处理插件配置的加载、验证和管理
- **`ErrorHandler`**: 错误处理器，提供统一的错误处理和日志记录

### 3. 数据类型 (`types/`)

- **`StandardTypes`**: 标准化的输入输出数据模型
- 定义了插件间通信的标准数据格式

## 快速开始

### 1. 创建插件

```typescript
import { NamingPlugin, PluginMetadata, PluginConfig, PluginContext } from './interfaces/NamingPlugin';

export class MyPlugin implements NamingPlugin {
  async getMetadata(): Promise<PluginMetadata> {
    return {
      id: 'my-plugin',
      name: '我的插件',
      description: '这是一个示例插件',
      category: 'calculation',
      tags: ['example', 'demo']
    };
  }

  async getConfig(): Promise<PluginConfig> {
    return {
      enabled: true,
      priority: 100,
      timeout: 30000,
      retryCount: 3
    };
  }

  async getDependencies(): Promise<PluginDependency[]> {
    return []; // 无依赖
  }

  async validate(): Promise<ValidationResult> {
    return { valid: true, errors: [] };
  }

  async process(input: any, context: PluginContext): Promise<any> {
    // 插件的主要逻辑
    return { result: 'processed' };
  }

  async cleanup?(): Promise<void> {
    // 清理资源
  }
}
```

### 2. 使用插件容器

```typescript
import { PluginContainer, DEFAULT_CONTAINER_CONFIG } from './core/PluginContainer';
import { MyPlugin } from './MyPlugin';

// 创建插件容器
const container = new PluginContainer(DEFAULT_CONTAINER_CONFIG);

// 注册插件
const plugin = new MyPlugin();
const result = await container.registerPlugin(plugin);

if (result.valid) {
  console.log('插件注册成功');
} else {
  console.error('插件注册失败:', result.errors);
}
```

### 3. 执行插件链

```typescript
import { StandardInput, ProcessingContext } from './types/StandardTypes';

// 准备输入数据
const input: StandardInput = {
  basicInfo: {
    gender: 'male',
    birthDate: '2024-01-01'
  }
};

// 创建处理上下文
const context: ProcessingContext = {
  requestId: 'req-001',
  input,
  intermediateResults: new Map(),
  pluginResults: new Map(),
  startTime: Date.now(),
  getResult: (key) => context.intermediateResults.get(key) || null,
  setResult: (key, value) => context.intermediateResults.set(key, value),
  getPluginResult: (pluginId) => context.pluginResults.get(pluginId) || null,
  setPluginResult: (pluginId, value) => context.pluginResults.set(pluginId, value),
  log: (level, message, data) => console.log(`[${level}] ${message}`, data),
  updateProgress: (pluginId, progress) => {},
  getProgress: () => ({})
};

// 执行插件链
try {
  const results = await container.executePluginChain(input, context);
  console.log('执行结果:', results);
} catch (error) {
  console.error('执行失败:', error);
}
```

## 配置管理

### 全局配置

```typescript
import { ConfigManager, DEFAULT_GLOBAL_CONFIG } from './core/ConfigManager';

const configManager = new ConfigManager({
  ...DEFAULT_GLOBAL_CONFIG,
  plugins: {
    ...DEFAULT_GLOBAL_CONFIG.plugins,
    scanPaths: ['./custom-plugins', './src/plugins']
  }
});

// 加载配置
await configManager.loadGlobalConfig('./config/plugins.json');
await configManager.loadPluginManifests();
```

### 插件配置

```typescript
// 获取插件配置
const config = configManager.getPluginConfig('my-plugin');

// 更新插件配置
configManager.updatePluginConfig('my-plugin', {
  priority: 200,
  timeout: 60000
});
```

## 错误处理

### 使用错误处理器

```typescript
import { ErrorHandler, PluginSystemError } from './core/ErrorHandler';

const errorHandler = new ErrorHandler();

// 添加错误监听器
errorHandler.addErrorListener((error: PluginSystemError) => {
  console.error('插件系统错误:', error.getUserMessage());
});

// 处理错误
try {
  // 执行可能出错的代码
} catch (error) {
  if (error instanceof PluginSystemError) {
    errorHandler.handleError(error);
  }
}
```

### 自定义错误

```typescript
import { PluginSystemError, ErrorType, ErrorSeverity } from './core/ErrorHandler';

class MyCustomError extends PluginSystemError {
  constructor(message: string, details?: any) {
    super(
      message,
      ErrorType.PLUGIN_EXECUTION_FAILED,
      ErrorSeverity.MEDIUM,
      'MY_CUSTOM_ERROR',
      details
    );
  }
}
```

## 依赖管理

### 定义插件依赖

```typescript
async getDependencies(): Promise<PluginDependency[]> {
  return [
    { pluginId: 'base-utils', required: true },
    { pluginId: 'data-processor', required: true },
    { pluginId: 'optional-helper', required: false }
  ];
}
```

### 依赖图查询

```typescript
import { DependencyGraph } from './core/DependencyGraph';

const graph = new DependencyGraph();

// 添加节点
graph.addNode('plugin-a', []);
graph.addNode('plugin-b', [{ pluginId: 'plugin-a', required: true }]);

// 检查循环依赖
if (graph.hasCircularDependency()) {
  console.error('检测到循环依赖');
}

// 获取执行顺序
const order = graph.getTopologicalOrder();
console.log('插件执行顺序:', order);
```

## 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test DependencyGraph.test.ts

# 运行测试并生成覆盖率报告
npm run test:coverage
```

### 编写测试

```typescript
import { DependencyGraph } from '../core/DependencyGraph';

describe('DependencyGraph', () => {
  let graph: DependencyGraph;

  beforeEach(() => {
    graph = new DependencyGraph();
  });

  it('应该正确添加节点', () => {
    graph.addNode('test-plugin', []);
    const status = graph.getStatus();
    expect(status.totalNodes).toBe(1);
  });
});
```

## 最佳实践

### 1. 插件设计原则

- **单一职责**: 每个插件只负责一个特定功能
- **松耦合**: 插件间通过标准接口通信，避免直接依赖
- **可配置**: 提供灵活的配置选项
- **错误处理**: 优雅处理错误，提供有意义的错误信息

### 2. 性能优化

- **异步处理**: 使用异步操作避免阻塞
- **资源管理**: 及时清理资源，避免内存泄漏
- **缓存策略**: 合理使用缓存提高性能
- **超时控制**: 设置合理的超时时间

### 3. 安全性

- **输入验证**: 严格验证所有输入数据
- **权限控制**: 实现适当的权限检查
- **错误信息**: 避免暴露敏感信息
- **资源限制**: 限制插件的资源使用

## 故障排除

### 常见问题

1. **插件注册失败**
   - 检查插件是否实现了所有必需的方法
   - 验证插件元数据的完整性
   - 检查依赖关系是否正确

2. **循环依赖错误**
   - 使用依赖图工具分析依赖关系
   - 重新设计插件架构，消除循环依赖
   - 考虑使用事件驱动模式

3. **插件执行超时**
   - 检查插件的超时配置
   - 优化插件的执行逻辑
   - 考虑使用异步处理

4. **配置加载失败**
   - 验证配置文件格式
   - 检查文件路径和权限
   - 查看详细的错误日志

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。
