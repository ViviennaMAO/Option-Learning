import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { parts, totalChapters } from '../../data/chapters'
import { newsTop10 } from '../../data/news'
import { loadProgress, completionRate, dueReviews } from '../../utils/progress'
import './index.scss'

export default function Home() {
  const [openParts, setOpenParts] = useState<Set<number>>(new Set([1]))
  const [completion, setCompletion] = useState(0)
  const [streak, setStreak] = useState(0)
  const [due, setDue] = useState(0)

  useEffect(() => {
    const data = loadProgress()
    setCompletion(completionRate(data, totalChapters))
    setStreak(data.streakDays || 0)
    setDue(dueReviews(data).length)
  }, [])

  function togglePart(num: number) {
    const next = new Set(openParts)
    if (next.has(num)) next.delete(num)
    else next.add(num)
    setOpenParts(next)
  }

  function go(url: string) {
    Taro.navigateTo({ url })
  }

  return (
    <ScrollView scrollY className='home'>
      <View className='hero'>
        <Text className='hero-title'>期权策略互动学习</Text>
        <Text className='hero-sub'>12 章 · 9 学习路径 · 60 道精选题 · MAG7 + VIX 真实场景</Text>
      </View>

      {(completion > 0 || due > 0) ? (
        <View className='progress-card' onClick={() => go('/pages/progress/index')}>
          <View className='progress-row'>
            <Text className='progress-num'>{completion}%</Text>
            <View>
              <Text className='progress-label'>学习进度</Text>
              <Text className='progress-meta'>🔥 连续 {streak} 天{due > 0 ? `· ⏰ ${due} 项待复习` : ''}</Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* 1. 完整目录 */}
      <View className='section'>
        <Text className='section-tag'>📚 完整目录</Text>
        {parts.map(p => (
          <View key={p.num} className='part-block'>
            <View className='part-head' onClick={() => togglePart(p.num)}>
              <View>
                <Text className='part-title'>第 {p.num} 部分 · {p.title}</Text>
                <Text className='part-desc'>{p.desc} · {p.range}</Text>
              </View>
              <Text className='part-chev'>{openParts.has(p.num) ? '▾' : '▸'}</Text>
            </View>
            {openParts.has(p.num) ? (
              <View className='ch-list'>
                {p.chapters.map(c => (
                  <View
                    key={c.num}
                    className={`ch-card tier-${c.tier || 'basic'}`}
                    onClick={() => c.pagePath && go(c.pagePath)}
                  >
                    <Text className='ch-emoji'>{c.emoji}</Text>
                    <View className='ch-body'>
                      <Text className='ch-title'>第 {c.num} 章 · {c.title}</Text>
                      <Text className='ch-brief'>{c.brief}</Text>
                      {c.hook ? <Text className='ch-hook'>⚡ {c.hook}</Text> : null}
                    </View>
                    <Text className='ch-arrow'>›</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ))}
      </View>

      {/* 2. 学习地图 */}
      <View className='section'>
        <View className='feature-card' onClick={() => go('/pages/paths/index')}>
          <Text className='feature-emoji'>🗺️</Text>
          <View className='feature-body'>
            <Text className='feature-title'>学习地图 · 9 条主题路径</Text>
            <Text className='feature-desc'>不按教科书顺序，按目标选路径</Text>
          </View>
          <Text className='feature-arrow'>›</Text>
        </View>
      </View>

      {/* 3. 反预期精选 */}
      <View className='section'>
        <View className='feature-card accent' onClick={() => go('/pages/mvp/index')}>
          <Text className='feature-emoji'>⭐</Text>
          <View className='feature-body'>
            <Text className='feature-title'>反预期精选 · 12 个冲击时刻</Text>
            <Text className='feature-desc'>"教科书说 X，市场实际 Y"</Text>
          </View>
          <Text className='feature-arrow'>›</Text>
        </View>
      </View>

      {/* 4. 跨章测验 */}
      <View className='section'>
        <View className='feature-card' onClick={() => go('/pages/quiz/index')}>
          <Text className='feature-emoji'>🧩</Text>
          <View className='feature-body'>
            <Text className='feature-title'>跨章测验 · 60 题随机抽测</Text>
            <Text className='feature-desc'>测试效应：测验即学习</Text>
          </View>
          <Text className='feature-arrow'>›</Text>
        </View>
      </View>

      {/* 5. 词汇附录 */}
      <View className='section'>
        <View className='feature-card' onClick={() => go('/pages/glossary/index')}>
          <Text className='feature-emoji'>📖</Text>
          <View className='feature-body'>
            <Text className='feature-title'>词汇附录 · 50+ 期权术语</Text>
            <Text className='feature-desc'>中英对照 · 关联章节链接</Text>
          </View>
          <Text className='feature-arrow'>›</Text>
        </View>
      </View>

      {/* 6. 今日财经 */}
      <View className='section'>
        <Text className='section-tag'>📰 今日期权要闻 Top 10</Text>
        {newsTop10.slice(0, 3).map(n => (
          <View key={n.id} className='news-card' onClick={() => go(`/pages/news/index?id=${n.id}`)}>
            <View className='news-rank'>{n.rank}</View>
            <View className='news-body'>
              <Text className='news-emoji'>{n.emoji}</Text>
              <Text className='news-title'>{n.title}</Text>
              <Text className='news-summary'>{n.summary}</Text>
            </View>
          </View>
        ))}
        <View className='news-more' onClick={() => go('/pages/news/index')}>
          <Text>查看全部 10 条 →</Text>
        </View>
      </View>

      <View className='footer'>
        <Text>📊 基于华泰期货 / 东北证券研报 · 案例已替换为 MAG7 + SPY/QQQ + VIX</Text>
      </View>
    </ScrollView>
  )
}
