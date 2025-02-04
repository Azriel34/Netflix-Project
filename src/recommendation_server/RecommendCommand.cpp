#include "RecommendCommand.h"
#include <cctype>
#include <iostream>
#include <sstream>
#include <vector>
#include <set>
#include <unordered_map>
#include <algorithm>
#include "User.h"
#include <fstream>
#include <string>
#include <map>
#include "StatusCodeCollection.h"
#include "UtilityMethods.h"

using namespace std;

// Constructor
RecommendCommand::RecommendCommand(IDataManager& dataManager, IOutput& output)
    : dataManager(dataManager), output(output), userid(0), movieid(0) {}

//check for valid argument input
bool RecommendCommand::validCheck(string& argumentString) {
    //check for only spaces or ''
    if (UtilityMethods::onlySpaces(argumentString) == false){
        return false;
    }
    // Use a stringstream to extract the parts
    std::istringstream stream(argumentString);
    std::string firstPart, secondPart;

    // Try to read the first two parts
    if (stream >> firstPart >> secondPart) {
        // Check if both parts are valid "number-like" strings
        if (UtilityMethods::containsNoLetters(firstPart) && UtilityMethods::containsNoLetters(secondPart)) {
            // Now check if there are no more parts (more than 2 parts would make it invalid)
            std::string extra;
            if (stream >> extra) {
                return false;  // More than two parts is invalid
            }
            long userid = std::stol(firstPart);
            if(userid < 0){
                return false;
            }
            this->userid = (unsigned long int) userid;
            long movieid = std::stol(secondPart);
            if(movieid < 0){
                return false;
            }
            this->movieid = (unsigned long int) movieid;
            return true;  // Exactly two valid parts
        }
    }
    return false;
}

//get numbers from a string
pair<unsigned long int, unsigned long int> RecommendCommand::getNumbers(const string& argumentString) {
    std::istringstream stream(argumentString);
    unsigned long int firstNum, secondNum;

    // Read the two numbers from the stringstream
    stream >> firstNum >> secondNum;

    // Return the numbers as a pair
    return make_pair(firstNum, secondNum);
}

//find all the similarity with user
std::vector<std::pair<unsigned long int, int>> RecommendCommand::similarityScoresFunc(unsigned long int userId) {
    // Reset the stream for the data manager
    dataManager.resetStream();

    std::vector<std::pair<unsigned long int, int>> similarityScores;
    User targetUser = dataManager.getUser(userId);
    
    // Iterate over the users in dataManager
    while (dataManager.hasNextUser()) {
        User currentUser = dataManager.nextUser();
        //Make sure they are not the same user
        if (currentUser != targetUser) {
            //Count similarity and push to the map
            int similarityScore = targetUser.countCommonMovies(currentUser);
            //int similarityScore = countSimilarity(dataManager.getUser(currentUser.getId()), targetUser);
            similarityScores.push_back({currentUser.getId(), similarityScore});
        }
    }
    return similarityScores;
}

//find the users who watch that movie
std::vector<unsigned long int> RecommendCommand::usersWhoWatchTheMovieFunc(unsigned long int movieId) {
    std::vector<unsigned long int> usersWhoWatchTheMovie;
    dataManager.resetStream();
    //for every user
    while (dataManager.hasNextUser()) {
        User currentUser = dataManager.nextUser();
        //for every movie he watched
        if(currentUser.hasWatched(Movie(movieId))){
            usersWhoWatchTheMovie.push_back(currentUser.getId());
        } 
    }
    return usersWhoWatchTheMovie;
}

//initialize the total relevance map
void RecommendCommand::initializerTotalRelevance (vector<pair<unsigned long int, int>>&totalRelevance, unsigned long int userId, unsigned long int movieId) {
    //find every movie id from every user
    User targetUser = dataManager.getUser(userId);
    dataManager.resetStream();
    while (dataManager.hasNextUser()) {
        User currentUser = dataManager.nextUser();
        //check if the movie isnt our recommend movie, or our recommend user
        for (size_t i = 0; i < currentUser.getWatchedMovieCount(); i++) {
            Movie movie = currentUser.getWatchedMovies().at(i);
            if ((movie.getId() != movieid) && !(targetUser.hasWatched(movie))) {
                //make sure we are not adding save key twice
                //going over the list checking that we didnt added the movie
                bool newMovie = true;
                for (const auto& pair : totalRelevance) {
                    if (pair.first == currentUser.getWatchedMovies().at(i).getId()) {
                        newMovie = false;
                        break;
                    }
                }

                // Only add if not already in the list
                if (newMovie) {
                    totalRelevance.push_back({movie.getId(), 0});
                }            
            }
        }  
    }
}

//put values to the keys in the totalRelevance map
void RecommendCommand::assignmentTotalRelevance(vector<pair<unsigned long int, int>> & totalRelevance, vector<pair<unsigned long int, int>> similarityScores,vector<unsigned long int> usersWhoWatchTheMovie) {
    int value;
    //for every rellevant movie
    for (auto& pair : totalRelevance) {
        //for every relevant user
        for (const auto& userid : usersWhoWatchTheMovie) {
            User user = dataManager.getUser(userid);
            //check if the user contains this movie
            if(user.hasWatched(Movie(pair.first))){
                //find the movie value
                for (const auto& score : similarityScores) {
                    if (score.first == userid) {
                        // Get the value for the key
                        value = score.second;
                        // Exit the loop since the key is found
                        break; 
                    }
                }
                //add it 
                pair.second += value;
            }
            
        }  
    }
}


//Find total Relevance
vector<pair<unsigned long int, int>> RecommendCommand::totalRelevanceFunc (vector<pair<unsigned long int, int>> similarityScores,
 vector<unsigned long int> usersWhoWatchTheMovie, unsigned long int userId, unsigned long int movieId) {
    //This is the movie-relevant pairs
    vector<pair<unsigned long int, int>> totalRelevance;
    //Initilize with 0s and delete the none relevant
    initializerTotalRelevance(totalRelevance, userId, movieId);
    //Add them the values
    assignmentTotalRelevance(totalRelevance, similarityScores, usersWhoWatchTheMovie);
    return totalRelevance;
}

//Get the first 10 recommendations from the vector
vector<pair<unsigned long int, int>> RecommendCommand::firstTenRecommendationsFunc (vector<pair<unsigned long int, int>> totalRelevance) {
    // Sort the vector by the second element in descending order
    sort(totalRelevance.begin(), totalRelevance.end(), [](const std::pair<unsigned long int, int>& a, const std::pair<unsigned long int, int>& b) {
    // First sort by value in descending order
    if (a.second != b.second) {
        // Higher value comes first
        return a.second > b.second; 
    }
    // If values are equal, sort by key from small to big
    return a.first < b.first;
    });

    // Keep only the first 10 elements, if the size exceeds 10
    if (totalRelevance.size() > 10) {
        totalRelevance.resize(10);
    }

    //erase all the ones with 0 relevant
    totalRelevance.erase(
        remove_if(totalRelevance.begin(), totalRelevance.end(),
                       [](const std::pair<unsigned long int, int>& pair) {
                           return pair.second == 0;
                       }),
        totalRelevance.end()
    );

    return totalRelevance;
}

//Print the first 10 recommendations (if exists)
void RecommendCommand::printRecommendations(vector<pair<unsigned long int, int>> firstTenMovies) {
    ostringstream streamString;
    // Iterate through the vector and append each key to the string
    for (const auto& pair : firstTenMovies) {
        streamString << pair.first << " ";
    }
    // Save as string
    string result = streamString.str();
    // Remove the last space
    if (!result.empty() && (result.back() == ' ')) {
        result.pop_back();
    }
    output.sendOutput(StatusCodeCollection::get200() + "\n\n" + result);
}

// Implement execute
void RecommendCommand::execute(string argumentString) {
    if (!validCheck(argumentString)) {
        output.sendOutput(StatusCodeCollection::get400());
        return;
    }
    // Extract numbers from long string
    pair<unsigned long int, unsigned long int> numbers = getNumbers(argumentString);
    unsigned long int userid = numbers.first;
    unsigned long int movieid = numbers.second;

    vector<pair<unsigned long int, int>> similarityScores;

    //check if the user even exist, if it is not - 404
    try{
        similarityScores = similarityScoresFunc(userid);
    } catch (...) {
        output.sendOutput(StatusCodeCollection::get404());
        cout << "user not found!" << endl;
        
        return;
    }
    
    //find all the users who watched the movie by it id
    vector<unsigned long int> usersWhoWatchTheMovie = usersWhoWatchTheMovieFunc(movieid);

    //calculate the relevance table from the assignment
    vector<pair<unsigned long int, int>> totalRelevance = totalRelevanceFunc(similarityScores, usersWhoWatchTheMovie, userid, movieid);

    //find the top 10 recommendations
    vector<pair<unsigned long int, int>> firstTenMovies = firstTenRecommendationsFunc(totalRelevance);

    //print to the output the top 10 recommendations (if exist)
    printRecommendations(firstTenMovies);
}

// Implement getDescription
string RecommendCommand::getDescription() const {
    return "GET, arguments: [userid] [movieid]";
}