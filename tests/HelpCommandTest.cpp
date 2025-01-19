#include <gtest/gtest.h>
#include <iostream>
#include <map>
#include <string>
#include "ICommand.h"
#include "App.h"
#include "HelpCommand.h"
#include "PATCHCommand.h"
#include "POSTCommand.h"
#include <iostream>
#include "ConsoleMenu.h"
#include "IInput.h"
#include "TerminalInput.h"
#include "TerminalOutput.h"
#include "IDataManager.h"
#include "FileManager.h"
#include "RecommendCommand.h"
#include "DELETECommand.h"

class HelpCommandTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Optional setup for each test case
    }

    void TearDown() override {
        // Optional cleanup for each test case
    }   
};

TEST_F(HelpCommandTest, testDescription){
    IOutput* terminalOutput = new TerminalOutput();

    IDataManager* fileManager = new FileManager();

    map<string, ICommand*> commands;

    //very important! the help command should be the last ICommand instance here
    ICommand* helpCommand = new HelpCommand(commands, *terminalOutput);
    commands["help"] = helpCommand;
    EXPECT_EQ(helpCommand->getDescription(), "help");

    delete terminalOutput;
    delete fileManager;
    delete helpCommand;
}

TEST_F(HelpCommandTest, TestInvalidInputTab){
    IOutput* terminalOutput = new TerminalOutput();

    IDataManager* fileManager = new FileManager();

    map<string, ICommand*> commands;

    //very important! the help command should be the last ICommand instance here
    ICommand* helpCommand = new HelpCommand(commands, *terminalOutput);
    commands["help"] = helpCommand;
    string input = "\t";
    EXPECT_FALSE(helpCommand->validCheck(input));
    input = "1";
    EXPECT_FALSE(helpCommand->validCheck(input));
    input = "           ";
    EXPECT_TRUE(helpCommand->validCheck(input));
    input = "            A           ";
    EXPECT_FALSE(helpCommand->validCheck(input));
    input = "\n";
    EXPECT_FALSE(helpCommand->validCheck(input));
    input = "           1            43";
    EXPECT_FALSE(helpCommand->validCheck(input));
    input = "";
    EXPECT_TRUE(helpCommand->validCheck(input));
    input = " ";
    EXPECT_TRUE(helpCommand->validCheck(input));

    delete terminalOutput;
    delete fileManager;
    delete helpCommand;
}

TEST_F(HelpCommandTest, TestExecute){
    IInput* terminalInput = new TerminalInput();
    IOutput* terminalOutput = new TerminalOutput();

    IDataManager* fileManager = new FileManager();

    map<string, ICommand*> commands;

    ICommand* patchCommand = new PATCHCommand(*fileManager, *terminalOutput);
    commands["PATCH"] = patchCommand;
    
    ICommand* postCommand = new POSTCommand(*fileManager, *terminalOutput);
    commands["POST"] = postCommand;

    ICommand* recommendCommand = new RecommendCommand(*fileManager, *terminalOutput);
    commands["GET"] = recommendCommand;

    ICommand* deleteCommand = new DELETECommand(*fileManager, *terminalOutput);
    commands["DELETE"] = deleteCommand;

    //very important! the help command should be the last ICommand instance here
    ICommand* helpCommand = new HelpCommand(commands, *terminalOutput);
    commands["help"] = helpCommand;

    testing::internal::CaptureStdout();
    helpCommand->execute("");
    string output = testing::internal::GetCapturedStdout();
    string expected_output = "200 OK\n\nDELETE, arguments: [userid] [movieid1] [movieid2] ...\n"
                    "GET, arguments: [userid] [movieid]\n"
                    "PATCH, arguments: [userid] [movieid1] [movieid2] ...\n"
                    "POST, arguments: [userid] [movieid1] [movieid2] ...\n"
                    "help\n";
    EXPECT_EQ(output, expected_output);

    delete terminalInput;
    delete terminalOutput;
    delete fileManager;
    delete patchCommand;
    delete helpCommand;
    delete deleteCommand;
    delete postCommand;
    delete recommendCommand;
}
