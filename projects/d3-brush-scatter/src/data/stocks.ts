export type StockPoint = {
  id: string
  code: string
  name: string
  sector: string
  netAssetPerShare: number
  netProfitMargin: number
  grossMargin: number
  arTurnover: number
}

// 精选自 projects/three-scatter/src/data/data.json 的 2024 年年报字段。
export const STOCKS: StockPoint[] = [
  { id: 'SHHQ600004', code: '600004', name: '白云机场', sector: '交通运输', netAssetPerShare: 7.752, netProfitMargin: 12.472, grossMargin: 27.046, arTurnover: 7.038 },
  { id: 'SHHQ600006', code: '600006', name: '东风股份', sector: '汽车', netAssetPerShare: 4.138, netProfitMargin: 0.267, grossMargin: 1.775, arTurnover: 2.86 },
  { id: 'SHHQ600007', code: '600007', name: '中国国贸', sector: '商业地产', netAssetPerShare: 9.583, netProfitMargin: 32.269, grossMargin: 58.144, arTurnover: 16.28 },
  { id: 'SHHQ600008', code: '600008', name: '首创环保', sector: '公用事业', netAssetPerShare: 2.831, netProfitMargin: 17.596, grossMargin: 34.769, arTurnover: 1.502 },
  { id: 'SHHQ600009', code: '600009', name: '上海机场', sector: '交通运输', netAssetPerShare: 16.739, netProfitMargin: 15.636, grossMargin: 21.934, arTurnover: 5.019 },
  { id: 'SHHQ600010', code: '600010', name: '包钢股份', sector: '钢铁', netAssetPerShare: 1.143, netProfitMargin: 0.389, grossMargin: 7.877, arTurnover: 18.253 },
  { id: 'SHHQ600011', code: '600011', name: '华能国际', sector: '电力', netAssetPerShare: 3.647, netProfitMargin: 4.128, grossMargin: 15.145, arTurnover: 5.254 },
  { id: 'SHHQ600017', code: '600017', name: '日照港', sector: '港口', netAssetPerShare: 4.476, netProfitMargin: 7.745, grossMargin: 23.65, arTurnover: 15.396 },
  { id: 'SHHQ600018', code: '600018', name: '上港集团', sector: '港口', netAssetPerShare: 5.726, netProfitMargin: 39.233, grossMargin: 35.505, arTurnover: 12.076 },
  { id: 'SHHQ600019', code: '600019', name: '宝钢股份', sector: '钢铁', netAssetPerShare: 9.122, netProfitMargin: 2.285, grossMargin: 5.454, arTurnover: 22.97 },
  { id: 'SHHQ600020', code: '600020', name: '中原高速', sector: '高速公路', netAssetPerShare: 5.087, netProfitMargin: 12.633, grossMargin: 33.003, arTurnover: 6.905 },
  { id: 'SHHQ600021', code: '600021', name: '上海电力', sector: '电力', netAssetPerShare: 6.881, netProfitMargin: 4.788, grossMargin: 23.474, arTurnover: 1.879 },
  { id: 'SHHQ600022', code: '600022', name: '山东钢铁', sector: '钢铁', netAssetPerShare: 1.756, netProfitMargin: -2.75, grossMargin: 1.736, arTurnover: 191.504 },
  { id: 'SHHQ600023', code: '600023', name: '浙能电力', sector: '电力', netAssetPerShare: 5.468, netProfitMargin: 8.81, grossMargin: 12.159, arTurnover: 7.131 },
  { id: 'SHHQ600025', code: '600025', name: '华能水电', sector: '电力', netAssetPerShare: 3.284, netProfitMargin: 33.346, grossMargin: 56.128, arTurnover: 12.668 },
  { id: 'SHHQ600026', code: '600026', name: '中远海能', sector: '航运', netAssetPerShare: 7.518, netProfitMargin: 17.366, grossMargin: 27.237, arTurnover: 41.721 },
  { id: 'SHHQ600027', code: '600027', name: '华电国际', sector: '电力', netAssetPerShare: 4.137, netProfitMargin: 5.047, grossMargin: 8.782, arTurnover: 9.523 },
  { id: 'SHHQ600028', code: '600028', name: '中国石化', sector: '能源', netAssetPerShare: 6.76, netProfitMargin: 1.636, grossMargin: 15.47, arTurnover: 66.13 },
  { id: 'SHHQ600029', code: '600029', name: '南方航空', sector: '航空', netAssetPerShare: 1.917, netProfitMargin: -0.973, grossMargin: 8.41, arTurnover: 51.356 },
  { id: 'SHHQ600031', code: '600031', name: '三一重工', sector: '工程机械', netAssetPerShare: 8.49, netProfitMargin: 7.683, grossMargin: 26.431, arTurnover: 3.131 },
  { id: 'SHHQ600032', code: '600032', name: '浙江新能', sector: '新能源', netAssetPerShare: 5.17, netProfitMargin: 11.418, grossMargin: 45.642, arTurnover: 0.617 },
  { id: 'SHHQ600033', code: '600033', name: '福建高速', sector: '高速公路', netAssetPerShare: 4.246, netProfitMargin: 25.803, grossMargin: 56.551, arTurnover: 3.874 },
  { id: 'SHHQ600035', code: '600035', name: '楚天高速', sector: '高速公路', netAssetPerShare: 5.36, netProfitMargin: 17.497, grossMargin: 32.195, arTurnover: 15.714 },
  { id: 'SHHQ600037', code: '600037', name: '歌华有线', sector: '传媒', netAssetPerShare: 9.133, netProfitMargin: -3.004, grossMargin: 8.117, arTurnover: 4.298 },
  { id: 'SHHQ600038', code: '600038', name: '中直股份', sector: '国防军工', netAssetPerShare: 19.798, netProfitMargin: 1.867, grossMargin: 10.468, arTurnover: 3.818 },
  { id: 'SHHQ600039', code: '600039', name: '四川路桥', sector: '基建', netAssetPerShare: 5.491, netProfitMargin: 6.723, grossMargin: 15.676, arTurnover: 4.483 },
  { id: 'SHHQ600048', code: '600048', name: '保利发展', sector: '房地产', netAssetPerShare: 16.081, netProfitMargin: 1.605, grossMargin: 13.927, arTurnover: 71.208 },
  { id: 'SHHQ600050', code: '600050', name: '中国联通', sector: '通信', netAssetPerShare: 5.184, netProfitMargin: 2.318, grossMargin: 23.42, arTurnover: 7.985 },
  { id: 'SHHQ600054', code: '600054', name: '黄山旅游', sector: '旅游', netAssetPerShare: 6.385, netProfitMargin: 16.312, grossMargin: 51.776, arTurnover: 61.414 },
  { id: 'SHHQ600055', code: '600055', name: '万东医疗', sector: '医疗器械', netAssetPerShare: 6.781, netProfitMargin: 10.322, grossMargin: 36.554, arTurnover: 4.691 },
  { id: 'SHHQ600059', code: '600059', name: '古越龙山', sector: '食品饮料', netAssetPerShare: 6.467, netProfitMargin: 10.617, grossMargin: 37.159, arTurnover: 10.893 },
  { id: 'SHHQ600062', code: '600062', name: '华润双鹤', sector: '医药', netAssetPerShare: 10.018, netProfitMargin: 14.518, grossMargin: 57.269, arTurnover: 6.419 },
]
