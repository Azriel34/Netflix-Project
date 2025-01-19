#ifndef SOCKETOUTPUT_H
#define SOCKETOUTPUT_H

#include "IOutput.h"
#include <string>

class SocketOutput : public IOutput{
    private:
        int sck;
    public:
        SocketOutput(int sck);
        //send output through the socket
        void sendOutput(const std::string& output) const override;    
};

#endif