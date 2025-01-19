#ifndef RECOMMENDCOMMAND_H
#define RECOMMENDCOMMAND_H

#include "ICommand.h"
#include "IDataManager.h"
#include "IOutput.h"

using namespace std;
class RecommendCommand : public ICommand {
private:
    unsigned long int userid;
    unsigned long int movieid;
    IDataManager& dataManager;  // Store the reference to IDataManager
    IOutput& output;            // Store the reference to IOutput
public:
    // Constructor
    RecommendCommand(IDataManager& dataManager, IOutput& output);

    // Execute the command
    void execute(string argumentString) override;

    // Count similarity in between 2 users
    // int countSimilarity(User currentUser, User targetUser);

    // Check if arguments are valid
    bool validCheck(string& argumentString) override;

    //Check if the number is string
    bool isNumberString(const string& str);

    //find the users who watch that movie
    vector<unsigned long int> usersWhoWatchTheMovieFunc(unsigned long int movieId);

    //find all the similarity with user
    vector<pair<unsigned long int, int>> similarityScoresFunc(unsigned long int userId);

    // Get the command description
    string getDescription() const override;

    //Find total Relevance
    vector<pair<unsigned long int, int>> totalRelevanceFunc
    (vector<pair<unsigned long int, int>> similarityScores, vector<unsigned long int> usersWhoWatchTheMovie, unsigned long int userId, unsigned long int movieId);
    
    //initialize the total relevance map
    void initializerTotalRelevance (vector<pair<unsigned long int, int>>&totalRelevance, unsigned long int userId, unsigned long int movieId);

    // Function to extract two numbers from the string
    pair<unsigned long int, unsigned long int> getNumbers(const string& argumentString);

    //put values to the keys in the totalRelevance map
    void assignmentTotalRelevance(vector<pair<unsigned long int, int>>& totalRelevance, vector<pair<unsigned long int, int>> similarityScores, vector<unsigned long int> usersWhoWatchTheMovie);

    //Get the first 10 recommendations from the vector
    vector<pair<unsigned long int, int>> firstTenRecommendationsFunc(vector<pair<unsigned long int, int>> totalRelevance);


    //print the first 10 recommendations (if exists)
    void printRecommendations(vector<pair<unsigned long int, int>> firstTenMovies);
};

#endif