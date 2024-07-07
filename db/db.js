// db/db.js
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;  // Ensure this environment variable is set in your deployment config

mongoose.connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB successfully!");
    })
    .catch((e) => {
        console.error("Error connecting to MongoDB", e);
    });

module.exports = mongoose;
