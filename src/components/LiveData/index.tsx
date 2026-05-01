import { View, Text } from '@tarojs/components'
import './index.scss'

export interface LiveTile {
  label: string
  value: string
  change?: string
  hint?: string
  accent?: 'up' | 'down' | 'flat'
}

interface Props {
  title?: string
  subtitle?: string
  tiles: LiveTile[]
}

export default function LiveData({ title = '📡 当下市场', subtitle, tiles }: Props) {
  return (
    <View className='live-data'>
      <View className='live-head'>
        <Text className='live-title'>{title}</Text>
        {subtitle ? <Text className='live-subtitle'>{subtitle}</Text> : null}
      </View>
      <View className='live-grid'>
        {tiles.map((t, i) => (
          <View key={i} className={`live-tile ${t.accent || ''}`}>
            <Text className='live-label'>{t.label}</Text>
            <Text className='live-value'>{t.value}</Text>
            {t.change ? <Text className='live-change'>{t.change}</Text> : null}
            {t.hint ? <Text className='live-hint'>{t.hint}</Text> : null}
          </View>
        ))}
      </View>
    </View>
  )
}
