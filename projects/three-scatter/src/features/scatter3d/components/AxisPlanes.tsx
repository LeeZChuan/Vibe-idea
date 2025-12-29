import * as THREE from 'three'
import { THEME } from '../../../theme/theme'

/**
 * 三个轴平面：XY / XZ / YZ
 * - 用于帮助用户理解正负值与空间方位
 * - 颜色从 theme 读取，方便统一配置
 */
export function AxisPlanes(props: { size?: number; opacity?: number }) {
  const size = props.size ?? 20
  const opacity = props.opacity ?? 0.06
  const color = THEME.colors.axisPlane

  return (
    <group>
      {/* XY plane (z=0) */}
      <mesh renderOrder={-10}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      {/* XZ plane (y=0) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={-10}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      {/* YZ plane (x=0) */}
      <mesh rotation={[0, Math.PI / 2, 0]} renderOrder={-10}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>
    </group>
  )
}


