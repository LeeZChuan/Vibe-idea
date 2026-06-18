#pragma once

#include "domain/settings/ISettingsStore.h"

#include <QString>

namespace hcp::infrastructure {

class JsonSettingsStore final : public hcp::domain::ISettingsStore {
    Q_OBJECT

public:
    explicit JsonSettingsStore(QString filePath, QObject* parent = nullptr);

    hcp::domain::PanelSettings load() override;
    hcp::domain::Result save(const hcp::domain::PanelSettings& settings) override;
    hcp::domain::PanelSettings defaults() const override;

private:
    QString m_filePath;
};

} // namespace hcp::infrastructure

