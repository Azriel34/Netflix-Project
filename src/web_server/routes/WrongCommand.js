const express = require('express');
var router = express.Router();

//import the "controllers" directory
const wrongCommandController = require('../controllers/WrongCommand.js');

// Handle the routes
router.use('*', wrongCommandController.handleWrongPage);

module.exports = router;