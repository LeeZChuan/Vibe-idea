import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { MainLayout } from '../layout/MainLayout'
import { METRICS, type MetricId } from '../../features/scatter3d/model/metrics'
import { METRIC_ORDER } from '../../data/dataset'
import { scatterDataManager } from '../../data/dataManager'
import { ScatterCanvas } from '../../features/scatter3d/ScatterCanvas'
import { MetricSelect } from '../../features/scatter3d/components/MetricSelect'
import { TrajectoryLine } from '../../features/scatter3d/components/TrajectoryLine'
import { THEME } from '../../theme/theme'

export function DetailPage() {
  const { companyId } = useParams()

  const [xMetricId, setXMetricId] = React.useState<MetricId>(METRIC_ORDER[0] ?? '')
  const [yMetricId, setYMetricId] = React.useState<MetricId>(METRIC_ORDER[1] ?? METRIC_ORDER[0] ?? '')
  const [zMetricId, setZMetricId] = React.useState<MetricId>(METRIC_ORDER[2] ?? METRIC_ORDER[0] ?? '')

  const [hoveredPointId, setHoveredPointId] = React.useState<string | null>(null)
  const [selectedPointId, setSelectedPointId] = React.useState<string | null>(null)

  const snapshot = React.useMemo(() => {
    return scatterDataManager.getCompanySeriesSnapshot({
      companyId: companyId ?? '',
      xMetricId,
      yMetricId,
      zMetricId,
      range: 10,
    })
  }, [companyId, xMetricId, yMetricId, zMetricId])

  return (
    <MainLayout
      left={
        <div style={{ padding: 12 }}>
          <div style={{ marginBottom: 12 }}>
            <Link to="/" style={{ color: THEME.colors.link }}>
              返回
            </Link>
          </div>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Detail</div>
          <div style={{ opacity: 0.85, marginBottom: 8 }}>公司：{companyId ?? '-'}</div>
          <div style={{ opacity: 0.7, fontSize: 12 }}>点数：{snapshot.points.length}</div>
          <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6 }}>提示：点按时间顺序连线（早→晚）</div>
        </div>
      }
      center={
        <ScatterCanvas
          snapshot={snapshot}
          axisSize={10}
          hoveredPointId={hoveredPointId}
          selectedPointId={selectedPointId}
          onHoveredPointIdChange={setHoveredPointId}
          onSelectedPointIdChange={setSelectedPointId}
          onPointerMissed={() => setSelectedPointId(null)}
          getPointSubtitle={(p) => {
            const parts = p.id.split('|')
            return parts.length >= 2 ? parts[1] : null
          }}
        >
          <TrajectoryLine
            points={snapshot.points}
            dashed={false}
            color={THEME.colors.trajectory}
            baseOpacity={THEME.trajectory.baseOpacity}
            glowDurationSec={THEME.trajectory.glowDurationSec}
            showArrows
            arrowEvery={3}
            targetPointRadius={0.18}
            showEndpoints
          />
        </ScatterCanvas>
      }
      right={
        <div style={{ padding: 12 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>指标</div>
          <div style={{ opacity: 0.7, fontSize: 12, marginBottom: 10 }}>切换 X / Y / Z，会同步更新点位置与轨迹</div>

          <MetricSelect label="X 轴" value={xMetricId} options={METRICS} onChange={setXMetricId} />
          <MetricSelect label="Y 轴" value={yMetricId} options={METRICS} onChange={setYMetricId} />
          <MetricSelect label="Z 轴" value={zMetricId} options={METRICS} onChange={setZMetricId} />
        </div>
      }
    />
  )
}


