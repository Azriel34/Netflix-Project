const express = require('express');
var router = express.Router();
const upload = require('../middlewares/upload');


//import the "controllers" directory
const userController = require('../controllers/user');
const wrongCommandController = require('../controllers/WrongCommand');

//Send api/user to createUser() in controllers
router.route('/')
	.post(upload.single('image'), userController.createUser)
    // Handle all unsupported methods on /api/user
    .all(wrongCommandController.handleWrongCommand);

//Send api/user with some id var to getUser() in controllers
router.route('/:id')
	.get(userController.getUser)
    // Handle all unsupported methods on /api/user
    .all(wrongCommandController.handleWrongCommand);

//returns profile picture file by id
router.route('/:id/picture')
  .get(userController.getProfilePicture)

// Handle any undefined routes
router.use('*', wrongCommandController.handleWrongPage);

module.exports = router;