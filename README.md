# 期权策略互动学习 · SuperBox App

把华泰期货《期权波动率期限结构策略》和东北证券《期权策略组合介绍》两份研报，做成 Luffa SuperBox 互动学习小程序。

所有原文中的 50ETF / 玉米 / 铜期权案例，已替换为 **MAG7 + SPY/QQQ + VIX** 真实美股市场场景。

---

## 📊 内容总览

- **12 章** 覆盖期权基础到机构级套利
- **9 条学习路径** 按目标重组，不按教科书顺序
- **60 道精选题** 4 个认知层级 (recall/apply/analyze/synth)
- **50+ 词汇** 中英对照、关联章节
- **10 条今日要闻** 每条至少链接 2 个知识点
- **12 个反预期 hook** "教科书说 X，市场实际 Y"

## 🧠 6 学习科学锚点

1. 测试效应 — 每章结尾 5 道测验
2. 生成效应 — 拖滑块、答预测、自计算
3. 反预期 — 12 个冲击时刻
4. 必要难度 — 让你先答错
5. 自解释 — 答完追问"为什么"
6. 元认知 — 进度、连续天、艾宾浩斯复习队列

## 🏗️ 章节地图

| 部分 | 章 | 标题 | 模拟器 |
|---|---|---|---|
| **入门** | 1 | 🎯 期权基础 | 调价格/行权价/权利金看盈亏 |
| | 2 | 📊 四大基本策略 | 切换 buy/sell × call/put |
| **价差** | 3 | 📐 垂直价差 | 4 种 spread + 三种到期场景 |
| | 4 | 📅 水平价差 (日历) | BSM 估值 + Theta 演算 |
| | 5 | ⚖️ 比例价差 | 1:N 数量比 |
| | 6 | 🔀 对角价差 | 8 种组合矩阵 |
| **混合/套保** | 7 | 🦋 跨式 / 宽跨式 | straddle/strangle/strip/strap |
| | 8 | 🛡️ 套保策略 | covered call / protective put / collar |
| **波动率** | 9 | 😊 BSM 与 IV | BSM 5 参数 + 希腊字母 |
| | 10 | 📈 期限结构 | VIX 9D/30D/90D 形态识别 |
| | 11 | 🎭 波动率交易 | 1-4 阶交易类型 |
| | 12 | 🔬 期限结构套利 | 信号生成 + 回测 |

## 📡 实时数据架构 (FRED-style)

```
Yahoo Finance API
   │  GitHub Actions cron (02:00 UTC 每日)
   ▼
scripts/fetch-data.mjs (Node 20+)
  - 抓 ^VIX, ^VIX9D, ^VIX3M (期限结构)
  - 抓 MAG7 + SPY/QQQ 现价
   │  git commit
   ▼
public/data/{vix,mag7}-latest.json
   │  jsDelivr CDN (主) / raw.githubusercontent (备)
   ▼
src/utils/marketData.ts
  - 内存缓存 (1h) → Taro 本地存储 (12h) → CDN → 内置基线
   ▼
Ch9 BSM、Ch10 期限结构 嵌入 <LiveData/>
```

**部署步骤**:
1. push 到 GitHub repo
2. 修改 `src/utils/marketData.ts` 第 18 行 `REPO = 'YOUR_USER/...'`
3. SuperBox 后台白名单：`cdn.jsdelivr.net`、`raw.githubusercontent.com`
4. GitHub Actions 自动每日跑（无需 API key，Yahoo Finance 公开接口）

## 🛠️ 技术栈

- Taro 4 + React 18 + TypeScript 5
- Sass · Canvas (盈亏图)
- Taro storage (进度 + 艾宾浩斯)
- 部署目标：Luffa SuperBox + 微信小程序

## 🚀 启动

> ⚠️ **Node 版本要求**：Taro 4.0.9 需要 Node 18-20。Node 22+ / 24+ 会出现 webpack ProgressPlugin schema 报错。如果你装了 nvm/volta，请先 `nvm use 20`。

```bash
nvm use 20                            # 或者 volta install node@20
npm install --legacy-peer-deps
npm run build:weapp                   # 一次构建到 dist/
npm run dev:weapp                     # watch 模式
```

构建后，把 `dist/` 导入 微信开发者工具 / Luffa SuperBox IDE。

### 不想配 Node？纯代码 review 也可以
所有章节页面是标准 Taro 4 + React 18 写法，可在任何支持 TS 的编辑器（VS Code / Cursor）中阅读和检视。`dist/` 输出对 Node 版本敏感，源码本身不依赖。

## 📁 关键文件

```
src/
├── app.config.ts              # 19 个页面注册
├── app.scss                   # 全局色板 (深色 fintech 风格)
├── data/
│   ├── chapters.ts            # 4 部分 × 12 章
│   ├── learning-paths.ts      # 9 路径 × 4 分组
│   ├── glossary.ts            # 8 类 × 50+ 词条
│   ├── chapter-quiz.ts        # 12 章 × 5 题
│   └── news.ts                # 10 条要闻
├── utils/
│   ├── formulas.ts            # 纯函数：BSM、价差、跨式等
│   ├── snapshots.ts           # MAG7 + VIX 真实场景快照
│   └── progress.ts            # 进度 + 艾宾浩斯
├── components/                # SnapshotBar / SliderRow / PredictModal
│                              # / RevealModal / PayoffChart / LiveData
└── pages/                     # home + 12 章 + 6 跨切页
```

## 🎯 设计取舍

- **每章一个模拟器** — 不堆叠 3+ 个滑块
- **真实股票真实价** — AAPL ~$200, NVDA ~$130, MAG7, SPY 560, QQQ 490, VIX
- **反预期优先** — 每章 hook 一句话钩住注意力
- **离线可用** — Taro storage，无需网络

## 📝 数据来源

- 华泰期货 2019/07/05《期权波动率期限结构策略》
- 东北证券 金融工程研究报告《期权策略组合介绍》
- MAG7 / SPY / QQQ / VIX 价格基于 2026/05 时点
