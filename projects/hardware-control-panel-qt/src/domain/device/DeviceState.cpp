#include "DeviceState.h"

namespace hcp::domain {

QString toString(DeviceMode mode)
{
    switch (mode) {
    case DeviceMode::Standby: return "Standby";
    case DeviceMode::Running: return "Running";
    case DeviceMode::Maintenance: return "Maintenance";
    case DeviceMode::Fault: return "Fault";
    }
    return "Unknown";
}

} // namespace hcp::domain

