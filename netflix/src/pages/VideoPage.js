import React, {useState, useEffect} from 'react';
import  { useParams } from 'react-router-dom';
import axios from 'axios';
import './VideoPage.css'; 



const  VideoPage = () => {
    const {id} = useParams();
    const[videoName, setVideoName] = useState('');
    const [error, serError] = useState('')


useEffect(() => {
    const getmovieName = async () => {
        try{
            const response = await axios.get(`/api/movies/${id}`,  { 
                headers: {
                "Content-Type": "application/json",
              },
        });
        setVideoName(response.data.name);
    } catch(error) {
        serError("failed to load movie");
    }

        };
        getmovieName();
    }, [id]);

    if (error) {
        return <div className="error-message">{error}</div>;
      }
    
    //   if (!videoPath) {
    //     return <div>Loading...</div>; 
    //   }

      return(
        <div className="video-page"> 
        <div className="video-container">
            <h1>{videoName}</h1>
            <video controls >
                <source src={`http://localhost:5000/api/movies/${id}/file`} type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
        </div>
        </div>
      );
    };
    export default VideoPage;
   