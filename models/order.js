const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  items: { type: Array, default: [] },
  totalAmount: { type: Number, required: true },
  couponCode: { type: String, default: null },
  discountApplied: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true }
})

const Order = mongoose.model("Order", orderSchema, "Orders")

module.exports = Order