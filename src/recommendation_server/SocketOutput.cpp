#include "SocketOutput.h"
#include <string>
#include <iostream>
#include <string>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>

using namespace std;

SocketOutput::SocketOutput(int sck): sck(sck){}

void SocketOutput::sendOutput(const string& output) const{
    ssize_t bytes_sent = send(sck, output.c_str(), output.size(), 0);
    if(bytes_sent < 0){
        perror("send failed");
    }
}