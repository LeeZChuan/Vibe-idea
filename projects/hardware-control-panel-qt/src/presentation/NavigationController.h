#pragma once

#include "domain/input/InputEvent.h"

#include <QObject>
#include <QStringList>

namespace hcp::presentation {

class NavigationController final : public QObject {
    Q_OBJECT

public:
    explicit NavigationController(QObject* parent = nullptr);

    QString currentPage() const;
    QStringList pages() const;
    void handleIntent(hcp::domain::PanelIntent intent);

signals:
    void currentPageChanged(const QString& page);

private:
    int m_currentIndex { 0 };
    QStringList m_pages {
        QStringLiteral("status"),
        QStringLiteral("settings"),
        QStringLiteral("alarm"),
        QStringLiteral("diagnostics"),
    };
};

} // namespace hcp::presentation

