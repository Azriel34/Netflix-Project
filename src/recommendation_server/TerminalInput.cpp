#include "TerminalInput.h"

using namespace std;

//Class to recive some Input ass the project input
string TerminalInput::getInput() const {
    string input;
    getline(cin, input);  // Read input from the terminal
    return input;
}