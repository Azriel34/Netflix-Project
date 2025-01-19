#include <gtest/gtest.h>
#include "IDataManager.h"
#include "FileManager.h"
#include "POSTCommand.h"
#include "PATCHCommand.h"
#include <string>
#include "TerminalOutput.h"
#include "IOutput.h"
#include <string>


class PATCHPOSTCommand : public ::testing::Test {
protected:
    void SetUp() override {
        // Optional setup for each test case
    }

    void TearDown() override {
        // Optional cleanup for each test case
        remove("add_test_file.txt");
    }   
};

//test get discription

TEST_F(PATCHPOSTCommand, testDiscription){
    FileManager data("patch_test_file.txt");
    TerminalOutput output;
    PATCHCommand patchCommand(data, output);
    EXPECT_EQ(patchCommand.getDescription(), "PATCH, arguments: [userid] [movieid1] [movieid2] ...");
    POSTCommand postCommand(data, output);
    EXPECT_EQ(postCommand.getDescription(), "POST, arguments: [userid] [movieid1] [movieid2] ...");
}

//test valid input

TEST_F(PATCHPOSTCommand, testInvalidInputTab){
    FileManager data("add_test_file.txt");
    TerminalOutput output;
    PATCHCommand patchCommand(data, output);
    POSTCommand postCommand(data, output);
    string input = "21 87\t90";
    EXPECT_FALSE(patchCommand.validCheck(input));
    EXPECT_FALSE(postCommand.validCheck(input));
    input = ""; 
    EXPECT_FALSE(patchCommand.validCheck(input));
    EXPECT_FALSE(postCommand.validCheck(input));
    input = "25 89y"; 
    EXPECT_FALSE(patchCommand.validCheck(input));
    EXPECT_FALSE(postCommand.validCheck(input));
    input = "25 67 890000000 788814444 99"; 
    EXPECT_TRUE(patchCommand.validCheck(input));
    EXPECT_TRUE(postCommand.validCheck(input));
    input = "25 89 65"; 
    EXPECT_TRUE(patchCommand.validCheck(input));
    EXPECT_TRUE(postCommand.validCheck(input));
    input = "-39 89"; 
    EXPECT_FALSE(patchCommand.validCheck(input));
    EXPECT_FALSE(postCommand.validCheck(input));
    input = "25                89            65"; 
    EXPECT_TRUE(patchCommand.validCheck(input));
    EXPECT_TRUE(postCommand.validCheck(input));
}


//test execute

TEST_F(PATCHPOSTCommand, testAddNewUser){
    // Set up test data
    FileManager data("add_test_file.txt");
    TerminalOutput output;
    PATCHCommand patchCommand(data, output);
    POSTCommand postCommand(data, output);

    // Prepare input for patchCommand and postCommand
    string input = "25 89 65";

    // Redirect std::cout to a string stream to capture the output
    std::stringstream capturedOutput;
    std::streambuf* originalCoutBuf = std::cout.rdbuf(capturedOutput.rdbuf());  // Redirect to stringstream

    // Execute patchCommand
    patchCommand.execute(input);  // Expecting "404 Not Found"
    EXPECT_FALSE(data.userExists(25));

    // Execute postCommand
    postCommand.execute(input);  // Expecting "201 Created"
    EXPECT_TRUE(data.userExists(25));
    EXPECT_EQ(data.getUser(25).getMoviesString(), "89 65");

    // Capture additional inputs and execute postCommand
    input = "25 89 65 43";
    postCommand.execute(input);  // Expecting "404 Not Found"
    EXPECT_EQ(data.getUser(25).getMoviesString(), "89 65");

    input = "25 1 1 1 1 1";
    postCommand.execute(input);  // Expecting "404 Not Found"
    EXPECT_EQ(data.getUser(25).getMoviesString(), "89 65");

    input = "25        453        76";
    postCommand.execute(input);  // Expecting "404 Not Found"
    EXPECT_EQ(data.getUser(25).getMoviesString(), "89 65");

    input = "25        453        76";
    patchCommand.execute(input);  // Expecting "404 Not Found"
    EXPECT_EQ(data.getUser(25).getMoviesString(), "89 65 453 76");

    input = "25 1 1 1 1 1";
    postCommand.execute(input);  // Expecting "404 "
    EXPECT_EQ(data.getUser(25).getMoviesString(), "89 65 453 76");

    input = "26 1 1 1 1 1";
    postCommand.execute(input);  // Expecting "201 Not Found"
    EXPECT_EQ(data.getUser(26).getMoviesString(), "1");


    // Reset std::cout back to its original buffer
    std::cout.rdbuf(originalCoutBuf);

    // Check the captured output for the expected sequence of status codes
    std::string outputStr = capturedOutput.str();

    // Verify the expected output sequence
    size_t pos = 0;
    EXPECT_TRUE((pos = outputStr.find("404 Not Found", pos)) != std::string::npos);  
    pos += 1;  
    EXPECT_TRUE((pos = outputStr.find("201 Created", pos)) != std::string::npos);  
    pos += 1;  
    EXPECT_TRUE((pos = outputStr.find("404 Not Found", pos)) != std::string::npos); 
    pos += 1;  
    EXPECT_TRUE((pos = outputStr.find("404 Not Found", pos)) != std::string::npos); 
    pos += 1;  
    EXPECT_TRUE((pos = outputStr.find("404 Not Found", pos)) != std::string::npos); 
    pos += 1; 
    EXPECT_TRUE((pos = outputStr.find("204 No Content", pos)) != std::string::npos); 
    pos += 1;  
    EXPECT_TRUE((pos = outputStr.find("404 Not Found", pos)) != std::string::npos); 
    pos += 1; 
    EXPECT_TRUE((pos = outputStr.find("201 Created", pos)) != std::string::npos); 


}
