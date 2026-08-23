const Order = require("../models/Order")
const checkCoupon = require("../utils/checkCoupon")

async function getOrders (req, res) {
    try {
    const orders = await Order.find()
    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

async function createOrder (req, res) {
    try {
    const { items, totalAmount } = req.body
    if (totalAmount === undefined) return res.status(400).json({ message: "totalAmount is required" })
    const newOrder = new Order({ items: items || [], totalAmount, finalAmount: totalAmount })
    const saved = await newOrder.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
}

async function applyCoupon (req, res) {
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
}

module.exports = { getOrders, createOrder, applyCoupon }