#include "App.h"
#include <mutex>

using namespace std;


mutex mtx;


void App::initializeCommands(){
    ICommand* deleteCommand = new DELETECommand(*dataManager, *output);
    commands["DELETE"] = deleteCommand;

    ICommand* patchCommand = new PATCHCommand(*dataManager, *output);
    commands["PATCH"] = patchCommand;

    ICommand* postCommand = new POSTCommand(*dataManager, *output);
    commands["POST"] = postCommand;

    ICommand* recommendCommand = new RecommendCommand(*dataManager, *output);
    commands["GET"] = recommendCommand;

    ICommand* helpCommand = new HelpCommand(commands, *output);
    commands["help"] = helpCommand;
}

App::App(IMenu* menu, IDataManager* dataManager,IOutput* output) : menu(menu), dataManager(dataManager), output(output) {
    initializeCommands();
}

// Helper function to split the input string into first word and rest of the string
void App::splitFirstWord(const std::string& input, std::string& first_word, std::string& rest_of_string) {
    size_t pos = input.find(' ');

    if (pos != std::string::npos) {
        first_word = input.substr(0, pos);
        rest_of_string = input.substr(pos + 1);
    } else {
        first_word = input;
        rest_of_string = "";
    }
}


//run the input loop
void App::run() {
    string task;
    while (true) {
        try {
            task = menu->nextCommand();
        } catch (const std::runtime_error& e) {
            break;
        }   
        
        string first_word;
        string rest_of_string;
        
        // Split the task into first word and the rest using the helper function
        splitFirstWord(task, first_word, rest_of_string);

        try {
            // Find and execute the command
            if (commands.find(first_word) != commands.end()) {
                mtx.lock();
                commands[first_word]->execute(rest_of_string);
                mtx.unlock();
            } else {
                output->sendOutput(StatusCodeCollection::get400());
            }
        } catch (...) {
            continue;
        }
    }
}

App::~App() {

    // Delete each ICommand*
    for (auto& pair : commands) {
        delete pair.second; 
    }

    // Clear the commands map
    commands.clear(); 
}

App::App(const App& other) 
    : App(other.menu, other.dataManager, other.output) {
    // Calling the regular constructor
}

App::App(App&& other) noexcept
    : menu(other.menu), dataManager(other.dataManager), output(other.output) {
    // Move the commands map from `other` to this object
    commands = std::move(other.commands);

    // Nullify the other object's pointers to indicate they have been moved
    other.menu = nullptr;
    other.dataManager = nullptr;
    other.output = nullptr;
}

App& App::operator=(App&& other) noexcept {
    // Self-assignment check
    if (this == &other) return *this; 

    // Clean up current resources
    for (auto& pair : commands) {
        // Delete each ICommand
        delete pair.second; 
    }
    commands.clear();

    // Move ownership of resources from `other`
    menu = other.menu;
    dataManager = other.dataManager;
    output = other.output;
    commands = std::move(other.commands);

    // Nullify the other object's pointers
    other.menu = nullptr;
    other.dataManager = nullptr;
    other.output = nullptr;

    return *this;
}

App& App::operator=(const App& other) {
    // Self-assignment check
    if (this == &other) return *this; 

    // Clean up current resources
    for (auto& pair : commands) {
        // Delete each ICommand
        delete pair.second; 
    }
    commands.clear();

    // Copy the resources from `other`
    menu = other.menu;
    dataManager = other.dataManager;
    output = other.output;
    
    // Copy the commands map
    for (const auto& pair : other.commands) {
        // Copy each ICommand*
        commands[pair.first] = pair.second; 
    }

    return *this;
}
