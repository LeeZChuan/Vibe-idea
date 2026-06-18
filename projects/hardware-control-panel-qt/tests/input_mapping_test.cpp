#include "domain/input/InputEvent.h"

#include <QStringList>

bool runInputMappingTest(QStringList* errors)
{
    using namespace hcp::domain;

    const InputEvent rotateRight {
        InputSource::RotaryEncoder,
        InputAction::RotateRight,
        QStringLiteral("ROTARY_0"),
        0,
    };
    if (mapInputToIntent(rotateRight) != PanelIntent::NavigateDown) {
        errors->append(QStringLiteral("旋钮右转应映射为 NavigateDown"));
    }

    const InputEvent enter {
        InputSource::Key,
        InputAction::Pressed,
        QStringLiteral("KEY_ENTER"),
        0,
    };
    if (mapInputToIntent(enter) != PanelIntent::Confirm) {
        errors->append(QStringLiteral("KEY_ENTER 应映射为 Confirm"));
    }

    return errors->isEmpty();
}

