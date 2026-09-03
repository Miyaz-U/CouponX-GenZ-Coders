const Wishlist = require("../models/wishlist");

// GET /api/wishlist?email=user@example.com
async function getWishlist(req, res) {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email query parameter is required" });
    }

    let wishlist = await Wishlist.findOne({ userEmail: email });
    if (!wishlist) {
      return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({ success: true, data: wishlist.items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

// POST /api/wishlist/sync
// Body: { email, items: [...] }
async function syncWishlist(req, res) {
  try {
    const { email, items } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const formattedItems = (items || []).map(function (item) {
      return {
        productId: String(item._id || item.id || item.productId),
        name: item.name,
        price: item.price,
        dealPrice: item.dealPrice || null,
        isDeal: !!item.isDeal,
        category: item.category || "",
        brand: item.brand || "",
        image: item.image || ""
      };
    });

    let wishlist = await Wishlist.findOne({ userEmail: email });
    if (!wishlist) {
      wishlist = new Wishlist({
        userEmail: email,
        items: formattedItems
      });
    } else {
      wishlist.items = formattedItems;
      wishlist.updatedAt = new Date();
    }

    await wishlist.save();
    res.status(200).json({ success: true, data: wishlist.items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

// POST /api/wishlist/toggle
// Body: { email, product }
async function toggleWishlistItem(req, res) {
  try {
    const { email, product } = req.body;
    if (!email || !product) {
      return res.status(400).json({ success: false, message: "Email and product are required" });
    }

    const prodId = String(product._id || product.id);
    let wishlist = await Wishlist.findOne({ userEmail: email });
    if (!wishlist) {
      wishlist = new Wishlist({ userEmail: email, items: [] });
    }

    const existingIndex = wishlist.items.findIndex(function (item) {
      return item.productId === prodId;
    });

    let added = false;
    if (existingIndex > -1) {
      wishlist.items.splice(existingIndex, 1);
      added = false;
    } else {
      wishlist.items.push({
        productId: prodId,
        name: product.name,
        price: product.price,
        dealPrice: product.dealPrice || null,
        isDeal: !!product.isDeal,
        category: product.category || "",
        brand: product.brand || "",
        image: product.image || ""
      });
      added = true;
    }

    wishlist.updatedAt = new Date();
    await wishlist.save();

    res.status(200).json({
      success: true,
      added: added,
      message: added ? "Product added to wishlist" : "Product removed from wishlist",
      count: wishlist.items.length,
      data: wishlist.items
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

// POST /api/wishlist/clear
// Body: { email }
async function clearWishlist(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    await Wishlist.findOneAndUpdate(
      { userEmail: email },
      { $set: { items: [], updatedAt: new Date() } }
    );

    res.status(200).json({ success: true, message: "Wishlist cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

module.exports = {
  getWishlist,
  syncWishlist,
  toggleWishlistItem,
  clearWishlist
};
