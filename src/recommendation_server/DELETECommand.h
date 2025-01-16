#ifndef DELETECOMMAND_H
#define DELETECOMMAND_H

#include "ICommand.h"
#include <string>
#include <vector>
#include "IDataManager.h"
#include "IOutput.h"

class DELETECommand : public ICommand {
    private:
        unsigned long int userid;
        std::vector<unsigned long int> movieids;
        IDataManager& data;
        IOutput& output;

    public:
        // Constructor
        DELETECommand(IDataManager& data, IOutput& output);

        // Override the execute method from ICommand
        void execute(string argumentString) override;
        
        // Validates the input string
        bool validCheck(string& input);
        
        //get the class description
        std::string getDescription() const;
};

#endif