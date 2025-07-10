# Cursor开发规则和最佳实践

## 1. 工作区设置

### 1.1 文件组织
```
.vscode/
├── settings.json          # VSCode/Cursor配置
├── extensions.json        # 推荐扩展
└── cursor-snippets.json   # 代码片段
```

### 1.2 Cursor配置
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "files.associations": {
    "*.wxml": "html",
    "*.wxss": "css"
  }
}
```

## 2. AI辅助开发规范

### 2.1 代码生成规则
1. 使用AI生成代码时的检查清单：
   - 确保生成的代码符合项目TypeScript类型定义
   - 验证生成的代码是否包含必要的错误处理
   - 检查生成的代码是否遵循项目的命名规范
   - 确保生成的组件包含必要的注释和文档

2. 代码审查重点：
   - 类型安全性
   - 错误处理完整性
   - 命名规范符合性
   - 注释完整性

### 2.2 AI提示模板
1. 组件生成模板：
```
生成一个TypeScript的小程序组件，要求：
- 组件名：[组件名]
- 功能描述：[具体功能]
- 包含Props类型定义
- 包含必要的生命周期方法
- 包含错误处理
- 遵循项目的命名规范
```

2. 工具函数生成模板：
```
生成一个TypeScript的工具函数，要求：
- 函数名：[函数名]
- 功能描述：[具体功能]
- 包含参数类型定义
- 包含返回值类型定义
- 包含错误处理
- 包含单元测试
```

## 3. 代码片段管理

### 3.1 常用代码片段
1. 组件模板：
```json
{
  "Component Template": {
    "prefix": "wxcomp",
    "body": [
      "import { Component } from '@/core/component';",
      "import { I${1:Name}Props, I${1:Name}State } from './types';",
      "import { styles } from './styles';",
      "",
      "export class ${1:Name} extends Component<I${1:Name}Props, I${1:Name}State> {",
      "  constructor(props: I${1:Name}Props) {",
      "    super(props);",
      "    this.state = this.getInitialState();",
      "  }",
      "",
      "  private getInitialState(): I${1:Name}State {",
      "    return {",
      "      $2",
      "    };",
      "  }",
      "",
      "  protected render(): void {",
      "    $3",
      "  }",
      "}"
    ],
    "description": "创建小程序组件模板"
  }
}
```

2. 服务模板：
```json
{
  "Service Template": {
    "prefix": "wxservice",
    "body": [
      "import { IService } from '@/core/interfaces';",
      "",
      "export interface I${1:Name}Service extends IService {",
      "  ${2:methodName}(): Promise<void>;",
      "}",
      "",
      "export class ${1:Name}Service implements I${1:Name}Service {",
      "  constructor(private dependencies: any) {}",
      "",
      "  public async ${2:methodName}(): Promise<void> {",
      "    try {",
      "      $3",
      "    } catch (error) {",
      "      console.error('${1:Name}Service.${2:methodName} error:', error);",
      "      throw error;",
      "    }",
      "  }",
      "}"
    ],
    "description": "创建服务类模板"
  }
}
```

## 4. 调试和测试规范

### 4.1 调试配置
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "miniprogram",
      "request": "launch",
      "name": "调试小程序",
      "sourceMapPathOverrides": {
        "webpack:///./*": "${workspaceFolder}/*"
      }
    }
  ]
}
```

### 4.2 测试配置
```json
{
  "jest.autoRun": {
    "watch": false,
    "onSave": "test-file"
  },
  "jest.testExplorer": {
    "enabled": true,
    "showInlineError": true
  }
}
```

## 5. 代码审查清单

### 5.1 提交前检查
1. 代码格式化
   - 使用Cursor的格式化功能
   - 确保所有文件都已格式化
   - 检查是否有未解决的格式化冲突

2. 类型检查
   - 运行TypeScript编译器检查
   - 确保没有any类型
   - 验证类型定义的完整性

3. 测试验证
   - 运行单元测试
   - 检查测试覆盖率
   - 验证关键功能测试用例

### 5.2 代码审查重点
1. 架构一致性
   - 遵循分层架构
   - 保持依赖注入的一致性
   - 确保组件职责单一

2. 性能考虑
   - 检查不必要的计算
   - 验证缓存使用
   - 确认异步操作的合理性

3. 安全性
   - 检查数据验证
   - 确认错误处理
   - 验证敏感数据处理

## 6. 协作规范

### 6.1 分支管理
1. 分支命名
   - 功能分支：feature/[功能名]
   - 修复分支：fix/[问题描述]
   - 优化分支：optimize/[优化点]

2. 提交规范
   - feat: 新功能
   - fix: 修复问题
   - docs: 文档更新
   - style: 代码格式
   - refactor: 重构
   - test: 测试相关
   - chore: 构建相关

### 6.2 代码评审流程
1. 提交前自查
   - 运行所有检查脚本
   - 完成自测
   - 更新文档

2. 评审重点
   - 代码质量
   - 测试覆盖
   - 性能影响
   - 安全考虑

## 7. 性能优化指南

### 7.1 开发阶段优化
1. 代码层面
   - 使用适当的数据结构
   - 避免不必要的计算
   - 合理使用缓存

2. 资源层面
   - 图片资源优化
   - 样式文件精简
   - 组件按需加载

### 7.2 构建优化
1. 打包配置
   - 移除未使用的代码
   - 压缩资源文件
   - 合并相似文件

2. 缓存策略
   - 合理使用Storage
   - 实现数据预加载
   - 管理缓存生命周期

## 8. 文档维护规范

### 8.1 代码文档
1. 文件头部注释
2. 接口文档
3. 函数文档
4. 复杂逻辑说明

### 8.2 项目文档
1. README更新
2. 架构文档
3. API文档
4. 部署文档 