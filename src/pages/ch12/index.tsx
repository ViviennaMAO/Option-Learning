import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { ch12Snapshots } from '../../utils/snapshots'
import type { PredictDef, RevealDef } from '../../utils/snapshots'
import SnapshotBar from '../../components/SnapshotBar'
import SliderRow from '../../components/SliderRow'
import PredictModal from '../../components/PredictModal'
import RevealModal from '../../components/RevealModal'
import { markOpened, markPredicted } from '../../utils/progress'
import './index.scss'

interface Params { ivShort: number; ivLong: number; threshold: number }

export default function Ch12() {
  const [p, setP] = useState<Params>({ ivShort: 28, ivLong: 22, threshold: 5 })
  const [predict, setPredict] = useState<PredictDef | null>(null)
  const [reveal, setReveal] = useState<RevealDef | null>(null)
  const [predictKey, setPredictKey] = useState('')

  useEffect(() => { markOpened(12) }, [])

  const signal = useMemo(() => {
    const diff = p.ivShort - p.ivLong
    if (diff > p.threshold) return { type: 'sell', diff, action: '卖近买远（卖出日历价差）' }
    if (-diff > p.threshold) return { type: 'buy', diff, action: '买近卖远（买入日历价差）' }
    return { type: 'none', diff, action: '波动率差未达阈值，不开仓' }
  }, [p])

  function loadSnap(key: string) {
    const s = ch12Snapshots.find(x => x.key === key)
    if (!s) return
    setP(s.params)
    if (s.predict) { setPredict(s.predict); setPredictKey(key) }
  }

  function onAnswer(c: boolean) {
    markPredicted(12, c)
    const s = ch12Snapshots.find(x => x.key === predictKey)
    setPredict(null)
    if (s?.reveal) setReveal(s.reveal)
  }

  return (
    <ScrollView scrollY className='ch-page'>
      <View className='page-header'>
        <Text className='page-title'>🔬 期限结构套利</Text>
        <Text className='page-meta'>第 12 章 · 20 分钟 · ⭐⭐⭐⭐⭐</Text>
      </View>

      <SnapshotBar items={ch12Snapshots} onSelect={loadSnap} defaultKey='buy-calendar' />

      <View className='panel'>
        <Text className='panel-tag'>调整 IV 差与阈值，观察信号生成</Text>
        <SliderRow label='当月 IV (近月)' value={p.ivShort} min={5} max={80} step={0.5} digits={1} unit='%' onChange={v => setP({ ...p, ivShort: v })} />
        <SliderRow label='次月 IV (远月)' value={p.ivLong} min={5} max={80} step={0.5} digits={1} unit='%' onChange={v => setP({ ...p, ivLong: v })} />
        <SliderRow label='开仓阈值 n' value={p.threshold} min={1} max={15} step={0.5} digits={1} unit='%' onChange={v => setP({ ...p, threshold: v })} />
      </View>

      <View className={`signal-box ${signal.type}`}>
        <Text className='signal-tag'>当前信号</Text>
        <Text className='signal-name'>
          {signal.type === 'buy' ? '🟢 买入信号' : signal.type === 'sell' ? '🔴 卖出信号' : '⚪ 无信号'}
        </Text>
        <Text className='signal-action'>{signal.action}</Text>
        <Text className='signal-tag'>IV 差 = {signal.diff.toFixed(1)}% (阈值 {p.threshold}%)</Text>
      </View>

      <Text style='display:block;color:var(--text);font-size:28px;font-weight:600;padding:16px 24px 0;'>原文回测表现 (2015-2019)</Text>
      <View className='backtest-table'>
        <View className='row head'>
          <Text className='cell'>策略</Text>
          <Text className='cell'>累计收益</Text>
          <Text className='cell'>年化</Text>
          <Text className='cell'>最大回撤</Text>
        </View>
        <View className='row'>
          <Text className='cell'>买近卖远</Text>
          <Text className='cell acc'>56.3%</Text>
          <Text className='cell'>14.81%</Text>
          <Text className='cell'>-</Text>
        </View>
        <View className='row'>
          <Text className='cell'>卖近买远</Text>
          <Text className='cell acc'>31.3%</Text>
          <Text className='cell'>8.23%</Text>
          <Text className='cell'>-</Text>
        </View>
        <View className='row'>
          <Text className='cell'>合并 (Delta 中性)</Text>
          <Text className='cell acc'>97.3%</Text>
          <Text className='cell'>25.6%</Text>
          <Text className='cell'>8.14%</Text>
        </View>
      </View>

      <View className='edu-card'>
        <Text className='edu-tag'>📐 完整策略流程</Text>
        <Text className='edu-text'>
          1. 每日收盘前观察当月 vs 次月 ATM IV 差。{'\n'}
          2. 差值超过阈值 n → 开仓 (卖高 IV、买低 IV 同 K 同期权类型)。{'\n'}
          3. 调整数量比 V = 100 × Delta_buy / Delta_sell，实现 Delta 中性。{'\n'}
          4. 等到 IV 差回归到 0，或合约临近到期 (3 个自然日内)，平仓。{'\n\n'}
          这是机构级"波动率回归"套利的最简洁实现。
        </Text>
      </View>

      <View className='edu-card edu-twist'>
        <Text className='edu-tag'>⚡ 反预期 hook</Text>
        <Text className='edu-text'>
          买近卖远 + 卖近买远合并年化 23.1%，最大回撤 11.83%——表面看是优秀的策略。{'\n\n'}
          但深挖会发现：滑点从每张 $6 升到 $10 后，年化暴跌到 14.7%。{'\n\n'}
          学术回测的"圣杯"在实盘多被"次月合约流动性差"和"冲击成本"吞掉。这是为什么真正赚钱的不是策略本身，而是基础设施。
        </Text>
      </View>

      <View className='further-cta' onClick={() => Taro.navigateTo({ url: '/pages/quiz/index?ch=12' })}>
        <Text>🧩 试试本章 5 道精选题 →</Text>
      </View>

      {predict ? <PredictModal {...predict} onAnswer={onAnswer} onClose={() => setPredict(null)} /> : null}
      {reveal ? <RevealModal {...reveal} onClose={() => setReveal(null)} /> : null}
    </ScrollView>
  )
}
