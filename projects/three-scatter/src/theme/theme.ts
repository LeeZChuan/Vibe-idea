export const THEME = {
  colors: {
    bg: '#000000',
    panelBg: 'rgba(0, 0, 0, 0.78)',
    // 链接/强调色（用于 detail 页“返回”等）
    link: '#8ab4ff',
    // 文本（用于 3D 标签、提示等；尽量集中管理，避免散落 rgba）
    textPrimary: 'rgba(255, 255, 255, 0.86)',
    textSecondary: 'rgba(255, 255, 255, 0.72)',
    // 轴配色（按你给的方案）
    axisX: '#5A9CB5',
    axisY: '#FACE68',
    axisZ: '#FA6868',
    axisTick: '#FAAC68',
    // 轴平面（XY / XZ / YZ）
    axisPlane: '#F7F6D3',
    // 点仍然保持紫色系
    pointPos: '#BC6FF1',
    pointNeg: '#892CDC',
    pointZero: '#c480e8',
    // hover 高亮（球体变色）
    hoverPoint: '#FFE45C',
    // click 选中高亮（常驻）
    clickedPoint: '#FF9F1C',
    // 轨迹线（detail 页同公司跨期轨迹）
    // - 采用“同色由浅到深（透明度从 0.2 -> 1.0）”表达时间推进
    // - 颜色本身选用点的正值主色系，保证整体统一
    trajectory: '#BC6FF1',
  },
  trajectory: {
    startOpacity: 0.2,
    endOpacity: 1.0,
  },
} as const


