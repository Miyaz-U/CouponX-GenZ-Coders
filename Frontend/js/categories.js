// ELEMENTS
const categoriesGrid = document.getElementById("categoriesGrid");
const loadingMsg = document.getElementById("loadingMsg");
const errorMsg = document.getElementById("errorMsg");
const cartCountBadge = document.getElementById("cartCount");
const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");

const categoriesView = document.getElementById("categoriesView");
const categoryProductsView = document.getElementById("categoryProductsView");
const categoryProductsTitle = document.getElementById("categoryProductsTitle");
const categoryProductsSubtitle = document.getElementById("categoryProductsSubtitle");
const categoryProductsGrid = document.getElementById("categoryProductsGrid");
const backToCategoriesBtn = document.getElementById("backToCategoriesBtn");

const categoryIcons = {
  Laptops: "💻",
  Accessories: "🖱️",
  Mobiles: "📱",
  Audio: "🎧",
  Wearables: "⌚",
  Gaming: "🎮"
};

let allCategories = [];
let allProducts = [];

// CART COUNT
function updateCartCountBadge() {
  const cart = JSON.parse(localStorage.getItem("couponXCart")) || [];
  const totalItems = cart.reduce(function (sum, item) {
    return sum + item.quantity;
  }, 0);
  cartCountBadge.textContent = totalItems;
}

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("couponXCart")) || [];

  const existing = cart.find(function (item) {
    return item.id === product._id;
  });

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

  localStorage.setItem("couponXCart", JSON.stringify(cart));
  updateCartCountBadge();
}

// LOAD CATEGORIES + PRODUCTS (once)
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

    const icon = categoryIcons[category.name] || "🛍️";

    const card = document.createElement("button");
    card.type = "button";
    card.className =
      "flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-purple-300 transition text-left w-full";

    card.innerHTML =
      '<div class="text-3xl">' + icon + '</div>' +
      '<div>' +
      '  <h3 class="font-semibold text-gray-800">' + category.name + '</h3>' +
      '  <p class="text-sm text-gray-500">' + productCount + ' products</p>' +
      '</div>';

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
    card.className = "bg-white border border-gray-200 rounded-lg p-4 flex flex-col";

    const showDealPrice = product.isDeal && product.dealPrice;

    card.innerHTML =
      '<div class="h-28 bg-gray-100 rounded-md flex items-center justify-center text-3xl mb-3">🛍️</div>' +
      '<h3 class="font-semibold text-gray-800 text-sm mb-1">' + product.name + '</h3>' +
      '<p class="text-xs text-gray-500 mb-2">' + product.brand + '</p>' +
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
      '</div>';

    const addBtn = card.querySelector(".addToCartBtn");
    addBtn.addEventListener("click", function () {
      addToCart(product);
      addBtn.textContent = "Added ✓";
      setTimeout(function () {
        addBtn.textContent = "Add";
      }, 1000);
    });

    categoryProductsGrid.appendChild(card);
  });
}

// INIT
updateCartCountBadge();
loadCategories();