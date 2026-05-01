export interface NewsKnowledge {
  type: 'chapter' | 'glossary' | 'path'
  ref: string | number
  why: string
}

export interface NewsItem {
  id: string
  rank: number
  category: string
  emoji: string
  date: string
  title: string
  summary: string
  body: string
  twist: string
  knowledge: NewsKnowledge[]
}

export const newsTop10: NewsItem[] = [
  {
    id: 'nvda-earnings',
    rank: 1,
    category: 'earnings',
    emoji: '📊',
    date: '2026-04-30',
    title: 'NVDA 财报后期权 IV 从 78% 暴跌至 42%',
    summary: 'NVIDIA 公布 2026 Q1 财报，营收超预期 8%，但买入跨式期权的投资者整体亏损。',
    body: 'NVDA 财报前 IV 一度抬升至历史 90 分位（78%），财报次日 IV 单日下跌 36 点至 42%——典型 IV crush。即使股价上涨 +4.2%，跨式持有者因 Vega 损失大于 Delta 收益，普遍亏损 15-25%。\n\n机构投资者通过卖出跨式获利。本次案例再次印证："财报前买跨式" 多数时候是收割韭菜的结构。',
    twist: '股价涨了，跨式期权反而亏——IV crush 的杀伤力被严重低估。',
    knowledge: [
      { type: 'chapter', ref: 7, why: '跨式策略的 IV crush 案例' },
      { type: 'glossary', ref: 'IV Crush', why: '本次新闻的核心机制' },
      { type: 'chapter', ref: 9, why: '隐含波动率的财报前后变化' }
    ]
  },
  {
    id: 'spy-collar',
    rank: 2,
    category: 'hedge',
    emoji: '🛡️',
    date: '2026-04-29',
    title: '机构大量配置 SPY collar 对冲 5 月不确定性',
    summary: 'CBOE 数据显示 SPY 4 月 collar 期权交易量创年内新高。',
    body: '面对 5 月可能的 Fed 议息会议变数，多家对冲基金通过 SPY 560 现价 + 卖 580 call + 买 540 put 的 zero-cost collar 结构降低风险敞口。\n\n该结构放弃了 SPY 涨破 580 的部分收益，换来下方 540 的"硬保险"，且成本接近 0。这是典型的"对冲事件而非择时"思路。',
    twist: 'Collar 的"零成本"本质是把上行收益变现为下行保护。',
    knowledge: [
      { type: 'chapter', ref: 8, why: 'Collar 的标准应用案例' },
      { type: 'glossary', ref: '双限期权', why: '本新闻的主角策略' },
      { type: 'path', ref: 'hedge', why: '套保系统学习路径' }
    ]
  },
  {
    id: 'vix-backwardation',
    rank: 3,
    category: 'volatility',
    emoji: '🎢',
    date: '2026-04-28',
    title: 'VIX 期限结构罕见进入 backwardation',
    summary: '4 月底 VIX 9D = 28，VIX 30D = 22，市场对短期恐慌定价。',
    body: '近期地缘事件触发 VIX 短端跳升，长端相对平稳，期限结构出现近端高于远端的 backwardation 形态。\n\n历史上 VIX backwardation 持续不超过 2 周，且回归 contango 时常对应反弹起点。买入日历价差 (卖近月 + 买远月) 在该形态下有正期望。',
    twist: 'Backwardation 是恐慌的短期定价，但回归本身是套利信号。',
    knowledge: [
      { type: 'chapter', ref: 10, why: '期限结构背景知识' },
      { type: 'chapter', ref: 12, why: '日历价差套利策略' },
      { type: 'glossary', ref: 'Backwardation', why: '本新闻的核心概念' }
    ]
  },
  {
    id: 'tsla-puts',
    rank: 4,
    category: 'equity',
    emoji: '🚗',
    date: '2026-04-27',
    title: 'TSLA put/call 比率升至 1.4，看跌情绪浓厚',
    summary: '机构在 250 行权价下方建立大量 put 头寸。',
    body: 'TSLA 当前价 250。Open Interest 显示 230、240 put 持仓量为 230 call 的 2-3 倍。Put-Call Skew 显著扩大。\n\n这不一定是看跌——更可能是机构 protective put 套保需求集中。但 OTM put IV 显著高于对称 OTM call，反映了"崩盘溢价"。',
    twist: '高 put 持仓不一定看跌——可能是机构在买保险。',
    knowledge: [
      { type: 'chapter', ref: 8, why: 'Protective put 的实战应用' },
      { type: 'glossary', ref: '波动率偏斜', why: '股指/单股 IV skew 现象' },
      { type: 'chapter', ref: 9, why: 'IV skew 的成因' }
    ]
  },
  {
    id: 'aapl-calendar',
    rank: 5,
    category: 'strategy',
    emoji: '📅',
    date: '2026-04-26',
    title: 'AAPL 横盘 30 天，日历价差策略月度跑赢 SPY',
    summary: '低波动环境下，日历价差展现 Theta 收割能力。',
    body: 'AAPL 4 月以 ±2% 区间窄幅波动。卖出 5 月 200 call + 买入 7 月 200 call 的日历价差在过去 30 天产生约 +37% 收益（按权利金计），同期 SPY +1.8%。\n\n这种横盘市场是日历价差的最佳环境——近月 Theta 衰减快，远月几乎不变，时间价值差被锁定。',
    twist: '横盘不一定无聊——对 Theta 收割者而言是黄金时间。',
    knowledge: [
      { type: 'chapter', ref: 4, why: '日历价差的标准应用' },
      { type: 'glossary', ref: '希塔', why: 'Theta 收割机制' },
      { type: 'path', ref: 'income', why: '稳健收益策略路径' }
    ]
  },
  {
    id: 'meta-iv-crush',
    rank: 6,
    category: 'earnings',
    emoji: '💥',
    date: '2026-04-25',
    title: 'META 财报前 IV 达 65%，下周预期 IV 回归 30%',
    summary: '期权市场对 META 财报定价显著的双向 ±9% 波动空间。',
    body: 'META 当前 500，财报前 ATM straddle 报价约 45 美元，对应 ±9% 隐含波动空间。历史上 META 财报实际波动均值约 ±5.2%。\n\n这意味着即使方向正确，跨式投资者面对 60% 的概率因 IV crush 而亏损——除非实际波动突破隐含范围。',
    twist: '期权市场对财报"过度定价"是结构性的，多数年份卖跨式的胜率超 60%。',
    knowledge: [
      { type: 'chapter', ref: 7, why: '跨式策略的财报应用' },
      { type: 'chapter', ref: 9, why: 'IV 与实际波动率的差异' },
      { type: 'glossary', ref: 'IV Crush', why: '财报后核心现象' }
    ]
  },
  {
    id: 'qqq-bullspread',
    rank: 7,
    category: 'strategy',
    emoji: '📈',
    date: '2026-04-24',
    title: 'QQQ 牛市价差成交量激增，机构温和看涨 5 月',
    summary: '500-510 call spread 成为 4 月最热门组合。',
    body: 'QQQ 现价 490。买 5 月 500 call $4 + 卖 5 月 510 call $1.5 的 bull call spread 成交量过去一周翻倍。\n\n该组合净支出 $2.5，最大盈利 $7.5（QQQ ≥510 时），赔率 3:1。机构不愿付高 IV 买裸 call，价差结构成为温和看涨的优选表达。',
    twist: '"看涨"和"涨多少"是两个问题——价差让你只为合理的预期付费。',
    knowledge: [
      { type: 'chapter', ref: 3, why: '垂直价差的标准案例' },
      { type: 'path', ref: 'directional', why: '方向性交易路径' },
      { type: 'glossary', ref: '牛市看涨价差', why: '本新闻策略本身' }
    ]
  },
  {
    id: 'amzn-covered',
    rank: 8,
    category: 'income',
    emoji: '💰',
    date: '2026-04-23',
    title: 'AMZN 200 万股 covered call 滚仓，年化收益 18%',
    summary: '某养老基金披露使用 covered call 增强股票收益。',
    body: '该基金持有 AMZN 现货，每月卖出 5% OTM call (200 万股 ≈ 2 万张合约)，每月权利金收入约 1.5%。叠加股息与价格变化，年化 covered call 增强收益约 18%。\n\n关键挑战：当 AMZN 月内涨破卖出 K 时需 roll up + roll out，避免被 assigned。',
    twist: '机构级 covered call 不是"赌方向"，而是把持股转化为债券化现金流。',
    knowledge: [
      { type: 'chapter', ref: 8, why: 'Covered call 实战' },
      { type: 'glossary', ref: '担保看涨', why: '本新闻策略' },
      { type: 'path', ref: 'income', why: '收益增强路径' }
    ]
  },
  {
    id: 'googl-skew',
    rank: 9,
    category: 'volatility',
    emoji: '😊',
    date: '2026-04-22',
    title: 'GOOGL 25-delta skew 扩至年内最高',
    summary: 'OTM put IV 显著高于对称 OTM call，反映崩盘担忧。',
    body: 'GOOGL 175。25-delta put IV 39%，25-delta call IV 27%。差值 12 点是近一年极值，说明市场为下跌买保险的需求远高于看涨投机。\n\n该 skew 状态在历史上对应过度防御阶段，反向卖 put 的胜率显著提升——但前提是基本面无重大利空。',
    twist: 'Skew 极值是"群众恐慌"的最直接读数，逆向交易者最爱看的指标之一。',
    knowledge: [
      { type: 'chapter', ref: 9, why: 'Volatility skew 的定义与成因' },
      { type: 'glossary', ref: '波动率偏斜', why: '本新闻的核心指标' },
      { type: 'chapter', ref: 11, why: '波动率交易的多维视角' }
    ]
  },
  {
    id: 'msft-diagonal',
    rank: 10,
    category: 'strategy',
    emoji: '🔀',
    date: '2026-04-21',
    title: 'MSFT 对角价差成"穷人 covered call"新宠',
    summary: '远月 deep ITM call 替代股票，资金占用降低 80%。',
    body: 'MSFT 430。买入 7 月 380 call $58 (深度 ITM, ~Delta 0.85) + 卖出 5 月 440 call $4.5。资金占用约 5400 美元，相比 100 股股票 (43000) 节省 87%。\n\n该结构在标的横盘或温和上涨时表现优异。但需注意：深度 ITM 远月期权的滚动成本与流动性。',
    twist: '"穷人 covered call" 不是简陋——它是资金效率的精算。',
    knowledge: [
      { type: 'chapter', ref: 6, why: '对角价差的标准案例' },
      { type: 'glossary', ref: '对角价差', why: '本新闻策略' },
      { type: 'chapter', ref: 8, why: '与传统 covered call 对比' }
    ]
  }
]
