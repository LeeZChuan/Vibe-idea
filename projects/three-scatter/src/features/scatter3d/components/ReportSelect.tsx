import styles from './metricSelect.module.css'

export function ReportSelect(props: {
  label: string
  value: string
  options: Array<{ reportDate: string; reportType: string }>
  onChange: (reportDate: string) => void
}) {
  return (
    <label className={styles.root}>
      <div className={styles.label}>{props.label}</div>
      <select className={styles.select} value={props.value} onChange={(e) => props.onChange(e.target.value)}>
        {props.options.map((p) => (
          <option key={p.reportDate} value={p.reportDate}>
            {p.reportDate}
          </option>
        ))}
      </select>
    </label>
  )
}


