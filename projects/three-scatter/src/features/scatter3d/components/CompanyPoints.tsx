import { Html, Instances, Instance } from '@react-three/drei'
import { Line } from '@react-three/drei'
import type { ProjectedPoint } from '../model/types'
import styles from './companyPoints.module.css'
import type { MetricDef } from '../model/metrics'
import { THEME } from '../../../theme/theme'

export function CompanyPoints(props: {
  points: ProjectedPoint[]
  metrics: { x: MetricDef; y: MetricDef; z: MetricDef }
  hoveredPointId: string | null
  selectedPointId: string | null
  onHoveredPointIdChange: (id: string | null) => void
  onSelectedPointIdChange: (id: string | null) => void
  getPointSubtitle?: (p: ProjectedPoint) => string | null
}) {
  const hoveredPointId = props.hoveredPointId
  const selectedPointId = props.selectedPointId

  const hoveredPoint = hoveredPointId ? props.points.find((p) => p.id === hoveredPointId) ?? null : null
  const selectedPoint = selectedPointId ? props.points.find((p) => p.id === selectedPointId) ?? null : null
  const activePoint = hoveredPoint ?? selectedPoint

  const xMetric = props.metrics.x
  const yMetric = props.metrics.y
  const zMetric = props.metrics.z

  return (
    <group>
      <Instances limit={props.points.length} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          metalness={0.1}
          roughness={0.25}
          vertexColors
          emissive={THEME.colors.pointZero}
          emissiveIntensity={0.22}
          transparent
          opacity={hoveredPointId ? 0.2 : 1}
        />

        {props.points.map((p) => (
          <Instance
            key={p.id}
            position={p.position}
            color={p.color}
            onPointerOver={() => props.onHoveredPointIdChange(p.id)}
            onPointerMove={() => props.onHoveredPointIdChange(p.id)}
            onPointerOut={() => props.onHoveredPointIdChange(null)}
            onClick={(e) => {
              e.stopPropagation()
              props.onSelectedPointIdChange(selectedPointId === p.id ? null : p.id)
            }}
          />
        ))}
      </Instances>

      {/* click 选中：常驻高亮（橘黄色） */}
      {selectedPoint ? (
        <mesh position={selectedPoint.position}>
          <sphereGeometry args={[0.28, 20, 20]} />
          <meshStandardMaterial
            color={THEME.colors.clickedPoint}
            emissive={THEME.colors.clickedPoint}
            emissiveIntensity={0.95}
            transparent
            opacity={0.95}
            roughness={0.15}
            metalness={0.0}
          />
        </mesh>
      ) : null}

      {activePoint ? (
        <>
          {/* hover 高亮球体：叠加亮黄（优先级高于 click） */}
          {hoveredPoint ? (
            <mesh position={hoveredPoint.position}>
              <sphereGeometry args={[0.26, 20, 20]} />
              <meshStandardMaterial
                color={THEME.colors.hoverPoint}
                emissive={THEME.colors.hoverPoint}
                emissiveIntensity={0.9}
                transparent
                opacity={0.92}
                roughness={0.15}
                metalness={0.0}
              />
            </mesh>
          ) : null}

          {/* 到三条轴的“垂线”（投影到 x/y/z 轴，交点分别为 (x,0,0)、(0,y,0)、(0,0,z) ） */}
          <Line
            points={[activePoint.position, [activePoint.position[0], 0, 0]]}
            color={THEME.colors.axisX}
            lineWidth={1}
          />
          <Line
            points={[activePoint.position, [0, activePoint.position[1], 0]]}
            color={THEME.colors.axisY}
            lineWidth={1}
          />
          <Line
            points={[activePoint.position, [0, 0, activePoint.position[2]]]}
            color={THEME.colors.axisZ}
            lineWidth={1}
          />

          {/* 点本体 tooltip + 选中圆环 */}
          <Html position={activePoint.position} center distanceFactor={10} zIndexRange={[0, 20]} style={{ pointerEvents: 'none' }}>
            <div className={styles.wrap}>
              <div className={styles.ring} />
              <div className={styles.tooltip}>
                <div className={styles.tooltipTitle}>{activePoint.label}</div>
                {props.getPointSubtitle ? (
                  (() => {
                    const sub = props.getPointSubtitle?.(activePoint) ?? null
                    return sub ? <div className={styles.tooltipSub}>{sub}</div> : null
                  })()
                ) : null}
                <div className={styles.tooltipRow}>
                  <span className={styles.k}>{xMetric.label}</span>
                  <span className={styles.v}>{formatMetric(xMetric.format, xMetric.unit, activePoint.raw.x)}</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span className={styles.k}>{yMetric.label}</span>
                  <span className={styles.v}>{formatMetric(yMetric.format, yMetric.unit, activePoint.raw.y)}</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span className={styles.k}>{zMetric.label}</span>
                  <span className={styles.v}>{formatMetric(zMetric.format, zMetric.unit, activePoint.raw.z)}</span>
                </div>
              </div>
            </div>
          </Html>

          {/* 三个轴交点的数据标签（带单位） */}
          <Html
            position={[activePoint.position[0], 0, 0]}
            center
            distanceFactor={16}
            zIndexRange={[0, 20]}
            style={{ pointerEvents: 'none' }}
          >
            <div className={styles.axisValue} style={{ borderColor: THEME.colors.axisX, color: THEME.colors.axisX }}>
              {formatMetric(xMetric.format, xMetric.unit, activePoint.raw.x)}
            </div>
          </Html>
          <Html
            position={[0, activePoint.position[1], 0]}
            center
            distanceFactor={16}
            zIndexRange={[0, 20]}
            style={{ pointerEvents: 'none' }}
          >
            <div className={styles.axisValue} style={{ borderColor: THEME.colors.axisY, color: THEME.colors.axisY }}>
              {formatMetric(yMetric.format, yMetric.unit, activePoint.raw.y)}
            </div>
          </Html>
          <Html
            position={[0, 0, activePoint.position[2]]}
            center
            distanceFactor={16}
            zIndexRange={[0, 20]}
            style={{ pointerEvents: 'none' }}
          >
            <div className={styles.axisValue} style={{ borderColor: THEME.colors.axisZ, color: THEME.colors.axisZ }}>
              {formatMetric(zMetric.format, zMetric.unit, activePoint.raw.z)}
            </div>
          </Html>
        </>
      ) : null}
    </group>
  )
}

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '0'
  const abs = Math.abs(n)
  if (abs >= 1000) return n.toFixed(0)
  if (abs >= 100) return n.toFixed(1)
  if (abs >= 10) return n.toFixed(2)
  return n.toFixed(3)
}

function formatMetric(
  format: ((n: number) => string) | undefined,
  unit: string | undefined,
  value: number,
): string {
  if (format) return format(value)
  const n = formatNumber(value)
  return unit ? `${n}${unit}` : n
}


