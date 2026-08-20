// Import modules
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const dotenv = require("dotenv")

// Loading environment variables from .env file
dotenv.config()

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../Frontend")))

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI).then(function () {
  console.log("MongoDB connected")
}).catch(function (err) {
  console.log("MongoDB connection error:", err)
})


// SCHEMAS & MODELS
// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "customer"], default: "customer" },
  createdDate: { type: Date, default: Date.now }
})
const User = mongoose.model("User", userSchema, "Users")

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" }
})
const Category = mongoose.model("Category", categorySchema, "Categories")

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, default: "" },
  stock: { type: Number, default: 0 },
  image: { type: String, default: "" },
  isDeal: { type: Boolean, default: false },
  dealPrice: { type: Number, default: null },
  dealDiscountPercent: { type: Number, default: null }
})
const Product = mongoose.model("Product", productSchema, "Products")

// Coupon Schema
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true, uppercase: true },
  discountType: { type: String, enum: ["percentage", "flat"], required: true },
  discountValue: { type: Number, required: true },
  minPurchaseAmount: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number, default: null },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdDate: { type: Date, default: Date.now }
})
const Coupon = mongoose.model("Coupon", couponSchema, "Coupons")

// Order Schema
const orderSchema = new mongoose.Schema({
  items: { type: Array, default: [] },
  totalAmount: { type: Number, required: true },
  couponCode: { type: String, default: null },
  discountApplied: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true }
})
const Order = mongoose.model("Order", orderSchema, "Orders")


// AUTH ROUTES
// Register
app.post("/api/auth/register", async function (req, res) {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" })
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." })
    }
    const existing = await User.findOne({ email: email })
    if (existing) {
      return res.status(409).json({ message: "An account with that email already exists." })
    }
    const newUser = new User({ name, email, password, role: role || "customer" })
    await newUser.save()
    res.status(201).json({ message: "Account created successfully" })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})

// Login
app.post("/api/auth/login", async function (req, res) {
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
      user: { name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})


// Reset password
app.post("/api/auth/reset-password", async function (req, res) {
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
})


// CATEGORY ROUTES
// Get all categories
app.get("/api/categories", async function (req, res) {
  try {
    const categories = await Category.find()
    res.status(200).json(categories)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})

// Get products in a category
app.get("/api/categories/:id/products", async function (req, res) {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }
    const products = await Product.find({ category: category.name })
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})

// Add a category
app.post("/api/categories", async function (req, res) {
  try {
    const newCategory = new Category(req.body)
    const saved = await newCategory.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
})


// PRODUCT ROUTES
// Get all products
app.get("/api/products", async function (req, res) {
  try {
    const { category, minPrice, maxPrice, sort, search, brand } = req.query
    let filter = {}
    if (category) filter.category = category
    if (brand) filter.brand = brand
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" }
    }
    let sortOption = {}
    if (sort === "price_asc") sortOption.price = 1
    else if (sort === "price_desc") sortOption.price = -1
    else if (sort === "newest") sortOption._id = -1
    const products = await Product.find(filter).sort(sortOption)
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})

// Get featured products
app.get("/api/products/featured", async function (req, res) {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(8)
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})

// Get deal products
app.get("/api/products/deals", async function (req, res) {
  try {
    const deals = await Product.find({ isDeal: true })
    res.status(200).json(deals)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})

// Get one product
app.get("/api/products/:id", async function (req, res) {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})

// Add a product
app.post("/api/products", async function (req, res) {
  try {
    const newProduct = new Product(req.body)
    const saved = await newProduct.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
})

// Update a product
app.put("/api/products/:id", async function (req, res) {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!updated) return res.status(404).json({ message: "Product not found" })
    res.status(200).json(updated)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
})

// Delete a product
app.delete("/api/products/:id", async function (req, res) {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Product not found" })
    res.status(200).json({ message: "Product deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})

// Get all deals
app.get("/api/deals", async function (req, res) {
  try {
    const deals = await Product.find({ isDeal: true })
    res.status(200).json(deals)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})


// COUPON ROUTES
// Validate coupon logic
async function checkCoupon(code, orderAmount) {
  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() })
  if (!coupon) return { valid: false, reason: "Coupon not found" }
  if (coupon.status !== "active") return { valid: false, reason: "Coupon is not active" }
  if (coupon.expiryDate < new Date()) return { valid: false, reason: "Coupon has expired" }
  if (orderAmount < coupon.minPurchaseAmount) return { valid: false, reason: "Minimum purchase amount of ₹" + coupon.minPurchaseAmount + " not met" }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) return { valid: false, reason: "Coupon usage limit has been exceeded" }
  let discountAmount = 0
  if (coupon.discountType === "percentage") {
    discountAmount = (orderAmount * coupon.discountValue) / 100
    if (coupon.maxDiscountAmount !== null && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount
    }
  } else {
    discountAmount = coupon.discountValue
  }
  if (discountAmount > orderAmount) discountAmount = orderAmount
  return { valid: true, discountAmount, finalAmount: orderAmount - discountAmount, coupon }
}

// Get all coupons
app.get("/api/coupons", async function (req, res) {
  try {
    const coupons = await Coupon.find()
    res.status(200).json(coupons)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})

// Get one coupon
app.get("/api/coupons/:id", async function (req, res) {
  try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) return res.status(404).json({ message: "Coupon not found" })
    res.status(200).json(coupon)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})

// Add coupon
app.post("/api/coupons", async function (req, res) {
  try {
    const newCoupon = new Coupon(req.body)
    const saved = await newCoupon.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
})

// Update coupon
app.put("/api/coupons/:id", async function (req, res) {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!updated) return res.status(404).json({ message: "Coupon not found" })
    res.status(200).json(updated)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
})

// Delete coupon
app.delete("/api/coupons/:id", async function (req, res) {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Coupon not found" })
    res.status(200).json({ message: "Coupon deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})

// Validate coupon
app.post("/api/coupons/validate", async function (req, res) {
  try {
    const { code, orderAmount } = req.body
    if (!code || orderAmount === undefined) {
      return res.status(400).json({ valid: false, reason: "code and orderAmount are required" })
    }
    const result = await checkCoupon(code, orderAmount)
    if (!result.valid) return res.status(400).json({ valid: false, reason: result.reason })
    res.status(200).json({ valid: true, discountAmount: result.discountAmount, finalAmount: result.finalAmount })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})


// ORDER ROUTES
// Get all orders
app.get("/api/orders", async function (req, res) {
  try {
    const orders = await Order.find()
    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})

// Create order
app.post("/api/orders", async function (req, res) {
  try {
    const { items, totalAmount } = req.body
    if (totalAmount === undefined) return res.status(400).json({ message: "totalAmount is required" })
    const newOrder = new Order({ items: items || [], totalAmount, finalAmount: totalAmount })
    const saved = await newOrder.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
})

// Apply coupon to order
app.post("/api/orders/applycoupon", async function (req, res) {
  try {
    const { orderId, couponCode } = req.body
    if (!orderId || !couponCode) return res.status(400).json({ message: "orderId and couponCode are required" })
    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: "Order not found" })
    const result = await checkCoupon(couponCode, order.totalAmount)
    if (!result.valid) return res.status(400).json({ message: result.reason })
    order.couponCode = result.coupon.code
    order.discountApplied = result.discountAmount
    order.finalAmount = result.finalAmount
    await order.save()
    result.coupon.usedCount += 1
    await result.coupon.save()
    res.status(200).json({ finalAmount: order.finalAmount, discountApplied: order.discountApplied })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})


// START SERVER
app.listen(PORT, function () {
  console.log("CouponX server running at http://localhost:" + PORT)
})