// ELEMENTS
const categoryFiltersBox = document.getElementById("categoryFilters")
const brandFiltersBox = document.getElementById("brandFilters")
const maxPriceInput = document.getElementById("maxPriceInput")
const maxPriceValueLabel = document.getElementById("maxPriceValueLabel")
const searchInput = document.getElementById("searchInput")
const sortSelect = document.getElementById("sortSelect")
const clearFiltersBtn = document.getElementById("clearFiltersBtn")

const productsGrid = document.getElementById("productsGrid")
const resultsCount = document.getElementById("resultsCount")
const loadingMsg = document.getElementById("loadingMsg")
const errorMsg = document.getElementById("errorMsg")
const noResultsMsg = document.getElementById("noResultsMsg")
const cartCountBadge = document.getElementById("cartCount")

let allCategories = []
let allProducts = []

// CART
function updateCartCountBadge() {
  const cart = JSON.parse(localStorage.getItem("couponXCart")) || []
  const totalItems = cart.reduce(function (sum, item) {
    return sum + item.quantity
  }, 0);
  cartCountBadge.textContent = totalItems
}

function getEffectivePrice(product) {
  return product.isDeal && product.dealPrice ? product.dealPrice : product.price
}

// CATEGORY TILE COLORS 
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

// Deterministic pseudo rating/review-count per product
function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100000
  }
  return Math.abs(hash)
}

function getProductRating(product) {
  const hash = hashString(product._id || product.name)
  const rating = 3.5 + (hash % 15) / 10 // 3.5 - 5.0
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
  const cart = JSON.parse(localStorage.getItem("couponXCart")) || []

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

  localStorage.setItem("couponXCart", JSON.stringify(cart))
  updateCartCountBadge()
}

// PRICE SLIDER RANGE
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

// LOAD DATA (once)
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

// BUILD FILTER CHECKBOXES
function renderCategoryFilters() {
  categoryFiltersBox.innerHTML = ""
  allCategories.forEach(function (category) {
    const label = document.createElement("label")
    label.className = "flex items-center gap-2 cursor-pointer"
    label.innerHTML =
      '<input type="checkbox" class="categoryCheckbox" value="' + category.name + '" /> ' +
      '<span>' + category.name + '</span>'
    label.querySelector("input").addEventListener("change", applyFilters)
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
    label.querySelector("input").addEventListener("change", applyFilters)
    brandFiltersBox.appendChild(label)
  })
}

function getCheckedValues(className) {
  const checked = document.querySelectorAll("." + className + ":checked")
  return Array.from(checked).map(function (box) {
    return box.value
  })
}

// FILTER + SORT + RENDER
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

  renderProducts(result)
}

function renderProducts(products) {
  productsGrid.innerHTML = ""
  resultsCount.textContent = products.length + " product" + (products.length === 1 ? "" : "s") + " found"

  if (products.length === 0) {
    noResultsMsg.classList.remove("hidden")
    return;
  }
  noResultsMsg.classList.add("hidden")

  products.forEach(function (product) {
    const card = document.createElement("div")
    card.className = "bg-white border border-gray-200 rounded-lg p-4 flex flex-col transition duration-200 hover:shadow-lg hover:border-purple-300 hover:-translate-y-1"

    const showDealPrice = product.isDeal && product.dealPrice
    const tileStyle = getCategoryTileStyle(product.category)
    const { rating, reviewCount } = getProductRating(product)
    const hasImage = !!product.image

    // Image tile
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
      '<h3 class="font-semibold text-gray-800 text-sm mb-1">' + product.name + '</h3>' +
      '<p class="text-xs text-gray-500 mb-2">' + product.category + '</p>' +
      '<div class="mt-auto flex items-center justify-between">' +
      '  <div>' +
      (showDealPrice
        ? '<span class="font-bold text-gray-800">₹' + product.dealPrice.toLocaleString() + '</span> ' +
          '<span class="text-xs text-gray-400 line-through">₹' + product.price.toLocaleString() + '</span>'
        : '<span class="font-bold text-gray-800">₹' + product.price.toLocaleString() + '</span>') +
      '  </div>' +
      '  <button class="addToCartBtn w-7 h-7 flex items-center justify-center bg-purple-600 text-white text-sm font-bold rounded-full hover:bg-purple-700" aria-label="Add to cart">' +
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
}

// EVENTS
searchInput.addEventListener("input", applyFilters)
sortSelect.addEventListener("change", applyFilters)
maxPriceInput.addEventListener("input", applyFilters)

clearFiltersBtn.addEventListener("click", function () {
  document.querySelectorAll(".categoryCheckbox, .brandCheckbox").forEach(function (box) {
    box.checked = false
  })
  maxPriceInput.value = maxPriceInput.max
  searchInput.value = "";
  sortSelect.value = "featured"
  applyFilters()
});

// INIT
updateCartCountBadge()
loadShopData()