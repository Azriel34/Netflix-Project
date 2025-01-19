#include <gtest/gtest.h>
#include "IDataManager.h"
#include "FileManager.h"
#include "POSTCommand.h"
#include "PATCHCommand.h"
#include <string>
#include "TerminalOutput.h"
#include "IOutput.h"
#include <string>
#include "DELETECommand.h"

class DELETECommandTEST : public ::testing::Test {
protected:
    IOutput* terminalOutput;
    IDataManager* fileManager;
    ICommand* deleteCommand;

    void SetUp() override {
    terminalOutput = new TerminalOutput();

    fileManager = new FileManager("delete_test_file.txt");

    deleteCommand = new DELETECommand(*fileManager, *terminalOutput);

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
        // Optional cleanup for each test case
        remove("delete_test_file.txt");
    }   
};

//test get discription

TEST_F(DELETECommandTEST, testDELETEdiscription){
    EXPECT_EQ(deleteCommand->getDescription(), "DELETE, arguments: [userid] [movieid1] [movieid2] ...");
}

// //test valid input

TEST_F(DELETECommandTEST, testDELETENewUser) {
    std::stringstream capturedOutput;
    std::streambuf* originalCoutBuf = std::cout.rdbuf(capturedOutput.rdbuf());  // Redirect to stringstream

    // Create users and add them to the file manager
    User user1(1, "100 101 102 103");
    User user2(2, "101 102 104 105 106");
    User user3(3, "100 104 105 107 108");
    User user4(4, "101 105 106 107 109 110");
    User user5(5, "100 102 103 105 108 111");
    User user6(6, "100 103 104 110 111 112 113");
    User user7(7, "102 105 106 107 108 109 110");
    User user8(8, "101 104 105 106 109 111 114");
    User user9(9, "100 103 105 107 112 113 115");
    User user10(10, "100 102 105 106 107 109 110 116");
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

    // Execute DELETECommand
    std::string input = "1 100 101";
    deleteCommand->execute(input);
    EXPECT_EQ(fileManager->getUser(1).getMoviesString(), "102 103");

    input = "1 102 101";
    deleteCommand->execute(input);
    EXPECT_EQ(fileManager->getUser(1).getMoviesString(), "102 103");
    
    input = "1 102 103";
    deleteCommand->execute(input);
    EXPECT_EQ(fileManager->getUser(1).getMoviesString(), "");

    input = "2 102 103";
    deleteCommand->execute(input);
    EXPECT_EQ(fileManager->getUser(2).getMoviesString(), "101 102 104 105 106");

    input = "2 101 105 106";
    deleteCommand->execute(input);
    EXPECT_EQ(fileManager->getUser(2).getMoviesString(), "102 104");

    input = "2 102";
    deleteCommand->execute(input);
    EXPECT_EQ(fileManager->getUser(2).getMoviesString(), "104");

    input = "2 105 106 100";
    deleteCommand->execute(input);
    EXPECT_EQ(fileManager->getUser(2).getMoviesString(), "104");
    std::cout.rdbuf(originalCoutBuf);

    std::string outputStr = capturedOutput.str();

    size_t pos = 0;
    EXPECT_TRUE((pos = outputStr.find("204 No Content", pos)) != std::string::npos);  
    pos += 1;  
    EXPECT_TRUE((pos = outputStr.find("404 Not Found", pos)) != std::string::npos);  
    pos += 1;  
    EXPECT_TRUE((pos = outputStr.find("204 No Content", pos)) != std::string::npos); 
    pos += 1;  
    EXPECT_TRUE((pos = outputStr.find("404 Not Found", pos)) != std::string::npos); 
    pos += 1;  
    EXPECT_TRUE((pos = outputStr.find("204 No Content", pos)) != std::string::npos); 
    pos += 1; 
    EXPECT_TRUE((pos = outputStr.find("204 No Content", pos)) != std::string::npos); 
    pos += 1;  
    EXPECT_TRUE((pos = outputStr.find("404 Not Found", pos)) != std::string::npos); 
}
