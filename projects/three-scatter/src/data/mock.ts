import type { CompanyYearRow } from '../features/scatter3d/model/types'
import { METRIC_ORDER } from './dataset'

export function generateMockRowsUniformWide(args: {
  count: number
  seed: number
  nullRate: number
}): CompanyYearRow[] {
  const rng = mulberry32(args.seed)
  const out: CompanyYearRow[] = []
  const year = 2024

  for (let i = 0; i < args.count; i++) {
    const id = `mock-${year}-${i + 1}`
    const name = `Company-${String(i + 1).padStart(3, '0')}`

    const metrics: Record<string, number | null> = {}
    for (const k of METRIC_ORDER) {
      // 更离散、更均匀：尽量铺满范围（先写死一个通用范围，真实展示以 data.json 为准）
      metrics[k] = maybeNull(rng, args.nullRate) ? null : lerp(-100, 100, rng())
    }

    out.push({ id, name, year, metrics })
  }

  return out
}

function maybeNull(rng: () => number, p: number): boolean {
  return rng() < p
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

// 可复现随机数
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}


