#include "ICommand.h"
#include <string>
#include <vector>
#include <sstream>
#include "PATCHCommand.h"
#include "User.h"
#include "MovieList.h"
#include <algorithm>
#include <string>
#include "StatusCodeCollection.h"
#include "UtilityMethods.h"

// Constructor for PATCHCommand, initializes the command with a reference to the data manager
PATCHCommand::PATCHCommand(IDataManager& data, IOutput& output) : userid(0), data(data), output(output){}

// Validates the input string
bool PATCHCommand::validCheck(string& input){
    //check for only spaces or ''
    if (UtilityMethods::onlySpaces(input) == false){
        return false;
    }
    movieids.clear();
    std::vector<std::string> words;
    // Create a stream to split the input
    std::istringstream stream(input);
    std::string word;
    // Split the input string into words
    while (stream >> word) {
        words.push_back(word);
    }
    // At least a user ID and one movie ID are required
    if(words.size() < 2){
        return false;
    }
    for(auto& str : words){
        if(!UtilityMethods::containsNoLetters(str)){
            return false;
        }
    }
    try {
        // Parse the first word as the user ID
        long userid = std::stol(words[0]);
        if(userid < 0){
            return false;
        }
        this->userid = (unsigned long int) userid;
    }catch (...){
        return false;    }
    // Parse the remaining words as movie IDs
    for(int i = 1; i < words.size(); i++){
        try {
            long movieid = std::stol(words[i]);
            if(movieid < 0){
                return false;
            }
            this->movieids.push_back((unsigned long int) movieid);
        }
        catch(...){
            return false;
        }
    }
     // Return whether the input is valid
    return true;
}

// Executes the AddCommand
void PATCHCommand::execute(string input){
    if(!validCheck(input)){
        output.sendOutput(StatusCodeCollection::get400());
        return;
    }
    try{
        User user = data.getUser(this->userid);
        // Remove the existing user to update their data
        data.removeUser(user);
        // Create a new MovieList and add the specified movies
        MovieList* added = new MovieList();
        for(unsigned long int movieid : movieids){
            Movie movie(movieid);
            added->add(movie);
        }
        // Add the updated MovieList to the user and re-add the user to the data manager
        user.add(*added);
        data.addUser(user);
        output.sendOutput(StatusCodeCollection::get204());
    }
    catch(runtime_error){
        output.sendOutput(StatusCodeCollection::get404());
    }
}

// Returns the description of the AddCommand
string PATCHCommand::getDescription() const{
    return "PATCH, arguments: [userid] [movieid1] [movieid2] ...";
}