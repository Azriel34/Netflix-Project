const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Counter = new Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    value: { 
        type: Number, 
        required: true, 
        default: 1 
    }
}, { versionKey: false });

module.exports = mongoose.model('Counter', Counter);
