import type { CompanyYearRow } from './types'
import { DATASET, METRIC_ORDER } from '../../../data/dataset'

export type MetricId = string

export type MetricDef = {
  id: MetricId
  label: string
  unit?: string
  get: (row: CompanyYearRow) => number | null
  format?: (n: number) => string
}

function inferUnit(label: string): string | undefined {
  // 优先从中文全角括号里拿单位：例如 “毛利润率（%）” -> "%"
  const m = label.match(/（([^）]+)）/)
  if (m?.[1]) return m[1]
  if (label.includes('%')) return '%'
  return undefined
}

export const METRICS: MetricDef[] = METRIC_ORDER.map((id) => {
  const meta = DATASET.metrics[id]
  const label = meta?.label ?? id
  const unit = inferUnit(label)
  return {
    id,
    label,
    unit,
    get: (row) => row.metrics?.[id] ?? null,
  }
})

export function getMetricById(id: MetricId): MetricDef {
  const found = METRICS.find((m) => m.id === id)
  if (!found) {
    // 理论上不会发生：id 来自受控下拉框
    return METRICS[0]
  }
  return found
}


