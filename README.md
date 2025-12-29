# Vibe-idea

这个仓库用于存放 **vibecode 的 idea**，根目录下可能会有多个独立子项目（每个子项目一个文件夹）。

## 项目列表

| 项目 | 路径 | 说明 | 启动 | 打包构建 | 本地预览 |
| --- | --- | --- | --- | --- | --- |
| three-scatter | `projects/three-scatter` | React18 + three.js(WebGL) 三维散点图 | `npm run dev:three-scatter` | `npm run build:three-scatter` | `npm run preview:three-scatter` |

## 根目录统一命令（npm workspaces）

- 启动默认项目：`npm run dev`
- 构建默认项目：`npm run build`
- 预览默认项目：`npm run preview`

> 说明：根目录使用 npm workspaces 管理 `projects/*` 下的子项目。后续新增项目时，只需在 `projects/` 下创建新文件夹，并在此 README 表格中登记即可。


