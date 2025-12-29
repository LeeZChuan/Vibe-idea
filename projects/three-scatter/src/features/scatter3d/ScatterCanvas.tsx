import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import { scatterDataManager } from '../../data/dataManager'
import { ScatterScene } from './ScatterScene'
import { useScatterStore } from './store/scatterStore'

export function ScatterCanvas() {
  const xMetricId = useScatterStore((s) => s.xMetricId)
  const yMetricId = useScatterStore((s) => s.yMetricId)
  const zMetricId = useScatterStore((s) => s.zMetricId)

  const snapshot = useMemo(() => {
    return scatterDataManager.getSnapshot({ xMetricId, yMetricId, zMetricId, range: 10 })
  }, [xMetricId, yMetricId, zMetricId])

  return (
    <Canvas
      camera={{ position: [14, 12, 14], fov: 45, near: 0.1, far: 200 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 18, 60]} />
      <ScatterScene
        points={snapshot.points}
        axisSize={10}
        axisLabels={snapshot.axisLabels}
        domains={snapshot.domains}
        metrics={snapshot.metrics}
      />
    </Canvas>
  )
}


