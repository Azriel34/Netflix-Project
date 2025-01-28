// MovieDetails.js
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar"; // Ensure the path to your Navbar component is correct
import "./MovieDetails.css"; // If you have a separate CSS for MovieCard component

function MovieDetails({ isDarkMode, toggleMode }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query"); // Retrieve the query parameter
  const jwt = queryParams.get("jwt"); // Retrieve the JWT token from the URL

  return (
    <div className={`MovieDetails ${isDarkMode ? "dark" : "light"}`}>
      {/* Include Navbar and pass the necessary props */}
      <Navbar isDarkMode={isDarkMode} toggleMode={toggleMode} jwt={jwt} />

      <h1>{searchQuery}</h1>
      {/* Your movie details content here */}
      <p>JWT Token: {jwt}</p>
    </div>
  );
}

export default MovieDetails;