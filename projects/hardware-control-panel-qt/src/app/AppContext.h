#pragma once

#include "presentation/PanelViewModel.h"

#include <QObject>

namespace hcp::app {

class AppContext final : public QObject {
    Q_OBJECT

public:
    explicit AppContext(QObject* parent = nullptr);

    hcp::presentation::PanelViewModel* panelViewModel() const;
    void setPanelViewModel(hcp::presentation::PanelViewModel* viewModel);

private:
    hcp::presentation::PanelViewModel* m_panelViewModel { nullptr };
};

} // namespace hcp::app

