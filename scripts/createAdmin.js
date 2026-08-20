// createAdmin.js
// One-time script to create an Admin account directly in the database.
// We do NOT expose "create admin" on the public signup page for security reasons
// (otherwise anyone visiting the site could sign themselves up as an Admin).
//
// HOW TO USE:
// 1. Open this file and change the values inside ADMIN_DETAILS below.
// 2. Open a terminal in the "CouponX" root folder.
// 3. Run:  npm run create-admin
// 4. You should see "Admin account created successfully".
// 5. Now log in on the Login page using the "Admin Login" tab with these credentials.

const path = require("path")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({ path: path.join(__dirname, "../.env") })

// ✏️ CHANGE THESE VALUES BEFORE RUNNING
const ADMIN_DETAILS = {
  name: "Admin",
  email: "adminuser@couponx.com",
  password: "Admin@1234"
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
