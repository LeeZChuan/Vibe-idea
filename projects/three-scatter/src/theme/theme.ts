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
    // - 颜色本身选用点的正值主色系，保证整体统一
    trajectory: '#BC6FF1',
  },
  trajectory: {
    // 底层轨迹线：纯色、固定透明度（不做颜色/透明度渐变）
    baseOpacity: 0.35,

    // “沿轨迹运动的发亮效果”
    // - 通过 dashed line + dashOffset 动画实现（10s 从起点跑到终点）
    glowDurationSec: 10,
    glowOpacity: 0.95,
    // 单个高亮段的长度比例（相对总路径长度）
    glowDashFraction: 0.14,
    // 高亮段之间的间隔比例（设大一点，保证“只看到一个亮段在跑”）
    glowGapFraction: 2.0,
  },
} as const


