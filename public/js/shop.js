const categoryFiltersBox = document.getElementById("categoryFilters")
const brandFiltersBox = document.getElementById("brandFilters")
const maxPriceInput = document.getElementById("maxPriceInput")
const maxPriceValueLabel = document.getElementById("maxPriceValueLabel")
const searchInput = document.getElementById("searchInput")
const sortSelect = document.getElementById("sortSelect")
const clearFiltersBtn = document.getElementById("clearFiltersBtn")
const applyFiltersBtn = document.getElementById("applyFiltersBtn")

const productsGrid = document.getElementById("productsGrid")
const resultsCount = document.getElementById("resultsCount")
const loadingMsg = document.getElementById("loadingMsg")
const errorMsg = document.getElementById("errorMsg")
const noResultsMsg = document.getElementById("noResultsMsg")
const cartCountBadge = document.getElementById("cartCount")
const paginationControls = document.getElementById("paginationControls")

let allCategories = []
let allProducts = []

// Pagination state for the products grid
const PRODUCTS_PER_PAGE = 12
let currentFilteredProducts = []
let currentPage = 1

function getCart() {
  return JSON.parse(localStorage.getItem("couponXCart")) || []
}

function saveCart(cart) {
  localStorage.setItem("couponXCart", JSON.stringify(cart))
}

function updateCartCountBadge() {
  const cart = getCart()
  const totalItems = cart.reduce(function (sum, item) {
    return sum + item.quantity
  }, 0);
  cartCountBadge.textContent = totalItems
}

function getEffectivePrice(product) {
  return product.isDeal && product.dealPrice ? product.dealPrice : product.price
}

const categoryTileStyles = {
  "Laptops": { bg: "bg-purple-100" },
  "Accessories": { bg: "bg-blue-100" },
  "Mobiles": { bg: "bg-slate-100" },
  "Audio": { bg: "bg-pink-100" },
  "Wearables": { bg: "bg-green-100" },
  "Gaming": { bg: "bg-orange-100" }
}
const defaultTileStyle = { bg: "bg-gray-100" }

function getCategoryTileStyle(category) {
  return categoryTileStyles[category] || defaultTileStyle
}

// Generates a consistent (but fabricated) rating and review count, since no real review data exists
function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100000
  }
  return Math.abs(hash)
}

function getProductRating(product) {
  const hash = hashString(product._id || product.name)
  const rating = 3.5 + (hash % 15) / 10 // Maps the hash to a rating between 3.5 and 5.0
  const reviewCount = 20 + (hash % 300)
  return { rating: Math.round(rating * 2) / 2, reviewCount: reviewCount }
}

function renderStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.5
  let starsHtml = ""
  for (let i = 0; i < fullStars; i++) starsHtml += "★"
  if (hasHalfStar) starsHtml += "½"
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  for (let i = 0; i < emptyStars; i++) starsHtml += "☆"
  return starsHtml
}

function addToCart(product) {
  const cart = getCart()

  const existing = cart.find(function (item) {
    return item.id === product._id
  });

  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({
      id: product._id,
      name: product.name,
      price: product.isDeal && product.dealPrice ? product.dealPrice : product.price,
      quantity: 1
    })
  }

  saveCart(cart)
  updateCartCountBadge()
  showToast("Added to cart ✓")
}

function updateCartItem(productId, quantity) {
  let cart = getCart()
  if (quantity <= 0) {
    cart = cart.filter(function (item) { return item.id !== productId })
  } else {
    const item = cart.find(function (item) { return item.id === productId })
    if (item) item.quantity = quantity
  }
  saveCart(cart)
  renderCartDrawer()
}

function removeFromCart(productId) {
  const cart = getCart().filter(function (item) { return item.id !== productId })
  saveCart(cart)
  updateCartCountBadge()
  renderCartDrawer()
  showToast("Removed from cart")
}

function renderCartDrawer() {
  const cart = getCart()
  const cartItems = document.getElementById("cartItems")
  const cartSummary = document.getElementById("cartSummary")
  const cartTotal = document.getElementById("cartTotal")

  const totalItems = cart.reduce(function (sum, item) { return sum + item.quantity }, 0)
  const totalPrice = cart.reduce(function (sum, item) { return sum + item.price * item.quantity }, 0)

  cartCountBadge.textContent = totalItems
  cartSummary.textContent = totalItems + " item" + (totalItems !== 1 ? "s" : "")
  cartTotal.textContent = "₹" + totalPrice.toLocaleString("en-IN")

  // Update the discount and total amounts shown in the cart summary
  refreshCartTotals(totalPrice)
  updateSelectCouponAvailability(cart.length > 0)

  if (!cart.length) {
    cartItems.innerHTML =
      '<div class="flex h-full items-center justify-center text-center">' +
      '  <p class="text-sm text-gray-400">Your cart is empty</p>' +
      '</div>'
    const payBtn = document.getElementById("payBtn")
    if (payBtn) { payBtn.disabled = true; payBtn.classList.add("opacity-50", "cursor-not-allowed") }
    return
  }

  const payBtn = document.getElementById("payBtn")
  if (payBtn) { payBtn.disabled = false; payBtn.classList.remove("opacity-50", "cursor-not-allowed") }

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
    )
  }).join("")
}

function openCart() {
  document.getElementById("cartDrawer").classList.remove("translate-x-full")
  document.getElementById("cartBackdrop").classList.remove("hidden")
  renderCartDrawer()
}

function closeCart() {
  document.getElementById("cartDrawer").classList.add("translate-x-full")
  document.getElementById("cartBackdrop").classList.add("hidden")
  resetCouponState()
  const paySuccess = document.getElementById("paySuccess")
  const payBtn = document.getElementById("payBtn")
  if (paySuccess) paySuccess.classList.add("hidden")
  if (payBtn) payBtn.classList.remove("hidden")
}

function setupCart() {
  document.getElementById("cartIconBtn").addEventListener("click", function () {
    openCart()
  })
  document.getElementById("closeCart").addEventListener("click", closeCart)
  document.getElementById("cartBackdrop").addEventListener("click", closeCart)
}

function showToast(message) {
  const toast = document.getElementById("toast")
  if (!toast) return
  toast.textContent = message
  toast.classList.remove("opacity-0")
  setTimeout(function () { toast.classList.add("opacity-0") }, 2000)
}

// Cart sidebar: coupon selection and payment handling
let appliedCoupon = null // Shape: { code: string, discountAmount: number }

function refreshCartTotals(subtotal) {
  const finalTotalEl = document.getElementById("cartFinalTotal")
  const discountRow = document.getElementById("discountRow")
  const discountAmt = document.getElementById("discountAmt")
  const couponLabel = document.getElementById("couponLabel")
  if (!finalTotalEl) return

  if (appliedCoupon) {
    const discount = appliedCoupon.discountAmount
    const final = Math.max(0, subtotal - discount)
    discountRow.classList.remove("hidden")
    couponLabel.textContent = appliedCoupon.code
    discountAmt.textContent = "-₹" + discount.toLocaleString("en-IN")
    finalTotalEl.textContent = "₹" + final.toLocaleString("en-IN")
  } else {
    discountRow.classList.add("hidden")
    finalTotalEl.textContent = "₹" + subtotal.toLocaleString("en-IN")
  }
}

// Enables the "Select Coupon" button only when the cart has items
function updateSelectCouponAvailability(hasItems) {
  const selectCouponBtn = document.getElementById("selectCouponBtn")
  if (!selectCouponBtn) return
  selectCouponBtn.disabled = !hasItems
  selectCouponBtn.classList.toggle("opacity-50", !hasItems)
  selectCouponBtn.classList.toggle("cursor-not-allowed", !hasItems)
}

// Switches the UI between the "Select Coupon" button and the applied-coupon chip
function updateCouponRowUI() {
  const selectRow = document.getElementById("couponSelectRow")
  const appliedRow = document.getElementById("appliedCouponRow")
  if (!selectRow || !appliedRow) return

  if (appliedCoupon) {
    selectRow.classList.add("hidden")
    appliedRow.classList.remove("hidden")
    appliedRow.classList.add("flex")
    document.getElementById("appliedCouponCode").textContent = appliedCoupon.code
    document.getElementById("appliedCouponSavings").textContent =
      "You saved ₹" + appliedCoupon.discountAmount.toLocaleString("en-IN")
  } else {
    appliedRow.classList.add("hidden")
    appliedRow.classList.remove("flex")
    selectRow.classList.remove("hidden")
  }
}

function showCouponMsg(text, isError) {
  const couponMsg = document.getElementById("couponMsg")
  if (!couponMsg) return
  couponMsg.textContent = text
  couponMsg.className = "text-xs " + (isError ? "text-red-500" : "text-green-600")
  couponMsg.classList.remove("hidden")
}

function resetCouponState() {
  appliedCoupon = null
  const couponMsg = document.getElementById("couponMsg")
  if (couponMsg) { couponMsg.textContent = ""; couponMsg.classList.add("hidden") }
  updateCouponRowUI()
}

// Formats a coupon's discount as a human-readable string
function describeCouponDiscount(coupon) {
  if (coupon.discountType === "percentage") {
    let text = coupon.discountValue + "% off"
    if (coupon.maxDiscountAmount !== null && coupon.maxDiscountAmount !== undefined) {
      text += " (up to ₹" + coupon.maxDiscountAmount.toLocaleString("en-IN") + ")"
    }
    return text
  }
  return "₹" + coupon.discountValue.toLocaleString("en-IN") + " off"
}

function formatExpiry(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function openCouponModal() {
  document.getElementById("couponModalBackdrop").classList.remove("hidden")
  document.getElementById("couponModalBackdrop").classList.add("flex")
  loadCouponList()
}

function closeCouponModal() {
  document.getElementById("couponModalBackdrop").classList.add("hidden")
  document.getElementById("couponModalBackdrop").classList.remove("flex")
}

async function loadCouponList() {
  const container = document.getElementById("couponListContainer")
  container.innerHTML = '<p class="text-sm text-gray-400">Loading coupons...</p>'

  const cart = getCart()
  const subtotal = cart.reduce(function (sum, item) { return sum + item.price * item.quantity }, 0)

  try {
    const res = await fetch("/api/coupons")
    const coupons = await res.json()
    const now = new Date()

    const usable = coupons.filter(function (c) {
      const withinUsageLimit = c.usageLimit === null || c.usageLimit === undefined || c.usedCount < c.usageLimit
      return c.status === "active" && new Date(c.expiryDate) >= now && withinUsageLimit
    })

    if (!usable.length) {
      container.innerHTML = '<p class="text-sm text-gray-400">No coupons available right now.</p>'
      return
    }

    container.innerHTML = usable.map(function (coupon) {
      const eligible = subtotal >= coupon.minPurchaseAmount
      const isApplied = appliedCoupon && appliedCoupon.code === coupon.code
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
      )
    }).join("")

    container.querySelectorAll(".applyCouponOptionBtn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyCouponByCode(btn.getAttribute("data-code"))
      })
    })
  } catch (err) {
    container.innerHTML = '<p class="text-sm text-red-500">Could not load coupons. Try again.</p>'
  }
}

async function applyCouponByCode(code) {
  const cart = getCart()
  const subtotal = cart.reduce(function (sum, item) { return sum + item.price * item.quantity }, 0)

  try {
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, orderAmount: subtotal })
    })
    const data = await res.json()
    if (!res.ok || !data.valid) {
      showCouponMsg(data.reason || "Invalid coupon.", true)
      return
    }
    // Only one coupon can be applied at a time — this replaces any previous selection
    appliedCoupon = { code: code.toUpperCase(), discountAmount: data.discountAmount }
    showCouponMsg("Coupon applied! You save ₹" + data.discountAmount.toLocaleString("en-IN"), false)
    updateCouponRowUI()
    refreshCartTotals(subtotal)
    closeCouponModal()
  } catch (err) {
    showCouponMsg("Could not validate coupon. Try again.", true)
  }
}

function setupCartSidebarActions() {
  document.getElementById("selectCouponBtn").addEventListener("click", openCouponModal)
  document.getElementById("changeCouponBtn").addEventListener("click", openCouponModal)
  document.getElementById("closeCouponModal").addEventListener("click", closeCouponModal)
  document.getElementById("couponModalBackdrop").addEventListener("click", function (e) {
    if (e.target === this) closeCouponModal()
  })

  document.getElementById("removeCouponBtn").addEventListener("click", function () {
    const cart = getCart()
    const subtotal = cart.reduce(function (sum, item) { return sum + item.price * item.quantity }, 0)
    resetCouponState()
    refreshCartTotals(subtotal)
  })

  document.getElementById("payBtn").addEventListener("click", function () {
    const cart = getCart()
    if (!cart.length) {
      showToast("Your cart is empty.")
      return
    }

    const subtotal = cart.reduce(function (sum, item) { return sum + item.price * item.quantity }, 0)
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0
    const finalAmount = Math.max(0, subtotal - discount)

    saveCart([])
    updateCartCountBadge()
    resetCouponState()
    renderCartDrawer()

    const paySuccess = document.getElementById("paySuccess")
    paySuccess.textContent = "The amount of ₹" + finalAmount.toLocaleString("en-IN") + " paid successfully."
    paySuccess.classList.remove("hidden")
    document.getElementById("payBtn").classList.add("hidden")

    // Auto-hide success and reset after 4 seconds
    setTimeout(function () {
      paySuccess.classList.add("hidden")
      document.getElementById("payBtn").classList.remove("hidden")
      closeCart()
    }, 4000)
  })
}

function setupPriceRangeFromProducts() {
  if (allProducts.length === 0) return

  const prices = allProducts.map(function (product) {
    return getEffectivePrice(product)
  })
  const highestPrice = Math.max.apply(null, prices)

  // Round up to the nearest ₹500
  const roundedMax = Math.ceil(highestPrice / 500) * 500

  maxPriceInput.max = roundedMax
  maxPriceInput.value = roundedMax
  updateMaxPriceLabel()
}

async function loadShopData() {
  try {
    const [categoriesRes, productsRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/products")
    ]);

    if (!categoriesRes.ok || !productsRes.ok) {
      throw new Error("Server returned an error")
    }

    allCategories = await categoriesRes.json()
    allProducts = await productsRes.json()

    loadingMsg.classList.add("hidden")
    setupPriceRangeFromProducts()
    renderCategoryFilters()
    renderBrandFilters()
    applyFilters()
  } catch (err) {
    console.log("Error loading shop data:", err)
    loadingMsg.classList.add("hidden")
    errorMsg.textContent = "Could not load products. Is the server running?"
    errorMsg.classList.remove("hidden")
  }
}

function isDesktopFiltersLive() {
  return window.matchMedia("(min-width: 768px)").matches
}

function handleFilterCheckboxChange() {
  // On mobile, filters only apply when the "Apply Filters" button is clicked.
  // On desktop (md and up), the sidebar filters keep applying live, unchanged.
  if (isDesktopFiltersLive()) {
    applyFilters()
  }
}

function renderCategoryFilters() {
  categoryFiltersBox.innerHTML = ""
  allCategories.forEach(function (category) {
    const label = document.createElement("label")
    label.className = "flex items-center gap-2 cursor-pointer"
    label.innerHTML =
      '<input type="checkbox" class="categoryCheckbox" value="' + category.name + '" /> ' +
      '<span>' + category.name + '</span>'
    label.querySelector("input").addEventListener("change", handleFilterCheckboxChange)
    categoryFiltersBox.appendChild(label)
  })
}

function renderBrandFilters() {
  const brands = []
  allProducts.forEach(function (product) {
    if (product.brand && brands.indexOf(product.brand) === -1) {
      brands.push(product.brand)
    }
  })

  brandFiltersBox.innerHTML = "";
  brands.forEach(function (brand) {
    const label = document.createElement("label")
    label.className = "flex items-center gap-2 cursor-pointer"
    label.innerHTML =
      '<input type="checkbox" class="brandCheckbox" value="' + brand + '" /> ' +
      '<span>' + brand + '</span>'
    label.querySelector("input").addEventListener("change", handleFilterCheckboxChange)
    brandFiltersBox.appendChild(label)
  })
}

function getCheckedValues(className) {
  const checked = document.querySelectorAll("." + className + ":checked")
  return Array.from(checked).map(function (box) {
    return box.value
  })
}

function updateMaxPriceLabel() {
  maxPriceValueLabel.textContent = "₹" + Number(maxPriceInput.value).toLocaleString("en-IN")
}

function applyFilters() {
  updateMaxPriceLabel()

  const selectedCategories = getCheckedValues("categoryCheckbox")
  const selectedBrands = getCheckedValues("brandCheckbox")
  const maxPrice = Number(maxPriceInput.value)
  const searchTerm = searchInput.value.trim().toLowerCase()
  const sortValue = sortSelect.value

  let result = allProducts.filter(function (product) {
    const effectivePrice = getEffectivePrice(product)

    if (selectedCategories.length > 0 && selectedCategories.indexOf(product.category) === -1) {
      return false
    }
    if (selectedBrands.length > 0 && selectedBrands.indexOf(product.brand) === -1) {
      return false
    }
    if (effectivePrice > maxPrice) {
      return false
    }
    if (searchTerm && product.name.toLowerCase().indexOf(searchTerm) === -1) {
      return false
    }
    return true
  })

  if (sortValue === "price_asc") {
    result.sort(function (a, b) { return getEffectivePrice(a) - getEffectivePrice(b) })
  } else if (sortValue === "price_desc") {
    result.sort(function (a, b) { return getEffectivePrice(b) - getEffectivePrice(a) })
  } else if (sortValue === "newest") {
    result.sort(function (a, b) { return (a._id < b._id ? 1 : -1) })
  }

  currentFilteredProducts = result
  currentPage = 1
  renderProducts(currentFilteredProducts)
}

function renderProducts(products) {
  productsGrid.innerHTML = ""
  resultsCount.textContent = products.length + " product" + (products.length === 1 ? "" : "s") + " found"

  if (products.length === 0) {
    noResultsMsg.classList.remove("hidden")
    paginationControls.innerHTML = ""
    return;
  }
  noResultsMsg.classList.add("hidden")

  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE))
  if (currentPage > totalPages) currentPage = totalPages
  if (currentPage < 1) currentPage = 1

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const pageProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)

  pageProducts.forEach(function (product) {
    const card = document.createElement("div")
    card.className = "bg-white border border-gray-200 rounded-lg p-4 flex flex-col transition duration-200 hover:shadow-lg hover:border-purple-300 hover:-translate-y-1"

    const showDealPrice = product.isDeal && product.dealPrice
    const tileStyle = getCategoryTileStyle(product.category)
    const { rating, reviewCount } = getProductRating(product)
    const hasImage = !!product.image

    const imageTileHtml = hasImage
      ? '<div class="h-28 bg-gray-50 rounded-md mb-3 overflow-hidden flex items-center justify-center">' +
        '  <img src="' + product.image + '" alt="' + product.name + '" class="productImg w-full h-full object-contain" />' +
        '</div>'
      : '<div class="h-28 ' + tileStyle.bg + ' border-2 border-dashed border-gray-300 rounded-md mb-3 flex items-center justify-center text-center px-2">' +
        '  <span class="text-xs text-gray-400">Product image<br/>placeholder</span>' +
        '</div>'

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
        ? '<span class="font-bold text-gray-800 leading-tight">₹' + product.dealPrice.toLocaleString() + '</span>' +
          '<span class="text-xs text-gray-400 line-through leading-tight">₹' + product.price.toLocaleString() + '</span>'
        : '<span class="font-bold text-gray-800 leading-tight">₹' + product.price.toLocaleString() + '</span>') +
      '  </div>' +
      '  <button class="addToCartBtn w-7 h-7 flex items-center justify-center shrink-0 bg-purple-600 text-white text-sm font-bold rounded-full hover:bg-purple-700" aria-label="Add to cart">' +
      '    +' +
      '  </button>' +
      '</div>'

    if (hasImage) {
      const imgEl = card.querySelector(".productImg")
      imgEl.addEventListener("error", function () {
        const tile = imgEl.parentElement
        tile.innerHTML = '<span class="text-xs text-gray-400 text-center px-2">Image not found</span>'
        tile.classList.remove("bg-gray-50")
        tile.classList.add(tileStyle.bg, "border-2", "border-dashed", "border-gray-300")
      })
    }

    const addBtn = card.querySelector(".addToCartBtn")
    addBtn.addEventListener("click", function () {
      addToCart(product)
      addBtn.textContent = "✓"
      setTimeout(function () {
        addBtn.textContent = "+"
      }, 1000)
    })

    productsGrid.appendChild(card)
  })

  renderPaginationControls(totalPages)
}

// Builds the page-number sequence with ellipses, e.g. 1 … 4 5 6 … 12
function buildPageNumberSequence(current, total) {
  const pages = []
  const addRange = function (start, end) {
    for (let i = start; i <= end; i++) pages.push(i)
  }

  if (total <= 7) {
    addRange(1, total)
    return pages
  }

  pages.push(1)
  const rangeStart = Math.max(2, current - 1)
  const rangeEnd = Math.min(total - 1, current + 1)

  if (rangeStart > 2) pages.push("...")
  addRange(rangeStart, rangeEnd)
  if (rangeEnd < total - 1) pages.push("...")
  pages.push(total)

  return pages
}

function goToPage(page) {
  currentPage = page
  renderProducts(currentFilteredProducts)
  productsGrid.scrollIntoView({ behavior: "smooth", block: "start" })
}

function renderPaginationControls(totalPages) {
  if (totalPages <= 1) {
    paginationControls.innerHTML = ""
    return
  }

  const navBtnBase = "min-w-[2.25rem] h-9 px-2 rounded-md text-sm font-medium transition flex items-center justify-center"
  const inactiveBtn = navBtnBase + " bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
  const activeBtn = navBtnBase + " bg-purple-600 text-white border border-purple-600"
  const disabledBtn = navBtnBase + " bg-gray-50 border border-gray-200 text-gray-300 cursor-not-allowed"

  let html = '<div class="flex flex-wrap items-center justify-center gap-1.5">'

  html += '<button type="button" data-page="' + (currentPage - 1) + '" ' +
    (currentPage === 1 ? 'disabled' : '') +
    ' class="pageNavBtn ' + (currentPage === 1 ? disabledBtn : inactiveBtn) + '" aria-label="Previous page">‹</button>'

  // Page number buttons — hidden on the smallest screens to keep the bar compact
  const sequence = buildPageNumberSequence(currentPage, totalPages)
  html += '<span class="hidden sm:flex items-center gap-1.5 flex-wrap justify-center">'
  sequence.forEach(function (item) {
    if (item === "...") {
      html += '<span class="px-1 text-sm text-gray-400 select-none">…</span>'
    } else {
      html += '<button type="button" data-page="' + item + '" class="pageNavBtn ' +
        (item === currentPage ? activeBtn : inactiveBtn) + '">' + item + '</button>'
    }
  })
  html += '</span>'

  // Compact "X / Y" indicator shown only on the smallest screens
  html += '<span class="sm:hidden text-sm text-gray-600 px-2 select-none">' + currentPage + ' / ' + totalPages + '</span>'

  html += '<button type="button" data-page="' + (currentPage + 1) + '" ' +
    (currentPage === totalPages ? 'disabled' : '') +
    ' class="pageNavBtn ' + (currentPage === totalPages ? disabledBtn : inactiveBtn) + '" aria-label="Next page">›</button>'

  html += '</div>'

  paginationControls.innerHTML = html

  paginationControls.querySelectorAll(".pageNavBtn").forEach(function (btn) {
    if (btn.disabled) return
    btn.addEventListener("click", function () {
      goToPage(Number(btn.getAttribute("data-page")))
    })
  })
}

searchInput.addEventListener("input", applyFilters)
sortSelect.addEventListener("change", applyFilters)
maxPriceInput.addEventListener("input", function () {
  updateMaxPriceLabel()
  if (isDesktopFiltersLive()) {
    applyFilters()
  }
})

clearFiltersBtn.addEventListener("click", function () {
  document.querySelectorAll(".categoryCheckbox, .brandCheckbox").forEach(function (box) {
    box.checked = false
  })
  maxPriceInput.value = maxPriceInput.max
  searchInput.value = "";
  sortSelect.value = "featured"
  applyFilters()
});

updateCartCountBadge()
setupCart()
setupCartSidebarActions()
loadShopData()

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("couponx_user");
    window.location.href = "login.html";
  });
}

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
