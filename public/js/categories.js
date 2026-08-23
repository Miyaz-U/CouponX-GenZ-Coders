// ELEMENTS
const categoriesGrid = document.getElementById("categoriesGrid");
const loadingMsg = document.getElementById("loadingMsg");
const errorMsg = document.getElementById("errorMsg");
const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");

const categoriesView = document.getElementById("categoriesView");
const categoryProductsView = document.getElementById("categoryProductsView");
const categoryProductsTitle = document.getElementById("categoryProductsTitle");
const categoryProductsSubtitle = document.getElementById("categoryProductsSubtitle");
const categoryProductsGrid = document.getElementById("categoryProductsGrid");
const backToCategoriesBtn = document.getElementById("backToCategoriesBtn");

// CATEGORY IMAGES
const categoryImages = {
  Laptops: "images/categories/Laptops.jpeg",
  Accessories: "images/categories/Accessories.jpeg",
  Mobiles: "images/categories/Mobiles.jpeg",
  Audio: "images/categories/Audio.jpeg",
  Wearables: "images/categories/Wearables.jpeg",
  Gaming: "images/categories/Gaming.jpeg",
  Cameras: "images/categories/Cameras.jpeg",
  "Home Appliances": "images/categories/HomeAppliances.jpeg",
  Tablets: "images/categories/Tablets.jpeg",
  Networking: "images/categories/Networking.jpeg",
  Storage: "images/categories/Storage.jpeg"
};

let allCategories = [];
let allProducts = [];

// CATEGORY TILE COLORS
const categoryTileStyles = {
  "Laptops": { bg: "bg-purple-100" },
  "Accessories": { bg: "bg-blue-100" },
  "Mobiles": { bg: "bg-slate-100" },
  "Audio": { bg: "bg-pink-100" },
  "Wearables": { bg: "bg-green-100" },
  "Gaming": { bg: "bg-orange-100" }
};
const defaultTileStyle = { bg: "bg-gray-100" };

function getCategoryTileStyle(category) {
  return categoryTileStyles[category] || defaultTileStyle;
}

// Pseudo rating/review-count per product
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100000;
  }
  return Math.abs(hash);
}

function getProductRating(product) {
  const hash = hashString(product._id || product.name);
  const rating = 3.5 + (hash % 15) / 10; // 3.5 - 5.0
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

// LOAD CATEGORIES AND PRODUCTS (runs once on page load)
async function loadCategories() {
  try {
    const [categoriesRes, productsRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/products")
    ]);

    if (!categoriesRes.ok || !productsRes.ok) {
      throw new Error("Server returned an error");
    }

    allCategories = await categoriesRes.json();
    allProducts = await productsRes.json();

    loadingMsg.classList.add("hidden");
    renderCategories();
  } catch (err) {
    console.log("Error loading categories:", err);
    loadingMsg.classList.add("hidden");
    errorMsg.textContent = "Could not load categories. Is the server running?";
    errorMsg.classList.remove("hidden");
  }
}

// RENDER CATEGORY CARDS (View 1)
function renderCategories() {
  categoriesGrid.innerHTML = "";

  if (allCategories.length === 0) {
    categoriesGrid.innerHTML = "<p class='text-gray-500'>No categories found.</p>";
    return;
  }

  allCategories.forEach(function (category) {
    const productCount = allProducts.filter(function (p) {
      return p.category === category.name;
    }).length;

    const imagePath = categoryImages[category.name];
    const tileStyle = getCategoryTileStyle(category.name);

    const imageTileHtml = imagePath
      ? '<div class="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">' +
        '  <img src="' + imagePath + '" alt="' + category.name + '" class="categoryImg w-full h-full object-cover" />' +
        '</div>'
      : '<div class="w-11 h-11 sm:w-14 sm:h-14 shrink-0 ' + tileStyle.bg + ' border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-center px-1">' +
        '  <span class="text-[10px] text-gray-400 leading-tight">Image<br/>placeholder</span>' +
        '</div>';

    const card = document.createElement("button");
    card.type = "button";
    card.className =
      "flex items-center gap-2.5 sm:gap-4 bg-white border border-gray-200 rounded-lg p-3 sm:p-5 hover:shadow-md hover:border-purple-300 transition text-left w-full min-w-0";

    card.innerHTML =
      imageTileHtml +
      '<div class="min-w-0">' +
      '  <h3 class="font-semibold text-gray-800 text-sm sm:text-base truncate">' + category.name + '</h3>' +
      '  <p class="text-xs sm:text-sm text-gray-500">' + productCount + ' products</p>' +
      '</div>';

    if (imagePath) {
      const imgEl = card.querySelector(".categoryImg");
      imgEl.addEventListener("error", function () {
        const tile = imgEl.parentElement;
        tile.className = "w-11 h-11 sm:w-14 sm:h-14 shrink-0 " + tileStyle.bg + " border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-center px-1";
        tile.innerHTML = '<span class="text-[10px] text-gray-400 leading-tight">Image<br/>placeholder</span>';
      });
    }

    card.addEventListener("click", function () {
      showCategoryProducts(category.name);
    });

    categoriesGrid.appendChild(card);
  });
}

// VIEW SWITCHING
function showCategoryProducts(categoryName) {
  const productsInCategory = allProducts.filter(function (p) {
    return p.category === categoryName;
  });

  categoryProductsTitle.textContent = categoryName;
  categoryProductsSubtitle.textContent = productsInCategory.length + " products found";
  breadcrumbCurrent.textContent = categoryName;

  renderCategoryProducts(productsInCategory);

  categoriesView.classList.add("hidden");
  categoryProductsView.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showCategoriesGrid() {
  categoryProductsView.classList.add("hidden");
  categoriesView.classList.remove("hidden");
  breadcrumbCurrent.textContent = "Categories";
}

backToCategoriesBtn.addEventListener("click", showCategoriesGrid);

// RENDER PRODUCT CARDS (View 2)
function renderCategoryProducts(products) {
  categoryProductsGrid.innerHTML = "";

  if (products.length === 0) {
    categoryProductsGrid.innerHTML = "<p class='text-gray-500'>No products in this category yet.</p>";
    return;
  }

  products.forEach(function (product) {
    const card = document.createElement("div");
    card.className = "bg-white border border-gray-200 rounded-lg p-2 sm:p-4 flex flex-col transition duration-200 hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 min-w-0";

    const showDealPrice = product.isDeal && product.dealPrice;
    const tileStyle = getCategoryTileStyle(product.category);
    const { rating, reviewCount } = getProductRating(product);
    const hasImage = !!product.image;

    const imageTileHtml = hasImage
      ? '<div class="h-16 sm:h-28 bg-gray-50 rounded-md mb-2 sm:mb-3 overflow-hidden flex items-center justify-center">' +
        '  <img src="' + product.image + '" alt="' + product.name + '" class="productImg w-full h-full object-contain" />' +
        '</div>'
      : '<div class="h-16 sm:h-28 ' + tileStyle.bg + ' border-2 border-dashed border-gray-300 rounded-md mb-2 sm:mb-3 flex items-center justify-center text-center px-1 sm:px-2">' +
        '  <span class="text-[9px] sm:text-xs text-gray-400 leading-tight">Product image<br/>placeholder</span>' +
        '</div>';

    card.innerHTML =
      imageTileHtml +
      '<div class="flex items-center gap-1 text-[10px] sm:text-xs text-amber-500 mb-1">' +
      '  <span>' + renderStars(rating) + '</span>' +
      '  <span class="text-gray-400">(' + reviewCount + ')</span>' +
      '</div>' +
      '<h3 class="font-semibold text-gray-800 text-xs sm:text-sm mb-1 truncate">' + product.name + '</h3>' +
      '<p class="text-[10px] sm:text-xs text-gray-500 mb-2 truncate">' + product.category + '</p>' +
      '<div class="mt-auto flex items-center justify-between gap-1">' +
      '  <div class="min-w-0 truncate">' +
      (showDealPrice
        ? '<span class="font-bold text-gray-800 text-xs sm:text-base">₹' + product.dealPrice.toLocaleString() + '</span> ' +
          '<span class="text-[10px] sm:text-xs text-gray-400 line-through">₹' + product.price.toLocaleString() + '</span>'
        : '<span class="font-bold text-gray-800 text-xs sm:text-base">₹' + product.price.toLocaleString() + '</span>') +
      '  </div>' +
      '  <button class="addToCartBtn w-6 h-6 sm:w-7 sm:h-7 shrink-0 flex items-center justify-center bg-purple-600 text-white text-sm font-bold rounded-full hover:bg-purple-700" aria-label="Add to cart">' +
      '    +' +
      '  </button>' +
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
      setTimeout(function () {
        addBtn.textContent = "+";
      }, 1000);
    });

    categoryProductsGrid.appendChild(card);
  });
}

// INIT
updateCartCountBadge();
setupCart();
setupCartSidebarActions();
loadCategories().then(function () {
  var params = new URLSearchParams(window.location.search);
  var cat = params.get("category");
  if (cat) {
    showCategoryProducts(cat);
  }
});
