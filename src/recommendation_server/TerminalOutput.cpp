#include "TerminalOutput.h"
#include <iostream>

// Implement the sendOutput() method to output to the terminal
void TerminalOutput::sendOutput(const std::string& output) const {
    // Send the output string to the terminal with a newline
    std::cout << output << std::endl;
}