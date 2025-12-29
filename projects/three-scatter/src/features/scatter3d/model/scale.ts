import type { MetricDef } from './metrics'
import { toNumberOrZero } from './normalize'
import type { CompanyYearRow, ProjectedPoint, Vec3 } from './types'

type Domain = readonly [number, number]

function computeSymmetricDomain(values: number[]): Domain {
  // 包含 0，且让正负对称（更适合金融指标的正负视觉对比）
  const withZero = values.concat([0])
  let maxAbs = 0
  for (const v of withZero) {
    const a = Math.abs(v)
    if (a > maxAbs) maxAbs = a
  }
  if (maxAbs === 0) return [-1, 1]
  return [-maxAbs, maxAbs]
}

function mapToRange(value: number, domain: Domain, range: number): number {
  const [d0, d1] = domain
  const span = d1 - d0
  if (span === 0) return 0
  // 归一化到 [0,1] 再映射到 [-range, +range]
  const t = (value - d0) / span
  return (t * 2 - 1) * range
}

function signColor(value: number): Vec3 {
  // 点保持紫色系：更适合黑色背景、且正负值有区分
  if (value > 0) return hexToVec3('#BC6FF1')
  if (value < 0) return hexToVec3('#892CDC')
  return hexToVec3('#52057B')
}

function hexToVec3(hex: string): Vec3 {
  const h = hex.replace('#', '').trim()
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const r = parseInt(full.slice(0, 2), 16) / 255
  const g = parseInt(full.slice(2, 4), 16) / 255
  const b = parseInt(full.slice(4, 6), 16) / 255
  return [r, g, b]
}

export function projectRowsToPoints(args: {
  rows: CompanyYearRow[]
  xMetric: MetricDef
  yMetric: MetricDef
  zMetric: MetricDef
  range?: number
}): { points: ProjectedPoint[]; domains: { x: Domain; y: Domain; z: Domain } } {
  const range = args.range ?? 10
  const xVals = args.rows.map((r) => toNumberOrZero(args.xMetric.get(r)))
  const yVals = args.rows.map((r) => toNumberOrZero(args.yMetric.get(r)))
  const zVals = args.rows.map((r) => toNumberOrZero(args.zMetric.get(r)))

  const domains = {
    x: computeSymmetricDomain(xVals),
    y: computeSymmetricDomain(yVals),
    z: computeSymmetricDomain(zVals),
  } as const

  const points: ProjectedPoint[] = args.rows.map((r, idx) => {
    const rawX = xVals[idx]
    const rawY = yVals[idx]
    const rawZ = zVals[idx]
    return {
      id: r.id,
      label: `${r.name} (${r.year})`,
      position: [
        mapToRange(rawX, domains.x, range),
        mapToRange(rawY, domains.y, range),
        mapToRange(rawZ, domains.z, range),
      ],
      color: signColor(rawY),
      raw: { x: rawX, y: rawY, z: rawZ },
    }
  })

  return { points, domains }
}


