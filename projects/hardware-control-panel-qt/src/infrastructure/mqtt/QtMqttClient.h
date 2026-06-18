#pragma once

#include "infrastructure/mqtt/IMqttClient.h"

#include <QMqttClient>
#include <QPointer>

namespace hcp::infrastructure {

class QtMqttClient final : public IMqttClient {
    Q_OBJECT

public:
    explicit QtMqttClient(QObject* parent = nullptr);

    void connectToBroker(const QString& host, quint16 port) override;
    void disconnectFromBroker() override;
    hcp::domain::Result subscribeTopic(const QString& topic) override;
    hcp::domain::Result publishMessage(const QString& topic, const QByteArray& payload) override;

private:
    QMqttClient m_client;
};

} // namespace hcp::infrastructure

