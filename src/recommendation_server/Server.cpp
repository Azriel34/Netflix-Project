#include <string>
#include <string.h>
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include "Server.h"
#include "App.h"
#include "IRunnable.h"
#include "IDataManager.h"
#include "ClientHandler.h"

using namespace std;

Server::Server(IExecutor* executor, int port) : port(port), executor(executor){}

void Server::closeClient(ClientHandler* clientHandler){
    int clientSocket = clientHandler->getSocketId();
    // Close the client socket
    close(clientSocket);

    delete clientHandler;
}
void Server::closeFinishedClients(){
    for (auto it = clientHandlers.begin(); it != clientHandlers.end(); ) {
    ClientHandler* handler = *it;
    if (handler->hasFinished()) {
        // Close the handler and the client
        closeClient(handler);
        
        // Remove the client handler from the vector
        it = clientHandlers.erase(it);  // erase returns the next iterator
    } else {
        // only increment if not erasing
        it++;  
    }
}
}
void Server::start(){
    running.lock();
    isRunning = true;
    running.unlock();
    this->sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
    }
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    //endians translator
    sin.sin_port = htons(port);
    //binding the socket to the port as defined in the struct
    if (bind(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("error binding socket");
    }
    if (listen(sock, maxListeners) < 0) {
        perror("error listening to a socket");
    }
    while(isRunning){
        int client_sock = accept(sock, nullptr, nullptr);
        if(client_sock<0){
            if(!isRunning){
                //shut down
                break;

            }
            else{
                continue;
            }
        }
        ClientHandler* clientHandler = new ClientHandler(client_sock);
        clientHandlers.emplace_back(clientHandler);
        executor->execute(*clientHandler);

        // Close all the clients that has finished
        closeFinishedClients();
    }
    
}

void Server::shutdown(){
    if(!isRunning){
        return;
    }
    running.lock();
    isRunning = false;
    running.unlock();
    ::shutdown(sock, SHUT_RDWR);   
    close(sock);                 
    sock = -1;
}

