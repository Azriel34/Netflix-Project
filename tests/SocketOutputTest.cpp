#include <gtest/gtest.h>
#include <thread>
#include <unordered_set>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string>
#include <cstring>
#include <mutex>
#include <unordered_set>
#include <condition_variable>
#include "SocketOutput.h"  // Include the header for your SocketOutput class

using namespace std;

int setupServerForOutput(int port) {
    int serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) {
        throw runtime_error("Socket creation failed");
    }

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(port);
    //if the bind was recently freed
    int optval = 1;
    if (setsockopt(serverSocket, SOL_SOCKET, SO_REUSEADDR, &optval, sizeof(optval)) < 0) {
        cerr << "setsockopt failed" << endl;
        throw runtime_error("SO_REUSEADDR failed");
    }

    if (bind(serverSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        close(serverSocket);  // Ensure socket is closed on error
        throw runtime_error("Bind failed");
    }

    if (listen(serverSocket, 1) < 0) {
        close(serverSocket);  // Ensure socket is closed on error
        throw runtime_error("Listen failed");
    }

    return serverSocket;
}

void closeServerSocketForOutput(int serverSocket) {
    if (serverSocket >= 0) {
        close(serverSocket);
    }
}

int setupClientForOutput(const string& serverIp, int port) {
    int clientSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (clientSocket < 0) throw runtime_error("Socket creation failed");

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port);
    inet_pton(AF_INET, serverIp.c_str(), &serverAddr.sin_addr);

    if (connect(clientSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) < 0)
        throw runtime_error("Connection failed");

    return clientSocket;
}

TEST(SocketOutputTest, HandlesClientServerCommunication) {
    const int port = 8080;
    const string testMessage = "Hello from server!";
    int serverSocket;
    int clientSocket;
    int acceptedSocket;

    mutex mtx;
    condition_variable cv;
    bool serverReady = false;

    thread serverThread([&]() {
        serverSocket = setupServerForOutput(port);

        {
            lock_guard<mutex> lock(mtx);
            serverReady = true;
        }
        cv.notify_one();

        sockaddr_in clientAddr{};
        socklen_t clientLen = sizeof(clientAddr);
        acceptedSocket = accept(serverSocket, (struct sockaddr*)&clientAddr, &clientLen);
        if (acceptedSocket < 0) throw runtime_error("Accept failed");

        SocketOutput socketOutput(acceptedSocket);  // Create the SocketOutput object
        socketOutput.sendOutput(testMessage);      // Send message from server to client

        close(serverSocket);
    });

    {
        unique_lock<mutex> lock(mtx);
        cv.wait(lock, [&]() { return serverReady; });
    }

    thread clientThread([&]() {
        clientSocket = setupClientForOutput("127.0.0.1", port);
        
        // Read the message sent by the server
        char buffer[1024] = {0};
        ssize_t bytesRead = recv(clientSocket, buffer, sizeof(buffer), 0);
        if (bytesRead < 0) throw runtime_error("Read failed");

        string receivedMessage(buffer, bytesRead);
        EXPECT_EQ(receivedMessage, testMessage);  // Verify that the message received is correct

        close(clientSocket);
    });

    serverThread.join();
    clientThread.join();
}

TEST(SocketOutputTest, HandlesMultipleClients) {
    const int port = 8080;
    const vector<string> testMessages = {"Hello from server 1!", "Hello from server 2!", "Hello from server 3!"};
    int serverSocket;
    vector<int> acceptedSockets;

    mutex mtx;
    condition_variable cv;
    bool serverReady = false;
    int clientCount = testMessages.size();

    try {
        thread serverThread([&]() {
            try {
                serverSocket = setupServerForOutput(port);

                {
                    lock_guard<mutex> lock(mtx);
                    serverReady = true;
                }
                cv.notify_all();

                sockaddr_in clientAddr{};
                socklen_t clientLen = sizeof(clientAddr);
                
                // Accept multiple clients
                for (int i = 0; i < clientCount; ++i) {
                    int acceptedSocket = accept(serverSocket, (struct sockaddr*)&clientAddr, &clientLen);
                    if (acceptedSocket < 0) throw runtime_error("Accept failed");
                    acceptedSockets.push_back(acceptedSocket);

                    // Send message to each client
                    SocketOutput socketOutput(acceptedSocket);
                    socketOutput.sendOutput(testMessages[i]);
                }

                close(serverSocket);
            } catch (const runtime_error& e) {
                cerr << "Server thread error: " << e.what() << endl;
                throw;  // Rethrow exception to terminate the test
            }
        });

        {
            unique_lock<mutex> lock(mtx);
            cv.wait(lock, [&]() { return serverReady; });
        }

        unordered_set<string> messages;
        unordered_set<string> outputs;
        vector<thread> clientThreads;
        for (int i = 0; i < clientCount; ++i) {
            clientThreads.push_back(thread([&, i]() {
                try {
                    int clientSocket = setupClientForOutput("127.0.0.1", port);
                    
                    // Read the message sent by the server
                    char buffer[1024] = {0};
                    ssize_t bytesRead = recv(clientSocket, buffer, sizeof(buffer), 0);
                    if (bytesRead < 0) throw runtime_error("Read failed");

                    string receivedMessage(buffer, bytesRead);
                    messages.insert(testMessages[i]);
                    outputs.insert(receivedMessage);

                    close(clientSocket);
                } catch (const runtime_error& e) {
                    cerr << "Client thread error: " << e.what() << endl;
                }
            }));
        }
        EXPECT_EQ(messages, outputs);

        // Wait for all client threads to finish
        for (auto& t : clientThreads) {
            t.join();  // Join client threads to ensure proper synchronization
        }

        serverThread.join();  // Join the server thread to wait for it to finish

        // Verify the messages received from each client (done within each client thread)
    } catch (const exception& e) {
        cerr << "Test error: " << e.what() << endl;
        FAIL() << "Test failed due to an exception.";
    }
}
