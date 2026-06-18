import { useCallback, useMemo, useState } from 'react'
import { BrushScatterPlot, type SelectionMode } from './components/BrushScatterPlot'
import { STOCKS } from './data/stocks'

const modes: Array<{ id: SelectionMode; label: string }> = [
  { id: 'single', label: '单选' },
  { id: 'multi', label: '多选' },
  { id: 'brush', label: '框选' },
]

export default function App() {
  const [mode, setMode] = useState<SelectionMode>('single')
  const [selected, setSelected] = useState<string[]>([])

  const selectedIds = useMemo(() => new Set(selected), [selected])
  const selectedStocks = useMemo(() => STOCKS.filter((item) => selectedIds.has(item.id)), [selectedIds])

  const onPointSelect = useCallback((id: string, additive: boolean) => {
    setSelected((current) => {
      if (!additive) return [id]
      return current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    })
  }, [])

  const onBrushSelect = useCallback((ids: string[]) => {
    setSelected(ids)
  }, [])

  return (
    <main className="app">
      <section className="visualPane" aria-label="散点图区域">
        <header className="toolbar">
          <div>
            <h1>D3 Brush Scatter</h1>
            <p>2024 年公司财务样本：净资产、利润率与毛利率分布</p>
          </div>

          <div className="modeGroup" role="group" aria-label="选择模式">
            {modes.map((item) => (
              <button
                key={item.id}
                className={mode === item.id ? 'modeButton active' : 'modeButton'}
                type="button"
                aria-pressed={mode === item.id}
                onClick={() => setMode(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <BrushScatterPlot data={STOCKS} selectedIds={selectedIds} mode={mode} onPointSelect={onPointSelect} onBrushSelect={onBrushSelect} />
      </section>

      <aside className="selectionPane" aria-label="已选公司列表">
        <div className="selectionHeader">
          <div>
            <h2>已选公司</h2>
            <p>{selected.length} / {STOCKS.length}</p>
          </div>
          <button className="clearButton" type="button" disabled={selected.length === 0} onClick={() => setSelected([])}>
            清空
          </button>
        </div>

        {selectedStocks.length === 0 ? (
          <div className="emptyState">
            <strong>暂无选择</strong>
            <span>在单选/多选模式点击散点，或切换到框选模式拖出浅蓝色范围。</span>
          </div>
        ) : (
          <ol className="selectionList">
            {selectedStocks.map((item) => (
              <li className="stockItem" key={item.id}>
                <div className="stockMain">
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.code} · {item.sector}</span>
                  </div>
                  <span className={item.netProfitMargin < 0 ? 'profit negative' : 'profit'}>{formatPercent(item.netProfitMargin)}</span>
                </div>
                <dl className="metricGrid">
                  <div>
                    <dt>每股净资产</dt>
                    <dd>{formatNumber(item.netAssetPerShare)} 元</dd>
                  </div>
                  <div>
                    <dt>毛利率</dt>
                    <dd>{formatPercent(item.grossMargin)}</dd>
                  </div>
                  <div>
                    <dt>应收周转率</dt>
                    <dd>{formatNumber(item.arTurnover)} 次</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        )}
      </aside>
    </main>
  )
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 }).format(value)
}

function formatPercent(value: number): string {
  return `${formatNumber(value)}%`
}
