import { View, Text, ScrollView } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { loadProgress, completionRate, dueReviews } from '../../utils/progress'
import { allChapters, totalChapters, findChapter } from '../../data/chapters'
import './index.scss'

export default function Progress() {
  const [data, setData] = useState(loadProgress())

  useEffect(() => { setData(loadProgress()) }, [])

  const pct = completionRate(data, totalChapters)
  const due = dueReviews(data)
  const completed = Object.values(data.chapters).filter(c => c.completed).length
  const opened = Object.keys(data.chapters).length

  function go(num: number) {
    const f = findChapter(num)
    if (f?.chapter.pagePath) Taro.navigateTo({ url: f.chapter.pagePath })
  }

  return (
    <ScrollView scrollY className='prog-page'>
      <View className='prog-hero'>
        <Text className='ph-num'>{pct}%</Text>
        <Text className='ph-label'>整体完成率</Text>
        <View className='ph-meta'>
          <Text className='ph-stat'>🔥 <Text>{data.streakDays}</Text> 天连续</Text>
          <Text className='ph-stat'>📖 <Text>{opened}</Text>/{totalChapters} 章已开</Text>
          <Text className='ph-stat'>✅ <Text>{completed}</Text> 已通过</Text>
        </View>
      </View>

      {due.length > 0 ? (
        <View className='prog-section'>
          <Text className='ph-tag'>⏰ 待复习 ({due.length})</Text>
          {due.map(r => {
            const f = findChapter(r.num)
            if (!f) return null
            return (
              <View key={r.num} className='prog-row' onClick={() => go(r.num)}>
                <Text className='pr-emoji'>{f.chapter.emoji}</Text>
                <View className='pr-body'>
                  <Text className='pr-title'>第 {r.num} 章 · {f.chapter.title}</Text>
                  <Text className='pr-meta'>L{r.level} · 艾宾浩斯队列</Text>
                </View>
                <Text className='pr-status due'>复习</Text>
              </View>
            )
          })}
        </View>
      ) : null}

      <View className='prog-section'>
        <Text className='ph-tag'>📚 全部章节</Text>
        {allChapters.map(c => {
          const stat = data.chapters[c.num]
          const status = stat?.completed ? 'done' : stat ? 'opened' : 'untouched'
          const label = status === 'done' ? '✓ 通过' : status === 'opened' ? '已开' : '未开始'
          return (
            <View key={c.num} className='prog-row' onClick={() => c.pagePath && Taro.navigateTo({ url: c.pagePath })}>
              <Text className='pr-emoji'>{c.emoji}</Text>
              <View className='pr-body'>
                <Text className='pr-title'>第 {c.num} 章 · {c.title}</Text>
                <Text className='pr-meta'>
                  {stat ? `已答 ${stat.predictAttempts} 次预测，正确 ${stat.predictCorrect}` : '未访问'}
                  {stat?.quizScore !== undefined ? ` · 测验 ${stat.quizScore}%` : ''}
                </Text>
              </View>
              <Text className={`pr-status ${status}`}>{label}</Text>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}
