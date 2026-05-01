import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { learningPaths, pathGroups } from '../../data/learning-paths'
import { findChapter } from '../../data/chapters'
import './index.scss'

export default function Paths() {
  function go(num: number) {
    const f = findChapter(num)
    if (f?.chapter.pagePath) Taro.navigateTo({ url: f.chapter.pagePath })
  }

  return (
    <ScrollView scrollY className='paths-page'>
      {pathGroups.map(g => (
        <View key={g.id} className='path-group'>
          <Text className='group-head'>{g.title}</Text>
          <Text className='group-desc'>{g.desc}</Text>
          {g.pathIds.map(pid => {
            const p = learningPaths.find(x => x.id === pid)
            if (!p) return null
            return (
              <View key={p.id} className={`path-card lvl${p.level}`}>
                <View className='path-head'>
                  <Text className='path-emoji'>{p.emoji}</Text>
                  <View style='flex:1'>
                    <Text className='path-title'>{p.title}</Text>
                    <Text className='path-tag'>{p.tag}</Text>
                  </View>
                </View>
                <View className='path-hook'>
                  <Text>⚡ {p.hook}</Text>
                </View>
                <Text className='path-outcome'>🎯 {p.outcome}</Text>
                <View className='path-nodes'>
                  {p.nodes.map((n, i) => (
                    <View key={i} className='node' onClick={() => go(n.ch)}>
                      <View className='node-num'>{n.ch}</View>
                      <View className='node-body'>
                        <Text className='node-role'>{n.role}</Text>
                        <Text className='node-why'>{n.why}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )
          })}
        </View>
      ))}
    </ScrollView>
  )
}
