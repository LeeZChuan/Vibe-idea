#pragma once

#include "domain/input/IInputDevice.h"

#include <QFile>
#include <QSocketNotifier>

#include <memory>

namespace hcp::infrastructure {

class EvdevInputDevice final : public hcp::domain::IInputDevice {
    Q_OBJECT

public:
    explicit EvdevInputDevice(QString devicePath, QObject* parent = nullptr);

    void start() override;
    void stop() override;

private:
    void readAvailableEvents();

    QString m_devicePath;
    QFile m_deviceFile;
    std::unique_ptr<QSocketNotifier> m_notifier;
};

} // namespace hcp::infrastructure

