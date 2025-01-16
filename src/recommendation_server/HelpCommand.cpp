#include "HelpCommand.h"
#include <string>
#include <algorithm>
#include "StatusCodeCollection.h"
#include "UtilityMethods.h"

// Constructor definition
HelpCommand::HelpCommand(const std::map<std::string, ICommand*>& commands, IOutput& output)
    : commandMap(commands), output(output) {}

// Definition of the validCheck method
bool HelpCommand::validCheck(std::string& argumentString) {
    //check for only spaces or ''
    if (UtilityMethods::onlySpaces(argumentString) == false){
        return false;
    }
    // Trim leading and trailing whitespace from the argument string
    argumentString.erase(argumentString.begin(), std::find_if(argumentString.begin(), argumentString.end(), [](unsigned char c) { return !std::isspace(c); }));
    argumentString.erase(std::find_if(argumentString.rbegin(), argumentString.rend(), [](unsigned char c) { return !std::isspace(c); }).base(), argumentString.end());

    // Check if the argumentString is now empty (it was either empty or contained only whitespace)
    return argumentString.empty();
}

// Helper function to sort the map by alphabetical order
void HelpCommand::sortCommandMapFunc(std::vector<std::pair<std::string, ICommand*>>& sortedCommands, const std::map<std::string, ICommand*>& commandMap) {
    sortedCommands.assign(commandMap.begin(), commandMap.end());
    std::sort(sortedCommands.begin(), sortedCommands.end(), [](const auto& a, const auto& b) {
        // Compare keys alphabetically
        return a.first < b.first;
    });
}

// Definition of the execute method
void HelpCommand::execute(std::string argumentString) {
    // Check if the argumentString is valid (empty or contains only whitespace)
    if (!validCheck(argumentString)) {
        output.sendOutput(StatusCodeCollection::get400());
        return; // If argumentString is not empty, return immediately
    }

    std::vector<std::pair<std::string, ICommand*>> sortedCommands;
    sortCommandMapFunc(sortedCommands, commandMap);

    std::string result = StatusCodeCollection::get200() + "\n\n";

    // Proceed with the current logic if the argumentString is empty
    for (const auto& pair : sortedCommands) {
        std::string description = pair.second->getDescription();
        result += description + "\n"; // Output the description
    }
    result += getDescription();
    output.sendOutput(result);
}

// Definition of getDescription method
std::string HelpCommand::getDescription() const {
    return "help"; // Description of the help command
}