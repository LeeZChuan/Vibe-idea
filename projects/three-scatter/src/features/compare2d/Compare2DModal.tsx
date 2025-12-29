import { createPortal } from 'react-dom'
import { useEffect, useMemo, useState } from 'react'
import styles from './compare2dModal.module.css'
import { Compare2DView, type ComparePlane } from './Compare2DView'

export function Compare2DModal(props: { open: boolean; onClose: () => void }) {
  const [activePlane, setActivePlane] = useState<ComparePlane>('XY')

  const sidePlanes = useMemo(() => {
    const all: ComparePlane[] = ['XY', 'XZ', 'YZ']
    return all.filter((p) => p !== activePlane)
  }, [activePlane])

  useEffect(() => {
    if (!props.open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [props.open, props.onClose])

  if (!props.open) return null

  return createPortal(
    <div className={styles.backdrop} onMouseDown={props.onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>2D 对比（XY / XZ / YZ）</div>
          <button className={styles.close} onClick={props.onClose} aria-label="close">
            ×
          </button>
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            <Compare2DView plane={activePlane} variant="main" />
          </div>

          <div className={styles.side}>
            {sidePlanes.map((p) => (
              <button key={p} className={styles.thumbBtn} onClick={() => setActivePlane(p)} type="button">
                <Compare2DView plane={p} variant="thumb" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}


