#ifndef SOCKETINPUT_H
#define SOCKETINPUT_H

#include <string>
#include "IInput.h"

class SocketInput : public IInput {
    private:
        int sck;
    public:
        SocketInput(int sck);        
        // Override the pure virtual function from IInput
        std::string getInput() const override;
};

#endif