const Coupon = require("../models/coupon");


// CREATE COUPON
const createCoupon = async (req, res) => {
    try {

        const {
            code,
            discountType,
            discountValue,
            minPurchase,
            validFrom,
            validTill,
            usageLimit,
            description,
            isActive
        } = req.body;

        if (
            !code ||
            !discountType ||
            discountValue === undefined ||
            !validFrom ||
            !validTill
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const existingCoupon = await Coupon.findOne({
            code: code.toUpperCase()
        });

        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Coupon already exists"
            });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discountType,
            discountValue: Number(discountValue),
            minPurchase: Number(minPurchase) || 0,
            validFrom: new Date(validFrom),
            validTill: new Date(validTill),
            usageLimit: Number(usageLimit) || 100,
            usageCount: 0,
            description: description || "",
            isActive: isActive !== false
        });

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            data: coupon
        });

    } catch (error) {

        console.error("Create coupon error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL COUPONS
const getCoupons = async (req, res) => {

    try {

        const coupons = await Coupon
            .find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: coupons
        });

    } catch (error) {

        console.error("Get coupons error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createCoupon,
    getCoupons
};