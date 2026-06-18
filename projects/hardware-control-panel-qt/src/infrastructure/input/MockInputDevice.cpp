#include "MockInputDevice.h"

#include <QDateTime>

namespace hcp::infrastructure {

MockInputDevice::MockInputDevice(QObject* parent)
    : IInputDevice(parent)
{
    m_demoTimer.setInterval(5000);
    connect(&m_demoTimer, &QTimer::timeout, this, [this] {
        // 模拟旋钮右转，方便没有板卡输入设备时验证导航链路。
        emit inputEventReceived({
            hcp::domain::InputSource::RotaryEncoder,
            hcp::domain::InputAction::RotateRight,
            QStringLiteral("ROTARY_0"),
            QDateTime::currentMSecsSinceEpoch(),
        });
    });
}

void MockInputDevice::start()
{
    m_demoTimer.start();
}

void MockInputDevice::stop()
{
    m_demoTimer.stop();
}

void MockInputDevice::injectIntent(const QString& intentName)
{
    hcp::domain::InputEvent event;
    event.timestampMs = QDateTime::currentMSecsSinceEpoch();

    if (intentName == "up") event.code = "KEY_UP";
    else if (intentName == "down") event.code = "KEY_DOWN";
    else if (intentName == "left") event.code = "KEY_LEFT";
    else if (intentName == "right") event.code = "KEY_RIGHT";
    else if (intentName == "back") event.code = "KEY_BACK";
    else event.code = "KEY_ENTER";

    emit inputEventReceived(event);
}

} // namespace hcp::infrastructure

