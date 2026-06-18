#pragma once

#include <QMetaType>
#include <QString>
#include <QtGlobal>

namespace hcp::domain {

struct PanelSettings {
    QString deviceId { "panel-001" };
    QString mqttHost { "127.0.0.1" };
    quint16 mqttPort { 1883 };
    QString inputDevicePath { "/dev/input/event0" };
    int longPressMs { 800 };
    int keyRepeatMs { 250 };
    bool useMockInput { true };
    bool useMockMqtt { true };
};

} // namespace hcp::domain

Q_DECLARE_METATYPE(hcp::domain::PanelSettings)
