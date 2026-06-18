# 移植指南

## 1. 确认 Qt 运行环境

目标板卡需要 Qt 6.5 LTS、Qt Quick、Qt QML、Qt MQTT。常见显示后端：

- `eglfs`：单应用全屏设备，推荐用于嵌入式控制面板。
- `wayland`：有 compositor 或多应用窗口需求。
- `xcb`：桌面 Linux 调试使用。

systemd 样例中默认使用：

```text
QT_QPA_PLATFORM=eglfs
```

## 2. 配置输入设备

确认输入设备：

```bash
ls -l /dev/input/
cat /proc/bus/input/devices
```

把实际路径写入配置：

```json
{
  "inputDevicePath": "/dev/input/event2",
  "useMockInput": false
}
```

运行用户需要 input 权限：

```bash
sudo usermod -aG input panel
```

如果硬件不是 evdev，而是 GPIO 按键矩阵，新增一个 `GpioInputDevice` 实现 `IInputDevice`，不要改 QML 页面。

## 3. 配置 MQTT

把 broker 地址写入配置：

```json
{
  "mqttHost": "192.168.1.10",
  "mqttPort": 1883,
  "useMockMqtt": false
}
```

如果 broker 需要用户名、密码、TLS，扩展 `PanelSettings` 和 `QtMqttClient`。不要把认证信息写死在代码里。

## 4. 替换部署路径

模板默认把配置放在 Qt 用户配置目录，便于本地开发。量产建议：

- 配置：`/etc/hardware-control-panel/panel-settings.json`
- 程序：`/opt/hardware-control-panel/bin/hardware-control-panel`
- 日志：`/var/log/hardware-control-panel/`

这些路径集中放在 `platform/linux/LinuxDevicePaths`，也可以由命令行参数或环境变量覆盖。

## 5. 安装 systemd 服务

参考：

```bash
sudo cp platform/systemd/hardware-control-panel.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable hardware-control-panel
sudo systemctl start hardware-control-panel
```

真实项目需要根据板卡用户、安装目录、显示后端和环境变量调整 service 文件。

## 6. 量产前补齐

- 命令回执和错误码
- MQTT 断线重连后的订阅恢复
- 告警确认和历史告警
- 配置版本迁移
- 日志轮转和导出
- 看门狗或 systemd watchdog
- OTA/回滚策略
- UI 分辨率适配和焦点遍历测试

