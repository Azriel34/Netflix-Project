#include <gtest/gtest.h>
#include <thread>
#include <vector>
#include <atomic>
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include "HelpCommand.h"
#include "Server.h"
#include "IExecutor.h"
#include "IDataManager.h"
#include "FileManager.h"
#include "SeparateThreadExecutor.h"

using namespace std;

class ServerTest : public :: testing::Test{
    protected:
        void SetUp() override {
        }

        void TearDown() override {
        }   
};
        
TEST_F(ServerTest, testBinding){
    //construct server
    IExecutor* executor = new SeparateThreadExecutor();
    Server server(executor,8080);
    //run the server in a seperate thread
    thread serverThread([&server]() {
        server.start();
    });
    //wait for the new thread to open the server
    this_thread::sleep_for(chrono::milliseconds(100));
    //try to bind to the port the second thread have binded to
    int testSocket = socket(AF_INET, SOCK_STREAM, 0);
    ASSERT_NE(testSocket, -1);

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    //endians translator
    sin.sin_port = htons(8080);
    //port should be used already
    ASSERT_EQ(bind(testSocket, (struct sockaddr*)&sin, sizeof(sin)), -1);
    close(testSocket);

    server.shutdown();
   
    serverThread.join();
    delete executor;
}

TEST_F(ServerTest, testHandlingMultipleClients) {
    // Construct server
    IExecutor* executor = new SeparateThreadExecutor();
    Server server(executor, 8081);

    // Run the server in a separate thread
    thread serverThread([&server]() {
        server.start();
    });

    // Wait for the server to start
    this_thread::sleep_for(chrono::milliseconds(100)); // You could use better synchronization than sleep

    const int numClients = 5;
    vector<thread> clientThreads;
    vector<string> responses(numClients);

    // Client thread setup
    for (int i = 0; i < numClients; ++i) {
        clientThreads.emplace_back([i, &responses]() {
            try {
                // Client code
                int clientSocket = socket(AF_INET, SOCK_STREAM, 0);
                ASSERT_NE(clientSocket, -1);

                sockaddr_in serverAddr = {};
                serverAddr.sin_family = AF_INET;
                serverAddr.sin_port = htons(8081);
                inet_pton(AF_INET, "127.0.0.1", &serverAddr.sin_addr);

                // Checking connection to the server
                ASSERT_EQ(connect(clientSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)), 0);

                // Send help command
                string message = "help";
                send(clientSocket, message.c_str(), message.size(), 0);

                // Receive response
                char buffer[1024] = {};
                int bytesReceived = recv(clientSocket, buffer, sizeof(buffer), 0);
                if (bytesReceived > 0) {
                    responses[i] = string(buffer, bytesReceived);
                }

                close(clientSocket);
            } catch (const std::exception& e) {
                std::cerr << "Error in client thread " << i << ": " << e.what() << std::endl;
            }
        });
    }

    // Wait for all client threads to finish
    for (auto& t : clientThreads) {
        if (t.joinable()) {
            t.join();
        }
    }

    // Validate responses
    for (int i = 0; i < numClients; ++i) {
        ASSERT_FALSE(responses[i].empty()) << "Response from client " << i << " is empty.";
    }

    // Shutdown server and cleanup
    server.shutdown();
    serverThread.join();
    executor->wait();

    // Delete the executor safely
    delete executor;
}


