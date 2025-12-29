import { getMetricById, type MetricId } from '../features/scatter3d/model/metrics'
import { projectRowsToPoints } from '../features/scatter3d/model/scale'
import type { CompanyYearRow, ProjectedPoint } from '../features/scatter3d/model/types'
import { generateMockRowsUniformWide } from './mock'

export type ScatterDataSnapshot = {
  points: ProjectedPoint[]
  domains: { x: readonly [number, number]; y: readonly [number, number]; z: readonly [number, number] }
  metrics: { x: ReturnType<typeof getMetricById>; y: ReturnType<typeof getMetricById>; z: ReturnType<typeof getMetricById> }
  axisLabels: { x: string; y: string; z: string }
}

/**
 * DataManager（对外以 ProjectedPoint[] 为核心）
 * - 内部可以来自 mock / API / 文件导入等
 * - 对外统一输出：points/domains/metrics labels
 */
class ScatterDataManager {
  private rows: CompanyYearRow[]

  constructor() {
    // 可复现的 mock 数据：后续接真实数据只要替换 rows 的来源
    this.rows = generateMockRowsUniformWide({
      count: 240,
      seed: 20251229,
      nullRate: 0.06,
    })
  }

  getSnapshot(args: { xMetricId: MetricId; yMetricId: MetricId; zMetricId: MetricId; range?: number }): ScatterDataSnapshot {
    const x = getMetricById(args.xMetricId)
    const y = getMetricById(args.yMetricId)
    const z = getMetricById(args.zMetricId)
    const { points, domains } = projectRowsToPoints({ rows: this.rows, xMetric: x, yMetric: y, zMetric: z, range: args.range })
    return {
      points,
      domains,
      metrics: { x, y, z },
      axisLabels: { x: x.label, y: y.label, z: z.label },
    }
  }
}

export const scatterDataManager = new ScatterDataManager()


