#include "NavigationController.h"

namespace hcp::presentation {

NavigationController::NavigationController(QObject* parent)
    : QObject(parent)
{
}

QString NavigationController::currentPage() const
{
    return m_pages.value(m_currentIndex, QStringLiteral("status"));
}

QStringList NavigationController::pages() const
{
    return m_pages;
}

void NavigationController::handleIntent(hcp::domain::PanelIntent intent)
{
    const auto previousPage = currentPage();

    if (intent == hcp::domain::PanelIntent::NavigateDown || intent == hcp::domain::PanelIntent::NavigateRight) {
        m_currentIndex = (m_currentIndex + 1) % m_pages.size();
    } else if (intent == hcp::domain::PanelIntent::NavigateUp || intent == hcp::domain::PanelIntent::NavigateLeft) {
        m_currentIndex = (m_currentIndex + m_pages.size() - 1) % m_pages.size();
    } else if (intent == hcp::domain::PanelIntent::Back) {
        m_currentIndex = 0;
    }

    if (previousPage != currentPage()) {
        emit currentPageChanged(currentPage());
    }
}

} // namespace hcp::presentation

