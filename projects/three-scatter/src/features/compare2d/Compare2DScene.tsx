import type { ProjectedPoint } from '../scatter3d/model/types'
import { Instances, Instance, Line, Text } from '@react-three/drei'
import { useMemo } from 'react'
import { useScatterStore } from '../scatter3d/store/scatterStore'
import * as THREE from 'three'
import { THEME } from '../../theme/theme'

export function Compare2DScene(props: {
  plane: 'XY' | 'XZ' | 'YZ'
  points: ProjectedPoint[]
  axes: { hLabel: string; vLabel: string; hColor: string; vColor: string }
}) {
  const hoveredCompanyId = useScatterStore((s) => s.hoveredCompanyId)
  const setHoveredCompanyId = useScatterStore((s) => s.setHoveredCompanyId)

  const projected = useMemo(() => {
    return props.points.map((p) => ({
      ...p,
      position2d: projectToPlane(p.position, props.plane),
    }))
  }, [props.points, props.plane])

  const hoveredPoint = hoveredCompanyId ? projected.find((p) => p.id === hoveredCompanyId) ?? null : null

  return (
    <group>
      <Grid2D />

      <Instances limit={projected.length}>
        <sphereGeometry args={[0.16, 14, 14]} />
        <meshStandardMaterial
          metalness={0.05}
          roughness={0.25}
          vertexColors
          emissive={THEME.colors.pointPos}
          emissiveIntensity={0.12}
        />
        {projected.map((p) => (
          <Instance
            key={p.id}
            position={p.position2d}
            color={p.color}
            onPointerOver={() => setHoveredCompanyId(p.id)}
            onPointerMove={() => setHoveredCompanyId(p.id)}
            onPointerOut={() => setHoveredCompanyId(null)}
          />
        ))}
      </Instances>

      {hoveredPoint ? (
        <mesh position={hoveredPoint.position2d}>
          <sphereGeometry args={[0.22, 18, 18]} />
          <meshStandardMaterial
            color={THEME.colors.hoverPoint}
            emissive={THEME.colors.hoverPoint}
            emissiveIntensity={0.85}
            transparent
            opacity={0.95}
          />
        </mesh>
      ) : null}

      {/* 2D 坐标轴（水平/垂直） + 正方向箭头（表示大值方向） */}
      <Line points={[[-12, 0, 0], [12, 0, 0]]} color={props.axes.hColor} lineWidth={1} />
      <Line points={[[0, -12, 0], [0, 12, 0]]} color={props.axes.vColor} lineWidth={1} />

      <mesh position={[12, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.28, 0.7, 14]} />
        <meshStandardMaterial color={props.axes.hColor} emissive={props.axes.hColor} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 12, 0]}>
        <coneGeometry args={[0.28, 0.7, 14]} />
        <meshStandardMaterial color={props.axes.vColor} emissive={props.axes.vColor} emissiveIntensity={0.25} />
      </mesh>

      {/* 轴标识：用 3D Text，随正交相机缩放自然一起缩放 */}
      <Text
        position={[10.8, -0.9, 0]}
        fontSize={0.6}
        color={props.axes.hColor}
        anchorX="right"
        anchorY="middle"
      >
        {props.axes.hLabel}
      </Text>
      <Text
        position={[0.9, 10.8, 0]}
        fontSize={0.6}
        color={props.axes.vColor}
        anchorX="left"
        anchorY="top"
      >
        {props.axes.vLabel}
      </Text>
    </group>
  )
}

function projectToPlane(pos: readonly [number, number, number], plane: 'XY' | 'XZ' | 'YZ'): [number, number, number] {
  if (plane === 'XY') return [pos[0], pos[1], 0]
  if (plane === 'XZ') return [pos[0], pos[2], 0]
  return [pos[1], pos[2], 0]
}

function Grid2D() {
  const lines = useMemo(() => {
    const pts: React.ReactNode[] = []
    const c = new THREE.Color(THEME.colors.axisPlane)
    const color = `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},0.08)`
    for (let i = -10; i <= 10; i += 2) {
      pts.push(<Line key={`gx-${i}`} points={[[-12, i, 0], [12, i, 0]]} color={color} lineWidth={1} />)
      pts.push(<Line key={`gy-${i}`} points={[[i, -12, 0], [i, 12, 0]]} color={color} lineWidth={1} />)
    }
    return pts
  }, [])
  return <group>{lines}</group>
}


