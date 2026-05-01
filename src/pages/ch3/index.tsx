import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { ch3Snapshots } from '../../utils/snapshots'
import type { PredictDef, RevealDef } from '../../utils/snapshots'
import { verticalSpreadPayoff, verticalSpreadStats, generatePayoffCurve } from '../../utils/formulas'
import type { VerticalSpreadParams } from '../../utils/formulas'
import SnapshotBar from '../../components/SnapshotBar'
import SliderRow from '../../components/SliderRow'
import PredictModal from '../../components/PredictModal'
import RevealModal from '../../components/RevealModal'
import PayoffChart from '../../components/PayoffChart'
import { markOpened, markPredicted } from '../../utils/progress'
import './index.scss'

const TYPES: Array<{ k: VerticalSpreadParams['type']; label: string }> = [
  { k: 'bull-call', label: '牛市 Call (debit)' },
  { k: 'bear-put', label: '熊市 Put (debit)' },
  { k: 'bear-call', label: '熊市 Call (credit)' },
  { k: 'bull-put', label: '牛市 Put (credit)' }
]

export default function Ch3() {
  const [params, setParams] = useState<VerticalSpreadParams>({
    S: 130, K1: 130, K2: 140, premium1: 5, premium2: 2, type: 'bull-call'
  })
  const [flash, setFlash] = useState(false)
  const [predict, setPredict] = useState<PredictDef | null>(null)
  const [reveal, setReveal] = useState<RevealDef | null>(null)
  const [predictKey, setPredictKey] = useState('')

  useEffect(() => { markOpened(3) }, [])

  const stats = useMemo(() => verticalSpreadStats(params), [params])
  const curve = useMemo(() => {
    const range = params.S * 0.25
    return generatePayoffCurve(s => verticalSpreadPayoff(params, s), params.S - range, params.S + range, 60)
  }, [params])

  function loadSnap(key: string) {
    const s = ch3Snapshots.find(x => x.key === key)
    if (!s) return
    setParams(s.params)
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
    if (s.predict) { setPredict(s.predict); setPredictKey(key) }
  }

  function onAnswer(c: boolean) {
    markPredicted(3, c)
    const s = ch3Snapshots.find(x => x.key === predictKey)
    setPredict(null)
    if (s?.reveal) setReveal(s.reveal)
  }

  return (
    <ScrollView scrollY className='ch-page'>
      <View className='page-header'>
        <Text className='page-title'>📐 垂直价差组合</Text>
        <Text className='page-meta'>第 3 章 · 15 分钟 · ⭐⭐</Text>
      </View>

      <SnapshotBar items={ch3Snapshots} onSelect={loadSnap} defaultKey='nvda-bull-call' />

      <View className='strategy-tabs'>
        {TYPES.map(t => (
          <View key={t.k} className={`tab ${params.type === t.k ? 'active' : ''}`}
            onClick={() => setParams({ ...params, type: t.k })}>
            <Text>{t.label}</Text>
          </View>
        ))}
      </View>

      <View className='panel'>
        <Text className='panel-tag'>调整两腿行权价与权利金</Text>
        <SliderRow label='标的 S' value={params.S} min={50} max={600} step={1} prefix='$' onChange={v => setParams({ ...params, S: v })} />
        <SliderRow label='低 K (K1)' value={params.K1} min={50} max={600} step={1} prefix='$' onChange={v => setParams({ ...params, K1: v })} />
        <SliderRow label='高 K (K2)' value={params.K2} min={params.K1 + 1} max={600} step={1} prefix='$' onChange={v => setParams({ ...params, K2: v })} />
        <SliderRow label='K1 权利金' value={params.premium1} min={0.5} max={30} step={0.5} digits={1} prefix='$' onChange={v => setParams({ ...params, premium1: v })} />
        <SliderRow label='K2 权利金' value={params.premium2} min={0.1} max={30} step={0.1} digits={1} prefix='$' onChange={v => setParams({ ...params, premium2: v })} />
      </View>

      <PayoffChart id='ch3Chart' data={curve} breakeven={[stats.breakeven]} currentPrice={params.S} />

      <View className={`output ${flash ? 'flash' : ''}`}>
        <View className='output-row'>
          <View>
            <Text className='output-label'>最大盈利</Text>
            <Text className='output-big up'>${stats.maxProfit.toFixed(2)}</Text>
          </View>
          <View>
            <Text className='output-label'>最大亏损</Text>
            <Text className='output-big down'>${stats.maxLoss.toFixed(2)}</Text>
          </View>
          <View>
            <Text className='output-label'>盈亏平衡</Text>
            <Text className='output-mid'>${stats.breakeven.toFixed(2)}</Text>
          </View>
        </View>
        <Text className='output-hint'>
          赔率 = {Math.abs(stats.maxProfit / stats.maxLoss).toFixed(2)} : 1
          {Math.abs(stats.maxProfit / stats.maxLoss) > 2 ? ' · ✅ 不错的非对称赔率' : ''}
        </Text>
      </View>

      <View className='risk-table'>
        <View className='row head'>
          <Text className='cell'>到期价</Text>
          <Text className='cell'>盈亏 / 股</Text>
          <Text className='cell'>状态</Text>
        </View>
        {[-0.10, -0.05, 0, 0.05, 0.10].map(r => {
          const ST = params.S * (1 + r)
          const p = verticalSpreadPayoff(params, ST)
          return (
            <View key={r} className='row'>
              <Text className='cell'>${ST.toFixed(0)} ({r >= 0 ? '+' : ''}{(r * 100).toFixed(0)}%)</Text>
              <Text className={`cell cell-num ${p >= 0 ? 'green' : 'red'}`}>${p.toFixed(2)}</Text>
              <Text className='cell'>{p >= 0 ? '✅' : '❌'}</Text>
            </View>
          )
        })}
      </View>

      <View className='edu-card'>
        <Text className='edu-tag'>📐 垂直价差的本质</Text>
        <Text className='edu-text'>
          牛市看涨 (bull call)：买低 K + 卖高 K (净付权利金)。{'\n'}
          熊市看跌 (bear put)：买高 K + 卖低 K (净付权利金)。{'\n'}
          牛市看跌 (bull put credit)：卖高 K put + 买低 K put (净收权利金)。{'\n'}
          熊市看涨 (bear call credit)：卖低 K call + 买高 K call (净收权利金)。{'\n\n'}
          所有垂直价差都"风险有限、收益有限"，本质是"支付一笔确定权利金，换某区间内的盈亏曲线"。
        </Text>
      </View>

      <View className='edu-card edu-twist'>
        <Text className='edu-tag'>⚡ 反预期 hook</Text>
        <Text className='edu-text'>
          NVDA 牛市价差用 $3 风险撬 $7 收益（赔率 2.33:1）——看起来很美。{'\n\n'}
          但赔率 ≠ 期望值。NVDA 必须涨过 $133 才赚，胜率仅 30-40%。多数情况价差归零。{'\n\n'}
          策略的"美好赔率"经常隐藏着"低胜率"的代价——这是期权的第一性原理。
        </Text>
      </View>

      <View className='further-cta' onClick={() => Taro.navigateTo({ url: '/pages/quiz/index?ch=3' })}>
        <Text>🧩 试试本章 5 道精选题 →</Text>
      </View>

      {predict ? <PredictModal {...predict} onAnswer={onAnswer} onClose={() => setPredict(null)} /> : null}
      {reveal ? <RevealModal {...reveal} onClose={() => setReveal(null)} /> : null}
    </ScrollView>
  )
}
