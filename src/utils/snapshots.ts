/**
 * 历史快照与反预期数据 — 各章节使用 MAG7 + SPY/QQQ + VIX 真实场景
 */

export interface PredictDef {
  question: string
  options: string[]
  correct: number
  contextLine: string
}

export interface RevealDef {
  title: string
  delta: string
  explain: string
  twist: string
}

export interface SnapshotItem<P> {
  key: string
  label: string
  accent?: 'primary' | 'danger'
  params: P
  predict?: PredictDef
  reveal?: RevealDef
}

// ===== Ch1: 单腿期权 =====
import type { SingleLegParams } from './formulas'

export const ch1Snapshots: SnapshotItem<SingleLegParams>[] = [
  {
    key: 'aapl-call',
    label: 'AAPL 200 看涨',
    params: { S: 200, K: 200, premium: 5, type: 'call', side: 'long' },
    predict: {
      question: 'AAPL 涨到 210 美元，你的 200 行权价 call ($5 权利金) 盈亏是？',
      options: ['+$10', '+$5', '-$5', '$0'],
      correct: 1,
      contextLine: 'AAPL 现价 200，权利金 5，到期价 210'
    },
    reveal: {
      title: '看涨期权杠杆效应',
      delta: '+$5 / 期权 100% 收益率',
      explain: '股价涨 5% 但期权赚 100%。这就是期权杠杆。但若 AAPL 横盘或下跌，权利金 5 元归 0。',
      twist: '杠杆是双刃剑——同样的 5 美元，下跌时变 -100%。'
    }
  },
  {
    key: 'tsla-put',
    label: 'TSLA 250 看跌',
    accent: 'danger',
    params: { S: 250, K: 250, premium: 8, type: 'put', side: 'long' }
  },
  {
    key: 'nvda-leverage',
    label: 'NVDA 130 ITM call',
    accent: 'primary',
    params: { S: 130, K: 125, premium: 8, type: 'call', side: 'long' }
  },
  {
    key: 'spy-otm-put',
    label: 'SPY 540 OTM put',
    params: { S: 560, K: 540, premium: 3, type: 'put', side: 'long' }
  }
]

// ===== Ch2: 四大基本策略 =====
export const ch2Snapshots: SnapshotItem<SingleLegParams>[] = [
  {
    key: 'long-call',
    label: '买 AAPL call',
    params: { S: 200, K: 200, premium: 5, type: 'call', side: 'long' }
  },
  {
    key: 'short-call',
    label: '裸卖 NVDA call',
    accent: 'danger',
    params: { S: 130, K: 135, premium: 4, type: 'call', side: 'short' },
    predict: {
      question: '裸卖 NVDA 135 call $4，NVDA 飙到 200 美元，你的损失约？',
      options: ['$4', '$65', '$60', '无限'],
      correct: 2,
      contextLine: 'NVDA 暴涨'
    },
    reveal: {
      title: '裸卖 call 的尾部风险',
      delta: '-$60+/股 (× 100 股 = -$6000+)',
      explain: '收益 = $4 - max(200-135, 0) = -$61。如果 NVDA 涨到 300+，亏损是 100 倍权利金。',
      twist: '裸卖 call 看似"小钱稳赚"，实际是在裸捡硬币——直到压路机来。'
    }
  },
  {
    key: 'long-put',
    label: '买 SPY put',
    params: { S: 560, K: 555, premium: 6, type: 'put', side: 'long' }
  },
  {
    key: 'short-put',
    label: '卖 GOOGL put',
    params: { S: 175, K: 170, premium: 3.5, type: 'put', side: 'short' }
  }
]

// ===== Ch3: 垂直价差 =====
import type { VerticalSpreadParams } from './formulas'

export const ch3Snapshots: SnapshotItem<VerticalSpreadParams>[] = [
  {
    key: 'nvda-bull-call',
    label: 'NVDA 牛市 call spread',
    params: { S: 130, K1: 130, K2: 140, premium1: 5, premium2: 2, type: 'bull-call' },
    predict: {
      question: 'NVDA 130 现价。买 130 call $5 + 卖 140 call $2。NVDA 涨到 140 时盈亏？',
      options: ['+$3', '+$5', '+$7', '+$10'],
      correct: 2,
      contextLine: '牛市价差最大盈利场景'
    },
    reveal: {
      title: '垂直价差的赔率',
      delta: '+$7 / 净支出 $3 = 233% 收益',
      explain: '风险 $3，收益 $7，赔率 2.33:1。胜率约 35%（NVDA 涨 7%+）。这是用结构换"胜率适中、赔率不错"。',
      twist: '裸 call 收益无限但要付高权利金；价差用 60% 折扣换有限收益——赔率/概率的精算。'
    }
  },
  {
    key: 'spy-bear-put',
    label: 'SPY 熊市 put spread',
    params: { S: 560, K1: 540, K2: 555, premium1: 4, premium2: 9, type: 'bear-put' }
  },
  {
    key: 'aapl-bull-put-credit',
    label: 'AAPL 牛市 put 信用价差',
    accent: 'primary',
    params: { S: 200, K1: 190, K2: 195, premium1: 1, premium2: 3, type: 'bull-put' }
  }
]

// ===== Ch4: 日历价差 =====
import type { CalendarParams } from './formulas'

export const ch4Snapshots: SnapshotItem<CalendarParams>[] = [
  {
    key: 'aapl-flat',
    label: 'AAPL 横盘',
    params: { S: 200, K: 200, r: 0.05, sigmaShort: 0.25, sigmaLong: 0.28, Tshort: 30 / 365, Tlong: 90 / 365, type: 'call' },
    predict: {
      question: 'AAPL 横盘 30 天，30 天后近月期权权利金归 0，远月还剩约 5。该日历价差盈亏（净支出 3）？',
      options: ['-$3', '$0', '+$2', '+$5'],
      correct: 2,
      contextLine: '日历价差 + 横盘环境'
    },
    reveal: {
      title: '日历价差的 Theta 红利',
      delta: '约 +$2 / 净支出 $3 = +67%',
      explain: '近月 ATM call 时间价值衰减得更快。即使股价不动，远月几乎不变，吃下了"时间差价"。',
      twist: '横盘市场对裸 call 是死亡，对日历价差是黄金。'
    }
  },
  {
    key: 'nvda-event',
    label: 'NVDA 财报后 IV crush',
    accent: 'danger',
    params: { S: 130, K: 130, r: 0.05, sigmaShort: 0.45, sigmaLong: 0.50, Tshort: 7 / 365, Tlong: 60 / 365, type: 'call' }
  },
  {
    key: 'qqq-vol-up',
    label: 'QQQ IV 上升',
    accent: 'primary',
    params: { S: 490, K: 490, r: 0.05, sigmaShort: 0.20, sigmaLong: 0.25, Tshort: 30 / 365, Tlong: 90 / 365, type: 'call' }
  }
]

// ===== Ch7: 跨式 =====
import type { StraddleParams } from './formulas'

export const ch7Snapshots: SnapshotItem<StraddleParams>[] = [
  {
    key: 'nvda-earnings',
    label: 'NVDA 财报前买跨式',
    accent: 'danger',
    params: { S: 130, K: 130, callPremium: 5, putPremium: 4, side: 'long', variant: 'straddle' },
    predict: {
      question: 'NVDA 财报次日涨 +4%，IV 从 78% 暴跌到 42%。跨式（净付 $9）盈亏？',
      options: ['+$5', '+$2', '$0', '-$3'],
      correct: 3,
      contextLine: 'Long straddle 遇上 IV crush'
    },
    reveal: {
      title: 'IV crush 的隐形杀手',
      delta: '约 -$3 / -33% 损失',
      explain: '股价方向对了，但 IV 从 78→42 让权利金缩水 50%+。Vega 损失 > Delta 收益。',
      twist: '财报前买跨式，多数时候是"为不确定性付溢价"——确定性公布瞬间溢价归 0。'
    }
  },
  {
    key: 'spy-vol-spike',
    label: 'SPY 大波动行情',
    accent: 'primary',
    params: { S: 560, K: 560, callPremium: 8, putPremium: 7, side: 'long', variant: 'straddle' }
  },
  {
    key: 'meta-strangle',
    label: 'META 宽跨式',
    params: { S: 500, K: 480, K2: 520, callPremium: 8, putPremium: 7, side: 'long', variant: 'strangle' }
  },
  {
    key: 'tsla-strap',
    label: 'TSLA 带式（看涨）',
    params: { S: 250, K: 250, callPremium: 12, putPremium: 10, side: 'long', variant: 'strap' }
  }
]

// ===== Ch8: 套保策略 =====
import type { CoveredCallParams, ProtectivePutParams, CollarParams } from './formulas'

export type Ch8Params =
  | { kind: 'covered'; data: CoveredCallParams }
  | { kind: 'protective'; data: ProtectivePutParams }
  | { kind: 'collar'; data: CollarParams }

export const ch8Snapshots: SnapshotItem<Ch8Params>[] = [
  {
    key: 'aapl-covered',
    label: 'AAPL covered call',
    params: { kind: 'covered', data: { S0: 200, K: 210, premium: 3 } },
    predict: {
      question: '持有 AAPL@200，卖 210 call $3。AAPL 涨到 220，盈亏？',
      options: ['+$23', '+$13', '+$10', '+$3'],
      correct: 1,
      contextLine: 'Covered call 上限被锁'
    },
    reveal: {
      title: 'Covered call 的代价',
      delta: '+$13 vs 持股 +$20',
      explain: '股票部分 +20，但 call 被行权，等于 210 卖出股票（净 +10）。加权利金 3 = +13。少赚 7。',
      twist: 'Covered call 在牛市顶部跑输持股——但回撤期帮你回血，长期波动率更低。'
    }
  },
  {
    key: 'spy-protective',
    label: 'SPY protective put',
    params: { kind: 'protective', data: { S0: 560, K: 540, premium: 8 } }
  },
  {
    key: 'msft-collar',
    label: 'MSFT zero-cost collar',
    accent: 'primary',
    params: { kind: 'collar', data: { S0: 430, Kc: 450, Kp: 410, callPremium: 6, putPremium: 6 } }
  }
]

// ===== Ch9: BSM =====
import type { BSMParams } from './formulas'

export const ch9Snapshots: SnapshotItem<BSMParams>[] = [
  {
    key: 'aapl-atm',
    label: 'AAPL ATM 30天',
    params: { S: 200, K: 200, r: 0.05, T: 30 / 365, sigma: 0.25 },
    predict: {
      question: 'IV 从 25% 升到 35%，AAPL 200 ATM 30 天 call 价格变化？',
      options: ['不变', '约 -25%', '约 +30%', '约 +45%'],
      correct: 3,
      contextLine: 'BSM 的 Vega 效应'
    },
    reveal: {
      title: '波动率定价的威力',
      delta: '约 +45% (从 ~$5.7 到 ~$8.3)',
      explain: 'ATM 期权 Vega 最大。IV 上升 10 点，期权价格几乎线性上涨 40-50%。',
      twist: '股价没动，期权涨了——Vega 暴露解释了为什么"做多波动率"是一种独立的交易方向。'
    }
  },
  {
    key: 'vix-extreme',
    label: 'VIX 高波动 (2020 3 月)',
    accent: 'danger',
    params: { S: 560, K: 560, r: 0.05, T: 30 / 365, sigma: 0.80 }
  },
  {
    key: 'low-vol',
    label: '2017 低波动平静期',
    params: { S: 200, K: 200, r: 0.025, T: 30 / 365, sigma: 0.10 }
  }
]

// ===== Ch10: 期限结构 =====
export interface Ch10Params {
  vix9d: number
  vix30d: number
  vix90d: number
}

export const ch10Snapshots: SnapshotItem<Ch10Params>[] = [
  {
    key: 'normal',
    label: '常态 (Contango)',
    params: { vix9d: 13, vix30d: 16, vix90d: 19 }
  },
  {
    key: 'panic-2020',
    label: '2020/3 恐慌',
    accent: 'danger',
    params: { vix9d: 70, vix30d: 55, vix90d: 35 },
    predict: {
      question: '当短端 VIX (40+) 显著高于长端 (20)，市场在表达？',
      options: ['永远恐慌', '恐慌是暂时的', '看好上涨', '没信息'],
      correct: 1,
      contextLine: 'VIX backwardation 的解读'
    },
    reveal: {
      title: '波动率的均值回归',
      delta: 'Backwardation = 短期恐慌定价',
      explain: '远端 IV 是市场对"长期常态"的定价。短端飙升远端不变，意味着市场认为危机是短期的。',
      twist: 'VIX 进入 backwardation 历史上是反弹起点的信号——危机定价 ≠ 危机延续。'
    }
  },
  {
    key: 'pre-event',
    label: '事件前预期波动',
    accent: 'primary',
    params: { vix9d: 22, vix30d: 25, vix90d: 18 }
  }
]

// ===== Ch5/6/11/12 简化快照 =====
export const ch5Snapshots: SnapshotItem<{ S: number; K1: number; K2: number; ratio: number }>[] = [
  { key: 'tsla-front', label: 'TSLA 1:2 前置', params: { S: 250, K1: 250, K2: 270, ratio: 2 } },
  { key: 'nvda-back', label: 'NVDA 2:1 后置', params: { S: 130, K1: 125, K2: 135, ratio: 0.5 } }
]

export const ch6Snapshots: SnapshotItem<{ S: number; K1: number; K2: number; Tshort: number; Tlong: number }>[] = [
  { key: 'msft-poor-cc', label: 'MSFT 穷人 covered call', params: { S: 430, K1: 380, K2: 440, Tshort: 30 / 365, Tlong: 180 / 365 } },
  { key: 'amzn-double', label: 'AMZN 双对角', params: { S: 190, K1: 185, K2: 200, Tshort: 14 / 365, Tlong: 60 / 365 } }
]

export const ch11Snapshots: SnapshotItem<{ order: 1 | 2 | 3 | 4 }>[] = [
  { key: 'order1', label: '一阶: long straddle', params: { order: 1 } },
  { key: 'order2', label: '二阶: 比例价差', params: { order: 2 } },
  { key: 'order3', label: '三阶: 分散套利', params: { order: 3 } },
  { key: 'order4', label: '四阶: VIX 期权', params: { order: 4 } }
]

export const ch12Snapshots: SnapshotItem<{ ivShort: number; ivLong: number; threshold: number }>[] = [
  {
    key: 'buy-calendar',
    label: '买入日历价差信号',
    params: { ivShort: 28, ivLong: 22, threshold: 5 },
    predict: {
      question: '当月 IV 28%，次月 IV 22%。该信号开仓什么？',
      options: ['买当月卖次月', '卖当月买次月', '不开仓', '随便'],
      correct: 1,
      contextLine: '波动率期限结构套利'
    },
    reveal: {
      title: '期限结构套利信号',
      delta: '卖当月买次月（卖出日历价差）',
      explain: '当月 IV 异常高于次月，预期回归 → 卖近、买远。同时调整数量比保 Delta 中性。',
      twist: '该策略 2015-2019 年化 23.1%，但需要每天扫描 IV 差并精确调整数量比——纯手工根本做不动。'
    }
  },
  { key: 'sell-calendar', label: '卖出日历价差信号', params: { ivShort: 22, ivLong: 28, threshold: 5 } }
]
