#ifndef PATCHCOMMAND_H
#define PATCHCOMMAND_H

#include "ICommand.h"
#include "IDataManager.h"
#include <string>
#include <vector>
#include "IOutput.h"

class PATCHCommand : public ICommand{
    private:
        unsigned long int userid;
        std::vector<unsigned long int> movieids;
        IDataManager& data;
        IOutput& output;
    public:
        //check if the args are valid
        bool validCheck(string& input) override;
        //constructor
        PATCHCommand(IDataManager& data, IOutput& output);
        //execute the add command
        void execute(string s) override;
        //get discription of the command 
        string getDescription() const override; 
        bool numberStringCheck(string number);
};

#endif