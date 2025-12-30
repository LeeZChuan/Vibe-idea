import React from 'react'
import styles from './mainLayout.module.css'

export function MainLayout(props: { left: React.ReactNode; center: React.ReactNode; right: React.ReactNode }) {
  const [leftWidth, setLeftWidth] = React.useState(360)
  const [leftCollapsed, setLeftCollapsed] = React.useState(false)
  const leftDraggingRef = React.useRef(false)
  const leftLastWidthRef = React.useRef(360)

  const [rightWidth, setRightWidth] = React.useState(360)
  const [rightCollapsed, setRightCollapsed] = React.useState(false)
  const rightDraggingRef = React.useRef(false)
  const rightLastWidthRef = React.useRef(360)

  const onLeftCollapse = React.useCallback(() => {
    leftLastWidthRef.current = leftWidth
    setLeftCollapsed(true)
  }, [leftWidth])

  const onLeftExpand = React.useCallback(() => {
    setLeftCollapsed(false)
    setLeftWidth(leftLastWidthRef.current || 360)
  }, [])

  const onLeftResizeStart = React.useCallback(
    (e: React.PointerEvent) => {
      if (leftCollapsed) return
      leftDraggingRef.current = true
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    [leftCollapsed],
  )

  const onLeftResizeMove = React.useCallback((e: React.PointerEvent) => {
    if (!leftDraggingRef.current) return
    const next = e.clientX
    const clamped = clamp(next, 260, 520)
    setLeftWidth(clamped)
    leftLastWidthRef.current = clamped
  }, [])

  const onLeftResizeEnd = React.useCallback((e: React.PointerEvent) => {
    if (!leftDraggingRef.current) return
    leftDraggingRef.current = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }, [])

  const onRightCollapse = React.useCallback(() => {
    rightLastWidthRef.current = rightWidth
    setRightCollapsed(true)
  }, [rightWidth])

  const onRightExpand = React.useCallback(() => {
    setRightCollapsed(false)
    setRightWidth(rightLastWidthRef.current || 360)
  }, [])

  const onRightResizeStart = React.useCallback(
    (e: React.PointerEvent) => {
      if (rightCollapsed) return
      rightDraggingRef.current = true
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    [rightCollapsed],
  )

  const onRightResizeMove = React.useCallback((e: React.PointerEvent) => {
    if (!rightDraggingRef.current) return
    const vw = window.innerWidth
    const next = vw - e.clientX
    const clamped = clamp(next, 260, 520)
    setRightWidth(clamped)
    rightLastWidthRef.current = clamped
  }, [])

  const onRightResizeEnd = React.useCallback((e: React.PointerEvent) => {
    if (!rightDraggingRef.current) return
    rightDraggingRef.current = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }, [])

  return (
    <div
      className={styles.root}
      style={{
        ['--leftAsideWidth' as never]: leftCollapsed ? '0px' : `${leftWidth}px`,
        ['--rightAsideWidth' as never]: rightCollapsed ? '0px' : `${rightWidth}px`,
      }}
    >
      <aside className={`${styles.leftAside} ${leftCollapsed ? styles.leftCollapsed : ''}`}>
        <div className={styles.asideTopBar}>
          <div className={styles.asideTitle}>公司列表</div>
          <button className={styles.collapseBtn} onClick={onLeftCollapse} aria-label="collapse left panel" type="button">
            收起
          </button>
        </div>
        <div className={styles.asideContent}>{props.left}</div>
        <div
          className={styles.leftResizeHandle}
          role="separator"
          aria-orientation="vertical"
          aria-label="resize left panel"
          onPointerDown={onLeftResizeStart}
          onPointerMove={onLeftResizeMove}
          onPointerUp={onLeftResizeEnd}
          onPointerCancel={onLeftResizeEnd}
        />
      </aside>

      <main className={styles.center}>
        {props.center}
        {leftCollapsed ? (
          <button className={styles.leftExpandBtn} onClick={onLeftExpand} aria-label="expand company list" type="button">
            打开公司列表
          </button>
        ) : null}
        {rightCollapsed ? (
          <button className={styles.rightExpandBtn} onClick={onRightExpand} aria-label="expand right panel" type="button">
            打开面板
          </button>
        ) : null}
      </main>

      <aside className={`${styles.rightAside} ${rightCollapsed ? styles.rightCollapsed : ''}`}>
        <div className={styles.asideTopBar}>
          <div className={styles.asideTitle}>操作面板</div>
          <button className={styles.collapseBtn} onClick={onRightCollapse} aria-label="collapse right panel" type="button">
            收起
          </button>
        </div>

        <div className={styles.asideContent}>{props.right}</div>

        <div
          className={styles.rightResizeHandle}
          role="separator"
          aria-orientation="vertical"
          aria-label="resize panel"
          onPointerDown={onRightResizeStart}
          onPointerMove={onRightResizeMove}
          onPointerUp={onRightResizeEnd}
          onPointerCancel={onRightResizeEnd}
        />
      </aside>
    </div>
  )
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}


