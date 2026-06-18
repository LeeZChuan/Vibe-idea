#pragma once

#include <QDateTime>
#include <QMetaType>
#include <QString>
#include <QVector>

namespace hcp::domain {

enum class AlarmSeverity {
    Info,
    Warning,
    Critical,
};

struct AlarmItem {
    QString id;
    AlarmSeverity severity { AlarmSeverity::Info };
    QString title;
    QString detail;
    bool acknowledged { false };
    QDateTime occurredAt;
};

struct AlarmState {
    QVector<AlarmItem> activeAlarms;
};

QString toString(AlarmSeverity severity);

} // namespace hcp::domain

Q_DECLARE_METATYPE(hcp::domain::AlarmState)

