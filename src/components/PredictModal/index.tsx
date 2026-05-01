import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import './index.scss'

interface Props {
  question: string
  options: string[]
  correct: number
  contextLine: string
  onAnswer: (correct: boolean) => void
  onClose: () => void
}

export default function PredictModal({ question, options, correct, contextLine, onAnswer, onClose }: Props) {
  const [picked, setPicked] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  function pick(i: number) {
    setPicked(i)
    setShowResult(true)
    setTimeout(() => onAnswer(i === correct), 1100)
  }

  return (
    <View className='predict-mask' onClick={(e: any) => e.stopPropagation()}>
      <View className='predict-card'>
        <Text className='predict-tag'>⚡ 先猜一下，再看答案</Text>
        <Text className='predict-context'>{contextLine}</Text>
        <Text className='predict-question'>{question}</Text>
        <View className='predict-options'>
          {options.map((op, i) => {
            let cls = 'predict-opt'
            if (showResult) {
              if (i === correct) cls += ' correct'
              else if (i === picked) cls += ' wrong'
            } else if (picked === i) cls += ' active'
            return (
              <View key={i} className={cls} onClick={() => !showResult && pick(i)}>
                <Text>{String.fromCharCode(65 + i)}. {op}</Text>
              </View>
            )
          })}
        </View>
        {showResult ? (
          <Text className='predict-feedback'>
            {picked === correct ? '✅ 答对了！' : '❌ 让我们看看真相'}
          </Text>
        ) : (
          <Text className='predict-tip' onClick={onClose}>跳过 →</Text>
        )}
      </View>
    </View>
  )
}
