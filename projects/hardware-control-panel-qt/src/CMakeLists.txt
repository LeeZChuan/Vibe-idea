set(HCP_SOURCES
    main.cpp
    app/ApplicationBootstrapper.cpp
    app/AppContext.cpp
    domain/input/InputEvent.cpp
    domain/device/DeviceState.cpp
    domain/device/DeviceCommand.cpp
    domain/alarm/AlarmState.cpp
    domain/settings/PanelSettings.cpp
    presentation/PanelViewModel.cpp
    presentation/NavigationController.cpp
    infrastructure/input/EvdevInputDevice.cpp
    infrastructure/input/MockInputDevice.cpp
    infrastructure/mqtt/QtMqttClient.cpp
    infrastructure/mqtt/MockMqttClient.cpp
    infrastructure/device/MqttDeviceService.cpp
    infrastructure/settings/JsonSettingsStore.cpp
    infrastructure/logging/LogCategories.cpp
    platform/linux/LinuxDevicePaths.cpp
)

set(HCP_HEADERS
    app/ApplicationBootstrapper.h
    app/AppContext.h
    domain/common/Result.h
    domain/input/IInputDevice.h
    domain/input/InputEvent.h
    domain/device/IDeviceService.h
    domain/device/DeviceState.h
    domain/device/DeviceCommand.h
    domain/alarm/AlarmState.h
    domain/settings/ISettingsStore.h
    domain/settings/PanelSettings.h
    presentation/PanelViewModel.h
    presentation/NavigationController.h
    infrastructure/input/EvdevInputDevice.h
    infrastructure/input/MockInputDevice.h
    infrastructure/mqtt/IMqttClient.h
    infrastructure/mqtt/QtMqttClient.h
    infrastructure/mqtt/MockMqttClient.h
    infrastructure/device/MqttDeviceService.h
    infrastructure/settings/JsonSettingsStore.h
    infrastructure/logging/LogCategories.h
    platform/linux/LinuxDevicePaths.h
)

qt_add_executable(hardware-control-panel
    ${HCP_SOURCES}
    ${HCP_HEADERS}
)

qt_add_qml_module(hardware-control-panel
    URI HardwareControlPanel
    VERSION 1.0
    QML_FILES
        ui/Main.qml
        ui/theme/Theme.qml
        ui/components/FocusFrame.qml
        ui/components/HeaderBar.qml
        ui/components/StatusTile.qml
        ui/pages/StatusPage.qml
        ui/pages/SettingsPage.qml
        ui/pages/AlarmPage.qml
        ui/pages/DiagnosticsPage.qml
)

target_include_directories(hardware-control-panel
    PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}
)

target_link_libraries(hardware-control-panel
    PRIVATE
        Qt6::Core
        Qt6::Gui
        Qt6::Qml
        Qt6::Quick
        Qt6::Mqtt
)

install(TARGETS hardware-control-panel
    BUNDLE DESTINATION .
    RUNTIME DESTINATION bin
)

