#ifndef CONSOLE_MENU_H
#define CONSOLE_MENU_H

// Include IMenu header for inheritance
#include "IMenu.h"

// Define the ConsoleMenu class that inherits from IMenu
class ConsoleMenu : public IMenu {
public:
    // Constructor to initialize with an IInput reference
    explicit ConsoleMenu(IInput& inputObj) : IMenu(inputObj) {}

    // Declaration of the nextCommand() function (no definition here)
    std::string nextCommand() override;
};

#endif // CONSOLE_MENU_H

