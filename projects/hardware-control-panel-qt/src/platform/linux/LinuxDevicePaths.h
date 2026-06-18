#pragma once

#include <QString>

namespace hcp::platform {

struct LinuxDevicePaths {
    QString inputDevicePath;
    QString configPath;
    QString logDirectory;

    static LinuxDevicePaths defaults();
};

} // namespace hcp::platform

