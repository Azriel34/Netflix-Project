#include "MovieList.h"
#include <algorithm>
#include <vector>
#include <stdexcept>

using namespace std;

MovieList:: MovieList(){}
MovieList:: MovieList(const vector<Movie>& movies) : vec(movies){};

void MovieList:: add(const Movie& movie){
  // If the movie is not already in the list, add it
  if (!contains(movie)){
    vec.push_back(movie);
  }
}

void MovieList:: remove(const Movie& movie){
  // Try to find the movie, find returns an iterator to the found movie if it is there, or vecotr.end() if not
  auto it = find(vec.begin(), vec.end(), movie);

  // If the movie is found
  if (it != vec.end()) {
      // Erase the movie by sending its iterator
      vec.erase(it);
  }
}

size_t MovieList:: size() const{
  return vec.size();
}

Movie MovieList:: at(size_t index) const{
  // Check if the index is valid
  if (index < vec.size()) {
    // If it is, return the movie in the given index
    return vec.at(index);
  }
  
  // If the index is out of range, throw an exception
  // TODO: learn more abut exceptions in c++.
  throw out_of_range("Index out of bounds");
}


Movie MovieList:: operator[](size_t index) const{
  // Calls the at method
  return at(index);
}

bool MovieList:: contains(const Movie& movie) const{
  // find returns an iterator to the found movie if it is there, or vecotr.end() (the end iterator) if not. So the list has the movie iff it dosent return vecor.end()
  return find(vec.begin(), vec.end(), movie) != vec.end();
  // (We have an operator overloder for comparing movies so it will indeed work as desired)

}


void MovieList:: clear() { 
  vec.clear(); 
}


bool MovieList:: empty() const { 
  return vec.empty();
}

size_t MovieList:: countCommonMovies(const MovieList& other) const {
      size_t commonCounter = 0;

      // Go over all the movies in the list
      for (const Movie& movie : vec) {
          // Check if the movie is in the other list using contains
          if (other.contains(movie)) {
              ++commonCounter;
          }
      }
      return commonCounter;
    }