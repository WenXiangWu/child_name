# qiming项目功能完整实现对照表

## 1. 功能对照分析

### 1.1 qiming项目核心功能清单

基于对qiming项目的深度分析，以下是需要完全实现的核心功能：

| 功能模块 | qiming原始功能 | 实现优先级 | 技术难度 | 预计工期 |
|---------|---------------|-----------|---------|---------|
| **配置管理** | config.py参数配置 | P0 | 低 | 1天 |
| **三才五格计算** | helper.py核心算法 | P0 | 中 | 3天 |
| **五行属性查询** | 字符五行属性判断 | P0 | 低 | 2天 |
| **名字生成引擎** | 2generate_name.py主逻辑 | P0 | 高 | 5天 |
| **声调分析** | 3analysis_name.py声调筛选 | P1 | 中 | 2天 |
| **批量验证** | 4check_sancai_wuge.py | P1 | 低 | 1天 |
| **随机选择** | 5get-by-god.py | P2 | 低 | 0.5天 |
| **小名生成** | 6xiaoming.py | P2 | 低 | 1天 |
| **数据加载** | 各种数据文件处理 | P0 | 中 | 3天 |

### 1.2 核心数据资源对照

| 数据类型 | qiming文件 | 大小 | 前端实现方式 | 处理状态 |
|---------|-----------|------|-------------|---------|
| **汉字基础数据** | word.json | 26MB | 分片加载+索引 | 待处理 |
| **新华字典数据** | xinhua.csv | 159KB | JSON转换 | 待处理 |
| **五行属性(简体)** | wuxing_dict_jianti.json | 88KB | 直接使用 | 待处理 |
| **五行属性(繁体)** | wuxing_dict_fanti.json | - | 直接使用 | 待处理 |
| **拼音声调数据** | gsc_pinyin.csv | 271KB | JSON转换+索引 | 待处理 |
| **三才五格规则** | sancai.txt + constants.py | 33KB | JSON结构化 | 待处理 |
| **名字语料库** | Chinese_Names_Corpus_Gender.txt | 15MB | 预处理+分析 | 待处理 |
| **百家姓数据** | baijiaxing.txt | 小 | 直接使用 | 待处理 |

## 2. 核心算法实现对照

### 2.1 三才五格计算算法

**qiming原始实现**：
```python
def get_best_ge_bihua(fan_ti=False, specific_best=False):
    """获取最佳笔画组合"""
    # 1. 计算人格
    # 2. 计算地格  
    # 3. 计算总格
    # 4. 计算外格
    # 5. 计算三才
```

**前端TypeScript实现计划**：

```typescript
interface StrokeCalculation {
  simplified: number;
  traditional: number;
}

interface GridCalculation {
  tiange: number;    // 天格
  renge: number;     // 人格
  dige: number;      // 地格
  zongge: number;    // 总格
  waige: number;     // 外格
}

interface SancaiResult {
  heaven: WuxingElement;
  human: WuxingElement;
  earth: WuxingElement;
  level: 'excellent' | 'good' | 'fair' | 'poor' | 'bad';
  description: string;
}

class SancaiWugeCalculator {
  private sancaiRules: SancaiRule[];
  private luckyNumbers: Set<number>;
  private unluckyNumbers: Set<number>;
  
  constructor() {
    // 从qiming的constants.py加载数据
    this.luckyNumbers = new Set([1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 18, 21, 23, 24, 25, 31, 32, 35, 37, 38, 41, 45, 47, 48, 52, 57, 61, 63, 65, 67, 68, 81]);
    this.unluckyNumbers = new Set([2, 4, 9, 10, 12, 14, 19, 20, 22, 26, 28, 29, 33, 34, 36, 39, 40, 42, 43, 44, 46, 50, 53, 54, 56, 59, 60, 62, 64, 66, 69, 70, 72, 74, 76, 77, 78, 79, 80]);
  }
  
  // 完全复现qiming的计算逻辑
  calculateGrids(familyName: string, firstName: string, lastName: string, useTraditional: boolean = false): GridCalculation {
    const familyStrokes = this.getStrokes(familyName, useTraditional);
    const firstStrokes = this.getStrokes(firstName, useTraditional);
    const lastStrokes = this.getStrokes(lastName, useTraditional);
    
    return {
      tiange: familyStrokes + 1,
      renge: familyStrokes + firstStrokes,
      dige: firstStrokes + lastStrokes,
      zongge: familyStrokes + firstStrokes + lastStrokes,
      waige: familyStrokes + firstStrokes + lastStrokes - (familyStrokes + firstStrokes) + 1
    };
  }
  
  calculateSancai(grids: GridCalculation): SancaiResult {
    const heaven = this.numberToWuxing(grids.tiange % 10);
    const human = this.numberToWuxing(grids.renge % 10);
    const earth = this.numberToWuxing(grids.dige % 10);
    
    const combination = [heaven, human, earth] as [WuxingElement, WuxingElement, WuxingElement];
    const rule = this.findSancaiRule(combination);
    
    return {
      heaven,
      human,
      earth,
      level: rule.level,
      description: rule.description
    };
  }
  
  // 获取最佳笔画组合 - 完全复现qiming逻辑
  getBestStrokeCombinations(familyName: string, useTraditional: boolean = false): Array<{mid: number, last: number}> {
    const familyStrokes = this.getStrokes(familyName, useTraditional);
    const validCombinations: Array<{mid: number, last: number}> = [];
    
    // 遍历可能的笔画组合
    for (let midStrokes = 1; midStrokes <= 30; midStrokes++) {
      for (let lastStrokes = 1; lastStrokes <= 30; lastStrokes++) {
        const grids = {
          tiange: familyStrokes + 1,
          renge: familyStrokes + midStrokes,
          dige: midStrokes + lastStrokes,
          zongge: familyStrokes + midStrokes + lastStrokes,
          waige: familyStrokes + midStrokes + lastStrokes - (familyStrokes + midStrokes) + 1
        };
        
        // 检查五格是否都在吉数范围内
        if (this.isLuckyNumber(grids.renge) && 
            this.isLuckyNumber(grids.dige) && 
            this.isLuckyNumber(grids.zongge) && 
            this.isLuckyNumber(grids.waige)) {
          
          // 检查三才是否为吉
          const sancai = this.calculateSancai(grids);
          if (sancai.level === 'excellent' || sancai.level === 'good') {
            validCombinations.push({mid: midStrokes, last: lastStrokes});
          }
        }
      }
    }
    
    return validCombinations;
  }
}
```

### 2.2 名字生成引擎

**qiming核心逻辑复现**：

```typescript
interface NameGenerationOptions {
  familyName: string;
  gender: 'male' | 'female';
  midWuxing: WuxingElement;    // 对应qiming的mid_wuxing
  lastWuxing: WuxingElement;   // 对应qiming的last_wuxing
  useTraditional: boolean;
  specificBest: boolean;
}

class QimingNameGenerator {
  private characterDB: CharacterDatabase;
  private sancaiCalculator: SancaiWugeCalculator;
  private commonWords: Set<string>;
  
  async generateNames(options: NameGenerationOptions): Promise<GeneratedName[]> {
    // 1. 获取最佳笔画组合 - 复现get_best_ge_bihua
    const strokeCombinations = this.sancaiCalculator.getBestStrokeCombinations(
      options.familyName, 
      options.useTraditional
    );
    
    // 2. 获取常用字集合 - 复现get_common_name_words
    const commonWords = await this.getCommonNameWords();
    
    const generatedNames: GeneratedName[] = [];
    
    // 3. 遍历有效的笔画组合
    for (const combination of strokeCombinations) {
      // 4. 根据五行和笔画获取候选字 - 复现get_word_by_bihua
      const midCandidates = await this.getWordsByStrokeAndWuxing(
        combination.mid, 
        options.midWuxing, 
        options.useTraditional
      );
      
      const lastCandidates = await this.getWordsByStrokeAndWuxing(
        combination.last, 
        options.lastWuxing, 
        options.useTraditional
      );
      
      // 5. 生成名字组合 - 复现原始逻辑
      for (const midChar of midCandidates) {
        if (!commonWords.has(midChar)) continue;
        
        for (const lastChar of lastCandidates) {
          if (!commonWords.has(lastChar)) continue;
          
          const fullName = options.familyName + midChar + lastChar;
          
          // 6. 验证三才五格
          const verification = await this.checkSancaiWuge(fullName, options.useTraditional);
          
          if (verification.isValid) {
            generatedNames.push({
              fullName,
              midChar,
              lastChar,
              sancaiScore: verification.sancaiScore,
              grids: verification.grids,
              explanation: verification.explanation
            });
          }
        }
      }
    }
    
    // 7. 排序并返回 - 按照分数排序
    return generatedNames
      .sort((a, b) => b.sancaiScore - a.sancaiScore)
      .slice(0, 1000); // 限制返回数量，避免性能问题
  }
  
  // 复现get_common_name_words功能
  private async getCommonNameWords(): Promise<Set<string>> {
    if (this.commonWords) return this.commonWords;
    
    // 从120万名字语料库中提取常用字
    const corpus = await this.loadNameCorpus();
    const commonWords = new Set<string>();
    
    for (const nameEntry of corpus) {
      const name = nameEntry.name;
      if (name.length >= 2) {
        commonWords.add(name[1]); // 名字第一个字
        if (name.length >= 3) {
          commonWords.add(name[2]); // 名字第二个字
        }
      }
    }
    
    this.commonWords = commonWords;
    return commonWords;
  }
  
  // 复现get_word_by_bihua功能
  private async getWordsByStrokeAndWuxing(
    strokes: number, 
    wuxing: WuxingElement, 
    useTraditional: boolean
  ): Promise<string[]> {
    const wuxingData = useTraditional ? 
      await this.loadWuxingDataTraditional() : 
      await this.loadWuxingDataSimplified();
    
    const strokeKey = strokes.toString();
    return wuxingData[wuxing]?.[strokeKey] || [];
  }
}
```

### 2.3 声调分析功能

**复现3analysis_name.py逻辑**：

```typescript
interface ToneAnalysisOptions {
  names: string[];
  preferredToneCombinations: number[][];
}

class ToneAnalyzer {
  private pinyinData: Map<string, {pinyin: string, tone: number}>;
  
  // qiming中定义的优美声调组合
  private readonly GOOD_TONE_COMBINATIONS = [
    [4, 2], // 百度
    [4, 1],
    [4, 3],
    [3, 2], // 百度
    [3, 4],
    [1, 4],
    [1, 3],
  ];
  
  async analyzeNames(options: ToneAnalysisOptions): Promise<ToneAnalysisResult[]> {
    const results: ToneAnalysisResult[] = [];
    
    for (const toneCombination of this.GOOD_TONE_COMBINATIONS) {
      const [midTone, lastTone] = toneCombination;
      
      const filteredNames = await this.filterByTone(
        options.names, 
        midTone, 
        lastTone
      );
      
      results.push({
        combination: toneCombination,
        filteredNames,
        midCharacters: this.extractMidCharacters(filteredNames),
        lastCharacters: this.extractLastCharacters(filteredNames),
        count: filteredNames.length
      });
    }
    
    return results;
  }
  
  // 复现filter_by_shengdiao功能
  private async filterByTone(
    names: string[], 
    targetMidTone: number, 
    targetLastTone: number
  ): Promise<string[]> {
    const filtered: string[] = [];
    
    for (const name of names) {
      if (name.length < 3) continue;
      
      const midChar = name[1];
      const lastChar = name[2];
      
      const midTone = await this.getTone(midChar);
      const lastTone = await this.getTone(lastChar);
      
      if (midTone === targetMidTone && lastTone === targetLastTone) {
        filtered.push(name);
      }
    }
    
    return filtered;
  }
  
  // 复现get_tone功能
  private async getTone(char: string): Promise<number> {
    const pinyinInfo = this.pinyinData.get(char);
    return pinyinInfo?.tone || 0;
  }
}
```

## 3. 数据处理与转换方案

### 3.1 数据文件处理优先级

```typescript
// 数据处理优先级和转换计划
const DATA_PROCESSING_PLAN = {
  // P0 - 立即需要
  immediate: [
    {
      source: 'qiming/data/wuxing_dict_jianti.json',
      target: 'src/data/wuxing-simplified.json',
      processor: 'directCopy',
      size: '88KB'
    },
    {
      source: 'qiming/data/constants.py',
      target: 'src/data/sancai-constants.json',
      processor: 'pythonToJson',
      size: '5KB'
    },
    {
      source: 'qiming/data/sancai.txt',
      target: 'src/data/sancai-rules.json',
      processor: 'textToStructuredJson',
      size: '33KB'
    }
  ],
  
  // P1 - 第一周内
  week1: [
    {
      source: 'qiming/data/xinhua.csv',
      target: 'src/data/xinhua-dict.json',
      processor: 'csvToJsonWithIndex',
      size: '159KB'
    },
    {
      source: 'qiming/data/gsc_pinyin.csv',
      target: 'src/data/pinyin-data.json',
      processor: 'csvToJsonWithIndex',
      size: '271KB'
    }
  ],
  
  // P2 - 后续处理
  later: [
    {
      source: 'qiming/data/word.json',
      target: 'src/data/characters-chunked/',
      processor: 'chunkLargeFile',
      size: '26MB -> multiple 1MB chunks'
    },
    {
      source: 'qiming/data/Chinese_Names_Corpus_Gender（120W）.txt',
      target: 'src/data/name-corpus-processed.json',
      processor: 'corpusAnalysisAndCompression',
      size: '15MB -> ~2MB'
    }
  ]
};
```

### 3.2 数据转换工具

```typescript
// 数据转换工具类
class QimingDataConverter {
  
  // 转换Python constants到JSON
  async convertConstantsToJson(pythonFile: string): Promise<any> {
    // 读取constants.py内容
    const content = await fs.readFile(pythonFile, 'utf8');
    
    // 提取数字集合
    const GOOD_NUMBERS = this.extractNumberSet(content, 'GOOD');
    const BAD_NUMBERS = this.extractNumberSet(content, 'BAD');
    
    return {
      luckyNumbers: Array.from(GOOD_NUMBERS),
      unluckyNumbers: Array.from(BAD_NUMBERS),
      // 其他常量...
    };
  }
  
  // 转换sancai.txt到结构化JSON
  async convertSancaiRules(textFile: string): Promise<SancaiRule[]> {
    const content = await fs.readFile(textFile, 'utf8');
    const rules: SancaiRule[] = [];
    
    // 解析文本格式的三才规则
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        const rule = this.parseSancaiLine(line);
        if (rule) rules.push(rule);
      }
    }
    
    return rules;
  }
  
  // 处理大文件分块
  async chunkLargeFile(sourceFile: string, chunkSize: number = 1000): Promise<void> {
    const data = await fs.readFile(sourceFile, 'utf8');
    const jsonData = JSON.parse(data);
    
    const chunks = this.splitIntoChunks(jsonData, chunkSize);
    
    for (let i = 0; i < chunks.length; i++) {
      await fs.writeFile(
        `src/data/characters-chunk-${i}.json`,
        JSON.stringify(chunks[i], null, 2)
      );
    }
  }
}
```

## 4. 实现时间表

### 4.1 第一阶段：核心功能复现（1周）

| 日期 | 任务 | 预期产出 | 验收标准 |
|------|------|---------|---------|
| Day 1 | 数据转换和预处理 | 核心数据文件就绪 | 能加载所有必需数据 |
| Day 2-3 | 三才五格计算器实现 | SancaiWugeCalculator类 | 与qiming计算结果100%一致 |
| Day 4-5 | 名字生成引擎实现 | QimingNameGenerator类 | 能生成与qiming相同的名字列表 |
| Day 6 | 声调分析功能 | ToneAnalyzer类 | 声调筛选结果一致 |
| Day 7 | 集成测试和验证 | 完整功能验证 | 所有功能与qiming对照通过 |

### 4.2 第二阶段：性能优化（3天）

| 日期 | 任务 | 预期产出 | 验收标准 |
|------|------|---------|---------|
| Day 8 | 数据加载优化 | 分片加载机制 | 首屏加载<2秒 |
| Day 9 | 计算性能优化 | Web Workers | 名字生成<1秒 |
| Day 10 | 缓存机制实现 | 结果缓存 | 重复计算命中率>90% |

### 4.3 第三阶段：UI集成（2天）

| 日期 | 任务 | 预期产出 | 验收标准 |
|------|------|---------|---------|
| Day 11 | 基础UI界面 | 输入表单+结果展示 | 功能可用性测试通过 |
| Day 12 | 结果对比验证 | qiming功能对照界面 | 可视化验证一致性 |

## 5. 验收标准

### 5.1 功能一致性验证

```typescript
// 自动化测试用例
const VERIFICATION_CASES = [
  {
    input: {
      familyName: '刘',
      gender: 'female',
      midWuxing: 'shui',
      lastWuxing: 'jin',
      useTraditional: false
    },
    expected: {
      nameCount: '>100',
      topNames: ['刘泽娇', '刘子菡', '刘子玉', '刘润佳', '刘润欣'],
      sancaiResults: 'match qiming output'
    }
  },
  // 更多测试用例...
];

class QimingCompatibilityTest {
  async verifyFullCompatibility(): Promise<TestResult> {
    const results = await Promise.all(
      VERIFICATION_CASES.map(testCase => this.runTestCase(testCase))
    );
    
    return {
      totalTests: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      details: results
    };
  }
}
```

### 5.2 性能基准测试

| 性能指标 | qiming基准 | 我们的目标 | 测试方法 |
|---------|-----------|----------|---------|
| 名字生成时间 | ~5秒(Python) | <1秒(前端) | 批量生成1000个名字 |
| 数据加载时间 | N/A | <2秒 | 首次访问到功能可用 |
| 内存使用 | N/A | <100MB | 浏览器内存监控 |
| 计算准确性 | 100% | 100% | 对照验证 |

## 6. 风险点和应对方案

### 6.1 主要风险

1. **数据转换准确性风险**
   - 风险：Python数据结构与JS不完全对应
   - 应对：逐一验证，建立自动化对照测试

2. **性能瓶颈风险**
   - 风险：大量数据在前端处理可能卡顿
   - 应对：分片加载、Web Workers、缓存机制

3. **算法复现准确性风险**
   - 风险：细节差异导致结果不一致
   - 应对：严格按照qiming逻辑，建立详细测试用例

### 6.2 质量保证措施

```typescript
// 质量保证框架
class QualityAssurance {
  // 数据一致性检查
  async validateDataConsistency(): Promise<boolean> {
    // 检查关键数据转换是否正确
    return true;
  }
  
  // 算法准确性验证
  async validateAlgorithmAccuracy(): Promise<ValidationResult> {
    // 与qiming输出进行对比验证
    return { passed: true, details: [] };
  }
  
  // 性能基准测试
  async performanceBenchmark(): Promise<PerformanceResult> {
    // 性能指标测试
    return { loadTime: 0, calculationTime: 0, memoryUsage: 0 };
  }
}
```

## 总结

通过以上详细的对照表和实现计划，我们确保能够：

1. **100%复现qiming的核心功能**：三才五格计算、名字生成、声调分析等
2. **保持算法的完全一致性**：通过严格的测试验证
3. **优化性能表现**：利用前端技术优势提升用户体验
4. **建立可靠的质量保证体系**：确保长期维护和扩展

这样的实现方案既保证了功能的完整性，又为后续的创新功能奠定了坚实的基础。