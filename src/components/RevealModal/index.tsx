import { View, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  title: string
  delta: string
  explain: string
  twist: string
  onClose: () => void
}

export default function RevealModal({ title, delta, explain, twist, onClose }: Props) {
  return (
    <View className='reveal-mask' onClick={onClose}>
      <View className='reveal-card' onClick={(e: any) => e.stopPropagation()}>
        <Text className='reveal-tag'>🎯 真相揭晓</Text>
        <Text className='reveal-title'>{title}</Text>
        <View className='reveal-delta-box'>
          <Text className='reveal-delta'>{delta}</Text>
        </View>
        <Text className='reveal-explain'>{explain}</Text>
        <View className='reveal-twist'>
          <Text className='reveal-twist-label'>⚡ 反预期</Text>
          <Text className='reveal-twist-text'>{twist}</Text>
        </View>
        <View className='reveal-cta' onClick={onClose}>
          <Text>继续探索 →</Text>
        </View>
      </View>
    </View>
  )
}
