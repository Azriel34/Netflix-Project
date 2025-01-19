#ifndef SERVER_H
#define SERVER_H

#include <string>
#include <mutex>
#include <vector>
#include "IExecutor.h"
#include "ClientHandler.h"

class Server{
private:
    static const int maxListeners = 32;
    // A mutex to protect isRunning
    std::mutex running;
    // Whether the server is running ot not
    bool isRunning = false;
    IExecutor* executor;

    // All the client handlers
    std::vector<ClientHandler*> clientHandlers;
    
    // The port the server listens to
    const int port;
    // The socket id of the server
    int sock;

    void closeClient(ClientHandler* clientHandler);

    void closeFinishedClients();
    
public:
    
    //constructor by executor and listening port
    Server(IExecutor* executor, int port);
    
    // Start the server
    void start();
    // Shut down the server
    void shutdown();  
 
};

#endif