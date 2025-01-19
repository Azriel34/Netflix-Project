#include <gtest/gtest.h>
#include <cstdio>
#include <string>
#include "ICommand.h"
#include "AddCommand.h"
#include "IInput.h"
#include "TerminalInput.h"
#include "TerminalOutput.h"
#include "IDataManager.h"
#include "FileManager.h"
#include "RecommendCommand.h"

using namespace std;

class RecommendCommandTest : public ::testing::Test {
protected:
    IOutput* terminalOutput;
    IDataManager* fileManager;
    ICommand* recommendCommand;

    void SetUp() override {
        // Restart the relevent objects
        terminalOutput = new TerminalOutput();

        fileManager = new FileManager("recommend_test_file.txt");
    
        recommendCommand = new RecommendCommand(*fileManager, *terminalOutput);

        User user1 = User(1, "100 101 102 103" );
        User user2 = User(2, "101 102 104 105 106" );
        User user3 = User(3, "100 104 105 107 108" );
        User user4 = User(4, "101 105 106 107 109 110" );
        User user5 = User(5, "100 102 103 105 108 111" );
        User user6 = User(6, "100 103 104 110 111 112 113" );
        User user7 = User(7, "102 105 106 107 108 109 110" );
        User user8 = User(8, "101 104 105 106 109 111 114" );
        User user9 = User(9, "100 103 105 107 112 113 115" );
        User user10 = User(10, "100 102 105 106 107 109 110 116" );
        fileManager->addUser(user1);
        fileManager->addUser(user2);
        fileManager->addUser(user3);
        fileManager->addUser(user4);
        fileManager->addUser(user5);
        fileManager->addUser(user6);
        fileManager->addUser(user7);
        fileManager->addUser(user8);
        fileManager->addUser(user9);
        fileManager->addUser(user10);
    }

    void TearDown() override {
        // If the file exsits, remove it
        if (fopen("recommend_test_file.txt", "r")) {
            remove("recommend_test_file.txt");
        }

        delete terminalOutput;
        delete fileManager;
        delete recommendCommand;
    }   
};

TEST_F(RecommendCommandTest, Execute){
    
    // Capture stdout
    testing::internal::CaptureStdout();

    // Call the function that prints output to std::cout
    recommendCommand->execute("1 104");

    // Get the captured output
    std::string output = testing::internal::GetCapturedStdout();

    EXPECT_EQ(output, "200 OK\n\n105 106 111 110 112 113 107 108 109 114\n" );
}



TEST_F(RecommendCommandTest, InvalidOutputs){
    
    // Capture stdout
    testing::internal::CaptureStdout();

    // Call the execute function
    recommendCommand->execute("1 \t 104");
    recommendCommand->execute("1 104 \t"); 

    recommendCommand->execute("1 104b");

    // Extra arguments
    recommendCommand->execute("1 104 34");

    recommendCommand->execute("1b 104");
    

    // Get the captured output
    std::string output = testing::internal::GetCapturedStdout();

    // Expect no output
    EXPECT_EQ(output, "400 Bad Request\n400 Bad Request\n400 Bad Request\n400 Bad Request\n400 Bad Request\n" );
}

TEST_F(RecommendCommandTest, AllowingSpaces){
    
    // Capture stdout
    testing::internal::CaptureStdout();

    // Call the execute function 

    // Spaces should just be ignorred
    recommendCommand->execute("  1       104    ");
    // Get the captured output
    std::string output = testing::internal::GetCapturedStdout();

    
    EXPECT_EQ(output, "200 OK\n\n105 106 111 110 112 113 107 108 109 114\n" );
}


TEST_F(RecommendCommandTest, testDescription){
    // Expect the desired description
    EXPECT_EQ(recommendCommand->getDescription(), "GET, arguments: [userid] [movieid]");
}
