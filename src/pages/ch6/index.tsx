import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import SnapshotBar from '../../components/SnapshotBar'
import SliderRow from '../../components/SliderRow'
import PayoffChart from '../../components/PayoffChart'
import { calendarValue, bsmCall, bsmPut, generatePayoffCurve } from '../../utils/formulas'
import { markOpened } from '../../utils/progress'
import './index.scss'

interface Combo {
  id: string
  name: string
  tag: string
  view: string
  optType: 'call' | 'put'
  shortNear: boolean   // true = 卖近月，否则买近月
  K1IsLower: boolean   // K1 (近月) 是否较低
}

const COMBOS: Combo[] = [
  { id: 'd1', name: '看涨对角 (long)', tag: 'call·买远月低K + 卖近月高K', view: '温和看涨', optType: 'call', shortNear: true, K1IsLower: false },
  { id: 'd2', name: '看跌对角 (long)', tag: 'put·买远月高K + 卖近月低K', view: '温和看跌', optType: 'put', shortNear: true, K1IsLower: true },
  { id: 'd3', name: '反向看涨对角', tag: 'call·卖远月 + 买近月', view: '强烈看涨且短期爆发', optType: 'call', shortNear: false, K1IsLower: true },
  { id: 'd4', name: '反向看跌对角', tag: 'put·卖远月 + 买近月', view: '强烈看跌', optType: 'put', shortNear: false, K1IsLower: false },
  { id: 'd5', name: '双对角看涨', tag: 'call+put·结合两腿', view: '看涨且降低成本', optType: 'call', shortNear: true, K1IsLower: false },
  { id: 'd6', name: '双对角看跌', tag: 'call+put·结合两腿', view: '看跌且降低成本', optType: 'put', shortNear: true, K1IsLower: true },
  { id: 'd7', name: '中性双对角', tag: '类似 iron condor', view: '区间震荡', optType: 'call', shortNear: true, K1IsLower: true },
  { id: 'd8', name: '反向中性', tag: '看大波动 + 时间维度', view: '突破方向不定', optType: 'call', shortNear: false, K1IsLower: false }
]

interface Params {
  S: number
  K1: number    // 近月
  K2: number    // 远月
  Tshort: number
  Tlong: number
  sigma: number
  r: number
}

export default function Ch6() {
  const [combo, setCombo] = useState(0)
  const [p, setP] = useState<Params>({
    S: 430, K1: 380, K2: 440,
    Tshort: 30 / 365, Tlong: 180 / 365,
    sigma: 0.25, r: 0.05
  })

  useEffect(() => { markOpened(6) }, [])

  const c = COMBOS[combo]

  const value = useMemo(() => {
    const nearPrice = c.optType === 'call'
      ? bsmCall({ S: p.S, K: p.K1, r: p.r, T: p.Tshort, sigma: p.sigma })
      : bsmPut({ S: p.S, K: p.K1, r: p.r, T: p.Tshort, sigma: p.sigma })
    const farPrice = c.optType === 'call'
      ? bsmCall({ S: p.S, K: p.K2, r: p.r, T: p.Tlong, sigma: p.sigma })
      : bsmPut({ S: p.S, K: p.K2, r: p.r, T: p.Tlong, sigma: p.sigma })
    const net = c.shortNear ? farPrice - nearPrice : nearPrice - farPrice
    return { nearPrice, farPrice, net }
  }, [p, combo, c])

  const SNAPS = [
    { key: 'msft-poor-cc', label: 'MSFT 穷人 covered call' },
    { key: 'amzn-double', label: 'AMZN 双对角' }
  ]

  return (
    <ScrollView scrollY className='ch-page'>
      <View className='page-header'>
        <Text className='page-title'>🔀 对角价差</Text>
        <Text className='page-meta'>第 6 章 · 15 分钟 · ⭐⭐⭐⭐</Text>
      </View>

      <SnapshotBar items={SNAPS} onSelect={() => {}} defaultKey='msft-poor-cc' />

      <Text style='display:block;color:var(--text);font-size:28px;padding:16px 24px 0;'>选择 8 种对角组合之一</Text>
      <View className='combo-grid'>
        {COMBOS.map((cb, i) => (
          <View key={cb.id} className={`combo-cell ${combo === i ? 'active' : ''}`} onClick={() => setCombo(i)}>
            <Text className='combo-name'>{cb.name}</Text>
            <Text className='combo-tag'>{cb.tag}</Text>
            <Text className='combo-view'>👁 {cb.view}</Text>
          </View>
        ))}
      </View>

      <View className='panel'>
        <Text className='panel-tag'>调整参数（基于 BSM 简化估值）</Text>
        <SliderRow label='标的 S' value={p.S} min={50} max={600} step={1} prefix='$' onChange={v => setP({ ...p, S: v })} />
        <SliderRow label='近月 K1' value={p.K1} min={50} max={600} step={1} prefix='$' onChange={v => setP({ ...p, K1: v })} />
        <SliderRow label='远月 K2' value={p.K2} min={50} max={600} step={1} prefix='$' onChange={v => setP({ ...p, K2: v })} />
        <SliderRow label='近月天数' value={p.Tshort * 365} min={5} max={60} step={1} unit=' 天' onChange={v => setP({ ...p, Tshort: v / 365 })} />
        <SliderRow label='远月天数' value={p.Tlong * 365} min={p.Tshort * 365 + 7} max={365} step={1} unit=' 天' onChange={v => setP({ ...p, Tlong: v / 365 })} />
        <SliderRow label='IV' value={p.sigma * 100} min={10} max={80} step={1} unit='%' onChange={v => setP({ ...p, sigma: v / 100 })} />
      </View>

      <View className='output'>
        <View className='output-row'>
          <View>
            <Text className='output-label'>近月 (K1, T_s)</Text>
            <Text className='output-mid'>${value.nearPrice.toFixed(2)}</Text>
          </View>
          <View>
            <Text className='output-label'>远月 (K2, T_l)</Text>
            <Text className='output-mid'>${value.farPrice.toFixed(2)}</Text>
          </View>
          <View>
            <Text className='output-label'>净 {c.shortNear ? '支出' : '收入'}</Text>
            <Text className='output-big'>${Math.abs(value.net).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View className='edu-card'>
        <Text className='edu-tag'>📐 对角价差 = 垂直 + 水平</Text>
        <Text className='edu-text'>
          对角价差 = 行权价不同 (垂直) + 到期日不同 (水平)。{'\n\n'}
          通过 8 种 (call/put × 多/空 × 近/远) 组合，可表达从看涨/看跌、温和/强烈、短期/长期的全部观点。{'\n\n'}
          最常见用法："穷人 covered call"——买远月深度 ITM call (替代股票) + 卖近月 OTM call (Theta 收入)。资金占用降低 80%。
        </Text>
      </View>

      <View className='edu-card edu-twist'>
        <Text className='edu-tag'>⚡ 反预期 hook</Text>
        <Text className='edu-text'>
          MSFT 100 股要 $43000 资金，对应 covered call。但用 380 deep ITM call (~ $58) + 卖 5 月 440 call ($4.5)，仅占用 $5400 资金。{'\n\n'}
          "穷人 covered call"——名字戏谑，但本质是机构级的资金效率精算。
        </Text>
      </View>

      <View className='further-cta' onClick={() => Taro.navigateTo({ url: '/pages/quiz/index?ch=6' })}>
        <Text>🧩 试试本章 5 道精选题 →</Text>
      </View>
    </ScrollView>
  )
}
