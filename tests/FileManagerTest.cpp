#include <gtest/gtest.h>
#include "FileManager.h"

using namespace std;

class FileManagerTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Any setup for your tests
    }

    void TearDown() override {
        // Remove the test file to ensure a clean state after the tests finish
        remove("data_test_file.txt");
    }
};

TEST_F(FileManagerTest, UsersManagementMethods) {
    FileManager fileManager("data_test_file.txt");
    User user(68);
    // The user should not exist at first
    EXPECT_FALSE(fileManager.userExists(user));
    fileManager.addUser(user);
    // The user should exist after adding him
    EXPECT_TRUE(fileManager.userExists(user));
    // The user can be found by his id
    EXPECT_EQ(fileManager.getUser(68).getId(), 68);
    fileManager.removeUser(user); 
    // The user shouldn't exist after removing him
    EXPECT_FALSE(fileManager.userExists(user));
}

TEST_F(FileManagerTest, StreamMethods) {
    FileManager fileManager("data_test_file.txt");  
    User user1(68);
    user1.add(Movie(9));
    fileManager.resetStream();
    EXPECT_FALSE(fileManager.hasNextUser());
    fileManager.addUser(user1);
    fileManager.resetStream();
    EXPECT_TRUE(fileManager.hasNextUser());
    while(fileManager.hasNextUser()){
        EXPECT_EQ(fileManager.nextUser().getId(), 68);
    }
}
