const Coupon = require("../models/coupon");
const Customer = require("../models/Customer");
const Order = require("../models/order");


// Dashboard Stats
const getDashboardStats = async (req, res) => {

    try {

        const now = new Date();

        const totalCoupons =
            await Coupon.countDocuments();

        const activeCoupons =
            await Coupon.countDocuments({
                isActive: true,
                validFrom: { $lte: now },
                validTill: { $gte: now }
            });

        const expiredCoupons =
            await Coupon.countDocuments({
                $or: [
                    { validTill: { $lt: now } },
                    { isActive: false }
                ]
            });

        const totalOrders =
            await Order.countDocuments();

        const totalCustomers =
            await Customer.countDocuments();


        res.json({

            success: true,

            data: {
                totalCoupons,
                activeCoupons,
                expiredCoupons,
                totalOrders,
                totalCustomers
            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Dashboard data failed"

        });

    }
};


// Top Coupons
const getTopCoupons = async (req, res) => {

    try {

        const coupons =
            await Coupon.find()
                .sort({
                    usageCount: -1
                })
                .limit(5);


        res.json({

            success: true,

            data: coupons

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: "Top coupons failed"

        });

    }
};


// Recent Orders
const getRecentOrders = async (req, res) => {

    try {

        const orders =
            await Order.find()
                .populate(
                    "customer",
                    "name email"
                )
                .sort({
                    createdAt: -1
                })
                .limit(5);


        res.json({

            success: true,

            data: orders

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: "Orders failed"

        });

    }
};


// Coupon Usage
const getCouponUsage = async (req, res) => {

    try {

        const coupons =
            await Coupon.find()
                .select(
                    "code usageCount"
                )
                .sort({
                    usageCount: -1
                })
                .limit(7);


        res.json({

            success: true,

            data: coupons

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: "Coupon usage failed"

        });

    }
};


module.exports = {

    getDashboardStats,
    getTopCoupons,
    getRecentOrders,
    getCouponUsage

};