/**
 * 市场数据离线基线 — 永远不会失败的 fallback
 * 当 CDN / 网络不可用时使用。
 *
 * 数据快照时间: 2026-04-30 (虚构演示值，实际部署时由 fetch-data.mjs 覆盖)
 */

export interface VixSnapshot {
  vix9d: number
  vix: number       // 30D
  vix3m: number     // 90D
  shape: 'contango' | 'backwardation' | 'mixed'
  updated: string
}

export interface MagPrice {
  symbol: string
  price: number
  changePct: number
}

export const VIX_BASELINE: VixSnapshot = {
  vix9d: 16.2,
  vix: 18.7,
  vix3m: 20.4,
  shape: 'contango',
  updated: '2026-04-30'
}

export const MAG7_BASELINE: Record<string, MagPrice> = {
  AAPL: { symbol: 'AAPL', price: 198.5, changePct: 0.42 },
  MSFT: { symbol: 'MSFT', price: 432.1, changePct: -0.18 },
  GOOGL: { symbol: 'GOOGL', price: 174.8, changePct: 1.05 },
  AMZN: { symbol: 'AMZN', price: 192.3, changePct: 0.31 },
  META: { symbol: 'META', price: 504.6, changePct: -0.92 },
  NVDA: { symbol: 'NVDA', price: 131.7, changePct: 2.18 },
  TSLA: { symbol: 'TSLA', price: 248.9, changePct: -1.45 },
  SPY: { symbol: 'SPY', price: 562.4, changePct: 0.27 },
  QQQ: { symbol: 'QQQ', price: 491.8, changePct: 0.39 }
}
