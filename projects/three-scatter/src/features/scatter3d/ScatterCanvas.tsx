import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import { scatterDataManager } from '../../data/dataManager'
import type { ScatterDataSnapshot } from '../../data/dataManager'
import { ScatterScene } from './ScatterScene'
import { useScatterStore } from './store/scatterStore'

export function ScatterCanvas(props: {
  snapshot: ScatterDataSnapshot
  axisSize?: number
  hoveredPointId?: string | null
  selectedPointId?: string | null
  onHoveredPointIdChange?: (id: string | null) => void
  onSelectedPointIdChange?: (id: string | null) => void
  getPointSubtitle?: (p: ScatterDataSnapshot['points'][number]) => string | null
  onPointerMissed?: () => void
  children?: React.ReactNode
}) {
  const axisSize = props.axisSize ?? 10
  const snapshot = props.snapshot

  return (
    <Canvas
      camera={{ position: [14, 12, 14], fov: 45, near: 0.1, far: 200 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      onPointerMissed={props.onPointerMissed}
    >
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 18, 60]} />
      <ScatterScene
        points={snapshot.points}
        axisSize={axisSize}
        axisLabels={snapshot.axisLabels}
        domains={snapshot.domains}
        metrics={snapshot.metrics}
        hoveredPointId={props.hoveredPointId}
        selectedPointId={props.selectedPointId}
        onHoveredPointIdChange={props.onHoveredPointIdChange}
        onSelectedPointIdChange={props.onSelectedPointIdChange}
        getPointSubtitle={props.getPointSubtitle}
      />
      {props.children}
    </Canvas>
  )
}

export function ScatterCanvasWithStore() {
  const reportDate = useScatterStore((s) => s.reportDate)
  const xMetricId = useScatterStore((s) => s.xMetricId)
  const yMetricId = useScatterStore((s) => s.yMetricId)
  const zMetricId = useScatterStore((s) => s.zMetricId)
  const hoveredCompanyId = useScatterStore((s) => s.hoveredCompanyId)
  const setHoveredCompanyId = useScatterStore((s) => s.setHoveredCompanyId)
  const selectedCompanyId = useScatterStore((s) => s.selectedCompanyId)
  const setSelectedCompanyId = useScatterStore((s) => s.setSelectedCompanyId)

  const snapshot = useMemo(() => {
    return scatterDataManager.getSnapshot({ reportDate, xMetricId, yMetricId, zMetricId, range: 10 })
  }, [reportDate, xMetricId, yMetricId, zMetricId])

  return (
    <ScatterCanvas
      snapshot={snapshot}
      axisSize={10}
      hoveredPointId={hoveredCompanyId}
      selectedPointId={selectedCompanyId}
      onHoveredPointIdChange={setHoveredCompanyId}
      onSelectedPointIdChange={setSelectedCompanyId}
      onPointerMissed={() => setSelectedCompanyId(null)}
    />
  )
}


