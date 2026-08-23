const express = require("express");

const router = express.Router();

const {
    createCoupon,
    getCoupons
} = require("../controllers/couponController");


router.get("/", getCoupons);

router.post("/", createCoupon);


module.exports = router;