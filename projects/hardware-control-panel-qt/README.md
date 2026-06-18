# hardware-control-panel-qt

这是一个面向嵌入式 Linux 板卡/工控屏的 Qt/QML 硬件控制面板架构模板，用来沉淀“显示 + 按键/旋钮操控 + MQTT 设备通信”的通用工程结构。

它不是完整量产固件，而是一个可复制、可裁剪的模板：先把目录边界、接口定义、数据流和移植点固定下来，再按具体硬件替换 evdev、MQTT、配置、日志、OTA 等实现。

## 技术栈

- Qt 6.5 LTS
- C++20
- CMake
- QML 显示层
- C++ 领域层、设备服务、输入适配和 MQTT 适配
- Linux evdev 作为按键/旋钮输入后端
- Qt MQTT 作为 MQTT 客户端

## 适用场景

- 工控屏、控制盒、仪器仪表、网关面板
- 屏幕分辨率固定或接近固定的板端 UI
- 操控以按键、旋钮、编码器为主，触控不是第一优先级
- 本地 UI 通过 MQTT 和设备服务、边缘进程或控制器通信

## 目录结构

```text
hardware-control-panel-qt/
├── CMakeLists.txt
├── config/                         # 本地开发和板端配置样例
├── docs/                           # 架构、输入、协议、移植文档
├── platform/
│   └── systemd/                    # Linux 自启动服务样例
├── src/
│   ├── app/                        # 应用启动、依赖组装、生命周期
│   ├── domain/                     # 领域模型、状态、命令、端口接口
│   ├── infrastructure/             # MQTT、evdev、配置、日志等适配器
│   ├── platform/                   # Linux 路径、权限、系统能力封装
│   ├── presentation/               # ViewModel、页面导航、状态映射
│   ├── ui/                         # QML 页面、组件、主题
│   └── main.cpp
└── tests/                          # 领域逻辑和协议解析测试骨架
```

## 快速开始

如果本机没有 Qt 6.5 环境，可以直接阅读和复用目录、接口、文档，不需要构建。

如果已经安装 Qt 6.5、Qt MQTT 和 CMake：

```bash
cmake -S . -B build -DCMAKE_PREFIX_PATH=/path/to/Qt/6.5/gcc_64
cmake --build build
ctest --test-dir build
```

运行应用：

```bash
./build/src/hardware-control-panel
```

默认配置使用 `MockInputDevice` 和 `MockMqttClient`，没有真实输入设备和 broker 也能理解数据流。真实板端部署时，把 `config/panel-settings.example.json` 中的 `useMockInput`、`useMockMqtt` 改为 `false`，并配置 `inputDevicePath`、`mqttHost`、`mqttPort`。

## 核心接口

- `IInputDevice`：把 evdev、GPIO 或模拟输入统一成 `InputEvent`。
- `IMqttClient`：隔离 Qt MQTT，后续可以替换成 Paho 或本地 IPC bridge。
- `IDeviceService`：设备状态读取、命令发送、错误上报。
- `ISettingsStore`：配置读取、保存、默认值恢复。

## 默认数据流

```text
evdev/mock input
  -> IInputDevice
  -> InputEvent
  -> PanelIntent
  -> NavigationController
  -> PanelViewModel
  -> QML pages

MQTT state/alarm
  -> IMqttClient
  -> MqttDeviceService
  -> DeviceState
  -> PanelViewModel
  -> QML pages

QML action
  -> PanelViewModel
  -> DeviceCommand
  -> MqttDeviceService
  -> device/{deviceId}/command
```

## 文档

- [架构设计](docs/architecture.md)
- [输入设计](docs/input-design.md)
- [MQTT 协议](docs/mqtt-protocol.md)
- [移植指南](docs/porting-guide.md)

## 设计约束

- UI 页面不要直接读 `/dev/input/event*`，只消费 ViewModel 暴露的状态和动作。
- 领域层不要依赖 Qt MQTT、evdev、systemd 等具体技术。
- 配置项由 `PanelSettings` 统一承载，真实板卡路径通过配置注入。
- 不把该 Qt 工程加入根目录 npm scripts，避免影响现有前端项目。

