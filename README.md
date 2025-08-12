# 宝宝取名网

这是一个帮助父母给孩子取名的网站项目，结合传统文化与现代审美，为宝宝提供有意义、吉祥的好名字。

## 功能特点

- 根据宝宝性别推荐适合的名字
- 支持姓氏匹配，确保名字与姓氏搭配和谐
- 提供名字的含义解释和出处
- 支持生辰八字分析（可选）
- 提供流行度分析，避免重名
- 个性化定制，满足不同家庭的需求

## 技术栈

- 前端：React, Next.js, TypeScript, Tailwind CSS
- 后端：Node.js (API路由)
- 数据存储：JSON文件 (开发阶段)

## 开发指南

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 运行开发服务器

```bash
npm run dev
# 或
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看网站。

## 项目结构

```
/
├── public/           # 静态资源
├── src/
│   ├── components/   # UI组件
│   ├── data/         # 名字数据和解释
│   ├── hooks/        # 自定义React Hooks
│   ├── lib/          # 工具函数库
│   ├── pages/        # 页面组件
│   ├── styles/       # 全局样式
│   └── utils/        # 工具函数
├── .gitignore
├── next.config.js
├── package.json
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## 产品规划

1. 第一阶段：基础取名功能
   - 性别选择
   - 姓氏输入
   - 名字推荐
   - 名字含义解释

2. 第二阶段：高级功能
   - 生辰八字分析
   - 五行属性匹配
   - 名字流行度分析
   - 用户收藏功能

3. 第三阶段：社区功能
   - 用户评论
   - 名字投票
   - 专家点评

## 贡献指南

欢迎提交问题和功能请求！