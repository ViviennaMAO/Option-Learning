import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { ch7Snapshots } from '../../utils/snapshots'
import type { PredictDef, RevealDef } from '../../utils/snapshots'
import { straddlePayoff, generatePayoffCurve } from '../../utils/formulas'
import type { StraddleParams } from '../../utils/formulas'
import SnapshotBar from '../../components/SnapshotBar'
import SliderRow from '../../components/SliderRow'
import PredictModal from '../../components/PredictModal'
import RevealModal from '../../components/RevealModal'
import PayoffChart from '../../components/PayoffChart'
import { markOpened, markPredicted } from '../../utils/progress'
import './index.scss'

const VARIANTS: Array<{ k: StraddleParams['variant']; label: string; desc: string }> = [
  { k: 'straddle', label: '跨式 Straddle', desc: '同 K 买 call + put · 押大波动' },
  { k: 'strangle', label: '宽跨式 Strangle', desc: 'OTM call + OTM put · 更便宜' },
  { k: 'strap', label: '带式 Strap', desc: '2 call + 1 put · 偏看涨' },
  { k: 'strip', label: '条式 Strip', desc: '1 call + 2 put · 偏看跌' }
]

export default function Ch7() {
  const [p, setP] = useState<StraddleParams>({ S: 130, K: 130, K2: 140, callPremium: 5, putPremium: 4, side: 'long', variant: 'straddle' })
  const [flash, setFlash] = useState(false)
  const [predict, setPredict] = useState<PredictDef | null>(null)
  const [reveal, setReveal] = useState<RevealDef | null>(null)
  const [predictKey, setPredictKey] = useState('')

  useEffect(() => { markOpened(7) }, [])

  const curve = useMemo(() => {
    const range = p.S * 0.35
    return generatePayoffCurve(s => straddlePayoff(p, s), p.S - range, p.S + range, 60)
  }, [p])

  const totalCost = (p.variant === 'strap' ? 2 : 1) * p.callPremium + (p.variant === 'strip' ? 2 : 1) * p.putPremium
  const breakUp = p.K + totalCost / (p.variant === 'strap' ? 2 : 1)
  const breakDown = p.K - totalCost / (p.variant === 'strip' ? 2 : 1)

  function loadSnap(key: string) {
    const s = ch7Snapshots.find(x => x.key === key)
    if (!s) return
    setP(s.params)
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
    if (s.predict) { setPredict(s.predict); setPredictKey(key) }
  }

  function onAnswer(c: boolean) {
    markPredicted(7, c)
    const s = ch7Snapshots.find(x => x.key === predictKey)
    setPredict(null)
    if (s?.reveal) setReveal(s.reveal)
  }

  return (
    <ScrollView scrollY className='ch-page'>
      <View className='page-header'>
        <Text className='page-title'>🦋 跨式 / 宽跨式 / 条式 / 带式</Text>
        <Text className='page-meta'>第 7 章 · 15 分钟 · ⭐⭐⭐</Text>
      </View>

      <SnapshotBar items={ch7Snapshots} onSelect={loadSnap} defaultKey='nvda-earnings' />

      <View className='strategy-tabs'>
        {VARIANTS.map(v => (
          <View key={v.k} className={`tab ${p.variant === v.k ? 'active' : ''}`} onClick={() => setP({ ...p, variant: v.k })}>
            <Text>{v.label}</Text>
          </View>
        ))}
        {(['long', 'short'] as const).map(s => (
          <View key={s} className={`tab ${p.side === s ? 'active' : ''}`} onClick={() => setP({ ...p, side: s })}>
            <Text>{s === 'long' ? '买入' : '卖出'}</Text>
          </View>
        ))}
      </View>

      <View className='panel'>
        <Text className='panel-tag'>{VARIANTS.find(v => v.k === p.variant)?.desc}</Text>
        <SliderRow label='标的 S' value={p.S} min={50} max={600} step={1} prefix='$' onChange={v => setP({ ...p, S: v })} />
        <SliderRow label='行权价 K (put)' value={p.K} min={50} max={600} step={1} prefix='$' onChange={v => setP({ ...p, K: v })} />
        {p.variant === 'strangle' ? (
          <SliderRow label='Call 行权价 K2' value={p.K2 || p.K} min={p.K} max={p.K * 1.3} step={1} prefix='$' onChange={v => setP({ ...p, K2: v })} />
        ) : null}
        <SliderRow label='Call 权利金' value={p.callPremium} min={0.5} max={30} step={0.5} digits={1} prefix='$' onChange={v => setP({ ...p, callPremium: v })} />
        <SliderRow label='Put 权利金' value={p.putPremium} min={0.5} max={30} step={0.5} digits={1} prefix='$' onChange={v => setP({ ...p, putPremium: v })} />
      </View>

      <PayoffChart id='ch7Chart' data={curve} breakeven={[breakDown, breakUp]} currentPrice={p.S} />

      <View className={`output ${flash ? 'flash' : ''}`}>
        <View className='output-row'>
          <View>
            <Text className='output-label'>总权利金</Text>
            <Text className='output-big'>${totalCost.toFixed(2)}</Text>
          </View>
          <View>
            <Text className='output-label'>盈亏平衡区间</Text>
            <Text className='output-mid'>${breakDown.toFixed(0)} ~ ${breakUp.toFixed(0)}</Text>
          </View>
        </View>
        <Text className='output-hint'>
          {p.side === 'long'
            ? `需 S 跌破 $${breakDown.toFixed(0)} 或 涨破 $${breakUp.toFixed(0)} 才赚`
            : `S 留在区间内你赚权利金；跑出去亏损放大`}
        </Text>
      </View>

      <View className='edu-card'>
        <Text className='edu-tag'>📐 四种组合差异</Text>
        <Text className='edu-text'>
          Straddle：同 K，最贵但盈亏平衡区间最窄。{'\n'}
          Strangle：两个 OTM K，更便宜但需更大波动。{'\n'}
          Strap：2 call + 1 put（偏看涨大波动）。{'\n'}
          Strip：1 call + 2 put（偏看跌大波动）。{'\n\n'}
          多头 = 做多波动率（long Vega）。空头 = 做空波动率，吃 Theta，但有尾部风险。
        </Text>
      </View>

      <View className='edu-card edu-twist'>
        <Text className='edu-tag'>⚡ 反预期 hook</Text>
        <Text className='edu-text'>
          NVDA 财报前 IV 抬到 78%，跨式权利金 = 高溢价。财报后即使股价涨 4%，IV 暴跌到 42%（IV crush）让权利金缩水更多——你方向对了，但还是亏。{'\n\n'}
          {'买跨式不是"押财报"，而是"押财报的实际波动 > IV 隐含的波动"——多数情况下，市场对事件的定价是过度的。'}
        </Text>
      </View>

      <View className='further-cta' onClick={() => Taro.navigateTo({ url: '/pages/quiz/index?ch=7' })}>
        <Text>🧩 试试本章 5 道精选题 →</Text>
      </View>

      {predict ? <PredictModal {...predict} onAnswer={onAnswer} onClose={() => setPredict(null)} /> : null}
      {reveal ? <RevealModal {...reveal} onClose={() => setReveal(null)} /> : null}
    </ScrollView>
  )
}
