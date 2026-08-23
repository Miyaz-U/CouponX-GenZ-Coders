const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        coupon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon",
            default: null
        },

        couponCode: {
            type: String,
            default: ""
        },

        amount: {
            type: Number,
            required: true
        },

        discountAmount: {
            type: Number,
            default: 0
        },

        finalAmount: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Completed",
                "Cancelled"
            ],
            default: "Pending"
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Order",
    orderSchema
);