#include "ICommand.h"
#include <string>
#include <vector>
#include <sstream>
#include "AddCommand.h"
#include "User.h"
#include "MovieList.h"
#include <algorithm>
#include <string>
#include "StatusCodeCollection.h"

// Constructor for AddCommand, initializes the command with a reference to the data manager
AddCommand::AddCommand(IDataManager& data, IOutput& output) : userid(0), data(data), output(output){}

bool numberStringCheck(string number){
    if (number.empty()) {
        return false;
    }
    size_t start = 0;
    // Iterate through each character to check for digits
    for (size_t i = start; i < number.size(); ++i) {
        if (!isdigit(number[i])) {
            return false;  // If it's not a digit, return false
        }
    }
    return true;
}

// Validates the input string
bool AddCommand::validCheck(string& input){
    //check for only spaces or ''
    for (char ch : input) {
        // Check if the character is a whitespace but not a space
        if (std::isspace(ch) && ch != ' ') {
            return false;
        }
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
        if(!numberStringCheck(str)){
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
void AddCommand::execute(string input){
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
    }
    catch(runtime_error){
        User user(userid);
        MovieList* added = new MovieList();
        for(unsigned long int movieid : movieids){
            Movie movie(movieid);
            added->add(movie);
        }
        // Add the MovieList to the user and add the new user to the data manager
        user.add(*added);
        data.addUser(user);
    }
}

// Returns the description of the AddCommand
string AddCommand::getDescription() const{
    return "add, arguments: [userid] [movieid1] [movieid2] ...";
}