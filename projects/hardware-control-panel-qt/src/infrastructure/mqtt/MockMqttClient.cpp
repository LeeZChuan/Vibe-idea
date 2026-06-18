#include "MockMqttClient.h"

#include <QTimer>

namespace hcp::infrastructure {

MockMqttClient::MockMqttClient(QObject* parent)
    : IMqttClient(parent)
{
}

void MockMqttClient::connectToBroker(const QString& host, quint16 port)
{
    Q_UNUSED(host)
    Q_UNUSED(port)
    m_connected = true;
    QTimer::singleShot(0, this, &MockMqttClient::connected);
}

void MockMqttClient::disconnectFromBroker()
{
    m_connected = false;
    emit disconnected();
}

hcp::domain::Result MockMqttClient::subscribeTopic(const QString& topic)
{
    m_topics.insert(topic);
    return hcp::domain::Result::success();
}

hcp::domain::Result MockMqttClient::publishMessage(const QString& topic, const QByteArray& payload)
{
    if (!m_connected) {
        return hcp::domain::Result::failure(QStringLiteral("Mock MQTT 尚未连接"));
    }
    emit messageReceived(topic, payload);
    return hcp::domain::Result::success();
}

void MockMqttClient::injectMessage(const QString& topic, const QByteArray& payload)
{
    emit messageReceived(topic, payload);
}

} // namespace hcp::infrastructure

