#pragma once

#include "domain/common/Result.h"

#include <QObject>
#include <QString>

namespace hcp::infrastructure {

class IMqttClient : public QObject {
    Q_OBJECT

public:
    explicit IMqttClient(QObject* parent = nullptr)
        : QObject(parent)
    {
    }
    ~IMqttClient() override = default;

    virtual void connectToBroker(const QString& host, quint16 port) = 0;
    virtual void disconnectFromBroker() = 0;
    virtual hcp::domain::Result subscribeTopic(const QString& topic) = 0;
    virtual hcp::domain::Result publishMessage(const QString& topic, const QByteArray& payload) = 0;

signals:
    void connected();
    void disconnected();
    void messageReceived(const QString& topic, const QByteArray& payload);
    void mqttError(const QString& message);
};

} // namespace hcp::infrastructure

