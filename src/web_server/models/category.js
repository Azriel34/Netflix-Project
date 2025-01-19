const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
  name : {
    type: String,
    required: true,
    unique: true
  },
  promoted: {
    type: Boolean,
    default: false
  },
  // refrences to the movies that are under the category
  movies: {
    type: [Schema.Types.ObjectId],
    ref: 'Movie',
    default: []
  },
}, { versionKey: false } ); // Disable the __v field

module.exports = mongoose.model('Category', Category);