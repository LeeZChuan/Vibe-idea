#include <QStringList>
#include <QCoreApplication>
#include <QDebug>

bool runInputMappingTest(QStringList* errors);
bool runMqttCommandParseTest(QStringList* errors);
bool runStateMachineTest(QStringList* errors);

int main(int argc, char* argv[])
{
    QCoreApplication app(argc, argv);
    QStringList errors;

    runInputMappingTest(&errors);
    runMqttCommandParseTest(&errors);
    runStateMachineTest(&errors);

    for (const auto& error : errors) {
        qWarning().noquote() << error;
    }
    return errors.isEmpty() ? 0 : 1;
}

