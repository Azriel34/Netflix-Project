#include <gtest/gtest.h>
#include <thread>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string>
#include <cstring>
#include <mutex>
#include <unordered_set>
#include <condition_variable>
#include "SocketInput.h"

using namespace std;

int setupServerForInput(int port) {
    int serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) throw runtime_error("Socket creation failed");

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(port);

    if (bind(serverSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) < 0)
        throw runtime_error("Bind failed");

    if (listen(serverSocket, 1) < 0)
        throw runtime_error("Listen failed");

    return serverSocket;
}

int setupClientForInput(const string& serverIp, int port) {
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

TEST(SocketInputTest, HandlesClientServerCommunication) {
    const int port = 8080;
    const string testMessage = "Hello from client!";
    int serverSocket;
    int clientSocket;
    int acceptedSocket;

    mutex mtx;
    condition_variable cv;
    bool serverReady = false;

    thread serverThread([&]() {
        serverSocket = setupServerForInput(port);

        {
            lock_guard<mutex> lock(mtx);
            serverReady = true;
        }
        cv.notify_one();

        sockaddr_in clientAddr{};
        socklen_t clientLen = sizeof(clientAddr);
        acceptedSocket = accept(serverSocket, (struct sockaddr*)&clientAddr, &clientLen);
        if (acceptedSocket < 0) throw runtime_error("Accept failed");

        close(serverSocket);
    });

    {
        unique_lock<mutex> lock(mtx);
        cv.wait(lock, [&]() { return serverReady; });
    }

    thread clientThread([&]() {
        clientSocket = setupClientForInput("127.0.0.1", port);
        send(clientSocket, testMessage.c_str(), testMessage.size(), 0);
        close(clientSocket);
    });

    serverThread.join();
    clientThread.join();

    SocketInput socketInput(acceptedSocket);
    EXPECT_EQ(socketInput.getInput(), testMessage);

    close(acceptedSocket);
}

TEST(SocketInputTest, HandlesMultipleClients) {
    const int port = 8080;
    const vector<string> testMessages = {"Hello from client 1!", "Hello from client 2!", "Hello from client 3!"};
    int serverSocket;
    vector<int> acceptedSockets;

    mutex mtx;
    condition_variable cv;
    bool serverReady = false;
    int clientCount = testMessages.size();

    try {
        thread serverThread([&]() {
            try {
                serverSocket = setupServerForInput(port);

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

        vector<thread> clientThreads;
        for (int i = 0; i < clientCount; ++i) {
            clientThreads.push_back(thread([&, i]() {
                try {
                    int clientSocket = setupClientForInput("127.0.0.1", port);
                    send(clientSocket, testMessages[i].c_str(), testMessages[i].size(), 0);
                    close(clientSocket);
                } catch (const runtime_error& e) {
                    cerr << "Client thread error: " << e.what() << endl;
                }
            }));
        }

        // Wait for all client threads to finish
        for (auto& t : clientThreads) {
            t.join();  // Join client threads to ensure proper synchronization
        }

        serverThread.join();  // Join the server thread to wait for it to finish

        // Verify the messages received from each client
        unordered_set<string> inputs;
        unordered_set<string> messeges;
        for (int i = 0; i < clientCount; ++i) {
            SocketInput socketInput(acceptedSockets[i]);
            inputs.insert(socketInput.getInput());
            messeges.insert(testMessages[i]);
            close(acceptedSockets[i]);
        }
        EXPECT_EQ(inputs, messeges);
    } catch (const exception& e) {
        cerr << "Test error: " << e.what() << endl;
        FAIL() << "Test failed due to an exception.";
    }
}

