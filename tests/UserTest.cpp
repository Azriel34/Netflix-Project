#include <gtest/gtest.h>
#include "User.h"

// A class for common intilization for all the tests
class UserTest : public ::testing::Test {
protected:
    // Initialize a user with ID 57 
    User user{57}; 
};

// Note: TEST_F if for when the tests use the same setup (the one defined in the class above)

TEST_F(UserTest, Getters) {
    // Verify the ID of the user
    EXPECT_EQ(user.getId(), 57);

    Movie movie(100);
    user.add(movie);
    // Verify the user's movie list
    EXPECT_EQ(user.getWatchedMovies()[0], movie);
}

TEST_F(UserTest, AddSingleMovie) {
    Movie movie(1);
    user.add(movie);
    // Verify the movie is added to the watched list
    EXPECT_TRUE(user.hasWatched(movie));
    EXPECT_EQ(user.getWatchedMovieCount(), 1);
}

TEST_F(UserTest, AddMultipleMovies) {
    MovieList movies;
    movies.add(Movie(1));
    movies.add(Movie(2));
    user.add(movies);
    // Verify both movies are added to the watched list
    EXPECT_TRUE(user.hasWatched(Movie(1)));
    EXPECT_TRUE(user.hasWatched(Movie(2)));
    EXPECT_EQ(user.getWatchedMovieCount(), 2);
}

TEST_F(UserTest, HasWatchedAny) {
    // Verify initially the user has not watched any movies
    EXPECT_FALSE(user.hasWatchedAny());
    user.add(Movie(1));
    // Verify that after adding a movie the user has watched movies
    EXPECT_TRUE(user.hasWatchedAny());
}

TEST_F(UserTest, ClearWatchedMovies) {
    user.add(Movie(1));
    user.clearWatchedMovies();
    // Verify the watched list is cleared
    EXPECT_EQ(user.getWatchedMovieCount(), 0);
    EXPECT_FALSE(user.hasWatchedAny());
}

TEST_F(UserTest, CountCommonMovies) {
    User otherUser(91);
    user.add(Movie(1));
    user.add(Movie(2));
    otherUser.add(Movie(2));
    otherUser.add(Movie(3));
    // Verify the count of common movies between users
    EXPECT_EQ(user.countCommonMovies(otherUser), 1);
}

TEST_F(UserTest, GetMoviesString) {
    user.add(Movie(1));
    user.add(Movie(3));
    user.add(Movie(15));
    user.add(Movie(8));

    string expected = "1 3 15 8";
    EXPECT_EQ(user.getMoviesString(), expected);

    user.clearWatchedMovies();
    EXPECT_EQ(user.getMoviesString(), "");
}

TEST_F(UserTest, ComparisonOperators) {
    User user1(91);
    User user2(57);
    // Verify comparison operators by user ID
    EXPECT_FALSE(user == user1);
    EXPECT_TRUE(user == user2);
    EXPECT_TRUE(user != user1);
    EXPECT_FALSE(user < user2);
    EXPECT_TRUE(user < user1);
    EXPECT_FALSE(user > user1);
    EXPECT_TRUE(user <= user2);
    EXPECT_TRUE(user <= user1);
    EXPECT_TRUE(user >= user2);
}

TEST_F(UserTest, ConstructorByString) {
     // Verify initializing with a string works as expected
    User user1(91, "1 2 3");
    User user2(57, "1 3 4 7");

    // Verify the user IDs
    EXPECT_EQ(user1.getId(), 91);
    EXPECT_EQ(user2.getId(), 57);

    // Verify the number of movies for user1
    EXPECT_EQ(user1.getWatchedMovies().size(), 3);

    // Verify user2 has watched movie with ID 7
    EXPECT_TRUE(user2.hasWatched(Movie(7)));

    // Verify the number of common movies between user1 and user2
    EXPECT_EQ(user1.countCommonMovies(user2), 2);
}
