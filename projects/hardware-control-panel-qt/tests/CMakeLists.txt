find_package(Qt6 6.5 REQUIRED COMPONENTS Test Core)

add_executable(hcp-domain-tests
    test_main.cpp
    input_mapping_test.cpp
    mqtt_command_parse_test.cpp
    state_machine_test.cpp
    ${PROJECT_SOURCE_DIR}/src/domain/input/InputEvent.cpp
    ${PROJECT_SOURCE_DIR}/src/domain/device/DeviceCommand.cpp
    ${PROJECT_SOURCE_DIR}/src/domain/device/DeviceState.cpp
)

target_include_directories(hcp-domain-tests
    PRIVATE
        ${PROJECT_SOURCE_DIR}/src
)

target_link_libraries(hcp-domain-tests
    PRIVATE
        Qt6::Core
        Qt6::Test
)

add_test(NAME hcp-domain-tests COMMAND hcp-domain-tests)
