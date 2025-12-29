import type { CompanyYearRow } from '../features/scatter3d/model/types'

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

    // 更离散、更均匀：三个维度都尽量铺满范围
    const profitRate = maybeNull(rng, args.nullRate) ? null : lerp(-0.5, 0.5, rng())
    const marketCap = maybeNull(rng, args.nullRate) ? null : lerp(-200, 800, rng())
    const revenue = maybeNull(rng, args.nullRate) ? null : lerp(-150, 650, rng())

    out.push({ id, name, year, profitRate, marketCap, revenue })
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


