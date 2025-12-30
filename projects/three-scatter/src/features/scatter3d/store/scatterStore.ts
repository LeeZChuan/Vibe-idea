import { create } from 'zustand'
import type { MetricId } from '../model/metrics'
import { getLatestReportDate, METRIC_ORDER } from '../../../data/dataset'

type ScatterState = {
  reportDate: string
  xMetricId: MetricId
  yMetricId: MetricId
  zMetricId: MetricId
  hoveredCompanyId: string | null
  selectedCompanyId: string | null
  setReportDate: (reportDate: string) => void
  setXMetricId: (id: MetricId) => void
  setYMetricId: (id: MetricId) => void
  setZMetricId: (id: MetricId) => void
  setHoveredCompanyId: (id: string | null) => void
  setSelectedCompanyId: (id: string | null) => void
}

export const useScatterStore = create<ScatterState>((set) => ({
  reportDate: getLatestReportDate(),
  xMetricId: METRIC_ORDER[0] ?? '',
  yMetricId: METRIC_ORDER[1] ?? METRIC_ORDER[0] ?? '',
  zMetricId: METRIC_ORDER[2] ?? METRIC_ORDER[0] ?? '',
  hoveredCompanyId: null,
  selectedCompanyId: null,
  setReportDate: (reportDate) => set({ reportDate }),
  setXMetricId: (id) => set({ xMetricId: id }),
  setYMetricId: (id) => set({ yMetricId: id }),
  setZMetricId: (id) => set({ zMetricId: id }),
  setHoveredCompanyId: (id) => set({ hoveredCompanyId: id }),
  setSelectedCompanyId: (id) => set({ selectedCompanyId: id }),
}))


