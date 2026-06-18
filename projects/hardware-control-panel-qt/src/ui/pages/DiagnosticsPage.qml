import QtQuick
import "../theme"

Item {
    id: root
    property var viewModel

    Theme { id: theme }

    Column {
        anchors.fill: parent
        anchors.margins: 24
        spacing: 16

        Text {
            text: "诊断"
            color: theme.textPrimary
            font.pixelSize: 26
            font.bold: true
        }

        Text {
            width: parent.width
            text: root.viewModel.lastError.length > 0 ? root.viewModel.lastError : "暂无错误。这里适合放 MQTT 连接状态、输入设备状态、版本号、磁盘空间、日志导出等板端诊断信息。"
            color: root.viewModel.lastError.length > 0 ? theme.critical : theme.textSecondary
            font.pixelSize: 20
            wrapMode: Text.WordWrap
        }
    }
}

