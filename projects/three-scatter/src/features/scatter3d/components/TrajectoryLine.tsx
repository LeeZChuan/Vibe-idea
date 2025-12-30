import * as React from 'react'
import { Line } from '@react-three/drei'
import type { ProjectedPoint } from '../model/types'
import { THEME } from '../../../theme/theme'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export function TrajectoryLine(props: {
  points: ProjectedPoint[]
  color?: string
  lineWidth?: number
  dashed?: boolean
  baseOpacity?: number
  glowDurationSec?: number
  showArrows?: boolean
  arrowEvery?: number
  arrowSize?: number
  targetPointRadius?: number
  showEndpoints?: boolean
  startPointRadius?: number
  endPointRadius?: number
}) {
  const pts = props.points
  if (pts.length < 2) return null

  const color = props.color ?? THEME.colors.trajectory
  const lineWidth = props.lineWidth ?? 1
  const baseOpacity = props.baseOpacity ?? THEME.trajectory.baseOpacity

  const arrowEvery = Math.max(1, props.arrowEvery ?? 3)
  const arrowSize = props.arrowSize ?? 0.6
  const targetPointRadius = props.targetPointRadius ?? 0.18

  const startPointRadius = props.startPointRadius ?? 0.24
  const endPointRadius = props.endPointRadius ?? 0.32

  const showArrows = props.showArrows ?? true
  const showEndpoints = props.showEndpoints ?? true

  const positions = React.useMemo(() => pts.map((p) => p.position), [pts])
  const totalLength = React.useMemo(() => {
    let sum = 0
    for (let i = 0; i < positions.length - 1; i++) {
      const a = positions[i]
      const b = positions[i + 1]
      const dx = b[0] - a[0]
      const dy = b[1] - a[1]
      const dz = b[2] - a[2]
      sum += Math.sqrt(dx * dx + dy * dy + dz * dz)
    }
    return sum
  }, [positions])

  // dashed 高亮：让“只有一段亮线在跑”
  const glowDashSize = Math.max(0.001, totalLength * THEME.trajectory.glowDashFraction)
  const glowGapSize = Math.max(0.001, totalLength * THEME.trajectory.glowGapFraction)
  const glowDurationSec = props.glowDurationSec ?? THEME.trajectory.glowDurationSec

  const glowRef = React.useRef<THREE.Object3D | null>(null)
  useFrame((state) => {
    const obj = glowRef.current as unknown as { material?: { dashOffset?: number } } | null
    const mat = obj?.material
    if (!mat) return
    const t = (state.clock.getElapsedTime() % glowDurationSec) / glowDurationSec
    // 让亮段中心从 0 -> totalLength 运动
    mat.dashOffset = glowDashSize * 0.5 - t * totalLength
  })

  return (
    <group>
      {/* 底层轨迹：纯色、固定透明度（不做渐变） */}
      <Line points={positions} color={color} lineWidth={lineWidth} transparent opacity={baseOpacity} />

      {/* 高亮沿线运动：10s 从起点到终点 */}
      <Line
        ref={glowRef as never}
        points={positions}
        color={color}
        lineWidth={Math.max(1, lineWidth + 0.6)}
        dashed
        dashScale={1}
        dashSize={glowDashSize}
        gapSize={glowGapSize}
        transparent
        opacity={THEME.trajectory.glowOpacity}
      />

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
            // 箭头不要指到“点的圆心”，而是指到“点表面”
            // coneGeometry 默认以中心为原点，尖端在 +Y 方向的 +height/2 处
            const height = arrowSize * 0.6
            const back = targetPointRadius + height * 0.5
            const pos = new THREE.Vector3(p1.position[0], p1.position[1], p1.position[2]).addScaledVector(dir, -back)
            return (
              <mesh key={`arrow-${p0.id}-${p1.id}`} position={[pos.x, pos.y, pos.z]} quaternion={quat}>
                <coneGeometry args={[arrowSize * 0.22, height, 14]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.22} transparent opacity={0.9} />
              </mesh>
            )
          })
        : null}

      {/* 起点/终点：大小与颜色差异 */}
      {showEndpoints ? (
        <>
          <mesh position={pts[0].position}>
            <sphereGeometry args={[startPointRadius, 18, 18]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} transparent opacity={0.2} />
          </mesh>
          <mesh position={pts[pts.length - 1].position}>
            <sphereGeometry args={[endPointRadius, 20, 20]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} transparent opacity={1.0} />
          </mesh>
        </>
      ) : null}
    </group>
  )
}

function quatFromYToDir(dir: THREE.Vector3): THREE.Quaternion {
  const q = new THREE.Quaternion()
  const from = new THREE.Vector3(0, 1, 0)
  q.setFromUnitVectors(from, dir)
  return q
}



