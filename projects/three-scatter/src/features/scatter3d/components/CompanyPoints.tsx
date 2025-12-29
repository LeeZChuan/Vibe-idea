import { Html, Instances, Instance } from '@react-three/drei'
import { Line } from '@react-three/drei'
import type { ProjectedPoint } from '../model/types'
import { useScatterStore } from '../store/scatterStore'
import styles from './companyPoints.module.css'
import { getMetricById } from '../model/metrics'
import { THEME } from '../../../theme/theme'

export function CompanyPoints(props: { points: ProjectedPoint[] }) {
  const hoveredCompanyId = useScatterStore((s) => s.hoveredCompanyId)
  const setHoveredCompanyId = useScatterStore((s) => s.setHoveredCompanyId)
  const xMetricId = useScatterStore((s) => s.xMetricId)
  const yMetricId = useScatterStore((s) => s.yMetricId)
  const zMetricId = useScatterStore((s) => s.zMetricId)

  const hoveredPoint = hoveredCompanyId
    ? props.points.find((p) => p.id === hoveredCompanyId) ?? null
    : null

  const xMetric = getMetricById(xMetricId)
  const yMetric = getMetricById(yMetricId)
  const zMetric = getMetricById(zMetricId)

  return (
    <group>
      <Instances limit={props.points.length} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          metalness={0.1}
          roughness={0.25}
          vertexColors
          emissive="#BC6FF1"
          emissiveIntensity={0.22}
        />

        {props.points.map((p) => (
          <Instance
            key={p.id}
            position={p.position}
            color={p.color}
            onPointerOver={() => setHoveredCompanyId(p.id)}
            onPointerMove={() => setHoveredCompanyId(p.id)}
            onPointerOut={() => setHoveredCompanyId(null)}
          />
        ))}
      </Instances>

      {hoveredPoint ? (
        <>
          {/* 到三条轴的“垂线”（投影到 x/y/z 轴，交点分别为 (x,0,0)、(0,y,0)、(0,0,z) ） */}
          <Line
            points={[hoveredPoint.position, [hoveredPoint.position[0], 0, 0]]}
            color={THEME.colors.axisX}
            lineWidth={1}
          />
          <Line
            points={[hoveredPoint.position, [0, hoveredPoint.position[1], 0]]}
            color={THEME.colors.axisY}
            lineWidth={1}
          />
          <Line
            points={[hoveredPoint.position, [0, 0, hoveredPoint.position[2]]]}
            color={THEME.colors.axisZ}
            lineWidth={1}
          />

          {/* 点本体 tooltip + 选中圆环 */}
          <Html position={hoveredPoint.position} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div className={styles.wrap}>
              <div className={styles.ring} />
              <div className={styles.tooltip}>
                <div className={styles.tooltipTitle}>{hoveredPoint.label}</div>
                <div className={styles.tooltipRow}>
                  <span className={styles.k}>{xMetric.label}</span>
                  <span className={styles.v}>{formatMetric(xMetric.format, xMetric.unit, hoveredPoint.raw.x)}</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span className={styles.k}>{yMetric.label}</span>
                  <span className={styles.v}>{formatMetric(yMetric.format, yMetric.unit, hoveredPoint.raw.y)}</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span className={styles.k}>{zMetric.label}</span>
                  <span className={styles.v}>{formatMetric(zMetric.format, zMetric.unit, hoveredPoint.raw.z)}</span>
                </div>
              </div>
            </div>
          </Html>

          {/* 三个轴交点的数据标签（带单位） */}
          <Html
            position={[hoveredPoint.position[0], 0, 0]}
            center
            distanceFactor={16}
            style={{ pointerEvents: 'none' }}
          >
            <div className={styles.axisValue} style={{ borderColor: THEME.colors.axisX, color: THEME.colors.axisX }}>
              {formatMetric(xMetric.format, xMetric.unit, hoveredPoint.raw.x)}
            </div>
          </Html>
          <Html
            position={[0, hoveredPoint.position[1], 0]}
            center
            distanceFactor={16}
            style={{ pointerEvents: 'none' }}
          >
            <div className={styles.axisValue} style={{ borderColor: THEME.colors.axisY, color: THEME.colors.axisY }}>
              {formatMetric(yMetric.format, yMetric.unit, hoveredPoint.raw.y)}
            </div>
          </Html>
          <Html
            position={[0, 0, hoveredPoint.position[2]]}
            center
            distanceFactor={16}
            style={{ pointerEvents: 'none' }}
          >
            <div className={styles.axisValue} style={{ borderColor: THEME.colors.axisZ, color: THEME.colors.axisZ }}>
              {formatMetric(zMetric.format, zMetric.unit, hoveredPoint.raw.z)}
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


