// ELEMENTS
const categoryFiltersBox = document.getElementById("categoryFilters")
const brandFiltersBox = document.getElementById("brandFilters")
const minPriceInput = document.getElementById("minPriceInput")
const maxPriceInput = document.getElementById("maxPriceInput")
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
function applyFilters() {
  const selectedCategories = getCheckedValues("categoryCheckbox")
  const selectedBrands = getCheckedValues("brandCheckbox")
  const minPrice = minPriceInput.value ? Number(minPriceInput.value) : null
  const maxPrice = maxPriceInput.value ? Number(maxPriceInput.value) : null
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
    if (minPrice !== null && effectivePrice < minPrice) {
      return false
    }
    if (maxPrice !== null && effectivePrice > maxPrice) {
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
    card.className = "bg-white border border-gray-200 rounded-lg p-4 flex flex-col"

    const showDealPrice = product.isDeal && product.dealPrice

    card.innerHTML =
      '<div class="h-28 bg-gray-100 rounded-md flex items-center justify-center text-3xl mb-3">🛍️</div>' +
      '<h3 class="font-semibold text-gray-800 text-sm mb-1">' + product.name + '</h3>' +
      '<p class="text-xs text-gray-500 mb-2">' + product.category + '</p>' +
      '<div class="mt-auto flex items-center justify-between">' +
      '  <div>' +
      (showDealPrice
        ? '<span class="font-bold text-gray-800">₹' + product.dealPrice.toLocaleString() + '</span> ' +
          '<span class="text-xs text-gray-400 line-through">₹' + product.price.toLocaleString() + '</span>'
        : '<span class="font-bold text-gray-800">₹' + product.price.toLocaleString() + '</span>') +
      '  </div>' +
      '  <button class="addToCartBtn bg-purple-600 text-white text-xs font-medium rounded-md px-3 py-1.5 hover:bg-purple-700">' +
      '    Add' +
      '  </button>' +
      '</div>'

    const addBtn = card.querySelector(".addToCartBtn")
    addBtn.addEventListener("click", function () {
      addToCart(product)
      addBtn.textContent = "Added ✓"
      setTimeout(function () {
        addBtn.textContent = "Add"
      }, 1000)
    })

    productsGrid.appendChild(card)
  })
}

// EVENTS
searchInput.addEventListener("input", applyFilters)
sortSelect.addEventListener("change", applyFilters)
minPriceInput.addEventListener("input", applyFilters)
maxPriceInput.addEventListener("input", applyFilters)

clearFiltersBtn.addEventListener("click", function () {
  document.querySelectorAll(".categoryCheckbox, .brandCheckbox").forEach(function (box) {
    box.checked = false
  })
  minPriceInput.value = ""
  maxPriceInput.value = ""
  searchInput.value = "";
  sortSelect.value = "featured"
  applyFilters()
});

// INIT
updateCartCountBadge()
loadShopData()