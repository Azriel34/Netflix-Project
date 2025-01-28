import React, { useState, useEffect } from "react";
import axios from "./axiosInstance";


const MovieInformation = ({token}) => {
    const[videoName, setVideoName] = useState('');
    const {id} = useParams();
    const[videoDescription, setvideoDescription] = useState('');
    const[recoIds, setrecoIds] = useState([]);
    const[recoName, setrecoName] =useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const setMovieInfo = async () => {
        try{
            const response = await axios.get(`/api/movies/${id}`,  { 
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
        });

        const reco = await axios.get(`/api/movies/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        
        const ids = recommendations.map((movie) => movie._id);
        const names = recommendations.map((movie) => movie.name);
        setrecoPosters(posters);
        setrecoIds(ids);
        setrecoName(names);
        setVideoName(response.data.name);
        setvideoDescription(response.data.name);
    } catch(error) {
        serError("failed to get movie info");
    }

    };
    setMovieInfo();
}, [id, token]

    );
return (
    <div className="movie-info">
        <h1 className="movie-title">{videoName}</h1>

        <div className="movie-poster">
        <img
          src={`http://localhost:5000/api/movies/${id}/file`}
          alt={`${videoName} Poster`}
        />
      </div>
      <p className="movie-description">{videoDescription}</p>

      <h2 className="recommendation-title">Recommended Movies</h2>
      <div className="recommendations-container">
        {recoIds.map((movieId, index) => (
          <div
            key={movieId}
            className="recommendation-item"
            onClick={() => navigate(`/movies/${movieId}/watch`)}
          >
            <img
              src={`http://localhost:5000/api/movies/${movieId}/file`}
              alt={`${recoNames[index]} Poster`}
            />
            <p>{recoNames[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieInformation;