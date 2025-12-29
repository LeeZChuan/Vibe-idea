import { create } from 'zustand'
import type { MetricId } from '../model/metrics'

type ScatterState = {
  xMetricId: MetricId
  yMetricId: MetricId
  zMetricId: MetricId
  hoveredCompanyId: string | null
  setXMetricId: (id: MetricId) => void
  setYMetricId: (id: MetricId) => void
  setZMetricId: (id: MetricId) => void
  setHoveredCompanyId: (id: string | null) => void
}

export const useScatterStore = create<ScatterState>((set) => ({
  xMetricId: 'profitRate',
  yMetricId: 'marketCap',
  zMetricId: 'revenue',
  hoveredCompanyId: null,
  setXMetricId: (id) => set({ xMetricId: id }),
  setYMetricId: (id) => set({ yMetricId: id }),
  setZMetricId: (id) => set({ zMetricId: id }),
  setHoveredCompanyId: (id) => set({ hoveredCompanyId: id }),
}))


