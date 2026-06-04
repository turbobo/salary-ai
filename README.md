# AI 薪资计算器

基于 Next.js 的智能薪资计算工具，支持中国大陆累计预扣预缴个税计算、多城市社保公积金预设、年终奖计税方式对比，集成 AI 智能分析功能。

## 功能特性

- **多城市预设** — 内置北京、上海、广州、深圳、杭州、成都 2024 年度社保公积金基数
- **累计预扣预缴** — 按 2019 年起实施的累计预扣预缴法逐月计算个税
- **逐月自定义** — 每月可单独设置薪资、补贴、奖金、社保公积金参数
- **年终奖对比** — 单独计税 vs 合并计税自动对比，一键切换更优方案
- **AI 智能输入** — 自然语言描述薪资，AI 自动提取填写表单
- **AI 薪资分析** — 竞争力评分、城市排名、优化建议
- **AI 税务优化** — 专项附加扣除建议、节税策略
- **AI 职业规划** — 发展路径、财务规划建议
- **用户认证** — GitHub OAuth / 邮箱密码登录
- **云端存储** — 登录用户可保存和加载历史计算记录
- **免登录使用** — 未登录用户可免费使用所有功能（数据保存在浏览器本地）

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Next.js 16 (App Router, TypeScript) |
| 样式 | Tailwind CSS 4 |
| 后端 | Supabase (PostgreSQL + Auth + RLS) |
| AI | 通义千问 qwen-plus (DashScope API) |
| 部署 | Vercel / EdgeOne / 任意 Node.js 平台 |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填写：

```bash
cp .env.example .env.local
```

```env
# Supabase（可选 — 不填则跳过认证和云端存储功能）
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# DashScope AI（可选 — 不填则 AI 功能使用演示模式）
DASHSCOPE_API_KEY=your-dashscope-api-key
```

> 不配置任何环境变量也可以正常运行，核心计算功能和 AI 演示模式不依赖外部服务。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 4. (可选) 配置 Supabase

如需用户认证和云端存储功能：

1. 在 [Supabase](https://supabase.com) 创建项目
2. 在 SQL Editor 中执行 `supabase/migrations/001_initial_schema.sql`
3. 在 Authentication > Providers 中启用 Email 和 GitHub OAuth
4. 将 Supabase URL 和 Anon Key 填入 `.env.local`

## 项目结构

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 主页面（计算器）
│   ├── layout.tsx                # 根布局 + AuthProvider
│   ├── globals.css               # Tailwind + 自定义动画
│   ├── api/ai/route.ts           # DashScope 服务端代理
│   ├── auth/                     # 登录 / 注册 / OAuth 回调
│   └── history/page.tsx          # 历史记录页
├── components/
│   ├── calculator/               # 城市设置、全局参数、月度卡片、结果表等
│   ├── ai/                       # 智能输入、薪资分析、税务优化、职业规划
│   ├── auth/                     # AuthButton、LoginForm、SignupForm
│   ├── history/                  # 历史记录列表和卡片
│   └── layout/                   # 侧边栏、头部、底部
├── hooks/
│   ├── useCalculator.ts          # 全部计算器状态管理
│   └── useAI.ts                  # AI API Key 管理 + 调用封装
├── contexts/
│   └── AuthContext.tsx            # Supabase 认证上下文
└── lib/
    ├── calculation/              # 税率表、计算引擎、工具函数
    ├── ai/                       # DashScope 客户端、Mock 数据、Prompt
    ├── supabase/                 # Supabase 客户端封装
    └── storage.ts                # localStorage 持久化
```

## 数据库

单表设计，使用 Supabase Row Level Security 确保用户数据隔离：

```sql
-- supabase/migrations/001_initial_schema.sql
CREATE TABLE calculations (
  id               UUID PRIMARY KEY,
  user_id          UUID NOT NULL REFERENCES auth.users(id),
  city             TEXT NOT NULL,
  global_params    JSONB NOT NULL,      -- 全局薪资参数
  monthly_data     JSONB NOT NULL,      -- 12个月的逐月数据
  enabled_months   JSONB NOT NULL,      -- 启用的月份
  annual_bonus     NUMERIC DEFAULT 0,   -- 年终奖
  bonus_tax_method TEXT DEFAULT 'separate',
  special_deduction NUMERIC DEFAULT 0,  -- 专项附加扣除
  total_gross      NUMERIC,             -- 汇总：税前总收入
  total_net        NUMERIC,             -- 汇总：到手总额
  total_tax        NUMERIC,             -- 汇总：个税合计
  ...
);
-- RLS: 用户只能访问自己的数据
```

## 部署

```bash
npm run build    # 构建生产版本
npm start        # 启动生产服务器
```

支持部署到 Vercel、EdgeOne 或任何支持 Node.js 的平台。

## 许可

MIT
