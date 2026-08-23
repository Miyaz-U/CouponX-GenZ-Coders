const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true
    },

    discountValue: {
      type: Number,
      required: true
    },

    minPurchase: {
      type: Number,
      default: 0
    },

    validFrom: {
      type: Date,
      required: true
    },

    validTill: {
      type: Date,
      required: true
    },

    usageLimit: {
      type: Number,
      default: 100
    },

    usageCount: {
      type: Number,
      default: 0
    },

    description: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Coupon", couponSchema);