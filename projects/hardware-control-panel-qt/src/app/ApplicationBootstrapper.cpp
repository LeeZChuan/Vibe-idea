#include "ApplicationBootstrapper.h"

#include "infrastructure/device/MqttDeviceService.h"
#include "infrastructure/input/EvdevInputDevice.h"
#include "infrastructure/input/MockInputDevice.h"
#include "infrastructure/mqtt/MockMqttClient.h"
#include "infrastructure/mqtt/QtMqttClient.h"
#include "infrastructure/settings/JsonSettingsStore.h"
#include "platform/linux/LinuxDevicePaths.h"
#include "presentation/NavigationController.h"
#include "presentation/PanelViewModel.h"

#include <QJsonDocument>
#include <QJsonObject>
#include <QTimer>

namespace hcp::app {

std::unique_ptr<AppContext> ApplicationBootstrapper::create()
{
    auto context = std::make_unique<AppContext>();
    const auto paths = hcp::platform::LinuxDevicePaths::defaults();

    auto* settingsStore = new hcp::infrastructure::JsonSettingsStore(paths.configPath, context.get());
    auto settings = settingsStore->load();

    hcp::infrastructure::IMqttClient* mqttClient = settings.useMockMqtt
        ? static_cast<hcp::infrastructure::IMqttClient*>(new hcp::infrastructure::MockMqttClient(context.get()))
        : static_cast<hcp::infrastructure::IMqttClient*>(new hcp::infrastructure::QtMqttClient(context.get()));

    hcp::domain::IInputDevice* inputDevice = settings.useMockInput
        ? static_cast<hcp::domain::IInputDevice*>(new hcp::infrastructure::MockInputDevice(context.get()))
        : static_cast<hcp::domain::IInputDevice*>(new hcp::infrastructure::EvdevInputDevice(settings.inputDevicePath, context.get()));

    auto* deviceService = new hcp::infrastructure::MqttDeviceService(settings, mqttClient, context.get());
    auto* navigationController = new hcp::presentation::NavigationController(context.get());
    auto* viewModel = new hcp::presentation::PanelViewModel(inputDevice, deviceService, navigationController, context.get());
    context->setPanelViewModel(viewModel);

    deviceService->connectToDevice();
    inputDevice->start();

    if (auto* mockMqtt = qobject_cast<hcp::infrastructure::MockMqttClient*>(mqttClient)) {
        auto* timer = new QTimer(context.get());
        timer->setInterval(3000);
        QObject::connect(timer, &QTimer::timeout, context.get(), [mockMqtt, settings] {
            static double load = 25.0;
            load = load > 90.0 ? 20.0 : load + 7.5;
            const QJsonObject state {
                { "mode", load > 70.0 ? QStringLiteral("running") : QStringLiteral("standby") },
                { "temperatureCelsius", 38.0 + load / 12.0 },
                { "loadPercent", load },
                { "networkOnline", true },
            };
            mockMqtt->injectMessage(
                QStringLiteral("device/%1/state").arg(settings.deviceId),
                QJsonDocument(state).toJson(QJsonDocument::Compact));
        });
        timer->start();
    }

    return context;
}

} // namespace hcp::app
