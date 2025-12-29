import React from 'react'
import styles from './mainLayout.module.css'

export function MainLayout(props: { left: React.ReactNode; right: React.ReactNode }) {
  const [asideWidth, setAsideWidth] = React.useState(360)
  const [collapsed, setCollapsed] = React.useState(false)
  const draggingRef = React.useRef(false)
  const lastWidthRef = React.useRef(360)

  const onCollapse = React.useCallback(() => {
    lastWidthRef.current = asideWidth
    setCollapsed(true)
  }, [asideWidth])

  const onExpand = React.useCallback(() => {
    setCollapsed(false)
    setAsideWidth(lastWidthRef.current || 360)
  }, [])

  const onResizeStart = React.useCallback((e: React.PointerEvent) => {
    if (collapsed) return
    draggingRef.current = true
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [collapsed])

  const onResizeMove = React.useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return
    const vw = window.innerWidth
    const next = vw - e.clientX
    const clamped = clamp(next, 260, 520)
    setAsideWidth(clamped)
    lastWidthRef.current = clamped
  }, [])

  const onResizeEnd = React.useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }, [])

  return (
    <div
      className={styles.root}
      style={{ ['--asideWidth' as never]: collapsed ? '0px' : `${asideWidth}px` }}
    >
      <main className={styles.left}>
        {props.left}
        {collapsed ? (
          <button className={styles.expandBtn} onClick={onExpand} aria-label="expand panel">
            打开面板
          </button>
        ) : null}
      </main>

      <aside className={`${styles.right} ${collapsed ? styles.rightCollapsed : ''}`}>
        <div className={styles.asideTopBar}>
          <div className={styles.asideTitle}>操作面板</div>
          <button className={styles.collapseBtn} onClick={onCollapse} aria-label="collapse panel">
            收起
          </button>
        </div>

        <div className={styles.asideContent}>{props.right}</div>

        <div
          className={styles.resizeHandle}
          role="separator"
          aria-orientation="vertical"
          aria-label="resize panel"
          onPointerDown={onResizeStart}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeEnd}
          onPointerCancel={onResizeEnd}
        />
      </aside>
    </div>
  )
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}


