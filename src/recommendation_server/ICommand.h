#ifndef ICOMMAND_H
#define ICOMMAND_H

# include <string>
using namespace std;

class ICommand {
public:
    // Execute the command
    virtual void execute(string argumentString) = 0;  // Pure virtual function
    
    // check if the arguments valid
    virtual bool validCheck(std::string& argumentString) = 0;

    // Virtual function for description
    virtual std::string getDescription() const = 0;

    // Virtual destructor
    virtual ~ICommand() = default;

};

#endif