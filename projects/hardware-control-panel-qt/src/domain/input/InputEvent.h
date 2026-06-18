#pragma once

#include <QMetaType>
#include <QString>
#include <QtGlobal>

namespace hcp::domain {

enum class InputSource {
    Key,
    RotaryEncoder,
};

enum class InputAction {
    Pressed,
    Released,
    Repeated,
    LongPressed,
    RotateLeft,
    RotateRight,
};

enum class PanelIntent {
    None,
    NavigateUp,
    NavigateDown,
    NavigateLeft,
    NavigateRight,
    Confirm,
    Back,
    OpenMenu,
    AcknowledgeAlarm,
};

struct InputEvent {
    InputSource source { InputSource::Key };
    InputAction action { InputAction::Pressed };
    QString code;
    qint64 timestampMs { 0 };
};

PanelIntent mapInputToIntent(const InputEvent& event);
QString toString(PanelIntent intent);

} // namespace hcp::domain

Q_DECLARE_METATYPE(hcp::domain::InputEvent)
Q_DECLARE_METATYPE(hcp::domain::PanelIntent)
