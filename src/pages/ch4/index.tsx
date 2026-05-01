import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { ch4Snapshots } from '../../utils/snapshots'
import type { PredictDef, RevealDef } from '../../utils/snapshots'
import { calendarValue, bsmCall, bsmPut } from '../../utils/formulas'
import type { CalendarParams } from '../../utils/formulas'
import SnapshotBar from '../../components/SnapshotBar'
import SliderRow from '../../components/SliderRow'
import PredictModal from '../../components/PredictModal'
import RevealModal from '../../components/RevealModal'
import { markOpened, markPredicted } from '../../utils/progress'
import './index.scss'

export default function Ch4() {
  const [p, setP] = useState<CalendarParams>({
    S: 200, K: 200, r: 0.05, sigmaShort: 0.25, sigmaLong: 0.28,
    Tshort: 30 / 365, Tlong: 90 / 365, type: 'call'
  })
  const [flash, setFlash] = useState(false)
  const [predict, setPredict] = useState<PredictDef | null>(null)
  const [reveal, setReveal] = useState<RevealDef | null>(null)
  const [predictKey, setPredictKey] = useState('')

  useEffect(() => { markOpened(4) }, [])

  const val = useMemo(() => calendarValue(p), [p])

  // 模拟 30 天后(横盘) - 近月归零，远月还在
  const future = useMemo(() => {
    const futureLongT = p.Tlong - p.Tshort
    if (futureLongT <= 0) return null
    const remainingLong = p.type === 'call'
      ? bsmCall({ S: p.S, K: p.K, r: p.r, T: futureLongT, sigma: p.sigmaLong })
      : bsmPut({ S: p.S, K: p.K, r: p.r, T: futureLongT, sigma: p.sigmaLong })
    return remainingLong
  }, [p, val])

  const expectedPnl = future !== null ? future - val.net : null

  function loadSnap(key: string) {
    const s = ch4Snapshots.find(x => x.key === key)
    if (!s) return
    setP(s.params)
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
    if (s.predict) { setPredict(s.predict); setPredictKey(key) }
  }

  function onAnswer(c: boolean) {
    markPredicted(4, c)
    const s = ch4Snapshots.find(x => x.key === predictKey)
    setPredict(null)
    if (s?.reveal) setReveal(s.reveal)
  }

  return (
    <ScrollView scrollY className='ch-page'>
      <View className='page-header'>
        <Text className='page-title'>📅 水平价差 (日历)</Text>
        <Text className='page-meta'>第 4 章 · 15 分钟 · ⭐⭐⭐</Text>
      </View>

      <SnapshotBar items={ch4Snapshots} onSelect={loadSnap} defaultKey='aapl-flat' />

      <View className='strategy-tabs'>
        {(['call', 'put'] as const).map(t => (
          <View key={t} className={`tab ${p.type === t ? 'active' : ''}`} onClick={() => setP({ ...p, type: t })}>
            <Text>{t === 'call' ? '日历 Call' : '日历 Put'}</Text>
          </View>
        ))}
      </View>

      <View className='panel'>
        <Text className='panel-tag'>构建：卖近月 + 买远月（同 K）</Text>
        <SliderRow label='标的 S' value={p.S} min={50} max={600} step={1} prefix='$' onChange={v => setP({ ...p, S: v })} />
        <SliderRow label='行权价 K' value={p.K} min={50} max={600} step={1} prefix='$' onChange={v => setP({ ...p, K: v })} />
        <SliderRow label='近月剩余天数' value={p.Tshort * 365} min={5} max={60} step={1} unit=' 天' onChange={v => setP({ ...p, Tshort: v / 365 })} />
        <SliderRow label='远月剩余天数' value={p.Tlong * 365} min={p.Tshort * 365 + 7} max={180} step={1} unit=' 天' onChange={v => setP({ ...p, Tlong: v / 365 })} />
        <SliderRow label='近月 IV' value={p.sigmaShort * 100} min={10} max={80} step={1} digits={0} unit='%' onChange={v => setP({ ...p, sigmaShort: v / 100 })} />
        <SliderRow label='远月 IV' value={p.sigmaLong * 100} min={10} max={80} step={1} digits={0} unit='%' onChange={v => setP({ ...p, sigmaLong: v / 100 })} />
      </View>

      <View className={`output ${flash ? 'flash' : ''}`}>
        <View className='output-row'>
          <View>
            <Text className='output-label'>近月权利金 (卖)</Text>
            <Text className='output-mid'>${val.shortPrice.toFixed(2)}</Text>
          </View>
          <View>
            <Text className='output-label'>远月权利金 (买)</Text>
            <Text className='output-mid'>${val.longPrice.toFixed(2)}</Text>
          </View>
          <View>
            <Text className='output-label'>净支出 (建仓成本)</Text>
            <Text className='output-big'>${val.net.toFixed(2)}</Text>
          </View>
        </View>
        {expectedPnl !== null ? (
          <Text className='output-hint'>
            假设近月到期前 S 仍 = {p.S}：远月还值 ${future?.toFixed(2)}，
            预期盈亏 ${expectedPnl >= 0 ? '+' : ''}{expectedPnl.toFixed(2)}
            {expectedPnl > 0 ? ' (Theta 收益 ✅)' : ''}
          </Text>
        ) : null}
      </View>

      <View className='edu-card'>
        <Text className='edu-tag'>📐 日历价差的两个驱动力</Text>
        <Text className='edu-text'>
          1) Theta 不对称：近月 ATM 期权 Theta 远大于远月。横盘时近月归零更快，远月几乎不变。{'\n\n'}
          2) Vega 不对称：远月期权 Vega 更大。如果整体 IV 上升，组合获利（"long Vega"）。{'\n\n'}
          最佳环境：横盘 + IV 缓慢上升（如事件前期）。最差：标的暴动 + IV 暴跌。
        </Text>
      </View>

      <View className='edu-card edu-twist'>
        <Text className='edu-tag'>⚡ 反预期 hook</Text>
        <Text className='edu-text'>
          AAPL 横盘 30 天，日历价差能赚 30%+——但同样横盘，裸买 call 亏 100%。{'\n\n'}
          "横盘"在散户眼里是"无聊"，在 Theta 收割者眼里是"黄金"。{'\n\n'}
          市场状态没有"好坏"之分，只有"匹配/不匹配"你的策略。
        </Text>
      </View>

      <View className='further-cta' onClick={() => Taro.navigateTo({ url: '/pages/quiz/index?ch=4' })}>
        <Text>🧩 试试本章 5 道精选题 →</Text>
      </View>

      {predict ? <PredictModal {...predict} onAnswer={onAnswer} onClose={() => setPredict(null)} /> : null}
      {reveal ? <RevealModal {...reveal} onClose={() => setReveal(null)} /> : null}
    </ScrollView>
  )
}
