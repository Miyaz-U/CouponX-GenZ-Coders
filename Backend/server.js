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
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("MongoDB connected")
}).catch((err) => {
  console.log(err)
})

// Coupon Schema & Model
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  discountType: {
    type: String,
    enum: ["percentage", "flat"],
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  minPurchaseAmount: {
    type: Number,
    default: 0
  },
  maxDiscountAmount: {
    type: Number,
    default: null
  },
  expiryDate: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
})
const Coupon = mongoose.model("Coupon", couponSchema, "Coupons")

// Order Schema & Model
const orderSchema = new mongoose.Schema({
  items: {
    type: Array,
    default: []
  },
  totalAmount: {
    type: Number,
    required: true
  },
  couponCode: {
    type: String,
    default: null
  },
  discountApplied: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true
  }
})
const Order = mongoose.model("Order", orderSchema)

// Helper function to validate coupon and calculate discount
async function checkCoupon(code, orderAmount) {
  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() })
  if (!coupon) {
    return { valid: false, reason: "Coupon not found" }
  }
  if (coupon.status !== "active") {
    return { valid: false, reason: "Coupon is not active" }
  }
  if (coupon.expiryDate < new Date()) {
    return { valid: false, reason: "Coupon has expired" }
  }
  if (orderAmount < coupon.minPurchaseAmount) {
    return { valid: false, reason: `Minimum purchase amount of ${coupon.minPurchaseAmount} not met` }
  }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, reason: "Coupon usage limit has been exceeded" }
  }
  // Calculate Discount
  let discountAmount = 0
  if (coupon.discountType === "percentage") {
    discountAmount = (orderAmount * coupon.discountValue) / 100
    if (coupon.maxDiscountAmount !== null && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount
    }
  } else {
    discountAmount = coupon.discountValue
  }
  // Discount should never exceed the order amount
  if (discountAmount > orderAmount) {
    discountAmount = orderAmount
  }
  const finalAmount = orderAmount - discountAmount
  return {
    valid: true,
    discountAmount,
    finalAmount,
    coupon
  }
}

// Coupon CRUD Routes
 
// Get all coupons
app.get("/api/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find()
    res.status(200).json(coupons)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})
 
// Get one coupon
app.get("/api/coupons/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" })
    }
    res.status(200).json(coupon)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})
 
// Add a new coupon
app.post("/api/coupons", async (req, res) => {
  try {
    const newCoupon = new Coupon(req.body)
    const savedCoupon = await newCoupon.save()
    res.status(201).json(savedCoupon)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
})
 
// Update an existing coupon
app.put("/api/coupons/:id", async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" })
    }
    res.status(200).json(updatedCoupon)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
})
 
// Delete a coupon
app.delete("/api/coupons/:id", async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id)
    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found" })
    }
    res.status(200).json({ message: "Coupon deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})

// Coupon Validation & Order Routes

// Get all orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find()
    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})
 
// Get one order
app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    res.status(200).json(order)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})
 
// Create a new order (for testing applycoupon)
app.post("/api/orders", async (req, res) => {
  try {
    const { items, totalAmount } = req.body
    if (totalAmount === undefined) {
      return res.status(400).json({ message: "totalAmount is required" })
    }
    const newOrder = new Order({
      items: items || [],
      totalAmount,
      finalAmount: totalAmount // no coupon applied yet, so final = total
    })
    const savedOrder = await newOrder.save()
    res.status(201).json(savedOrder)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
})
 
// Validate a coupon against an order amount
app.post("/api/coupons/validate", async (req, res) => {
  try {
    const { code, orderAmount } = req.body
    if (!code || orderAmount === undefined) {
      return res.status(400).json({ valid: false, reason: "code and orderAmount are required" })
    }
    const result = await checkCoupon(code, orderAmount)
    if (!result.valid) {
      return res.status(400).json({ valid: false, reason: result.reason })
    }
    res.status(200).json({
      valid: true,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount
    })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})
 
// Apply a validated coupon to an order and finalize amount
app.post("/api/orders/applycoupon", async (req, res) => {
  try {
    const { orderId, couponCode } = req.body
    if (!orderId || !couponCode) {
      return res.status(400).json({ message: "orderId and couponCode are required" })
    }
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    const result = await checkCoupon(couponCode, order.totalAmount)
    if (!result.valid) {
      return res.status(400).json({ message: "Coupon invalid or already used", reason: result.reason })
    }
    // Update the order
    order.couponCode = result.coupon.code
    order.discountApplied = result.discountAmount
    order.finalAmount = result.finalAmount
    await order.save()
    // Increment coupon usage count
    result.coupon.usedCount += 1
    await result.coupon.save()
    res.status(200).json({
      finalAmount: order.finalAmount,
      discountApplied: order.discountApplied
    })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})