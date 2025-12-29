import type { CompanyYearRow } from '../features/scatter3d/model/types'

// 仅用于先把三维散点图跑起来；后续可替换为接口/文件输入等数据源。
const BASE_ROWS: CompanyYearRow[] = [
  { id: 'c1-2024', name: 'Alpha', year: 2024, profitRate: 0.12, marketCap: 180, revenue: 96 },
  { id: 'c2-2024', name: 'Beta', year: 2024, profitRate: -0.05, marketCap: 42, revenue: 38 },
  { id: 'c3-2024', name: 'Gamma', year: 2024, profitRate: null, marketCap: 320, revenue: 155 },
  { id: 'c4-2024', name: 'Delta', year: 2024, profitRate: 0.23, marketCap: 88, revenue: null },
  { id: 'c5-2024', name: 'Epsilon', year: 2024, profitRate: -0.18, marketCap: null, revenue: 64 },
  { id: 'c6-2024', name: 'Zeta', year: 2024, profitRate: 0.04, marketCap: 12, revenue: 18 },
  { id: 'c7-2024', name: 'Eta', year: 2024, profitRate: -0.01, marketCap: 220, revenue: 101 },
  { id: 'c8-2024', name: 'Theta', year: 2024, profitRate: 0.0, marketCap: 75, revenue: 52 },
]

// 扩容到 10 倍：保证 id 唯一、值分布更丰富（但仍保留部分 null）
export const MOCK_COMPANY_ROWS: CompanyYearRow[] = expandRows(BASE_ROWS, 10)

function expandRows(rows: CompanyYearRow[], times: number): CompanyYearRow[] {
  const out: CompanyYearRow[] = []
  for (let t = 0; t < times; t++) {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]
      const k = t + 1
      const jitter = (i - rows.length / 2) * 0.002 * k
      out.push({
        ...r,
        id: `${r.id}-x${k}`,
        name: `${r.name}-${k}`,
        year: r.year,
        profitRate: r.profitRate === null ? null : r.profitRate + jitter,
        marketCap: r.marketCap === null ? null : Math.max(0, r.marketCap * (0.85 + 0.06 * k) + i * 2),
        revenue: r.revenue === null ? null : Math.max(0, r.revenue * (0.9 + 0.05 * k) + i * 1.5),
      })
    }
  }
  return out
}


