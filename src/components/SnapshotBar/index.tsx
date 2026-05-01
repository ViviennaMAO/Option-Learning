import { View, Text, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import './index.scss'

export interface SnapshotBarItem {
  key: string
  label: string
  accent?: 'primary' | 'danger'
}

interface Props {
  items: SnapshotBarItem[]
  onSelect: (key: string) => void
  defaultKey?: string
}

export default function SnapshotBar({ items, onSelect, defaultKey }: Props) {
  const [active, setActive] = useState(defaultKey || items[0]?.key)
  return (
    <View className='snap-bar'>
      <Text className='snap-bar-tag'>📸 历史快照 / 真实场景</Text>
      <ScrollView scrollX className='snap-scroll'>
        {items.map(it => (
          <View
            key={it.key}
            className={`snap-chip ${active === it.key ? 'active' : ''} ${it.accent || ''}`}
            onClick={() => {
              setActive(it.key)
              onSelect(it.key)
            }}
          >
            <Text>{it.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
