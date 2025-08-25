# 首页区域 ID 标识文档

> 本文档记录了宝宝取名网站首页所有区域的 ID 标识，方便开发者精确定位和修改特定区域。

## 📋 文档目的

为了提高开发效率，我们为首页的每个主要区域和子区域都添加了唯一的 ID 标识。通过这些 ID，开发者可以：

- 快速定位需要修改的页面区域
- 精确进行样式调整
- 实现区域级别的 JavaScript 操作
- 进行 A/B 测试时的精准控制

## 🎯 主要区域 (Main Sections)

| ID | 区域名称 | 描述 | 位置 |
|---|---|---|---|
| `#hero-section` | 英雄区域 | 主要横幅区域，包含网站主标题、特色展示和核心价值主张 | 页面顶部 |
| `#database-section` | 数据库介绍区域 | 8大权威数据库的详细展示和说明 | 第二区域 |
| `#plugin-system-section` | 智能分析系统区域 | 六步科学取名流程的详细介绍 | 第三区域 |
| `#poetry-naming-section` | 诗词取名模块 | 专门的诗词取名功能和诗词分类展示 | 第四区域 |
| `#features-section` | 功能特色区域 | 传统文化智慧功能的展示 | 第五区域 |
| `#why-choose-us-section` | 选择理由区域 | 网站优势和特色的说明 | 页面底部 |

## 🔍 细分区域 (Sub-sections)

### 1. 英雄区域 (`#hero-section`) 内部结构

```
#hero-section
├── #hero-title              # 主标题区域
├── #hero-features           # 网站特色展示
│   ├── 科学严谨区域          # 左侧功能特色
│   ├── 六维度圆形图          # 中心交互式圆形图
│   ├── 文化传承区域          # 右侧文化特色
│   └── #hero-stats          # 底部统计数据卡片
└── #hero-cta                # 行动按钮组
```

| ID | 元素 | 内容描述 |
|---|---|---|
| `#hero-title` | 主标题区域 | "智慧取名 科学传承" 标题和副标题 |
| `#hero-features` | 特色展示 | 科学严谨+文化传承的三栏展示，包含创新的六维度圆形图 |
| `#hero-stats` | 底部统计数据 | 四个信任度核心指标：权威数据官方标准、文化传承千年智慧、科学分析AI智能、专业认证值得信赖 |
| `#hero-cta` | 行动按钮 | "立即开始取名" 和 "了解文化背景" 按钮 |

### 2. 数据库区域 (`#database-section`) 内部结构

```
#database-section
├── #database-title      # 区域标题
├── #database-cards      # 8个数据库卡片
└── #database-summary    # 重要性说明
```

| ID | 元素 | 内容描述 |
|---|---|---|
| `#database-title` | 区域标题 | "8大权威数据库支撑" 标题和说明 |
| `#database-cards` | 数据库卡片 | 8个数据库的详细介绍卡片网格 |
| `#database-summary` | 总结说明 | "为什么我们的数据库如此重要" 的解释 |

### 3. 智能分析系统区域 (`#plugin-system-section`) 内部结构

```
#plugin-system-section
├── #plugin-title        # 区域标题
└── #plugin-layers       # 六步分析流程展示
```

| ID | 元素 | 内容描述 |
|---|---|---|
| `#plugin-title` | 区域标题 | "六步科学取名流程" 标题和说明 |
| `#plugin-layers` | 分析步骤 | 六个步骤的详细分析工具展示 |



### 4. 诗词取名模块 (`#poetry-naming-section`) 内部结构

```
#poetry-naming-section
├── #poetry-title        # 区域标题
└── #poetry-categories   # 诗词分类展示
```

| ID | 元素 | 内容描述 |
|---|---|---|
| `#poetry-title` | 区域标题 | "诗词取名专区" 标题和说明 |
| `#poetry-categories` | 诗词分类 | 6大诗词分类的展示和数据统计 |

### 5. 功能特色区域 (`#features-section`) 内部结构

```
#features-section
├── #features-title      # 区域标题
└── #features-cards      # 功能卡片
```

| ID | 元素 | 内容描述 |
|---|---|---|
| `#features-title` | 区域标题 | "传统文化智慧" 标题和说明 |
| `#features-cards` | 功能卡片 | 6个传统文化功能的详细介绍 |

### 6. 选择理由区域 (`#why-choose-us-section`) 内部结构

```
#why-choose-us-section
├── #why-choose-us-title # 区域标题
└── #why-choose-us-cards # 优势卡片
```

| ID | 元素 | 内容描述 |
|---|---|---|
| `#why-choose-us-title` | 区域标题 | "为什么选择我们" 标题和说明 |
| `#why-choose-us-cards` | 优势卡片 | 4个核心优势的展示卡片 |

## 🔧 使用方法

### CSS 选择器使用

```css
/* 修改整个英雄区域的背景 */
#hero-section {
  background: linear-gradient(135deg, #your-color1, #your-color2);
}

/* 修改主标题样式 */
#hero-title h1 {
  font-size: 4rem;
  color: #your-color;
}

/* 修改数据库卡片的悬浮效果 */
#database-cards .card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

/* 修改快速体验表单的样式 */
#quick-start-form {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
}
```

### JavaScript 操作示例

```javascript
// 滚动到特定区域
document.getElementById('quick-start').scrollIntoView({ 
  behavior: 'smooth',
  block: 'start'
});

// 修改区域内容
const heroTitle = document.getElementById('hero-title');
heroTitle.querySelector('h1').textContent = '新的标题';

// 添加交互事件
document.getElementById('hero-cta').addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    console.log('按钮被点击:', e.target.textContent);
  }
});

// 动态修改样式
const pluginSection = document.getElementById('plugin-system-section');
pluginSection.style.background = 'linear-gradient(45deg, #f0f9ff, #e0f2fe)';

// Hero区域特色展示操作示例
// 修改六维度圆形图的动画效果
const heroFeatures = document.getElementById('hero-features');
if (heroFeatures) {
  // 暂停脉动动画
  const pulseElement = heroFeatures.querySelector('.animate-pulse');
  pulseElement?.classList.remove('animate-pulse');
}

// 统计数据卡片操作示例
// 更新统计数据
const updateHeroStats = (newStats) => {
  const statsData = [
    { number: newStats.authority || '权威数据', label: '官方标准', icon: '🏛️' },
    { number: newStats.heritage || '文化传承', label: '千年智慧', icon: '📜' },
    { number: newStats.science || '科学分析', label: 'AI智能', icon: '🧠' },
    { number: newStats.trust || '专业认证', label: '值得信赖', icon: '🏆' }
  ];
  // 更新DOM逻辑
};

// 添加统计数据悬浮效果
const heroStats = document.querySelector('#hero-features .grid.grid-cols-2.md\\:grid-cols-4');
if (heroStats) {
  heroStats.addEventListener('mouseenter', (e) => {
    if (e.target.classList.contains('group')) {
      e.target.querySelector('.font-bold')?.classList.add('scale-110');
    }
  });
}

// 诗词取名模块操作示例
// 跳转到特定诗词分类
const scrollToPoetryCategory = (category) => {
  const poetrySection = document.getElementById('poetry-naming-section');
  poetrySection?.scrollIntoView({ behavior: 'smooth' });
  // 可以添加高亮特定分类的逻辑
};

// 智能分析系统操作
// 展开特定分析步骤
const pluginLayers = document.getElementById('plugin-layers');
if (pluginLayers) {
  // 高亮第一个分析步骤
  const firstStep = pluginLayers.querySelector('.relative');
  firstStep?.classList.add('ring-2', 'ring-cultural-gold-500');
}
```

### React 组件内使用

```jsx
// 在 useEffect 中操作特定区域
useEffect(() => {
  const heroSection = document.getElementById('hero-section');
  heroSection.classList.add('animate-fade-in');
}, []);

// 使用 ref 更好的方式
const heroRef = useRef(null);

// 滚动到指定区域
const scrollToPoetryNaming = () => {
  document.getElementById('poetry-naming-section')?.scrollIntoView({ 
    behavior: 'smooth' 
  });
};

// 智能提示框交互
const handleTooltipInteraction = (dimensionName) => {
  console.log(`用户查看了：${dimensionName}`);
  // 可以添加分析统计逻辑
};
```

## 📱 响应式设计考虑

在移动端，某些区域可能需要特殊处理：

```css
/* 移动端优化 */
@media (max-width: 768px) {
  #hero-features .grid {
    grid-template-columns: 1fr; /* 单列显示 */
  }
  
  #database-cards {
    grid-template-columns: 1fr 1fr; /* 2列显示 */
  }
  
  #poetry-categories .grid {
    grid-template-columns: repeat(2, 1fr); /* 2列显示 */
  }
  
  #features-cards {
    grid-template-columns: 1fr; /* 单列显示 */
  }
}
```

## 🎨 设计系统集成

这些 ID 与我们的设计系统完全兼容：

```css
/* 使用设计令牌 */
#hero-section {
  background: var(--gradient-cultural-primary);
  color: var(--color-cultural-ink);
}

#hero-features .w-52 {
  background: linear-gradient(135deg, var(--color-cultural-gold-400), var(--color-cultural-gold-600));
  box-shadow: var(--shadow-2xl);
}

#poetry-naming-section {
  background: linear-gradient(135deg, var(--color-cultural-paper), var(--color-cultural-jade-50));
  border-top: 1px solid var(--color-cultural-gold-200);
}

#database-cards .card {
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
}
```

## 🔄 版本控制

- **创建日期**: 2024年当前日期
- **最后更新**: 2024年当前日期
- **版本**: v1.0.0
- **维护者**: 开发团队

## 🎯 特色功能展示

### Hero区域创新设计
- **六维度圆形图**: 创新的中心圆形+卫星式小圆圈布局
- **智能提示**: 鼠标悬停显示各维度功能说明
- **动态效果**: 脉动动画和缩放交互增强视觉吸引力
- **统计数据展示**: 底部四个核心指标的可视化展示卡片
- **响应式适配**: 自动适配不同屏幕尺寸

### 诗词取名专区
- **诗词展示**: 左右分栏展示经典诗词和功能介绍
- **分类体系**: 6大诗词分类（诗经、楚辞、唐诗、宋词、元曲、古文）
- **智能检索**: 500万+诗词数据库支持
- **文化传承**: 深度融合传统文化元素

### 响应式设计
```css
/* Hero区域六维度圆形图 */
#hero-features .relative {
  width: 20rem; /* 320px */
  height: 20rem; /* 320px */
}

/* 中心圆形 */
.w-52.h-52 {
  width: 13rem; /* 208px */
  height: 13rem; /* 208px */
}

/* 底部统计数据卡片 */
#hero-stats {
  background: linear-gradient(to right, var(--color-cultural-paper), white, rgba(var(--color-cultural-jade-50), 0.3));
  border-radius: 1.5rem; /* 24px */
  padding: 2rem; /* 32px */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(var(--color-cultural-gold), 0.2);
}

/* 小圆圈布局 - 使用数学计算精确定位 */
.absolute[style*="translate"] {
  /* 使用Math.cos和Math.sin计算的精确位置 */
  /* radius: 120px, 角度: 0°, 60°, 120°, 180°, 240°, 300° */
}

/* 智能提示框 */
.tooltip {
  z-index: 1000;
  background: rgba(0,0,0,0.9);
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* 移动端优化 */
@media (max-width: 768px) {
  #hero-features .grid {
    grid-template-columns: 1fr; /* 单列显示 */
  }
  
  #poetry-naming-section .grid {
    grid-template-columns: 1fr; /* 单列显示 */
  }
}
```

## 📝 注意事项

1. **ID 唯一性**: 所有 ID 在整个页面中都是唯一的
2. **命名规范**: 使用 kebab-case 命名法，语义化命名
3. **向后兼容**: 修改 ID 时需要同步更新所有引用
4. **性能考虑**: 使用 ID 选择器比类选择器性能更好
5. **SEO 友好**: 这些 ID 也可以用作页面锚点
6. **交互性能**: 使用CSS transform和GPU加速确保流畅的动画效果
7. **智能提示**: 使用高z-index确保提示框不被遮挡

## 🚀 扩展建议

如果需要添加新的区域，建议遵循以下命名规范：

- 主区域: `#{功能名}-section`
- 子区域: `#{功能名}-{子功能名}`
- 特殊元素: `#{功能名}-{元素类型}`

例如：
- `#testimonials-section` (用户评价区域)
- `#testimonials-title` (评价区域标题)
- `#testimonials-cards` (评价卡片)

---

**提示**: 使用浏览器开发者工具时，可以直接在 Console 中输入 `document.getElementById('区域ID')` 来快速定位和调试特定区域。
