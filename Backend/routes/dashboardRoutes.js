const express = require("express");

const {
    getDashboardStats,
    getTopCoupons,
    getRecentOrders,
    getCouponUsage
} = require("../controllers/dashboardController");


const router = express.Router();


router.get(
    "/stats",
    getDashboardStats
);


router.get(
    "/top-coupons",
    getTopCoupons
);


router.get(
    "/recent-orders",
    getRecentOrders
);


router.get(
    "/coupon-usage",
    getCouponUsage
);


module.exports = router;