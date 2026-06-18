#pragma once

#include "domain/common/Result.h"
#include "domain/settings/PanelSettings.h"

#include <QObject>

namespace hcp::domain {

class ISettingsStore : public QObject {
    Q_OBJECT

public:
    explicit ISettingsStore(QObject* parent = nullptr)
        : QObject(parent)
    {
    }
    ~ISettingsStore() override = default;

    virtual PanelSettings load() = 0;
    virtual Result save(const PanelSettings& settings) = 0;
    virtual PanelSettings defaults() const = 0;

signals:
    void settingsChanged(const hcp::domain::PanelSettings& settings);
};

} // namespace hcp::domain

