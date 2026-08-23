const mongoose = require("mongoose")

// Connect to mongodb
function connectDB () {
    mongoose.connect(process.env.MONGODB_URI).then(function () {
        console.log("MongoDB connected")
    }).catch(function (err) {
        console.log("MongoDB connection error:", err)
    })
}

module.exports = connectDB