import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useMemo, useState } from 'react'

export function Controls(props: { minDistance: number; maxDistance: number }) {
  const [shiftDown, setShiftDown] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftDown(true)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftDown(false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const mouseButtons = useMemo(() => {
    return {
      LEFT: shiftDown ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    }
  }, [shiftDown])

  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.75}
      zoomSpeed={0.9}
      panSpeed={0.9}
      enablePan
      enableZoom
      minDistance={props.minDistance}
      maxDistance={props.maxDistance}
      mouseButtons={mouseButtons}
    />
  )
}


