const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');
const wrongCommandController = require('../controllers/WrongCommand');

router.route('/')
    .get(categoryController.getCategories)
    .post(categoryController.createCategory)
    // Handle all unsupported methods on /api/user
    .all(wrongCommandController.handleWrongCommand);


router.route('/:id')
    .get(categoryController.getCategory)
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory)
    // Handle all unsupported methods on /api/user
    .all(wrongCommandController.handleWrongCommand);


// Handle any undefined routes
router.use('*', wrongCommandController.handleWrongPage);

module.exports = router;
