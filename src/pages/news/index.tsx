import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { newsTop10 } from '../../data/news'
import { findChapter } from '../../data/chapters'
import { findGlossary } from '../../data/glossary'
import { findPath } from '../../data/learning-paths'
import './index.scss'

export default function News() {
  const router = useRouter()
  const focusId = router.params.id

  const list = focusId ? newsTop10.filter(n => n.id === focusId) : newsTop10

  function goKnow(type: string, ref: string | number) {
    if (type === 'chapter') {
      const f = findChapter(Number(ref))
      if (f?.chapter.pagePath) Taro.navigateTo({ url: f.chapter.pagePath })
    } else if (type === 'glossary') {
      Taro.navigateTo({ url: '/pages/glossary/index' })
    } else if (type === 'path') {
      Taro.navigateTo({ url: '/pages/paths/index' })
    }
  }

  return (
    <ScrollView scrollY className='news-page'>
      <View className='news-hero'>
        <Text className='nh-title'>📰 今日期权要闻 Top 10</Text>
        <Text className='nh-sub'>每条要闻都链接到 ≥ 2 个知识点 · 用真实新闻巩固理论</Text>
      </View>

      {list.map(n => (
        <View key={n.id} className='news-item'>
          <View className='ni-head'>
            <View className='ni-rank'>{n.rank}</View>
            <Text className='ni-emoji'>{n.emoji}</Text>
            <Text className='ni-cat'>{n.category} · {n.date}</Text>
          </View>
          <Text className='ni-title'>{n.title}</Text>
          <Text className='ni-summary'>{n.summary}</Text>
          <Text className='ni-body'>{n.body}</Text>
          <Text className='ni-twist'>⚡ {n.twist}</Text>
          <View className='ni-knowledge'>
            <Text className='ni-kn-tag'>🔗 关联知识点 ({n.knowledge.length})</Text>
            {n.knowledge.map((k, i) => (
              <View key={i} className='ni-kn-link' onClick={() => goKnow(k.type, k.ref)}>
                <Text className='kl-type'>
                  {k.type === 'chapter' ? `📚 第 ${k.ref} 章` :
                    k.type === 'glossary' ? `📖 词条 · ${k.ref}` :
                      `🗺️ 路径 · ${k.ref}`} →
                </Text>
                <Text className='kl-why'>{k.why}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  )
}
