const jwt = require('jsonwebtoken');
const SECRET_KEY = 'our_secret_key';
const tokenService = require('../services/user');

//regiter to the server by user id
const register = async (req, res) => {
    try {
        //console.log("hey")
        const { userName, passWord } = req.body;
        
        // Check if both userName and passWord are provided
        if (!userName || !passWord) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check if the user already exists in the database
        const user = await tokenService.getUserByUserName(userName);
        // If the user exists and the password matches, return the user ID
        if (user && user.passWord === passWord) {

            //create the jwt token
            const token = jwt.sign(
                { userId: user._id, manager: user.manager }, 
                SECRET_KEY, 
            );

            return res.status(200).json({ token });

        } else {
            // If the credentials do not match, return an error
            return res.status(400).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        // Handle other errors
        console.error(error);
        res.status(400).json({ error: 'Invalid username or password' });
    }
}; 
  
module.exports = {register};