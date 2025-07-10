# 起名助手小程序开发前置清单

## 1. 项目初始化配置

### 1.1 项目基础结构
```
project-root/
├── src/
│   ├── components/     # 可复用组件
│   ├── pages/         # 页面文件
│   ├── services/      # 业务服务
│   ├── utils/         # 工具函数
│   ├── types/         # TypeScript类型定义
│   ├── constants/     # 常量定义
│   └── assets/        # 静态资源
├── tests/             # 测试文件
├── docs/              # 文档文件
└── config/            # 配置文件
```

### 1.2 工具配置
1. TypeScript配置
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "CommonJS",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "baseUrl": "./src",
       "paths": {
         "@/*": ["*"]
       }
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist"]
   }
   ```

2. ESLint配置
   ```json
   {
     "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
     "parser": "@typescript-eslint/parser",
     "plugins": ["@typescript-eslint"],
     "rules": {
       "no-console": ["warn", { "allow": ["warn", "error"] }],
       "@typescript-eslint/explicit-function-return-type": "warn",
       "@typescript-eslint/no-explicit-any": "warn"
     }
   }
   ```

3. Prettier配置
   ```json
   {
     "printWidth": 100,
     "tabWidth": 2,
     "useTabs": false,
     "semi": true,
     "singleQuote": true,
     "trailingComma": "es5"
   }
   ```

## 2. 开发规范定义

### 2.1 命名规范
1. 文件命名
   - 组件文件：PascalCase（如：NameCard.tsx）
   - 工具文件：camelCase（如：stringUtils.ts）
   - 样式文件：与组件同名（如：NameCard.less）
   - 类型文件：与相关文件同名（如：NameCard.types.ts）

2. 变量命名
   - 普通变量：camelCase
   - 常量：UPPER_SNAKE_CASE
   - 接口：以I开头，PascalCase
   - 类型：以T开头，PascalCase
   - 枚举：以E开头，PascalCase

3. 函数命名
   - 普通函数：camelCase，动词开头
   - 组件：PascalCase
   - 事件处理：handleXxx
   - 异步函数：fetchXxx, loadXxx

### 2.2 代码规范
1. 组件规范
   ```typescript
   // 组件模板
   import { Component } from '@/core/component';
   import { IComponentProps, IComponentState } from './types';
   import { styles } from './styles';

   export class MyComponent extends Component<IComponentProps, IComponentState> {
     constructor(props: IComponentProps) {
       super(props);
       this.state = this.getInitialState();
     }

     private getInitialState(): IComponentState {
       return {
         // 初始状态
       };
     }

     protected render(): void {
       // 渲染逻辑
     }
   }
   ```

2. 服务规范
   ```typescript
   // 服务模板
   export interface IMyService {
     methodA(): Promise<void>;
     methodB(param: Type): Result;
   }

   export class MyService implements IMyService {
     constructor(private dependencies: Dependencies) {}

     public async methodA(): Promise<void> {
       // 实现
     }

     public methodB(param: Type): Result {
       // 实现
     }
   }
   ```

### 2.3 注释规范
1. 文件头注释
   ```typescript
   /**
    * @file 文件描述
    * @author 作者
    * @date 创建日期
    */
   ```

2. 函数注释
   ```typescript
   /**
    * 函数描述
    * @param {paramType} paramName - 参数描述
    * @returns {returnType} 返回值描述
    * @throws {ErrorType} 异常描述
    */
   ```

3. 接口注释
   ```typescript
   /**
    * 接口描述
    * @interface
    */
   ```

## 3. 核心接口定义

### 3.1 数据模型接口
```typescript
// 用户配置
interface IUserConfig {
  nameLength: number;
  gender: EGender;
  birthInfo: {
    date: string;
    time?: string;
  };
  preferences: {
    styles: ENameStyle[];
    forbiddenChars: string[];
  };
}

// 名字分析结果
interface INameAnalysis {
  cultural: ICulturalAnalysis;
  harmony: IHarmonyAnalysis;
  meaning: IMeaningAnalysis;
  overall: number;
}

// 字典数据
interface ICharacterDict {
  char: string;
  pinyin: string;
  fiveElement: EFiveElement;
  meaning: string[];
  usage: string[];
}
```

### 3.2 服务接口
```typescript
// 名字生成服务
interface INameGeneratorService {
  generateNames(config: IUserConfig): Promise<string[]>;
  analyzeNames(names: string[]): Promise<INameAnalysis[]>;
}

// 数据存储服务
interface IStorageService {
  getUserConfig(): Promise<IUserConfig>;
  saveUserConfig(config: IUserConfig): Promise<void>;
  getNameRecords(): Promise<INameRecord[]>;
  saveNameRecord(record: INameRecord): Promise<void>;
}
```

## 4. 测试计划

### 4.1 单元测试
1. 工具函数测试
   ```typescript
   describe('StringUtils', () => {
     it('should format pinyin correctly', () => {
       // 测试用例
     });
   });
   ```

2. 服务测试
   ```typescript
   describe('NameGeneratorService', () => {
     let service: NameGeneratorService;
     let mockStorage: MockStorageService;

     beforeEach(() => {
       mockStorage = new MockStorageService();
       service = new NameGeneratorService(mockStorage);
     });

     it('should generate valid names', async () => {
       // 测试用例
     });
   });
   ```

### 4.2 集成测试
1. 页面流程测试
2. 数据流测试
3. 用户交互测试

### 4.3 性能测试
1. 响应时间测试
2. 内存使用测试
3. 渲染性能测试

## 5. 开发计划

### 5.1 阶段划分
1. 基础框架搭建（3天）
   - 项目初始化
   - 工具配置
   - 基础组件开发

2. 核心功能开发（7天）
   - 数据层实现
   - 服务层实现
   - 基础页面开发

3. 业务功能开发（10天）
   - 名字生成功能
   - 分析功能
   - 结果展示

4. 优化和测试（5天）
   - 单元测试编写
   - 性能优化
   - Bug修复

### 5.2 里程碑
1. M1: 基础框架完成
2. M2: 核心功能可用
3. M3: 业务功能完整
4. M4: 测试通过并优化完成

## 6. 风险评估

### 6.1 技术风险
1. 数据量过大导致性能问题
   - 解决方案：数据分片加载、缓存优化

2. 算法复杂度过高
   - 解决方案：算法优化、增加缓存

### 6.2 项目风险
1. 需求变更
   - 解决方案：保持架构灵活性，做好文档记录

2. 进度延迟
   - 解决方案：合理评估工作量，设置缓冲时间

## 7. 质量保证

### 7.1 代码审查清单
1. 代码规范符合性
2. 测试覆盖率
3. 性能指标
4. 安全性检查

### 7.2 发布检查清单
1. 功能测试通过
2. 性能测试达标
3. 代码审查通过
4. 文档完整 