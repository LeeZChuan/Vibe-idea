#pragma once

#include "domain/input/InputEvent.h"

#include <QObject>

namespace hcp::domain {

class IInputDevice : public QObject {
    Q_OBJECT

public:
    explicit IInputDevice(QObject* parent = nullptr)
        : QObject(parent)
    {
    }
    ~IInputDevice() override = default;

    virtual void start() = 0;
    virtual void stop() = 0;

signals:
    void inputEventReceived(const hcp::domain::InputEvent& event);
    void inputDeviceError(const QString& message);
};

} // namespace hcp::domain

