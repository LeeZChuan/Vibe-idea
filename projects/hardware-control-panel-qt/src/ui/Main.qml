import QtQuick
import QtQuick.Window
import "components"
import "pages"
import "theme"

Window {
    id: root
    width: 1024
    height: 600
    visible: true
    color: theme.background
    title: "Hardware Control Panel"

    Theme { id: theme }

    Column {
        anchors.fill: parent

        HeaderBar {
            width: parent.width
            title: panelViewModel.pageTitle
            networkOnline: panelViewModel.networkOnline
            lastInputIntent: panelViewModel.lastInputIntent
        }

        Item {
            width: parent.width
            height: parent.height - 128

            Loader {
                anchors.fill: parent
                sourceComponent: {
                    if (panelViewModel.currentPage === "settings") return settingsPage;
                    if (panelViewModel.currentPage === "alarm") return alarmPage;
                    if (panelViewModel.currentPage === "diagnostics") return diagnosticsPage;
                    return statusPage;
                }
            }
        }

        Rectangle {
            width: parent.width
            height: 60
            color: theme.panel

            Row {
                anchors.centerIn: parent
                spacing: 18

                Repeater {
                    model: [
                        { label: "上一页", action: "previous" },
                        { label: "主页", action: "home" },
                        { label: "下一页", action: "next" }
                    ]
                    delegate: Rectangle {
                        width: 120
                        height: 36
                        radius: theme.radius
                        color: mouseArea.containsMouse ? theme.panelAlt : theme.background
                        border.color: theme.accent

                        Text {
                            anchors.centerIn: parent
                            text: modelData.label
                            color: theme.textPrimary
                            font.pixelSize: 17
                        }

                        MouseArea {
                            id: mouseArea
                            anchors.fill: parent
                            hoverEnabled: true
                            onClicked: panelViewModel.navigate(modelData.action)
                        }
                    }
                }
            }
        }
    }

    Component {
        id: statusPage
        StatusPage { viewModel: panelViewModel }
    }

    Component {
        id: settingsPage
        SettingsPage { viewModel: panelViewModel }
    }

    Component {
        id: alarmPage
        AlarmPage { viewModel: panelViewModel }
    }

    Component {
        id: diagnosticsPage
        DiagnosticsPage { viewModel: panelViewModel }
    }
}
