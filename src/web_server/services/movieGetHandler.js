const categoryService = require('../services/category');
const userService = require('../services/user');

const MOVIES_PER_CATEGORY = 20;


// Shuffle an array using Fisher-Yates algorithm
function shuffleArray(arr) {
  // A copy of the array 
  const shuffled = arr.slice();

  // Start from the last index of the array and move backwards
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at index i and j
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Return the shuffled array
  return shuffled;
}

// get n random values from an array
function getNRandomValues(arr, n) {
  // Shuffle the array
  const shuffled = shuffleArray(arr);
  // Return the first n elements
  return shuffled.slice(0, n);  
}

// Get the last n values of an array, in a random order
function getLastNRandomValues(arr, n) {
  // Get the last n elements from the array
  const lastNValues = arr.slice(-n);

  // Shuffle the selected values
  return shuffleArray(lastNValues);
}


function createSpecialCategory(watchedMovies){
  const name = "Recently Watched";
  const promoted = true;
  // The last watched movies, in a random order
  const movies = getLastNRandomValues(watchedMovies,MOVIES_PER_CATEGORY);
  
   // Return the special category with full movie details
  return {name, promoted, movies};
}

const getMoviesByCategories = async (userID) => {
  // Get an array of all the promoted categories, with full movies
  const promotedCategories = await categoryService.getPromotedCategories();

  // Get the user's watched movies as full movie objects
  const watchedMovies = await userService.getWatchedMovies(userID);

  // Use a set of watched movie IDs for filtering
  const watchedSet = new Set(watchedMovies.map(movie => movie._id.toString()));

  for(const category of promotedCategories) {
    // Keep only unwathced movies
    category.movies = category.movies.filter(movie => !watchedSet.has(movie._id.toString()));

    // Get random values
    category.movies = getNRandomValues(category.movies, MOVIES_PER_CATEGORY);
  }

  // Create the speciel category with the recently watched movies
  const specialCategory = createSpecialCategory(watchedMovies);
  promotedCategories.push(specialCategory);

  return promotedCategories;
}

module.exports = { getMoviesByCategories };

