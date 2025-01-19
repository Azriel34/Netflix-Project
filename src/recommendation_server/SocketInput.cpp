#include "SocketInput.h"
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <stdexcept>
#include <string>

using namespace std;

SocketInput::SocketInput(int sck): sck(sck){}

string SocketInput::getInput() const{
    char buffer[2048];
    ssize_t bytesRead = recv(sck, buffer, sizeof(buffer) - 1, 0);
    if (bytesRead == 0){
        //the client has exited 
        throw runtime_error("client exited");
    }
    if (bytesRead < 0) throw runtime_error("Socket read error");     
    buffer[bytesRead] = '\0';
    return string(buffer);
}