#include "domain/device/DeviceCommand.h"

#include <QStringList>

bool runMqttCommandParseTest(QStringList* errors)
{
    using namespace hcp::domain;

    bool ok = false;
    const auto command = parseCommandPayload(
        R"({"type":"resetFault","requestId":"r-1","payload":{"source":"test"}})",
        &ok);

    if (!ok) {
        errors->append(QStringLiteral("合法 MQTT command payload 应解析成功"));
    }
    if (command.type != DeviceCommandType::ResetFault) {
        errors->append(QStringLiteral("resetFault 应映射为 DeviceCommandType::ResetFault"));
    }
    if (command.requestId != "r-1") {
        errors->append(QStringLiteral("requestId 应保持原值"));
    }

    bool invalidOk = true;
    parseCommandPayload("not-json", &invalidOk);
    if (invalidOk) {
        errors->append(QStringLiteral("非法 MQTT command payload 应解析失败"));
    }

    return errors->isEmpty();
}

