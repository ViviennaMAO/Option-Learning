import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { allChapters } from '../../data/chapters'
import './index.scss'

export default function Mvp() {
  const withHooks = allChapters.filter(c => c.hook)

  return (
    <ScrollView scrollY className='mvp-page'>
      <View className='mvp-hero'>
        <Text className='mvp-title'>⭐ 12 个反预期时刻</Text>
        <Text className='mvp-sub'>"教科书说 X，市场实际 Y"——这些是你必须先看懂的冲击点</Text>
      </View>
      {withHooks.map(c => (
        <View key={c.num} className='mvp-card' onClick={() => c.pagePath && Taro.navigateTo({ url: c.pagePath })}>
          <Text className='mvp-num'>第 {c.num} 章</Text>
          <View className='mvp-emoji-title'>
            <Text className='e'>{c.emoji}</Text>
            <Text className='t'>{c.title}</Text>
          </View>
          <Text className='mvp-hook'>⚡ {c.hook}</Text>
          <Text className='mvp-cta'>进入互动模拟器 →</Text>
        </View>
      ))}
    </ScrollView>
  )
}
