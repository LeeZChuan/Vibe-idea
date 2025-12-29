import { useEffect, useMemo, useRef } from 'react'
import { MOCK_COMPANY_ROWS } from '../../../data/mock'
import { getMetricById } from '../model/metrics'
import { toNumberOrZero } from '../model/normalize'
import { useScatterStore } from '../store/scatterStore'
import styles from './companyTable.module.css'

export function CompanyTable() {
  const xMetricId = useScatterStore((s) => s.xMetricId)
  const yMetricId = useScatterStore((s) => s.yMetricId)
  const zMetricId = useScatterStore((s) => s.zMetricId)
  const hoveredCompanyId = useScatterStore((s) => s.hoveredCompanyId)
  const setHoveredCompanyId = useScatterStore((s) => s.setHoveredCompanyId)

  const xMetric = useMemo(() => getMetricById(xMetricId), [xMetricId])
  const yMetric = useMemo(() => getMetricById(yMetricId), [yMetricId])
  const zMetric = useMemo(() => getMetricById(zMetricId), [zMetricId])

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
            {MOCK_COMPANY_ROWS.map((r) => {
              const x = toNumberOrZero(xMetric.get(r))
              const y = toNumberOrZero(yMetric.get(r))
              const z = toNumberOrZero(zMetric.get(r))
              const active = hoveredCompanyId === r.id
              return (
                <tr
                  key={r.id}
                  ref={(el) => {
                    rowRefs.current[r.id] = el
                  }}
                  className={active ? styles.activeRow : undefined}
                  onMouseEnter={() => setHoveredCompanyId(r.id)}
                  onMouseLeave={() => setHoveredCompanyId(null)}
                >
                  <td className={styles.companyCell}>
                    <div className={styles.companyName}>{r.name}</div>
                    <div className={styles.companyYear}>{r.year}</div>
                  </td>
                  <td className={styles.num}>{formatMetric(xMetric.format, x)}</td>
                  <td className={styles.num}>{formatMetric(yMetric.format, y)}</td>
                  <td className={styles.num}>{formatMetric(zMetric.format, z)}</td>
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


