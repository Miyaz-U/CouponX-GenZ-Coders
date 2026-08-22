// One-time script to create an Admin account directly in the database.
// Admin creation is intentionally excluded from the public signup flow to prevent
// unauthorized users from self-assigning the admin role.
// Usage:
// 1. Update ADMIN_DETAILS below with the desired admin credentials.
// 2. From the project root, run: npm run create-admin
// 3. On success, log in via the Login page's "Admin Login" tab.

const path = require("path")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({ path: path.join(__dirname, "../.env") })

// Update these values before running the script
const ADMIN_DETAILS = {
  name: "[NAME]",
  email: "[EMAIL_ADDRESS]",
  password: "[PASSWORD]"
}

// Same User schema as in server.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "customer"], default: "customer" },
  createdDate: { type: Date, default: Date.now }
})
const User = mongoose.model("User", userSchema, "Users")

mongoose.connect(process.env.MONGODB_URI).then(async function () {
  console.log("Connected to MongoDB...")

  const existing = await User.findOne({ email: ADMIN_DETAILS.email })
  if (existing) {
    console.log("A user with this email already exists:")
    console.log("  Email:", existing.email, "| Role:", existing.role)
    if (existing.role !== "admin") {
      existing.role = "admin"
      await existing.save()
      console.log("Existing user's role was updated to 'admin'.")
    }
    return mongoose.disconnect()
  }

  const admin = new User({
    name: ADMIN_DETAILS.name,
    email: ADMIN_DETAILS.email,
    password: ADMIN_DETAILS.password,
    role: "admin"
  })
  await admin.save()

  console.log("Admin account created successfully!")
  console.log("  Email:", ADMIN_DETAILS.email)
  console.log("  Password:", ADMIN_DETAILS.password)
  mongoose.disconnect()
}).catch(function (err) {
  console.log("Error:", err)
})
