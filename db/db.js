require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    throw new Error('MongoDB URI is not set in environment variables');
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => console.log('Error connecting to MongoDB:', err.message));

module.exports = { mongoose };
