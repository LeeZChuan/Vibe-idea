#pragma once

#include "domain/device/IDeviceService.h"
#include "domain/settings/PanelSettings.h"
#include "infrastructure/mqtt/IMqttClient.h"

#include <QPointer>

namespace hcp::infrastructure {

class MqttDeviceService final : public hcp::domain::IDeviceService {
    Q_OBJECT

public:
    MqttDeviceService(
        hcp::domain::PanelSettings settings,
        IMqttClient* mqttClient,
        QObject* parent = nullptr);

    void connectToDevice() override;
    hcp::domain::DeviceState currentState() const override;
    hcp::domain::Result sendCommand(const hcp::domain::DeviceCommand& command) override;

private:
    QString topic(const QString& suffix) const;
    void subscribeDefaultTopics();
    void handleMessage(const QString& topic, const QByteArray& payload);
    void handleStatePayload(const QByteArray& payload);

    hcp::domain::PanelSettings m_settings;
    QPointer<IMqttClient> m_mqttClient;
    hcp::domain::DeviceState m_state;
};

} // namespace hcp::infrastructure
