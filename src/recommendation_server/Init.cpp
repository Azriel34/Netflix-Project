#include "Init.h"
#include "IExecutor.h"
#include "ThreadPoolExecutor.h"
#include "Server.h"

#define MAX_CLIENTS 8

using namespace std;

Init::Init(int port) : port(port){}

void Init::initializeProgram(){
    IExecutor* executor = new ThreadPoolExecutor(MAX_CLIENTS);
    
    Server server(executor, port);
    server.start();
    
    delete executor;

}
