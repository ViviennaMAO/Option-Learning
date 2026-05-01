import Taro from '@tarojs/taro'

export interface ChapterStat {
  num: number
  firstOpenedAt: number
  lastOpenedAt: number
  predictAttempts: number
  predictCorrect: number
  quizScore?: number
  quizTakenAt?: number
  completed: boolean
  completedAt?: number
}

export interface ReviewItem {
  num: number
  dueAt: number
  level: number
}

export interface ProgressData {
  chapters: Record<number, ChapterStat>
  reviews: ReviewItem[]
  lastActiveAt: number
  streakDays: number
}

const KEY = 'options_progress_v1'

const REVIEW_INTERVALS_MIN = [
  20,
  60 * 24,
  60 * 24 * 3,
  60 * 24 * 7,
  60 * 24 * 14,
  60 * 24 * 30
]

function emptyData(): ProgressData {
  return { chapters: {}, reviews: [], lastActiveAt: Date.now(), streakDays: 1 }
}

export function loadProgress(): ProgressData {
  try {
    const raw = Taro.getStorageSync(KEY)
    if (!raw) return emptyData()
    return typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch {
    return emptyData()
  }
}

function saveProgress(data: ProgressData) {
  try {
    Taro.setStorageSync(KEY, data)
  } catch {
    // ignore
  }
}

function ensureChapter(data: ProgressData, num: number): ChapterStat {
  if (!data.chapters[num]) {
    data.chapters[num] = {
      num,
      firstOpenedAt: Date.now(),
      lastOpenedAt: Date.now(),
      predictAttempts: 0,
      predictCorrect: 0,
      completed: false
    }
  }
  return data.chapters[num]
}

export function markOpened(chNum: number): ProgressData {
  const data = loadProgress()
  const c = ensureChapter(data, chNum)
  c.lastOpenedAt = Date.now()
  // streak 计算
  const today = new Date().toDateString()
  const lastActive = new Date(data.lastActiveAt).toDateString()
  if (today !== lastActive) {
    const diff = Date.now() - data.lastActiveAt
    if (diff < 48 * 3600 * 1000) data.streakDays = (data.streakDays || 0) + 1
    else data.streakDays = 1
  }
  data.lastActiveAt = Date.now()
  saveProgress(data)
  return data
}

export function markPredicted(chNum: number, correct: boolean): ProgressData {
  const data = loadProgress()
  const c = ensureChapter(data, chNum)
  c.predictAttempts += 1
  if (correct) c.predictCorrect += 1
  saveProgress(data)
  return data
}

export function markQuiz(chNum: number, score: number): ProgressData {
  const data = loadProgress()
  const c = ensureChapter(data, chNum)
  c.quizScore = score
  c.quizTakenAt = Date.now()
  if (score >= 60) {
    c.completed = true
    c.completedAt = Date.now()
    const existing = data.reviews.find(r => r.num === chNum)
    if (!existing) {
      data.reviews.push({
        num: chNum,
        dueAt: Date.now() + REVIEW_INTERVALS_MIN[0] * 60 * 1000,
        level: 0
      })
    }
  }
  saveProgress(data)
  return data
}

export function reviewDone(chNum: number, success: boolean): ProgressData {
  const data = loadProgress()
  const r = data.reviews.find(rv => rv.num === chNum)
  if (!r) return data
  if (success) r.level = Math.min(5, r.level + 1)
  else r.level = Math.max(0, r.level - 1)
  r.dueAt = Date.now() + REVIEW_INTERVALS_MIN[r.level] * 60 * 1000
  saveProgress(data)
  return data
}

export function dueReviews(data: ProgressData): ReviewItem[] {
  const now = Date.now()
  return data.reviews.filter(r => r.dueAt <= now)
}

export function completionRate(data: ProgressData, total: number): number {
  const done = Object.values(data.chapters).filter(c => c.completed).length
  return total > 0 ? Math.round((done / total) * 100) : 0
}
