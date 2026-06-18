import QtQuick

Rectangle {
    id: root
    property bool active: false

    color: "transparent"
    border.color: active ? "#30c48d" : "transparent"
    border.width: active ? 2 : 0
    radius: 6
}

