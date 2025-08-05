# Chinese Baby Names 项目设计文档

## 1. 项目概述

### 1.1 项目简介
Chinese Baby Names 是一个基于传统文化的中文宝宝起名系统，集成了三才五格、五行理论、古典诗词等多种传统取名原理，为用户提供科学、文化底蕴深厚的中文姓名生成服务。

### 1.2 核心理念
- **传统文化传承**：基于《周易》、《楚辞》、唐诗宋词等传统文化典籍
- **数理学说应用**：运用三才五格、笔画数理、五行配合等传统姓名学理论
- **智能化生成**：结合现代算法与传统文化，智能生成高质量姓名候选
- **个性化定制**：支持性别筛选、笔画范围、避讳字符等个性化配置

### 1.3 参考依据
1. [中文人名语料库（Chinese-Names-Corpus）](https://github.com/wainshine/Chinese-Names-Corpus)
2. [PiPiName](https://github.com/NanBox/PiPiName)
3. [命运起名(Fate)](https://github.com/babyname/fate)

## 2. 取名原理体系

### 2.1 三才五格理论

#### 2.1.1 五格构成
- **天格**：祖先留下的，对人影响不大
  - 单姓：姓的笔画数 + 1
  - 复姓：姓氏笔画数相加
- **人格**：又称主格，是姓名的中心点，主管人一生命运
  - 单姓：姓的笔画数 + 名第一字笔画数
  - 复姓：姓的第二字笔画数 + 名第一字笔画数
- **地格**：前运，主管人中年以前的活动力
  - 单名：名的笔画数 + 1
  - 双名：名字笔画数相加
- **总格**：后运，主管中年至老年的命运
  - 姓名总笔画数
- **外格**：副运，主管命运之灵力
  - 单姓单名：2
  - 单姓复名：1 + 名第二字笔画数
  - 复姓单名：姓第一字笔画数 + 1
  - 复姓复名：姓第一字笔画数 + 名第二字笔画数

#### 2.1.2 数理分类
根据81数理理论，将笔画数分为三类：
- **大吉数理**：利于人生发展的吉利数理
- **中吉数理**：相对平稳的数理组合
- **小吉数理**：需要谨慎考虑的数理

### 2.2 三才配置理论

#### 2.2.1 五行属性
根据天格、人格、地格的数理，对应五行属性：
- **金**：1、2尾数
- **木**：3、4尾数
- **水**：5、6尾数
- **火**：7、8尾数
- **土**：9、0尾数

#### 2.2.2 三才相生相克
- **相生关系**：金生水→水生木→木生火→火生土→土生金
- **相克关系**：金克木→木克土→土克水→水克火→火克金

### 2.3 笔画特殊规则

#### 2.3.1 偏旁部首调整
系统考虑传统康熙字典笔画计算规则：
- **氵（水）**：三点水算四画
- **扌（手）**：提手旁算四画
- **月（肉）**：月字旁算肉旁六画
- **艹（草）**：草字头算六画
- **辶（走）**：走之旁算七画
- **阝（左阜）**：左阜算八画
- **邑（右邑）**：右邑算七画
- **王（玉）**：王字旁算五画
- **礻（示）**：示字旁算五画
- **衤（衣）**：衣字旁算六画
- **犭（犬）**：犬字旁算四画
- **忄（心）**：竖心旁算四画

#### 2.3.2 数字特殊处理
汉字数字按实际数值计算：
- 一→1、二→2、三→3、四→4、五→5
- 六→6、七→7、八→8、九→9、十→10

## 3. 系统架构设计

### 3.1 模块架构

```
chinese-baby-names/
├── src/
│   ├── main.ts                 # 主入口和配置接口
│   ├── index.ts               # 导出模块
│   ├── enums/                 # 枚举定义
│   │   ├── Gender.ts          # 性别枚举
│   │   ├── PoetryType.ts      # 诗词类型枚举
│   │   └── FiveElement.ts     # 五行枚举
│   ├── name/                  # 姓名生成核心
│   │   ├── NameGenerator.ts   # 姓名生成器
│   │   ├── name.ts           # 姓名对象定义
│   │   └── database.ts       # 数据库管理
│   ├── stroke/               # 笔画计算
│   │   ├── stroke.ts         # 笔画计算核心
│   │   └── constant.ts       # 笔画常量配置
│   ├── wuxing/              # 五行三才
│   │   ├── sancai.ts        # 三才配置
│   │   ├── wuge.ts          # 五格计算
│   │   └── constant.ts      # 五行常量
│   └── utils/               # 工具函数
│       ├── isChinese.ts     # 中文字符判断
│       ├── opencc.ts        # 简繁转换
│       └── ...
├── database/                # 数据文件
│   ├── chuci/              # 楚辞数据
│   ├── poet.tang/          # 唐诗数据  
│   ├── poet.song/          # 宋诗数据
│   ├── ci.song/            # 宋词数据
│   ├── lunyu/              # 论语数据
│   ├── shijing/            # 诗经数据
│   ├── names.dat           # 姓名数据
│   ├── ai-names.dat        # AI生成名字数据
│   └── char-split.dat      # 字符拆分数据
└── test/                   # 测试文件
```

### 3.2 核心类设计

#### 3.2.1 BabyName 主类
```typescript
class BabyName {
  // 静态方法，生成姓名
  static generate(config: GeneratorConfig): NameObject[]
  
  // 私有构造函数
  private constructor(config: GeneratorConfig)
  
  // 私有生成方法
  private generate(): NameObject[]
}
```

#### 3.2.2 NameGenerator 生成器
```typescript
class NameGenerator {
  // 批量生成姓名
  static batch(config: GeneratorConfig, count?: number): NameObject[]
  
  // 检查并添加姓名
  private checkAndAddNames(sentence: string, title: string): boolean
  
  // 姓名验证
  private checkName(babyName: string): boolean
  
  // 添加姓名到候选列表
  private pushName(babyName: string, sentence: string, title: string, picks: number[]): boolean
}
```

#### 3.2.3 Database 数据管理
```typescript
class Database {
  // 静态属性
  static strokeDirectory: Record<string, number>     // 笔画字典
  static splitDirectory: Record<string, string[]>    // 拆分字典
  static namesDirectory: Record<string, Gender>      // 姓名性别字典
  static aiNames: AINameData[]                       // AI生成姓名
  
  // 获取JSON数据
  static getJsonData<T>(config: JsonDataConfig<T>): void
}
```

## 4. 数据源体系

### 4.1 古典文学数据源

#### 4.1.1 诗经（PoetryType.SHI_JING）
- 中国最早的诗歌总集
- 包含风、雅、颂三部分
- 提供典雅、古朴的取名灵感

#### 4.1.2 楚辞（PoetryType.CHU_CI）
- 以屈原为代表的楚国诗歌
- 浪漫主义色彩浓厚
- 适合富有想象力的姓名

#### 4.1.3 论语（PoetryType.LUN_YU）
- 儒家经典文献
- 体现智慧和品德
- 适合寓意深刻的姓名

#### 4.1.4 唐诗（PoetryType.TANG_SHI）
- 唐代诗歌黄金时期作品
- 意境优美，韵律和谐
- 提供大量优质取名素材

#### 4.1.5 宋诗（PoetryType.SONG_SHI）
- 宋代诗歌作品
- 理趣深刻，风格多样
- 适合富有哲理的姓名

#### 4.1.6 宋词（PoetryType.SONG_CI）
- 宋代词作精选
- 情感丰富，意境深远
- 适合富有诗意的姓名

### 4.2 姓名数据源

#### 4.2.1 传统姓名库（names.dat）
- 收集整理的传统中文姓名
- 包含性别标识
- 已验证的文化适宜性

#### 4.2.2 AI生成姓名库（ai-names.dat）
- 基于AI算法生成的现代姓名
- 符合当代命名习惯
- 提供更多样化选择

#### 4.2.3 笔画数据（stroke.dat）
- 汉字康熙字典笔画数
- 支持简繁体转换
- 精确的笔画计算基础

## 5. 配置参数体系

### 5.1 GeneratorConfig 接口
```typescript
interface GeneratorConfig {
  // 必选参数
  surname: string;              // 姓氏
  
  // 可选参数
  source?: PoetryType[];        // 数据源类型
  dislikeWords?: string[];      // 避讳字符
  minStrokeCount?: number;      // 最小笔画数（默认3）
  maxStrokeCount?: number;      // 最大笔画数（默认30）
  allowGeneral?: boolean;       // 允许中吉（默认false）
  gender?: Gender;              // 性别筛选
  count?: number;               // 生成数量（默认1）
  singleNameWeight: number;     // 单名权重（百分比）
}
```

### 5.2 性别枚举
```typescript
enum Gender {
  BOY = '男',
  GIRL = '女'
}
```

### 5.3 诗词类型枚举
```typescript
enum PoetryType {
  SHI_JING = 'shijing',   // 诗经
  CHU_CI = 'chuci',       // 楚辞
  LUN_YU = 'lunyu',       // 论语
  TANG_SHI = 'tangshi',   // 唐诗
  SONG_SHI = 'songshi',   // 宋诗
  SONG_CI = 'songci'      // 宋词
}
```

## 6. 输出结果体系

### 6.1 NameObject 接口
```typescript
interface NameObject {
  name: string;           // 生成的姓名
  sentence: string;       // 来源句子
  title: string;          // 来源标题
  picks: number[];        // 选取字符位置
  gender: Gender;         // 性别属性
}
```

### 6.2 三才五格分析结果
```typescript
interface SancaiWuge {
  tian: number;           // 天格数理
  ren: number;            // 人格数理
  di: number;             // 地格数理
  zong: number;           // 总格数理
  wai: number;            // 外格数理
  renStrokeType: string;  // 人格吉凶
  diStrokeType: string;   // 地格吉凶
  zongStrokeType: string; // 总格吉凶
  waiStrokeType: string;  // 外格吉凶
  sancai: string;         // 三才配置
  sancaiType: string;     // 三才吉凶
}
```

## 7. 质量控制体系

### 7.1 姓名验证规则
1. **笔画范围验证**：确保每个字的笔画数在指定范围内
2. **避讳字符过滤**：排除用户指定的不喜欢字符
3. **重复检查**：确保生成的姓名不重复
4. **性别匹配**：根据配置筛选对应性别的姓名
5. **姓氏冲突检查**：避免姓名与姓氏相同

### 7.2 数理吉凶判断
1. **五格数理评估**：人格、地格、总格都必须为吉利数理
2. **三才配置检查**：天人地三才必须为相生或平衡配置
3. **容错机制**：支持中吉配置选项，增加候选范围

### 7.3 文化适宜性保证
1. **来源追溯**：每个姓名都标注具体的文学出处
2. **上下文语境**：确保取名字符在原文中具有正面含义
3. **传统文化符合性**：遵循中华传统文化的审美标准

## 8. 扩展性设计

### 8.1 数据源扩展
- 模块化的数据源配置，支持新增古典文学作品
- 标准化的数据格式，便于集成新的文本资源
- 灵活的权重配置，支持不同数据源的优先级调整

### 8.2 算法扩展
- 插件化的验证规则，支持自定义验证逻辑
- 可配置的评分体系，支持多维度姓名评估
- 开放的接口设计，便于集成新的取名算法

### 8.3 个性化扩展
- 用户偏好学习机制
- 地域文化差异适配
- 现代化命名趋势跟踪

这个设计文档为Chinese Baby Names项目提供了完整的理论基础和技术架构指导，确保了系统的科学性、文化性和实用性的完美结合。