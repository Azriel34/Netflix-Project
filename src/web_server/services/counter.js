const Counter = require('../models/counter');

const getNextRecommendationId = async (counterName) => {
    try {
        const counter = await Counter.findOneAndUpdate(
            { name: counterName },
            { $inc: { value: 1 } },
            { new: true, upsert: true } // Create if doesn't exist
        );
        return counter.value;
    } catch (err) {
        console.error('Error in getNextRecommendationId:', err);
        throw err; 
    }
};

module.exports = {
    getNextRecommendationId
};