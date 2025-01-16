#include <gtest/gtest.h>
#include "MovieList.h"

class MovieListTest : public ::testing::Test {
protected:
    MovieList movieList;
};

TEST_F(MovieListTest, AddMovie) {
    Movie movie1(1);
    movieList.add(movie1);
    // Ensure that the movie was added by checking the size
    EXPECT_EQ(movieList.size(), 1);

    Movie movie2(2);
    movieList.add(movie2);
    // Ensure that the movie was added by checking the size
    EXPECT_EQ(movieList.size(), 2);

    // Make sure the list handles duplicates
    Movie movie02(2);
    movieList.add(movie02);
    // Ensure size remains the same
    EXPECT_EQ(movieList.size(), 2);
}

TEST_F(MovieListTest, RemoveMovie) {
    Movie movie(1);
    Movie movie2(2);
    movieList.add(movie);

    movieList.remove(movie2);
    // Ensure the size remains after removing a non existent movie
    EXPECT_EQ(movieList.size(), 1);

    movieList.remove(movie);
    // Ensure that the movie was removed by checking the size
    EXPECT_EQ(movieList.size(), 0);

}

TEST_F(MovieListTest, ContainsMovie) {
    Movie movie(1);
    movieList.add(movie);
    // Check that the movie is contained in the list
    EXPECT_TRUE(movieList.contains(movie));
}

TEST_F(MovieListTest, DoesNotContainMovie) {
    Movie movie(1);
    // Check that the movie is not in the list if it was not added
    EXPECT_FALSE(movieList.contains(movie));
}

TEST_F(MovieListTest, AccessMovieByIndex) {
    Movie movie(1);
    movieList.add(movie);
    // Ensure the correct movie is accessed by index
    EXPECT_EQ(movieList.at(0), movie);
}

TEST_F(MovieListTest, CountCommonMovies) {
    Movie movie1(1), movie2(2);
    MovieList otherList;
    movieList.add(movie1);
    otherList.add(movie1);
    otherList.add(movie2);
    // Ensure that common movies between the lists are counted correctly
    EXPECT_EQ(movieList.countCommonMovies(otherList), 1);
}

TEST_F(MovieListTest, ClearList) {
    Movie movie1(1);
    Movie movie2(1);
    movieList.add(movie1);
    movieList.add(movie2);
    movieList.clear();
    // Ensure the list is cleared
    EXPECT_EQ(movieList.size(), 0);
}

TEST_F(MovieListTest, EmptyList) {
    // Ensure the list is empty initially
    EXPECT_TRUE(movieList.empty());

    Movie movie(1);
    movieList.add(movie);
    movieList.remove(movie);
    // Ensure the list is empty
    EXPECT_TRUE(movieList.empty());

}
