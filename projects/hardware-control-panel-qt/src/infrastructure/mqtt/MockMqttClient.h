#pragma once

#include "infrastructure/mqtt/IMqttClient.h"

#include <QSet>

namespace hcp::infrastructure {

class MockMqttClient final : public IMqttClient {
    Q_OBJECT

public:
    explicit MockMqttClient(QObject* parent = nullptr);

    void connectToBroker(const QString& host, quint16 port) override;
    void disconnectFromBroker() override;
    hcp::domain::Result subscribeTopic(const QString& topic) override;
    hcp::domain::Result publishMessage(const QString& topic, const QByteArray& payload) override;

    void injectMessage(const QString& topic, const QByteArray& payload);

private:
    bool m_connected { false };
    QSet<QString> m_topics;
};

} // namespace hcp::infrastructure

