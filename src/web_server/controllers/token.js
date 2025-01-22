const jwt = require('jsonwebtoken');
const SECRET_KEY = 'our_secret_key';
const tokenService = require('../services/user');

//regiter to the server by user id
const register = async (req, res) => {
    try {
        const { userName, passWord } = req.body;

        // Check if both userName and passWord are provided
        if (!userName || !passWord) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check if the user already exists in the database
        const user = await tokenService.getUserByUserName(userName);

        // If the user exists and the password matches, create the JWT token
        if (user && user.passWord === passWord) {
            const token = jwt.sign(
                { userId: user._id, manager: user.manager }, 
                SECRET_KEY // Ensure you have a SECRET_KEY in your environment variables
            );

            // Set the JWT token as an HTTP-only cookie
            res.cookie('auth_token', token, { httpOnly: true, secure: true });

            return res.status(200).json({ token });
            
        } else {
            // If the credentials do not match, return an error
            return res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
};

  
module.exports = {register};