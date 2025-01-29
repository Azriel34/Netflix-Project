const Movie = require('../models/movie');
const counterService = require('./counter');
const mongoose = require('mongoose');

const createMovie = async (name, description, poster, categories, path) => {
    const movie = new Movie({ name: name, description: description, poster:poster, categories: categories, path: path});
    if (poster) movie.poster = poster;
    movie.recommendationId = await counterService.getNextRecommendationId('moviesCounter');
    return await movie.save();
};

const getMovieById = async (id) => {
    return await Movie.findById(id);
};

const getMovieByRecommendationId = async (recommendationId) => {
    try {
        const movie = await Movie.findOne({ recommendationId: recommendationId });
        return movie;
    } catch (error) {
        throw error;
    }
};

const getMovies = async () => {
    return await Movie.find({});
};

const replaceMovie = async (id, newData) => {
    //newData is a json
    const movie = await Movie.findByIdAndUpdate(id, newData, {
        new: true,
        overwrite: true,
        runValidators: true
    });
    if (!movie) return null;
    return movie;
};

const deleteMovie = async (id) => {
    const movie = await getMovieById(id);
    if (!movie) return null;
    await movie.deleteOne();
    return movie;
};

const getCategories = async (id) => {
    const movie = await getMovieById(id);
    if (!movie) return null;
    return movie.categories;
}

const getRecommendationId = async (id) => {
    const movie = await getMovieById(id);
    if (!movie) return null;
    return movie.recommendationId;
}

const addCategory = async (movieid, categoryid) => {
    const movie = await Movie.findById(movieid);
    if (!movie) {
        throw new Error('Movie not found'); 
    }

    const categories = movie.categories.map(categoryId => categoryId.toHexString());
    if (categories.includes(categoryid)) {
        return; 
    }

    const result = await Movie.updateOne(
        { _id: movieid },  // Find the movie by its ID
        { $push: { categories: categoryid } }  // Push the category ID into the categoriess array
    );
    
    if (result.modifiedCount === 0) {
        // No movie was removed
        return null; 
    }

    return await getMovieById(movieid); 
}

const removeCategory = async (movieid, categoryid) => {
    const movie = await getMovieById(movieid);
    if (!movie) {
        return null;
    }
    const categories = movie.categories.map(categoryId => categoryId.toHexString());
    if (!categories.includes(categoryid)) {
        return; 
    }
    // Use MongoDB's $pull operator to remove the movie from the movies array
    const result = await Movie.updateOne(
        { _id: movieid },
        { $pull: { categories: categoryid } } // Pull the movie ID from the movies array
    );
    
    if (result.modifiedCount === 0) {
        // No movie was removed
        return null; 
    }

    // Return the updated category
    return await getMovieById(movieid); 
};

module.exports = {
    createMovie,
    getMovieById,
    getMovieByRecommendationId,
    getMovies,
    replaceMovie,
    deleteMovie,
    getCategories,
    getRecommendationId,
    addCategory,
    removeCategory
};
