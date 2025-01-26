import React, { useState, useEffect } from "react";
import "./CategoriesScreen.css";
import Navbar from "../Navbar/Navbar"; // Ensure the path is correct
import { port } from "../index";
import { jwtDecode } from "jwt-decode"; // Correct named import
import MovieCard from "../MovieCard/MovieCard"; // Import the MovieCard component
import { Link } from "react-router-dom"; // Add this import

function CategoriesScreen({ isDarkMode, toggleMode }) {
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
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              setPermissionError(
                err.message || "You don't have permission to be here, please sign in"
              );
            });
          }
          setPermissionError(null);
          const decodedToken = jwtDecode(jwt);
          const userId = decodedToken.userId;
          return fetch(`http://localhost:${port}/api/users/${userId}`)
            .then((userResponse) => userResponse.json())
            .then((userData) => {
              setUserName(userData.userName || "Unknown User");
            });
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
    <div className={`CategoriesScreen ${isDarkMode ? "dark" : "light"}`}>
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
          <h1>Categories:</h1>
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
                      to={`/movie/${movie._id}?jwt=${jwt}`} // Correctly passes the JWT as a query parameter
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

export default CategoriesScreen;