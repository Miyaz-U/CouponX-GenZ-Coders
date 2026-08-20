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

  if (!cart.length) {
    cartItems.innerHTML =
      '<div class="flex h-full items-center justify-center text-center">' +
      '  <p class="text-sm text-gray-400">Your cart is empty</p>' +
      '</div>';
    return;
  }

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
}

function setupCart() {
  document.querySelector("header a[href='cart.html']").addEventListener("click", function (e) {
    e.preventDefault();
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
      '<h3 class="font-semibold text-gray-800 text-sm mb-1">' + product.name + '</h3>' +
      '<p class="text-xs text-gray-500 mb-2">' + product.category + '</p>' +
      '<div class="mt-auto flex items-center justify-between">' +
      '  <div>' +
      (showDealPrice
        ? '<span class="font-bold text-gray-800">₹' + product.dealPrice.toLocaleString("en-IN") + '</span> ' +
          '<span class="text-xs text-gray-400 line-through">₹' + product.price.toLocaleString("en-IN") + '</span>'
        : '<span class="font-bold text-gray-800">₹' + product.price.toLocaleString("en-IN") + '</span>') +
      '  </div>' +
      '  <button class="addToCartBtn w-7 h-7 flex items-center justify-center bg-purple-600 text-white text-sm font-bold rounded-full hover:bg-purple-700" aria-label="Add to cart">+</button>' +
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

    const grid = document.getElementById("categoryGrid");
    grid.innerHTML = categories.map(function (category) {
      const tileStyle = getCategoryTileStyle(category.name);
      const hasImage = !!category.image;
      const iconHtml = hasImage
        ? '<img src="' + category.image + '" alt="' + category.name + '" class="categoryTileImg w-full h-full object-cover rounded-full" />'
        : '<span class="text-sm">🏷️</span>';
      return (
        '<a href="categories.html?category=' + encodeURIComponent(category.name) + '" ' +
        'class="flex flex-col items-center gap-1 rounded-xl bg-white border border-gray-200 p-3 text-center hover:shadow-md hover:border-purple-300 transition">' +
        '  <div class="h-10 w-10 rounded-full ' + tileStyle.bg + ' flex items-center justify-center overflow-hidden">' +
        '    ' + iconHtml +
        '  </div>' +
        '  <p class="text-xs font-semibold text-gray-700 leading-tight">' + category.name + '</p>' +
        '</a>'
      );
    }).join("");

    grid.querySelectorAll(".categoryTileImg").forEach(function (img) {
      img.addEventListener("error", function () {
        img.outerHTML = '<span class="text-sm">🏷️</span>';
      });
    });
  } catch (err) {
    console.log("Error loading categories:", err);
  }
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
  await loadCategories();
  await loadFeaturedProducts();
  await loadDeals();
});
