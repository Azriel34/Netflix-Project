#ifndef IOutput_H
#define IOutput_H

#include <string>

class IOutput {
public:
    // Pure virtual function to send output
    virtual void sendOutput(const std::string& output) const = 0;

    // Virtual destructor to ensure proper cleanup in derived classes
    virtual ~IOutput() = default;
};

#endif