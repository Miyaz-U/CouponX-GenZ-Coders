const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  dealPrice: { type: Number, default: null },
  isDeal: { type: Boolean, default: false },
  category: { type: String, default: "" },
  brand: { type: String, default: "" },
  image: { type: String, default: "" },
  addedAt: { type: Date, default: Date.now }
}, { _id: false });

const wishlistSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true, index: true },
  items: [wishlistItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema, "Wishlists");

module.exports = Wishlist;
