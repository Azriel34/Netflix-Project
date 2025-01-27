import React, {useState, useEffect} from 'react';
import  { useParams } from 'react-router-dom';
import axios from 'axios';



const  VideoPage = () => {
    const {id} = useParams();
    const[videoPath, setVideoPath] = useState('');
    const [error, serError] = useState('')


useEffect(() => {
    const loadMovie = async () => {
        try{
            const response = await axios.get(`/api/movies/${id}/file`,  { 
                headers: {
                "Content-Type": "application/json",
              },
        });
        setVideoPath(response.data.path.replace('/app', ''));
    } catch(error) {
        serError("failed to load movie");
    }

        };
        loadMovie();
    }, [id]);

    if (error) {
        return <div>{error}</div>;
      }
    
      if (!videoPath) {
        return <div>Loading...</div>; 
      }

      return(
        <div>
            <h1>video viewer1</h1>
            <video controls width ="600">
                <source src={`http://localhost:5000/api/movies/${id}.mp4/file`} type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
        </div>
      );
    };
    export default VideoPage;
   