import QtQuick
import "../theme"

Rectangle {
    id: root
    property string title: ""
    property string value: ""
    property string hint: ""
    property color accentColor: theme.accent

    width: 260
    height: 132
    radius: theme.radius
    color: theme.panel

    Theme { id: theme }

    Rectangle {
        width: 5
        height: parent.height
        color: root.accentColor
        radius: 2
    }

    Column {
        anchors.fill: parent
        anchors.margins: 18
        spacing: 8

        Text {
            text: root.title
            color: theme.textSecondary
            font.pixelSize: 17
            elide: Text.ElideRight
            width: parent.width
        }

        Text {
            text: root.value
            color: theme.textPrimary
            font.pixelSize: 30
            font.bold: true
            elide: Text.ElideRight
            width: parent.width
        }

        Text {
            text: root.hint
            color: theme.textSecondary
            font.pixelSize: 15
            elide: Text.ElideRight
            width: parent.width
        }
    }
}

