#pragma once

#include <QDateTime>
#include <QMetaType>
#include <QString>

namespace hcp::domain {

enum class DeviceMode {
    Standby,
    Running,
    Maintenance,
    Fault,
};

struct DeviceState {
    QString deviceId { "panel-001" };
    DeviceMode mode { DeviceMode::Standby };
    double temperatureCelsius { 0.0 };
    double loadPercent { 0.0 };
    bool networkOnline { false };
    QDateTime updatedAt;
};

QString toString(DeviceMode mode);

} // namespace hcp::domain

Q_DECLARE_METATYPE(hcp::domain::DeviceState)

