#include "EvdevInputDevice.h"

#include "infrastructure/logging/LogCategories.h"

#include <utility>

#ifdef Q_OS_LINUX
#include <linux/input.h>
#endif

namespace hcp::infrastructure {

EvdevInputDevice::EvdevInputDevice(QString devicePath, QObject* parent)
    : IInputDevice(parent)
    , m_devicePath(std::move(devicePath))
    , m_deviceFile(m_devicePath)
{
}

void EvdevInputDevice::start()
{
#ifndef Q_OS_LINUX
    emit inputDeviceError(QStringLiteral("evdev 只支持 Linux，当前平台请使用 MockInputDevice"));
#else
    if (!m_deviceFile.open(QIODevice::ReadOnly)) {
        emit inputDeviceError(QStringLiteral("无法打开输入设备: %1").arg(m_devicePath));
        return;
    }

    m_notifier = std::make_unique<QSocketNotifier>(m_deviceFile.handle(), QSocketNotifier::Read, this);
    connect(m_notifier.get(), &QSocketNotifier::activated, this, [this] {
        readAvailableEvents();
    });
    qCInfo(logInput) << "evdev input started" << m_devicePath;
#endif
}

void EvdevInputDevice::stop()
{
    if (m_notifier) {
        m_notifier->setEnabled(false);
        m_notifier.reset();
    }
    if (m_deviceFile.isOpen()) {
        m_deviceFile.close();
    }
}

void EvdevInputDevice::readAvailableEvents()
{
#ifdef Q_OS_LINUX
    input_event rawEvent {};
    while (m_deviceFile.read(reinterpret_cast<char*>(&rawEvent), sizeof(rawEvent)) == sizeof(rawEvent)) {
        if (rawEvent.type != EV_KEY && rawEvent.type != EV_REL) {
            continue;
        }

        hcp::domain::InputEvent event;
        event.timestampMs = static_cast<qint64>(rawEvent.time.tv_sec) * 1000 + rawEvent.time.tv_usec / 1000;

        // 模板只演示常见按键/旋钮映射。真实项目应把 Linux key code 到业务 code 的表放入配置。
        if (rawEvent.type == EV_REL) {
            event.source = hcp::domain::InputSource::RotaryEncoder;
            event.action = rawEvent.value < 0
                ? hcp::domain::InputAction::RotateLeft
                : hcp::domain::InputAction::RotateRight;
            event.code = QStringLiteral("ROTARY_0");
        } else {
            event.source = hcp::domain::InputSource::Key;
            event.action = rawEvent.value == 0
                ? hcp::domain::InputAction::Released
                : hcp::domain::InputAction::Pressed;
            event.code = QStringLiteral("KEY_%1").arg(rawEvent.code);
        }
        emit inputEventReceived(event);
    }
#endif
}

} // namespace hcp::infrastructure
