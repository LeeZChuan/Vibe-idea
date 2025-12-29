export type CompanyYearRow = {
  id: string
  name: string
  year: number
  // 可为 null：认为该指标为 0
  profitRate: number | null
  marketCap: number | null
  revenue: number | null
}

export type Vec3 = readonly [number, number, number]

export type ProjectedPoint = {
  id: string
  label: string
  position: Vec3
  color: Vec3
  raw: {
    x: number
    y: number
    z: number
  }
}


