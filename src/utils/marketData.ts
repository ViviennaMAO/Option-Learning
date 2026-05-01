/**
 * 市场数据获取层
 *
 * 优先级:
 *   1. 内存缓存 (1h)
 *   2. Taro 本地存储 (12h)
 *   3. CDN 远程 (jsDelivr / raw.githubusercontent.com)
 *   4. 内置基线 (永远成功)
 */

import Taro from '@tarojs/taro'
import { VIX_BASELINE, MAG7_BASELINE, type VixSnapshot, type MagPrice } from '../data/market-baseline'

// 部署到 GitHub 后改为你的实际 user/repo
const REPO = 'ViviennaMAO/Option-Learning'
const CDN_PRIMARY = (path: string) => `https://cdn.jsdelivr.net/gh/${REPO}@main/${path}`
const CDN_FALLBACK = (path: string) => `https://raw.githubusercontent.com/${REPO}/main/${path}`

const MEM_TTL = 60 * 60 * 1000          // 1h
const STORAGE_TTL = 12 * 60 * 60 * 1000 // 12h

interface CacheEntry<T> { ts: number; data: T }

const memCache: Record<string, CacheEntry<any>> = {}

function readStorage<T>(key: string): T | null {
  try {
    const raw = Taro.getStorageSync(key)
    if (!raw) return null
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (Date.now() - obj.ts > STORAGE_TTL) return null
    return obj.data as T
  } catch {
    return null
  }
}

function writeStorage<T>(key: string, data: T) {
  try {
    Taro.setStorageSync(key, { ts: Date.now(), data })
  } catch { /* ignore */ }
}

async function fetchJson<T>(path: string): Promise<T | null> {
  const tries = [CDN_PRIMARY(path), CDN_FALLBACK(path)]
  for (const url of tries) {
    try {
      const res = await Taro.request({ url, method: 'GET', timeout: 4000 })
      if (res.statusCode === 200 && res.data) return res.data as T
    } catch { /* try next */ }
  }
  return null
}

export interface VixData {
  vix9d: number
  vix: number
  vix3m: number
  shape: string
  updated: string
  source: 'cache' | 'cdn' | 'baseline'
}

export function getVixSync(): VixData {
  const k = 'mkt_vix'
  if (memCache[k] && Date.now() - memCache[k].ts < MEM_TTL) return memCache[k].data
  const stored = readStorage<VixData>(k)
  if (stored) {
    memCache[k] = { ts: Date.now(), data: stored }
    return stored
  }
  // baseline
  const baseline: VixData = {
    vix9d: VIX_BASELINE.vix9d,
    vix: VIX_BASELINE.vix,
    vix3m: VIX_BASELINE.vix3m,
    shape: VIX_BASELINE.shape,
    updated: VIX_BASELINE.updated,
    source: 'baseline'
  }
  memCache[k] = { ts: Date.now(), data: baseline }
  return baseline
}

export async function refreshVix(): Promise<VixData> {
  const k = 'mkt_vix'
  const json = await fetchJson<{ shape: string; vix: any; updated: string }>('public/data/vix-latest.json')
  if (json && json.vix) {
    const data: VixData = {
      vix9d: json.vix.vix9d?.price ?? VIX_BASELINE.vix9d,
      vix: json.vix.vix?.price ?? VIX_BASELINE.vix,
      vix3m: json.vix.vix3m?.price ?? VIX_BASELINE.vix3m,
      shape: json.shape || 'unknown',
      updated: json.updated,
      source: 'cdn'
    }
    memCache[k] = { ts: Date.now(), data }
    writeStorage(k, data)
    return data
  }
  return getVixSync()
}

export interface Mag7Data {
  prices: Record<string, MagPrice>
  updated: string
  source: 'cache' | 'cdn' | 'baseline'
}

export function getMag7Sync(): Mag7Data {
  const k = 'mkt_mag7'
  if (memCache[k] && Date.now() - memCache[k].ts < MEM_TTL) return memCache[k].data
  const stored = readStorage<Mag7Data>(k)
  if (stored) {
    memCache[k] = { ts: Date.now(), data: stored }
    return stored
  }
  const baseline: Mag7Data = {
    prices: MAG7_BASELINE,
    updated: '2026-04-30',
    source: 'baseline'
  }
  memCache[k] = { ts: Date.now(), data: baseline }
  return baseline
}

export async function refreshMag7(): Promise<Mag7Data> {
  const k = 'mkt_mag7'
  const json = await fetchJson<any>('public/data/mag7-latest.json')
  if (json && json.prices) {
    const prices: Record<string, MagPrice> = {}
    for (const [sym, info] of Object.entries(json.prices)) {
      const p = info as any
      if (p && typeof p.price === 'number') {
        prices[sym] = { symbol: sym, price: p.price, changePct: p.changePct ?? 0 }
      }
    }
    const data: Mag7Data = { prices, updated: json.updated, source: 'cdn' }
    memCache[k] = { ts: Date.now(), data }
    writeStorage(k, data)
    return data
  }
  return getMag7Sync()
}
