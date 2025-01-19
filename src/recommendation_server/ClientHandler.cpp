#include "ClientHandler.h"
#include "App.h"
#include "ConsoleMenu.h"
#include "IInput.h"
#include "SocketInput.h"
#include "SocketOutput.h"
#include "IDataManager.h"
#include "FileManager.h"



using namespace std;

ClientHandler::ClientHandler(int socket): socket(socket){}

void ClientHandler::finish(){
    finished = true;
}

bool ClientHandler::hasFinished(){
    return finished;
}

int ClientHandler::getSocketId(){
    return socket;
}

void ClientHandler::run(){
    IInput* socketInput = new SocketInput(socket);
    IOutput* socketOutput = new SocketOutput(socket);

    IDataManager* fileManager = new FileManager();

    IMenu* menu = new ConsoleMenu(*socketInput);

    App app(menu, fileManager, socketOutput);
    app.run();

    delete socketInput;
    delete socketOutput;
    delete fileManager;
    delete menu;

    // Change the status of the handler to done for the server's usage
    finish();
}
