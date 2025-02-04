const movieService = require('../services/movie'); 
const userService = require('../services/user');
const categoryService = require('../services/category');
const movieListingService = require('../services/movieGetHandler');
const tokenService = require('../services/token');
const mongoose = require('mongoose');
const net = require('net');
const path = require('path');
const fs = require('fs');
const { Console } = require('console');




//need the user to be connected
const createMovie = async (req, res) => {

  // Check if the user is a manager by validating the JWT
   const userId = await tokenService.checkJWTManager(req); 
   // If no userId or not a manager, return an error
   if(!userId){
       return res.status(400).json({ error: 'Access restricted to managers only' });
   }

    try {
        if (!req.body.name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        if (!req.body.description) {
            return res.status(400).json({ error: 'Description is required' });
        }
        const categories = req.body.categories ?? []; 
        console.log(req.body);
        for (const category of categories) {
            result = await categoryService.getCategoryById(category);
            if(!result){
                return res.status(404).json({ error: 'Category not found' });
            }
        }

        const path = req.savedVideoPath ? req.savedVideoPath : null;
        if (!path) {
            return res.status(400).json({ error: 'Movie file is required' });
        }

        const poster = req.savedPosterPath ? req.savedPosterPath : null;
        if (!poster) {
            return res.status(400).json({ error: 'Movie poster is required' });
        }

        // Create the movie
        const movie = await movieService.createMovie(req.body.name, req.body.description,
            poster, categories, path);
        
           
        // Apply `categoryService.addMovie` for each movie in parallel
        for (const category of categories) {
            await categoryService.addMovie(category, movie.id);
        }

        // Send response after all operations are complete
        return res.status(201)
            .set('Location', `/api/movies/${movie._id}`)
            .send();
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}; 

//need the user to be connected
const getMovies = async (req, res) => { 
    // Check if the user is a user by validating the JWT
    const userId = await tokenService.checkJWTUser(req); 

    // If no userId or not a user, return an error
    if(!userId){
        return res.status(400).json({ error: 'Access restricted to users only' });
    }

    try {
        // Check that the userID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid User ID format' });
        }
    
        // Get the movies by categories
        const categories = await movieListingService.getMoviesByCategories(userId);
    
        // Send the result back as a response
        res.status(200).json(categories);
      } catch (error) {

        // Check if the error is "User not found"
        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        }

        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching categories' });
      }
}; 
//need the user to be connected
const getMovie = async (req, res) => { 
   const userid = await tokenService.checkJWTUser(req);
   if(!userid){
       return res.status(400).json({ error: 'User ID is required in the header' });
   } 
    try {
        const movie = await movieService.getMovieById(req.params.id); 
        // Category was not found
        if (!movie) { 
            return res.status(404).json({ errors: ['Movie not found'] }); 
        } 
        //no need to return recommendation id
        res.status(200).json(movie); 
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}; 
const getMovieFile = async (req, res) => {
    try {
        const movieDetails = await movieService.getMovieById(req.params.id);
        
        const videoPath =  path.resolve('uploads', 'videos', movieDetails.path);
        

        if (!fs.existsSync(videoPath)) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        const videoSize = fs.statSync(videoPath).size;

        const range = req.headers.range;
        if (!range) {
            return res.sendFile(videoPath);
        }

        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

        if (start >= videoSize || end >= videoSize) {
            return res.status(416).send('Requested range not satisfiable');
        }

        const chunkSize = (end - start) + 1;

        const videoStream = fs.createReadStream(videoPath, { start, end });

        const head = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        videoStream.pipe(res);

    } catch (error) {
        console.error('Error while trying to get movie file:', error);  
        res.status(500).json({ error: 'Error while trying to get movie file' });
    }
};

const getMoviePoster = async (req, res) => {
    try {
        const MovieDetails = await movieService.getMovieById(req.params.id);
        
        const posterPath = path.resolve('uploads', 'posters', MovieDetails.poster);
        
        if (fs.existsSync(posterPath)) { 
            
            res.sendFile(posterPath);
        } else {
            return res.status(404).json({ error: 'Movie poster not found' });
        }
    } catch (error) {
        console.error('Error while trying to get movie poster:', error); 
        res.status(500).json({ error: 'Error while trying to get movie poster' });
    }
};



//need the user to be connected
const replaceMovie = async (req, res) => { 
    // Check if the user is a manager by validating the JWT
    const userId = await tokenService.checkJWTManager(req); 
    // If no userId or not a manager, return an error
    if(!userId){
        return res.status(400).json({ error: 'Access restricted to managers only' });
    }
    try {
        if (!req.body.name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        if (!req.body.description) {
            return res.status(400).json({ error: 'Description is required' });
        }
        const categories = req.body.categories ?? []; 
        for (const category of categories) {
            result = await categoryService.getCategoryById(category);
            if(!result){
                return res.status(404).json({ error: 'Category not found' });
            }
        }
        const oldMovie = await movieService.getMovieById(req.params.id);
        const oldCategories = oldMovie.categories;
        // Create the movie
        const movie = await movieService.replaceMovie(req.params.id, req.body);
        if (!movie) { 
            if(await movieService.getMovieById(req.params.id)){
                return res.status(404).json({ errors: ['Movie not found'] }); 
            }
            return res.status(400).json({ errors: ['Invalid PUT request'] }); 
        }  
        //delete the movie from the old categories
        for(const category of oldCategories){
            await categoryService.removeMovie(category.toHexString(), req.params.id);
        }
        //add the movie to the new categories  
        for (const category of categories) {
            await categoryService.addMovie(category, movie.id);
        }

        // Send response after all operations are complete
        return res.status(204).end(); 
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}; 

//need the user to be connected
const deleteMovie = async (req, res) => { 
    // Check if the user is a manager by validating the JWT
    const userId = await tokenService.checkJWTManager(req); 
    // If no userId or not a manager, return an error
    if(!userId){
        return res.status(400).json({ error: 'Access restricted to managers only' });
    }
    try {
        const movie = await movieService.deleteMovie(req.params.id); 
        if (!movie) { 
            return res.status(404).json({ errors: ['Movie not found'] }); 
        } 
        await deleteMovieFromUsers(movie);
        await deleteMovieFromCategories(movie);
        res.status(204).end(); 
    } catch(error) { 
        res.status(500).json({ error: 'Internal server error' });
    }
};

function extractIdsFromRecommendOutput(inputString) {
    // Split the string into lines
    const lines = inputString.split("\n");
    
    // Check if the third line exists and process it
    if (lines.length >= 3 && lines[2].trim() !== "") {
        return lines[2]
            .trim()                 // Remove leading/trailing whitespace
            .split(" ")             // Split by spaces
            .map(Number)            // Convert each item to a number
            .filter(num => !isNaN(num)); // Filter out invalid numbers
    }
    
    return []; // Return an empty array if no third line or it's empty
}

//need the user to be connected
const getRecommendedMovies = async (req, res) => { 
    // Check if the user is a user by validating the JWT
    const userId = await tokenService.checkJWTUser(req); 
    
   
    //If no userId or not a user, return an error
   if(!userId){
       return res.status(400).json({ error: 'Access restricted to users only' });
   }
    const movieid = req.params.id;
    const movie = await movieService.getMovieById(movieid);
    if(!movie){
        return res.status(404).json({ errors: ['Movie not found'] });
    }
    const userRecId = await userService.getRecommendationId(userId);
    const movieRecId = await movieService.getRecommendationId(movieid);
    console.log("userrecid:", userRecId);
    console.log("movierecid:", movieRecId);
    const command = "GET "+userRecId+" "+movieRecId;
    try {
        const output = await workWithRecommendationServer(command);
        
        
        // Analyzing the output
        const stts = Number(output.split(" ")[0]);
        

        // Check if stts is a valid HTTP status code
        if (isNaN(stts) || stts < 100 || stts > 599) {
            // If the status code is invalid, return 500 (Internal Server Error)
            return res.status(500).json({ error: 'Invalid response from recommendation server' });
        }

        if (stts !== 200) {
            // Return the status code received from the recommendation server
            return res.status(stts).end();
        }

        const idList = extractIdsFromRecommendOutput(output);

        const movieList = await Promise.all(idList.map(async (id) => {
            const movie = await movieService.getMovieByRecommendationId(id);  
            return movie; 
        }));

        res.status(200).json(movieList);
        
    } catch (error) {
        console.error('Error while fetching recommendations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}; 

//need the user to be connected
const addWatchedMovie = async (req, res) => { 
    
    // Check if the user is a user by validating the JWT
    const userId = await tokenService.checkJWTUser(req); 
    
    // If no userId or not a user, return an error
    if(!userId){
        return res.status(400).json({ error: 'Access restricted to users only' });
    }
    const movieid = req.params.id;
    const movie = await movieService.getMovieById(movieid);
    if(!movie){
        return res.status(404).json({ errors: ['Movie not found'] });
    }
    try{
        await userService.addMovie(userId, movieid);
       
    }   
    catch (err) {
        throw err; 
    }
    const userRecId = await userService.getRecommendationId(userId);
    const movieRecId = await movieService.getRecommendationId(movieid);
    const recommendCommandBody = " "+userRecId+
    " "+movieRecId; 
    const postResponse = await workWithRecommendationServer("POST"+recommendCommandBody);
    //if the user already in the system
    if(Number(postResponse.split(" ")[0]) != 201){
        const patchResponse = await workWithRecommendationServer("PATCH"+recommendCommandBody);
        //the patch has to succeed
    }
    //even if the user wasnt in the recommend system nothing was created
    res.status(204).end();
    
}; 

//need the user to be connected
const getSearchedMovies = async (req, res) => { 
    // Check if the user is a user by validating the JWT
    const userId = await tokenService.checkJWTUser(req); 
    // If no userId or not a user, return an error
    if(!userId){
        return res.status(400).json({ error: 'Access restricted to users only' });
    }
    const query = req.params.query;
    relevantMovies = [];
    const movies = await movieService.getMovies();
    for(const movie of movies){
        relevant = false;
        if(movie.name.includes(query)){
            relevant = true;
        }
        if(movie.description.includes(query)){
            relevant = true;
        }
        for(const categoryid of movie.categories){
            //we get category as an objectid and want to make it a string
            const category = await categoryService.getCategoryById(categoryid.toHexString())
            if(category.name.includes(query)){
                relevant = true;
            }
        }
        if(relevant){
            relevantMovies.push(movie);
        }
    }
    res.status(200).json(relevantMovies);
}; 

const deleteMovieFromUsers = async (movie)=>{
    users = await userService.getUsers();
    for(const user of users){
        const hasWatched = await userService.hasWatched(user.id, movie.id);
        if(hasWatched){
            await userService.removeMovie(user.id, movie.id);
            const userRecId = await userService.getRecommendationId(user.id);
            const movieRecId = movie.recommendationId;
            response = await workWithRecommendationServer("DELETE " + userRecId+ " " + movieRecId);
            //if there is an error in the recommendation system it just means that the state in now in sync        
        }
    };
}

const deleteMovieFromCategories = async(movie) => {
    categories = movie.categories.map(categoryId => categoryId.toHexString());;
    for(const category of categories){
        await categoryService.removeMovie(category, movie.id);
    }
}

const workWithRecommendationServer = async(command) => {
    const host = process.env.RECOMMENDATION_IP;
    const port = process.env.RECOMMENDATION_PORT;

    if (!host || !port) {
        throw new Error("Environment variables RECOMMENDATION_IP and RECOMMENDATION_PORT must be set");
    }

    return new Promise((resolve, reject) => {
        const client = new net.Socket();

        let response = '';

        // Connect to the server
        client.connect(port, host, () => {
        // Send the command
        client.write(command);
        });

        // Collect data from the server
        client.on('data', (data) => {
        response += data.toString();
        // Close the connection after receiving data
        client.destroy();
        });

        // Handle connection close
        client.on('close', () => {
        resolve(response);
        });

        // Handle errors
        client.on('error', (err) => {
        client.destroy();
        reject(err);
        });
    });
};




module.exports = {
    createMovie, 
    getMovies, 
    getMovie, 
    replaceMovie, 
    deleteMovie,
    getRecommendedMovies,
    addWatchedMovie,
    getSearchedMovies,
    getMovieFile,
    getMoviePoster
};
