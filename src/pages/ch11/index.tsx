import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import SnapshotBar from '../../components/SnapshotBar'
import { markOpened } from '../../utils/progress'
import './index.scss'

const ORDERS = [
  {
    n: 1,
    title: '一阶波动率交易',
    egs: ['做多/空波动率本身', 'Long/short straddle', 'Delta 中性 → 单一 Vega 暴露'],
    greeks: ['+Vega', 'Δ ≈ 0', '+/-Gamma'],
    desc: '最直接的波动率方向交易。盈亏分布对称，易管理。多数对冲基金的"vol arb"起点。'
  },
  {
    n: 2,
    title: '二阶波动率交易',
    egs: ['垂直价差', '比例价差', '不同 K 的 Gamma 不对称'],
    greeks: ['Gamma 反转', '加权 Vega', '多 K 暴露'],
    desc: 'Gamma 在不同 K 处会反转符号，原始 Vega 在某点改变符号。需要精细管理希腊字母分布。'
  },
  {
    n: 3,
    title: '三阶波动率交易',
    egs: ['Dispersion: 卖指数 vol + 买成分股 vol', 'IV 与价格相关性套利'],
    greeks: ['相关性暴露', 'Cross Vega'],
    desc: '指数 IV 包含成分股相关性溢价。SPY 与 MAG7 之间的"vol of correlation"是经典分散套利。'
  },
  {
    n: 4,
    title: '四阶波动率交易',
    egs: ['VIX 期货 / 期权', 'Vol of Vol', 'Skew 交易'],
    greeks: ['Vega^2', 'Vanna', 'Volga'],
    desc: '交易"波动率的波动率"。VIX 本身是 SPX 期权的 vol，VIX 期权则是 vol of vol。最复杂的层级。'
  }
]

export default function Ch11() {
  const [active, setActive] = useState(0)
  useEffect(() => { markOpened(11) }, [])

  return (
    <ScrollView scrollY className='ch-page'>
      <View className='page-header'>
        <Text className='page-title'>🎭 波动率交易类型</Text>
        <Text className='page-meta'>第 11 章 · 15 分钟 · ⭐⭐⭐⭐⭐</Text>
      </View>

      <SnapshotBar
        items={ORDERS.map((o, i) => ({ key: `order${o.n}`, label: `${o.n} 阶`, accent: i === active ? 'primary' : undefined }))}
        onSelect={k => setActive(parseInt(k.replace('order', '')) - 1)}
        defaultKey='order1'
      />

      {ORDERS.map((o, i) => (
        <View key={o.n} className='order-card' style={i === active ? 'border-color:var(--accent);background:var(--bg-elev)' : ''}>
          <Text className='order-num'>{o.n} 阶</Text>
          <Text className='order-title'>{o.title}</Text>
          <Text className='order-eg'>典型策略：{o.egs.join(' · ')}</Text>
          <View className='order-greeks'>
            {o.greeks.map(g => <Text key={g} className='gk'>{g}</Text>)}
          </View>
          {i === active ? (
            <Text className='edu-text' style='display:block;margin-top:16px;font-size:24px;line-height:1.6;'>
              {o.desc}
            </Text>
          ) : null}
        </View>
      ))}

      <View className='edu-card'>
        <Text className='edu-tag'>📐 阶数的本质</Text>
        <Text className='edu-text'>
          一阶 = 暴露 σ 本身 (Vega){'\n'}
          二阶 = 暴露 σ 的形状 (skew/smile){'\n'}
          三阶 = 暴露 σ 之间的关系 (dispersion){'\n'}
          四阶 = 暴露 σ 的波动 (vol of vol){'\n\n'}
          越高阶越复杂，但也越接近"市场结构"的核心。机构级套利策略多在二阶以上。
        </Text>
      </View>

      <View className='edu-card edu-twist'>
        <Text className='edu-tag'>⚡ 反预期 hook</Text>
        <Text className='edu-text'>
          做多 VIX 在 2020 年 3 月赚 400%——但其他 11 个月都在亏。{'\n\n'}
          原因：VIX 期货长期处于 contango，多头滚仓持续损失约 60%/年。VIX 多头是"灾难保险"，不是"做多波动率"。{'\n\n'}
          真正"做多波动率"的方式是 long straddle (一阶) 或 long Vega 价差，不是买 VIX ETF。这是新手最常犯的错误。
        </Text>
      </View>

      <View className='further-cta' onClick={() => Taro.navigateTo({ url: '/pages/quiz/index?ch=11' })}>
        <Text>🧩 试试本章 5 道精选题 →</Text>
      </View>
    </ScrollView>
  )
}
