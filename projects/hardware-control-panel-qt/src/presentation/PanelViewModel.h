#pragma once

#include "domain/device/DeviceState.h"
#include "domain/input/IInputDevice.h"
#include "domain/device/IDeviceService.h"
#include "presentation/NavigationController.h"

#include <QObject>
#include <QPointer>

namespace hcp::presentation {

class PanelViewModel final : public QObject {
    Q_OBJECT
    Q_PROPERTY(QString currentPage READ currentPage NOTIFY currentPageChanged)
    Q_PROPERTY(QString pageTitle READ pageTitle NOTIFY currentPageChanged)
    Q_PROPERTY(QString modeText READ modeText NOTIFY deviceStateChanged)
    Q_PROPERTY(double temperatureCelsius READ temperatureCelsius NOTIFY deviceStateChanged)
    Q_PROPERTY(double loadPercent READ loadPercent NOTIFY deviceStateChanged)
    Q_PROPERTY(bool networkOnline READ networkOnline NOTIFY deviceStateChanged)
    Q_PROPERTY(QString lastInputIntent READ lastInputIntent NOTIFY lastInputIntentChanged)
    Q_PROPERTY(QString lastError READ lastError NOTIFY lastErrorChanged)

public:
    PanelViewModel(
        hcp::domain::IInputDevice* inputDevice,
        hcp::domain::IDeviceService* deviceService,
        NavigationController* navigationController,
        QObject* parent = nullptr);

    QString currentPage() const;
    QString pageTitle() const;
    QString modeText() const;
    double temperatureCelsius() const;
    double loadPercent() const;
    bool networkOnline() const;
    QString lastInputIntent() const;
    QString lastError() const;

    Q_INVOKABLE void startDevice();
    Q_INVOKABLE void stopDevice();
    Q_INVOKABLE void resetFault();
    Q_INVOKABLE void navigate(const QString& direction);

signals:
    void currentPageChanged();
    void deviceStateChanged();
    void lastInputIntentChanged();
    void lastErrorChanged();

private:
    void handleInputEvent(const hcp::domain::InputEvent& event);
    void updateDeviceState(const hcp::domain::DeviceState& state);
    void setLastError(const QString& message);
    void sendSimpleCommand(hcp::domain::DeviceCommandType type);

    QPointer<hcp::domain::IInputDevice> m_inputDevice;
    QPointer<hcp::domain::IDeviceService> m_deviceService;
    QPointer<NavigationController> m_navigationController;
    hcp::domain::DeviceState m_deviceState;
    QString m_lastInputIntent;
    QString m_lastError;
};

} // namespace hcp::presentation

