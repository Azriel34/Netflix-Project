#include "Init.h"
#include <iostream>

// main method
int main(int argc, char* argv[]) {
    // Check if the correct number of arguments is provided
    if (argc != 2) {
        return 1;
    }

    // Store the recieved port
    int port = std::stoi(argv[1]);

    // Create init to start the program
    Init* init = new Init(port);
    init->initializeProgram();

    return 0;
}