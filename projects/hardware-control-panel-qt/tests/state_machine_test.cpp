#include "domain/device/DeviceState.h"

#include <QStringList>

bool runStateMachineTest(QStringList* errors)
{
    using namespace hcp::domain;

    DeviceState state;
    if (state.mode != DeviceMode::Standby) {
        errors->append(QStringLiteral("设备默认状态应为 Standby"));
    }

    state.mode = DeviceMode::Fault;
    if (toString(state.mode) != "Fault") {
        errors->append(QStringLiteral("Fault 模式应能转换为可显示文本"));
    }

    return errors->isEmpty();
}

