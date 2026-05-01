import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { ch9Snapshots } from '../../utils/snapshots'
import type { PredictDef, RevealDef } from '../../utils/snapshots'
import { bsmCall, bsmPut, bsmDelta } from '../../utils/formulas'
import type { BSMParams } from '../../utils/formulas'
import SnapshotBar from '../../components/SnapshotBar'
import SliderRow from '../../components/SliderRow'
import PredictModal from '../../components/PredictModal'
import RevealModal from '../../components/RevealModal'
import LiveData from '../../components/LiveData'
import { markOpened, markPredicted } from '../../utils/progress'
import { getVixSync, refreshVix, getMag7Sync, refreshMag7, type VixData, type Mag7Data } from '../../utils/marketData'
import './index.scss'

export default function Ch9() {
  const [p, setP] = useState<BSMParams>({ S: 200, K: 200, r: 0.05, T: 30 / 365, sigma: 0.25 })
  const [flash, setFlash] = useState(false)
  const [predict, setPredict] = useState<PredictDef | null>(null)
  const [reveal, setReveal] = useState<RevealDef | null>(null)
  const [predictKey, setPredictKey] = useState('')
  const [vix, setVix] = useState<VixData>(getVixSync())
  const [mag7, setMag7] = useState<Mag7Data>(getMag7Sync())

  useEffect(() => {
    markOpened(9)
    refreshVix().then(setVix)
    refreshMag7().then(setMag7)
  }, [])

  function loadFromMarket(sym: string) {
    const stk = mag7.prices[sym]
    if (!stk) return
    setP({ ...p, S: stk.price, K: Math.round(stk.price), sigma: vix.vix / 100 })
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
  }

  const cp = useMemo(() => bsmCall(p), [p])
  const pp = useMemo(() => bsmPut(p), [p])
  const dCall = useMemo(() => bsmDelta(p, 'call'), [p])
  const dPut = useMemo(() => bsmDelta(p, 'put'), [p])

  function loadSnap(key: string) {
    const s = ch9Snapshots.find(x => x.key === key)
    if (!s) return
    setP(s.params)
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
    if (s.predict) { setPredict(s.predict); setPredictKey(key) }
  }

  function onAnswer(c: boolean) {
    markPredicted(9, c)
    const s = ch9Snapshots.find(x => x.key === predictKey)
    setPredict(null)
    if (s?.reveal) setReveal(s.reveal)
  }

  return (
    <ScrollView scrollY className='ch-page'>
      <View className='page-header'>
        <Text className='page-title'>😊 BSM 模型 & 波动率</Text>
        <Text className='page-meta'>第 9 章 · 18 分钟 · ⭐⭐⭐⭐</Text>
      </View>

      <SnapshotBar items={ch9Snapshots} onSelect={loadSnap} defaultKey='aapl-atm' />

      <LiveData
        title='📡 当下 MAG7 + VIX'
        subtitle={`点击任一标的，自动套用其现价 + VIX 作为 IV · ${vix.source}/${mag7.source}`}
        tiles={['AAPL', 'NVDA', 'MSFT', 'TSLA', 'SPY', 'QQQ'].map(sym => {
          const s = mag7.prices[sym]
          return s
            ? { label: sym, value: `$${s.price.toFixed(2)}`, change: `${s.changePct >= 0 ? '+' : ''}${s.changePct.toFixed(2)}%`, accent: (s.changePct >= 0 ? 'up' : 'down') as 'up' | 'down' }
            : { label: sym, value: '--' }
        })}
      />
      <View className='strategy-tabs'>
        {['AAPL', 'NVDA', 'MSFT', 'TSLA', 'SPY', 'QQQ'].map(sym => (
          <View key={sym} className='tab' onClick={() => loadFromMarket(sym)}>
            <Text>套用 {sym}</Text>
          </View>
        ))}
      </View>

      <View className='panel'>
        <Text className='panel-tag'>BSM 5 参数：S, K, r, T, σ</Text>
        <SliderRow label='标的 S' value={p.S} min={50} max={600} step={1} prefix='$' onChange={v => setP({ ...p, S: v })} />
        <SliderRow label='行权价 K' value={p.K} min={50} max={600} step={1} prefix='$' onChange={v => setP({ ...p, K: v })} />
        <SliderRow label='剩余天数 T' value={p.T * 365} min={1} max={365} step={1} unit=' 天' onChange={v => setP({ ...p, T: v / 365 })} />
        <SliderRow label='隐含波动率 σ' value={p.sigma * 100} min={5} max={120} step={1} unit='%' digits={0} onChange={v => setP({ ...p, sigma: v / 100 })} />
        <SliderRow label='无风险利率 r' value={p.r * 100} min={0} max={10} step={0.1} unit='%' digits={1} onChange={v => setP({ ...p, r: v / 100 })} />
      </View>

      <View className={`output ${flash ? 'flash' : ''}`}>
        <View className='output-row'>
          <View>
            <Text className='output-label'>Call 理论价</Text>
            <Text className='output-big up'>${cp.toFixed(2)}</Text>
            <Text className='output-label'>Δ = {dCall.toFixed(3)}</Text>
          </View>
          <View>
            <Text className='output-label'>Put 理论价</Text>
            <Text className='output-big down'>${pp.toFixed(2)}</Text>
            <Text className='output-label'>Δ = {dPut.toFixed(3)}</Text>
          </View>
        </View>
        <Text className='output-hint'>
          Put-Call Parity 检查：C - P = {(cp - pp).toFixed(2)} ≈ S - K·e^(-rT) = {(p.S - p.K * Math.exp(-p.r * p.T)).toFixed(2)}
        </Text>
      </View>

      <View className='edu-card'>
        <Text className='edu-tag'>📐 BSM 公式</Text>
        <Text className='edu-text'>
          C = S·N(d₁) - K·e^(-rT)·N(d₂){'\n'}
          P = K·e^(-rT)·N(-d₂) - S·N(-d₁){'\n'}
          d₁ = [ln(S/K) + (r + σ²/2)·T] / (σ√T){'\n'}
          d₂ = d₁ - σ√T{'\n\n'}
          5 个输入：S(现价)、K(行权价)、r(利率)、T(年化期限)、σ(波动率)。{'\n'}
          其中 σ 不可观察——市场倒推 σ 即"隐含波动率 IV"。
        </Text>
      </View>

      <View className='edu-card edu-twist'>
        <Text className='edu-tag'>⚡ 反预期 hook</Text>
        <Text className='edu-text'>
          BSM 假设波动率恒定——但 1990 至今，VIX 从 9 飙到 80 多次。{'\n\n'}
          所以现实中同标的不同 K 的 IV 形成"波动率微笑/偏斜"。SPY 下方 K 的 IV 显著高于上方——这是"崩盘恐惧"的市场定价。{'\n\n'}
          BSM 是"理论起点"，不是"真实定价"。看懂模型与现实的 gap 才是套利的开始。
        </Text>
      </View>

      <View className='further-cta' onClick={() => Taro.navigateTo({ url: '/pages/quiz/index?ch=9' })}>
        <Text>🧩 试试本章 5 道精选题 →</Text>
      </View>

      {predict ? <PredictModal {...predict} onAnswer={onAnswer} onClose={() => setPredict(null)} /> : null}
      {reveal ? <RevealModal {...reveal} onClose={() => setReveal(null)} /> : null}
    </ScrollView>
  )
}
