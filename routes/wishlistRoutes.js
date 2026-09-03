const express = require("express");
const router = express.Router();
const {
  getWishlist,
  syncWishlist,
  toggleWishlistItem,
  clearWishlist
} = require("../controllers/wishlistController");

router.get("/", getWishlist);
router.post("/sync", syncWishlist);
router.post("/toggle", toggleWishlistItem);
router.post("/clear", clearWishlist);

module.exports = router;
