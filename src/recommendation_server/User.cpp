#include "User.h"
#include <sstream> 

using namespace std;


User:: User(unsigned long int id) : id(id) {}

User:: User(unsigned long int id, string movies) : id(id) {
  stringstream ss(movies);
  string movieId;
  while (ss >> movieId) {
    // Convert the string to an integer
    int movieIdInt = stoi(movieId);  
    // Add the movie to the list
    watchedMovies.add(Movie(movieIdInt));  
  }
}

unsigned long int User:: getId() const{
  return id;
}


const MovieList& User:: getWatchedMovies() const{
  return watchedMovies;
}


void User:: add(const Movie& movie){
  watchedMovies.add(movie);
}

void User:: add(const MovieList& movies){
  // Get length of the list
  size_t len = movies.size();
  
  for (size_t i = 0; i < len; i++) {
    watchedMovies.add(movies[i]);
  }
}

void User::remove(const Movie& movie) {
  watchedMovies.remove(movie);
}

void User::remove(const MovieList& movies) {
    for (size_t i = 0; i < movies.size(); ++i) { // Assuming movies.size() is valid
        watchedMovies.remove(movies.at(i)); // Assuming at(i) is valid
    }
}

bool User:: hasWatched(const Movie& movie) const{
  // Check if the movie is in the user's watched movies
  return watchedMovies.contains(movie);
}


void User:: clearWatchedMovies(){
  watchedMovies.clear();
}


size_t User:: getWatchedMovieCount() const{
  return watchedMovies.size();
}


bool User:: hasWatchedAny() const{
  return !watchedMovies.empty();
}

size_t User:: countCommonMovies(const User& other) const{
  return watchedMovies.countCommonMovies(other.getWatchedMovies());
}

string User:: getMoviesString() const{
  string result;
  // The length of the movie list
  size_t length = watchedMovies.size();
  for(size_t i = 0; i < length; i++ ){
    // Starting the second ID , add a sapce before the ID
    if (i > 0){
      result += " ";
    }
    // Add the id to the result
    result += to_string(watchedMovies[i].getId());
  }

  return result;
}

bool User:: operator==(const User& other) const{
  return id == other.id;
}
bool User:: operator!=(const User& other) const{
  return !(*this == other);
}
bool User:: operator<(const User& other) const{
  return id < other.id;
}
bool User:: operator>(const User& other) const{
  return id > other.id;
}
bool User:: operator<=(const User& other) const{
  return id <= other.id;
}
bool User:: operator>=(const User& other) const{
  return id >= other.id;
}