import type { MetricDef, MetricId } from '../model/metrics'
import styles from './metricSelect.module.css'

export function MetricSelect(props: {
  label: string
  value: MetricId
  options: MetricDef[]
  onChange: (id: MetricId) => void
}) {
  return (
    <label className={styles.root}>
      <div className={styles.label}>{props.label}</div>
      <select
        className={styles.select}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.options.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
            {m.unit ? ` (${m.unit})` : ''}
          </option>
        ))}
      </select>
    </label>
  )
}


