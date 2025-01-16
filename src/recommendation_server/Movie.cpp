#include "Movie.h"

using namespace std;

Movie:: Movie(unsigned long int id) : id(id){}

unsigned long int Movie::getId() const {
  return id;
}

bool Movie:: operator==(const Movie& other) const {
  return id == other.id;
}

bool Movie:: operator!=(const Movie& other) const {
  return id != other.id;
}

bool Movie:: operator<(const Movie& other) const {
  return id < other.id;
}

bool Movie:: operator>(const Movie& other) const {
  return id > other.id;
}

bool Movie:: operator<=(const Movie& other) const {
  return id <= other.id;
}

bool Movie:: operator>=(const Movie& other) const {
  return id >= other.id;
}

