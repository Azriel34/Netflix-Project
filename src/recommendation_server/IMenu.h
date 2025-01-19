#ifndef IMENU_H
#define IMENU_H

#include "IInput.h"  // Include IInput header

class IMenu {
protected:
    IInput& input;  // Reference to an IInput object

public:
    // Constructor to initialize the reference to IInput object
    explicit IMenu(IInput& inputObj) : input(inputObj) {}

    // Pure virtual function to get the next command
    virtual std::string nextCommand() = 0;

    // Virtual destructor to ensure proper cleanup in derived classes
    virtual ~IMenu() = default;
};

#endif // IMENU_H