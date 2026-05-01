import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { ch1Snapshots } from '../../utils/snapshots'
import type { PredictDef, RevealDef } from '../../utils/snapshots'
import { singleLegPayoff, singleLegBreakeven, generatePayoffCurve } from '../../utils/formulas'
import type { SingleLegParams } from '../../utils/formulas'
import SnapshotBar from '../../components/SnapshotBar'
import SliderRow from '../../components/SliderRow'
import PredictModal from '../../components/PredictModal'
import RevealModal from '../../components/RevealModal'
import PayoffChart from '../../components/PayoffChart'
import { markOpened, markPredicted } from '../../utils/progress'
import './index.scss'

const DEFAULT: SingleLegParams = { S: 200, K: 200, premium: 5, type: 'call', side: 'long' }

export default function Ch1() {
  const [params, setParams] = useState<SingleLegParams>(DEFAULT)
  const [ST, setST] = useState(210)
  const [flash, setFlash] = useState(false)
  const [predict, setPredict] = useState<PredictDef | null>(null)
  const [reveal, setReveal] = useState<RevealDef | null>(null)
  const [predictKey, setPredictKey] = useState<string>('')

  useEffect(() => { markOpened(1) }, [])

  const pnl = useMemo(() => singleLegPayoff(params, ST), [params, ST])
  const breakeven = useMemo(() => singleLegBreakeven(params), [params])
  const curve = useMemo(() => {
    const range = params.S * 0.4
    return generatePayoffCurve(s => singleLegPayoff(params, s), params.S - range, params.S + range, 50)
  }, [params])

  function loadSnap(key: string) {
    const s = ch1Snapshots.find(x => x.key === key)
    if (!s) return
    setParams(s.params)
    setST(s.params.S * 1.05)
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
    if (s.predict) {
      setPredict(s.predict)
      setPredictKey(key)
    }
  }

  function onAnswer(correct: boolean) {
    markPredicted(1, correct)
    const s = ch1Snapshots.find(x => x.key === predictKey)
    setPredict(null)
    if (s?.reveal) setReveal(s.reveal)
  }

  return (
    <ScrollView scrollY className='ch-page'>
      <View className='page-header'>
        <Text className='page-title'>🎯 期权基础</Text>
        <Text className='page-meta'>第 1 章 · 12 分钟 · ⭐</Text>
      </View>

      <SnapshotBar items={ch1Snapshots} onSelect={loadSnap} defaultKey='aapl-call' />

      <View className='strategy-tabs'>
        {(['call', 'put'] as const).map(t => (
          <View key={t} className={`tab ${params.type === t ? 'active' : ''}`}
            onClick={() => setParams({ ...params, type: t })}>
            <Text>{t === 'call' ? '看涨 Call' : '看跌 Put'}</Text>
          </View>
        ))}
        {(['long', 'short'] as const).map(t => (
          <View key={t} className={`tab ${params.side === t ? 'active' : ''}`}
            onClick={() => setParams({ ...params, side: t })}>
            <Text>{t === 'long' ? '买入 Long' : '卖出 Short'}</Text>
          </View>
        ))}
      </View>

      <View className='panel'>
        <Text className='panel-tag'>调整参数 · 观察盈亏变化</Text>
        <SliderRow label='标的现价 S' value={params.S} min={50} max={600} step={1} prefix='$' onChange={v => setParams({ ...params, S: v })} />
        <SliderRow label='行权价 K' value={params.K} min={50} max={600} step={1} prefix='$' onChange={v => setParams({ ...params, K: v })} />
        <SliderRow label='权利金 Premium' value={params.premium} min={0.5} max={50} step={0.5} digits={1} prefix='$' onChange={v => setParams({ ...params, premium: v })} />
        <SliderRow label='到期价格 ST' value={ST} min={params.S * 0.5} max={params.S * 1.5} step={1} prefix='$' onChange={setST} />
      </View>

      <View className={`output ${flash ? 'flash' : ''}`}>
        <View className='output-row'>
          <View>
            <Text className='output-label'>到期盈亏 / 股</Text>
            <Text className={`output-big ${pnl >= 0 ? 'up' : 'down'}`}>${pnl.toFixed(2)}</Text>
          </View>
          <View>
            <Text className='output-label'>盈亏平衡点</Text>
            <Text className='output-mid'>${breakeven.toFixed(2)}</Text>
          </View>
        </View>
        <Text className='output-hint'>
          {pnl >= 0 ? '✅ 盈利状态' : '❌ 亏损状态'} · 单张合约 = 100 股 → 实际盈亏 ${(pnl * 100).toFixed(0)}
        </Text>
      </View>

      <PayoffChart id='ch1Chart' data={curve} breakeven={[breakeven]} currentPrice={params.S} />

      <View className='edu-card'>
        <Text className='edu-tag'>📐 公式 / 机制</Text>
        <Text className='edu-text'>
          买入看涨：盈亏 = max(ST - K, 0) - 权利金{'\n'}
          买入看跌：盈亏 = max(K - ST, 0) - 权利金{'\n'}
          卖出 = 买入的相反数。{'\n\n'}
          单张期权合约 = 100 股标的（美股标准）。
        </Text>
      </View>

      <View className='edu-card edu-twist'>
        <Text className='edu-tag'>⚡ 反预期 hook</Text>
        <Text className='edu-text'>
          AAPL 涨 5%，看涨期权可能涨 100%——这是杠杆。{'\n\n'}
          但反过来：AAPL 横盘 2 周，期权可能跌 30%（时间价值衰减）。{'\n\n'}
          买期权不只是"看对方向"，还要"看对幅度 + 看对时间"——三维都对才赚钱。
        </Text>
      </View>

      <View className='further-cta' onClick={() => Taro.navigateTo({ url: '/pages/quiz/index?ch=1' })}>
        <Text>🧩 试试本章 5 道精选题 →</Text>
      </View>

      {predict ? <PredictModal {...predict} onAnswer={onAnswer} onClose={() => setPredict(null)} /> : null}
      {reveal ? <RevealModal {...reveal} onClose={() => setReveal(null)} /> : null}
    </ScrollView>
  )
}
