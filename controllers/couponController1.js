const Coupon = require("../models/Coupon")
const checkCoupon = require("../utils/checkCoupon")

async function getCoupons (req, res) {
    try {
    const coupons = await Coupon.find()
    res.status(200).json(coupons)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

async function getCouponById (req, res) {
    try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) return res.status(404).json({ message: "Coupon not found" })
    res.status(200).json(coupon)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

async function createCoupon (req, res) {
    try {
    const newCoupon = new Coupon(req.body)
    const saved = await newCoupon.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
}

async function updateCoupon (req, res) {
    try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!updated) return res.status(404).json({ message: "Coupon not found" })
    res.status(200).json(updated)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
}

async function deleteCoupon (req, res) {
    try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Coupon not found" })
    res.status(200).json({ message: "Coupon deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

async function validateCoupon (req, res) {
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
}

module.exports = { getCoupons, getCouponById, createCoupon, updateCoupon, deleteCoupon, validateCoupon }