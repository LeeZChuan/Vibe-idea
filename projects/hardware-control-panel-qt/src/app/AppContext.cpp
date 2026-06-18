#include "AppContext.h"

namespace hcp::app {

AppContext::AppContext(QObject* parent)
    : QObject(parent)
{
}

hcp::presentation::PanelViewModel* AppContext::panelViewModel() const
{
    return m_panelViewModel;
}

void AppContext::setPanelViewModel(hcp::presentation::PanelViewModel* viewModel)
{
    m_panelViewModel = viewModel;
}

} // namespace hcp::app

