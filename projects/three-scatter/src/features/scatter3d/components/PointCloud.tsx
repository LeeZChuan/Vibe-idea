import { useMemo } from 'react'
import * as THREE from 'three'
import type { ProjectedPoint } from '../model/types'

export function PointCloud(props: { points: ProjectedPoint[]; radius?: number }) {
  const radius = props.radius ?? 0.18

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(props.points.length * 3)
    const colors = new Float32Array(props.points.length * 3)
    props.points.forEach((p, i) => {
      positions[i * 3 + 0] = p.position[0]
      positions[i * 3 + 1] = p.position[1]
      positions[i * 3 + 2] = p.position[2]
      colors[i * 3 + 0] = p.color[0]
      colors[i * 3 + 1] = p.color[1]
      colors[i * 3 + 2] = p.color[2]
    })
    return { positions, colors }
  }, [props.points])

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return g
  }, [positions, colors])

  return (
    <points geometry={geom}>
      <pointsMaterial size={radius} vertexColors sizeAttenuation transparent opacity={0.92} />
    </points>
  )
}


