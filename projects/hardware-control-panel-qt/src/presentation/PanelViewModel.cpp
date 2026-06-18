#include "PanelViewModel.h"

#include "domain/device/DeviceCommand.h"

#include <QUuid>

namespace hcp::presentation {

PanelViewModel::PanelViewModel(
    hcp::domain::IInputDevice* inputDevice,
    hcp::domain::IDeviceService* deviceService,
    NavigationController* navigationController,
    QObject* parent)
    : QObject(parent)
    , m_inputDevice(inputDevice)
    , m_deviceService(deviceService)
    , m_navigationController(navigationController)
{
    if (m_inputDevice) {
        connect(m_inputDevice, &hcp::domain::IInputDevice::inputEventReceived, this, &PanelViewModel::handleInputEvent);
        connect(m_inputDevice, &hcp::domain::IInputDevice::inputDeviceError, this, &PanelViewModel::setLastError);
    }
    if (m_deviceService) {
        m_deviceState = m_deviceService->currentState();
        connect(m_deviceService, &hcp::domain::IDeviceService::deviceStateChanged, this, &PanelViewModel::updateDeviceState);
        connect(m_deviceService, &hcp::domain::IDeviceService::deviceServiceError, this, &PanelViewModel::setLastError);
    }
    if (m_navigationController) {
        connect(m_navigationController, &NavigationController::currentPageChanged, this, &PanelViewModel::currentPageChanged);
    }
}

QString PanelViewModel::currentPage() const
{
    return m_navigationController ? m_navigationController->currentPage() : QStringLiteral("status");
}

QString PanelViewModel::pageTitle() const
{
    if (currentPage() == "settings") return QStringLiteral("设置");
    if (currentPage() == "alarm") return QStringLiteral("告警");
    if (currentPage() == "diagnostics") return QStringLiteral("诊断");
    return QStringLiteral("状态");
}

QString PanelViewModel::modeText() const
{
    return hcp::domain::toString(m_deviceState.mode);
}

double PanelViewModel::temperatureCelsius() const
{
    return m_deviceState.temperatureCelsius;
}

double PanelViewModel::loadPercent() const
{
    return m_deviceState.loadPercent;
}

bool PanelViewModel::networkOnline() const
{
    return m_deviceState.networkOnline;
}

QString PanelViewModel::lastInputIntent() const
{
    return m_lastInputIntent;
}

QString PanelViewModel::lastError() const
{
    return m_lastError;
}

void PanelViewModel::startDevice()
{
    sendSimpleCommand(hcp::domain::DeviceCommandType::Start);
}

void PanelViewModel::stopDevice()
{
    sendSimpleCommand(hcp::domain::DeviceCommandType::Stop);
}

void PanelViewModel::resetFault()
{
    sendSimpleCommand(hcp::domain::DeviceCommandType::ResetFault);
}

void PanelViewModel::navigate(const QString& direction)
{
    if (!m_navigationController) {
        return;
    }
    if (direction == "next") {
        m_navigationController->handleIntent(hcp::domain::PanelIntent::NavigateDown);
    } else if (direction == "previous") {
        m_navigationController->handleIntent(hcp::domain::PanelIntent::NavigateUp);
    } else {
        m_navigationController->handleIntent(hcp::domain::PanelIntent::Back);
    }
}

void PanelViewModel::handleInputEvent(const hcp::domain::InputEvent& event)
{
    const auto intent = hcp::domain::mapInputToIntent(event);
    m_lastInputIntent = hcp::domain::toString(intent);
    emit lastInputIntentChanged();

    if (m_navigationController) {
        m_navigationController->handleIntent(intent);
    }
}

void PanelViewModel::updateDeviceState(const hcp::domain::DeviceState& state)
{
    m_deviceState = state;
    emit deviceStateChanged();
}

void PanelViewModel::setLastError(const QString& message)
{
    m_lastError = message;
    emit lastErrorChanged();
}

void PanelViewModel::sendSimpleCommand(hcp::domain::DeviceCommandType type)
{
    if (!m_deviceService) {
        setLastError(QStringLiteral("设备服务未初始化"));
        return;
    }

    hcp::domain::DeviceCommand command {
        type,
        QUuid::createUuid().toString(QUuid::WithoutBraces),
        {},
    };
    const auto result = m_deviceService->sendCommand(command);
    if (!result.ok) {
        setLastError(result.message);
    }
}

} // namespace hcp::presentation

