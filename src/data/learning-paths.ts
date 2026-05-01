export interface PathNode {
  ch: number
  role: string
  why: string
}

export interface LearningPath {
  id: string
  emoji: string
  title: string
  tag: string
  level: 1 | 2 | 3 | 4 | 5
  minutes: number
  hook: string
  outcome: string
  color: string
  nodes: PathNode[]
}

export const learningPaths: LearningPath[] = [
  {
    id: 'starter',
    emoji: '🚀',
    title: '期权零基础速通',
    tag: '入门 · 3 章 · 20 min',
    level: 1,
    minutes: 20,
    hook: '从买 AAPL call 到卖 covered call，三章学会基本玩法',
    outcome: '看懂期权报价单，知道何时买/卖 call/put',
    color: 'blue',
    nodes: [
      { ch: 1, role: '地基', why: '权利金、行权价、ITM/OTM 这些黑话先扫盲' },
      { ch: 2, role: '工具', why: '4 张盈亏图——这是你看懂任何策略的基础语言' },
      { ch: 8, role: '应用', why: '第一笔实盘大概率从 covered call 或 protective put 开始' }
    ]
  },
  {
    id: 'spreads',
    emoji: '📐',
    title: '价差策略全景',
    tag: '核心 · 4 章 · 40 min',
    level: 3,
    minutes: 40,
    hook: '从牛市价差到对角价差，构建任意风险曲线',
    outcome: '能用价差精确表达"涨多少/在哪个区间"的观点',
    color: 'purple',
    nodes: [
      { ch: 3, role: '入门', why: '垂直价差是所有多腿组合的起点' },
      { ch: 4, role: '维度', why: '加入"时间"维度——日历价差揭示 Theta 的力量' },
      { ch: 5, role: '变形', why: '不对称比例放大胜率或赔率' },
      { ch: 6, role: '集大成', why: '对角价差 = 垂直 + 水平，8 种组合一图打尽' }
    ]
  },
  {
    id: 'volatility',
    emoji: '🎢',
    title: '波动率大师之路',
    tag: '进阶 · 4 章 · 45 min',
    level: 4,
    minutes: 45,
    hook: '为什么 NVDA 财报后期权暴跌，即使股价没动？',
    outcome: '理解 IV crush、波动率微笑、期限结构',
    color: 'orange',
    nodes: [
      { ch: 7, role: '直觉', why: '跨式让你第一次"做多波动率"' },
      { ch: 9, role: '理论', why: 'BSM 与 IV 是所有波动率交易的语言' },
      { ch: 10, role: '结构', why: '看懂 IV 期限结构 = 看懂市场对未来的预期' },
      { ch: 11, role: '实战', why: '从一阶到四阶，找到属于你的波动率交易' }
    ]
  },
  {
    id: 'hedge',
    emoji: '🛡️',
    title: '风险对冲指南',
    tag: '实战 · 3 章 · 25 min',
    level: 2,
    minutes: 25,
    hook: 'MAG7 持仓如何用 30% 的成本得到 80% 的下行保护？',
    outcome: '会给现有股票仓位上"保险"',
    color: 'green',
    nodes: [
      { ch: 2, role: '语言', why: '先看懂单腿期权图' },
      { ch: 8, role: '工具箱', why: 'Covered call / protective put / collar 三件套' },
      { ch: 3, role: '升级', why: '用熊市价差 put spread 降低保险成本' }
    ]
  },
  {
    id: 'income',
    emoji: '💰',
    title: '稳健收益策略',
    tag: '收益 · 3 章 · 30 min',
    level: 2,
    minutes: 30,
    hook: '横盘市场如何月入 1-2% 现金流？',
    outcome: '搭建 wheel / 日历 / 比例的现金流组合',
    color: 'gold',
    nodes: [
      { ch: 8, role: '基石', why: 'Covered call 是最经典的"卖时间换现金"' },
      { ch: 4, role: '加速', why: '日历价差从近月权利金衰减中赚钱' },
      { ch: 5, role: '增强', why: '比例价差在合适方向上放大权利金收入' }
    ]
  },
  {
    id: 'directional',
    emoji: '📊',
    title: '方向性交易',
    tag: '核心 · 4 章 · 35 min',
    level: 3,
    minutes: 35,
    hook: '看好 NVDA 涨 10%——直接买 call 还是用价差？',
    outcome: '为不同涨跌幅选最优策略',
    color: 'teal',
    nodes: [
      { ch: 1, role: '基础', why: '先理解单腿杠杆' },
      { ch: 2, role: '比较', why: '对比"买股票 vs 买 call"' },
      { ch: 3, role: '优化', why: '强烈方向 + 限定空间用垂直价差更省钱' },
      { ch: 6, role: '精确', why: '对角价差表达"短期看涨 + 长期中性"' }
    ]
  },
  {
    id: 'quant',
    emoji: '🧪',
    title: '量化套利入门',
    tag: '进阶 · 3 章 · 40 min',
    level: 5,
    minutes: 40,
    hook: '机构如何用波动率期限结构年化 23%？',
    outcome: '理解 BSM/IV 偏差套利的逻辑与回测',
    color: 'indigo',
    nodes: [
      { ch: 9, role: '模型', why: 'BSM 给出"理论"价格，偏离即机会' },
      { ch: 10, role: '维度', why: '期限结构是套利空间的来源' },
      { ch: 12, role: '实战', why: '完整的信号→开仓→Delta 中性→平仓流程' }
    ]
  },
  {
    id: 'mixed',
    emoji: '🦋',
    title: '混合策略专精',
    tag: '专题 · 3 章 · 35 min',
    level: 4,
    minutes: 35,
    hook: '不知道方向，但确定波动——怎么赚？',
    outcome: '掌握 straddle/strangle/strip/strap/对角组合',
    color: 'pink',
    nodes: [
      { ch: 7, role: '入门', why: '跨式是"做多波动"的最直接表达' },
      { ch: 5, role: '不对称', why: '比例价差给出非对称跨式' },
      { ch: 6, role: '高级', why: '对角组合调度多个时间维度' }
    ]
  },
  {
    id: 'master',
    emoji: '🏆',
    title: '全面期权高手',
    tag: '挑战 · 5 章 · 60 min',
    level: 5,
    minutes: 60,
    hook: '从权利金到 VIX 套利，60 分钟看完一本书',
    outcome: '能独立设计复合策略并理解风险',
    color: 'red',
    nodes: [
      { ch: 1, role: '语言', why: '黑话先通' },
      { ch: 3, role: '组合', why: '价差是组合化思维的起点' },
      { ch: 7, role: '波动', why: '从方向交易转向波动交易' },
      { ch: 9, role: '理论', why: 'BSM 是所有定价的根基' },
      { ch: 12, role: '应用', why: '机构级套利策略的完整闭环' }
    ]
  }
]

export interface PathGroup {
  id: string
  title: string
  desc: string
  pathIds: string[]
}

export const pathGroups: PathGroup[] = [
  { id: 'start', title: '🌱 起步线', desc: '0 经验从这里开始', pathIds: ['starter'] },
  { id: 'core', title: '⚡ 三大核心', desc: '价差 / 波动率 / 套保', pathIds: ['spreads', 'volatility', 'hedge'] },
  { id: 'advanced', title: '🚀 进阶', desc: '量化与方向交易', pathIds: ['quant', 'directional', 'mixed'] },
  { id: 'theme', title: '🎯 主题速通', desc: '按目标选路径', pathIds: ['income', 'master'] }
]

export function findPath(id: string): LearningPath | undefined {
  return learningPaths.find(p => p.id === id)
}
