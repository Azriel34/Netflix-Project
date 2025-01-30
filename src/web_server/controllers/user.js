const userService = require('../services/user');
const Counter = require('../models/counter'); 
const path = require('path');


//call the createUser func from the servicese directory 
const createUser = async (req, res) => {
    try {
        // Creating a new user using the data from the request body
        const { email, phoneNumber, fullName, passWord, userName} = req.body;
        const image = req.savedImagePath ? req.savedImagePath : null;
        const user = await userService.createUser(email, phoneNumber, fullName, passWord, userName, image);
        // Send 201 status code, indicating resource creation
        return res.status(201).set('Location', `/api/users/${user._id}`).send();
    } catch (error) {
        // Handle validation errors and return a custom error message
        if (error.name === 'ValidationError') {
            // Loop through the errors and capture the first invalid field
            const firstError = Object.values(error.errors)[0];
            // Check the type of validation error (required or invalid)
            let errorMessage;
            if (firstError.kind === 'required') {
                errorMessage = `${firstError.path} is required`;
            } else {
                errorMessage = `${firstError.path} is invalid`;
            }

            // Return a single error message
            return res.status(400).json({ error: errorMessage });
        }
        // Handle duplicate key errors (E11000)
        if (error.code === 11000) {
            // Extract the field causing the duplication error
            const duplicateField = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                error: `${duplicateField} already exists`
            });
        }
        // For other errors, send a generic error message
        res.status(400).json({ error: error.message });
    }
};

//call the getUser func from the servicese directory 
const getUser = async (req, res) => {
    try {
        // Get user by id from the request parameters
        const { id } = req.params;
        const user = await userService.getUserById(id);

        // Send 200 status code along with the user data
        res.status(200).json(user);
    } catch (error) {
        // Handle user not found error
        res.status(404).json({error: "User not found"});
    }}; 

    const getProfilePicture = async (req, res) => {
        try {
            const userDetails = await userService.getUser(req.params.id);
             const path = path.resolve('uploads', 'images', userDetails.image);
            if (fs.existstSync(path)) {
                res.sendFile(path);
            } else {
                return res.status(404).json({ error: 'profile picture not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error while trying to get profile picture' });
        }
    };
    

    const checkUserExists = async (req, res) => {
        const { userName } = req.body;
    
        if (!userName) {
            return res.status(400).json({ message: 'Username is required.' });
        }
    
        const userExists = await userService.getUserByUserName(userName);
        if (userExists) {
            return res.status(200).json({ exists: true, message: 'User exists.' });
        } else {
            return res.status(200).json({ exists: false, message: 'User does not exist.' });
        }
    };
module.exports = {createUser, getUser, getProfilePicture, checkUserExists};