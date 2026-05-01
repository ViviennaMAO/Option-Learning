import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { ch10Snapshots } from '../../utils/snapshots'
import type { PredictDef, RevealDef } from '../../utils/snapshots'
import SnapshotBar from '../../components/SnapshotBar'
import SliderRow from '../../components/SliderRow'
import PredictModal from '../../components/PredictModal'
import RevealModal from '../../components/RevealModal'
import LiveData from '../../components/LiveData'
import { markOpened, markPredicted } from '../../utils/progress'
import { getVixSync, refreshVix, type VixData } from '../../utils/marketData'
import './index.scss'

interface Params { vix9d: number; vix30d: number; vix90d: number }

export default function Ch10() {
  const [p, setP] = useState<Params>({ vix9d: 13, vix30d: 16, vix90d: 19 })
  const [flash, setFlash] = useState(false)
  const [predict, setPredict] = useState<PredictDef | null>(null)
  const [reveal, setReveal] = useState<RevealDef | null>(null)
  const [predictKey, setPredictKey] = useState('')
  const [live, setLive] = useState<VixData>(getVixSync())

  useEffect(() => {
    markOpened(10)
    refreshVix().then(setLive)
  }, [])

  function loadLive() {
    setP({ vix9d: live.vix9d, vix30d: live.vix, vix90d: live.vix3m })
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
  }

  const shape = useMemo(() => {
    if (p.vix9d > p.vix30d && p.vix30d > p.vix90d) return { name: 'Backwardation 逆向', desc: '近期 > 远期，市场在为短期恐慌定价', accent: 'danger' }
    if (p.vix9d < p.vix30d && p.vix30d < p.vix90d) return { name: 'Contango 常态', desc: '远期 > 近期，正常市场环境', accent: 'normal' }
    if (Math.abs(p.vix9d - p.vix30d) < 1.5) return { name: '近乎平坦', desc: '过渡期', accent: 'normal' }
    return { name: 'Hump 驼峰', desc: '中段最高，特定事件预期', accent: 'event' }
  }, [p])

  const max = Math.max(p.vix9d, p.vix30d, p.vix90d)

  function loadSnap(key: string) {
    const s = ch10Snapshots.find(x => x.key === key)
    if (!s) return
    setP(s.params)
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
    if (s.predict) { setPredict(s.predict); setPredictKey(key) }
  }

  function onAnswer(c: boolean) {
    markPredicted(10, c)
    const s = ch10Snapshots.find(x => x.key === predictKey)
    setPredict(null)
    if (s?.reveal) setReveal(s.reveal)
  }

  return (
    <ScrollView scrollY className='ch-page'>
      <View className='page-header'>
        <Text className='page-title'>📈 波动率期限结构</Text>
        <Text className='page-meta'>第 10 章 · 15 分钟 · ⭐⭐⭐⭐</Text>
      </View>

      <SnapshotBar items={ch10Snapshots} onSelect={loadSnap} defaultKey='normal' />

      <LiveData
        title='📡 当前 VIX 期限结构'
        subtitle={`数据来源 · ${live.source} · ${live.updated}`}
        tiles={[
          { label: 'VIX 9D', value: live.vix9d.toFixed(2), accent: 'flat' },
          { label: 'VIX 30D', value: live.vix.toFixed(2), accent: 'flat' },
          { label: 'VIX 3M', value: live.vix3m.toFixed(2), accent: 'flat' },
          { label: '形态', value: live.shape, hint: '点击下方按钮加载' }
        ]}
      />
      <View className='further-cta' style='margin-top:0;background:var(--bg-elev);color:var(--accent);' onClick={loadLive}>
        <Text>📥 用真实 VIX 数据替换滑块 →</Text>
      </View>

      <View className='panel'>
        <Text className='panel-tag'>调整三个期限的 VIX 值</Text>
        <SliderRow label='9 天 VIX' value={p.vix9d} min={5} max={80} step={0.5} digits={1} unit='%' onChange={v => setP({ ...p, vix9d: v })} />
        <SliderRow label='30 天 VIX' value={p.vix30d} min={5} max={80} step={0.5} digits={1} unit='%' onChange={v => setP({ ...p, vix30d: v })} />
        <SliderRow label='90 天 VIX' value={p.vix90d} min={5} max={80} step={0.5} digits={1} unit='%' onChange={v => setP({ ...p, vix90d: v })} />
      </View>

      <View className='term-curve'>
        <Text className='panel-tag'>期限结构形态</Text>
        <View className='term-bars'>
          {[p.vix9d, p.vix30d, p.vix90d].map((v, i) => (
            <View key={i} className={`term-bar ${v > 30 ? 'high' : ''}`} style={`height:${(v / max) * 100}%`}>
              <Text className='term-bar-val'>{v.toFixed(1)}</Text>
            </View>
          ))}
        </View>
        <View className='term-labels'>
          <Text className='term-label'>9D</Text>
          <Text className='term-label'>30D</Text>
          <Text className='term-label'>90D</Text>
        </View>
      </View>

      <View className={`output ${flash ? 'flash' : ''}`}>
        <Text className='output-label'>当前形态</Text>
        <Text className='output-big'>{shape.name}</Text>
        <Text className='output-hint'>{shape.desc}</Text>
      </View>

      <View className='edu-card'>
        <Text className='edu-tag'>📐 三种形态的含义</Text>
        <Text className='edu-text'>
          {'Contango (远期 > 近期)：常态。市场认为短期平稳、长期不确定性更大。占 80% 时间。\n\n'}
          {'Backwardation (近期 > 远期)：恐慌时出现。市场认为"危机是短期的"。\n\n'}
          Hump (中段最高)：典型为已知事件前。例如 Fed 议息会议在 3 周后，则 21 天 IV 最高。{'\n\n'}
          形态切换本身就是交易信号——backwardation → contango 历史上常对应反弹。
        </Text>
      </View>

      <View className='edu-card edu-twist'>
        <Text className='edu-tag'>⚡ 反预期 hook</Text>
        <Text className='edu-text'>
          短期 VIX = 40%，长期 VIX = 20%——市场不是在说"恐慌升级"，反而是在说"恐慌是暂时的"。{'\n\n'}
          因为远端 IV 是市场对"长期常态"的定价。如果市场真的认为危机会持续，远端会一起涨。{'\n\n'}
          看 VIX 不能只看绝对值——形态比水平更重要。
        </Text>
      </View>

      <View className='further-cta' onClick={() => Taro.navigateTo({ url: '/pages/quiz/index?ch=10' })}>
        <Text>🧩 试试本章 5 道精选题 →</Text>
      </View>

      {predict ? <PredictModal {...predict} onAnswer={onAnswer} onClose={() => setPredict(null)} /> : null}
      {reveal ? <RevealModal {...reveal} onClose={() => setReveal(null)} /> : null}
    </ScrollView>
  )
}
