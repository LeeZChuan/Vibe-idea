import { useCallback, useEffect, useRef, useState } from 'react'
import { init, dispose } from 'klinecharts'
import type { Chart } from 'klinecharts'
import { MockSSE, generateInitialCandlestickData } from '../../mocks/mockSse'
import type { CandlestickBar, SSEMessage } from '../../mocks/mockSse'
import styles from './klinechartsView.module.css'

interface KlinechartsViewProps {
  stockId: string
}

export function KlinechartsView({ stockId }: KlinechartsViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<Chart | null>(null)
  const sseRef = useRef<MockSSE | null>(null)
  const dataRef = useRef<CandlestickBar[]>([])
  const [isConnected, setIsConnected] = useState(false)

  const handleSSEMessage = useCallback((msg: SSEMessage) => {
    if (msg.type !== 'candlestick' || !chartRef.current) return

    const bar = msg.bar
    const data = dataRef.current

    // 检查是否是新的 K 线
    if (data.length === 0) {
      dataRef.current.push(bar)
      chartRef.current.applyNewData([
        {
          timestamp: bar.timestamp,
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
          volume: bar.volume,
        },
      ])
      return
    }

    const lastBar = data[data.length - 1]
    const barInterval = 60 * 1000 // 1分钟
    const lastBarStart = Math.floor(lastBar.timestamp / barInterval) * barInterval
    const currentBarStart = Math.floor(bar.timestamp / barInterval) * barInterval

    if (currentBarStart > lastBarStart) {
      // 新的 K 线
      dataRef.current.push(bar)
      chartRef.current.updateData({
        timestamp: bar.timestamp,
        open: bar.open,
        high: bar.high,
        low: bar.low,
        close: bar.close,
        volume: bar.volume,
      })
    } else {
      // 更新当前 K 线
      dataRef.current[data.length - 1] = bar
      chartRef.current.updateData({
        timestamp: bar.timestamp,
        open: bar.open,
        high: bar.high,
        low: bar.low,
        close: bar.close,
        volume: bar.volume,
      })
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    // 初始化图表
    const chart = init(containerRef.current, {
      styles: {
        grid: {
          horizontal: {
            color: '#393939',
          },
          vertical: {
            color: '#393939',
          },
        },
        candle: {
          priceMark: {
            high: {
              color: '#26A69A',
            },
            low: {
              color: '#EF5350',
            },
          },
        },
      },
    })

    if (!chart) return

    chartRef.current = chart

    // 生成初始数据
    const initialData = generateInitialCandlestickData(100)
    dataRef.current = initialData

    // 转换为 klinecharts 数据格式并应用
    const klineData = initialData.map((bar) => ({
      timestamp: bar.timestamp,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
      volume: bar.volume,
    }))

    chart.applyNewData(klineData)

    // 启动 SSE 连接
    const sse = new MockSSE({
      stockId,
      type: 'candlestick',
      interval: 1000,
      onMessage: handleSSEMessage,
    })

    sseRef.current = sse
    sse.start(initialData)
    queueMicrotask(() => setIsConnected(true))

    const container = containerRef.current

    // 清理函数
    return () => {
      sse.stop()
      if (container) {
        dispose(container)
      }
      chartRef.current = null
      sseRef.current = null
      setIsConnected(false)
    }
  }, [stockId, handleSSEMessage])

  const toggleConnection = () => {
    if (!sseRef.current) return

    if (isConnected) {
      sseRef.current.stop()
      setIsConnected(false)
    } else {
      sseRef.current.start(dataRef.current)
      setIsConnected(true)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.info}>
          <span className={styles.label}>股票代码:</span>
          <span className={styles.value}>{stockId}</span>
          <span className={`${styles.status} ${isConnected ? styles.connected : styles.disconnected}`}>
            {isConnected ? '● 实时推送中' : '○ 已暂停'}
          </span>
        </div>
        <button className={styles.button} onClick={toggleConnection}>
          {isConnected ? '暂停推送' : '恢复推送'}
        </button>
      </div>
      <div ref={containerRef} className={styles.chart} />
    </div>
  )
}
