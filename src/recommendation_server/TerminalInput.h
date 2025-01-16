#ifndef TERMINAL_INPUT_H
#define TERMINAL_INPUT_H

#include <iostream>
#include <string>
#include "IInput.h"

//Interface for all the inputs
class TerminalInput : public IInput {
public:
    // Override the pure virtual function from IInput
    std::string getInput() const override;
};

#endif