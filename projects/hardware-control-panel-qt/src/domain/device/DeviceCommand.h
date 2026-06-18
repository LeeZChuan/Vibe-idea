#pragma once

#include <QByteArray>
#include <QJsonObject>
#include <QMetaType>
#include <QString>

namespace hcp::domain {

enum class DeviceCommandType {
    Start,
    Stop,
    ResetFault,
    ApplySettings,
};

struct DeviceCommand {
    DeviceCommandType type { DeviceCommandType::Start };
    QString requestId;
    QJsonObject payload;
};

DeviceCommand parseCommandPayload(const QByteArray& payload, bool* ok);
QJsonObject toJson(const DeviceCommand& command);

} // namespace hcp::domain

Q_DECLARE_METATYPE(hcp::domain::DeviceCommand)
