const API_URL = "/api";

// CATEGORY TILE COLORS
const categoryTileStyles = {
  "Laptops":        { bg: "bg-purple-100" },
  "Accessories":    { bg: "bg-blue-100" },
  "Mobiles":        { bg: "bg-slate-100" },
  "Audio":          { bg: "bg-pink-100" },
  "Wearables":      { bg: "bg-green-100" },
  "Gaming":         { bg: "bg-orange-100" }
};
const defaultTileStyle = { bg: "bg-gray-100" };

function getCategoryTileStyle(category) {
  return categoryTileStyles[category] || defaultTileStyle;
}

// CART
function getCart() {
  return JSON.parse(localStorage.getItem("couponXCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("couponXCart", JSON.stringify(cart));
}

function updateCartCountBadge() {
  const cart = getCart();
  const total = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
  document.getElementById("cartCount").textContent = total;
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(function (item) { return item.id === product._id; });
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product._id,
      name: product.name,
      price: product.isDeal && product.dealPrice ? product.dealPrice : product.price,
      quantity: 1
    });
  }
  saveCart(cart);
  updateCartCountBadge();
  showToast("Added to cart ✓");
}

function updateCartItem(productId, quantity) {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(function (item) { return item.id !== productId; });
  } else {
    const item = cart.find(function (item) { return item.id === productId; });
    if (item) item.quantity = quantity;
  }
  saveCart(cart);
  renderCartDrawer();
}

function removeFromCart(productId) {
  const cart = getCart().filter(function (item) { return item.id !== productId; });
  saveCart(cart);
  updateCartCountBadge();
  renderCartDrawer();
  showToast("Removed from cart");
}

// CART DRAWER
function renderCartDrawer() {
  const cart = getCart();
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartSummary = document.getElementById("cartSummary");
  const cartTotal = document.getElementById("cartTotal");

  const totalItems = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
  const totalPrice = cart.reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0);

  cartCount.textContent = totalItems;
  cartSummary.textContent = totalItems + " item" + (totalItems !== 1 ? "s" : "");
  cartTotal.textContent = "₹" + totalPrice.toLocaleString("en-IN");

  // Refresh the discount + final total rows in the new sidebar footer
  refreshCartTotals(totalPrice);
  updateSelectCouponAvailability(cart.length > 0);

  if (!cart.length) {
    cartItems.innerHTML =
      '<div class="flex h-full items-center justify-center text-center">' +
      '  <p class="text-sm text-gray-400">Your cart is empty</p>' +
      '</div>';
    const payBtn = document.getElementById("payBtn");
    if (payBtn) { payBtn.disabled = true; payBtn.classList.add("opacity-50", "cursor-not-allowed"); }
    return;
  }

  const payBtn = document.getElementById("payBtn");
  if (payBtn) { payBtn.disabled = false; payBtn.classList.remove("opacity-50", "cursor-not-allowed"); }

  cartItems.innerHTML = cart.map(function (item) {
    return (
      '<div class="mb-4 flex gap-3 border-b pb-4">' +
      '  <div class="flex-1">' +
      '    <p class="text-xs font-semibold text-gray-800">' + item.name + '</p>' +
      '    <p class="mt-1 text-xs font-bold text-purple-600">₹' + item.price.toLocaleString("en-IN") + '</p>' +
      '    <div class="mt-2 flex items-center gap-2">' +
      '      <button onclick="updateCartItem(\'' + item.id + '\',' + (item.quantity - 1) + ')" class="h-6 w-6 rounded bg-gray-100 text-sm font-bold hover:bg-gray-200">−</button>' +
      '      <span class="text-xs">' + item.quantity + '</span>' +
      '      <button onclick="updateCartItem(\'' + item.id + '\',' + (item.quantity + 1) + ')" class="h-6 w-6 rounded bg-gray-100 text-sm font-bold hover:bg-gray-200">+</button>' +
      '      <button onclick="removeFromCart(\'' + item.id + '\')" class="ml-auto text-xs text-red-500 hover:underline">Remove</button>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }).join("");
}

function openCart() {
  document.getElementById("cartDrawer").classList.remove("translate-x-full");
  document.getElementById("cartBackdrop").classList.remove("hidden");
  renderCartDrawer();
}

function closeCart() {
  document.getElementById("cartDrawer").classList.add("translate-x-full");
  document.getElementById("cartBackdrop").classList.add("hidden");
  resetCouponState();
  const paySuccess = document.getElementById("paySuccess");
  const payBtn = document.getElementById("payBtn");
  if (paySuccess) paySuccess.classList.add("hidden");
  if (payBtn) payBtn.classList.remove("hidden");
}

function setupCart() {
  document.getElementById("cartIconBtn").addEventListener("click", function () {
    openCart();
  });
  document.getElementById("closeCart").addEventListener("click", closeCart);
  document.getElementById("cartBackdrop").addEventListener("click", closeCart);
}

// TOAST
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("opacity-0");
  setTimeout(function () { toast.classList.add("opacity-0"); }, 2000);
}

// RATING HELPERS
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100000;
  }
  return Math.abs(hash);
}

function getProductRating(product) {
  const hash = hashString(product._id || product.name);
  const rating = 3.5 + (hash % 15) / 10;
  const reviewCount = 20 + (hash % 300);
  return { rating: Math.round(rating * 2) / 2, reviewCount: reviewCount };
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  let starsHtml = "";
  for (let i = 0; i < fullStars; i++) starsHtml += "★";
  if (hasHalfStar) starsHtml += "½";
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) starsHtml += "☆";
  return starsHtml;
}

// PRODUCT CARD
function renderProducts(gridId, loadingId, errorId, products) {
  const loadingEl = document.getElementById(loadingId);
  const errorEl = document.getElementById(errorId);
  const grid = document.getElementById(gridId);

  if (loadingEl) loadingEl.classList.add("hidden");

  if (!products || products.length === 0) {
    if (errorEl) { errorEl.textContent = "No products available."; errorEl.classList.remove("hidden"); }
    return;
  }

  products.forEach(function (product) {
    const card = document.createElement("div");
    card.className = "bg-white border border-gray-200 rounded-lg p-4 flex flex-col transition duration-200 hover:shadow-lg hover:border-purple-300 hover:-translate-y-1";

    const showDealPrice = product.isDeal && product.dealPrice;
    const tileStyle = getCategoryTileStyle(product.category);
    const { rating, reviewCount } = getProductRating(product);
    const hasImage = !!product.image;

    const imageTileHtml = hasImage
      ? '<div class="h-28 bg-gray-50 rounded-md mb-3 overflow-hidden flex items-center justify-center">' +
        '  <img src="' + product.image + '" alt="' + product.name + '" class="productImg w-full h-full object-contain" />' +
        '</div>'
      : '<div class="h-28 ' + tileStyle.bg + ' border-2 border-dashed border-gray-300 rounded-md mb-3 flex items-center justify-center text-center px-2">' +
        '  <span class="text-xs text-gray-400">Product image</span>' +
        '</div>';

    card.innerHTML =
      imageTileHtml +
      '<div class="flex items-center gap-1 text-xs text-amber-500 mb-1">' +
      '  <span>' + renderStars(rating) + '</span>' +
      '  <span class="text-gray-400">(' + reviewCount + ')</span>' +
      '</div>' +
      '<h3 class="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 min-h-[2.5rem]">' + product.name + '</h3>' +
      '<p class="text-xs text-gray-500 mb-2 truncate">' + product.category + '</p>' +
      '<div class="mt-auto flex items-center justify-between gap-2">' +
      '  <div class="min-h-[2.5rem] flex flex-col justify-center">' +
      (showDealPrice
        ? '<span class="font-bold text-gray-800 leading-tight">₹' + product.dealPrice.toLocaleString("en-IN") + '</span>' +
          '<span class="text-xs text-gray-400 line-through leading-tight">₹' + product.price.toLocaleString("en-IN") + '</span>'
        : '<span class="font-bold text-gray-800 leading-tight">₹' + product.price.toLocaleString("en-IN") + '</span>') +
      '  </div>' +
      '  <button class="addToCartBtn w-7 h-7 flex items-center justify-center shrink-0 bg-purple-600 text-white text-sm font-bold rounded-full hover:bg-purple-700" aria-label="Add to cart">+</button>' +
      '</div>';

    if (hasImage) {
      const imgEl = card.querySelector(".productImg");
      imgEl.addEventListener("error", function () {
        const tile = imgEl.parentElement;
        tile.innerHTML = '<span class="text-xs text-gray-400 text-center px-2">Image not found</span>';
        tile.classList.remove("bg-gray-50");
        tile.classList.add(tileStyle.bg, "border-2", "border-dashed", "border-gray-300");
      });
    }

    const addBtn = card.querySelector(".addToCartBtn");
    addBtn.addEventListener("click", function () {
      addToCart(product);
      addBtn.textContent = "✓";
      setTimeout(function () { addBtn.textContent = "+"; }, 1000);
    });

    grid.appendChild(card);
  });
}

// CATEGORIES tiles for home page
async function loadCategories() {
  try {
    const response = await fetch(API_URL + "/categories");
    if (!response.ok) throw new Error("Failed");
    const categories = await response.json();
    const visibleCategories = categories.slice(0, 6); // home page only ever shows 6 categories

    const grid = document.getElementById("categoryGrid");
    grid.innerHTML = visibleCategories.map(function (category) {
      const tileStyle = getCategoryTileStyle(category.name);
      const hasImage = !!category.image;
      const iconHtml = hasImage
        ? '<img src="' + category.image + '" alt="' + category.name + '" class="categoryTileImg w-full h-full object-cover rounded-full" />'
        : '<span class="text-sm">🏷️</span>';
      return (
        '<button type="button" data-category="' + category.name.replace(/"/g, "&quot;") + '" ' +
        'class="categoryTile flex flex-col items-center gap-1 rounded-xl bg-white border border-gray-200 p-3 text-center hover:shadow-md hover:border-purple-300 transition">' +
        '  <div class="h-10 w-10 rounded-full ' + tileStyle.bg + ' flex items-center justify-center overflow-hidden">' +
        '    ' + iconHtml +
        '  </div>' +
        '  <p class="text-xs font-semibold text-gray-700 leading-tight">' + category.name + '</p>' +
        '</button>'
      );
    }).join("");

    grid.querySelectorAll(".categoryTileImg").forEach(function (img) {
      img.addEventListener("error", function () {
        img.outerHTML = '<span class="text-sm">🏷️</span>';
      });
    });

    grid.querySelectorAll(".categoryTile").forEach(function (tile) {
      tile.addEventListener("click", function () {
        const categoryName = tile.getAttribute("data-category");
        // Clicking the already-active category should just close the list,
        // not close-and-reopen it.
        if (activeCategoryName === categoryName) {
          hideCategoryProducts();
        } else {
          showCategoryProducts(categoryName, tile);
        }
      });
    });
  } catch (err) {
    console.log("Error loading categories:", err);
  }
}

// CATEGORY PRODUCTS (shown inline on the home page)
const CATEGORY_TRANSITION_MS = 300; // keep in sync with the "duration-300" class

function setActiveCategoryTile(activeTile) {
  document.querySelectorAll(".categoryTile").forEach(function (tile) {
    tile.classList.remove("border-purple-500", "ring-2", "ring-purple-200");
  });
  if (activeTile) {
    activeTile.classList.add("border-purple-500", "ring-2", "ring-purple-200");
  }
}

// Collapses the section's height down to 0 in lockstep with the fade/slide-out.
// Without this, the box stays at its old (tall) height right up until the
// content is swapped out, at which point the height snaps to the new
// content's size instantly — which is what made everything below the
// section (and the section's own content) appear to "jump" instead of
// smoothly sliding. Resolves once the collapse animation has finished.
function collapseCategorySection(section, addHiddenClassWhenDone) {
  const alreadyCollapsed = section.classList.contains("hidden") || section.classList.contains("opacity-0");
  if (alreadyCollapsed) {
    if (addHiddenClassWhenDone) section.classList.add("hidden");
    return Promise.resolve();
  }

  // Freeze the section at its current, real pixel height so the browser has
  // a concrete starting point to animate from ("height: auto" can't be
  // transitioned, so without this the collapse would snap instead of glide).
  section.style.overflow = "hidden";
  section.style.height = section.scrollHeight + "px";
  void section.offsetHeight; // force reflow so the frozen height "sticks" before animating away from it

  requestAnimationFrame(function () {
    section.classList.add("opacity-0", "-translate-y-2");
    section.style.height = "0px";
  });

  return new Promise(function (resolve) {
    setTimeout(function () {
      if (addHiddenClassWhenDone) section.classList.add("hidden");
      resolve();
    }, CATEGORY_TRANSITION_MS);
  });
}

function fadeSectionOut(section) {
  return collapseCategorySection(section, false);
}

// Expands the section's height up to match its freshly-rendered content at
// the same time as the fade/slide-in, so the reveal is one continuous
// motion instead of the content popping to full size first and then fading.
function fadeSectionIn(section) {
  section.classList.remove("hidden");
  section.style.overflow = "hidden";
  section.style.height = "0px";
  void section.offsetHeight; // commit the collapsed starting height before measuring/animating

  const targetHeight = section.scrollHeight; // natural height of the content now sitting inside it

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      section.classList.remove("opacity-0", "-translate-y-2");
      section.style.height = targetHeight + "px";
    });
  });

  setTimeout(function () {
    // Once settled, let the section size itself naturally again so it stays
    // responsive (e.g. on window resize) without needing another snap later.
    section.style.height = "";
    section.style.overflow = "";
  }, CATEGORY_TRANSITION_MS);
}

// Guards against a slower fetch from an earlier click finishing after a later one.
let categoryRequestToken = 0;
// Tracks which category's products are currently shown, so clicking the same
// tile again can toggle the list closed instead of reopening it.
let activeCategoryName = null;

async function showCategoryProducts(categoryName, tileEl) {
  const section = document.getElementById("categoryProducts");
  const grid = document.getElementById("categoryProductsGrid");
  const loading = document.getElementById("categoryProductsLoading");
  const errorEl = document.getElementById("categoryProductsError");
  const title = document.getElementById("categoryProductsTitle");
  const subtitle = document.getElementById("categoryProductsSubtitle");

  const thisRequest = ++categoryRequestToken;
  activeCategoryName = categoryName;
  setActiveCategoryTile(tileEl || null);

  // If products from another category are currently showing, fade them out
  // completely before swapping in new content, so switching categories is a
  // clean fade-out/fade-in rather than the new content snapping in over the old.
  await fadeSectionOut(section);
  if (thisRequest !== categoryRequestToken) return; // a newer click superseded this one

  title.textContent = categoryName;
  subtitle.textContent = "";
  grid.innerHTML = "";
  errorEl.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    const response = await fetch(API_URL + "/products?category=" + encodeURIComponent(categoryName));
    if (!response.ok) throw new Error("Failed");
    const products = await response.json();
    if (thisRequest !== categoryRequestToken) return;
    subtitle.textContent = products.length + " product" + (products.length !== 1 ? "s" : "") + " found";
    renderProducts("categoryProductsGrid", "categoryProductsLoading", "categoryProductsError", products);
  } catch (err) {
    console.log("Error loading category products:", err);
    if (thisRequest !== categoryRequestToken) return;
    loading.classList.add("hidden");
    errorEl.textContent = "Could not load products for this category. Is the server running?";
    errorEl.classList.remove("hidden");
  }

  // Content is fully ready now — reveal it with a single, clean fade/slide.
  fadeSectionIn(section);
}

function hideCategoryProducts() {
  const section = document.getElementById("categoryProducts");
  categoryRequestToken++; // invalidate any in-flight showCategoryProducts call
  activeCategoryName = null;
  setActiveCategoryTile(null);
  collapseCategorySection(section, true);
}

function setupCategoryProductsClear() {
  const clearBtn = document.getElementById("clearCategoryBtn");
  if (clearBtn) clearBtn.addEventListener("click", hideCategoryProducts);
}

// FEATURED PRODUCTS
async function loadFeaturedProducts() {
  try {
    const response = await fetch(API_URL + "/products/featured");
    if (!response.ok) throw new Error("Failed");
    const products = await response.json();
    renderProducts("featuredGrid", "featuredLoading", "featuredError", products);
  } catch (err) {
    console.log("Error loading featured:", err);
    const el = document.getElementById("featuredError");
    const loading = document.getElementById("featuredLoading");
    if (loading) loading.classList.add("hidden");
    if (el) { el.textContent = "Could not load featured products. Is the server running?"; el.classList.remove("hidden"); }
  }
}

// DEALS
async function loadDeals() {
  try {
    const response = await fetch(API_URL + "/products/deals");
    if (!response.ok) throw new Error("Failed");
    const products = await response.json();
    renderProducts("dealsGrid", "dealsLoading", "dealsError", products);
  } catch (err) {
    console.log("Error loading deals:", err);
    const el = document.getElementById("dealsError");
    const loading = document.getElementById("dealsLoading");
    if (loading) loading.classList.add("hidden");
    if (el) { el.textContent = "Could not load deals. Is the server running?"; el.classList.remove("hidden"); }
  }
}

// PAGE LOAD
document.addEventListener("DOMContentLoaded", async function () {
  updateCartCountBadge();
  setupCart();
  setupCategoryProductsClear();
  await loadCategories();
  await loadFeaturedProducts();
  await loadDeals();
});

// CUSTOMER LOGOUT
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("couponx_user");
    window.location.href = "login.html";
  });
}

// PROFILE DROPDOWN
(function () {
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  if (!profileBtn || !profileDropdown) return;

  async function loadProfile() {
    const stored = JSON.parse(localStorage.getItem("couponx_user") || "null");
    if (!stored) return;

    document.getElementById("profileName").textContent = stored.name || "—";
    document.getElementById("profileEmail").textContent = stored.email || "—";
    document.getElementById("profileMobile").textContent = stored.mobile || "—";
    document.getElementById("profileAddress").textContent = stored.address || "—";

    try {
      const res = await fetch("/api/auth/profile?email=" + encodeURIComponent(stored.email));
      if (!res.ok) return;
      const user = await res.json();
      document.getElementById("profileName").textContent = user.name || "—";
      document.getElementById("profileEmail").textContent = user.email || "—";
      document.getElementById("profileMobile").textContent = user.mobile || "—";
      document.getElementById("profileAddress").textContent = user.address || "—";
      stored.mobile = user.mobile;
      stored.address = user.address;
      localStorage.setItem("couponx_user", JSON.stringify(stored));
    } catch (err) {
      console.log("Profile fetch error:", err);
    }
  }

  profileBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const isHidden = profileDropdown.classList.contains("hidden");
    if (isHidden) {
      loadProfile();
      profileDropdown.classList.remove("hidden");
    } else {
      profileDropdown.classList.add("hidden");
    }
  });

  document.addEventListener("click", function (e) {
    if (!profileDropdown.contains(e.target) && e.target !== profileBtn) {
      profileDropdown.classList.add("hidden");
    }
  });
})();
// CART SIDEBAR — COUPON & PAY
let appliedCoupon = null; // { code, discountAmount, discountType, discountValue }

function refreshCartTotals(subtotal) {
  const finalTotalEl = document.getElementById("cartFinalTotal");
  const discountRow = document.getElementById("discountRow");
  const discountAmt = document.getElementById("discountAmt");
  const couponLabel = document.getElementById("couponLabel");
  if (!finalTotalEl) return;

  if (appliedCoupon) {
    const discount = appliedCoupon.discountAmount;
    const final = Math.max(0, subtotal - discount);
    discountRow.classList.remove("hidden");
    couponLabel.textContent = appliedCoupon.code;
    discountAmt.textContent = "-₹" + discount.toLocaleString("en-IN");
    finalTotalEl.textContent = "₹" + final.toLocaleString("en-IN");
  } else {
    discountRow.classList.add("hidden");
    finalTotalEl.textContent = "₹" + subtotal.toLocaleString("en-IN");
  }
}

// Enable/disable the "Select Coupon" button based on whether the cart has items
function updateSelectCouponAvailability(hasItems) {
  const selectCouponBtn = document.getElementById("selectCouponBtn");
  if (!selectCouponBtn) return;
  selectCouponBtn.disabled = !hasItems;
  selectCouponBtn.classList.toggle("opacity-50", !hasItems);
  selectCouponBtn.classList.toggle("cursor-not-allowed", !hasItems);
}

// Toggle between "Select Coupon" button and "Coupon applied" chip
function updateCouponRowUI() {
  const selectRow = document.getElementById("couponSelectRow");
  const appliedRow = document.getElementById("appliedCouponRow");
  if (!selectRow || !appliedRow) return;

  if (appliedCoupon) {
    selectRow.classList.add("hidden");
    appliedRow.classList.remove("hidden");
    appliedRow.classList.add("flex");
    document.getElementById("appliedCouponCode").textContent = appliedCoupon.code;
    document.getElementById("appliedCouponSavings").textContent =
      "You saved ₹" + appliedCoupon.discountAmount.toLocaleString("en-IN");
  } else {
    appliedRow.classList.add("hidden");
    appliedRow.classList.remove("flex");
    selectRow.classList.remove("hidden");
  }
}

function showCouponMsg(text, isError) {
  const couponMsg = document.getElementById("couponMsg");
  if (!couponMsg) return;
  couponMsg.textContent = text;
  couponMsg.className = "text-xs " + (isError ? "text-red-500" : "text-green-600");
  couponMsg.classList.remove("hidden");
}

function resetCouponState() {
  appliedCoupon = null;
  const couponMsg = document.getElementById("couponMsg");
  if (couponMsg) { couponMsg.textContent = ""; couponMsg.classList.add("hidden"); }
  updateCouponRowUI();
}

// Describe a coupon's discount in human-readable form
function describeCouponDiscount(coupon) {
  if (coupon.discountType === "percentage") {
    let text = coupon.discountValue + "% off";
    if (coupon.maxDiscountAmount !== null && coupon.maxDiscountAmount !== undefined) {
      text += " (up to ₹" + coupon.maxDiscountAmount.toLocaleString("en-IN") + ")";
    }
    return text;
  }
  return "₹" + coupon.discountValue.toLocaleString("en-IN") + " off";
}

function formatExpiry(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// COUPON SELECTION MODAL
function openCouponModal() {
  document.getElementById("couponModalBackdrop").classList.remove("hidden");
  document.getElementById("couponModalBackdrop").classList.add("flex");
  loadCouponList();
}

function closeCouponModal() {
  document.getElementById("couponModalBackdrop").classList.add("hidden");
  document.getElementById("couponModalBackdrop").classList.remove("flex");
}

async function loadCouponList() {
  const container = document.getElementById("couponListContainer");
  container.innerHTML = '<p class="text-sm text-gray-400">Loading coupons...</p>';

  const cart = getCart();
  const subtotal = cart.reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0);

  try {
    const res = await fetch("/api/coupons");
    const coupons = await res.json();
    const now = new Date();

    const usable = coupons.filter(function (c) {
      const withinUsageLimit = c.usageLimit === null || c.usageLimit === undefined || c.usedCount < c.usageLimit;
      return c.status === "active" && new Date(c.expiryDate) >= now && withinUsageLimit;
    });

    if (!usable.length) {
      container.innerHTML = '<p class="text-sm text-gray-400">No coupons available right now.</p>';
      return;
    }

    container.innerHTML = usable.map(function (coupon) {
      const eligible = subtotal >= coupon.minPurchaseAmount;
      const isApplied = appliedCoupon && appliedCoupon.code === coupon.code;
      return (
        '<div class="rounded-xl border ' + (isApplied ? "border-purple-400 bg-purple-50" : "border-gray-200") + ' p-3">' +
        '  <div class="flex items-start justify-between gap-2">' +
        '    <div>' +
        '      <p class="text-sm font-bold text-purple-700 tracking-wide">' + coupon.code + '</p>' +
        '      <p class="text-xs font-medium text-gray-700 mt-0.5">' + describeCouponDiscount(coupon) + '</p>' +
        '    </div>' +
        '    <button data-code="' + coupon.code + '" class="applyCouponOptionBtn shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ' +
        (isApplied
          ? 'bg-purple-600 text-white cursor-default'
          : eligible
            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed') +
        '" ' + (!eligible || isApplied ? 'disabled' : '') + '>' +
        (isApplied ? 'Applied' : 'Apply') +
        '    </button>' +
        '  </div>' +
        '  <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">' +
        '    <span>Min. purchase ₹' + coupon.minPurchaseAmount.toLocaleString("en-IN") + '</span>' +
        '    <span>Expires ' + formatExpiry(coupon.expiryDate) + '</span>' +
        '  </div>' +
        (!eligible
          ? '<p class="mt-1.5 text-[11px] text-red-500">Add ₹' + (coupon.minPurchaseAmount - subtotal).toLocaleString("en-IN") + ' more to use this coupon</p>'
          : '') +
        '</div>'
      );
    }).join("");

    container.querySelectorAll(".applyCouponOptionBtn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyCouponByCode(btn.getAttribute("data-code"));
      });
    });
  } catch (err) {
    container.innerHTML = '<p class="text-sm text-red-500">Could not load coupons. Try again.</p>';
  }
}

async function applyCouponByCode(code) {
  const cart = getCart();
  const subtotal = cart.reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0);

  try {
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, orderAmount: subtotal })
    });
    const data = await res.json();
    if (!res.ok || !data.valid) {
      showCouponMsg(data.reason || "Invalid coupon.", true);
      return;
    }
    // Only one coupon can be applied at a time — this replaces any previous selection
    appliedCoupon = { code: code.toUpperCase(), discountAmount: data.discountAmount };
    showCouponMsg("Coupon applied! You save ₹" + data.discountAmount.toLocaleString("en-IN"), false);
    updateCouponRowUI();
    refreshCartTotals(subtotal);
    closeCouponModal();
  } catch (err) {
    showCouponMsg("Could not validate coupon. Try again.", true);
  }
}

function setupCartSidebarActions() {
  // Open coupon modal
  document.getElementById("selectCouponBtn").addEventListener("click", openCouponModal);
  document.getElementById("changeCouponBtn").addEventListener("click", openCouponModal);
  document.getElementById("closeCouponModal").addEventListener("click", closeCouponModal);
  document.getElementById("couponModalBackdrop").addEventListener("click", function (e) {
    if (e.target === this) closeCouponModal();
  });

  // Remove applied coupon
  document.getElementById("removeCouponBtn").addEventListener("click", function () {
    const cart = getCart();
    const subtotal = cart.reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0);
    resetCouponState();
    refreshCartTotals(subtotal);
  });

  // Pay
  document.getElementById("payBtn").addEventListener("click", function () {
    const cart = getCart();
    if (!cart.length) {
      showToast("Your cart is empty.");
      return;
    }

    const subtotal = cart.reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0);
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    const finalAmount = Math.max(0, subtotal - discount);

    // Clear cart
    saveCart([]);
    updateCartCountBadge();
    resetCouponState();
    renderCartDrawer();

    // Show success message
    const paySuccess = document.getElementById("paySuccess");
    paySuccess.textContent = "The amount of ₹" + finalAmount.toLocaleString("en-IN") + " paid successfully.";
    paySuccess.classList.remove("hidden");
    document.getElementById("payBtn").classList.add("hidden");

    // Auto-hide success and reset after 4 seconds
    setTimeout(function () {
      paySuccess.classList.add("hidden");
      document.getElementById("payBtn").classList.remove("hidden");
      closeCart();
    }, 4000);
  });
}

// Initialise sidebar actions after DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  setupCartSidebarActions();
});
