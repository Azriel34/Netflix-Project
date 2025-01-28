import React, { useState, useEffect } from "react";
import axios from "./axiosInstance";


const MovieInformation = ({token}) => {
    const[videoName, setVideoName] = useState('');
    const {id} = useParams();
    const[videoDescription, setvideoDescription] = useState('');
    const[videoPoster, setvideoPoster]= useState('');
    const[recoPosters, setrecoPosters] = useState([]);
    const[recoIds, setrecoIds] = useState([]);
    const[recoName, setrecoName] =useState([]);



    useEffect(() => {
        const setMovieInfo = async () => {
        try{
            const response = await axios.get(`/api/movies/${id}`,  { 
                headers: {
                "Content-Type": "application/json",
              },
        });

        const reco = await axios.get(`/api/movies/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const posters = reco.recommendedmovies.map(movie => movie.poster);
        const ids = reco.recommendedmovies.map(movie => movie.id);
        const names =reco.recommendedmovies.map(movie => movie.name);
        setrecoPosters(posters);
        setrecoIds(ids);
        setrecoName(names);
        setVideoName(response.data.name);
        setvideoDescription(response.data.name);
    } catch(error) {
        serError("failed to get movie info");
    }

    }
}, [id]

    );
return (
    <div>
        <h1>{}</h1>
    </div>

)

}