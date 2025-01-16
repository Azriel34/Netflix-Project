# ifndef MOVIELIST_H
# define MOVIELIST_H

# include "Movie.h"
# include <vector>

using namespace std;

class MovieList{
private:
  vector<Movie> vec;

public:
  // Initialize an empty list of movies
  MovieList();
  //initialize a list of movies
  MovieList(const vector<Movie>& movies);

  // Add a movie to the list, discarding movies that are already there
  void add(const Movie& movie);

  // Remove a movie from the list
  void remove(const Movie& movie);

  size_t size() const;

  // Get a movie in a random access
  Movie at(size_t index) const;

  // Operator overloader for random access (for convenience)
  Movie operator[](size_t index) const;

  // Check if the list contains a specific movie
  bool contains(const Movie& movie) const;

  // Clear all elements
  void clear();

  // Check if the list is empty
  bool empty() const;

  // Return the numner of movies that are common with another movie list
  size_t countCommonMovies(const MovieList& other) const;

};

# endif