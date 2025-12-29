import { Html, Line } from '@react-three/drei'
import type { CSSProperties, ReactNode } from 'react'
import { THEME } from '../../../theme/theme'
import type { MetricDef } from '../model/metrics'

type Domain = readonly [number, number]

export function Axes(props: {
  size?: number
  domains: { x: Domain; y: Domain; z: Domain }
  metrics: { x: MetricDef; y: MetricDef; z: MetricDef }
}) {
  const size = props.size ?? 10
  const tickCount = 9 // 包含两端与 0 的对称刻度（domain 也是对称的）
  const tickLen = 0.35
  const xColor = THEME.colors.axisX
  const yColor = THEME.colors.axisY
  const zColor = THEME.colors.axisZ
  const tickColor = THEME.colors.axisTick

  return (
    <group>
      {/* 主轴线 */}
      <Line points={[[-size, 0, 0], [size, 0, 0]]} color={xColor} lineWidth={1} />
      <Line points={[[0, -size, 0], [0, size, 0]]} color={yColor} lineWidth={1} />
      <Line points={[[0, 0, -size], [0, 0, size]]} color={zColor} lineWidth={1} />

      {/* 正方向箭头（指示正值方向） */}
      <mesh position={[size, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.22, 0.55, 12]} />
        <meshStandardMaterial color={xColor} emissive={xColor} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, size, 0]}>
        <coneGeometry args={[0.22, 0.55, 12]} />
        <meshStandardMaterial color={yColor} emissive={yColor} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 0, size]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.22, 0.55, 12]} />
        <meshStandardMaterial color={zColor} emissive={zColor} emissiveIntensity={0.25} />
      </mesh>

      {/* 刻度线 + 刻度值 */}
      {axisTicks({
        axis: 'x',
        size,
        tickCount,
        tickLen,
        domain: props.domains.x,
        color: tickColor,
        format: props.metrics.x.format,
        unit: props.metrics.x.unit,
      })}
      {axisTicks({
        axis: 'y',
        size,
        tickCount,
        tickLen,
        domain: props.domains.y,
        color: tickColor,
        format: props.metrics.y.format,
        unit: props.metrics.y.unit,
      })}
      {axisTicks({
        axis: 'z',
        size,
        tickCount,
        tickLen,
        domain: props.domains.z,
        color: tickColor,
        format: props.metrics.z.format,
        unit: props.metrics.z.unit,
      })}
    </group>
  )
}

function axisTicks(args: {
  axis: 'x' | 'y' | 'z'
  size: number
  tickCount: number
  tickLen: number
  domain: Domain
  color: string
  format?: (n: number) => string
  unit?: string
}): ReactNode[] {
  const nodes: ReactNode[] = []
  for (let i = 0; i < args.tickCount; i++) {
    const t = args.tickCount === 1 ? 0.5 : i / (args.tickCount - 1)
    const pos = (t * 2 - 1) * args.size
    const value = lerp(args.domain[0], args.domain[1], t)
    const isZero = Math.abs(value) < 1e-12
    const lineW = isZero ? 2 : 1

    if (args.axis === 'x') {
      nodes.push(
        <Line
          key={`tx-${i}`}
          points={[[pos, -args.tickLen, 0], [pos, args.tickLen, 0]]}
          color={args.color}
          lineWidth={lineW}
        />,
      )
      nodes.push(
        <Html
          key={`tlx-${i}`}
          position={[pos, -args.tickLen - 0.55, 0]}
          center
          distanceFactor={16}
          zIndexRange={[0, 20]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={tickStyle(isZero)}>{formatTick(value, args.format, args.unit)}</div>
        </Html>,
      )
    }
    if (args.axis === 'y') {
      nodes.push(
        <Line
          key={`ty-${i}`}
          points={[[-args.tickLen, pos, 0], [args.tickLen, pos, 0]]}
          color={args.color}
          lineWidth={lineW}
        />,
      )
      nodes.push(
        <Html
          key={`tly-${i}`}
          position={[args.tickLen + 0.8, pos, 0]}
          center
          distanceFactor={16}
          zIndexRange={[0, 20]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={tickStyle(isZero)}>{formatTick(value, args.format, args.unit)}</div>
        </Html>,
      )
    }
    if (args.axis === 'z') {
      nodes.push(
        <Line
          key={`tz-${i}`}
          points={[[0, -args.tickLen, pos], [0, args.tickLen, pos]]}
          color={args.color}
          lineWidth={lineW}
        />,
      )
      nodes.push(
        <Html
          key={`tlz-${i}`}
          position={[0, -args.tickLen - 0.55, pos]}
          center
          distanceFactor={16}
          zIndexRange={[0, 20]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={tickStyle(isZero)}>{formatTick(value, args.format, args.unit)}</div>
        </Html>,
      )
    }
  }
  return nodes
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function formatTick(v: number, format?: (n: number) => string, unit?: string): string {
  if (format) return format(v)
  const abs = Math.abs(v)
  const n =
    abs >= 1000 ? v.toFixed(0)
    : abs >= 100 ? v.toFixed(1)
    : abs >= 10 ? v.toFixed(2)
    : abs >= 1 ? v.toFixed(3)
    : v.toFixed(4)
  return unit ? `${n}${unit}` : n
}

function tickStyle(isZero: boolean): CSSProperties {
  return {
    fontSize: 11,
    fontWeight: isZero ? 800 : 650,
    padding: '2px 6px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(0,0,0,0.45)',
    color: isZero ? THEME.colors.axisTick : 'rgba(255,255,255,0.86)',
    whiteSpace: 'nowrap',
    backdropFilter: 'blur(8px)',
  }
}


