#pragma once

#include "domain/common/Result.h"
#include "domain/device/DeviceCommand.h"
#include "domain/device/DeviceState.h"

#include <QObject>

namespace hcp::domain {

class IDeviceService : public QObject {
    Q_OBJECT

public:
    explicit IDeviceService(QObject* parent = nullptr)
        : QObject(parent)
    {
    }
    ~IDeviceService() override = default;

    virtual void connectToDevice() = 0;
    virtual DeviceState currentState() const = 0;
    virtual Result sendCommand(const DeviceCommand& command) = 0;

signals:
    void deviceStateChanged(const hcp::domain::DeviceState& state);
    void deviceServiceError(const QString& message);
};

} // namespace hcp::domain

