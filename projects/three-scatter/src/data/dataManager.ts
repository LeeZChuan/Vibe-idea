import { getMetricById, type MetricId } from '../features/scatter3d/model/metrics'
import { projectRowsToPoints } from '../features/scatter3d/model/scale'
import type { CompanyYearRow, ProjectedPoint } from '../features/scatter3d/model/types'
import { DATASET, getLatestReportDate, REPORT_PERIODS } from './dataset'

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
  private rowsByReportDate: Map<string, CompanyYearRow[]> = new Map()

  constructor() {
    // rows 按 reportDate 懒加载缓存
  }

  private getRows(reportDate: string): CompanyYearRow[] {
    const key = reportDate || getLatestReportDate()
    const cached = this.rowsByReportDate.get(key)
    if (cached) return cached

    const year = Number.parseInt(String(key).slice(0, 4), 10) || new Date().getFullYear()

    const rows: CompanyYearRow[] = DATASET.companies.map((c) => ({
      id: c.marketCode,
      name: c.name ?? c.marketCode,
      year,
      metrics: c.values?.[key] ?? {},
    }))

    this.rowsByReportDate.set(key, rows)
    return rows
  }

  getSnapshot(args: {
    reportDate: string
    xMetricId: MetricId
    yMetricId: MetricId
    zMetricId: MetricId
    range?: number
  }): ScatterDataSnapshot {
    const x = getMetricById(args.xMetricId)
    const y = getMetricById(args.yMetricId)
    const z = getMetricById(args.zMetricId)
    const rows = this.getRows(args.reportDate)
    const { points, domains } = projectRowsToPoints({
      rows,
      xMetric: x,
      yMetric: y,
      zMetric: z,
      range: args.range,
      // 主页面：给 domain 留白，避免点贴边
      domainPadRatio: 0.1,
    })
    return {
      points,
      domains,
      metrics: { x, y, z },
      axisLabels: { x: x.label, y: y.label, z: z.label },
    }
  }

  getCompanySeriesSnapshot(args: {
    companyId: string
    reportDates?: string[]
    xMetricId: MetricId
    yMetricId: MetricId
    zMetricId: MetricId
    range?: number
  }): ScatterDataSnapshot {
    const x = getMetricById(args.xMetricId)
    const y = getMetricById(args.yMetricId)
    const z = getMetricById(args.zMetricId)

    const company = DATASET.companies.find((c) => c.marketCode === args.companyId) ?? null

    const reportDates = (args.reportDates ?? REPORT_PERIODS.map((p) => p.reportDate))
      .filter(Boolean)
      // 统一按时间升序，保证轨迹连线从早到晚
      .slice()
      .sort()

    const rows: CompanyYearRow[] = company
      ? reportDates
          // 只取“确实有数据字典”的报告期；否则点会全部落在 (0,0,0) 干扰解读
          .filter((d) => Boolean(company.values?.[d]))
          .map((d) => {
            const year = Number.parseInt(String(d).slice(0, 4), 10) || new Date().getFullYear()
            return {
              id: `${company.marketCode}|${d}`,
              name: company.name ?? company.marketCode,
              year,
              metrics: company.values?.[d] ?? {},
            }
          })
      : []

    const { points, domains } = projectRowsToPoints({
      rows,
      xMetric: x,
      yMetric: y,
      zMetric: z,
      range: args.range,
      // detail 页：给 domain 留白，避免点贴边
      domainPadRatio: 0.1,
    })
    return {
      points,
      domains,
      metrics: { x, y, z },
      axisLabels: { x: x.label, y: y.label, z: z.label },
    }
  }
}

export const scatterDataManager = new ScatterDataManager()


