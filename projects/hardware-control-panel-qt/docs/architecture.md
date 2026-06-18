# 架构设计

## 总体思路

模板采用 MVVM + Ports/Adapters + 状态机的组合：

- QML 只负责显示和基础交互，不包含设备协议和硬件输入细节。
- `presentation` 把领域状态转换成 UI 可绑定的属性。
- `domain` 定义业务模型、命令、状态和端口接口。
- `infrastructure` 实现 MQTT、evdev、JSON 配置等外部适配。
- `app` 负责依赖装配和生命周期启动。

这种结构适合板端项目长期演进：更换输入硬件、MQTT 客户端、配置路径或 UI 样式时，不需要推翻领域模型。

## 分层职责

`app/`

应用入口后的第一层，负责读取配置、选择 mock/真实适配器、创建 ViewModel、启动输入设备和设备通信。不要在这里写具体业务规则。

`ui/`

QML 页面、组件和主题。页面通过 `panelViewModel` 获取状态和执行动作。页面不直接订阅 MQTT，也不直接处理 Linux input_event。

`presentation/`

UI 状态映射层。`PanelViewModel` 暴露 QML 属性，`NavigationController` 维护页面导航。按键和旋钮输入先转换成 `PanelIntent`，再改变页面或触发命令。

`domain/`

稳定的业务核心。包含设备状态、设备命令、告警、设置、输入事件和端口接口。领域层可以使用 Qt Core 类型，但不依赖 Qt MQTT、QML 或 Linux 头文件。

`infrastructure/`

外部技术适配层。`EvdevInputDevice` 处理 `/dev/input/event*`，`QtMqttClient` 封装 Qt MQTT，`JsonSettingsStore` 处理本地配置文件。

`platform/`

Linux 板端路径、权限、systemd、设备目录等能力封装。模板默认用用户配置目录，真实部署时可改为 `/etc/hardware-control-panel/panel-settings.json`。

## 状态流

设备状态从 MQTT 进入 `MqttDeviceService`，解析为 `DeviceState` 后通知 `PanelViewModel`，QML 通过属性绑定刷新页面。

输入事件从 evdev 或 mock 进入 `IInputDevice`，统一成 `InputEvent`，再映射为 `PanelIntent`。UI 导航只依赖意图，不依赖具体按键码。

用户在 QML 中触发启动、停止、复位等动作时，`PanelViewModel` 创建 `DeviceCommand`，交给 `IDeviceService` 发布到 MQTT command topic。

## 扩展建议

- 新增设备功能时，先补领域模型和命令，再补 MQTT payload 和 ViewModel 属性。
- 新增页面时，优先复用 `NavigationController`，不要让页面自己维护全局路由。
- 新增输入硬件时，实现新的 `IInputDevice`，不要修改 QML 页面。
- 新增协议时，实现新的 `IDeviceService`，保持 UI 和领域模型稳定。

