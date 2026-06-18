#pragma once

#include "domain/input/IInputDevice.h"

#include <QTimer>

namespace hcp::infrastructure {

class MockInputDevice final : public hcp::domain::IInputDevice {
    Q_OBJECT

public:
    explicit MockInputDevice(QObject* parent = nullptr);

    void start() override;
    void stop() override;
    Q_INVOKABLE void injectIntent(const QString& intentName);

private:
    QTimer m_demoTimer;
};

} // namespace hcp::infrastructure

