// Include the header for ConsoleMenu
#include "ConsoleMenu.h"

using namespace std;

// Define the nextCommand() method
string ConsoleMenu::nextCommand() { 
    return input.getInput();  
}