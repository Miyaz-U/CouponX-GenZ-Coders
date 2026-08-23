const API_URL = "/api";

// PRODUCT CARD
function renderProducts(gridId, loadingId, errorId, products) {
  const loadingEl = document.getElementById(loadingId);
  const errorEl = document.getElementById(errorId);
  const grid = document.getElementById(gridId);

  if (loadingEl) loadingEl.classList.add("hidden");
  grid.innerHTML = "";

  if (!products || products.length === 0) {
    if (errorEl) { errorEl.textContent = "No products available."; errorEl.classList.remove("hidden"); }
    return;
  }
  if (errorEl) errorEl.classList.add("hidden");

  products.forEach(function (product) {
    const card = buildProductCard(product, { priceLocale: "en-IN", noImagePlaceholderHtml: "Product image" });
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
const CATEGORY_PRODUCTS_PAGE_SIZE = 8;
let categoryProductsAllProducts = [];
let categoryProductsCurrentPage = 1;

function renderCategoryProductsPage() {
  const section = document.getElementById("categoryProducts");
  const totalPages = Math.max(1, Math.ceil(categoryProductsAllProducts.length / CATEGORY_PRODUCTS_PAGE_SIZE));
  if (categoryProductsCurrentPage > totalPages) categoryProductsCurrentPage = totalPages;
  if (categoryProductsCurrentPage < 1) categoryProductsCurrentPage = 1;

  const startIndex = (categoryProductsCurrentPage - 1) * CATEGORY_PRODUCTS_PAGE_SIZE;
  const pageProducts = categoryProductsAllProducts.slice(startIndex, startIndex + CATEGORY_PRODUCTS_PAGE_SIZE);

  renderProducts("categoryProductsGrid", "categoryProductsLoading", "categoryProductsError", pageProducts);
  renderPaginationControls("categoryProductsPaginationControls", categoryProductsCurrentPage, totalPages, function (page) {
    // The section's height may still be mid-transition from the reveal
    // animation; release any fixed height/overflow so it can resize
    // naturally to fit the new page of cards without clipping.
    section.style.height = "";
    section.style.overflow = "";
    categoryProductsCurrentPage = page;
    renderCategoryProductsPage();
  });
}

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
  const categoryPaginationEl = document.getElementById("categoryProductsPaginationControls");
  if (categoryPaginationEl) categoryPaginationEl.innerHTML = "";

  try {
    const response = await fetch(API_URL + "/products?category=" + encodeURIComponent(categoryName));
    if (!response.ok) throw new Error("Failed");
    const products = await response.json();
    if (thisRequest !== categoryRequestToken) return;
    subtitle.textContent = products.length + " product" + (products.length !== 1 ? "s" : "") + " found";
    categoryProductsAllProducts = products;
    categoryProductsCurrentPage = 1;
    renderCategoryProductsPage();
  } catch (err) {
    console.log("Error loading category products:", err);
    if (thisRequest !== categoryRequestToken) return;
    loading.classList.add("hidden");
    errorEl.textContent = "Could not load products for this category. Is the server running?";
    errorEl.classList.remove("hidden");
    const paginationEl = document.getElementById("categoryProductsPaginationControls");
    if (paginationEl) paginationEl.innerHTML = "";
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
const FEATURED_PAGE_SIZE = 4
let featuredAllProducts = []
let featuredCurrentPage = 1

function renderFeaturedPage() {
  const totalPages = Math.max(1, Math.ceil(featuredAllProducts.length / FEATURED_PAGE_SIZE))
  if (featuredCurrentPage > totalPages) featuredCurrentPage = totalPages
  if (featuredCurrentPage < 1) featuredCurrentPage = 1

  const startIndex = (featuredCurrentPage - 1) * FEATURED_PAGE_SIZE
  const pageProducts = featuredAllProducts.slice(startIndex, startIndex + FEATURED_PAGE_SIZE)

  renderProducts("featuredGrid", "featuredLoading", "featuredError", pageProducts)
  renderPaginationControls("featuredPaginationControls", featuredCurrentPage, totalPages, function (page) {
    featuredCurrentPage = page
    renderFeaturedPage()
    document.getElementById("featured")
  })
}

async function loadFeaturedProducts() {
  try {
    const response = await fetch(API_URL + "/products/featured");
    if (!response.ok) throw new Error("Failed");
    const products = await response.json();
    featuredAllProducts = products;
    featuredCurrentPage = 1;
    renderFeaturedPage();
  } catch (err) {
    console.log("Error loading featured:", err);
    const el = document.getElementById("featuredError");
    const loading = document.getElementById("featuredLoading");
    if (loading) loading.classList.add("hidden");
    if (el) { el.textContent = "Could not load featured products. Is the server running?"; el.classList.remove("hidden"); }
    const paginationEl = document.getElementById("featuredPaginationControls");
    if (paginationEl) paginationEl.innerHTML = "";
  }
}

// DEALS
const DEALS_PAGE_SIZE = 8
let dealsAllProducts = []
let dealsCurrentPage = 1

function renderDealsPage() {
  const totalPages = Math.max(1, Math.ceil(dealsAllProducts.length / DEALS_PAGE_SIZE))
  if (dealsCurrentPage > totalPages) dealsCurrentPage = totalPages
  if (dealsCurrentPage < 1) dealsCurrentPage = 1

  const startIndex = (dealsCurrentPage - 1) * DEALS_PAGE_SIZE
  const pageProducts = dealsAllProducts.slice(startIndex, startIndex + DEALS_PAGE_SIZE)

  renderProducts("dealsGrid", "dealsLoading", "dealsError", pageProducts)
  renderPaginationControls("dealsPaginationControls", dealsCurrentPage, totalPages, function (page) {
    dealsCurrentPage = page
    renderDealsPage()
  })
}

async function loadDeals() {
  try {
    const response = await fetch(API_URL + "/products/deals");
    if (!response.ok) throw new Error("Failed");
    const products = await response.json();
    dealsAllProducts = products;
    dealsCurrentPage = 1;
    renderDealsPage();
  } catch (err) {
    console.log("Error loading deals:", err);
    const el = document.getElementById("dealsError");
    const loading = document.getElementById("dealsLoading");
    if (loading) loading.classList.add("hidden");
    if (el) { el.textContent = "Could not load deals. Is the server running?"; el.classList.remove("hidden"); }
    const paginationEl = document.getElementById("dealsPaginationControls");
    if (paginationEl) paginationEl.innerHTML = "";
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

// Initialise sidebar actions after DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  setupCartSidebarActions();
});
