const mongoose = require("mongoose")

// Order Schema
const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, default: "" },
    customer: {
        name: { type: String, default: "Guest" },
        email: { type: String, default: "" }
    },
    items: { type: Array, default: [] },
    totalAmount: { type: Number, required: true },
    couponCode: { type: String, default: null },
    discountApplied: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "cancelled"], default: "completed" },
    createdAt: { type: Date, default: Date.now }
})
const Order = mongoose.model("Order", orderSchema, "Orders")

module.exports = Order
