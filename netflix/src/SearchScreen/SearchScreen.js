import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./SearchScreen.css";
import Navbar from "../Navbar/Navbar";
import { port } from '../index';
import { jwtDecode } from "jwt-decode"; // Correct named import
import MovieCard from '../MovieCard/MovieCard'; // Import the new MovieCard component
import { Link } from "react-router-dom"; // Add this import

function SearchScreen({ isDarkMode, toggleMode }) {
  const [permissionError, setPermissionError] = useState(null); // State to store permission error message
  const [userName, setUserName] = useState(null); // State to store the user name
  const [movieResults, setMovieResults] = useState(null); // State to store movie search results
  const [loading, setLoading] = useState(false); // State to track loading status
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
  const jwt = queryParams.get("jwt"); // Ensure we extract the correct `jwt` parameter

  // Check permission when jwt is available
  useEffect(() => {
    if (jwt) {
      // First, check permission
      fetch(`http://localhost:${port}/api/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            // Handle non-OK responses
            return response.json().then((err) => {
              setPermissionError(
                err.message || "You don't have permission to be here, please sign in"
              );
            });
          }
          // If permission is granted, fetch the user data
          setPermissionError(null);
          const decodedToken = jwtDecode(jwt);
          const userId = decodedToken.userId;
          // Fetch the user data
          return fetch(`http://localhost:${port}/api/users/${userId}`)
            .then((userResponse) => userResponse.json())
            .then((userData) => {
              console.log(userData); // Print the full response for debugging
              setUserName(userData.userName || "Unknown User"); // Assuming the response has a 'name' field
            });
        })
        .catch(() => {
          setPermissionError("An error occurred while checking your permission.");
        });
    } else {
      setPermissionError("You don't have permission to be here, please sign in");
    }
  }, [jwt]);

  // Fetch movie results if the user is authorized and searchQuery is available
  useEffect(() => {
    if (userName && searchQuery) {
      setLoading(true);
      fetch(`http://localhost:${port}/api/movies/search/${searchQuery}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setMovieResults(data); // Store the movie search results
          setLoading(false); // Set loading to false when the data is received
        })
        .catch((error) => {
          console.error("Error fetching movie data:", error);
          setLoading(false); // Stop loading if there's an error
        });
    }
  }, [userName, searchQuery, jwt]); // Only fetch when userName and searchQuery are available

  return (
<div className={`SearchScreen ${isDarkMode ? "dark" : "light"}`}>
  {/* Conditionally render the Navbar based on permission */}
  {permissionError ? (
    <>
      <Navbar isDarkMode={isDarkMode} toggleMode={toggleMode} jwt={jwt} />
      <h1>{permissionError}</h1>
    </>
  ) : (
    <>
      <Navbar userName={userName} isDarkMode={isDarkMode} toggleMode={toggleMode} jwt={jwt} />
      <h1>Search results for: {searchQuery}</h1>

      {/* Display loading or the movie results */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="movie-card-container"> {/* This is the container for horizontal layout */}
          {movieResults && movieResults.length > 0 ? (
            movieResults.map((movie) => (
              <Link
                key={movie._id}
                to={`/movie/${movie._id}?jwt=${jwt}`} // Pass the JWT token in the URL
              >
                <MovieCard
                  key={movie.movieId} // Use unique key
                  movie={movie} // Pass the movie object as a prop
                />                      
              </Link>
              
            ))
          ) : (
            <p>No movies found.</p>
          )}
        </div>
      )}
    </>
  )}
</div>
  );
}

export default SearchScreen;