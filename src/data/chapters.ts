export interface Chapter {
  num: number
  title: string
  emoji: string
  brief: string
  difficulty: 1 | 2 | 3 | 4 | 5
  duration?: string
  implemented: boolean
  pagePath?: string
  hook?: string
  tier?: 'mvp' | 'basic'
}

export interface Part {
  num: number
  title: string
  desc: string
  range: string
  chapters: Chapter[]
}

export const parts: Part[] = [
  {
    num: 1,
    title: '期权入门',
    desc: '从权利金到希腊字母，建立期权直觉',
    range: '第 1-2 章',
    chapters: [
      {
        num: 1,
        title: '期权基础',
        emoji: '🎯',
        brief: '看涨/看跌/买卖/权利金',
        difficulty: 1,
        duration: '12 分钟',
        implemented: true,
        pagePath: '/pages/ch1/index',
        hook: 'AAPL 涨 5%，看涨期权涨 50%——杠杆是双刃剑',
        tier: 'mvp'
      },
      {
        num: 2,
        title: '四大基本策略',
        emoji: '📊',
        brief: '买call/卖call/买put/卖put',
        difficulty: 2,
        duration: '15 分钟',
        implemented: true,
        pagePath: '/pages/ch2/index',
        hook: '卖出 TSLA 看涨 90% 时间赚钱，一次暴涨亏光',
        tier: 'mvp'
      }
    ]
  },
  {
    num: 2,
    title: '价差组合',
    desc: '用多腿组合精确表达观点，控制风险',
    range: '第 3-6 章',
    chapters: [
      {
        num: 3,
        title: '垂直价差',
        emoji: '📐',
        brief: '牛市/熊市/蝶式价差',
        difficulty: 2,
        duration: '15 分钟',
        implemented: true,
        pagePath: '/pages/ch3/index',
        hook: '$100 风险撬 $900 收益，但胜率不到 30%',
        tier: 'mvp'
      },
      {
        num: 4,
        title: '水平价差',
        emoji: '📅',
        brief: '日历价差与时间衰减',
        difficulty: 3,
        duration: '15 分钟',
        implemented: true,
        pagePath: '/pages/ch4/index',
        hook: 'AAPL 横盘一个月，日历价差赚 37%——Theta 是朋友',
        tier: 'mvp'
      },
      {
        num: 5,
        title: '比例价差',
        emoji: '⚖️',
        brief: '前置/后置比例价差',
        difficulty: 3,
        duration: '12 分钟',
        implemented: true,
        pagePath: '/pages/ch5/index',
        hook: '3:2 比例多赚 316%，但风险不对称',
        tier: 'basic'
      },
      {
        num: 6,
        title: '对角价差',
        emoji: '🔀',
        brief: '垂直 + 水平的混合体',
        difficulty: 4,
        duration: '15 分钟',
        implemented: true,
        pagePath: '/pages/ch6/index',
        hook: '8 种对角组合覆盖所有市场观点',
        tier: 'basic'
      }
    ]
  },
  {
    num: 3,
    title: '混合与套保',
    desc: '波动方向不明？用混合组合和套保策略',
    range: '第 7-8 章',
    chapters: [
      {
        num: 7,
        title: '跨式与宽跨式',
        emoji: '🦋',
        brief: 'Straddle / Strangle / Strip / Strap',
        difficulty: 3,
        duration: '15 分钟',
        implemented: true,
        pagePath: '/pages/ch7/index',
        hook: 'NVDA 财报 IV 飙到 80%，财报后 IV crush 让你亏钱',
        tier: 'mvp'
      },
      {
        num: 8,
        title: '套保策略',
        emoji: '🛡️',
        brief: 'Covered Call / Protective Put / Collar',
        difficulty: 2,
        duration: '12 分钟',
        implemented: true,
        pagePath: '/pages/ch8/index',
        hook: '巴菲特的 Covered Call：放弃上涨换稳定现金流',
        tier: 'mvp'
      }
    ]
  },
  {
    num: 4,
    title: '波动率进阶',
    desc: '理解 IV、期限结构、波动率交易',
    range: '第 9-12 章',
    chapters: [
      {
        num: 9,
        title: '隐含波动率与 BSM',
        emoji: '😊',
        brief: 'BSM 模型与波动率微笑',
        difficulty: 4,
        duration: '18 分钟',
        implemented: true,
        pagePath: '/pages/ch9/index',
        hook: 'BSM 假设波动率恒定，但 VIX 从 9 飙到 80',
        tier: 'mvp'
      },
      {
        num: 10,
        title: '波动率期限结构',
        emoji: '📈',
        brief: 'IV 随到期日的变化',
        difficulty: 4,
        duration: '15 分钟',
        implemented: true,
        pagePath: '/pages/ch10/index',
        hook: '短期 VIX 40%、长期 20%——市场在说"恐慌是暂时的"',
        tier: 'mvp'
      },
      {
        num: 11,
        title: '波动率交易',
        emoji: '🎭',
        brief: '一阶到四阶波动率交易',
        difficulty: 5,
        duration: '15 分钟',
        implemented: true,
        pagePath: '/pages/ch11/index',
        hook: '做多 VIX 在 2020 年 3 月赚 400%，但其他 11 个月都亏',
        tier: 'basic'
      },
      {
        num: 12,
        title: '期限结构套利',
        emoji: '🔬',
        brief: '日历价差信号与 Delta 中性',
        difficulty: 5,
        duration: '20 分钟',
        implemented: true,
        pagePath: '/pages/ch12/index',
        hook: '买近卖远年化 23%，但需严格 Delta 中性才能活',
        tier: 'basic'
      }
    ]
  }
]

export function findChapter(num: number): { part: Part; chapter: Chapter } | null {
  for (const p of parts) {
    const c = p.chapters.find(ch => ch.num === num)
    if (c) return { part: p, chapter: c }
  }
  return null
}

export const allChapters = parts.flatMap(p => p.chapters)
export const mvpChapters = allChapters.filter(c => c.tier === 'mvp')
export const totalChapters = allChapters.length
