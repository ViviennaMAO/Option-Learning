import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect, useMemo } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { getChapterQuiz, randomQuiz } from '../../data/chapter-quiz'
import type { QuizQuestion } from '../../data/chapter-quiz'
import { markQuiz } from '../../utils/progress'
import './index.scss'

export default function Quiz() {
  const router = useRouter()
  const ch = router.params.ch ? parseInt(router.params.ch) : null
  const [mode, setMode] = useState<'chapter' | 'random10' | 'random20'>(ch ? 'chapter' : 'random10')
  const [idx, setIdx] = useState(0)
  const [picks, setPicks] = useState<(number | null)[]>([])
  const [done, setDone] = useState(false)

  const questions = useMemo<QuizQuestion[]>(() => {
    if (mode === 'chapter' && ch) return getChapterQuiz(ch)
    return randomQuiz(mode === 'random20' ? 20 : 10)
  }, [mode, ch])

  useEffect(() => {
    setPicks(new Array(questions.length).fill(null))
    setIdx(0)
    setDone(false)
  }, [questions])

  const cur = questions[idx]

  function pickOpt(i: number) {
    if (picks[idx] !== null) return
    const next = [...picks]; next[idx] = i; setPicks(next)
  }

  function nextQ() {
    if (idx < questions.length - 1) setIdx(idx + 1)
    else {
      const score = picks.reduce<number>((s, p, i) => s + (p === questions[i].answer ? 1 : 0), 0)
      const pct = Math.round((score / questions.length) * 100)
      if (mode === 'chapter' && ch) markQuiz(ch, pct)
      setDone(true)
    }
  }

  if (!questions.length) return (
    <View className='quiz-page'>
      <Text style='display:block;padding:40px;color:var(--text);text-align:center;'>本章暂无题目</Text>
    </View>
  )

  if (done) {
    const correct = picks.reduce<number>((s, p, i) => s + (p === questions[i].answer ? 1 : 0), 0)
    const pct = Math.round((correct / questions.length) * 100)
    return (
      <View className='quiz-page'>
        <View className='qz-result'>
          <Text className='res-num'>{pct}%</Text>
          <Text className='res-label'>{correct} / {questions.length} 答对</Text>
          <Text className='res-msg'>
            {pct >= 80 ? '🏆 期权高手！测验巩固了记忆。' :
              pct >= 60 ? '👍 不错，已记入复习队列' :
                '💪 错的题恰恰是你最该记住的'}
          </Text>
          <View className='res-cta' onClick={() => Taro.navigateBack()}>
            <Text>返回</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <ScrollView scrollY className='quiz-page'>
      <View className='quiz-hero'>
        <Text className='qh-title'>{ch ? `第 ${ch} 章测验` : '跨章测验'}</Text>
        <Text className='qh-sub'>{idx + 1} / {questions.length} · 测试效应：测验即学习</Text>
      </View>

      {!ch ? (
        <View className='quiz-mode-tabs'>
          <View className={`mt ${mode === 'random10' ? 'active' : ''}`} onClick={() => setMode('random10')}>
            <Text>10 题快测</Text>
          </View>
          <View className={`mt ${mode === 'random20' ? 'active' : ''}`} onClick={() => setMode('random20')}>
            <Text>20 题深测</Text>
          </View>
        </View>
      ) : null}

      <View className='qz-progress'>
        {questions.map((_, i) => (
          <View key={i} className={`seg ${i < idx ? 'done' : ''} ${i === idx ? 'cur' : ''}`} />
        ))}
      </View>

      <View className='q-card'>
        <Text className='q-meta'>第 {cur.ch} 章 · {cur.level} · {cur.id}</Text>
        <Text className='q-text'>{cur.question}</Text>
        <View className='q-opts'>
          {cur.options.map((op, i) => {
            const picked = picks[idx]
            let cls = 'q-opt'
            if (picked !== null) {
              if (i === cur.answer) cls += ' correct'
              else if (i === picked) cls += ' wrong'
            }
            return (
              <View key={i} className={cls} onClick={() => pickOpt(i)}>
                <Text>{String.fromCharCode(65 + i)}. {op}</Text>
              </View>
            )
          })}
        </View>
        {picks[idx] !== null ? (
          <>
            <Text className='q-explain'>💡 {cur.explain}</Text>
            <View className='q-cta' onClick={nextQ}>
              <Text>{idx === questions.length - 1 ? '看分数 →' : '下一题 →'}</Text>
            </View>
          </>
        ) : null}
      </View>
    </ScrollView>
  )
}
