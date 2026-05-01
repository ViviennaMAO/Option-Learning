/**
 * 期权策略纯函数库 — 所有计算无副作用，可单测
 * 输入数字，输出数字或简单 object
 */

// ----- Ch1: 单腿期权 -----
export interface SingleLegParams {
  S: number    // 标的价格
  K: number    // 行权价
  premium: number
  type: 'call' | 'put'
  side: 'long' | 'short'
}

/** 到期收益 (per share) */
export function singleLegPayoff(p: SingleLegParams, ST: number): number {
  const intrinsic = p.type === 'call' ? Math.max(ST - p.K, 0) : Math.max(p.K - ST, 0)
  const longPayoff = intrinsic - p.premium
  return p.side === 'long' ? longPayoff : -longPayoff
}

/** 盈亏平衡点 */
export function singleLegBreakeven(p: SingleLegParams): number {
  return p.type === 'call' ? p.K + p.premium : p.K - p.premium
}

// ----- Ch3: 垂直价差 -----
export interface VerticalSpreadParams {
  S: number
  K1: number    // 低行权价
  K2: number    // 高行权价
  premium1: number
  premium2: number
  type: 'bull-call' | 'bear-put' | 'bear-call' | 'bull-put'
}

export function verticalSpreadPayoff(p: VerticalSpreadParams, ST: number): number {
  if (p.type === 'bull-call') {
    // 买低 K call + 卖高 K call (debit)
    const long = Math.max(ST - p.K1, 0) - p.premium1
    const short = -(Math.max(ST - p.K2, 0) - p.premium2)
    return long + short
  }
  if (p.type === 'bear-put') {
    // 买高 K put + 卖低 K put (debit)
    const long = Math.max(p.K2 - ST, 0) - p.premium2
    const short = -(Math.max(p.K1 - ST, 0) - p.premium1)
    return long + short
  }
  if (p.type === 'bear-call') {
    // 卖低 K call + 买高 K call (credit)
    const short = -(Math.max(ST - p.K1, 0) - p.premium1)
    const long = Math.max(ST - p.K2, 0) - p.premium2
    return long + short
  }
  // bull-put: 卖高 K put + 买低 K put (credit)
  const short = -(Math.max(p.K2 - ST, 0) - p.premium2)
  const long = Math.max(p.K1 - ST, 0) - p.premium1
  return long + short
}

export function verticalSpreadStats(p: VerticalSpreadParams): {
  maxProfit: number
  maxLoss: number
  breakeven: number
} {
  const width = p.K2 - p.K1
  if (p.type === 'bull-call') {
    const debit = p.premium1 - p.premium2
    return { maxProfit: width - debit, maxLoss: -debit, breakeven: p.K1 + debit }
  }
  if (p.type === 'bear-put') {
    const debit = p.premium2 - p.premium1
    return { maxProfit: width - debit, maxLoss: -debit, breakeven: p.K2 - debit }
  }
  if (p.type === 'bear-call') {
    const credit = p.premium1 - p.premium2
    return { maxProfit: credit, maxLoss: -(width - credit), breakeven: p.K1 + credit }
  }
  // bull-put
  const credit = p.premium2 - p.premium1
  return { maxProfit: credit, maxLoss: -(width - credit), breakeven: p.K2 - credit }
}

// ----- Ch7: 跨式 / 宽跨式 -----
export interface StraddleParams {
  S: number
  K: number          // straddle 同 K
  K2?: number        // strangle 用 (call K)
  callPremium: number
  putPremium: number
  side: 'long' | 'short'
  variant: 'straddle' | 'strangle' | 'strip' | 'strap'
}

export function straddlePayoff(p: StraddleParams, ST: number): number {
  const callK = p.variant === 'strangle' && p.K2 !== undefined ? p.K2 : p.K
  const putK = p.K
  let callQty = 1
  let putQty = 1
  if (p.variant === 'strap') callQty = 2
  if (p.variant === 'strip') putQty = 2
  const callPart = callQty * (Math.max(ST - callK, 0) - p.callPremium)
  const putPart = putQty * (Math.max(putK - ST, 0) - p.putPremium)
  const total = callPart + putPart
  return p.side === 'long' ? total : -total
}

// ----- Ch8: 套保策略 -----
export interface CoveredCallParams {
  S0: number      // 买股成本
  K: number       // 卖 call 行权价
  premium: number
}

export function coveredCallPayoff(p: CoveredCallParams, ST: number): number {
  const stockGain = ST - p.S0
  const shortCallPayoff = -(Math.max(ST - p.K, 0)) + p.premium
  return stockGain + shortCallPayoff
}

export interface ProtectivePutParams {
  S0: number
  K: number
  premium: number
}

export function protectivePutPayoff(p: ProtectivePutParams, ST: number): number {
  const stockGain = ST - p.S0
  const longPutPayoff = Math.max(p.K - ST, 0) - p.premium
  return stockGain + longPutPayoff
}

export interface CollarParams {
  S0: number
  Kc: number       // 卖 call K
  Kp: number       // 买 put K
  callPremium: number
  putPremium: number
}

export function collarPayoff(p: CollarParams, ST: number): number {
  const stockGain = ST - p.S0
  const shortCall = -(Math.max(ST - p.Kc, 0)) + p.callPremium
  const longPut = Math.max(p.Kp - ST, 0) - p.putPremium
  return stockGain + shortCall + longPut
}

// ----- Ch9: BSM 模型 -----
function normalCDF(x: number): number {
  // Abramowitz & Stegun 简化近似
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911
  const sign = x < 0 ? -1 : 1
  x = Math.abs(x) / Math.sqrt(2)
  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  return 0.5 * (1.0 + sign * y)
}

export interface BSMParams {
  S: number
  K: number
  r: number     // 年化无风险利率，如 0.05
  T: number     // 年，如 30/365
  sigma: number // 年化波动率，如 0.25
}

export function bsmCall(p: BSMParams): number {
  const { S, K, r, T, sigma } = p
  if (T <= 0) return Math.max(S - K, 0)
  const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T))
  const d2 = d1 - sigma * Math.sqrt(T)
  return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2)
}

export function bsmPut(p: BSMParams): number {
  const { S, K, r, T, sigma } = p
  if (T <= 0) return Math.max(K - S, 0)
  const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T))
  const d2 = d1 - sigma * Math.sqrt(T)
  return K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1)
}

export function bsmDelta(p: BSMParams, type: 'call' | 'put'): number {
  const { S, K, r, T, sigma } = p
  if (T <= 0) return type === 'call' ? (S > K ? 1 : 0) : (S < K ? -1 : 0)
  const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T))
  return type === 'call' ? normalCDF(d1) : normalCDF(d1) - 1
}

// ----- Ch4: 日历价差(简化估值) -----
export interface CalendarParams {
  S: number
  K: number
  r: number
  sigmaShort: number
  sigmaLong: number
  Tshort: number   // 近月剩余年限
  Tlong: number    // 远月剩余年限
  type: 'call' | 'put'
}

export function calendarValue(p: CalendarParams): {
  shortPrice: number
  longPrice: number
  net: number
} {
  const baseShort: BSMParams = { S: p.S, K: p.K, r: p.r, T: p.Tshort, sigma: p.sigmaShort }
  const baseLong: BSMParams = { S: p.S, K: p.K, r: p.r, T: p.Tlong, sigma: p.sigmaLong }
  const sp = p.type === 'call' ? bsmCall(baseShort) : bsmPut(baseShort)
  const lp = p.type === 'call' ? bsmCall(baseLong) : bsmPut(baseLong)
  return { shortPrice: sp, longPrice: lp, net: lp - sp }
}

// ----- Ch10: 期限结构 -----
export function termStructureValue(termDays: number, vix9d: number, vix30d: number, vix90d: number): number {
  // 简化：分段线性插值
  if (termDays <= 9) return vix9d
  if (termDays <= 30) {
    const t = (termDays - 9) / (30 - 9)
    return vix9d + t * (vix30d - vix9d)
  }
  if (termDays <= 90) {
    const t = (termDays - 30) / (90 - 30)
    return vix30d + t * (vix90d - vix30d)
  }
  return vix90d
}

// ----- 通用：生成收益曲线点 -----
export function generatePayoffCurve(
  payoffFn: (ST: number) => number,
  STmin: number,
  STmax: number,
  steps: number = 60
): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = []
  const dx = (STmax - STmin) / steps
  for (let i = 0; i <= steps; i++) {
    const x = STmin + i * dx
    out.push({ x, y: payoffFn(x) })
  }
  return out
}
