import { View, Canvas } from '@tarojs/components'
import { useEffect } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

export interface PayoffPoint {
  x: number
  y: number
}

interface Props {
  id: string
  data: PayoffPoint[]
  width?: number
  height?: number
  breakeven?: number[]
  currentPrice?: number
  yLabel?: string
  xLabel?: string
}

export default function PayoffChart({
  id, data, width = 320, height = 200, breakeven = [], currentPrice, yLabel = '盈亏', xLabel = '到期价'
}: Props) {
  useEffect(() => {
    if (!data.length) return
    const ctx = Taro.createCanvasContext(id)
    const W = width
    const H = height
    const padL = 40, padR = 14, padT = 14, padB = 30
    const xMin = data[0].x
    const xMax = data[data.length - 1].x
    const yVals = data.map(d => d.y)
    const yMin = Math.min(...yVals, 0)
    const yMax = Math.max(...yVals, 0)
    const yRange = (yMax - yMin) * 1.1 || 1
    const yMid = (yMax + yMin) / 2

    const sx = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * (W - padL - padR)
    const sy = (y: number) => padT + ((yMid + yRange / 2 - y) / yRange) * (H - padT - padB)

    // background
    ctx.setFillStyle('#141b2d')
    ctx.fillRect(0, 0, W, H)

    // zero line
    ctx.setStrokeStyle('#2a3252')
    ctx.setLineWidth(1)
    ctx.beginPath()
    ctx.moveTo(padL, sy(0))
    ctx.lineTo(W - padR, sy(0))
    ctx.stroke()

    // y axis
    ctx.beginPath()
    ctx.moveTo(padL, padT)
    ctx.lineTo(padL, H - padB)
    ctx.stroke()

    // axis labels
    ctx.setFillStyle('#8d9ab3')
    ctx.setFontSize(9)
    ctx.fillText('0', padL - 12, sy(0) + 3)
    ctx.fillText(yMax.toFixed(0), padL - 22, padT + 8)
    ctx.fillText(yMin.toFixed(0), padL - 22, H - padB - 2)

    // x axis ticks
    const xTicks = 4
    for (let i = 0; i <= xTicks; i++) {
      const x = xMin + ((xMax - xMin) * i) / xTicks
      ctx.fillText(x.toFixed(0), sx(x) - 8, H - padB + 14)
    }

    // shaded gain/loss
    ctx.beginPath()
    data.forEach((p, i) => {
      const X = sx(p.x), Y = sy(Math.max(p.y, 0))
      if (i === 0) ctx.moveTo(X, sy(0))
      else ctx.lineTo(X, Y)
    })
    ctx.lineTo(sx(xMax), sy(0))
    ctx.lineTo(sx(xMin), sy(0))
    ctx.setFillStyle('rgba(74, 222, 128, 0.2)')
    ctx.fill()

    ctx.beginPath()
    data.forEach((p, i) => {
      const X = sx(p.x), Y = sy(Math.min(p.y, 0))
      if (i === 0) ctx.moveTo(X, sy(0))
      else ctx.lineTo(X, Y)
    })
    ctx.lineTo(sx(xMax), sy(0))
    ctx.lineTo(sx(xMin), sy(0))
    ctx.setFillStyle('rgba(248, 113, 113, 0.2)')
    ctx.fill()

    // payoff line
    ctx.setStrokeStyle('#ffb547')
    ctx.setLineWidth(2)
    ctx.beginPath()
    data.forEach((p, i) => {
      const X = sx(p.x), Y = sy(p.y)
      if (i === 0) ctx.moveTo(X, Y)
      else ctx.lineTo(X, Y)
    })
    ctx.stroke()

    // breakeven markers
    breakeven.forEach(be => {
      if (be < xMin || be > xMax) return
      const X = sx(be)
      ctx.setStrokeStyle('rgba(255,255,255,0.3)')
      ctx.setLineWidth(1)
      ctx.beginPath()
      ctx.moveTo(X, padT)
      ctx.lineTo(X, H - padB)
      ctx.stroke()
      ctx.setFillStyle('#8d9ab3')
      ctx.fillText('BE', X - 6, padT + 8)
    })

    // current price
    if (currentPrice !== undefined && currentPrice >= xMin && currentPrice <= xMax) {
      const X = sx(currentPrice)
      ctx.setStrokeStyle('#6ea8ff')
      ctx.setLineWidth(1.5)
      ctx.beginPath()
      ctx.moveTo(X, padT)
      ctx.lineTo(X, H - padB)
      ctx.stroke()
      ctx.setFillStyle('#6ea8ff')
      ctx.fillText('现价', X - 12, H - padB + 14)
    }

    ctx.draw()
  }, [data, breakeven, currentPrice])

  return (
    <View className='payoff-chart'>
      <Canvas
        id={id}
        canvasId={id}
        style={`width:${width}px;height:${height}px`}
      />
    </View>
  )
}
