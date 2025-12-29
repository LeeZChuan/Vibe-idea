import { MetricSelect } from '../../features/scatter3d/components/MetricSelect'
import { useScatterStore } from '../../features/scatter3d/store/scatterStore'
import { METRICS } from '../../features/scatter3d/model/metrics'
import { CompanyTable } from '../../features/scatter3d/components/CompanyTable'
import styles from './rightPanel.module.css'

export function RightPanel() {
  const xMetricId = useScatterStore((s) => s.xMetricId)
  const yMetricId = useScatterStore((s) => s.yMetricId)
  const zMetricId = useScatterStore((s) => s.zMetricId)
  const setX = useScatterStore((s) => s.setXMetricId)
  const setY = useScatterStore((s) => s.setYMetricId)
  const setZ = useScatterStore((s) => s.setZMetricId)

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.title}>3D 散点图</div>
        <div className={styles.subtitle}>可切换 X / Y / Z 指标（null 视为 0，支持正负值）</div>
      </header>

      <section className={styles.section}>
        <MetricSelect label="X 轴" value={xMetricId} options={METRICS} onChange={setX} />
        <MetricSelect label="Y 轴" value={yMetricId} options={METRICS} onChange={setY} />
        <MetricSelect label="Z 轴" value={zMetricId} options={METRICS} onChange={setZ} />
      </section>

      <CompanyTable />
    </div>
  )
}


