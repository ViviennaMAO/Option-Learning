import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { coveredCallPayoff, protectivePutPayoff, collarPayoff, generatePayoffCurve } from '../../utils/formulas'
import SnapshotBar from '../../components/SnapshotBar'
import SliderRow from '../../components/SliderRow'
import PredictModal from '../../components/PredictModal'
import RevealModal from '../../components/RevealModal'
import PayoffChart from '../../components/PayoffChart'
import type { PredictDef, RevealDef } from '../../utils/snapshots'
import { markOpened, markPredicted } from '../../utils/progress'
import './index.scss'

type Strategy = 'covered' | 'protective' | 'collar'

interface Params {
  strategy: Strategy
  S0: number
  Kc: number
  Kp: number
  callPremium: number
  putPremium: number
}

const SNAPS = [
  { key: 'aapl-cc', label: 'AAPL covered call', strategy: 'covered' as const, S0: 200, Kc: 210, Kp: 0, callPremium: 3, putPremium: 0,
    predict: {
      question: '持有 AAPL@200，卖 210 call $3。AAPL 涨到 220，盈亏？',
      options: ['+$23', '+$13', '+$10', '+$3'],
      correct: 1,
      contextLine: 'Covered call 上限被锁'
    } as PredictDef,
    reveal: {
      title: 'Covered call 的代价',
      delta: '+$13 vs 持股 +$20',
      explain: '股票部分 +20，但 call 被行权，等于 210 卖出股票（净 +10）。加权利金 3 = +13。少赚 7。',
      twist: '牛市顶部 covered call 跑输持股——但回撤期帮你回血，长期 Sharpe 更高。'
    } as RevealDef
  },
  { key: 'spy-pp', label: 'SPY protective put', strategy: 'protective' as const, S0: 560, Kc: 0, Kp: 540, callPremium: 0, putPremium: 8 },
  { key: 'msft-collar', label: 'MSFT zero-cost collar', strategy: 'collar' as const, S0: 430, Kc: 450, Kp: 410, callPremium: 6, putPremium: 6 }
]

export default function Ch8() {
  const [p, setP] = useState<Params>({ strategy: 'covered', S0: 200, Kc: 210, Kp: 190, callPremium: 3, putPremium: 4 })
  const [flash, setFlash] = useState(false)
  const [predict, setPredict] = useState<PredictDef | null>(null)
  const [reveal, setReveal] = useState<RevealDef | null>(null)
  const [predictKey, setPredictKey] = useState('')

  useEffect(() => { markOpened(8) }, [])

  const calcPnl = (ST: number) => {
    if (p.strategy === 'covered') return coveredCallPayoff({ S0: p.S0, K: p.Kc, premium: p.callPremium }, ST)
    if (p.strategy === 'protective') return protectivePutPayoff({ S0: p.S0, K: p.Kp, premium: p.putPremium }, ST)
    return collarPayoff({ S0: p.S0, Kc: p.Kc, Kp: p.Kp, callPremium: p.callPremium, putPremium: p.putPremium }, ST)
  }

  const curve = useMemo(() => {
    const r = p.S0 * 0.3
    return generatePayoffCurve(calcPnl, p.S0 - r, p.S0 + r, 60)
  }, [p])

  const upPnl = calcPnl(p.S0 * 1.15)
  const flatPnl = calcPnl(p.S0)
  const downPnl = calcPnl(p.S0 * 0.85)

  function loadSnap(key: string) {
    const s = SNAPS.find(x => x.key === key)
    if (!s) return
    setP({
      strategy: s.strategy,
      S0: s.S0,
      Kc: s.Kc || s.S0 + 10,
      Kp: s.Kp || s.S0 - 10,
      callPremium: s.callPremium,
      putPremium: s.putPremium
    })
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
    if (s.predict) { setPredict(s.predict); setPredictKey(key) }
  }

  function onAnswer(c: boolean) {
    markPredicted(8, c)
    const s = SNAPS.find(x => x.key === predictKey)
    setPredict(null)
    if (s?.reveal) setReveal(s.reveal)
  }

  return (
    <ScrollView scrollY className='ch-page'>
      <View className='page-header'>
        <Text className='page-title'>🛡️ 套保交易期权组合</Text>
        <Text className='page-meta'>第 8 章 · 12 分钟 · ⭐⭐</Text>
      </View>

      <SnapshotBar items={SNAPS.map(s => ({ key: s.key, label: s.label }))} onSelect={loadSnap} defaultKey='aapl-cc' />

      <View className='strategy-tabs'>
        {(['covered', 'protective', 'collar'] as const).map(s => (
          <View key={s} className={`tab ${p.strategy === s ? 'active' : ''}`} onClick={() => setP({ ...p, strategy: s })}>
            <Text>{s === 'covered' ? '担保看涨' : s === 'protective' ? '保护看跌' : '双限 Collar'}</Text>
          </View>
        ))}
      </View>

      <View className='panel'>
        <Text className='panel-tag'>调整持股成本与套保参数</Text>
        <SliderRow label='持股成本 S0' value={p.S0} min={50} max={600} step={1} prefix='$' onChange={v => setP({ ...p, S0: v })} />
        {(p.strategy === 'covered' || p.strategy === 'collar') ? (
          <>
            <SliderRow label='卖 call 行权价' value={p.Kc} min={p.S0} max={p.S0 * 1.3} step={1} prefix='$' onChange={v => setP({ ...p, Kc: v })} />
            <SliderRow label='Call 权利金' value={p.callPremium} min={0.1} max={30} step={0.1} digits={1} prefix='$' onChange={v => setP({ ...p, callPremium: v })} />
          </>
        ) : null}
        {(p.strategy === 'protective' || p.strategy === 'collar') ? (
          <>
            <SliderRow label='买 put 行权价' value={p.Kp} min={p.S0 * 0.7} max={p.S0} step={1} prefix='$' onChange={v => setP({ ...p, Kp: v })} />
            <SliderRow label='Put 权利金' value={p.putPremium} min={0.1} max={30} step={0.1} digits={1} prefix='$' onChange={v => setP({ ...p, putPremium: v })} />
          </>
        ) : null}
      </View>

      <PayoffChart id='ch8Chart' data={curve} currentPrice={p.S0} />

      <View className={`output ${flash ? 'flash' : ''}`}>
        <Text className='output-label'>Spot @ S0 现状盈亏</Text>
        <Text className={`output-big ${flatPnl >= 0 ? 'up' : 'down'}`}>${flatPnl.toFixed(2)}</Text>
        <Text className='output-hint'>套保策略价值 = 风险控制，不是收益最大化</Text>
      </View>

      <View className='scenario-grid'>
        <View className='scenario down'>
          <Text className='sc-title'>下跌 -15%</Text>
          <Text className='sc-price'>${(p.S0 * 0.85).toFixed(0)}</Text>
          <Text className={`sc-pnl ${downPnl >= 0 ? 'green' : 'red'}`}>${downPnl.toFixed(1)}</Text>
        </View>
        <View className='scenario flat'>
          <Text className='sc-title'>横盘</Text>
          <Text className='sc-price'>${p.S0}</Text>
          <Text className={`sc-pnl ${flatPnl >= 0 ? 'green' : 'red'}`}>${flatPnl.toFixed(1)}</Text>
        </View>
        <View className='scenario up'>
          <Text className='sc-title'>上涨 +15%</Text>
          <Text className='sc-price'>${(p.S0 * 1.15).toFixed(0)}</Text>
          <Text className={`sc-pnl ${upPnl >= 0 ? 'green' : 'red'}`}>${upPnl.toFixed(1)}</Text>
        </View>
      </View>

      <View className='edu-card'>
        <Text className='edu-tag'>📐 三种套保策略对比</Text>
        <Text className='edu-text'>
          担保看涨 (covered call)：持股 + 卖 call。换权利金，放弃 K 以上收益。{'\n\n'}
          保护性看跌 (protective put)：持股 + 买 put。付权利金，下方有保险。{'\n\n'}
          双限期权 (collar)：持股 + 卖 call + 买 put。合并以上，零成本保险。{'\n\n'}
          选择标准：判断方向不明用 collar；横盘用 covered call；担心暴跌用 protective put。
        </Text>
      </View>

      <View className='edu-card edu-twist'>
        <Text className='edu-tag'>⚡ 反预期 hook</Text>
        <Text className='edu-text'>
          巴菲特的 Berkshire 频繁使用 covered call 把"持股的时间价值"变现。{'\n\n'}
          很多人觉得 covered call 是"小散户策略"——其实是机构每月稳定 1-2% 现金流的核心。{'\n\n'}
          "放弃上涨" 不等于 "不赚"——它是把不确定的远期收益贴现为确定的当下现金。
        </Text>
      </View>

      <View className='further-cta' onClick={() => Taro.navigateTo({ url: '/pages/quiz/index?ch=8' })}>
        <Text>🧩 试试本章 5 道精选题 →</Text>
      </View>

      {predict ? <PredictModal {...predict} onAnswer={onAnswer} onClose={() => setPredict(null)} /> : null}
      {reveal ? <RevealModal {...reveal} onClose={() => setReveal(null)} /> : null}
    </ScrollView>
  )
}
