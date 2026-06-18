#include "MqttDeviceService.h"

#include "domain/device/DeviceCommand.h"
#include "infrastructure/logging/LogCategories.h"

#include <QJsonDocument>
#include <QJsonObject>

#include <utility>

namespace hcp::infrastructure {

MqttDeviceService::MqttDeviceService(
    hcp::domain::PanelSettings settings,
    IMqttClient* mqttClient,
    QObject* parent)
    : IDeviceService(parent)
    , m_settings(std::move(settings))
    , m_mqttClient(mqttClient)
{
    m_state.deviceId = m_settings.deviceId;
    if (m_mqttClient) {
        connect(m_mqttClient, &IMqttClient::connected, this, &MqttDeviceService::subscribeDefaultTopics);
        connect(m_mqttClient, &IMqttClient::messageReceived, this, &MqttDeviceService::handleMessage);
        connect(m_mqttClient, &IMqttClient::mqttError, this, &MqttDeviceService::deviceServiceError);
    }
}

void MqttDeviceService::connectToDevice()
{
    if (!m_mqttClient) {
        emit deviceServiceError(QStringLiteral("MQTT 客户端未初始化"));
        return;
    }

    m_mqttClient->connectToBroker(m_settings.mqttHost, m_settings.mqttPort);
}

hcp::domain::DeviceState MqttDeviceService::currentState() const
{
    return m_state;
}

hcp::domain::Result MqttDeviceService::sendCommand(const hcp::domain::DeviceCommand& command)
{
    if (!m_mqttClient) {
        return hcp::domain::Result::failure(QStringLiteral("MQTT 客户端未初始化"));
    }
    const auto payload = QJsonDocument(hcp::domain::toJson(command)).toJson(QJsonDocument::Compact);
    return m_mqttClient->publishMessage(topic("command"), payload);
}

QString MqttDeviceService::topic(const QString& suffix) const
{
    return QStringLiteral("device/%1/%2").arg(m_settings.deviceId, suffix);
}

void MqttDeviceService::subscribeDefaultTopics()
{
    // Qt MQTT 只有连接完成后订阅才可靠；mock 客户端也走同一条路径。
    m_mqttClient->subscribeTopic(topic("state"));
    m_mqttClient->subscribeTopic(topic("alarm"));
}

void MqttDeviceService::handleMessage(const QString& receivedTopic, const QByteArray& payload)
{
    if (receivedTopic == topic("state")) {
        handleStatePayload(payload);
    }
}

void MqttDeviceService::handleStatePayload(const QByteArray& payload)
{
    QJsonParseError error {};
    const auto doc = QJsonDocument::fromJson(payload, &error);
    if (error.error != QJsonParseError::NoError || !doc.isObject()) {
        emit deviceServiceError(QStringLiteral("设备状态 payload 不是合法 JSON"));
        return;
    }

    const auto object = doc.object();
    m_state.temperatureCelsius = object.value("temperatureCelsius").toDouble(m_state.temperatureCelsius);
    m_state.loadPercent = object.value("loadPercent").toDouble(m_state.loadPercent);
    m_state.networkOnline = object.value("networkOnline").toBool(m_state.networkOnline);
    m_state.updatedAt = QDateTime::currentDateTimeUtc();

    const auto mode = object.value("mode").toString();
    if (mode == "running") m_state.mode = hcp::domain::DeviceMode::Running;
    else if (mode == "maintenance") m_state.mode = hcp::domain::DeviceMode::Maintenance;
    else if (mode == "fault") m_state.mode = hcp::domain::DeviceMode::Fault;
    else m_state.mode = hcp::domain::DeviceMode::Standby;

    emit deviceStateChanged(m_state);
}

} // namespace hcp::infrastructure
