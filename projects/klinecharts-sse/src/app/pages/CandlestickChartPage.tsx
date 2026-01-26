import { useParams, Link } from 'react-router-dom'
import { KlinechartsView } from '../../features/candlestick/KlinechartsView'
import styles from './chartPage.module.css'

export function CandlestickChartPage() {
  const { stockId } = useParams<{ stockId: string }>()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>K线图 - {stockId}</h1>
        <nav className={styles.nav}>
          <Link to={`/chart/candlestickChart/${stockId}`} className={styles.activeLink}>
            K线图
          </Link>
          <Link to={`/chart/lineChart/${stockId}`} className={styles.link}>
            折线图
          </Link>
        </nav>
      </header>
      <main className={styles.main}>
        <KlinechartsView stockId={stockId ?? '60090'} />
      </main>
    </div>
  )
}
