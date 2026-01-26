import { Navigate, Route, Routes } from 'react-router-dom'
import { CandlestickChartPage } from './pages/CandlestickChartPage'
import { LineChartPage } from './pages/LineChartPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chart/candlestickChart/60090" replace />} />
      <Route path="/chart/candlestickChart/:stockId" element={<CandlestickChartPage />} />
      <Route path="/chart/lineChart/:stockId" element={<LineChartPage />} />
      <Route path="*" element={<Navigate to="/chart/candlestick/60090" replace />} />
    </Routes>
  )
}
