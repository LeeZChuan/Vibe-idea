#include "app/ApplicationBootstrapper.h"

#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>

int main(int argc, char* argv[])
{
    QGuiApplication app(argc, argv);
    QCoreApplication::setOrganizationName(QStringLiteral("VibeIdea"));
    QCoreApplication::setApplicationName(QStringLiteral("HardwareControlPanelQt"));

    hcp::app::ApplicationBootstrapper bootstrapper;
    auto context = bootstrapper.create();

    QQmlApplicationEngine engine;
    engine.rootContext()->setContextProperty(QStringLiteral("panelViewModel"), context->panelViewModel());
    engine.loadFromModule("HardwareControlPanel", "Main");
    if (engine.rootObjects().isEmpty()) {
        return -1;
    }

    return QGuiApplication::exec();
}

