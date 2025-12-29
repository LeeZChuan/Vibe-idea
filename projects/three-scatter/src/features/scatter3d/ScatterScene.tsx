import { Axes } from './components/Axes'
import { AxisPlanes } from './components/AxisPlanes'
import { AxisLabels } from './components/AxisLabels'
import { Controls } from './components/Controls'
import { GridPlanes } from './components/GridPlanes'
import { CompanyPoints } from './components/CompanyPoints'
import type { MetricDef } from './model/metrics'
import type { ProjectedPoint } from './model/types'

export function ScatterScene(props: {
  points: ProjectedPoint[]
  axisSize?: number
  axisLabels?: { x: string; y: string; z: string }
  domains?: { x: readonly [number, number]; y: readonly [number, number]; z: readonly [number, number] }
  metrics?: { x: MetricDef; y: MetricDef; z: MetricDef }
}) {
  const axisSize = props.axisSize ?? 10
  const axisLabels = props.axisLabels ?? { x: 'X', y: 'Y', z: 'Z' }
  const domains = props.domains ?? { x: [-1, 1], y: [-1, 1], z: [-1, 1] }
  const metrics = props.metrics ?? {
    x: { id: 'profitRate', label: 'X', unit: '', get: () => 0 },
    y: { id: 'marketCap', label: 'Y', unit: '', get: () => 0 },
    z: { id: 'revenue', label: 'Z', unit: '', get: () => 0 },
  }
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[12, 18, 10]} intensity={0.9} />
      <AxisPlanes size={axisSize * 2} />
      <GridPlanes size={axisSize * 2} />
      <Axes size={axisSize} domains={domains} metrics={metrics} />
      <AxisLabels size={axisSize} xLabel={axisLabels.x} yLabel={axisLabels.y} zLabel={axisLabels.z} />
      <CompanyPoints points={props.points} />
      <Controls minDistance={axisSize * 1.1} maxDistance={axisSize * 4} />
    </>
  )
}


