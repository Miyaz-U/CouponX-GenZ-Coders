const express = require("express")
const router = express.Router()
const { getOrders, createOrder, applyCoupon } = require("../controllers/orderController")
 
router.get("/", getOrders)
router.post("/", createOrder)
router.post("/applycoupon", applyCoupon)

module.exports = router