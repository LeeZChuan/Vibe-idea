import { useMemo, useState } from 'react'
import styles from './interactionHint.module.css'

export function InteractionHint() {
  const [open, setOpen] = useState(false)
  const items = useMemo(
    () => [
      { k: '滚轮', v: '缩放' },
      { k: '左键拖拽', v: '旋转' },
      { k: 'Shift + 左键拖拽', v: '平移' },
      { k: '双击', v: '重置视角（部分浏览器可能不支持）' },
    ],
    [],
  )

  return (
    <div className={styles.root}>
      {open ? (
        <div className={styles.pop}>
          <div className={styles.popTitle}>
            操作提示
            <button className={styles.close} onClick={() => setOpen(false)} aria-label="close">
              ×
            </button>
          </div>
          <div className={styles.list}>
            {items.map((it) => (
              <div key={it.k} className={styles.row}>
                <span className={styles.key}>{it.k}</span>
                <span className={styles.value}>{it.v}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <button className={styles.fab} onClick={() => setOpen((v) => !v)} aria-label="hint">
        ?
      </button>
    </div>
  )
}


