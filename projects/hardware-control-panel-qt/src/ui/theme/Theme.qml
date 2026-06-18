import QtQuick

QtObject {
    // QML 主题集中放置颜色和尺寸，真实项目可以继续扩展字体、间距、亮暗主题。
    readonly property color background: "#101419"
    readonly property color panel: "#1b232d"
    readonly property color panelAlt: "#243140"
    readonly property color accent: "#30c48d"
    readonly property color warning: "#f0b429"
    readonly property color critical: "#ef5b5b"
    readonly property color textPrimary: "#f4f7fb"
    readonly property color textSecondary: "#aeb8c5"
    readonly property int radius: 6
    readonly property int gap: 16
}

