#include "AlarmState.h"

namespace hcp::domain {

QString toString(AlarmSeverity severity)
{
    switch (severity) {
    case AlarmSeverity::Info: return "Info";
    case AlarmSeverity::Warning: return "Warning";
    case AlarmSeverity::Critical: return "Critical";
    }
    return "Unknown";
}

} // namespace hcp::domain

