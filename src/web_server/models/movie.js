const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//name is required and shouldnt be unique
//description is required but can be empty as default
//picture will be represented as an id and for now not required
//categories will save the movie's categories
//recommendationId will be the id used in the recommendation system

const Movie = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    poster: {
        type: String,
        required: true
    },
    path: { type: String, required: true },
    categories: {
        type: [Schema.Types.ObjectId],
        ref: 'Category',
        default: []
    },
    recommendationId: {
        type: Number,
        required: true
    }
}, { versionKey: false});

module.exports = mongoose.model('Movie', Movie);
