import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "./axiosInstance";
import './MovieInformation.css';
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";



const MovieInformation = ({ isDarkMode, toggleMode }) => {
  const [videoName, setVideoName] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [recoMovies, setRecoMovies] = useState([]);
  const [recommendationError, setRecommendationError] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query"); 
  const jwt = queryParams.get("jwt"); 

  useEffect(() => {
    const fetchMovieInfo = async () => {
      try {
       
        const movieResponse = await axios.get(`/api/movies/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });

        setVideoName(movieResponse.data.name);
        setVideoDescription(movieResponse.data.description);
      } catch (err) {
        setError("Failed to fetch movie information");
      }
    };

    const fetchRecommendations = async () => {
      try {
        
        const recoResponse = await axios.get(`/api/movies/${id}/recommend`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });

        setRecoMovies(recoResponse.data);
      } catch (err) {
        setRecommendationError("Failed to fetch movie recommendations");
      }
    };

    fetchMovieInfo();
    fetchRecommendations();
  }, [id, jwt]);

 const validRecoMovies = recoMovies.filter(movie => movie !== null);
  return (
    <div className={`movie-info-page ${isDarkMode ? "dark" : "light"}`}>
      <div className="movie-info">
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <div className="movie-details">
              <div className="movie-poster">
                <img
                  src={`http://localhost:5000/api/movies/${id}/poster`}
                  alt={`${videoName} Poster`}
                />
              </div>
              <div className="movie-description">
                <h1 className="movie-title">{videoName}</h1>
                <p>{videoDescription}</p>
                
                <button
                  className="play-movie-button"
                  onClick={async () => {
                    try {
                      
                      await axios.post(`/api/movies/${id}/recommend`, {}, {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${jwt}`,
                        },
                      });
                      
                      navigate(`/movie/${id}/watch?jwt=${jwt}`);
                    } catch (error) {
                      console.error("Failed to send recommendation request:", error);
                    }
                  }}
                >
                  Play Movie
                </button>
              </div>
            </div>
            <h2 className="recommendation-title">Recommended Movies</h2>
{console.log("RecoMovies:", recoMovies)}  // בדיקה בלוג
{recommendationError && <p className="error">{recommendationError}</p>}
            <div className="recommendations-container">
            {validRecoMovies.length > 0 ? (
  validRecoMovies.map((movie) => (
    <div
      key={movie._id}
      className="recommendation-item"
      onClick={() => navigate(`/movie/${movie._id}/info?jwt=${jwt}`)}
    >
      <img
        src={`http://localhost:5000/api/movies/${movie._id}/poster`}
        alt={`${movie.name} Poster`}
      />
      <p>{movie.name}</p>
    </div>
  ))
) : (
  <p>No recommendations available.</p>
)
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
  };

export default MovieInformation;
