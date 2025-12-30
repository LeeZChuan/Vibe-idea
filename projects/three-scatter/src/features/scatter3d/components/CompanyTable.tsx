import { useEffect, useMemo, useRef } from 'react'
import { getMetricById } from '../model/metrics'
import { useScatterStore } from '../store/scatterStore'
import { scatterDataManager } from '../../../data/dataManager'
import styles from './companyTable.module.css'

export function CompanyTable() {
  const reportDate = useScatterStore((s) => s.reportDate)
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
    return scatterDataManager.getSnapshot({ reportDate, xMetricId, yMetricId, zMetricId, range: 10 }).points
  }, [reportDate, xMetricId, yMetricId, zMetricId])

  const tableWrapRef = useRef<HTMLDivElement | null>(null)
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({})

  useEffect(() => {
    const activeId = hoveredCompanyId ?? selectedCompanyId
    if (!activeId) return
    const rowEl = rowRefs.current[activeId]
    const wrapEl = tableWrapRef.current
    if (!rowEl || !wrapEl) return

    // 让高亮行尽量出现在 sticky header 正下方（避免被 header 遮住）
    const th = wrapEl.querySelector('thead th') as HTMLElement | null
    const headerH = th ? Math.ceil(th.getBoundingClientRect().height) : 0
    const pad = 6

    // rowEl.offsetTop 相对于 table；wrapEl 是滚动容器
    const target = Math.max(0, rowEl.offsetTop - headerH - pad)
    wrapEl.scrollTo({ top: target, behavior: 'auto' })
  }, [hoveredCompanyId, selectedCompanyId])

  return (
    <div className={styles.root}>
      <div className={styles.title}>公司列表（当前数据集）</div>
      <div className={styles.tableWrap} ref={tableWrapRef}>
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


