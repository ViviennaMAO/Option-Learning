export interface QuizQuestion {
  id: string
  ch: number
  level: 'recall' | 'apply' | 'analyze' | 'synth'
  question: string
  options: string[]
  answer: number
  explain: string
  tags?: string[]
}

export const chapterQuiz: Record<number, QuizQuestion[]> = {
  1: [
    {
      id: 'q1-1', ch: 1, level: 'recall',
      question: '买入 AAPL 200 美元的看涨期权，权利金 5 美元。到期日 AAPL = 210，你的盈亏是？',
      options: ['+10', '+5', '-5', '0'],
      answer: 1,
      explain: '盈亏 = (210 - 200) - 5 = +5。看涨期权多头收益 = max(S-K, 0) - 权利金。'
    },
    {
      id: 'q1-2', ch: 1, level: 'recall',
      question: '以下哪种状态属于"实值"(ITM) 看跌期权？',
      options: ['标的 250，K=250', '标的 240，K=250', '标的 260，K=250', '标的 = K'],
      answer: 1,
      explain: 'Put 实值条件是 K > S。240 < 250 = K，立即行权可获利，是 ITM put。'
    },
    {
      id: 'q1-3', ch: 1, level: 'apply',
      question: 'NVDA 从 130 涨到 137（+5.4%），你买的 130 call 权利金从 4 涨到 9。期权涨幅是？',
      options: ['约 5%', '约 50%', '约 125%', '约 200%'],
      answer: 2,
      explain: '(9-4)/4 = 125%。期权杠杆放大了股价波动——这就是为什么期权风险也巨大。'
    },
    {
      id: 'q1-4', ch: 1, level: 'analyze',
      question: '为什么深度虚值 (deep OTM) 的期权权利金往往很低？',
      options: [
        '因为发行方限价',
        '因为行权概率极低',
        '因为没有成交量',
        '因为对冲成本低'
      ],
      answer: 1,
      explain: '权利金 ≈ 内在价值 + 时间价值。Deep OTM 内在价值为 0，时间价值反映行权概率，概率低则价值低。'
    },
    {
      id: 'q1-5', ch: 1, level: 'synth',
      question: '关于"买 call vs 直接买股票"，以下说法最准确的是？',
      options: [
        'Call 永远比股票回报高',
        'Call 用更少资金获取相同方向暴露，但要支付时间价值',
        'Call 没有风险',
        'Call 收益等于股票收益'
      ],
      answer: 1,
      explain: 'Call 是用权利金购买"在 T 时间内涨上去"的权利。换来杠杆，付出时间价值。横盘也会亏。'
    }
  ],
  2: [
    {
      id: 'q2-1', ch: 2, level: 'recall',
      question: '裸卖 (naked) 看涨期权的最大亏损是？',
      options: ['权利金', '行权价', '0', '理论上无限'],
      answer: 3,
      explain: '标的可以无限上涨，所以裸卖 call 的损失理论无限——这也是大多数散户账户被爆仓的根源。'
    },
    {
      id: 'q2-2', ch: 2, level: 'apply',
      question: '卖出 TSLA 250 put，权利金 10。到期 TSLA = 230，盈亏？',
      options: ['+10', '-10', '-20', '0'],
      answer: 1,
      explain: '卖 put 收益 = 权利金 - max(K-S, 0) = 10 - 20 = -10。'
    },
    {
      id: 'q2-3', ch: 2, level: 'apply',
      question: '同一个 SPY 行权价 560、同一到期日，call 权利金 12，put 权利金 8。如果不考虑利率，理论上 SPY 现价应是？（提示 put-call parity）',
      options: ['556', '560', '564', '572'],
      answer: 2,
      explain: 'Put-call parity（忽略利率）：S = K + C - P = 560 + 12 - 8 = 564。'
    },
    {
      id: 'q2-4', ch: 2, level: 'analyze',
      question: '为什么"卖 put = 愿意以 K 价买入股票"在情绪上比"挂限价单"更积极？',
      options: [
        '没有任何区别',
        '卖 put 收权利金，相当于"被付钱去等回调"',
        '卖 put 不会被成交',
        '卖 put 风险更小'
      ],
      answer: 1,
      explain: '挂限价单等回调是 0 成本零收益，卖 put 是"等回调还顺手赚一份权利金"。但若崩盘，被强制以 K 接货。'
    },
    {
      id: 'q2-5', ch: 2, level: 'synth',
      question: 'AAPL 现价 200，预期未来 1 个月小幅震荡。最适合的策略是？',
      options: [
        '裸买 call',
        '裸买 put',
        '卖出 ATM 跨式（同卖 call + put）',
        '保护性看跌'
      ],
      answer: 2,
      explain: '横盘行情下卖跨式收双份权利金；多数时候 IV 大于实际波动，卖方占优。但需注意尾部风险。'
    }
  ],
  3: [
    {
      id: 'q3-1', ch: 3, level: 'recall',
      question: '牛市看涨价差 (bull call spread) 由哪两腿组成？',
      options: ['买低 K call + 卖高 K call', '买高 K call + 卖低 K call', '买 call + 买 put', '卖 call + 卖 put'],
      answer: 0,
      explain: 'Bull call spread = 买入低行权价 call + 卖出高行权价 call。净支出权利金，限定收益限定风险。'
    },
    {
      id: 'q3-2', ch: 3, level: 'apply',
      question: 'NVDA 现价 130。买 130 call $5 + 卖 140 call $2。最大盈利是？',
      options: ['$3', '$5', '$7', '$10'],
      answer: 2,
      explain: '净付出 5-2=3。最大盈利 = (K2-K1) - 净支出 = 10 - 3 = 7。NVDA ≥ 140 时实现。'
    },
    {
      id: 'q3-3', ch: 3, level: 'apply',
      question: '同上策略，NVDA 到期 = 132，盈亏是？',
      options: ['-3', '-1', '+0', '+2'],
      answer: 1,
      explain: '收益 = max(132-130, 0) - max(132-140, 0) - 3 = 2 - 0 - 3 = -1。'
    },
    {
      id: 'q3-4', ch: 3, level: 'analyze',
      question: '为什么垂直价差比裸买 call 更"理性"？',
      options: [
        '盈利空间无限',
        '权利金更低，但放弃了远端收益',
        '完全无风险',
        '不会被分配'
      ],
      answer: 1,
      explain: '通过卖出更高 K 的 call 收回部分权利金，降低盈亏平衡点。代价：上行收益封顶。适合"涨但有限度"的观点。'
    },
    {
      id: 'q3-5', ch: 3, level: 'synth',
      question: '蝶式价差 (butterfly) 的最大盈利出现在？',
      options: [
        '标的暴涨',
        '标的暴跌',
        '标的恰好等于中间行权价',
        '标的不动'
      ],
      answer: 2,
      explain: 'Butterfly 在中间 K 处达到最大盈利，远离则趋于 0 甚至小亏。本质是"押注小幅震荡到精确点位"。'
    }
  ],
  4: [
    {
      id: 'q4-1', ch: 4, level: 'recall',
      question: '日历价差 (calendar spread) 通常是？',
      options: ['卖近月 + 买远月（同 K）', '买近月 + 卖远月（同 K）', '买 call + 买 put', '卖 call + 卖 put'],
      answer: 0,
      explain: '正向日历价差 = 卖近月 + 买远月，吃近月更快的 Theta 衰减。'
    },
    {
      id: 'q4-2', ch: 4, level: 'apply',
      question: 'AAPL 200 现价。卖 30 天 200 call $4 + 买 90 天 200 call $7。如果 30 天后 AAPL 仍 = 200，且远月期权值 $5，盈亏？',
      options: ['-$2', '$0', '+$2', '+$5'],
      answer: 2,
      explain: '净支出 7-4=3。30 天后近月 ATM call 归零（可平仓 0 元），远月降至 5。盈亏 = 5 - 3 = +2。'
    },
    {
      id: 'q4-3', ch: 4, level: 'analyze',
      question: '日历价差最大的风险是？',
      options: [
        '标的暴涨或暴跌',
        '利率变动',
        '交易费用',
        '分红'
      ],
      answer: 0,
      explain: '日历价差在标的剧烈偏离 K 时，远月与近月一起趋于内在价值，时间价值差被压缩，可能亏损。'
    },
    {
      id: 'q4-4', ch: 4, level: 'apply',
      question: '为什么日历价差对 IV 上升通常友好？',
      options: [
        '近月 IV 涨得更多',
        '远月 IV 涨得更多，远月 Vega 更大',
        'IV 不影响日历价差',
        'IV 涨永远亏钱'
      ],
      answer: 1,
      explain: '远月期权 Vega 大于近月，IV 整体上升时远月涨幅更大，组合获利。这就是"long Vega"特性。'
    },
    {
      id: 'q4-5', ch: 4, level: 'synth',
      question: '"AAPL 横盘一个月，日历价差赚 37%"——这种收益的本质来源是？',
      options: [
        '股价上涨',
        '近月期权时间价值衰减比远月快',
        '分红',
        '利率下降'
      ],
      answer: 1,
      explain: 'Theta 衰减并非线性——临到期时近月 Theta 远大于远月。横盘环境下，卖近月赚衰减、远月几乎不变。'
    }
  ],
  5: [
    {
      id: 'q5-1', ch: 5, level: 'recall',
      question: '前置比例价差 (front ratio call spread) 通常如何构建？',
      options: ['买 1 张低 K call + 卖 2 张高 K call', '卖 1 张低 K call + 买 2 张高 K call', '买 2 张高 K put', '只买远月 call'],
      answer: 0,
      explain: 'Front ratio = 1 多 + 2 空。多数情形权利金净收入或净支出小，但暴涨时损失放大。'
    },
    {
      id: 'q5-2', ch: 5, level: 'apply',
      question: '前置比例 1:2 的最大风险方向是？',
      options: ['标的不动', '标的下跌', '标的小涨到中间区间', '标的暴涨'],
      answer: 3,
      explain: '净空头 1 张 call，标的暴涨时损失放大。适合"温和看涨"，不适合趋势行情。'
    },
    {
      id: 'q5-3', ch: 5, level: 'analyze',
      question: '后置比例 (back ratio) 的盈利点在哪？',
      options: [
        '标的小幅波动',
        '标的暴涨或暴跌（同方向）',
        '横盘',
        '财报无波动'
      ],
      answer: 1,
      explain: 'Back ratio 净多两张远腿，标的剧烈偏离时多腿涨幅碾压少腿损失，赚波动。'
    },
    {
      id: 'q5-4', ch: 5, level: 'apply',
      question: 'TSLA 250 现价。买 1 张 250 call $12 + 卖 2 张 270 call $5。最大盈利出现在？',
      options: ['TSLA = 250', 'TSLA = 270', 'TSLA = 290', 'TSLA = 310'],
      answer: 1,
      explain: '在中间高 K=270 处实现最大盈利 = (270-250) + 净权利金 = 20 + (10-12) = 18。再涨则被空头拖累。'
    },
    {
      id: 'q5-5', ch: 5, level: 'synth',
      question: '比例价差适合什么样的市场观点？',
      options: [
        '强烈方向性',
        '温和方向 + 不会跑出某个区间',
        '完全横盘',
        '不确定方向'
      ],
      answer: 1,
      explain: '比例价差是"我看涨但不会涨过某价位"的精确表达。如果跑过去，多空腿不平衡放大风险。'
    }
  ],
  6: [
    {
      id: 'q6-1', ch: 6, level: 'recall',
      question: '对角价差 (diagonal spread) 同时改变？',
      options: ['只改变 K', '只改变到期日', 'K 和到期日都改变', '只改变期权类型'],
      answer: 2,
      explain: '对角价差 = 不同 K + 不同到期日，垂直与水平的混合。'
    },
    {
      id: 'q6-2', ch: 6, level: 'apply',
      question: '看涨对角：卖近月低 K call + 买远月高 K call。该组合特性？',
      options: [
        'long Vega + long Theta',
        'short Vega + short Theta',
        '中性 Vega + long Theta',
        'long Vega + short Theta'
      ],
      answer: 0,
      explain: '远月权利金 > 近月，组合净 Vega 多头；近月 Theta 衰减更快但远月权利金大，整体偏 long Vega、short Theta。'
    },
    {
      id: 'q6-3', ch: 6, level: 'analyze',
      question: '为什么对角组合常被称为"穷人的 covered call"？',
      options: [
        '不需要持股',
        '完全无风险',
        '收益更高',
        '执行更快'
      ],
      answer: 0,
      explain: '远月深度 ITM call 替代股票头寸，资金占用大幅降低（约 1/5），近月卖 call 形成 Theta 收入。'
    },
    {
      id: 'q6-4', ch: 6, level: 'apply',
      question: '对角组合最危险的场景？',
      options: [
        '横盘',
        '近月到期前标的迅速越过近月 K',
        '远月到期',
        'IV 上升'
      ],
      answer: 1,
      explain: '近月 short call 短时被 ITM 拉升，远月对冲滞后；如果近月被分配，组合结构被打破。'
    },
    {
      id: 'q6-5', ch: 6, level: 'synth',
      question: '8 种对角组合差异主要来自？',
      options: [
        '股票数量',
        'call/put × 多/空 × 近/远 的组合',
        '行权价数量',
        '到期日个数'
      ],
      answer: 1,
      explain: '类型 (call/put) × 方向 (多/空) × 时间 (近/远) = 8 种组合，覆盖从看涨到看跌、从震荡到趋势的所有观点。'
    }
  ],
  7: [
    {
      id: 'q7-1', ch: 7, level: 'recall',
      question: '跨式组合 (long straddle) 由什么组成？',
      options: ['同 K 同期 call + put', '不同 K 同期 call + put', '不同期 call + put', '只买 call'],
      answer: 0,
      explain: 'Long straddle = 买入同行权价同到期日的 call + put。本质是"做多波动率"。'
    },
    {
      id: 'q7-2', ch: 7, level: 'apply',
      question: 'NVDA 130 现价。买 130 call $5 + 130 put $4。盈亏平衡点在？',
      options: ['126 / 134', '121 / 139', '125 / 135', '130 ± 9'],
      answer: 1,
      explain: '盈亏平衡 = K ± 总权利金 = 130 ± 9 = 121/139。NVDA 必须移动超过 ±9 美元才赚钱。'
    },
    {
      id: 'q7-3', ch: 7, level: 'analyze',
      question: '"NVDA 财报前买跨式，财报后股价虽然涨 5%，但策略亏钱"——为什么？',
      options: [
        '是骗局',
        '财报前 IV 已被抬高，财报后 IV 暴跌 (IV crush) 抵消方向收益',
        '没有这个现象',
        '佣金过高'
      ],
      answer: 1,
      explain: '财报前 IV 为正常 1.5-2 倍。财报后不确定性消失，IV 暴跌。即使方向对，IV crush 让权利金缩水更多。'
    },
    {
      id: 'q7-4', ch: 7, level: 'apply',
      question: '宽跨式 (strangle) 与跨式相比？',
      options: [
        '更贵但更安全',
        '更便宜但需要更大波动',
        '完全相同',
        '只用 OTM call'
      ],
      answer: 1,
      explain: 'Strangle 用两个 OTM 期权，权利金更低；但盈亏平衡点更远，要求更大波动。'
    },
    {
      id: 'q7-5', ch: 7, level: 'synth',
      question: 'Strap (带式) 与 Strip (条式) 的差异？',
      options: [
        'Strap 偏看涨，Strip 偏看跌',
        '完全相同',
        'Strap 是 covered call',
        '都是日历价差'
      ],
      answer: 0,
      explain: 'Strap = 2 call + 1 put（看大波动且偏涨）；Strip = 1 call + 2 put（看大波动且偏跌）。'
    }
  ],
  8: [
    {
      id: 'q8-1', ch: 8, level: 'recall',
      question: 'Covered call 的构建方式？',
      options: ['持股 + 卖 call', '持股 + 买 call', '只卖 call', '空股 + 买 call'],
      answer: 0,
      explain: 'Covered call = 持股 + 卖出对应数量的 call。"covered" 即股票担保了 short call 义务。'
    },
    {
      id: 'q8-2', ch: 8, level: 'apply',
      question: '持有 100 股 AAPL@200，卖 1 张 210 call $3。AAPL 涨到 220，盈亏？',
      options: ['+$13', '+$10', '+$3', '+$23'],
      answer: 0,
      explain: '股票部分 +20，call 被行权交付 → 实际只赚到 (210-200) = 10。加权利金 3，共 +$13/股。'
    },
    {
      id: 'q8-3', ch: 8, level: 'analyze',
      question: 'Protective put 与 covered call 的核心区别？',
      options: [
        '没有区别',
        'Protective put 限亏，covered call 限盈',
        '都限亏限盈',
        '都不限'
      ],
      answer: 1,
      explain: 'Protective put = 持股 + 买 put，付权利金换下方保险；Covered call = 卖上方收益换权利金。'
    },
    {
      id: 'q8-4', ch: 8, level: 'apply',
      question: 'Collar (双限期权) 的最大亏损是？',
      options: [
        '无限',
        '当前股价',
        '股价 - put 行权价 + 净权利金',
        '0'
      ],
      answer: 2,
      explain: 'Collar = 持股 + 卖 call + 买 put。最大亏损 ≈ S - K_put + 净权利金（卖 call 收 - 买 put 支）。'
    },
    {
      id: 'q8-5', ch: 8, level: 'synth',
      question: '"巴菲特用 covered call 在横盘市赚钱"反映了什么本质？',
      options: [
        '巴菲特会预测股价',
        'Covered call 把"持股的时间价值"变现为权利金',
        'Covered call 永远赚钱',
        '股票总会上涨'
      ],
      answer: 1,
      explain: '不卖 call 时，股价时间是 0 收益。卖 call 把"未来一个月内最多涨多少"的权利变现，是收益增强的一种结构。'
    }
  ],
  9: [
    {
      id: 'q9-1', ch: 9, level: 'recall',
      question: 'BSM 模型的 5 个输入参数是？',
      options: [
        'S, K, r, T, σ',
        'S, K, V, P, T',
        'IV, HV, RV, T, K',
        'P, C, K, T, r'
      ],
      answer: 0,
      explain: '标的现价 S、行权价 K、无风险利率 r、剩余期限 T、波动率 σ。'
    },
    {
      id: 'q9-2', ch: 9, level: 'apply',
      question: 'IV 从 25% 升到 35%，相同期权理论价格？',
      options: ['不变', '下降', '上升', '取决于方向'],
      answer: 2,
      explain: 'Vega > 0：所有 long 期权（call 或 put）IV 上升时价格上涨。这是"做多波动率"的基础。'
    },
    {
      id: 'q9-3', ch: 9, level: 'analyze',
      question: '"波动率微笑"反映 BSM 的哪个假设错了？',
      options: [
        '无风险利率恒定',
        '不支付分红',
        '波动率恒定',
        '完全市场'
      ],
      answer: 2,
      explain: 'BSM 假设同标的所有期权 σ 相同。实际不同 K 反推的 IV 形成微笑/偏斜，说明分布有"肥尾"。'
    },
    {
      id: 'q9-4', ch: 9, level: 'apply',
      question: 'SPY 期权常见"波动率偏斜"是？',
      options: [
        'OTM call IV > OTM put IV',
        'OTM put IV > OTM call IV',
        '完全水平',
        '随机'
      ],
      answer: 1,
      explain: '股指期权下方 IV 高（市场对崩盘的恐惧定价），上方 IV 低，形成左偏斜，俗称 skew。'
    },
    {
      id: 'q9-5', ch: 9, level: 'synth',
      question: '为什么用 IV 而不是历史波动率 (HV) 给期权定价？',
      options: [
        'IV 更准',
        'IV 反映市场对"未来"波动率的预期，HV 是过去',
        'HV 不存在',
        '没区别'
      ],
      answer: 1,
      explain: '期权价值取决于到期前的未来波动。HV 是历史，IV 通过反推体现市场预期。多数情况 IV > HV，构成卖方收益。'
    }
  ],
  10: [
    {
      id: 'q10-1', ch: 10, level: 'recall',
      question: '什么是波动率期限结构？',
      options: [
        '不同标的的 IV 比较',
        '同标的不同到期日的 IV 曲线',
        '历史 IV 时序',
        'IV 与股价的关系'
      ],
      answer: 1,
      explain: '期限结构 = 同标的的 ATM IV 随到期日的变化。常态：远期 > 近期（contango）。'
    },
    {
      id: 'q10-2', ch: 10, level: 'apply',
      question: 'VIX9D = 40，VIX(30D) = 25——这种形态叫什么？',
      options: ['Contango', 'Backwardation', '平坦', '微笑'],
      answer: 1,
      explain: '近期 > 远期 = backwardation。市场认为短期恐慌很高但会回归。常出现在大跌期间。'
    },
    {
      id: 'q10-3', ch: 10, level: 'analyze',
      question: '波动率"均值回归"假说意味着？',
      options: [
        'IV 永远涨',
        'IV 极端值会回归长期均值',
        'IV 完全随机',
        'IV 与价格无关'
      ],
      answer: 1,
      explain: '高 IV 通常伴随急跌，恐慌过后回归正常水平；低 IV 也会因事件冲击上升。这是套利的基础。'
    },
    {
      id: 'q10-4', ch: 10, level: 'apply',
      question: '当 VIX 从 backwardation 转回 contango 时，通常意味着？',
      options: [
        '危机加剧',
        '危机逐渐平息',
        'IV 整体上升',
        '股市暴跌'
      ],
      answer: 1,
      explain: '近端 IV 下降快于远端 = 短期恐慌缓解。历史上此切换常对应反弹起点。'
    },
    {
      id: 'q10-5', ch: 10, level: 'synth',
      question: '"短端 VIX 40%、长端 20%"是市场在表达？',
      options: [
        '永远恐慌',
        '相信恐慌是暂时的',
        '看好上涨',
        '没有信息'
      ],
      answer: 1,
      explain: '远端 IV 是市场对"长期常态"的定价。如果市场认为短期恐慌会持续，远端也会上去。背离意味着均值回归。'
    }
  ],
  11: [
    {
      id: 'q11-1', ch: 11, level: 'recall',
      question: '一阶波动率交易最典型的策略是？',
      options: ['Long straddle', '日历价差', 'VIX 期货', 'Iron condor'],
      answer: 0,
      explain: '一阶 = 单边做多/空波动率，Delta 中性。Long straddle 是经典代表。'
    },
    {
      id: 'q11-2', ch: 11, level: 'apply',
      question: '二阶波动率交易引入哪种风险？',
      options: ['只 Delta', 'Gamma 在不同行权价反向', '完全无风险', 'IV 不变'],
      answer: 1,
      explain: '二阶交易（如垂直/比例价差）涉及不同 K，Gamma 与 Vega 在曲线某处会反转符号，需精细管理。'
    },
    {
      id: 'q11-3', ch: 11, level: 'analyze',
      question: '"波动率分散套利"(dispersion) 的核心逻辑？',
      options: [
        '指数 IV 通常被高估，成分股 IV 相对低估',
        '反向',
        '与波动率无关',
        '套现金'
      ],
      answer: 0,
      explain: '指数 IV 包含相关性溢价。卖指数 vol + 买成分股 vol 是经典分散套利，常见对 SPY 成分股 MAG7。'
    },
    {
      id: 'q11-4', ch: 11, level: 'apply',
      question: '四阶波动率交易在做什么？',
      options: [
        '做多/空波动率本身的波动率',
        '只买股票',
        '只买 ETF',
        '不做交易'
      ],
      answer: 0,
      explain: '四阶 = 交易"波动率的波动率"，例如 VIX 期权是 vol of vol。VIX 本身就是 SPX 期权的 vol。'
    },
    {
      id: 'q11-5', ch: 11, level: 'synth',
      question: '"做多 VIX 在 2020 年 3 月赚 400%，但其他 11 个月都亏"——本质？',
      options: [
        'VIX 不能交易',
        'VIX 期货长期处于 contango，多头持续滚仓损失',
        'VIX 只在 3 月有效',
        '随机'
      ],
      answer: 1,
      explain: 'VIX ETF 多头需不断滚远月（更贵），contango 摩擦每年吞噬 60%+ 价值。仅在恐慌爆发时盈利。'
    }
  ],
  12: [
    {
      id: 'q12-1', ch: 12, level: 'recall',
      question: '期限结构套利"买入日历价差"信号是？',
      options: [
        '当月 IV - 次月 IV > 阈值 n',
        '次月 IV - 当月 IV > 阈值 n',
        '随机',
        'Delta = 0'
      ],
      answer: 0,
      explain: '当月 IV 异常高于次月时，预期均值回归 → 卖当月、买次月。'
    },
    {
      id: 'q12-2', ch: 12, level: 'apply',
      question: '严格 Delta 中性的实现方式？',
      options: [
        '随便买卖',
        '买入手数 × Delta_buy = 卖出手数 × Delta_sell',
        '只用 ATM',
        '不需要 Delta'
      ],
      answer: 1,
      explain: '对组合 Delta 求和归 0：调整两腿数量比 V = 100 × Delta_buy / Delta_sell。'
    },
    {
      id: 'q12-3', ch: 12, level: 'analyze',
      question: '为什么期限结构套利需要 Delta 中性？',
      options: [
        '法规要求',
        '隔离方向风险，只暴露给波动率差的回归',
        '提高收益',
        '降低费用'
      ],
      answer: 1,
      explain: '套利的"alpha"来自波动率差，不是方向。Delta 暴露会让方向波动盖过套利收益甚至变成亏损。'
    },
    {
      id: 'q12-4', ch: 12, level: 'apply',
      question: '原文回测：买近卖远策略年化 14.81%，与卖近买远合并后年化？',
      options: ['8.23%', '14.81%', '23.1%', '50%'],
      answer: 2,
      explain: '两种方向合并后年化 23.1%，最大回撤 11.83%。互补的市场环境覆盖让收益曲线更平稳。'
    },
    {
      id: 'q12-5', ch: 12, level: 'synth',
      question: '该策略对哪类成本最敏感？',
      options: [
        '利率',
        '交易费用与冲击成本',
        '分红',
        '汇率'
      ],
      answer: 1,
      explain: '回测：滑点从 6/张升到 10/张，年化从 25.6% 降到 14.7%。次月合约流动性差是关键挑战。'
    }
  ]
}

export function getChapterQuiz(ch: number): QuizQuestion[] {
  return chapterQuiz[ch] || []
}

export function randomQuiz(n: number, fromChapters?: number[]): QuizQuestion[] {
  const all: QuizQuestion[] = []
  Object.entries(chapterQuiz).forEach(([k, qs]) => {
    if (!fromChapters || fromChapters.includes(Number(k))) all.push(...qs)
  })
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]]
  }
  return all.slice(0, n)
}
