const movie = require('../models/movie');
const User = require('../models/user');
const counterService = require('./counter');

//call mongoDB server to create new user
const createUser = async (email, phoneNumber, fullName, passWord, userName, image) => {
    const user = new User({
        email: email,
        phoneNumber: phoneNumber,
        fullName: fullName,
        userName: userName,
        passWord: passWord,
        //Set the watched movies to an empty array
        watchedMovies: []
    });
    if(image){
        user.image = image;
    }
    else{
        user.image = 0;
    }
    user.recommendationId = await counterService.getNextRecommendationId('userCounter');
    return await user.save();
};

//call mongoDB server to get specific user
const getUserById = async (id) => {
    // Use the .select() method to exclude the password field
    const user = await User.findById(id).select('-passWord');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

// Get all users
const getUsers = () => {
    return User.find({});
};

//Get the field "recommendationId" of the user
const getRecommendationId = async (id) => {
    const user = await User.findById(id).select('recommendationId');
    if (!user) {
        // Throw an error if the user does not exist
        throw new Error('User not found'); 
    }
    if (!user.recommendationId) {
        // Throw an error if the recommendationId is missing
        throw new Error('Recommendation ID not found'); 
    }
    return user.recommendationId;
};

//Check if the user watched the movie
const hasWatched = async (userId, movieId) => {
    // Find the user by userId
    const user = await getUserById(userId);
    if (!user) {
        throw new Error('User not found'); // Throw an error if the user does not exist
    }
    const movies = user.watchedMovies.map(movieid => movieid.toHexString());
    // Check if the movieId exists in the watchedMovies array
    const result = movies.includes(movieId);
    return result; // Return true or false
};

// Add movie to the watchedMovies user list
const addMovie = async (userId, movieId) => {
    // Find the user by userId
    const user = await getUserById(userId);
    if (!user) {
        throw new Error('User not found'); 
    }
    const movies = user.watchedMovies.map(movieid => movieid.toHexString());
    if (movies.includes(movieId)) {
        return; 
    }
    // Add the movie to the watchedMovies array
    const result = await User.updateOne(
        { _id: userId },  // Find the category by its ID
        { $push: { watchedMovies: movieId } }  // Push the movie ID into the movies array
    );

    if (result.modifiedCount === 0) {
        // No movie was removed
        return null; 
    }

    // return the new user
    return await getUserById(userId); 
};

const removeMovie = async (userId, movieId) => {
    // Find the user by userId
    const user = await getUserById(userId);
    if (!user) {
        return null;
    }
    const movies = user.watchedMovies.map(movieid => movieid.toHexString());
    if (!movies.includes(movieId)) {
        return; 
    }
    // Remove the movie from the watchedMovies array
    const result = await User.updateOne(
        { _id: userId },
        { $pull: { watchedMovies: movieId } } // Pull the movie ID from the movies array
    );

    if (result.modifiedCount === 0) {
        // No movie was removed
        return null; 
    }
    // return the new user
    return await getUserById(userId); 
};



const getUserByUserName = async (userName) => {
    return await User.findOne({ userName });
};

// Get watched movies for a user
const getWatchedMovies = async (id) => {
    const user = await User.findById(id).populate('watchedMovies');
    if (!user) {
        throw new Error('User not found');
    }
    // Return the watchedMovies array
    return user.watchedMovies; 
};

const checkUserHeader = async (req) => {
    const userID = req.headers['user-id'];
    if(!userID){
        return null;
    }
    return userID;
}


module.exports = {
    createUser,
    getUserById, 
    getRecommendationId, 
    getUsers, 
    hasWatched, 
    removeMovie, 
    addMovie, 
    getUserByUserName, 
    getWatchedMovies,
    checkUserHeader
};