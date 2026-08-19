// Import required modules
const express = require("express")
const cors = require("cors")
const path = require("path")
const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(express.json())

// Static folder
app.use(express.static(path.join(__dirname, "../Frontend")))

// Sample users
const users = [
  {
    name: "Admin User",
    email: "admin@couponx.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Miyaz",
    email: "customer@couponx.com",
    password: "customer123",
    role: "customer"
  }
]

// Login route
app.post("/auth/login", function (req, res) {
  const email = req.body.email
  const password = req.body.password
  const role = req.body.role

  // Check for matching email, password and role
  let matchedUser = null
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    if (user.email === email && user.password === password && user.role === role) {
      matchedUser = user
    }
  }
  if (matchedUser) {
    res.status(200).json({
      message: "Login successful",
      user: {
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role
      }
    })
  } else {
    res.status(401).json({message: "Invalid email, password, or role selected."})
  }
})

// Start server
app.listen(PORT, function () {
  console.log(`CouponX authentication backend running at http://localhost:${PORT}`)
})
