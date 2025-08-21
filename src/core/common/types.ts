/**
 * qiming项目核心类型定义
 * 与Python版本保持完全一致
 */

// 五行元素类型
export type WuxingElement = '金' | '木' | '水' | '火' | '土';

// 预处理姓名语料库数据结构
export interface NameCorpusProcessedData {
  meta: {
    version: string;
    lastUpdated: string;
    source: string;
    totalRecords: number;
    checksum: string;
  };
  data: {
    male: string[];
    female: string[];
    all: Array<{ name: string; gender: string }>;
  };
  indices: {
    byGender: {
      male: string[];
      female: string[];
    };
    commonChars: {
      male: Record<string, number>;
      female: Record<string, number>;
    };
  };
}

// 性别类型
export type Gender = 'male' | 'female';

// 生肖类型
export type ZodiacAnimal = '鼠' | '牛' | '虎' | '兔' | '龙' | '蛇' | '马' | '羊' | '猴' | '鸡' | '狗' | '猪';

// 生肖信息接口
export interface ZodiacInfo {
  id: string;
  name: ZodiacAnimal;
  element: WuxingElement;
  years: number[];
  traits: string[];
  favorable: {
    radicals: string[];
    characters: string[];
    meanings: string[];
    reasons: Record<string, string>;
  };
  unfavorable: {
    radicals: string[];
    characters: string[];
    reasons: Record<string, string>;
  };
}

// 生肖数据结构
export interface ZodiacData {
  meta: {
    version: string;
    description: string;
    lastUpdated: string;
    source: string;
  };
  zodiacs: Record<ZodiacAnimal, ZodiacInfo>;
  yearMapping: Record<string, ZodiacAnimal>;
}

// 生肖字符评估结果
export interface ZodiacCharacterEvaluation {
  char: string;
  zodiac: ZodiacAnimal;
  score: number; // 0-5分
  isFavorable: boolean;
  isUnfavorable: boolean;
  reason: string;
  relatedRadicals: string[];
}

// 三才五格计算结果
export interface GridCalculation {
  tiange: number;    // 天格
  renge: number;     // 人格  
  dige: number;      // 地格
  zongge: number;    // 总格
  waige: number;     // 外格
}

// 三才组合结果
export interface SancaiResult {
  heaven: WuxingElement;  // 天格五行
  human: WuxingElement;   // 人格五行
  earth: WuxingElement;   // 地格五行
  combination: string;    // 组合描述，如"金火金"
  level: 'da_ji' | 'zhong_ji' | 'ji' | 'xiong' | 'da_xiong' | 'unknown'; // 吉凶等级
  description: string;    // 详细描述
}

// 汉字信息
export interface CharacterInfo {
  char: string;
  pinyin?: string;
  tone?: number;
  strokes: {
    simplified: number;
    traditional: number;
  };
  wuxing: WuxingElement;
  meanings?: string[];
  frequency?: number;
}

// 新华字典条目接口
export interface XinhuaDictEntry {
  char: string;          // 汉字
  radical: string;       // 部首
  strokes: number;       // 笔画数
  pinyin: string;        // 拼音
  tone?: number;         // 声调（从拼音解析）
}

// 新华字典数据结构
export interface XinhuaDict {
  [char: string]: XinhuaDictEntry;
}

// GSC拼音数据条目接口
export interface GSCPinyinEntry {
  num: string;           // 编号
  word: string;          // 汉字
  pinyin: string;        // 拼音（可能有多个，用逗号分隔）
  radical: string;       // 部首
  strokeCount: number;   // 笔画数
  wuxing: WuxingElement; // 五行属性
  traditional: string;   // 繁体字
  wubi: string;          // 五笔编码
  
  // 处理后的数据
  pinyinList?: string[]; // 拼音列表
  tones?: number[];      // 声调列表
  mainPinyin?: string;   // 主要拼音
  mainTone?: number;     // 主要声调
}

// 声调分析结果
export interface ToneAnalysis {
  tone: number;          // 声调 (1-4, 0表示轻声)
  description: string;   // 声调描述
  category: 'ping' | 'ze'; // 平仄分类
}

// 音律分析结果
export interface PhoneticAnalysis {
  char: string;
  pinyin: string;
  tone: number;
  toneAnalysis: ToneAnalysis;
  rhyme?: string;        // 韵母
  initial?: string;      // 声母
}

// 笔画组合
export interface StrokeCombination {
  mid: number;   // 中间字笔画
  last: number;  // 最后字笔画
}

// 生成的名字结果
export interface GeneratedName {
  fullName: string;       // 完整姓名
  familyName: string;     // 姓氏
  midChar: string;        // 中间字
  lastChar: string;       // 最后字
  grids: GridCalculation; // 五格数据
  sancai: SancaiResult;   // 三才结果
  score: number;          // 综合评分
  explanation?: string;   // 解释说明
  zodiacEvaluation?: {    // 生肖评估结果
    zodiac: ZodiacAnimal;
    midCharEval: ZodiacCharacterEvaluation;
    lastCharEval: ZodiacCharacterEvaluation;
    overallScore: number; // 生肖整体评分
  };
  
  // 详细评分信息（用于详细分析页面）
  components?: {
    surname: { char: string; strokes: number; wuxing: string };
    first: { char: string; strokes: number; wuxing: string };
    second: { char: string; strokes: number; wuxing: string };
  };
  scores?: {
    sancai: number;
    wuxing: number;
    phonetic: number;
    meaning: number;
    cultural: number;
    zodiac: number;
  };
  scoringDetails?: {
    sancai: ScoringDetail;
    wuxing: ScoringDetail;
    phonetic: ScoringDetail;
    meaning: ScoringDetail;
    cultural: ScoringDetail;
    zodiac: ScoringDetail;
  };
  comprehensiveScore?: number;
  comprehensiveCalculation?: string;
  grade?: string;
  recommendation?: string;
}

// 评分详细信息接口
export interface ScoringDetail {
  score: number;
  reason: string;
  calculation: any;
}

// 名字生成配置 - 对应qiming的config.py
export interface NameGenerationConfig {
  familyName: string;         // 姓氏 - 对应LAST_NAME
  gender: Gender;             // 性别 - 对应SEX
  
  // 出生时间信息 - 对应year, month, date, hour, minute
  birthInfo?: {
    year: number;
    month: number;
    date: number;
    hour: number;
    minute: number;
  };
  
  // 生肖信息 - 基于出生年份确定
  zodiac?: ZodiacAnimal;
  
  // 五行偏好 - 对应SELECTED_XITONGSHEN
  preferredWuxing?: WuxingElement[];
  
  // 不需要的字 - 对应DONT_NEED_WORD
  avoidedWords?: string[];
  
  // 三才要求 - 对应SELECTED_SANCAI
  requiredSancai?: string[];
  
  // 笔画范围 - 对应MIN_SINGLE_NUM, MAX_SINGLE_NUM  
  strokeRange?: {
    min: number;
    max: number;
  };
  
  // 评分阈值 - 对应THRESHOLD_SCORE
  scoreThreshold?: number;
  
  // 是否使用繁体笔画
  useTraditional?: boolean;
  
  // 是否只返回指定的最佳组合
  specificBest?: boolean;
  
  // 生成数量配置
  limit?: number;      // 生成名字数量限制，默认5个
  offset?: number;     // 跳过的名字数量，用于"再来一批"功能
  
  // 个性化权重配置
  weights?: WeightConfig;
  
  // 生肖筛选配置
  useZodiacFiltering?: boolean;  // 是否启用生肖筛选
}

// 个性化权重配置接口
export interface WeightConfig {
  sancai: number;      // 三才五格权重 (0-100)
  wuxing: number;      // 五行平衡权重 (0-100)
  sound: number;       // 音韵美感权重 (0-100)
  meaning: number;     // 字义寓意权重 (0-100)
  social: number;      // 社会认可权重 (0-100)
}

// 三才五格规则
export interface SancaiRule {
  combination: [WuxingElement, WuxingElement, WuxingElement];
  level: 'da_ji' | 'zhong_ji' | 'ji' | 'xiong' | 'da_xiong';
  description: string;
  characteristics: string[];
}

// 五行字典结构 - 对应wuxing_dict_jianti.json的结构
export interface WuxingDictionary {
  [wuxing: string]: {
    [strokes: string]: string[];
  };
}

// 声调分析结果
export interface ToneAnalysisResult {
  combination: [number, number];  // 声调组合，如[4, 2]
  filteredNames: string[];        // 符合条件的名字
  midCharacters: Set<string>;     // 中间字集合
  lastCharacters: Set<string>;    // 最后字集合
  count: number;                  // 数量
}

// 名字验证结果
export interface NameValidationResult {
  isValid: boolean;
  grids: GridCalculation;
  sancai: SancaiResult;
  score: number;
  issues: string[];
  explanation: string;
}

// 批量名字检查结果
export interface BatchCheckResult {
  name: string;
  simplified: NameValidationResult;
  traditional: NameValidationResult;
}