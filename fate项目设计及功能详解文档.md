# Fate 项目设计及功能详解文档

## 项目概述

Fate 是一个基于传统中国姓名学理论的现代化取名工具，采用 Go 语言开发。项目整合了多种传统取名算法，包括八字命理、三才五格、生肖用字、周易卦象等，为用户提供科学化的中文取名解决方案。

## 系统架构

### 整体架构图

系统采用分层架构设计，从输入层到输出层共分为四个主要层次：

## 核心功能模块分析

### 1. 主控制器 (fate.go)

#### 核心接口定义
```go
type Fate interface {
    MakeName(ctx context.Context) (e error)
    XiYong() *XiYong
    RunInit() (e error)
    RegisterHandle(outputFunc HandleOutputFunc)
}
```

#### 主要实现结构
```go
type fateImpl struct {
    config   *config.Config    // 配置信息
    db       Database          // 数据库接口
    out      Information       // 输出接口
    born     chronos.Calendar  // 出生时间
    last     []string          // 姓氏字符
    lastChar []*Character      // 姓氏字符对象
    names    []*Name           // 生成的姓名列表
    nameType int              // 姓名类型
    sex      Sex               // 性别
    debug    bool              // 调试模式
    baZi     *BaZi            // 八字对象
    zodiac   *Zodiac          // 生肖对象
    handle   HandleOutputFunc // 输出处理函数
}
```

#### 核心方法详解

##### MakeName() 方法
这是整个系统的核心入口方法，负责协调各个模块完成取名流程：

1. **初始化阶段**
   - 输出帮助信息
   - 初始化文件头
   - 运行初始化检查
   - 验证五格数据完整性

2. **字符获取阶段**
   - 调用 `getLastCharacter()` 获取姓氏字符信息
   - 从数据库查询字符的笔画、五行等属性

3. **姓名生成阶段**
   - 启动协程调用 `getWugeName()` 生成候选姓名
   - 使用通道 (channel) 进行异步数据传输

4. **筛选过滤阶段**
   - **喜用神筛选**: 调用 `filterXiYong()` 检查名字五行是否补足八字所需
   - **生肖筛选**: 调用 `filterZodiac()` 检查字符是否符合生肖用字要求
   - **卦象筛选**: 调用 `filterYao()` 检查八卦是否为吉

5. **结果输出阶段**
   - 格式化输出姓名信息
   - 支持多种输出格式

### 2. 八字分析模块 (bazi.go)

#### 核心原理
八字学说认为人的命运由出生时的年、月、日、时的天干地支组合决定。系统通过分析八字的五行强弱，确定喜用神。

#### 数据结构
```go
// 天干强度表 - 12个月 x 10个天干
var tiangan = [][]int{
    {1200, 1200, 1000, 1000, 1000, 1000, 1000, 1000, 1200, 1200},
    // ... 更多数据
}

// 地支强度表 - 复杂的嵌套结构，包含藏干信息
var dizhi = []map[string][]int{
    {"癸": {1200, 1100, 1000, ...}},
    // ... 更多数据
}
```

#### 关键算法

##### XiYong() 喜用神计算
1. **获取八字**: 通过 chronos 库计算出生时间的天干地支
2. **分析强弱**: 计算各五行在当月的强度值
3. **确定用神**: 
   - 如果某五行过强，则取克制它的五行为用神
   - 如果某五行过弱，则取生扶它的五行为用神
4. **平衡原则**: 追求五行相对平衡

### 3. 五格计算模块 (wuge.go)

#### 五格理论基础
五格是姓名学的核心理论，包括：
- **天格**: 姓氏笔画数
- **人格**: 姓的最后一字 + 名的第一字
- **地格**: 名字的笔画数
- **外格**: 姓的第一字 + 名的最后一字
- **总格**: 全名总笔画数

#### 计算公式

##### CalcWuGe() 核心方法
```go
func CalcWuGe(l1, l2, f1, f2 int) *WuGe {
    return &WuGe{
        tianGe: tianGe(l1, l2, f1, f2),
        renGe:  renGe(l1, l2, f1, f2),
        diGe:   diGe(l1, l2, f1, f2),
        waiGe:  waiGe(l1, l2, f1, f2),
        zongGe: zongGe(l1, l2, f1, f2),
    }
}
```

##### 各格计算方法
1. **tianGe() 天格计算**
   - 单姓：姓氏笔画 + 1
   - 复姓：两个姓氏字笔画相加

2. **renGe() 人格计算**
   - 单姓：姓氏笔画 + 名字第一字笔画
   - 复姓：姓氏第二字 + 名字第一字笔画

3. **diGe() 地格计算**
   - 单名：名字笔画 + 1
   - 双名：两个名字笔画相加

4. **waiGe() 外格计算**
   - 单姓单名：1 + 1 = 2
   - 单姓双名：1 + 名字最后一字笔画
   - 复姓单名：姓氏第一字 + 1
   - 复姓双名：姓氏第一字 + 名字最后一字

5. **zongGe() 总格计算**
   - 所有字的笔画数相加

#### WuGeLucky 数据结构
```go
type WuGeLucky struct {
    ID           string `xorm:"pk id"`
    LastStroke1  int    `xorm:"last_stroke1"`   // 姓氏第一字笔画
    LastStroke2  int    `xorm:"last_stroke2"`   // 姓氏第二字笔画  
    FirstStroke1 int    `xorm:"first_stroke1"`  // 名字第一字笔画
    FirstStroke2 int    `xorm:"first_stroke2"`  // 名字第二字笔画
    TianGe       int    `xorm:"tian_ge"`        // 天格
    RenGe        int    `xorm:"ren_ge"`         // 人格
    DiGe         int    `xorm:"di_ge"`          // 地格
    WaiGe        int    `xorm:"wai_ge"`         // 外格
    ZongGe       int    `xorm:"zong_ge"`        // 总格
    ZongSex      bool   `xorm:"zong_sex"`       // 性别限制
}
```

### 4. 三才分析模块 (sancai.go)

#### 三才理论
三才指天格、人格、地格三者的五行属性关系。通过笔画数的个位数确定五行：
- 1,2 → 木
- 3,4 → 火  
- 5,6 → 土
- 7,8 → 金
- 9,0 → 水

#### 核心方法

##### NewSanCai() 构造函数
```go
func NewSanCai(tian, ren, di int) *SanCai {
    return &SanCai{
        tian: NumberToWuXing(tian % 10),
        ren:  NumberToWuXing(ren % 10),
        di:   NumberToWuXing(di % 10),
    }
}
```

##### Check() 吉凶检查
验证三才五行是否相生：
1. 获取三才的五行属性
2. 检查天→人、人→地的五行关系
3. 相生为吉，相克为凶

### 5. 生肖匹配模块 (zodiac.go)

#### 生肖用字理论
根据十二生肖的特性，确定适合和忌用的字形、部首：

##### 生肖常量定义
```go
const (
    ZodiacRat     = "鼠"
    ZodiacCow     = "牛" 
    ZodiacTiger   = "虎"
    ZodiacRabbit  = "兔"
    ZodiacDragon  = "龙"
    ZodiacSnake   = "蛇"
    ZodiacHorse   = "马"
    ZodiacSheep   = "羊"
    ZodiacMonkey  = "猴"
    ZodiacChicken = "鸡"
    ZodiacDog     = "狗"
    ZodiacPig     = "猪"
)
```

##### 字符匹配算法
`filterZodiac()` 方法通过以下步骤验证字符是否适合生肖：
1. 根据出生年份确定生肖
2. 获取生肖的喜用和忌用字符列表
3. 检查候选字符是否在忌用列表中
4. 返回匹配结果

### 6. 周易卦象模块

#### 卦象计算原理
使用姓名笔画数生成周易六十四卦：

##### 核心算法
```go
func (n *Name) BaGua() *yi.Yi {
    if n.baGua == nil {
        lastSize := len(n.LastName)
        shang := getStroke(n.LastName[0])  // 上卦
        if lastSize > 1 {
            shang += getStroke(n.LastName[1])
        }
        xia := getStroke(n.FirstName[0]) + getStroke(n.FirstName[1])  // 下卦
        n.baGua = yi.NumberQiGua(xia, shang, shang+xia)  // 生成卦象
    }
    return n.baGua
}
```

##### 卦象吉凶判断
通过分析本卦和变卦的爻辞，判断卦象的吉凶属性。

### 7. 字符处理模块 (character.go)

#### 字符数据结构
```go
type Character struct {
    Hash                     string   // 唯一标识
    PinYin                   []string // 拼音数组
    Ch                       string   // 汉字
    ScienceStroke            int      // 科学笔画
    Radical                  string   // 部首
    RadicalStroke            int      // 部首笔画
    Stroke                   int      // 总笔画数
    IsKangXi                 bool     // 是否康熙字典字
    KangXi                   string   // 康熙字形
    KangXiStroke             int      // 康熙笔画
    SimpleRadical            string   // 简体部首
    SimpleRadicalStroke      int      // 简体部首笔画
    SimpleTotalStroke        int      // 简体总笔画
    TraditionalRadical       string   // 繁体部首
    TraditionalRadicalStroke int      // 繁体部首笔画
    TraditionalTotalStroke   int      // 繁体总笔画
    NameScience              bool     // 姓名学适用
    WuXing                   string   // 五行属性
    Lucky                    string   // 吉凶寓意
    Regular                  bool     // 是否常用字
    TraditionalCharacter     []string // 繁体字变体
    VariantCharacter         []string // 异体字
    Comment                  []string // 字义解释
}
```

#### 核心查询方法

##### Stoker() 笔画查询
```go
func Stoker(s int, options ...CharacterOptions) func(engine *xorm.Engine) *xorm.Session {
    return func(engine *xorm.Engine) *xorm.Session {
        session := engine.Where("pin_yin IS NOT NULL").
            And(builder.Eq{"science_stroke": s})
        for _, option := range options {
            session = option(session)
        }
        return session
    }
}
```

##### Char() 字符查询  
支持通过简体、繁体、康熙字形查询字符信息。

### 8. 大衍数算法 (dayan.go)

#### 大衍数理论
基于《周易》大衍之数，将1-81数字对应不同的吉凶含义：

##### 数据结构示例
```go
var daYanList = [81]DaYan{
    {Number: 1, Lucky: "吉", SkyNine: "太极之数", Comment: "太极之数，万物开泰，生发无穷，利禄亨通。"},
    {Number: 2, Lucky: "凶", SkyNine: "两仪之数", Comment: "两仪之数，混沌未开，进退保守，志望难达。"},
    // ... 更多数据
}
```

##### GetDaYan() 查询方法
根据笔画数获取对应的大衍数含义，用于判断五格的吉凶。

## 数据库设计

### 主要数据表

#### characters 表
存储汉字的详细信息，包括笔画、拼音、五行、部首等属性。

#### wu_ge_lucky 表  
预计算的五格组合数据，提高查询效率。

#### 数据库接口设计
```go
type Database interface {
    Sync(v ...interface{}) error
    CountWuGeLucky() (n int64, e error)
    InsertOrUpdateWuGeLucky(lucky *WuGeLucky) (n int64, e error)
    GetCharacter(fn func(engine *xorm.Engine) *xorm.Session) (*Character, error)
    GetCharacters(fn func(engine *xorm.Engine) *xorm.Session) ([]*Character, error)
    FilterWuGe(last []*Character, wg chan<- *WuGeLucky) error
    Database() interface{}
}
```

## 配置系统

### 配置结构
```go
type Config struct {
    RunInit      bool       // 是否运行初始化
    FilterMode   FilterMode // 过滤模式
    StrokeMax    int        // 最大笔画数
    StrokeMin    int        // 最小笔画数
    HardFilter   bool       // 严格过滤
    FixBazi      bool       // 八字修正
    SupplyFilter bool       // 喜用神过滤
    ZodiacFilter bool       // 生肖过滤
    BaguaFilter  bool       // 卦象过滤
    Regular      bool       // 常用字过滤
    Database     Database   // 数据库配置
    FileOutput   FileOutput // 输出配置
}
```

### 过滤策略
系统支持多种过滤策略的组合：
1. **基础过滤**: 笔画数范围限制
2. **三才过滤**: 三才五行相生检查
3. **喜用神过滤**: 八字五行补益检查
4. **生肖过滤**: 生肖用字检查
5. **卦象过滤**: 周易卦象吉凶检查

## 命令行工具

### 主要命令
1. **init**: 初始化配置和数据库
2. **name**: 生成姓名
3. **check**: 检查现有姓名
4. **version**: 显示版本信息

### 使用示例
```bash
# 初始化
fate init

# 生成姓名
fate name -l 张 -b "2020/02/06 15:04"

# 检查姓名
fate check -n 张三
```

## 输出格式

### 支持的输出格式
1. **控制台输出**: 直接在终端显示结果
2. **CSV格式**: 便于电子表格处理
3. **JSON格式**: 便于程序集成

### 输出字段
- 姓名
- 笔画组合
- 拼音
- 五格数值
- 三才五行
- 八字喜用神
- 生肖匹配度
- 卦象信息
- 综合评分

## 性能优化

### 数据预计算
系统在初始化时预计算所有可能的五格组合，大幅提升查询速度。

### 并发处理
使用 Go 协程和通道实现并发的姓名生成和筛选，提高处理效率。

### 内存优化
通过合理的数据结构设计和缓存策略，平衡内存使用和执行效率。

## 扩展性设计

### 插件化架构
各个功能模块相对独立，便于后续扩展新的算法或理论体系。

### 配置化过滤
通过配置文件灵活控制各种过滤条件的启用和参数。

### 多数据库支持
支持 MySQL、SQLite 等多种数据库后端。

## 总结

Fate 项目是一个设计精良的现代化取名工具，成功将传统姓名学理论与现代软件工程实践相结合。通过模块化的架构设计、科学的算法实现和灵活的配置系统，为用户提供了一个功能强大、易于使用的取名解决方案。

项目的核心优势包括：
1. **理论完备**: 整合多种传统取名理论
2. **算法科学**: 基于数学模型的量化分析
3. **性能优越**: 预计算和并发处理提升效率
4. **扩展性强**: 模块化设计便于功能扩展
5. **使用简便**: 命令行工具和多种输出格式

该项目为传统文化的数字化传承提供了优秀的技术实践范例。