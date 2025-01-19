const express = require('express');
var router = express.Router();

//import the "controllers" directory
const tokenController = require('../controllers/token');
const wrongCommandController = require('../controllers/WrongCommand');

//Send api/token to createUser() in controllers
router.route('/')
	.post(tokenController.register)
    // Handle all unsupported methods on /api/token
    .all(wrongCommandController.handleWrongCommand);

// Handle any undefined routes
router.use('*', wrongCommandController.handleWrongPage);

module.exports = router;