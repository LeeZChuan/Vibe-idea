import { Html } from '@react-three/drei'
import { THEME } from '../../../theme/theme'

export function AxisLabels(props: {
  size?: number
  xLabel: string
  yLabel: string
  zLabel: string
}) {
  const size = props.size ?? 10
  const pad = 0.8
  return (
    <group>
      <Html position={[size + pad, 0, 0]} center distanceFactor={12} zIndexRange={[0, 5]} style={{ pointerEvents: 'none' }}>
        <div style={labelStyle(THEME.colors.axisX)}>{props.xLabel}</div>
      </Html>
      <Html position={[0, size + pad, 0]} center distanceFactor={12} zIndexRange={[0, 5]} style={{ pointerEvents: 'none' }}>
        <div style={labelStyle(THEME.colors.axisY)}>{props.yLabel}</div>
      </Html>
      <Html position={[0, 0, size + pad]} center distanceFactor={12} zIndexRange={[0, 5]} style={{ pointerEvents: 'none' }}>
        <div style={labelStyle(THEME.colors.axisZ)}>{props.zLabel}</div>
      </Html>
    </group>
  )
}

function labelStyle(color: string): React.CSSProperties {
  return {
    fontSize: 12,
    fontWeight: 700,
    padding: '4px 8px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(0,0,0,0.35)',
    color,
    whiteSpace: 'nowrap',
    backdropFilter: 'blur(8px)',
  }
}


