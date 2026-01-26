/**
 * Mock SSE 数据推送模块
 * 模拟实时行情数据推送，支持 K线(candlestick) 和 折线(line) 两种数据类型
 */

export interface CandlestickBar {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface LinePoint {
  timestamp: number
  value: number
}

export interface CandlestickMessage {
  type: 'candlestick'
  stockId: string
  bar: CandlestickBar
}

export interface LineMessage {
  type: 'line'
  stockId: string
  point: LinePoint
}

export type SSEMessage = CandlestickMessage | LineMessage

export interface MockSSEOptions {
  stockId: string
  interval?: number // 推送间隔（毫秒），默认 1000
  onMessage: (msg: SSEMessage) => void
  type: 'candlestick' | 'line'
}

// 生成初始历史数据
export function generateInitialCandlestickData(count: number): CandlestickBar[] {
  const bars: CandlestickBar[] = []
  const now = Date.now()
  const interval = 60 * 1000 // 1分钟K线
  let price = 100 + Math.random() * 50 // 初始价格 100-150

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - i * interval
    const volatility = price * 0.02 // 2% 波动
    const open = price
    const change = (Math.random() - 0.5) * volatility * 2
    const close = open + change
    const high = Math.max(open, close) + Math.random() * volatility
    const low = Math.min(open, close) - Math.random() * volatility
    const volume = Math.floor(1000 + Math.random() * 9000)

    bars.push({
      timestamp,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    })

    price = close // 下一根K线以当前收盘价为基准
  }

  return bars
}

export function generateInitialLineData(count: number): LinePoint[] {
  const points: LinePoint[] = []
  const now = Date.now()
  const interval = 1000 // 1秒间隔
  let value = 100 + Math.random() * 50

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - i * interval
    const change = (Math.random() - 0.5) * 2
    value = Math.max(50, Math.min(200, value + change))

    points.push({
      timestamp,
      value: parseFloat(value.toFixed(2)),
    })
  }

  return points
}

// Mock SSE 连接类
export class MockSSE {
  private timerId: ReturnType<typeof setInterval> | null = null
  private lastBar: CandlestickBar | null = null
  private lastPoint: LinePoint | null = null
  private options: MockSSEOptions

  constructor(options: MockSSEOptions) {
    this.options = {
      interval: 1000,
      ...options,
    }
  }

  start(initialData?: CandlestickBar[] | LinePoint[]) {
    if (this.timerId) return

    if (this.options.type === 'candlestick') {
      const bars = initialData as CandlestickBar[] | undefined
      if (bars && bars.length > 0) {
        this.lastBar = bars[bars.length - 1]
      } else {
        // 创建一个初始bar
        const now = Date.now()
        const price = 100 + Math.random() * 50
        this.lastBar = {
          timestamp: now,
          open: price,
          high: price,
          low: price,
          close: price,
          volume: 1000,
        }
      }
    } else {
      const points = initialData as LinePoint[] | undefined
      if (points && points.length > 0) {
        this.lastPoint = points[points.length - 1]
      } else {
        this.lastPoint = {
          timestamp: Date.now(),
          value: 100 + Math.random() * 50,
        }
      }
    }

    this.timerId = setInterval(() => {
      this.push()
    }, this.options.interval)
  }

  private push() {
    if (this.options.type === 'candlestick') {
      this.pushCandlestick()
    } else {
      this.pushLine()
    }
  }

  private pushCandlestick() {
    if (!this.lastBar) return

    const now = Date.now()
    const barInterval = 60 * 1000 // 1分钟K线
    const lastBarStart = Math.floor(this.lastBar.timestamp / barInterval) * barInterval
    const currentBarStart = Math.floor(now / barInterval) * barInterval

    if (currentBarStart > lastBarStart) {
      // 新的一根K线
      const price = this.lastBar.close
      const volatility = price * 0.02
      const change = (Math.random() - 0.5) * volatility * 2
      const close = price + change
      const high = Math.max(price, close) + Math.random() * volatility * 0.5
      const low = Math.min(price, close) - Math.random() * volatility * 0.5

      this.lastBar = {
        timestamp: currentBarStart,
        open: parseFloat(price.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.floor(1000 + Math.random() * 2000),
      }
    } else {
      // 更新当前K线
      const volatility = this.lastBar.close * 0.005
      const change = (Math.random() - 0.5) * volatility * 2
      const newClose = this.lastBar.close + change

      this.lastBar = {
        ...this.lastBar,
        high: parseFloat(Math.max(this.lastBar.high, newClose).toFixed(2)),
        low: parseFloat(Math.min(this.lastBar.low, newClose).toFixed(2)),
        close: parseFloat(newClose.toFixed(2)),
        volume: this.lastBar.volume + Math.floor(Math.random() * 100),
      }
    }

    this.options.onMessage({
      type: 'candlestick',
      stockId: this.options.stockId,
      bar: this.lastBar,
    })
  }

  private pushLine() {
    if (!this.lastPoint) return

    const change = (Math.random() - 0.5) * 2
    const newValue = Math.max(50, Math.min(200, this.lastPoint.value + change))

    this.lastPoint = {
      timestamp: Date.now(),
      value: parseFloat(newValue.toFixed(2)),
    }

    this.options.onMessage({
      type: 'line',
      stockId: this.options.stockId,
      point: this.lastPoint,
    })
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }
}
