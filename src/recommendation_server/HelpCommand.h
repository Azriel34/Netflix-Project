#ifndef HELPCOMMAND_H
#define HELPCOMMAND_H

#include "ICommand.h"
#include "IOutput.h"
#include <map>
#include <string>
#include <vector> 

class HelpCommand : public ICommand {
private:
    std::map<std::string, ICommand*> commandMap;
    IOutput& output;

public:
    // Constructor declaration
    HelpCommand(const std::map<std::string, ICommand*>& commands, IOutput& output);

    // check if the arguments valid
    bool validCheck(std::string& argumentString) override;

    // Function to execute the command
    void execute(string argumentString) override;

    // Helper function to sort the map by alphabetical order
    void sortCommandMapFunc(std::vector<std::pair<std::string, ICommand*>>& sortedCommands, const std::map<std::string, ICommand*>& commandMap);

    // Function to get the description of the command
    std::string getDescription() const override;
};

#endif // HELPCOMMAND_H