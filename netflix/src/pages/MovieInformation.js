import React, { useState, useEffect } from "react";
import axios from "./axiosInstance";


const MovieInformation = () => {
    const[videoName, setVideoName] = useState('');
    const {id} = useParams();
    const[videoDescription, setvideoDescription] = useState('');



    useEffect(() => {
        const setMovieInfo = async () => {
        try{
            const response = await axios.get(`/api/movies/${id}`,  { 
                headers: {
                "Content-Type": "application/json",
              },
        });
        setVideoName(response.data.name);
        setvideoDescription(response.data.name);
    } catch(error) {
        serError("failed to load movie");
    }

    }
}

    )


}