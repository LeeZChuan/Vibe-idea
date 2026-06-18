#include "JsonSettingsStore.h"

#include <QFile>
#include <QJsonDocument>
#include <QJsonObject>

#include <utility>

namespace hcp::infrastructure {

JsonSettingsStore::JsonSettingsStore(QString filePath, QObject* parent)
    : ISettingsStore(parent)
    , m_filePath(std::move(filePath))
{
}

hcp::domain::PanelSettings JsonSettingsStore::load()
{
    QFile file(m_filePath);
    if (!file.open(QIODevice::ReadOnly)) {
        return defaults();
    }

    QJsonParseError error {};
    const auto doc = QJsonDocument::fromJson(file.readAll(), &error);
    if (error.error != QJsonParseError::NoError || !doc.isObject()) {
        return defaults();
    }

    const auto object = doc.object();
    auto settings = defaults();
    settings.deviceId = object.value("deviceId").toString(settings.deviceId);
    settings.mqttHost = object.value("mqttHost").toString(settings.mqttHost);
    settings.mqttPort = static_cast<quint16>(object.value("mqttPort").toInt(settings.mqttPort));
    settings.inputDevicePath = object.value("inputDevicePath").toString(settings.inputDevicePath);
    settings.longPressMs = object.value("longPressMs").toInt(settings.longPressMs);
    settings.keyRepeatMs = object.value("keyRepeatMs").toInt(settings.keyRepeatMs);
    settings.useMockInput = object.value("useMockInput").toBool(settings.useMockInput);
    settings.useMockMqtt = object.value("useMockMqtt").toBool(settings.useMockMqtt);
    return settings;
}

hcp::domain::Result JsonSettingsStore::save(const hcp::domain::PanelSettings& settings)
{
    QFile file(m_filePath);
    if (!file.open(QIODevice::WriteOnly | QIODevice::Truncate)) {
        return hcp::domain::Result::failure(QStringLiteral("无法写入配置文件: %1").arg(m_filePath));
    }

    QJsonObject object {
        { "deviceId", settings.deviceId },
        { "mqttHost", settings.mqttHost },
        { "mqttPort", settings.mqttPort },
        { "inputDevicePath", settings.inputDevicePath },
        { "longPressMs", settings.longPressMs },
        { "keyRepeatMs", settings.keyRepeatMs },
        { "useMockInput", settings.useMockInput },
        { "useMockMqtt", settings.useMockMqtt },
    };
    file.write(QJsonDocument(object).toJson(QJsonDocument::Indented));
    emit settingsChanged(settings);
    return hcp::domain::Result::success();
}

hcp::domain::PanelSettings JsonSettingsStore::defaults() const
{
    return {};
}

} // namespace hcp::infrastructure
