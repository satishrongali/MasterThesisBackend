"use strict";

// db/db.js
var mongoose = require('mongoose');

var mongoURI = process.env.MONGO_URI; // Ensure this environment variable is set in your deployment config

mongoose.connect(mongoURI).then(function () {
  console.log("Connected to MongoDB successfully!");
})["catch"](function (e) {
  console.error("Error connecting to MongoDB", e);
});
module.exports = mongoose;
//# sourceMappingURL=db.dev.js.map
