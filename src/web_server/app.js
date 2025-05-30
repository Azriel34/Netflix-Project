const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const categories = require('./routes/category');
const users = require('./routes/user');
const tokens = require('./routes/token');
const movies = require('./routes/movie');
const wrongCommand = require('./routes/WrongCommand');
const path = require('path');


//the configrution should include a RECOMMENDATION_IP and a RECOMMENDATION_PORT
//require('custom-env').env(process.env.NODE_ENV, './config');

mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
    
const app = express();

app.use(cors({
    origin: `http://localhost:${process.env.REACT_PORT}`, // Frontend URL
    credentials: true,             // Allow cookies/credentials
}));



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use('uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/movies', movies);
app.use('/api/users', users);
app.use('/api/categories', categories);
app.use('/api/tokens', tokens);

// Catch all other commands and route to WrongCommand
app.use('*', wrongCommand);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
