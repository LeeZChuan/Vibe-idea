import { useParams, Link } from 'react-router-dom'
import { LineCanvas } from '../../features/line/LineCanvas'
import styles from './chartPage.module.css'

export function LineChartPage() {
  const { stockId } = useParams<{ stockId: string }>()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>折线图 - {stockId}</h1>
        <nav className={styles.nav}>
          <Link to={`/chart/candlestickChart/${stockId}`} className={styles.link}>
            K线图
          </Link>
          <Link to={`/chart/lineChart/${stockId}`} className={styles.activeLink}>
            折线图
          </Link>
        </nav>
      </header>
      <main className={styles.main}>
        <LineCanvas stockId={stockId ?? '60090'} />
      </main>
    </div>
  )
}
