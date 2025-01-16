#ifndef IINPUT_H
#define IINPUT_H

#include <string>

class IInput {
    public:

    // Virtual destructor to ensure proper cleanup in derived classes
    virtual ~IInput() = default;

    // Pure virtual function to get input
    virtual std::string getInput() const = 0;
};
#endif