// WISHLIST STATE MANAGEMENT (CouponX)
const WISHLIST_STORAGE_KEY = "couponXWishlist";

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveWishlist(items) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Could not save wishlist to localStorage:", e);
  }
  updateWishlistBadges();
  syncWishlistButtons();
  window.dispatchEvent(new CustomEvent("couponx_wishlist_updated", { detail: items }));

  // Optionally sync with backend if user is logged in
  syncWithBackend(items);
}

function isInWishlist(productId) {
  if (!productId) return false;
  const list = getWishlist();
  const idStr = String(productId);
  return list.some(function (item) {
    return String(item._id || item.id) === idStr;
  });
}

function toggleWishlist(product) {
  if (!product) return false;
  const id = String(product._id || product.id);
  const list = getWishlist();
  const index = list.findIndex(function (item) {
    return String(item._id || item.id) === id;
  });

  let added = false;
  if (index > -1) {
    list.splice(index, 1);
    added = false;
  } else {
    list.push({
      _id: id,
      id: id,
      name: product.name,
      price: product.price,
      dealPrice: product.dealPrice,
      isDeal: !!product.isDeal,
      dealDiscountPercent: product.dealDiscountPercent,
      category: product.category || "",
      brand: product.brand || "",
      image: product.image || ""
    });
    added = true;
  }

  saveWishlist(list);

  if (typeof showToast === "function") {
    showToast(added ? "Added to Wishlist ??" : "Removed from Wishlist");
  }

  return added;
}

function removeFromWishlist(productId) {
  if (!productId) return;
  const idStr = String(productId);
  const list = getWishlist().filter(function (item) {
    return String(item._id || item.id) !== idStr;
  });
  saveWishlist(list);
  if (typeof showToast === "function") {
    showToast("Removed from Wishlist");
  }
}

function clearWishlist() {
  saveWishlist([]);
  if (typeof showToast === "function") {
    showToast("Wishlist cleared");
  }
}

// Update badge counters across header, mobile menu, and profile dropdown
function updateWishlistBadges() {
  const list = getWishlist();
  const count = list.length;

  const headerBadge = document.getElementById("wishlistCount");
  if (headerBadge) {
    headerBadge.textContent = count;
    if (count > 0) {
      headerBadge.classList.remove("hidden");
    }
  }

  const profileBadge = document.getElementById("profileWishlistCount");
  if (profileBadge) {
    profileBadge.textContent = count + " item" + (count === 1 ? "" : "s");
  }

  const mobileBadge = document.getElementById("mobileWishlistCount");
  if (mobileBadge) {
    mobileBadge.textContent = count;
  }

  const desktopNavBadge = document.getElementById("desktopNavWishlistBadge");
  if (desktopNavBadge) {
    desktopNavBadge.textContent = count;
    if (count > 0) {
      desktopNavBadge.classList.remove("hidden");
    } else {
      desktopNavBadge.classList.add("hidden");
    }
  }
}

// Helper to generate Wishlist Heart SVG icon
function getHeartSvg(filled) {
  if (filled) {
    return '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-red-500 fill-current transition-transform duration-200 scale-110" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>';
}

// Updates heart icons for all wishlist buttons on the current page
function syncWishlistButtons() {
  const buttons = document.querySelectorAll(".wishlistBtn");
  buttons.forEach(function (btn) {
    const id = btn.getAttribute("data-id");
    if (!id) return;
    const wishlisted = isInWishlist(id);
    btn.innerHTML = getHeartSvg(wishlisted);
    if (wishlisted) {
      btn.setAttribute("title", "Remove from Wishlist");
      btn.setAttribute("aria-label", "Remove from Wishlist");
      btn.classList.add("is-wishlisted");
    } else {
      btn.setAttribute("title", "Add to Wishlist");
      btn.setAttribute("aria-label", "Add to Wishlist");
      btn.classList.remove("is-wishlisted");
    }
  });
}

// Optional backend sync if user is logged in
async function syncWithBackend(items) {
  try {
    const user = JSON.parse(localStorage.getItem("couponx_user") || "null");
    if (!user || !user.email) return;

    await fetch("/api/wishlist/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, items: items })
    });
  } catch (e) {
    // Non-blocking background sync error
  }
}

// Listen for updates from other tabs
window.addEventListener("storage", function (e) {
  if (e.key === WISHLIST_STORAGE_KEY) {
    updateWishlistBadges();
    syncWishlistButtons();
  }
});

// Initialize on script load
document.addEventListener("DOMContentLoaded", function () {
  updateWishlistBadges();
  syncWishlistButtons();
});

// Immediate run in case DOM is already loaded
updateWishlistBadges();
