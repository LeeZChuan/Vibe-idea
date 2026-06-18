import QtQuick
import "../theme"

Item {
    id: root
    property var viewModel

    Theme { id: theme }

    Rectangle {
        anchors.fill: parent
        anchors.margins: 24
        radius: theme.radius
        color: theme.panel

        Column {
            anchors.fill: parent
            anchors.margins: 22
            spacing: 12

            Text {
                text: "暂无活动告警"
                color: theme.textPrimary
                font.pixelSize: 26
                font.bold: true
            }

            Text {
                width: parent.width
                text: "告警页建议接入 device/{id}/alarm，支持确认、消音、历史查询和权限控制。按键 KEY_ALARM_ACK 可统一映射到 AcknowledgeAlarm 意图。"
                color: theme.textSecondary
                font.pixelSize: 20
                wrapMode: Text.WordWrap
            }
        }
    }
}

