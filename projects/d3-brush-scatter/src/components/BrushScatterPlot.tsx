import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { StockPoint } from '../data/stocks'

export type SelectionMode = 'single' | 'multi' | 'brush'

type BrushScatterPlotProps = {
  data: StockPoint[]
  selectedIds: Set<string>
  mode: SelectionMode
  onPointSelect: (id: string, additive: boolean) => void
  onBrushSelect: (ids: string[]) => void
}

type Size = {
  width: number
  height: number
}

const margin = { top: 28, right: 34, bottom: 54, left: 72 }

export function BrushScatterPlot({ data, selectedIds, mode, onPointSelect, onBrushSelect }: BrushScatterPlotProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const xAxisRef = useRef<SVGGElement | null>(null)
  const yAxisRef = useRef<SVGGElement | null>(null)
  const xGridRef = useRef<SVGGElement | null>(null)
  const yGridRef = useRef<SVGGElement | null>(null)
  const brushRef = useRef<SVGGElement | null>(null)
  const [size, setSize] = useState<Size>({ width: 780, height: 560 })

  useEffect(() => {
    const node = wrapRef.current
    if (!node) return

    const observer = new ResizeObserver(([entry]) => {
      const rect = entry.contentRect
      setSize({
        width: Math.max(360, rect.width),
        height: Math.max(420, rect.height),
      })
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const plot = useMemo(() => {
    const innerWidth = Math.max(240, size.width - margin.left - margin.right)
    const innerHeight = Math.max(260, size.height - margin.top - margin.bottom)

    const xExtent = d3.extent(data, (d) => d.netAssetPerShare) as [number, number]
    const yExtent = d3.extent(data, (d) => d.netProfitMargin) as [number, number]

    const xPad = Math.max(1, (xExtent[1] - xExtent[0]) * 0.12)
    const yPad = Math.max(6, (yExtent[1] - yExtent[0]) * 0.12)

    const xScale = d3
      .scaleLinear()
      .domain([Math.max(0, xExtent[0] - xPad), xExtent[1] + xPad])
      .range([margin.left, margin.left + innerWidth])
      .nice()

    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] - yPad, yExtent[1] + yPad])
      .range([margin.top + innerHeight, margin.top])
      .nice()

    const radiusScale = d3
      .scaleSqrt()
      .domain(d3.extent(data, (d) => d.grossMargin) as [number, number])
      .range([5, 15])

    return {
      innerWidth,
      innerHeight,
      xScale,
      yScale,
      radiusScale,
      x0: margin.left,
      x1: margin.left + innerWidth,
      y0: margin.top,
      y1: margin.top + innerHeight,
    }
  }, [data, size.height, size.width])

  useEffect(() => {
    if (!xAxisRef.current || !yAxisRef.current || !xGridRef.current || !yGridRef.current) return

    const xAxis = d3.axisBottom(plot.xScale).ticks(Math.max(4, Math.floor(plot.innerWidth / 96))).tickSizeOuter(0)
    const yAxis = d3.axisLeft(plot.yScale).ticks(Math.max(4, Math.floor(plot.innerHeight / 70))).tickSizeOuter(0)

    d3.select(xAxisRef.current).call(xAxis)
    d3.select(yAxisRef.current).call(yAxis)

    d3.select(xGridRef.current).call(
      d3
        .axisBottom(plot.xScale)
        .ticks(Math.max(4, Math.floor(plot.innerWidth / 96)))
        .tickSize(-plot.innerHeight)
        .tickFormat(() => ''),
    )

    d3.select(yGridRef.current).call(
      d3
        .axisLeft(plot.yScale)
        .ticks(Math.max(4, Math.floor(plot.innerHeight / 70)))
        .tickSize(-plot.innerWidth)
        .tickFormat(() => ''),
    )
  }, [plot])

  useEffect(() => {
    const node = brushRef.current
    if (!node) return

    const brushLayer = d3.select(node)
    brushLayer.selectAll('*').remove()

    if (mode !== 'brush') return

    const brush = d3
      .brush<unknown>()
      .extent([
        [plot.x0, plot.y0],
        [plot.x1, plot.y1],
      ])
      .on('end', (event) => {
        const selection = event.selection as [[number, number], [number, number]] | null
        if (!selection) {
          onBrushSelect([])
          return
        }

        const [[xMin, yMin], [xMax, yMax]] = selection
        const ids = data
          .filter((item) => {
            const x = plot.xScale(item.netAssetPerShare)
            const y = plot.yScale(item.netProfitMargin)
            return x >= xMin && x <= xMax && y >= yMin && y <= yMax
          })
          .map((item) => item.id)

        onBrushSelect(ids)
      })

    brushLayer.call(brush)
  }, [data, mode, onBrushSelect, plot])

  return (
    <div className="chartShell" ref={wrapRef}>
      <svg className="scatterSvg" width="100%" height="100%" viewBox={`0 0 ${size.width} ${size.height}`} role="img" aria-label="公司财务指标散点图">
        <rect className="plotFrame" x={plot.x0} y={plot.y0} width={plot.innerWidth} height={plot.innerHeight} />

        <g className="grid xGrid" ref={xGridRef} transform={`translate(0, ${plot.y1})`} />
        <g className="grid yGrid" ref={yGridRef} transform={`translate(${plot.x0}, 0)`} />

        <g className="axis xAxis" ref={xAxisRef} transform={`translate(0, ${plot.y1})`} />
        <g className="axis yAxis" ref={yAxisRef} transform={`translate(${plot.x0}, 0)`} />

        <text className="axisLabel" x={plot.x0 + plot.innerWidth / 2} y={size.height - 16} textAnchor="middle">
          每股净资产（元）
        </text>
        <text className="axisLabel" transform={`translate(22 ${plot.y0 + plot.innerHeight / 2}) rotate(-90)`} textAnchor="middle">
          净利润率（%）
        </text>

        <g className="pointsLayer">
          {data.map((item) => {
            const selected = selectedIds.has(item.id)
            const muted = selectedIds.size > 0 && !selected
            return (
              <circle
                key={item.id}
                className={`point ${selected ? 'selected' : ''} ${muted ? 'muted' : ''}`}
                cx={plot.xScale(item.netAssetPerShare)}
                cy={plot.yScale(item.netProfitMargin)}
                r={plot.radiusScale(item.grossMargin)}
                fill={colorByProfit(item.netProfitMargin)}
                tabIndex={mode === 'brush' ? -1 : 0}
                role="button"
                aria-label={`${item.name}，净利润率 ${formatPercent(item.netProfitMargin)}`}
                onClick={(event) => {
                  if (mode === 'brush') return
                  onPointSelect(item.id, mode === 'multi' || event.shiftKey)
                }}
                onKeyDown={(event) => {
                  if (mode === 'brush') return
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onPointSelect(item.id, mode === 'multi' || event.shiftKey)
                  }
                }}
              >
                <title>{`${item.name} ${item.code}\n每股净资产: ${formatNumber(item.netAssetPerShare)} 元\n净利润率: ${formatPercent(item.netProfitMargin)}\n毛利率: ${formatPercent(item.grossMargin)}`}</title>
              </circle>
            )
          })}
        </g>

        <g className="brushLayer" ref={brushRef} />
      </svg>
    </div>
  )
}

function colorByProfit(value: number): string {
  if (value < 0) return '#dc6d72'
  if (value >= 25) return '#1b9aaa'
  if (value >= 10) return '#2e7d5b'
  return '#6978d9'
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 }).format(value)
}

function formatPercent(value: number): string {
  return `${formatNumber(value)}%`
}
