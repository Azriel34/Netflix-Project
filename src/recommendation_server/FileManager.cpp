#include <fstream>
#include <sstream>
#include "FileManager.h"

using namespace std;

FileManager::FileManager(const string& fileName) : DATA_FILE_NAME(fileName) { }

// This temporary file is used for intermediate operations (e.g., during user removal).
string FileManager::getTempFileName() const {
    // Add _temp between the actual file name the file extension, e.g. .txt.
    // Add to the substring that is the beginning of the file untill the last dot, _temp and then add the rest.
    return DATA_FILE_NAME.substr(0, DATA_FILE_NAME.find_last_of(".")) + "_temp" + DATA_FILE_NAME.substr(DATA_FILE_NAME.find_last_of("."));
}


User FileManager::getUser(unsigned long int userid) {
    ifstream inFile(DATA_FILE_NAME);

    if (inFile.fail()) {
        // The file couldn't be opened, throw an exception
        throw runtime_error("Error opening file for reading: " + DATA_FILE_NAME);
    }

    string line;
    while (getline(inFile, line)) {
        // Create a string stream
        istringstream iss(line);
        //
        unsigned long int currentUserid;
        string movies;
        iss >> currentUserid;

        if (currentUserid == userid) {
            // Read the list of movies
            getline(iss, movies);
            // Close file before returning
            inFile.close();  
            return User(currentUserid, movies);  // Return the found user
        }
    }

    inFile.close();
    // If the user wasn't found, throw an exception
    throw runtime_error("User not found.");
}

void FileManager::addUser(const User& user) {
    // Open the file for writing
    ofstream outFile(DATA_FILE_NAME, std::ios::app);
    if (outFile.fail()) {
        throw runtime_error("Error opening file for writing: " + DATA_FILE_NAME);
    }

    // Add the user to the data in the format: userid movieid1 movieid2 ...
    outFile << user.getId() << " " << user.getMoviesString() << "\n";
    outFile.close();
}

void FileManager::removeUser(const User& user) {
    // Use the private method to get the temporary file name
    const string TEMP_FILE_NAME = getTempFileName();
    // Open the data file
    ifstream inFile(DATA_FILE_NAME);
    if (inFile.fail()) {
        throw runtime_error("Error opening file for reading: " + DATA_FILE_NAME);
    }
    // Use a temporary file for writing the updated data
    ofstream tempFile(TEMP_FILE_NAME, std::ios::trunc);
    if (tempFile.fail()) {
        inFile.close();
        throw runtime_error("Error creating temporary file for writing.");
    }
    string line;
    bool userFound = false;
    // Process each line of the file
    while (getline(inFile, line)) {
        istringstream iss(line);
        unsigned long int currentUserid;

        // Parse the user ID
        if (iss >> currentUserid) {
            if (currentUserid == user.getId()) {
                userFound = true; // Mark the user as found
                continue;         // Skip writing this user to the temp file, by so removing it
            }
        }

        // Write the other users' data to the temporary file
        tempFile << line << "\n";
    }

    inFile.close();
    tempFile.close();

    if (!userFound) {
        // If the user was not found, throw an exception
        throw runtime_error("User not found: " + to_string(user.getId()));
    }

    // Note: c_str converts strings to const char* (C -style)

    // Replace the old file with the updated one:

    //Remove the old file
    if (remove(DATA_FILE_NAME.c_str()) != 0) {
        throw runtime_error("Error deleting the original file.");
    }

    // Rename the new file
    if (rename(TEMP_FILE_NAME.c_str(), DATA_FILE_NAME.c_str()) != 0) {
        throw runtime_error("Error renaming temporary file to original.");
    }
}

bool FileManager::userExists(const User& user) const {
    // Method declaration, implementation will involve reading the file
    ifstream inFile(DATA_FILE_NAME);
    if (inFile.fail()) {
        // The file was not opened successfully
        return false;
    }
    //check if the file is empty
    if (inFile.peek() == ifstream::traits_type::eof()) {
        // The file is empty
        inFile.close();
        return false;
    }
    string line;
    // Read the file line by line
    while (getline(inFile, line)) {
        istringstream iss(line);
        unsigned long int userIdFromFile;
        // Parse the userId from the line
        if (iss >> userIdFromFile) {
            // If the userId matches, return true
            if (userIdFromFile == user.getId()) {
                inFile.close(); // Close before returning
                return true;
            }
        }
    }

    inFile.close();
    // If the user was not found, return false
    return false;
}

void FileManager::resetStream() { 
    // If the stream is already open, close it first
    if (inFile.is_open()) {
        inFile.close();
    }

    // Reset the flag (in case of an error)
    streamInitialized = false;

    // Open the data file for reading
    inFile.open(DATA_FILE_NAME);
    if (inFile.fail()) {
        ofstream outFile(DATA_FILE_NAME, std::ios::app);
        if (outFile.fail()) {
            throw runtime_error("Error opening file for writing: " + DATA_FILE_NAME);
        }
    }

    // Clear any error flags from previous file operations
    inFile.clear();

    // Mark the stream as initialized
    streamInitialized = true;
}

bool FileManager::hasNextUser() const {
    // Check if the stream is initialized and if there are still valid users to read
    if (!streamInitialized || !inFile) {
        return false;
    }

    // Peek the next line to check if it's empty or valid
    streampos currentPos = inFile.tellg(); // Save the current position
    string nextLine;
    bool hasValidLine = false;

    // Keep reading lines untill a non-empty line is found
    while (getline(inFile, nextLine)) {
        if (!nextLine.empty()) {
            // There exsits a non-empty line in the file
            hasValidLine = true;
            break;
        }
    }

    // Restore the stream to its original position
    inFile.clear(); // Clear EOF state if reached
    inFile.seekg(currentPos); // Restore the position

    return hasValidLine;
}

User FileManager::nextUser() {
    if (!hasNextUser()) {
        throw runtime_error("No more users to read or file not properly initialized.");
    }

    string line;
    // Keep reading lines untill a non empty line is reached
    while (getline(inFile, line)) {
        if (line.empty()) {
            continue; // Skip empty lines
        }

        istringstream iss(line);
        unsigned long int userId;
        string movies;

        // Parse the user ID and the remaining movies string
        if (iss >> userId) {
            // Get the rest of the string - the string with the movies
            getline(iss, movies);
            if (!movies.empty()) {
                return User(userId, movies); 
            }
        }
    }

    throw runtime_error("Failed to read the next user."); // No more valid lines
}