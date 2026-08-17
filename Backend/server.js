const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const dotenv = require("dotenv")

// Initializing environment file
dotenv.config()

// App setup
const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Static folder
app.use(express.static(path.join(__dirname, '../Frontend')))

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err))

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})