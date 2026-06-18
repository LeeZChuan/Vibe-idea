import QtQuick
import "../theme"

Rectangle {
    id: root
    property string title: ""
    property bool networkOnline: false
    property string lastInputIntent: ""

    height: 68
    color: theme.panel

    Theme { id: theme }

    Row {
        anchors.fill: parent
        anchors.leftMargin: 24
        anchors.rightMargin: 24
        spacing: 24

        Text {
            width: 240
            anchors.verticalCenter: parent.verticalCenter
            text: root.title
            color: theme.textPrimary
            font.pixelSize: 26
            font.bold: true
            elide: Text.ElideRight
        }

        Text {
            anchors.verticalCenter: parent.verticalCenter
            text: root.networkOnline ? "MQTT 在线" : "MQTT 离线"
            color: root.networkOnline ? theme.accent : theme.warning
            font.pixelSize: 18
        }

        Text {
            anchors.verticalCenter: parent.verticalCenter
            text: root.lastInputIntent.length > 0 ? "输入: " + root.lastInputIntent : "输入: 等待"
            color: theme.textSecondary
            font.pixelSize: 18
            elide: Text.ElideRight
        }
    }
}

