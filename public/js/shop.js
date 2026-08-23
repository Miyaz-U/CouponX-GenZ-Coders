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
const paginationControls = document.getElementById("paginationControls")

let allCategories = []
let allProducts = []

// Pagination state for the products grid
const PRODUCTS_PER_PAGE = 12
let currentFilteredProducts = []
let currentPage = 1

function getEffectivePrice(product) {
  return product.isDeal && product.dealPrice ? product.dealPrice : product.price
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
    const card = buildProductCard(product)
    productsGrid.appendChild(card)
  })

  renderPaginationControls("paginationControls", currentPage, totalPages, goToPage)
}

function goToPage(page) {
  currentPage = page
  renderProducts(currentFilteredProducts)
  productsGrid.scrollIntoView({ behavior: "smooth", block: "start" })
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
