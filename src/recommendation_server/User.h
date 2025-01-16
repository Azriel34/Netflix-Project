# ifndef USER_H
# define USER_H

#include <string>
#include "MovieList.h"
using namespace std;

class User{
private:
  // The ID of the user
  unsigned long int id;

  // A list of the movies that the user has watched
  MovieList watchedMovies;

public:
  // Initializes the user with a specific ID
  User(unsigned long int id);

  // Initializes the user with a specific ID and a string with a list of movies
  User(unsigned long int id, string movies);

  // Getter for the user ID
  unsigned long int getId() const;

  // Get a list of the user's watched movies
  const MovieList& getWatchedMovies() const; 

  // Add a movie to the user's watched movies
  void add(const Movie& movie);

  // Add a list of movies to the user's watched movies
  void add(const MovieList& movies);

  //remove movie from the user
  void remove(const Movie& movie);

  //remove movie list from the user  
  void remove(const MovieList& movies);

  // Check if the user has watched a specific movie
  bool hasWatched(const Movie& movie) const;

  // Clear the watched movie list of the user
  void clearWatchedMovies();

  // Get the number of movies watched
  size_t getWatchedMovieCount() const;

  // Check if the user has watched any movies
  bool hasWatchedAny() const;

  // Return the numner of watched movies that are common with another user
  size_t countCommonMovies(const User& other) const;

  // Get a string of the watched movies
  string getMoviesString() const;

  // Compare users by comparing their IDs
  bool operator==(const User&) const;
  bool operator!=(const User&) const;
  bool operator<(const User&) const;
  bool operator>(const User&) const;
  bool operator<=(const User&) const;
  bool operator>=(const User&) const;

};

# endif