import { Canvas, useThree } from '@react-three/fiber'
import { OrthographicCamera, OrbitControls } from '@react-three/drei'
import { useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import { useScatterStore } from '../scatter3d/store/scatterStore'
import { scatterDataManager } from '../../data/dataManager'
import { getMetricById } from '../scatter3d/model/metrics'
import { Compare2DScene } from './Compare2DScene'
import styles from './compare2dView.module.css'
import { THEME } from '../../theme/theme'
import * as THREE from 'three'

export type ComparePlane = 'XY' | 'XZ' | 'YZ'

export function Compare2DView(props: { plane: ComparePlane; variant?: 'main' | 'thumb' }) {
  const reportDate = useScatterStore((s) => s.reportDate)
  const xMetricId = useScatterStore((s) => s.xMetricId)
  const yMetricId = useScatterStore((s) => s.yMetricId)
  const zMetricId = useScatterStore((s) => s.zMetricId)
  const variant = props.variant ?? 'main'
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)

  const snapshot = useMemo(() => {
    return scatterDataManager.getSnapshot({ reportDate, xMetricId, yMetricId, zMetricId, range: 10 })
  }, [reportDate, xMetricId, yMetricId, zMetricId])

  const title = useMemo(() => {
    const x = getMetricById(xMetricId).label
    const y = getMetricById(yMetricId).label
    const z = getMetricById(zMetricId).label
    if (props.plane === 'XY') return `${x} × ${y}`
    if (props.plane === 'XZ') return `${x} × ${z}`
    return `${y} × ${z}`
  }, [props.plane, xMetricId, yMetricId, zMetricId])

  const axes = useMemo(() => {
    const x = getMetricById(xMetricId)
    const y = getMetricById(yMetricId)
    const z = getMetricById(zMetricId)
    if (props.plane === 'XY') return { hLabel: x.label, vLabel: y.label, hColor: THEME.colors.axisX, vColor: THEME.colors.axisY }
    if (props.plane === 'XZ') return { hLabel: x.label, vLabel: z.label, hColor: THEME.colors.axisX, vColor: THEME.colors.axisZ }
    return { hLabel: y.label, vLabel: z.label, hColor: THEME.colors.axisY, vColor: THEME.colors.axisZ }
  }, [props.plane, xMetricId, yMetricId, zMetricId])

  const fit = useMemo(() => {
    // 与 Compare2DScene 内的轴线范围保持一致
    const AXIS_EXTENT = 12
    let maxAbsH = 0
    let maxAbsV = 0
    for (const p of snapshot.points) {
      const [x, y, z] = p.position
      const h =
        props.plane === 'XY' ? x
        : props.plane === 'XZ' ? x
        : y
      const v =
        props.plane === 'XY' ? y
        : props.plane === 'XZ' ? z
        : z
      const ah = Math.abs(h)
      const av = Math.abs(v)
      if (ah > maxAbsH) maxAbsH = ah
      if (av > maxAbsV) maxAbsV = av
    }
    const extent = Math.max(AXIS_EXTENT, maxAbsH, maxAbsV) * 1.15 // 留边
    return { extent }
  }, [snapshot.points, props.plane])

  return (
    <div className={`${styles.card} ${variant === 'thumb' ? styles.thumb : styles.main}`}>
      <div className={styles.cardTitle}>
        <span className={styles.badge}>{props.plane}</span>
        <span className={styles.titleText}>{title}</span>
      </div>
      <div className={styles.canvasWrap}>
        <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
          <color attach="background" args={['#000000']} />
          <OrthographicCamera
            ref={cameraRef}
            makeDefault
            position={[0, 0, 24]}
            near={0.1}
            far={200}
          />
          <ambientLight intensity={0.55} />
          <Compare2DScene plane={props.plane} points={snapshot.points} axes={axes} />
          <OrbitControls
            makeDefault
            enableRotate={false}
            enablePan={variant === 'main'}
            enableZoom={variant === 'main'}
            zoomSpeed={0.8}
            panSpeed={0.8}
          />
          <FitCamera extent={fit.extent} cameraRef={cameraRef} />
        </Canvas>
      </div>
    </div>
  )
}

function FitCamera(props: { extent: number; cameraRef: RefObject<THREE.OrthographicCamera | null> }) {
  const size = useThree((s) => s.size)

  // 用 Canvas 像素尺寸设置 frustum，这样 zoom 就可以用 “像素/世界单位” 直观计算
  // 并确保默认一打开能完整看到：点 + 坐标轴 + 轴箭头/标识
  useLayoutEffect(() => {
    const cam = props.cameraRef.current
    if (!cam) return

    cam.left = -size.width / 2
    cam.right = size.width / 2
    cam.top = size.height / 2
    cam.bottom = -size.height / 2

    const extent = Math.max(1e-6, props.extent)
    const zoomX = size.width / (2 * extent)
    const zoomY = size.height / (2 * extent)
    cam.zoom = Math.min(zoomX, zoomY)
    cam.position.set(0, 0, 24)
    cam.updateProjectionMatrix()
  }, [props.cameraRef, props.extent, size.height, size.width])

  return null
}


