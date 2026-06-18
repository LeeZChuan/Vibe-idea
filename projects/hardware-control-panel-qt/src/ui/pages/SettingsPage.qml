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
        spacing: 16

        StatusTile {
            title: "配置源"
            value: "JSON"
            hint: "默认 AppConfigLocation，板端可改为 /etc"
            width: 360
        }

        Text {
            width: parent.width
            color: theme.textPrimary
            font.pixelSize: 22
            wrapMode: Text.WordWrap
            text: "设置页模板保留设备 ID、MQTT 地址、输入设备路径、长按时间、重复按键间隔等入口。真实项目可在 ViewModel 中添加字段校验和保存命令。"
        }
    }
}

