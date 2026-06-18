import QtQuick
import "../components"
import "../theme"

Item {
    id: root
    property var viewModel

    Theme { id: theme }

    Column {
        anchors.fill: parent
        anchors.margins: 24
        spacing: 20

        Row {
            spacing: 16
            StatusTile {
                title: "设备模式"
                value: root.viewModel.modeText
                hint: "来自 device/{id}/state"
            }
            StatusTile {
                title: "温度"
                value: root.viewModel.temperatureCelsius.toFixed(1) + " C"
                hint: "阈值策略放在领域层"
                accentColor: theme.warning
            }
            StatusTile {
                title: "负载"
                value: root.viewModel.loadPercent.toFixed(0) + "%"
                hint: "用于演示实时状态刷新"
            }
        }

        Rectangle {
            width: parent.width
            height: 180
            radius: theme.radius
            color: theme.panelAlt

            Text {
                anchors.fill: parent
                anchors.margins: 22
                color: theme.textPrimary
                font.pixelSize: 22
                wrapMode: Text.WordWrap
                text: "状态页用于展示设备运行态、关键指标和网络状态。按键/旋钮只改变焦点和页面，不让页面直接依赖底层 evdev 事件。"
            }
        }
    }
}

