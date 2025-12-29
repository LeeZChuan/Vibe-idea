import { useEffect, useMemo, useRef } from 'react'
import { getMetricById } from '../model/metrics'
import { useScatterStore } from '../store/scatterStore'
import { scatterDataManager } from '../../../data/dataManager'
import styles from './companyTable.module.css'

export function CompanyTable() {
  const xMetricId = useScatterStore((s) => s.xMetricId)
  const yMetricId = useScatterStore((s) => s.yMetricId)
  const zMetricId = useScatterStore((s) => s.zMetricId)
  const hoveredCompanyId = useScatterStore((s) => s.hoveredCompanyId)
  const setHoveredCompanyId = useScatterStore((s) => s.setHoveredCompanyId)
  const selectedCompanyId = useScatterStore((s) => s.selectedCompanyId)
  const setSelectedCompanyId = useScatterStore((s) => s.setSelectedCompanyId)

  const xMetric = useMemo(() => getMetricById(xMetricId), [xMetricId])
  const yMetric = useMemo(() => getMetricById(yMetricId), [yMetricId])
  const zMetric = useMemo(() => getMetricById(zMetricId), [zMetricId])

  const points = useMemo(() => {
    return scatterDataManager.getSnapshot({ xMetricId, yMetricId, zMetricId, range: 10 }).points
  }, [xMetricId, yMetricId, zMetricId])

  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({})

  useEffect(() => {
    if (!hoveredCompanyId) return
    const el = rowRefs.current[hoveredCompanyId]
    if (!el) return
    el.scrollIntoView({ block: 'nearest' })
  }, [hoveredCompanyId])

  return (
    <div className={styles.root}>
      <div className={styles.title}>公司列表（当前数据集）</div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>公司</th>
              <th>{xMetric.label}</th>
              <th>{yMetric.label}</th>
              <th>{zMetric.label}</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => {
              const active = hoveredCompanyId === p.id
              const selected = selectedCompanyId === p.id
              return (
                <tr
                  key={p.id}
                  ref={(el) => {
                    rowRefs.current[p.id] = el
                  }}
                  className={`${active ? styles.activeRow : ''} ${selected ? styles.selectedRow : ''}`.trim() || undefined}
                  onMouseEnter={() => setHoveredCompanyId(p.id)}
                  onMouseLeave={() => setHoveredCompanyId(null)}
                  onClick={() => setSelectedCompanyId(selectedCompanyId === p.id ? null : p.id)}
                >
                  <td className={styles.companyCell}>
                    <div className={styles.companyName}>{p.label}</div>
                  </td>
                  <td className={styles.num}>{formatMetric(xMetric.format, p.raw.x)}</td>
                  <td className={styles.num}>{formatMetric(yMetric.format, p.raw.y)}</td>
                  <td className={styles.num}>{formatMetric(zMetric.format, p.raw.z)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatMetric(format: ((n: number) => string) | undefined, n: number): string {
  return format ? format(n) : String(n)
}


