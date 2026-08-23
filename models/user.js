const mongoose = require("mongoose")

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, default: "" },
  address: { type: String, default: "" },
  role: { type: String, enum: ["admin", "customer"], default: "customer" },
  createdDate: { type: Date, default: Date.now }
})

const User = mongoose.model("User", userSchema, "Users")

module.exports = User