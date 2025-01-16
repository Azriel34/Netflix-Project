# ifndef MOVIE_H
# define MOVIE_H

using namespace std;

class Movie{
private:
  // The ID of the movie
  unsigned long int id;

public:
  // Initializes the movie with a specific ID
  Movie(unsigned long int id);

  // Getter for the movie ID
  unsigned long int getId() const;

  // Compare movies by comparing their IDs
  bool operator==(const Movie&) const;
  bool operator!=(const Movie&) const;
  bool operator<(const Movie&) const;
  bool operator>(const Movie&) const;
  bool operator<=(const Movie&) const;
  bool operator>=(const Movie&) const;

};

# endif