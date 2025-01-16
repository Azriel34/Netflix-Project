#ifndef APP_H
#define APP_H

#include <iostream>
#include <map>
#include <string>
#include "IOutput.h"
#include "ICommand.h"
#include "IDataManager.h"
#include "HelpCommand.h"
#include "POSTCommand.h"
#include "PATCHCommand.h"
#include "DELETECommand.h"
#include "RecommendCommand.h"
#include "StatusCodeCollection.h"
#include "IMenu.h"
#include "IRunnable.h"

using namespace std;

class App : public IRunnable{
    private:
        map<string, ICommand*> commands;
        IMenu* menu;
        IDataManager* dataManager;
        IOutput* output;

        void initializeCommands();

        //Split the command from the arguments
        void splitFirstWord(const std::string& input, std::string& first_word, std::string& rest_of_string);

    public:
        //Constructor the map command
        App(IMenu* menu, IDataManager* dataManager, IOutput* output);
        
        //Run the App
        void run() override;

        // Destructor
        ~App();
        // Copy Constructor
        App(const App& other);
        // Copy Assignment Operator
        App& operator=(const App& other);
        // Move Constructor
        App(App&& other) noexcept;
        // Move Assignment Operator
        App& operator=(App&& other) noexcept;
};

#endif