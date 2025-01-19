const jwt = require('jsonwebtoken');
const SECRET_KEY = 'our_secret_key';

//verify the token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        // Return null if token is invalid
        return null;
    }
};

// Checks the JWT and verifies if the user is a manager
const checkJWTManager = async (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    // Return null if no token is provided
    if (!token) return null; 

    // Return null if token is invalid
    const decoded = verifyToken(token);
    if (!decoded) return null; 

    // If token is valid, check if the user is a manager
    if (decoded.manager) {
        return decoded.userId;
    }
    // Return null if not a manager
    return null; 
};

// Checks the JWT and verifies if the user is any valid user
const checkJWTUser = async (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    // Return null if no token is provided
    if (!token) return null; 

    // Return null if token is invalid
    const decoded = verifyToken(token);
    if (!decoded) return null; 

    // Return userId if token is valid
    return decoded.userId; 
};

module.exports = { checkJWTManager, checkJWTUser };