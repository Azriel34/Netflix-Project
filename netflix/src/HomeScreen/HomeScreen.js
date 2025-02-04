import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./HomeScreen.css";
import Navbar from "../Navbar/Navbar"; // Ensure the path is correct
import { port } from "../index";
import { jwtDecode } from "jwt-decode";
import MovieCard from "../MovieCard/MovieCard"; // Import the MovieCard component

function HomeScreen({ isDarkMode, toggleMode }) {
  const [permissionError, setPermissionError] = useState(null);
  const [userName, setUserName] = useState(null);
  const queryParams = new URLSearchParams(window.location.search);
  const jwt = queryParams.get("jwt");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jwt) {
      fetch(`http://localhost:${port}/api/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            const err = await response.json();
            setPermissionError(
              err.message || "You don't have permission to be here, please sign in"
            );
          }
          setPermissionError(null);
          const decodedToken = jwtDecode(jwt);
          const userId = decodedToken.userId;
          console.log(decodedToken)
          const userResponse = await fetch(`http://localhost:${port}/api/users/${userId}`);
          const userData = await userResponse.json();
          setUserName(userData.userName || "Unknown User");
        })
        .catch(() => {
          setPermissionError("An error occurred while checking your permission.");
        });
    } else {
      setPermissionError("You don't have permission to be here, please sign in");
    }
  }, [jwt]);

  useEffect(() => {
    if (userName) {
      setLoading(true);
      fetch(`http://localhost:${port}/api/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
          
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const fetchMovies = async () => {
            const updatedCategories = await Promise.all(
              data.map(async (category) => {
                const movies = await Promise.all(
                  category.movies.map((movieId) =>
                    fetch(`http://localhost:${port}/api/movies/${movieId}`, {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${jwt}`,
                        'Content-Type': 'application/json'
                      },
                    }).then((res) => res.json())
                  )
                );
                return { ...category, movies };
              })
            );
            setCategories(updatedCategories);
          };
          fetchMovies();
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
          setLoading(false);
        });
    }
  }, [userName, jwt]);

  return (
    <div className={`HomeScreen ${isDarkMode ? "dark" : "light"}`}>
      {permissionError ? (
        <>
          <Navbar isDarkMode={isDarkMode} toggleMode={toggleMode} jwt={jwt} />
          <h1>{permissionError}</h1>
        </>
      ) : (
        <>
          <Navbar
            userName={userName}
            isDarkMode={isDarkMode}
            toggleMode={toggleMode}
            jwt={jwt}
          />
          <h1>Welcome to Netflix</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            categories.map((category, index) => (
              <div key={index} className="category-tile">
                <h2>{category.name}</h2>
                {category.movies.length > 0 ? (
                  <div className="movies-container">
                    {category.movies.map((movie) => (
                      <Link
                        key={movie._id}
                        to={`/movie/${movie._id}/info?jwt=${jwt}`} // Pass the JWT token in the URL
                      >
                        <MovieCard movie={movie} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p>No movies available in this category.</p>
                )}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default HomeScreen;