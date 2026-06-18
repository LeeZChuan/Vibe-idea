#pragma once

#include "app/AppContext.h"

#include <memory>

namespace hcp::app {

class ApplicationBootstrapper {
public:
    std::unique_ptr<AppContext> create();
};

} // namespace hcp::app

