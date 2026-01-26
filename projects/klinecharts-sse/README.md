# klinecharts-sse

基于 React + klinecharts 实现的行情 K线图和折线图实时推送 demo。

## 功能特性

- 📈 **K线图**: 基于 `klinecharts@9.8.10` 的专业 K线图展示
- 📊 **折线图**: Canvas 原生绘制的实时折线图
- 🔄 **实时推送**: Mock SSE 模拟真实行情数据推送（1秒/次）
- ⏸️ **推送控制**: 支持暂停/恢复数据推送
- 🎨 **全屏布局**: 图表铺满整个视口
- 🔀 **路由切换**: 支持在 K线图和折线图之间切换

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看效果。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 路由

- `/` - 默认重定向到 K线图
- `/chart/candlestickChart/:stockId` - K线图页面（示例：`/chart/candlestickChart/60090`）
- `/chart/lineChart/:stockId` - 折线图页面（示例：`/chart/lineChart/60090`）

## 技术栈

- **React 19.2** - UI 框架
- **TypeScript** - 类型安全
- **Vite 7.2** - 构建工具
- **react-router-dom 7.1** - 路由管理
- **klinecharts 9.8.10** - K线图库
- **Canvas API** - 折线图渲染

## 项目结构

```
src/
├── app/
│   ├── App.tsx                      # 路由配置
│   └── pages/                       # 页面组件
│       ├── CandlestickChartPage.tsx # K线图页面
│       ├── LineChartPage.tsx        # 折线图页面
│       └── chartPage.module.css     # 页面样式
├── features/
│   ├── candlestick/                 # K线图功能
│   │   ├── KlinechartsView.tsx      # K线图组件
│   │   └── klinechartsView.module.css
│   └── line/                        # 折线图功能
│       ├── LineCanvas.tsx           # 折线图组件
│       └── lineCanvas.module.css
├── mocks/
│   └── mockSse.ts                   # Mock SSE 推送模块
└── main.tsx                         # 应用入口
```

## Mock SSE 数据协议

### K线数据
```typescript
{
  type: 'candlestick',
  stockId: string,
  bar: {
    timestamp: number,  // 时间戳
    open: number,       // 开盘价
    high: number,       // 最高价
    low: number,        // 最低价
    close: number,      // 收盘价
    volume: number      // 成交量
  }
}
```

### 折线数据
```typescript
{
  type: 'line',
  stockId: string,
  point: {
    timestamp: number,  // 时间戳
    value: number       // 价格
  }
}
```
