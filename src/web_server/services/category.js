const Category = require('../models/category');
const movieService = require('./movie')
const mongoose = require('mongoose');

const createCategory = async (name, promoted = false, movies = []) => {
  const category = new Category({ name, promoted, movies});
  return await category.save();
};

// Get a category by ID- return null if the category ID dosent exists
const getCategoryById = async (id) => {
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    return await Category.findById(id);
};
const getCategories = async () => {
    return await Category.find({});
};
// Get all the promoted categories and populate the movies field
const getPromotedCategories = async () => {
    return await Category.find({ promoted: true }).populate('movies');
};
const updateCategory = async (id, name, promoted, movies) => {
    const category = await getCategoryById(id);
    if (!category) {
        return null;
    }
    // update only the recieved fields
    if (name) category.name = name;
    if (promoted !== undefined) category.promoted = promoted;
    if (movies !== undefined) category.movies = movies.slice(); // slice means a copy of the array
    await category.save();
    return category;
};

const addMovie = async (categoryid, movieid) => {
    const category = await Category.findById(categoryid);
    if (!category) {
        throw new Error('Category not found'); 
    }

    const movies = category.movies.map(movieId => movieId.toHexString());
    if (movies.includes(movieid)) {
        return; 
    }

    const result = await Category.updateOne(
        { _id: categoryid },  // Find the category by its ID
        { $push: { movies: movieid } }  // Push the movie ID into the movies array
    );
    
    if (result.modifiedCount === 0) {
        // No movie was removed
        return null; 
    }

    return await getCategoryById(categoryid); 
}

// Remove a movie from a category
const removeMovie = async (categoryid, movieid) => {
    const category = await getCategoryById(categoryid);
    if (!category) {
        return null;
    }
    const movies = category.movies.map(movieId => movieId.toHexString());
    if (!movies.includes(movieid)) {
        return; 
    }
    // Use MongoDB's $pull operator to remove the movie from the movies array
    const result = await Category.updateOne(
        { _id: categoryid },
        { $pull: { movies: movieid } } // Pull the movie ID from the movies array
    );
    
    if (result.modifiedCount === 0) {
        // No movie was removed
        return null; 
    }

    // Return the updated category
    return await getCategoryById(categoryid); 
};

const deleteCategory = async (id) => {
    const category = await getCategoryById(id);
    // If wasn't found
    if (!category) {
        return null;
    }
    await Category.deleteOne({ _id: id });
    return category;
};

module.exports = {
    createCategory,
    getCategoryById,
    getCategories,
    getPromotedCategories,
    updateCategory,
    removeMovie,
    addMovie,
    deleteCategory
};