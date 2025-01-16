#ifndef FILEMANAGER_H
#define FILEMANAGER_H

#include "IDataManager.h"
#include <fstream>
#include <string>

using namespace std;

class FileManager : public IDataManager {
private:
    // The file name
    const string DATA_FILE_NAME; 
    // Mutable stream to allow modification in const methods 
    mutable ifstream inFile;  
    // A flag to track if the stream has been initialized
    mutable bool streamInitialized = false;  

    // Generates and returns the name of a temporary file by appending "_temp" before the extension (e.g., "user_movies_data_temp.txt").
    string getTempFileName() const;
public:
    // Initialize the file manager with a spesific file name
    FileManager(const string& fileName = "./data/user_movies_data.txt");

    // Get a user from the file by his ID
    virtual User getUser(unsigned long int userid) override;
    // Add a user to the file
    virtual void addUser(const User& user) override;
    // Remove a user from the file
    virtual void removeUser(const User& user) override;
    // Check if the user exists in the file
    virtual bool userExists(const User& user) const override;
    
    // Iteration stream methods:

    // Reset the iteration stream
    virtual void resetStream() override;
    // Check if there are more users in the stream
    virtual bool hasNextUser() const override;
    // Get the next user in the stream
    virtual User nextUser() override;
};


#endif