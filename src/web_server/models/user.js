const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Category Schema
const User = new Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          // Regex for phone numbers
          return /^\+?[0-9]\d{1,14}$/.test(v);
        },
        message: 'Please fill a valid phone number'
      },
      unique: true
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    passWord: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    watchedMovies: {
      type: [Schema.Types.ObjectId],
      ref: 'Movie',
      default: []
    },
    picture: {
      type: Number,
      required: true,
      default: 0
    },
    recommendationId: {
      type: Number,
      required: true
    },
    manager: {
      type: Boolean,
      required: true,
      default: false
    }
}, { versionKey: false});

module.exports = mongoose.model('User', User);