const Coupon = require("../models/coupon")
const checkCoupon = require("../utils/checkCoupon")

// Format coupon to be sent to the client
function formatCoupon(coupon) {
    return {
        _id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType === "flat" ? "fixed" : coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchase: coupon.minPurchaseAmount,
        usageLimit: coupon.usageLimit,
        usageCount: coupon.usedCount,
        validTill: coupon.expiryDate,
        description: coupon.description || "",
        isActive: coupon.status === "active",
        createdAt: coupon.createdDate
    }
}

// Format coupon to be saved in the database
function mapToSchema(body) {
    const mapped = {
        code: body.code,
        discountType: body.discountType === "fixed" ? "flat" : body.discountType,
        discountValue: body.discountValue,
        minPurchaseAmount: body.minPurchase || 0,
        usageLimit: body.usageLimit || null,
        expiryDate: body.validTill,
        description: body.description || "",
        status: body.isActive === false ? "inactive" : "active"
    }
    return mapped
}

// Get all coupons
async function getCoupons(req, res) {
    try {
        const coupons = await Coupon.find()
        res.status(200).json({
            success: true,
            data: coupons.map(formatCoupon)
        })
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong", error: err.message })
    }
}

// Get coupon by ID
async function getCouponById(req, res) {
    try {
        const coupon = await Coupon.findById(req.params.id)
        if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" })
        res.status(200).json({ success: true, data: formatCoupon(coupon) })
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong", error: err.message })
    }
}

// Create a new coupon
async function createCoupon(req, res) {
    try {
        const existing = await Coupon.findOne({ code: req.body.code?.trim().toUpperCase() })
        if (existing) {
            return res.status(409).json({ success: false, message: "A coupon with this code already exists." })
        }
        const newCoupon = new Coupon(mapToSchema(req.body))
        const saved = await newCoupon.save()
        res.status(201).json({ success: true, data: formatCoupon(saved) })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

// Update a coupon
async function updateCoupon(req, res) {
    try {
        const updated = await Coupon.findByIdAndUpdate(
            req.params.id,
            mapToSchema(req.body),
            { new: true, runValidators: true }
        )
        if (!updated) return res.status(404).json({ success: false, message: "Coupon not found" })
        res.status(200).json({ success: true, data: formatCoupon(updated) })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

// Delete a coupon
async function deleteCoupon(req, res) {
    try {
        const deleted = await Coupon.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ success: false, message: "Coupon not found" })
        res.status(200).json({ success: true, message: "Coupon deleted successfully" })
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong", error: err.message })
    }
}

// Validate a coupon
async function validateCoupon(req, res) {
    try {
        const { code, orderAmount } = req.body
        if (!code || orderAmount === undefined) {
            return res.status(400).json({ valid: false, reason: "code and orderAmount are required" })
        }
        const result = await checkCoupon(code, orderAmount)
        if (!result.valid) return res.status(400).json({ valid: false, reason: result.reason })
        res.status(200).json({ valid: true, discountAmount: result.discountAmount, finalAmount: result.finalAmount })
    } catch (err) {
        res.status(500).json({ valid: false, message: "Something went wrong", error: err.message })
    }
}

module.exports = { getCoupons, getCouponById, createCoupon, updateCoupon, deleteCoupon, validateCoupon }
