import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./MovieCard.css"; // If you have a separate CSS for MovieCard component

const MovieCard = ({ movie }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  console.log(movie);

  // Handle click event to navigate to movie details
  const handleClick = () => {
    navigate(`/movie/${movie._id}/info`); // Use the movie ID to navigate to the details page
  };

  return (
    <div className="movie-card" onClick={handleClick}> {/* Add onClick handler */}
      <h3 className="movie-title">{movie.name}</h3>
      <img 
        src={`http://localhost:5000/api/movies/${movie._id}/poster`} 
        alt={`${movie.name} poster`} 
        className="movie-poster"
      />
    </div>
  );
};

export default MovieCard;