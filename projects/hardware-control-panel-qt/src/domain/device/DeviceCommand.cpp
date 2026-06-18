#include "DeviceCommand.h"

#include <QJsonDocument>

namespace hcp::domain {

namespace {
DeviceCommandType commandTypeFromString(const QString& type)
{
    if (type == "start") return DeviceCommandType::Start;
    if (type == "stop") return DeviceCommandType::Stop;
    if (type == "resetFault") return DeviceCommandType::ResetFault;
    return DeviceCommandType::ApplySettings;
}

QString commandTypeToString(DeviceCommandType type)
{
    switch (type) {
    case DeviceCommandType::Start: return "start";
    case DeviceCommandType::Stop: return "stop";
    case DeviceCommandType::ResetFault: return "resetFault";
    case DeviceCommandType::ApplySettings: return "applySettings";
    }
    return "start";
}
}

DeviceCommand parseCommandPayload(const QByteArray& payload, bool* ok)
{
    QJsonParseError error {};
    const auto doc = QJsonDocument::fromJson(payload, &error);
    if (ok) {
        *ok = error.error == QJsonParseError::NoError && doc.isObject();
    }
    if (error.error != QJsonParseError::NoError || !doc.isObject()) {
        return {};
    }

    const auto object = doc.object();
    return {
        commandTypeFromString(object.value("type").toString("start")),
        object.value("requestId").toString(),
        object.value("payload").toObject(),
    };
}

QJsonObject toJson(const DeviceCommand& command)
{
    return {
        { "type", commandTypeToString(command.type) },
        { "requestId", command.requestId },
        { "payload", command.payload },
    };
}

} // namespace hcp::domain

