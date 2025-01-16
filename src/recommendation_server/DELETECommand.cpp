#include "DELETECommand.h"
#include "UtilityMethods.h"
#include "StatusCodeCollection.h"
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

// Constructor
DELETECommand::DELETECommand(IDataManager& data, IOutput& output) : userid(0), data(data), output(output){}

// Validates the input string
bool DELETECommand::validCheck(string& input){
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

// Override the execute method from ICommand
void DELETECommand::execute(std::string args) {
    if(!validCheck(args)){
        output.sendOutput(StatusCodeCollection::get400());
        return;
    } try {
        //get the user from the data, if not found throw exeption
        MovieList* removedList = new MovieList();
        User user = data.getUser(this->userid);
        for(unsigned long int movieid : movieids){
            //check if all the movies are in the user movie list;
            removedList->add(movieid);
            if(!user.hasWatched(movieid)) {
                throw std::invalid_argument("All arguments should be in the user movie list");
            }
        }
        // Remove the existing user to update their data
        data.removeUser(user);
        //remove the movies from the user
        user.remove(*removedList);
        //add the new user to the data base
        data.addUser(user);
        output.sendOutput(StatusCodeCollection::get204());
    }
    catch(...){
        output.sendOutput(StatusCodeCollection::get404());
    }
}

// Definition of getDescription method
std::string DELETECommand::getDescription() const {
     // Description of the DELETECommand
    return "DELETE, arguments: [userid] [movieid1] [movieid2] ...";
}