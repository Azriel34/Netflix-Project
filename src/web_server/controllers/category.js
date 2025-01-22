const categoryService = require('../services/category');
const movieService = require('../services/movie');
const tokenService = require('../services/token')


const createCategory = async (req, res) => {

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

        // Get the rest of the fields from the body, and if they don't exist, give them a default value
        const promoted = req.body.promoted ?? false;
        const movies = req.body.movies ?? [];
        //check existence of all the movies
        for (const movie of movies) {
            result = await movieService.getMovieById(movie);
            if(!result){
                return res.status(404).json({ error: 'Movie not found' });
            }
        }

        // Create the category
        const category = await categoryService.createCategory(req.body.name, promoted, movies);

        // Apply `movieService.addCategory` for each movie in parallel
        for (const movie of movies) {
            await movieService.addCategory(movie, category.id);
        }

        // Send response after all operations are complete
        return res.status(201)
            .set('Location', `/api/categories/${category._id}`)
            .send();
    } catch (error) {
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                error: `${duplicateField} already exists`
            });
        }
        console.error('Error creating category:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


const getCategories = async (req, res) => {
    
    // Check if the user is a user by validating the JWT
    const userId = await tokenService.checkJWTUser(req); 
    // If no userId or not a user, return an error
    if(!userId){
        return res.status(400).json({ error: 'Access restricted to users only' });
    }

    try {
        const categories = await categoryService.getCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error'});
    }
};

const getCategory = async (req, res) => {
    // Check if the user is a user by validating the JWT
    const userId = await tokenService.checkJWTUser(req); 
    // If no userId or not a user, return an error
    if(!userId){
        return res.status(400).json({ error: 'Access restricted to users only' });
    }
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        // Category was not found
        if (!category) {
            return res.status(404).json({ error: 'Category not found'});
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateCategory = async (req, res) => {
    // Check if the user is a manager by validating the JWT
    const userId = await tokenService.checkJWTManager(req); 
    // If no userId or not a manager, return an error
    if(!userId){
        return res.status(400).json({ error: 'Access restricted to managers only' });
    }
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body.name, req.body.promoted);
        // Category was not found
        if (!category) {
            return res.status(404).json({ error: 'Category not found'});
        }
        res.status(204).send();
    } catch (error) { 
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteCategory = async (req, res) => {
    // Check if the user is a manager by validating the JWT
    const userId = await tokenService.checkJWTManager(req); 
    // If no userId or not a manager, return an error
    if(!userId){
        return res.status(400).json({ error: 'Access restricted to managers only' });
    }
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        const movies = category.movies;
        //getting movieids in a unstring structure
        for (const movie of movies) {
            await movieService.removeCategory(movie.toHexString(), category.id);
        }
        const deletedCategory = await categoryService.deleteCategory(req.params.id, req.body.name, req.body.promoted);
        // Category was not found
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found'});
        }

        res.status(204).send();
    } catch(error) { 
        res.status(500).json({ error: 'Internal server error' });
    }
    
};
module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};
