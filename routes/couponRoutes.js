const express = require("express")
const router = express.Router()
const { getCoupons, getCouponById, createCoupon, updateCoupon, deleteCoupon, validateCoupon } = require("../controllers/couponController")
 
router.post("/validate", validateCoupon)
 
router.get("/", getCoupons)
router.get("/:id", getCouponById)
router.post("/", createCoupon)
router.put("/:id", updateCoupon)
router.delete("/:id", deleteCoupon)

module.exports = router