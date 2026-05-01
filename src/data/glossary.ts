export interface GlossaryItem {
  zh: string
  en: string
  short: string
  twist?: string
  chapters: number[]
}

export interface GlossaryGroup {
  id: string
  title: string
  emoji: string
  desc: string
  items: GlossaryItem[]
}

export const glossary: GlossaryGroup[] = [
  {
    id: 'basics',
    title: '期权基础',
    emoji: '🎯',
    desc: '期权交易的基本术语',
    items: [
      { zh: '看涨期权', en: 'Call Option', short: '在到期日前以行权价买入标的的权利', twist: '买 call 不等于看涨——还要赚到超过权利金的涨幅', chapters: [1, 2] },
      { zh: '看跌期权', en: 'Put Option', short: '在到期日前以行权价卖出标的的权利', chapters: [1, 2] },
      { zh: '行权价', en: 'Strike Price (K)', short: '合约约定的买入或卖出价格', chapters: [1, 2, 3] },
      { zh: '权利金', en: 'Premium', short: '买方向卖方支付的期权价格', twist: '卖期权 = 一直收权利金的"小老板"，但一次黑天鹅赔光多年收益', chapters: [1, 2, 8] },
      { zh: '到期日', en: 'Expiration Date', short: '期权失效的最后日期', chapters: [1, 4] },
      { zh: '标的资产', en: 'Underlying Asset', short: '期权对应的股票/ETF/指数', chapters: [1] },
      { zh: '实值', en: 'In the Money (ITM)', short: '行权能立即获利的状态：call K<S，put K>S', chapters: [1] },
      { zh: '平值', en: 'At the Money (ATM)', short: '行权价等于标的现价 K=S', chapters: [1, 9] },
      { zh: '虚值', en: 'Out of the Money (OTM)', short: '行权无法获利：call K>S，put K<S', twist: 'OTM 期权 90% 概率归零，但偶尔一次能赚 10 倍', chapters: [1, 2] }
    ]
  },
  {
    id: 'greeks',
    title: '希腊字母',
    emoji: 'Δ',
    desc: '期权的风险敏感度',
    items: [
      { zh: '德尔塔', en: 'Delta (Δ)', short: '标的涨 1 元期权涨多少；ATM call ≈ 0.5', twist: 'Delta 也是"行权概率"——0.3 的 call 大约 30% 被行权', chapters: [2, 9, 12] },
      { zh: '伽马', en: 'Gamma (Γ)', short: 'Delta 对标的的二阶敏感度，临到期 ATM 处最大', chapters: [9, 11] },
      { zh: '希塔', en: 'Theta (Θ)', short: '每过一天期权时间价值的衰减，卖方收 Theta', twist: '临到期 1 周 Theta 会加速到正常值的 3-5 倍', chapters: [4, 8] },
      { zh: '维伽', en: 'Vega', short: 'IV 上升 1% 期权涨多少；长期期权 Vega 更大', chapters: [7, 9, 11] },
      { zh: '罗', en: 'Rho (ρ)', short: '利率上升 1% 期权涨多少；多数实战可忽略', chapters: [9] }
    ]
  },
  {
    id: 'spreads',
    title: '价差组合',
    emoji: '📐',
    desc: '多腿期权组合策略',
    items: [
      { zh: '牛市看涨价差', en: 'Bull Call Spread', short: '买低 K call + 卖高 K call，限定收益、限定风险', chapters: [3, 6] },
      { zh: '熊市看跌价差', en: 'Bear Put Spread', short: '买高 K put + 卖低 K put，温和看跌的便宜方案', chapters: [3] },
      { zh: '蝶式价差', en: 'Butterfly Spread', short: '组合三个行权价，押注小幅震荡', chapters: [3] },
      { zh: '日历价差', en: 'Calendar Spread', short: '同 K，卖近月 + 买远月，吃近月时间衰减', chapters: [4, 12] },
      { zh: '比例价差', en: 'Ratio Spread', short: '不等比例多空腿，构造非对称风险', chapters: [5] },
      { zh: '对角价差', en: 'Diagonal Spread', short: '不同 K + 不同到期，垂直与水平的混合', chapters: [6] },
      { zh: '铁鹰', en: 'Iron Condor', short: '卖跨 + 买远翼，区间震荡最优', chapters: [3, 7] }
    ]
  },
  {
    id: 'combos',
    title: '混合组合',
    emoji: '🦋',
    desc: '波动率方向组合',
    items: [
      { zh: '跨式组合', en: 'Straddle', short: '同 K 同期 call + put，押大波动', twist: '财报前买跨式 = 付高 IV 等 IV crush，多数时候赔', chapters: [7, 11] },
      { zh: '宽跨式', en: 'Strangle', short: 'OTM call + OTM put，更便宜但需更大波动才赚', chapters: [7] },
      { zh: '条式组合', en: 'Strip', short: '1 call + 2 put，看大波动且偏跌', chapters: [7] },
      { zh: '带式组合', en: 'Strap', short: '2 call + 1 put，看大波动且偏涨', chapters: [7] }
    ]
  },
  {
    id: 'hedge',
    title: '套保对冲',
    emoji: '🛡️',
    desc: '降低现货风险的组合',
    items: [
      { zh: '担保看涨', en: 'Covered Call', short: '持股 + 卖 call，放弃上涨换权利金', twist: 'Covered call 在牛市顶部跑输持股，但回撤期帮你回血', chapters: [8] },
      { zh: '保护性看跌', en: 'Protective Put', short: '持股 + 买 put，给股票上保险', chapters: [8] },
      { zh: '双限期权', en: 'Collar', short: '持股 + 卖 call + 买 put，零成本保险', chapters: [8] }
    ]
  },
  {
    id: 'pricing',
    title: '定价模型',
    emoji: '🧮',
    desc: 'BSM 与隐含波动率',
    items: [
      { zh: 'BSM 模型', en: 'Black-Scholes-Merton', short: '欧式期权定价基石，5 参数：S/K/r/T/σ', twist: 'BSM 假设连续对冲、波动率恒定——现实中两条都错', chapters: [9] },
      { zh: '隐含波动率', en: 'Implied Volatility (IV)', short: '反推使期权理论价 = 市场价的 σ', chapters: [9, 10] },
      { zh: '波动率微笑', en: 'Volatility Smile', short: '同到期不同行权价的 IV 形成微笑/偏斜曲线', chapters: [9] },
      { zh: '波动率偏斜', en: 'Volatility Skew', short: '股指期权 OTM put IV > OTM call IV，反映崩盘恐惧', chapters: [9, 10] }
    ]
  },
  {
    id: 'vol-trading',
    title: '波动率交易',
    emoji: '🎢',
    desc: '波动率作为交易标的',
    items: [
      { zh: 'VIX 指数', en: 'CBOE VIX', short: 'S&P 500 期权隐含的 30 天预期年化波动率', twist: 'VIX 不是恐慌指数——它是"市场对恐慌的定价"', chapters: [10, 11] },
      { zh: '期限结构', en: 'Term Structure', short: 'IV 随到期时间变化，正常时长期 > 短期', chapters: [10, 12] },
      { zh: 'Contango', en: 'Contango', short: '远期 VIX > 近期 VIX，常态市场', chapters: [10] },
      { zh: 'Backwardation', en: 'Backwardation', short: '近期 VIX > 远期 VIX，恐慌时出现', twist: 'VIX 进入 backwardation 是逢低机会的信号', chapters: [10] },
      { zh: 'IV Crush', en: 'IV Crush', short: '财报/事件后 IV 大幅下降', chapters: [7, 9] },
      { zh: '一阶波动率交易', en: '1st Order Vol Trading', short: '单边做多/空波动率，Delta 中性，如 long straddle', chapters: [11] },
      { zh: '波动率分散套利', en: 'Dispersion Trade', short: '做空指数波动率 + 做多成分股波动率', chapters: [11] },
      { zh: '日历价差套利', en: 'Calendar Arbitrage', short: '不同月份 IV 偏离均衡时介入', chapters: [12] }
    ]
  },
  {
    id: 'practice',
    title: '实战概念',
    emoji: '⚙️',
    desc: '交易执行细节',
    items: [
      { zh: 'Delta 中性', en: 'Delta Neutral', short: '组合 Delta = 0，对小幅价格波动免疫', chapters: [11, 12] },
      { zh: '盈亏平衡点', en: 'Breakeven', short: '到期时不赚不亏的标的价位', chapters: [2, 3, 7] },
      { zh: '最大盈利', en: 'Max Profit', short: '组合可能的最高收益', chapters: [3, 7] },
      { zh: '最大亏损', en: 'Max Loss', short: '组合可能的最大亏损（很多策略无限）', twist: '裸卖 call 最大亏损是无限——这是大多数账户被爆的原因', chapters: [2, 7] },
      { zh: '滚动', en: 'Roll', short: '到期前平仓现有合约 + 开下月新仓', chapters: [4, 8] },
      { zh: '分配', en: 'Assignment', short: '期权被对手方行权', chapters: [8] }
    ]
  }
]

export const allGlossaryItems: GlossaryItem[] = glossary.flatMap(g => g.items)

export function searchGlossary(query: string): GlossaryItem[] {
  if (!query) return []
  const q = query.toLowerCase()
  return allGlossaryItems.filter(
    it => it.zh.toLowerCase().includes(q) || it.en.toLowerCase().includes(q) || it.short.toLowerCase().includes(q)
  )
}

export function findGlossary(zh: string): GlossaryItem | undefined {
  return allGlossaryItems.find(it => it.zh === zh)
}
