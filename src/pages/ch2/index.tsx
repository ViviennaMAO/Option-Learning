import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { ch2Snapshots } from '../../utils/snapshots'
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

const STRATEGIES = [
  { type: 'call' as const, side: 'long' as const, label: '买 Call (看涨)', desc: '小钱赌大涨', risk: '权利金归 0', reward: '理论无限' },
  { type: 'call' as const, side: 'short' as const, label: '卖 Call (看跌或横盘)', desc: '收权利金，但风险无限', risk: '理论无限', reward: '权利金' },
  { type: 'put' as const, side: 'long' as const, label: '买 Put (看跌)', desc: '保险或押下跌', risk: '权利金归 0', reward: 'K 归零' },
  { type: 'put' as const, side: 'short' as const, label: '卖 Put (横盘或看涨)', desc: '愿意低价接货', risk: 'K 归零', reward: '权利金' }
]

export default function Ch2() {
  const [stratIdx, setStratIdx] = useState(0)
  const [params, setParams] = useState<SingleLegParams>({ S: 200, K: 200, premium: 5, type: 'call', side: 'long' })
  const [flash, setFlash] = useState(false)
  const [predict, setPredict] = useState<PredictDef | null>(null)
  const [reveal, setReveal] = useState<RevealDef | null>(null)
  const [predictKey, setPredictKey] = useState('')

  useEffect(() => { markOpened(2) }, [])

  const cur = STRATEGIES[stratIdx]
  const realParams = { ...params, type: cur.type, side: cur.side }

  const breakeven = useMemo(() => singleLegBreakeven(realParams), [realParams])
  const curve = useMemo(() => {
    const range = realParams.S * 0.4
    return generatePayoffCurve(s => singleLegPayoff(realParams, s), realParams.S - range, realParams.S + range, 60)
  }, [realParams])

  const upPnl = singleLegPayoff(realParams, realParams.S * 1.15)
  const flatPnl = singleLegPayoff(realParams, realParams.S)
  const downPnl = singleLegPayoff(realParams, realParams.S * 0.85)

  function loadSnap(key: string) {
    const s = ch2Snapshots.find(x => x.key === key)
    if (!s) return
    setParams(s.params)
    const idx = STRATEGIES.findIndex(st => st.type === s.params.type && st.side === s.params.side)
    if (idx >= 0) setStratIdx(idx)
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
    if (s.predict) { setPredict(s.predict); setPredictKey(key) }
  }

  function onAnswer(c: boolean) {
    markPredicted(2, c)
    const s = ch2Snapshots.find(x => x.key === predictKey)
    setPredict(null)
    if (s?.reveal) setReveal(s.reveal)
  }

  return (
    <ScrollView scrollY className='ch-page'>
      <View className='page-header'>
        <Text className='page-title'>📊 四大基本策略</Text>
        <Text className='page-meta'>第 2 章 · 15 分钟 · ⭐⭐</Text>
      </View>

      <SnapshotBar items={ch2Snapshots} onSelect={loadSnap} defaultKey='long-call' />

      <View className='strategy-tabs'>
        {STRATEGIES.map((s, i) => (
          <View key={i} className={`tab ${stratIdx === i ? 'active' : ''}`} onClick={() => setStratIdx(i)}>
            <Text>{s.label}</Text>
          </View>
        ))}
      </View>

      <View className='panel'>
        <Text className='panel-tag'>{cur.desc} · 风险 {cur.risk} · 收益 {cur.reward}</Text>
        <SliderRow label='标的 S' value={params.S} min={50} max={600} step={1} prefix='$' onChange={v => setParams({ ...params, S: v })} />
        <SliderRow label='行权价 K' value={params.K} min={50} max={600} step={1} prefix='$' onChange={v => setParams({ ...params, K: v })} />
        <SliderRow label='权利金' value={params.premium} min={0.5} max={50} step={0.5} digits={1} prefix='$' onChange={v => setParams({ ...params, premium: v })} />
      </View>

      <PayoffChart id='ch2Chart' data={curve} breakeven={[breakeven]} currentPrice={params.S} />

      <View className={`output ${flash ? 'flash' : ''}`}>
        <Text className='output-label'>盈亏平衡点</Text>
        <Text className='output-mid'>${breakeven.toFixed(2)}</Text>
      </View>

      <Text className='section-tag' style='display:block;color:var(--text);font-size:28px;font-weight:600;padding:16px 24px 0;'>三种到期场景</Text>
      <View className='scenario-grid'>
        <View className='scenario down'>
          <Text className='sc-title'>大幅下跌 -15%</Text>
          <Text className='sc-price'>${(realParams.S * 0.85).toFixed(0)}</Text>
          <Text className={`sc-pnl ${downPnl >= 0 ? 'green' : 'red'}`}>${downPnl.toFixed(1)}</Text>
        </View>
        <View className='scenario flat'>
          <Text className='sc-title'>横盘</Text>
          <Text className='sc-price'>${realParams.S}</Text>
          <Text className={`sc-pnl ${flatPnl >= 0 ? 'green' : 'red'}`}>${flatPnl.toFixed(1)}</Text>
        </View>
        <View className='scenario up'>
          <Text className='sc-title'>大幅上涨 +15%</Text>
          <Text className='sc-price'>${(realParams.S * 1.15).toFixed(0)}</Text>
          <Text className={`sc-pnl ${upPnl >= 0 ? 'green' : 'red'}`}>${upPnl.toFixed(1)}</Text>
        </View>
      </View>

      <View className='edu-card'>
        <Text className='edu-tag'>📐 风险收益对照</Text>
        <Text className='edu-text'>
          买 call/put：付权利金，方向对赚（上限差异），方向错亏权利金。{'\n\n'}
          卖 call/put：收权利金，方向错亏（裸卖 call 上限无限），方向对赚权利金。{'\n\n'}
          买方"赔率高、胜率低"；卖方"胜率高、赔率低"——金融市场没有免费午餐。
        </Text>
      </View>

      <View className='edu-card edu-twist'>
        <Text className='edu-tag'>⚡ 反预期 hook</Text>
        <Text className='edu-text'>
          裸卖 TSLA 看涨期权 90% 时间在赚钱——但一次"埃隆 X 推文"暴涨能让你亏掉过去一整年的权利金。{'\n\n'}
          这就是为什么大多数散户账户被爆的方式不是买期权，而是"卖期权"。
        </Text>
      </View>

      <View className='further-cta' onClick={() => Taro.navigateTo({ url: '/pages/quiz/index?ch=2' })}>
        <Text>🧩 试试本章 5 道精选题 →</Text>
      </View>

      {predict ? <PredictModal {...predict} onAnswer={onAnswer} onClose={() => setPredict(null)} /> : null}
      {reveal ? <RevealModal {...reveal} onClose={() => setReveal(null)} /> : null}
    </ScrollView>
  )
}
