import { View, Text, Slider } from '@tarojs/components'
import './index.scss'

interface Props {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  prefix?: string
  digits?: number
  onChange: (v: number) => void
}

export default function SliderRow({
  label, value, min, max, step = 1, unit = '', prefix = '', digits = 0, onChange
}: Props) {
  const fmt = (v: number) => {
    if (digits > 0) return v.toFixed(digits)
    return Math.round(v).toString()
  }
  return (
    <View className='slider-row'>
      <View className='slider-head'>
        <Text className='slider-label'>{label}</Text>
        <Text className='slider-value'>{prefix}{fmt(value)}{unit}</Text>
      </View>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        showValue={false}
        activeColor='#6ea8ff'
        backgroundColor='#2a3252'
        blockColor='#6ea8ff'
        blockSize={20}
        onChanging={(e: any) => onChange(e.detail.value)}
        onChange={(e: any) => onChange(e.detail.value)}
      />
    </View>
  )
}
