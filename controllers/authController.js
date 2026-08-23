const User = require("../models/User")

// Register a new user
async function register (req, res) {
    try {
    const { name, email, password, mobile, address, role } = req.body
    if (!name || !email || !password || !mobile || !address) {
      return res.status(400).json({ message: "Name, email, mobile number, address and password are required" })
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." })
    }
    const mobilePattern = /^[6-9]\d{9}$/
    if (!mobilePattern.test(mobile)) {
      return res.status(400).json({ message: "Please enter a valid 10-digit mobile number." })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." })
    }
    const existing = await User.findOne({ email: email })
    if (existing) {
      return res.status(409).json({ message: "An account with that email already exists." })
    }
    const newUser = new User({ name, email, password, mobile, address, role: role || "customer" })
    await newUser.save()
    res.status(201).json({ message: "Account created successfully" })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

// Login a user
async function login (req, res) {
    try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).json({ message: "No account found with that email address." })
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password. Please try again." })
    }
    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email, mobile: user.mobile, address: user.address, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

// Reset password for a user
async function resetPassword (req, res) {
    try {
    const { email, newPassword } = req.body
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." })
    }
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).json({ message: "No account found with that email address." })
    }
    user.password = newPassword
    await user.save()
    res.status(200).json({ message: "Password updated successfully" })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

// Get profile of a user
async function getProfile (req, res) {
    try {
    const { email } = req.query
    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
      role: user.role
    })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

module.exports = { register, login, resetPassword, getProfile }