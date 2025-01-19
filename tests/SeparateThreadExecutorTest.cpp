#include <gtest/gtest.h>
#include <SeparateThreadExecutor.h>
#include <iostream>
#include <thread>
#include "IRunnable.h"

using namespace std;

class SeparateThreadExecutorTest : public ::testing::Test {
protected:
    stringstream output;

    void SetUp() override {
        // Redirect cout to capture the output
        cout.rdbuf(output.rdbuf());
    }

    void TearDown() override {
        // Restore cout buffer after the test
        cout.rdbuf(cout.rdbuf());
    }
};

// Custom IRunnable implementation that prints the thread ID
class PrintThreadID : public IRunnable {
public:
    void run() override {
        cout << this_thread::get_id() << endl; 
    }
};

// Check if tasks are executed on separate threads by comparing TIDs
TEST_F(SeparateThreadExecutorTest, ExecutesInSeparateThreads) {
    SeparateThreadExecutor executor;

    // Create two PrintThreadID objects 
    PrintThreadID runnable1;
    PrintThreadID runnable2;

    // Execute the tasks twice using the executor
    executor.execute(runnable1);  
    executor.execute(runnable2); 

    // Wait for tasks to finish
    executor.wait();

    // Get the output captured during execution
    string outputStr = output.str();

    // Find the two thread IDs printed
    size_t firstTIDPos = outputStr.find("\n");
    size_t secondTIDPos = outputStr.find("\n", firstTIDPos + 1);

    // Extract the two thread IDs dynamically
    string firstTID = outputStr.substr(0, firstTIDPos);
    string secondTID = outputStr.substr(firstTIDPos + 1, secondTIDPos - firstTIDPos - 1);

    // Check that the thread IDs are different
    ASSERT_NE(firstTID, secondTID);
}