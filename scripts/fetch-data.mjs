#!/usr/bin/env node
/**
 * 抓取 VIX 期限结构 + MAG7 价格
 * 数据来源:
 *   - VIX: Yahoo Finance (^VIX, ^VIX9D, ^VIX3M)
 *   - MAG7: Yahoo Finance v8/finance/chart
 *
 * 输出: public/data/vix-latest.json + public/data/mag7-latest.json
 *
 * 用法 (本地):  node scripts/fetch-data.mjs
 * 用法 (CI):    通过 .github/workflows/data-sync.yml 每日 02:00 UTC 自动触发
 *
 * 没有 API key 也能跑（Yahoo Finance 公开接口）。
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

const OUT_DIR = 'public/data'

const VIX_TICKERS = {
  vix9d: '^VIX9D',
  vix: '^VIX',
  vix3m: '^VIX3M'
}

const MAG7_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'SPY', 'QQQ']

async function fetchYahoo(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  })
  if (!res.ok) throw new Error(`Yahoo ${symbol}: ${res.status}`)
  const json = await res.json()
  const result = json?.chart?.result?.[0]
  if (!result) throw new Error(`Yahoo ${symbol}: empty result`)
  const meta = result.meta
  return {
    symbol,
    price: meta.regularMarketPrice,
    prevClose: meta.chartPreviousClose,
    change: meta.regularMarketPrice - meta.chartPreviousClose,
    changePct: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100,
    time: new Date(meta.regularMarketTime * 1000).toISOString()
  }
}

async function ensureDir(path) {
  await mkdir(dirname(path), { recursive: true })
}

async function main() {
  const updated = new Date().toISOString()

  // VIX 期限结构
  console.log('▶ 抓取 VIX 期限结构...')
  const vix = {}
  for (const [key, sym] of Object.entries(VIX_TICKERS)) {
    try {
      vix[key] = await fetchYahoo(sym)
      console.log(`  ✓ ${sym}: ${vix[key].price.toFixed(2)}`)
    } catch (e) {
      console.warn(`  ✗ ${sym}: ${e.message}`)
      vix[key] = null
    }
  }
  // 计算形态
  let shape = 'unknown'
  if (vix.vix9d && vix.vix && vix.vix3m) {
    const a = vix.vix9d.price, b = vix.vix.price, c = vix.vix3m.price
    if (a < b && b < c) shape = 'contango'
    else if (a > b && b > c) shape = 'backwardation'
    else shape = 'mixed'
  }

  const vixOut = { updated, shape, vix }
  const vixPath = `${OUT_DIR}/vix-latest.json`
  await ensureDir(vixPath)
  await writeFile(vixPath, JSON.stringify(vixOut, null, 2))
  console.log(`▶ 写入 ${vixPath} · 形态=${shape}`)

  // MAG7 + ETF 价格
  console.log('\n▶ 抓取 MAG7 + SPY/QQQ...')
  const mag7 = {}
  for (const sym of MAG7_TICKERS) {
    try {
      mag7[sym] = await fetchYahoo(sym)
      console.log(`  ✓ ${sym}: $${mag7[sym].price.toFixed(2)} (${mag7[sym].changePct >= 0 ? '+' : ''}${mag7[sym].changePct.toFixed(2)}%)`)
    } catch (e) {
      console.warn(`  ✗ ${sym}: ${e.message}`)
    }
  }

  const mag7Out = { updated, prices: mag7 }
  const mag7Path = `${OUT_DIR}/mag7-latest.json`
  await ensureDir(mag7Path)
  await writeFile(mag7Path, JSON.stringify(mag7Out, null, 2))
  console.log(`▶ 写入 ${mag7Path}`)

  console.log('\n✅ 全部完成')
}

main().catch(err => {
  console.error('❌ 抓取失败:', err)
  // CI 中不让数据失败导致整个 pipeline 红：退出 0
  process.exit(0)
})
