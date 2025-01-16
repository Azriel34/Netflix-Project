cmake_minimum_required(VERSION 3.14)

# Project Name
project(MovieApp)

# C++ Standard
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Source files for the application
file(GLOB SRC_FILES
    src/*.cpp
)

# Header file directory
include_directories(src)

# Create a library from the src files (excluding main.cpp)
list(FILTER SRC_FILES EXCLUDE REGEX "src/main.cpp")
add_library(MovieAppLib ${SRC_FILES})

# Add the executable for the main application
add_executable(MovieApp src/main.cpp)
target_link_libraries(MovieApp PRIVATE MovieAppLib)

# GoogleTest setup
find_package(GTest REQUIRED)
include_directories(${GTEST_INCLUDE_DIRS})

# Add test source files
file(GLOB TEST_FILES
    tests/*.cpp
)

# Add the executable for the tests
add_executable(MovieAppTests ${TEST_FILES})

# Add src as include directory for tests
target_include_directories(MovieAppTests PRIVATE src)

# Link the test executable with the library and GoogleTest
target_link_libraries(MovieAppTests PRIVATE MovieAppLib GTest::GTest GTest::Main)

# Enable testing
enable_testing()
add_test(NAME MovieAppTests COMMAND MovieAppTests)
