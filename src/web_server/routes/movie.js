const express = require('express'); 
var router = express.Router(); 
const movieController = require('../controllers/movie'); 
const wrongCommandController = require('../controllers/WrongCommand');

router.route('/')
  .get(movieController.getMovies)
  .post(movieController.createMovie)
  // Handle all unsupported methods on /api/user
  .all(wrongCommandController.handleWrongCommand);

router.route('/:id')
  .get(movieController.getMovie)
  .put(movieController.replaceMovie)
  .delete(movieController.deleteMovie)
  // Handle all unsupported methods on /api/user
  .all(wrongCommandController.handleWrongCommand);


router.route('/:id/recommend')
  .get(movieController.getRecommendedMovies)
  .post(movieController.addWatchedMovie)
  // Handle all unsupported methods on /api/user
  .all(wrongCommandController.handleWrongCommand);


router.route('/search/:query')
  .get(movieController.getSearchedMovies)
  // Handle all unsupported methods on /api/user
  .all(wrongCommandController.handleWrongCommand);

//returns movie file by id
router.route('/:id/file')
  .get(movieController.getMovieFile)

// Handle any undefined routes
router.use('*', wrongCommandController.handleWrongPage);

module.exports = router;