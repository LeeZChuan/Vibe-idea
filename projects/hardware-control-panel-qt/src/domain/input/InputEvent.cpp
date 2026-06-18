#include "InputEvent.h"

namespace hcp::domain {

PanelIntent mapInputToIntent(const InputEvent& event)
{
    // 这里是“统一输入语义层”：evdev/GPIO/模拟器都先转成 InputEvent，
    // 再映射成 UI 能理解的意图，避免页面直接依赖硬件按键码。
    if (event.action == InputAction::RotateLeft) {
        return PanelIntent::NavigateUp;
    }
    if (event.action == InputAction::RotateRight) {
        return PanelIntent::NavigateDown;
    }
    if (event.action == InputAction::Pressed || event.action == InputAction::LongPressed) {
        if (event.code == "KEY_UP") return PanelIntent::NavigateUp;
        if (event.code == "KEY_DOWN") return PanelIntent::NavigateDown;
        if (event.code == "KEY_LEFT") return PanelIntent::NavigateLeft;
        if (event.code == "KEY_RIGHT") return PanelIntent::NavigateRight;
        if (event.code == "KEY_ENTER") return PanelIntent::Confirm;
        if (event.code == "KEY_BACK") return PanelIntent::Back;
        if (event.code == "KEY_MENU") return PanelIntent::OpenMenu;
        if (event.code == "KEY_ALARM_ACK") return PanelIntent::AcknowledgeAlarm;
    }
    return PanelIntent::None;
}

QString toString(PanelIntent intent)
{
    switch (intent) {
    case PanelIntent::NavigateUp: return "NavigateUp";
    case PanelIntent::NavigateDown: return "NavigateDown";
    case PanelIntent::NavigateLeft: return "NavigateLeft";
    case PanelIntent::NavigateRight: return "NavigateRight";
    case PanelIntent::Confirm: return "Confirm";
    case PanelIntent::Back: return "Back";
    case PanelIntent::OpenMenu: return "OpenMenu";
    case PanelIntent::AcknowledgeAlarm: return "AcknowledgeAlarm";
    case PanelIntent::None:
    default:
        return "None";
    }
}

} // namespace hcp::domain

