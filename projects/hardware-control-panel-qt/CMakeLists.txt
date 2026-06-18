cmake_minimum_required(VERSION 3.21)

project(HardwareControlPanelQt
    VERSION 0.1.0
    DESCRIPTION "Qt/QML Linux hardware control panel architecture template"
    LANGUAGES CXX
)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

option(HCP_BUILD_TESTS "Build architecture template tests" ON)

find_package(Qt6 6.5 REQUIRED COMPONENTS Core Gui Qml Quick Mqtt)

qt_standard_project_setup(REQUIRES 6.5)

add_subdirectory(src)

if(HCP_BUILD_TESTS)
    enable_testing()
    add_subdirectory(tests)
endif()

