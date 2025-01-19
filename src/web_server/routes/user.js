const express = require('express');
var router = express.Router();

//import the "controllers" directory
const userController = require('../controllers/user');
const wrongCommandController = require('../controllers/WrongCommand');

//Send api/user to createUser() in controllers
router.route('/')
	.post(userController.createUser)
    // Handle all unsupported methods on /api/user
    .all(wrongCommandController.handleWrongCommand);

//Send api/user with some id var to getUser() in controllers
router.route('/:id')
	.get(userController.getUser)
    // Handle all unsupported methods on /api/user
    .all(wrongCommandController.handleWrongCommand);

// Handle any undefined routes
router.use('*', wrongCommandController.handleWrongPage);

module.exports = router;