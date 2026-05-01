import { View, Text, ScrollView, Input } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { glossary, searchGlossary } from '../../data/glossary'
import { findChapter } from '../../data/chapters'
import './index.scss'

export default function Glossary() {
  const [q, setQ] = useState('')
  const filtered = q ? searchGlossary(q) : null

  function goCh(n: number) {
    const f = findChapter(n)
    if (f?.chapter.pagePath) Taro.navigateTo({ url: f.chapter.pagePath })
  }

  return (
    <ScrollView scrollY className='gloss-page'>
      <View className='gloss-search'>
        <Text>🔍</Text>
        <Input
          className='gloss-input'
          placeholder='搜索术语 (中文/English)'
          value={q}
          onInput={(e: any) => setQ(e.detail.value)}
        />
      </View>

      {filtered ? (
        <View className='gloss-group'>
          <View className='gh'>
            <Text className='gt'>搜索结果 · {filtered.length} 项</Text>
          </View>
          {filtered.map(it => (
            <View key={it.zh} className='gloss-item'>
              <View className='gi-head'>
                <Text className='gi-zh'>{it.zh}</Text>
                <Text className='gi-en'>{it.en}</Text>
              </View>
              <Text className='gi-short'>{it.short}</Text>
              {it.twist ? <Text className='gi-twist'>⚡ {it.twist}</Text> : null}
              <View className='gi-chs'>
                {it.chapters.map(c => (
                  <View key={c} className='ch-pill' onClick={() => goCh(c)}>
                    <Text>第 {c} 章</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : glossary.map(g => (
        <View key={g.id} className='gloss-group'>
          <View className='gh'>
            <Text className='ge'>{g.emoji}</Text>
            <Text className='gt'>{g.title}</Text>
          </View>
          <Text className='gd'>{g.desc} · {g.items.length} 项</Text>
          {g.items.map(it => (
            <View key={it.zh} className='gloss-item'>
              <View className='gi-head'>
                <Text className='gi-zh'>{it.zh}</Text>
                <Text className='gi-en'>{it.en}</Text>
              </View>
              <Text className='gi-short'>{it.short}</Text>
              {it.twist ? <Text className='gi-twist'>⚡ {it.twist}</Text> : null}
              <View className='gi-chs'>
                {it.chapters.map(c => (
                  <View key={c} className='ch-pill' onClick={() => goCh(c)}>
                    <Text>第 {c} 章</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  )
}
