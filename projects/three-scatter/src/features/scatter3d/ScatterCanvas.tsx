import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import { MOCK_COMPANY_ROWS } from '../../data/mock'
import { getMetricById } from './model/metrics'
import { projectRowsToPoints } from './model/scale'
import { ScatterScene } from './ScatterScene'
import { useScatterStore } from './store/scatterStore'

export function ScatterCanvas() {
  const xMetricId = useScatterStore((s) => s.xMetricId)
  const yMetricId = useScatterStore((s) => s.yMetricId)
  const zMetricId = useScatterStore((s) => s.zMetricId)

  const { points, axisLabels, domains, metrics } = useMemo(() => {
    const xMetric = getMetricById(xMetricId)
    const yMetric = getMetricById(yMetricId)
    const zMetric = getMetricById(zMetricId)
    const { points, domains } = projectRowsToPoints({
      rows: MOCK_COMPANY_ROWS,
      xMetric,
      yMetric,
      zMetric,
      range: 10,
    })
    return {
      points,
      axisLabels: { x: xMetric.label, y: yMetric.label, z: zMetric.label },
      domains,
      metrics: { x: xMetric, y: yMetric, z: zMetric },
    }
  }, [xMetricId, yMetricId, zMetricId])

  return (
    <Canvas
      camera={{ position: [14, 12, 14], fov: 45, near: 0.1, far: 200 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 18, 60]} />
      <ScatterScene points={points} axisSize={10} axisLabels={axisLabels} domains={domains} metrics={metrics} />
    </Canvas>
  )
}


