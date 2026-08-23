const Coupon = require("../models/coupon")

// Applies coupon eligibility rules and calculates the resulting discount for an order
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

module.exports = checkCoupon