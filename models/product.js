const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, default: "" },
  stock: { type: Number, default: 0 },
  image: { type: String, default: "" },
  isDeal: { type: Boolean, default: false },
  dealPrice: { type: Number, default: null },
  dealDiscountPercent: { type: Number, default: null }
})

const Product = mongoose.model("Product", productSchema, "Products")

module.exports = Product