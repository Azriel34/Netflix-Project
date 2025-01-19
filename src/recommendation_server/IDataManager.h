#ifndef DATAMANAGER_H
#define DATAMANAGER_H

#include <string>
#include "User.h"

using namespace std;

class IDataManager{
    // Interface for data management. Currently implemented with a file backend, but can be extended to support other storage options in the future.
    public:
        // Get a user from the data by his ID
        virtual User getUser(unsigned long int userid) = 0;
        // Add a user to the data
        virtual void addUser(const User& user) = 0;
        // Remove a user from the data
        virtual void removeUser(const User& user) = 0;
        // Check if the user exists in the data
        virtual bool userExists(const User& user) const = 0;

        // Methods for iteration stream:

        // Reset the iteration stream
        virtual void resetStream() = 0;
        // Check if there are more users in the stream
        virtual bool hasNextUser() const = 0;
        // Get the next user in the stream
        virtual User nextUser() = 0;

};

#endif