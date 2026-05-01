import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import SnapshotBar from '../../components/SnapshotBar'
import SliderRow from '../../components/SliderRow'
import PayoffChart from '../../components/PayoffChart'
import { generatePayoffCurve } from '../../utils/formulas'
import { markOpened } from '../../utils/progress'
import './index.scss'

interface Params {
  S: number
  K1: number
  K2: number
  premium1: number
  premium2: number
  ratio: number     // 卖出 / 买入
  type: 'front' | 'back'  // 前置 (1买2卖) 或 后置 (2买1卖)
}

const SNAPS = [
  { key: 'tsla-front', label: 'TSLA 1:2 前置', params: { S: 250, K1: 250, K2: 270, premium1: 12, premium2: 5, ratio: 2, type: 'front' as const } },
  { key: 'nvda-back', label: 'NVDA 2:1 后置', params: { S: 130, K1: 125, K2: 135, premium1: 8, premium2: 3, ratio: 0.5, type: 'back' as const } },
  { key: 'spy-front', label: 'SPY 1:3 前置', params: { S: 560, K1: 560, K2: 580, premium1: 10, premium2: 3, ratio: 3, type: 'front' as const } }
]

function ratioPayoff(p: Params, ST: number): number {
  // 前置：1 张 K1 多头 + ratio 张 K2 空头 (call)
  // 后置：1 张 K1 空头 + ratio 张 K2 多头
  const long1 = Math.max(ST - p.K1, 0) - p.premium1
  const k2payoff = Math.max(ST - p.K2, 0) - p.premium2
  if (p.type === 'front') return long1 + p.ratio * (-k2payoff)
  return -long1 + p.ratio * k2payoff
}

export default function Ch5() {
  const [p, setP] = useState<Params>(SNAPS[0].params)
  useEffect(() => { markOpened(5) }, [])

  const curve = useMemo(() => {
    const r = p.S * 0.3
    return generatePayoffCurve(s => ratioPayoff(p, s), p.S - r, p.S + r, 60)
  }, [p])

  return (
    <ScrollView scrollY className='ch-page'>
      <View className='page-header'>
        <Text className='page-title'>⚖️ 比例价差</Text>
        <Text className='page-meta'>第 5 章 · 12 分钟 · ⭐⭐⭐</Text>
      </View>

      <SnapshotBar items={SNAPS} onSelect={k => {
        const s = SNAPS.find(x => x.key === k); if (s) setP(s.params)
      }} defaultKey='tsla-front' />

      <View className='strategy-tabs'>
        {(['front', 'back'] as const).map(t => (
          <View key={t} className={`tab ${p.type === t ? 'active' : ''}`} onClick={() => setP({ ...p, type: t })}>
            <Text>{t === 'front' ? '前置（看温和方向）' : '后置（看大波动）'}</Text>
          </View>
        ))}
      </View>

      <View className='panel'>
        <Text className='panel-tag'>{p.type === 'front' ? '1 张多头 K1 + N 张空头 K2' : '1 张空头 K1 + N 张多头 K2'}</Text>
        <SliderRow label='标的 S' value={p.S} min={50} max={600} step={1} prefix='$' onChange={v => setP({ ...p, S: v })} />
        <SliderRow label='K1 (多腿)' value={p.K1} min={50} max={600} step={1} prefix='$' onChange={v => setP({ ...p, K1: v })} />
        <SliderRow label='K2 (空腿)' value={p.K2} min={p.K1 + 1} max={p.K1 + 100} step={1} prefix='$' onChange={v => setP({ ...p, K2: v })} />
        <SliderRow label='K2 数量比 (1:N)' value={p.ratio} min={1} max={5} step={0.5} digits={1} unit='x' onChange={v => setP({ ...p, ratio: v })} />
        <SliderRow label='K1 权利金' value={p.premium1} min={0.5} max={30} step={0.5} digits={1} prefix='$' onChange={v => setP({ ...p, premium1: v })} />
        <SliderRow label='K2 权利金' value={p.premium2} min={0.1} max={30} step={0.1} digits={1} prefix='$' onChange={v => setP({ ...p, premium2: v })} />
      </View>

      <PayoffChart id='ch5Chart' data={curve} currentPrice={p.S} />

      <View className='edu-card'>
        <Text className='edu-tag'>📐 比例价差的两种形态</Text>
        <Text className='edu-text'>
          前置 (front)：1 张 ITM/ATM 多 + N 张 OTM 空。看温和上涨；标的暴涨时空腿放大损失。{'\n\n'}
          后置 (back)：1 张 ATM 空 + N 张 OTM 多。看大波动；横盘小亏权利金，暴涨/暴跌赚多腿。{'\n\n'}
          比例价差是"非对称风险"的精确工具——不像跨式那么对称，能更精细地表达观点。
        </Text>
      </View>

      <View className='edu-card edu-twist'>
        <Text className='edu-tag'>⚡ 反预期 hook</Text>
        <Text className='edu-text'>
          3:2 比例价差比 1:1 日历价差多赚 316%——因为放大了最优区间的盈利空间。{'\n\n'}
          但代价：风险曲线不对称，标的跑出区间损失就放大。比例价差是"对自己看法极有信心"时才用——错了惩罚加倍。
        </Text>
      </View>

      <View className='further-cta' onClick={() => Taro.navigateTo({ url: '/pages/quiz/index?ch=5' })}>
        <Text>🧩 试试本章 5 道精选题 →</Text>
      </View>
    </ScrollView>
  )
}
