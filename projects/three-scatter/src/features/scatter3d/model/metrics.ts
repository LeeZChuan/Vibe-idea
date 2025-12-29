import type { CompanyYearRow } from './types'

export type MetricId = 'profitRate' | 'marketCap' | 'revenue'

export type MetricDef = {
  id: MetricId
  label: string
  unit?: string
  get: (row: CompanyYearRow) => number | null
  format?: (n: number) => string
}

export const METRICS: MetricDef[] = [
  {
    id: 'profitRate',
    label: '盈利率',
    unit: '%',
    get: (r) => r.profitRate,
    format: (n) => `${(n * 100).toFixed(2)}%`,
  },
  {
    id: 'marketCap',
    label: '公司市值',
    unit: 'B',
    get: (r) => r.marketCap,
    format: (n) => `${n.toFixed(2)}B`,
  },
  {
    id: 'revenue',
    label: '营业总收入',
    unit: 'B',
    get: (r) => r.revenue,
    format: (n) => `${n.toFixed(2)}B`,
  },
]

export function getMetricById(id: MetricId): MetricDef {
  const found = METRICS.find((m) => m.id === id)
  if (!found) {
    // 理论上不会发生：id 来自受控下拉框
    return METRICS[0]
  }
  return found
}


