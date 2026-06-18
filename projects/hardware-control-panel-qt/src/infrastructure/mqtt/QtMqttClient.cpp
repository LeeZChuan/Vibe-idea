#include "QtMqttClient.h"

#include "infrastructure/logging/LogCategories.h"

#include <QMqttSubscription>

namespace hcp::infrastructure {

QtMqttClient::QtMqttClient(QObject* parent)
    : IMqttClient(parent)
{
    connect(&m_client, &QMqttClient::connected, this, [this] {
        qCInfo(logMqtt) << "MQTT broker connected";
        emit connected();
    });
    connect(&m_client, &QMqttClient::disconnected, this, [this] {
        qCWarning(logMqtt) << "MQTT broker disconnected";
        emit disconnected();
    });
    connect(&m_client, &QMqttClient::messageReceived, this, [this](const QByteArray& message, const QMqttTopicName& topic) {
        emit messageReceived(topic.name(), message);
    });
    connect(&m_client, &QMqttClient::errorChanged, this, [this](QMqttClient::ClientError error) {
        if (error != QMqttClient::NoError) {
            emit mqttError(QStringLiteral("MQTT error code: %1").arg(static_cast<int>(error)));
        }
    });
}

void QtMqttClient::connectToBroker(const QString& host, quint16 port)
{
    m_client.setHostname(host);
    m_client.setPort(port);
    m_client.connectToHost();
}

void QtMqttClient::disconnectFromBroker()
{
    m_client.disconnectFromHost();
}

hcp::domain::Result QtMqttClient::subscribeTopic(const QString& topic)
{
    // 生产项目应在这里记录订阅对象，便于断线重连后恢复订阅。
    auto* subscription = m_client.subscribe(QMqttTopicFilter(topic));
    if (!subscription) {
        return hcp::domain::Result::failure(QStringLiteral("订阅 MQTT topic 失败: %1").arg(topic));
    }
    return hcp::domain::Result::success();
}

hcp::domain::Result QtMqttClient::publishMessage(const QString& topic, const QByteArray& payload)
{
    const auto id = m_client.publish(QMqttTopicName(topic), payload);
    if (id < 0) {
        return hcp::domain::Result::failure(QStringLiteral("发布 MQTT 消息失败: %1").arg(topic));
    }
    return hcp::domain::Result::success();
}

} // namespace hcp::infrastructure

