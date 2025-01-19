#ifndef TERMINALOUTPUT_H
#define TERMINALOUTPUT_H

#include "IOutput.h"
#include <string>

class TerminalOutput : public IOutput {
public:
    // Declare the sendOutput() method to output to the terminal
    void sendOutput(const std::string& output) const override;
};

#endif // TERMINALOUTPUT_H