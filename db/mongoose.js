const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Use environment variable for MongoDB URI if available
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/TaskManager';

mongoose.connect(mongoURI, { useNewUrlParser: true }).then(() => {
    console.log("Connected to MongoDB successfully!");
}).catch((e) => {
    console.log("Error connecting to MongoDB");
    console.log(e);
});

// Uncomment below if needed to prevent deprecation warnings
// mongoose.set('useCreateIndex', true);
// mongoose.set('strictQuery', true);
// mongoose.set('useFindAndModify', false);

module.exports = { mongoose };
