# MQTT 协议

## Topic 约定

默认 topic 结构：

```text
device/{deviceId}/state
device/{deviceId}/command
device/{deviceId}/alarm
```

示例：

```text
device/panel-001/state
device/panel-001/command
device/panel-001/alarm
```

`deviceId` 来自 `PanelSettings`，同一套 UI 模板可以部署到多台设备。

## 状态消息

topic：`device/{deviceId}/state`

```json
{
  "mode": "running",
  "temperatureCelsius": 42.5,
  "loadPercent": 67.0,
  "networkOnline": true
}
```

字段建议：

- `mode`：`standby`、`running`、`maintenance`、`fault`
- `temperatureCelsius`：设备温度
- `loadPercent`：负载百分比
- `networkOnline`：设备侧网络状态

## 命令消息

topic：`device/{deviceId}/command`

```json
{
  "type": "start",
  "requestId": "uuid",
  "payload": {}
}
```

命令类型：

- `start`
- `stop`
- `resetFault`
- `applySettings`

建议真实项目增加命令回执 topic，例如：

```text
device/{deviceId}/commandAck
```

回执中包含 `requestId`、`accepted`、`errorCode`、`message`，用于 UI 显示操作结果。

## 告警消息

topic：`device/{deviceId}/alarm`

```json
{
  "id": "alarm-001",
  "severity": "critical",
  "title": "温度过高",
  "detail": "主控板温度超过阈值",
  "acknowledged": false,
  "occurredAt": "2026-06-18T10:00:00Z"
}
```

告警建议分为：

- `info`：提示
- `warning`：需要关注
- `critical`：需要立即处理

## 可靠性建议

- command 建议使用 QoS 1。
- state 可以使用 QoS 0 或 QoS 1，取决于刷新频率。
- alarm 建议使用 QoS 1，并在服务端保留告警历史。
- 客户端断线重连后应恢复订阅。
- UI 不应把“MQTT 连接成功”当成“设备可控”，设备状态需要独立心跳或更新时间判断。

