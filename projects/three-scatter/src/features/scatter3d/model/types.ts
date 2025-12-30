export type CompanyYearRow = {
  id: string
  name: string
  year: number
  /**
   * 指标值字典：key=header.property，value=number|null
   * - null 代表缺失（上层展示可按“0 或空值”策略处理）
   */
  metrics: Record<string, number | null>
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


