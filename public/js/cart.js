const cartCountBadge = document.getElementById("cartCount");

// CART SIDEBAR — COUPON & PAY
let appliedCoupon = null; // { code, discountAmount } — set in applyCouponByCode()

// CART
function getCart() {
  return JSON.parse(localStorage.getItem("couponXCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("couponXCart", JSON.stringify(cart));
}

function updateCartCountBadge() {
  const cart = getCart();
  const totalItems = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
  cartCountBadge.textContent = totalItems;
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
  const cartSummary = document.getElementById("cartSummary");
  const cartTotal = document.getElementById("cartTotal");

  const totalItems = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
  const totalPrice = cart.reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0);

  cartCountBadge.textContent = totalItems;
  cartSummary.textContent = totalItems + " item" + (totalItems !== 1 ? "s" : "");
  cartTotal.textContent = "₹" + totalPrice.toLocaleString("en-IN");

  // Update the discount and total amounts shown in the cart sidebar
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
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("opacity-0");
  setTimeout(function () { toast.classList.add("opacity-0"); }, 2000);
}

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
