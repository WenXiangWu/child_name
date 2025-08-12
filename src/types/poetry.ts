// 诗词数据类型定义
export interface PoetryItem {
  id: string;
  title: string;
  author?: string;
  dynasty?: string;
  content: string;
  contentArray: string[]; // 分句内容，用于搜索和展示
  category: PoetryCategory;
  
  // 诗经特有字段
  chapter?: string;  // 如：国风、小雅、大雅、颂
  section?: string;  // 如：周南、召南
  
  // 宋词特有字段
  rhythmic?: string; // 词牌名
  
  // 统计信息
  characterCount?: number;  // 字符数
  lineCount?: number;       // 行数
}

export enum PoetryCategory {
  SHIJING = 'shijing',       // 诗经
  TANGSHI = 'tangshi',       // 唐诗
  SONGCI = 'songci',         // 宋词
  YUANQU = 'yuanqu',         // 元曲
  CHUCI = 'chuci',           // 楚辞
  LUNYU = 'lunyu',           // 论语
  MENGXUE = 'mengxue',       // 蒙学
  NALANXINGDE = 'nalanxingde', // 纳兰性德
  SHUIMOTANGSHI = 'shuimotangshi', // 水墨唐诗
  CAOCAO = 'caocao',         // 曹操诗集
  YUDINGQUANTANGSHI = 'yudingquantangshi', // 御定全唐詩
  YOUMENGYING = 'youmengying', // 幽梦影
  SISHUWUJING = 'sishuwujing', // 四书五经
  WUDAISHICI = 'wudaishici'    // 五代诗词
}

export interface PoetryCategoryInfo {
  key: PoetryCategory;
  name: string;
  description: string;
  dynasty: string;
  color: string;
  icon: string;
}

export interface PoetrySearchResult {
  item: PoetryItem;
  matchedContent: string[];
  highlightText: string;
}

export interface PoetryStats {
  totalCount: number;
  categoryStats: Record<PoetryCategory, number>;
}

// 分类信息配置
export const POETRY_CATEGORIES: Record<PoetryCategory, PoetryCategoryInfo> = {
  [PoetryCategory.SHIJING]: {
    key: PoetryCategory.SHIJING,
    name: '诗经',
    description: '中国最早的诗歌总集，风雅颂三体并存，是中华诗词的源头',
    dynasty: '先秦',
    color: 'bg-blue-500',
    icon: '📖'
  },
  [PoetryCategory.TANGSHI]: {
    key: PoetryCategory.TANGSHI,
    name: '唐诗',
    description: '唐代诗歌黄金时期作品，格律严谨，意境优美，名家辈出',
    dynasty: '唐代',
    color: 'bg-yellow-500',
    icon: '🌟'
  },
  [PoetryCategory.SONGCI]: {
    key: PoetryCategory.SONGCI,
    name: '宋词',
    description: '宋代文学瑰宝，长短句错落有致，情感丰富，意境深远',
    dynasty: '宋代',
    color: 'bg-green-500',
    icon: '🎵'
  },
  [PoetryCategory.YUANQU]: {
    key: PoetryCategory.YUANQU,
    name: '元曲',
    description: '元代散曲和杂剧，语言生动活泼，贴近民间生活',
    dynasty: '元代',
    color: 'bg-orange-500',
    icon: '🎭'
  },
  [PoetryCategory.CHUCI]: {
    key: PoetryCategory.CHUCI,
    name: '楚辞',
    description: '以屈原为代表的楚国诗歌，浪漫主义色彩浓厚，辞藻华美',
    dynasty: '战国',
    color: 'bg-purple-500',
    icon: '🌺'
  },
  [PoetryCategory.LUNYU]: {
    key: PoetryCategory.LUNYU,
    name: '论语',
    description: '儒家经典文献，记录孔子及其弟子的言行，智慧结晶',
    dynasty: '春秋',
    color: 'bg-gray-500',
    icon: '📚'
  },
  [PoetryCategory.MENGXUE]: {
    key: PoetryCategory.MENGXUE,
    name: '蒙学',
    description: '古代儿童启蒙读物，三字经、百家姓、千字文等经典',
    dynasty: '历代',
    color: 'bg-pink-500',
    icon: '👶'
  },
  [PoetryCategory.NALANXINGDE]: {
    key: PoetryCategory.NALANXINGDE,
    name: '纳兰性德',
    description: '清代著名词人纳兰性德的词作集，情真意切，哀婉动人',
    dynasty: '清代',
    color: 'bg-indigo-500',
    icon: '🌙'
  },
  [PoetryCategory.SHUIMOTANGSHI]: {
    key: PoetryCategory.SHUIMOTANGSHI,
    name: '水墨唐诗',
    description: '唐诗精选，如水墨画般意境悠远，诗情画意并茂',
    dynasty: '唐代',
    color: 'bg-slate-500',
    icon: '🎨'
  },
  [PoetryCategory.CAOCAO]: {
    key: PoetryCategory.CAOCAO,
    name: '曹操诗集',
    description: '魏武帝曹操的诗歌作品，气魄雄浑，豪迈奔放',
    dynasty: '三国',
    color: 'bg-red-500',
    icon: '⚔️'
  },
  [PoetryCategory.YUDINGQUANTANGSHI]: {
    key: PoetryCategory.YUDINGQUANTANGSHI,
    name: '御定全唐詩',
    description: '清康熙朝官修的全唐诗总集，收录唐代诗歌最为完备',
    dynasty: '唐代',
    color: 'bg-amber-500',
    icon: '👑'
  },
  [PoetryCategory.YOUMENGYING]: {
    key: PoetryCategory.YOUMENGYING,
    name: '幽梦影',
    description: '清代张潮著，格言体小品文，文辞优美，哲理深刻',
    dynasty: '清代',
    color: 'bg-cyan-500',
    icon: '🌌'
  },
  [PoetryCategory.SISHUWUJING]: {
    key: PoetryCategory.SISHUWUJING,
    name: '四书五经',
    description: '儒家经典文献汇编，中华文化的根基，修身治学的典范',
    dynasty: '先秦',
    color: 'bg-emerald-500',
    icon: '📜'
  },
  [PoetryCategory.WUDAISHICI]: {
    key: PoetryCategory.WUDAISHICI,
    name: '五代诗词',
    description: '五代十国时期的诗词作品，承上启下，风格多样',
    dynasty: '五代',
    color: 'bg-rose-500',
    icon: '🌸'
  }
};