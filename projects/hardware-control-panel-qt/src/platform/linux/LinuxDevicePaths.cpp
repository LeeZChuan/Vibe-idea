#include "LinuxDevicePaths.h"

#include <QDir>
#include <QStandardPaths>

namespace hcp::platform {

LinuxDevicePaths LinuxDevicePaths::defaults()
{
    // 真实板端通常会把配置放在 /etc/<app>/config.json。
    // 模板默认使用用户目录，避免本地开发时需要 root 权限。
    const auto configDir = QStandardPaths::writableLocation(QStandardPaths::AppConfigLocation);
    return {
        QStringLiteral("/dev/input/event0"),
        QDir(configDir).filePath(QStringLiteral("panel-settings.json")),
        QStringLiteral("/var/log/hardware-control-panel"),
    };
}

} // namespace hcp::platform

