import raw from './data.json'

export type ReportPeriod = {
  reportDate: string
  reportType: string
}

export type MetricMeta = {
  label: string
  itemName?: string
  name?: string
  yoy?: boolean
  itemType?: number
  bold?: boolean
  indentation?: number
}

export type CompanyValues = Record<string, Record<string, number | null>>

export type DataCompany = {
  marketCode: string
  market: string | null
  code: string | null
  name: string | null
  board: string | null
  stkId: number | null
  values: CompanyValues
}

export type DataJson = {
  meta: {
    generatedAt: string
    startReportDate: string | null
    endReportDate: string | null
    sources: string[]
    counts: { companies: number; reportPeriods: number; metrics: number }
    warnings: unknown[]
  }
  reportPeriods: ReportPeriod[]
  metricOrder: string[]
  metrics: Record<string, MetricMeta>
  companies: DataCompany[]
}

export const DATASET = raw as unknown as DataJson

export const REPORT_PERIODS = DATASET.reportPeriods
export const METRIC_ORDER = DATASET.metricOrder

export function getLatestReportDate(): string {
  // data.json 已经按 desc 排序；没有就兜底空字符串
  return REPORT_PERIODS[0]?.reportDate ?? ''
}


