const productsGrid = document.getElementById("productsGrid")
const resultsCount = document.getElementById("resultsCount")
const loadingMsg = document.getElementById("loadingMsg")
const errorMsg = document.getElementById("errorMsg")
const noResultsMsg = document.getElementById("noResultsMsg")
const paginationControls = document.getElementById("paginationControls")

let allProducts = []

// PAGINATION STATE (deals products grid)
const PRODUCTS_PER_PAGE = 12
let currentPage = 1

function getEffectivePrice(product) {
  return product.isDeal && product.dealPrice ? product.dealPrice : product.price
}

// LOAD DATA (runs once) — merges featured and deal products, removing duplicates
async function loadDealsData() {
  try {
    const [featuredRes, dealsRes] = await Promise.all([
      fetch("/api/products/featured"),
      fetch("/api/products/deals")
    ]);

    if (!featuredRes.ok || !dealsRes.ok) {
      throw new Error("Server returned an error")
    }

    const featuredProducts = await featuredRes.json()
    const dealProducts = await dealsRes.json()

    const merged = []
    const seenIds = {}

    // Deal products first so on-sale items lead the listing
    dealProducts.concat(featuredProducts).forEach(function (product) {
      if (!seenIds[product._id]) {
        seenIds[product._id] = true
        merged.push(product)
      }
    })

    allProducts = merged

    loadingMsg.classList.add("hidden")
    currentPage = 1
    renderProducts(allProducts)
  } catch (err) {
    console.log("Error loading deals data:", err)
    loadingMsg.classList.add("hidden")
    errorMsg.textContent = "Could not load products. Is the server running?"
    errorMsg.classList.remove("hidden")
  }
}

// RENDER PRODUCT GRID (with pagination)
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
    const card = buildProductCard(product, { showDealBadge: true })
    productsGrid.appendChild(card)
  })

  renderPaginationControls("paginationControls", currentPage, totalPages, goToPage)
}

function goToPage(page) {
  currentPage = page
  renderProducts(allProducts)
  productsGrid.scrollIntoView({ behavior: "smooth", block: "start" })
}

// INIT
updateCartCountBadge()
setupCart()
setupCartSidebarActions()
loadDealsData()
