import { useCallback, useEffect, useRef, useState } from 'react'
import { MockSSE, generateInitialLineData } from '../../mocks/mockSse'
import type { LinePoint, SSEMessage } from '../../mocks/mockSse'
import styles from './lineCanvas.module.css'

interface LineCanvasProps {
  stockId: string
}

const MAX_POINTS = 300 // 最多显示的点数
const PADDING = { top: 20, right: 40, bottom: 30, left: 60 }

export function LineCanvas({ stockId }: LineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sseRef = useRef<MockSSE | null>(null)
  const dataRef = useRef<LinePoint[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    const data = dataRef.current
    if (data.length === 0) return

    // 计算绘图区域
    const chartWidth = width - PADDING.left - PADDING.right
    const chartHeight = height - PADDING.top - PADDING.bottom

    // 计算数据范围
    const minValue = Math.min(...data.map((p) => p.value))
    const maxValue = Math.max(...data.map((p) => p.value))
    const valueRange = maxValue - minValue || 1

    // 绘制背景网格
    ctx.strokeStyle = '#393939'
    ctx.lineWidth = 1

    // 横向网格线
    for (let i = 0; i <= 5; i++) {
      const y = PADDING.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(PADDING.left, y)
      ctx.lineTo(PADDING.left + chartWidth, y)
      ctx.stroke()

      // Y轴标签
      const value = maxValue - (valueRange / 5) * i
      ctx.fillStyle = '#a0a0a0'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(value.toFixed(2), PADDING.left - 10, y + 4)
    }

    // 纵向网格线
    const timeSteps = Math.min(6, data.length)
    for (let i = 0; i <= timeSteps; i++) {
      const x = PADDING.left + (chartWidth / timeSteps) * i
      ctx.beginPath()
      ctx.moveTo(x, PADDING.top)
      ctx.lineTo(x, PADDING.top + chartHeight)
      ctx.stroke()

      // X轴时间标签
      if (i < timeSteps && data.length > 0) {
        const dataIndex = Math.floor((data.length - 1) * (i / timeSteps))
        const point = data[dataIndex]
        if (point) {
          const time = new Date(point.timestamp)
          const label = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`
          ctx.fillStyle = '#a0a0a0'
          ctx.font = '11px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(label, x, height - 10)
        }
      }
    }

    // 绘制折线
    ctx.strokeStyle = '#26a69a'
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((point, index) => {
      const x = PADDING.left + (chartWidth / (data.length - 1 || 1)) * index
      const normalizedValue = (point.value - minValue) / valueRange
      const y = PADDING.top + chartHeight - normalizedValue * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // 绘制最后一个点
    if (data.length > 0) {
      const lastPoint = data[data.length - 1]
      const x = PADDING.left + chartWidth
      const normalizedValue = (lastPoint.value - minValue) / valueRange
      const y = PADDING.top + chartHeight - normalizedValue * chartHeight

      ctx.fillStyle = '#26a69a'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      // 显示当前值
      ctx.fillStyle = '#e8e8e8'
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(lastPoint.value.toFixed(2), PADDING.left + chartWidth + 10, y + 5)
    }
  }, [])

  const handleSSEMessage = useCallback((msg: SSEMessage) => {
    if (msg.type !== 'line') return

    const point = msg.point
    dataRef.current.push(point)

    // 保持滑动窗口
    if (dataRef.current.length > MAX_POINTS) {
      dataRef.current.shift()
    }

    // 请求重绘
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    animationFrameRef.current = requestAnimationFrame(draw)
  }, [draw])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置 canvas 尺寸
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      draw()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 生成初始数据
    const initialData = generateInitialLineData(100)
    dataRef.current = initialData

    // 初始绘制
    draw()

    // 启动 SSE 连接
    const sse = new MockSSE({
      stockId,
      type: 'line',
      interval: 1000,
      onMessage: handleSSEMessage,
    })

    sseRef.current = sse
    sse.start(initialData)
    queueMicrotask(() => setIsConnected(true))

    // 清理函数
    return () => {
      sse.stop()
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      sseRef.current = null
      setIsConnected(false)
    }
  }, [stockId, draw, handleSSEMessage])

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
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  )
}
