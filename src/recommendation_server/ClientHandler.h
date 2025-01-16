#ifndef CLIENTHANDLER_H
#define CLIENTHANDLER_H

#include "IRunnable.h"

class ClientHandler : public IRunnable{
private:
  // The client socket
  int socket;
  // Whether or not the handler has finished
  bool finished = false;

  // Declare a finished state
  void finish();

public:

  ClientHandler(int socket);
  void run() override;

  // Whether or not the handler has finished
  bool hasFinished(); 
  // Get the socket
  int getSocketId();     
};
#endif