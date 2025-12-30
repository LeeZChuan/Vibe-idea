import { Billboard, Line, Text } from '@react-three/drei'
import type { ProjectedPoint } from '../model/types'
import { THEME } from '../../../theme/theme'
import * as THREE from 'three'

export function TrajectoryLine(props: {
  points: ProjectedPoint[]
  color?: string
  lineWidth?: number
  dashed?: boolean
  startOpacity?: number
  endOpacity?: number
  showArrows?: boolean
  arrowEvery?: number
  arrowSize?: number
  showEndpoints?: boolean
  startPointRadius?: number
  endPointRadius?: number
  showLabels?: boolean
  labelFontSize?: number
  labelColor?: string
  getLabel?: (p: ProjectedPoint, index: number) => string | null
}) {
  const pts = props.points
  if (pts.length < 2) return null

  const color = props.color ?? THEME.colors.trajectory
  const lineWidth = props.lineWidth ?? 1
  const startOpacity = props.startOpacity ?? THEME.trajectory.startOpacity
  const endOpacity = props.endOpacity ?? THEME.trajectory.endOpacity
  const dashed = props.dashed ?? false

  const arrowEvery = Math.max(1, props.arrowEvery ?? 3)
  const arrowSize = props.arrowSize ?? 0.6

  const startPointRadius = props.startPointRadius ?? 0.24
  const endPointRadius = props.endPointRadius ?? 0.32

  const showArrows = props.showArrows ?? true
  const showEndpoints = props.showEndpoints ?? true
  const showLabels = props.showLabels ?? true

  const labelFontSize = props.labelFontSize ?? 0.42
  const labelColor = props.labelColor ?? THEME.colors.textSecondary

  return (
    <group>
      {/* 用“分段 Line”实现时间感：同色由浅到深（opacity 从 start->end） */}
      {pts.slice(0, -1).map((p0, i) => {
        const p1 = pts[i + 1]
        const t = pts.length <= 2 ? 0.5 : i / (pts.length - 2)
        const segOpacity = lerp(startOpacity, endOpacity, t)
        return (
          <Line
            key={`seg-${p0.id}-${p1.id}`}
            points={[p0.position, p1.position]}
            color={color}
            lineWidth={lineWidth}
            dashed={dashed}
            dashScale={1}
            dashSize={0.25}
            gapSize={0.2}
            transparent
            opacity={segOpacity}
          />
        )
      })}

      {/* 方向箭头：默认每隔 N 段一个 + 末段一定有一个 */}
      {showArrows
        ? pts.slice(0, -1).map((p0, i) => {
            const isLast = i === pts.length - 2
            const should = isLast || i % arrowEvery === 0
            if (!should) return null
            const p1 = pts[i + 1]
            const dir = new THREE.Vector3(p1.position[0] - p0.position[0], p1.position[1] - p0.position[1], p1.position[2] - p0.position[2])
            if (dir.lengthSq() < 1e-6) return null
            dir.normalize()
            const quat = quatFromYToDir(dir)
            const t = pts.length <= 2 ? 1 : (i + 1) / (pts.length - 1)
            const a = lerp(startOpacity, endOpacity, t)
            return (
              <mesh key={`arrow-${p0.id}-${p1.id}`} position={p1.position} quaternion={quat}>
                <coneGeometry args={[arrowSize * 0.22, arrowSize * 0.6, 14]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.22} transparent opacity={Math.min(1, a + 0.12)} />
              </mesh>
            )
          })
        : null}

      {/* 起点/终点：大小与颜色差异 */}
      {showEndpoints ? (
        <>
          <mesh position={pts[0].position}>
            <sphereGeometry args={[startPointRadius, 18, 18]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} transparent opacity={startOpacity} />
          </mesh>
          <mesh position={pts[pts.length - 1].position}>
            <sphereGeometry args={[endPointRadius, 20, 20]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} transparent opacity={endOpacity} />
          </mesh>
        </>
      ) : null}

      {/* 标签：Billboard 保证面向镜头；默认给每个点一个年份/季度 */}
      {showLabels
        ? pts.map((p, idx) => {
            const label = props.getLabel?.(p, idx) ?? null
            if (!label) return null
            return (
              <Billboard key={`lbl-${p.id}`} follow>
                <Text
                  position={[p.position[0] + 0.28, p.position[1] + 0.24, p.position[2] + 0.28]}
                  fontSize={labelFontSize}
                  color={labelColor}
                  anchorX="left"
                  anchorY="middle"
                  outlineWidth={0.02}
                  outlineColor="rgba(0,0,0,0.6)"
                >
                  {label}
                </Text>
              </Billboard>
            )
          })
        : null}
    </group>
  )
}

function quatFromYToDir(dir: THREE.Vector3): THREE.Quaternion {
  const q = new THREE.Quaternion()
  const from = new THREE.Vector3(0, 1, 0)
  q.setFromUnitVectors(from, dir)
  return q
}

function clamp01(n: number): number {
  if (n < 0) return 0
  if (n > 1) return 1
  return n
}

function lerp(a: number, b: number, t: number): number {
  const tt = clamp01(t)
  return a + (b - a) * tt
}


