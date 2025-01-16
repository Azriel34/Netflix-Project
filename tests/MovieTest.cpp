# include <gtest/gtest.h>
# include "Movie.h"


TEST(MovieTest, Getters){
  Movie movie(76);
  // Check if the ID is correctly set to 76
  EXPECT_EQ(movie.getId(), 76);
}

TEST(MovieTest, Operators){
  Movie movie1(76);
  Movie movie2(93);
  Movie movie3(93);

  // Movies should be compares by their ID'S
  EXPECT_FALSE(movie1 == movie2);    
  EXPECT_TRUE(movie2 == movie3);
  EXPECT_FALSE(movie2 != movie3);
  EXPECT_TRUE(movie1 < movie3);
  EXPECT_FALSE(movie2 > movie3);
  EXPECT_TRUE(movie2 > movie1);
  EXPECT_TRUE(movie2 <= movie3);
  EXPECT_TRUE(movie1 <= movie3);
  EXPECT_FALSE(movie1 >= movie3);
  EXPECT_TRUE(movie3 >= movie1);
}

