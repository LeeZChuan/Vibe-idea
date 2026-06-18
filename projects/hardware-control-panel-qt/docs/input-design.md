# 输入设计

## 目标

板端按键、旋钮、编码器的差异很大，UI 不应该直接依赖硬件事件。本模板把输入分为三层：

```text
Linux evdev/GPIO/mock
  -> InputEvent
  -> PanelIntent
  -> UI navigation/action
```

## InputEvent

`InputEvent` 描述硬件输入事实：

- `source`：`Key` 或 `RotaryEncoder`
- `action`：按下、释放、重复、长按、左旋、右旋
- `code`：统一后的输入码，如 `KEY_ENTER`、`KEY_BACK`、`ROTARY_0`
- `timestampMs`：事件时间戳

真实项目建议把 Linux key code 到业务 code 的映射放到配置文件中，避免不同板卡改代码。

## PanelIntent

`PanelIntent` 描述 UI 意图：

- `NavigateUp`
- `NavigateDown`
- `NavigateLeft`
- `NavigateRight`
- `Confirm`
- `Back`
- `OpenMenu`
- `AcknowledgeAlarm`

QML 和 ViewModel 只关心意图，不关心底层来自 evdev、GPIO 还是测试注入。

## evdev 接入

`EvdevInputDevice` 使用 `/dev/input/event*`。真实板端需要处理：

- 设备路径通过配置注入，不硬编码。
- 运行用户需要读取 input 设备的权限，常见做法是加入 `input` group。
- 按键码映射表应按硬件版本管理。
- 旋钮可能上报 `EV_REL`，也可能以两个 GPIO 相位信号上报，需要适配。

## 消抖、长按、重复

模板只预留字段和事件类型，量产时建议在输入适配层实现：

- 消抖：同一按键在 20-50ms 内重复变化可合并。
- 长按：按下持续超过 `longPressMs` 后发出 `LongPressed`。
- 重复：长按后按 `keyRepeatMs` 周期发出 `Repeated`。
- 释放：释放事件用于停止重复和恢复 UI 状态。

这些规则应在 `IInputDevice` 实现中完成，避免每个页面重复处理。

## 焦点导航

按键/旋钮为主的界面必须有稳定焦点模型：

- 页面之间的切换由 `NavigationController` 管理。
- 页面内部复杂控件应增加局部焦点控制器。
- 焦点移动不能依赖鼠标 hover。
- 告警确认、返回、菜单等全局键应优先于页面局部操作。

